import { CheckCircle2, XCircle } from "lucide-react";

// Shown after returning from Paystack (?payment=success|failed|pending).
export function PaymentBanner({ status }: { status?: string }) {
  if (!status) return null;
  const ok = status === "success";
  return (
    <div className={`mb-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium ${ok ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
      {ok ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
      {ok ? "Payment received — thank you!" : status === "pending" ? "We're still confirming your payment. Refresh in a moment." : "The payment didn't go through. You can try again below."}
    </div>
  );
}
