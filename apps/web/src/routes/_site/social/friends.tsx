import { useEffect, useState } from "react";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Search, Send, Sparkles, UserPlus, Users, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { timeAgo } from "#/lib/format";
import { useMember } from "#/hooks/useMember";
import { Avatar, Container, Verified } from "#/components/site/kit";
import { FriendButton } from "#/components/social/friend-button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/social/friends")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Friends | SocialNet" }] }),
  component: Friends,
});

type Tab = "requests" | "friends" | "find";
const TABS: Array<Tab> = ["requests", "friends", "find"];

// Seen in the last 5 minutes.
const isOnline = (u: Row) => Boolean(u.last_seen_at) && Date.now() - new Date(`${String(u.last_seen_at).replace(" ", "T")}Z`).getTime() < 5 * 60_000;

// Each card gets one of a few brand-coloured banners, fixed per person.
const BANNERS = [
  "from-primary via-[#0b2d5c] to-[#174a8b]",
  "from-[#0b2d5c] via-primary to-[#3a2a0a]",
  "from-[#174a8b] via-[#0b2d5c] to-primary",
  "from-primary via-[#1d3b2f] to-[#0b2d5c]",
];

function matches(u: Row, term: string) {
  if (!term) return true;
  const t = term.toLowerCase();
  return [u.full_name, u.username, u.headline, u.institution].some((v) => String(v ?? "").toLowerCase().includes(t));
}

// One person: banner, photo (with a live dot when online), name, a detail
// line, tags and the friend actions. Rises in on a stagger.
function PersonCard({ u, index, sub, tags, highlight, children }: { u: Row; index: number; sub?: React.ReactNode; tags?: Array<string>; highlight?: boolean; children: React.ReactNode }) {
  const online = isOnline(u);
  return (
    <article
      className={cn(
        "friends-card group relative flex flex-col overflow-hidden rounded-3xl border bg-white text-center shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_24px_50px_-24px_rgb(4_29_64/0.45)]",
        highlight && "ring-2 ring-brand-gold/60",
      )}
      style={{ animationDelay: `${Math.min(index, 12) * 55}ms` }}
    >
      <div className={cn("relative h-20 bg-gradient-to-br", BANNERS[Number(u.id) % BANNERS.length])}>
        <div className="dot-grid absolute inset-0 opacity-40" />
        <span className="friends-card-sheen absolute inset-0" />
        {highlight && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-black tracking-wide text-primary uppercase">
            <Sparkles className="size-3" /> New request
          </span>
        )}
      </div>
      <Link to="/u/$username" params={{ username: u.username }} className="relative mx-auto -mt-10 block">
        <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand-gold to-brand-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Avatar src={u.avatar_url} name={u.full_name} size="xl" ring className="relative transition-transform duration-300 group-hover:scale-105" />
        {online && (
          <span className="absolute right-1 bottom-1 flex size-4" title="Active now">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-4 rounded-full border-2 border-white bg-emerald-500" />
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
        <Link to="/u/$username" params={{ username: u.username }} className="mx-auto flex max-w-full items-center gap-1 font-bold text-primary hover:underline">
          <span className="truncate">{u.full_name}</span> {u.is_verified ? <Verified /> : null}
        </Link>
        <p className="mt-0.5 line-clamp-2 min-h-8 text-xs text-muted-foreground">{sub ?? u.headline ?? `@${u.username}`}</p>
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-brand-cream/60 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex justify-center pt-4">{children}</div>
      </div>
    </article>
  );
}

function Empty({ icon: Icon, title, text, action }: { icon: typeof Users; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="friends-card flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
      <span className="friends-float flex size-16 items-center justify-center rounded-2xl bg-brand-cream text-primary shadow-sm">
        <Icon className="size-7" />
      </span>
      <p className="mt-4 font-bold text-primary">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

function Skeletons() {
  return (
    <div className={GRID}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-3xl bg-white" />
      ))}
    </div>
  );
}

