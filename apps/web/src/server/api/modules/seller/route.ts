// Seller Center: a member opens a store (admin approves it), then manages
// products / food menu, orders, events and tickets, bus trips, bus rentals
// and exhibitions — each gated by the store's approved capabilities.
import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requireMember, requireSeller } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl, urlListSchema } from "../../lib/fields.js";
import { toColumns, insertSql, updateSql } from "../../lib/columns.js";
import { uniqueSlug } from "../../lib/slug.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { fulfil } from "../../lib/payments.js";
import { idParam } from "../../lib/query.js";

const KINDS = ["products", "food", "events", "transport", "exhibitions"] as const;
const dateTime = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/, "Use a valid date and time")
  .transform((v) => (v.replace("T", " ").length === 16 ? `${v.replace("T", " ")}:00` : v.replace("T", " ")));
const imageList = urlListSchema(10);

const storeSchema = z.object({
  storeName: z.string().trim().min(2).max(150),
  kinds: z.array(z.enum(KINDS)).min(1),
  tagline: optionalText(200),
  description: optionalText(5000),
  logoUrl: optionalUrl,
  bannerUrl: optionalUrl,
  email: optionalText(150),
  phone: z.string().trim().min(9).max(30),
  whatsapp: optionalText(30),
  location: optionalText(255),
  businessRegNo: optionalText(60),
  idDocumentUrl: optionalUrl,
  cuisine: optionalText(100),
  openingHours: optionalText(150),
  delivers: z.boolean().optional(),
  deliveryFee: z.number().min(0).max(10_000).optional(),
  isOpen: z.boolean().optional(),
});
const STORE_FIELDS = {
  storeName: "store_name",
  tagline: "tagline",
  description: "description",
  logoUrl: "logo_url",
  bannerUrl: "banner_url",
  email: "email",
  phone: "phone",
  whatsapp: "whatsapp",
  location: "location",
  businessRegNo: "business_reg_no",
  idDocumentUrl: "id_document_url",
  cuisine: "cuisine",
  openingHours: "opening_hours",
  delivers: "delivers",
  deliveryFee: "delivery_fee",
  isOpen: "is_open",
};

const productSchema = z.object({
  kind: z.enum(["product", "food"]).optional(),
  title: z.string().trim().min(2).max(200),
  categoryId: z.number().int().positive().nullable().optional(),
  description: optionalText(10_000),
  menuSection: optionalText(60),
  price: z.number().min(0).max(10_000_000),
  compareAtPrice: z.number().min(0).max(10_000_000).nullable().optional(),
  stock: z.number().int().min(0).max(1_000_000).nullable().optional(),
  itemCondition: z.enum(["new", "used", "refurbished"]).optional(),
  images: imageList.optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(15).optional(),
  status: z.enum(["active", "draft", "hidden"]).optional(),
});
const PRODUCT_FIELDS = {
  kind: "kind",
  title: "title",
  categoryId: "category_id",
  description: "description",
  menuSection: "menu_section",
  price: "price",
  compareAtPrice: "compare_at_price",
  stock: "stock",
  itemCondition: "item_condition",
  images: "images",
  tags: "tags",
  status: "status",
};

const orderUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "ready", "shipped", "delivered", "cancelled"]).optional(),
  sellerNote: optionalText(1000),
  markPaid: z.boolean().optional(),
});

const ticketTypeSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(1).max(80),
  description: optionalText(255),
  price: z.number().min(0).max(1_000_000),
  quantity: z.number().int().min(1).max(100_000),
  maxPerOrder: z.number().int().min(1).max(50).default(10),
});
const eventSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.enum(["src", "association", "campus", "private", "concert", "conference", "sports", "other"]),
  summary: optionalText(300),
  description: optionalText(10_000),
  coverUrl: optionalUrl,
  venue: z.string().trim().min(2).max(200),
  city: optionalText(100),
  startsAt: dateTime,
  endsAt: dateTime.nullable().optional(),
  ticketTypes: z.array(ticketTypeSchema).min(1).max(10),
  submit: z.boolean().optional(),
});

