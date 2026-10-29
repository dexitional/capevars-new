// LeadGen core: settings, the broadcast-credit wallet, lead-list access, and
// the broadcast engine (recipient building, credit reservation, a queue
// worker that sends in batches, and refunds for failed recipients).
import { createHmac } from "node:crypto";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { networkName } from "#/lib/credits";
import type { MomoAccount } from "#/lib/credits";
import { DEFAULT_SETTINGS, mergeSetting } from "#/lib/settings";
import type { SiteSettings } from "#/lib/settings";
import { AppError } from "../middleware/error-handler.js";
import { randomCode } from "./codes.js";
import { notify } from "./notify.js";
import { money } from "./search.js";
import { withTransaction } from "./tx.js";
import { messagingStatus, normalizeEmail, normalizePhone, sendEmail, sendSms, smsSegments } from "./messaging.js";

export type Channel = "sms" | "email";

export async function leadgenSettings(): Promise<SiteSettings["leadgen"]> {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT value FROM site_settings WHERE setting_key = 'leadgen'");
  return rows[0] ? mergeSetting("leadgen", rows[0].value) : DEFAULT_SETTINGS.leadgen;
}

// ---- Wallet ------------------------------------------------------------------------------

export async function walletBalance(userId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT balance FROM broadcast_wallets WHERE user_id = ?", [userId]);
  return money(rows[0]?.balance ?? 0);
}

type TxType = "purchase" | "voucher" | "admin" | "debit" | "refund";
interface TxMeta {
  amountGhs?: number | null;
  paymentId?: number | null;
  broadcastId?: number | null;
  reference?: string | null;
  note?: string | null;
}

