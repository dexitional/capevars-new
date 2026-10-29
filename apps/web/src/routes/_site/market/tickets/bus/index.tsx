import React from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Armchair, ArrowRight, Bus, Clock, MapPin, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate, formatTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { Container, EmptyState, Img, Loading, PageHero } from "#/components/site/kit";
import { BusSearchForm } from "#/components/market/bus-search";
import { ShareTripButton } from "#/components/market/share-trip";

type Row = Record<string, any>;
const search = z.object({ from: z.string().optional().catch(undefined), to: z.string().optional().catch(undefined), date: z.string().optional().catch(undefined) });

export const Route = createFileRoute("/_site/market/tickets/bus/")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Bus tickets | Capevars" }] }),
  component: BusSearchPage,
});

function BusSearchPage() {
  const s = Route.useSearch();
  const { data, error } = useQuery({ queryKey: ["trips", s], queryFn: () => api.get<{ items: Array<Row>; places: Array<string> }>("/tickets/trips", s) });
  React.useEffect(() => {
    if (data) {
      console.log('Trips data received:', data);
    }
  }, [data]);
  React.useEffect(() => {
    if (error) {
      console.error('Trips query error:', error);
    }
  }, [error]);
  return (
    <div className="pb-16">
      <PageHero system="market" eyebrow="Bus tickets" title="Pick your bus and your seat." className="[&_h1]:text-3xl">
        <BusSearchForm key={JSON.stringify(s)} initial={s} places={data?.places} />
      </PageHero>
      <Container className="mt-8">
        {!data ? (
          <Loading />
        ) : data.items.length === 0 ? (
          <EmptyState icon={Bus} title="No trips found" text="Try another date or route — or leave the fields empty to see every upcoming trip." />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{data.items.length} trips</p>
            {data.items.map((t) => (
              // The title link stretches over the whole card, so the card opens the trip
              // while the Share button above it stays its own control.
              <div key={t.id} className="card-hover group relative grid items-center gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-[auto_1fr_auto]">
                <Img src={t.operator_logo} className="size-14 rounded-xl" fallback={<Bus className="size-6" />} />
                <div>
                  <Link to="/market/tickets/bus/$id" params={{ id: String(t.id) }} className="flex items-center gap-2 text-lg font-black text-primary after:absolute after:inset-0 after:rounded-2xl">
                    {t.origin} <ArrowRight className="size-4" /> {t.destination}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" /> {formatDate(t.departs_at)} · {formatTime(t.departs_at)}
                    </span>
                    {t.pickup_point && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4" /> {t.pickup_point}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="size-4" /> {t.seats_left} seats left
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.operator} {t.bus_type ? `· ${t.bus_type}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">{formatMoney(t.price)}</p>
                  {t.seats_left > 0 ? (
                    <span className="btn-pop btn-pop-ink btn-pop-sm mt-1.5">
                      <Armchair className="size-[1.1em]" strokeWidth={2.5} /> Select seat
                    </span>
                  ) : (
                    <span className="mt-1.5 inline-block rounded-[0.45em] border-2 border-slate-300 bg-slate-100 px-[0.75em] py-[0.32em] text-xs font-black text-slate-400">Full</span>
                  )}
                  <div className="relative z-10 mt-2 flex justify-end">
                    <ShareTripButton trip={t} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}