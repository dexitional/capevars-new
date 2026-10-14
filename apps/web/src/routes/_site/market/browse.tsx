import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SlidersHorizontal, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { CardGridSkeleton, Chip, Container, EmptyState, Pager } from "#/components/site/kit";
import { ProductCard } from "#/components/site/cards";
import { NamedIcon } from "#/components/site/icon";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

const search = z.object({
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  min: z.coerce.number().optional().catch(undefined),
  max: z.coerce.number().optional().catch(undefined),
  condition: z.enum(["new", "used", "refurbished"]).optional().catch(undefined),
  deals: z.coerce.boolean().optional().catch(undefined),
  sort: z.enum(["relevance", "newest", "price_asc", "price_desc", "popular", "rating"]).optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});
type Search = z.infer<typeof search>;

export const Route = createFileRoute("/_site/market/browse")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Shop | Capevars Marketplace" }] }),
  component: BrowsePage,
});

const SORTS: Array<[NonNullable<Search["sort"]>, string]> = [
  ["relevance", "Best match"],
  ["newest", "Newest"],
  ["popular", "Most popular"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
  ["rating", "Top rated"],
];

function BrowsePage() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const set = (patch: Partial<Search>) => void navigate({ search: (prev) => ({ ...prev, page: undefined, ...patch }) });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [min, setMin] = useState(s.min?.toString() ?? "");
  const [max, setMax] = useState(s.max?.toString() ?? "");
  useEffect(() => {
    setMin(s.min?.toString() ?? "");
    setMax(s.max?.toString() ?? "");
  }, [s.min, s.max]);

  const { data: cats } = useQuery({ queryKey: ["market-categories"], queryFn: () => api.get<{ categories: Array<Row> }>("/market/categories"), staleTime: 300_000 });
  const page = s.page ?? 1;
  const { data, isFetching } = useQuery({
    queryKey: ["products", s],
    queryFn: () => api.get<{ items: Array<Row>; total: number }>("/market/products", { ...s, kind: "product", page, pageSize: 24, sort: s.sort ?? (s.q ? "relevance" : "newest") }),
    placeholderData: keepPreviousData,
  });

  const all = cats?.categories ?? [];
  const current = all.find((c) => c.slug === s.category);
  const parent = current?.parent_id ? all.find((c) => c.id === current.parent_id) : current;
  const roots = all.filter((c) => !c.parent_id && !c.is_food);
  const children = parent ? all.filter((c) => c.parent_id === parent.id) : [];

  const filters = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Category</p>
        <ul className="space-y-0.5">
          <li>
            <button type="button" onClick={() => set({ category: undefined })} className={cn("w-full rounded-lg px-3 py-1.5 text-left text-sm", !s.category ? "bg-primary font-semibold text-white" : "hover:bg-muted")}>
              All categories
            </button>
          </li>
          {roots.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => set({ category: c.slug })} className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm", s.category === c.slug ? "bg-primary font-semibold text-white" : "hover:bg-muted")}>
                <NamedIcon name={c.icon} className="size-4 opacity-70" /> {c.name}
              </button>
              {parent?.id === c.id && children.length > 0 && (
                <ul className="mt-0.5 ml-6 space-y-0.5 border-l pl-2">
                  {children.map((ch) => (
                    <li key={ch.id}>
                      <button type="button" onClick={() => set({ category: ch.slug })} className={cn("w-full rounded-lg px-3 py-1 text-left text-sm", s.category === ch.slug ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground")}>
                        {ch.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Price (GH₵)</p>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            set({ min: min ? Number(min) : undefined, max: max ? Number(max) : undefined });
          }}
        >
          <Input inputMode="numeric" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} className="bg-white" />
          <span>–</span>
          <Input inputMode="numeric" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} className="bg-white" />
          <Button size="sm" type="submit">
            Go
          </Button>
        </form>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">Condition</p>
        <div className="flex flex-wrap gap-2">
          {(["new", "used", "refurbished"] as const).map((c) => (
            <Chip key={c} active={s.condition === c} onClick={() => set({ condition: s.condition === c ? undefined : c })} className="capitalize">
              {c}
            </Chip>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={Boolean(s.deals)} onChange={(e) => set({ deals: e.target.checked || undefined })} className="size-4 accent-primary" />
        On sale only
      </label>
    </div>
  );

  return (
    <Container className="py-6">
      <nav className="mb-3 text-sm text-muted-foreground">
        <Link to="/market" className="hover:underline">
          Marketplace
        </Link>
        {parent && (
          <>
            {" / "}
            <button type="button" onClick={() => set({ category: parent.slug })} className="hover:underline">
              {parent.name}
            </button>
          </>
        )}
        {current && current.id !== parent?.id && <> / {current.name}</>}
      </nav>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-primary">
          {s.q ? `Results for “${s.q}”` : s.deals ? "Deals" : (current?.name ?? "All products")}
          <span className="ml-2 text-base font-medium text-muted-foreground">{data ? `${data.total} items` : ""}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal /> Filters
          </Button>
          <select value={s.sort ?? (s.q ? "relevance" : "newest")} onChange={(e) => set({ sort: e.target.value as Search["sort"] })} className="h-9 rounded-lg border bg-white px-3 text-sm" aria-label="Sort">
            {SORTS.map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div className={cn(isFetching && "opacity-70 transition")}>
          {!data ? (
            <CardGridSkeleton />
          ) : data.items.length === 0 ? (
            <EmptyState title="No products found" text="Try another category, a wider price range, or a different search." />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {data.items.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
              <Pager page={page} pageSize={24} total={data.total} onPage={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })} />
            </>
          )}
        </div>
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
          <div className="absolute inset-y-0 right-0 w-80 overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold">Filters</p>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            {filters}
          </div>
        </div>
      )}
    </Container>
  );
}
