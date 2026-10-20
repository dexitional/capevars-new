import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Database, Mail, MessageSquareText, Send } from "lucide-react";
import { api } from "#/lib/api-client";
import { timeAgo } from "#/lib/format";
import { EmptyState, Loading, StatusBadge } from "#/components/site/kit";
import { RedeemBox } from "#/components/leadgen/redeem-box";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/leadgen/portal/")({ component: PortalHome });

function PortalHome() {
  const { data, error, isFetching, refetch } = useQuery({ queryKey: ["leadgen", "summary"], queryFn: () => api.get<Record<string, any>>("/leadgen/portal/summary") });
  if (!data && error) {
    return (
      <div role="alert">
        <EmptyState icon={AlertTriangle} title="Couldn't load the broadcast dashboard" text={error.message} action={<Button onClick={() => void refetch()} disabled={isFetching}>{isFetching ? "Retrying…" : "Try again"}</Button>} />
      </div>
    );
  }
  if (!data) return <Loading />;
  const m = data.messaging;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">Broadcast portal</h1>
          <p className="text-sm text-muted-foreground">Send bulk SMS and email to your leads.</p>
        </div>
        <Button asChild>
          <Link to="/leadgen/portal/broadcast">
            <Send /> New broadcast
          </Link>
        </Button>
      </div>
      {(m.simulated.sms || m.simulated.email) && (
        <p className="flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Test mode: {[m.simulated.sms && "SMS", m.simulated.email && "email"].filter(Boolean).join(" and ")} sending is simulated on this server — nothing is actually delivered.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Credits", Number(data.balance).toLocaleString()],
          ["Lead lists", `${data.lists.accessible} · ${Number(data.lists.contacts).toLocaleString()} contacts`],
          ["Broadcasts", data.stats.broadcasts],
          ["Messages sent", Number(data.stats.sent).toLocaleString()],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-white p-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-black text-primary">{value}</p>
          </div>
        ))}
      </div>
      <RedeemBox />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-2xl border bg-white">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="font-bold text-primary">Recent broadcasts</h2>
            <Link to="/leadgen/portal/broadcasts" className="text-sm font-semibold text-primary hover:underline">
              All →
            </Link>
          </div>
          {data.recent.length === 0 ? (
            <EmptyState icon={MessageSquareText} title="No broadcasts yet" className="m-4 border-none" />
          ) : (
            <ul className="divide-y">
              {data.recent.map((b: Row) => (
                <li key={b.id}>
                  <Link to="/leadgen/portal/broadcasts/$id" params={{ id: String(b.id) }} className="flex items-center gap-3 px-5 py-3 hover:bg-muted">
                    {b.channel === "sms" ? <MessageSquareText className="size-5 text-primary" /> : <Mail className="size-5 text-primary" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{b.subject ?? b.preview}</span>
                      <span className="text-xs text-muted-foreground">
                        {b.sent_count}/{b.recipient_count} sent · {timeAgo(b.created_at)}
                      </span>
                    </span>
                    <StatusBadge status={b.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="font-bold text-primary">Sender IDs</h2>
          {data.senders.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">You're using the Capevars default sender.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.senders.map((s: Row) => (
                <li key={`${s.channel}-${s.sender}`} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    <span className="mr-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase">{s.channel}</span>
                    {s.sender}
                  </span>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/leadgen/portal/senders">Manage sender IDs</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="mt-2 w-full">
            <Link to="/leadgen/portal/leads">
              <Database /> My leads
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
