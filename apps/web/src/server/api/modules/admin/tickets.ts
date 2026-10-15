// Admin → E-tickets: editing any organiser's event (with its ticket types),
// bus trip or bus rental. Listing and approve/reject live in moderation.ts.
// The same rules apply as for the organiser: a ticket type with sales can't
// be removed or cut below what's sold, and a trip can't drop below its
// booked seats.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { validate } from "../../lib/validate.js";
import { toColumns, updateSql } from "../../lib/columns.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";
import { notify } from "../../lib/notify.js";
import { EVENT_FIELDS, RENTAL_FIELDS, TRIP_FIELDS, eventSchema, rentalSchema, saveTicketTypes, tripSchema } from "../seller/route.js";

// Status stays with the moderation actions (approve, reject, cancel...).
const adminEventSchema = eventSchema.omit({ submit: true }).partial();
const adminTripSchema = tripSchema.partial();
// Rentals: "blocked" is the moderators' own status, so it's offered here.
const adminRentalSchema = rentalSchema
  .omit({ status: true })
  .extend({ status: z.enum(["active", "hidden", "blocked"]).optional() })
  .partial();

const idParam = (raw: string | undefined) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new AppError("Not found.", 404);
  return id;
};

// The record plus its organiser's account, for the notification.
async function load(table: "ticket_events" | "bus_trips" | "bus_rentals", id: number, label: string) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT t.*, s.user_id AS owner_id, s.store_name AS organizer FROM ${table} t JOIN sellers s ON s.id = t.seller_id WHERE t.id = ?`,
    [id],
  );
  if (!rows[0]) throw new AppError(`${label} not found.`, 404);
  return rows[0];
}

async function save(table: "ticket_events" | "bus_trips" | "bus_rentals", id: number, input: object, fields: Record<string, string>) {
  const { columns, params } = toColumns(input, fields);
  if (columns.length) await getPool().execute(updateSql(table, columns), [...params, id]);
}

function done(adminId: number, entity: string, id: number, title: string, ownerId: number, link: string) {
  logActivity(adminId, "updated", entity, id, `Edited ${entity.replace(/s$/, "")}: ${title.slice(0, 200)}`);
  notify(ownerId, { kind: "moderation", title: `A moderator updated "${title}"`, link });
}

export const adminTicketsRoute = new Hono()
  // ---- Events --------------------------------------------------------------------------
  .get("/events/:id", requirePermission("tickets", "view"), async (c) => {
    const id = idParam(c.req.param("id"));
    const event = await load("ticket_events", id, "Event");
    const [types] = await getPool().query<RowDataPacket[]>("SELECT * FROM ticket_types WHERE event_id = ? ORDER BY sort_order", [id]);
    return c.json({ event, types });
  })
  .patch("/events/:id", requirePermission("tickets", "manage"), validate("json", adminEventSchema), async (c) => {
    const id = idParam(c.req.param("id"));
    const event = await load("ticket_events", id, "Event");
    const input = c.req.valid("json");
    await save("ticket_events", id, input, EVENT_FIELDS);
    if (input.ticketTypes) await saveTicketTypes(id, input.ticketTypes);
    done(c.get("admin").id, "events", id, String(input.title ?? event.title), event.owner_id as number, `/seller/events/${id}`);
    return c.json({ ok: true });
  })
  // ---- Bus trips -----------------------------------------------------------------------
  .get("/trips/:id", requirePermission("tickets", "view"), async (c) => {
    return c.json({ trip: await load("bus_trips", idParam(c.req.param("id")), "Trip") });
  })
  .patch("/trips/:id", requirePermission("tickets", "manage"), validate("json", adminTripSchema), async (c) => {
    const id = idParam(c.req.param("id"));
    const trip = await load("bus_trips", id, "Trip");
    const input = c.req.valid("json");
    if (input.seatsTotal !== undefined && input.seatsTotal < Number(trip.seats_booked)) {
      throw new AppError(`${trip.seats_booked} seats are already booked.`, 409);
    }
    await save("bus_trips", id, input, TRIP_FIELDS);
    const route = `${input.origin ?? trip.origin} → ${input.destination ?? trip.destination}`;
    done(c.get("admin").id, "trips", id, route, trip.owner_id as number, "/seller/trips");
    return c.json({ ok: true });
  })
  // ---- Bus rentals ---------------------------------------------------------------------
  .get("/rentals/:id", requirePermission("tickets", "view"), async (c) => {
    return c.json({ rental: await load("bus_rentals", idParam(c.req.param("id")), "Rental") });
  })
  .patch("/rentals/:id", requirePermission("tickets", "manage"), validate("json", adminRentalSchema), async (c) => {
    const id = idParam(c.req.param("id"));
    const rental = await load("bus_rentals", id, "Rental");
    const input = c.req.valid("json");
    await save("bus_rentals", id, input, RENTAL_FIELDS);
    done(c.get("admin").id, "rentals", id, String(input.title ?? rental.title), rental.owner_id as number, "/seller/rentals");
    return c.json({ ok: true });
  });
