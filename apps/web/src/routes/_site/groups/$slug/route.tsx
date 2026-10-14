import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock, Globe, Lock, Settings, Users } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { GROUP_CATEGORIES } from "#/lib/labels";
import { useRequireMember } from "#/hooks/useMember";
import { Container, Img, StatusBadge, TabLinks } from "#/components/site/kit";
import { groupQuery, useGroup } from "#/components/groups/use-group";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/groups/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(groupQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.group.name} | Campus Groups` }, { name: "description", content: loaderData.group.tagline ?? "" }] : [] }),
  component: GroupLayout,
});

function GroupLayout() {
  const { slug } = Route.useParams();
  const { data } = useGroup(slug);
  const queryClient = useQueryClient();
  const requireMember = useRequireMember();
  const join = useMutation({
    mutationFn: () => api.post<{ status: string }>(`/groups/${data!.group.id}/join`),
    onSuccess: (r) => {
      toast.success(r.status === "active" ? "Welcome to the group!" : "Request sent — an admin will approve it.");
      void queryClient.invalidateQueries({ queryKey: ["group", slug] });
    },
    onError: (e) => toast.error(e.message),
  });
  const leave = useMutation({
    mutationFn: () => api.post(`/groups/${data!.group.id}/leave`),
    onSuccess: () => {
      toast.success("You left the group");
      void queryClient.invalidateQueries({ queryKey: ["group", slug] });
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return null;
  const g = data.group;
  const m = data.membership;
  const p = { slug };
  const tabs = [
    { to: "/groups/$slug", label: "Wall", exact: true, params: p },
    { to: "/groups/$slug/forum", label: "Forum", params: p },
    { to: "/groups/$slug/meetings", label: "Meetings", params: p, count: data.stats.upcoming_meetings },
    { to: "/groups/$slug/members", label: "Members", params: p },
    { to: "/groups/$slug/donate", label: "Donate", params: p },
    ...(m?.status === "active" ? [{ to: "/groups/$slug/chat", label: "Chat", params: p }] : []),
    { to: "/groups/$slug/about", label: "About", params: p },
    ...data.pages.map((pg) => ({ to: "/groups/$slug/p/$page", label: pg.title, params: { slug, page: pg.slug } })),
    ...(data.canManage ? [{ to: "/groups/$slug/manage", label: "Manage", params: p, count: data.stats.pending_members }] : []),
  ];
  return (
    <div className="pb-16">
      <div className="relative h-44 bg-gradient-to-br from-sys-groups to-primary sm:h-64">
        <Img src={g.cover_url} className="size-full" fallback={<span />} sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <Container>
        <div className="relative -mt-14 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Img src={g.logo_url} className="size-24 shrink-0 rounded-2xl border-4 border-white shadow sm:-mt-14" fallback={<Users className="size-8" />} />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black text-primary sm:text-3xl">{g.name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="font-semibold text-sys-groups">{GROUP_CATEGORIES[g.category]}</span>
                <span className="flex items-center gap-1">
                  {g.visibility === "private" ? <Lock className="size-3.5" /> : <Globe className="size-3.5" />} {g.visibility === "private" ? "Private" : "Public"} group
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" /> {g.member_count} members
                </span>
              </p>
              {g.tagline && <p className="mt-1 text-sm">{g.tagline}</p>}
            </div>
            <div className="flex gap-2">
              {g.status !== "approved" ? (
                <StatusBadge status={g.status} label={g.status === "pending" ? "Awaiting approval" : g.status} />
              ) : m?.status === "active" ? (
                <>
                  <StatusBadge status="active" label={m.role === "member" ? "Member" : m.role} />
                  {m.role !== "owner" && (
                    <Button size="sm" variant="ghost" onClick={() => confirm("Leave this group?") && leave.mutate()}>
                      Leave
                    </Button>
                  )}
                </>
              ) : m?.status === "pending" ? (
                <Button variant="outline" disabled>
                  <Clock /> Request pending
                </Button>
              ) : m?.status === "banned" ? null : (
                <Button className="bg-sys-groups hover:bg-sys-groups/90" disabled={join.isPending} onClick={() => requireMember(() => join.mutate())}>
                  <Users /> {g.join_policy === "approval" ? "Request to join" : "Join group"}
                </Button>
              )}
              {data.canManage && (
                <Button asChild size="icon" variant="outline">
                  <a href={`/groups/${slug}/manage`} aria-label="Manage group">
                    <Settings />
                  </a>
                </Button>
              )}
            </div>
          </div>
          {g.status === "rejected" && g.status_reason && <p className="mt-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Moderator: {g.status_reason}. Update the group in Manage to resubmit.</p>}
        </div>
        <TabLinks className="mt-4 mb-6" items={tabs} />
        <Outlet />
      </Container>
    </div>
  );
}
