// E-tickets for buyers: campus/SRC/association/private events, intercity
// bus seats, and bus rentals. Seats and ticket stock are reserved atomically;
// reservations that are never paid are released after RESERVATION_MINUTES.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { pageQuerySchema, paging } from "../../lib/query.js";
import { optionalText } from "../../lib/fields.js";
import { AppError } from "../../middleware/error-handler.js";
import { ticketCode } from "../../lib/codes.js";
import { createPayment, paystackEnabled } from "../../lib/payments.js";
import { money } from "../../lib/search.js";
import { notify } from "../../lib/notify.js";

const RESERVATION_MINUTES = 30;

const buySchema = z.object({
  items: z.array(z.object({ typeId: z.number().int().positive(), quantity: z.number().int().min(1).max(50) })).min(1).max(10),
  holderName: z.string().trim().min(2).max(150),
  holderPhone: z.string().trim().min(9).max(30),
});

const bookSchema = z.object({
  seats: z.array(z.number().int().min(1).max(100)).min(1).max(10),
  holderName: z.string().trim().min(2).max(150),
  holderPhone: z.string().trim().min(9).max(30),
});

const rentalRequestSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickupLocation: z.string().trim().min(2).max(200),
  destination: z.string().trim().min(2).max(200),
  passengers: z.number().int().min(1).max(200),
  purpose: optionalText(500),
  contactPhone: z.string().trim().min(9).max(30),
});

// Online payments only: unpaid reservations past the window give their
// seats/tickets back. (Manual-payment reservations wait for the organiser.)
async function releaseStale() {
  if (!paystackEnabled()) return;
  const pool = getPool();
  const [stale] = await pool.query<RowDataPacket[]>(
    `SELECT t.id, t.ticket_type_id, t.trip_id FROM tickets t JOIN payments p ON p.id = t.payment_id
     WHERE t.status = 'reserved' AND p.provider = 'paystack' AND p.status <> 'success'
       AND t.created_at < NOW() - INTERVAL ${RESERVATION_MINUTES} MINUTE LIMIT 500`,
  );
  for (const t of stale) {
    const [res] = await pool.execute<ResultSetHeader>(
      "UPDATE tickets SET status = 'cancelled', seat_no = NULL WHERE id = ? AND status = 'reserved'",
      [t.id],
    );
    if (!res.affectedRows) continue;
    if (t.ticket_type_id) await pool.execute("UPDATE ticket_types SET sold = GREATEST(sold - 1, 0) WHERE id = ?", [t.ticket_type_id]);
    if (t.trip_id) await pool.execute("UPDATE bus_trips SET seats_booked = GREATEST(seats_booked - 1, 0) WHERE id = ?", [t.trip_id]);
  }
}

const eventQuery = pageQuerySchema.extend({
  category: z.string().max(30).optional().catch(undefined),
  when: z.enum(["upcoming", "week", "month", "past"]).catch("upcoming"),
});

