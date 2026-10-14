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
    <Container className="grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4">
        <Button asChild className="w-full bg-sys-social">
          <Link to="/social/pages/new">
            <Plus /> Create a page
          </Link>
        </Button>
        {mine && mine.owned.length > 0 && (
          <section className="rounded-2xl border bg-white p-4">
            <h3 className="mb-2 text-sm font-bold">Pages you manage</h3>
            {mine.owned.map((p) => (
              <Link key={p.id} to="/social/pages/$slug" params={{ slug: p.slug }} className="flex items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-muted">
                <Avatar src={p.avatar_url} name={p.name} size="sm" /> {p.name}
              </Link>
            ))}
          </section>
        )}
        {mine && mine.following.length > 0 && (
          <section className="rounded-2xl border bg-white p-4">
            <h3 className="mb-2 text-sm font-bold">Following</h3>
            {mine.following.map((p) => (
              <Link key={p.id} to="/social/pages/$slug" params={{ slug: p.slug }} className="flex items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-muted">
                <Avatar src={p.avatar_url} name={p.name} size="sm" /> {p.name}
              </Link>
            ))}
          </section>
        )}
      </aside>
      <div>
        <h1 className="text-2xl font-black text-primary">Discover pages</h1>
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
