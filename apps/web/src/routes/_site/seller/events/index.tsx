import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Plus } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EmptyState, Img, Loading, StatusBadge } from "#/components/site/kit";
import { EventEditor } from "#/components/seller/forms";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/seller/events/")({ component: SellerEvents });

function SellerEvents() {
  const { data, refetch } = useQuery({ queryKey: ["seller", "events"], queryFn: () => api.get<{ items: Array<Row> }>("/seller/events") });
  const [creating, setCreating] = useState(false);
  if (!data) return <Loading />;
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-black text-primary">Events & tickets</h1>
        <Button onClick={() => setCreating(true)}>
          <Plus /> New event
        </Button>
      </div>
      {data.items.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events yet" text="Create an event, add ticket types, and sell e-tickets with check-in codes." />
      ) : (
        <div className="space-y-3">
          {data.items.map((e) => (
            <Link key={e.id} to="/seller/events/$id" params={{ id: String(e.id) }} className="card-hover flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4">
              <Img src={e.cover_url} className="h-16 w-28 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-primary">{e.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(e.starts_at)} · {e.venue}
                </p>
                {e.status_reason && e.status === "rejected" && <p className="mt-1 text-xs text-destructive">{e.status_reason}</p>}
              </div>
              <div className="text-right text-sm">
                <p className="font-bold">
                  {e.sold}/{e.capacity} sold
                </p>
                <p className="text-xs text-muted-foreground">{formatMoney(e.revenue)}</p>
              </div>
              <StatusBadge status={e.status} label={e.status === "pending" ? "in review" : undefined} />
            </Link>
          ))}
        </div>
      )}
      {creating && <EventEditor event={null} types={[]} open onClose={() => setCreating(false)} onSaved={() => void refetch()} />}
    </div>
  );
}
