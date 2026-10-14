import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Download, Flag, Lock, Mail, Phone, Send, ShieldCheck, Users } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { formatDate } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { useRequireMember } from "#/hooks/useMember";
import { Avatar, Container, StatusBadge, TextBlock, Verified } from "#/components/site/kit";
import { LEAD_CATEGORIES } from "#/components/leadgen/lead-card";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const listQuery = (slug: string) => ({
  queryKey: ["leadgen", "list", slug],
  queryFn: () => api.get<{ list: Row; sample: Array<Row>; access: Row | null; isOwner: boolean; onlinePayments: boolean }>(`/leadgen/lists/${slug}`),
});

export const Route = createFileRoute("/_site/leadgen/l/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(listQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.list.title} | LeadGen` }] : [] }),
  component: LeadListPage,
});

function LeadListPage() {
  const { slug } = Route.useParams();
  const { data, refetch } = useQuery(listQuery(slug));
  const requireMember = useRequireMember();
  const get = useMutation({
    mutationFn: () => api.post<{ status: string; voucher?: string; authorizationUrl?: string | null }>(`/leadgen/lists/${data!.list.id}/get`),
    onSuccess: (r) => {
      if (r.authorizationUrl) {
        window.location.href = r.authorizationUrl;
        return;
      }
      toast.success(r.status === "active" ? "Added to your leads" : "Request sent — the owner will confirm your payment.");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return null;
  const l = data.list;
  const access = data.access;
  const active = access?.status === "active";
  const copy = (text: string) => {
    void navigator.clipboard?.writeText(text);
    toast.success("Copied");
  };
  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6">
            <span className="rounded-full bg-sys-leadgen/10 px-2.5 py-1 text-xs font-bold text-cyan-800">{LEAD_CATEGORIES[l.category]}</span>
            <h1 className="mt-3 text-2xl font-black text-primary sm:text-3xl">{l.title}</h1>
            <p className="mt-1 text-muted-foreground">{[l.subcategory, l.region].filter(Boolean).join(" · ")}</p>
            {data.isOwner && l.status !== "published" && <StatusBadge status={l.status} className="mt-3" />}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                [Users, l.contact_count, "contacts"],
                [Phone, l.phone_count, "phone numbers"],
                [Mail, l.email_count, "email addresses"],
              ].map(([Icon, n, label]) => {
                const I = Icon as typeof Users;
                return (
                  <div key={label as string} className="rounded-xl bg-muted p-4 text-center">
                    <I className="mx-auto size-5 text-primary" />
                    <p className="mt-1 text-xl font-black text-primary">{Number(n).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{label as string}</p>
                  </div>
                );
              })}
            </div>
            <TextBlock text={l.description} className="mt-5 text-sm leading-relaxed" />
            {l.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {l.tags.map((t: string) => (
                  <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <section className="overflow-hidden rounded-2xl border bg-white">
            <div className="flex items-center gap-2 border-b px-5 py-3">
              <Lock className="size-4 text-muted-foreground" />
              <p className="font-bold text-primary">Preview</p>
              <span className="text-xs text-muted-foreground">Details are masked until you have access.</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Organisation</th>
                    <th className="px-4 py-2">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono text-xs">
                  {data.sample.map((c, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2">{c.name ?? "—"}</td>
                      <td className="px-4 py-2">{c.phone ?? "—"}</td>
                      <td className="px-4 py-2">{c.email ?? "—"}</td>
                      <td className="px-4 py-2">{c.organization ?? "—"}</td>
                      <td className="px-4 py-2">{c.location ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-3xl font-black text-primary">{formatMoney(l.price, { free: "Free" })}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Send className="size-4" /> Use in SMS & email broadcasts
              </li>
              <li className="flex items-center gap-2">
                <Download className="size-4" /> {l.allow_download ? "CSV download included" : "Broadcast-only (no download)"}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4" /> Owner confirmed consent to share
              </li>
            </ul>
            {data.isOwner ? (
              <Button asChild className="mt-5 w-full">
                <Link to="/leadgen/portal/leads/$id" params={{ id: String(l.id) }}>
                  Manage this list
                </Link>
              </Button>
            ) : active ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-xl bg-accent p-3">
                  <p className="text-xs text-muted-foreground">Your voucher code</p>
                  <button type="button" onClick={() => copy(access!.voucher_code)} className="flex items-center gap-2 font-mono text-lg font-black text-primary">
                    {access!.voucher_code} <Copy className="size-4" />
                  </button>
                </div>
                <Button asChild className="w-full">
                  <Link to="/leadgen/portal/broadcast" search={{ voucher: access!.voucher_code }}>
                    <Send /> Broadcast to this list
                  </Link>
                </Button>
                {l.allow_download ? (
                  <Button asChild variant="outline" className="w-full">
                    <a href={`/api/leadgen/portal/lists/${l.id}/download`}>
                      <Download /> Download CSV
                    </a>
                  </Button>
                ) : null}
              </div>
            ) : access?.status === "pending" ? (
              <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Waiting for the owner to confirm your payment.</p>
            ) : (
              <Button className="mt-5 h-11 w-full rounded-xl" disabled={get.isPending} onClick={() => requireMember(() => get.mutate())}>
                {Number(l.price) === 0 ? "Get this list free" : data.onlinePayments ? `Buy for ${formatMoney(l.price)}` : "Request to buy"}
              </Button>
            )}
          </div>
          <div className="rounded-2xl border bg-white p-5 text-sm">
            <p className="text-xs text-muted-foreground">Shared by</p>
            {l.owner_username ? (
              <Link to="/u/$username" params={{ username: l.owner_username }} className="mt-2 flex items-center gap-2 font-semibold hover:underline">
                <Avatar src={l.owner_avatar} name={l.owner_name} size="sm" /> {l.owner_name} {l.owner_verified ? <Verified /> : null}
              </Link>
            ) : (
              <p className="mt-2 font-semibold">Capevars</p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Updated {formatDate(l.updated_at)} · used by {l.access_count} members
            </p>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <Flag className="mt-0.5 size-3.5 shrink-0" /> Contacts can unsubscribe from emails at any time. Report misuse to support.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
