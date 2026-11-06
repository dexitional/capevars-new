// Admin → OpenLearn → Quizbank → Subscriptions: who has paid for which course,
// confirming mobile money payments, and the account the money goes to.
import { useState } from "react";
import { Link, useRouteContext } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Clock, Crown, Loader2, Wallet } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate, formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { networkName } from "#/lib/credits";
import { canControlPayments } from "#/lib/permissions";
import { ConfirmDialog, SearchInput, Segmented, StatusPill, errorToast } from "#/components/admin/ui";
import { TitleCell } from "#/components/admin/cells";
import { Kpi } from "#/components/analytics/product-analytics";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;
type Data = { items: Array<Row>; counts: Record<string, number>; revenue: number; activeCount: number; account: { network: string; name: string; number: string } };
const STATUSES = ["submitted", "awaiting", "approved", "rejected", "revoked", "cancelled"] as const;
const LABEL: Record<string, string> = { submitted: "To confirm", awaiting: "Not paid yet", approved: "Approved", rejected: "Rejected", revoked: "Revoked", cancelled: "Cancelled" };

export function QuizbankSubscriptions() {
  const { admin } = useRouteContext({ from: "/admin/_admin" });
  const canConfirm = canControlPayments(admin.role);
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>("submitted");
  const [q, setQ] = useState("");
  const [closing, setClosing] = useState<{ row: Row; action: "reject" | "revoke" } | null>(null);
  const [reason, setReason] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: ["admin-qb-subscriptions", status, q],
    queryFn: () => api.get<Data>("/admin/quizbank/subscriptions", { status, q: q || undefined }),
    placeholderData: keepPreviousData,
  });
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["admin-qb-subscriptions"] });
  const act = useMutation({
    mutationFn: ({ id, action, body }: { id: number; action: "approve" | "reject" | "revoke" | "alert"; body?: Row }) => api.post(`/admin/quizbank/subscriptions/${id}/${action}`, body ?? {}),
    onSuccess: (_r, v) => {
      toast.success({ approve: "Confirmed. Their access has started.", reject: "Payment rejected.", revoke: "Access revoked.", alert: "Alert sent again." }[v.action]);
      setClosing(null);
      setReason("");
      refresh();
    },
    onError: errorToast("Couldn't update that payment."),
  });
  return (
    <section className="space-y-4">
      {data && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi icon={Clock} label="To confirm" value={String(data.counts.submitted ?? 0)} />
          <Kpi icon={Crown} label="Active subscriptions" value={data.activeCount.toLocaleString()} />
          <Kpi icon={CheckCircle2} label="Confirmed payments" value={formatMoney(data.revenue)} />
          <Kpi icon={Wallet} label="Paid into" value={data.account.number}>
            <span className="text-xs text-muted-foreground">
              {networkName(data.account.network)} · {data.account.name}
              {canConfirm && (
                <>
                  {" · "}
                  <Link to="/admin/settings" className="font-semibold text-info underline">
                    change
                  </Link>
                </>
              )}
            </span>
          </Kpi>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented value={status} onChange={setStatus} options={[{ value: "all", label: "All" }, ...STATUSES.map((s) => ({ value: s, label: LABEL[s]!, count: data?.counts[s] ?? 0 }))]} />
        <SearchInput value={q} onChange={setQ} placeholder="Reference, transaction, member, course or code…" className="w-full sm:w-80" />
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Transaction</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.items.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-4 py-3">
                  <TitleCell title={r.full_name ?? "Deleted member"} sub={r.email ?? "—"} />
                  {r.phone && <span className="text-xs text-muted-foreground">{r.phone}</span>}
                </td>
                <td className="max-w-56 px-4 py-3 text-xs font-medium">
                  {r.course_title}
                  {r.course_code && <span className="mt-1 block w-fit rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-bold text-primary">{r.course_code}</span>}
                </td>
                <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatMoney(r.amount_ghs)}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="block font-mono font-bold">{r.reference}</span>
                  {r.transaction_id ? <span className="block font-mono">Txn {r.transaction_id}</span> : <span className="block text-muted-foreground">No transaction yet</span>}
                  {r.payer_phone && <span className="block">From {r.payer_phone}</span>}
                  <span className="block text-muted-foreground">
                    {networkName(r.network)} {r.account_number}
                  </span>
                  {r.status === "submitted" && r.alert_status && !String(r.alert_status).startsWith("sent") && <span className="block font-semibold text-destructive">SMS alert failed</span>}
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {r.status === "approved" ? (r.expires_at ? `${formatDate(r.starts_at)} – ${formatDate(r.expires_at)}` : "No expiry") : r.days ? `${r.days} days` : "No expiry"}
                  <span className="block text-muted-foreground">{formatDateTime(r.submitted_at ?? r.created_at)}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={r.status === "approved" && !r.is_active ? "expired" : r.status} />
                  {r.admin_note && <span className="mt-1 block max-w-40 text-xs text-muted-foreground">{r.admin_note}</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {canConfirm && ["awaiting", "submitted"].includes(r.status) && (
                      <>
                        <Button size="xs" disabled={act.isPending} onClick={() => act.mutate({ id: r.id, action: "approve" })} aria-label={`Confirm ${String(r.reference)}`}>
                          {act.isPending && act.variables.id === r.id && <Loader2 className="animate-spin" />} Confirm
                        </Button>
                        <Button size="xs" variant="outline" className="text-destructive" onClick={() => setClosing({ row: r, action: "reject" })} aria-label={`Reject ${String(r.reference)}`}>
                          Reject
                        </Button>
                      </>
                    )}
                    {r.status === "submitted" && (
                      <Button size="xs" variant="ghost" disabled={act.isPending} onClick={() => act.mutate({ id: r.id, action: "alert" })}>
                        Re-alert
                      </Button>
                    )}
                    {canConfirm && r.status === "approved" && Boolean(r.is_active) && (
                      <Button size="xs" variant="outline" className="text-destructive" onClick={() => setClosing({ row: r, action: "revoke" })} aria-label={`Revoke ${String(r.reference)}`}>
                        Revoke
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.items.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">{isFetching ? "Loading…" : "No payments here."}</p>}
      </div>
      <ConfirmDialog
        open={Boolean(closing)}
        onOpenChange={(o) => !o && setClosing(null)}
        title={closing?.action === "revoke" ? `Revoke access to ${String(closing.row.course_title)}?` : `Reject payment ${String(closing?.row.reference ?? "")}?`}
        description={closing?.action === "revoke" ? "Their access ends now. Nothing is refunded automatically. Tell them why; they'll see this message." : "Tell them why; they'll see this message."}
        confirmLabel={closing?.action === "revoke" ? "Revoke access" : "Reject payment"}
        pending={act.isPending}
        onConfirm={() => closing && reason.trim().length >= 3 && act.mutate({ id: closing.row.id as number, action: closing.action, body: { reason } })}
      >
        <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="At least a few words" aria-label="Reason" />
      </ConfirmDialog>
    </section>
  );
}
