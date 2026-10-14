import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock, Pin, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { useMember } from "#/hooks/useMember";
import { Avatar, Loading, TextBlock } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/groups/$slug/forum/$topicId")({ component: Topic });

function Topic() {
  const { slug, topicId } = Route.useParams();
  const me = useMember();
  const navigate = useNavigate();
  const [reply, setReply] = useState("");
  const { data, refetch } = useQuery({ queryKey: ["topic", topicId], queryFn: () => api.get<{ topic: Row; replies: Array<Row>; canModerate: boolean; isMember: boolean }>(`/groups/topics/${topicId}`) });
  const send = useMutation({
    mutationFn: () => api.post(`/groups/topics/${topicId}/replies`, { body: reply }),
    onSuccess: () => {
      setReply("");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const mod = useMutation({ mutationFn: (body: Record<string, boolean>) => api.patch(`/groups/topics/${topicId}`, body), onSuccess: () => void refetch() });
  const remove = useMutation({ mutationFn: () => api.delete(`/groups/topics/${topicId}`), onSuccess: () => void navigate({ to: "/groups/$slug/forum", params: { slug } }) });
  if (!data) return <Loading />;
  const t = data.topic;
  return (
    <div className="max-w-3xl">
      <Link to="/groups/$slug/forum" params={{ slug }} className="text-sm text-muted-foreground hover:underline">
        ← Forum
      </Link>
      <article className="mt-3 rounded-2xl border bg-white p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-black text-primary">{t.title}</h1>
          <div className="flex gap-1">
            {data.canModerate && (
              <>
                <Button size="icon-sm" variant={t.is_pinned ? "default" : "ghost"} onClick={() => mod.mutate({ isPinned: !t.is_pinned })} aria-label="Pin">
                  <Pin />
                </Button>
                <Button size="icon-sm" variant={t.is_locked ? "default" : "ghost"} onClick={() => mod.mutate({ isLocked: !t.is_locked })} aria-label="Lock">
                  <Lock />
                </Button>
              </>
            )}
            {(data.canModerate || t.author_id === me?.id) && (
              <Button size="icon-sm" variant="ghost" onClick={() => confirm("Delete this topic?") && remove.mutate()} aria-label="Delete">
                <Trash2 />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar src={t.author_avatar} name={t.author_name} size="xs" /> {t.author_name} · {formatDateTime(t.created_at)}
        </div>
        <TextBlock text={t.body} className="mt-4 text-sm leading-relaxed" />
      </article>
      <h2 className="mt-6 mb-3 font-bold text-primary">{data.replies.length} replies</h2>
      <ul className="space-y-3">
        {data.replies.map((r) => (
          <li key={r.id} className="flex gap-3 rounded-2xl border bg-white p-4">
            <Avatar src={r.author_avatar} name={r.author_name} size="sm" />
            <div>
              <p className="text-sm font-semibold">
                {r.author_name} <span className="font-normal text-muted-foreground">· {formatDateTime(r.created_at)}</span>
              </p>
              <TextBlock text={r.body} className="mt-1 text-sm" />
            </div>
          </li>
        ))}
      </ul>
      {data.isMember && (!t.is_locked || data.canModerate) ? (
        <form
          className="mt-4 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (reply.trim()) send.mutate();
          }}
        >
          <Textarea rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" className="bg-white" />
          <Button type="submit" disabled={send.isPending || !reply.trim()}>
            Reply
          </Button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{t.is_locked ? "This topic is locked." : "Join the group to reply."}</p>
      )}
    </div>
  );
}
