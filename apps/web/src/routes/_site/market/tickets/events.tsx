import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CalendarDays } from "lucide-react";
import { api } from "#/lib/api-client";
import { EVENT_CATEGORIES } from "#/lib/labels";
import { CardGridSkeleton, Chip, Container, EmptyState, Pager } from "#/components/site/kit";
import { EventCard } from "#/components/site/cards";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;
const search = z.object({
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  when: z.enum(["upcoming", "week", "month", "past"]).optional().catch(undefined),
  page: z.coerce.number().optional().catch(undefined),
});

export const Route = createFileRoute("/_site/market/tickets/events")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Events | Capevars E-Tickets" }] }),
  component: EventsPage,
});

function EventsPage() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const set = (patch: Partial<z.infer<typeof search>>) => void navigate({ search: (p) => ({ ...p, page: undefined, ...patch }) });
  const page = s.page ?? 1;
  const { data } = useQuery({
    queryKey: ["events", s],
    queryFn: () => api.get<{ items: Array<Row>; total: number }>("/tickets/events", { ...s, page, pageSize: 24 }),
    placeholderData: keepPreviousData,
  });
  return (
    <Container className="py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-black text-primary">Events</h1>
        <Input defaultValue={s.q} onKeyDown={(e) => e.key === "Enter" && set({ q: (e.target as HTMLInputElement).value || undefined })} placeholder="Search events, venues…" className="w-64 bg-white" />
      </div>
      <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
        <Chip active={!s.category} onClick={() => set({ category: undefined })}>
          All
        </Chip>
        {Object.entries(EVENT_CATEGORIES).map(([k, v]) => (
          <Chip key={k} active={s.category === k} onClick={() => set({ category: k })}>
            {v}
          </Chip>
        ))}
      </div>
      <div className="mb-6 flex gap-2">
        {(
          [
            ["upcoming", "Upcoming"],
            ["week", "This week"],
            ["month", "This month"],
            ["past", "Past"],
          ] as const
        ).map(([k, v]) => (
          <Chip key={k} active={(s.when ?? "upcoming") === k} onClick={() => set({ when: k })}>
            {v}
          </Chip>
        ))}
      </div>
      {!data ? (
        <CardGridSkeleton />
      ) : data.items.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events found" text="Try another category or time range." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
          <Pager page={page} pageSize={24} total={data.total} onPage={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })} />
        </>
      )}
    </Container>
  );
}
