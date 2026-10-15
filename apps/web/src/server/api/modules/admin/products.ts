// Admin → Products & food: platform-wide analytics, and editing any
// seller's product or menu item (listing in the moderation queue lives in
// moderation.ts).
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
import { analyticsQuerySchema, productAnalytics } from "../../lib/product-analytics.js";
import { PRODUCT_FIELDS, productSchema } from "../seller/route.js";

// Same fields a seller edits, plus "blocked" (moderators' own status). The
// kind (product or food) stays as the seller listed it.
const adminProductSchema = productSchema
  .omit({ kind: true, status: true })
  .extend({ status: z.enum(["active", "draft", "hidden", "blocked"]).optional() })
  .partial();

const idParam = (raw: string | undefined) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new AppError("Not found.", 404);
  return id;
};

export const adminProductsRoute = new Hono()
  .get("/analytics", requirePermission("products", "view"), async (c) => {
    return c.json(await productAnalytics(analyticsQuerySchema.parse(c.req.query())));
  })
  .get("/:id", requirePermission("products", "view"), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT p.*, s.store_name, s.user_id AS owner_id FROM products p JOIN sellers s ON s.id = p.seller_id WHERE p.id = ?`,
      [idParam(c.req.param("id"))],
    );
    if (!rows[0]) throw new AppError("Product not found.", 404);
    return c.json({ product: rows[0] });
  })
  .patch("/:id", requirePermission("products", "manage"), validate("json", adminProductSchema), async (c) => {
    const id = idParam(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT p.id, p.title, s.user_id AS owner_id FROM products p JOIN sellers s ON s.id = p.seller_id WHERE p.id = ?",
      [id],
    );
    const current = rows[0];
    if (!current) throw new AppError("Product not found.", 404);
    const input = c.req.valid("json");
    const { columns, params } = toColumns(input, PRODUCT_FIELDS);
    if (columns.length) await getPool().execute(updateSql("products", columns), [...params, id]);
    const admin = c.get("admin");
    logActivity(admin.id, "updated", "products", id, `Edited product: ${String(input.title ?? current.title).slice(0, 200)}`);
    notify(current.owner_id as number, {
      kind: "moderation",
      title: `A moderator updated your listing "${String(input.title ?? current.title)}"`,
      link: "/seller/products",
    });
    return c.json({ ok: true });
  });
