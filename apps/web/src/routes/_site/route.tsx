import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { SiteHeader, TopBar } from "#/components/site/site-header";
import { SiteFooter, settingsQuery } from "#/components/site/site-footer";
import { memberQuery } from "#/hooks/useMember";
import { api } from "#/lib/api-client";
import type { KidiSession } from "#/lib/kidilearn/family";

export const Route = createFileRoute("/_site")({
  // Resolve the session during SSR so the header renders signed-in state
  // without a flash; the query stays the client's source of truth.
  beforeLoad: async ({ context }) => {
    const member = await context.queryClient.ensureQueryData(memberQuery);
    return { member };
  },
  component: SiteLayout,
});

function NoticeBar() {
  const { data } = useQuery(settingsQuery);
  const notice = data?.notice;
  if (!notice?.enabled || !notice.text) return null;
  return (
    <div className="bg-primary text-brand-cream [view-transition-name:site-notice]">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium">
        <Megaphone className="size-4 shrink-0" aria-hidden="true" />
        <span>{notice.text}</span>
        {notice.linkUrl && (
          <Link to={notice.linkUrl} className="font-bold underline">
            {notice.linkLabel || "Learn more"}
          </Link>
        )}
      </div>
    </div>
  );
}

function SiteLayout() {
  const inKidi = useRouterState({ select: s => s.location.pathname.startsWith('/learn/kidilearn') });
  const session = useQuery({ queryKey: ['kidilearn', 'session'], queryFn: () => api.get<KidiSession>('/learn/kidilearn/session'), enabled: inKidi, staleTime: 30_000 });
  if (inKidi && session.data?.mode === 'child') return <div className="min-h-screen bg-[#f5f9f6]">
    <main><Outlet /></main>
  </div>;
  return (
    <div className="flex min-h-screen flex-col bg-muted/50">
      <NoticeBar />
      <TopBar />
      <SiteHeader />
      {/* site-main: page transitions and scroll reveals apply inside (styles.css). */}
      <main className="site-main flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
