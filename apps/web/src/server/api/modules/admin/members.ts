// Admin → Members: create, edit and delete member accounts (the list,
// suspend and verify actions live in moderation.ts).
//
// Deleting removes the member and everything tied to them, including records
// other people rely on (see lib/member-purge.ts), so the admin reads a preview
// first and confirms by sending back the member's username.
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requireAdminRole, requirePermission } from "../../middleware/require-auth.js";
import { rolesWith } from "#/lib/permissions";
import { likePattern } from "../../lib/query.js";
import { validate } from "../../lib/validate.js";
import { optionalText } from "../../lib/fields.js";
import { toColumns, insertSql, updateSql } from "../../lib/columns.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";
import { purgeMember, purgePreview } from "../../lib/member-purge.js";
import { mediaUsage } from "./media.js";

const memberSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the member's full name").max(150),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.]{3,40}$/, "Usernames use 3–40 letters, numbers, dots or underscores"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(150),
  phone: optionalText(30),
  memberType: z.enum(["public", "student", "staff", "alumni"]),
  institution: optionalText(150),
  headline: optionalText(160),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  // Required when creating; on edit, only sent to set a new password.
  password: z.string().min(8, "Use at least 8 characters").max(200).optional(),
});

const FIELDS = {
  fullName: "full_name",
  username: "username",
  email: "email",
  phone: "phone",
  memberType: "member_type",
  institution: "institution",
  headline: "headline",
  isVerified: "is_verified",
  isActive: "is_active",
};

const MEMBER_COLUMNS = `id, full_name, username, email, phone, member_type, institution, headline, avatar_url, is_verified,
  is_active, google_sub IS NOT NULL AS uses_google, password_hash IS NOT NULL AS has_password, last_login_at, created_at`;

const idParam = (raw: string | undefined) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new AppError("Member not found.", 404);
  return id;
};

// Email and username are unique: say which one clashes rather than a raw DB error.
async function assertUnique(email: string | undefined, username: string | undefined, exceptId?: number) {
  if (!email && !username) return;
  const [rows] = await getPool().execute<RowDataPacket[]>(
    "SELECT email, username FROM users WHERE (email = ? OR username = ?) AND id <> ? LIMIT 2",
    [email ?? "", username ?? "", exceptId ?? 0],
  );
  if (rows.some((r) => email && r.email === email)) throw new AppError("Another member already uses that email address.", 409);
  if (rows.some((r) => username && r.username === username)) throw new AppError("That username is taken.", 409);
}

// Whoever may add listings on a member's behalf can look members up, even without the Members page.
const LOOKUP_ROLES = [...new Set([...rolesWith("products", "manage"), ...rolesWith("tickets", "manage"), ...rolesWith("jobs", "manage")])];

export const adminMembersRoute = new Hono()
  .get("/lookup", requireAdminRole(LOOKUP_ROLES), async (c) => {
    const q = (c.req.query("q") ?? "").trim().slice(0, 100);
    const sellers = c.req.query("sellers") === "1";
    const where = [...(sellers ? ["s.id IS NOT NULL"] : []), ...(q ? ["(u.full_name LIKE ? OR u.username LIKE ? OR u.email LIKE ? OR s.store_name LIKE ?)"] : [])];
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT u.id, u.full_name, u.username, u.email, u.is_active, s.store_name, s.status AS store_status
       FROM users u LEFT JOIN sellers s ON s.user_id = u.id ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY u.full_name LIMIT 25`,
      q ? Array.from({ length: 4 }, () => likePattern(q)) : [],
    );
    return c.json({ items: rows });
  })
  .get("/:id", requirePermission("members", "view"), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(`SELECT ${MEMBER_COLUMNS} FROM users WHERE id = ?`, [idParam(c.req.param("id"))]);
    if (!rows[0]) throw new AppError("Member not found.", 404);
    return c.json({ member: rows[0] });
  })
  .post("/", requirePermission("members", "manage"), validate("json", memberSchema), async (c) => {
    const input = c.req.valid("json");
    if (!input.password) throw new AppError("Set a password for the new member.", 422);
    await assertUnique(input.email, input.username);
    const { columns, params } = toColumns({ isActive: true, ...input }, FIELDS);
    const [res] = await getPool().execute<ResultSetHeader>(insertSql("users", [...columns, "password_hash"]), [
      ...params,
      await bcrypt.hash(input.password, 12),
    ]);
    logActivity(c.get("admin").id, "created", "members", res.insertId, `Created member ${input.fullName} (@${input.username})`);
    return c.json({ id: res.insertId }, 201);
  })
  .patch("/:id", requirePermission("members", "manage"), validate("json", memberSchema.partial()), async (c) => {
    const id = idParam(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id, full_name FROM users WHERE id = ?", [id]);
    if (!rows[0]) throw new AppError("Member not found.", 404);
    const input = c.req.valid("json");
    await assertUnique(input.email, input.username, id);
    const { columns, params } = toColumns(input, FIELDS);
    if (input.password) {
      // A new password also clears any sign-in lockout.
      columns.push("password_hash", "failed_login_attempts", "locked_until");
      params.push(await bcrypt.hash(input.password, 12), 0, null);
    }
    if (input.isActive && !input.password) {
      columns.push("failed_login_attempts");
      params.push(0);
    }
    if (columns.length) await getPool().execute(updateSql("users", columns), [...params, id]);
    logActivity(
      c.get("admin").id,
      "updated",
      "members",
      id,
      `Edited member ${input.fullName ?? rows[0].full_name}${input.password ? " (password reset)" : ""}`,
    );
    return c.json({ ok: true });
  })
  .get("/:id/delete-preview", requirePermission("members", "manage"), async (c) => {
    return c.json(await purgePreview(idParam(c.req.param("id"))));
  })
  .delete("/:id", requirePermission("members", "manage"), async (c) => {
    const id = idParam(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id, full_name, username FROM users WHERE id = ?", [id]);
    if (!rows[0]) throw new AppError("Member not found.", 404);
    if (c.req.query("confirm") !== rows[0].username) throw new AppError("Type the member's username to confirm.", 422);
    const removed = await purgeMember(id, async (url) => (await mediaUsage(url)).length > 0);
    logActivity(c.get("admin").id, "deleted", "members", id, `Deleted member ${rows[0].full_name} (@${rows[0].username}) and ${removed} related records`);
    return c.body(null, 204);
  });
