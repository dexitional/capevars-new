// LeadGen: a community leads hub. Members publish lists of phone/email
// contacts (free or priced, moderated before they're listed), others get or
// buy them, and everyone can broadcast bulk SMS/email to the lists they can
// access — picked by voucher code — paid for with broadcast credits.
import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { memberOrNull, optionalMember, requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl } from "../../lib/fields.js";
import { pageQuerySchema, paging } from "../../lib/query.js";
import { textSearch, money } from "../../lib/search.js";
import { uniqueSlug } from "../../lib/slug.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { createPayment, paystackEnabled } from "../../lib/payments.js";
import { messagingStatus, normalizeEmail, normalizePhone } from "../../lib/messaging.js";
import {
  activateLeadAccess,
  buildRecipients,
  cancelBroadcast,
  createBroadcast,
  estimate,
  grantAccess,
  leadgenSettings,
  optoutToken,
  redeemCreditVoucher,
  uniqueVoucher,
  walletBalance,
} from "../../lib/leadgen.js";

const CATEGORIES = ["group", "community", "business", "people", "institution", "association", "other"] as const;

const contactSchema = z.object({
  name: z.string().trim().max(150).nullish(),
  phone: z.union([z.string(), z.number()]).nullish(),
  email: z.string().trim().max(150).nullish(),
  organization: z.string().trim().max(150).nullish(),
  role: z.string().trim().max(100).nullish(),
  location: z.string().trim().max(150).nullish(),
});
const contactsSchema = z.array(contactSchema).max(20_000);

const listSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.enum(CATEGORIES),
  subcategory: optionalText(100),
  description: optionalText(5000),
  coverUrl: optionalUrl,
  tags: z.array(z.string().trim().min(1).max(40)).max(15).optional(),
  region: optionalText(100),
  price: z.number().min(0).max(100_000).optional(),
  allowDownload: z.boolean().optional(),
  consentConfirmed: z.boolean().optional(),
});
const LIST_FIELDS: Record<string, string> = {
  title: "title",
  category: "category",
  subcategory: "subcategory",
  description: "description",
  coverUrl: "cover_url",
  tags: "tags",
  region: "region",
  price: "price",
  allowDownload: "allow_download",
  consentConfirmed: "consent_confirmed",
};

const audienceSchema = z.object({
  accessIds: z.array(z.number().int().positive()).max(50).default([]),
  vouchers: z.array(z.string().trim().min(4).max(16)).max(50).default([]),
  contacts: contactsSchema.default([]),
});
const broadcastSchema = z.object({
  channel: z.enum(["sms", "email"]),
  senderId: z.number().int().positive().nullable().optional(),
  subject: optionalText(200),
  body: z.string().trim().min(1, "Write your message").max(5000),
  audience: audienceSchema,
  scheduledAt: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? `${v.replace("T", " ").slice(0, 16)}:00` : null)),
});

const senderSchema = z.object({
  channel: z.enum(["sms", "email"]),
  sender: z.string().trim().min(2).max(60),
  replyTo: optionalText(150),
  purpose: z.string().trim().min(10, "Tell us what you'll send").max(500),
  sampleMessage: optionalText(500),
});

const CARD = `l.id, l.title, l.slug, l.category, l.subcategory, l.cover_url, l.region, l.tags, l.phone_count, l.email_count,
  l.contact_count, l.price, l.allow_download, l.is_featured, l.access_count, l.created_at,
  u.full_name AS owner_name, u.username AS owner_username, u.avatar_url AS owner_avatar, u.is_verified AS owner_verified`;

// "0244123456" → "024•••••56", "ama@gmail.com" → "am•••@gmail.com"
const maskPhone = (p: string | null) => (p ? `${p.slice(0, 5)}${"•".repeat(Math.max(0, p.length - 7))}${p.slice(-2)}` : null);
const maskEmail = (e: string | null) => {
  if (!e) return null;
  const [user = "", domain = ""] = e.split("@");
  return `${user.slice(0, 2)}•••@${domain}`;
};
const maskName = (n: string | null) => (n ? n.split(/\s+/).map((w, i) => (i === 0 ? w : `${w[0] ?? ""}.`)).join(" ") : null);

