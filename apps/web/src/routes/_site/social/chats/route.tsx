import { useState } from "react";
import { Link, Outlet, createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, Hash, MessageCircle, Plus, Search, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { timeAgo } from "#/lib/format";
import { useMember } from "#/hooks/useMember";
import { Avatar, Container } from "#/components/site/kit";
import { NamedIcon } from "#/components/site/icon";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/social/chats")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Chats | SocialNet" }] }),
  component: ChatsLayout,
});

const online = (v: string | null) => Boolean(v && Date.now() - new Date(`${v.replace(" ", "T")}Z`).getTime() < 5 * 60_000);

function ChatsLayout() {
  const me = useMember()!;
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [tab, setTab] = useState<"chats" | "forums">("chats");
  const [q, setQ] = useState("");
  const [newRoom, setNewRoom] = useState(false);
  const [room, setRoom] = useState({ title: "", description: "" });
  const threads = useQuery({ queryKey: ["chat-threads"], queryFn: () => api.get<{ direct: Array<Row>; rooms: Array<Row> }>("/chat/threads"), refetchInterval: 15_000 });
  const forums = useQuery({ queryKey: ["chat-forums"], queryFn: () => api.get<{ items: Array<Row> }>("/chat/forums"), enabled: tab === "forums" });
  const friends = useQuery({ queryKey: ["friends"], queryFn: () => api.get<{ friends: Array<Row> }>("/social/friends") });
  const startDirect = useMutation({
    mutationFn: (userId: number) => api.post<{ id: number }>(`/chat/direct/${userId}`),
    onSuccess: (r) => void navigate({ to: "/social/chats/$id", params: { id: String(r.id) } }),
    onError: (e) => toast.error(e.message),
  });
  const createRoom = useMutation({
    mutationFn: () => api.post<{ id: number }>("/chat/forums", room),
    onSuccess: (r) => {
      setNewRoom(false);
      void navigate({ to: "/social/chats/$id", params: { id: String(r.id) } });
    },
    onError: (e) => toast.error(e.message),
  });
  const inThread = pathname !== "/social/chats" && pathname !== "/social/chats/";
  const direct = (threads.data?.direct ?? []).filter((t) => !q || t.other_name.toLowerCase().includes(q.toLowerCase()));
  const matchingFriends = q ? (friends.data?.friends ?? []).filter((f) => f.full_name.toLowerCase().includes(q.toLowerCase()) && !direct.some((t) => t.other_id === f.id)) : [];
  return (
    <Container className="py-4">
      <div className="grid h-[calc(100vh-10rem)] min-h-[520px] overflow-hidden rounded-2xl border bg-white md:grid-cols-[340px_1fr]">
        <aside className={cn("flex min-h-0 flex-col border-r", inThread && "hidden md:flex")}>
          <div className="space-y-3 border-b p-4">
            <h1 className="text-xl font-black text-primary">Chats</h1>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
              {(["chats", "forums"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} className={cn("rounded-lg py-1.5 text-sm font-semibold", tab === t ? "bg-white shadow-sm" : "text-muted-foreground")}>
                  {t === "chats" ? "Messages & rooms" : "Forum rooms"}
                </button>
              ))}
            </div>
            {tab === "chats" && (
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search or start a chat with a friend" className="pl-9" />
              </div>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "chats" ? (
              <>
                {matchingFriends.map((f) => (
                  <button key={f.id} type="button" onClick={() => startDirect.mutate(f.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted">
                    <Avatar src={f.avatar_url} name={f.full_name} />
                    <span className="text-sm">
                      <span className="block font-semibold">{f.full_name}</span>
                      <span className="text-xs text-sys-social">Start a chat</span>
                    </span>
                  </button>
                ))}
                {direct.map((t) => (
                  <Link key={t.id} to="/social/chats/$id" params={{ id: String(t.id) }} className="flex items-center gap-3 px-4 py-3 hover:bg-muted [&.active]:bg-sys-social/10">
                    <span className="relative">
                      <Avatar src={t.other_avatar} name={t.other_name} />
                      {online(t.other_last_seen) && <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-success" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex justify-between gap-2">
                        <span className={cn("truncate text-sm", Number(t.unread) ? "font-black" : "font-semibold")}>{t.other_name}</span>
                        {t.last_message_at && <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(t.last_message_at)}</span>}
                      </span>
                      <span className={cn("block truncate text-xs", Number(t.unread) ? "font-semibold text-foreground" : "text-muted-foreground")}>
                        {t.last_sender_id === me.id ? "You: " : ""}
                        {t.last_body ?? (t.last_message_at ? "Sent an attachment" : "Say hello 👋")}
                      </span>
                    </span>
                    {Number(t.unread) ? <span className="size-2.5 rounded-full bg-sys-social" /> : null}
                  </Link>
                ))}
                {(threads.data?.rooms.length ?? 0) > 0 && <p className="px-4 pt-4 pb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">Rooms</p>}
                {threads.data?.rooms.map((t) => (
                  <Link key={t.id} to="/social/chats/$id" params={{ id: String(t.id) }} className="flex items-center gap-3 px-4 py-3 hover:bg-muted [&.active]:bg-sys-social/10">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                      {t.type === "group" ? <Users className="size-5" /> : t.type === "course" ? <BookOpen className="size-5" /> : <NamedIcon name={t.icon} className="size-5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-sm", Number(t.unread) ? "font-black" : "font-semibold")}>{t.title}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {t.type} room {t.last_message_at ? `· ${timeAgo(t.last_message_at)}` : ""}
                      </span>
                    </span>
                    {Number(t.unread) ? <span className="size-2.5 rounded-full bg-sys-social" /> : null}
                  </Link>
                ))}
                {threads.isSuccess && !direct.length && !threads.data.rooms.length && !matchingFriends.length && (
                  <p className="p-6 text-center text-sm text-muted-foreground">No chats yet. Search for a friend above, or join a forum room.</p>
                )}
              </>
            ) : (
              <>
                <div className="p-3">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setNewRoom(true)}>
                    <Plus /> Create a forum room
                  </Button>
                </div>
                {forums.data?.items.map((f) => (
                  <Link key={f.id} to="/social/chats/$id" params={{ id: String(f.id) }} className="flex items-center gap-3 px-4 py-3 hover:bg-muted">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sys-social/10 text-sys-social">
                      {f.icon ? <NamedIcon name={f.icon} className="size-5" /> : <Hash className="size-5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{f.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{f.description}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {f.participant_count} members · {f.message_count} messages {Number(f.joined) ? "· joined" : ""}
                      </span>
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </aside>
        <section className={cn("min-h-0", !inThread && "hidden md:block")}>
          {inThread ? (
            <Outlet />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <MessageCircle className="size-14 text-sys-social/40" />
              <p className="mt-3 font-semibold text-foreground">Your messages</p>
              <p className="text-sm">Pick a conversation, message a friend, or join a forum room.</p>
            </div>
          )}
        </section>
      </div>
      <Dialog open={newRoom} onOpenChange={setNewRoom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New forum room</DialogTitle>
          </DialogHeader>
          <Input value={room.title} onChange={(e) => setRoom({ ...room, title: e.target.value })} placeholder="Room name (e.g. Final Year Projects)" />
          <Input value={room.description} onChange={(e) => setRoom({ ...room, description: e.target.value })} placeholder="What's it about?" />
          <Button onClick={() => createRoom.mutate()} disabled={room.title.trim().length < 3 || createRoom.isPending}>
            Create room
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
