import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { Chip, Loading, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/leadgen/portal/broadcasts/$id")({ component: BroadcastDetail });

function BroadcastDetail() {
  const { id } = Route.useParams();
  const [filter, setFilter] = useState<"" | "sent" | "failed" | "queued">("");
  const { data, refetch } = useQuery({
    queryKey: ["leadgen", "broadcast", id, filter],
    queryFn: () => api.get<{ broadcast: Row; recipients: Array<Row> }>(`/leadgen/portal/broadcasts/${id}`, { status: filter }),
    refetchInterval: (q) => (["queued", "sending", "scheduled"].includes(q.state.data?.broadcast.status) ? 4000 : false),
  });
  const cancel = useMutation({
    mutationFn: () => api.post(`/leadgen/portal/broadcasts/${id}/cancel`),
    onSuccess: () => {
      toast.success("Cancelled and refunded");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  const b = data.broadcast;
  const done = Number(b.sent_count) + Number(b.failed_count);
  const pct = Math.round((done / Math.max(1, b.recipient_count)) * 100);
  return (
    <div className="space-y-5">
      <Link to="/leadgen/portal/broadcasts" className="text-sm text-muted-foreground hover:underline">
        ← History
      </Link>
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {b.channel === "sms" ? "SMS" : "Email"} broadcast #{b.id} · from {b.sender_label}
            </p>
            <h1 className="mt-1 text-xl font-black text-primary">{b.subject ?? "SMS message"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={b.status} />
            {["queued", "scheduled"].includes(b.status) && (
              <Button size="sm" variant="outline" onClick={() => confirm("Cancel and refund this broadcast?") && cancel.mutate()}>
                Cancel
              </Button>
            )}
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-muted p-4 text-sm whitespace-pre-wrap">{b.body}</p>
        <div className="mt-5">
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full transition-all", b.failed_count > 0 && b.sent_count === 0 ? "bg-destructive" : "bg-sys-leadgen")} style={{ width: `${pct}%` }} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
            {[
              ["Recipients", b.recipient_count],
              ["Sent", b.sent_count],
              ["Failed", b.failed_count],
              ["Credits charged", b.cost_credits],
              ["Refunded", b.refunded_credits],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            {b.scheduled_at && `Scheduled ${formatDateTime(b.scheduled_at)} · `}
            {b.started_at && `Started ${formatDateTime(b.started_at)} · `}
            {b.finished_at && `Finished ${formatDateTime(b.finished_at)}`}
          </p>
          {b.error && <p className="mt-2 text-sm text-amber-800">{b.error}</p>}
        </div>
      </div>
      <section className="rounded-2xl border bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b p-4">
          <p className="mr-auto font-bold text-primary">Recipients</p>
          {(["", "sent", "failed", "queued"] as const).map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)} className="px-3 py-1 text-xs capitalize">
              {f || "All"}
            </Chip>
          ))}
        </div>
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {data.recipients.map((r) => (
                <tr key={r.address}>
                  <td className="px-4 py-2">{r.name ?? "—"}</td>
                  <td className="px-4 py-2 font-mono text-xs">{r.address}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={r.status} label={r.status === "sent" && r.provider_status ? r.provider_status.replace(/^DS_/, "").replace(/_/g, " ").toLowerCase() : undefined} />
                  </td>
                  <td className="px-4 py-2 text-xs text-destructive">{r.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.recipients.length === 500 && <p className="p-3 text-center text-xs text-muted-foreground">Showing the first 500.</p>}
        </div>
      </section>
    </div>
  );
}
