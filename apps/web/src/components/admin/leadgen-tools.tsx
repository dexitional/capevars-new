// Admin-side LeadGen tools: creating sender IDs for members, Capevars' own
// private lead lists shared with chosen members (each until their own expiry
// date), and confirming members' mobile money top-ups.
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, UserPlus, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate } from "#/lib/format";
import { Field, Panel, SearchInput, Segmented, StatusPill, Switch, errorToast } from "#/components/admin/ui";
import { DateCell, TitleCell } from "#/components/admin/cells";
import { LEAD_CATEGORIES } from "#/components/leadgen/lead-card";
import { networkLabel } from "#/components/leadgen/momo-checkout";
import { StatusBadge } from "#/components/site/kit";
import { SheetImport } from "#/components/leadgen/sheet-import";
import type { SheetContact } from "#/components/leadgen/sheet-import";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;
type Member = { id: number; full_name: string; email: string };

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
const selectClass = "h-9 rounded-md border bg-white px-3 text-sm";

// Search members by name, email or username and pick one.
function MemberPicker({ onPick, exclude = [], placeholder = "Find a member by name or email" }: { onPick: (m: Member) => void; exclude?: Array<number>; placeholder?: string }) {
  const [q, setQ] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-leadgen-members", q],
    queryFn: () => api.get<{ items: Array<Member> }>("/admin/leadgen/members", { q }),
    enabled: q.trim().length >= 2,
  });
  const results = (data?.items ?? []).filter((m) => !exclude.includes(m.id));
  return (
    <div className="relative">
      <SearchInput value={q} onChange={setQ} placeholder={placeholder} className="w-full" />
      {q.trim().length >= 2 && (
        <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border bg-white shadow-lg">
          {results.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  onPick(m);
                  setQ("");
                }}
              >
                <span className="font-medium">{m.full_name}</span> <span className="text-xs text-muted-foreground">{m.email}</span>
              </button>
            </li>
          ))}
          {data && results.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No members match.</li>}
        </ul>
      )}
    </div>
  );
}

function PickedMember({ member, onClear }: { member: Member; onClear: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
      <span>
        <span className="font-medium">{member.full_name}</span> <span className="text-xs text-muted-foreground">{member.email}</span>
      </span>
      <button type="button" onClick={onClear} aria-label="Change member" className="text-muted-foreground hover:text-foreground">
        <X className="size-4" />
      </button>
    </div>
  );
}

// ---- Sender IDs -----------------------------------------------------------------------------------

export function CreateSender({ onCreated }: { onCreated: () => void }) {
  const [member, setMember] = useState<Member | null>(null);
  const [f, setF] = useState({ channel: "sms", sender: "", replyTo: "", purpose: "" });
  const create = useMutation({
    mutationFn: () => api.post("/admin/leadgen/senders", { userId: member!.id, ...f }),
    onSuccess: () => {
      toast.success(`Sender ID "${f.sender}" created and approved for ${member!.full_name}`);
      setF({ ...f, sender: "", replyTo: "", purpose: "" });
      setMember(null);
      onCreated();
    },
    onError: errorToast("Couldn't create the sender ID."),
  });
  return (
    <Panel title="Create a sender ID" description="Creates an approved sender ID for a member. If they already requested the same one, it's approved.">
      <form
        className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <Field label="Member" className="md:col-span-2">
          {member ? <PickedMember member={member} onClear={() => setMember(null)} /> : <MemberPicker onPick={setMember} />}
        </Field>
        <Field label="Channel">
          <select value={f.channel} onChange={(e) => setF({ ...f, channel: e.target.value })} className={selectClass}>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </Field>
        <Field label={f.channel === "sms" ? "Sender name (3–11 characters)" : "From name"}>
          <Input value={f.sender} maxLength={f.channel === "sms" ? 11 : 60} onChange={(e) => setF({ ...f, sender: e.target.value })} placeholder={f.channel === "sms" ? "e.g. UCCSRC" : "e.g. UCC SRC"} />
        </Field>
        {f.channel === "email" && (
          <Field label="Reply-to email" hint="Defaults to the member's email.">
            <Input type="email" value={f.replyTo} onChange={(e) => setF({ ...f, replyTo: e.target.value })} />
          </Field>
        )}
        <Field label="Purpose (optional)" className={f.channel === "email" ? "xl:col-span-3" : "md:col-span-2 xl:col-span-4"}>
          <Input value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })} placeholder="e.g. Hall announcements" />
        </Field>
        <div className="md:col-span-2 xl:col-span-4">
          <Button type="submit" disabled={!member || f.sender.trim().length < 2 || create.isPending}>
            <Plus /> Create sender ID
          </Button>
        </div>
      </form>
    </Panel>
  );
}