const tripSchema = z.object({
  origin: z.string().trim().min(2).max(100),
  destination: z.string().trim().min(2).max(100),
  pickupPoint: optionalText(200),
  departsAt: dateTime,
  arrivesAt: dateTime.nullable().optional(),
  busType: optionalText(60),
  amenities: z.array(z.string().trim().max(40)).max(10).optional(),
  seatsTotal: z.number().int().min(1).max(100),
  price: z.number().min(0).max(100_000),
  status: z.enum(["scheduled", "cancelled", "completed"]).optional(),
});
const TRIP_FIELDS = {
  origin: "origin",
  destination: "destination",
  pickupPoint: "pickup_point",
  departsAt: "departs_at",
  arrivesAt: "arrives_at",
  busType: "bus_type",
  amenities: "amenities",
  seatsTotal: "seats_total",
  price: "price",
  status: "status",
};

const rentalSchema = z.object({
  title: z.string().trim().min(2).max(150),
  vehicleType: z.string().trim().min(2).max(60),
  capacity: z.number().int().min(1).max(100),
  pricePerDay: z.number().min(0).max(1_000_000),
  description: optionalText(5000),
  images: imageList.optional(),
  features: z.array(z.string().trim().max(40)).max(15).optional(),
  status: z.enum(["active", "hidden"]).optional(),
});
const RENTAL_FIELDS = {
  title: "title",
  vehicleType: "vehicle_type",
  capacity: "capacity",
  pricePerDay: "price_per_day",
  description: "description",
  images: "images",
  features: "features",
  status: "status",
};

const exhibitionSchema = z.object({
  title: z.string().trim().min(3).max(200),
  theme: optionalText(200),
  description: optionalText(10_000),
  coverUrl: optionalUrl,
  venue: z.string().trim().min(2).max(200),
  city: optionalText(100),
  startsAt: dateTime,
  endsAt: dateTime,
  boothPrice: z.number().min(0).max(1_000_000),
  boothsTotal: z.number().int().min(1).max(5000),
  services: z.array(z.string().trim().max(60)).max(15).optional(),
});
const EXHIBITION_FIELDS = {
  title: "title",
  theme: "theme",
  description: "description",
  coverUrl: "cover_url",
  venue: "venue",
  city: "city",
  startsAt: "starts_at",
  endsAt: "ends_at",
  boothPrice: "booth_price",
  boothsTotal: "booths_total",
  services: "services",
};

const sellerId = (c: Context) => c.get("member").seller!.id;

// Loads a row only if it belongs to the signed-in seller.
async function owned(table: string, id: number, c: Context, label: string) {
  const [rows] = await getPool().execute<RowDataPacket[]>(`SELECT * FROM ${table} WHERE id = ? AND seller_id = ?`, [
    id,
    sellerId(c),
  ]);
  if (!rows[0]) throw new AppError(`${label} not found.`, 404);
  return rows[0];
}

async function insert(table: string, input: object, fields: Record<string, string>, extra: Record<string, unknown>) {
  const { columns, params } = toColumns(input, fields);
  const extraCols = Object.keys(extra);
  const [res] = await getPool().execute<ResultSetHeader>(insertSql(table, [...columns, ...extraCols]), [
    ...params,
    ...(Object.values(extra) as Array<string | number | null>),
  ]);
  return res.insertId;
}

async function update(table: string, id: number, input: object, fields: Record<string, string>, extra: Record<string, unknown> = {}) {
  const { columns, params } = toColumns(input, fields);
  const extraCols = Object.keys(extra);
  if (!columns.length && !extraCols.length) return;
  await getPool().execute(updateSql(table, [...columns, ...extraCols]), [
    ...params,
    ...(Object.values(extra) as Array<string | number | null>),
    id,
  ]);
}

async function saveTicketTypes(eventId: number, types: Array<z.infer<typeof ticketTypeSchema>>) {
  const pool = getPool();
  const [existing] = await pool.execute<RowDataPacket[]>("SELECT id, sold FROM ticket_types WHERE event_id = ?", [eventId]);
  const keep = new Set(types.map((t) => t.id).filter(Boolean));
  for (const row of existing) {
    if (keep.has(row.id)) continue;
    if (row.sold > 0) throw new AppError("A ticket type that has sales can't be removed.", 409);
    await pool.execute("DELETE FROM ticket_types WHERE id = ?", [row.id]);
  }
  for (const [i, t] of types.entries()) {
    const current = existing.find((e) => e.id === t.id);
    if (current) {
      if (t.quantity < current.sold) throw new AppError(`"${t.name}" already sold ${current.sold}; quantity can't be lower.`, 409);
      await pool.execute(
        "UPDATE ticket_types SET name = ?, description = ?, price = ?, quantity = ?, max_per_order = ?, sort_order = ? WHERE id = ? AND event_id = ?",
        [t.name, t.description ?? null, t.price, t.quantity, t.maxPerOrder, i, current.id, eventId],
      );
    } else {
      await pool.execute(
        "INSERT INTO ticket_types (event_id, name, description, price, quantity, max_per_order, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [eventId, t.name, t.description ?? null, t.price, t.quantity, t.maxPerOrder, i],
      );
    }
  }
}

