import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Armchair, Bus, CalendarDays, CheckCircle2, ChevronLeft, Clock, Loader2, MapPin, QrCode, Sparkles, X } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatLongDate, formatTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Container, Img } from "#/components/site/kit";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { BusDeparting, BusRoadScene, SeatMap } from "#/components/market/bus-art";

type Row = Record<string, any>;
const tripQuery = (id: string) => ({ queryKey: ["trip", id], queryFn: () => api.get<{ trip: Row; takenSeats: Array<number>; onlinePayments: boolean }>(`/tickets/trips/${id}`) });

export const Route = createFileRoute("/_site/market/tickets/bus/$id")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(tripQuery(params.id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: () => ({ meta: [{ title: "Choose your seat | Capevars" }] }),
  component: TripPage,
});

// "2026-10-17 14:00:00" → minutes between departure and arrival, if both are known.
function tripLength(departs?: string, arrives?: string) {
  if (!departs || !arrives) return null;
  const mins = Math.round((new Date(arrives.replace(" ", "T")).getTime() - new Date(departs.replace(" ", "T")).getTime()) / 60_000);
  if (!Number.isFinite(mins) || mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
}

function TripPage() {
  const { id } = Route.useParams();
  const { data, refetch } = useQuery(tripQuery(id));
  const member = useMember();
  const requireMember = useRequireMember();
  const [seats, setSeats] = useState<Array<number>>([]);
  const [holderName, setHolderName] = useState(member?.fullName ?? "");
  const [holderPhone, setHolderPhone] = useState("");
  const [booked, setBooked] = useState<Array<number> | null>(null);
  const book = useMutation({
    mutationFn: () => api.post<{ authorizationUrl: string | null }>(`/tickets/trips/${id}/book`, { seats, holderName, holderPhone }),
    onSuccess: (r) => {
      if (r.authorizationUrl) window.location.href = r.authorizationUrl;
      else {
        setBooked(seats);
        setSeats([]);
        void refetch();
      }
    },
    onError: (e) => {
      toast.error(e.message);
      void refetch();
    },
  });
  if (!data) return null;
  const t = data.trip;
  const taken = new Set(data.takenSeats);
  const seatsLeft = Math.max(0, Number(t.seats_total) - taken.size);
  const duration = tripLength(t.departs_at, t.arrives_at);
  const amenities: Array<string> = Array.isArray(t.amenities) ? t.amenities : [];
  const toggle = (n: number) =>
    setSeats((s) => (s.includes(n) ? s.filter((x) => x !== n) : s.length >= 10 ? (toast.message("You can book up to 10 seats at a time."), s) : [...s, n].sort((a, b) => a - b)));

  return (
    <Container className="py-6">
      <Link to="/market/tickets/bus" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ChevronLeft className="size-4" /> All bus trips
      </Link>

      {/* ---- Journey hero: route, times and the coach on the road ---- */}
      <section className="hero-navy relative overflow-hidden rounded-3xl text-white shadow-[0_30px_60px_-30px_rgb(4_29_64/0.7)]">
        <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative px-5 pt-5 sm:px-8 sm:pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Img src={t.operator_logo} className="size-12 rounded-xl ring-2 ring-white/20" fallback={<Bus className="size-5" />} />
              <div>
                <p className="font-bold">{t.operator}</p>
                {t.bus_type && (
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-brand-gold px-2 py-0.5 text-[11px] font-black text-primary">
                    <Sparkles className="size-3" /> {t.bus_type}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-brand-cream tabular-nums">{formatMoney(t.price)}</p>
              <p className="text-xs text-white/60">per seat</p>
            </div>
          </div>

          {/* Route: origin ─ bus ─ destination. */}
          <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6">
            <div>
              <p className="font-hero text-3xl leading-none font-bold sm:text-4xl">{t.origin}</p>
              <p className="mt-1.5 text-sm text-white/70">Departs {formatTime(t.departs_at)}</p>
            </div>
            <div className="relative">
              {duration && <p className="mb-2 text-center text-xs font-semibold text-brand-cream/80">{duration}</p>}
              <div className="relative h-7">
                <span className="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-full border-2 border-brand-cream bg-primary" />
                <span className="absolute inset-x-3 top-1/2 border-t-2 border-dashed border-white/30" />
                <span className="absolute top-1/2 right-0 size-3 -translate-y-1/2 rounded-full bg-brand-gold shadow-[0_0_10px_2px_rgb(245_184_20/0.6)]" />
                <span className="bus-route-dot absolute top-0 flex size-7 items-center justify-center rounded-full bg-brand-cream text-primary shadow-lg">
                  <Bus className="size-4" />
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-hero text-3xl leading-none font-bold sm:text-4xl">{t.destination}</p>
              <p className="mt-1.5 text-sm text-white/70">{t.arrives_at ? `Arrives ${formatTime(t.arrives_at)}` : "Arrival time varies"}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <CalendarDays className="size-3.5 text-brand-cream" /> {formatLongDate(t.departs_at)}
            </span>
            {t.pickup_point && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <MapPin className="size-3.5 text-brand-cream" /> Pickup: {t.pickup_point}
              </span>
            )}
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5", seatsLeft <= 5 ? "bg-rose-500/90" : "bg-emerald-500/90")}>
              <Armchair className="size-3.5" /> {seatsLeft === 0 ? "Fully booked" : `${seatsLeft} of ${t.seats_total} seats left`}
            </span>
            {amenities.map((a) => (
              <span key={a} className="rounded-full border border-white/20 px-3 py-1.5 text-white/80">
                {a}
              </span>
            ))}
            <Link to="/market/tickets/bus/$id/flyer" params={{ id }} className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3 py-1.5 text-primary hover:bg-brand-gold/90">
              <QrCode className="size-3.5" /> Share flyer
            </Link>
          </div>
        </div>
        <BusRoadScene operator={t.operator} className="-mt-2" />
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ---- Seat map ---- */}
        <section className="rounded-3xl border bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-primary">Choose your seats</h2>
              <p className="text-sm text-muted-foreground">Tap a seat to pick it; tap again to let it go. Up to 10 at a time.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="size-4 rounded border-2 border-[#9fb0c8] bg-white" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-4 rounded border-2 border-primary bg-brand-gold" /> Your pick
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-4 rounded border-2 border-slate-400 bg-slate-300" /> Taken
              </span>
            </div>
          </div>
          <div className="dot-grid-dark mt-6 rounded-2xl bg-slate-50/70 py-8">
            <SeatMap total={Number(t.seats_total)} taken={taken} selected={seats} onToggle={toggle} />
          </div>
        </section>

        {/* ---- Ticket ---- */}
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-24px_rgb(4_29_64/0.45)] ring-1 ring-border">
            <div className="bg-primary px-5 py-4 text-white">
              <p className="text-[11px] font-bold tracking-[0.2em] text-brand-cream uppercase">Boarding pass</p>
              <p className="mt-1 flex items-center gap-2 text-lg font-black">
                {t.origin} <span className="text-brand-gold">→</span> {t.destination}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-white/70">
                <Clock className="size-3.5" /> {formatLongDate(t.departs_at)} · {formatTime(t.departs_at)}
              </p>
            </div>
            {/* Perforation. */}
            <div className="relative h-5">
              <span className="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full bg-muted ring-1 ring-border" />
              <span className="absolute inset-x-4 top-1/2 border-t-2 border-dashed border-slate-200" />
              <span className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full bg-muted ring-1 ring-border" />
            </div>

            <div className="px-5 pb-5">
              {booked ? (
                <div className="text-center">
                  <BusDeparting operator={t.operator} />
                  <CheckCircle2 className="mx-auto mt-4 size-10 text-success" />
                  <p className="mt-2 font-black text-primary">Seats {booked.join(", ")} reserved</p>
                  <p className="mt-1 text-sm text-muted-foreground">Pay the operator to confirm. Your ticket codes are in your account.</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Button asChild>
                      <Link to="/account/tickets">View tickets</Link>
                    </Button>
                    <Button variant="outline" onClick={() => setBooked(null)}>
                      Book more
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    requireMember(() => book.mutate());
                  }}
                >
                  <div>
                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Your seats</p>
                    {seats.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {seats.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => toggle(n)}
                            className="inline-flex items-center gap-1 rounded-lg border-2 border-primary bg-brand-gold px-2 py-1 text-sm font-black text-primary transition hover:bg-brand-butter"
                            aria-label={`Remove seat ${n}`}
                          >
                            {n} <X className="size-3.5" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 rounded-xl border-2 border-dashed border-slate-200 px-3 py-4 text-center text-sm text-muted-foreground">Pick seats on the bus.</p>
                    )}
                  </div>
                  <Field label="Passenger name">
                    <Input value={holderName} onChange={(e) => setHolderName(e.target.value)} required />
                  </Field>
                  <Field label="Phone">
                    <Input type="tel" value={holderPhone} onChange={(e) => setHolderPhone(e.target.value)} required />
                  </Field>
                  <div className="space-y-1 border-t border-dashed pt-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        {seats.length || 0} × {formatMoney(t.price)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold">Total</span>
                      <strong className="text-2xl font-black text-primary tabular-nums">{formatMoney(Number(t.price) * seats.length)}</strong>
                    </div>
                  </div>
                  <Button type="submit" className="h-12 w-full rounded-xl text-base font-bold" disabled={!seats.length || book.isPending}>
                    {book.isPending && <Loader2 className="animate-spin" />} {data.onlinePayments ? "Pay & book" : "Reserve seats"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
