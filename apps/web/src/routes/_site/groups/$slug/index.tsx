import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Megaphone, MessageSquare, Pin, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime, timeAgo } from "#/lib/format";
import { useMember } from "#/hooks/useMember";
import { Avatar, EmptyState, ImageUpload, TextBlock } from "#/components/site/kit";
import { useGroup } from "#/components/groups/use-group";
import { PrivateNotice } from "#/components/groups/locked";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/groups/$slug/")({ component: GroupWall });

function GroupWall() {
  const { slug } = Route.useParams();
  const { data } = useGroup(slug);
  const me = useMember();
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [announce, setAnnounce] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const id = data?.group.id;
  const posts = useInfiniteQuery({
    queryKey: ["group-posts", id],
    queryFn: ({ pageParam }) => api.get<{ items: Array<Row> }>(`/groups/${id}/posts`, { before: pageParam || undefined }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.items.length === 20 ? last.items[last.items.length - 1]?.id : undefined),
    enabled: Boolean(id && data?.canSee),
  });
  const post = useMutation({
    mutationFn: () => api.post(`/groups/${id}/posts`, { body, imageUrl, isAnnouncement: announce }),
    onSuccess: () => {
      setBody("");
      setImageUrl(null);
      setShowImage(false);
      setAnnounce(false);
      void posts.refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const pin = useMutation({ mutationFn: (p: Row) => api.patch(`/groups/posts/${p.id}`, { isPinned: !p.is_pinned }), onSuccess: () => void posts.refetch() });
  const remove = useMutation({ mutationFn: (pid: number) => api.delete(`/groups/posts/${pid}`), onSuccess: () => void posts.refetch() });
  if (!data) return null;
  if (!data.canSee) return <PrivateNotice />;
  const items = posts.data?.pages.flatMap((p) => p.items) ?? [];
  const isMember = data.membership?.status === "active";
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        {isMember && data.group.status === "approved" && (
          <form
            className="rounded-2xl border bg-white p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (body.trim()) post.mutate();
            }}
          >
            <div className="flex gap-3">
              <Avatar src={me?.avatarUrl} name={me?.fullName ?? ""} />
              <Textarea rows={2} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share something with the group…" className="flex-1" />
            </div>
            {showImage && (
              <div className="mt-3 ml-13 max-w-sm">
                <ImageUpload value={imageUrl} onChange={setImageUrl} folder="groups" />
              </div>
            )}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setShowImage(!showImage)}>
                  Photo
                </Button>
                {data.canModerate && (
                  <label className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" checked={announce} onChange={(e) => setAnnounce(e.target.checked)} className="accent-violet-600" />
                    <Megaphone className="size-4" /> Announcement (notifies everyone)
                  </label>
                )}
              </div>
              <Button type="submit" size="sm" className="bg-sys-groups" disabled={!body.trim() || post.isPending}>
                Post
              </Button>
            </div>
          </form>
        )}
        {posts.isSuccess && items.length === 0 && <EmptyState icon={MessageSquare} title="No posts yet" text={isMember ? "Start the conversation." : "Join the group to post."} />}
        {items.map((p) => (
          <article key={p.id} className={cn("rounded-2xl border bg-white p-5", p.is_announcement && "border-sys-groups/40 bg-violet-50/40")}>
            <header className="flex items-center gap-3">
              <Link to="/u/$username" params={{ username: p.author_username }}>
                <Avatar src={p.author_avatar} name={p.author_name} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to="/u/$username" params={{ username: p.author_username }} className="font-semibold hover:underline">
                  {p.author_name}
                </Link>
                <p className="text-xs text-muted-foreground" title={formatDateTime(p.created_at)}>
                  {timeAgo(p.created_at)}
                  {p.is_announcement ? " · Announcement" : ""}
                </p>
              </div>
              {p.is_pinned ? <Pin className="size-4 text-sys-groups" aria-label="Pinned" /> : null}
              {data.canModerate && (
                <button type="button" onClick={() => pin.mutate(p)} className="rounded p-1 text-muted-foreground hover:bg-muted" aria-label={p.is_pinned ? "Unpin" : "Pin"}>
                  <Pin className="size-4" />
                </button>
              )}
              {(data.canModerate || p.author_id === me?.id) && (
                <button type="button" onClick={() => confirm("Delete this post?") && remove.mutate(p.id)} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive" aria-label="Delete">
                  <Trash2 className="size-4" />
                </button>
              )}
            </header>
            <TextBlock text={p.body} className="mt-3 text-sm" />
            {p.image_url && <img src={p.image_url} alt="" className="mt-3 max-h-[480px] w-full rounded-xl object-cover" />}
          </article>
        ))}
        {posts.hasNextPage && (
          <Button variant="outline" className="w-full" onClick={() => void posts.fetchNextPage()}>
            Load more
          </Button>
        )}
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="font-bold text-primary">Leaders</h3>
          <ul className="mt-3 space-y-3">
            {data.admins.map((a) => (
              <li key={a.user_id}>
                <Link to="/u/$username" params={{ username: a.user_username }} className="flex items-center gap-2 text-sm hover:underline">
                  <Avatar src={a.user_avatar} name={a.user_name} size="sm" />
                  <span>
                    <span className="block font-semibold">{a.user_name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{a.title ?? a.role}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-5 text-sm">
          <p>
            <strong>{data.stats.posts}</strong> posts · <strong>{data.stats.topics}</strong> forum topics
          </p>
          {(data.stats.active_campaigns ?? 0) > 0 && (
            <Link to="/groups/$slug/donate" params={{ slug }} className="mt-3 block rounded-xl bg-violet-50 p-3 font-semibold text-violet-800">
              {data.stats.active_campaigns} active fundraising campaign(s) →
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
