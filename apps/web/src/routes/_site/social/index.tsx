import { useState } from "react";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, MessageCircle, Newspaper, Store, UserPlus, Users, UsersRound } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { useMember } from "#/hooks/useMember";
import { Avatar, Container, EmptyState } from "#/components/site/kit";
import { PersonRow } from "#/components/site/cards";
import { Composer } from "#/components/social/composer";
import { PostFeed } from "#/components/social/feed";
import { FriendButton } from "#/components/social/friend-button";
import { ProfileHero } from "#/components/social/profile-hero";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/social/")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "SocialNet | Capevars" }] }),
  component: Feed,
});

function Feed() {
  const me = useMember()!;
  const queryClient = useQueryClient();
  const [scope, setScope] = useState<"following" | "discover">("following");
  const { data: friends } = useQuery({ queryKey: ["friends"], queryFn: () => api.get<{ friends: Array<Row>; incoming: Array<Row>; outgoing: Array<Row> }>("/social/friends") });
  const { data: people } = useQuery({ queryKey: ["people", ""], queryFn: () => api.get<{ items: Array<Row> }>("/social/people") });
  const { data: pages } = useQuery({ queryKey: ["pages-suggest"], queryFn: () => api.get<{ items: Array<Row> }>("/social/pages") });
  return (
    <Container className="py-6">
      <ProfileHero username={me.username} fallbackName={me.fullName} fallbackAvatar={me.avatarUrl} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr_300px]">
      <aside className="hidden h-fit space-y-2 lg:sticky lg:top-24 lg:block">
        <Link to="/u/$username" params={{ username: me.username }} className="flex items-center gap-3 rounded-xl p-2 hover:bg-white">
          <Avatar src={me.avatarUrl} name={me.fullName} />
          <span className="font-semibold">{me.fullName}</span>
        </Link>
        {[
          { to: "/social/friends", label: "Friends", icon: Users, badge: friends?.incoming.length },
          { to: "/social/chats", label: "Chats", icon: MessageCircle },
          { to: "/social/pages", label: "Pages", icon: Bookmark },
          { to: "/groups/mine", label: "My groups", icon: UsersRound },
          { to: "/market", label: "Marketplace", icon: Store },
        ].map((l) => (
          <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-semibold hover:bg-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-sys-social/10 text-sys-social">
              <l.icon className="size-4" />
            </span>
            {l.label}
            {l.badge ? <span className="ml-auto rounded-full bg-rose-600 px-2 text-xs text-white">{l.badge}</span> : null}
          </Link>
        ))}
      </aside>
      <div className="min-w-0 space-y-4">
        <Composer onPosted={() => void queryClient.invalidateQueries({ queryKey: ["feed"] })} />
        <div className="flex gap-2">
          {(["following", "discover"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              aria-pressed={scope === s}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                scope === s ? "border-primary bg-primary text-brand-cream shadow-sm" : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:text-primary",
              )}
            >
              {s === "following" ? "Following" : "Discover"}
            </button>
          ))}
        </div>
        <PostFeed
          queryKey={["feed", scope]}
          path="/social/feed"
          params={{ scope }}
          empty={<EmptyState icon={Newspaper} title="Your feed is quiet" text="Add friends and follow pages to see their posts — or switch to Discover." />}
        />
      </div>
      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        {friends && friends.incoming.length > 0 && (
          <section className="rounded-2xl border bg-white p-4">
            <h3 className="mb-3 flex items-center justify-between font-bold text-primary">
              Friend requests <Link to="/social/friends" className="text-xs font-semibold text-sys-social">See all</Link>
            </h3>
            <ul className="space-y-3">
              {friends.incoming.slice(0, 3).map((u) => (
                <li key={u.id} className="space-y-2">
                  <PersonRow u={u} />
                  <FriendButton userId={u.id} status="pending" direction="incoming" />
                </li>
              ))}
            </ul>
          </section>
        )}
        {people && people.items.length > 0 && (
          <section className="rounded-2xl border bg-white p-4">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-primary">
              <UserPlus className="size-4" /> People you may know
            </h3>
            <ul className="space-y-3">
              {people.items.slice(0, 5).map((u) => (
                <li key={u.id}>
                  <PersonRow u={u} sub={u.mutual > 0 ? `${u.mutual} mutual friends` : (u.institution ?? u.headline)} action={<FriendButton userId={u.id} status={null} />} />
                </li>
              ))}
            </ul>
          </section>
        )}
        {pages && pages.items.filter((p) => !Number(p.following)).length > 0 && (
          <section className="rounded-2xl border bg-white p-4">
            <h3 className="mb-3 font-bold text-primary">Pages to follow</h3>
            <ul className="space-y-3">
              {pages.items
                .filter((p) => !Number(p.following))
                .slice(0, 4)
                .map((p) => (
                  <li key={p.id}>
                    <Link to="/social/pages/$slug" params={{ slug: p.slug }} className="flex items-center gap-3 text-sm hover:underline">
                      <Avatar src={p.avatar_url} name={p.name} size="sm" />
                      <span>
                        <span className="block font-semibold">{p.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.category} · {p.follower_count} followers
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </aside>
      </div>
    </Container>
  );
}