// ---- Private lead lists ---------------------------------------------------------------------------

export function PrivateLists() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const { data } = useQuery({ queryKey: ["admin-private-lists"], queryFn: () => api.get<{ items: Array<Row> }>("/admin/leadgen/lists") });
  if (openId) return <PrivateListDetail id={openId} onBack={() => setOpenId(null)} />;
  if (creating) return <NewPrivateList onDone={(id) => (setCreating(false), id && setOpenId(id))} />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Capevars' own lists. They never appear on LeadGen — only the members you share them with can use them, until each one's expiry date.</p>
        <Button onClick={() => setCreating(true)}>
          <Plus /> New private list
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">List</th>
              <th className="px-4 py-3">Contacts</th>
              <th className="px-4 py-3">Shared with</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.items.map((l) => (
              <tr key={l.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setOpenId(l.id)}>
                <td className="px-4 py-3">
                  <TitleCell title={l.title} sub={`${LEAD_CATEGORIES[l.category]} · ${l.allow_download ? "download allowed" : "broadcast-only"}`} />
                </td>
                <td className="px-4 py-3 text-xs">
                  {Number(l.contact_count).toLocaleString()} ({l.phone_count} phones · {l.email_count} emails)
                </td>
                <td className="px-4 py-3 text-xs">
                  {l.live_shares} active{Number(l.expired_shares) ? ` · ${l.expired_shares} expired` : ""}
                </td>
                <td className="px-4 py-3">
                  <DateCell value={l.created_at} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.items.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No private lists yet.</p>}
      </div>
    </div>
  );
}

function NewPrivateList({ onDone }: { onDone: (id?: number) => void }) {
  const queryClient = useQueryClient();
  const [contacts, setContacts] = useState<{ name: string; items: Array<SheetContact> } | null>(null);
  const [f, setF] = useState({ title: "", category: "other", description: "", allowDownload: false });
  const save = useMutation({
    mutationFn: () => api.post<{ id: number; added: number; invalid: number; duplicates: number }>("/admin/leadgen/lists", { ...f, contacts: contacts?.items ?? [] }),
    onSuccess: (r) => {
      toast.success(`${r.added.toLocaleString()} contacts saved${r.invalid ? ` · ${r.invalid} invalid skipped` : ""}${r.duplicates ? ` · ${r.duplicates} duplicates skipped` : ""}`);
      void queryClient.invalidateQueries({ queryKey: ["admin-private-lists"] });
      onDone(r.id);
    },
    onError: errorToast("Couldn't create the list."),
  });
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => onDone()}>
        <ArrowLeft /> Private lists
      </Button>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="1. Contacts" description="An Excel or CSV sheet with name, phone and/or email columns.">
          {contacts ? (
            <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
              <span>
                <strong>{contacts.items.length.toLocaleString()}</strong> contacts from {contacts.name}
              </span>
              <Button size="xs" variant="ghost" onClick={() => setContacts(null)}>
                Change
              </Button>
            </div>
          ) : (
            <SheetImport onContacts={(items, name) => setContacts({ items, name })} />
          )}
        </Panel>
        <Panel title="2. Details">
          <div className="space-y-3">
            <Field label="Title">
              <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. UCC hall executives 2026" />
            </Field>
            <Field label="Category">
              <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={selectClass}>
                {Object.entries(LEAD_CATEGORIES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description (optional)">
              <Textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            </Field>
            <Switch checked={f.allowDownload} onChange={(allowDownload) => setF({ ...f, allowDownload })} label="Allow CSV download" description="Off: members can broadcast to the list but never see the full contacts." />
          </div>
        </Panel>
      </div>
      <Button disabled={!contacts || f.title.trim().length < 3 || save.isPending} onClick={() => save.mutate()}>
        Create private list
      </Button>
    </div>
  );
}

