import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Coins, Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { Loading } from "#/components/site/kit";
import { PaymentBanner } from "#/components/site/payment-banner";
import { RedeemBox } from "#/components/leadgen/redeem-box";
import { useWallet } from "#/components/leadgen/hooks";

export const Route = createFileRoute("/_site/leadgen/portal/wallet")({
  validateSearch: z.object({ payment: z.string().optional().catch(undefined) }),
  component: WalletPage,
});

const TYPE: Record<string, string> = { purchase: "Credit purchase", voucher: "Voucher", admin: "Admin top-up", debit: "Broadcast", refund: "Refund" };

function WalletPage() {
  const { payment } = Route.useSearch();
  const { data } = useWallet();
  const buy = useMutation({
    mutationFn: (bundle: number) => api.post<{ authorizationUrl: string }>("/leadgen/portal/wallet/buy", { bundle }),
    onSuccess: (r) => (window.location.href = r.authorizationUrl),
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  return (
    <div className="space-y-6">
      <PaymentBanner status={payment} />
      <div className="hero-navy relative overflow-hidden rounded-2xl p-6 text-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center gap-6">
          <Coins className="size-12 text-brand-cream" />
          <div>
            <p className="text-sm text-white/60">Broadcast credit balance</p>
            <p className="text-4xl font-black">{Number(data.balance).toLocaleString()}</p>
          </div>
          <p className="ml-auto max-w-xs text-sm text-white/70">
            1 SMS (160 characters) = {data.smsCreditCost} credit{data.smsCreditCost === 1 ? "" : "s"} · 1 email = {data.emailCreditCost} credits
          </p>
        </div>
      </div>
      <section>
        <h2 className="mb-3 font-bold text-primary">Buy credits</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {data.bundles.map((b, i) => (
            <button
              key={b.credits}
              type="button"
              disabled={buy.isPending || !data.onlinePayments}
              onClick={() => buy.mutate(i)}
              className={cn("card-hover rounded-2xl border bg-white p-5 text-left disabled:opacity-60", i === 2 && "border-2 border-sys-leadgen")}
            >
              {i === 2 && <span className="mb-2 inline-block rounded-full bg-sys-leadgen px-2 py-0.5 text-[10px] font-bold text-white">Popular</span>}
              <p className="text-2xl font-black text-primary">{b.credits.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">credits</p>
              <p className="mt-3 text-lg font-bold">{formatMoney(b.price)}</p>
              <p className="text-[11px] text-muted-foreground">{formatMoney(b.price / b.credits)} each</p>
            </button>
          ))}
        </div>
        {buy.isPending && (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Opening secure checkout…
          </p>
        )}
        {!data.onlinePayments && <p className="mt-3 text-sm text-muted-foreground">Online payment isn't enabled yet — redeem a credit voucher below or contact support to top up.</p>}
      </section>
      <section>
        <h2 className="mb-3 font-bold text-primary">Redeem a voucher</h2>
        <RedeemBox />
      </section>
      <section className="overflow-hidden rounded-2xl border bg-white">
        <h2 className="border-b px-5 py-3 font-bold text-primary">Billing history</h2>
        {data.transactions.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Details</th>
                  <th className="px-4 py-2 text-right">Credits</th>
                  <th className="px-4 py-2 text-right">Paid</th>
                  <th className="px-4 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2 text-muted-foreground">{formatDateTime(t.created_at)}</td>
                    <td className="px-4 py-2">{TYPE[t.type] ?? t.type}</td>
                    <td className="px-4 py-2 text-xs">
                      {t.note}
                      {t.reference && <span className="ml-1 font-mono text-muted-foreground">{t.reference}</span>}
                    </td>
                    <td className={cn("px-4 py-2 text-right font-semibold", Number(t.credits) < 0 ? "text-destructive" : "text-success")}>
                      {Number(t.credits) > 0 ? "+" : ""}
                      {Number(t.credits).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right">{t.amount_ghs ? formatMoney(t.amount_ghs) : "—"}</td>
                    <td className="px-4 py-2 text-right">{Number(t.balance_after).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
