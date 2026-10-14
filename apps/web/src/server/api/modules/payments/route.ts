// Paystack hand-offs. The browser comes back to /callback after paying; the
// webhook is the backstop if they close the tab first. Both verify with
// Paystack before fulfilling, and fulfilment runs at most once.
import { Hono } from "hono";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { requireMember } from "#/server/member-session-core";
import { paystackEnabled, verifyPayment, verifyWebhookSignature } from "../../lib/payments.js";

const safePath = (p: string | null | undefined) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/account");

export const paymentsRoute = new Hono()
  .get("/config", (c) => c.json({ online: paystackEnabled() }))
  .get("/callback", async (c) => {
    const reference = c.req.query("reference") ?? c.req.query("trxref") ?? "";
    if (!reference) return c.redirect("/account", 302);
    const payment = await verifyPayment(reference).catch(() => null);
    const back = safePath(payment?.return_path);
    const sep = back.includes("?") ? "&" : "?";
    return c.redirect(`${back}${sep}payment=${payment?.status ?? "failed"}&ref=${encodeURIComponent(reference)}`, 302);
  })
  .post("/webhook", async (c) => {
    const raw = await c.req.text();
    if (!verifyWebhookSignature(raw, c.req.header("x-paystack-signature"))) return c.body(null, 401);
    const event = JSON.parse(raw) as { event?: string; data?: { reference?: string } };
    if (event.event === "charge.success" && event.data?.reference) {
      await verifyPayment(event.data.reference).catch((err) => console.error("webhook verify:", err));
    }
    return c.body(null, 200);
  })
  .get("/mine", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT reference, purpose, amount, currency, provider, status, channel, paid_at, created_at FROM payments WHERE user_id = ? ORDER BY id DESC LIMIT 50",
      [c.get("member").id],
    );
    return c.json({ items: rows });
  });