type PendingShare = Member & { expiresOn: string };

function PrivateListDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const queryClient = useQueryClient();
  const key = ["admin-private-list", id];
  const { data, refetch } = useQuery({ queryKey: key, queryFn: () => api.get<{ list: Row; shares: Array<Row> }>(`/admin/leadgen/lists/${id}`) });
  const [pending, setPending] = useState<Array<PendingShare>>([]);
  const [defaultExpiry, setDefaultExpiry] = useState(inDays(30));
  const refresh = () => {
    void refetch();
    void queryClient.invalidateQueries({ queryKey: ["admin-private-lists"] });
  };
  const share = useMutation({
    mutationFn: () => api.post(`/admin/leadgen/lists/${id}/shares`, { shares: pending.map((p) => ({ userId: p.id, expiresOn: p.expiresOn || null })) }),
    onSuccess: () => {
      toast.success(`Shared with ${pending.length} member(s)`);
      setPending([]);
      refresh();
    },
    onError: errorToast("Couldn't share the list."),
  });
  const setExpiry = useMutation({
    mutationFn: ({ accessId, expiresOn }: { accessId: number; expiresOn: string | null }) => api.patch(`/admin/leadgen/shares/${accessId}`, { expiresOn }),
    onSuccess: () => (toast.success("Expiry updated"), refresh()),
    onError: errorToast("Couldn't update the expiry."),
  });
  const revoke = useMutation({
    mutationFn: (accessId: number) => api.delete(`/admin/leadgen/shares/${accessId}`),
    onSuccess: () => (toast.success("Access revoked"), refresh()),
    onError: errorToast("Couldn't revoke access."),
  });
  const addContacts = useMutation({
    mutationFn: (contacts: Array<SheetContact>) => api.post<{ added: number; invalid: number; duplicates: number }>(`/admin/leadgen/lists/${id}/contacts`, { contacts }),
    onSuccess: (r) => (toast.success(`${r.added.toLocaleString()} contacts added${r.duplicates ? ` · ${r.duplicates} duplicates skipped` : ""}`), refresh()),
    onError: errorToast("Couldn't add the contacts."),
  });
  const update = useMutation({
    mutationFn: (body: Row) => api.patch(`/admin/leadgen/lists/${id}`, body),
    onSuccess: refresh,
    onError: errorToast("Couldn't update the list."),
  });
  const remove = useMutation({
    mutationFn: () => api.delete(`/admin/leadgen/lists/${id}`),
    onSuccess: () => {
      toast.success("List deleted");
      void queryClient.invalidateQueries({ queryKey: ["admin-private-lists"] });
      onBack();
    },
    onError: errorToast("Couldn't delete the list."),
  });
  if (!data) return null;
  const l = data.list;
  const sharedIds = data.shares.filter((s) => s.status !== "revoked").map((s) => s.user_id as number);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft /> Private lists
        </Button>
        <Button variant="outline" size="sm" className="text-destructive" onClick={() => confirm(`Delete "${l.title}"? Everyone it's shared with loses access.`) && remove.mutate()}>
          <Trash2 /> Delete list
        </Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <Panel title={l.title} description={`${LEAD_CATEGORIES[l.category]} · ${Number(l.contact_count).toLocaleString()} contacts (${l.phone_count} phones · ${l.email_count} emails)`}>
            <div className="space-y-4">
              <Switch checked={Boolean(l.allow_download)} onChange={(allowDownload) => update.mutate({ allowDownload })} label="Allow CSV download" />
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">Add more contacts</p>
                <SheetImport compact onContacts={(items) => addContacts.mutate(items)} />
              </div>
            </div>
          </Panel>
          <Panel title="Share with members" description="Each member gets their own voucher code and keeps access until the end of their expiry day.">
            <div className="space-y-3">
              <Field label="Default expiry for new members" hint="Leave empty for no expiry.">
                <Input type="date" min={today()} value={defaultExpiry} onChange={(e) => setDefaultExpiry(e.target.value)} />
              </Field>
              <MemberPicker
                exclude={[...sharedIds, ...pending.map((p) => p.id)]}
                placeholder="Add a member…"
                onPick={(m) => setPending([...pending, { ...m, expiresOn: defaultExpiry }])}
              />
              {pending.length > 0 && (
                <ul className="divide-y rounded-lg border">
                  {pending.map((p, i) => (
                    <li key={p.id} className="flex items-center gap-2 p-2 text-sm">
                      <span className="min-w-0 flex-1 truncate" title={p.email}>
                        {p.full_name}
                      </span>
                      <Input
                        type="date"
                        min={today()}
                        value={p.expiresOn}
                        onChange={(e) => setPending(pending.map((x, j) => (j === i ? { ...x, expiresOn: e.target.value } : x)))}
                        className="w-40"
                        aria-label={`Expiry for ${p.full_name}`}
                      />
                      <button type="button" onClick={() => setPending(pending.filter((_, j) => j !== i))} aria-label={`Remove ${p.full_name}`} className="text-muted-foreground hover:text-foreground">
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Button disabled={!pending.length || share.isPending} onClick={() => share.mutate()}>
                <UserPlus /> Share with {pending.length || ""} member{pending.length === 1 ? "" : "s"}
              </Button>
            </div>
          </Panel>
        </div>
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Voucher</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.shares.map((s) => {
                const status = s.status === "revoked" ? "revoked" : s.expired ? "expired" : "active";
                return (
                  <tr key={s.id} className={status === "active" ? "" : "opacity-60"}>
                    <td className="px-4 py-2">
                      <TitleCell title={s.full_name} sub={s.email} />
                    </td>
                    <td className="px-4 py-2 font-mono text-xs font-bold">{s.voucher_code}</td>
                    <td className="px-4 py-2">
                      <Input
                        type="date"
                        min={today()}
                        defaultValue={s.expires_at ? String(s.expires_at).slice(0, 10) : ""}
                        key={`${s.id}-${s.expires_at}-${s.status}`}
                        disabled={status === "revoked"}
                        onBlur={(e) => {
                          const next = e.target.value || null;
                          const current = s.expires_at ? String(s.expires_at).slice(0, 10) : null;
                          if (next !== current) setExpiry.mutate({ accessId: s.id, expiresOn: next });
                        }}
                        className="w-40"
                        aria-label={`Expiry for ${s.full_name}`}
                        title={status === "revoked" ? "Add the member again to restore access" : status === "expired" ? "Pick a new date to restore access" : "Change and click away to save"}
                      />
                      {!s.expires_at && <span className="mt-1 block text-[11px] text-muted-foreground">No expiry</span>}
                    </td>
                    <td className="px-4 py-2">
                      <StatusPill status={status === "active" ? "approved" : status === "expired" ? "pending" : "rejected"} label={status === "expired" ? `expired ${formatDate(s.expires_at)}` : status} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      {s.status !== "revoked" && (
                        <Button size="xs" variant="ghost" className="text-destructive" onClick={() => confirm(`Revoke ${s.full_name}'s access?`) && revoke.mutate(s.id)}>
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {data.shares.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Not shared with anyone yet.</p>}
        </div>
      </div>
    </div>
  );
}

// ---- Mobile money top-ups -------------------------------------------------------------------

const REQUEST_STATUSES = [
  { value: "submitted", label: "To confirm" },
  { value: "awaiting", label: "Not paid yet" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
] as const;
type RequestStatus = (typeof REQUEST_STATUSES)[number]["value"];

// Members' manual mobile money transfers: check the payment arrived on the
// receiving wallet (the payee gets an SMS when one is claimed), then approve
// to add the credits, or reject with a reason the member sees.
export function CreditPayments() {
  const [status, setStatus] = useState<RequestStatus>("submitted");
  const [q, setQ] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["admin-credit-requests", status, q],
    queryFn: () => api.get<{ items: Array<Row>; counts: Record<string, number> }>("/admin/leadgen/credit-requests", { status, q }),
  });
  const act = useMutation({
    mutationFn: ({ id, action, body }: { id: number; action: "approve" | "reject"; body: Record<string, string> }) => api.post(`/admin/leadgen/credit-requests/${id}/${action}`, body),
    onSuccess: (_, v) => {
      toast.success(v.action === "approve" ? "Credits added to the member's wallet" : "Payment rejected");
      void refetch();
    },
    onError: errorToast("Couldn't update the payment."),
  });
  const resend = useMutation({
    mutationFn: (id: number) => api.post<{ status: string }>(`/admin/leadgen/credit-requests/${id}/alert`),
    onSuccess: (r) => toast.success(`SMS alert ${r.status}`),
    onError: errorToast("Couldn't send the SMS alert."),
    onSettled: () => void refetch(),
  });
  const counts = data?.counts ?? {};
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={status}
          onChange={setStatus}
          options={REQUEST_STATUSES.map((s) => ({ ...s, count: s.value === "all" ? undefined : (counts[s.value] ?? 0) }))}
        />
        <SearchInput value={q} onChange={setQ} placeholder="Reference, transaction ID, member" className="w-72" />
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Paid to</th>
              <th className="px-4 py-3">Transaction</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.items.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-4 py-3">
                  <p className="font-bold">GH₵ {Number(r.amount_ghs).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {Number(r.credits).toLocaleString()} credits · <span className="font-mono">{r.reference}</span>
                  </p>
                  <DateCell value={r.submitted_at ?? r.created_at} time />
                </td>
                <td className="px-4 py-3">
                  <TitleCell title={r.full_name} sub={[r.email, r.phone].filter(Boolean).join(" · ")} />
                </td>
                <td className="px-4 py-3 text-xs">
                  <p className="font-semibold">{networkLabel(r.network)}</p>
                  <p>
                    {r.account_number} · {r.account_name}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs">
                  {r.transaction_id ? <p className="font-mono text-sm font-bold">{r.transaction_id}</p> : <p className="text-muted-foreground">Not entered yet</p>}
                  {r.payer_phone && <p>From {r.payer_phone}</p>}
                  {r.alert_status && <p className={r.alert_status.startsWith("sent") ? "text-muted-foreground" : "text-destructive"}>SMS alert {r.alert_status}</p>}
                  {r.status === "submitted" && r.alert_status?.startsWith("failed") && (
                    <button type="button" className="mt-0.5 font-semibold text-primary underline disabled:opacity-50" disabled={resend.isPending} onClick={() => resend.mutate(r.id)}>
                      Resend alert
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  <StatusBadge status={r.status} label={REQUEST_STATUSES.find((s) => s.value === r.status)?.label} />
                  {r.admin_note && <p className="mt-1 max-w-48 text-muted-foreground">{r.admin_note}</p>}
                  {r.handled_by_name && <p className="mt-1 text-muted-foreground">by {r.handled_by_name}</p>}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {(r.status === "submitted" || r.status === "awaiting") && (
                    <div className="flex justify-end gap-1">
                      <Button
                        size="xs"
                        disabled={act.isPending}
                        onClick={() => {
                          if (confirm(`Add ${Number(r.credits).toLocaleString()} credits to ${r.full_name}? Only approve once GH₵ ${Number(r.amount_ghs).toFixed(2)} has arrived on ${r.account_number}.`)) {
                            act.mutate({ id: r.id, action: "approve", body: {} });
                          }
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="text-destructive"
                        disabled={act.isPending}
                        onClick={() => {
                          const reason = prompt("Why? The member sees this.", "We couldn't find this payment. Check the transaction ID.");
                          if (reason && reason.trim().length >= 3) act.mutate({ id: r.id, action: "reject", body: { reason } });
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.items.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No payments here.</p>}
      </div>
    </div>
  );
}
