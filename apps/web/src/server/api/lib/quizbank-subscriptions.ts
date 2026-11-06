// Quizbank course subscriptions, paid by hand into a mobile money wallet like
// LeadGen credits: the member sends the money and gives the transaction ID, the
// wallet's owner gets an SMS, and an admin confirms it, which starts the access.
//
// A course with its subscription off is free. With it on, its questions reach
// only members with an active subscription, and every route that returns
// question text, answers or lessons checks through this file.
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { DEFAULT_SETTINGS, mergeSetting } from "#/lib/settings";
import { networkName } from "#/lib/credits";
import { AppError } from "../middleware/error-handler.js";
import { randomCode } from "./codes.js";
import { sendPlatformSms } from "./leadgen.js";
import { normalizePhone } from "./messaging.js";
import { withTransaction } from "./tx.js";

const OPEN_REQUESTS = 5;

// For a subquery on qb_subscriptions aliased s.
export const ACTIVE_SUBSCRIPTION = "s.status = 'approved' AND (s.expires_at IS NULL OR s.expires_at > UTC_TIMESTAMP())";

// The courses among `ids` this member may use. Pass 0 for someone not signed in.
export async function accessibleCourseIds(userId: number, ids: Array<number>) {
  if (!ids.length) return [];
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT c.id FROM qb_courses c WHERE c.id IN (?) AND (c.subscription_enabled = 0 OR EXISTS (
       SELECT 1 FROM qb_subscriptions s WHERE s.course_id = c.id AND s.user_id = ? AND ${ACTIVE_SUBSCRIPTION}))`,
    [ids, userId],
  );
  const open = new Set(rows.map((r) => r.id as number));
  return ids.filter((id) => open.has(id));
}

export async function assertCourseAccess(userId: number, courseId: number) {
  if (!(await accessibleCourseIds(userId, [courseId])).length) throw new AppError("Subscribe to this course to use it.", 403);
}

// The questions among `ids` in at least one published course this member may use.
export async function accessibleQuestionIds(userId: number, ids: Array<number>) {
  if (!ids.length) return [];
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT DISTINCT cq.question_id AS id FROM qb_course_questions cq JOIN qb_courses c ON c.id = cq.course_id AND c.status = 'published'
     WHERE cq.question_id IN (?) AND (c.subscription_enabled = 0 OR EXISTS (
       SELECT 1 FROM qb_subscriptions s WHERE s.course_id = c.id AND s.user_id = ? AND ${ACTIVE_SUBSCRIPTION}))`,
    [ids, userId],
  );
  const open = new Set(rows.map((r) => r.id as number));
  return ids.filter((id) => open.has(id));
}

export async function assertQuestionAccess(userId: number, questionId: number) {
  if (!(await accessibleQuestionIds(userId, [questionId])).length) throw new AppError("Subscribe to this course to see this question.", 403);
}

const PUBLIC_COLUMNS = "id, course_id, course_title, reference, status, amount_ghs, days, network, account_name, account_number, transaction_id, admin_note, submitted_at, starts_at, expires_at, created_at";

// What a course page needs to know about a member's access.
export async function courseAccess(course: RowDataPacket, userId: number) {
  const required = Boolean(course.subscription_enabled);
  const base = { required, fee: Number(course.subscription_fee), days: course.subscription_days as number | null };
  if (!userId) return { ...base, active: false, expiresAt: null, open: null };
  const [[active], [open]] = await Promise.all([
    getPool().execute<RowDataPacket[]>(
      `SELECT DATE_FORMAT(s.expires_at, '%Y-%m-%d %H:%i:%s') AS expires_at FROM qb_subscriptions s WHERE s.course_id = ? AND s.user_id = ? AND ${ACTIVE_SUBSCRIPTION} ORDER BY s.expires_at IS NULL DESC, s.expires_at DESC LIMIT 1`,
      [course.id, userId],
    ),
    getPool().execute<RowDataPacket[]>(`SELECT ${PUBLIC_COLUMNS} FROM qb_subscriptions WHERE course_id = ? AND user_id = ? AND status IN ('awaiting', 'submitted') ORDER BY id DESC LIMIT 1`, [course.id, userId]),
  ]);
  return { ...base, active: Boolean(active[0]), expiresAt: (active[0]?.expires_at as string | null) ?? null, open: open[0] ?? null };
}

