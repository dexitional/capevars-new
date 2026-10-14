import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatLongDate, formatTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Container, Img } from "#/components/site/kit";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";

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

function TripPage() {
  const { id } = Route.useParams();
  const { data, refetch } = useQuery(tripQuery(id));
  const member = useMember();
  const requireMember = useRequireMember();
  const [seats, setSeats] = useState<Array<number>>([]);
  const [holderName, setHolderName] = useState(member?.fullName ?? "");
  const [holderPhone, setHolderPhone] = useState("");
  const [booked, setBooked] = useState(false);
  const book = useMutation({
    mutationFn: () => api.post<{ authorizationUrl: string | null }>(`/tickets/trips/${id}/book`, { seats, holderName, holderPhone }),
    onSuccess: (r) => {
      if (r.authorizationUrl) window.location.href = r.authorizationUrl;
      else {
        setBooked(true);
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
  const toggle = (n: number) => setSeats((s) => (s.includes(n) ? s.filter((x) => x !== n) : s.length >= 10 ? s : [...s, n].sort((a, b) => a - b)));
  // 2 + aisle + 2 layout, driver row on top.
  const rows = Math.ceil(t.seats_total / 4);
  return (
    <Container className="py-8">
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-5">
        <Img src={t.operator_logo} className="size-14 rounded-xl" />
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-2xl font-black text-primary">
            {t.origin} <ArrowRight className="size-5" /> {t.destination}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatLongDate(t.departs_at)} · departs {formatTime(t.departs_at)}
            {t.arrives_at ? ` · arrives ${formatTime(t.arrives_at)}` : ""} · {t.operator}
          </p>
          {t.pickup_point && <p className="text-sm text-muted-foreground">Pickup: {t.pickup_point}</p>}
        </div>
        <p className="text-2xl font-black text-primary">{formatMoney(t.price)}<span className="text-sm font-medium text-muted-foreground"> /seat</span></p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-white p-6">
          <div className="mb-4 flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="size-4 rounded border bg-white" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="size-4 rounded bg-primary" /> Your pick</span>
            <span className="flex items-center gap-1.5"><span className="size-4 rounded bg-slate-300" /> Taken</span>
          </div>
          <div className="mx-auto w-fit rounded-[2rem] border-4 border-slate-200 p-5">
            <div className="mb-4 flex justify-end">
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-muted-foreground">Driver</span>
            </div>
            <div className="space-y-2">
              {Array.from({ length: rows }, (_, r) => (
                <div key={r} className="flex gap-2">
                  {[1, 2, 0, 3, 4].map((pos) => {
                    if (pos === 0) return <div key="aisle" className="w-6" />;
                    const n = r * 4 + pos;
                    if (n > t.seats_total) return <div key={pos} className="size-11" />;
                    const isTaken = taken.has(n);
                    const mine = seats.includes(n);
                    return (
                      <button
                        key={pos}
                        type="button"
                        disabled={isTaken}
                        onClick={() => toggle(n)}
                        className={cn(
                          "size-11 rounded-lg border text-sm font-bold transition",
                          isTaken ? "cursor-not-allowed border-slate-300 bg-slate-300 text-white" : mine ? "border-primary bg-primary text-white" : "bg-white hover:border-primary",
                        )}
                        aria-label={`Seat ${n}${isTaken ? " (taken)" : ""}`}
                        aria-pressed={mine}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="h-fit rounded-2xl border bg-white p-5 lg:sticky lg:top-24">
          {booked ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto size-12 text-success" />
              <p className="mt-3 font-bold text-primary">Seats reserved</p>
              <p className="mt-1 text-sm text-muted-foreground">Pay the operator to confirm. Your ticket codes are in your account.</p>
              <Button asChild className="mt-4">
                <Link to="/account/tickets">View tickets</Link>
              </Button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                requireMember(() => book.mutate());
              }}
            >
              <h2 className="font-black text-primary">Your booking</h2>
              <p className="text-sm">{seats.length ? `Seats ${seats.join(", ")}` : "Select seats on the bus map."}</p>
              <Field label="Passenger name">
                <Input value={holderName} onChange={(e) => setHolderName(e.target.value)} required />
              </Field>
              <Field label="Phone">
                <Input type="tel" value={holderPhone} onChange={(e) => setHolderPhone(e.target.value)} required />
              </Field>
              <div className="flex justify-between border-t pt-3">
                <span>Total</span>
                <strong className="text-lg text-primary">{formatMoney(Number(t.price) * seats.length)}</strong>
              </div>
              <Button type="submit" className="h-11 w-full rounded-xl" disabled={!seats.length || book.isPending}>
                {book.isPending && <Loader2 className="animate-spin" />} {data.onlinePayments ? "Pay & book" : "Reserve seats"}
              </Button>
            </form>
          )}
        </aside>
      </div>
    </Container>
  );
}
