// Admin-managed catalogs: marketplace categories, course categories, and
// Finder listings created directly by the admin team (published at once).
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl } from "../../lib/fields.js";
import { toColumns, insertSql, updateSql } from "../../lib/columns.js";
import { uniqueSlug } from "../../lib/slug.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";
import { FINDER_TYPES, LISTING_FIELDS } from "../finder/route.js";

const marketCategory = z.object({
  name: z.string().trim().min(2).max(100),
  parentId: z.number().int().positive().nullable().optional(),
  icon: z.string().trim().min(1).max(40).optional(),
  imageUrl: optionalUrl,
  description: optionalText(255),
  isFood: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),
});
const courseCategory = z.object({
  name: z.string().trim().min(2).max(100),
  icon: z.string().trim().min(1).max(40).optional(),
  description: optionalText(255),
  sortOrder: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),
});
const MC_FIELDS = { name: "name", parentId: "parent_id", icon: "icon", imageUrl: "image_url", description: "description", isFood: "is_food", sortOrder: "sort_order", isActive: "is_active" };
const CC_FIELDS = { name: "name", icon: "icon", description: "description", sortOrder: "sort_order", isActive: "is_active" };

const listingSchema = z.object({
  type: z.enum(FINDER_TYPES),
  name: z.string().trim().min(2).max(200),
  tagline: optionalText(255),
  description: optionalText(10_000),
  category: optionalText(80),
  coverUrl: optionalUrl,
  logoUrl: optionalUrl,
  images: z.array(z.string().url().max(500)).max(12).optional(),
  address: optionalText(255),
  area: optionalText(100),
  city: optionalText(100),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  phone: optionalText(30),
  whatsapp: optionalText(30),
  email: optionalText(150),
  website: optionalUrl,
  priceFrom: z.number().min(0).nullable().optional(),
  priceTo: z.number().min(0).nullable().optional(),
  priceUnit: optionalText(30),
  starRating: z.number().int().min(1).max(5).nullable().optional(),
  amenities: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  openingHours: optionalText(200),
  isVerified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});
const ADMIN_LISTING_FIELDS = { ...LISTING_FIELDS, isVerified: "is_verified", isFeatured: "is_featured" };

export const catalogRoute = new Hono()
  .get("/market-categories", requirePermission("categories", "view"), async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
       FROM market_categories c ORDER BY COALESCE(c.parent_id, c.id), c.parent_id IS NOT NULL, c.sort_order, c.name`,
    );
    return c.json({ items });
  })
  .post("/market-categories", requirePermission("categories", "manage"), validate("json", marketCategory), async (c) => {
    const input = c.req.valid("json");
    const slug = await uniqueSlug("market_categories", input.name, null);
    const { columns, params } = toColumns(input, MC_FIELDS);
    const [res] = await getPool().execute<ResultSetHeader>(insertSql("market_categories", [...columns, "slug"]), [...params, slug]);
    logActivity(c.get("admin").id, "created", "market_category", res.insertId, `Created category ${input.name}`);
    return c.json({ id: res.insertId }, 201);
  })
  .patch("/market-categories/:id", requirePermission("categories", "manage"), validate("json", marketCategory.partial()), async (c) => {
    const id = Number(c.req.param("id"));
    const input = c.req.valid("json");
    if (input.parentId === id) throw new AppError("A category can't be its own parent.", 422);
    const { columns, params } = toColumns(input, MC_FIELDS);
    if (columns.length) await getPool().execute(updateSql("market_categories", columns), [...params, id]);
    logActivity(c.get("admin").id, "updated", "market_category", id, `Updated category ${input.name ?? id}`);
    return c.json({ ok: true });
  })
  .delete("/market-categories/:id", requirePermission("categories", "manage"), async (c) => {
    const id = Number(c.req.param("id"));
    await getPool().execute("DELETE FROM market_categories WHERE id = ?", [id]);
    logActivity(c.get("admin").id, "deleted", "market_category", id, `Deleted category #${id}`);
    return c.body(null, 204);
  })
  .get("/course-categories", requirePermission("categories", "view"), async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      "SELECT c.*, (SELECT COUNT(*) FROM courses x WHERE x.category_id = c.id) AS course_count FROM course_categories c ORDER BY c.sort_order, c.name",
    );
    return c.json({ items });
  })
  .post("/course-categories", requirePermission("categories", "manage"), validate("json", courseCategory), async (c) => {
    const input = c.req.valid("json");
    const slug = await uniqueSlug("course_categories", input.name, null);
    const { columns, params } = toColumns(input, CC_FIELDS);
    const [res] = await getPool().execute<ResultSetHeader>(insertSql("course_categories", [...columns, "slug"]), [...params, slug]);
    logActivity(c.get("admin").id, "created", "course_category", res.insertId, `Created course category ${input.name}`);
    return c.json({ id: res.insertId }, 201);
  })
  .patch("/course-categories/:id", requirePermission("categories", "manage"), validate("json", courseCategory.partial()), async (c) => {
    const id = Number(c.req.param("id"));
    const { columns, params } = toColumns(c.req.valid("json"), CC_FIELDS);
    if (columns.length) await getPool().execute(updateSql("course_categories", columns), [...params, id]);
    return c.json({ ok: true });
  })
  .delete("/course-categories/:id", requirePermission("categories", "manage"), async (c) => {
    await getPool().execute("DELETE FROM course_categories WHERE id = ?", [Number(c.req.param("id"))]);
    return c.body(null, 204);
  })
  .get("/listings/:id", requirePermission("finder", "view"), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM finder_listings WHERE id = ?", [Number(c.req.param("id"))]);
    if (!rows[0]) throw new AppError("Listing not found.", 404);
    return c.json({ listing: rows[0] });
  })
  .post("/listings", requirePermission("finder", "manage"), validate("json", listingSchema), async (c) => {
    const input = c.req.valid("json");
    const slug = await uniqueSlug("finder_listings", `${input.name} ${input.area ?? input.city ?? ""}`, null);
    const { columns, params } = toColumns(input, ADMIN_LISTING_FIELDS);
    const [res] = await getPool().execute<ResultSetHeader>(insertSql("finder_listings", [...columns, "slug", "status"]), [...params, slug, "published"]);
    logActivity(c.get("admin").id, "created", "listings", res.insertId, `Added Finder listing ${input.name}`);
    return c.json({ id: res.insertId, slug }, 201);
  })
  .patch("/listings/:id", requirePermission("finder", "manage"), validate("json", listingSchema.partial()), async (c) => {
    const id = Number(c.req.param("id"));
    const { columns, params } = toColumns(c.req.valid("json"), ADMIN_LISTING_FIELDS);
    if (columns.length) await getPool().execute(updateSql("finder_listings", columns), [...params, id]);
    logActivity(c.get("admin").id, "updated", "listings", id, `Edited Finder listing #${id}`);
    return c.json({ ok: true });
  });
