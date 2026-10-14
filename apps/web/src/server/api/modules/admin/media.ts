// The admin media library: everything uploaded from the admin portal
// plus every member upload, searchable, with "where is this used?" checks.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { MediaAssetRow } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { optionalText } from "../../lib/fields.js";
import { idParam, likePattern, pageQuerySchema, paging } from "../../lib/query.js";
import { validate } from "../../lib/validate.js";
import { findById, updateRow } from "../../lib/columns.js";
import { MEDIA_FOLDERS, presignSchema, presignUpload, registerSchema, registerUpload } from "../../lib/uploads.js";
import { deleteObject, locateUrl } from "../../lib/storage.js";
import { logActivity } from "../../lib/activity.js";

const listQuery = pageQuerySchema.extend({
  kind: z.enum(["image", "document", "video"]).optional().catch(undefined),
  folder: z.enum(MEDIA_FOLDERS).optional().catch(undefined),
  source: z.enum(["admin", "member"]).optional().catch(undefined),
});

// Columns that may hold a media URL, for the delete-safety check.
const USAGE: Array<[string, string, Array<string>]> = [
  ["Store", "SELECT id, store_name AS label FROM sellers WHERE logo_url = ? OR banner_url = ? OR id_document_url = ?", ["url", "url", "url"]],
  ["Product", "SELECT id, title AS label FROM products WHERE CAST(images AS CHAR) LIKE ?", ["like"]],
  ["Event", "SELECT id, title AS label FROM ticket_events WHERE cover_url = ?", ["url"]],
  ["Listing", "SELECT id, name AS label FROM finder_listings WHERE cover_url = ? OR logo_url = ? OR CAST(images AS CHAR) LIKE ?", ["url", "url", "like"]],
  ["Group", "SELECT id, name AS label FROM campus_groups WHERE logo_url = ? OR cover_url = ?", ["url", "url"]],
  ["Course", "SELECT id, title AS label FROM courses WHERE cover_url = ? OR promo_video_url = ?", ["url", "url"]],
  ["Lesson", "SELECT id, title AS label FROM course_lessons WHERE video_url = ? OR file_url = ? OR image_url = ? OR content LIKE ?", ["url", "url", "url", "like"]],
  ["Member", "SELECT id, full_name AS label FROM users WHERE avatar_url = ? OR cover_url = ?", ["url", "url"]],
  ["Post", "SELECT id, LEFT(COALESCE(body, 'photo'), 60) AS label FROM social_posts WHERE CAST(images AS CHAR) LIKE ?", ["like"]],
  ["Setting", "SELECT setting_key AS id, setting_key AS label FROM site_settings WHERE CAST(value AS CHAR) LIKE ?", ["like"]],
];

export const mediaRoute = new Hono()
  .use("*", requirePermission("media", "manage"))
  .get("/", async (c) => {
    const q = listQuery.parse(c.req.query());
    const where: Array<string> = [];
    const params: Array<string | number> = [];
    if (q.q) {
      where.push("(m.filename LIKE ? OR m.alt_text LIKE ?)");
      params.push(likePattern(q.q), likePattern(q.q));
    }
    if (q.kind === "image") where.push("m.mime_type LIKE 'image/%'");
    if (q.kind === "video") where.push("m.mime_type LIKE 'video/%'");
    if (q.kind === "document") where.push("m.mime_type NOT LIKE 'image/%' AND m.mime_type NOT LIKE 'video/%'");
    if (q.folder) {
      where.push("m.folder = ?");
      params.push(q.folder);
    }
    if (q.source === "admin") where.push("m.user_id IS NULL");
    if (q.source === "member") where.push("m.user_id IS NOT NULL");
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const { limit, offset } = paging(q.page, q.pageSize);
    const pool = getPool();
    const [[items], [count]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT m.*, COALESCE(a.full_name, u.full_name) AS uploaded_by_name FROM media_assets m
         LEFT JOIN admins a ON a.id = m.uploaded_by LEFT JOIN users u ON u.id = m.user_id
         ${clause} ORDER BY m.id DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      ),
      pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM media_assets m ${clause}`, params),
    ]);
    return c.json({ items, total: Number(count[0]?.n ?? 0) });
  })
  .post("/presign", validate("json", presignSchema), async (c) =>
    c.json(await presignUpload({ adminId: c.get("admin").id }, c.req.valid("json"))),
  )
  .post("/", validate("json", registerSchema), async (c) => {
    const asset = await registerUpload({ adminId: c.get("admin").id }, c.req.valid("json"));
    logActivity(c.get("admin").id, "uploaded", "media", asset.id, `Uploaded ${asset.filename}`);
    return c.json({ asset }, 201);
  })
  .get("/:id/usage", async (c) => {
    const asset = await findById<MediaAssetRow>("media_assets", idParam(c.req.param("id")), "File");
    const pool = getPool();
    const results = await Promise.all(
      USAGE.map(([kind, sql, shape]) =>
        pool
          .query<RowDataPacket[]>(sql, shape.map((s) => (s === "url" ? asset.url : likePattern(asset.url))))
          .then(([rows]) => rows.map((r) => ({ kind, id: r.id as number | string, label: r.label as string }))),
      ),
    );
    return c.json({ usage: results.flat() });
  })
  .patch(
    "/:id",
    validate("json", z.object({ altText: optionalText(255), filename: z.string().trim().min(1).max(255).optional(), folder: z.enum(MEDIA_FOLDERS).optional() })),
    async (c) => {
      const id = idParam(c.req.param("id"));
      await findById("media_assets", id, "File");
      await updateRow("media_assets", id, c.req.valid("json"), { altText: "alt_text", filename: "filename", folder: "folder" });
      return c.json({ asset: await findById<MediaAssetRow>("media_assets", id, "File") });
    },
  )
  .delete("/:id", async (c) => {
    const id = idParam(c.req.param("id"));
    const asset = await findById<MediaAssetRow>("media_assets", id, "File");
    // From wherever it actually lives: files uploaded before a driver switch stay put.
    await deleteObject(asset.file_key, locateUrl(asset.url)?.driver);
    await getPool().execute("DELETE FROM media_assets WHERE id = ?", [id]);
    logActivity(c.get("admin").id, "deleted", "media", id, `Deleted ${asset.filename}`);
    return c.body(null, 204);
  });
