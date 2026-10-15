// Admin → Members: create, edit and delete member accounts (the list,
// suspend and verify actions live in moderation.ts).
//
// Deleting is deliberately strict. Most member data cascades on delete, and
// some of it belongs to other people: a seller's store takes its customers'
// orders and tickets with it, and a buyer's orders are part of a seller's
// sales record. So a member with any trade history can't be deleted; they
// can be suspended instead. Members without one are removed outright.
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { validate } from "../../lib/validate.js";
import { optionalText } from "../../lib/fields.js";
import { toColumns, insertSql, updateSql } from "../../lib/columns.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";

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

// What stops a delete: records that other people (or the books) depend on.
const BLOCKERS: Array<[one: string, many: string, sql: string]> = [
  ["order placed", "orders placed", "SELECT COUNT(*) AS n FROM orders WHERE user_id = ?"],
  ["order received by their store", "orders received by their store", "SELECT COUNT(*) AS n FROM orders o JOIN sellers s ON s.id = o.seller_id WHERE s.user_id = ?"],
  ["ticket bought", "tickets bought", "SELECT COUNT(*) AS n FROM tickets WHERE user_id = ?"],
  [
    "ticket sold for their events and trips",
    "tickets sold for their events and trips",
    `SELECT COUNT(*) AS n FROM tickets t
       LEFT JOIN ticket_events e ON e.id = t.event_id LEFT JOIN bus_trips b ON b.id = t.trip_id
       JOIN sellers s ON s.id = COALESCE(e.seller_id, b.seller_id) WHERE s.user_id = ?`,
  ],
  [
    "exhibition booking for their exhibitions",
    "exhibition bookings for their exhibitions",
    "SELECT COUNT(*) AS n FROM exhibition_bookings bk JOIN exhibitions x ON x.id = bk.exhibition_id JOIN sellers s ON s.id = x.seller_id WHERE s.user_id = ?",
  ],
  [
    "rental request for their buses",
    "rental requests for their buses",
    "SELECT COUNT(*) AS n FROM rental_requests rr JOIN bus_rentals r ON r.id = rr.rental_id JOIN sellers s ON s.id = r.seller_id WHERE s.user_id = ?",
  ],
  ["student enrolled in their courses", "students enrolled in their courses", "SELECT COUNT(*) AS n FROM enrollments en JOIN courses c ON c.id = en.course_id WHERE c.instructor_id = ? AND en.user_id <> c.instructor_id"],
  ["broadcast credit", "broadcast credits", "SELECT COALESCE(SUM(balance), 0) AS n FROM broadcast_wallets WHERE user_id = ?"],
];

async function deleteCheck(id: number) {
  const pool = getPool();
  const counts = await Promise.all(BLOCKERS.map(([, , sql]) => pool.execute<RowDataPacket[]>(sql, [id]).then(([r]) => Number(r[0]?.n ?? 0))));
  return BLOCKERS.map(([one, many], i) => ({ label: counts[i] === 1 ? one : many, count: counts[i]! })).filter((b) => b.count > 0);
}

export const adminMembersRoute = new Hono()
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
  .get("/:id/delete-check", requirePermission("members", "manage"), async (c) => {
    return c.json({ blockers: await deleteCheck(idParam(c.req.param("id"))) });
  })
  .delete("/:id", requirePermission("members", "manage"), async (c) => {
    const id = idParam(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id, full_name, username FROM users WHERE id = ?", [id]);
    if (!rows[0]) throw new AppError("Member not found.", 404);
    const blockers = await deleteCheck(id);
    if (blockers.length) {
      throw new AppError(
        `This member can't be deleted because they have ${blockers.map((b) => `${b.count} ${b.label}`).join(", ")}. Suspend the account instead.`,
        409,
      );
    }
    await getPool().execute("DELETE FROM users WHERE id = ?", [id]);
    logActivity(c.get("admin").id, "deleted", "members", id, `Deleted member ${rows[0].full_name} (@${rows[0].username})`);
    return c.body(null, 204);
  });
