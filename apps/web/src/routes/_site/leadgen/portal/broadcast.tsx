import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { AlertTriangle, CalendarClock, Coins, Loader2, Mail, MessageSquareText, Plus, Send, Users, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { EmptyState, Loading } from "#/components/site/kit";
import { SheetImport } from "#/components/leadgen/sheet-import";
import type { SheetContact } from "#/components/leadgen/sheet-import";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/leadgen/portal/broadcast")({
  validateSearch: z.object({ voucher: z.string().optional().catch(undefined) }),
  component: Composer,
});

// Client-side mirror of the server's SMS segment count (GSM-7 vs Unicode).
const GSM = "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM_EXT = "^{}\\[~]|€";
function segments(text: string) {
  let len = 0;
  for (const ch of text) {
    if (GSM.includes(ch)) len += 1;
    else if (GSM_EXT.includes(ch)) len += 2;
    else {
      const u = [...text].length;
      return { length: u, unicode: true, parts: u <= 70 ? 1 : Math.ceil(u / 67), limit: u <= 70 ? 70 : 67 * Math.ceil(u / 67) };
    }
  }
  return { length: len, unicode: false, parts: len <= 160 ? 1 : Math.ceil(len / 153), limit: len <= 160 ? 160 : 153 * Math.ceil(len / 153) };
}

