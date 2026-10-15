import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { api } from "#/lib/api-client";
import { canManage } from "#/lib/permissions";
import { AdminPageHeader, Segmented, errorToast } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { EVENT_CATEGORIES } from "#/lib/labels";
import { EventEditor, RentalEditor, TripEditor } from "#/components/seller/forms";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/admin/_admin/tickets")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "events", "pending"),
  component: Tickets,
});

type Row = Record<string, any>;
type Tab = "events" | "trips" | "rentals";
type Editing = { kind: "events"; event: Row; types: Array<Row> } | { kind: "trips"; trip: Row } | { kind: "rentals"; rental: Row };

function Tickets() {
  const { admin } = Route.useRouteContext();
  const editable = canManage(admin.role, "tickets");
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("events");
  const [editing, setEditing] = useState<Editing | null>(null);
  // Load the full record (an event with its ticket types) before opening its editor.
  const open = useMutation({
    mutationFn: async ({ kind, id }: { kind: Tab; id: number }): Promise<Editing> => {
      if (kind === "events") {
        const d = await api.get<{ event: Row; types: Array<Row> }>(`/admin/tickets/events/${id}`);
        return { kind, event: d.event, types: d.types };
      }
      if (kind === "trips") return { kind, trip: (await api.get<{ trip: Row }>(`/admin/tickets/trips/${id}`)).trip };
      return { kind, rental: (await api.get<{ rental: Row }>(`/admin/tickets/rentals/${id}`)).rental };
    },
    onSuccess: setEditing,
    onError: errorToast("Couldn't open that record."),
  });
  const saved = (kind: Tab) => () => void queryClient.invalidateQueries({ queryKey: ["admin-mod", kind] });
  const editButton = (kind: Tab) =>
    editable
      ? (row: Row) => {
          const busy = open.isPending && open.variables.kind === kind && open.variables.id === row.id;
          return (
            <Button size="icon-xs" variant="ghost" onClick={() => open.mutate({ kind, id: row.id as number })} disabled={busy} aria-label="Edit" title="Edit">
              {busy ? <Loader2 className="animate-spin" /> : <Pencil />}
            </Button>
          );
        }
      : undefined;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="E-tickets" description="Review and edit events before tickets go on sale, and manage bus trips and rentals." />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "events", label: "Events" },
          { value: "trips", label: "Bus trips" },
          { value: "rentals", label: "Bus rentals" },
        ]}
      />
      {tab === "events" && (
        <ModerationTable
          key="events"
          entity="events"
          defaultStatus="pending"
          extra={editButton("events")}
          columns={[
            { label: "Event", render: (r) => <TitleCell title={r.title} sub={`${EVENT_CATEGORIES[r.category]} · ${r.venue} · ${r.organizer ?? "Capevars"}`} image={r.cover_url} /> },
            { label: "When", render: (r) => <DateCell value={r.starts_at} time /> },
            { label: "Tickets", render: (r) => <span className="text-xs">from <MoneyCell value={r.from_price} free /> · {r.sold} sold</span> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}
      {tab === "trips" && (
        <ModerationTable
          key="trips"
          entity="trips"
          extra={editButton("trips")}
          columns={[
            { label: "Route", render: (r) => <TitleCell title={r.title} sub={`${r.operator} · ${r.bus_type ?? "Bus"}`} /> },
            { label: "Departs", render: (r) => <DateCell value={r.departs_at} time /> },
            { label: "Seats", render: (r) => <span className="text-xs">{r.seats_booked}/{r.seats_total}</span> },
            { label: "Fare", render: (r) => <MoneyCell value={r.price} /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}
      {tab === "rentals" && (
        <ModerationTable
          key="rentals"
          entity="rentals"
          extra={editButton("rentals")}
          columns={[
            { label: "Vehicle", render: (r) => <TitleCell title={r.title} sub={`${r.operator} · ${r.capacity} seats`} image={r.image} /> },
            { label: "Per day", render: (r) => <MoneyCell value={r.price_per_day} /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}

      {editing?.kind === "events" && (
        <EventEditor
          key={`e${editing.event.id}`}
          event={editing.event}
          types={editing.types}
          open
          endpoint="/admin/tickets/events"
          onClose={() => setEditing(null)}
          onSaved={saved("events")}
        />
      )}
      {editing?.kind === "trips" && (
        <TripEditor key={`t${editing.trip.id}`} trip={editing.trip} open endpoint="/admin/tickets/trips" onClose={() => setEditing(null)} onSaved={saved("trips")} />
      )}
      {editing?.kind === "rentals" && (
        <RentalEditor
          key={`r${editing.rental.id}`}
          rental={editing.rental}
          open
          endpoint="/admin/tickets/rentals"
          moderator
          onClose={() => setEditing(null)}
          onSaved={saved("rentals")}
        />
      )}
    </div>
  );
}
