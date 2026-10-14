import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EmptyState, Loading, StatusBadge } from "#/components/site/kit";

export const Route = createFileRoute("/_site/account/payments")({ component: PaymentsPage });

const PURPOSE: Record<string, string> = { order: "Marketplace order", ticket: "Tickets", enrollment: "Course", donation: "Donation", booth: "Exhibition booth" };

function PaymentsPage() {
  const { data } = useQuery({ queryKey: ["my-payments"], queryFn: () => api.get<{ items: Array<Record<string, any>> }>("/payments/mine") });
  if (!data) return <Loading />;
  if (!data.items.length) return <EmptyState icon={CreditCard} title="No payments yet" text="Online payments for orders, tickets, courses and donations appear here." />;
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left text-xs text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3">Reference</th>
            <th className="px-4 py-3">For</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.items.map((p) => (
            <tr key={p.reference}>
              <td className="px-4 py-3 font-mono text-xs">{p.reference}</td>
              <td className="px-4 py-3">{PURPOSE[p.purpose] ?? p.purpose}</td>
              <td className="px-4 py-3 font-semibold">{formatMoney(p.amount)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={p.status} label={p.provider === "manual" && p.status === "pending" ? "awaiting confirmation" : undefined} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDateTime(p.paid_at ?? p.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
