import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Globe, Mail, Pencil, Phone, Users } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { formatCompact } from "#/lib/money";
import { useRequireMember } from "#/hooks/useMember";
import { Avatar, Container, Img, StatusBadge, TextBlock, Verified } from "#/components/site/kit";
import { PersonRow } from "#/components/site/cards";
import { Composer } from "#/components/social/composer";
import { PostFeed } from "#/components/social/feed";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { PageForm } from "#/components/social/page-form";

type Row = Record<string, any>;
const pageQuery = (slug: string) => ({ queryKey: ["page", slug], queryFn: () => api.get<{ page: Row; posts: Array<Row>; isOwner: boolean }>(`/social/pages/p/${slug}`) });

export const Route = createFileRoute("/_site/social/pages/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(pageQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.page.name} | SocialNet` }] : [] }),
  component: PageView,
});

function PageView() {
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(pageQuery(slug));
  const requireMember = useRequireMember();
  const [editing, setEditing] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const follow = useMutation({ mutationFn: () => api.post(`/social/pages/${data!.page.id}/follow`), onSuccess: () => void refetch() });
  const save = useMutation({
    mutationFn: (v: Record<string, unknown>) => api.patch(`/social/pages/${data!.page.id}`, v),
    onSuccess: () => {
      toast.success("Page saved");
      setEditing(false);
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const followers = useQuery({ queryKey: ["page-followers", data?.page.id], queryFn: () => api.get<{ items: Array<Row> }>(`/social/pages/${data!.page.id}/followers`), enabled: followersOpen && Boolean(data?.isOwner) });
  if (!data) return null;
  const p = data.page;
  return (
    <div className="pb-16">
      <div className="h-48 bg-gradient-to-br from-sys-social to-primary sm:h-64">
        <Img src={p.cover_url} className="size-full" fallback={<span />} sizes="100vw" />
      </div>
      <Container>
        <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
          <Avatar src={p.avatar_url} name={p.name} size="2xl" ring />
          <div className="min-w-0 flex-1 pb-2">
            <h1 className="flex items-center gap-2 text-3xl font-black text-primary">
              {p.name} {p.is_verified ? <Verified className="size-6" /> : null}
            </h1>
            <p className="text-sm text-muted-foreground">
              {p.category} · {formatCompact(p.follower_count)} followers
            </p>
          </div>
          <div className="flex gap-2 pb-2">
            {p.status !== "active" && <StatusBadge status={p.status} />}
            {data.isOwner ? (
              <>
                <Button variant="outline" onClick={() => setFollowersOpen(true)}>
                  <Users /> Followers
                </Button>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <Pencil /> Edit page
                </Button>
              </>
            ) : (
              <Button className={Number(p.following) ? "" : "bg-sys-social"} variant={Number(p.following) ? "outline" : "default"} onClick={() => requireMember(() => follow.mutate())}>
                {Number(p.following) ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit space-y-3 rounded-2xl border bg-white p-5 text-sm">
            <h2 className="font-bold text-primary">About</h2>
            <TextBlock text={p.about || "No description yet."} className="text-muted-foreground" />
            {p.website && (
              <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <Globe className="size-4" /> {p.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {p.phone && (
              <a href={`tel:${p.phone}`} className="flex items-center gap-2">
                <Phone className="size-4" /> {p.phone}
              </a>
            )}
            {p.email && (
              <a href={`mailto:${p.email}`} className="flex items-center gap-2">
                <Mail className="size-4" /> {p.email}
              </a>
            )}
          </aside>
          <div className="space-y-4">
            {data.isOwner && <Composer pageId={p.id} placeholder={`Post as ${p.name}…`} onPosted={() => void queryClient.invalidateQueries({ queryKey: ["page-posts", p.id] })} />}
            <PostFeed queryKey={["page-posts", p.id]} path={`/social/pages/p/${slug}`} />
          </div>
        </div>
      </Container>
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit page</DialogTitle>
          </DialogHeader>
          <PageForm initial={p} onSubmit={(v) => save.mutate(v)} pending={save.isPending} submitLabel="Save page" />
        </DialogContent>
      </Dialog>
      <Dialog open={followersOpen} onOpenChange={setFollowersOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <ul className="space-y-3">
            {followers.data?.items.map((u) => (
              <li key={u.id}>
                <PersonRow u={u} />
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
