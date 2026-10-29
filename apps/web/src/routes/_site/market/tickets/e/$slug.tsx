import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2, Clock, Loader2, MapPin, Minus, Plus, QrCode, Share2, Ticket } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { formatDate, formatEventRange, formatLongDate, formatTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EVENT_CATEGORIES, label } from "#/lib/labels";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Container, FavouriteButton, Img, TextBlock, Verified } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Field } from "#/components/admin/ui";

type Row = Record<string, any>;
const eventQuery = (slug: string) => ({ queryKey: ["event", slug], queryFn: () => api.get<{ event: Row; types: Array<Row>; onlinePayments: boolean }>(`/tickets/events/${slug}`) });

export const Route = createFileRoute("/_site/market/tickets/e/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(eventQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.event.title} | Capevars E-Tickets` }, { property: "og:image", content: loaderData.event.cover_url ?? "" }] : [],
  }),
  component: EventPage,
});

function EventPage() {
  const { slug } = Route.useParams();
  const { data, refetch } = useQuery(eventQuery(slug));
  const member = useMember();
  const requireMember = useRequireMember();
  const [qty, setQty] = useState<Record<number, number>>({});
  const [holderName, setHolderName] = useState(member?.fullName ?? "");
  const [holderPhone, setHolderPhone] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const buy = useMutation({
    mutationFn: () =>
      api.post<{ authorizationUrl: string | null; status: string; total: number }>(`/tickets/events/${data!.event.id}/buy`, {
        items: Object.entries(qty)
          .filter(([, n]) => n > 0)
          .map(([typeId, quantity]) => ({ typeId: Number(typeId), quantity })),
        holderName,
        holderPhone,
      }),
    onSuccess: (r) => {
      if (r.authorizationUrl) window.location.href = r.authorizationUrl;
      else {
        setDone(r.status);
        setQty({});
        void refetch();
      }
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return null;
  const e = data.event;
  const total = data.types.reduce((n, t) => n + Number(t.price) * (qty[t.id] ?? 0), 0);
  const count = Object.values(qty).reduce((n, q) => n + q, 0);
  const past = new Date(`${(e.ends_at ?? e.starts_at).replace(" ", "T")}Z`).getTime() < Date.now();
  const onSale = e.status === "published" && !past;

  return (
    <div className="pb-16">
      <div className="relative bg-primary">
        <Img src={e.cover_url} className="aspect-[3/1] max-h-[420px] w-full opacity-70" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-8 text-white">
          <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-primary">{label(EVENT_CATEGORIES, e.category)}</span>
          <h1 className="mt-3 max-w-3xl text-3xl font-black sm:text-5xl">{e.title}</h1>
          {e.summary && <p className="mt-2 max-w-2xl text-white/80">{e.summary}</p>}
        </Container>
      </div>
      <Container className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {e.status === "cancelled" && <p className="rounded-2xl bg-destructive/10 p-4 font-semibold text-destructive">This event has been cancelled.</p>}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border bg-white p-4">
              <CalendarDays className="size-5 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Date</p>
              <p className="font-semibold">{formatLongDate(e.starts_at)}</p>
            </div>
            <div className="rounded-2xl border bg-white p-4">
              <Clock className="size-5 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Time</p>
              <p className="font-semibold">
                {formatTime(e.starts_at)}
                {e.ends_at ? ` – ${formatEventRange(e.starts_at, e.ends_at).includes("–") ? formatDate(e.ends_at) : formatTime(e.ends_at)}` : ""}
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-4">
              <MapPin className="size-5 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Venue</p>
              <p className="font-semibold">
                {e.venue}
                {e.city ? `, ${e.city}` : ""}
              </p>
            </div>
          </div>
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-black text-primary">About this event</h2>
            <TextBlock text={e.description || e.summary || "Details coming soon."} className="mt-3 text-sm leading-relaxed" />
          </section>
          {e.organizer && (
            <section className="flex items-center gap-4 rounded-2xl border bg-white p-5">
              <Img src={e.organizer_logo} className="size-14 rounded-xl" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Organised by</p>
                <Link to="/market/store/$slug" params={{ slug: e.organizer_slug }} className="flex items-center gap-1 font-bold text-primary hover:underline">
                  {e.organizer} {e.organizer_verified ? <Verified /> : null}
                </Link>
              </div>
              {e.organizer_phone && (
                <a href={`tel:${e.organizer_phone}`} className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted">
                  Contact
                </a>
              )}
            </section>
          )}
        </div>

        <aside className="h-fit rounded-2xl border bg-white p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-black text-primary">
              <Ticket className="size-5" /> Tickets
            </h2>
            <div className="flex gap-2">
              <FavouriteButton type="event" id={e.id} className="border" />
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full border"
                aria-label="Share"
                onClick={() => {
                  void navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copied");
                }}
              >
                <Share2 className="size-4" />
              </button>
              <Link
                to="/market/tickets/e/$slug/flyer"
                params={{ slug }}
                className="flex size-9 items-center justify-center rounded-full border"
                aria-label="Printable flyer"
                title="Printable flyer"
              >
                <QrCode className="size-4" />
              </Link>
            </div>
          </div>
          {done ? (
            <div className="mt-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-success" />
              <p className="mt-3 font-bold text-primary">{done === "paid" ? "You're in!" : "Tickets reserved"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{done === "paid" ? "Your tickets are ready." : "Pay the organiser to confirm your tickets."}</p>
              <Button asChild className="mt-4">
                <Link to="/account/tickets">View my tickets</Link>
              </Button>
            </div>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {data.types.map((t) => {
                  const left = t.quantity - t.sold;
                  const n = qty[t.id] ?? 0;
                  return (
                    <li key={t.id} className="rounded-xl border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{t.name}</p>
                          {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                          <p className="mt-1 font-bold text-primary">{formatMoney(t.price, { free: "Free" })}</p>
                          <p className="text-xs text-muted-foreground">{left > 0 ? `${left} left` : "Sold out"}</p>
                        </div>
                        {onSale && left > 0 && (
                          <div className="flex items-center rounded-lg border">
                            <button type="button" onClick={() => setQty({ ...qty, [t.id]: Math.max(0, n - 1) })} className="p-2" aria-label="Fewer">
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{n}</span>
                            <button type="button" onClick={() => setQty({ ...qty, [t.id]: Math.min(left, t.max_per_order, n + 1) })} className="p-2" aria-label="More">
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {onSale ? (
                count > 0 && (
                  <form
                    className="mt-4 space-y-3 border-t pt-4"
                    onSubmit={(ev) => {
                      ev.preventDefault();
                      requireMember(() => buy.mutate());
                    }}
                  >
                    <Field label="Name on ticket">
                      <Input value={holderName} onChange={(ev) => setHolderName(ev.target.value)} required />
                    </Field>
                    <Field label="Phone">
                      <Input type="tel" value={holderPhone} onChange={(ev) => setHolderPhone(ev.target.value)} required />
                    </Field>
                    <div className="flex items-center justify-between text-sm">
                      <span>{count} ticket(s)</span>
                      <strong className="text-lg text-primary">{formatMoney(total, { free: "Free" })}</strong>
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-xl" disabled={buy.isPending}>
                      {buy.isPending && <Loader2 className="animate-spin" />}
                      {total === 0 ? "Get free tickets" : data.onlinePayments ? "Pay & get tickets" : "Reserve tickets"}
                    </Button>
                    {total > 0 && !data.onlinePayments && <p className="text-xs text-muted-foreground">You'll pay the organiser directly; they confirm your tickets.</p>}
                  </form>
                )
              ) : (
                <p className="mt-4 rounded-xl bg-muted p-3 text-center text-sm text-muted-foreground">{e.status === "cancelled" ? "Cancelled" : "Sales have ended"}</p>
              )}
            </>
          )}
        </aside>
      </Container>
    </div>
  );
}
