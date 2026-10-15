// Sales and engagement analytics for Marketplace products and food, over a
// period: headline numbers (with the previous period for comparison), a
// daily trend, top products, the product/food split, catalogue health, and
// (platform-wide only) the top stores. Shared by the seller dashboard
// (one store) and the admin products page (every store).
//
// Revenue counts order lines on orders that weren't cancelled. Views come
// from product_daily_views, which records page views per day.
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";

export const analyticsQuerySchema = z.object({
  days: z.coerce.number().int().refine((d) => [7, 30, 90].includes(d)).catch(30),
  kind: z.enum(["all", "product", "food"]).catch("all"),
});
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema> & { sellerId?: number };

const num = (v: unknown) => Number(v ?? 0) || 0;
const ymd = (d: Date) => d.toISOString().slice(0, 10);

export async function productAnalytics({ sellerId, days, kind }: AnalyticsQuery) {
  const pool = getPool();
  // Day boundaries in UTC: [from, today] is this period, [prevFrom, from) the one before.
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const from = new Date(today.getTime() - (days - 1) * 86_400_000);
  const prevFrom = new Date(from.getTime() - days * 86_400_000);
  const until = new Date(today.getTime() + 86_400_000);

  // Filters shared by every query: one store (seller) and/or one kind. Both
  // lists take the same params, in the same order. Sales filter on the
  // order's store, so a product deleted since still counts towards revenue.
  const params: Array<string | number> = [];
  const productWhere: Array<string> = [];
  const salesWhere: Array<string> = [];
  if (sellerId) {
    productWhere.push("p.seller_id = ?");
    salesWhere.push("o.seller_id = ?");
    params.push(sellerId);
  }
  if (kind !== "all") {
    productWhere.push("p.kind = ?");
    salesWhere.push("p.kind = ?");
    params.push(kind);
  }
  const and = productWhere.length ? ` AND ${productWhere.join(" AND ")}` : "";
  const salesAnd = salesWhere.length ? ` AND ${salesWhere.join(" AND ")}` : "";

  const SALES = `FROM order_items oi JOIN orders o ON o.id = oi.order_id LEFT JOIN products p ON p.id = oi.product_id
    WHERE o.status <> 'cancelled'${salesAnd}`;

  const [[period], [views], [salesDaily], [viewsDaily], [top], [byKind], [catalog], [stores]] = await Promise.all([
    pool.query<RowDataPacket[]>(
      `SELECT
         COALESCE(SUM(CASE WHEN o.created_at >= ? THEN oi.unit_price * oi.quantity END), 0) AS revenue,
         COUNT(DISTINCT CASE WHEN o.created_at >= ? THEN o.id END) AS orders,
         COALESCE(SUM(CASE WHEN o.created_at >= ? THEN oi.quantity END), 0) AS units,
         COALESCE(SUM(CASE WHEN o.created_at < ? THEN oi.unit_price * oi.quantity END), 0) AS prev_revenue,
         COUNT(DISTINCT CASE WHEN o.created_at < ? THEN o.id END) AS prev_orders,
         COALESCE(SUM(CASE WHEN o.created_at < ? THEN oi.quantity END), 0) AS prev_units
       ${SALES} AND o.created_at >= ? AND o.created_at < ?`,
      [ymd(from), ymd(from), ymd(from), ymd(from), ymd(from), ymd(from), ...params, ymd(prevFrom), ymd(until)],
    ),
    pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(CASE WHEN v.day >= ? THEN v.views END), 0) AS views,
              COALESCE(SUM(CASE WHEN v.day < ? THEN v.views END), 0) AS prev_views
       FROM product_daily_views v JOIN products p ON p.id = v.product_id
       WHERE v.day >= ? AND v.day < ?${and}`,
      [ymd(from), ymd(from), ymd(prevFrom), ymd(until), ...params],
    ),
    pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') AS day, COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS revenue,
              COUNT(DISTINCT o.id) AS orders, COALESCE(SUM(oi.quantity), 0) AS units
       ${SALES} AND o.created_at >= ? AND o.created_at < ? GROUP BY day`,
      [...params, ymd(from), ymd(until)],
    ),
    pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(v.day, '%Y-%m-%d') AS day, SUM(v.views) AS views
       FROM product_daily_views v JOIN products p ON p.id = v.product_id
       WHERE v.day >= ? AND v.day < ?${and} GROUP BY v.day`,
      [ymd(from), ymd(until), ...params],
    ),
    pool.query<RowDataPacket[]>(
      `SELECT p.id, p.title, p.slug, p.kind, p.status, p.stock, p.price, JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS image,
              s.store_name, COALESCE(sa.revenue, 0) AS revenue, COALESCE(sa.units, 0) AS units, COALESCE(sa.orders, 0) AS orders,
              COALESCE(vw.views, 0) AS views
       FROM products p JOIN sellers s ON s.id = p.seller_id
       LEFT JOIN (SELECT oi.product_id, SUM(oi.unit_price * oi.quantity) AS revenue, SUM(oi.quantity) AS units, COUNT(DISTINCT o.id) AS orders
                  FROM order_items oi JOIN orders o ON o.id = oi.order_id
                  WHERE o.status <> 'cancelled' AND o.created_at >= ? AND o.created_at < ? GROUP BY oi.product_id) sa ON sa.product_id = p.id
       LEFT JOIN (SELECT product_id, SUM(views) AS views FROM product_daily_views WHERE day >= ? AND day < ? GROUP BY product_id) vw ON vw.product_id = p.id
       WHERE (sa.product_id IS NOT NULL OR vw.product_id IS NOT NULL)${and}
       ORDER BY revenue DESC, units DESC, views DESC LIMIT 10`,
      [ymd(from), ymd(until), ymd(from), ymd(until), ...params],
    ),
    pool.query<RowDataPacket[]>(
      `SELECT COALESCE(p.kind, 'removed') AS kind, COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS revenue,
              COALESCE(SUM(oi.quantity), 0) AS units
       ${SALES} AND o.created_at >= ? AND o.created_at < ? GROUP BY COALESCE(p.kind, 'removed')`,
      [...params, ymd(from), ymd(until)],
    ),
    pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total, SUM(p.status = 'active') AS live,
              SUM(p.status = 'active' AND p.stock IS NOT NULL AND p.stock BETWEEN 1 AND 3) AS low_stock,
              SUM(p.status = 'active' AND p.stock = 0) AS out_of_stock, COALESCE(SUM(p.view_count), 0) AS all_time_views
       FROM products p WHERE 1 = 1${and}`,
      params,
    ),
    sellerId
      ? Promise.resolve([[]] as unknown as [RowDataPacket[]])
      : pool.query<RowDataPacket[]>(
          `SELECT s.id, s.store_name, s.slug, s.logo_url, COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS revenue,
                  COUNT(DISTINCT o.id) AS orders, COALESCE(SUM(oi.quantity), 0) AS units
           ${SALES.replace("WHERE", "JOIN sellers s ON s.id = o.seller_id WHERE")} AND o.created_at >= ? AND o.created_at < ?
           GROUP BY s.id ORDER BY revenue DESC LIMIT 8`,
          [...params, ymd(from), ymd(until)],
        ),
  ]);

  // One point per day, zero-filled, so charts have no gaps.
  const salesBy = new Map(salesDaily.map((r) => [String(r.day), r]));
  const viewsBy = new Map(viewsDaily.map((r) => [String(r.day), num(r.views)]));
  const daily = Array.from({ length: days }, (_, i) => {
    const day = ymd(new Date(from.getTime() + i * 86_400_000));
    const s = salesBy.get(day);
    return { day, revenue: num(s?.revenue), orders: num(s?.orders), units: num(s?.units), views: viewsBy.get(day) ?? 0 };
  });

  const p: Record<string, unknown> = period[0] ?? {};
  const v: Record<string, unknown> = views[0] ?? {};
  const summary = {
    revenue: num(p.revenue),
    orders: num(p.orders),
    units: num(p.units),
    views: num(v.views),
    avgOrder: num(p.orders) ? num(p.revenue) / num(p.orders) : 0,
    // Share of product views that turned into an order.
    conversion: num(v.views) ? num(p.orders) / num(v.views) : null,
    previous: {
      revenue: num(p.prev_revenue),
      orders: num(p.prev_orders),
      units: num(p.prev_units),
      views: num(v.prev_views),
      avgOrder: num(p.prev_orders) ? num(p.prev_revenue) / num(p.prev_orders) : 0,
    },
  };

  return {
    range: { from: ymd(from), to: ymd(today), days, kind },
    summary,
    daily,
    topProducts: top.map((r) => ({
      ...r,
      revenue: num(r.revenue),
      units: num(r.units),
      orders: num(r.orders),
      views: num(r.views),
      conversion: num(r.views) ? num(r.orders) / num(r.views) : null,
    })),
    byKind: Object.fromEntries(byKind.map((r) => [r.kind, { revenue: num(r.revenue), units: num(r.units) }])),
    catalog: Object.fromEntries(Object.entries(catalog[0] ?? {}).map(([k, val]) => [k, num(val)])),
    topStores: stores.map((r) => ({ ...r, revenue: num(r.revenue), orders: num(r.orders), units: num(r.units) })),
  };
}

export type ProductAnalytics = Awaited<ReturnType<typeof productAnalytics>>;
