import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Hash, LogOut } from "lucide-react";
import { api } from "#/lib/api-client";
import { timeAgo } from "#/lib/format";
import { Avatar, EmptyState, Loading } from "#/components/site/kit";
import { ChatRoom } from "#/components/social/chat-room";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/social/chats/$id")({ component: Thread });

function Thread() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data, error } = useQuery({ queryKey: ["chat-thread", id], queryFn: () => api.get<{ thread: Row; other: Row | null; participants: number }>(`/chat/threads/${id}`), retry: false });
  const leave = useMutation({
    mutationFn: () => api.post(`/chat/threads/${id}/leave`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["chat-threads"] }),
  });
  if (error) return <EmptyState title="Chat not available" className="m-6" />;
  if (!data) return <Loading />;
  const t = data.thread;
  const o = data.other;
  const active = o?.last_seen_at && Date.now() - new Date(`${String(o.last_seen_at).replace(" ", "T")}Z`).getTime() < 5 * 60_000;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Link to="/social/chats" className="rounded-full p-1.5 hover:bg-muted md:hidden" aria-label="Back">
          <ArrowLeft className="size-5" />
        </Link>
        {o ? (
          <Link to="/u/$username" params={{ username: o.username }} className="flex items-center gap-3">
            <Avatar src={o.avatar_url} name={o.full_name} />
            <span>
              <span className="block font-bold">{o.full_name}</span>
              <span className="text-xs text-muted-foreground">{active ? <span className="text-success">Active now</span> : o.last_seen_at ? `Active ${timeAgo(o.last_seen_at)}` : o.headline}</span>
            </span>
          </Link>
        ) : (
          <div className="flex flex-1 items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-sys-social/10 text-sys-social">
              <Hash className="size-5" />
            </span>
            <span>
              <span className="block font-bold">{t.title}</span>
              <span className="text-xs text-muted-foreground">
                {data.participants} members {t.description ? `· ${t.description}` : ""}
              </span>
            </span>
          </div>
        )}
        {t.type === "forum" && (
          <button type="button" onClick={() => leave.mutate()} className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-muted" title="Leave room">
            <LogOut className="size-4" />
          </button>
        )}
      </header>
      <ChatRoom key={id} threadId={Number(id)} className="min-h-0 flex-1" showNames={t.type !== "direct"} />
    </div>
  );
}