export const ticketsRoute = new Hono()
  .get("/home", async (c) => {
    const pool = getPool();
    const [[featured], [upcoming], [routes], [rentals]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT e.id, e.title, e.slug, e.category, e.summary, e.cover_url, e.venue, e.city, e.starts_at,
           (SELECT MIN(price) FROM ticket_types WHERE event_id = e.id) AS from_price
         FROM ticket_events e WHERE e.status = 'published' AND e.starts_at >= NOW()
         ORDER BY e.is_featured DESC, e.starts_at LIMIT 6`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT e.id, e.title, e.slug, e.category, e.cover_url, e.venue, e.city, e.starts_at,
           (SELECT MIN(price) FROM ticket_types WHERE event_id = e.id) AS from_price
         FROM ticket_events e WHERE e.status = 'published' AND e.starts_at >= NOW() ORDER BY e.starts_at LIMIT 12`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT origin, destination, MIN(price) AS from_price, COUNT(*) AS trips, MIN(departs_at) AS next_departure
         FROM bus_trips WHERE status = 'scheduled' AND departs_at >= NOW() GROUP BY origin, destination
         ORDER BY trips DESC LIMIT 8`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT r.id, r.title, r.vehicle_type, r.capacity, r.price_per_day, JSON_UNQUOTE(JSON_EXTRACT(r.images, '$[0]')) AS image,
           s.store_name, s.slug AS store_slug FROM bus_rentals r JOIN sellers s ON s.id = r.seller_id
         WHERE r.status = 'active' AND s.status = 'approved' ORDER BY r.id DESC LIMIT 6`,
      ),
    ]);
    return c.json({ featured, upcoming, routes, rentals });
  })
  .get("/events", async (c) => {
    const q = eventQuery.parse(c.req.query());
    const where = ["e.status = 'published'"];
    const params: Array<string | number> = [];
    const when = {
      upcoming: "e.starts_at >= NOW()",
      week: "e.starts_at BETWEEN NOW() AND NOW() + INTERVAL 7 DAY",
      month: "e.starts_at BETWEEN NOW() AND NOW() + INTERVAL 30 DAY",
      past: "e.starts_at < NOW()",
    }[q.when];
    where.push(when);
    if (q.category) {
      where.push("e.category = ?");
      params.push(q.category);
    }
    if (q.q) {
      where.push("(e.title LIKE ? OR e.venue LIKE ? OR e.city LIKE ?)");
      params.push(`%${q.q}%`, `%${q.q}%`, `%${q.q}%`);
    }
    const { limit, offset } = paging(q.page, q.pageSize);
    const clause = where.join(" AND ");
    const pool = getPool();
    const [[items], [count]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT e.id, e.title, e.slug, e.category, e.summary, e.cover_url, e.venue, e.city, e.starts_at, e.ends_at,
           (SELECT MIN(price) FROM ticket_types WHERE event_id = e.id) AS from_price,
           (SELECT SUM(quantity - sold) FROM ticket_types WHERE event_id = e.id) AS remaining,
           s.store_name AS organizer
         FROM ticket_events e LEFT JOIN sellers s ON s.id = e.seller_id WHERE ${clause}
         ORDER BY e.starts_at ${q.when === "past" ? "DESC" : "ASC"} LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      ),
      pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM ticket_events e WHERE ${clause}`, params),
    ]);
    return c.json({ items, total: Number(count[0]?.n ?? 0) });
  })
  .get("/events/:slug", async (c) => {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, s.store_name AS organizer, s.slug AS organizer_slug, s.logo_url AS organizer_logo,
         s.phone AS organizer_phone, s.is_verified AS organizer_verified
       FROM ticket_events e LEFT JOIN sellers s ON s.id = e.seller_id WHERE e.slug = ? AND e.status IN ('published', 'cancelled')`,
      [(c.req.param("slug") ?? "")],
    );
    const event = rows[0];
    if (!event) throw new AppError("Event not found.", 404);
    const [types] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, description, price, quantity, sold, max_per_order FROM ticket_types WHERE event_id = ? ORDER BY sort_order",
      [event.id],
    );
    return c.json({ event, types, onlinePayments: paystackEnabled() });
  })
  .post("/events/:id/buy", requireMember, validate("json", buySchema), async (c) => {
    await releaseStale();
    const eventId = Number(c.req.param("id"));
    const member = c.get("member");
    const input = c.req.valid("json");
    const pool = getPool();
    const [events] = await pool.execute<RowDataPacket[]>(
      `SELECT e.id, e.title, e.slug, e.starts_at, s.user_id AS owner_id FROM ticket_events e LEFT JOIN sellers s ON s.id = e.seller_id
       WHERE e.id = ? AND e.status = 'published' AND COALESCE(e.ends_at, e.starts_at) >= NOW()`,
      [eventId],
    );
    const event = events[0];
    if (!event) throw new AppError("Tickets for this event aren't on sale.", 409);

    const conn = await pool.getConnection();
    const ticketIds: Array<number> = [];
    let total = 0;
    try {
      await conn.beginTransaction();
      for (const item of input.items) {
        const [types] = await conn.execute<RowDataPacket[]>(
          "SELECT * FROM ticket_types WHERE id = ? AND event_id = ? FOR UPDATE",
          [item.typeId, eventId],
        );
        const type = types[0];
        if (!type) throw new AppError("That ticket type doesn't exist.", 404);
        if (item.quantity > type.max_per_order) throw new AppError(`Max ${type.max_per_order} "${type.name}" tickets per order.`, 422);
        if (type.sold + item.quantity > type.quantity) {
          throw new AppError(`Only ${type.quantity - type.sold} "${type.name}" tickets left.`, 409);
        }
        await conn.execute("UPDATE ticket_types SET sold = sold + ? WHERE id = ?", [item.quantity, type.id]);
        for (let i = 0; i < item.quantity; i++) {
          const free = Number(type.price) === 0;
          const [res] = await conn.execute<ResultSetHeader>(
            `INSERT INTO tickets (code, user_id, kind, event_id, ticket_type_id, holder_name, holder_phone, amount, status)
             VALUES (?, ?, 'event', ?, ?, ?, ?, ?, ?)`,
            [ticketCode(), member.id, eventId, type.id, input.holderName, input.holderPhone, type.price, free ? "paid" : "reserved"],
          );
          ticketIds.push(res.insertId);
          total += Number(type.price);
        }
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    notify(event.owner_id, {
      kind: "ticket",
      title: `${ticketIds.length} ticket${ticketIds.length > 1 ? "s" : ""} for ${event.title}`,
      body: `${member.fullName} · GHS ${money(total).toFixed(2)}`,
      link: "/seller/events",
      actorId: member.id,
    });
    if (total === 0) return c.json({ ticketIds, total: 0, authorizationUrl: null, status: "paid" }, 201);
    const payment = await createPayment({
      userId: member.id,
      email: member.email,
      purpose: "ticket",
      targetIds: ticketIds,
      amount: money(total),
      returnPath: "/account/tickets",
    });
    if (payment.authorizationUrl) {
      const [p] = await pool.execute<RowDataPacket[]>("SELECT id FROM payments WHERE reference = ?", [payment.reference]);
      await pool.query("UPDATE tickets SET payment_id = ? WHERE id IN (?)", [p[0]!.id, ticketIds]);
    }
    return c.json({ ticketIds, total: money(total), authorizationUrl: payment.authorizationUrl, status: "reserved" }, 201);
  })
  // ---- Buses --------------------------------------------------------------------------
  .get("/trips", async (c) => {
    const from = (c.req.query("from") ?? "").trim();
    const to = (c.req.query("to") ?? "").trim();
    const date = c.req.query("date") ?? "";
    const where = ["t.status = 'scheduled'", "t.departs_at >= NOW()", "s.status = 'approved'"];
    const params: Array<string> = [];
    if (from) {
      where.push("t.origin LIKE ?");
      params.push(`%${from}%`);
    }
    if (to) {
      where.push("t.destination LIKE ?");
      params.push(`%${to}%`);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      where.push("DATE(t.departs_at) = ?");
      params.push(date);
    }
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT t.*, (t.seats_total - t.seats_booked) AS seats_left, s.store_name AS operator, s.slug AS operator_slug,
         s.logo_url AS operator_logo, s.rating_avg AS operator_rating
       FROM bus_trips t JOIN sellers s ON s.id = t.seller_id WHERE ${where.join(" AND ")}
       ORDER BY t.departs_at LIMIT 100`,
      params,
    );
    const [places] = await getPool().query<RowDataPacket[]>(
      "SELECT DISTINCT origin AS place FROM bus_trips WHERE departs_at >= NOW() UNION SELECT DISTINCT destination FROM bus_trips WHERE departs_at >= NOW()",
    );
    return c.json({ items, places: places.map((p) => p.place) });
  })
  .get("/trips/:id", async (c) => {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.*, (t.seats_total - t.seats_booked) AS seats_left, s.store_name AS operator, s.slug AS operator_slug,
         s.logo_url AS operator_logo, s.phone AS operator_phone
       FROM bus_trips t JOIN sellers s ON s.id = t.seller_id WHERE t.id = ? AND s.status = 'approved' AND t.status <> 'blocked'`,
      [Number(c.req.param("id"))],
    );
    const trip = rows[0];
    if (!trip) throw new AppError("Trip not found.", 404);
    const [taken] = await pool.query<RowDataPacket[]>(
      "SELECT seat_no FROM tickets WHERE trip_id = ? AND seat_no IS NOT NULL AND status <> 'cancelled'",
      [trip.id],
    );
    return c.json({ trip, takenSeats: taken.map((t) => t.seat_no as number), onlinePayments: paystackEnabled() });
  })
  .post("/trips/:id/book", requireMember, validate("json", bookSchema), async (c) => {
    await releaseStale();
    const tripId = Number(c.req.param("id"));
    const member = c.get("member");
    const input = c.req.valid("json");
    const seats = [...new Set(input.seats)];
    const pool = getPool();
    const conn = await pool.getConnection();
    const ticketIds: Array<number> = [];
    let trip: RowDataPacket | undefined;
    try {
      await conn.beginTransaction();
      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT t.*, s.user_id AS owner_id FROM bus_trips t JOIN sellers s ON s.id = t.seller_id
         WHERE t.id = ? AND t.status = 'scheduled' AND t.departs_at > NOW() FOR UPDATE`,
        [tripId],
      );
      trip = rows[0];
      if (!trip) throw new AppError("This trip isn't open for booking.", 409);
      if (seats.some((s) => s > trip!.seats_total)) throw new AppError("Invalid seat number.", 422);
      for (const seat of seats) {
        try {
          const [res] = await conn.execute<ResultSetHeader>(
            `INSERT INTO tickets (code, user_id, kind, trip_id, seat_no, holder_name, holder_phone, amount, status)
             VALUES (?, ?, 'bus', ?, ?, ?, ?, ?, 'reserved')`,
            [ticketCode(), member.id, tripId, seat, input.holderName, input.holderPhone, trip.price],
          );
          ticketIds.push(res.insertId);
        } catch (err) {
          if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new AppError(`Seat ${seat} was just taken. Pick another.`, 409);
          throw err;
        }
      }
      await conn.execute("UPDATE bus_trips SET seats_booked = seats_booked + ? WHERE id = ?", [seats.length, tripId]);
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    const total = money(Number(trip!.price) * seats.length);
    notify(trip!.owner_id, {
      kind: "ticket",
      title: `${seats.length} seat${seats.length > 1 ? "s" : ""} booked: ${trip!.origin} → ${trip!.destination}`,
      body: `${member.fullName} · seats ${seats.join(", ")}`,
      link: "/seller/trips",
      actorId: member.id,
    });
    const payment = await createPayment({
      userId: member.id,
      email: member.email,
      purpose: "ticket",
      targetIds: ticketIds,
      amount: total,
      returnPath: "/account/tickets",
    });
    if (payment.authorizationUrl) {
      const [p] = await pool.execute<RowDataPacket[]>("SELECT id FROM payments WHERE reference = ?", [payment.reference]);
      await pool.query("UPDATE tickets SET payment_id = ? WHERE id IN (?)", [p[0]!.id, ticketIds]);
    }
    return c.json({ ticketIds, total, authorizationUrl: payment.authorizationUrl }, 201);
  })
  // ---- Rentals --------------------------------------------------------------------------
  .get("/rentals", async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT r.*, s.store_name AS operator, s.slug AS operator_slug, s.logo_url AS operator_logo, s.location AS operator_location
       FROM bus_rentals r JOIN sellers s ON s.id = r.seller_id WHERE r.status = 'active' AND s.status = 'approved'
       ORDER BY r.capacity DESC, r.id DESC`,
    );
    return c.json({ items });
  })
  .get("/rentals/:id", async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT r.*, s.store_name AS operator, s.slug AS operator_slug, s.logo_url AS operator_logo, s.phone AS operator_phone,
         s.location AS operator_location FROM bus_rentals r JOIN sellers s ON s.id = r.seller_id
       WHERE r.id = ? AND r.status = 'active' AND s.status = 'approved'`,
      [Number(c.req.param("id"))],
    );
    if (!rows[0]) throw new AppError("Rental not found.", 404);
    return c.json({ rental: rows[0] });
  })
  .post("/rentals/:id/request", requireMember, validate("json", rentalRequestSchema), async (c) => {
    const rentalId = Number(c.req.param("id"));
    const member = c.get("member");
    const input = c.req.valid("json");
    if (input.endDate < input.startDate) throw new AppError("End date must be after the start date.", 422);
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT r.id, r.title, r.capacity, s.user_id AS owner_id FROM bus_rentals r JOIN sellers s ON s.id = r.seller_id WHERE r.id = ? AND r.status = 'active'",
      [rentalId],
    );
    const rental = rows[0];
    if (!rental) throw new AppError("Rental not found.", 404);
    if (input.passengers > rental.capacity) throw new AppError(`This vehicle seats ${rental.capacity}.`, 422);
    await getPool().execute(
      `INSERT INTO rental_requests (rental_id, user_id, start_date, end_date, pickup_location, destination, passengers, purpose, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [rentalId, member.id, input.startDate, input.endDate, input.pickupLocation, input.destination, input.passengers, input.purpose ?? null, input.contactPhone],
    );
    notify(rental.owner_id, {
      kind: "rental",
      title: `New rental request: ${rental.title}`,
      body: `${member.fullName} · ${input.startDate} to ${input.endDate}`,
      link: "/seller/rentals",
      actorId: member.id,
    });
    return c.json({ ok: true }, 201);
  })
  // ---- Mine --------------------------------------------------------------------------------
  .get("/mine", requireMember, async (c) => {
    const id = c.get("member").id;
    const pool = getPool();
    const [[tickets], [rentals], [booths]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT t.*, tt.name AS type_name, e.title AS event_title, e.slug AS event_slug, e.venue, e.starts_at, e.cover_url, e.status AS event_status,
           b.origin, b.destination, b.departs_at, b.pickup_point, op.store_name AS operator,
           p.reference AS payment_reference, p.provider AS payment_provider
         FROM tickets t LEFT JOIN ticket_types tt ON tt.id = t.ticket_type_id LEFT JOIN ticket_events e ON e.id = t.event_id
         LEFT JOIN bus_trips b ON b.id = t.trip_id LEFT JOIN sellers op ON op.id = b.seller_id
         LEFT JOIN payments p ON p.id = t.payment_id
         WHERE t.user_id = ? ORDER BY COALESCE(e.starts_at, b.departs_at) DESC, t.id DESC LIMIT 200`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT r.*, b.title AS rental_title, s.store_name AS operator, s.phone AS operator_phone FROM rental_requests r
         JOIN bus_rentals b ON b.id = r.rental_id JOIN sellers s ON s.id = b.seller_id WHERE r.user_id = ? ORDER BY r.id DESC`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT b.*, x.title AS exhibition_title, x.slug AS exhibition_slug, x.starts_at, x.venue FROM exhibition_bookings b
         JOIN exhibitions x ON x.id = b.exhibition_id WHERE b.user_id = ? ORDER BY b.id DESC`,
        [id],
      ),
    ]);
    return c.json({ tickets, rentals, booths });
  })
  .post("/mine/:id/pay", requireMember, async (c) => {
    const member = c.get("member");
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT id, amount FROM tickets WHERE id = ? AND user_id = ? AND status = 'reserved'",
      [id, member.id],
    );
    if (!rows[0]) throw new AppError("Nothing to pay for this ticket.", 409);
    const payment = await createPayment({
      userId: member.id,
      email: member.email,
      purpose: "ticket",
      targetIds: [id],
      amount: money(rows[0].amount),
      returnPath: "/account/tickets",
    });
    if (!payment.authorizationUrl) throw new AppError("Online payment isn't available. Pay the organiser directly.", 400);
    return c.json(payment);
  });
