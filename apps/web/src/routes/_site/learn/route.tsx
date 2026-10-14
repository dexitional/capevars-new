import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { SystemNav } from "#/components/site/site-header";

export const Route = createFileRoute("/_site/learn")({ component: LearnLayout });

function LearnLayout() {
  // The lesson player is a focused, full-width view.
  const inPlayer = useRouterState({ select: (s) => /^\/learn\/c\/[^/]+\/learn/.test(s.location.pathname) });
  return (
    <>
      {!inPlayer && <SystemNav systemKey="learn" />}
      <Outlet />
    </>
  );
}
