import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Copy, Mail, MessageSquareText, XCircle } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { AdminPageHeader, Field, Panel, SearchInput, Segmented, errorToast } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { LEAD_CATEGORIES } from "#/components/leadgen/lead-card";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;
type Tab = "lists" | "senders" | "broadcasts" | "payouts" | "vouchers" | "wallets" | "status";

export const Route = createFileRoute("/admin/_admin/leadgen")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "lead-lists", "pending"), component: LeadGenAdmin });

function LeadGenAdmin() {
  const [tab, setTab] = useState<Tab>("lists");
  return (
    <div className="space-y-6">
      <AdminPageHeader title="LeadGen" description="Lead lists, sender IDs, broadcasts, credits and payouts." />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "lists", label: "Lead lists" },
          { value: "senders", label: "Sender IDs" },
          { value: "broadcasts", label: "Broadcasts" },
          { value: "payouts", label: "Payouts" },
          { value: "vouchers", label: "Credit vouchers" },
          { value: "wallets", label: "Wallets" },
          { value: "status", label: "Gateway status" },
        ]}
      />
      {tab === "lists" && (
        <ModerationTable
          key="lists"
          entity="lead-lists"
          defaultStatus="pending"
          columns={[
            { label: "List", render: (r) => <TitleCell title={r.title} sub={`${LEAD_CATEGORIES[r.category]}${r.subcategory ? ` · ${r.subcategory}` : ""} · by ${r.owner_name ?? "Capevars"}`} /> },
            { label: "Contacts", render: (r) => <span className="text-xs">{Number(r.contact_count).toLocaleString()} ({r.phone_count} phones · {r.email_count} emails)</span> },
            { label: "Price", render: (r) => <MoneyCell value={r.price} free /> },
            { label: "Terms", render: (r) => <span className="text-xs">{r.consent_confirmed ? "✓ consent confirmed" : "⚠ no consent"} · {r.allow_download ? "download" : "broadcast-only"}</span> },
            { label: "Users", render: (r) => <span className="text-xs">{r.access_count}</span> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}
      {tab === "senders" && (
        <>
          <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" /> Register each SMS sender ID in your SMSOnlineGH account (SMS Messaging → Sender names) before approving it here — unregistered senders are rejected by the gateway.
          </p>
          <ModerationTable
            key="senders"
            entity="sender-ids"
            defaultStatus="pending"
            columns={[
              { label: "Sender", render: (r) => <TitleCell title={<span className="font-mono">{r.title}</span>} sub={`${r.channel.toUpperCase()}${r.reply_to ? ` · replies to ${r.reply_to}` : ""}`} /> },
              { label: "Requested by", render: (r) => <span className="text-xs">{r.owner_name}<br />{r.owner_email}</span> },
              { label: "Purpose", render: (r) => <p className="max-w-sm text-xs">{r.purpose}{r.sample_message && <span className="mt-1 block text-muted-foreground italic">“{r.sample_message}”</span>}</p> },
              { label: "Requested", render: (r) => <DateCell value={r.created_at} /> },
              { label: "Status", render: (r) => <StatusCell row={r} /> },
            ]}
          />
        </>
      )}
      {tab === "broadcasts" && <Broadcasts />}
      {tab === "payouts" && (
        <ModerationTable
          key="payouts"
          entity="payouts"
          defaultStatus="requested"
          columns={[
            { label: "Payout", render: (r) => <TitleCell title={<MoneyCell value={r.amount} />} sub={`${r.momo_number} · ${r.momo_name}`} /> },
            { label: "Member", render: (r) => <span className="text-xs">{r.owner_name}<br />{r.owner_email}</span> },
            { label: "Note", render: (r) => <span className="text-xs">{r.note ?? "—"}</span> },
            { label: "Requested", render: (r) => <DateCell value={r.created_at} time /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}
      {tab === "vouchers" && <Vouchers />}
      {tab === "wallets" && <Wallets />}
      {tab === "status" && <GatewayStatus />}
    </div>
  );
}

function Broadcasts() {
  const cancel = useMutation({
    mutationFn: (id: number) => api.post(`/admin/leadgen/broadcasts/${id}/cancel`),
    onSuccess: () => toast.success("Cancelled and refunded"),
    onError: errorToast("Couldn't cancel."),
  });
  return (
    <ModerationTable
      key="broadcasts"
      entity="broadcasts"
      extra={(r, refresh) =>
        ["queued", "scheduled"].includes(r.status) ? (
          <Button size="xs" variant="outline" className="text-destructive" onClick={() => confirm("Cancel this broadcast and refund the member?") && cancel.mutate(r.id, { onSuccess: refresh })}>
            Cancel & refund
          </Button>
        ) : null
      }
      columns={[
        {
          label: "Broadcast",
          render: (r) => (
            <div className="flex max-w-md gap-2">
              {r.channel === "sms" ? <MessageSquareText className="mt-0.5 size-4 shrink-0 text-cyan-700" /> : <Mail className="mt-0.5 size-4 shrink-0 text-cyan-700" />}
              <div>
                <p className="font-semibold">
                  #{r.id} · {r.sender_label}
                </p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{r.subject ? `${r.subject} — ` : ""}{r.preview}</p>
              </div>
            </div>
          ),
        },
        { label: "Member", render: (r) => <span className="text-xs">{r.owner_name}</span> },
        { label: "Delivery", render: (r) => <span className="text-xs">{r.sent_count}/{r.recipient_count} sent{r.failed_count ? ` · ${r.failed_count} failed` : ""}</span> },
        { label: "Credits", render: (r) => <span className="text-xs">{r.cost_credits}{Number(r.refunded_credits) ? ` (−${r.refunded_credits})` : ""}</span> },
        { label: "When", render: (r) => <DateCell value={r.scheduled_at ?? r.created_at} time /> },
        { label: "Status", render: (r) => <div><StatusCell row={r} />{r.error && <p className="mt-1 max-w-48 text-xs text-amber-700">{r.error}</p>}</div> },
      ]}
    />
  );
}

function Vouchers() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-vouchers"], queryFn: () => api.get<{ items: Array<Row> }>("/admin/leadgen/vouchers") });
  const [f, setF] = useState({ credits: "100", count: "1", maxRedemptions: "1", expiresOn: "", note: "", code: "" });
  const [created, setCreated] = useState<Array<string>>([]);
  const create = useMutation({
    mutationFn: () => api.post<{ codes: Array<string> }>("/admin/leadgen/vouchers", { ...f, credits: Number(f.credits), count: Number(f.count), maxRedemptions: Number(f.maxRedemptions) }),
    onSuccess: (r) => {
      setCreated(r.codes);
      toast.success(`${r.codes.length} voucher(s) created`);
      void queryClient.invalidateQueries({ queryKey: ["admin-vouchers"] });
    },
    onError: errorToast("Couldn't create vouchers."),
  });
  const toggle = useMutation({
    mutationFn: (v: Row) => api.patch(`/admin/leadgen/vouchers/${v.id}`, { isActive: !v.is_active }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-vouchers"] }),
  });
  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Panel title="Create credit vouchers" description="Members redeem these codes for broadcast credits — for promotions, sponsors or cash top-ups.">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Credits each">
              <Input inputMode="numeric" value={f.credits} onChange={(e) => setF({ ...f, credits: e.target.value })} />
            </Field>
            <Field label="How many codes">
              <Input inputMode="numeric" value={f.count} onChange={(e) => setF({ ...f, count: e.target.value })} />
            </Field>
            <Field label="Uses per code">
              <Input inputMode="numeric" value={f.maxRedemptions} onChange={(e) => setF({ ...f, maxRedemptions: e.target.value })} />
            </Field>
            <Field label="Expires">
              <Input type="date" value={f.expiresOn} onChange={(e) => setF({ ...f, expiresOn: e.target.value })} />
            </Field>
          </div>
          {f.count === "1" && (
            <Field label="Custom code (optional)">
              <Input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} placeholder="e.g. FRESHERS50" />
            </Field>
          )}
          <Field label="Note">
            <Input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="e.g. SRC week promo" />
          </Field>
          <Button type="submit" disabled={create.isPending}>
            Generate
          </Button>
        </form>
        {created.length > 0 && (
          <div className="mt-4 rounded-lg bg-muted p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold">
              New codes
              <button type="button" onClick={() => (navigator.clipboard?.writeText(created.join("\n")), toast.success("Copied"))} className="flex items-center gap-1 text-info">
                <Copy className="size-3" /> Copy all
              </button>
            </div>
            <pre className="max-h-40 overflow-auto font-mono text-xs">{created.join("\n")}</pre>
          </div>
        )}
      </Panel>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.items.map((v) => (
              <tr key={v.id} className={v.is_active ? "" : "opacity-50"}>
                <td className="px-4 py-2 font-mono text-xs font-bold">{v.code}</td>
                <td className="px-4 py-2">{Number(v.credits).toLocaleString()}</td>
                <td className="px-4 py-2 text-xs">
                  {v.redeemed_count}/{v.max_redemptions}
                </td>
                <td className="px-4 py-2">
                  <DateCell value={v.expires_on} />
                </td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{v.note}</td>
                <td className="px-4 py-2 text-right">
                  <Button size="xs" variant="ghost" onClick={() => toggle.mutate(v)}>
                    {v.is_active ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Wallets() {
  const [q, setQ] = useState("");
  const { data, refetch } = useQuery({ queryKey: ["admin-wallets", q], queryFn: () => api.get<{ items: Array<Row> }>("/admin/leadgen/wallets", { q }) });
  const adjust = useMutation({
    mutationFn: ({ userId, credits, note }: { userId: number; credits: number; note: string }) => api.post<{ balance: number }>(`/admin/leadgen/wallets/${userId}/adjust`, { credits, note }),
    onSuccess: (r) => {
      toast.success(`New balance: ${r.balance}`);
      void refetch();
    },
    onError: errorToast("Couldn't adjust the wallet."),
  });
  return (
    <div className="space-y-4">
      <SearchInput value={q} onChange={setQ} placeholder="Find a member by name or email" className="w-80" />
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.items.map((w) => (
              <tr key={w.id}>
                <td className="px-4 py-2">
                  <TitleCell title={w.full_name} sub={w.email} />
                </td>
                <td className="px-4 py-2 font-bold">{Number(w.balance).toLocaleString()} credits</td>
                <td className="px-4 py-2">
                  <DateCell value={w.updated_at} time />
                </td>
                <td className="px-4 py-2 text-right">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      const amount = prompt(`Credits to add for ${w.full_name} (use a minus sign to remove)`);
                      if (!amount || Number.isNaN(Number(amount))) return;
                      const note = prompt("Reason (e.g. cash payment ref, goodwill)");
                      if (note && note.trim().length >= 3) adjust.mutate({ userId: w.id, credits: Number(amount), note });
                    }}
                  >
                    Add / remove credits
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.items.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">{q ? "No members match." : "No wallets yet — search for a member to top them up."}</p>}
      </div>
    </div>
  );
}

function GatewayStatus() {
  const { data } = useQuery({ queryKey: ["admin-leadgen-status"], queryFn: () => api.get<{ messaging: Row; smsBalance: { balance: number; model: string } | null; stats: Row }>("/admin/leadgen/status") });
  if (!data) return null;
  const m = data.messaging;
  const line = (ok: boolean, simulated: boolean, label: string, hint: string) => (
    <li className="flex items-start gap-3">
      {ok && !simulated ? <CheckCircle2 className="size-5 text-success" /> : simulated ? <AlertTriangle className="size-5 text-amber-600" /> : <XCircle className="size-5 text-destructive" />}
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{ok && !simulated ? "Connected" : simulated ? "Simulated (development) — nothing is really sent" : hint}</p>
      </div>
    </li>
  );
  const s = data.stats;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Gateways">
        <ul className="space-y-4 text-sm">
          {line(m.sms, m.simulated.sms, "SMS — SMSOnlineGH", "Set SMSONLINEGH_API_KEY in the server environment.")}
          {line(m.email, m.simulated.email, "Email — Gmail (Nodemailer)", "Set GMAIL_USER and GMAIL_APP_PASSWORD (a Google App Password).")}
        </ul>
        {data.smsBalance && (
          <p className="mt-5 rounded-lg bg-muted p-3 text-sm">
            SMSOnlineGH balance: <strong>{data.smsBalance.balance.toLocaleString()}</strong> ({data.smsBalance.model})
          </p>
        )}
      </Panel>
      <Panel title="Totals">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">SMS sent</dt>
            <dd className="text-lg font-bold">{Number(s.sms_sent).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Emails sent</dt>
            <dd className="text-lg font-bold">{Number(s.emails_sent).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Credit sales</dt>
            <dd className="text-lg font-bold">{formatMoney(s.credit_sales)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">List commission</dt>
            <dd className="text-lg font-bold">{formatMoney(s.list_commission)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Unused member credits</dt>
            <dd className="text-lg font-bold">{Number(s.outstanding_credits).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Email opt-outs</dt>
            <dd className="text-lg font-bold">{Number(s.optouts).toLocaleString()}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">Updated {formatDateTime(new Date().toISOString().slice(0, 19).replace("T", " "))}</p>
      </Panel>
    </div>
  );
}
