import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";

export const Route = createFileRoute("/admin/_admin/payments")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "payments"), component: Payments });

const PURPOSE: Record<string, string> = { order: "Marketplace order", ticket: "Tickets", enrollment: "Course", donation: "Donation", booth: "Exhibition booth", lead: "Lead list", credits: "Broadcast credits" };

function Payments() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Payments" description="Online (Paystack) and manual payment records across all systems." />
      <ModerationTable
        entity="payments"
        readOnly
        columns={[
          { label: "Reference", render: (r) => <TitleCell title={<span className="font-mono text-xs">{r.reference}</span>} sub={r.payer_name ?? r.email} /> },
          { label: "For", render: (r) => <span className="text-xs">{PURPOSE[r.purpose] ?? r.purpose}</span> },
          { label: "Amount", render: (r) => <MoneyCell value={r.amount} /> },
          { label: "Provider", render: (r) => <span className="text-xs capitalize">{r.provider}{r.channel ? ` · ${r.channel}` : ""}</span> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
          { label: "Date", render: (r) => <DateCell value={r.paid_at ?? r.created_at} time /> },
        ]}
      />
    </div>
  );
}
