import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";

export const Route = createFileRoute("/admin/_admin/products")({ component: Products });

function Products() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Products & food" description="Everything listed in the Marketplace. Block listings that break the seller rules." />
      <ModerationTable
        entity="products"
        columns={[
          { label: "Product", render: (r) => <TitleCell title={r.title} sub={`${r.store_name} · ${r.category_name ?? "Uncategorised"}${r.kind === "food" ? " · Food" : ""}`} image={r.image} /> },
          { label: "Price", render: (r) => <MoneyCell value={r.price} /> },
          { label: "Stock", render: (r) => <span className="text-xs">{r.stock === null ? "∞" : r.stock}</span> },
          { label: "Sales", render: (r) => <span className="text-xs">{r.sold_count} sold · {r.view_count} views</span> },
          { label: "Added", render: (r) => <DateCell value={r.created_at} /> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
      />
    </div>
  );
}
