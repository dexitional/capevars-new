// Exhibition services: browse fairs and expos, and request exhibitor booths.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText } from "../../lib/fields.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { money } from "../../lib/search.js";

const bookingSchema = z.object({
  businessName: z.string().trim().min(2).max(150),
  contactPhone: z.string().trim().min(9).max(30),
  booths: z.number().int().min(1).max(20),
  products: optionalText(1000),
  services: z.array(z.string().trim().max(60)).max(15).optional(),
});

export const exhibitionsRoute = new Hono()
  .get("/", async (c) => {
    const past = c.req.query("when") === "past";
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT x.id, x.title, x.slug, x.theme, x.cover_url, x.venue, x.city, x.starts_at, x.ends_at, x.booth_price,
         x.booths_total, x.booths_taken, x.is_featured, s.store_name AS organizer, s.slug AS organizer_slug
       FROM exhibitions x LEFT JOIN sellers s ON s.id = x.seller_id
       WHERE x.status = 'published' AND x.ends_at ${past ? "<" : ">="} NOW()
       ORDER BY x.is_featured DESC, x.starts_at ${past ? "DESC" : "ASC"} LIMIT 60`,
    );
    return c.json({ items });
  })
  .get("/:slug", async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT x.*, s.store_name AS organizer, s.slug AS organizer_slug, s.logo_url AS organizer_logo, s.phone AS organizer_phone,
         s.email AS organizer_email FROM exhibitions x LEFT JOIN sellers s ON s.id = x.seller_id
       WHERE x.slug = ? AND x.status IN ('published', 'cancelled')`,
      [(c.req.param("slug") ?? "")],
    );
    if (!rows[0]) throw new AppError("Exhibition not found.", 404);
    const [exhibitors] = await getPool().query<RowDataPacket[]>(
      "SELECT business_name, products FROM exhibition_bookings WHERE exhibition_id = ? AND status IN ('approved', 'paid') ORDER BY business_name",
      [rows[0].id],
    );
    return c.json({ exhibition: rows[0], exhibitors });
  })
  .post("/:id/book", requireMember, validate("json", bookingSchema), async (c) => {
    const id = Number(c.req.param("id"));
    const member = c.get("member");
    const input = c.req.valid("json");
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT x.*, s.user_id AS owner_id FROM exhibitions x LEFT JOIN sellers s ON s.id = x.seller_id
       WHERE x.id = ? AND x.status = 'published' AND x.starts_at > NOW()`,
      [id],
    );
    const ex = rows[0];
    if (!ex) throw new AppError("Booth booking is closed for this exhibition.", 409);
    if (ex.booths_taken + input.booths > ex.booths_total) {
      throw new AppError(`Only ${ex.booths_total - ex.booths_taken} booths left.`, 409);
    }
    await getPool().execute(
      `INSERT INTO exhibition_bookings (exhibition_id, user_id, business_name, contact_phone, booths, products, services, amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, member.id, input.businessName, input.contactPhone, input.booths, input.products ?? null, JSON.stringify(input.services ?? []), money(Number(ex.booth_price) * input.booths)],
    );
    notify(ex.owner_id, {
      kind: "booth",
      title: `Booth request for ${ex.title}`,
      body: `${input.businessName} · ${input.booths} booth(s)`,
      link: "/seller/exhibitions",
      actorId: member.id,
    });
    return c.json({ ok: true }, 201);
  });
