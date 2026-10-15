import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bookmark, Plus } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatCompact } from "#/lib/money";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Avatar, Chip, Container, EmptyState, Img, Loading, Verified } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/social/pages/")({
  head: () => ({ meta: [{ title: "Pages | SocialNet" }] }),
  component: Pages,
});

function Pages() {
  const member = useMember();
  const requireMember = useRequireMember();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const { data, refetch } = useQuery({ queryKey: ["pages", q, category], queryFn: () => api.get<{ items: Array<Row>; categories: Array<string> }>("/social/pages", { q, category }) });
  const { data: mine } = useQuery({ queryKey: ["my-pages"], queryFn: () => api.get<{ owned: Array<Row>; following: Array<Row> }>("/social/pages/mine"), enabled: Boolean(member) });
  const follow = useMutation({
    mutationFn: (id: number) => api.post<{ following: boolean }>(`/social/pages/${id}/follow`),
    onSuccess: (r) => {
      toast.success(r.following ? "Following" : "Unfollowed");
      void refetch();
    },
  });
  return (
    <Container className="py-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-primary">Discover pages</h1>
          <Link to="/social/pages/new" className="btn-shine text-[13px]">
            <Plus className="btn-shine-icon" strokeWidth={2.5} /> Create a page
          </Link>
        </div>
        {/* Your pages: the ones you manage, then the ones you follow. */}
        {mine && mine.owned.length + mine.following.length > 0 && (
          <div className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">Your pages</span>
            {[...mine.owned.map((p): Row => ({ ...p, manage: true })), ...mine.following.filter((f) => !mine.owned.some((o) => o.id === f.id))].map((p) => (
              <Link
                key={p.id}
                to="/social/pages/$slug"
                params={{ slug: p.slug }}
                className="flex shrink-0 items-center gap-2 rounded-full border bg-white py-1 pr-3 pl-1 text-sm font-medium transition hover:border-primary/30 hover:text-primary"
              >
                <Avatar src={p.avatar_url} name={p.name} size="xs" /> {p.name}
                {p.manage ? <span className="rounded-full bg-brand-cream px-1.5 py-0.5 text-[10px] font-bold text-primary">Manage</span> : null}
              </Link>
            ))}
          </div>
        )}
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages" className="mt-4 bg-white" />
        <div className="no-scrollbar my-4 flex gap-2 overflow-x-auto">
          <Chip active={!category} onClick={() => setCategory("")}>
            All
          </Chip>
          {data?.categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
        {!data ? (
          <Loading />
        ) : data.items.length === 0 ? (
          <EmptyState icon={Bookmark} title="No pages found" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.items.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border bg-white">
                <Img src={p.cover_url} className="h-24 w-full" fallback={<span />} />
                <div className="p-4">
                  <Link to="/social/pages/$slug" params={{ slug: p.slug }} className="-mt-12 flex items-end gap-3">
                    <Avatar src={p.avatar_url} name={p.name} size="lg" ring />
                  </Link>
                  <Link to="/social/pages/$slug" params={{ slug: p.slug }} className="mt-2 flex items-center gap-1 font-bold text-primary hover:underline">
                    {p.name} {p.is_verified ? <Verified /> : null}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {formatCompact(p.follower_count)} followers
                  </p>
                  {p.about && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.about}</p>}
                  <Button size="sm" variant={Number(p.following) ? "outline" : "default"} className="mt-3 w-full" onClick={() => requireMember(() => follow.mutate(p.id))}>
                    {Number(p.following) ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
