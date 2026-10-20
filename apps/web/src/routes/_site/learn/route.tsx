import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import type { KidiSession } from "#/lib/kidilearn/family";
import { SystemNav } from "#/components/site/site-header";

export const Route = createFileRoute("/_site/learn")({ component: LearnLayout });

function LearnLayout() {
  // The lesson player is a focused, full-width view.
  const inPlayer = useRouterState({ select: (s) => /^\/learn\/c\/[^/]+\/learn/.test(s.location.pathname) });
  const inKidi = useRouterState({ select: s => s.location.pathname.startsWith('/learn/kidilearn') });
  const session = useQuery({ queryKey: ['kidilearn', 'session'], queryFn: () => api.get<KidiSession>('/learn/kidilearn/session'), enabled: inKidi, staleTime: 30_000 });
  return (
    <>
      {!inPlayer && !(inKidi && session.data?.mode === 'child') && <SystemNav systemKey="learn" />}
      <Outlet />
    </>
  );
}
