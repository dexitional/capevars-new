// Product & food analytics: period and kind filters, headline numbers with
// change vs the previous period, a daily trend, top products, the
// product/food split, catalogue health and (platform-wide) top stores.
// One component for the seller dashboard (/seller/analytics) and the admin
// products page (/admin/products/analytics). Charts are plain SVG.
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Eye, Loader2, MousePointerClick, Package, ShoppingBag, Store, TrendingUp, Utensils } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatCompact, formatMoney } from "#/lib/money";
import { Img } from "#/components/site/kit";
import { Segmented } from "#/components/admin/ui";

type Kind = "all" | "product" | "food";
type Metric = "revenue" | "orders" | "units" | "views";
interface Day {
  day: string;
  revenue: number;
  orders: number;
  units: number;
  views: number;
}
interface Analytics {
  range: { from: string; to: string; days: number; kind: Kind };
  summary: { revenue: number; orders: number; units: number; views: number; avgOrder: number; conversion: number | null; previous: Record<string, number> };
  daily: Array<Day>;
  topProducts: Array<Record<string, any>>;
  byKind: Partial<Record<"product" | "food" | "removed", { revenue: number; units: number }>>;
  catalog: Record<string, number>;
  topStores: Array<Record<string, any>>;
}

const METRICS: Record<Metric, { label: string; format: (n: number) => string }> = {
  revenue: { label: "Revenue", format: (n) => formatMoney(n) },
  orders: { label: "Orders", format: (n) => n.toLocaleString() },
  units: { label: "Units sold", format: (n) => n.toLocaleString() },
  views: { label: "Views", format: (n) => n.toLocaleString() },
};

const pct = (n: number | null) => (n === null ? "—" : `${(n * 100).toFixed(n < 0.1 ? 1 : 0)}%`);
const shortDate = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

// Change vs the previous period. No baseline (0 before) shows as "new".
function Delta({ now, before }: { now: number; before: number }) {
  if (!before && !now) return <span className="text-xs text-muted-foreground">No activity</span>;
  if (!before) return <span className="text-xs font-semibold text-emerald-600">New this period</span>;
  const change = (now - before) / before;
  const up = change >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", up ? "text-emerald-600" : "text-rose-600")}>
      <Icon className="size-3.5" />
      {Math.abs(change * 100).toFixed(0)}% <span className="font-normal text-muted-foreground">vs previous</span>
    </span>
  );
}

function Kpi({ icon: Icon, label, value, children }: { icon: typeof Eye; label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-cream text-primary">
          <Icon className="size-4" />
        </span>
        {label}
      </div>
      <p className="mt-3 text-2xl font-black text-primary tabular-nums">{value}</p>
      <div className="mt-1 min-h-4">{children}</div>
    </div>
  );
}

