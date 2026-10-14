import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { EVENT_CATEGORIES } from "#/lib/labels";
import { Segmented } from "#/components/admin/ui";

export const Route = createFileRoute("/admin/_admin/tickets")({ component: Tickets });

function Tickets() {
  const [tab, setTab] = useState<"events" | "trips" | "rentals">("events");
  return (
    <div className="space-y-6">
      <AdminPageHeader title="E-tickets" description="Review events before tickets go on sale, and watch bus trips and rentals." />
      <Segmented value={tab} onChange={setTab} options={[{ value: "events", label: "Events" }, { value: "trips", label: "Bus trips" }, { value: "rentals", label: "Bus rentals" }]} />
      {tab === "events" && (
        <ModerationTable
          key="events"
          entity="events"
          defaultStatus="pending"
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
          columns={[
            { label: "Vehicle", render: (r) => <TitleCell title={r.title} sub={`${r.operator} · ${r.capacity} seats`} image={r.image} /> },
            { label: "Per day", render: (r) => <MoneyCell value={r.price_per_day} /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}
    </div>
  );
}
