// Marketplace for buyers: browse and search products, stores and food
// vendors; review products; check out (one order per seller); track orders.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { memberOrNull, optionalMember, requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { pageQuerySchema, paging } from "../../lib/query.js";
import { textSearch, money } from "../../lib/search.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { orderNumber } from "../../lib/codes.js";
import { createPayment } from "../../lib/payments.js";
import { optionalText } from "../../lib/fields.js";

// Columns for product cards (a single cover image, store name and slug).
const CARD = `p.id, p.slug, p.title, p.kind, p.price, p.compare_at_price, p.item_condition, p.stock,
  JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS image, p.rating_avg, p.rating_count, p.sold_count,
  p.is_featured, p.created_at, s.store_name, s.slug AS store_slug, s.location AS store_location, s.is_verified AS store_verified`;

const LIVE = "p.status = 'active' AND s.status = 'approved'";

const listSchema = pageQuerySchema.extend({
  category: z.string().max(120).optional().catch(undefined),
  store: z.string().max(160).optional().catch(undefined),
  kind: z.enum(["product", "food"]).optional().catch(undefined),
  min: z.coerce.number().min(0).optional().catch(undefined),
  max: z.coerce.number().min(0).optional().catch(undefined),
  condition: z.enum(["new", "used", "refurbished"]).optional().catch(undefined),
  deals: z.coerce.boolean().optional().catch(undefined),
  sort: z.enum(["relevance", "newest", "price_asc", "price_desc", "popular", "rating"]).catch("newest"),
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: optionalText(2000),
});

const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(99) }))
    .min(1)
    .max(50),
  fulfilment: z.enum(["delivery", "pickup"]),
  contactName: z.string().trim().min(2).max(150),
  contactPhone: z.string().trim().min(9).max(30),
  deliveryAddress: optionalText(500),
  notes: optionalText(1000),
  paymentMethod: z.enum(["online", "cash", "momo_direct"]),
});

const quoteSchema = z.object({ ids: z.array(z.number().int().positive()).max(60) });

async function categoryIds(slug: string): Promise<Array<number>> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT id FROM market_categories WHERE slug = ? OR parent_id = (SELECT id FROM market_categories WHERE slug = ?)",
    [slug, slug],
  );
  return rows.map((r) => r.id as number);
}

async function listProducts(q: z.infer<typeof listSchema>) {
  const where = [LIVE];
  const params: Array<string | number | Array<number>> = [];
  let rank = "";
  if (q.kind) {
    where.push("p.kind = ?");
    params.push(q.kind);
  }
  if (q.category) {
    const ids = await categoryIds(q.category);
    if (!ids.length) return { items: [], total: 0 };
    where.push("p.category_id IN (?)");
    params.push(ids);
  }
  if (q.store) {
    where.push("s.slug = ?");
    params.push(q.store);
  }
  if (q.min !== undefined) {
    where.push("p.price >= ?");
    params.push(q.min);
  }
  if (q.max !== undefined && q.max > 0) {
    where.push("p.price <= ?");
    params.push(q.max);
  }
  if (q.condition) {
    where.push("p.item_condition = ?");
    params.push(q.condition);
  }
  if (q.deals) where.push("p.compare_at_price > p.price");
  if (q.q) {
    const s = textSearch("p.title, p.description", ["p.title", "s.store_name"], q.q);
    where.push(s.sql);
    params.push(...s.params);
    if (q.sort === "relevance") rank = "p.title LIKE ? DESC,";
  }
  const order = {
    relevance: `${rank} p.is_featured DESC, p.sold_count DESC, p.id DESC`,
    newest: "p.id DESC",
    price_asc: "p.price ASC, p.id DESC",
    price_desc: "p.price DESC, p.id DESC",
    popular: "p.sold_count DESC, p.view_count DESC, p.id DESC",
    rating: "p.rating_avg IS NULL, p.rating_avg DESC, p.rating_count DESC",
  }[q.sort];
  const orderParams = rank ? [`%${q.q}%`] : [];
  const { limit, offset } = paging(q.page, q.pageSize);
  const pool = getPool();
  const clause = where.join(" AND ");
  const [[items], [count]] = await Promise.all([
    pool.query<RowDataPacket[]>(
      `SELECT ${CARD} FROM products p JOIN sellers s ON s.id = p.seller_id WHERE ${clause} ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...params, ...orderParams, limit, offset],
    ),
    pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS n FROM products p JOIN sellers s ON s.id = p.seller_id WHERE ${clause}`,
      params,
    ),
  ]);
  return { items, total: Number(count[0]?.n ?? 0) };
}

