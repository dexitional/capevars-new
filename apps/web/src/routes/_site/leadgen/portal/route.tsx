import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { BarChart3, Coins, Database, History, IdCard, LayoutDashboard, Send, Wallet } from "lucide-react";
import { useWallet } from "#/components/leadgen/hooks";
import { Container } from "#/components/site/kit";

export const Route = createFileRoute("/_site/leadgen/portal")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Broadcast portal | LeadGen" }, { name: "robots", content: "noindex" }] }),
  component: PortalLayout,
});

const NAV = [
  { to: "/leadgen/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/leadgen/portal/broadcast", label: "New broadcast", icon: Send },
  { to: "/leadgen/portal/broadcasts", label: "History", icon: History },
  { to: "/leadgen/portal/leads", label: "My leads", icon: Database },
  { to: "/leadgen/portal/senders", label: "Sender IDs", icon: IdCard },
  { to: "/leadgen/portal/wallet", label: "Credits & billing", icon: Wallet },
  { to: "/leadgen/portal/earnings", label: "Earnings", icon: BarChart3 },
];

function PortalLayout() {
  const { data } = useWallet();
  return (
    <Container className="py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="h-fit min-w-0 space-y-3 lg:sticky lg:top-24">
          <Link to="/leadgen/portal/wallet" className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-white">
            <Coins className="size-8 shrink-0 text-brand-cream" />
            <span className="min-w-0 [overflow-wrap:anywhere]">
              <span className="block text-xs text-white/60">Broadcast credits</span>
              <span className="block text-2xl font-black">{data ? Number(data.balance).toLocaleString() : "—"}</span>
            </span>
          </Link>
          <nav aria-label="Broadcast portal" className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl border bg-white p-2 lg:flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact ?? false }}
                className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground hover:bg-muted hover:text-primary [&.active]:bg-sys-leadgen [&.active]:text-white"
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
