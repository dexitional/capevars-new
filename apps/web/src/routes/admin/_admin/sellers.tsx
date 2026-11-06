import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { canManage } from "#/lib/permissions";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { MemberPicker } from "#/components/admin/member-picker";
import type { PickedMember } from "#/components/admin/member-picker";
import { PurgeDialog } from "#/components/admin/purge-dialog";
import { StoreForm } from "#/components/seller/forms";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { SELLER_KINDS } from "#/lib/labels";

export const Route = createFileRoute("/admin/_admin/sellers")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "sellers", "pending"), component: Sellers });

type Row = Record<string, any>;

function StoreDialog({ title, description, store, owner, onClose, onSaved }: { title: string; description: string; store: Row | null; owner?: PickedMember; onClose: () => void; onSaved: () => void }) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="min-w-0">
          <StoreForm
            store={store}
            admin={{ owner }}
            onSaved={() => {
              onSaved();
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Sellers() {
  const { admin } = Route.useRouteContext();
  const editable = canManage(admin.role, "sellers");
  const queryClient = useQueryClient();
  const [picking, setPicking] = useState(false);
  const [owner, setOwner] = useState<PickedMember | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-mod", "sellers"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-queues"] });
  };
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sellers & stores"
        description="Approve store applications before they can sell products, food, tickets, trips or exhibitions. Open, edit or delete stores for members."
        actions={
          editable && (
            <Button onClick={() => setPicking(true)}>
              <Plus /> New store
            </Button>
          )
        }
      />
      <ModerationTable
        entity="sellers"
        defaultStatus="pending"
        extra={
          editable
            ? (row) => (
                <Button size="icon-xs" variant="ghost" onClick={() => setEditing(row)} aria-label="Edit" title="Edit">
                  <Pencil />
                </Button>
              )
            : undefined
        }
        onDelete={editable ? setDeleting : undefined}
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
      {picking && (
        <MemberPicker
          title="Open a store for which member?"
          description="A member can have one store. It's approved straight away, and they can run it from Seller Center."
          storeless
          onPick={(m) => {
            setOwner(m);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
      {owner && <StoreDialog key={owner.id} title={`New store for ${owner.name}`} description="It's approved as soon as you open it, and they're notified." store={null} owner={owner} onClose={() => setOwner(null)} onSaved={refresh} />}
      {editing && <StoreDialog key={editing.id as number} title={`Edit ${String(editing.title)}`} description={`Owned by ${String(editing.owner_name)}. Its approval status stays as it is, and they're notified.`} store={editing} onClose={() => setEditing(null)} onSaved={refresh} />}
      {deleting && (
        <PurgeDialog
          key={deleting.id as number}
          title={`Delete ${String(deleting.title)}?`}
          description={`This permanently removes the store and everything below. It can't be undone. ${String(deleting.owner_name)} keeps their account and can apply for a new store. Consider suspending the store if you may need any of this later.`}
          url={`/admin/sellers/${String(deleting.id)}`}
          confirmWord={String(deleting.store_name)}
          nothingElse="It has no listings or customers, so only the store goes."
          success="Store and its listings deleted."
          onClose={() => setDeleting(null)}
          onDeleted={refresh}
        />
      )}
    </div>
  );
}
