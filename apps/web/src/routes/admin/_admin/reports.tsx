import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";

export const Route = createFileRoute("/admin/_admin/reports")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "reports", "open"), component: Reports });

const LINKS: Record<string, (id: number) => string> = {
  post: (id) => `/social/post/${id}`,
};

function Reports() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Reports" description="Content and accounts members have flagged. Act in the relevant queue (hide, block, suspend), then mark the report actioned." />
      <ModerationTable
        entity="reports"
        defaultStatus="open"
        columns={[
          { label: "Reported", render: (r) => <TitleCell title={<span className="capitalize">{r.title}</span>} sub={LINKS[r.entity_type] ? <a href={LINKS[r.entity_type]!(r.entity_id)} target="_blank" rel="noopener noreferrer" className="text-info underline">Open</a> : undefined} /> },
          { label: "Reason", render: (r) => <span className="text-xs font-semibold capitalize">{r.reason}</span> },
          { label: "Details", render: (r) => <p className="max-w-sm text-xs text-muted-foreground">{r.details ?? "—"}</p> },
          { label: "By", render: (r) => <span className="text-xs">{r.reporter_name ?? "—"}</span> },
          { label: "When", render: (r) => <DateCell value={r.created_at} time /> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
      />
    </div>
  );
}
