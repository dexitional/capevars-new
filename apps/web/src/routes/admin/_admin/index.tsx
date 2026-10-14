import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Briefcase, CalendarDays, CreditCard, Flag, LayoutGrid, Map as MapIcon, Megaphone, MessageCircle, Package, ShoppingBag, Store, Ticket, Users, Wallet } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDate, timeAgo } from "#/lib/format";
import { formatCompact, formatMoney } from "#/lib/money";
import { MEMBER_TYPES } from "#/lib/labels";
import { AdminPageHeader, Panel } from "#/components/admin/ui";
import { Avatar } from "#/components/site/kit";

type Row = Record<string, any>;

export const Route = createFileRoute("/admin/_admin/")({ component: Dashboard });

const QUEUES: Array<{ key: string; label: string; to: string; icon: typeof Store }> = [
  { key: "sellers", label: "Store applications", to: "/admin/sellers", icon: Store },
  { key: "events", label: "Events to review", to: "/admin/tickets", icon: CalendarDays },
  { key: "jobs", label: "Jobs to review", to: "/admin/jobs", icon: Briefcase },
  { key: "exhibitions", label: "Exhibitions", to: "/admin/exhibitions", icon: LayoutGrid },
  { key: "listings", label: "Finder listings", to: "/admin/finder", icon: MapIcon },
  { key: "groups_count", label: "Groups to approve", to: "/admin/groups", icon: Users },
  { key: "courses", label: "Courses in review", to: "/admin/learn", icon: BookOpen },
  { key: "lead_lists", label: "Lead lists", to: "/admin/leadgen", icon: Megaphone },
  { key: "sender_ids", label: "Sender IDs", to: "/admin/leadgen", icon: Megaphone },
  { key: "payouts", label: "Payout requests", to: "/admin/leadgen", icon: Wallet },
  { key: "reports", label: "Open reports", to: "/admin/reports", icon: Flag },
];

const PURPOSE: Record<string, string> = { order: "Marketplace", ticket: "Tickets", enrollment: "Courses", donation: "Donations", booth: "Booths", lead: "Lead lists", credits: "Broadcast credits" };

function Dashboard() {
  const { data } = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => api.get<{ totals: Row; queues: Row; signups: Array<Row>; revenue: Array<Row>; recent: Array<Row> }>("/admin/dashboard") });
  if (!data) return null;
  const t = data.totals;
  const max = Math.max(1, ...data.signups.map((s) => Number(s.n)));
  const waiting = QUEUES.filter((q) => Number(data.queues[q.key] ?? 0) > 0);
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Dashboard" description="Everything happening across Capevars." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[
          [Users, "Members", t.members, `+${t.members_week} this week · ${t.active_today} active today`],
          [Store, "Stores", t.stores, `${formatCompact(t.products)} products`],
          [ShoppingBag, "Orders", t.orders, `${formatCompact(t.tickets)} tickets sold`],
          [MapIcon, "Finder listings", t.listings, `${t.jobs} open jobs`],
          [MessageCircle, "Groups & posts", t.groups_count, `${formatCompact(t.posts)} social posts`],
          [BookOpen, "Courses", t.courses, `${formatCompact(t.enrollments)} enrolments`],
          [Megaphone, "Lead lists", t.lead_lists, `${formatCompact(t.messages_sent)} messages sent`],
        ].map(([Icon, label, value, sub]) => {
          const I = Icon as typeof Users;
          return (
            <div key={label as string} className="rounded-xl border border-border bg-white p-5">
              <I className="size-5 text-primary" />
              <p className="mt-3 text-2xl font-black text-primary">{formatCompact(value as number)}</p>
              <p className="text-sm font-semibold">{label as string}</p>
              <p className="text-xs text-muted-foreground">{sub as string}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Needs attention" description="Approval queues across all systems">
          {waiting.length === 0 ? (
            <p className="text-sm text-muted-foreground">All caught up — nothing waiting for review. ✨</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {waiting.map((q) => (
                <Link key={q.key} to={q.to} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted">
                  <q.icon className="size-4 text-primary" />
                  <span className="flex-1 text-sm font-medium">{q.label}</span>
                  <span className="rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-bold text-primary">{data.queues[q.key]}</span>
                </Link>
              ))}
            </div>
          )}
        </Panel>
        <Panel title="Payments (30 days)" description="Successful online payments">
          {data.revenue.length === 0 ? (
            <p className="text-sm text-muted-foreground">No online payments yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.revenue.map((r) => (
                <li key={r.purpose} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="size-4 text-muted-foreground" /> {PURPOSE[r.purpose] ?? r.purpose} <span className="text-xs text-muted-foreground">({r.n})</span>
                  </span>
                  <strong>{formatMoney(r.total)}</strong>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="New members — last 30 days">
          {data.signups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sign-ups yet.</p>
          ) : (
            <div className="flex h-44 items-end gap-1">
              {data.signups.map((s) => (
                <div key={s.day} className="group relative flex flex-1 flex-col justify-end">
                  <div className="w-full rounded-t bg-primary/80 group-hover:bg-brand-gold" style={{ height: `${(Number(s.n) / max) * 100}%`, minHeight: 3 }} />
                  <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-[10px] whitespace-nowrap text-white opacity-0 group-hover:opacity-100">
                    {formatDate(s.day)} · {s.n}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
        <Panel title="Latest members" actions={<Link to="/admin/members" className="text-sm font-semibold text-primary">All →</Link>}>
          <ul className="space-y-3">
            {data.recent.map((u) => (
              <li key={u.id} className="flex items-center gap-3 text-sm">
                <Avatar src={u.avatar_url} name={u.full_name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{u.full_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {MEMBER_TYPES[u.member_type]} · {timeAgo(u.created_at)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Package className="size-3.5" /> <Ticket className="size-3.5" /> Figures update live as members use the platform.
      </p>
    </div>
  );
}
