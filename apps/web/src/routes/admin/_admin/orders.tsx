import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, TitleCell } from "#/components/admin/cells";
import { ORDER_STATUSES } from "#/lib/labels";

export const Route = createFileRoute("/admin/_admin/orders")({ component: Orders });

function Orders() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Orders" description="Every Marketplace and food order. Sellers manage fulfilment; this view is for support." />
      <ModerationTable
        entity="orders"
        readOnly
        columns={[
          { label: "Order", render: (r) => <TitleCell title={r.title} sub={`${r.item_count} item(s) · ${r.fulfilment}`} /> },
          { label: "Buyer", render: (r) => <span className="text-xs">{r.buyer_name}<br />{r.contact_phone}</span> },
          { label: "Store", render: (r) => <span className="text-xs">{r.store_name}</span> },
          { label: "Total", render: (r) => <MoneyCell value={r.total} /> },
          { label: "Payment", render: (r) => <span className="text-xs capitalize">{r.payment_method.replace("_", " ")} · {r.payment_status}</span> },
          { label: "Status", render: (r) => <span className="text-xs font-semibold">{ORDER_STATUSES[r.status]}</span> },
          { label: "Placed", render: (r) => <DateCell value={r.created_at} time /> },
        ]}
      />
    </div>
  );
}
