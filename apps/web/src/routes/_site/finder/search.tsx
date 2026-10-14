import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SlidersHorizontal, Star, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { FINDER_AMENITIES, FINDER_TYPES, FINDER_TYPE_KEYS } from "#/lib/labels";
import type { FinderType } from "#/lib/labels";
import { CardGridSkeleton, Chip, Container, EmptyState, Pager } from "#/components/site/kit";
import { ListingCard } from "#/components/site/cards";
import { FinderSearchBox } from "#/components/finder/finder-search";
import { settingsQuery } from "#/components/site/site-footer";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const search = z.object({
  type: z.enum(FINDER_TYPE_KEYS).optional().catch(undefined),
  q: z.string().optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  area: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  min: z.coerce.number().optional().catch(undefined),
  max: z.coerce.number().optional().catch(undefined),
  rating: z.coerce.number().optional().catch(undefined),
  stars: z.coerce.number().optional().catch(undefined),
  amenity: z.string().optional().catch(undefined),
  verified: z.coerce.boolean().optional().catch(undefined),
  sort: z.enum(["recommended", "rating", "price_asc", "price_desc", "newest", "popular"]).optional().catch(undefined),
  page: z.coerce.number().optional().catch(undefined),
});
type S = z.infer<typeof search>;

export const Route = createFileRoute("/_site/finder/search")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Search The Finder | Capevars" }] }),
  component: FinderSearch,
});

function Facet({ title, items, active, onPick }: { title: string; items: Array<{ value: string; count: number }>; active?: string; onPick: (v: string | undefined) => void }) {
  const [all, setAll] = useState(false);
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">{title}</p>
      <ul className="space-y-0.5">
        {(all ? items : items.slice(0, 8)).map((f) => (
          <li key={f.value}>
            <button type="button" onClick={() => onPick(active === f.value ? undefined : f.value)} className={cn("flex w-full justify-between rounded-lg px-2.5 py-1 text-left text-sm", active === f.value ? "bg-primary font-semibold text-white" : "hover:bg-white")}>
              {f.value} <span className="opacity-60">{f.count}</span>
            </button>
          </li>
        ))}
      </ul>
      {items.length > 8 && (
        <button type="button" onClick={() => setAll(!all)} className="mt-1 text-xs font-semibold text-primary">
          {all ? "Show less" : `Show all ${items.length}`}
        </button>
      )}
    </div>
  );
}