// Adds (or, with a negative amount, removes) credits and records the ledger
// line, all under a row lock so concurrent sends can't overdraw.
async function moveCredits(conn: PoolConnection, userId: number, credits: number, type: TxType, meta: TxMeta) {
  await conn.execute("INSERT IGNORE INTO broadcast_wallets (user_id, balance) VALUES (?, 0)", [userId]);
  const [rows] = await conn.execute<RowDataPacket[]>("SELECT balance FROM broadcast_wallets WHERE user_id = ? FOR UPDATE", [userId]);
  const balance = money(rows[0]?.balance ?? 0);
  const next = money(balance + credits);
  if (next < 0) throw new AppError(`Not enough credits: this needs ${money(-credits)} but you have ${balance}. Top up your wallet.`, 409);
  await conn.execute("UPDATE broadcast_wallets SET balance = ? WHERE user_id = ?", [next, userId]);
  await conn.execute(
    `INSERT INTO credit_transactions (user_id, type, credits, balance_after, amount_ghs, payment_id, broadcast_id, reference, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, type, money(credits), next, meta.amountGhs ?? null, meta.paymentId ?? null, meta.broadcastId ?? null, meta.reference ?? null, meta.note?.slice(0, 300) ?? null],
  );
  return next;
}

export async function addCredits(userId: number, credits: number, type: TxType, meta: TxMeta = {}) {
  return withTransaction((conn) => moveCredits(conn, userId, Math.abs(credits) * (type === "debit" ? -1 : 1), type, meta));
}

export async function redeemCreditVoucher(userId: number, code: string) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.execute<RowDataPacket[]>("SELECT * FROM credit_vouchers WHERE code = ? FOR UPDATE", [code]);
    const v = rows[0];
    if (!v) return null;
    if (!v.is_active) throw new AppError("This voucher is no longer active.", 409);
    if (v.expires_on && String(v.expires_on) < new Date().toISOString().slice(0, 10)) throw new AppError("This voucher has expired.", 409);
    if (v.redeemed_count >= v.max_redemptions) throw new AppError("This voucher has been fully used.", 409);
    const [mine] = await conn.execute<RowDataPacket[]>("SELECT 1 FROM credit_voucher_redemptions WHERE voucher_id = ? AND user_id = ?", [v.id, userId]);
    if (mine[0]) throw new AppError("You've already redeemed this voucher.", 409);
    await conn.execute("INSERT INTO credit_voucher_redemptions (voucher_id, user_id) VALUES (?, ?)", [v.id, userId]);
    await conn.execute("UPDATE credit_vouchers SET redeemed_count = redeemed_count + 1 WHERE id = ?", [v.id]);
    const balance = await moveCredits(conn, userId, Number(v.credits), "voucher", { reference: v.code, note: "Voucher redeemed" });
    return { credits: Number(v.credits), balance };
  });
}

// ---- Mobile money top-ups ------------------------------------------------------------------
// A member picks one of the payout wallets in settings and the request is
// logged with a reference to quote. They send the money by hand, then enter the
// transaction ID; that SMSes the receiving number so someone checks the
// wallet, and an admin approval adds the credits.

export const OPEN_CREDIT_REQUESTS = 5;
const ALERT_SENDER = "ehub";

export async function createCreditRequest(userId: number, credits: number, amount: number, account: MomoAccount) {
  const [open] = await getPool().execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM credit_requests WHERE user_id = ? AND status IN ('awaiting', 'submitted')", [userId]);
  if (Number(open[0]?.n) >= OPEN_CREDIT_REQUESTS) throw new AppError("You have several payments waiting already. Finish or cancel one first.", 409);
  for (let attempt = 0; ; attempt++) {
    const reference = `CR${randomCode(6)}`;
    try {
      const [res] = await getPool().execute<ResultSetHeader>(
        "INSERT INTO credit_requests (user_id, reference, credits, amount_ghs, network, account_name, account_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, reference, credits, amount, account.network, account.name, account.number],
      );
      return { id: res.insertId, reference, status: "awaiting", credits, amount_ghs: amount, network: account.network, account_name: account.name, account_number: account.number };
    } catch (err) {
      if ((err as { code?: string }).code !== "ER_DUP_ENTRY" || attempt >= 4) throw err;
    }
  }
}

const REQUEST_WITH_MEMBER = "SELECT r.*, u.full_name, u.phone, u.email FROM credit_requests r JOIN users u ON u.id = r.user_id WHERE r.id = ?";

export async function submitCreditRequest(userId: number, id: number, transactionId: string, payerPhone: string | null) {
  const [rows] = await getPool().execute<RowDataPacket[]>(`${REQUEST_WITH_MEMBER} AND r.user_id = ?`, [id, userId]);
  const r = rows[0];
  if (!r) throw new AppError("Payment request not found.", 404);
  if (r.status !== "awaiting") throw new AppError(r.status === "submitted" ? "You've already sent this payment's transaction ID." : "This payment request is closed.", 409);
  try {
    await getPool().execute("UPDATE credit_requests SET transaction_id = ?, payer_phone = ?, status = 'submitted', submitted_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'awaiting'", [
      transactionId,
      payerPhone,
      id,
    ]);
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new AppError("That transaction ID has already been used for a credit purchase. Check it and try again.", 409);
    throw err;
  }
  void alertPayee({ ...r, transaction_id: transactionId, payer_phone: payerPhone });
}

// Tells the receiving wallet's owner a payment is claimed, so they can check
// their mobile money statement before an admin approves it.
async function alertPayee(r: RowDataPacket): Promise<string> {
  let status: string;
  try {
    const to = normalizePhone(r.account_number);
    if (!to) throw new Error("bad payee number");
    const contact = r.phone ?? r.email;
    const from = r.payer_phone && r.payer_phone !== normalizePhone(r.phone) ? `${contact}, paid from ${r.payer_phone}` : contact;
    const text =
      `Capevars credit purchase ${r.reference}: ${r.full_name} (${from}) says they sent GHS ${money(r.amount_ghs).toFixed(2)} ` +
      `to your ${networkName(r.network)} for ${Number(r.credits).toLocaleString("en-US")} credits. ` +
      `Txn ID: ${r.transaction_id}. Verify, then approve in Admin > LeadGen > MoMo payments.`;
    // Platform alerts never go out under a member's sender ID: the default
    // sender, falling back to "ehub" if that's blank or rejected.
    const senders = [...new Set([(await leadgenSettings()).defaultSmsSender.trim() || ALERT_SENDER, ALERT_SENDER])];
    status = "failed: unknown";
    for (const sender of senders) {
      const [result] = await sendSms(sender, text, [{ number: to }]);
      if (result?.ok) {
        status = `sent as ${sender}`;
        break;
      }
      status = `failed: ${result?.error ?? "unknown"}`;
    }
  } catch (err) {
    status = `failed: ${err instanceof Error ? err.message : String(err)}`;
  }
  await getPool()
    .execute("UPDATE credit_requests SET alert_status = ? WHERE id = ?", [status.slice(0, 100), r.id])
    .catch((err: unknown) => console.error("Failed to record the payment alert:", err));
  return status;
}

// For an alert that didn't go out, e.g. before the sender ID was registered.
export async function resendCreditAlert(id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(REQUEST_WITH_MEMBER, [id]);
  const r = rows[0];
  if (!r) throw new AppError("Payment request not found.", 404);
  if (r.status !== "submitted") throw new AppError("Only payments waiting for confirmation can be re-alerted.", 409);
  return alertPayee(r);
}

// Approving adds the credits once: the request row is locked and must still be open.
export async function approveCreditRequest(id: number, adminId: number, note: string | null) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.execute<RowDataPacket[]>("SELECT * FROM credit_requests WHERE id = ? FOR UPDATE", [id]);
    const r = rows[0];
    if (!r) throw new AppError("Payment request not found.", 404);
    if (!["awaiting", "submitted"].includes(r.status)) throw new AppError(`This request is already ${r.status}.`, 409);
    await moveCredits(conn, r.user_id, Number(r.credits), "purchase", {
      amountGhs: money(r.amount_ghs),
      reference: r.transaction_id ?? r.reference,
      note: `${networkName(r.network)} transfer · ${r.reference}`,
    });
    await conn.execute("UPDATE credit_requests SET status = 'approved', admin_note = ?, handled_by = ?, handled_at = UTC_TIMESTAMP() WHERE id = ?", [note, adminId, id]);
    return r;
  });
}

export async function rejectCreditRequest(id: number, adminId: number, reason: string) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM credit_requests WHERE id = ?", [id]);
  if (!rows[0]) throw new AppError("Payment request not found.", 404);
  const [res] = await getPool().execute<ResultSetHeader>(
    "UPDATE credit_requests SET status = 'rejected', admin_note = ?, handled_by = ?, handled_at = UTC_TIMESTAMP() WHERE id = ? AND status IN ('awaiting', 'submitted')",
    [reason, adminId, id],
  );
  if (!res.affectedRows) throw new AppError(`This request is already ${rows[0].status}.`, 409);
  return rows[0];
}

// ---- Lead list contacts ------------------------------------------------------------------

export const CATEGORIES = ["group", "community", "business", "people", "institution", "association", "other"] as const;

export const contactSchema = z.object({
  name: z.string().trim().max(150).nullish(),
  phone: z.union([z.string(), z.number()]).nullish(),
  email: z.string().trim().max(150).nullish(),
  organization: z.string().trim().max(150).nullish(),
  role: z.string().trim().max(100).nullish(),
  location: z.string().trim().max(150).nullish(),
});
export const contactsSchema = z.array(contactSchema).max(20_000);

export async function recountList(listId: number) {
  await getPool().execute(
    `UPDATE lead_lists SET
       phone_count = (SELECT COUNT(phone) FROM lead_contacts WHERE list_id = ?),
       email_count = (SELECT COUNT(email) FROM lead_contacts WHERE list_id = ?),
       contact_count = (SELECT COUNT(*) FROM lead_contacts WHERE list_id = ?)
     WHERE id = ?`,
    [listId, listId, listId, listId],
  );
}

// Normalises, de-duplicates and stores contacts; returns how many were added.
export async function insertContacts(listId: number, raw: z.infer<typeof contactsSchema>) {
  const seen = new Set<string>();
  const rows: Array<Array<string | number | null>> = [];
  let invalid = 0;
  for (const c of raw) {
    const phone = normalizePhone(c.phone);
    const email = normalizeEmail(c.email);
    if (!phone && !email) {
      invalid++;
      continue;
    }
    const key = `${phone ?? ""}|${email ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push([listId, c.name?.slice(0, 150) || null, phone, email, c.organization?.slice(0, 150) || null, c.role?.slice(0, 100) || null, c.location?.slice(0, 150) || null]);
  }
  let added = 0;
  for (let i = 0; i < rows.length; i += 1000) {
    const [res] = await getPool().query<ResultSetHeader>(
      "INSERT IGNORE INTO lead_contacts (list_id, name, phone, email, organization, role, location) VALUES ?",
      [rows.slice(i, i + 1000)],
    );
    added += res.affectedRows;
  }
  await recountList(listId);
  return { added, invalid, duplicates: raw.length - invalid - added };
}

// ---- Lead list access --------------------------------------------------------------------

// Access that can be used right now: active and not past its expiry (only
// admin shares carry one). Use with the lead_access table aliased as `a`.
export const LIVE_ACCESS = "a.status = 'active' AND (a.expires_at IS NULL OR a.expires_at > NOW())";
// The status shown to members, with lapsed admin shares reported as 'expired'.
export const ACCESS_STATUS = "CASE WHEN a.status = 'active' AND a.expires_at <= NOW() THEN 'expired' ELSE a.status END";

export async function uniqueVoucher(table: "lead_access" | "lead_lists", column: "voucher_code" | "share_code", prefix: string) {
  for (;;) {
    const code = `${prefix}${randomCode(8)}`;
    const [rows] = await getPool().execute<RowDataPacket[]>(`SELECT 1 FROM ${table} WHERE ${column} = ?`, [code]);
    if (!rows[0]) return code;
  }
}

// Creates (or reactivates) a member's access to a list and returns it.
export async function grantAccess(
  listId: number,
  userId: number,
  source: "owner" | "free" | "purchase" | "share" | "admin",
  opts: { status?: "pending" | "active"; amountPaid?: number; ownerEarning?: number } = {},
) {
  const pool = getPool();
  const [existing] = await pool.execute<RowDataPacket[]>("SELECT * FROM lead_access WHERE list_id = ? AND user_id = ?", [listId, userId]);
  if (existing[0]) {
    if (existing[0].status === "revoked") throw new AppError("Your access to this list was revoked.", 403);
    if (existing[0].status === "pending" && opts.status === "active") {
      await pool.execute("UPDATE lead_access SET status = 'active' WHERE id = ?", [existing[0].id]);
    }
    return existing[0];
  }
  const code = await uniqueVoucher("lead_access", "voucher_code", "LV");
  const [res] = await pool.execute<ResultSetHeader>(
    "INSERT INTO lead_access (list_id, user_id, voucher_code, source, amount_paid, owner_earning, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [listId, userId, code, source, opts.amountPaid ?? 0, opts.ownerEarning ?? 0, opts.status ?? "active"],
  );
  if ((opts.status ?? "active") === "active" && source !== "owner") {
    await pool.execute("UPDATE lead_lists SET access_count = access_count + 1 WHERE id = ?", [listId]);
  }
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM lead_access WHERE id = ?", [res.insertId]);
  return rows[0]!;
}

// An admin share of a list with one member, until `expiresAt` (or for good
// when null). Sharing again reactivates a revoked share and resets its expiry.
export async function shareList(listId: number, userId: number, expiresAt: string | null) {
  const pool = getPool();
  const [existing] = await pool.execute<RowDataPacket[]>("SELECT id FROM lead_access WHERE list_id = ? AND user_id = ?", [listId, userId]);
  if (existing[0]) {
    await pool.execute("UPDATE lead_access SET status = 'active', expires_at = ? WHERE id = ?", [expiresAt, existing[0].id]);
  } else {
    const code = await uniqueVoucher("lead_access", "voucher_code", "LV");
    await pool.execute("INSERT INTO lead_access (list_id, user_id, voucher_code, source, status, expires_at) VALUES (?, ?, ?, 'admin', 'active', ?)", [
      listId,
      userId,
      code,
      expiresAt,
    ]);
  }
  await recountAccess(listId);
}

export async function recountAccess(listId: number) {
  await getPool().execute(
    "UPDATE lead_lists SET access_count = (SELECT COUNT(*) FROM lead_access WHERE list_id = ? AND source <> 'owner' AND status = 'active') WHERE id = ?",
    [listId, listId],
  );
}

// A paid list's access goes live once its payment succeeds (or the owner
// confirms a manual payment).
export async function activateLeadAccess(accessId: number, paymentId: number | null) {
  const pool = getPool();
  const [res] = await pool.execute<ResultSetHeader>(
    "UPDATE lead_access SET status = 'active', payment_id = COALESCE(?, payment_id) WHERE id = ? AND status = 'pending'",
    [paymentId, accessId],
  );
  if (!res.affectedRows) return;
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT a.user_id, l.id AS list_id, l.title, l.user_id AS owner_id, a.owner_earning FROM lead_access a JOIN lead_lists l ON l.id = a.list_id WHERE a.id = ?",
    [accessId],
  );
  const a = rows[0];
  if (!a) return;
  await pool.execute("UPDATE lead_lists SET access_count = access_count + 1 WHERE id = ?", [a.list_id]);
  notify(a.user_id, { kind: "leadgen", title: `You now have "${a.title}"`, body: "Use its voucher code in the Broadcast portal.", link: "/leadgen/portal/leads" });
  notify(a.owner_id, { kind: "leadgen", title: `Your list "${a.title}" was sold`, body: `You earned GHS ${Number(a.owner_earning).toFixed(2)}`, link: "/leadgen/portal/earnings" });
}

