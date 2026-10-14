import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { SystemNav } from "#/components/site/site-header";
import { useMember } from "#/hooks/useMember";

export const Route = createFileRoute("/_site/market")({ component: MarketLayout });

function MarketLayout() {
  const member = useMember();
  return (
    <>
      <SystemNav
        systemKey="market"
        extra={
          <Link to={member?.seller ? "/seller" : "/seller/apply"} className="inline-flex items-center gap-1.5 rounded-full bg-brand-cream px-3 py-1.5 text-xs font-bold text-primary hover:bg-brand-butter">
            <Store className="size-3.5" /> {member?.seller ? "Seller Center" : "Sell"}
          </Link>
        }
      />
      <Outlet />
    </>
  );
}
