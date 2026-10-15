import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Plus, ShoppingBag, Ticket, TrendingUp } from "lucide-react";
import { api } from "#/lib/api-client";
import { timeAgo } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { ORDER_STATUSES } from "#/lib/labels";
import { Loading, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { ProductAnalyticsPanel } from "#/components/analytics/product-analytics";
import { sellerStoreQuery } from "#/components/seller/queries";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/seller/")({ component: SellerDashboard });

function SellerDashboard() {
  const { data } = useQuery({ queryKey: ["seller", "dashboard"], queryFn: () => api.get<Record<string, any>>("/seller/dashboard") });
  const { data: storeData } = useQuery(sellerStoreQuery);
  // Analytics cover what the store sells: products, food, or both.
  const storeKinds = String(storeData?.store?.kinds ?? "").split(",");
  const analyticsKinds = [...(storeKinds.includes("products") ? ["product" as const] : []), ...(storeKinds.includes("food") ? ["food" as const] : [])];
  const sellsGoods = analyticsKinds.length > 0;
  if (!data) return <Loading />;
  const pending = (data.ordersByStatus.pending ?? 0) + (data.ordersByStatus.confirmed ?? 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-primary">Dashboard</h1>
        <Button asChild size="sm">
          <Link to="/seller/products">
            <Plus /> Add product
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: TrendingUp, label: "Sales (30 days)", value: formatMoney(data.revenue.last30), sub: `${formatMoney(data.revenue.total)} all time` },
          { icon: ShoppingBag, label: "Orders to handle", value: pending, sub: `${data.ordersByStatus.delivered ?? 0} delivered` },
          { icon: Package, label: "Live products", value: data.products.active ?? 0, sub: `${data.products.low_stock ?? 0} low on stock` },
          { icon: Ticket, label: "Tickets sold", value: data.tickets.n, sub: formatMoney(data.tickets.revenue) },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border bg-white p-5">
            <k.icon className="size-5 text-primary" />
            <p className="mt-3 text-2xl font-black text-primary">{k.value}</p>
            <p className="text-sm font-medium">{k.label}</p>
            <p className="text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>
      {sellsGoods && (
        <ProductAnalyticsPanel endpoint="/seller/analytics" kinds={analyticsKinds} title="Sales & product analytics" />
      )}
      <div>
        <section className="rounded-2xl border bg-white">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="font-bold text-primary">Recent orders</h2>
            <Link to="/seller/orders" className="text-sm font-semibold text-primary hover:underline">
              All →
            </Link>
          </div>
          <ul className="divide-y">
            {data.recent.length === 0 && <li className="p-5 text-sm text-muted-foreground">No orders yet.</li>}
            {data.recent.map((o: Row) => (
              <li key={o.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{o.order_no}</span>
                  <span className="text-xs text-muted-foreground">
                    {o.contact_name} · {timeAgo(o.created_at)}
                  </span>
                </span>
                <span className="font-bold">{formatMoney(o.total)}</span>
                <StatusBadge status={o.status} label={ORDER_STATUSES[o.status]} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
