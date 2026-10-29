import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Pencil, QrCode, XCircle } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { Loading, StatusBadge } from "#/components/site/kit";
import { EventEditor } from "#/components/seller/forms";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/seller/events/$id")({ component: SellerEvent });

function SellerEvent() {
  const { id } = Route.useParams();
  const { data, refetch } = useQuery({ queryKey: ["seller", "event", id], queryFn: () => api.get<{ event: Row; types: Array<Row>; attendees: Array<Row> }>(`/seller/events/${id}`) });
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState("");
  const markPaid = useMutation({
    mutationFn: (ticketId: number) => api.post(`/seller/tickets/${ticketId}/mark-paid`),
    onSuccess: () => {
      toast.success("Ticket confirmed");
      void refetch();
    },
  });
  const cancel = useMutation({
    mutationFn: () => api.post(`/seller/events/${id}/cancel`),
    onSuccess: () => {
      toast.success("Event cancelled; ticket holders were notified");
      void refetch();
    },
  });
  if (!data) return <Loading />;
  const e = data.event;
  const attendees = data.attendees.filter((a) => !q || `${a.holder_name} ${a.code} ${a.holder_phone}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-5">
      <Link to="/seller/events" className="text-sm text-muted-foreground hover:underline">
        ← Events
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">{e.title}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(e.starts_at)} · {e.venue}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={e.status} />
          {e.status === "published" && (
            <Button asChild size="sm" variant="outline">
              <Link to="/market/tickets/e/$slug" params={{ slug: e.slug }}>
                <Eye /> View
              </Link>
            </Button>
          )}
          {e.status === "published" && (
            <Button asChild size="sm" variant="outline">
              <Link to="/market/tickets/e/$slug/flyer" params={{ slug: e.slug }} target="_blank">
                <QrCode /> Flyer
              </Link>
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Pencil /> Edit
          </Button>
          {e.status !== "cancelled" && (
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => confirm("Cancel this event? Ticket holders will be notified.") && cancel.mutate()}>
              <XCircle /> Cancel
            </Button>
          )}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.types.map((t) => (
          <div key={t.id} className="rounded-2xl border bg-white p-4">
            <p className="font-semibold">{t.name}</p>
            <p className="text-sm text-muted-foreground">{formatMoney(t.price, { free: "Free" })}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${(t.sold / Math.max(1, t.quantity)) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.sold}/{t.quantity} sold
            </p>
          </div>
        ))}
      </div>
      <section className="overflow-hidden rounded-2xl border bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <h2 className="mr-auto font-bold text-primary">Attendees ({data.attendees.length})</h2>
          <Input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Search name, code, phone" className="w-60" />
          <Button asChild size="sm" variant="outline">
            <Link to="/seller/checkin">Check-in mode</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Holder</th>
                <th className="px-4 py-2">Ticket</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y">
              {attendees.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 font-mono text-xs font-bold">{a.code}</td>
                  <td className="px-4 py-2">
                    {a.holder_name}
                    <span className="block text-xs text-muted-foreground">{a.holder_phone}</span>
                  </td>
                  <td className="px-4 py-2">{a.type_name}</td>
                  <td className="px-4 py-2">{formatMoney(a.amount, { free: "Free" })}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={a.status} label={a.status === "used" ? `checked in ${a.checked_in_at ? formatDateTime(a.checked_in_at) : ""}` : undefined} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {a.status === "reserved" && (
                      <Button size="xs" variant="outline" onClick={() => markPaid.mutate(a.id)}>
                        Mark paid
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {editing && <EventEditor event={e} types={data.types} open onClose={() => setEditing(false)} onSaved={() => void refetch()} />}
    </div>
  );
}
