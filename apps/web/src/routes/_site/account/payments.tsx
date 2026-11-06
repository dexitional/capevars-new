import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate, formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { EmptyState, Loading, StatusBadge } from "#/components/site/kit";

export const Route = createFileRoute("/_site/account/payments")({ component: PaymentsPage });

const PURPOSE: Record<string, string> = { order: "Marketplace order", ticket: "Tickets", enrollment: "Course", donation: "Donation", booth: "Exhibition booth" };

// Quizbank course subscriptions, paid by mobile money.
function QuizbankPayments() {
  const { data } = useQuery({ queryKey: ["qb-my-subscriptions"], queryFn: () => api.get<{ items: Array<Record<string, any>> }>("/learn/quizbank/subscriptions/mine") });
  if (!data?.items.length) return null;
  return (
    <section className="mb-6 overflow-x-auto rounded-2xl border bg-white">
      <h2 className="border-b px-4 py-3 font-bold text-primary">Quizbank subscriptions</h2>
      <table className="w-full text-sm">
        <thead className="bg-muted text-left text-xs text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Reference</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Access</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.items.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-3 font-medium">
                {s.course_slug ? (
                  <Link to="/learn/quizbank/c/$slug" params={{ slug: s.course_slug }} className="hover:underline">
                    {s.course_title}
                  </Link>
                ) : (
                  s.course_title
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs">{s.reference}</td>
              <td className="px-4 py-3 font-semibold">{formatMoney(s.amount_ghs)}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {s.status === "approved" ? (s.expires_at ? `${Number(s.is_active) ? "Until" : "Ended"} ${formatDate(s.expires_at)}` : "No expiry") : s.days ? `${s.days} days` : "No expiry"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={s.status === "approved" && !Number(s.is_active) ? "expired" : s.status} label={s.status === "submitted" ? "awaiting confirmation" : s.status === "awaiting" ? "not paid yet" : undefined} />
                {s.admin_note && <span className="mt-1 block max-w-48 text-xs text-muted-foreground">{s.admin_note}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PaymentsPage() {
  const { data } = useQuery({ queryKey: ["my-payments"], queryFn: () => api.get<{ items: Array<Record<string, any>> }>("/payments/mine") });
  if (!data) return <Loading />;
  if (!data.items.length)
    return (
      <>
        <QuizbankPayments />
        <EmptyState icon={CreditCard} title="No payments yet" text="Online payments for orders, tickets, courses and donations appear here." />
      </>
    );
  return (
    <>
      <QuizbankPayments />
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
    </>
  );
}
