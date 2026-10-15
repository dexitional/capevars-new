import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { api } from "#/lib/api-client";
import { AdminPageHeader, Segmented, errorToast } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { ProductAnalyticsPanel } from "#/components/analytics/product-analytics";
import { ProductEditor } from "#/components/seller/forms";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/admin/_admin/products")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "products"),
  component: Products,
});

type Row = Record<string, any>;

function Products() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"listings" | "analytics">("listings");
  const [editing, setEditing] = useState<Row | null>(null);
  // Fetch the full record (description, tags, gallery...) before opening the editor.
  const open = useMutation({
    mutationFn: (id: number) => api.get<{ product: Row }>(`/admin/products/${id}`),
    onSuccess: (d) => setEditing(d.product),
    onError: errorToast("Couldn't open that product."),
  });
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Products & food" description="Everything listed in the Marketplace. Edit listings, block those that break the seller rules, and see how they sell." />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "listings", label: "Listings" },
          { value: "analytics", label: "Analytics" },
        ]}
      />
      {tab === "analytics" ? (
        <ProductAnalyticsPanel endpoint="/admin/products/analytics" title="Marketplace analytics" />
      ) : (
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
          extra={(row) => (
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => open.mutate(row.id as number)}
              disabled={open.isPending && open.variables === row.id}
              aria-label="Edit"
              title="Edit"
            >
              {open.isPending && open.variables === row.id ? <Loader2 className="animate-spin" /> : <Pencil />}
            </Button>
          )}
        />
      )}
      {editing && (
        <ProductEditor
          key={editing.id}
          product={editing}
          kind={editing.kind === "food" ? "food" : "product"}
          open
          endpoint="/admin/products"
          moderator
          onClose={() => setEditing(null)}
          onSaved={() => {
            void queryClient.invalidateQueries({ queryKey: ["admin-mod", "products"] });
            void queryClient.invalidateQueries({ queryKey: ["analytics"] });
          }}
        />
      )}
    </div>
  );
}
