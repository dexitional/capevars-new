import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Copy, CreditCard, Loader2, Smartphone } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatMoney } from "#/lib/money";
import { networkName } from "#/lib/credits";
import type { MomoAccount, MomoNetwork } from "#/lib/credits";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";

export interface CreditRequest {
  id: number;
  reference: string;
  status: "awaiting" | "submitted" | "approved" | "rejected" | "cancelled";
  credits: number;
  amount_ghs: number | string;
  network: MomoNetwork;
  account_name: string;
  account_number: string;
  transaction_id?: string | null;
  admin_note?: string | null;
  submitted_at?: string | null;
  created_at?: string;
}

export interface Purchase {
  credits: number;
  price: number;
  body: { bundle: number } | { credits: number };
}

interface NetworkStyle {
  badge: string;
  card: string;
  short: string;
  ussd: string;
}
const NETWORK_STYLE: Record<MomoNetwork, NetworkStyle> = {
  mtn: { badge: "bg-[#ffcc00] text-[#0b2a4a]", card: "border-[#ffcc00] bg-[#fffbe6]", short: "MTN", ussd: "Dial *170# → Transfer Money → MoMo User" },
  telecel: { badge: "bg-[#e60000] text-white", card: "border-[#e60000]/40 bg-[#fff1f1]", short: "T", ussd: "Dial *110# → Send Money" },
  airteltigo: { badge: "bg-[#0033a0] text-white", card: "border-[#0033a0]/30 bg-[#eef3ff]", short: "AT", ussd: "Dial *110# → Send Money" },
};
const styleOf = (network: string) => (NETWORK_STYLE as Record<string, NetworkStyle | undefined>)[network] ?? NETWORK_STYLE.mtn;

export const networkLabel = networkName;

export function NetworkBadge({ network, className }: { network: string; className?: string }) {
  return (
    <span className={cn("grid size-10 flex-none place-items-center rounded-xl text-xs font-black tracking-tight", styleOf(network).badge, className)} aria-hidden="true">
      {styleOf(network).short}
    </span>
  );
}

function copy(text: string, what: string) {
  // navigator.clipboard is missing outside secure contexts.
  void Promise.resolve()
    .then(() => navigator.clipboard.writeText(text))
    .then(
      () => toast.success(`${what} copied`),
      () => toast.error("Couldn't copy — select it instead"),
    );
}

