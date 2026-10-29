import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, QrCode, Truck } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EmptyState, Img, Loading, SectionHeader, StatusBadge } from "#/components/site/kit";
import { RentalEditor } from "#/components/seller/forms";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/seller/rentals")({ component: SellerRentals });

function SellerRentals() {
  const { data, refetch } = useQuery({ queryKey: ["seller", "rentals"], queryFn: () => api.get<{ rentals: Array<Row>; requests: Array<Row> }>("/seller/rentals") });
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const respond = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Record<string, unknown> }) => api.patch(`/seller/rental-requests/${id}`, body),
    onSuccess: () => {
      toast.success("Sent to the customer");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  return (
    <div className="space-y-8">
      <section>
        <SectionHeader
          title="Rental requests"
          action={null}
        />
        {data.requests.length === 0 ? (
          <p className="rounded-2xl border bg-white p-5 text-sm text-muted-foreground">No requests yet.</p>
        ) : (
          <div className="space-y-3">
            {data.requests.map((r) => (
              <div key={r.id} className="rounded-2xl border bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-primary">{r.rental_title}</p>
                    <p className="text-sm">
                      {r.requester_name} · {r.contact_phone} · {r.requester_email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(r.start_date)} – {formatDate(r.end_date)} · {r.pickup_location} → {r.destination} · {r.passengers} passengers
                    </p>
                    {r.purpose && <p className="mt-1 text-sm">“{r.purpose}”</p>}
                  </div>
                  <div className="text-right">
                    <StatusBadge status={r.status} />
                    {r.quoted_amount && <p className="mt-1 text-sm font-bold">{formatMoney(r.quoted_amount)}</p>}
                  </div>
                </div>
                {["requested", "quoted"].includes(r.status) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const amount = prompt("Your quote (GH₵)", r.quoted_amount ?? "");
                        if (amount) respond.mutate({ id: r.id, body: { status: "quoted", quotedAmount: Number(amount) } });
                      }}
                    >
                      Send quote
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => respond.mutate({ id: r.id, body: { status: "confirmed" } })}>
                      Confirm booking
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => {
                        const note = prompt("Reason (optional)");
                        if (note !== null) respond.mutate({ id: r.id, body: { status: "declined", sellerNote: note } });
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                )}
                {r.status === "confirmed" && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => respond.mutate({ id: r.id, body: { status: "completed" } })}>
                    Mark completed
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <SectionHeader
          title="Your buses for hire"
          action={
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus /> Add bus
            </Button>
          }
        />
        {data.rentals.length === 0 ? (
          <EmptyState icon={Truck} title="No buses listed" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.rentals.map((r) => (
              <div key={r.id} className="flex gap-3 rounded-2xl border bg-white p-3">
                <Img src={r.images?.[0]} className="size-24 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-primary">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.capacity} seats · {formatMoney(r.price_per_day)}/day
                  </p>
                  <StatusBadge status={r.status} className="mt-2" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Button size="icon-sm" variant="ghost" onClick={() => setEditing(r)} aria-label="Edit" disabled={r.status === "blocked"}>
                    <Pencil />
                  </Button>
                  {r.status === "active" && (
                    <Button asChild size="icon-sm" variant="ghost" aria-label="Printable flyer">
                      <Link to="/market/tickets/rentals/$id/flyer" params={{ id: String(r.id) }} target="_blank">
                        <QrCode />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {editing && <RentalEditor key={editing === "new" ? "new" : editing.id} rental={editing === "new" ? null : editing} open onClose={() => setEditing(null)} onSaved={() => void refetch()} />}
    </div>
  );
}