async function recalcProductRating(productId: number) {
  await getPool().execute(
    `UPDATE products p SET
       rating_avg = (SELECT ROUND(AVG(rating), 1) FROM product_reviews WHERE product_id = p.id AND is_hidden = 0),
       rating_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_hidden = 0)
     WHERE p.id = ?`,
    [productId],
  );
  await getPool().execute(
    `UPDATE sellers s SET
       rating_avg = (SELECT ROUND(AVG(r.rating), 1) FROM product_reviews r JOIN products p ON p.id = r.product_id WHERE p.seller_id = s.id AND r.is_hidden = 0),
       rating_count = (SELECT COUNT(*) FROM product_reviews r JOIN products p ON p.id = r.product_id WHERE p.seller_id = s.id AND r.is_hidden = 0)
     WHERE s.id = (SELECT seller_id FROM products WHERE id = ?)`,
    [productId],
  );
}

export const marketRoute = new Hono()
  .get("/home", async (c) => {
    const pool = getPool();
    const [[categories], [featured], [latest], [deals], [stores], [food]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT c.id, c.name, c.slug, c.icon, c.image_url, c.is_food,
           (SELECT COUNT(*) FROM products p JOIN sellers s ON s.id = p.seller_id
             WHERE ${LIVE} AND p.category_id IN (SELECT id FROM market_categories WHERE id = c.id OR parent_id = c.id)) AS product_count
         FROM market_categories c WHERE c.parent_id IS NULL AND c.is_active = 1 ORDER BY c.sort_order, c.name`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM products p JOIN sellers s ON s.id = p.seller_id WHERE ${LIVE} AND p.kind = 'product'
         ORDER BY p.is_featured DESC, p.sold_count DESC, p.id DESC LIMIT 10`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM products p JOIN sellers s ON s.id = p.seller_id WHERE ${LIVE} AND p.kind = 'product'
         ORDER BY p.id DESC LIMIT 12`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM products p JOIN sellers s ON s.id = p.seller_id WHERE ${LIVE} AND p.compare_at_price > p.price
         ORDER BY (p.compare_at_price - p.price) / p.compare_at_price DESC LIMIT 8`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT s.id, s.store_name, s.slug, s.tagline, s.logo_url, s.banner_url, s.location, s.is_verified, s.rating_avg, s.rating_count,
           (SELECT COUNT(*) FROM products p WHERE p.seller_id = s.id AND p.status = 'active') AS product_count
         FROM sellers s WHERE s.status = 'approved' AND FIND_IN_SET('products', s.kinds)
         ORDER BY s.is_featured DESC, s.rating_count DESC, s.id DESC LIMIT 8`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT s.id, s.store_name, s.slug, s.tagline, s.logo_url, s.banner_url, s.cuisine, s.location, s.opening_hours,
           s.delivers, s.delivery_fee, s.is_open, s.rating_avg, s.rating_count
         FROM sellers s WHERE s.status = 'approved' AND FIND_IN_SET('food', s.kinds)
         ORDER BY s.is_open DESC, s.is_featured DESC, s.rating_count DESC LIMIT 8`,
      ),
    ]);
    return c.json({ categories, featured, latest, deals, stores, food });
  })
  .get("/categories", async (c) => {
    const [rows] = await getPool().query<RowDataPacket[]>(
      "SELECT id, parent_id, name, slug, icon, image_url, description, is_food FROM market_categories WHERE is_active = 1 ORDER BY sort_order, name",
    );
    return c.json({ categories: rows });
  })
  .get("/products", async (c) => c.json(await listProducts(listSchema.parse(c.req.query()))))
  .post("/quote", validate("json", quoteSchema), async (c) => {
    const { ids } = c.req.valid("json");
    if (!ids.length) return c.json({ items: [] });
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT ${CARD}, p.seller_id, s.delivers, s.delivery_fee, (${LIVE}) AS available
       FROM products p JOIN sellers s ON s.id = p.seller_id WHERE p.id IN (?)`,
      [ids],
    );
    return c.json({ items: rows });
  })
  .get("/products/:slug", optionalMember, async (c) => {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
         s.id AS store_id, s.store_name, s.slug AS store_slug, s.logo_url AS store_logo, s.location AS store_location,
         s.phone AS store_phone, s.whatsapp AS store_whatsapp, s.is_verified AS store_verified, s.rating_avg AS store_rating,
         s.rating_count AS store_rating_count, s.delivers, s.delivery_fee, s.created_at AS store_since, s.user_id AS store_owner_id
       FROM products p JOIN sellers s ON s.id = p.seller_id LEFT JOIN market_categories c ON c.id = p.category_id
       WHERE p.slug = ? AND ${LIVE}`,
      [(c.req.param("slug") ?? "")],
    );
    const product = rows[0];
    if (!product) throw new AppError("Product not found.", 404);
    void pool.execute("UPDATE products SET view_count = view_count + 1 WHERE id = ?", [product.id]);
    // Per-day views for seller/admin analytics (all-time total stays in view_count).
    void pool
      .execute("INSERT INTO product_daily_views (product_id, day, views) VALUES (?, CURDATE(), 1) ON DUPLICATE KEY UPDATE views = views + 1", [product.id])
      .catch(() => undefined);
    const [[reviews], [related], [more]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT r.id, r.rating, r.body, r.created_at, u.full_name, u.avatar_url, u.username FROM product_reviews r
         JOIN users u ON u.id = r.user_id WHERE r.product_id = ? AND r.is_hidden = 0 ORDER BY r.id DESC LIMIT 30`,
        [product.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM products p JOIN sellers s ON s.id = p.seller_id
         WHERE ${LIVE} AND p.category_id <=> ? AND p.id <> ? ORDER BY p.sold_count DESC, p.id DESC LIMIT 8`,
        [product.category_id, product.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD} FROM products p JOIN sellers s ON s.id = p.seller_id
         WHERE ${LIVE} AND p.seller_id = ? AND p.id <> ? ORDER BY p.id DESC LIMIT 6`,
        [product.seller_id, product.id],
      ),
    ]);
    const member = memberOrNull(c);
    let canReview = false;
    if (member) {
      const [bought] = await pool.execute<RowDataPacket[]>(
        `SELECT 1 FROM order_items i JOIN orders o ON o.id = i.order_id
         WHERE o.user_id = ? AND i.product_id = ? AND o.status = 'delivered' LIMIT 1`,
        [member.id, product.id],
      );
      canReview = Boolean(bought[0]);
    }
    return c.json({ product, reviews, related, more, canReview });
  })
  .post("/products/:id/reviews", requireMember, validate("json", reviewSchema), async (c) => {
    const productId = Number(c.req.param("id"));
    const member = c.get("member");
    const [bought] = await getPool().execute<RowDataPacket[]>(
      `SELECT 1 FROM order_items i JOIN orders o ON o.id = i.order_id
       WHERE o.user_id = ? AND i.product_id = ? AND o.status = 'delivered' LIMIT 1`,
      [member.id, productId],
    );
    if (!bought[0]) throw new AppError("You can review items after they're delivered to you.", 403);
    const { rating, body } = c.req.valid("json");
    await getPool().execute(
      `INSERT INTO product_reviews (product_id, user_id, rating, body) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), body = VALUES(body)`,
      [productId, member.id, rating, body ?? null],
    );
    await recalcProductRating(productId);
    return c.json({ ok: true });
  })
  .get("/stores/:slug", async (c) => {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, store_name, slug, kinds, tagline, description, logo_url, banner_url, phone, whatsapp, email, location,
         cuisine, opening_hours, delivers, delivery_fee, is_open, is_verified, rating_avg, rating_count, created_at
       FROM sellers WHERE slug = ? AND status = 'approved'`,
      [(c.req.param("slug") ?? "")],
    );
    const store = rows[0];
    if (!store) throw new AppError("Store not found.", 404);
    const [[stats], [events]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS products, COALESCE(SUM(sold_count), 0) AS sold FROM products WHERE seller_id = ? AND status = 'active'",
        [store.id],
      ),
      pool.query<RowDataPacket[]>(
        "SELECT id, title, slug, cover_url, venue, starts_at FROM ticket_events WHERE seller_id = ? AND status = 'published' AND starts_at >= NOW() ORDER BY starts_at LIMIT 6",
        [store.id],
      ),
    ]);
    return c.json({ store, stats: stats[0], events });
  })
  .get("/food", async (c) => {
    const q = (c.req.query("q") ?? "").trim();
    const params: Array<string> = [];
    let extra = "";
    if (q) {
      extra = "AND (s.store_name LIKE ? OR s.cuisine LIKE ? OR EXISTS (SELECT 1 FROM products p WHERE p.seller_id = s.id AND p.kind = 'food' AND p.status = 'active' AND p.title LIKE ?))";
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    const [vendors] = await getPool().query<RowDataPacket[]>(
      `SELECT s.id, s.store_name, s.slug, s.tagline, s.logo_url, s.banner_url, s.cuisine, s.location, s.opening_hours,
         s.delivers, s.delivery_fee, s.is_open, s.is_verified, s.rating_avg, s.rating_count,
         (SELECT COUNT(*) FROM products p WHERE p.seller_id = s.id AND p.kind = 'food' AND p.status = 'active') AS item_count,
         (SELECT MIN(price) FROM products p WHERE p.seller_id = s.id AND p.kind = 'food' AND p.status = 'active') AS from_price
       FROM sellers s WHERE s.status = 'approved' AND FIND_IN_SET('food', s.kinds) ${extra}
       ORDER BY s.is_open DESC, s.is_featured DESC, s.rating_avg DESC, s.id DESC`,
      params,
    );
    const [popular] = await getPool().query<RowDataPacket[]>(
      `SELECT ${CARD} FROM products p JOIN sellers s ON s.id = p.seller_id WHERE ${LIVE} AND p.kind = 'food'
       ORDER BY p.sold_count DESC, p.rating_avg DESC LIMIT 12`,
    );
    return c.json({ vendors, popular });
  })
  .get("/food/:slug", async (c) => {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, store_name, slug, tagline, description, logo_url, banner_url, phone, whatsapp, location, cuisine,
         opening_hours, delivers, delivery_fee, is_open, is_verified, rating_avg, rating_count
       FROM sellers WHERE slug = ? AND status = 'approved' AND FIND_IN_SET('food', kinds)`,
      [(c.req.param("slug") ?? "")],
    );
    const vendor = rows[0];
    if (!vendor) throw new AppError("Vendor not found.", 404);
    const [menu] = await pool.query<RowDataPacket[]>(
      `SELECT id, slug, title, description, price, compare_at_price, JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) AS image,
         COALESCE(menu_section, 'Menu') AS menu_section, stock, sold_count, rating_avg
       FROM products WHERE seller_id = ? AND kind = 'food' AND status = 'active' ORDER BY menu_section, sort_order, title`,
      [vendor.id],
    );
    return c.json({ vendor, menu });
  })
  .post("/checkout", requireMember, validate("json", checkoutSchema), async (c) => {
    const member = c.get("member");
    const input = c.req.valid("json");
    if (input.fulfilment === "delivery" && !input.deliveryAddress) {
      throw new AppError("Enter a delivery address, or choose pickup.", 422);
    }
    const pool = getPool();
    const ids = input.items.map((i) => i.productId);
    const [products] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.title, p.price, p.stock, p.seller_id, JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS image,
         s.user_id AS owner_id, s.delivers, s.delivery_fee, s.store_name, s.is_open, s.kinds
       FROM products p JOIN sellers s ON s.id = p.seller_id WHERE p.id IN (?) AND ${LIVE}`,
      [ids],
    );
    const byId = new Map(products.map((p) => [p.id as number, p]));
    const bySeller = new Map<number, Array<{ product: RowDataPacket; quantity: number }>>();
    for (const item of input.items) {
      const product = byId.get(item.productId);
      if (!product) throw new AppError("Some items in your cart are no longer available. Please review your cart.", 409);
      if (product.owner_id === member.id) throw new AppError("You can't buy from your own store.", 409);
      if (product.stock !== null && product.stock < item.quantity) {
        throw new AppError(`Only ${product.stock} of "${product.title}" left in stock.`, 409);
      }
      bySeller.set(product.seller_id, [...(bySeller.get(product.seller_id) ?? []), { product, quantity: item.quantity }]);
    }

    const conn = await pool.getConnection();
    const orderIds: Array<number> = [];
    const created: Array<{ id: number; order_no: string; total: number; store: string; ownerId: number }> = [];
    let grandTotal = 0;
    try {
      await conn.beginTransaction();
      for (const [sellerId, lines] of bySeller) {
        const first = lines[0]!.product;
        if (input.fulfilment === "delivery" && !first.delivers) {
          throw new AppError(`${first.store_name} doesn't deliver. Choose pickup or remove its items.`, 409);
        }
        const subtotal = money(lines.reduce((sum, l) => sum + Number(l.product.price) * l.quantity, 0));
        const deliveryFee = input.fulfilment === "delivery" ? money(first.delivery_fee) : 0;
        const total = money(subtotal + deliveryFee);
        const orderNo = orderNumber();
        const [res] = await conn.execute<ResultSetHeader>(
          `INSERT INTO orders (order_no, user_id, seller_id, payment_method, fulfilment, subtotal, delivery_fee, total,
             contact_name, contact_phone, delivery_address, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderNo, member.id, sellerId, input.paymentMethod, input.fulfilment, subtotal, deliveryFee, total,
            input.contactName, input.contactPhone, input.deliveryAddress ?? null, input.notes ?? null,
          ],
        );
        for (const { product, quantity } of lines) {
          await conn.execute(
            "INSERT INTO order_items (order_id, product_id, title, image_url, unit_price, quantity) VALUES (?, ?, ?, ?, ?, ?)",
            [res.insertId, product.id, product.title, product.image, product.price, quantity],
          );
          const [stock] = await conn.execute<ResultSetHeader>(
            "UPDATE products SET sold_count = sold_count + ?, stock = IF(stock IS NULL, NULL, stock - ?) WHERE id = ? AND (stock IS NULL OR stock >= ?)",
            [quantity, quantity, product.id, quantity],
          );
          if (!stock.affectedRows) throw new AppError(`"${product.title}" just sold out.`, 409);
        }
        orderIds.push(res.insertId);
        created.push({ id: res.insertId, order_no: orderNo, total, store: first.store_name, ownerId: first.owner_id });
        grandTotal += total;
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    for (const o of created) {
      notify(o.ownerId, {
        kind: "order",
        title: `New order ${o.order_no}`,
        body: `${member.fullName} ordered GHS ${o.total.toFixed(2)}`,
        link: "/seller/orders",
        actorId: member.id,
      });
    }
    let authorizationUrl: string | null = null;
    if (input.paymentMethod === "online") {
      const payment = await createPayment({
        userId: member.id,
        email: member.email,
        purpose: "order",
        targetIds: orderIds,
        amount: money(grandTotal),
        returnPath: "/account/orders",
      });
      authorizationUrl = payment.authorizationUrl;
    }
    return c.json({ orders: created.map(({ ownerId: _o, ...o }) => o), total: money(grandTotal), authorizationUrl }, 201);
  })
  .get("/orders", requireMember, async (c) => {
    const pool = getPool();
    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT o.*, s.store_name, s.slug AS store_slug, s.phone AS store_phone, s.whatsapp AS store_whatsapp
       FROM orders o JOIN sellers s ON s.id = o.seller_id WHERE o.user_id = ? ORDER BY o.id DESC LIMIT 100`,
      [c.get("member").id],
    );
    const ids = orders.map((o) => o.id as number);
    const [items] = ids.length
      ? await pool.query<RowDataPacket[]>(
          `SELECT i.*, p.slug FROM order_items i LEFT JOIN products p ON p.id = i.product_id WHERE i.order_id IN (?)`,
          [ids],
        )
      : [[]];
    return c.json({ orders: orders.map((o) => ({ ...o, items: (items as Array<RowDataPacket>).filter((i) => i.order_id === o.id) })) });
  })
  .post("/orders/:id/cancel", requireMember, async (c) => {
    const id = Number(c.req.param("id"));
    const member = c.get("member");
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT o.*, s.user_id AS owner_id FROM orders o JOIN sellers s ON s.id = o.seller_id WHERE o.id = ? AND o.user_id = ?",
      [id, member.id],
    );
    const order = rows[0];
    if (!order) throw new AppError("Order not found.", 404);
    if (order.status !== "pending" || order.payment_status === "paid") {
      throw new AppError("This order can no longer be cancelled here. Contact the seller.", 409);
    }
    await pool.execute("UPDATE orders SET status = 'cancelled' WHERE id = ?", [id]);
    const [items] = await pool.execute<RowDataPacket[]>("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [id]);
    for (const i of items) {
      if (!i.product_id) continue;
      await pool.execute(
        "UPDATE products SET sold_count = GREATEST(sold_count - ?, 0), stock = IF(stock IS NULL, NULL, stock + ?) WHERE id = ?",
        [i.quantity, i.quantity, i.product_id],
      );
    }
    notify(order.owner_id, {
      kind: "order",
      title: `Order ${order.order_no} was cancelled`,
      body: "The buyer cancelled this order.",
      link: "/seller/orders",
      actorId: member.id,
    });
    return c.json({ ok: true });
  })
  .post("/orders/:id/pay", requireMember, async (c) => {
    const id = Number(c.req.param("id"));
    const member = c.get("member");
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT id, total, payment_status, status FROM orders WHERE id = ? AND user_id = ?",
      [id, member.id],
    );
    const order = rows[0];
    if (!order || order.payment_status === "paid" || order.status === "cancelled") throw new AppError("Nothing to pay.", 409);
    const payment = await createPayment({
      userId: member.id,
      email: member.email,
      purpose: "order",
      targetIds: [id],
      amount: money(order.total),
      returnPath: "/account/orders",
    });
    if (!payment.authorizationUrl) throw new AppError("Online payment isn't available. Pay the seller directly.", 400);
    await getPool().execute("UPDATE orders SET payment_method = 'online' WHERE id = ?", [id]);
    return c.json(payment);
  });
