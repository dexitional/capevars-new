import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { imageSrc } from "#/lib/asset";
import { formatEventRange, formatLongDate, formatTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EVENT_CATEGORIES, label } from "#/lib/labels";
import { cn } from "#/lib/utils";
import { BrandMark, CARD, DateTile, FlyerFooter, FlyerPage, FlyerQrRow, FlyerSheet, HeroDecor, backLinkClass, useOrigin } from "#/components/market/flyer-kit";

type Row = Record<string, any>;
const eventQuery = (slug: string) => ({
  queryKey: ["event", slug],
  queryFn: () => api.get<{ event: Row; types: Array<Row>; onlinePayments: boolean }>(`/tickets/events/${slug}`),
});

// A printable A4 poster for an event, public so organisers can share it: the
// cover photo, title, date and time, venue, ticket prices, and QR codes for
// buying tickets and for directions to the venue. Each kind of event gets
// its own accent colour (pink for concerts, green for sports…).
export const Route = createFileRoute("/_site/market/tickets/e/$slug_/flyer")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(eventQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => {
    const e = loaderData?.event;
    if (!e) return { meta: [] };
    const title = `${e.title} · ${formatLongDate(e.starts_at)} | Capevars`;
    const description = `${e.summary ?? e.title} — ${formatEventRange(e.starts_at, e.ends_at)} at ${e.venue}. Get your tickets online.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: e.cover_url ?? "" },
      ],
    };
  },
  component: EventFlyer,
});

const ACCENT: Record<string, string> = {
  concert: "#ff4d8d",
  src: "#ff4d8d",
  sports: "#22c55e",
  conference: "#38bdf8",
  association: "#a78bfa",
  private: "#fb923c",
  campus: "#f5b814",
  other: "#f5b814",
};

const titleSize = (t: string) => (t.length > 44 ? "text-[5.2cqw]" : t.length > 22 ? "text-[6.6cqw]" : "text-[8.4cqw]");

// A gold "admit one" stub with notches cut into its sides.
const stubMask = {
  WebkitMask: "radial-gradient(circle at 0 50%, transparent 1.6cqw, #000 1.7cqw), radial-gradient(circle at 100% 50%, transparent 1.6cqw, #000 1.7cqw)",
  WebkitMaskComposite: "source-in",
  mask: "radial-gradient(circle at 0 50%, transparent 1.6cqw, #000 1.7cqw), radial-gradient(circle at 100% 50%, transparent 1.6cqw, #000 1.7cqw)",
  maskComposite: "intersect",
} as const;

function EventFlyer() {
  const { slug } = Route.useParams();
  const { data } = useQuery(eventQuery(slug));
  const origin = useOrigin();
  if (!data) return null;
  const e = data.event;
  const types = data.types;
  const accent = ACCENT[e.category] ?? ACCENT.other!;
  const eventUrl = `${origin}/market/tickets/e/${e.slug}`;
  const venueQuery = [e.venue, e.city].filter(Boolean).join(", ");
  const prices = types.map((t) => Number(t.price));
  const from = prices.length ? Math.min(...prices) : 0;
  const allFree = prices.every((p) => p === 0);
  const soldOut = types.length > 0 && types.every((t) => Number(t.sold) >= Number(t.quantity));
  const shown = types.length > 4 ? types.slice(0, 3) : types;
  const multiDay = e.ends_at && String(e.ends_at).slice(0, 10) !== String(e.starts_at).slice(0, 10);
  // Checked in the browser only (origin is set after mount), so the server render matches.
  const over = Boolean(origin) && new Date(`${String(e.ends_at ?? e.starts_at).replace(" ", "T")}Z`).getTime() < Date.now();
  const notice = e.status === "cancelled" ? "This event was cancelled." : over ? "This event has already taken place." : null;

  return (
    <FlyerPage
      back={
        <Link to="/market/tickets/e/$slug" params={{ slug }} className={backLinkClass}>
          <ArrowLeft className="size-4" /> Event page
        </Link>
      }
      share={origin ? { title: e.title, text: `${e.title} — ${formatEventRange(e.starts_at, e.ends_at)} at ${e.venue}. Get your tickets:`, url: `${eventUrl}/flyer` } : null}
      notice={notice}
    >
      <FlyerSheet>
        {/* ---- Hero: the cover photo under a navy wash ---- */}
        <header className="relative flex h-[41%] flex-none flex-col overflow-hidden bg-primary px-[6cqw] pt-[4cqw] pb-[5cqw] text-white">
          {e.cover_url && <img src={imageSrc(e.cover_url)} alt="" className="absolute inset-0 size-full object-cover" />}
          <div className="absolute inset-0 bg-linear-to-b from-primary/55 via-primary/70 to-primary" aria-hidden="true" />
          <HeroDecor glow={`${accent}66`} />
          {/* A light beam from the accent corner, like a stage light. */}
          <div
            className="pointer-events-none absolute top-0 right-[18%] h-full w-[30cqw] origin-top -rotate-[20deg] opacity-40 blur-[1cqw]"
            style={{ background: `linear-gradient(to bottom, ${accent}, transparent 75%)` }}
            aria-hidden="true"
          />

          <div className="relative flex items-center justify-between gap-[2cqw]">
            <div className="flex min-w-0 items-center gap-[2cqw]">
              <BrandMark src={e.organizer_logo && imageSrc(e.organizer_logo)} icon={Ticket} />
              <div className="min-w-0">
                <p className="text-[1.6cqw] font-semibold tracking-[0.3em] text-white/60 uppercase">Presented by</p>
                <p className="truncate text-[3cqw] leading-tight font-black">{e.organizer ?? "Capevars"}</p>
              </div>
            </div>
            <span className="flex-none rounded-full px-[2.4cqw] py-[1cqw] text-[1.7cqw] font-black tracking-[0.2em] text-primary uppercase" style={{ background: accent }}>
              {label(EVENT_CATEGORIES, e.category)}
            </span>
          </div>

          <div className="relative mt-auto">
            <p className="text-[2.4cqw] font-black tracking-[0.35em] uppercase" style={{ color: accent }}>
              {e.city ? `Live in ${e.city}` : "Live event"}
            </p>
            <h1 className={cn("mt-[1cqw] leading-[0.98] font-black tracking-tight uppercase wrap-anywhere", titleSize(e.title))}>{e.title}</h1>
            {e.summary && <p className="mt-[1.2cqw] line-clamp-2 pr-[30cqw] text-[2.2cqw] leading-snug text-white/80">{e.summary}</p>}
          </div>

          {e.status === "cancelled" && (
            <span className="absolute top-1/2 left-1/2 -translate-1/2 -rotate-12 rounded-[1cqw] border-[0.8cqw] border-red-500 px-[3cqw] py-[1cqw] text-[8cqw] font-black tracking-[0.1em] text-red-500 uppercase">
              Cancelled
            </span>
          )}
        </header>

        {/* "Admit one" stub with the starting price, astride the hero's edge. */}
        <div className="absolute top-[41%] right-[5cqw] z-10 -translate-y-1/2 -rotate-6 drop-shadow-[0_1.2cqw_2cqw_rgba(4,29,64,0.35)]">
          <div className="w-[26cqw] bg-brand-gold px-[3cqw] py-[2cqw] text-center text-primary" style={stubMask}>
            <div className="rounded-[0.8cqw] border-[0.35cqw] border-dashed border-primary/40 px-[1cqw] py-[1.2cqw]">
              <p className="text-[1.5cqw] font-black tracking-[0.3em] uppercase">Admit one</p>
              {soldOut ? (
                <p className="mt-[0.4cqw] text-[4.4cqw] leading-none font-black uppercase">Sold out</p>
              ) : allFree ? (
                <p className="mt-[0.4cqw] text-[4.4cqw] leading-none font-black uppercase">Free entry</p>
              ) : (
                <>
                  <p className="mt-[0.6cqw] text-[1.6cqw] font-bold uppercase">Tickets from</p>
                  <p className="text-[4.6cqw] leading-none font-black">{formatMoney(from, { free: "Free" })}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---- Details ---- */}
        <div className="flex flex-1 flex-col justify-between px-[6cqw] pt-[4cqw] pb-[3cqw]">
          <div className="flex items-center gap-[4cqw] pr-[26cqw]">
            <DateTile value={e.starts_at} />
            <div className="min-w-0">
              <p className="flex items-center gap-[1cqw] text-[1.7cqw] font-bold tracking-[0.2em] text-primary/50 uppercase">
                {multiDay ? <CalendarDays className="size-[2cqw]" /> : <Clock className="size-[2cqw]" />} {multiDay ? "Runs" : "Starts"}
              </p>
              <p className={cn("leading-tight font-black", multiDay ? "text-[3.6cqw]" : "text-[5.6cqw]")}>
                {multiDay ? formatEventRange(e.starts_at, e.ends_at) : formatTime(e.starts_at)}
              </p>
              <p className="mt-[0.6cqw] text-[2cqw] text-primary/75">
                {!multiDay && e.ends_at ? (
                  <>
                    Till <strong className="text-primary">{formatTime(e.ends_at)}</strong> ·{" "}
                  </>
                ) : null}
                {formatLongDate(e.starts_at).split(", ")[0]}
              </p>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-[2.4cqw] rounded-[2.4cqw] border-l-[1cqw] bg-white px-[3cqw] py-[1.8cqw] shadow-[0_0.6cqw_2cqw_rgba(4,29,64,0.08)]" style={{ borderColor: accent }}>
            <span className="grid size-[6.4cqw] flex-none place-items-center rounded-full bg-primary text-brand-gold">
              <MapPin className="size-[3.4cqw]" />
            </span>
            <div className="min-w-0">
              <p className="text-[1.7cqw] font-bold tracking-[0.2em] text-primary/50 uppercase">Venue</p>
              <p className="text-[3.4cqw] leading-tight font-black wrap-anywhere">{e.venue}</p>
              {e.city && <p className="mt-[0.4cqw] text-[1.8cqw] text-primary/60">{e.city}</p>}
            </div>
          </div>

          {/* Ticket tiers as tear-off stubs */}
          {shown.length > 0 && (
            <ul className={cn("grid gap-[1.6cqw]", shown.length + (types.length > 4 ? 1 : 0) >= 4 ? "grid-cols-4" : shown.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
              {shown.map((t) => {
                const gone = Number(t.sold) >= Number(t.quantity);
                return (
                  <li key={t.id} className={cn(CARD, "relative overflow-hidden border-l-[0.5cqw] border-dashed border-primary/25 py-[1.4cqw] pr-[1.6cqw] pl-[2cqw]")}>
                    <span className="absolute inset-y-0 left-0 w-[0.8cqw]" style={{ background: accent }} aria-hidden="true" />
                    <p className="truncate text-[1.7cqw] font-bold tracking-[0.15em] text-primary/60 uppercase">{t.name}</p>
                    <p className={cn("text-[3.4cqw] leading-tight font-black", gone && "text-primary/35 line-through")}>{formatMoney(t.price, { free: "Free" })}</p>
                    {gone && <span className="absolute top-[1cqw] right-[1cqw] rotate-12 text-[1.5cqw] font-black tracking-wider text-red-500 uppercase">Sold out</span>}
                  </li>
                );
              })}
              {types.length > 4 && (
                <li className={cn(CARD, "grid place-items-center py-[1.4cqw] text-[2cqw] font-bold text-primary/60")}>+{types.length - 3} more</li>
              )}
            </ul>
          )}

          <FlyerQrRow
            ready={Boolean(origin)}
            items={[
              { title: "Get your tickets", text: "Scan to buy online — your e-ticket comes with a QR code", value: eventUrl, icon: Ticket },
              { title: "Find the venue", text: "Scan for directions on Google Maps", value: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueQuery)}`, icon: MapPin },
            ]}
          />
        </div>

        <FlyerFooter phone={e.organizer_phone} fallback="Limited tickets — get yours early" cta="Tickets on" origin={origin} />
      </FlyerSheet>
    </FlyerPage>
  );
}
