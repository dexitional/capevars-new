import { Link, Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bus, CalendarDays, ClipboardCheck, LayoutDashboard, LayoutGrid, Package, Settings, ShoppingBag, Store, Truck, Utensils } from "lucide-react";
import { sellerStoreQuery } from "#/components/seller/queries";
import { Container, Img, StatusBadge } from "#/components/site/kit";

export const Route = createFileRoute("/_site/seller")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
    const seller = context.member.seller;
    const path = location.pathname.replace(/\/$/, "");
    if (!seller && path !== "/seller/apply") throw redirect({ to: "/seller/apply" });
    if (seller && seller.status !== "approved" && !["/seller/apply", "/seller/settings"].includes(path)) throw redirect({ to: "/seller/apply" });
  },
  head: () => ({ meta: [{ title: "Seller Center | Capevars" }, { name: "robots", content: "noindex" }] }),
  component: SellerLayout,
});

const NAV: Array<{ to: string; label: string; icon: typeof Store; kind?: string; exact?: boolean }> = [
  { to: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/seller/orders", label: "Orders", icon: ShoppingBag },
  { to: "/seller/products", label: "Products", icon: Package, kind: "products" },
  { to: "/seller/menu", label: "Food menu", icon: Utensils, kind: "food" },
  { to: "/seller/events", label: "Events & tickets", icon: CalendarDays, kind: "events" },
  { to: "/seller/trips", label: "Bus trips", icon: Bus, kind: "transport" },
  { to: "/seller/rentals", label: "Bus rentals", icon: Truck, kind: "transport" },
  { to: "/seller/exhibitions", label: "Exhibitions", icon: LayoutGrid, kind: "exhibitions" },
  { to: "/seller/checkin", label: "Check-in", icon: ClipboardCheck },
  { to: "/seller/settings", label: "Store settings", icon: Settings },
];

function SellerLayout() {
  const { data } = useQuery(sellerStoreQuery);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const store = data?.store;
  const approved = store?.status === "approved";
  const kinds = String(store?.kinds ?? "").split(",");
  if (!store || !approved || pathname.startsWith("/seller/apply")) {
    return (
      <Container className="max-w-4xl py-8">
        <Outlet />
      </Container>
    );
  }
  return (
    <Container className="py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="min-w-0 h-fit space-y-3 lg:sticky lg:top-24">
          <Link to="/market/store/$slug" params={{ slug: store.slug }} className="flex items-center gap-3 rounded-2xl border bg-white p-3">
            <Img src={store.logo_url} className="size-11 shrink-0 rounded-xl" fallback={<Store className="size-5" />} />
            <span className="min-w-0">
              <span className="block truncate font-bold text-primary">{store.store_name}</span>
              <StatusBadge status={store.is_open ? "active" : "closed"} label={store.is_open ? "Open" : "Closed"} />
            </span>
          </Link>
          <nav aria-label="Seller Center" className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl border bg-white p-2 lg:flex-col">
            {NAV.filter((n) => !n.kind || kinds.includes(n.kind)).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact ?? false }}
                className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground hover:bg-muted hover:text-primary [&.active]:bg-primary [&.active]:text-white"
              >
                <n.icon className="size-4 shrink-0" /> {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
