import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { BookOpen, Search, Star } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { COURSE_LEVELS } from "#/lib/labels";
import { CardGridSkeleton, Chip, Container, EmptyState, Pager } from "#/components/site/kit";
import { CourseCard } from "#/components/site/cards";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;
const search = z.object({
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  level: z.enum(["beginner", "intermediate", "advanced", "all"]).optional().catch(undefined),
  price: z.enum(["free", "paid"]).optional().catch(undefined),
  rating: z.coerce.number().optional().catch(undefined),
  sort: z.enum(["popular", "newest", "rating", "price_asc", "price_desc"]).optional().catch(undefined),
  page: z.coerce.number().optional().catch(undefined),
});
type S = z.infer<typeof search>;

export const Route = createFileRoute("/_site/learn/courses")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Browse courses | OpenLearn" }] }),
  component: Catalog,
});

function Catalog() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const set = (patch: Partial<S>) => void navigate({ search: (p) => ({ ...p, page: undefined, ...patch }) });
  const [q, setQ] = useState(s.q ?? "");
  const page = s.page ?? 1;
  const { data: home } = useQuery({ queryKey: ["learn-home"], queryFn: () => api.get<{ categories: Array<Row> }>("/learn/home"), staleTime: 300_000 });
  const { data, isFetching } = useQuery({
    queryKey: ["courses", s],
    queryFn: () => api.get<{ items: Array<Row>; total: number }>("/learn/courses", { ...s, page, pageSize: 24 }),
    placeholderData: keepPreviousData,
  });
  return (
    <Container className="py-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          set({ q: q || undefined });
        }}
        className="relative max-w-2xl"
      >
        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses or instructors" className="h-12 rounded-2xl bg-white pl-12 text-base" />
      </form>
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Category</p>
            <ul className="space-y-0.5">
              <li>
                <button type="button" onClick={() => set({ category: undefined })} className={cn("w-full rounded-lg px-3 py-1.5 text-left text-sm", !s.category ? "bg-primary font-semibold text-white" : "hover:bg-white")}>
                  All
                </button>
              </li>
              {home?.categories.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => set({ category: c.slug })} className={cn("flex w-full justify-between rounded-lg px-3 py-1.5 text-left text-sm", s.category === c.slug ? "bg-primary font-semibold text-white" : "hover:bg-white")}>
                    {c.name} <span className="opacity-60">{c.course_count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Level</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(COURSE_LEVELS).map(([k, v]) => (
                <Chip key={k} active={s.level === k} onClick={() => set({ level: s.level === k ? undefined : (k as S["level"]) })} className="px-3 py-1 text-xs">
                  {v}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Price</p>
            <div className="flex gap-1.5">
              {(["free", "paid"] as const).map((p) => (
                <Chip key={p} active={s.price === p} onClick={() => set({ price: s.price === p ? undefined : p })} className="px-3 py-1 text-xs capitalize">
                  {p}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Rating</p>
            <div className="flex flex-wrap gap-1.5">
              {[4.5, 4, 3.5].map((r) => (
                <Chip key={r} active={s.rating === r} onClick={() => set({ rating: s.rating === r ? undefined : r })} className="px-3 py-1 text-xs">
                  {r}+ <Star className="size-3 fill-current" />
                </Chip>
              ))}
            </div>
          </div>
        </aside>
        <div className={cn(isFetching && "opacity-70")}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{data ? `${data.total} courses` : ""}</p>
            <select value={s.sort ?? "popular"} onChange={(e) => set({ sort: e.target.value as S["sort"] })} className="h-9 rounded-lg border bg-white px-3 text-sm" aria-label="Sort">
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
          {!data ? (
            <CardGridSkeleton count={6} className="lg:grid-cols-3" />
          ) : data.items.length === 0 ? (
            <EmptyState icon={BookOpen} title="No courses match" />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.items.map((c) => (
                  <CourseCard key={c.id} c={c} />
                ))}
              </div>
              <Pager page={page} pageSize={24} total={data.total} onPage={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })} />
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