// ---- Recipients & cost ------------------------------------------------------------------

export interface AdhocContact {
  name?: string | null;
  phone?: string | number | null;
  email?: string | null;
}

// Every unique, valid, not-opted-out address for a broadcast: contacts from
// lists the member can access (picked by access id or voucher code) plus any
// ad-hoc contacts from an uploaded sheet.
export async function buildRecipients(userId: number, channel: Channel, accessIds: Array<number>, adhoc: Array<AdhocContact>, limit: number) {
  const pool = getPool();
  const out = new Map<string, string | null>();
  let invalid = 0;
  const add = (address: string | null, name: string | null | undefined) => {
    if (!address) {
      invalid++;
      return;
    }
    if (!out.has(address)) out.set(address, name?.trim().slice(0, 150) || null);
  };
  if (accessIds.length) {
    const [lists] = await pool.query<RowDataPacket[]>(
      `SELECT a.list_id FROM lead_access a WHERE a.id IN (?) AND a.user_id = ? AND ${LIVE_ACCESS}`,
      [accessIds, userId],
    );
    const listIds = lists.map((l) => l.list_id as number);
    if (listIds.length !== accessIds.length) throw new AppError("One of the selected lead lists isn't available to you, or your access has expired.", 403);
    const column = channel === "sms" ? "phone" : "email";
    const [contacts] = await pool.query<RowDataPacket[]>(
      `SELECT name, ${column} AS address FROM lead_contacts WHERE list_id IN (?) AND ${column} IS NOT NULL LIMIT ?`,
      [listIds, limit * 2],
    );
    for (const c of contacts) add(channel === "sms" ? normalizePhone(c.address) : normalizeEmail(c.address), c.name);
  }
  for (const c of adhoc) add(channel === "sms" ? normalizePhone(c.phone) : normalizeEmail(c.email), c.name);
  // Opt-outs are never messaged.
  const addresses = [...out.keys()];
  let optedOut = 0;
  for (let i = 0; i < addresses.length; i += 1000) {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT address FROM broadcast_optouts WHERE channel = ? AND address IN (?)", [channel, addresses.slice(i, i + 1000)]);
    for (const r of rows) {
      out.delete(r.address);
      optedOut++;
    }
  }
  const recipients = [...out.entries()].map(([address, name]) => ({ address, name }));
  if (recipients.length > limit) throw new AppError(`That's ${recipients.length} recipients; the limit per broadcast is ${limit}. Split it into smaller sends.`, 422);
  return { recipients, invalid, optedOut };
}