function Friends() {
  const me = useMember()!;
  const [tab, setTab] = useState<Tab>("requests");
  const [q, setQ] = useState("");
  // Searching people hits the server, so wait for typing to pause.
  const [term, setTerm] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setTerm(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);
  const { data, refetch } = useQuery({ queryKey: ["friends"], queryFn: () => api.get<{ friends: Array<Row>; incoming: Array<Row>; outgoing: Array<Row> }>("/social/friends") });
  const people = useQuery({ queryKey: ["people", term], queryFn: () => api.get<{ items: Array<Row> }>("/social/people", { q: term }), enabled: tab === "find" });

  const friends = data?.friends ?? [];
  const incoming = data?.incoming ?? [];
  const outgoing = data?.outgoing ?? [];
  const onlineCount = friends.filter(isOnline).length;
  const filter = q.trim();
  const counts: Record<Tab, number | null> = { requests: incoming.length, friends: friends.length, find: null };
  const labels: Record<Tab, string> = { requests: "Requests", friends: "All friends", find: "Find friends" };
  // Friends online first, then by name.
  const shownFriends = friends
    .filter((u) => matches(u, filter))
    .sort((a, b) => Number(isOnline(b)) - Number(isOnline(a)) || String(a.full_name).localeCompare(String(b.full_name)));
  const shownIncoming = incoming.filter((u) => matches(u, filter));
  const shownOutgoing = outgoing.filter((u) => matches(u, filter));
  const shownPeople = (people.data?.items ?? []).filter((u) => u.id !== me.id);
  const findButton = (
    <button type="button" className="btn-shine" onClick={() => setTab("find")}>
      Find friends <UserPlus className="btn-shine-icon" />
    </button>
  );

  return (
    <div className="pb-14">
      {/* ---- Hero ---- */}
      <section className="hero-navy relative overflow-hidden text-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <span className="profile-hero-orb absolute -top-10 left-[8%] size-48 rounded-full bg-brand-gold/25 blur-3xl" aria-hidden="true" />
        <span className="profile-hero-orb absolute right-[10%] -bottom-16 size-56 rounded-full bg-sky-400/20 blur-3xl" style={{ animationDelay: "-5s" }} aria-hidden="true" />
        <Container className="relative py-8 sm:py-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="friends-rise">
              <p className="text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">SocialNet</p>
              <h1 className="mt-2 font-hero text-4xl leading-none font-bold tracking-normal sm:text-5xl">Your people</h1>
              <p className="mt-2 max-w-lg text-sm text-white/75">Keep up with friends, answer requests and find classmates, hall-mates and colleagues.</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  ["Friends", friends.length, Users, "friends"],
                  ["Active now", onlineCount, Sparkles, "friends"],
                  ["Requests", incoming.length, Inbox, "requests"],
                  ["Sent", outgoing.length, Send, "requests"],
                ] as const
              ).map(([label, value, Icon, target], i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTab(target)}
                  className="friends-rise rounded-2xl border-2 border-white/[0.15] bg-primary/60 px-4 py-3 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand-cream/50"
                  style={{ animationDelay: `${120 + i * 70}ms` }}
                >
                  <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-white/70 uppercase">
                    <Icon className="size-3.5 text-brand-gold" /> {label}
                  </dt>
                  <dd className="mt-0.5 text-2xl font-black tabular-nums">{value}</dd>
                </button>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* ---- Toolbar: tabs and search ---- */}
      <div className="border-b border-border bg-white/85 backdrop-blur-md">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="relative grid w-full grid-cols-3 rounded-full bg-secondary p-1 sm:w-[30rem]" role="tablist" aria-label="Friends">
            {/* Sliding indicator under the active tab. */}
            <span
              className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-primary shadow-md transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ transform: `translateX(${TABS.indexOf(tab) * 100}%)` }}
              aria-hidden="true"
            />
            {TABS.map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={cn(
                  "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm font-semibold transition-colors duration-300",
                  tab === k ? "text-brand-cream" : "text-muted-foreground hover:text-primary",
                )}
              >
                {labels[k]}
                {counts[k] ? (
                  <span className={cn("rounded-full px-1.5 text-[10px] font-black tabular-nums", tab === k ? "bg-brand-gold text-primary" : "bg-white text-primary")}>{counts[k]}</span>
                ) : null}
              </button>
            ))}
          </div>
          <label className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tab === "find" ? "Search name, school or headline" : "Filter by name"}
              aria-label="Search"
              className="h-10 w-full rounded-full border border-border bg-white pr-9 pl-10 text-sm transition outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-primary" aria-label="Clear search">
                <X className="size-3.5" />
              </button>
            )}
          </label>
        </Container>
      </div>

      {/* ---- Content: re-mounts per tab so each switch animates in ---- */}
      <Container className="mt-8">
        <div key={tab} className="friends-tab">
          {!data ? (
            <Skeletons />
          ) : tab === "requests" ? (
            <div className="space-y-10">
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-primary">
                  <Inbox className="size-5 text-brand-gold" /> Received
                  <span className="text-sm font-semibold text-muted-foreground">{incoming.length}</span>
                </h2>
                {shownIncoming.length === 0 ? (
                  <Empty icon={Inbox} title="You're all caught up" text="No one is waiting on you. New friend requests will show up here." action={findButton} />
                ) : (
                  <div className={GRID}>
                    {shownIncoming.map((u, i) => (
                      <PersonCard key={u.id} u={u} index={i} highlight sub={`Sent ${timeAgo(u.requested_at)}`}>
                        <FriendButton userId={u.id} status="pending" direction="incoming" onChange={() => void refetch()} />
                      </PersonCard>
                    ))}
                  </div>
                )}
              </section>
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-primary">
                  <Send className="size-5 text-brand-gold" /> Sent
                  <span className="text-sm font-semibold text-muted-foreground">{outgoing.length}</span>
                </h2>
                {shownOutgoing.length === 0 ? (
                  <p className="rounded-2xl border border-dashed bg-white/60 px-5 py-6 text-center text-sm text-muted-foreground">You haven't sent any requests.</p>
                ) : (
                  <div className={GRID}>
                    {shownOutgoing.map((u, i) => (
                      <PersonCard key={u.id} u={u} index={i} sub={`Requested ${timeAgo(u.requested_at)}`}>
                        <FriendButton userId={u.id} status="pending" direction="outgoing" onChange={() => void refetch()} />
                      </PersonCard>
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : tab === "friends" ? (
            shownFriends.length === 0 ? (
              filter ? (
                <Empty icon={Search} title={`No friends match “${filter}”`} text="Try another name, or search everyone in Find friends." />
              ) : (
                <Empty icon={Users} title="No friends yet" text="Find people from your school, hall or groups." action={findButton} />
              )
            ) : (
              <div className={GRID}>
                {shownFriends.map((u, i) => (
                  <PersonCard
                    key={u.id}
                    u={u}
                    index={i}
                    sub={isOnline(u) ? <span className="font-semibold text-emerald-600">● Active now</span> : (u.headline ?? `@${u.username}`)}
                    tags={u.since ? [`Friends since ${timeAgo(u.since)}`] : undefined}
                  >
                    <FriendButton userId={u.id} status="accepted" onChange={() => void refetch()} />
                  </PersonCard>
                ))}
              </div>
            )
          ) : (
            <section>
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Sparkles className="size-4 text-brand-gold" /> {term ? `People matching “${term}”` : "Suggested for you"}
              </p>
              {!people.data ? (
                <Skeletons />
              ) : shownPeople.length === 0 ? (
                <Empty icon={Search} title="No one found" text="Try a different name, school or headline." />
              ) : (
                <div className={GRID}>
                  {shownPeople.map((u, i) => (
                    <PersonCard
                      key={u.id}
                      u={u}
                      index={i}
                      sub={u.headline ?? u.institution ?? `@${u.username}`}
                      tags={[...(u.mutual > 0 ? [`${u.mutual} mutual`] : []), ...(u.institution ? [String(u.institution)] : [])].slice(0, 2)}
                    >
                      <FriendButton
                        userId={u.id}
                        status={u.friendship === "declined" ? null : (u.friendship ?? null)}
                        direction={u.requester_id === u.id ? "incoming" : "outgoing"}
                        onChange={() => void people.refetch()}
                      />
                    </PersonCard>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
