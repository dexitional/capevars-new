import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { SystemNav } from "#/components/site/site-header";

export const Route = createFileRoute("/_site/finder")({ component: FinderLayout });

function FinderLayout() {
  return (
    <>
      <SystemNav
        systemKey="finder"
        extra={
          <Link to="/finder/add" className="inline-flex items-center gap-1.5 rounded-full bg-sys-finder px-3 py-1.5 text-xs font-bold text-white hover:opacity-90">
            <Plus className="size-3.5" /> Add a listing
          </Link>
        }
      />
      <Outlet />
    </>
  );
}
