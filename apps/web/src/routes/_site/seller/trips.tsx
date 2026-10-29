import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Bus, ChevronDown, Pencil, Plus, QrCode } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EmptyState, Loading, StatusBadge } from "#/components/site/kit";
import { TripEditor } from "#/components/seller/forms";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/seller/trips")({ component: SellerTrips });

function Passengers({ tripId }: { tripId: number }) {
  const { data, refetch } = useQuery({ queryKey: ["seller", "trip", tripId], queryFn: () => api.get<{ passengers: Array<Row> }>(`/seller/trips/${tripId}`) });
  const markPaid = useMutation({ mutationFn: (id: number) => api.post(`/seller/tickets/${id}/mark-paid`), onSuccess: () => (toast.success("Confirmed"), void refetch()) });
  if (!data) return <Loading className="py-6" />;
  if (!data.passengers.length) return <p className="p-4 text-sm text-muted-foreground">No bookings yet.</p>;
  return (
    <table className="w-full text-sm">
      <tbody className="divide-y">
        {data.passengers.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-2 font-bold">Seat {p.seat_no ?? "—"}</td>
            <td className="px-4 py-2">
              {p.holder_name} <span className="text-xs text-muted-foreground">{p.holder_phone}</span>
            </td>
            <td className="px-4 py-2 font-mono text-xs">{p.code}</td>
            <td className="px-4 py-2">
              <StatusBadge status={p.status} />
            </td>
            <td className="px-4 py-2 text-right">
              {p.status === "reserved" && (
                <Button size="xs" variant="outline" onClick={() => markPaid.mutate(p.id)}>
                  Mark paid
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SellerTrips() {
  const { data, refetch } = useQuery({ queryKey: ["seller", "trips"], queryFn: () => api.get<{ items: Array<Row> }>("/seller/trips") });
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  if (!data) return <Loading />;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-primary">Bus trips</h1>
        <Button onClick={() => setEditing("new")}>
          <Plus /> New trip
        </Button>
      </div>
      {data.items.length === 0 ? (
        <EmptyState icon={Bus} title="No trips yet" text="Schedule trips and let passengers book seats on a seat map." />
      ) : (
        <div className="space-y-3">
          {data.items.map((t) => (
            <div key={t.id} className="overflow-hidden rounded-2xl border bg-white">
              <div className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-bold text-primary">
                    {t.origin} <ArrowRight className="size-4" /> {t.destination}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(t.departs_at)} · {formatMoney(t.price)} · {t.bus_type ?? "Bus"}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {t.seats_booked}/{t.seats_total} seats
                </p>
                <StatusBadge status={t.status} />
                <Button size="icon-sm" variant="ghost" onClick={() => setEditing(t)} aria-label="Edit">
                  <Pencil />
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/market/tickets/bus/$id/flyer" params={{ id: String(t.id) }} target="_blank">
                    <QrCode /> Flyer
                  </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={() => setOpen(open === t.id ? null : t.id)}>
                  Passengers <ChevronDown />
                </Button>
              </div>
              {open === t.id && (
                <div className="border-t">
                  <Passengers tripId={t.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {editing && <TripEditor key={editing === "new" ? "new" : editing.id} trip={editing === "new" ? null : editing} open onClose={() => setEditing(null)} onSaved={() => void refetch()} />}
    </div>
  );
}
