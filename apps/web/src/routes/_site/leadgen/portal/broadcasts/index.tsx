import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageSquareText, Send } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { EmptyState, Loading, StatusBadge } from "#/components/site/kit";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/leadgen/portal/broadcasts/")({ component: History });

function History() {
  const { data } = useQuery({ queryKey: ["leadgen", "broadcasts"], queryFn: () => api.get<{ items: Array<Row> }>("/leadgen/portal/broadcasts"), refetchInterval: 15_000 });
  if (!data) return <Loading />;
  return (
    <div>
      <h1 className="mb-5 text-2xl font-black text-primary">Broadcast history</h1>
      {data.items.length === 0 ? (
        <EmptyState icon={Send} title="No broadcasts yet" action={<Link to="/leadgen/portal/broadcast" className="font-semibold text-primary underline">Send your first broadcast</Link>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Sender</th>
                <th className="px-4 py-3">Delivered</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.map((b) => (
                <tr key={b.id} className="hover:bg-muted/50">
                  <td className="max-w-xs px-4 py-3">
                    <Link to="/leadgen/portal/broadcasts/$id" params={{ id: String(b.id) }} className="flex items-center gap-2 font-medium hover:underline">
                      {b.channel === "sms" ? <MessageSquareText className="size-4 shrink-0" /> : <Mail className="size-4 shrink-0" />}
                      <span className="truncate">{b.subject ?? b.preview}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">{b.sender_label}</td>
                  <td className="px-4 py-3">
                    {b.sent_count}/{b.recipient_count}
                    {b.failed_count > 0 && <span className="text-destructive"> · {b.failed_count} failed</span>}
                  </td>
                  <td className="px-4 py-3">
                    {Number(b.cost_credits) - Number(b.refunded_credits)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(b.scheduled_at ?? b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
