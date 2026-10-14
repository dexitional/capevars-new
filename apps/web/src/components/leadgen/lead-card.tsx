import { Link } from "@tanstack/react-router";
import { Mail, Phone, Users } from "lucide-react";
import { formatCompact, formatMoney } from "#/lib/money";
import { Avatar, Verified } from "#/components/site/kit";

type Row = Record<string, any>;

export const LEAD_CATEGORIES: Record<string, string> = {
  group: "Groups",
  community: "Communities",
  business: "Business categories",
  people: "People categories",
  institution: "Institutions",
  association: "Associations",
  other: "Other",
};

export function LeadCard({ l }: { l: Row }) {
  return (
    <Link to="/leadgen/l/$slug" params={{ slug: l.slug }} className="card-hover group flex flex-col rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-sys-leadgen/10 px-2.5 py-1 text-[11px] font-bold text-cyan-800">{LEAD_CATEGORIES[l.category] ?? l.category}</span>
        <span className="text-lg font-black text-primary">{formatMoney(l.price, { free: "Free" })}</span>
      </div>
      <h3 className="mt-3 line-clamp-2 font-bold text-primary group-hover:underline">{l.title}</h3>
      {(l.subcategory || l.region) && <p className="mt-0.5 text-sm text-muted-foreground">{[l.subcategory, l.region].filter(Boolean).join(" · ")}</p>}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted py-2">
          <Users className="mx-auto size-4 text-primary" />
          <p className="mt-0.5 text-sm font-bold">{formatCompact(l.contact_count)}</p>
          <p className="text-[10px] text-muted-foreground">contacts</p>
        </div>
        <div className="rounded-xl bg-muted py-2">
          <Phone className="mx-auto size-4 text-primary" />
          <p className="mt-0.5 text-sm font-bold">{formatCompact(l.phone_count)}</p>
          <p className="text-[10px] text-muted-foreground">phones</p>
        </div>
        <div className="rounded-xl bg-muted py-2">
          <Mail className="mx-auto size-4 text-primary" />
          <p className="mt-0.5 text-sm font-bold">{formatCompact(l.email_count)}</p>
          <p className="text-[10px] text-muted-foreground">emails</p>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
        <Avatar src={l.owner_avatar} name={l.owner_name ?? "Capevars"} size="xs" />
        <span className="truncate">{l.owner_name ?? "Capevars"}</span>
        {l.owner_verified ? <Verified className="size-3.5" /> : null}
        <span className="ml-auto">{l.access_count} users</span>
      </div>
    </Link>
  );
}
