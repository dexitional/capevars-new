import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bus, CalendarDays, Ticket, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EVENT_CATEGORIES } from "#/lib/labels";
import { Container, Img, PageHero, SectionHeader, SeeAll } from "#/components/site/kit";
import { EventCard } from "#/components/site/cards";
import { BusSearchForm } from "#/components/market/bus-search";

type Row = Record<string, any>;
const ticketsHome = { queryKey: ["tickets-home"], queryFn: () => api.get<Record<string, Array<Row>>>("/tickets/home"), staleTime: 60_000 };

export const Route = createFileRoute("/_site/market/tickets/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(ticketsHome),
  head: () => ({ meta: [{ title: "E-Tickets | Capevars" }] }),
  component: TicketsHome,
});

function TicketsHome() {
  const { data } = useQuery(ticketsHome);
  const d = data ?? {};
  return (
    <div className="pb-16">
      <PageHero system="market" eyebrow="E-Tickets" title="Events, buses and rentals — booked in seconds." text="SRC and association events, campus shows, private parties, intercity bus seats and bus hire.">
        <BusSearchForm />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/market/tickets/events" className="btn-pop">
            <Ticket className="size-[1.1em]" strokeWidth={2.5} /> All events
          </Link>
          <Link to="/market/tickets/bus" className="btn-pop">
            <Bus className="size-[1.1em]" strokeWidth={2.5} /> Book a seat
          </Link>
          <Link to="/market/tickets/rentals" className="btn-pop">
            <Users className="size-[1.1em]" strokeWidth={2.5} /> Hire a bus
          </Link>
        </div>
      </PageHero>
      <Container className="mt-10">
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
          {Object.entries(EVENT_CATEGORIES).map(([k, v]) => (
            <Link key={k} to="/market/tickets/events" search={{ category: k }} className="shrink-0 rounded-full border bg-white px-4 py-2 text-sm font-semibold hover:border-primary">
              {v} events
            </Link>
          ))}
        </div>
        {d.featured && d.featured.length > 0 && (
          <>
            <SectionHeader title="Featured events" action={<SeeAll to="/market/tickets/events">All events</SeeAll>} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.featured.map((e) => (
                <EventCard key={e.id} e={e} />
              ))}
            </div>
          </>
        )}
        {d.routes && d.routes.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="Popular bus routes" text="Book your seat and pick it on the bus map." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {d.routes.map((r) => (
                <Link key={`${r.origin}-${r.destination}`} to="/market/tickets/bus" search={{ from: r.origin, to: r.destination }} className="card-hover flex items-center gap-3 rounded-2xl border bg-white p-4">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <Bus className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 font-bold text-primary">
                      {r.origin} <ArrowRight className="size-3.5" /> {r.destination}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {r.trips} trips · next {formatDate(r.next_departure)} · from {formatMoney(r.from_price)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
        {d.upcoming && d.upcoming.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="Coming up" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {d.upcoming.map((e) => (
                <EventCard key={e.id} e={e} compact />
              ))}
            </div>
          </section>
        )}
        {d.rentals && d.rentals.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="Bus rentals" text="Excursions, field trips, weddings and funerals." action={<SeeAll to="/market/tickets/rentals" />} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.rentals.map((r) => (
                <Link key={r.id} to="/market/tickets/rentals/$id" params={{ id: String(r.id) }} className="card-hover overflow-hidden rounded-2xl border bg-white">
                  <Img src={r.image} className="aspect-video w-full" />
                  <div className="p-4">
                    <p className="font-bold text-primary">{r.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.vehicle_type} · {r.capacity} seats · {r.store_name}
                    </p>
                    <p className="mt-2 font-extrabold text-primary">
                      {formatMoney(r.price_per_day)} <span className="text-xs font-medium text-muted-foreground">/ day</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl bg-brand-cream p-8 sm:flex-row sm:items-center">
          <CalendarDays className="size-10 text-primary" />
          <div className="flex-1">
            <h3 className="text-xl font-black text-primary">Organising an event or running buses?</h3>
            <p className="text-primary/70">Sell tickets and seats on Capevars, then check guests in with their ticket codes.</p>
          </div>
          <Link to="/seller/apply" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">
            Start selling tickets
          </Link>
        </div>
      </Container>
    </div>
  );
}