async function recountList(listId: number) {
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
async function insertContacts(listId: number, raw: z.infer<typeof contactsSchema>) {
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

async function ownedList(c: Context, id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM lead_lists WHERE id = ? AND user_id = ?", [id, c.get("member").id]);
  if (!rows[0]) throw new AppError("List not found.", 404);
  return rows[0];
}

const csvCell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  // Neutralise spreadsheet formulas and quote everything.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export const leadgenRoute = new Hono()
  .use("*", optionalMember)
  // ---- Public repository -----------------------------------------------------------
  .get("/home", async (c) => {
    const pool = getPool();
    const [[cats], [featured], [latest], [stats]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT category, COUNT(*) AS n, SUM(contact_count) AS contacts FROM lead_lists WHERE status = 'published' GROUP BY category"),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM lead_lists l LEFT JOIN users u ON u.id = l.user_id WHERE l.status = 'published'
         ORDER BY l.is_featured DESC, l.access_count DESC LIMIT 8`,
      ),
      pool.query<RowDataPacket[]>(`SELECT ${CARD} FROM lead_lists l LEFT JOIN users u ON u.id = l.user_id WHERE l.status = 'published' ORDER BY l.id DESC LIMIT 8`),
      pool.query<RowDataPacket[]>(
        `SELECT (SELECT COUNT(*) FROM lead_lists WHERE status = 'published') AS lists,
           (SELECT COALESCE(SUM(contact_count), 0) FROM lead_lists WHERE status = 'published') AS contacts,
           (SELECT COUNT(*) FROM broadcasts WHERE status = 'sent') AS broadcasts,
           (SELECT COALESCE(SUM(sent_count), 0) FROM broadcasts) AS messages`,
      ),
    ]);
    return c.json({ categories: cats, featured, latest, stats: stats[0], settings: await leadgenSettings() });
  })
  .get("/lists", async (c) => {
    const q = pageQuerySchema
      .extend({
        category: z.enum(CATEGORIES).optional().catch(undefined),
        price: z.enum(["free", "paid"]).optional().catch(undefined),
        has: z.enum(["phone", "email"]).optional().catch(undefined),
        sort: z.enum(["popular", "newest", "largest", "price_asc"]).catch("popular"),
      })
      .parse(c.req.query());
    const where = ["l.status = 'published'"];
    const params: Array<string | number> = [];
    if (q.category) {
      where.push("l.category = ?");
      params.push(q.category);
    }
    if (q.price === "free") where.push("l.price = 0");
    if (q.price === "paid") where.push("l.price > 0");
    if (q.has === "phone") where.push("l.phone_count > 0");
    if (q.has === "email") where.push("l.email_count > 0");
    if (q.q) {
      const s = textSearch("l.title, l.subcategory, l.description", ["l.title", "l.region"], q.q);
      where.push(s.sql);
      params.push(...s.params);
    }
    const order = { popular: "l.is_featured DESC, l.access_count DESC", newest: "l.id DESC", largest: "l.contact_count DESC", price_asc: "l.price ASC" }[q.sort];
    const { limit, offset } = paging(q.page, q.pageSize);
    const clause = where.join(" AND ");
    const pool = getPool();
    const [[items], [count]] = await Promise.all([
      pool.query<RowDataPacket[]>(`SELECT ${CARD} FROM lead_lists l LEFT JOIN users u ON u.id = l.user_id WHERE ${clause} ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]),
      pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM lead_lists l WHERE ${clause}`, params),
    ]);
    return c.json({ items, total: Number(count[0]?.n ?? 0) });
  })
  .get("/lists/:slug", async (c) => {
    const member = memberOrNull(c);
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT l.*, u.full_name AS owner_name, u.username AS owner_username, u.avatar_url AS owner_avatar, u.is_verified AS owner_verified
       FROM lead_lists l LEFT JOIN users u ON u.id = l.user_id WHERE l.slug = ?`,
      [c.req.param("slug")],
    );
    const list = rows[0];
    const isOwner = Boolean(member && list?.user_id === member.id);
    if (!list || (list.status !== "published" && !isOwner)) throw new AppError("Lead list not found.", 404);
    const [sample] = await pool.query<RowDataPacket[]>(
      "SELECT name, phone, email, organization, role, location FROM lead_contacts WHERE list_id = ? ORDER BY id LIMIT 8",
      [list.id],
    );
    let access = null;
    if (member) {
      const [a] = await pool.execute<RowDataPacket[]>("SELECT id, voucher_code, status, source FROM lead_access WHERE list_id = ? AND user_id = ?", [list.id, member.id]);
      access = a[0] ?? null;
    }
    const { share_code: shareCode, ...rest } = list;
    return c.json({
      list: { ...rest, share_code: isOwner ? shareCode : undefined },
      sample: sample.map((s) => ({ ...s, name: maskName(s.name), phone: maskPhone(s.phone), email: maskEmail(s.email) })),
      access,
      isOwner,
      onlinePayments: paystackEnabled(),
    });
  })
  .post("/lists/:id/get", requireMember, async (c) => {
    const member = c.get("member");
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM lead_lists WHERE id = ? AND status = 'published'", [id]);
    const list = rows[0];
    if (!list) throw new AppError("Lead list not found.", 404);
    if (list.user_id === member.id) throw new AppError("This is your own list.", 409);
    const price = money(list.price);
    if (price === 0) {
      const access = await grantAccess(id, member.id, "free");
      notify(list.user_id, { kind: "leadgen", title: `${member.fullName} got your list "${list.title}"`, actorId: member.id });
      return c.json({ status: access.status, voucher: access.voucher_code });
    }
    const settings = await leadgenSettings();
    const earning = money(price * (1 - settings.platformFeePercent / 100));
    const access = await grantAccess(id, member.id, "purchase", { status: "pending", amountPaid: price, ownerEarning: earning });
    if (access.status === "active") return c.json({ status: "active", voucher: access.voucher_code });
    const payment = await createPayment({
      userId: member.id,
      email: member.email,
      purpose: "lead",
      targetIds: [access.id],
      amount: price,
      returnPath: `/leadgen/l/${list.slug}`,
    });
    if (!payment.authorizationUrl) {
      notify(list.user_id, {
        kind: "leadgen",
        title: `${member.fullName} wants to buy "${list.title}"`,
        body: `Confirm their GHS ${price.toFixed(2)} payment in LeadGen → My leads.`,
        link: "/leadgen/portal/leads",
        actorId: member.id,
      });
    }
    return c.json({ status: "pending", authorizationUrl: payment.authorizationUrl });
  })
  .post("/redeem", requireMember, validate("json", z.object({ code: z.string().trim().min(4).max(24) })), async (c) => {
    const member = c.get("member");
    const code = c.req.valid("json").code.toUpperCase();
    const credit = await redeemCreditVoucher(member.id, code);
    if (credit) return c.json({ kind: "credits", ...credit });
    const [lists] = await getPool().execute<RowDataPacket[]>("SELECT id, title, user_id, status FROM lead_lists WHERE share_code = ?", [code]);
    const list = lists[0];
    if (list && list.status !== "suspended") {
      if (list.user_id === member.id) throw new AppError("That's your own list's share code.", 409);
      const access = await grantAccess(list.id, member.id, "share");
      return c.json({ kind: "list", title: list.title, voucher: access.voucher_code });
    }
    throw new AppError("That code isn't valid.", 404);
  })
  .get("/unsubscribe", async (c) => {
    const email = normalizeEmail(c.req.query("e"));
    const ok = email && c.req.query("t") === optoutToken("email", email);
    if (ok) await getPool().execute("INSERT IGNORE INTO broadcast_optouts (channel, address) VALUES ('email', ?)", [email]);
    return c.html(
      `<!doctype html><meta name="viewport" content="width=device-width"><title>Unsubscribe</title>
       <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:15vh auto;padding:24px;text-align:center;color:#041d40">
       <h1 style="font-size:22px">${ok ? "You're unsubscribed" : "Link not valid"}</h1>
       <p style="color:#5a6478">${ok ? `${email} won't receive LeadGen broadcasts from Capevars members again.` : "This unsubscribe link is incomplete or has expired."}</p></div>`,
      ok ? 200 : 400,
    );
  })
  // ---- Portal ---------------------------------------------------------------------------
  .get("/portal/summary", requireMember, async (c) => {
    const id = c.get("member").id;
    const pool = getPool();
    const [[recent], [lists], [senders], [stats]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT id, channel, subject, LEFT(body, 120) AS preview, recipient_count, sent_count, failed_count, status, created_at FROM broadcasts WHERE user_id = ? ORDER BY id DESC LIMIT 6", [id]),
      pool.query<RowDataPacket[]>("SELECT COUNT(*) AS `accessible`, COALESCE(SUM(l.contact_count), 0) AS contacts FROM lead_access a JOIN lead_lists l ON l.id = a.list_id WHERE a.user_id = ? AND a.status = 'active'", [id]),
      pool.query<RowDataPacket[]>("SELECT channel, sender, status FROM sender_ids WHERE user_id = ? ORDER BY status = 'approved' DESC, id DESC", [id]),
      pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS broadcasts, COALESCE(SUM(sent_count), 0) AS sent, COALESCE(SUM(cost_credits - refunded_credits), 0) AS spent FROM broadcasts WHERE user_id = ?",
        [id],
      ),
    ]);
    return c.json({ balance: await walletBalance(id), recent, lists: lists[0], senders, stats: stats[0], messaging: messagingStatus() });
  })
  .get("/portal/access", requireMember, async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT a.id AS access_id, a.voucher_code, a.source, a.status AS access_status, a.created_at AS acquired_at,
         l.id, l.title, l.slug, l.category, l.status, l.phone_count, l.email_count, l.contact_count, l.allow_download, l.user_id = ? AS is_owner
       FROM lead_access a JOIN lead_lists l ON l.id = a.list_id WHERE a.user_id = ? AND a.status <> 'revoked' AND l.status <> 'suspended'
       ORDER BY a.id DESC`,
      [c.get("member").id, c.get("member").id],
    );
    return c.json({ items });
  })
  .get("/portal/lists", requireMember, async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT l.*, a.voucher_code,
         (SELECT COUNT(*) FROM lead_access x WHERE x.list_id = l.id AND x.status = 'pending') AS pending_requests,
         (SELECT COALESCE(SUM(owner_earning), 0) FROM lead_access x WHERE x.list_id = l.id AND x.status = 'active' AND x.source = 'purchase') AS earned
       FROM lead_lists l LEFT JOIN lead_access a ON a.list_id = l.id AND a.user_id = l.user_id WHERE l.user_id = ? ORDER BY l.id DESC`,
      [c.get("member").id],
    );
    return c.json({ items });
  })
  .post("/portal/lists", requireMember, validate("json", listSchema.extend({ contacts: contactsSchema, submit: z.boolean().optional() })), async (c) => {
    const member = c.get("member");
    const { contacts, submit, ...input } = c.req.valid("json");
    if (submit && !input.consentConfirmed) throw new AppError("Confirm you have consent to share these contacts before publishing.", 422);
    const slug = await uniqueSlug("lead_lists", input.title, null);
    const shareCode = await uniqueVoucher("lead_lists", "share_code", "LS");
    const cols = Object.entries(LIST_FIELDS).filter(([k]) => (input as Record<string, unknown>)[k] !== undefined);
    const values = cols.map(([k]) => {
      const v = (input as Record<string, unknown>)[k];
      return typeof v === "boolean" ? (v ? 1 : 0) : Array.isArray(v) ? JSON.stringify(v) : (v as string | number | null);
    });
    const [res] = await getPool().execute<ResultSetHeader>(
      `INSERT INTO lead_lists (${[...cols.map(([, col]) => col), "user_id", "slug", "share_code", "status"].join(", ")})
       VALUES (${[...cols, 1, 2, 3, 4].map(() => "?").join(", ")})`,
      [...values, member.id, slug, shareCode, submit ? "pending" : "private"],
    );
    const result = await insertContacts(res.insertId, contacts);
    await grantAccess(res.insertId, member.id, "owner");
    return c.json({ id: res.insertId, slug, ...result }, 201);
  })
  .get("/portal/lists/:id", requireMember, async (c) => {
    const list = await ownedList(c, Number(c.req.param("id")));
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const q = (c.req.query("q") ?? "").trim();
    const where = q ? "AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR organization LIKE ?)" : "";
    const params = q ? [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`] : [];
    const [[contacts], [count], [buyers]] = await Promise.all([
      getPool().query<RowDataPacket[]>(`SELECT * FROM lead_contacts WHERE list_id = ? ${where} ORDER BY id LIMIT 50 OFFSET ?`, [list.id, ...params, (page - 1) * 50]),
      getPool().query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM lead_contacts WHERE list_id = ? ${where}`, [list.id, ...params]),
      getPool().query<RowDataPacket[]>(
        `SELECT a.id, a.source, a.status, a.amount_paid, a.owner_earning, a.created_at, u.full_name, u.username, u.email
         FROM lead_access a JOIN users u ON u.id = a.user_id WHERE a.list_id = ? AND a.source <> 'owner' ORDER BY a.status = 'pending' DESC, a.id DESC LIMIT 200`,
        [list.id],
      ),
    ]);
    return c.json({ list, contacts, total: Number(count[0]?.n ?? 0), buyers });
  })
  .patch("/portal/lists/:id", requireMember, validate("json", listSchema.partial().extend({ submit: z.boolean().optional(), makePrivate: z.boolean().optional() })), async (c) => {
    const list = await ownedList(c, Number(c.req.param("id")));
    if (list.status === "suspended") throw new AppError("This list was suspended by moderators.", 403);
    const { submit, makePrivate, ...input } = c.req.valid("json");
    const sets: Array<string> = [];
    const params: Array<string | number | null> = [];
    for (const [k, col] of Object.entries(LIST_FIELDS)) {
      const v = (input as Record<string, unknown>)[k];
      if (v === undefined) continue;
      sets.push(`${col} = ?`);
      params.push(typeof v === "boolean" ? (v ? 1 : 0) : Array.isArray(v) ? JSON.stringify(v) : (v as string | number | null));
    }
    if (submit) {
      if (!(input.consentConfirmed ?? list.consent_confirmed)) throw new AppError("Confirm you have consent to share these contacts before publishing.", 422);
      if (list.contact_count === 0) throw new AppError("Add contacts before publishing.", 422);
      sets.push("status = ?", "status_reason = NULL");
      params.push("pending");
    } else if (makePrivate) {
      sets.push("status = ?");
      params.push("private");
    }
    if (sets.length) await getPool().execute(`UPDATE lead_lists SET ${sets.join(", ")} WHERE id = ?`, [...params, list.id]);
    return c.json({ ok: true });
  })
  .post("/portal/lists/:id/contacts", requireMember, validate("json", z.object({ contacts: contactsSchema })), async (c) => {
    const list = await ownedList(c, Number(c.req.param("id")));
    return c.json(await insertContacts(list.id, c.req.valid("json").contacts));
  })
  .delete("/portal/lists/:id/contacts/:contactId", requireMember, async (c) => {
    const list = await ownedList(c, Number(c.req.param("id")));
    await getPool().execute("DELETE FROM lead_contacts WHERE id = ? AND list_id = ?", [Number(c.req.param("contactId")), list.id]);
    await recountList(list.id);
    return c.body(null, 204);
  })
  .delete("/portal/lists/:id", requireMember, async (c) => {
    const list = await ownedList(c, Number(c.req.param("id")));
    const [sold] = await getPool().execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM lead_access WHERE list_id = ? AND source = 'purchase' AND status = 'active'", [list.id]);
    if (Number(sold[0]?.n ?? 0) > 0) throw new AppError("This list has buyers, so it can't be deleted. Make it private instead.", 409);
    await getPool().execute("DELETE FROM lead_lists WHERE id = ?", [list.id]);
    return c.body(null, 204);
  })
  .get("/portal/lists/:id/download", requireMember, async (c) => {
    const member = c.get("member");
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT l.title, l.slug, l.allow_download, l.user_id FROM lead_lists l JOIN lead_access a ON a.list_id = l.id
       WHERE l.id = ? AND a.user_id = ? AND a.status = 'active' AND l.status <> 'suspended'`,
      [id, member.id],
    );
    const list = rows[0];
    if (!list) throw new AppError("List not found.", 404);
    if (list.user_id !== member.id && !list.allow_download) throw new AppError("The owner allows broadcasting to this list, but not downloading it.", 403);
    const [contacts] = await getPool().query<RowDataPacket[]>("SELECT name, phone, email, organization, role, location FROM lead_contacts WHERE list_id = ? ORDER BY id", [id]);
    const lines = [["Name", "Phone", "Email", "Organisation", "Role", "Location"].join(","), ...contacts.map((r) => [r.name, r.phone, r.email, r.organization, r.role, r.location].map(csvCell).join(","))];
    return c.body(`\uFEFF${lines.join("\r\n")}`, 200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${list.slug}.csv"`,
    });
  })
  .post("/portal/requests/:accessId/confirm", requireMember, async (c) => {
    const accessId = Number(c.req.param("accessId"));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT a.id FROM lead_access a JOIN lead_lists l ON l.id = a.list_id WHERE a.id = ? AND l.user_id = ? AND a.status = 'pending'",
      [accessId, c.get("member").id],
    );
    if (!rows[0]) throw new AppError("Request not found.", 404);
    await activateLeadAccess(accessId, null);
    return c.json({ ok: true });
  })
  // ---- Wallet & billing ------------------------------------------------------------------
  .get("/portal/wallet", requireMember, async (c) => {
    const id = c.get("member").id;
    const [items] = await getPool().query<RowDataPacket[]>("SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY id DESC LIMIT 200", [id]);
    const s = await leadgenSettings();
    return c.json({ balance: await walletBalance(id), transactions: items, bundles: s.bundles, smsCreditCost: s.smsCreditCost, emailCreditCost: s.emailCreditCost, onlinePayments: paystackEnabled() });
  })
  .post("/portal/wallet/buy", requireMember, validate("json", z.object({ bundle: z.number().int().min(0).max(20) })), async (c) => {
    const member = c.get("member");
    const s = await leadgenSettings();
    const bundle = s.bundles[c.req.valid("json").bundle];
    if (!bundle) throw new AppError("Pick a credit bundle.", 422);
    const payment = await createPayment({
      userId: member.id,
      email: member.email,
      purpose: "credits",
      targetIds: [],
      amount: bundle.price,
      returnPath: "/leadgen/portal/wallet",
      meta: { credits: bundle.credits },
    });
    if (!payment.authorizationUrl) throw new AppError("Online payment isn't available yet. Redeem a credit voucher, or contact support to top up.", 400);
    return c.json(payment);
  })
  // ---- Sender IDs ---------------------------------------------------------------------------
  .get("/portal/senders", requireMember, async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>("SELECT * FROM sender_ids WHERE user_id = ? ORDER BY id DESC", [c.get("member").id]);
    const s = await leadgenSettings();
    return c.json({ items, defaults: { sms: s.defaultSmsSender, email: s.defaultEmailSender } });
  })
  .post("/portal/senders", requireMember, validate("json", senderSchema), async (c) => {
    const input = c.req.valid("json");
    if (input.channel === "sms" && !/^[A-Za-z0-9][A-Za-z0-9 ]{1,9}[A-Za-z0-9]$/.test(input.sender)) {
      throw new AppError("SMS sender IDs are 3–11 letters or numbers (spaces allowed inside).", 422);
    }
    if (input.channel === "email" && input.replyTo && !normalizeEmail(input.replyTo)) throw new AppError("Enter a valid reply-to email.", 422);
    try {
      await getPool().execute("INSERT INTO sender_ids (user_id, channel, sender, reply_to, purpose, sample_message) VALUES (?, ?, ?, ?, ?, ?)", [
        c.get("member").id,
        input.channel,
        input.sender,
        input.channel === "email" ? (input.replyTo ?? c.get("member").email) : null,
        input.purpose,
        input.sampleMessage ?? null,
      ]);
    } catch (err) {
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new AppError("You've already registered that sender.", 409);
      throw err;
    }
    return c.json({ ok: true }, 201);
  })
  .delete("/portal/senders/:id", requireMember, async (c) => {
    await getPool().execute("DELETE FROM sender_ids WHERE id = ? AND user_id = ?", [Number(c.req.param("id")), c.get("member").id]);
    return c.body(null, 204);
  })
  // ---- Broadcasts ---------------------------------------------------------------------------
  .post("/portal/broadcasts/estimate", requireMember, validate("json", broadcastSchema.partial({ body: true }).extend({ body: z.string().max(5000).default("") })), async (c) => {
    const member = c.get("member");
    const input = c.req.valid("json");
    const accessIds = await resolveAudience(member.id, input.audience.accessIds, input.audience.vouchers);
    const s = await leadgenSettings();
    const r = await buildRecipients(member.id, input.channel, accessIds, input.audience.contacts, s.maxRecipients);
    const est = await estimate(input.channel, input.body || " ", r.recipients.length);
    return c.json({ recipients: r.recipients.length, invalid: r.invalid, optedOut: r.optedOut, ...est, balance: await walletBalance(member.id), accessIds });
  })
  .post("/portal/broadcasts", requireMember, validate("json", broadcastSchema), async (c) => {
    const member = c.get("member");
    const input = c.req.valid("json");
    const status = messagingStatus();
    if (!status[input.channel]) throw new AppError(`${input.channel === "sms" ? "SMS" : "Email"} sending isn't set up on this server yet.`, 400);
    if (input.channel === "email" && !input.subject) throw new AppError("Add an email subject.", 422);
    const s = await leadgenSettings();
    let senderLabel = input.channel === "sms" ? s.defaultSmsSender : s.defaultEmailSender;
    let replyTo: string | null = input.channel === "email" ? member.email : null;
    if (input.senderId) {
      const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM sender_ids WHERE id = ? AND user_id = ? AND channel = ?", [input.senderId, member.id, input.channel]);
      const sender = rows[0];
      if (!sender) throw new AppError("Sender ID not found.", 404);
      if (sender.status !== "approved") throw new AppError("That sender ID isn't approved yet.", 409);
      senderLabel = sender.sender;
      replyTo = sender.reply_to ?? replyTo;
    }
    if (input.scheduledAt && new Date(`${input.scheduledAt.replace(" ", "T")}Z`).getTime() < Date.now() - 60_000) {
      throw new AppError("Pick a time in the future (times are GMT).", 422);
    }
    const accessIds = await resolveAudience(member.id, input.audience.accessIds, input.audience.vouchers);
    const r = await buildRecipients(member.id, input.channel, accessIds, input.audience.contacts, s.maxRecipients);
    const created = await createBroadcast({
      userId: member.id,
      channel: input.channel,
      senderId: input.senderId ?? null,
      senderLabel,
      replyTo,
      subject: input.subject ?? null,
      body: input.body,
      audience: { accessIds, uploaded: input.audience.contacts.length },
      recipients: r.recipients,
      scheduledAt: input.scheduledAt,
    });
    return c.json(created, 201);
  })
  .get("/portal/broadcasts", requireMember, async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      "SELECT id, channel, sender_label, subject, LEFT(body, 140) AS preview, recipient_count, sent_count, failed_count, cost_credits, refunded_credits, status, scheduled_at, created_at, finished_at, error FROM broadcasts WHERE user_id = ? ORDER BY id DESC LIMIT 200",
      [c.get("member").id],
    );
    return c.json({ items });
  })
  .get("/portal/broadcasts/:id", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM broadcasts WHERE id = ? AND user_id = ?", [Number(c.req.param("id")), c.get("member").id]);
    const b = rows[0];
    if (!b) throw new AppError("Broadcast not found.", 404);
    const status = c.req.query("status");
    const [recipients] = await getPool().query<RowDataPacket[]>(
      `SELECT name, address, status, provider_status, error, sent_at FROM broadcast_recipients WHERE broadcast_id = ? ${status ? "AND status = ?" : ""} ORDER BY id LIMIT 500`,
      status ? [b.id, status] : [b.id],
    );
    return c.json({ broadcast: b, recipients });
  })
  .post("/portal/broadcasts/:id/cancel", requireMember, async (c) => {
    await cancelBroadcast(c.get("member").id, Number(c.req.param("id")));
    return c.json({ ok: true });
  })
  // ---- Earnings & payouts -------------------------------------------------------------------
  .get("/portal/earnings", requireMember, async (c) => {
    const id = c.get("member").id;
    const pool = getPool();
    const [[sales], [payouts], [totals]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT a.id, a.amount_paid, a.owner_earning, a.created_at, l.title, u.full_name AS buyer_name
         FROM lead_access a JOIN lead_lists l ON l.id = a.list_id JOIN users u ON u.id = a.user_id
         WHERE l.user_id = ? AND a.source = 'purchase' AND a.status = 'active' ORDER BY a.id DESC LIMIT 200`,
        [id],
      ),
      pool.query<RowDataPacket[]>("SELECT * FROM lead_payouts WHERE user_id = ? ORDER BY id DESC", [id]),
      pool.query<RowDataPacket[]>(
        `SELECT (SELECT COALESCE(SUM(a.owner_earning), 0) FROM lead_access a JOIN lead_lists l ON l.id = a.list_id
                 WHERE l.user_id = ? AND a.source = 'purchase' AND a.status = 'active') AS earned,
           (SELECT COALESCE(SUM(amount), 0) FROM lead_payouts WHERE user_id = ? AND status IN ('requested', 'paid')) AS withdrawn`,
        [id, id],
      ),
    ]);
    const s = await leadgenSettings();
    const earned = money(totals[0]?.earned);
    const withdrawn = money(totals[0]?.withdrawn);
    return c.json({ sales, payouts, earned, withdrawn, available: money(earned - withdrawn), minPayout: s.minPayout, feePercent: s.platformFeePercent });
  })
  .post(
    "/portal/payouts",
    requireMember,
    validate("json", z.object({ amount: z.number().min(1), momoNumber: z.string().trim().min(9).max(30), momoName: z.string().trim().min(2).max(150) })),
    async (c) => {
      const id = c.get("member").id;
      const input = c.req.valid("json");
      const s = await leadgenSettings();
      const conn = await getPool().getConnection();
      try {
        await conn.beginTransaction();
        // One payout request at a time per member.
        await conn.execute("SELECT id FROM users WHERE id = ? FOR UPDATE", [id]);
        const [rows] = await conn.execute<RowDataPacket[]>(
          `SELECT (SELECT COALESCE(SUM(a.owner_earning), 0) FROM lead_access a JOIN lead_lists l ON l.id = a.list_id
                   WHERE l.user_id = ? AND a.source = 'purchase' AND a.status = 'active')
                - (SELECT COALESCE(SUM(amount), 0) FROM lead_payouts WHERE user_id = ? AND status IN ('requested', 'paid')) AS available`,
          [id, id],
        );
        const available = money(rows[0]?.available);
        if (input.amount < s.minPayout) throw new AppError(`The minimum payout is GHS ${s.minPayout}.`, 422);
        if (input.amount > available) throw new AppError(`You can withdraw up to GHS ${available.toFixed(2)}.`, 422);
        await conn.execute("INSERT INTO lead_payouts (user_id, amount, momo_number, momo_name) VALUES (?, ?, ?, ?)", [id, money(input.amount), input.momoNumber, input.momoName]);
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
      return c.json({ ok: true }, 201);
    },
  );

// Access ids the member picked directly, plus lists added by voucher code.
async function resolveAudience(userId: number, accessIds: Array<number>, vouchers: Array<string>) {
  const ids = new Set(accessIds);
  if (vouchers.length) {
    const [rows] = await getPool().query<RowDataPacket[]>(
      "SELECT id, voucher_code FROM lead_access WHERE voucher_code IN (?) AND user_id = ? AND status = 'active'",
      [vouchers.map((v) => v.toUpperCase()), userId],
    );
    const found = new Set(rows.map((r) => r.voucher_code as string));
    const missing = vouchers.filter((v) => !found.has(v.toUpperCase()));
    if (missing.length) throw new AppError(`Voucher ${missing[0]} isn't one of your lead lists. Get the list first, or redeem its share code.`, 404);
    for (const r of rows) ids.add(r.id as number);
  }
  return [...ids];
}
