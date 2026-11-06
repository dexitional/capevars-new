import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { canManage } from "#/lib/permissions";
import { AdminPageHeader, ConfirmDialog, errorToast } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";

export const Route = createFileRoute("/admin/_admin/payments")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "payments"), component: Payments });

type Row = Record<string, any>;

const PURPOSE: Record<string, string> = { order: "Marketplace order", ticket: "Tickets", enrollment: "Course", donation: "Donation", booth: "Exhibition booth", lead: "Lead list", credits: "Broadcast credits" };

// What deleting takes away depends on where the payment has got to.
const DELETE_WARNING: Record<string, string> = {
  pending: "This payment may still be in progress. If the customer completes it after this, they'll be charged but Capevars won't recognise it, so their order or ticket won't be confirmed. Check Paystack first.",
  success: "What it paid for stays paid: orders, tickets and enrollments aren't reversed and nothing is refunded. This removes the only record of the money here, and takes it out of the dashboard's totals.",
  failed: "No money was taken for this payment, so only the record goes.",
};

function Payments() {
  const { admin } = Route.useRouteContext();
  const editable = canManage(admin.role, "payments");
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<Row | null>(null);
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/mod/payments/${id}`),
    onSuccess: () => {
      toast.success("Payment record deleted.");
      setDeleting(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-mod", "payments"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: errorToast("Couldn't delete the payment."),
  });
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Payments" description="Online (Paystack) and manual payment records across all systems." />
      <ModerationTable
        entity="payments"
        readOnly={!editable}
        onDelete={editable ? setDeleting : undefined}
        columns={[
          { label: "Reference", render: (r) => <TitleCell title={<span className="font-mono text-xs">{r.reference}</span>} sub={r.payer_name ?? r.email} /> },
          { label: "For", render: (r) => <span className="text-xs">{PURPOSE[r.purpose] ?? r.purpose}</span> },
          { label: "Amount", render: (r) => <MoneyCell value={r.amount} /> },
          { label: "Provider", render: (r) => <span className="text-xs capitalize">{r.provider}{r.channel ? ` · ${r.channel}` : ""}</span> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
          { label: "Date", render: (r) => <DateCell value={r.paid_at ?? r.created_at} time /> },
        ]}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Delete payment ${String(deleting?.reference ?? "")}?`}
        description={DELETE_WARNING[String(deleting?.status)]}
        confirmLabel="Delete payment"
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting.id as number)}
      />
    </div>
  );
}
