// LeadGen core: settings, the broadcast-credit wallet, lead-list access, and
// the broadcast engine (recipient building, credit reservation, a queue
// worker that sends in batches, and refunds for failed recipients).
import { createHmac } from "node:crypto";
import { getPool } from "@cv/db";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DEFAULT_SETTINGS, mergeSetting } from "#/lib/settings";
import type { SiteSettings } from "#/lib/settings";
import { AppError } from "../middleware/error-handler.js";
import { randomCode } from "./codes.js";
import { notify } from "./notify.js";
import { money } from "./search.js";
import { withTransaction } from "./tx.js";
import { normalizeEmail, normalizePhone, sendEmail, sendSms, smsSegments } from "./messaging.js";

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

// ---- Lead list access --------------------------------------------------------------------

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
      "SELECT list_id FROM lead_access WHERE id IN (?) AND user_id = ? AND status = 'active'",
      [accessIds, userId],
    );
    const listIds = lists.map((l) => l.list_id as number);
    if (listIds.length !== accessIds.length) throw new AppError("One of the selected lead lists isn't available to you.", 403);
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
      `INSERT INTO broadcasts (user_id, channel, sender_id, sender_label, reply_to, subject, body, audience, recipient_count, units_per_message, cost_credits, status, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.userId, input.channel, input.senderId, input.senderLabel, input.replyTo, input.subject, input.body,
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
