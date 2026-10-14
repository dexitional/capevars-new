// Payments for orders, tickets, course enrolments, donations and exhibition
// booths. With PAYSTACK_SECRET_KEY set, buyers pay online (card / mobile
// money) and the Paystack callback/webhook fulfils the purchase. Without it,
// purchases stay "pending" and the seller, organiser, instructor or group
// admin confirms payment by hand (cash, MoMo direct) — the same fulfil()
// runs either way.
import { createHmac, timingSafeEqual } from "node:crypto";
import { getPool } from "@cv/db";
import type { PaymentPurpose, PaymentRow } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { AppError } from "../middleware/error-handler.js";
import { paymentReference } from "./codes.js";
import { asList } from "./members.js";

const PAYSTACK = "https://api.paystack.co";

export const paystackEnabled = () => Boolean(process.env.PAYSTACK_SECRET_KEY);

const appUrl = () => (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function createPayment(opts: {
  userId: number | null;
  email: string;
  purpose: PaymentPurpose;
  targetIds: Array<number>;
  amount: number;
  returnPath: string;
  meta?: Record<string, unknown>;
}): Promise<{ reference: string; authorizationUrl: string | null }> {
  const reference = paymentReference();
  const online = paystackEnabled() && opts.amount > 0;
  await getPool().execute(
    `INSERT INTO payments (reference, user_id, purpose, target_ids, meta, amount, provider, email, return_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reference,
      opts.userId,
      opts.purpose,
      JSON.stringify(opts.targetIds),
      opts.meta ? JSON.stringify(opts.meta) : null,
      opts.amount.toFixed(2),
      online ? "paystack" : "manual",
      opts.email,
      opts.returnPath,
    ],
  );
  if (!online) return { reference, authorizationUrl: null };

  const res = await fetch(`${PAYSTACK}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: opts.email,
      amount: Math.round(opts.amount * 100), // pesewas
      currency: "GHS",
      reference,
      callback_url: `${appUrl()}/api/payments/callback`,
      metadata: { purpose: opts.purpose, targets: opts.targetIds },
    }),
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);
  const json = (await res?.json().catch(() => null)) as {
    status?: boolean;
    data?: { authorization_url?: string };
  } | null;
  if (!json?.status || !json.data?.authorization_url) {
    await getPool().execute("UPDATE payments SET status = 'failed' WHERE reference = ?", [reference]);
    throw new AppError("Couldn't start the payment. Please try again.", 400);
  }
  return { reference, authorizationUrl: json.data.authorization_url };
}

async function findPayment(reference: string) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM payments WHERE reference = ?", [
    reference,
  ]);
  const row = rows[0] as PaymentRow | undefined;
  if (!row) throw new AppError("Payment not found.", 404);
  const meta = typeof row.meta === "string" ? (JSON.parse(row.meta) as Record<string, unknown>) : row.meta;
  return { ...row, meta, target_ids: asList<number>(row.target_ids) };
}

// Asks Paystack for the truth (never trusts the redirect alone), then
// fulfils exactly once.
export async function verifyPayment(reference: string) {
  const payment = await findPayment(reference);
  if (payment.status !== "pending" || payment.provider !== "paystack") return payment;
  const res = await fetch(`${PAYSTACK}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);
  const json = (await res?.json().catch(() => null)) as {
    data?: { status?: string; amount?: number; channel?: string; currency?: string };
  } | null;
  const data = json?.data;
  if (!data) return payment;
  const expected = Math.round(Number(payment.amount) * 100);
  if (data.status === "success" && data.amount === expected && data.currency === "GHS") {
    await markPaid(payment, data.channel ?? null);
  } else if (data.status === "failed" || data.status === "abandoned") {
    await getPool().execute("UPDATE payments SET status = 'failed' WHERE id = ? AND status = 'pending'", [
      payment.id,
    ]);
  }
  return findPayment(reference);
}

export function verifyWebhookSignature(rawBody: string, signature: string | undefined) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const digest = createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function markPaid(payment: PaymentRow & { target_ids: Array<number> }, channel: string | null) {
  // Claim atomically so the callback and the webhook can't both fulfil.
  const [claim] = await getPool().execute<ResultSetHeader>(
    "UPDATE payments SET status = 'success', channel = ?, paid_at = NOW() WHERE id = ? AND status = 'pending'",
    [channel, payment.id],
  );
  if (!claim.affectedRows) return;
  await fulfil(payment.purpose, payment.target_ids, payment.id, payment);
}

// Marks the purchased things as paid. Also used when a seller/organiser
// confirms a manual (cash / MoMo direct) payment.
export async function fulfil(
  purpose: PaymentPurpose,
  ids: Array<number>,
  paymentId: number | null,
  payment?: Pick<PaymentRow, "user_id" | "meta" | "amount" | "reference">,
) {
  if (!ids.length && purpose !== "credits") return;
  const pool = getPool();
  switch (purpose) {
    case "order":
      await pool.query(
        `UPDATE orders SET payment_status = 'paid', status = IF(status = 'pending', 'confirmed', status) WHERE id IN (?)`,
        [ids],
      );
      break;
    case "ticket":
      await pool.query(
        "UPDATE tickets SET status = 'paid', payment_id = COALESCE(?, payment_id) WHERE id IN (?) AND status = 'reserved'",
        [paymentId, ids],
      );
      break;
    case "enrollment": {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id, course_id FROM enrollments WHERE id IN (?) AND status = 'pending_payment'",
        [ids],
      );
      for (const r of rows) {
        await pool.execute(
          "UPDATE enrollments SET status = 'active', payment_id = COALESCE(?, payment_id), amount_paid = (SELECT price FROM courses WHERE id = ?) WHERE id = ?",
          [paymentId, r.course_id, r.id],
        );
        await pool.execute("UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = ?", [
          r.course_id,
        ]);
      }
      break;
    }
    case "donation": {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id, campaign_id, amount FROM group_donations WHERE id IN (?) AND status = 'pending'",
        [ids],
      );
      for (const r of rows) {
        await pool.execute(
          "UPDATE group_donations SET status = 'confirmed', payment_id = COALESCE(?, payment_id) WHERE id = ?",
          [paymentId, r.id],
        );
        await pool.execute(
          "UPDATE group_campaigns SET raised_amount = raised_amount + ?, donor_count = donor_count + 1 WHERE id = ?",
          [r.amount, r.campaign_id],
        );
      }
      break;
    }
    case "lead": {
      const { activateLeadAccess } = await import("./leadgen.js");
      for (const id of ids) await activateLeadAccess(id, paymentId);
      break;
    }
    case "credits": {
      const credits = Number(payment?.meta?.credits ?? 0);
      if (payment?.user_id && credits > 0) {
        const { addCredits } = await import("./leadgen.js");
        await addCredits(payment.user_id, credits, "purchase", {
          amountGhs: Number(payment.amount),
          paymentId,
          reference: payment.reference,
          note: `Bought ${credits} broadcast credits`,
        });
      }
      break;
    }
    case "booth":
      await pool.query(
        "UPDATE exhibition_bookings SET status = 'paid' WHERE id IN (?) AND status IN ('requested', 'approved')",
        [ids],
      );
      break;
  }
}
