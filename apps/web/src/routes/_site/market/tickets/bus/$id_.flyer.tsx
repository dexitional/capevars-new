import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Armchair, ArrowLeft, Bus, Clock, MapPin, Sparkles } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { imageSrc } from "#/lib/asset";
import { formatLongDate, formatTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { cn } from "#/lib/utils";
import { SideBus } from "#/components/market/bus-art";
import { pickupMapUrl } from "#/components/market/trip-pin";
import { tripShare } from "#/components/market/share-trip";
import { BrandMark, DateTile, FlyerFooter, FlyerPage, FlyerQrRow, FlyerSheet, HeroDecor, backLinkClass, useOrigin } from "#/components/market/flyer-kit";

type Row = Record<string, any>;
const tripQuery = (id: string) => ({
  queryKey: ["trip", id],
  queryFn: () => api.get<{ trip: Row; takenSeats: Array<number>; onlinePayments: boolean }>(`/tickets/trips/${id}`),
});

// A printable A4 flyer for a bus trip, public so organisers can share the link:
// the route, times, price, pickup point, and QR codes for booking a seat and
// for directions to the pickup.
export const Route = createFileRoute("/_site/market/tickets/bus/$id_/flyer")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(tripQuery(params.id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => {
    const t = loaderData?.trip;
    if (!t) return { meta: [] };
    const title = `${t.origin} → ${t.destination} · ${formatLongDate(t.departs_at)} | Capevars`;
    const description = `${t.operator} bus from ${t.origin} to ${t.destination}, departing ${formatTime(t.departs_at)}${t.pickup_point ? ` from ${t.pickup_point}` : ""}. ${formatMoney(t.price)} per seat — book online.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TripFlyer,
});

function duration(departs?: string, arrives?: string) {
  if (!departs || !arrives) return null;
  const mins = Math.round((new Date(`${arrives.replace(" ", "T")}Z`).getTime() - new Date(`${departs.replace(" ", "T")}Z`).getTime()) / 60_000);
  if (!Number.isFinite(mins) || mins <= 0) return null;
  const h = Math.floor(mins / 60);
  return h ? `${h}h${mins % 60 ? ` ${mins % 60}m` : ""}` : `${mins}m`;
}

// Long place names step down a size so they stay on one or two lines.
const placeSize = (name: string) => (name.length > 16 ? "text-[6cqw]" : name.length > 11 ? "text-[7.5cqw]" : "text-[9cqw]");

function TripFlyer() {
  const { id } = Route.useParams();
  const { data } = useQuery(tripQuery(id));
  const origin = useOrigin();
  if (!data) return null;
  const t = data.trip;
  const bookingUrl = `${origin}/market/tickets/bus/${t.id}`;
  const hasPin = t.pickup_lat !== null && t.pickup_lat !== undefined;
  const amenities = (Array.isArray(t.amenities) ? t.amenities : []) as Array<string>;
  const seatsLeft = Number(t.seats_left);
  // Checked in the browser only (origin is set after mount), so the server render matches.
  const departed = Boolean(origin) && new Date(`${String(t.departs_at).replace(" ", "T")}Z`).getTime() < Date.now();
  const unavailable = t.status !== "scheduled" ? `This trip is ${t.status}.` : departed ? "This trip has already departed." : null;
  const weekday = formatLongDate(t.departs_at).split(", ")[0];
  const length = duration(t.departs_at, t.arrives_at);

  return (
    <FlyerPage
      back={
        <Link to="/market/tickets/bus/$id" params={{ id }} className={backLinkClass}>
          <ArrowLeft className="size-4" /> Trip page
        </Link>
      }
      share={origin ? tripShare(t, origin) : null}
      notice={unavailable && `${unavailable} You can still print the flyer, but passengers won't be able to book.`}
    >
      <FlyerSheet>
        {/* ---- Hero: the route ---- */}
        <header className="relative flex h-[43%] flex-none flex-col overflow-hidden bg-primary px-[6cqw] pt-[4cqw] text-white">
          <HeroDecor />
          <div className="relative flex items-center justify-between gap-[2cqw]">
            <div className="flex min-w-0 items-center gap-[2cqw]">
              <BrandMark src={t.operator_logo && imageSrc(t.operator_logo)} icon={Bus} />
              <div className="min-w-0">
                <p className="text-[1.6cqw] font-semibold tracking-[0.3em] text-white/60 uppercase">Travel with</p>
                <p className="truncate text-[3cqw] leading-tight font-black">{t.operator}</p>
              </div>
            </div>
            <span className="flex-none rounded-full bg-brand-gold px-[2.4cqw] py-[1cqw] text-[1.7cqw] font-black tracking-[0.2em] text-primary uppercase">
              {seatsLeft > 0 ? "Seats available" : "Fully booked"}
            </span>
          </div>

          <div className="relative mt-[2.2cqw] flex-none">
            <p className="text-[2.4cqw] font-black tracking-[0.35em] text-brand-gold uppercase">Bus trip</p>
            <h1 className={cn("mt-[0.8cqw] leading-[0.95] font-black tracking-tight uppercase wrap-anywhere", placeSize(t.origin))}>{t.origin}</h1>
            <div className="my-[0.8cqw] flex items-center gap-[1.6cqw]" aria-hidden="true">
              <span className="size-[2cqw] flex-none rounded-full border-[0.5cqw] border-brand-gold" />
              <span className="h-0 flex-1 border-t-[0.5cqw] border-dashed border-white/40" />
              {/* Negative margins keep the big script word from pushing the route lines apart. */}
              <span className="-my-[2.4cqw] flex-none -rotate-8 px-[0.8cqw] font-script text-[7.5cqw] leading-none font-[800] text-brand-gold [-webkit-text-stroke:0.15cqw_var(--brand-gold)] drop-shadow-[0_0.4cqw_0_rgba(0,0,0,0.3)]">
                to
              </span>
              <span className="h-0 flex-1 border-t-[0.5cqw] border-dashed border-white/40" />
              <MapPin className="size-[3.6cqw] flex-none text-brand-gold" />
            </div>
            <h2 className={cn("leading-[0.95] font-black tracking-tight text-brand-gold uppercase wrap-anywhere", placeSize(t.destination))}>{t.destination}</h2>
          </div>

          {/* The road, with the coach on it (in the flow, below the place names, so they never overlap). */}
          <div className="absolute inset-x-0 bottom-0 h-[6cqw] bg-linear-to-b from-[#0b2346] to-[#06172f]" aria-hidden="true">
            <div className="absolute inset-x-0 top-0 h-[0.5cqw] bg-brand-gold/70" />
            <div className="absolute inset-x-0 top-1/2 border-t-[0.35cqw] border-dashed border-white/40" />
          </div>
          <div className="relative mt-auto mb-[3.2cqw] w-[26cqw] flex-none" aria-hidden="true">
            <SideBus label={t.operator} />
          </div>
        </header>

        {/* Price badge, astride the hero's edge. */}
        <div className="absolute top-[43%] right-[6cqw] z-10 grid size-[21cqw] -translate-y-1/2 place-items-center rounded-full bg-brand-gold text-center text-primary shadow-[0_1.5cqw_4cqw_rgba(4,29,64,0.35)] ring-[1.2cqw] ring-[#fbf8f1]">
          <div>
            <p className="text-[1.6cqw] font-bold tracking-[0.2em] uppercase">Only</p>
            <p className="text-[4.6cqw] leading-none font-black">{formatMoney(t.price, { free: "Free" })}</p>
            <p className="mt-[0.6cqw] text-[1.6cqw] font-bold tracking-[0.15em] uppercase">per seat</p>
          </div>
        </div>

        {/* ---- Details ---- */}
        <div className="flex flex-1 flex-col justify-between px-[6cqw] pt-[3.5cqw] pb-[3cqw]">
          <div className="flex items-center gap-[4cqw] pr-[22cqw]">
            <DateTile value={t.departs_at} />
            <div className="min-w-0">
              <p className="flex items-center gap-[1cqw] text-[1.7cqw] font-bold tracking-[0.2em] text-primary/50 uppercase">
                <Clock className="size-[2cqw]" /> Departs
              </p>
              <p className="text-[5.6cqw] leading-tight font-black">{formatTime(t.departs_at)}</p>
              <div className="mt-[0.6cqw] text-[2cqw] text-primary/75">
                {t.arrives_at ? (
                  <p>
                    Arrives <strong className="text-primary">{formatTime(t.arrives_at)}</strong>
                    {length && <> · about {length}</>}
                  </p>
                ) : (
                  <p>{weekday}</p>
                )}
                <p className="mt-[0.4cqw]">
                  {t.bus_type ?? "Bus"}
                  {/* Seat counts go stale on paper, so they're on screen only. */}
                  <span className="print:hidden"> · {seatsLeft > 0 ? `${seatsLeft} of ${t.seats_total} seats left` : "fully booked"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Pickup point */}
          <div className="flex items-start gap-[2.4cqw] rounded-[2.4cqw] border-l-[1cqw] border-brand-gold bg-white px-[3cqw] py-[1.8cqw] shadow-[0_0.6cqw_2cqw_rgba(4,29,64,0.08)]">
            <span className="grid size-[6.4cqw] flex-none place-items-center rounded-full bg-primary text-brand-gold">
              <MapPin className="size-[3.4cqw]" />
            </span>
            <div className="min-w-0">
              <p className="text-[1.7cqw] font-bold tracking-[0.2em] text-primary/50 uppercase">Pickup point</p>
              <p className="text-[3.4cqw] leading-tight font-black wrap-anywhere">{t.pickup_point ?? t.origin}</p>
              <p className="mt-[0.4cqw] text-[1.8cqw] text-primary/60">
                {hasPin ? `GPS ${Number(t.pickup_lat).toFixed(5)}, ${Number(t.pickup_lng).toFixed(5)} · ` : ""}Be there 15 minutes before departure
              </p>
            </div>
          </div>

          {amenities.length > 0 && (
            <ul className="flex flex-wrap gap-[1.2cqw]">
              {amenities.map((a) => (
                <li key={a} className="flex items-center gap-[0.8cqw] rounded-full bg-primary/6 px-[2cqw] py-[0.8cqw] text-[1.8cqw] font-semibold">
                  <Sparkles className="size-[1.8cqw] text-brand-amber" /> {a}
                </li>
              ))}
            </ul>
          )}

          <FlyerQrRow
            ready={Boolean(origin)}
            items={[
              { title: "Book your seat", text: "Scan to pick your seat and pay online", value: bookingUrl, icon: Armchair },
              { title: "Find the pickup", text: hasPin ? "Scan for directions on Google Maps" : "Scan to find it on Google Maps", value: pickupMapUrl(t), icon: MapPin },
            ]}
          />
        </div>

        <FlyerFooter phone={t.operator_phone} fallback="Seats are limited — book early" cta="Book on" origin={origin} />
      </FlyerSheet>
    </FlyerPage>
  );
}