export const sellerRoute = new Hono()
  // ---- Store ------------------------------------------------------------------
  .get("/store", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM sellers WHERE user_id = ?", [c.get("member").id]);
    return c.json({ store: rows[0] ?? null });
  })
  .post("/store", requireMember, validate("json", storeSchema), async (c) => {
    const member = c.get("member");
    if (member.seller) throw new AppError("You already have a store.", 409);
    const input = c.req.valid("json");
    const slug = await uniqueSlug("sellers", input.storeName, null);
    const id = await insert("sellers", input, STORE_FIELDS, { user_id: member.id, slug, kinds: input.kinds.join(",") });
    return c.json({ id, slug }, 201);
  })
  .patch("/store", requireMember, validate("json", storeSchema.partial()), async (c) => {
    const member = c.get("member");
    if (!member.seller) throw new AppError("Open a store first.", 404);
    const input = c.req.valid("json");
    const extra: Record<string, unknown> = {};
    if (input.kinds) extra.kinds = input.kinds.join(",");
    // A rejected application goes back into the review queue when resubmitted.
    if (member.seller.status === "rejected") {
      extra.status = "pending";
      extra.status_reason = null;
    }
    await update("sellers", member.seller.id, input, STORE_FIELDS, extra);
    return c.json({ ok: true });
  })
  // ---- Dashboard -------------------------------------------------------------
  .get("/dashboard", requireSeller(), async (c) => {
    const id = sellerId(c);
    const pool = getPool();
    const [[orders], [revenue], [products], [recent], [daily], [events]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT status, COUNT(*) AS n FROM orders WHERE seller_id = ? GROUP BY status", [id]),
      pool.query<RowDataPacket[]>(
        `SELECT COALESCE(SUM(total), 0) AS total,
           COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL 30 DAY THEN total END), 0) AS last30
         FROM orders WHERE seller_id = ? AND status <> 'cancelled'`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS total, SUM(status = 'active') AS active, COALESCE(SUM(view_count), 0) AS views, SUM(stock IS NOT NULL AND stock <= 3) AS low_stock FROM products WHERE seller_id = ?",
        [id],
      ),
      pool.query<RowDataPacket[]>(
        "SELECT id, order_no, contact_name, total, status, payment_status, created_at FROM orders WHERE seller_id = ? ORDER BY id DESC LIMIT 8",
        [id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT DATE(created_at) AS day, COUNT(*) AS orders, COALESCE(SUM(total), 0) AS revenue FROM orders
         WHERE seller_id = ? AND status <> 'cancelled' AND created_at >= CURDATE() - INTERVAL 13 DAY GROUP BY DATE(created_at) ORDER BY day`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS n, COALESCE(SUM(t.amount), 0) AS revenue FROM tickets t JOIN ticket_events e ON e.id = t.event_id
         WHERE e.seller_id = ? AND t.status IN ('paid', 'used')`,
        [id],
      ),
    ]);
    return c.json({
      ordersByStatus: Object.fromEntries(orders.map((r) => [r.status, Number(r.n)])),
      revenue: revenue[0],
      products: products[0],
      recent,
      daily,
      tickets: events[0],
    });
  })
  // ---- Products & food menu ----------------------------------------------------
  .get("/products", requireSeller(), async (c) => {
    const kind = c.req.query("kind") === "food" ? "food" : "product";
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT p.*, c.name AS category_name FROM products p LEFT JOIN market_categories c ON c.id = p.category_id
       WHERE p.seller_id = ? AND p.kind = ? ORDER BY p.menu_section, p.sort_order, p.id DESC`,
      [sellerId(c), kind],
    );
    return c.json({ items: rows });
  })
  .post("/products", requireSeller(), validate("json", productSchema), async (c) => {
    const input = c.req.valid("json");
    const kinds = c.get("member").seller!.kinds;
    if ((input.kind ?? "product") === "food" ? !kinds.includes("food") : !kinds.includes("products")) {
      throw new AppError(`Your store isn't set up to sell ${input.kind === "food" ? "food" : "products"}.`, 403);
    }
    const slug = await uniqueSlug("products", input.title, null);
    const id = await insert("products", input, PRODUCT_FIELDS, { seller_id: sellerId(c), slug });
    return c.json({ id, slug }, 201);
  })
  .patch("/products/:id", requireSeller(), validate("json", productSchema.partial()), async (c) => {
    const id = idParam(c.req.param("id"));
    const current = await owned("products", id, c, "Product");
    if (current.status === "blocked") throw new AppError("This product was blocked by moderators.", 403);
    await update("products", id, c.req.valid("json"), PRODUCT_FIELDS);
    return c.json({ ok: true });
  })
  .delete("/products/:id", requireSeller(), async (c) => {
    const id = idParam(c.req.param("id"));
    await owned("products", id, c, "Product");
    await getPool().execute("DELETE FROM products WHERE id = ?", [id]);
    return c.body(null, 204);
  })
  // ---- Orders ----------------------------------------------------------------------
  .get("/orders", requireSeller(), async (c) => {
    const status = c.req.query("status");
    const params: Array<string | number> = [sellerId(c)];
    let extra = "";
    if (status && status !== "all") {
      extra = "AND o.status = ?";
      params.push(status);
    }
    const pool = getPool();
    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT o.*, u.full_name AS buyer_name, u.username AS buyer_username, u.avatar_url AS buyer_avatar
       FROM orders o JOIN users u ON u.id = o.user_id WHERE o.seller_id = ? ${extra} ORDER BY o.id DESC LIMIT 200`,
      params,
    );
    const ids = orders.map((o) => o.id as number);
    const [items] = ids.length
      ? await pool.query<RowDataPacket[]>("SELECT * FROM order_items WHERE order_id IN (?)", [ids])
      : [[]];
    return c.json({ orders: orders.map((o) => ({ ...o, items: (items as Array<RowDataPacket>).filter((i) => i.order_id === o.id) })) });
  })
  .patch("/orders/:id", requireSeller(), validate("json", orderUpdateSchema), async (c) => {
    const id = idParam(c.req.param("id"));
    const order = await owned("orders", id, c, "Order");
    const input = c.req.valid("json");
    const pool = getPool();
    if (input.status || input.sellerNote !== undefined) {
      await update("orders", id, input, { status: "status", sellerNote: "seller_note" });
    }
    if (input.markPaid && order.payment_status !== "paid") await fulfil("order", [id], null);
    if (input.status === "cancelled" && order.status !== "cancelled") {
      const [items] = await pool.execute<RowDataPacket[]>("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [id]);
      for (const i of items) {
        if (i.product_id) {
          await pool.execute(
            "UPDATE products SET sold_count = GREATEST(sold_count - ?, 0), stock = IF(stock IS NULL, NULL, stock + ?) WHERE id = ?",
            [i.quantity, i.quantity, i.product_id],
          );
        }
      }
    }
    if (input.status && input.status !== order.status) {
      const label: Record<string, string> = {
        confirmed: "was confirmed",
        ready: "is ready for pickup",
        shipped: "is on its way",
        delivered: "was delivered",
        cancelled: "was cancelled by the seller",
      };
      if (label[input.status]) {
        notify(order.user_id, {
          kind: "order",
          title: `Order ${order.order_no} ${label[input.status]}`,
          body: input.sellerNote ?? null,
          link: "/account/orders",
          actorId: c.get("member").id,
        });
      }
    }
    return c.json({ ok: true });
  })
  // ---- Events & tickets ------------------------------------------------------------
  .get("/events", requireSeller("events"), async (c) => {
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT e.*, (SELECT COALESCE(SUM(sold), 0) FROM ticket_types WHERE event_id = e.id) AS sold,
         (SELECT COALESCE(SUM(quantity), 0) FROM ticket_types WHERE event_id = e.id) AS capacity,
         (SELECT COALESCE(SUM(amount), 0) FROM tickets WHERE event_id = e.id AND status IN ('paid', 'used')) AS revenue
       FROM ticket_events e WHERE e.seller_id = ? ORDER BY e.starts_at DESC`,
      [sellerId(c)],
    );
    return c.json({ items: rows });
  })
  .get("/events/:id", requireSeller("events"), async (c) => {
    const id = idParam(c.req.param("id"));
    const event = await owned("ticket_events", id, c, "Event");
    const pool = getPool();
    const [[types], [attendees]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT * FROM ticket_types WHERE event_id = ? ORDER BY sort_order", [id]),
      pool.query<RowDataPacket[]>(
        `SELECT t.id, t.code, t.holder_name, t.holder_phone, t.amount, t.status, t.checked_in_at, t.created_at,
           tt.name AS type_name, u.email, u.username FROM tickets t
         LEFT JOIN ticket_types tt ON tt.id = t.ticket_type_id JOIN users u ON u.id = t.user_id
         WHERE t.event_id = ? ORDER BY t.id DESC`,
        [id],
      ),
    ]);
    return c.json({ event, types, attendees });
  })
  .post("/events", requireSeller("events"), validate("json", eventSchema), async (c) => {
    const input = c.req.valid("json");
    const slug = await uniqueSlug("ticket_events", input.title, null);
    const id = await insert(
      "ticket_events",
      input,
      { title: "title", category: "category", summary: "summary", description: "description", coverUrl: "cover_url", venue: "venue", city: "city", startsAt: "starts_at", endsAt: "ends_at" },
      { seller_id: sellerId(c), slug, status: input.submit === false ? "draft" : "pending" },
    );
    await saveTicketTypes(id, input.ticketTypes);
    return c.json({ id, slug }, 201);
  })
  .patch("/events/:id", requireSeller("events"), validate("json", eventSchema.partial()), async (c) => {
    const id = idParam(c.req.param("id"));
    const event = await owned("ticket_events", id, c, "Event");
    const input = c.req.valid("json");
    const extra: Record<string, unknown> = {};
    // Material edits to a rejected/draft event send it (back) for review.
    if (input.submit && ["draft", "rejected"].includes(event.status)) extra.status = "pending";
    await update(
      "ticket_events",
      id,
      input,
      { title: "title", category: "category", summary: "summary", description: "description", coverUrl: "cover_url", venue: "venue", city: "city", startsAt: "starts_at", endsAt: "ends_at" },
      extra,
    );
    if (input.ticketTypes) await saveTicketTypes(id, input.ticketTypes);
    return c.json({ ok: true });
  })
  .post("/events/:id/cancel", requireSeller("events"), async (c) => {
    const id = idParam(c.req.param("id"));
    await owned("ticket_events", id, c, "Event");
    await getPool().execute("UPDATE ticket_events SET status = 'cancelled' WHERE id = ?", [id]);
    const [holders] = await getPool().execute<RowDataPacket[]>(
      "SELECT DISTINCT t.user_id, e.title FROM tickets t JOIN ticket_events e ON e.id = t.event_id WHERE t.event_id = ? AND t.status IN ('reserved', 'paid')",
      [id],
    );
    for (const h of holders) {
      notify(h.user_id, { kind: "ticket", title: `${h.title} was cancelled`, body: "Contact the organiser about refunds.", link: "/account/tickets" });
    }
    return c.json({ ok: true });
  })
  .post("/tickets/:id/mark-paid", requireSeller(), async (c) => {
    const id = idParam(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT t.id FROM tickets t LEFT JOIN ticket_events e ON e.id = t.event_id LEFT JOIN bus_trips b ON b.id = t.trip_id
       WHERE t.id = ? AND (e.seller_id = ? OR b.seller_id = ?)`,
      [id, sellerId(c), sellerId(c)],
    );
    if (!rows[0]) throw new AppError("Ticket not found.", 404);
    await fulfil("ticket", [id], null);
    return c.json({ ok: true });
  })
  .post("/checkin", requireSeller(), validate("json", z.object({ code: z.string().trim().min(4).max(16) })), async (c) => {
    const code = c.req.valid("json").code.toUpperCase();
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.*, COALESCE(e.title, CONCAT(b.origin, ' → ', b.destination)) AS title, tt.name AS type_name
       FROM tickets t LEFT JOIN ticket_events e ON e.id = t.event_id LEFT JOIN bus_trips b ON b.id = t.trip_id
       LEFT JOIN ticket_types tt ON tt.id = t.ticket_type_id
       WHERE t.code = ? AND (e.seller_id = ? OR b.seller_id = ?)`,
      [code, sellerId(c), sellerId(c)],
    );
    const ticket = rows[0];
    if (!ticket) throw new AppError("No ticket with that code for your events or trips.", 404);
    if (ticket.status === "used") return c.json({ ticket, result: "already_used" });
    if (ticket.status !== "paid") return c.json({ ticket, result: ticket.status });
    await pool.execute("UPDATE tickets SET status = 'used', checked_in_at = NOW() WHERE id = ?", [ticket.id]);
    return c.json({ ticket: { ...ticket, status: "used" }, result: "checked_in" });
  })
  // ---- Bus trips -------------------------------------------------------------------
  .get("/trips", requireSeller("transport"), async (c) => {
    const [rows] = await getPool().query<RowDataPacket[]>(
      "SELECT * FROM bus_trips WHERE seller_id = ? ORDER BY departs_at DESC LIMIT 200",
      [sellerId(c)],
    );
    return c.json({ items: rows });
  })
  .get("/trips/:id", requireSeller("transport"), async (c) => {
    const id = idParam(c.req.param("id"));
    const trip = await owned("bus_trips", id, c, "Trip");
    const [passengers] = await getPool().query<RowDataPacket[]>(
      `SELECT t.id, t.code, t.seat_no, t.holder_name, t.holder_phone, t.amount, t.status, t.checked_in_at
       FROM tickets t WHERE t.trip_id = ? ORDER BY t.seat_no`,
      [id],
    );
    return c.json({ trip, passengers });
  })
  .post("/trips", requireSeller("transport"), validate("json", tripSchema), async (c) => {
    const id = await insert("bus_trips", c.req.valid("json"), TRIP_FIELDS, { seller_id: sellerId(c) });
    return c.json({ id }, 201);
  })
  .patch("/trips/:id", requireSeller("transport"), validate("json", tripSchema.partial()), async (c) => {
    const id = idParam(c.req.param("id"));
    const trip = await owned("bus_trips", id, c, "Trip");
    const input = c.req.valid("json");
    if (input.seatsTotal !== undefined && input.seatsTotal < trip.seats_booked) {
      throw new AppError(`${trip.seats_booked} seats are already booked.`, 409);
    }
    await update("bus_trips", id, input, TRIP_FIELDS);
    return c.json({ ok: true });
  })
  // ---- Bus rentals -----------------------------------------------------------------
  .get("/rentals", requireSeller("transport"), async (c) => {
    const pool = getPool();
    const [[rentals], [requests]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT * FROM bus_rentals WHERE seller_id = ? ORDER BY id DESC", [sellerId(c)]),
      pool.query<RowDataPacket[]>(
        `SELECT r.*, b.title AS rental_title, u.full_name AS requester_name, u.email AS requester_email
         FROM rental_requests r JOIN bus_rentals b ON b.id = r.rental_id JOIN users u ON u.id = r.user_id
         WHERE b.seller_id = ? ORDER BY r.id DESC LIMIT 200`,
        [sellerId(c)],
      ),
    ]);
    return c.json({ rentals, requests });
  })
  .post("/rentals", requireSeller("transport"), validate("json", rentalSchema), async (c) => {
    const id = await insert("bus_rentals", c.req.valid("json"), RENTAL_FIELDS, { seller_id: sellerId(c) });
    return c.json({ id }, 201);
  })
  .patch("/rentals/:id", requireSeller("transport"), validate("json", rentalSchema.partial()), async (c) => {
    const id = idParam(c.req.param("id"));
    const rental = await owned("bus_rentals", id, c, "Rental");
    if (rental.status === "blocked") throw new AppError("This listing was blocked by moderators.", 403);
    await update("bus_rentals", id, c.req.valid("json"), RENTAL_FIELDS);
    return c.json({ ok: true });
  })
  .patch(
    "/rental-requests/:id",
    requireSeller("transport"),
    validate(
      "json",
      z.object({
        status: z.enum(["quoted", "confirmed", "declined", "completed"]),
        quotedAmount: z.number().min(0).max(10_000_000).optional(),
        sellerNote: optionalText(1000),
      }),
    ),
    async (c) => {
      const id = idParam(c.req.param("id"));
      const [rows] = await getPool().execute<RowDataPacket[]>(
        `SELECT r.*, b.title FROM rental_requests r JOIN bus_rentals b ON b.id = r.rental_id WHERE r.id = ? AND b.seller_id = ?`,
        [id, sellerId(c)],
      );
      const request = rows[0];
      if (!request) throw new AppError("Request not found.", 404);
      const input = c.req.valid("json");
      await update("rental_requests", id, input, { status: "status", quotedAmount: "quoted_amount", sellerNote: "seller_note" });
      notify(request.user_id, {
        kind: "rental",
        title: `Your rental request for ${request.title} was ${input.status}`,
        body: input.quotedAmount !== undefined ? `Quote: GHS ${input.quotedAmount.toFixed(2)}` : (input.sellerNote ?? null),
        link: "/account/tickets",
        actorId: c.get("member").id,
      });
      return c.json({ ok: true });
    },
  )
  // ---- Exhibitions ------------------------------------------------------------------
  .get("/exhibitions", requireSeller("exhibitions"), async (c) => {
    const pool = getPool();
    const [[items], [bookings]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT * FROM exhibitions WHERE seller_id = ? ORDER BY starts_at DESC", [sellerId(c)]),
      pool.query<RowDataPacket[]>(
        `SELECT b.*, x.title AS exhibition_title, u.full_name AS requester_name, u.email AS requester_email
         FROM exhibition_bookings b JOIN exhibitions x ON x.id = b.exhibition_id JOIN users u ON u.id = b.user_id
         WHERE x.seller_id = ? ORDER BY b.id DESC LIMIT 300`,
        [sellerId(c)],
      ),
    ]);
    return c.json({ items, bookings });
  })
  .post("/exhibitions", requireSeller("exhibitions"), validate("json", exhibitionSchema), async (c) => {
    const input = c.req.valid("json");
    const slug = await uniqueSlug("exhibitions", input.title, null);
    const id = await insert("exhibitions", input, EXHIBITION_FIELDS, { seller_id: sellerId(c), slug });
    return c.json({ id, slug }, 201);
  })
  .patch("/exhibitions/:id", requireSeller("exhibitions"), validate("json", exhibitionSchema.partial()), async (c) => {
    const id = idParam(c.req.param("id"));
    const current = await owned("exhibitions", id, c, "Exhibition");
    const input = c.req.valid("json");
    if (input.boothsTotal !== undefined && input.boothsTotal < current.booths_taken) {
      throw new AppError(`${current.booths_taken} booths are already taken.`, 409);
    }
    await update("exhibitions", id, input, EXHIBITION_FIELDS, current.status === "rejected" ? { status: "pending" } : {});
    return c.json({ ok: true });
  })
  .patch(
    "/exhibition-bookings/:id",
    requireSeller("exhibitions"),
    validate("json", z.object({ status: z.enum(["approved", "paid", "declined"]), organizerNote: optionalText(1000) })),
    async (c) => {
      const id = idParam(c.req.param("id"));
      const pool = getPool();
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT b.*, x.title, x.booths_total, x.booths_taken FROM exhibition_bookings b JOIN exhibitions x ON x.id = b.exhibition_id
         WHERE b.id = ? AND x.seller_id = ?`,
        [id, sellerId(c)],
      );
      const booking = rows[0];
      if (!booking) throw new AppError("Booking not found.", 404);
      const { status, organizerNote } = c.req.valid("json");
      const wasHolding = ["approved", "paid"].includes(booking.status);
      const willHold = ["approved", "paid"].includes(status);
      if (!wasHolding && willHold) {
        const [res] = await pool.execute<ResultSetHeader>(
          "UPDATE exhibitions SET booths_taken = booths_taken + ? WHERE id = ? AND booths_taken + ? <= booths_total",
          [booking.booths, booking.exhibition_id, booking.booths],
        );
        if (!res.affectedRows) throw new AppError("Not enough booths left.", 409);
      } else if (wasHolding && !willHold) {
        await pool.execute("UPDATE exhibitions SET booths_taken = GREATEST(booths_taken - ?, 0) WHERE id = ?", [
          booking.booths,
          booking.exhibition_id,
        ]);
      }
      await pool.execute("UPDATE exhibition_bookings SET status = ?, organizer_note = ? WHERE id = ?", [
        status,
        organizerNote ?? booking.organizer_note,
        id,
      ]);
      notify(booking.user_id, {
        kind: "booth",
        title: `Your booth request for ${booking.title} was ${status}`,
        body: organizerNote ?? null,
        link: "/account/tickets",
        actorId: c.get("member").id,
      });
      return c.json({ ok: true });
    },
  );
