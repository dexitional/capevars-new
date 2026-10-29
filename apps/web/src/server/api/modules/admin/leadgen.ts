// Admin tools for LeadGen beyond the moderation queues: credit vouchers,
// manual wallet adjustments, gateway status, cancelling broadcasts, sender IDs
// created for members, and Capevars' own private lead lists shared with
// chosen members until a per-member expiry date.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { validate } from "../../lib/validate.js";
import { optionalText } from "../../lib/fields.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";
import { randomCode } from "../../lib/codes.js";
import { notify } from "../../lib/notify.js";
import { uniqueSlug } from "../../lib/slug.js";
import {
  CATEGORIES,
  addCredits,
  cancelBroadcast,
  contactsSchema,
  insertContacts,
  recountAccess,
  shareList,
  uniqueVoucher,
  walletBalance,
} from "../../lib/leadgen.js";
import { messagingStatus, normalizeEmail, smsBalance } from "../../lib/messaging.js";

// A share lasts through the end of its expiry day; no date means it never expires.
const expiresOn = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.null()])
  .optional()
  .transform((v) => v || null)
  .refine((v) => !v || v >= new Date().toISOString().slice(0, 10), "Pick an expiry date from today onwards");
const endOfDay = (date: string | null) => (date ? `${date} 23:59:59` : null);

async function adminList(id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM lead_lists WHERE id = ? AND user_id IS NULL", [id]);
  if (!rows[0]) throw new AppError("List not found.", 404);
  return rows[0];
}

