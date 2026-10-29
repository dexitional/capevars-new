// Building blocks for the printable A4 flyers (bus trips, events, bus
// rentals): the toolbar above the sheet, the sheet itself, hero decoration,
// the date tile, QR cards and the footer. Everything on the sheet is sized in
// container units (cqw), so it scales with the sheet's width and prints
// exactly as it shows (styles.css, "Printing" and .print-flyer).
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Link2, Phone, Printer, Share2 } from "lucide-react";
import { asset } from "#/lib/asset";
import { cn } from "#/lib/utils";
import { formatLongDate } from "#/lib/format";
import { QrCode } from "#/components/market/trip-pin";
import { Button } from "#/components/ui/button";

export const NAVY = "#041d40";
export const CARD = "rounded-[2.4cqw] bg-white shadow-[0_0.6cqw_2cqw_rgba(4,29,64,0.08)] ring-1 ring-primary/10";

// The site's origin, for absolute QR links; empty during the server render.
export function useOrigin() {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return origin;
}

export function copyLink(url: string) {
  navigator.clipboard.writeText(url).then(
    () => toast.success("Link copied"),
    () => toast.error(`Couldn't copy. The link is ${url}`),
  );
}

// The phone's share sheet where there is one, otherwise the link is copied.
export async function shareLink(payload: { title: string; text: string; url: string }) {
  if ("share" in navigator) await navigator.share(payload).catch(() => undefined);
  else copyLink(payload.url);
}

// The page around a flyer: a toolbar (back link, copy, share, print) and an
// optional notice, then the sheet.
export function FlyerPage({
  back,
  share,
  notice,
  children,
}: {
  back: React.ReactNode;
  share: { title: string; text: string; url: string } | null;
  notice?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-100 px-4 py-6 sm:py-10">
      <div className="mx-auto mb-5 flex max-w-198.5 flex-wrap items-center justify-between gap-3 print:hidden">
        {back}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => share && copyLink(share.url)} disabled={!share}>
            <Link2 /> Copy link
          </Button>
          <Button variant="outline" size="sm" onClick={() => share && void shareLink(share)} disabled={!share}>
            <Share2 /> Share
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer /> Print / save as PDF
          </Button>
        </div>
        {notice && <p className="w-full rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}
      </div>
      {children}
    </div>
  );
}

export const backLinkClass = "inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary";

// The A4 sheet. print-root: when printing, only this prints.
export function FlyerSheet({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <article className={cn("print-root print-flyer @container relative mx-auto flex aspect-210/297 w-full max-w-198.5 flex-col overflow-hidden rounded-xl bg-[#fbf8f1] text-primary shadow-2xl", className)}>
      {children}
    </article>
  );
}

// A soft glow in the hero's top-right corner, two rings and a dotted grid.
export function HeroDecor({ glow = "rgba(245,184,20,0.35)" }: { glow?: string }) {
  return (
    <>
      <div
        className="pointer-events-none absolute top-[-20cqw] right-[-16cqw] size-[62cqw] rounded-full"
        style={{ background: `radial-gradient(circle, ${glow}, transparent 65%)` }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute top-[6cqw] right-[-10cqw] size-[46cqw] rounded-full border border-white/10" aria-hidden="true" />
      <div className="pointer-events-none absolute top-[14cqw] right-[-2cqw] size-[30cqw] rounded-full border border-white/10" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[3cqw_3cqw]" aria-hidden="true" />
    </>
  );
}

// "FRI / 30 / October 2026"
export function DateTile({ value }: { value: string }) {
  const [weekday = "", dayMonth = ""] = formatLongDate(value).split(", ");
  const [day, ...monthYear] = dayMonth.split(" ");
  return (
    <div className={cn(CARD, "flex w-[16cqw] flex-none flex-col items-center justify-center py-[1.4cqw]")}>
      <p className="text-[1.7cqw] font-bold tracking-[0.2em] text-brand-amber uppercase">{weekday.slice(0, 3)}</p>
      <p className="text-[7cqw] leading-none font-black">{day}</p>
      <p className="text-[1.8cqw] font-semibold text-primary/70">{monthYear.join(" ")}</p>
    </div>
  );
}

export interface FlyerQr {
  title: string;
  text: string;
  value: string;
  icon: LucideIcon;
}

// Two QR cards side by side. The codes render once the origin is known.
export function FlyerQrRow({ items, ready }: { items: Array<FlyerQr>; ready: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-[3cqw]">
      {items.map((q) => (
        <div key={q.title} className={cn(CARD, "flex items-center gap-[2.4cqw] p-[2cqw]")}>
          <div className="flex-none rounded-[1.4cqw] border-[0.5cqw] border-brand-gold p-[1cqw]">
            {ready ? <QrCode value={q.value} label={`QR code: ${q.title}`} dark={NAVY} className="size-[14cqw]" /> : <div className="size-[14cqw]" />}
          </div>
          <div className="min-w-0">
            <q.icon className="size-[3cqw] text-brand-amber" />
            <p className="mt-[0.6cqw] text-[2.8cqw] leading-tight font-black">{q.title}</p>
            <p className="mt-[0.4cqw] text-[1.8cqw] leading-snug text-primary/65">{q.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Navy footer: the organiser's phone (or a fallback line) and the site.
export function FlyerFooter({ phone, fallback, cta, origin }: { phone?: string | null; fallback: string; cta: string; origin: string }) {
  return (
    <footer className="flex flex-none items-center justify-between gap-[2cqw] bg-primary px-[6cqw] py-[2.4cqw] text-white">
      <p className="flex min-w-0 items-center gap-[1.2cqw] text-[2cqw] font-semibold">
        {phone ? (
          <>
            <Phone className="size-[2.2cqw] flex-none text-brand-gold" /> Enquiries: <span className="font-black">{phone}</span>
          </>
        ) : (
          fallback
        )}
      </p>
      <div className="flex flex-none items-center gap-[1.2cqw]">
        <span className="text-right text-[1.6cqw] leading-tight text-white/70">
          {cta}
          <br />
          <span className="font-bold text-white">{origin.replace(/^https?:\/\//, "") || "Capevars"}</span>
        </span>
        <img src={asset("logo-mark-light.png")} alt="Capevars" className="h-[5cqw] w-auto" />
      </div>
    </footer>
  );
}

// An organiser's logo, or an icon tile when there isn't one.
export function BrandMark({ src, icon: Icon }: { src: string | null | undefined; icon: LucideIcon }) {
  return src ? (
    <img src={src} alt="" className="size-[8cqw] flex-none rounded-[1.6cqw] bg-white object-cover p-[0.6cqw]" />
  ) : (
    <span className="grid size-[8cqw] flex-none place-items-center rounded-[1.6cqw] bg-brand-gold text-primary">
      <Icon className="size-[4.5cqw]" />
    </span>
  );
}
