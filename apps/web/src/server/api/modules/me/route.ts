// The signed-in member's own account: profile, password, notifications,
// favourites and file uploads.
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { loadSessionMember, requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl } from "../../lib/fields.js";
import { toColumns, updateSql } from "../../lib/columns.js";
import { AppError } from "../../middleware/error-handler.js";
import { PUBLIC_USER_COLUMNS } from "../../lib/members.js";
import { presignSchema, presignUpload, registerSchema, registerUpload } from "../../lib/uploads.js";

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(150).optional(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9](?:[a-z0-9.]*[a-z0-9])?$/, "Use letters, numbers and dots")
    .optional(),
  headline: optionalText(160),
  bio: optionalText(2000),
  location: optionalText(150),
  phone: optionalText(30),
  website: optionalUrl,
  memberType: z.enum(["public", "student", "staff", "alumni"]).optional(),
  institution: optionalText(150),
  avatarUrl: optionalUrl,
  coverUrl: optionalUrl,
  skills: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  openToWork: z.boolean().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Use at least 8 characters").max(200),
});

const FAVOURITE_TYPES = ["listing", "product", "job", "course", "event", "store"] as const;
const favouriteSchema = z.object({ type: z.enum(FAVOURITE_TYPES), id: z.number().int().positive() });

const FIELDS = {
  fullName: "full_name",
  username: "username",
  headline: "headline",
  bio: "bio",
  location: "location",
  phone: "phone",
  website: "website",
  memberType: "member_type",
  institution: "institution",
  avatarUrl: "avatar_url",
  coverUrl: "cover_url",
  skills: "skills",
  openToWork: "open_to_work",
};

// Each favourite type's table, title column and public link.
const FAVOURITE_SOURCES: Record<(typeof FAVOURITE_TYPES)[number], string> = {
  listing: `SELECT 'listing' AS type, id, name AS title, cover_url AS image, CONCAT('/finder/l/', slug) AS link, type AS subtitle FROM finder_listings WHERE id IN (?)`,
  product: `SELECT 'product' AS type, id, title, JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) AS image, CONCAT('/market/p/', slug) AS link, CONCAT('GHS ', price) AS subtitle FROM products WHERE id IN (?)`,
  job: `SELECT 'job' AS type, id, title, company_logo_url AS image, CONCAT('/market/jobs/', slug) AS link, company_name AS subtitle FROM jobs WHERE id IN (?)`,
  course: `SELECT 'course' AS type, id, title, cover_url AS image, CONCAT('/learn/c/', slug) AS link, subtitle FROM courses WHERE id IN (?)`,
  event: `SELECT 'event' AS type, id, title, cover_url AS image, CONCAT('/market/tickets/e/', slug) AS link, venue AS subtitle FROM ticket_events WHERE id IN (?)`,
  store: `SELECT 'store' AS type, id, store_name AS title, logo_url AS image, CONCAT('/market/store/', slug) AS link, tagline AS subtitle FROM sellers WHERE id IN (?)`,
};