export const adminLeadgenRoute = new Hono()
  .get("/status", requirePermission("leadgen", "view"), async (c) => {
    const pool = getPool();
    const [[stats]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT (SELECT COALESCE(SUM(balance), 0) FROM broadcast_wallets) AS outstanding_credits,
           (SELECT COALESCE(SUM(amount_ghs), 0) FROM credit_transactions WHERE type = 'purchase') AS credit_sales,
           (SELECT COALESCE(SUM(sent_count), 0) FROM broadcasts WHERE channel = 'sms') AS sms_sent,
           (SELECT COALESCE(SUM(sent_count), 0) FROM broadcasts WHERE channel = 'email') AS emails_sent,
           (SELECT COALESCE(SUM(amount_paid - owner_earning), 0) FROM lead_access WHERE source = 'purchase' AND status = 'active') AS list_commission,
           (SELECT COUNT(*) FROM broadcast_optouts) AS optouts`,
      ),
    ]);
    return c.json({ messaging: messagingStatus(), smsBalance: await smsBalance().catch(() => null), stats: stats[0] });
  })
  .get("/vouchers", requirePermission("leadgen", "view"), async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      "SELECT v.*, a.full_name AS created_by_name FROM credit_vouchers v LEFT JOIN admins a ON a.id = v.created_by ORDER BY v.id DESC LIMIT 300",
    );
    return c.json({ items });
  })
  .post(
    "/vouchers",
    requirePermission("leadgen", "manage"),
    validate(
      "json",
      z.object({
        credits: z.number().min(1).max(10_000_000),
        count: z.number().int().min(1).max(500),
        maxRedemptions: z.number().int().min(1).max(100_000),
        expiresOn: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.null()]).optional().transform((v) => v || null),
        note: optionalText(200),
        code: optionalText(24),
      }),
    ),
    async (c) => {
      const input = c.req.valid("json");
      const codes: Array<string> = [];
      for (let i = 0; i < input.count; i++) {
        const code = input.count === 1 && input.code ? input.code.toUpperCase().replace(/[^A-Z0-9-]/g, "") : `CR-${randomCode(10)}`;
        try {
          await getPool().execute(
            "INSERT INTO credit_vouchers (code, credits, max_redemptions, expires_on, note, created_by) VALUES (?, ?, ?, ?, ?, ?)",
            [code, input.credits, input.maxRedemptions, input.expiresOn, input.note ?? null, c.get("admin").id],
          );
          codes.push(code);
        } catch (err) {
          if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new AppError(`Voucher ${code} already exists.`, 409);
          throw err;
        }
      }
      logActivity(c.get("admin").id, "created", "credit_voucher", null, `Created ${codes.length} voucher(s) of ${input.credits} credits`);
      return c.json({ codes }, 201);
    },
  )
  .patch("/vouchers/:id", requirePermission("leadgen", "manage"), validate("json", z.object({ isActive: z.boolean() })), async (c) => {
    await getPool().execute("UPDATE credit_vouchers SET is_active = ? WHERE id = ?", [c.req.valid("json").isActive ? 1 : 0, Number(c.req.param("id"))]);
    return c.json({ ok: true });
  })
  .get("/wallets", requirePermission("leadgen", "view"), async (c) => {
    const q = (c.req.query("q") ?? "").trim();
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT u.id, u.full_name, u.email, u.username, COALESCE(w.balance, 0) AS balance, w.updated_at
       FROM users u LEFT JOIN broadcast_wallets w ON w.user_id = u.id
       WHERE ${q ? "(u.full_name LIKE ? OR u.email LIKE ? OR u.username LIKE ?)" : "w.user_id IS NOT NULL"}
       ORDER BY balance DESC LIMIT 100`,
      q ? [`%${q}%`, `%${q}%`, `%${q}%`] : [],
    );
    return c.json({ items });
  })
  .post(
    "/wallets/:userId/adjust",
    requirePermission("leadgen", "manage"),
    validate("json", z.object({ credits: z.number().min(-10_000_000).max(10_000_000).refine((v) => v !== 0, "Enter an amount"), note: z.string().trim().min(3).max(300) })),
    async (c) => {
      const userId = Number(c.req.param("userId"));
      const { credits, note } = c.req.valid("json");
      await addCredits(userId, Math.abs(credits), credits > 0 ? "admin" : "debit", { note: `Admin: ${note}` });
      logActivity(c.get("admin").id, "updated", "wallet", userId, `${credits > 0 ? "Added" : "Removed"} ${Math.abs(credits)} credits — ${note}`);
      return c.json({ balance: await walletBalance(userId) });
    },
  )
  .post("/broadcasts/:id/cancel", requirePermission("leadgen", "manage"), async (c) => {
    const id = Number(c.req.param("id"));
    await cancelBroadcast(null, id);
    logActivity(c.get("admin").id, "suspended", "broadcasts", id, `Cancelled broadcast #${id} (credits refunded)`);
    return c.json({ ok: true });
  })
  // ---- Member picker -----------------------------------------------------------------------
  .get("/members", requirePermission("leadgen", "view"), async (c) => {
    const q = (c.req.query("q") ?? "").trim();
    if (q.length < 2) return c.json({ items: [] });
    const [items] = await getPool().query<RowDataPacket[]>(
      "SELECT id, full_name, email, username FROM users WHERE full_name LIKE ? OR email LIKE ? OR username LIKE ? ORDER BY full_name LIMIT 20",
      [`%${q}%`, `%${q}%`, `%${q}%`],
    );
    return c.json({ items });
  })
  // ---- Sender IDs created by an admin (approved straight away) ----------------------------
  .post(
    "/senders",
    requirePermission("leadgen", "manage"),
    validate(
      "json",
      z.object({
        userId: z.number().int().positive(),
        channel: z.enum(["sms", "email"]),
        sender: z.string().trim().min(2).max(60),
        replyTo: optionalText(150),
        purpose: optionalText(500),
      }),
    ),
    async (c) => {
      const input = c.req.valid("json");
      const admin = c.get("admin");
      if (input.channel === "sms" && !/^[A-Za-z0-9][A-Za-z0-9 ]{1,9}[A-Za-z0-9]$/.test(input.sender)) {
        throw new AppError("SMS sender IDs are 3–11 letters or numbers (spaces allowed inside).", 422);
      }
      if (input.channel === "email" && input.replyTo && !normalizeEmail(input.replyTo)) throw new AppError("Enter a valid reply-to email.", 422);
      const [users] = await getPool().execute<RowDataPacket[]>("SELECT id, email FROM users WHERE id = ?", [input.userId]);
      const user = users[0];
      if (!user) throw new AppError("Member not found.", 404);
      // Re-creating a sender the member already requested approves that request.
      await getPool().execute(
        `INSERT INTO sender_ids (user_id, channel, sender, reply_to, purpose, status, reviewed_by, reviewed_at)
         VALUES (?, ?, ?, ?, ?, 'approved', ?, NOW())
         ON DUPLICATE KEY UPDATE status = 'approved', status_reason = NULL, reply_to = VALUES(reply_to), reviewed_by = VALUES(reviewed_by), reviewed_at = NOW()`,
        [
          user.id,
          input.channel,
          input.sender,
          input.channel === "email" ? (input.replyTo ?? user.email) : null,
          input.purpose ?? "Created by a Capevars admin",
          admin.id,
        ],
      );
      logActivity(admin.id, "created", "sender_ids", user.id, `Created ${input.channel.toUpperCase()} sender ID "${input.sender}" for member #${user.id}`);
      notify(user.id, { kind: "leadgen", title: `Sender ID "${input.sender}" is ready to use`, link: "/leadgen/portal/senders" });
      return c.json({ ok: true }, 201);
    },
  )
  // ---- Capevars' private lead lists -----------------------------------------------------------
  .get("/lists", requirePermission("leadgen", "view"), async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT l.id, l.title, l.slug, l.category, l.status, l.contact_count, l.phone_count, l.email_count, l.allow_download, l.created_at,
         (SELECT COUNT(*) FROM lead_access a WHERE a.list_id = l.id AND a.status = 'active' AND (a.expires_at IS NULL OR a.expires_at > NOW())) AS live_shares,
         (SELECT COUNT(*) FROM lead_access a WHERE a.list_id = l.id AND a.status = 'active' AND a.expires_at <= NOW()) AS expired_shares
       FROM lead_lists l WHERE l.user_id IS NULL ORDER BY l.id DESC`,
    );
    return c.json({ items });
  })
  .post(
    "/lists",
    requirePermission("leadgen", "manage"),
    validate(
      "json",
      z.object({
        title: z.string().trim().min(3).max(200),
        category: z.enum(CATEGORIES),
        description: optionalText(5000),
        allowDownload: z.boolean().default(false),
        contacts: contactsSchema.min(1, "Upload at least one contact"),
      }),
    ),
    async (c) => {
      const input = c.req.valid("json");
      const slug = await uniqueSlug("lead_lists", input.title, null);
      const shareCode = await uniqueVoucher("lead_lists", "share_code", "LS");
      const [res] = await getPool().execute<ResultSetHeader>(
        "INSERT INTO lead_lists (user_id, title, slug, category, description, allow_download, share_code, status) VALUES (NULL, ?, ?, ?, ?, ?, ?, 'private')",
        [input.title, slug, input.category, input.description ?? null, input.allowDownload ? 1 : 0, shareCode],
      );
      const result = await insertContacts(res.insertId, input.contacts);
      logActivity(c.get("admin").id, "created", "lead_lists", res.insertId, `Created private lead list "${input.title}" (${result.added} contacts)`);
      return c.json({ id: res.insertId, ...result }, 201);
    },
  )
  .get("/lists/:id", requirePermission("leadgen", "view"), async (c) => {
    const list = await adminList(Number(c.req.param("id")));
    const [shares] = await getPool().query<RowDataPacket[]>(
      `SELECT a.id, a.user_id, a.voucher_code, a.status, a.expires_at, a.created_at, a.updated_at,
         a.status = 'active' AND a.expires_at <= NOW() AS expired, u.full_name, u.email
       FROM lead_access a JOIN users u ON u.id = a.user_id WHERE a.list_id = ? ORDER BY a.status = 'revoked', u.full_name`,
      [list.id],
    );
    return c.json({ list, shares });
  })
  .patch(
    "/lists/:id",
    requirePermission("leadgen", "manage"),
    validate("json", z.object({ title: z.string().trim().min(3).max(200).optional(), description: optionalText(5000), allowDownload: z.boolean().optional() })),
    async (c) => {
      const list = await adminList(Number(c.req.param("id")));
      const input = c.req.valid("json");
      await getPool().execute("UPDATE lead_lists SET title = ?, description = ?, allow_download = ? WHERE id = ?", [
        input.title ?? list.title,
        input.description === undefined ? list.description : input.description,
        input.allowDownload === undefined ? list.allow_download : input.allowDownload ? 1 : 0,
        list.id,
      ]);
      return c.json({ ok: true });
    },
  )
  .post("/lists/:id/contacts", requirePermission("leadgen", "manage"), validate("json", z.object({ contacts: contactsSchema })), async (c) => {
    const list = await adminList(Number(c.req.param("id")));
    return c.json(await insertContacts(list.id, c.req.valid("json").contacts));
  })
  .delete("/lists/:id", requirePermission("leadgen", "manage"), async (c) => {
    const list = await adminList(Number(c.req.param("id")));
    await getPool().execute("DELETE FROM lead_lists WHERE id = ?", [list.id]);
    logActivity(c.get("admin").id, "deleted", "lead_lists", list.id, `Deleted private lead list "${list.title}"`);
    return c.body(null, 204);
  })
  .post(
    "/lists/:id/shares",
    requirePermission("leadgen", "manage"),
    validate("json", z.object({ shares: z.array(z.object({ userId: z.number().int().positive(), expiresOn })).min(1).max(200) })),
    async (c) => {
      const list = await adminList(Number(c.req.param("id")));
      const { shares } = c.req.valid("json");
      for (const s of shares) {
        await shareList(list.id, s.userId, endOfDay(s.expiresOn));
        notify(s.userId, {
          kind: "leadgen",
          title: `Capevars shared "${list.title}" with you`,
          body: s.expiresOn ? `You can broadcast to it until ${s.expiresOn}.` : "Use its voucher code in the Broadcast portal.",
          link: "/leadgen/portal/leads",
        });
      }
      logActivity(c.get("admin").id, "updated", "lead_lists", list.id, `Shared "${list.title}" with ${shares.length} member(s)`);
      return c.json({ ok: true });
    },
  )
  .patch("/shares/:accessId", requirePermission("leadgen", "manage"), validate("json", z.object({ expiresOn })), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT a.list_id, a.user_id FROM lead_access a JOIN lead_lists l ON l.id = a.list_id WHERE a.id = ? AND l.user_id IS NULL",
      [Number(c.req.param("accessId"))],
    );
    if (!rows[0]) throw new AppError("Share not found.", 404);
    await shareList(rows[0].list_id, rows[0].user_id, endOfDay(c.req.valid("json").expiresOn));
    return c.json({ ok: true });
  })
  .delete("/shares/:accessId", requirePermission("leadgen", "manage"), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT a.id, a.list_id FROM lead_access a JOIN lead_lists l ON l.id = a.list_id WHERE a.id = ? AND l.user_id IS NULL",
      [Number(c.req.param("accessId"))],
    );
    if (!rows[0]) throw new AppError("Share not found.", 404);
    await getPool().execute("UPDATE lead_access SET status = 'revoked' WHERE id = ?", [rows[0].id]);
    await recountAccess(rows[0].list_id);
    logActivity(c.get("admin").id, "updated", "lead_lists", rows[0].list_id, `Revoked share #${rows[0].id}`);
    return c.body(null, 204);
  });
