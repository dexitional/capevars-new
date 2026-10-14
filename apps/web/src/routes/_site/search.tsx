import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatMoney } from "#/lib/money";
import { formatDate } from "#/lib/format";
import { FINDER_TYPES } from "#/lib/labels";
import type { FinderType } from "#/lib/labels";
import { Avatar, Container, EmptyState, Img, Loading, RatingPill } from "#/components/site/kit";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/search")({
  validateSearch: z.object({ q: z.string().optional().catch(undefined) }),
  head: () => ({ meta: [{ title: "Search | Capevars" }] }),
  component: SearchPage,
});

function Group({ title, count, to, children }: { title: string; count: number; to?: string; children: React.ReactNode }) {
  if (!count) return null;
  return (
    <section className="rounded-2xl border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-black text-primary">
          {title} <span className="text-sm font-medium text-muted-foreground">({count})</span>
        </h2>
        {to && (
          <Link to={to} className="text-sm font-semibold text-primary hover:underline">
            Open →
          </Link>
        )}
      </div>
      <ul className="divide-y">{children}</ul>
    </section>
  );
}

function Item({ to, params, image, title, sub, right, round }: { to: string; params: Record<string, string>; image?: string | null; title: string; sub?: React.ReactNode; right?: React.ReactNode; round?: boolean }) {
  return (
    <li>
      <Link to={to} params={params as never} className="flex items-center gap-3 py-2.5 hover:opacity-80">
        {round ? <Avatar src={image} name={title} /> : <Img src={image} className="size-12 shrink-0 rounded-xl" />}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-foreground">{title}</span>
          {sub && <span className="block truncate text-xs text-muted-foreground">{sub}</span>}
        </span>
        {right}
      </Link>
    </li>
  );
}

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate();
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => api.get<{ results: Record<string, Array<Row>> }>("/public/search", { q }),
    enabled: q.length >= 2,
  });
  const r = data?.results ?? {};
  const total = Object.values(r).reduce((n, list) => n + list.length, 0);

  return (
    <div className="pb-16">
      <div className="hero-navy py-10 text-white">
        <Container>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void navigate({ to: "/search", search: { q: text.trim() } });
            }}
            className="flex max-w-3xl items-center gap-2 rounded-2xl bg-white p-2"
          >
            <SearchIcon className="ml-3 size-5 text-muted-foreground" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search everything on Capevars" className="flex-1 bg-transparent px-1 py-2.5 text-foreground outline-none" autoFocus />
            <button className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">Search</button>
          </form>
          {q && <p className="mt-4 text-white/70">{isLoading ? "Searching…" : `${total} results for “${q}”`}</p>}
        </Container>
      </div>
      <Container className="mt-8">
        {q.length < 2 ? (
          <EmptyState title="Search across all five platforms" text="Products, food, events, jobs, hostels, hotels, places, people, groups, pages and courses." />
        ) : isLoading ? (
          <Loading />
        ) : total === 0 ? (
          <EmptyState title="No results" text="Try a shorter or different search term." />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <Group title="Marketplace" count={r.products?.length ?? 0} to="/market/browse">
              {r.products?.map((p) => (
                <Item key={p.id} to="/market/p/$slug" params={{ slug: p.slug }} image={p.image} title={p.title} sub={p.store_name} right={<span className="font-bold text-primary">{formatMoney(p.price)}</span>} />
              ))}
            </Group>
            <Group title="The Finder" count={r.listings?.length ?? 0} to="/finder/search">
              {r.listings?.map((l) => (
                <Item
                  key={l.id}
                  to="/finder/l/$slug"
                  params={{ slug: l.slug }}
                  image={l.cover_url}
                  title={l.name}
                  sub={`${FINDER_TYPES[l.type as FinderType]?.one ?? l.type} · ${[l.area, l.city].filter(Boolean).join(", ")}`}
                  right={<RatingPill value={l.rating_avg} />}
                />
              ))}
            </Group>
            <Group title="People" count={r.people?.length ?? 0}>
              {r.people?.map((u) => (
                <Item key={u.id} to="/u/$username" params={{ username: u.username }} image={u.avatar_url} title={u.full_name} sub={u.headline ?? `@${u.username}`} round />
              ))}
            </Group>
            <Group title="Campus groups" count={r.groups?.length ?? 0} to="/groups">
              {r.groups?.map((g) => (
                <Item key={g.id} to="/groups/$slug" params={{ slug: g.slug }} image={g.logo_url} title={g.name} sub={`${g.member_count} members`} />
              ))}
            </Group>
            <Group title="Courses" count={r.courses?.length ?? 0} to="/learn/courses">
              {r.courses?.map((c) => (
                <Item key={c.id} to="/learn/c/$slug" params={{ slug: c.slug }} image={c.cover_url} title={c.title} right={<span className="font-bold text-primary">{formatMoney(c.price, { free: "Free" })}</span>} />
              ))}
            </Group>
            <Group title="Jobs" count={r.jobs?.length ?? 0} to="/market/jobs">
              {r.jobs?.map((j) => (
                <Item key={j.id} to="/market/jobs/$slug" params={{ slug: j.slug }} image={j.company_logo_url} title={j.title} sub={`${j.company_name} · ${j.location}`} />
              ))}
            </Group>
            <Group title="Events" count={r.events?.length ?? 0} to="/market/tickets">
              {r.events?.map((e) => (
                <Item key={e.id} to="/market/tickets/e/$slug" params={{ slug: e.slug }} image={e.cover_url} title={e.title} sub={`${formatDate(e.starts_at)} · ${e.venue}`} />
              ))}
            </Group>
            <Group title="Pages" count={r.pages?.length ?? 0} to="/social/pages">
              {r.pages?.map((p) => (
                <Item key={p.id} to="/social/pages/$slug" params={{ slug: p.slug }} image={p.avatar_url} title={p.name} sub={`${p.category} · ${p.follower_count} followers`} round />
              ))}
            </Group>
          </div>
        )}
      </Container>
    </div>
  );
}
