// Admin tools for LeadGen beyond the moderation queues: credit vouchers,
// manual wallet adjustments, gateway status and cancelling broadcasts.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { validate } from "../../lib/validate.js";
import { optionalText } from "../../lib/fields.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";
import { randomCode } from "../../lib/codes.js";
import { addCredits, cancelBroadcast, walletBalance } from "../../lib/leadgen.js";
import { messagingStatus, smsBalance } from "../../lib/messaging.js";

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
  });