function FinderSearch() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const set = (patch: Partial<S>) => void navigate({ search: (p) => ({ ...p, page: undefined, ...patch }) });
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(s.min?.toString() ?? "");
  const [max, setMax] = useState(s.max?.toString() ?? "");
  const { data: settings } = useQuery(settingsQuery);
  const page = s.page ?? 1;
  const { data, isFetching } = useQuery({
    queryKey: ["finder-search", s],
    queryFn: () => api.get<{ items: Array<Row>; total: number; facets: Record<string, Array<{ value: string; count: number }>> }>("/finder/search", { ...s, page, pageSize: 24 }),
    placeholderData: keepPreviousData,
  });
  const amenities = s.type ? FINDER_AMENITIES[s.type as FinderType] : [];
  const chosen = (s.amenity ?? "").split(",").filter(Boolean);
  const filters = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Type</p>
        <div className="flex flex-wrap gap-1.5">
          {FINDER_TYPE_KEYS.map((t) => (
            <Chip key={t} active={s.type === t} onClick={() => set({ type: s.type === t ? undefined : t, amenity: undefined, stars: undefined })} className="px-3 py-1 text-xs">
              {FINDER_TYPES[t].label}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Price (GH₵)</p>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            set({ min: min ? Number(min) : undefined, max: max ? Number(max) : undefined });
          }}
        >
          <Input placeholder="Min" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} className="bg-white" />
          <Input placeholder="Max" inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} className="bg-white" />
          <Button size="sm" type="submit">
            Go
          </Button>
        </form>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Guest rating</p>
        <div className="flex flex-wrap gap-1.5">
          {[4.5, 4, 3.5, 3].map((r) => (
            <Chip key={r} active={s.rating === r} onClick={() => set({ rating: s.rating === r ? undefined : r })} className="px-3 py-1 text-xs">
              {r}+ <Star className="size-3 fill-current" />
            </Chip>
          ))}
        </div>
      </div>
      {s.type === "hotel" && (
        <div>
          <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Star rating</p>
          <div className="flex flex-wrap gap-1.5">
            {[5, 4, 3, 2].map((r) => (
              <Chip key={r} active={s.stars === r} onClick={() => set({ stars: s.stars === r ? undefined : r })} className="px-3 py-1 text-xs">
                {r}★+
              </Chip>
            ))}
          </div>
        </div>
      )}
      {amenities.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Amenities</p>
          {amenities.map((a) => (
            <label key={a} className="flex items-center gap-2 py-0.5 text-sm">
              <input
                type="checkbox"
                className="accent-primary"
                checked={chosen.includes(a)}
                onChange={(e) => set({ amenity: (e.target.checked ? [...chosen, a] : chosen.filter((x) => x !== a)).join(",") || undefined })}
              />
              {a}
            </label>
          ))}
        </div>
      )}
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" className="accent-primary" checked={Boolean(s.verified)} onChange={(e) => set({ verified: e.target.checked || undefined })} />
        Verified only
      </label>
      <Facet title="City" items={data?.facets.city ?? []} active={s.city} onPick={(v) => set({ city: v })} />
      <Facet title="Area" items={data?.facets.area ?? []} active={s.area} onPick={(v) => set({ area: v })} />
      <Facet title="Category" items={data?.facets.category ?? []} active={s.category} onPick={(v) => set({ category: v })} />
    </div>
  );
  return (
    <div className="pb-16">
      <div className="bg-gradient-to-br from-[#041d40] to-[#0d4f4a] py-6">
        <Container>
          <FinderSearchBox key={`${s.type}-${s.q}-${s.city}`} initial={{ type: s.type, q: s.q, city: s.city }} cities={settings?.finder.cities} />
        </Container>
      </div>
      <Container className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-black text-primary">
            {s.type ? FINDER_TYPES[s.type].label : "Everything"}
            {s.city ? ` in ${s.city}` : ""}
            {s.area ? `, ${s.area}` : ""}
            <span className="ml-2 text-sm font-medium text-muted-foreground">{data ? `${data.total} found` : ""}</span>
          </h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="lg:hidden" onClick={() => setOpen(true)}>
              <SlidersHorizontal /> Filters
            </Button>
            <select value={s.sort ?? "recommended"} onChange={(e) => set({ sort: e.target.value as S["sort"] })} className="h-9 rounded-lg border bg-white px-3 text-sm" aria-label="Sort">
              <option value="recommended">Our top picks</option>
              <option value="rating">Top rated</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="popular">Most viewed</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">{filters}</aside>
          <div className={cn(isFetching && "opacity-70")}>
            {!data ? (
              <CardGridSkeleton count={6} className="md:grid-cols-2 lg:grid-cols-3" />
            ) : data.items.length === 0 ? (
              <EmptyState title="Nothing matches yet" text="Try a different area, fewer filters, or add a listing." />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((l) => (
                    <ListingCard key={l.id} l={l} />
                  ))}
                </div>
                <Pager page={page} pageSize={24} total={data.total} onPage={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })} />
              </>
            )}
          </div>
        </div>
      </Container>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-label="Close" />
          <div className="absolute inset-y-0 right-0 w-80 overflow-y-auto bg-muted p-5">
            <div className="mb-4 flex justify-between">
              <p className="font-bold">Filters</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            {filters}
          </div>
        </div>
      )}
    </div>
  );
}