function Composer() {
  const { voucher } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [channel, setChannel] = useState<"sms" | "email">("sms");
  const [senderId, setSenderId] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [accessIds, setAccessIds] = useState<Array<number>>([]);
  const [vouchers, setVouchers] = useState<Array<string>>(voucher ? [voucher] : []);
  const [voucherText, setVoucherText] = useState("");
  const [uploaded, setUploaded] = useState<{ name: string; contacts: Array<SheetContact> } | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const accessQuery = useQuery({ queryKey: ["leadgen", "access"], queryFn: () => api.get<{ items: Array<Row> }>("/leadgen/portal/access") });
  const sendersQuery = useQuery({ queryKey: ["leadgen", "senders"], queryFn: () => api.get<{ items: Array<Row>; defaults: { sms: string; email: string } }>("/leadgen/portal/senders") });
  const { data: access } = accessQuery;
  const { data: senders } = sendersQuery;
  const lists = useMemo(() => (access?.items ?? []).filter((l) => l.access_status === "active"), [access]);
  const approvedSenders = (senders?.items ?? []).filter((s) => s.channel === channel && s.status === "approved");
  useEffect(() => setSenderId(null), [channel]);

  // Vouchers that match one of my lists become checked lists.
  useEffect(() => {
    if (!lists.length || !vouchers.length) return;
    const match = lists.filter((l) => vouchers.includes(l.voucher_code));
    if (match.length) {
      setAccessIds((ids) => [...new Set([...ids, ...match.map((m) => m.access_id as number)])]);
      setVouchers((v) => v.filter((code) => !match.some((m) => m.voucher_code === code)));
    }
  }, [lists, vouchers]);

  const audience = useMemo(() => ({ accessIds, vouchers, contacts: uploaded?.contacts ?? [] }), [accessIds, vouchers, uploaded]);
  const hasAudience = accessIds.length + vouchers.length + (uploaded?.contacts.length ?? 0) > 0;
  const [debouncedBody, setDebouncedBody] = useState(body);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedBody(body), 400);
    return () => clearTimeout(t);
  }, [body]);
  const est = useQuery({
    queryKey: ["leadgen", "estimate", channel, debouncedBody, audience],
    queryFn: () => api.post<{ recipients: number; invalid: number; optedOut: number; segments: number; perRecipient: number; cost: number; balance: number }>("/leadgen/portal/broadcasts/estimate", { channel, body: debouncedBody, audience }),
    enabled: hasAudience,
    retry: false,
  });
  const seg = segments(body);
  const send = useMutation({
    mutationFn: () =>
      api.post<{ id: number }>("/leadgen/portal/broadcasts", {
        channel,
        senderId,
        subject: channel === "email" ? subject : undefined,
        body,
        audience,
        scheduledAt: schedule ? scheduledAt : null,
      }),
    onSuccess: (r) => {
      toast.success(schedule ? "Broadcast scheduled" : "Broadcast queued — sending now");
      void queryClient.invalidateQueries({ queryKey: ["leadgen"] });
      void navigate({ to: "/leadgen/portal/broadcasts/$id", params: { id: String(r.id) } });
    },
    onError: (e) => toast.error(e.message),
  });
  const setupError = (!access && accessQuery.error) || (!senders && sendersQuery.error);
  if (setupError) {
    const retrying = accessQuery.isFetching || sendersQuery.isFetching;
    return (
      <div role="alert">
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load the broadcast composer"
          text={setupError.message}
          action={<Button disabled={retrying} onClick={() => { void accessQuery.refetch(); void sendersQuery.refetch(); }}>{retrying ? "Retrying…" : "Try again"}</Button>}
        />
      </div>
    );
  }
  if (!access || !senders) return <Loading />;
  const short = est.data ? est.data.cost > est.data.balance : false;
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-5">
        <h1 className="text-2xl font-black text-primary">New broadcast</h1>
        <section className="rounded-2xl border bg-white p-5">
          <p className="mb-3 text-sm font-bold text-primary">1. Channel & sender</p>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["sms", "Bulk SMS", MessageSquareText],
                ["email", "Bulk email", Mail],
              ] as const
            ).map(([key, label, Icon]) => (
              <button key={key} type="button" onClick={() => setChannel(key)} className={cn("flex min-w-0 flex-col items-start gap-2 rounded-xl border-2 p-3 text-left sm:flex-row sm:items-center sm:gap-3 sm:p-4", channel === key ? "border-sys-leadgen bg-cyan-50" : "border-border")}>
                <Icon className="size-5 shrink-0 text-cyan-700" />
                <span className="font-semibold">{label}</span>
              </button>
            ))}
          </div>
          <Field label={channel === "sms" ? "Sender ID" : "Sender name"} className="mt-4" hint={<Link to="/leadgen/portal/senders" className="underline">Register your own sender</Link>}>
            <select value={senderId ?? ""} onChange={(e) => setSenderId(e.target.value ? Number(e.target.value) : null)} className="h-9 w-full min-w-0 max-w-full rounded-md border border-input bg-white px-3 text-sm">
              <option value="">{channel === "sms" ? senders.defaults.sms : senders.defaults.email} (Capevars default)</option>
              {approvedSenders.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sender}
                </option>
              ))}
            </select>
          </Field>
        </section>

        <section className="rounded-2xl border bg-white p-5">
          <p className="mb-3 text-sm font-bold text-primary">2. Audience</p>
          {lists.length === 0 ? (
            <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              You have no lead lists yet.{" "}
              <Link to="/leadgen/browse" className="font-semibold underline">
                Browse lists
              </Link>{" "}
              or upload contacts below.
            </p>
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto">
              {lists.map((l) => {
                const count = channel === "sms" ? l.phone_count : l.email_count;
                const checked = accessIds.includes(l.access_id);
                return (
                  <li key={l.access_id}>
                    <label className={cn("flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border p-3", checked && "border-sys-leadgen bg-cyan-50", !count && "opacity-50")}>
                      <input
                        type="checkbox"
                        className="size-4 shrink-0 accent-cyan-700"
                        disabled={!count}
                        checked={checked}
                        onChange={(e) => setAccessIds(e.target.checked ? [...accessIds, l.access_id] : accessIds.filter((id) => id !== l.access_id))}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{l.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {Number(count).toLocaleString()} {channel === "sms" ? "phones" : "emails"} · {l.is_owner ? "yours" : l.source}
                        </span>
                      </span>
                      <span className="max-w-full rounded-md bg-muted px-2 py-1 font-mono text-[11px] font-bold break-all">{l.voucher_code}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Add a list by voucher code</p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const v = voucherText.trim().toUpperCase();
                if (v && !vouchers.includes(v)) setVouchers([...vouchers, v]);
                setVoucherText("");
              }}
            >
              <Input value={voucherText} onChange={(e) => setVoucherText(e.target.value.toUpperCase())} placeholder="LV…" className="font-mono" />
              <Button type="submit" variant="outline">
                <Plus /> Add
              </Button>
            </form>
            {vouchers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {vouchers.map((v) => (
                  <span key={v} className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-mono text-xs">
                    <span className="min-w-0 break-all">{v}</span>
                    <button type="button" className="shrink-0" onClick={() => setVouchers(vouchers.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4">
            {uploaded ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted p-3 text-sm">
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  <Users className="mr-1.5 inline size-4" />
                  {uploaded.contacts.length.toLocaleString()} contacts from <strong>{uploaded.name}</strong>
                </span>
                <button type="button" onClick={() => setUploaded(null)} className="text-xs font-semibold text-destructive">
                  Remove
                </button>
              </div>
            ) : showUpload ? (
              <SheetImport compact onContacts={(contacts, name) => (setUploaded({ contacts, name }), setShowUpload(false))} />
            ) : (
              <button type="button" onClick={() => setShowUpload(true)} className="text-sm font-semibold text-cyan-700 hover:underline">
                + Upload contacts from Excel/CSV for this broadcast
              </button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-5">
          <p className="mb-3 text-sm font-bold text-primary">3. Message</p>
          {channel === "email" && (
            <Field label="Subject" className="mb-4">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Hi {name}, you're invited!" />
            </Field>
          )}
          <Textarea rows={channel === "sms" ? 5 : 10} value={body} onChange={(e) => setBody(e.target.value)} placeholder={channel === "sms" ? "Hello {name}, …" : "Write your email. Links are clickable. Use {name} to personalise."} />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <button type="button" onClick={() => setBody((b) => `${b}{name}`)} className="rounded-full border px-2.5 py-1 font-semibold hover:bg-muted">
              + Insert {"{name}"}
            </button>
            {channel === "sms" ? (
              <span className={cn(seg.parts > 1 && "font-semibold text-amber-700")}>
                {seg.length}/{seg.limit} characters · {seg.parts} SMS {seg.unicode ? "· Unicode (emoji/special characters)" : ""}
              </span>
            ) : (
              <span>An unsubscribe link is added automatically.</span>
            )}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={schedule} onChange={(e) => setSchedule(e.target.checked)} className="accent-cyan-700" />
            <CalendarClock className="size-4" /> Schedule for later
          </label>
          {schedule && (
            <Field label="Send at (GMT)" className="mt-2 max-w-xs">
              <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </Field>
          )}
        </section>
      </div>

      <aside className="h-fit min-w-0 space-y-4 xl:sticky xl:top-24">
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold text-primary">
            <Coins className="size-5" /> Summary
          </h2>
          {!hasAudience ? (
            <p className="mt-3 text-sm text-muted-foreground">Choose who to send to.</p>
          ) : est.isError ? (
            <p className="mt-3 text-sm text-destructive">{est.error.message}</p>
          ) : !est.data ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Counting recipients…
            </p>
          ) : (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Recipients</dt>
                <dd className="font-bold">{est.data.recipients.toLocaleString()}</dd>
              </div>
              {(est.data.invalid > 0 || est.data.optedOut > 0) && (
                <p className="text-xs text-muted-foreground">
                  {est.data.invalid > 0 && `${est.data.invalid} invalid skipped. `}
                  {est.data.optedOut > 0 && `${est.data.optedOut} opted out.`}
                </p>
              )}
              {channel === "sms" && (
                <div className="flex justify-between">
                  <dt>SMS per recipient</dt>
                  <dd>{est.data.segments}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Credits per recipient</dt>
                <dd>{est.data.perRecipient}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-black text-primary">
                <dt>Total cost</dt>
                <dd>{est.data.cost.toLocaleString()} credits</dd>
              </div>
              <div className={cn("flex justify-between", short ? "text-destructive" : "text-muted-foreground")}>
                <dt>Your balance</dt>
                <dd>{Number(est.data.balance).toLocaleString()}</dd>
              </div>
            </dl>
          )}
          {short && (
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link to="/leadgen/portal/wallet">Top up credits</Link>
            </Button>
          )}
          <Button
            className="mt-4 h-11 w-full rounded-xl bg-sys-leadgen hover:bg-sys-leadgen/90"
            disabled={!est.data?.recipients || !body.trim() || short || send.isPending || (channel === "email" && !subject.trim()) || (schedule && !scheduledAt)}
            onClick={() => confirm(`Send to ${est.data?.recipients.toLocaleString()} recipients for ${est.data?.cost} credits?`) && send.mutate()}
          >
            {send.isPending ? <Loader2 className="animate-spin" /> : <Send />} {schedule ? "Schedule broadcast" : "Send now"}
          </Button>
          <p className="mt-3 text-[11px] text-muted-foreground">Credits for failed deliveries are refunded automatically. Only message people who expect to hear from you.</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 text-sm">
          <p className="font-bold text-primary">Preview</p>
          <div className={cn("mt-3 rounded-2xl p-3 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]", channel === "sms" ? "rounded-bl-sm bg-slate-100" : "border")}>
            {channel === "email" && <p className="mb-2 font-semibold">{subject.replace(/\{name\}/gi, "Ama") || "(subject)"}</p>}
            {body.replace(/\{name\}/gi, "Ama") || "Your message appears here."}
          </div>
        </div>
      </aside>
    </div>
  );
}
