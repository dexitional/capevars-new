import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { SELLER_KINDS } from "#/lib/labels";

export const Route = createFileRoute("/admin/_admin/sellers")({ component: Sellers });

function Sellers() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Sellers & stores" description="Approve store applications before they can sell products, food, tickets, trips or exhibitions." />
      <ModerationTable
        entity="sellers"
        defaultStatus="pending"
        columns={[
          { label: "Store", render: (r) => <TitleCell title={r.title} sub={`${r.owner_name} · ${r.owner_email}`} image={r.logo_url} /> },
          {
            label: "Sells",
            render: (r) => (
              <div className="flex max-w-56 flex-wrap gap-1">
                {String(r.kinds).split(",").map((k) => (
                  <span key={k} className="rounded bg-secondary px-1.5 py-0.5 text-[11px] font-semibold">{SELLER_KINDS[k]?.label ?? k}</span>
                ))}
              </div>
            ),
          },
          {
            label: "Contact & checks",
            render: (r) => (
              <div className="space-y-0.5 text-xs">
                <p>{r.phone}{r.location ? ` · ${r.location}` : ""}</p>
                {r.business_reg_no && <p>Reg: {r.business_reg_no}</p>}
                {r.id_document_url ? <a href={r.id_document_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-info underline">View ID document</a> : <p className="text-muted-foreground">No ID uploaded</p>}
              </div>
            ),
          },
          { label: "Activity", render: (r) => <span className="text-xs">{r.product_count} products · {r.order_count} orders</span> },
          { label: "Applied", render: (r) => <DateCell value={r.created_at} /> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
      />
    </div>
  );
}
