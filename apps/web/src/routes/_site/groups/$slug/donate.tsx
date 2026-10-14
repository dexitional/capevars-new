import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { HandHeart, Smartphone } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDate, timeAgo } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { useMember } from "#/hooks/useMember";
import { EmptyState, Img, TextBlock } from "#/components/site/kit";
import { PaymentBanner } from "#/components/site/payment-banner";
import { useGroup } from "#/components/groups/use-group";
import { Field } from "#/components/admin/ui";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/groups/$slug/donate")({
  validateSearch: z.object({ payment: z.string().optional().catch(undefined) }),
  component: Donate,
});

function Campaign({ c, donors, online }: { c: Row; donors: Array<Row>; online: boolean }) {
  const member = useMember();
  const [amount, setAmount] = useState("50");
  const [method, setMethod] = useState<"online" | "momo_direct">(online && member ? "online" : "momo_direct");
  const [form, setForm] = useState({ donorName: member?.fullName ?? "", message: "", isAnonymous: false, momoReference: "" });
  const [done, setDone] = useState(false);
  const give = useMutation({
    mutationFn: () => api.post<{ authorizationUrl?: string }>(`/groups/campaigns/${c.id}/donate`, { ...form, amount: Number(amount), method }),
    onSuccess: (r) => {
      if (r.authorizationUrl) window.location.href = r.authorizationUrl;
      else setDone(true);
    },
    onError: (e) => toast.error(e.message),
  });
  const pct = Math.min(100, Math.round((Number(c.raised_amount) / Math.max(1, Number(c.goal_amount))) * 100));
  return (
    <article className="overflow-hidden rounded-2xl border bg-white">
      {c.cover_url && <Img src={c.cover_url} className="aspect-[3/1] w-full" />}
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="text-xl font-black text-primary">{c.title}</h2>
          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-sys-groups to-violet-400" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-sm">
              <strong className="text-lg text-primary">{formatMoney(c.raised_amount)}</strong> raised of {formatMoney(c.goal_amount)} · {c.donor_count} donors
              {c.ends_on ? ` · ends ${formatDate(c.ends_on)}` : ""}
            </p>
          </div>
          <TextBlock text={c.story} className="mt-4 text-sm leading-relaxed" />
          {donors.length > 0 && (
            <ul className="mt-5 space-y-2">
              {donors.slice(0, 8).map((d, i) => (
                <li key={i} className="flex justify-between rounded-xl bg-muted px-3 py-2 text-sm">
                  <span>
                    <strong>{d.donor_name}</strong> {d.message && <span className="text-muted-foreground">— “{d.message}”</span>}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {formatMoney(d.amount)} <span className="text-xs font-normal text-muted-foreground">{timeAgo(d.created_at)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {c.status !== "active" ? (
          <p className="h-fit rounded-xl bg-muted p-4 text-center text-sm">This campaign is closed. Thank you to everyone who gave!</p>
        ) : done ? (
          <div className="h-fit rounded-xl bg-emerald-50 p-5 text-center text-emerald-800">
            <HandHeart className="mx-auto size-10" />
            <p className="mt-2 font-bold">Thank you!</p>
            <p className="text-sm">Your gift will show once the group confirms your MoMo payment.</p>
          </div>
        ) : (
          <form
            className="h-fit space-y-3 rounded-2xl bg-muted p-4"
            onSubmit={(e) => {
              e.preventDefault();
              give.mutate();
            }}
          >
            <div className="grid grid-cols-4 gap-2">
              {["20", "50", "100", "200"].map((a) => (
                <button key={a} type="button" onClick={() => setAmount(a)} className={cn("rounded-lg border bg-white py-2 text-sm font-bold", amount === a && "border-sys-groups text-sys-groups")}>
                  ₵{a}
                </button>
              ))}
            </div>
            <Field label="Amount (GH₵)">
              <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-white" required />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              {online && member && (
                <button type="button" onClick={() => setMethod("online")} className={cn("rounded-lg border bg-white p-2 text-xs font-semibold", method === "online" && "border-primary")}>
                  Card / MoMo online
                </button>
              )}
              {c.momo_number && (
                <button type="button" onClick={() => setMethod("momo_direct")} className={cn("rounded-lg border bg-white p-2 text-xs font-semibold", method === "momo_direct" && "border-primary")}>
                  Send MoMo directly
                </button>
              )}
            </div>
            {method === "momo_direct" && c.momo_number && (
              <div className="rounded-xl bg-white p-3 text-sm">
                <p className="flex items-center gap-2 font-semibold">
                  <Smartphone className="size-4" /> Send to {c.momo_number}
                </p>
                <p className="text-xs text-muted-foreground">Name: {c.momo_name}. Then enter the transaction ID below.</p>
                <Input className="mt-2" placeholder="MoMo transaction ID" value={form.momoReference} onChange={(e) => setForm({ ...form, momoReference: e.target.value })} required />
              </div>
            )}
            <Input className="bg-white" placeholder="Your name" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} />
            <Input className="bg-white" placeholder="Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} /> Give anonymously
            </label>
            <Button type="submit" className="w-full bg-sys-groups" disabled={give.isPending || (method === "momo_direct" && !c.momo_number)}>
              <HandHeart /> Give {formatMoney(Number(amount) || 0)}
            </Button>
          </form>
        )}
      </div>
    </article>
  );
}

function Donate() {
  const { slug } = Route.useParams();
  const { payment } = Route.useSearch();
  const { data: g } = useGroup(slug);
  const { data } = useQuery({ queryKey: ["group-campaigns", g?.group.id], queryFn: () => api.get<{ campaigns: Array<Row>; donors: Array<Row> }>(`/groups/${g!.group.id}/campaigns`), enabled: Boolean(g) });
  const { data: pay } = useQuery({ queryKey: ["pay-config"], queryFn: () => api.get<{ online: boolean }>("/payments/config") });
  if (!g || !data) return null;
  return (
    <div className="space-y-6">
      <PaymentBanner status={payment} />
      {data.campaigns.length === 0 ? (
        <EmptyState icon={HandHeart} title="No fundraising campaigns" text={g.canManage ? "Start one from Manage → Donations." : undefined} />
      ) : (
        data.campaigns.map((c) => <Campaign key={c.id} c={c} donors={data.donors.filter((d) => d.campaign_id === c.id)} online={Boolean(pay?.online)} />)
      )}
    </div>
  );
}
