import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, QrCode, Users } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatMoney } from "#/lib/money";
import { useRequireMember } from "#/hooks/useMember";
import { Container, Img, TextBlock } from "#/components/site/kit";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const rentalQuery = (id: string) => ({ queryKey: ["rental", id], queryFn: () => api.get<{ rental: Row }>(`/tickets/rentals/${id}`) });

export const Route = createFileRoute("/_site/market/tickets/rentals/$id")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(rentalQuery(params.id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  component: RentalPage,
});

function RentalPage() {
  const { id } = Route.useParams();
  const { data } = useQuery(rentalQuery(id));
  const requireMember = useRequireMember();
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", pickupLocation: "", destination: "", passengers: "", purpose: "", contactPhone: "" });
  const send = useMutation({
    mutationFn: () => api.post(`/tickets/rentals/${id}/request`, { ...form, passengers: Number(form.passengers) }),
    onSuccess: () => setSent(true),
    onError: (e) => toast.error(e.message),
  });
  if (!data) return null;
  const r = data.rental;
  const images: Array<string> = r.images ?? [];
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <Img src={images[active]} className="aspect-video w-full rounded-2xl" priority sizes="(min-width:1024px) 60vw, 100vw" />
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((src, i) => (
                <button key={src} type="button" onClick={() => setActive(i)} className={cn("size-16 overflow-hidden rounded-xl border-2", i === active ? "border-primary" : "border-transparent")}>
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <h1 className="mt-6 text-3xl font-black text-primary">{r.title}</h1>
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" /> {r.capacity} seats · {r.vehicle_type} ·{" "}
            <Link to="/market/store/$slug" params={{ slug: r.operator_slug }} className="hover:underline">
              {r.operator}
            </Link>
          </p>
          {r.features?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {r.features.map((f: string) => (
                <span key={f} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                  {f}
                </span>
              ))}
            </div>
          )}
          <TextBlock text={r.description} className="mt-6 text-sm leading-relaxed" />
        </div>
        <aside className="h-fit rounded-2xl border bg-white p-5 lg:sticky lg:top-24">
          <p className="text-2xl font-black text-primary">
            {formatMoney(r.price_per_day)} <span className="text-sm font-medium text-muted-foreground">/ day</span>
          </p>
          <p className="text-xs text-muted-foreground">Final price is quoted by the operator.</p>
          <Link to="/market/tickets/rentals/$id/flyer" params={{ id: String(r.id) }} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <QrCode className="size-3.5" /> Share or print a flyer
          </Link>
          {sent ? (
            <div className="mt-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-success" />
              <p className="mt-3 font-bold text-primary">Request sent</p>
              <p className="text-sm text-muted-foreground">The operator will reply with a quote. Track it under Tickets & bookings.</p>
            </div>
          ) : (
            <form
              className="mt-4 grid grid-cols-2 gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                requireMember(() => send.mutate());
              }}
            >
              <Field label="From">
                <Input type="date" value={form.startDate} onChange={set("startDate")} required />
              </Field>
              <Field label="To">
                <Input type="date" value={form.endDate} onChange={set("endDate")} required />
              </Field>
              <Field label="Pickup location" className="col-span-2">
                <Input value={form.pickupLocation} onChange={set("pickupLocation")} required />
              </Field>
              <Field label="Destination" className="col-span-2">
                <Input value={form.destination} onChange={set("destination")} required />
              </Field>
              <Field label="Passengers">
                <Input type="number" min={1} max={r.capacity} value={form.passengers} onChange={set("passengers")} required />
              </Field>
              <Field label="Phone">
                <Input type="tel" value={form.contactPhone} onChange={set("contactPhone")} required />
              </Field>
              <Field label="Purpose (optional)" className="col-span-2">
                <Textarea rows={2} value={form.purpose} onChange={set("purpose")} />
              </Field>
              <Button type="submit" className="col-span-2 h-11 rounded-xl" disabled={send.isPending}>
                Request a quote
              </Button>
            </form>
          )}
        </aside>
      </div>
    </Container>
  );
}
