// The generic queue behind most admin pages: status tabs with counts, search,
// paging, and the actions the API offers for each entity (with a reason
// prompt where the owner is told why).
import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { Pagination } from "./pagination";
import { ConfirmDialog, SearchInput, Segmented, StatusPill, TableMessage, errorToast } from "./ui";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;
export interface Column {
  label: string;
  className?: string;
  render: (row: Row) => React.ReactNode;
}

interface ModResponse {
  items: Array<Row>;
  total: number;
  counts: Record<string, number>;
  statuses: Array<string>;
  actions: Record<string, string>;
  deletable: boolean;
}

// Actions that tell the owner why — they open a reason box.
const NEEDS_REASON = new Set(["reject", "suspend", "cancel", "hide", "archive", "paid"]);
const DESTRUCTIVE = new Set(["reject", "suspend", "cancel", "hide", "archive", "block", "dismiss"]);

// Hide actions that wouldn't change anything for this row.
function applicable(action: string, row: Row) {
  const s = row.status as string | undefined;
  switch (action) {
    case "approve":
      return !["published", "approved"].includes(s ?? "");
    case "reject":
      return ["pending", "in_review", "requested", "draft"].includes(s ?? "");
    case "suspend":
      return s !== "suspended";
    case "activate":
      return s === "suspended";
    case "feature":
      return !row.is_featured;
    case "unfeature":
      return Boolean(row.is_featured);
    case "verify":
      return !row.is_verified;
    case "unverify":
      return Boolean(row.is_verified);
    case "block":
      return s !== "blocked";
    case "unblock":
      return s === "blocked";
    case "hide":
      return s !== "hidden";
    case "unhide":
      return s === "hidden";
    case "cancel":
      return !["cancelled", "rejected"].includes(s ?? "");
    case "close":
      return s === "published";
    case "archive":
      return s === "published";
    case "paid":
    case "actioned":
    case "dismiss":
      return ["requested", "open"].includes(s ?? "");
    default:
      return true;
  }
}

export function ModerationTable({
  entity,
  columns,
  defaultStatus = "",
  extra,
  readOnly,
  onRowClick,
}: {
  entity: string;
  columns: Array<Column>;
  defaultStatus?: string;
  extra?: (row: Row, refresh: () => void) => React.ReactNode;
  readOnly?: boolean;
  onRowClick?: (row: Row) => void;
}) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(defaultStatus);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<{ row: Row; action: string; label: string } | null>(null);
  const [reason, setReason] = useState("");
  const [deleting, setDeleting] = useState<Row | null>(null);
  const key = ["admin-mod", entity, status, q, page];
  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => api.get<ModResponse>(`/admin/mod/${entity}`, { status, q, page, pageSize: 25 }),
    placeholderData: keepPreviousData,
  });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-mod", entity] });
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };
  const act = useMutation({
    mutationFn: ({ row, action, why }: { row: Row; action: string; why?: string }) => api.post(`/admin/mod/${entity}/${row.id}/${action}`, { reason: why }),
    onSuccess: () => {
      toast.success("Done");
      setPending(null);
      setReason("");
      refresh();
    },
    onError: errorToast("Couldn't complete that action."),
  });
  const remove = useMutation({
    mutationFn: (row: Row) => api.delete(`/admin/mod/${entity}/${row.id}`),
    onSuccess: () => {
      toast.success("Deleted");
      setDeleting(null);
      refresh();
    },
    onError: errorToast("Couldn't delete."),
  });
  const statuses = data?.statuses ?? [];
  const total = Object.values(data?.counts ?? {}).reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {statuses.length > 0 ? (
          <Segmented
            value={status}
            onChange={(v) => (setStatus(v), setPage(1))}
            options={[{ value: "", label: "All", count: total }, ...statuses.map((s) => ({ value: s, label: s.replace(/_/g, " "), count: data?.counts[s] ?? 0 }))]}
          />
        ) : (
          <span />
        )}
        <SearchInput value={q} onChange={(v) => (setQ(v), setPage(1))} className="w-64" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                {columns.map((c) => (
                  <th key={c.label} className={cn("px-4 py-3", c.className)}>
                    {c.label}
                  </th>
                ))}
                {!readOnly && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.items.map((row) => (
                <tr key={row.id} className={cn("align-top", onRowClick && "cursor-pointer hover:bg-muted/40")} onClick={() => onRowClick?.(row)}>
                  {columns.map((c) => (
                    <td key={c.label} className={cn("px-4 py-3", c.className)}>
                      {c.render(row)}
                    </td>
                  ))}
                  {!readOnly && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-wrap justify-end gap-1">
                        {Object.entries(data.actions)
                          .filter(([a]) => applicable(a, row))
                          .map(([a, label]) => (
                            <Button
                              key={a}
                              size="xs"
                              variant={a === "approve" ? "default" : DESTRUCTIVE.has(a) ? "outline" : "secondary"}
                              className={cn(DESTRUCTIVE.has(a) && "text-destructive")}
                              disabled={act.isPending}
                              onClick={() => (NEEDS_REASON.has(a) ? setPending({ row, action: a, label }) : act.mutate({ row, action: a }))}
                            >
                              {label}
                            </Button>
                          ))}
                        {extra?.(row, refresh)}
                        {row.public_link && (
                          <Button asChild size="icon-xs" variant="ghost">
                            <a href={row.public_link} target="_blank" rel="noopener noreferrer" aria-label="Open on site">
                              <ExternalLink />
                            </a>
                          </Button>
                        )}
                        {data.deletable && (
                          <Button size="icon-xs" variant="ghost" onClick={() => setDeleting(row)} aria-label="Delete">
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && (
          <TableMessage>
            <Loader2 className="mx-auto size-5 animate-spin" />
          </TableMessage>
        )}
        {data && data.items.length === 0 && <TableMessage>Nothing here.</TableMessage>}
        {data && <Pagination page={page} pageSize={25} total={data.total} onPageChange={setPage} />}
      </div>
      <ConfirmDialog
        open={Boolean(pending)}
        onOpenChange={(o) => !o && setPending(null)}
        title={`${pending?.label ?? ""}: ${String(pending?.row.title ?? "")}`}
        description={pending?.action === "paid" ? "Add the payment reference or a note (optional)." : "Tell the owner why. They'll see this message."}
        confirmLabel={pending?.label ?? "Confirm"}
        destructive={pending ? DESTRUCTIVE.has(pending.action) : false}
        pending={act.isPending}
        onConfirm={() => pending && act.mutate({ row: pending.row, action: pending.action, why: reason })}
      >
        <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={pending?.action === "paid" ? "e.g. MoMo ref 1234567890" : "Reason"} />
      </ConfirmDialog>
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete permanently?"
        description={`“${String(deleting?.title ?? "")}” will be removed. This can't be undone.`}
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting)}
      />
    </div>
  );
}

export const Status = ({ row }: { row: Row }) => <StatusPill status={row.status === "approved" || row.status === "visible" || row.status === "success" ? "published" : row.status === "rejected" || row.status === "suspended" || row.status === "blocked" || row.status === "failed" ? "archived" : row.status === "pending" || row.status === "in_review" || row.status === "requested" || row.status === "open" ? "draft" : "active"} label={String(row.status ?? "").replace(/_/g, " ")} />;
