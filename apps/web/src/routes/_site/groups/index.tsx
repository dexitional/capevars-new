import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Search, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { GROUP_CATEGORIES } from "#/lib/labels";
import { CardGridSkeleton, Chip, Container, EmptyState, PageHero, Pager } from "#/components/site/kit";
import { GroupCard } from "#/components/site/cards";

type Row = Record<string, any>;
const search = z.object({ q: z.string().optional().catch(undefined), category: z.string().optional().catch(undefined), page: z.coerce.number().optional().catch(undefined) });

export const Route = createFileRoute("/_site/groups/")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Campus Groups | Capevars" }] }),
  component: GroupsHome,
});

function GroupsHome() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [q, setQ] = useState(s.q ?? "");
  const page = s.page ?? 1;
  const { data } = useQuery({
    queryKey: ["groups", s],
    queryFn: () => api.get<{ items: Array<Row>; total: number }>("/groups", { ...s, page, pageSize: 24 }),
    placeholderData: keepPreviousData,
  });
  return (
    <div className="pb-16">
      <PageHero system="groups" eyebrow="Campus Groups" title="Find your people." text="Associations, clubs, halls, departments, faith and alumni groups — with forums, meetings, donations and pages.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ search: { q: q || undefined, category: s.category } });
          }}
          className="flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2"
        >
          <Search className="ml-3 size-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search groups" className="flex-1 bg-transparent py-2.5 text-foreground outline-none" />
          <button className="rounded-xl bg-sys-groups px-5 py-2.5 text-sm font-bold text-white">Search</button>
        </form>
      </PageHero>
      <Container className="mt-8">
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
          <Chip active={!s.category} onClick={() => void navigate({ search: { q: s.q } })}>
            All
          </Chip>
          {Object.entries(GROUP_CATEGORIES).map(([k, v]) => (
            <Chip key={k} active={s.category === k} onClick={() => void navigate({ search: { q: s.q, category: k } })}>
              {v}
            </Chip>
          ))}
        </div>
        {!data ? (
          <CardGridSkeleton />
        ) : data.items.length === 0 ? (
          <EmptyState icon={Users} title="No groups found" text="Can't find your group? Create it — it goes live after approval." />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.items.map((g) => (
                <GroupCard key={g.id} g={g} />
              ))}
            </div>
            <Pager page={page} pageSize={24} total={data.total} onPage={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })} />
          </>
        )}
      </Container>
    </div>
  );
}
