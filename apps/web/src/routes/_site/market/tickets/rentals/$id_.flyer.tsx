import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, ClipboardList, MapPin, MessageCircle, Store, Truck } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { imageSrc } from "#/lib/asset";
import { formatMoney } from "#/lib/money";
import { cn } from "#/lib/utils";
import { BrandMark, CARD, FlyerFooter, FlyerPage, FlyerQrRow, FlyerSheet, HeroDecor, backLinkClass, useOrigin } from "#/components/market/flyer-kit";

type Row = Record<string, any>;
const rentalQuery = (id: string) => ({ queryKey: ["rental", id], queryFn: () => api.get<{ rental: Row }>(`/tickets/rentals/${id}`) });

// A printable A4 "for hire" flyer for a bus rental, public so operators can
// share it: the vehicle photo, seats, daily rate, features, the trips it
// suits, and QR codes for requesting a quote and for messaging the operator.
export const Route = createFileRoute("/_site/market/tickets/rentals/$id_/flyer")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(rentalQuery(params.id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => {
    const r = loaderData?.rental;
    if (!r) return { meta: [] };
    const title = `${r.title} for hire | Capevars`;
    const description = `Hire ${r.operator}'s ${r.capacity}-seat ${r.vehicle_type} from ${formatMoney(r.price_per_day)} a day. Request a quote online.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: (r.images as Array<string> | null)?.[0] ?? "" },
      ],
    };
  },
  component: RentalFlyer,
});

const USES = ["Excursions & tours", "Weddings", "Church & funerals", "School trips", "Corporate events"];

// "0244 123 456" → "233244123456" for a wa.me link; null if it isn't a phone number.
function whatsappNumber(phone: string | null | undefined) {
  const d = (phone ?? "").replace(/\D/g, "");
  if (d.length === 10 && d.startsWith("0")) return `233${d.slice(1)}`;
  return d.length >= 10 && d.length <= 15 ? d : null;
}

function RentalFlyer() {
  const { id } = Route.useParams();
  const { data } = useQuery(rentalQuery(id));
  const origin = useOrigin();
  if (!data) return null;
  const r = data.rental;
  const photo = (r.images as Array<string> | null)?.[0];
  const features = (Array.isArray(r.features) ? r.features : []) as Array<string>;
  const rentalUrl = `${origin}/market/tickets/rentals/${r.id}`;
  const wa = whatsappNumber(r.operator_phone);
  const contact = wa
    ? { title: "Chat on WhatsApp", text: `Scan to message ${r.operator} about dates and routes`, value: `https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I'd like a quote for your ${r.title}.`)}`, icon: MessageCircle }
    : { title: "See our fleet", text: `Scan for ${r.operator}'s other vehicles`, value: `${origin}/market/store/${r.operator_slug}`, icon: Store };

  return (
    <FlyerPage
      back={
        <Link to="/market/tickets/rentals/$id" params={{ id }} className={backLinkClass}>
          <ArrowLeft className="size-4" /> Rental page
        </Link>
      }
      share={origin ? { title: `${r.title} for hire`, text: `Hire ${r.operator}'s ${r.capacity}-seat ${r.vehicle_type} — request a quote:`, url: `${rentalUrl}/flyer` } : null}
    >
      <FlyerSheet>
        {/* ---- Hero: "for hire" beside the vehicle photo, cut on a diagonal ---- */}
        <header className="relative flex h-[42%] flex-none flex-col overflow-hidden bg-primary px-[6cqw] pt-[4cqw] pb-[4.5cqw] text-white">
          <HeroDecor />
          {photo && (
            <>
              <div className="absolute inset-y-0 right-0 w-[64%] bg-brand-gold [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)]" aria-hidden="true" />
              <img
                src={imageSrc(photo)}
                alt=""
                className="absolute inset-y-0 right-0 h-full w-[61%] object-cover [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]"
              />
              <div className="absolute inset-y-0 right-0 w-[61%] bg-linear-to-r from-primary/40 to-transparent [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]" aria-hidden="true" />
            </>
          )}

          <div className="relative flex min-w-0 items-center gap-[2cqw]">
            <BrandMark src={r.operator_logo && imageSrc(r.operator_logo)} icon={Truck} />
            <div className="min-w-0">
              <p className="text-[1.6cqw] font-semibold tracking-[0.3em] text-white/60 uppercase">Hire from</p>
              <p className="truncate text-[3cqw] leading-tight font-black">{r.operator}</p>
            </div>
          </div>

          <div className="relative mt-auto w-[40%]">
            <p className="text-[2.4cqw] font-black tracking-[0.35em] text-brand-gold uppercase">Vehicle hire</p>
            <h1 className="mt-[0.6cqw] text-[10.5cqw] leading-[0.85] font-black tracking-tight uppercase">
              For
              <br />
              <span className="text-brand-gold">hire</span>
            </h1>
            <p className="mt-[1.6cqw] line-clamp-2 text-[2.8cqw] leading-tight font-black wrap-anywhere">{r.title}</p>
            <span className="mt-[1.4cqw] inline-block rounded-full border border-white/30 px-[2cqw] py-[0.6cqw] text-[1.8cqw] font-bold tracking-[0.15em] uppercase">
              {r.vehicle_type}
            </span>
          </div>
        </header>

        {/* Seats badge, astride the hero's edge. */}
        <div className="absolute top-[42%] right-[6cqw] z-10 grid size-[21cqw] -translate-y-1/2 place-items-center rounded-full bg-brand-gold text-center text-primary shadow-[0_1.5cqw_4cqw_rgba(4,29,64,0.35)] ring-[1.2cqw] ring-[#fbf8f1]">
          <div>
            <p className="text-[1.6cqw] font-bold tracking-[0.2em] uppercase">Up to</p>
            <p className="text-[7cqw] leading-none font-black">{r.capacity}</p>
            <p className="mt-[0.4cqw] text-[1.6cqw] font-bold tracking-[0.15em] uppercase">seats</p>
          </div>
        </div>

        {/* ---- Details ---- */}
        <div className="flex flex-1 flex-col justify-between px-[6cqw] pt-[3.5cqw] pb-[3cqw]">
          <div className="pr-[24cqw]">
            <p className="text-[1.7cqw] font-bold tracking-[0.2em] text-primary/50 uppercase">Daily rate from</p>
            <p className="text-[6.2cqw] leading-none font-black">
              {formatMoney(r.price_per_day)} <span className="text-[2.6cqw] font-bold text-primary/60">/ day</span>
            </p>
            <p className="mt-[1cqw] flex flex-wrap items-center gap-x-[2cqw] text-[2cqw] text-primary/70">
              <span>Final price quoted for your trip</span>
              {r.operator_location && (
                <span className="flex items-center gap-[0.6cqw]">
                  <MapPin className="size-[2cqw] text-brand-amber" /> Based in {r.operator_location}
                </span>
              )}
            </p>
          </div>

          {features.length > 0 && (
            <ul className={cn(CARD, "grid grid-cols-2 gap-x-[3cqw] gap-y-[1.2cqw] px-[3cqw] py-[2cqw]")}>
              {features.slice(0, 6).map((f) => (
                <li key={f} className="flex items-center gap-[1.2cqw] text-[2.2cqw] font-bold">
                  <CheckCircle2 className="size-[2.6cqw] flex-none text-brand-amber" /> <span className="truncate">{f}</span>
                </li>
              ))}
            </ul>
          )}

          <div>
            <p className="text-[1.7cqw] font-bold tracking-[0.2em] text-primary/50 uppercase">Perfect for</p>
            <ul className="mt-[1cqw] flex flex-wrap gap-[1cqw]">
              {USES.map((u) => (
                <li key={u} className="rounded-full bg-primary px-[1.8cqw] py-[0.7cqw] text-[1.7cqw] font-semibold text-white">
                  {u}
                </li>
              ))}
            </ul>
          </div>

          <FlyerQrRow
            ready={Boolean(origin)}
            items={[{ title: "Request a quote", text: "Scan, pick your dates and route — the operator replies with a price", value: rentalUrl, icon: ClipboardList }, contact]}
          />
        </div>

        <FlyerFooter phone={r.operator_phone} fallback="Book early for weekends and holidays" cta="Hire on" origin={origin} />
      </FlyerSheet>
    </FlyerPage>
  );
}