export async function estimate(channel: Channel, body: string, recipientCount: number) {
  const s = await leadgenSettings();
  const seg = channel === "sms" ? smsSegments(body) : { segments: 1, unicode: false, length: body.length };
  const perRecipient = channel === "sms" ? seg.segments * s.smsCreditCost : s.emailCreditCost;
  return { segments: seg.segments, unicode: seg.unicode, length: seg.length, perRecipient: money(perRecipient), cost: money(perRecipient * recipientCount) };
}

// Creates the broadcast, reserves its full cost from the wallet and stores the
// recipients, then nudges the worker. Failed recipients are refunded later.
export async function createBroadcast(input: {
  userId: number;
  seriesId?: number | null;
  channel: Channel;
  senderId: number | null;
  senderLabel: string;
  replyTo: string | null;
  subject: string | null;
  body: string;
  audience: Record<string, unknown>;
  recipients: Array<{ address: string; name: string | null }>;
  scheduledAt: string | null;
}) {
  if (!input.recipients.length) throw new AppError("There's nobody to send to. Pick a lead list or upload contacts.", 422);
  const est = await estimate(input.channel, input.body, input.recipients.length);
  const id = await withTransaction(async (conn) => {
    const [res] = await conn.execute<ResultSetHeader>(
      `INSERT INTO broadcasts (user_id, series_id, channel, sender_id, sender_label, reply_to, subject, body, audience, recipient_count, units_per_message, cost_credits, status, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.userId, input.seriesId ?? null, input.channel, input.senderId, input.senderLabel, input.replyTo, input.subject, input.body,
        JSON.stringify(input.audience), input.recipients.length, est.segments, est.cost,
        input.scheduledAt ? "scheduled" : "queued", input.scheduledAt,
      ],
    );
    const broadcastId = res.insertId;
    await moveCredits(conn, input.userId, -est.cost, "debit", { broadcastId, note: `Broadcast #${broadcastId} · ${input.recipients.length} ${input.channel === "sms" ? "SMS" : "emails"}` });
    for (let i = 0; i < input.recipients.length; i += 1000) {
      const chunk = input.recipients.slice(i, i + 1000);
      await conn.query("INSERT IGNORE INTO broadcast_recipients (broadcast_id, address, name) VALUES ?", [chunk.map((r) => [broadcastId, r.address, r.name])]);
    }
    return broadcastId;
  });
  if (!input.scheduledAt) setTimeout(() => void runBroadcastQueue(), 50);
  return { id, ...est };
}

export async function cancelBroadcast(userId: number | null, id: number) {
  const pool = getPool();
  const [res] = await pool.execute<ResultSetHeader>(
    `UPDATE broadcasts SET status = 'cancelled', finished_at = NOW() WHERE id = ? ${userId ? "AND user_id = ?" : ""} AND status IN ('scheduled', 'queued')`,
    userId ? [id, userId] : [id],
  );
  if (!res.affectedRows) throw new AppError("Only broadcasts that haven't started can be cancelled.", 409);
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT user_id, cost_credits FROM broadcasts WHERE id = ?", [id]);
  const b = rows[0]!;
  await addCredits(b.user_id, Number(b.cost_credits), "refund", { broadcastId: id, note: `Broadcast #${id} cancelled` });
  await pool.execute("UPDATE broadcasts SET refunded_credits = cost_credits WHERE id = ?", [id]);
  // Cancelling the first broadcast of a repeating series stops the repeats too.
  await pool.execute("UPDATE broadcast_series SET status = 'cancelled', next_run_at = NULL WHERE source_broadcast_id = ? AND status IN ('active', 'paused')", [id]);
}

// ---- Repeating broadcasts ------------------------------------------------------------------
//
// A series repeats a broadcast every N hours/days/weeks/months until an end
// date and/or a number of sends. The first broadcast is the template: each
// repeat copies its message, sender and recipients (minus new opt-outs),
// re-checks list access and the sender ID, and is charged when it goes out.
// Repeat k falls at starts_at + k × interval so monthly repeats don't drift
// after short months, and slots missed while paused or offline are skipped
// rather than sent in a burst.

export type RepeatUnit = "hour" | "day" | "week" | "month";
export interface Repeat {
  every: number;
  unit: RepeatUnit;
  endsOn: string | null;
  times: number | null;
}
export const MAX_SERIES_RUNS = 500;
const UNIT_SQL: Record<RepeatUnit, string> = { hour: "HOUR", day: "DAY", week: "WEEK", month: "MONTH" };
interface SeriesTiming {
  starts_at: string;
  every_n: number;
  unit: RepeatUnit;
  ends_at: string | null;
  max_runs: number | null;
}
type SeriesRow = RowDataPacket & SeriesTiming;

// The first slot after slot `after` that is still in the future.
async function nextSlot(s: Pick<SeriesTiming, "starts_at" | "every_n" | "unit">, after: number) {
  const pool = getPool();
  const unit = UNIT_SQL[s.unit];
  const every = Number(s.every_n);
  const [elapsed] = await pool.query<RowDataPacket[]>(`SELECT TIMESTAMPDIFF(${unit}, ?, NOW()) AS n`, [s.starts_at]);
  let slot = Math.max(after + 1, Math.floor(Number(elapsed[0]?.n ?? 0) / every) + 1);
  for (;;) {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT DATE_ADD(?, INTERVAL ? ${unit}) AS at, DATE_ADD(?, INTERVAL ? ${unit}) > NOW() AS future`, [
      s.starts_at,
      slot * every,
      s.starts_at,
      slot * every,
    ]);
    if (rows[0]?.future) return { slot, at: String(rows[0].at) };
    slot++;
  }
}

// No send is due after this one: the run limit is reached or the next slot is past the end date.
const seriesDone = (s: Pick<SeriesTiming, "max_runs" | "ends_at">, runCount: number, nextAt: string) =>
  Boolean((s.max_runs && runCount >= s.max_runs) || (s.ends_at && nextAt > s.ends_at));

// Checks a repeat plan before anything is charged; `startsAt` is the first
// send (null = now).
export async function planSeries(startsAt: string | null, repeat: Repeat) {
  const [now] = await getPool().query<RowDataPacket[]>("SELECT NOW() AS now");
  const plan = {
    starts_at: startsAt ?? String(now[0]!.now),
    every_n: repeat.every,
    unit: repeat.unit,
    ends_at: repeat.endsOn ? `${repeat.endsOn} 23:59:59` : null,
    max_runs: Math.min(repeat.times ?? MAX_SERIES_RUNS, MAX_SERIES_RUNS),
  };
  const next = await nextSlot(plan, 0);
  if (plan.ends_at && next.at > plan.ends_at) throw new AppError("The end date comes before the first repeat. Pick a later end date or repeat more often.", 422);
  return { ...plan, next };
}

export async function createSeries(userId: number, broadcastId: number, plan: Awaited<ReturnType<typeof planSeries>>) {
  const pool = getPool();
  const [res] = await pool.execute<ResultSetHeader>(
    `INSERT INTO broadcast_series (user_id, source_broadcast_id, every_n, unit, starts_at, ends_at, max_runs, next_slot, next_run_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, broadcastId, plan.every_n, plan.unit, plan.starts_at, plan.ends_at, plan.max_runs, plan.next.slot, plan.next.at],
  );
  await pool.execute("UPDATE broadcasts SET series_id = ? WHERE id = ?", [res.insertId, broadcastId]);
  return res.insertId;
}

// Sends one repeat of a series as a new broadcast.
async function sendRepeat(s: RowDataPacket) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM broadcasts WHERE id = ?", [s.source_broadcast_id]);
  const src = rows[0];
  if (!src) throw new AppError("The original broadcast no longer exists.", 404);
  if (!messagingStatus()[src.channel as Channel]) throw new AppError("Sending isn't available on the server right now.", 409);
  const accessIds = (src.audience as { accessIds?: Array<number> } | null)?.accessIds ?? [];
  if (accessIds.length) {
    const [live] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM lead_access a WHERE a.id IN (?) AND a.user_id = ? AND ${LIVE_ACCESS}`, [accessIds, s.user_id]);
    if (Number(live[0]?.n ?? 0) < accessIds.length) throw new AppError("Your access to one of its lead lists has ended.", 403);
  }
  let senderLabel = String(src.sender_label);
  if (src.sender_id) {
    const [senders] = await pool.execute<RowDataPacket[]>("SELECT status FROM sender_ids WHERE id = ?", [src.sender_id]);
    if (senders[0]?.status !== "approved") throw new AppError(`Sender ID "${senderLabel}" is no longer approved.`, 409);
  } else {
    const settings = await leadgenSettings();
    senderLabel = src.channel === "sms" ? settings.defaultSmsSender : settings.defaultEmailSender;
  }
  const [recipients] = await pool.query<RowDataPacket[]>(
    `SELECT r.address, r.name FROM broadcast_recipients r
     LEFT JOIN broadcast_optouts o ON o.channel = ? AND o.address = r.address
     WHERE r.broadcast_id = ? AND o.address IS NULL ORDER BY r.id`,
    [src.channel, src.id],
  );
  await createBroadcast({
    userId: s.user_id,
    seriesId: s.id,
    channel: src.channel,
    senderId: src.sender_id,
    senderLabel,
    replyTo: src.reply_to,
    subject: src.subject,
    body: src.body,
    audience: src.audience,
    recipients: recipients.map((r) => ({ address: r.address as string, name: r.name as string | null })),
    scheduledAt: null,
  });
}

export async function runDueSeries() {
  const pool = getPool();
  const [due] = await pool.query<Array<SeriesRow>>("SELECT * FROM broadcast_series WHERE status = 'active' AND next_run_at <= NOW() ORDER BY next_run_at LIMIT 20");
  for (const s of due) {
    // Move the series on before sending, so a second worker can't send the same slot.
    const runCount = Number(s.run_count) + 1;
    const next = await nextSlot(s, Number(s.next_slot));
    const done = seriesDone(s, runCount, next.at);
    const [claim] = await pool.execute<ResultSetHeader>(
      "UPDATE broadcast_series SET run_count = ?, next_slot = ?, next_run_at = ?, status = ? WHERE id = ? AND status = 'active' AND next_run_at = ?",
      [runCount, next.slot, done ? null : next.at, done ? "completed" : "active", s.id, s.next_run_at],
    );
    if (!claim.affectedRows) continue;
    try {
      await sendRepeat(s);
    } catch (err) {
      const reason = (err instanceof Error ? err.message : String(err)).slice(0, 300);
      await pool.execute("UPDATE broadcast_series SET status = 'paused', status_reason = ?, run_count = run_count - 1, next_run_at = NULL WHERE id = ?", [reason, s.id]);
      notify(s.user_id, { kind: "leadgen", title: "A repeating broadcast was paused", body: reason, link: `/leadgen/portal/broadcasts/${s.source_broadcast_id}` });
    }
  }
}

// Pause, resume or stop a series (`userId` null = an admin acting).
export async function setSeriesStatus(userId: number | null, id: number, action: "pause" | "resume" | "cancel") {
  const pool = getPool();
  const [rows] = await pool.execute<Array<SeriesRow>>(`SELECT * FROM broadcast_series WHERE id = ? ${userId ? "AND user_id = ?" : ""}`, userId ? [id, userId] : [id]);
  const s = rows[0];
  if (!s) throw new AppError("Repeating broadcast not found.", 404);
  if (action === "pause") {
    if (s.status !== "active") throw new AppError("Only active repeats can be paused.", 409);
    await pool.execute("UPDATE broadcast_series SET status = 'paused', status_reason = NULL, next_run_at = NULL WHERE id = ?", [id]);
  } else if (action === "cancel") {
    if (!["active", "paused"].includes(s.status)) throw new AppError("These repeats have already ended.", 409);
    await pool.execute("UPDATE broadcast_series SET status = 'cancelled', next_run_at = NULL WHERE id = ?", [id]);
  } else {
    if (s.status !== "paused") throw new AppError("Only paused repeats can be resumed.", 409);
    const next = await nextSlot(s, Number(s.next_slot) - 1);
    if (seriesDone(s, Number(s.run_count), next.at)) {
      await pool.execute("UPDATE broadcast_series SET status = 'completed', next_run_at = NULL WHERE id = ?", [id]);
      throw new AppError("These repeats have reached their end, so there's nothing left to resume.", 409);
    }
    await pool.execute("UPDATE broadcast_series SET status = 'active', status_reason = NULL, next_slot = ?, next_run_at = ? WHERE id = ?", [next.slot, next.at, id]);
  }
}

// ---- Unsubscribe ----------------------------------------------------------------------------

function optoutKey() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return createHmac("sha256", secret).update("capevars:optout:v1").digest();
}
export const optoutToken = (channel: Channel, address: string) =>
  createHmac("sha256", optoutKey()).update(`${channel}:${address}`).digest("base64url").slice(0, 22);

const appUrl = () => (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const unsubscribeUrl = (address: string) =>
  `${appUrl()}/api/leadgen/unsubscribe?e=${encodeURIComponent(address)}&t=${optoutToken("email", address)}`;

// ---- Worker ------------------------------------------------------------------------------------

const BATCH = 100;
// One worker per process, even across dev hot reloads.
const worker = globalThis as typeof globalThis & { __cvBroadcastRunning?: boolean; __cvBroadcastTimer?: ReturnType<typeof setInterval> };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function emailHtml(body: string, name: string | null, sender: string, address: string) {
  const first = name?.split(/\s+/)[0] || "there";
  const text = body.replace(/\{name\}/gi, first);
  const html = escapeHtml(text)
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#041d40">$1</a>')
    .replace(/\n/g, "<br>");
  const unsub = unsubscribeUrl(address);
  return {
    text: `${text}\n\n—\nSent by ${sender} via Capevars LeadGen. Unsubscribe: ${unsub}`,
    html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0b1730;max-width:600px">${html}
      <hr style="border:none;border-top:1px solid #e4e8ef;margin:24px 0">
      <p style="font-size:12px;color:#5a6478">Sent by ${escapeHtml(sender)} via Capevars LeadGen.
      <a href="${unsub}" style="color:#5a6478">Unsubscribe</a></p></div>`,
    unsub,
  };
}

