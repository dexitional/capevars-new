import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IdCard, Mail, MessageSquareText, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { timeAgo } from "#/lib/format";
import { EmptyState, Loading, StatusBadge } from "#/components/site/kit";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";
import { useMember } from "#/hooks/useMember";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/leadgen/portal/senders")({ component: SendersPage });

function SendersPage() {
  const member = useMember()!;
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["leadgen", "senders"], queryFn: () => api.get<{ items: Array<Row>; defaults: { sms: string; email: string } }>("/leadgen/portal/senders") });
  const [form, setForm] = useState({ channel: "sms" as "sms" | "email", sender: "", replyTo: member.email, purpose: "", sampleMessage: "" });
  const save = useMutation({
    mutationFn: () => api.post("/leadgen/portal/senders", form),
    onSuccess: () => {
      toast.success("Submitted for approval");
      setForm({ ...form, sender: "", purpose: "", sampleMessage: "" });
      void queryClient.invalidateQueries({ queryKey: ["leadgen", "senders"] });
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/leadgen/portal/senders/${id}`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["leadgen", "senders"] }),
  });
  if (!data) return <Loading />;
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-2xl font-black text-primary">Sender IDs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose who your messages appear to come from. Without your own, messages use <strong>{data.defaults.sms}</strong> (SMS) and <strong>{data.defaults.email}</strong> (email).
        </p>
        {data.items.length === 0 ? (
          <EmptyState icon={IdCard} title="No sender IDs yet" className="mt-6" />
        ) : (
          <ul className="mt-6 space-y-3">
            {data.items.map((s) => (
              <li key={s.id} className="flex items-start gap-4 rounded-2xl border bg-white p-4">
                {s.channel === "sms" ? <MessageSquareText className="mt-1 size-5 text-cyan-700" /> : <Mail className="mt-1 size-5 text-cyan-700" />}
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-lg font-black text-primary">{s.sender}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.channel.toUpperCase()} · requested {timeAgo(s.created_at)}
                    {s.reply_to ? ` · replies to ${s.reply_to}` : ""}
                  </p>
                  <p className="mt-1 text-sm">{s.purpose}</p>
                  {s.status_reason && <p className="mt-1 text-sm text-destructive">{s.status_reason}</p>}
                </div>
                <StatusBadge status={s.status} />
                <button type="button" onClick={() => confirm("Remove this sender ID?") && remove.mutate(s.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive" aria-label="Remove">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form
        className="h-fit space-y-4 rounded-2xl border bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <h2 className="font-bold text-primary">Register a sender</h2>
        <div className="grid grid-cols-2 gap-2">
          {(["sms", "email"] as const).map((c) => (
            <button key={c} type="button" onClick={() => setForm({ ...form, channel: c })} className={cn("rounded-xl border px-3 py-2 text-sm font-semibold", form.channel === c ? "border-sys-leadgen bg-cyan-50 text-cyan-800" : "")}>
              {c === "sms" ? "SMS sender ID" : "Email sender name"}
            </button>
          ))}
        </div>
        <Field label={form.channel === "sms" ? "Sender ID" : "Sender name"} hint={form.channel === "sms" ? "3–11 letters/numbers, e.g. SRC UCC or MYSHOP. Must be your brand or name." : "Shown as the From name, e.g. Kofi's Kitchen."}>
          <Input value={form.sender} maxLength={form.channel === "sms" ? 11 : 60} onChange={(e) => setForm({ ...form, sender: e.target.value })} required />
        </Field>
        {form.channel === "email" && (
          <Field label="Reply-to email" hint="Replies to your broadcasts go here.">
            <Input type="email" value={form.replyTo} onChange={(e) => setForm({ ...form, replyTo: e.target.value })} />
          </Field>
        )}
        <Field label="What will you send?">
          <Textarea rows={3} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Event announcements to our association members" required />
        </Field>
        <Field label="Sample message (optional)">
          <Textarea rows={2} value={form.sampleMessage} onChange={(e) => setForm({ ...form, sampleMessage: e.target.value })} />
        </Field>
        <Button type="submit" className="w-full" disabled={save.isPending}>
          Submit for approval
        </Button>
        <p className="text-[11px] text-muted-foreground">SMS sender IDs are registered with the network gateway before approval, which can take 1–3 working days.</p>
      </form>
    </div>
  );
}
