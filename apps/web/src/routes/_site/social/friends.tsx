import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { timeAgo } from "#/lib/format";
import { useMember } from "#/hooks/useMember";
import { Container, EmptyState, Loading } from "#/components/site/kit";
import { PersonRow } from "#/components/site/cards";
import { FriendButton } from "#/components/social/friend-button";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/social/friends")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Friends | SocialNet" }] }),
  component: Friends,
});

type Tab = "requests" | "friends" | "find";

function Friends() {
  const me = useMember()!;
  const [tab, setTab] = useState<Tab>("requests");
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const { data, refetch } = useQuery({ queryKey: ["friends"], queryFn: () => api.get<{ friends: Array<Row>; incoming: Array<Row>; outgoing: Array<Row> }>("/social/friends") });
  const people = useQuery({ queryKey: ["people", term], queryFn: () => api.get<{ items: Array<Row> }>("/social/people", { q: term }), enabled: tab === "find" });
  if (!data) return <Loading />;
  const online = (u: Row) => u.last_seen_at && Date.now() - new Date(`${String(u.last_seen_at).replace(" ", "T")}Z`).getTime() < 5 * 60_000;
  return (
    <Container className="max-w-4xl py-8">
      <h1 className="text-2xl font-black text-primary">Friends</h1>
      <div className="mt-4 mb-6 flex gap-2">
        {(
          [
            ["requests", `Requests (${data.incoming.length})`],
            ["friends", `All friends (${data.friends.length})`],
            ["find", "Find friends"],
          ] as const
        ).map(([k, label]) => (
          <button key={k} type="button" onClick={() => setTab(k)} className={cn("rounded-full px-4 py-2 text-sm font-semibold", tab === k ? "bg-sys-social text-white" : "bg-white")}>
            {label}
          </button>
        ))}
      </div>
      {tab === "requests" && (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 font-bold">Received</h2>
            {data.incoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.incoming.map((u) => (
                  <div key={u.id} className="space-y-3 rounded-2xl border bg-white p-4">
                    <PersonRow u={u} sub={`Sent ${timeAgo(u.requested_at)}`} />
                    <FriendButton userId={u.id} status="pending" direction="incoming" onChange={() => void refetch()} />
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-3 font-bold">Sent</h2>
            {data.outgoing.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven't sent any requests.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.outgoing.map((u) => (
                  <div key={u.id} className="rounded-2xl border bg-white p-4">
                    <PersonRow u={u} action={<FriendButton userId={u.id} status="pending" direction="outgoing" onChange={() => void refetch()} />} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
      {tab === "friends" &&
        (data.friends.length === 0 ? (
          <EmptyState icon={Users} title="No friends yet" text="Find people from your school, hall or groups." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.friends.map((u) => (
              <div key={u.id} className="space-y-3 rounded-2xl border bg-white p-4">
                <PersonRow u={u} sub={online(u) ? <span className="font-semibold text-success">● Active now</span> : (u.headline ?? `@${u.username}`)} />
                <FriendButton userId={u.id} status="accepted" onChange={() => void refetch()} />
              </div>
            ))}
          </div>
        ))}
      {tab === "find" && (
        <div>
          <form
            className="relative mb-5"
            onSubmit={(e) => {
              e.preventDefault();
              setTerm(q.trim());
            }}
          >
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, username, school or headline" className="h-11 bg-white pl-9" />
          </form>
          <p className="mb-3 text-sm font-semibold text-muted-foreground">{term ? `Results for “${term}”` : "Suggested for you"}</p>
          {!people.data ? (
            <Loading />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {people.data.items
                .filter((u) => u.id !== me.id)
                .map((u) => (
                  <div key={u.id} className="space-y-3 rounded-2xl border bg-white p-4">
                    <PersonRow u={u} sub={u.mutual > 0 ? `${u.mutual} mutual friends` : (u.institution ?? u.headline ?? `@${u.username}`)} />
                    <FriendButton
                      userId={u.id}
                      status={u.friendship === "declined" ? null : (u.friendship ?? null)}
                      direction={u.requester_id === u.id ? "incoming" : "outgoing"}
                      onChange={() => void people.refetch()}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