async function receivingAccount() {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT value FROM site_settings WHERE setting_key = 'quizbank'");
  return (rows[0] ? mergeSetting("quizbank", rows[0].value) : DEFAULT_SETTINGS.quizbank).momoAccount;
}

export async function startSubscription(userId: number, course: RowDataPacket) {
  if (!course.subscription_enabled) throw new AppError("This course is free. You don't need to subscribe.", 409);
  const pool = getPool();
  const [lifetime] = await pool.execute<RowDataPacket[]>(`SELECT 1 FROM qb_subscriptions s WHERE s.course_id = ? AND s.user_id = ? AND s.status = 'approved' AND s.expires_at IS NULL LIMIT 1`, [course.id, userId]);
  if (lifetime[0]) throw new AppError("You already have access to this course.", 409);
  const [existing] = await pool.execute<RowDataPacket[]>(`SELECT ${PUBLIC_COLUMNS} FROM qb_subscriptions WHERE course_id = ? AND user_id = ? AND status IN ('awaiting', 'submitted') ORDER BY id DESC LIMIT 1`, [course.id, userId]);
  if (existing[0]) return existing[0];
  const [open] = await pool.execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM qb_subscriptions WHERE user_id = ? AND status IN ('awaiting', 'submitted')", [userId]);
  if (Number(open[0]?.n) >= OPEN_REQUESTS) throw new AppError("You have several payments waiting already. Finish or cancel one first.", 409);
  const account = await receivingAccount();
  for (let attempt = 0; ; attempt++) {
    const reference = `QB${randomCode(6)}`;
    try {
      const [res] = await pool.execute<ResultSetHeader>(
        "INSERT INTO qb_subscriptions (user_id, course_id, course_title, reference, amount_ghs, days, network, account_name, account_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [userId, course.id, course.title, reference, course.subscription_fee, course.subscription_days, account.network, account.name, account.number],
      );
      const [rows] = await pool.execute<RowDataPacket[]>(`SELECT ${PUBLIC_COLUMNS} FROM qb_subscriptions WHERE id = ?`, [res.insertId]);
      return rows[0]!;
    } catch (err) {
      if ((err as { code?: string }).code !== "ER_DUP_ENTRY" || attempt >= 4) throw err;
    }
  }
}

const WITH_MEMBER = "SELECT s.*, u.full_name, u.phone, u.email FROM qb_subscriptions s LEFT JOIN users u ON u.id = s.user_id WHERE s.id = ?";

// Tells the receiving wallet's owner a payment is claimed, so they can check it before it's confirmed.
async function alertPayee(r: RowDataPacket) {
  let status: string;
  const to = normalizePhone(r.account_number);
  if (to) {
    const contact = r.phone ?? r.email;
    const from = r.payer_phone && r.payer_phone !== normalizePhone(r.phone) ? `${contact}, paid from ${r.payer_phone}` : contact;
    status = await sendPlatformSms(
      to,
      `Capevars Quizbank ${r.reference}: ${r.full_name} (${from}) says they sent GHS ${Number(r.amount_ghs).toFixed(2)} to your ${networkName(r.network)} for ${r.course_title}. ` +
        `Txn ID: ${r.transaction_id}. Verify, then approve in Admin > OpenLearn > Quizbank > Subscriptions.`,
    );
  } else status = "failed: bad payee number";
  await getPool()
    .execute("UPDATE qb_subscriptions SET alert_status = ? WHERE id = ?", [status.slice(0, 100), r.id])
    .catch((err: unknown) => console.error("Failed to record the subscription alert:", err));
  return status;
}

