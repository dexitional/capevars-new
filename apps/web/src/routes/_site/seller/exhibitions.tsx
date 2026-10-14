import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LayoutGrid, Pencil, Plus } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatEventRange } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EmptyState, Img, Loading, SectionHeader, StatusBadge } from "#/components/site/kit";
import { ExhibitionEditor } from "#/components/seller/forms";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/seller/exhibitions")({ component: SellerExhibitions });

function SellerExhibitions() {
  const { data, refetch } = useQuery({ queryKey: ["seller", "exhibitions"], queryFn: () => api.get<{ items: Array<Row>; bookings: Array<Row> }>("/seller/exhibitions") });
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const respond = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => {
      const organizerNote = status === "approved" ? prompt("Payment instructions for the exhibitor (optional)") : status === "declined" ? prompt("Reason (optional)") : null;
      return api.patch(`/seller/exhibition-bookings/${id}`, { status, organizerNote });
    },
    onSuccess: () => {
      toast.success("Updated");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  return (
    <div className="space-y-8">
      <section>
        <SectionHeader
          title="Exhibitions"
          action={
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus /> New exhibition
            </Button>
          }
        />
        {data.items.length === 0 ? (
          <EmptyState icon={LayoutGrid} title="No exhibitions yet" />
        ) : (
          <div className="space-y-3">
            {data.items.map((x) => (
              <div key={x.id} className="flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4">
                <Img src={x.cover_url} className="h-16 w-28 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-primary">{x.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatEventRange(x.starts_at, x.ends_at)} · {x.venue}
                  </p>
                  {x.status === "rejected" && x.status_reason && <p className="text-xs text-destructive">{x.status_reason}</p>}
                </div>
                <p className="text-sm font-semibold">
                  {x.booths_taken}/{x.booths_total} booths
                </p>
                <StatusBadge status={x.status} label={x.status === "pending" ? "in review" : undefined} />
                <Button size="icon-sm" variant="ghost" onClick={() => setEditing(x)} aria-label="Edit">
                  <Pencil />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <SectionHeader title="Booth requests" />
        {data.bookings.length === 0 ? (
          <p className="rounded-2xl border bg-white p-5 text-sm text-muted-foreground">No booth requests yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {data.bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{b.business_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.exhibition_title} · {b.requester_name} · {b.contact_phone}
                      </p>
                      {b.products && <p className="text-xs">{b.products}</p>}
                    </td>
                    <td className="px-4 py-3">{b.booths} booth(s)</td>
                    <td className="px-4 py-3 font-bold">{formatMoney(b.amount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {b.status === "requested" && (
                          <Button size="xs" onClick={() => respond.mutate({ id: b.id, status: "approved" })}>
                            Approve
                          </Button>
                        )}
                        {["requested", "approved"].includes(b.status) && (
                          <Button size="xs" variant="outline" onClick={() => respond.mutate({ id: b.id, status: "paid" })}>
                            Mark paid
                          </Button>
                        )}
                        {["requested", "approved"].includes(b.status) && (
                          <Button size="xs" variant="ghost" className="text-destructive" onClick={() => respond.mutate({ id: b.id, status: "declined" })}>
                            Decline
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {editing && <ExhibitionEditor key={editing === "new" ? "new" : editing.id} exhibition={editing === "new" ? null : editing} open onClose={() => setEditing(null)} onSaved={() => void refetch()} />}
    </div>
  );
}
