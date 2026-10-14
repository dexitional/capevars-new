import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { api } from "#/lib/api-client";
import { FINDER_TYPES } from "#/lib/labels";
import type { FinderType } from "#/lib/labels";
import { AdminPageHeader, Segmented, Switch, errorToast } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { ListingForm, emptyListing, listingPayload } from "#/components/finder/listing-form";
import type { ListingValues } from "#/components/finder/listing-form";
import { Stars, UploadEndpoint } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Row = Record<string, any>;

export const Route = createFileRoute("/admin/_admin/finder")({ component: Finder });

function ListingEditor({ id, onClose }: { id: number | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const existing = useQuery({ queryKey: ["admin-listing", id], queryFn: () => api.get<{ listing: Row }>(`/admin/catalog/listings/${id}`), enabled: Boolean(id) });
  const [value, setValue] = useState<ListingValues | null>(id ? null : emptyListing());
  const [flags, setFlags] = useState({ isVerified: false, isFeatured: false });
  useEffect(() => {
    if (existing.data && !value) {
      setValue(emptyListing(existing.data.listing));
      setFlags({ isVerified: existing.data.listing.is_verified === 1, isFeatured: existing.data.listing.is_featured === 1 });
    }
  }, [existing.data, value]);
  const save = useMutation({
    mutationFn: () => {
      const body = { ...listingPayload(value!), ...flags };
      return id ? api.patch(`/admin/catalog/listings/${id}`, body) : api.post("/admin/catalog/listings", body);
    },
    onSuccess: () => {
      toast.success(id ? "Listing saved" : "Listing published");
      void queryClient.invalidateQueries({ queryKey: ["admin-mod", "listings"] });
      onClose();
    },
    onError: errorToast("Couldn't save the listing."),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto bg-muted sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{id ? "Edit listing" : "Add a listing"}</DialogTitle>
        </DialogHeader>
        {!value ? null : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
          >
            <UploadEndpoint value="/admin/media">
              <ListingForm value={value} onChange={setValue} />
            </UploadEndpoint>
            <div className="mt-4 space-y-3 rounded-2xl border bg-white p-5">
              <Switch checked={flags.isVerified} onChange={(v) => setFlags({ ...flags, isVerified: v })} label="Verified" description="Shows a verified badge — use after confirming details." />
              <Switch checked={flags.isFeatured} onChange={(v) => setFlags({ ...flags, isFeatured: v })} label="Featured" description="Promoted on The Finder home page." />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {id ? "Save listing" : "Publish listing"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Finder() {
  const [tab, setTab] = useState<"listings" | "reviews">("listings");
  const [editing, setEditing] = useState<number | "new" | null>(null);
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="The Finder"
        description="Approve member submissions, verify businesses, and add listings directly."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus /> Add listing
          </Button>
        }
      />
      <Segmented value={tab} onChange={setTab} options={[{ value: "listings", label: "Listings" }, { value: "reviews", label: "Reviews" }]} />
      {tab === "listings" ? (
        <ModerationTable
          key="listings"
          entity="listings"
          defaultStatus="pending"
          extra={(r) => (
            <Button size="icon-xs" variant="ghost" onClick={() => setEditing(r.id)} aria-label="Edit">
              <Pencil />
            </Button>
          )}
          columns={[
            { label: "Listing", render: (r) => <TitleCell title={r.title} sub={`${FINDER_TYPES[r.type as FinderType]?.one ?? r.type} · ${[r.area, r.city].filter(Boolean).join(", ")}`} image={r.cover_url} /> },
            { label: "Submitted by", render: (r) => <span className="text-xs">{r.submitted_by ?? "Admin"}</span> },
            { label: "Rating", render: (r) => (r.rating_avg ? <span className="text-xs">★ {r.rating_avg} ({r.rating_count})</span> : <span className="text-xs text-muted-foreground">—</span>) },
            { label: "Views", render: (r) => <span className="text-xs">{r.view_count}</span> },
            { label: "Added", render: (r) => <DateCell value={r.created_at} /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      ) : (
        <ModerationTable
          key="reviews"
          entity="finder-reviews"
          columns={[
            { label: "Review", render: (r) => <TitleCell title={r.title} sub={<span>{r.review_title ? <strong>{r.review_title}. </strong> : null}{r.body}</span>} /> },
            { label: "Rating", render: (r) => <Stars value={r.rating} /> },
            { label: "By", render: (r) => <span className="text-xs">{r.author}</span> },
            { label: "Posted", render: (r) => <DateCell value={r.created_at} /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}
      {editing && <ListingEditor id={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
