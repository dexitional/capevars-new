import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Bus, CalendarDays, MapPin, Store, Ticket } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate, formatDateTime, formatTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EmptyState, Img, Loading, SectionHeader, StatusBadge } from "#/components/site/kit";
import { PaymentBanner } from "#/components/site/payment-banner";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/account/tickets")({
  validateSearch: z.object({ payment: z.string().optional().catch(undefined) }),
  component: TicketsPage,
});

type Row = Record<string, any>;

function TicketsPage() {
  const { payment } = Route.useSearch();
  const { data } = useQuery({ queryKey: ["my-tickets"], queryFn: () => api.get<{ tickets: Array<Row>; rentals: Array<Row>; booths: Array<Row> }>("/tickets/mine") });
  const pay = useMutation({
    mutationFn: (id: number) => api.post<{ authorizationUrl: string }>(`/tickets/mine/${id}/pay`),
    onSuccess: (r) => (window.location.href = r.authorizationUrl),
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  const empty = !data.tickets.length && !data.rentals.length && !data.booths.length;
  return (
    <div className="space-y-10">
      <PaymentBanner status={payment} />
      {empty && <EmptyState icon={Ticket} title="No tickets or bookings yet" text="Event tickets, bus seats, rentals and exhibition booths you book appear here." action={<Link to="/market/tickets" className="font-semibold text-primary underline">Browse e-tickets</Link>} />}
      {data.tickets.length > 0 && (
        <section>
          <SectionHeader title="Tickets" text="Show the code at the entrance or when boarding." />
          <div className="grid gap-4 md:grid-cols-2">
            {data.tickets.map((t) => (
              <article key={t.id} className="flex overflow-hidden rounded-2xl border bg-white">
                <div className="flex-1 p-4">
                  <div className="flex items-start gap-3">
                    {t.kind === "event" ? <Img src={t.cover_url} className="size-14 shrink-0 rounded-xl" /> : <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><Bus className="size-6" /></span>}
                    <div className="min-w-0">
                      {t.kind === "event" ? (
                        <Link to="/market/tickets/e/$slug" params={{ slug: t.event_slug }} className="font-bold text-primary hover:underline">
                          {t.event_title}
                        </Link>
                      ) : (
                        <p className="font-bold text-primary">
                          {t.origin} → {t.destination}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">{t.kind === "event" ? t.type_name : `${t.operator} · Seat ${t.seat_no}`}</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CalendarDays className="size-4" /> {formatDate(t.starts_at ?? t.departs_at)} · {formatTime(t.starts_at ?? t.departs_at)}
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="size-4" /> {t.venue ?? t.pickup_point ?? t.origin}
                    </li>
                  </ul>
                  <div className="mt-3 flex items-center gap-2">
                    <StatusBadge status={t.event_status === "cancelled" ? "cancelled" : t.status} label={t.status === "reserved" ? "awaiting payment" : undefined} />
                    <span className="text-sm font-semibold">{formatMoney(t.amount, { free: "Free" })}</span>
                    {t.status === "reserved" && t.payment_provider === "paystack" && (
                      <Button size="xs" onClick={() => pay.mutate(t.id)}>
                        Pay now
                      </Button>
                    )}
                  </div>
                  {t.status === "reserved" && t.payment_provider !== "paystack" && <p className="mt-2 text-xs text-amber-800">Pay the organiser directly; they'll confirm your ticket.</p>}
                </div>
                <div className="flex w-32 shrink-0 flex-col items-center justify-center border-l-2 border-dashed bg-accent p-3 text-center">
                  <Ticket className="size-6 text-primary" />
                  <p className="mt-2 font-mono text-sm font-black tracking-wider text-primary">{t.code}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground uppercase">{t.holder_name}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {data.rentals.length > 0 && (
        <section>
          <SectionHeader title="Bus rental requests" />
          <div className="divide-y rounded-2xl border bg-white">
            {data.rentals.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold text-primary">{r.rental_title}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.operator} · {formatDate(r.start_date)} – {formatDate(r.end_date)} · {r.pickup_location} → {r.destination}
                  </p>
                  {r.seller_note && <p className="mt-1 text-sm">Operator: {r.seller_note}</p>}
                </div>
                <div className="text-right">
                  <StatusBadge status={r.status} />
                  {r.quoted_amount && <p className="mt-1 text-sm font-bold">Quote: {formatMoney(r.quoted_amount)}</p>}
                  {r.operator_phone && <a href={`tel:${r.operator_phone}`} className="text-xs text-info underline">{r.operator_phone}</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.booths.length > 0 && (
        <section>
          <SectionHeader title="Exhibition booths" />
          <div className="divide-y rounded-2xl border bg-white">
            {data.booths.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <Store className="size-5 text-primary" />
                  <div>
                    <Link to="/market/exhibitions/$slug" params={{ slug: b.exhibition_slug }} className="font-semibold text-primary hover:underline">
                      {b.exhibition_title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {b.business_name} · {b.booths} booth(s) · {formatDateTime(b.starts_at)}
                    </p>
                    {b.organizer_note && <p className="mt-1 text-sm">Organiser: {b.organizer_note}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={b.status} />
                  <p className="mt-1 text-sm font-bold">{formatMoney(b.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
