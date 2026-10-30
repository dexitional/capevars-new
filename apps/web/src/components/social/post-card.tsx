import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Flag, Globe, Lock, MessageCircle, MoreHorizontal, Repeat2, Send, ThumbsUp, Trash2, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime, timeAgo } from "#/lib/format";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Avatar, Verified } from "#/components/site/kit";
import { PostText } from "#/components/social/link-embed";
import { ReportButton } from "#/components/site/report-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const REACTIONS = [
  { key: "like", emoji: "👍", label: "Like" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "celebrate", emoji: "👏", label: "Celebrate" },
  { key: "insightful", emoji: "💡", label: "Insightful" },
  { key: "funny", emoji: "😂", label: "Funny" },
] as const;

function ImageGrid({ images }: { images: Array<string> }) {
  if (!images.length) return null;
  const shown = images.slice(0, 4);
  return (
    <div className={cn("mt-3 grid gap-1 overflow-hidden rounded-xl", shown.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
      {shown.map((src, i) => (
        <a key={src} href={src} target="_blank" rel="noopener noreferrer" className={cn("relative block bg-muted", shown.length === 3 && i === 0 && "row-span-2")}>
          <img src={src} alt="" className={cn("w-full object-cover", shown.length === 1 ? "max-h-[520px]" : "h-full max-h-72 min-h-40")} loading="lazy" />
          {i === 3 && images.length > 4 && <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-bold text-white">+{images.length - 4}</span>}
        </a>
      ))}
    </div>
  );
}

function Comments({ postId, onCount }: { postId: number; onCount: (n: number) => void }) {
  const me = useMember();
  const requireMember = useRequireMember();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<Row | null>(null);
  const { data, refetch } = useQuery({ queryKey: ["comments", postId], queryFn: () => api.get<{ items: Array<Row> }>(`/social/posts/${postId}/comments`) });
  const add = useMutation({
    mutationFn: () => api.post(`/social/posts/${postId}/comments`, { body: text, parentId: replyTo?.id }),
    onSuccess: async () => {
      setText("");
      setReplyTo(null);
      const r = await refetch();
      onCount(r.data?.items.length ?? 0);
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/social/comments/${id}`),
    onSuccess: async () => {
      const r = await refetch();
      onCount(r.data?.items.length ?? 0);
    },
  });
  const items = data?.items ?? [];
  const top = items.filter((c) => !c.parent_id);
  const replies = (id: number) => items.filter((c) => c.parent_id === id);
  const CommentRow = ({ c, nested }: { c: Row; nested?: boolean }) => (
    <li className={cn("flex gap-2", nested && "ml-10")}>
      <Link to="/u/$username" params={{ username: c.author_username }}>
        <Avatar src={c.author_avatar} name={c.author_name} size="sm" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="inline-block rounded-2xl bg-muted px-3 py-2">
          <Link to="/u/$username" params={{ username: c.author_username }} className="text-sm font-semibold hover:underline">
            {c.author_name}
          </Link>
          <p className="text-sm break-words whitespace-pre-line">{c.body}</p>
        </div>
        <div className="mt-0.5 flex gap-3 px-2 text-xs text-muted-foreground">
          <span title={formatDateTime(c.created_at)}>{timeAgo(c.created_at)}</span>
          {!nested && (
            <button type="button" onClick={() => setReplyTo(c)} className="font-semibold hover:underline">
              Reply
            </button>
          )}
          {c.author_id === me?.id && (
            <button type="button" onClick={() => remove.mutate(c.id)} className="font-semibold hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
    </li>
  );
  return (
    <div className="mt-3 border-t pt-3">
      <ul className="space-y-3">
        {top.map((c) => (
          <div key={c.id} className="space-y-2">
            <CommentRow c={c} />
            {replies(c.id).map((r) => (
              <CommentRow key={r.id} c={r} nested />
            ))}
          </div>
        ))}
      </ul>
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) requireMember(() => add.mutate());
        }}
      >
        <Avatar src={me?.avatarUrl} name={me?.fullName ?? "?"} size="sm" />
        <div className="flex flex-1 items-center rounded-full bg-muted pr-1 pl-4">
          {replyTo && (
            <button type="button" onClick={() => setReplyTo(null)} className="mr-2 shrink-0 rounded-full bg-white px-2 py-0.5 text-xs">
              @{replyTo.author_name.split(" ")[0]} ×
            </button>
          )}
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment…" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
          <button type="submit" disabled={!text.trim()} className="rounded-full p-1.5 text-sys-social disabled:opacity-30" aria-label="Send comment">
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export function PostCard({ post, onChanged }: { post: Row; onChanged?: () => void }) {
  const me = useMember();
  const requireMember = useRequireMember();
  const [mine, setMine] = useState<string | null>(post.my_reaction);
  const [count, setCount] = useState<number>(post.reaction_count);
  const [comments, setComments] = useState<number>(post.comment_count);
  const [showComments, setShowComments] = useState(false);
  const [picker, setPicker] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareText, setShareText] = useState("");
  const react = useMutation({
    mutationFn: (reaction: string | null) => api.post(`/social/posts/${post.id}/react`, { reaction }),
    onError: (e) => toast.error(e.message),
  });
  const share = useMutation({
    mutationFn: () => api.post("/social/posts", { body: shareText, sharedPostId: post.shared_post_id ?? post.id, visibility: "public" }),
    onSuccess: () => {
      toast.success("Shared to your wall");
      setSharing(false);
      setShareText("");
      onChanged?.();
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: () => api.delete(`/social/posts/${post.id}`),
    onSuccess: () => {
      toast.success("Post deleted");
      onChanged?.();
    },
  });
  const choose = (key: string | null) =>
    requireMember(() => {
      const next = key === mine ? null : key;
      setCount((c) => c + (next && !mine ? 1 : !next && mine ? -1 : 0));
      setMine(next);
      setPicker(false);
      react.mutate(next);
    });
  const current = REACTIONS.find((r) => r.key === mine);
  const summary = Object.entries((post.reaction_summary ?? {}) as Record<string, number>).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const asPage = Boolean(post.page_id);
  const VisIcon = post.visibility === "public" ? Globe : post.visibility === "friends" ? Users : Lock;
  const canDelete = me && (post.author_id === me.id || post.wall_user_id === me.id);
  return (
    <article className="rounded-2xl border bg-white p-4 sm:p-5">
      <header className="flex items-start gap-3">
        {asPage ? (
          <Link to="/social/pages/$slug" params={{ slug: post.page_slug }}>
            <Avatar src={post.page_avatar} name={post.page_name} />
          </Link>
        ) : (
          <Link to="/u/$username" params={{ username: post.author_username }}>
            <Avatar src={post.author_avatar} name={post.author_name} />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            {asPage ? (
              <Link to="/social/pages/$slug" params={{ slug: post.page_slug }} className="font-semibold hover:underline">
                {post.page_name} {post.page_verified ? <Verified className="size-3.5" /> : null}
              </Link>
            ) : (
              <Link to="/u/$username" params={{ username: post.author_username }} className="font-semibold hover:underline">
                {post.author_name} {post.author_verified ? <Verified className="size-3.5" /> : null}
              </Link>
            )}
            {post.wall_user_id && (
              <>
                {" ▸ "}
                <Link to="/u/$username" params={{ username: post.wall_username }} className="font-semibold hover:underline">
                  {post.wall_name}
                </Link>
              </>
            )}
            {post.shared_post_id && <span className="text-muted-foreground"> shared a post</span>}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link to="/social/post/$id" params={{ id: String(post.id) }} className="hover:underline" title={formatDateTime(post.created_at)}>
              {timeAgo(post.created_at)}
            </Link>
            · <VisIcon className="size-3" />
          </p>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setMenu(!menu)} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted" aria-label="Post options">
            <MoreHorizontal className="size-5" />
          </button>
          {menu && (
            <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border bg-white p-1 shadow-lg" onMouseLeave={() => setMenu(false)}>
              {canDelete && (
                <button type="button" onClick={() => confirm("Delete this post?") && remove.mutate()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  <Trash2 className="size-4" /> Delete
                </button>
              )}
              <ReportButton entityType="post" entityId={post.id} className="w-full rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                <Flag className="size-4" /> Report post
              </ReportButton>
            </div>
          )}
        </div>
      </header>
      <PostText text={post.body} className="mt-3 text-[15px] leading-relaxed" />
      <ImageGrid images={post.images ?? []} />
      {post.shared_post_id && (
        <div className="mt-3 rounded-xl border p-3">
          {post.shared_author_name ? (
            <>
              <p className="flex items-center gap-2 text-sm">
                <Avatar src={post.shared_author_avatar} name={post.shared_author_name} size="xs" />
                <Link to="/u/$username" params={{ username: post.shared_author_username }} className="font-semibold hover:underline">
                  {post.shared_author_name}
                </Link>
                <span className="text-xs text-muted-foreground">{timeAgo(post.shared_created_at)}</span>
              </p>
              <PostText text={post.shared_body} className="mt-2 text-sm" />
              <ImageGrid images={post.shared_images ?? []} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">This post is no longer available.</p>
          )}
        </div>
      )}
      {(count > 0 || comments > 0 || post.share_count > 0) && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {summary.length > 0 && <span>{summary.map(([k]) => REACTIONS.find((r) => r.key === k)?.emoji).join("")}</span>}
            {count > 0 && count}
          </span>
          <span className="flex gap-3">
            {comments > 0 && (
              <button type="button" onClick={() => setShowComments(true)} className="hover:underline">
                {comments} comments
              </button>
            )}
            {post.share_count > 0 && <span>{post.share_count} shares</span>}
          </span>
        </div>
      )}
      <div className="mt-2 grid grid-cols-3 border-t pt-1">
        <div className="relative" onMouseLeave={() => setPicker(false)}>
          {picker && (
            <div className="absolute bottom-full left-0 z-10 mb-1 flex gap-1 rounded-full border bg-white p-1.5 shadow-lg">
              {REACTIONS.map((r) => (
                <button key={r.key} type="button" onClick={() => choose(r.key)} className="rounded-full p-1 text-2xl transition hover:scale-125" title={r.label}>
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onMouseEnter={() => setPicker(true)}
            onClick={() => choose(mine ? null : "like")}
            className={cn("flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold hover:bg-muted", mine ? "text-sys-social" : "text-muted-foreground")}
          >
            {current ? <span className="text-base">{current.emoji}</span> : <ThumbsUp className="size-4" />} {current?.label ?? "Like"}
          </button>
        </div>
        <button type="button" onClick={() => setShowComments(!showComments)} className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">
          <MessageCircle className="size-4" /> Comment
        </button>
        <button type="button" onClick={() => requireMember(() => setSharing(true))} className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">
          <Repeat2 className="size-4" /> Share
        </button>
      </div>
      {showComments && <Comments postId={post.id} onCount={setComments} />}
      <Dialog open={sharing} onOpenChange={setSharing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share to your wall</DialogTitle>
          </DialogHeader>
          <textarea value={shareText} onChange={(e) => setShareText(e.target.value)} rows={3} placeholder="Say something about this…" className="w-full rounded-xl border p-3 text-sm outline-none" />
          <Button onClick={() => share.mutate()} disabled={share.isPending}>
            Share now
          </Button>
        </DialogContent>
      </Dialog>
    </article>
  );
}
