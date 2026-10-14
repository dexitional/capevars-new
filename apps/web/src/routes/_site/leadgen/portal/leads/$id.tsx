import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Download, Eye, Search, Send, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { Loading, StatusBadge } from "#/components/site/kit";
import { SheetImport } from "#/components/leadgen/sheet-import";
import { ListForm, toPayload } from "#/components/leadgen/list-form";
import type { ListFormValues } from "#/components/leadgen/list-form";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/leadgen/portal/leads/$id")({ component: ManageList });

function ManageList() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const { data, refetch } = useQuery({ queryKey: ["leadgen", "list-admin", id, page, q], queryFn: () => api.get<{ list: Row; contacts: Array<Row>; total: number; buyers: Array<Row> }>(`/leadgen/portal/lists/${id}`, { page, q }) });
  const { data: access } = useQuery({ queryKey: ["leadgen", "access"], queryFn: () => api.get<{ items: Array<Row> }>("/leadgen/portal/access") });
  const [form, setForm] = useState<ListFormValues | null>(null);
  useEffect(() => {
    const l = data?.list;
    if (l && !form)
      setForm({
        title: l.title,
        category: l.category,
        subcategory: l.subcategory ?? "",
        description: l.description ?? "",
        region: l.region ?? "",
        tags: l.tags ?? [],
        price: String(l.price),
        allowDownload: l.allow_download === 1,
        consentConfirmed: l.consent_confirmed === 1,
      });
  }, [data, form]);
  const refresh = () => {
    void refetch();
    void queryClient.invalidateQueries({ queryKey: ["leadgen", "my-lists"] });
  };
  const save = useMutation({
    mutationFn: (opts: { submit?: boolean; makePrivate?: boolean }) => api.patch(`/leadgen/portal/lists/${id}`, { ...toPayload(form!), ...opts }),
    onSuccess: (_, opts) => {
      toast.success(opts.submit ? "Submitted for review" : opts.makePrivate ? "List is now private" : "Saved");
      refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  const addContacts = useMutation({
    mutationFn: (contacts: Array<Record<string, unknown>>) => api.post<{ added: number; invalid: number; duplicates: number }>(`/leadgen/portal/lists/${id}/contacts`, { contacts }),
    onSuccess: (r) => {
      toast.success(`${r.added} added · ${r.duplicates} duplicates · ${r.invalid} invalid`);
      setAdding(false);
      refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  const removeContact = useMutation({ mutationFn: (cid: number) => api.delete(`/leadgen/portal/lists/${id}/contacts/${cid}`), onSuccess: refresh });
  const confirmBuyer = useMutation({
    mutationFn: (accessId: number) => api.post(`/leadgen/portal/requests/${accessId}/confirm`),
    onSuccess: () => {
      toast.success("Access granted");
      refresh();
    },
  });
  const remove = useMutation({
    mutationFn: () => api.delete(`/leadgen/portal/lists/${id}`),
    onSuccess: () => {
      toast.success("List deleted");
      void queryClient.invalidateQueries({ queryKey: ["leadgen"] });
      void navigate({ to: "/leadgen/portal/leads" });
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data || !form) return <Loading />;
  const l = data.list;
  const myVoucher = access?.items.find((a) => a.id === l.id)?.voucher_code;
  const copy = (t: string) => {
    void navigator.clipboard?.writeText(t);
    toast.success("Copied");
  };
  return (
    <div className="space-y-6">
      <Link to="/leadgen/portal/leads" className="text-sm text-muted-foreground hover:underline">
        ← My leads
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">{l.title}</h1>
          <p className="text-sm text-muted-foreground">
            {Number(l.contact_count).toLocaleString()} contacts · {l.phone_count} phones · {l.email_count} emails · {l.access_count} users
          </p>
        </div>
        <StatusBadge status={l.status === "private" ? "draft" : l.status} label={l.status === "pending" ? "in review" : l.status} />
      </div>
      {l.status_reason && ["rejected", "suspended"].includes(l.status) && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Moderator: {l.status_reason}</p>}
      <div className="grid gap-3 sm:grid-cols-3">
        {myVoucher && (
          <div className="rounded-2xl border bg-white p-4">
            <p className="text-xs text-muted-foreground">Your voucher (for broadcasts)</p>
            <button type="button" onClick={() => copy(myVoucher)} className="mt-1 flex items-center gap-2 font-mono font-black text-primary">
              {myVoucher} <Copy className="size-3.5" />
            </button>
          </div>
        )}
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-xs text-muted-foreground">Share code (gives others free access)</p>
          <button type="button" onClick={() => copy(l.share_code)} className="mt-1 flex items-center gap-2 font-mono font-black text-primary">
            {l.share_code} <Copy className="size-3.5" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-white p-4">
          <Button asChild size="sm">
            <Link to="/leadgen/portal/broadcast" search={{ voucher: myVoucher }}>
              <Send /> Broadcast
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={`/api/leadgen/portal/lists/${l.id}/download`}>
              <Download /> CSV
            </a>
          </Button>
          {l.status === "published" && (
            <Button asChild size="sm" variant="ghost">
              <Link to="/leadgen/l/$slug" params={{ slug: l.slug }}>
                <Eye /> View
              </Link>
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 font-bold text-primary">Details & pricing</h2>
        <ListForm value={form} onChange={setForm} />
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {l.status === "published" || l.status === "pending" ? (
            <Button variant="ghost" onClick={() => save.mutate({ makePrivate: true })}>
              Make private
            </Button>
          ) : null}
          <Button variant="outline" onClick={() => save.mutate({})} disabled={save.isPending}>
            Save changes
          </Button>
          {["private", "rejected"].includes(l.status) && (
            <Button onClick={() => save.mutate({ submit: true })} disabled={save.isPending || !form.consentConfirmed}>
              Submit for publishing
            </Button>
          )}
        </div>
      </section>

      {data.buyers.length > 0 && (
        <section className="overflow-hidden rounded-2xl border bg-white">
          <h2 className="border-b px-5 py-3 font-bold text-primary">People with access</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {data.buyers.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-2">
                    {b.full_name}
                    <span className="block text-xs text-muted-foreground">{b.email}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    via {b.source} · {formatDateTime(b.created_at)}
                  </td>
                  <td className="px-4 py-2">{Number(b.amount_paid) ? formatMoney(b.amount_paid) : "Free"}</td>
                  <td className="px-4 py-2 text-right">
                    {b.status === "pending" ? (
                      <Button size="xs" onClick={() => confirm(`Confirm you received ${formatMoney(b.amount_paid)} from ${b.full_name}?`) && confirmBuyer.mutate(b.id)}>
                        Confirm payment
                      </Button>
                    ) : (
                      <StatusBadge status={b.status} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <h2 className="mr-auto font-bold text-primary">Contacts ({data.total.toLocaleString()})</h2>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => (setQ(e.target.value), setPage(1))} placeholder="Search contacts" className="w-56 pl-8" />
          </div>
          <Button size="sm" variant="outline" onClick={() => setAdding(!adding)}>
            Add more from sheet
          </Button>
        </div>
        {adding && (
          <div className="border-b p-4">
            <SheetImport compact onContacts={(contacts) => addContacts.mutate(contacts as Array<Record<string, unknown>>)} />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Organisation</th>
                <th className="px-4 py-2">Location</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.contacts.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2">{c.name ?? "—"}</td>
                  <td className="px-4 py-2 font-mono text-xs">{c.phone ?? "—"}</td>
                  <td className="px-4 py-2 text-xs">{c.email ?? "—"}</td>
                  <td className="px-4 py-2 text-xs">{c.organization ?? "—"}</td>
                  <td className="px-4 py-2 text-xs">{c.location ?? "—"}</td>
                  <td className="px-2 py-2">
                    <button type="button" onClick={() => removeContact.mutate(c.id)} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Remove contact">
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.total > 50 && (
          <div className="flex items-center justify-between border-t p-3 text-sm">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span>
              Page {page} of {Math.ceil(data.total / 50)}
            </span>
            <Button size="sm" variant="outline" disabled={page * 50 >= data.total} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        )}
      </section>
      <div className="flex justify-end">
        <Button variant="ghost" className="text-destructive" onClick={() => confirm("Delete this list and all its contacts?") && remove.mutate()}>
          <Trash2 /> Delete list
        </Button>
      </div>
    </div>
  );
}
