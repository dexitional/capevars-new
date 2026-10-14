// The Finder: a search engine for people, places, businesses, hostels,
// hotels and restaurants. Members can submit and manage listings (each is
// reviewed before it goes live), review them, and save them to favourites.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { memberOrNull, optionalMember, requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl, urlListSchema } from "../../lib/fields.js";
import { pageQuerySchema, paging } from "../../lib/query.js";
import { textSearch } from "../../lib/search.js";
import { toColumns, insertSql, updateSql } from "../../lib/columns.js";
import { uniqueSlug } from "../../lib/slug.js";
import { AppError } from "../../middleware/error-handler.js";

export const FINDER_TYPES = ["person", "place", "business", "hostel", "hotel", "restaurant"] as const;

const listingSchema = z.object({
  type: z.enum(FINDER_TYPES),
  name: z.string().trim().min(2).max(200),
  tagline: optionalText(255),
  description: optionalText(10_000),
  category: optionalText(80),
  coverUrl: optionalUrl,
  logoUrl: optionalUrl,
  images: urlListSchema(12).optional(),
  address: optionalText(255),
  area: optionalText(100),
  city: optionalText(100),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  phone: optionalText(30),
  whatsapp: optionalText(30),
  email: optionalText(150),
  website: optionalUrl,
  priceFrom: z.number().min(0).max(100_000_000).nullable().optional(),
  priceTo: z.number().min(0).max(100_000_000).nullable().optional(),
  priceUnit: optionalText(30),
  starRating: z.number().int().min(1).max(5).nullable().optional(),
  amenities: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  openingHours: optionalText(200),
  attributes: z.record(z.string().max(40), z.string().max(200)).optional(),
});
export const LISTING_FIELDS = {
  type: "type",
  name: "name",
  tagline: "tagline",
  description: "description",
  category: "category",
  coverUrl: "cover_url",
  logoUrl: "logo_url",
  images: "images",
  address: "address",
  area: "area",
  city: "city",
  latitude: "latitude",
  longitude: "longitude",
  phone: "phone",
  whatsapp: "whatsapp",
  email: "email",
  website: "website",
  priceFrom: "price_from",
  priceTo: "price_to",
  priceUnit: "price_unit",
  starRating: "star_rating",
  amenities: "amenities",
  openingHours: "opening_hours",
  attributes: "attributes",
};

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: optionalText(150),
  body: optionalText(2000),
});

const searchSchema = pageQuerySchema.extend({
  type: z.enum(FINDER_TYPES).optional().catch(undefined),
  city: z.string().max(100).optional().catch(undefined),
  area: z.string().max(100).optional().catch(undefined),
  category: z.string().max(80).optional().catch(undefined),
  min: z.coerce.number().min(0).optional().catch(undefined),
  max: z.coerce.number().min(0).optional().catch(undefined),
  rating: z.coerce.number().min(0).max(5).optional().catch(undefined),
  stars: z.coerce.number().int().min(1).max(5).optional().catch(undefined),
  amenity: z.string().max(200).optional().catch(undefined),
  verified: z.coerce.boolean().optional().catch(undefined),
  sort: z.enum(["recommended", "rating", "price_asc", "price_desc", "newest", "popular"]).catch("recommended"),
});

const CARD = `l.id, l.type, l.name, l.slug, l.tagline, l.category, l.cover_url, l.logo_url, l.area, l.city, l.address,
  l.price_from, l.price_to, l.price_unit, l.star_rating, l.amenities, l.rating_avg, l.rating_count, l.is_verified, l.is_featured,
  l.phone, l.whatsapp, l.opening_hours`;

async function recalcRating(listingId: number) {
  await getPool().execute(
    `UPDATE finder_listings l SET
       rating_avg = (SELECT ROUND(AVG(rating), 1) FROM finder_reviews WHERE listing_id = l.id AND is_hidden = 0),
       rating_count = (SELECT COUNT(*) FROM finder_reviews WHERE listing_id = l.id AND is_hidden = 0)
     WHERE l.id = ?`,
    [listingId],
  );
}

