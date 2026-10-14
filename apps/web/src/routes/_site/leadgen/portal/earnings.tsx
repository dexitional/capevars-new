import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { Loading, StatusBadge } from "#/components/site/kit";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/leadgen/portal/earnings")({ component: EarningsPage });

function EarningsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["leadgen", "earnings"], queryFn: () => api.get<{ sales: Array<Row>; payouts: Array<Row>; earned: number; withdrawn: number; available: number; minPayout: number; feePercent: number }>("/leadgen/portal/earnings") });
  const [form, setForm] = useState({ amount: "", momoNumber: "", momoName: "" });
  const request = useMutation({
    mutationFn: () => api.post("/leadgen/portal/payouts", { ...form, amount: Number(form.amount) }),
    onSuccess: () => {
      toast.success("Payout requested — we'll send it to your MoMo shortly.");
      setForm({ amount: "", momoNumber: "", momoName: "" });
      void queryClient.invalidateQueries({ queryKey: ["leadgen", "earnings"] });
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-primary">Earnings</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total earned", data.earned],
          ["Withdrawn / requested", data.withdrawn],
          ["Available", data.available],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border bg-white p-5">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-1 text-2xl font-black text-primary">{formatMoney(v)}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">You keep {100 - data.feePercent}% of each list sale; Capevars keeps {data.feePercent}% to run the platform.</p>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-2xl border bg-white">
          <h2 className="border-b px-5 py-3 font-bold text-primary">Sales</h2>
          {data.sales.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No sales yet. Publish a priced lead list to start earning.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {data.sales.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2">
                      <p className="font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.buyer_name} · {formatDateTime(s.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-2 text-right text-xs text-muted-foreground">{formatMoney(s.amount_paid)}</td>
                    <td className="px-4 py-2 text-right font-bold text-success">+{formatMoney(s.owner_earning)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {data.payouts.length > 0 && (
            <>
              <h2 className="border-y px-5 py-3 font-bold text-primary">Payouts</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {data.payouts.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2">
                        {p.momo_number} · {p.momo_name}
                        {p.note && <p className="text-xs text-muted-foreground">{p.note}</p>}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{formatDateTime(p.created_at)}</td>
                      <td className="px-4 py-2 font-bold">{formatMoney(p.amount)}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={p.status === "requested" ? "pending" : p.status} label={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>
        <form
          className="h-fit space-y-4 rounded-2xl border bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault();
            request.mutate();
          }}
        >
          <h2 className="flex items-center gap-2 font-bold text-primary">
            <Wallet className="size-5" /> Withdraw to MoMo
          </h2>
          <Field label={`Amount (min ${formatMoney(data.minPayout)})`}>
            <Input inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </Field>
          <Field label="MoMo number">
            <Input type="tel" value={form.momoNumber} onChange={(e) => setForm({ ...form, momoNumber: e.target.value })} required />
          </Field>
          <Field label="Name on MoMo account">
            <Input value={form.momoName} onChange={(e) => setForm({ ...form, momoName: e.target.value })} required />
          </Field>
          <Button type="submit" className="w-full" disabled={request.isPending || data.available < data.minPayout}>
            Request payout
          </Button>
        </form>
      </div>
    </div>
  );
}