export async function submitSubscription(userId: number, id: number, transactionId: string, payerPhone: string | null) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(`${WITH_MEMBER} AND s.user_id = ?`, [id, userId]);
  const r = rows[0];
  if (!r) throw new AppError("Payment not found.", 404);
  if (r.status !== "awaiting") throw new AppError(r.status === "submitted" ? "You've already sent this payment's transaction ID." : "This payment is closed.", 409);
  // One transfer pays for one thing, across Quizbank and LeadGen credits alike.
  const [credit] = await pool.execute<RowDataPacket[]>("SELECT 1 FROM credit_requests WHERE network = ? AND transaction_id = ? LIMIT 1", [r.network, transactionId]);
  if (credit[0]) throw new AppError("That transaction ID has already been used. Check it and try again.", 409);
  try {
    await pool.execute("UPDATE qb_subscriptions SET transaction_id = ?, payer_phone = ?, status = 'submitted', submitted_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'awaiting'", [transactionId, payerPhone, id]);
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new AppError("That transaction ID has already been used. Check it and try again.", 409);
    throw err;
  }
  void alertPayee({ ...r, transaction_id: transactionId, payer_phone: payerPhone });
}

export async function resendSubscriptionAlert(id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(WITH_MEMBER, [id]);
  const r = rows[0];
  if (!r) throw new AppError("Payment not found.", 404);
  if (r.status !== "submitted") throw new AppError("Only payments waiting for confirmation can be re-alerted.", 409);
  return alertPayee(r);
}

export async function cancelSubscription(userId: number, id: number) {
  const [res] = await getPool().execute<ResultSetHeader>("UPDATE qb_subscriptions SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'awaiting'", [id, userId]);
  if (!res.affectedRows) throw new AppError("This payment can't be cancelled now.", 409);
}

// Confirming starts the access once: the row is locked and must still be open.
// Renewing early adds on to the time they already have.
export async function approveSubscription(id: number, adminId: number, note: string | null) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.execute<RowDataPacket[]>("SELECT * FROM qb_subscriptions WHERE id = ? FOR UPDATE", [id]);
    const r = rows[0];
    if (!r) throw new AppError("Payment not found.", 404);
    if (!["awaiting", "submitted"].includes(r.status)) throw new AppError(`This payment is already ${r.status}.`, 409);
    if (!r.user_id || !r.course_id) throw new AppError("The member or course no longer exists, so this can't start any access. Reject it instead.", 409);
    const [latest] = await conn.execute<RowDataPacket[]>(
      `SELECT DATE_FORMAT(MAX(s.expires_at), '%Y-%m-%d %H:%i:%s') AS until FROM qb_subscriptions s WHERE s.user_id = ? AND s.course_id = ? AND ${ACTIVE_SUBSCRIPTION}`,
      [r.user_id, r.course_id],
    );
    await conn.execute(
      `UPDATE qb_subscriptions SET status = 'approved', admin_note = ?, handled_by = ?, handled_at = UTC_TIMESTAMP(),
         starts_at = GREATEST(UTC_TIMESTAMP(), COALESCE(?, UTC_TIMESTAMP())), expires_at = IF(days IS NULL, NULL, starts_at + INTERVAL days DAY) WHERE id = ?`,
      [note, adminId, latest[0]?.until ?? null, id],
    );
    return r;
  });
}

async function closeSubscription(id: number, adminId: number, reason: string, to: "rejected" | "revoked", from: string) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM qb_subscriptions WHERE id = ?", [id]);
  if (!rows[0]) throw new AppError("Payment not found.", 404);
  const [res] = await getPool().execute<ResultSetHeader>(`UPDATE qb_subscriptions SET status = ?, admin_note = ?, handled_by = ?, handled_at = UTC_TIMESTAMP() WHERE id = ? AND status IN (${from})`, [to, reason, adminId, id]);
  if (!res.affectedRows) throw new AppError(`This payment is already ${rows[0].status}.`, 409);
  return rows[0];
}
export const rejectSubscription = (id: number, adminId: number, reason: string) => closeSubscription(id, adminId, reason, "rejected", "'awaiting', 'submitted'");
export const revokeSubscription = (id: number, adminId: number, reason: string) => closeSubscription(id, adminId, reason, "revoked", "'approved'");
