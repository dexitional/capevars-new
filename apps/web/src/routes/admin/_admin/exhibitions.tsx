import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";

export const Route = createFileRoute("/admin/_admin/exhibitions")({ component: Exhibitions });

function Exhibitions() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Exhibitions" description="Fairs and expos organised by approved sellers." />
      <ModerationTable
        entity="exhibitions"
        defaultStatus="pending"
        columns={[
          { label: "Exhibition", render: (r) => <TitleCell title={r.title} sub={`${r.venue} · ${r.organizer ?? "Capevars"}`} image={r.cover_url} /> },
          { label: "Starts", render: (r) => <DateCell value={r.starts_at} time /> },
          { label: "Booths", render: (r) => <span className="text-xs">{r.booths_taken}/{r.booths_total} · <MoneyCell value={r.booth_price} free /></span> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
      />
    </div>
  );
}
