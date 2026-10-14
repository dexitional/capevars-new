import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { SystemNav } from "#/components/site/site-header";

export const Route = createFileRoute("/_site/groups")({ component: GroupsLayout });

function GroupsLayout() {
  return (
    <>
      <SystemNav
        systemKey="groups"
        extra={
          <Link to="/groups/new" className="inline-flex items-center gap-1.5 rounded-full bg-sys-groups px-3 py-1.5 text-xs font-bold text-white hover:opacity-90">
            <Plus className="size-3.5" /> Create group
          </Link>
        }
      />
      <Outlet />
    </>
  );
}