// Buy credits: pick online checkout or one of the mobile money wallets to pay
// into by hand. Choosing a wallet logs the request (with a reference) and moves
// on to the payment instructions; `resume` opens those for an earlier request.
export function CreditCheckout({
  purchase,
  resume,
  accounts,
  onlinePayments,
  onClose,
}: {
  purchase: Purchase | null;
  resume: CreditRequest | null;
  accounts: Array<MomoAccount>;
  onlinePayments: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [request, setRequest] = useState<CreditRequest | null>(resume);
  const [done, setDone] = useState(false);
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["leadgen", "wallet"] });
  const online = useMutation({
    mutationFn: () => api.post<{ authorizationUrl: string }>("/leadgen/portal/wallet/buy", purchase!.body),
    onSuccess: (r) => (window.location.href = r.authorizationUrl),
    onError: (e) => toast.error(e.message),
  });
  const start = useMutation({
    mutationFn: (account: number) => api.post<{ request: CreditRequest }>("/leadgen/portal/wallet/momo", { ...purchase!.body, account }),
    onSuccess: (r) => {
      setRequest(r.request);
      refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  const credits = request?.credits ?? purchase?.credits ?? 0;
  const price = Number(request?.amount_ghs ?? purchase?.price ?? 0);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        {done && request ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto size-14 text-success" />
            <DialogTitle className="mt-3 text-xl font-black text-primary">Payment sent for confirmation</DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-sm">
              We've alerted {request.account_name} to check for your {formatMoney(price)}. Your {Number(credits).toLocaleString()} credits are added once it's confirmed, and
              we'll notify you.
            </DialogDescription>
            <p className="mt-3 text-xs text-muted-foreground">
              Reference <span className="font-mono font-bold text-primary">{request.reference}</span>
            </p>
            <Button className="mt-5" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : request ? (
          <PayStep
            request={request}
            onSent={() => {
              setDone(true);
              refresh();
            }}
            onLater={onClose}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-primary">Buy {credits.toLocaleString()} credits</DialogTitle>
              <DialogDescription>
                Total <strong className="text-foreground">{formatMoney(price)}</strong> · choose how you'd like to pay.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2.5">
              {onlinePayments && (
                <button
                  type="button"
                  disabled={online.isPending || start.isPending}
                  onClick={() => online.mutate()}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-3.5 text-left transition-colors hover:border-primary disabled:opacity-60"
                >
                  <span className="grid size-10 flex-none place-items-center rounded-xl bg-primary text-white">
                    {online.isPending ? <Loader2 className="size-5 animate-spin" /> : <CreditCard className="size-5" />}
                  </span>
                  <span>
                    <span className="block font-bold text-primary">Pay online</span>
                    <span className="block text-xs text-muted-foreground">Card or mobile money prompt · credits added instantly</span>
                  </span>
                </button>
              )}
              {accounts.length > 0 && (
                <p className="pt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{onlinePayments ? "Or send mobile money yourself" : "Send mobile money to"}</p>
              )}
              {accounts.map((a, i) => (
                <button
                  key={`${a.network}-${a.number}`}
                  type="button"
                  disabled={online.isPending || start.isPending}
                  onClick={() => start.mutate(i)}
                  className={cn("flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-transform hover:-translate-y-0.5 disabled:opacity-60", styleOf(a.network).card)}
                >
                  <NetworkBadge network={a.network} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-primary">{networkLabel(a.network)}</span>
                    <span className="block truncate text-sm">{a.name}</span>
                    <span className="block font-mono text-sm font-semibold tracking-wider">{a.number}</span>
                  </span>
                  {start.isPending && start.variables === i ? <Loader2 className="size-5 animate-spin" /> : <Smartphone className="size-5 text-primary/50" />}
                </button>
              ))}
              {accounts.length > 0 && <p className="text-xs text-muted-foreground">Mobile money transfers are checked by hand before your credits are added.</p>}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PayStep({ request, onSent, onLater }: { request: CreditRequest; onSent: () => void; onLater: () => void }) {
  const [transactionId, setTransactionId] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const style = styleOf(request.network);
  const amount = Number(request.amount_ghs);
  const sent = useMutation({
    mutationFn: () => api.post(`/leadgen/portal/wallet/momo/${request.id}/sent`, { transactionId, payerPhone: payerPhone || undefined }),
    onSuccess: onSent,
    onError: (e) => toast.error(e.message),
  });
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-black text-primary">Send {formatMoney(amount)}</DialogTitle>
        <DialogDescription>
          For {Number(request.credits).toLocaleString()} credits · reference <span className="font-mono font-bold text-foreground">{request.reference}</span>
        </DialogDescription>
      </DialogHeader>

      <div className={cn("rounded-2xl border-2 p-4", style.card)}>
        <div className="flex items-center gap-3">
          <NetworkBadge network={request.network} />
          <div className="min-w-0">
            <p className="font-bold text-primary">{networkLabel(request.network)}</p>
            <p className="truncate text-sm">{request.account_name}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => copy(request.account_number, "Number")} className="rounded-xl bg-white/80 px-3 py-2 text-left ring-1 ring-black/5 hover:bg-white">
            <span className="block text-[11px] text-muted-foreground">Number</span>
            <span className="flex items-center gap-1.5 font-mono text-lg font-black tracking-wider text-primary">
              {request.account_number} <Copy className="size-3.5 text-muted-foreground" />
            </span>
          </button>
          <button type="button" onClick={() => copy(amount.toFixed(2), "Amount")} className="rounded-xl bg-white/80 px-3 py-2 text-left ring-1 ring-black/5 hover:bg-white">
            <span className="block text-[11px] text-muted-foreground">Amount</span>
            <span className="flex items-center gap-1.5 text-lg font-black text-primary">
              {formatMoney(amount)} <Copy className="size-3.5 text-muted-foreground" />
            </span>
          </button>
        </div>
        <ol className="mt-3 list-decimal space-y-0.5 pl-5 text-xs text-primary/80">
          <li>{style.ussd}, or use your MoMo app.</li>
          <li>
            Send exactly {formatMoney(amount)} and check the name shows as {request.account_name}.
          </li>
          <li>
            Use <span className="font-mono font-bold">{request.reference}</span> as the reference if asked.
          </li>
        </ol>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          sent.mutate();
        }}
      >
        <Field label="Transaction ID" hint="From the confirmation SMS you get after paying.">
          <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. 54123456789" autoComplete="off" required minLength={5} maxLength={40} className="font-mono" />
        </Field>
        <Field label="Paid from (optional)" hint="If you paid from a number other than your account's.">
          <Input type="tel" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} placeholder="0241234567" />
        </Field>
        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onLater}>
            Pay later
          </Button>
          <Button type="submit" disabled={sent.isPending || transactionId.trim().length < 5}>
            {sent.isPending && <Loader2 className="animate-spin" />} Payment sent
          </Button>
        </div>
      </form>
    </>
  );
}
