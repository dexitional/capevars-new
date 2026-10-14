// A live chat thread (direct, forum, group or course). New messages are
// polled every few seconds using the last message id as a cursor.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, Loader2, Paperclip, Send, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatTime, timeAgo } from "#/lib/format";
import { uploadAsMember } from "#/lib/upload";
import { useMember } from "#/hooks/useMember";
import { Avatar } from "#/components/site/kit";

type Msg = Record<string, any>;

export function ChatRoom({ threadId, className, showNames = true }: { threadId: number; className?: string; showNames?: boolean }) {
  const me = useMember();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Array<Msg>>([]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lastId = messages[messages.length - 1]?.id ?? 0;

  // History (newest page first), then poll for anything newer.
  const history = useInfiniteQuery({
    queryKey: ["chat-history", threadId],
    queryFn: ({ pageParam }) => api.get<{ items: Array<Msg> }>(`/chat/threads/${threadId}/messages`, { before: pageParam || undefined }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.items.length === 50 ? last.items[0]?.id : undefined),
  });
  useEffect(() => {
    if (!history.data) return;
    const all = [...history.data.pages].reverse().flatMap((p) => p.items);
    setMessages((cur) => {
      const ids = new Set(all.map((m) => m.id));
      return [...all, ...cur.filter((m) => !ids.has(m.id) && m.id > (all[all.length - 1]?.id ?? 0))];
    });
  }, [history.data]);
  useEffect(() => {
    if (!history.isSuccess) return;
    const t = setInterval(async () => {
      const r = await api.get<{ items: Array<Msg> }>(`/chat/threads/${threadId}/messages`, { after: lastId }).catch(() => null);
      if (r?.items.length) {
        setMessages((cur) => [...cur, ...r.items.filter((m) => !cur.some((c) => c.id === m.id))]);
        void queryClient.invalidateQueries({ queryKey: ["counts"] });
      }
    }, 4000);
    return () => clearInterval(t);
  }, [threadId, lastId, history.isSuccess, queryClient]);
  useLayoutEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = useMutation({
    mutationFn: (body: { body?: string; attachmentUrl?: string }) => api.post<{ id: number }>(`/chat/threads/${threadId}/messages`, body),
    onSuccess: async () => {
      setText("");
      const r = await api.get<{ items: Array<Msg> }>(`/chat/threads/${threadId}/messages`, { after: lastId });
      setMessages((cur) => [...cur, ...r.items.filter((m) => !cur.some((c) => c.id === m.id))]);
      void queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/chat/messages/${id}`),
    onSuccess: (_, id) => setMessages((cur) => cur.map((m) => (m.id === id ? { ...m, is_deleted: 1, body: null, attachment_url: null } : m))),
  });
  const attach = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const asset = await uploadAsMember(file, "chats");
      send.mutate({ attachmentUrl: asset.url, body: text || undefined });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-4">
        {history.hasNextPage && (
          <button type="button" onClick={() => void history.fetchNextPage()} className="mx-auto block rounded-full bg-muted px-3 py-1 text-xs font-semibold">
            {history.isFetchingNextPage ? "Loading…" : "Load earlier messages"}
          </button>
        )}
        {history.isLoading && <p className="py-10 text-center text-sm text-muted-foreground">Loading messages…</p>}
        {history.isSuccess && messages.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No messages yet. Say hello 👋</p>}
        {messages.map((m, i) => {
          const mine = m.sender_id === me?.id;
          const prev = messages[i - 1];
          const grouped = prev && prev.sender_id === m.sender_id;
          return (
            <div key={m.id} className={cn("group flex items-end gap-2", mine && "flex-row-reverse", !grouped && "mt-3")}>
              {!mine && (grouped ? <span className="w-8" /> : <Link to="/u/$username" params={{ username: m.sender_username }}><Avatar src={m.sender_avatar} name={m.sender_name} size="sm" /></Link>)}
              <div className={cn("max-w-[75%]", mine && "text-right")}>
                {!mine && !grouped && showNames && <p className="mb-0.5 text-xs font-semibold text-muted-foreground">{m.sender_name}</p>}
                <div className={cn("inline-block rounded-2xl px-3.5 py-2 text-left text-sm break-words whitespace-pre-wrap", mine ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-muted")}>
                  {m.is_deleted ? (
                    <span className="italic opacity-60">Message deleted</span>
                  ) : (
                    <>
                      {m.attachment_url &&
                        (/\.(jpe?g|png|webp|gif|avif)$/i.test(m.attachment_url) ? (
                          <a href={m.attachment_url} target="_blank" rel="noopener noreferrer">
                            <img src={m.attachment_url} alt="" className="mb-1 max-h-60 rounded-xl" />
                          </a>
                        ) : (
                          <a href={m.attachment_url} target="_blank" rel="noopener noreferrer" className="mb-1 flex items-center gap-1 underline">
                            <Paperclip className="size-3.5" /> Attachment
                          </a>
                        ))}
                      {m.body}
                    </>
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground" title={timeAgo(m.created_at)}>
                  {mine && !m.is_deleted && (
                    <button type="button" onClick={() => remove.mutate(m.id)} className="opacity-0 group-hover:opacity-100" aria-label="Delete message">
                      <Trash2 className="size-3" />
                    </button>
                  )}
                  {formatTime(m.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>
      <form
        className="flex items-end gap-2 border-t bg-white p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) send.mutate({ body: text.trim() });
        }}
      >
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-full p-2.5 text-muted-foreground hover:bg-muted" aria-label="Attach image">
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
        </button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => void attach(e.target.files?.[0])} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (text.trim()) send.mutate({ body: text.trim() });
            }
          }}
          rows={1}
          placeholder="Type a message…"
          className="max-h-32 min-h-10 flex-1 resize-none rounded-2xl border bg-muted px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button type="submit" disabled={!text.trim() || send.isPending} className="flex size-10 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40" aria-label="Send">
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