async function emailsSentToday() {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT COUNT(*) AS n FROM broadcast_recipients r JOIN broadcasts b ON b.id = r.broadcast_id
     WHERE b.channel = 'email' AND r.status = 'sent' AND r.sent_at >= CURDATE()`,
  );
  return Number(rows[0]?.n ?? 0);
}

async function claimNext(): Promise<RowDataPacket | null> {
  const pool = getPool();
  // A worker that died mid-send leaves a stale lock; take it back after 15 minutes.
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM broadcasts
     WHERE (status = 'queued') OR (status = 'scheduled' AND scheduled_at <= NOW())
        OR (status = 'sending' AND locked_at < NOW() - INTERVAL 15 MINUTE)
     ORDER BY COALESCE(scheduled_at, created_at) LIMIT 5`,
  );
  for (const r of rows) {
    const [res] = await pool.execute<ResultSetHeader>(
      `UPDATE broadcasts SET status = 'sending', locked_at = NOW(), started_at = COALESCE(started_at, NOW())
       WHERE id = ? AND (status IN ('queued', 'scheduled') OR (status = 'sending' AND locked_at < NOW() - INTERVAL 15 MINUTE))`,
      [r.id],
    );
    if (res.affectedRows) {
      const [b] = await pool.execute<RowDataPacket[]>("SELECT * FROM broadcasts WHERE id = ?", [r.id]);
      return b[0] ?? null;
    }
  }
  return null;
}

