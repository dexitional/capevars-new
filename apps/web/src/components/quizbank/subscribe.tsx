// Paying for a Quizbank course: the card on the course page and its payment dialog.
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Clock, Crown, Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { useRequireMember } from "#/hooks/useMember";
import { PayStep } from "#/components/leadgen/momo-checkout";
import type { PayableRequest } from "#/components/leadgen/momo-checkout";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "#/components/ui/dialog";

export type QbPayment = PayableRequest & { course_title: string; status: string; days: number | null };

export interface QbAccess {
  required: boolean;
  fee: number;
  days: number | null;
  active: boolean;
  expiresAt: string | null;
  open: QbPayment | null;
}

export const accessLength = (days: number | null) => (days ? `${days} day${days === 1 ? "" : "s"}` : "no expiry");

export function PayDialog({ payment, onClose, onChanged }: { payment: QbPayment; onClose: () => void; onChanged: () => void }) {
  const [done, setDone] = useState(payment.status === "submitted");
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto size-14 text-success" />
            <DialogTitle className="mt-3 text-xl font-black text-primary">Payment sent for confirmation</DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-sm">
              We've alerted {payment.account_name} to check for your {formatMoney(payment.amount_ghs)}. {payment.course_title} opens up once it's confirmed, and we'll notify you.
            </DialogDescription>
            <p className="mt-3 text-xs text-muted-foreground">
              Reference <span className="font-mono font-bold text-primary">{payment.reference}</span>
            </p>
            <Button className="mt-5" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <PayStep
            request={payment}
            forWhat={`${payment.course_title} · ${accessLength(payment.days)}`}
            sentUrl={`/learn/quizbank/subscriptions/${payment.id}/sent`}
            onSent={() => {
              setDone(true);
              onChanged();
            }}
            onLater={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SubscribeCard({ courseId, title, access, onChanged }: { courseId: number; title: string; access: QbAccess; onChanged: () => void }) {
  const requireMember = useRequireMember();
  const queryClient = useQueryClient();
  const [paying, setPaying] = useState<QbPayment | null>(null);
  const refresh = () => {
    onChanged();
    void queryClient.invalidateQueries({ queryKey: ["qb-my-subscriptions"] });
  };
  const start = useMutation({
    mutationFn: () => api.post<{ subscription: QbPayment }>(`/learn/quizbank/courses/${courseId}/subscribe`),
    onSuccess: (r) => {
      setPaying(r.subscription);
      refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  const cancel = useMutation({
    mutationFn: (id: number) => api.post(`/learn/quizbank/subscriptions/${id}/cancel`),
    onSuccess: refresh,
    onError: (e) => toast.error(e.message),
  });
  const pending = access.open;
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
      <p className="flex items-center gap-1.5 text-sm font-black text-amber-950">
        <Crown className="size-4" /> {access.active ? "You're subscribed" : `${formatMoney(access.fee)} · ${accessLength(access.days)}`}
      </p>
      {access.active && <p className="mt-1 text-xs text-amber-950/80">{access.expiresAt ? `Your access runs until ${formatDate(access.expiresAt)}.` : "Your access doesn't expire."}</p>}
      {!access.active && !pending && <p className="mt-1 text-xs text-amber-950/80">Subscribe to study and sit exams on {title}. Pay by mobile money.</p>}
      {pending?.status === "submitted" ? (
        <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-amber-950">
          <Clock className="mt-0.5 size-3.5 shrink-0" /> Your payment {pending.reference} is being checked. We'll notify you once it's confirmed.
        </p>
      ) : pending ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => setPaying(pending)}>
            Finish paying {formatMoney(pending.amount_ghs)}
          </Button>
          <Button size="sm" variant="ghost" disabled={cancel.isPending} onClick={() => cancel.mutate(pending.id)}>
            Cancel
          </Button>
        </div>
      ) : (
        (!access.active || access.expiresAt) && (
          <Button size="sm" className="mt-3" variant={access.active ? "outline" : "default"} disabled={start.isPending} onClick={() => requireMember(() => start.mutate())}>
            {start.isPending && <Loader2 className="animate-spin" />} {access.active ? `Renew for ${formatMoney(access.fee)}` : "Subscribe"}
          </Button>
        )
      )}
      {paying && <PayDialog payment={paying} onClose={() => setPaying(null)} onChanged={refresh} />}
    </div>
  );
}
