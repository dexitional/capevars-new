import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Briefcase, MapPin, Plus, Search, UserSearch } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { JOB_TYPES, LEVELS, WORKPLACES } from "#/lib/labels";
import { Chip, Container, EmptyState, Loading, PageHero, Pager } from "#/components/site/kit";
import { JobCard } from "#/components/site/cards";

type Row = Record<string, any>;
const search = z.object({
  q: z.string().optional().catch(undefined),
  location: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  type: z.string().optional().catch(undefined),
  workplace: z.string().optional().catch(undefined),
  level: z.string().optional().catch(undefined),
  page: z.coerce.number().optional().catch(undefined),
});
type S = z.infer<typeof search>;

export const Route = createFileRoute("/_site/market/jobs/")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Job Circle | Capevars" }] }),
  component: JobsPage,
});

function JobsPage() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const set = (patch: Partial<S>) => void navigate({ search: (p) => ({ ...p, page: undefined, ...patch }) });
  const [q, setQ] = useState(s.q ?? "");
  const [loc, setLoc] = useState(s.location ?? "");
  const page = s.page ?? 1;
  const { data } = useQuery({
    queryKey: ["jobs", s],
    queryFn: () => api.get<{ items: Array<Row>; total: number; categories: Array<Row> }>("/jobs", { ...s, page, pageSize: 20 }),
    placeholderData: keepPreviousData,
  });
  const facet = (label: string, key: "type" | "workplace" | "level", map: Record<string, string>) => (
    <div>
      <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(map).map(([k, v]) => (
          <Chip key={k} active={s[key] === k} onClick={() => set({ [key]: s[key] === k ? undefined : k })} className="px-3 py-1 text-xs">
            {v}
          </Chip>
        ))}
      </div>
    </div>
  );
  return (
    <div className="pb-16">
      <PageHero system="market" eyebrow="Job Circle" title="Find work. Hire talent." text="Jobs, internships, national service, gigs and volunteering — from employers near you.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            set({ q: q || undefined, location: loc || undefined });
          }}
          className="grid max-w-3xl gap-2 rounded-2xl bg-white p-2 text-foreground sm:grid-cols-[1fr_220px_auto]"
        >
          <label className="flex items-center gap-2 px-3">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, skill or company" className="w-full bg-transparent py-2.5 outline-none" />
          </label>
          <label className="flex items-center gap-2 border-l px-3">
            <MapPin className="size-4 text-muted-foreground" />
            <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Location" className="w-full bg-transparent py-2.5 outline-none" />
          </label>
          <button className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">Search</button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/market/jobs/post" className="inline-flex items-center gap-1.5 rounded-full bg-brand-cream px-4 py-2 text-sm font-bold text-primary">
            <Plus className="size-4" /> Post a job
          </Link>
          <Link to="/market/jobs/talent" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
            <UserSearch className="size-4" /> Hire talent
          </Link>
          <Link to="/market/jobs/mine" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
            <Briefcase className="size-4" /> My jobs & applications
          </Link>
        </div>
      </PageHero>
      <Container className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Category</p>
            <ul className="space-y-0.5">
              <li>
                <button type="button" onClick={() => set({ category: undefined })} className={cn("w-full rounded-lg px-3 py-1.5 text-left text-sm", !s.category ? "bg-primary font-semibold text-white" : "hover:bg-white")}>
                  All categories
                </button>
              </li>
              {data?.categories.map((c) => (
                <li key={c.category}>
                  <button type="button" onClick={() => set({ category: c.category })} className={cn("flex w-full justify-between rounded-lg px-3 py-1.5 text-left text-sm", s.category === c.category ? "bg-primary font-semibold text-white" : "hover:bg-white")}>
                    {c.category} <span className="opacity-60">{c.n}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {facet("Job type", "type", JOB_TYPES)}
          {facet("Workplace", "workplace", WORKPLACES)}
          {facet("Experience", "level", LEVELS)}
        </aside>
        <div>
          {!data ? (
            <Loading />
          ) : data.items.length === 0 ? (
            <EmptyState icon={Briefcase} title="No jobs match" text="Try removing a filter, or check back soon." />
          ) : (
            <>
              <p className="mb-3 text-sm text-muted-foreground">{data.total} open roles</p>
              <div className="grid gap-3 xl:grid-cols-2">
                {data.items.map((j) => (
                  <JobCard key={j.id} j={j} />
                ))}
              </div>
              <Pager page={page} pageSize={20} total={data.total} onPage={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })} />
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
