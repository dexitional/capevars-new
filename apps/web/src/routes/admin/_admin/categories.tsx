import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { AdminPageHeader, ConfirmDialog, Field, Segmented, Switch, errorToast } from "#/components/admin/ui";
import { ICON_NAMES, NamedIcon } from "#/components/site/icon";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Row = Record<string, any>;
type Kind = "market" | "course";

export const Route = createFileRoute("/admin/_admin/categories")({ component: Categories });

function Editor({ kind, row, parents, onClose }: { kind: Kind; row: Row | null; parents: Array<Row>; onClose: () => void }) {
  const queryClient = useQueryClient();
  const base = kind === "market" ? "/admin/catalog/market-categories" : "/admin/catalog/course-categories";
  const [f, setF] = useState({
    name: row?.name ?? "",
    icon: row?.icon ?? (kind === "market" ? "shopping-bag" : "book-open"),
    description: row?.description ?? "",
    parentId: row?.parent_id ? String(row.parent_id) : "",
    isFood: row?.is_food === 1,
    sortOrder: String(row?.sort_order ?? 0),
    isActive: row ? row.is_active === 1 : true,
  });
  const save = useMutation({
    mutationFn: () => {
      const body: Record<string, unknown> = { name: f.name, icon: f.icon, description: f.description, sortOrder: Number(f.sortOrder) || 0, isActive: f.isActive };
      if (kind === "market") Object.assign(body, { parentId: f.parentId ? Number(f.parentId) : null, isFood: f.isFood });
      return row ? api.patch(`${base}/${row.id}`, body) : api.post(base, body);
    },
    onSuccess: () => {
      toast.success("Saved");
      void queryClient.invalidateQueries({ queryKey: ["admin-categories", kind] });
      onClose();
    },
    onError: errorToast("Couldn't save."),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{row ? "Edit category" : "New category"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Field label="Name">
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
          </Field>
          {kind === "market" && (
            <Field label="Parent">
              <select value={f.parentId} onChange={(e) => setF({ ...f, parentId: e.target.value })} className="h-9 rounded-md border px-3 text-sm">
                <option value="">— Top level —</option>
                {parents
                  .filter((p) => p.id !== row?.id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </Field>
          )}
          <Field label="Icon">
            <div className="grid grid-cols-8 gap-1.5">
              {ICON_NAMES.map((n) => (
                <button key={n} type="button" onClick={() => setF({ ...f, icon: n })} className={cn("flex aspect-square items-center justify-center rounded-lg border", f.icon === n ? "border-primary bg-primary text-white" : "hover:bg-muted")} title={n}>
                  <NamedIcon name={n} className="size-4" />
                </button>
              ))}
            </div>
          </Field>
          <Field label="Description">
            <Input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </Field>
          <Field label="Sort order">
            <Input inputMode="numeric" value={f.sortOrder} onChange={(e) => setF({ ...f, sortOrder: e.target.value })} className="w-24" />
          </Field>
          {kind === "market" && <Switch checked={f.isFood} onChange={(v) => setF({ ...f, isFood: v })} label="Food category" description="Used for food vendor menus." />}
          <Switch checked={f.isActive} onChange={(v) => setF({ ...f, isActive: v })} label="Active" />
          <Button type="submit" disabled={save.isPending}>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Categories() {
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<Kind>("market");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const base = kind === "market" ? "/admin/catalog/market-categories" : "/admin/catalog/course-categories";
  const { data } = useQuery({ queryKey: ["admin-categories", kind], queryFn: () => api.get<{ items: Array<Row> }>(base) });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`${base}/${id}`),
    onSuccess: () => {
      setDeleting(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-categories", kind] });
    },
    onError: errorToast("Couldn't delete."),
  });
  const items = data?.items ?? [];
  const parents = items.filter((c) => !c.parent_id);
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Marketplace categories (with sub-categories) and OpenLearn course categories."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus /> New category
          </Button>
        }
      />
      <Segmented value={kind} onChange={setKind} options={[{ value: "market", label: "Marketplace" }, { value: "course", label: "Courses" }]} />
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <tbody className="divide-y">
            {(kind === "market" ? parents.flatMap((p) => [p, ...items.filter((c) => c.parent_id === p.id)]) : items).map((c) => (
              <tr key={c.id} className={c.is_active ? "" : "opacity-50"}>
                <td className={cn("px-4 py-2.5", c.parent_id && "pl-12")}>
                  <span className="flex items-center gap-2 font-medium">
                    <NamedIcon name={c.icon} className="size-4 text-muted-foreground" /> {c.name}
                    {c.is_food ? <span className="rounded bg-amber-50 px-1.5 text-[10px] font-bold text-amber-700">FOOD</span> : null}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-2.5 text-xs">{c.product_count ?? c.course_count} {kind === "market" ? "products" : "courses"}</td>
                <td className="px-4 py-2.5 text-right">
                  <Button size="icon-xs" variant="ghost" onClick={() => setEditing(c)} aria-label="Edit">
                    <Pencil />
                  </Button>
                  <Button size="icon-xs" variant="ghost" onClick={() => setDeleting(c)} aria-label="Delete">
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <Editor kind={kind} row={editing === "new" ? null : editing} parents={parents} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Delete “${deleting?.name}”?`}
        description="Items in this category become uncategorised. Sub-categories move to the top level."
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting.id)}
      />
    </div>
  );
}