export const meRoute = new Hono()
  .use("*", requireMember)
  .get("/profile", async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT ${PUBLIC_USER_COLUMNS}, email, phone FROM users WHERE id = ?`,
      [c.get("member").id],
    );
    return c.json({ profile: rows[0] });
  })
  .patch("/profile", validate("json", profileSchema), async (c) => {
    const id = c.get("member").id;
    const input = c.req.valid("json");
    if (input.username) {
      const [taken] = await getPool().execute<RowDataPacket[]>(
        "SELECT id FROM users WHERE username = ? AND id <> ?",
        [input.username, id],
      );
      if (taken[0]) throw new AppError("That username is taken.", 409);
    }
    const { columns, params } = toColumns(input, FIELDS);
    if (columns.length) await getPool().execute(updateSql("users", columns), [...params, id]);
    return c.json({ member: await loadSessionMember(id) });
  })
  .post("/password", validate("json", passwordSchema), async (c) => {
    const id = c.get("member").id;
    const { currentPassword, newPassword } = c.req.valid("json");
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT password_hash FROM users WHERE id = ?", [id]);
    const hash = rows[0]?.password_hash as string | null;
    // Google-only accounts can set a first password without a current one.
    if (hash && !(await bcrypt.compare(currentPassword ?? "", hash))) {
      throw new AppError("Current password is incorrect.", 401);
    }
    await getPool().execute("UPDATE users SET password_hash = ? WHERE id = ?", [await bcrypt.hash(newPassword, 12), id]);
    return c.json({ ok: true });
  })
  .get("/notifications", async (c) => {
    const id = c.get("member").id;
    const pool = getPool();
    const [[items], [unread]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT n.*, u.full_name AS actor_name, u.avatar_url AS actor_avatar FROM notifications n
         LEFT JOIN users u ON u.id = n.actor_id WHERE n.user_id = ? ORDER BY n.id DESC LIMIT 40`,
        [id],
      ),
      pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND read_at IS NULL", [id]),
    ]);
    return c.json({ items, unread: Number(unread[0]?.n ?? 0) });
  })
  .get("/counts", async (c) => {
    const id = c.get("member").id;
    const pool = getPool();
    const [[n], [m], [f]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND read_at IS NULL", [id]),
      pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS n FROM chat_participants p JOIN chat_threads t ON t.id = p.thread_id
          WHERE p.user_id = ? AND t.type = 'direct' AND t.last_message_at IS NOT NULL
            AND (p.last_read_at IS NULL OR p.last_read_at < t.last_message_at)`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS n FROM friendships WHERE addressee_id = ? AND status = 'pending'",
        [id],
      ),
    ]);
    return c.json({
      notifications: Number(n[0]?.n ?? 0),
      messages: Number(m[0]?.n ?? 0),
      friendRequests: Number(f[0]?.n ?? 0),
    });
  })
  .post("/notifications/read", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as { id?: number };
    const id = c.get("member").id;
    if (body.id) {
      await getPool().execute("UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?", [body.id, id]);
    } else {
      await getPool().execute("UPDATE notifications SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL", [id]);
    }
    return c.json({ ok: true });
  })
  .get("/favourites", async (c) => {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT entity_type, entity_id, created_at FROM favourites WHERE user_id = ? ORDER BY created_at DESC",
      [c.get("member").id],
    );
    const byType = new Map<string, Array<number>>();
    for (const r of rows) byType.set(r.entity_type, [...(byType.get(r.entity_type) ?? []), r.entity_id]);
    const items = (
      await Promise.all(
        [...byType].map(([type, ids]) =>
          pool
            .query<RowDataPacket[]>(FAVOURITE_SOURCES[type as keyof typeof FAVOURITE_SOURCES], [ids])
            .then(([r]) => r),
        ),
      )
    ).flat();
    const order = new Map(rows.map((r, i) => [`${r.entity_type}:${r.entity_id}`, i]));
    items.sort((a, b) => (order.get(`${a.type}:${a.id}`) ?? 0) - (order.get(`${b.type}:${b.id}`) ?? 0));
    return c.json({ items, keys: rows.map((r) => `${r.entity_type}:${r.entity_id}`) });
  })
  .post("/favourites", validate("json", favouriteSchema), async (c) => {
    const { type, id } = c.req.valid("json");
    const userId = c.get("member").id;
    const [removed] = await getPool().execute<ResultSetHeader>(
      "DELETE FROM favourites WHERE user_id = ? AND entity_type = ? AND entity_id = ?",
      [userId, type, id],
    );
    if (removed.affectedRows) return c.json({ saved: false });
    await getPool().execute("INSERT INTO favourites (user_id, entity_type, entity_id) VALUES (?, ?, ?)", [userId, type, id]);
    return c.json({ saved: true });
  })
  .get("/uploads", async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT * FROM media_assets WHERE user_id = ? ORDER BY id DESC LIMIT 60",
      [c.get("member").id],
    );
    return c.json({ items: rows });
  })
  .post("/uploads/presign", validate("json", presignSchema), async (c) =>
    c.json(await presignUpload({ userId: c.get("member").id }, c.req.valid("json"))),
  )
  .post("/uploads", validate("json", registerSchema), async (c) =>
    c.json({ asset: await registerUpload({ userId: c.get("member").id }, c.req.valid("json")) }, 201),
  );
