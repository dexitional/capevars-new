import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus } from "lucide-react";
import { api } from "#/lib/api-client";
import { canManage } from "#/lib/permissions";
import { AdminPageHeader, Segmented, errorToast } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { ProductAnalyticsPanel } from "#/components/analytics/product-analytics";
import { MemberPicker } from "#/components/admin/member-picker";
import type { PickedMember } from "#/components/admin/member-picker";
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
  const { admin } = Route.useRouteContext();
  // Adding for a seller: first which kind, then whose store, then the editor.
  const [adding, setAdding] = useState<"product" | "food" | null>(null);
  const [owner, setOwner] = useState<PickedMember | null>(null);
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-mod", "products"] });
    void queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };
  // Fetch the full record (description, tags, gallery...) before opening the editor.
  const open = useMutation({
    mutationFn: (id: number) => api.get<{ product: Row }>(`/admin/products/${id}`),
    onSuccess: (d) => setEditing(d.product),
    onError: errorToast("Couldn't open that product."),
  });
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products & food"
        description="Everything listed in the Marketplace. Add listings for sellers, edit them, block those that break the seller rules, and see how they sell."
        actions={
          canManage(admin.role, "products") && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setAdding("food")}>
                <Plus /> Add menu item
              </Button>
              <Button onClick={() => setAdding("product")}>
                <Plus /> Add product
              </Button>
            </div>
          )
        }
      />
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
          onSaved={refresh}
        />
      )}
      {adding && !owner && (
        <MemberPicker
          title={adding === "food" ? "Add a menu item for which seller?" : "Add a product for which seller?"}
          description="It's listed under their store, and they're notified. A store that doesn't sell this kind of listing yet gets it switched on."
          sellersOnly
          needsStore
          onPick={setOwner}
          onClose={() => setAdding(null)}
        />
      )}
      {adding && owner && (
        <ProductEditor
          key={`new-${owner.id}-${adding}`}
          product={null}
          kind={adding}
          open
          endpoint="/admin/products"
          owner={owner}
          onClose={() => {
            setAdding(null);
            setOwner(null);
          }}
          onSaved={refresh}
        />
      )}
    </div>
  );
}
