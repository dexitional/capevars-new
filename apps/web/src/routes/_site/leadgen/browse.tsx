import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Database } from "lucide-react";
import { api } from "#/lib/api-client";
import { CardGridSkeleton, Chip, Container, EmptyState, Pager } from "#/components/site/kit";
import { LEAD_CATEGORIES, LeadCard } from "#/components/leadgen/lead-card";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;
const search = z.object({
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  price: z.enum(["free", "paid"]).optional().catch(undefined),
  has: z.enum(["phone", "email"]).optional().catch(undefined),
  sort: z.enum(["popular", "newest", "largest", "price_asc"]).optional().catch(undefined),
  page: z.coerce.number().optional().catch(undefined),
});
type S = z.infer<typeof search>;

export const Route = createFileRoute("/_site/leadgen/browse")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Browse lead lists | LeadGen" }] }),
  component: BrowseLeads,
});

function BrowseLeads() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const set = (patch: Partial<S>) => void navigate({ search: (p) => ({ ...p, page: undefined, ...patch }) });
  const page = s.page ?? 1;
  const { data } = useQuery({
    queryKey: ["leadgen", "lists", s],
    queryFn: () => api.get<{ items: Array<Row>; total: number }>("/leadgen/lists", { ...s, page, pageSize: 24 }),
    placeholderData: keepPreviousData,
  });
  return (
    <Container className="py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-black text-primary">Lead lists {data && <span className="text-base font-medium text-muted-foreground">({data.total})</span>}</h1>
        <div className="flex gap-2">
          <Input defaultValue={s.q} placeholder="Search lists…" className="w-60 bg-white" onKeyDown={(e) => e.key === "Enter" && set({ q: (e.target as HTMLInputElement).value || undefined })} />
          <select value={s.sort ?? "popular"} onChange={(e) => set({ sort: e.target.value as S["sort"] })} className="h-9 rounded-lg border bg-white px-3 text-sm">
            <option value="popular">Most used</option>
            <option value="newest">Newest</option>
            <option value="largest">Largest</option>
            <option value="price_asc">Lowest price</option>
          </select>
        </div>
      </div>
      <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
        <Chip active={!s.category} onClick={() => set({ category: undefined })}>
          All
        </Chip>
        {Object.entries(LEAD_CATEGORIES).map(([k, v]) => (
          <Chip key={k} active={s.category === k} onClick={() => set({ category: k })}>
            {v}
          </Chip>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Chip active={s.price === "free"} onClick={() => set({ price: s.price === "free" ? undefined : "free" })}>
          Free
        </Chip>
        <Chip active={s.price === "paid"} onClick={() => set({ price: s.price === "paid" ? undefined : "paid" })}>
          Paid
        </Chip>
        <Chip active={s.has === "phone"} onClick={() => set({ has: s.has === "phone" ? undefined : "phone" })}>
          Has phones
        </Chip>
        <Chip active={s.has === "email"} onClick={() => set({ has: s.has === "email" ? undefined : "email" })}>
          Has emails
        </Chip>
      </div>
      {!data ? (
        <CardGridSkeleton />
      ) : data.items.length === 0 ? (
        <EmptyState icon={Database} title="No lead lists match" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((l) => (
              <LeadCard key={l.id} l={l} />
            ))}
          </div>
          <Pager page={page} pageSize={24} total={data.total} onPage={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })} />
        </>
      )}
    </Container>
  );
}
