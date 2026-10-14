// Listing cards for every system. Rows come straight from the API (snake_case).
import { Link } from "@tanstack/react-router";
import { BookOpen, Briefcase, CalendarDays, Clock, Lock, MapPin, Truck, Users } from "lucide-react";
import { cn } from "#/lib/utils";
import { dateParts, formatDate, formatTime, timeAgo } from "#/lib/format";
import { discountPercent, formatCompact, formatDuration, formatMoney } from "#/lib/money";
import { COURSE_LEVELS, EVENT_CATEGORIES, FINDER_TYPES, GROUP_CATEGORIES, JOB_TYPES, SALARY_PERIODS, WORKPLACES, label } from "#/lib/labels";
import type { FinderType } from "#/lib/labels";
import { Avatar, FavouriteButton, Img, RatingPill, Stars, Verified } from "./kit";

type Row = Record<string, any>;

export function ProductCard({ p, className }: { p: Row; className?: string }) {
  const off = discountPercent(p.price, p.compare_at_price);
  return (
    <Link to="/market/p/$slug" params={{ slug: p.slug }} className={cn("group card-hover relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white", className)}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Img src={p.image} alt={p.title} className="size-full transition duration-300 group-hover:scale-105" />
        {off > 0 && <span className="absolute top-2.5 left-2.5 rounded-md bg-rose-600 px-1.5 py-0.5 text-xs font-bold text-white">-{off}%</span>}
        {p.item_condition && p.item_condition !== "new" && (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold capitalize">{p.item_condition}</span>
        )}
        <FavouriteButton type="product" id={p.id} className="absolute top-2.5 right-2.5" />
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">{p.title}</h3>
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-primary">{formatMoney(p.price)}</span>
            {off > 0 && <span className="text-xs text-muted-foreground line-through">{formatMoney(p.compare_at_price)}</span>}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">
              {p.store_name} {p.store_verified ? <Verified className="size-3.5" /> : null}
            </span>
            {p.rating_avg ? (
              <span className="flex shrink-0 items-center gap-1">
                <Stars value={p.rating_avg} className="[&_svg]:size-3" />
              </span>
            ) : p.sold_count > 0 ? (
              <span className="shrink-0">{formatCompact(p.sold_count)} sold</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StoreCard({ s }: { s: Row }) {
  return (
    <Link to="/market/store/$slug" params={{ slug: s.slug }} className="card-hover group overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative h-24 bg-primary">
        <Img src={s.banner_url} className="size-full opacity-90" />
        <div className="absolute -bottom-7 left-4 overflow-hidden rounded-xl border-4 border-white bg-white">
          <Img src={s.logo_url} className="size-14" />
        </div>
      </div>
      <div className="p-4 pt-9">
        <h3 className="flex items-center gap-1 font-bold text-primary group-hover:underline">
          {s.store_name} {s.is_verified ? <Verified /> : null}
        </h3>
        {s.tagline && <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{s.tagline}</p>}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <RatingPill value={s.rating_avg} count={s.rating_count} />
          {s.product_count !== undefined && <span>{s.product_count} items</span>}
        </div>
      </div>
    </Link>
  );
}

export function VendorCard({ v }: { v: Row }) {
  return (
    <Link to="/market/food/$slug" params={{ slug: v.slug }} className="card-hover group overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative aspect-[16/9] bg-muted">
        <Img src={v.banner_url ?? v.logo_url} alt={v.store_name} className="size-full" />
        <span className={cn("absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold", v.is_open ? "bg-emerald-500 text-white" : "bg-slate-800/80 text-white")}>
          {v.is_open ? "Open now" : "Closed"}
        </span>
        {v.delivers ? (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary">
            <Truck className="size-3.5" /> {Number(v.delivery_fee) ? formatMoney(v.delivery_fee) : "Free delivery"}
          </span>
        ) : null}
      </div>
      <div className="flex items-start gap-3 p-4">
        <Img src={v.logo_url} className="size-12 shrink-0 rounded-xl border" />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1 truncate font-bold text-primary">
            {v.store_name} {v.is_verified ? <Verified /> : null}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{[v.cuisine, v.location].filter(Boolean).join(" · ")}</p>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
            <RatingPill value={v.rating_avg} count={v.rating_count} />
            {v.from_price && <span>From {formatMoney(v.from_price)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function EventCard({ e, compact }: { e: Row; compact?: boolean }) {
  const d = dateParts(e.starts_at);
  return (
    <Link to="/market/tickets/e/$slug" params={{ slug: e.slug }} className="card-hover group overflow-hidden rounded-2xl border border-border bg-white">
      <div className={cn("relative bg-primary", compact ? "aspect-[2/1]" : "aspect-[16/10]")}>
        <Img src={e.cover_url} alt={e.title} className="size-full" />
        <div className="absolute top-3 left-3 rounded-xl bg-white px-2.5 py-1.5 text-center leading-none shadow">
          <div className="text-lg font-black text-primary">{d.day}</div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase">{d.month}</div>
        </div>
        <span className="absolute top-3 right-3 rounded-full bg-brand-cream px-2.5 py-1 text-[11px] font-bold text-primary">
          {label(EVENT_CATEGORIES, e.category)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-bold text-primary group-hover:underline">{e.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{e.venue}</span>
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5 shrink-0" /> {formatDate(e.starts_at)} · {formatTime(e.starts_at)}
        </p>
        {e.from_price !== undefined && e.from_price !== null && (
          <p className="mt-3 text-sm font-extrabold text-primary">{Number(e.from_price) === 0 ? "Free" : `From ${formatMoney(e.from_price)}`}</p>
        )}
      </div>
    </Link>
  );
}

export function salaryText(j: Row) {
  if (!j.salary_min && !j.salary_max) return null;
  const period = SALARY_PERIODS[j.salary_period] ?? "";
  if (j.salary_min && j.salary_max) return `${formatMoney(j.salary_min)} – ${formatMoney(j.salary_max)}${period}`;
  return `${formatMoney(j.salary_min ?? j.salary_max)}${period}`;
}

export function JobCard({ j }: { j: Row }) {
  const salary = salaryText(j);
  return (
    <Link to="/market/jobs/$slug" params={{ slug: j.slug }} className="card-hover group flex gap-4 rounded-2xl border border-border bg-white p-4">
      <Img src={j.company_logo_url} className="size-14 shrink-0 rounded-xl border" fallback={<Briefcase className="size-6" />} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-primary group-hover:underline">{j.title}</h3>
          {j.is_featured ? <span className="shrink-0 rounded-full bg-brand-cream px-2 py-0.5 text-[10px] font-bold text-primary">Featured</span> : null}
        </div>
        <p className="text-sm text-muted-foreground">{j.company_name}</p>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">{label(JOB_TYPES, j.job_type)}</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">{label(WORKPLACES, j.workplace)}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-medium">
            <MapPin className="size-3" /> {j.location}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{salary}</span>
          <span>{timeAgo(j.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

export function ListingCard({ l, className }: { l: Row; className?: string }) {
  const type = FINDER_TYPES[l.type as FinderType];
  return (
    <Link to="/finder/l/$slug" params={{ slug: l.slug }} className={cn("card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-white", className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Img src={l.cover_url ?? l.logo_url} alt={l.name} className="size-full transition duration-300 group-hover:scale-105" />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary">{type?.one ?? l.type}</span>
        <FavouriteButton type="listing" id={l.id} className="absolute top-3 right-3" />
        {l.is_featured ? <span className="absolute bottom-3 left-3 rounded-full bg-brand-gold px-2.5 py-1 text-[11px] font-bold text-primary">Featured</span> : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex items-center gap-1 font-bold text-primary group-hover:underline">
            <span className="line-clamp-1">{l.name}</span> {l.is_verified ? <Verified /> : null}
          </h3>
          {l.star_rating ? <Stars value={l.star_rating} className="shrink-0 [&_svg]:size-3" /> : null}
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{[l.area, l.city].filter(Boolean).join(", ") || l.address || "—"}</span>
        </p>
        {l.tagline && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{l.tagline}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <RatingPill value={l.rating_avg} count={l.rating_count} />
          {l.price_from ? (
            <div className="text-right leading-tight">
              <span className="text-[11px] text-muted-foreground">from</span>
              <div className="font-extrabold text-primary">
                {formatMoney(l.price_from)}
                {l.price_unit && <span className="text-xs font-medium text-muted-foreground"> {l.price_unit}</span>}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function GroupCard({ g }: { g: Row }) {
  return (
    <Link to="/groups/$slug" params={{ slug: g.slug }} className="card-hover group overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative h-28 bg-gradient-to-br from-sys-groups to-primary">
        <Img src={g.cover_url} className="size-full opacity-90" fallback={<span />} />
        <div className="absolute -bottom-8 left-4 overflow-hidden rounded-2xl border-4 border-white bg-white shadow">
          <Img src={g.logo_url} className="size-16" fallback={<Users className="size-6" />} />
        </div>
      </div>
      <div className="p-4 pt-10">
        <h3 className="line-clamp-1 font-bold text-primary group-hover:underline">{g.name}</h3>
        <p className="text-xs font-semibold text-sys-groups">{label(GROUP_CATEGORIES, g.category)}</p>
        {g.tagline && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{g.tagline}</p>}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" /> {formatCompact(g.member_count)} members
          </span>
          {g.visibility === "private" && (
            <span className="inline-flex items-center gap-1">
              <Lock className="size-3.5" /> Private
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function CourseCard({ c, progress }: { c: Row; progress?: number }) {
  const off = discountPercent(c.price, c.compare_at_price);
  return (
    <Link to="/learn/c/$slug" params={{ slug: c.slug }} className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Img src={c.cover_url} alt={c.title} className="size-full transition duration-300 group-hover:scale-105" fallback={<BookOpen className="size-8" />} />
        {c.is_featured ? <span className="absolute top-3 left-3 rounded-full bg-brand-gold px-2.5 py-1 text-[11px] font-bold text-primary">Bestseller</span> : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-bold text-primary group-hover:underline">{c.title}</h3>
        {c.instructor_name && <p className="mt-1 text-xs text-muted-foreground">{c.instructor_name}</p>}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          {c.rating_avg ? (
            <>
              <span className="font-bold text-amber-700">{Number(c.rating_avg).toFixed(1)}</span>
              <Stars value={c.rating_avg} className="[&_svg]:size-3" />
              <span className="text-muted-foreground">({formatCompact(c.rating_count)})</span>
            </>
          ) : (
            <span className="rounded bg-sky-50 px-1.5 py-0.5 font-semibold text-sky-700">New</span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {[c.lesson_count ? `${c.lesson_count} lessons` : null, c.duration_minutes ? formatDuration(c.duration_minutes) : null, label(COURSE_LEVELS, c.level)]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {progress !== undefined ? (
          <div className="mt-auto pt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-sys-learn" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{progress}% complete</p>
          </div>
        ) : (
          <div className="mt-auto flex items-baseline gap-2 pt-3">
            <span className="text-base font-extrabold text-primary">{formatMoney(c.price, { free: "Free" })}</span>
            {off > 0 && <span className="text-xs text-muted-foreground line-through">{formatMoney(c.compare_at_price)}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}

export function PersonRow({ u, action, sub }: { u: Row; action?: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Link to="/u/$username" params={{ username: u.username }}>
        <Avatar src={u.avatar_url} name={u.full_name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link to="/u/$username" params={{ username: u.username }} className="flex items-center gap-1 font-semibold text-foreground hover:underline">
          <span className="truncate">{u.full_name}</span> {u.is_verified ? <Verified /> : null}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{sub ?? u.headline ?? `@${u.username}`}</p>
      </div>
      {action}
    </div>
  );
}

export function EventDateLine({ startsAt }: { startsAt: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <CalendarDays className="size-4" /> {formatDate(startsAt)} · {formatTime(startsAt)}
    </span>
  );
}