async function record(broadcastId: number, results: Array<{ address: string; ok: boolean; ref?: string | null; status?: string | null; error?: string | null }>) {
  const pool = getPool();
  for (const r of results) {
    await pool.execute(
      `UPDATE broadcast_recipients SET status = ?, provider_ref = ?, provider_status = ?, error = ?, sent_at = NOW()
       WHERE broadcast_id = ? AND address = ? AND status = 'queued'`,
      [r.ok ? "sent" : "failed", r.ref?.slice(0, 100) ?? null, r.status?.slice(0, 60) ?? null, r.error?.slice(0, 300) ?? null, broadcastId, r.address],
    );
  }
  const sent = results.filter((r) => r.ok).length;
  await pool.execute("UPDATE broadcasts SET sent_count = sent_count + ?, failed_count = failed_count + ?, locked_at = NOW() WHERE id = ?", [
    sent,
    results.length - sent,
    broadcastId,
  ]);
}

async function processBroadcast(b: RowDataPacket) {
  const pool = getPool();
  const settings = await leadgenSettings();
  for (;;) {
    const [batch] = await pool.query<RowDataPacket[]>(
      "SELECT address, name FROM broadcast_recipients WHERE broadcast_id = ? AND status = 'queued' ORDER BY id LIMIT ?",
      [b.id, BATCH],
    );
    if (!batch.length) break;
    const [state] = await pool.execute<RowDataPacket[]>("SELECT status FROM broadcasts WHERE id = ?", [b.id]);
    if (state[0]?.status !== "sending") return; // cancelled by an admin mid-way
    if (b.channel === "sms") {
      const results = await sendSms(b.sender_label, b.body, batch.map((r) => ({ number: r.address, name: r.name })));
      await record(b.id, results);
    } else {
      // Gmail caps daily recipients; pause and resume tomorrow instead of failing.
      if ((await emailsSentToday()) >= settings.emailDailyLimit) {
        await pool.execute("UPDATE broadcasts SET status = 'scheduled', scheduled_at = DATE_ADD(CURDATE(), INTERVAL 1 DAY), locked_at = NULL, error = ? WHERE id = ?", [
          "Daily email limit reached — resumes tomorrow.",
          b.id,
        ]);
        return;
      }
      const results = [];
      for (const r of batch) {
        const content = emailHtml(b.body, r.name, b.sender_label, r.address);
        results.push(
          await sendEmail({
            fromName: b.sender_label,
            replyTo: b.reply_to,
            to: r.address,
            subject: String(b.subject ?? "").replace(/\{name\}/gi, r.name?.split(/\s+/)[0] || "there"),
            html: content.html,
            text: content.text,
            unsubscribeUrl: content.unsub,
          }),
        );
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      await record(b.id, results);
    }
  }
  // Refund every recipient that failed, at the price they were charged.
  const [totals] = await pool.execute<RowDataPacket[]>("SELECT sent_count, failed_count, cost_credits, recipient_count, refunded_credits FROM broadcasts WHERE id = ?", [b.id]);
  const t = totals[0]!;
  const perRecipient = Number(t.cost_credits) / Math.max(1, Number(t.recipient_count));
  const refund = money(perRecipient * Number(t.failed_count) - Number(t.refunded_credits));
  if (refund > 0) {
    await addCredits(b.user_id, refund, "refund", { broadcastId: b.id, note: `Refund for ${t.failed_count} failed recipients` });
    await pool.execute("UPDATE broadcasts SET refunded_credits = refunded_credits + ? WHERE id = ?", [refund, b.id]);
  }
  const status = Number(t.sent_count) === 0 && Number(t.failed_count) > 0 ? "failed" : "sent";
  await pool.execute("UPDATE broadcasts SET status = ?, finished_at = NOW(), locked_at = NULL WHERE id = ?", [status, b.id]);
  notify(b.user_id, {
    kind: "leadgen",
    title: `Broadcast #${b.id} ${status === "sent" ? "delivered" : "failed"}`,
    body: `${t.sent_count} sent · ${t.failed_count} failed${refund > 0 ? ` · ${refund} credits refunded` : ""}`,
    link: `/leadgen/portal/broadcasts/${b.id}`,
  });
}

export async function runBroadcastQueue() {
  if (worker.__cvBroadcastRunning) return;
  worker.__cvBroadcastRunning = true;
  try {
    // Due repeats become queued broadcasts, which the loop below then sends.
    await runDueSeries().catch((err) => console.error("broadcast series:", err));
    for (;;) {
      const b = await claimNext();
      if (!b) break;
      try {
        await processBroadcast(b);
      } catch (err) {
        console.error(`broadcast #${b.id} failed:`, err);
        await getPool().execute("UPDATE broadcasts SET status = 'queued', locked_at = NULL, error = ? WHERE id = ?", [
          (err instanceof Error ? err.message : String(err)).slice(0, 500),
          b.id,
        ]);
        break; // provider down: try again on the next tick
      }
    }
  } finally {
    worker.__cvBroadcastRunning = false;
  }
}

export function startBroadcastWorker(everyMs = 30_000) {
  // Replace (not stack) the interval when this module is reloaded in dev.
  if (worker.__cvBroadcastTimer) clearInterval(worker.__cvBroadcastTimer);
  worker.__cvBroadcastTimer = setInterval(() => void runBroadcastQueue().catch((err) => console.error("broadcast worker:", err)), everyMs);
  worker.__cvBroadcastTimer.unref?.();
}
