import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Package, Pencil, Plus, Trash2, Utensils } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatMoney } from "#/lib/money";
import { EmptyState, Img, Loading, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { ProductEditor } from "./forms";

type Row = Record<string, any>;

export function ProductsManager({ kind }: { kind: "product" | "food" }) {
  const { data, refetch } = useQuery({ queryKey: ["seller", "products", kind], queryFn: () => api.get<{ items: Array<Row> }>("/seller/products", { kind }) });
  const [editing, setEditing] = useState<Row | null | "new">(null);
  const [q, setQ] = useState("");
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/seller/products/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: (p: Row) => api.patch(`/seller/products/${p.id}`, { status: p.status === "active" ? "hidden" : "active" }),
    onSuccess: () => void refetch(),
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  const items = data.items.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()));
  const sections = kind === "food" ? [...new Set(items.map((p) => p.menu_section || "Menu"))] : [null];
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-primary">{kind === "food" ? "Food menu" : "Products"}</h1>
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-48 bg-white" />
          <Button onClick={() => setEditing("new")}>
            <Plus /> {kind === "food" ? "Add item" : "Add product"}
          </Button>
        </div>
      </div>
      {data.items.length === 0 ? (
        <EmptyState icon={kind === "food" ? Utensils : Package} title={kind === "food" ? "Your menu is empty" : "No products yet"} action={<Button onClick={() => setEditing("new")}>Add your first {kind === "food" ? "item" : "product"}</Button>} />
      ) : (
        sections.map((section) => (
          <section key={section ?? "all"} className="mb-6">
            {section && <h2 className="mb-2 font-bold text-primary">{section}</h2>}
            <div className="overflow-x-auto rounded-2xl border bg-white">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {items
                    .filter((p) => !section || (p.menu_section || "Menu") === section)
                    .map((p) => (
                      <tr key={p.id}>
                        <td className="w-16 px-3 py-2">
                          <Img src={p.images?.[0]} className="size-12 rounded-lg" />
                        </td>
                        <td className="px-3 py-2">
                          <p className="font-semibold">{p.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.category_name ?? "Uncategorised"} · {p.sold_count} sold · {p.view_count} views
                          </p>
                        </td>
                        <td className="px-3 py-2 font-bold">{formatMoney(p.price)}</td>
                        <td className="px-3 py-2 text-xs">{p.stock === null ? "∞" : p.stock <= 0 ? <span className="text-destructive">Sold out</span> : `${p.stock} left`}</td>
                        <td className="px-3 py-2">
                          {p.status === "blocked" ? (
                            <StatusBadge status="blocked" />
                          ) : (
                            <button type="button" onClick={() => toggle.mutate(p)} title="Toggle visibility">
                              <StatusBadge status={p.status} label={p.status === "active" ? "live" : p.status} />
                            </button>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-1">
                            <Button asChild size="icon-sm" variant="ghost">
                              <Link to="/market/p/$slug" params={{ slug: p.slug }} aria-label="View">
                                <Eye />
                              </Link>
                            </Button>
                            <Button size="icon-sm" variant="ghost" onClick={() => setEditing(p)} aria-label="Edit" disabled={p.status === "blocked"}>
                              <Pencil />
                            </Button>
                            <Button size="icon-sm" variant="ghost" onClick={() => confirm(`Delete "${p.title}"?`) && remove.mutate(p.id)} aria-label="Delete">
                              <Trash2 />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
      {editing && <ProductEditor key={editing === "new" ? "new" : editing.id} product={editing === "new" ? null : editing} kind={kind} open onClose={() => setEditing(null)} onSaved={() => void refetch()} />}
    </div>
  );
}