export const finderRoute = new Hono()
  .get("/home", async (c) => {
    const pool = getPool();
    const [[counts], [featured], [topRated], [cities]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT type, COUNT(*) AS n FROM finder_listings WHERE status = 'published' GROUP BY type"),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM finder_listings l WHERE l.status = 'published' ORDER BY l.is_featured DESC, l.rating_avg DESC, l.id DESC LIMIT 60`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM finder_listings l WHERE l.status = 'published' AND l.rating_count > 0
         ORDER BY l.rating_avg DESC, l.rating_count DESC LIMIT 8`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT city, COUNT(*) AS n, MAX(cover_url) AS cover_url FROM finder_listings
         WHERE status = 'published' AND city IS NOT NULL GROUP BY city ORDER BY n DESC LIMIT 8`,
      ),
    ]);
    // Up to 8 featured cards per type, for the home page carousels.
    const byType: Record<string, Array<RowDataPacket>> = {};
    for (const row of featured) {
      const list = (byType[row.type] ??= []);
      if (list.length < 8) list.push(row);
    }
    return c.json({ counts: Object.fromEntries(counts.map((r) => [r.type, Number(r.n)])), byType, topRated, cities });
  })
  .get("/search", async (c) => {
    const q = searchSchema.parse(c.req.query());
    const where = ["l.status = 'published'"];
    const params: Array<string | number> = [];
    if (q.type) {
      where.push("l.type = ?");
      params.push(q.type);
    }
    for (const [col, v] of [["l.city", q.city], ["l.area", q.area], ["l.category", q.category]] as const) {
      if (v) {
        where.push(`${col} = ?`);
        params.push(v);
      }
    }
    if (q.min !== undefined) {
      where.push("COALESCE(l.price_to, l.price_from) >= ?");
      params.push(q.min);
    }
    if (q.max) {
      where.push("l.price_from <= ?");
      params.push(q.max);
    }
    if (q.rating) {
      where.push("l.rating_avg >= ?");
      params.push(q.rating);
    }
    if (q.stars) {
      where.push("l.star_rating >= ?");
      params.push(q.stars);
    }
    if (q.verified) where.push("l.is_verified = 1");
    for (const amenity of (q.amenity ?? "").split(",").map((a) => a.trim()).filter(Boolean).slice(0, 8)) {
      where.push("JSON_CONTAINS(l.amenities, JSON_QUOTE(?))");
      params.push(amenity);
    }
    if (q.q) {
      const s = textSearch("l.name, l.tagline, l.description, l.address, l.area, l.category", ["l.name", "l.area", "l.category"], q.q);
      where.push(s.sql);
      params.push(...s.params);
    }
    const order = {
      recommended: "l.is_featured DESC, l.is_verified DESC, l.rating_avg IS NULL, l.rating_avg DESC, l.view_count DESC",
      rating: "l.rating_avg IS NULL, l.rating_avg DESC, l.rating_count DESC",
      price_asc: "l.price_from IS NULL, l.price_from ASC",
      price_desc: "l.price_from IS NULL, l.price_from DESC",
      newest: "l.id DESC",
      popular: "l.view_count DESC",
    }[q.sort];
    const { limit, offset } = paging(q.page, q.pageSize);
    const clause = where.join(" AND ");
    const pool = getPool();
    const [[items], [count], [facets]] = await Promise.all([
      pool.query<RowDataPacket[]>(`SELECT ${CARD} FROM finder_listings l WHERE ${clause} ORDER BY ${order} LIMIT ? OFFSET ?`, [
        ...params,
        limit,
        offset,
      ]),
      pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM finder_listings l WHERE ${clause}`, params),
      pool.query<RowDataPacket[]>(
        `SELECT 'city' AS facet, city AS value, COUNT(*) AS n FROM finder_listings WHERE status = 'published' ${q.type ? "AND type = ?" : ""} AND city IS NOT NULL GROUP BY city
         UNION ALL
         SELECT 'area', area, COUNT(*) FROM finder_listings WHERE status = 'published' ${q.type ? "AND type = ?" : ""} AND area IS NOT NULL GROUP BY area
         UNION ALL
         SELECT 'category', category, COUNT(*) FROM finder_listings WHERE status = 'published' ${q.type ? "AND type = ?" : ""} AND category IS NOT NULL GROUP BY category`,
        q.type ? [q.type, q.type, q.type] : [],
      ),
    ]);
    const group = (name: string) =>
      facets.filter((f) => f.facet === name).map((f) => ({ value: f.value as string, count: Number(f.n) })).sort((a, b) => b.count - a.count);
    return c.json({
      items,
      total: Number(count[0]?.n ?? 0),
      facets: { city: group("city"), area: group("area"), category: group("category") },
    });
  })
  .get("/mine", requireMember, async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT ${CARD}, l.status, l.status_reason, l.view_count FROM finder_listings l WHERE l.user_id = ? ORDER BY l.id DESC`,
      [c.get("member").id],
    );
    return c.json({ items });
  })
  .get("/l/:slug", optionalMember, async (c) => {
    const pool = getPool();
    const member = memberOrNull(c);
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM finder_listings WHERE slug = ?", [(c.req.param("slug") ?? "")]);
    const listing = rows[0];
    if (!listing || (listing.status !== "published" && listing.user_id !== member?.id)) {
      throw new AppError("Listing not found.", 404);
    }
    void pool.execute("UPDATE finder_listings SET view_count = view_count + 1 WHERE id = ?", [listing.id]);
    const [[reviews], [similar], [breakdown]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT r.id, r.rating, r.title, r.body, r.created_at, u.full_name, u.username, u.avatar_url
         FROM finder_reviews r JOIN users u ON u.id = r.user_id WHERE r.listing_id = ? AND r.is_hidden = 0 ORDER BY r.id DESC LIMIT 50`,
        [listing.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM finder_listings l WHERE l.status = 'published' AND l.type = ? AND l.id <> ?
         ORDER BY (l.area <=> ?) DESC, (l.city <=> ?) DESC, l.rating_avg DESC LIMIT 6`,
        [listing.type, listing.id, listing.area, listing.city],
      ),
      pool.query<RowDataPacket[]>(
        "SELECT rating, COUNT(*) AS n FROM finder_reviews WHERE listing_id = ? AND is_hidden = 0 GROUP BY rating",
        [listing.id],
      ),
    ]);
    const myReview = member ? (reviews.find((r) => r.username === member.username) ?? null) : null;
    return c.json({
      listing,
      reviews,
      similar,
      breakdown: Object.fromEntries(breakdown.map((b) => [b.rating, Number(b.n)])),
      isOwner: member?.id === listing.user_id,
      myReview,
    });
  })
  .post("/l/:id/reviews", requireMember, validate("json", reviewSchema), async (c) => {
    const id = Number(c.req.param("id"));
    const member = c.get("member");
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT id, user_id FROM finder_listings WHERE id = ? AND status = 'published'",
      [id],
    );
    if (!rows[0]) throw new AppError("Listing not found.", 404);
    if (rows[0].user_id === member.id) throw new AppError("You can't review your own listing.", 403);
    const input = c.req.valid("json");
    await getPool().execute(
      `INSERT INTO finder_reviews (listing_id, user_id, rating, title, body) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), title = VALUES(title), body = VALUES(body)`,
      [id, member.id, input.rating, input.title ?? null, input.body ?? null],
    );
    await recalcRating(id);
    return c.json({ ok: true });
  })
  .post("/listings", requireMember, validate("json", listingSchema), async (c) => {
    const input = c.req.valid("json");
    const slug = await uniqueSlug("finder_listings", `${input.name} ${input.area ?? input.city ?? ""}`, null);
    const { columns, params } = toColumns(input, LISTING_FIELDS);
    await getPool().execute(insertSql("finder_listings", [...columns, "user_id", "slug"]), [...params, c.get("member").id, slug]);
    return c.json({ slug }, 201);
  })
  .patch("/listings/:id", requireMember, validate("json", listingSchema.partial()), async (c) => {
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id, status FROM finder_listings WHERE id = ? AND user_id = ?", [
      id,
      c.get("member").id,
    ]);
    if (!rows[0]) throw new AppError("Listing not found.", 404);
    if (rows[0].status === "hidden") throw new AppError("This listing was hidden by moderators.", 403);
    const { columns, params } = toColumns(c.req.valid("json"), LISTING_FIELDS);
    // Edits to a rejected listing resubmit it for review.
    if (rows[0].status === "rejected") {
      columns.push("status");
      params.push("pending");
    }
    if (columns.length) await getPool().execute(updateSql("finder_listings", columns), [...params, id]);
    return c.json({ ok: true });
  })
  .get("/listings/:id/edit", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM finder_listings WHERE id = ? AND user_id = ?", [
      Number(c.req.param("id")),
      c.get("member").id,
    ]);
    if (!rows[0]) throw new AppError("Listing not found.", 404);
    return c.json({ listing: rows[0] });
  })
  .delete("/listings/:id", requireMember, async (c) => {
    await getPool().execute("DELETE FROM finder_listings WHERE id = ? AND user_id = ?", [Number(c.req.param("id")), c.get("member").id]);
    return c.body(null, 204);
  });
