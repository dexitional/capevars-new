import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { SystemNav } from "#/components/site/site-header";

export const Route = createFileRoute("/_site/leadgen")({ component: LeadGenLayout });

function LeadGenLayout() {
  return (
    <>
      <SystemNav
        systemKey="leadgen"
        extra={
          <Link to="/leadgen/portal/broadcast" className="inline-flex items-center gap-1.5 rounded-full bg-sys-leadgen px-3 py-1.5 text-xs font-bold text-white hover:opacity-90">
            <Send className="size-3.5" /> New broadcast
          </Link>
        }
      />
      <Outlet />
    </>
  );
}
