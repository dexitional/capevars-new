import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Database, Download, Plus, Send } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatMoney } from "#/lib/money";
import { EmptyState, Loading, SectionHeader, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/leadgen/portal/leads/")({ component: MyLeads });

const copy = (t: string) => {
  void navigator.clipboard?.writeText(t);
  toast.success("Copied");
};

function MyLeads() {
  const { data: owned } = useQuery({ queryKey: ["leadgen", "my-lists"], queryFn: () => api.get<{ items: Array<Row> }>("/leadgen/portal/lists") });
  const { data: access } = useQuery({ queryKey: ["leadgen", "access"], queryFn: () => api.get<{ items: Array<Row> }>("/leadgen/portal/access") });
  if (!owned || !access) return <Loading />;
  const acquired = access.items.filter((a) => !a.is_owner);
  return (
    <div className="space-y-10">
      <section>
        <SectionHeader
          title="Lists I created"
          text="Private lists are only for your own broadcasts. Publish one to share it free or sell it."
          action={
            <Button asChild size="sm">
              <Link to="/leadgen/portal/leads/new">
                <Plus /> New list from Excel/CSV
              </Link>
            </Button>
          }
        />
        {owned.items.length === 0 ? (
          <EmptyState icon={Database} title="No lists yet" text="Upload a sheet of contacts to broadcast to them, or to share or sell them as a lead list." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">List</th>
                  <th className="px-4 py-3">Contacts</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Users</th>
                  <th className="px-4 py-3">Earned</th>
                  <th className="px-4 py-3">Voucher</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {owned.items.map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3">
                      <Link to="/leadgen/portal/leads/$id" params={{ id: String(l.id) }} className="font-semibold text-primary hover:underline">
                        {l.title}
                      </Link>
                      {l.pending_requests > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">{l.pending_requests} to confirm</span>}
                    </td>
                    <td className="px-4 py-3">
                      {Number(l.contact_count).toLocaleString()}
                      <span className="block text-xs text-muted-foreground">
                        {l.phone_count} phones · {l.email_count} emails
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatMoney(l.price, { free: "Free" })}</td>
                    <td className="px-4 py-3">{l.access_count}</td>
                    <td className="px-4 py-3">{formatMoney(l.earned)}</td>
                    <td className="px-4 py-3">
                      {l.voucher_code && (
                        <button type="button" onClick={() => copy(l.voucher_code)} className="inline-flex items-center gap-1 font-mono text-xs font-bold">
                          {l.voucher_code} <Copy className="size-3" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={l.status === "private" ? "draft" : l.status} label={l.status === "pending" ? "in review" : l.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section>
        <SectionHeader title="Lists I got" text="Use the voucher code to target a list in a broadcast." action={<Link to="/leadgen/browse" className="text-sm font-semibold text-primary hover:underline">Browse more →</Link>} />
        {acquired.length === 0 ? (
          <EmptyState icon={Database} title="You haven't got any lists yet" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {acquired.map((a) => (
              <div key={a.access_id} className="rounded-2xl border bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/leadgen/l/$slug" params={{ slug: a.slug }} className="font-semibold text-primary hover:underline">
                    {a.title}
                  </Link>
                  <StatusBadge status={a.access_status} label={a.access_status === "pending" ? "awaiting payment" : undefined} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {Number(a.contact_count).toLocaleString()} contacts · {a.phone_count} phones · {a.email_count} emails · via {a.source}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => copy(a.voucher_code)} className="inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 font-mono text-xs font-bold text-primary">
                    {a.voucher_code} <Copy className="size-3" />
                  </button>
                  {a.access_status === "active" && (
                    <>
                      <Button asChild size="xs">
                        <Link to="/leadgen/portal/broadcast" search={{ voucher: a.voucher_code }}>
                          <Send /> Broadcast
                        </Link>
                      </Button>
                      {a.allow_download ? (
                        <Button asChild size="xs" variant="outline">
                          <a href={`/api/leadgen/portal/lists/${a.id}/download`}>
                            <Download /> CSV
                          </a>
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
