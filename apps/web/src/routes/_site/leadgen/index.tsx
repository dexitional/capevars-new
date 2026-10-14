import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Building2, Coins, Database, IdCard, Landmark, Mail, MessageSquareText, Search, Send, Upload, Users, UsersRound } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatCompact, formatMoney } from "#/lib/money";
import { Container, PageHero, SectionHeader, SeeAll } from "#/components/site/kit";
import { LEAD_CATEGORIES, LeadCard } from "#/components/leadgen/lead-card";
import { RedeemBox } from "#/components/leadgen/redeem-box";

type Row = Record<string, any>;
const leadgenHome = { queryKey: ["leadgen", "home"], queryFn: () => api.get<{ categories: Array<Row>; featured: Array<Row>; latest: Array<Row>; stats: Row; settings: Row }>("/leadgen/home"), staleTime: 60_000 };

export const Route = createFileRoute("/_site/leadgen/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(leadgenHome),
  head: () => ({ meta: [{ title: "LeadGen — community leads & bulk SMS | Capevars" }] }),
  component: LeadGenHome,
});

const CAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  group: UsersRound,
  community: Users,
  business: Building2,
  people: IdCard,
  institution: Landmark,
  association: BadgeCheck,
  other: Database,
};

function LeadGenHome() {
  const { data } = useQuery(leadgenHome);
  const stats = data?.stats ?? {};
  const counts = Object.fromEntries((data?.categories ?? []).map((c) => [c.category, c]));
  const cheapest = data?.settings?.bundles?.[data.settings.bundles.length - 1];
  return (
    <div className="pb-16">
      <PageHero
        system="leadgen"
        eyebrow="LeadGen"
        title="Reach the right people — by SMS or email."
        text="A community hub of leads: groups, associations, institutions, businesses and more. Get or buy lead lists, upload your own, and send bulk SMS or email with your own sender ID."
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/leadgen/portal/broadcast" className="inline-flex items-center gap-2 rounded-full bg-brand-cream px-5 py-3 text-sm font-bold text-primary hover:bg-brand-butter">
            <Send className="size-4" /> Send a broadcast
          </Link>
          <Link to="/leadgen/browse" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10">
            <Search className="size-4" /> Browse lead lists
          </Link>
          <Link to="/leadgen/portal/leads/new" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10">
            <Upload className="size-4" /> Sell your leads
          </Link>
        </div>
        <div className="mt-6">
          <RedeemBox dark />
        </div>
      </PageHero>

      <Container className="-mt-8 relative">
        <dl className="grid grid-cols-2 gap-3 rounded-2xl border bg-white p-5 shadow-lg shadow-primary/5 sm:grid-cols-4">
          {[
            ["Lead lists", stats.lists],
            ["Contacts", stats.contacts],
            ["Broadcasts sent", stats.broadcasts],
            ["Messages delivered", stats.messages],
          ].map(([label, value]) => (
            <div key={label as string} className="text-center">
              <dd className="text-2xl font-black text-primary">{formatCompact(value as number)}</dd>
              <dt className="text-xs text-muted-foreground">{label as string}</dt>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="mt-12">
        <SectionHeader title="Browse by category" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Object.entries(LEAD_CATEGORIES).map(([key, label]) => {
            const Icon = CAT_ICONS[key] ?? Database;
            return (
              <Link key={key} to="/leadgen/browse" search={{ category: key }} className="card-hover flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 text-center">
                <span className="flex size-11 items-center justify-center rounded-xl bg-sys-leadgen/10 text-cyan-700">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-primary">{label}</span>
                <span className="text-[11px] text-muted-foreground">{counts[key]?.n ?? 0} lists</span>
              </Link>
            );
          })}
        </div>
      </Container>

      {data && data.featured.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="Popular lead lists" action={<SeeAll to="/leadgen/browse">All lists</SeeAll>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.featured.map((l) => (
              <LeadCard key={l.id} l={l} />
            ))}
          </div>
        </Container>
      )}

      <Container className="mt-14">
        <SectionHeader title="How LeadGen works" />
        <ol className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Database, title: "1. Get leads", text: "Pick free or paid lists, redeem a share code, or upload your own Excel/CSV contacts. Each list gets a voucher code." },
            { icon: Coins, title: "2. Load credits", text: `Buy broadcast credit bundles${cheapest ? ` (from ${formatMoney(cheapest.price / cheapest.credits)} per credit)` : ""} or redeem a credit voucher.` },
            { icon: IdCard, title: "3. Register a sender", text: "Request your own SMS sender ID or email sender name. We approve it, or use the Capevars default." },
            { icon: MessageSquareText, title: "4. Broadcast", text: "Write once, personalise with {name}, target lists by voucher code, schedule, and track delivery." },
          ].map((s) => (
            <li key={s.title} className="rounded-2xl border bg-white p-5">
              <s.icon className="size-7 text-cyan-700" />
              <p className="mt-3 font-bold text-primary">{s.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>

      {data && data.latest.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="Newly added" action={<SeeAll to="/leadgen/browse" search={{ sort: "newest" }} />} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.latest.map((l) => (
              <LeadCard key={l.id} l={l} />
            ))}
          </div>
        </Container>
      )}

      <Container className="mt-14">
        <div className="hero-navy relative grid items-center gap-6 overflow-hidden rounded-3xl p-8 text-white md:grid-cols-[1fr_auto]">
          <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <h3 className="text-2xl font-black">Turn your contacts into income</h3>
            <p className="mt-2 max-w-xl text-white/70">
              Publish a lead list with a price. You keep {100 - (data?.settings?.platformFeePercent ?? 20)}% of every sale and withdraw to Mobile Money. Lists must contain contacts you're allowed to share.
            </p>
          </div>
          <Link to="/leadgen/portal/leads/new" className="relative inline-flex items-center gap-2 rounded-full bg-brand-cream px-5 py-3 text-sm font-bold text-primary">
            <Mail className="size-4" /> Create a lead list
          </Link>
        </div>
      </Container>
    </div>
  );
}
