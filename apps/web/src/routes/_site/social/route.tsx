import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SystemNav } from "#/components/site/site-header";

export const Route = createFileRoute("/_site/social")({ component: () => (
  <>
    <SystemNav systemKey="social" />
    <Outlet />
  </>
) });
