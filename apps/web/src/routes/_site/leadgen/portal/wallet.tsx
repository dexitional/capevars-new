import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeftRight, Coins } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { MAX_CREDIT_PURCHASE, MIN_CREDIT_PURCHASE, creditPrice, creditRate, creditsFor } from "#/lib/credits";
import type { CreditBundle } from "#/lib/credits";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Loading, StatusBadge } from "#/components/site/kit";
import { PaymentBanner } from "#/components/site/payment-banner";
import { RedeemBox } from "#/components/leadgen/redeem-box";
import { useWallet } from "#/components/leadgen/hooks";
import { CreditCheckout, NetworkBadge, networkLabel } from "#/components/leadgen/momo-checkout";
import type { CreditRequest, Purchase } from "#/components/leadgen/momo-checkout";

export const Route = createFileRoute("/_site/leadgen/portal/wallet")({
  validateSearch: z.object({ payment: z.string().optional().catch(undefined) }),
  component: WalletPage,
});

const TYPE: Record<string, string> = { purchase: "Credit purchase", voucher: "Voucher", admin: "Admin top-up", debit: "Broadcast", refund: "Refund" };

// Buy any number of credits: type credits to see the price, or a cedi amount
// to see how many credits it buys. The server prices the credits the same way.
function CustomTopUp({ bundles, smsCreditCost, disabled, onBuy }: { bundles: Array<CreditBundle>; smsCreditCost: number; disabled: boolean; onBuy: (credits: number) => void }) {
  const [credits, setCredits] = useState("");
  const [amount, setAmount] = useState("");
  const n = Number(credits) || 0;
  const price = creditPrice(bundles, n);
  const fromCredits = (v: string) => {
    const c = v.replace(/\D/g, "").slice(0, String(MAX_CREDIT_PURCHASE).length);
    setCredits(c);
    setAmount(c ? creditPrice(bundles, Number(c)).toFixed(2) : "");
  };
  const fromAmount = (v: string) => {
    const a = v.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1").replace(/(\.\d{2})\d+$/, "$1");
    setAmount(a);
    const c = creditsFor(bundles, Number(a));
    setCredits(c ? String(c) : "");
  };
  const tooSmall = n > 0 && price < MIN_CREDIT_PURCHASE;
  // A bigger bundle that costs no more than this amount.
  const better = bundles.filter((b) => b.credits > n && b.price <= price).sort((a, b) => a.price - b.price)[0];
  const typedAmount = Number(amount) || 0;
  return (
    <form
      className="mt-3 rounded-2xl border bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (n > 0 && !tooSmall) onBuy(n);
      }}
    >
      <p className="font-semibold text-primary">Or choose your own amount</p>
      <div className="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr_auto]">
        <Field label="Credits">
          <Input inputMode="numeric" value={credits} onChange={(e) => fromCredits(e.target.value)} placeholder="e.g. 750" />
        </Field>
        <ArrowLeftRight className="mx-auto mb-2.5 hidden size-5 text-muted-foreground sm:block" aria-hidden="true" />
        <Field label="Amount (GH₵)">
          <Input inputMode="decimal" value={amount} onChange={(e) => fromAmount(e.target.value)} placeholder="e.g. 30.00" />
        </Field>
        <Button type="submit" className="h-9" disabled={disabled || n === 0 || tooSmall}>
          {n > 0 ? `Buy for ${formatMoney(price)}` : "Buy"}
        </Button>
      </div>
      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
        {n > 0 && (
          <p>
            {n.toLocaleString()} credits at GH₵ {Number(creditRate(bundles, n).toFixed(4))} each · about {Math.floor(n / smsCreditCost).toLocaleString()} SMS
            {typedAmount > price && ` · GH₵ ${typedAmount.toFixed(2)} buys ${n.toLocaleString()} credits for ${formatMoney(price)}`}
          </p>
        )}
        {tooSmall && <p className="text-destructive">The smallest top-up is {formatMoney(MIN_CREDIT_PURCHASE)} ({creditsFor(bundles, MIN_CREDIT_PURCHASE)} credits).</p>}
        {better && !tooSmall && (
          <p>
            Tip:{" "}
            <button type="button" className="font-semibold text-cyan-700 underline" onClick={() => fromCredits(String(better.credits))}>
              {better.credits.toLocaleString()} credits cost only {formatMoney(better.price)}
            </button>
          </p>
        )}
      </div>
    </form>
  );
}

const REQUEST_STATUS: Record<CreditRequest["status"], string> = {
  awaiting: "Not paid yet",
  submitted: "Confirming",
  approved: "Credits added",
  rejected: "Not confirmed",
  cancelled: "Cancelled",
};

// Mobile money transfers in progress or settled lately, newest first.
function MomoRequests({ requests, onResume }: { requests: Array<CreditRequest>; onResume: (r: CreditRequest) => void }) {
  const { refetch } = useWallet();
  const cancel = useMutation({
    mutationFn: (id: number) => api.post(`/leadgen/portal/wallet/momo/${id}/cancel`),
    onSuccess: () => void refetch(),
    onError: (e) => toast.error(e.message),
  });
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <h2 className="border-b px-5 py-3 font-bold text-primary">Mobile money payments</h2>
      <ul className="divide-y">
        {requests.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
            <NetworkBadge network={r.network} className="size-9" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {Number(r.credits).toLocaleString()} credits · {formatMoney(r.amount_ghs)}
                <span className="ml-2 font-mono text-xs text-muted-foreground">{r.reference}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                To {networkLabel(r.network)} {r.account_number}
                {r.transaction_id && ` · Txn ${r.transaction_id}`}
                {r.created_at && ` · ${formatDateTime(r.created_at)}`}
              </p>
              {r.status === "rejected" && r.admin_note && <p className="mt-0.5 text-xs text-destructive">{r.admin_note}</p>}
            </div>
            <StatusBadge status={r.status} label={REQUEST_STATUS[r.status]} />
            {r.status === "awaiting" && (
              <div className="flex gap-1">
                <Button size="sm" onClick={() => onResume(r)}>
                  I've paid
                </Button>
                <Button size="sm" variant="ghost" disabled={cancel.isPending} onClick={() => cancel.mutate(r.id)}>
                  Cancel
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function WalletPage() {
  const { payment } = Route.useSearch();
  const { data } = useWallet();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [resume, setResume] = useState<CreditRequest | null>(null);
  if (!data) return <Loading />;
  const canBuy = data.onlinePayments || data.momoAccounts.length > 0;
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
              disabled={!canBuy}
              onClick={() => setPurchase({ credits: b.credits, price: b.price, body: { bundle: i } })}
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
        <CustomTopUp
          bundles={data.bundles}
          smsCreditCost={data.smsCreditCost}
          disabled={!canBuy}
          onBuy={(credits) => setPurchase({ credits, price: creditPrice(data.bundles, credits), body: { credits } })}
        />
        {!canBuy && <p className="mt-3 text-sm text-muted-foreground">Buying credits isn't available yet — redeem a credit voucher below or contact support to top up.</p>}
      </section>
      {data.requests.length > 0 && <MomoRequests requests={data.requests} onResume={setResume} />}
      {(purchase || resume) && (
        <CreditCheckout
          purchase={purchase}
          resume={resume}
          accounts={data.momoAccounts}
          onlinePayments={data.onlinePayments}
          onClose={() => {
            setPurchase(null);
            setResume(null);
          }}
        />
      )}
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