// Area chart with a hover readout per day.
function TrendChart({ data, metric }: { data: Array<Day>; metric: Metric }) {
  const values = data.map((d) => d[metric]);
  const max = Math.max(1, ...values);
  const W = 100;
  const H = 40;
  const step = data.length > 1 ? W / (data.length - 1) : W;
  const points = values.map((v, i) => [i * step, H - (v / max) * (H - 2) - 1] as const);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  const fmt = METRICS[metric].format;
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {METRICS[metric].label} over the period: <span className="font-bold text-primary">{fmt(total)}</span>
      </p>
      <div className="relative mt-4 h-52">
        {/* Gridlines with the scale. */}
        {[1, 0.5, 0].map((f) => (
          <div key={f} className="absolute inset-x-0 flex items-center gap-2" style={{ top: `${(1 - f) * 100}%` }}>
            <span className="w-14 -translate-y-1/2 text-right text-[10px] text-muted-foreground tabular-nums">
              {metric === "revenue" ? formatCompact(max * f) : Math.round(max * f)}
            </span>
            <span className="h-px flex-1 -translate-y-1/2 bg-border" />
          </div>
        ))}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-y-0 right-0 left-16 h-full w-[calc(100%-4rem)]" aria-hidden="true">
          <defs>
            <linearGradient id={`fill-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-gold)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--brand-gold)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#fill-${metric})`} />
          <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        {/* Hover columns: one per day, each with its own readout. */}
        <div className="absolute inset-y-0 right-0 left-16 flex">
          {data.map((d, i) => (
            <div key={d.day} className="group flex-1 sm:relative">
              <div className="relative h-full">
                <span className="absolute inset-y-0 left-1/2 w-px bg-primary/30 opacity-0 group-hover:opacity-100" />
                <span
                  className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary opacity-0 shadow group-hover:opacity-100"
                  style={{ top: `${(points[i]![1] / H) * 100}%` }}
                />
              </div>
              {/* On phones, keep readouts within the plot instead of extending from a narrow day column. */}
              <span
                className={cn(
                  "pointer-events-none absolute inset-x-0 -top-2 z-10 hidden -translate-y-full rounded-lg bg-primary px-2.5 py-1.5 text-[11px] text-white shadow-lg group-hover:block sm:inset-x-auto sm:whitespace-nowrap",
                  i > data.length / 2 ? "sm:right-1/2" : "sm:left-1/2",
                )}
              >
                <span className="block font-semibold">{shortDate(d.day)}</span>
                {formatMoney(d.revenue)} · {d.orders} orders · {d.units} units · {d.views} views
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 ml-16 flex justify-between text-[10px] text-muted-foreground">
        <span>{shortDate(data[0]?.day ?? "")}</span>
        <span>{shortDate(data[Math.floor(data.length / 2)]?.day ?? "")}</span>
        <span>{shortDate(data[data.length - 1]?.day ?? "")}</span>
      </div>
    </div>
  );
}

function SplitBar({ label, icon: Icon, value, total, units }: { label: string; icon: typeof Eye; value: number; total: number; units: number }) {
  const share = total ? value / total : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          <Icon className="size-4 text-primary" /> {label}
        </span>
        <span className="font-bold text-primary tabular-nums">{formatMoney(value)}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-brand-gold" style={{ width: `${share * 100}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {units} units · {pct(share)} of revenue
      </p>
    </div>
  );
}

export function ProductAnalyticsPanel({
  endpoint,
  kinds = ["product", "food"],
  title = "Product analytics",
}: {
  /** "/seller/analytics" or "/admin/products/analytics". */
  endpoint: string;
  /** Which kinds this view covers; the kind filter only shows when there are both. */
  kinds?: Array<"product" | "food">;
  title?: string;
}) {
  const [days, setDays] = useState<"7" | "30" | "90">("30");
  const [kind, setKind] = useState<Kind>(kinds.length === 1 ? kinds[0]! : "all");
  const [metric, setMetric] = useState<Metric>("revenue");
  const { data, isFetching } = useQuery({
    queryKey: ["analytics", endpoint, days, kind],
    queryFn: () => api.get<Analytics>(endpoint, { days, kind }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
  const platform = endpoint.startsWith("/admin");

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-primary">{title}</h2>
          {isFetching && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="flex flex-wrap gap-2">
          {kinds.length > 1 && (
            <Segmented
              value={kind}
              onChange={setKind}
              options={[
                { value: "all", label: "All" },
                { value: "product", label: "Products" },
                { value: "food", label: "Food" },
              ]}
            />
          )}
          <Segmented
            value={days}
            onChange={setDays}
            options={[
              { value: "7", label: "7 days" },
              { value: "30", label: "30 days" },
              { value: "90", label: "90 days" },
            ]}
          />
        </div>
      </div>

      {!data ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border bg-white text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" /> Loading analytics…
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Kpi icon={TrendingUp} label="Revenue" value={formatMoney(data.summary.revenue)}>
              <Delta now={data.summary.revenue} before={data.summary.previous.revenue ?? 0} />
            </Kpi>
            <Kpi icon={ShoppingBag} label="Orders" value={data.summary.orders.toLocaleString()}>
              <Delta now={data.summary.orders} before={data.summary.previous.orders ?? 0} />
            </Kpi>
            <Kpi icon={Package} label="Units sold" value={data.summary.units.toLocaleString()}>
              <Delta now={data.summary.units} before={data.summary.previous.units ?? 0} />
            </Kpi>
            <Kpi icon={Eye} label="Product views" value={data.summary.views.toLocaleString()}>
              <Delta now={data.summary.views} before={data.summary.previous.views ?? 0} />
            </Kpi>
            <Kpi icon={MousePointerClick} label="Conversion" value={pct(data.summary.conversion)}>
              <span className="text-xs text-muted-foreground">Avg. order {formatMoney(Math.round(data.summary.avgOrder))}</span>
            </Kpi>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-primary">Trend</h3>
              <Segmented
                value={metric}
                onChange={setMetric}
                options={(Object.keys(METRICS) as Array<Metric>).map((m) => ({ value: m, label: METRICS[m].label }))}
              />
            </div>
            <div className="mt-4">
              <TrendChart data={data.daily} metric={metric} />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <div className="overflow-hidden rounded-2xl border bg-white">
              <h3 className="border-b px-5 py-3 font-bold text-primary">Top products</h3>
              {data.topProducts.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No sales or views in this period yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 text-left text-xs text-muted-foreground">
                      <tr>
                        <th className="px-5 py-2 font-medium">Product</th>
                        <th className="px-3 py-2 text-right font-medium">Units</th>
                        <th className="px-3 py-2 text-right font-medium">Revenue</th>
                        <th className="px-3 py-2 text-right font-medium">Views</th>
                        <th className="px-5 py-2 text-right font-medium">Conversion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.topProducts.map((p) => (
                        <tr key={p.id}>
                          <td className="px-5 py-2.5">
                            <div className="flex items-center gap-3">
                              <Img src={p.image} className="size-9 shrink-0 rounded-lg" fallback={p.kind === "food" ? <Utensils className="size-4" /> : <Package className="size-4" />} />
                              <span className="min-w-0">
                                <span className="block truncate font-semibold">{p.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {p.kind === "food" ? "Food" : "Product"}
                                  {platform ? ` · ${p.store_name}` : ""}
                                  {p.stock !== null && Number(p.stock) <= 3 ? ` · ${Number(p.stock) === 0 ? "Out of stock" : `${p.stock} left`}` : ""}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{p.units}</td>
                          <td className="px-3 py-2.5 text-right font-semibold whitespace-nowrap tabular-nums">{formatMoney(p.revenue)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{p.views}</td>
                          <td className="px-5 py-2.5 text-right tabular-nums">{pct(p.conversion)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {kind === "all" && kinds.length > 1 && (
                <div className="space-y-4 rounded-2xl border bg-white p-5">
                  <h3 className="font-bold text-primary">Products vs food</h3>
                  {(["product", "food"] as const).map((k) => (
                    <SplitBar
                      key={k}
                      label={k === "food" ? "Food" : "Products"}
                      icon={k === "food" ? Utensils : Package}
                      value={data.byKind[k]?.revenue ?? 0}
                      units={data.byKind[k]?.units ?? 0}
                      total={data.summary.revenue}
                    />
                  ))}
                </div>
              )}
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-primary">Catalogue</h3>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Live", data.catalog.live, "text-primary"],
                    ["Total listed", data.catalog.total, "text-primary"],
                    ["Low stock", data.catalog.low_stock, data.catalog.low_stock ? "text-amber-600" : "text-primary"],
                    ["Out of stock", data.catalog.out_of_stock, data.catalog.out_of_stock ? "text-rose-600" : "text-primary"],
                  ].map(([label, value, tone]) => (
                    <div key={label as string} className="rounded-xl bg-secondary/50 p-3">
                      <dd className={cn("text-xl font-black tabular-nums", tone as string)}>{Number(value ?? 0).toLocaleString()}</dd>
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="size-3.5" /> {Number(data.catalog.all_time_views ?? 0).toLocaleString()} views all time
                </p>
              </div>
              {platform && (
                <div className="overflow-hidden rounded-2xl border bg-white">
                  <h3 className="border-b px-5 py-3 font-bold text-primary">Top stores</h3>
                  {data.topStores.length === 0 ? (
                    <p className="p-5 text-sm text-muted-foreground">No sales in this period yet.</p>
                  ) : (
                    <ul className="divide-y">
                      {data.topStores.map((s) => (
                        <li key={s.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                          <Img src={s.logo_url} className="size-8 shrink-0 rounded-lg" fallback={<Store className="size-4" />} />
                          <span className="min-w-0 flex-1 truncate font-medium">{s.store_name}</span>
                          <span className="text-xs text-muted-foreground">{s.orders} orders</span>
                          <span className="font-semibold whitespace-nowrap tabular-nums">{formatMoney(s.revenue)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
