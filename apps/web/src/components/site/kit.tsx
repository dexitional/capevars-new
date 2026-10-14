// Small building blocks shared by every public page.
import { createContext, useContext, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  ImagePlus,
  Loader2,
  Paperclip,
  Search,
  Star,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "#/lib/utils";
import { asset } from "#/lib/asset";
import { initials } from "#/lib/format";
import { DOCUMENT_ACCEPT, IMAGE_ACCEPT, VIDEO_ACCEPT, uploadToLibrary } from "#/lib/upload";
import type { MediaFolder } from "#/lib/upload";
import { useFavourite } from "#/hooks/useFavourites";
import type { FavouriteType } from "#/hooks/useFavourites";
import { OptimizedImage } from "./optimized-image";

// ---- Brand ----------------------------------------------------------------------------

export function Logo({ light = false, className, compact = false }: { light?: boolean; className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img src={asset(light ? "logo-mark-light.png" : "logo-mark.png")} alt="" className="h-8 w-auto" />
      {!compact && (
        <span className="leading-none">
          <span className={cn("block font-display text-[19px] font-black tracking-[0.12em]", light ? "text-brand-cream" : "text-primary")}>
            CAPEVARS
          </span>
          <span className={cn("block text-[9px] font-semibold tracking-[0.28em] uppercase", light ? "text-white/60" : "text-muted-foreground")}>
            Innovation in style
          </span>
        </span>
      )}
    </span>
  );
}

// ---- Images & people ------------------------------------------------------------------

export function Img({
  src,
  alt = "",
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
  fallback,
}: {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallback?: React.ReactNode;
}) {
  if (!src) {
    return (
      <div className={cn("flex items-center justify-center bg-gradient-to-br from-primary-soft to-accent text-primary/30", className)}>
        {fallback ?? <img src={asset("logo-mark.png")} alt="" className="h-1/3 max-h-12 w-auto opacity-25" />}
      </div>
    );
  }
  return <OptimizedImage src={src} alt={alt} sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
}

export function Avatar({
  src,
  name,
  size = "md",
  className,
  ring,
}: {
  src: string | null | undefined;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  ring?: boolean;
}) {
  const sizes = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-14 text-base",
    xl: "size-20 text-xl",
    "2xl": "size-32 text-3xl",
  }[size];
  const cls = cn("shrink-0 rounded-full object-cover", sizes, ring && "ring-4 ring-white", className);
  if (src) return <OptimizedImage src={src} alt="" sizes="128px" maxWidth={256} className={cls} />;
  return (
    <span className={cn(cls, "flex items-center justify-center bg-primary font-bold text-brand-cream")} aria-hidden="true">
      {initials(name) || "?"}
    </span>
  );
}

export function Verified({ className }: { className?: string }) {
  return <BadgeCheck className={cn("inline size-4 shrink-0 fill-info text-white", className)} aria-label="Verified" />;
}

// ---- Ratings -----------------------------------------------------------------------------

export function Stars({ value, size = "sm", className }: { value: number | string | null | undefined; size?: "sm" | "md" | "lg"; className?: string }) {
  const v = Number(value ?? 0);
  const s = { sm: "size-3.5", md: "size-4", lg: "size-5" }[size];
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${v.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(s, i <= Math.round(v) ? "fill-brand-gold text-brand-gold" : "fill-slate-200 text-slate-200")} aria-hidden="true" />
      ))}
    </span>
  );
}

export function RatingPill({ value, count, className }: { value: number | string | null | undefined; count?: number; className?: string }) {
  if (!value) return <span className={cn("text-xs text-muted-foreground", className)}>No reviews yet</span>;
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <span className="inline-flex items-center gap-0.5 rounded-md bg-primary px-1.5 py-0.5 text-xs font-bold text-white">
        <Star className="size-3 fill-brand-gold text-brand-gold" aria-hidden="true" />
        {Number(value).toFixed(1)}
      </span>
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </span>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} star${i > 1 ? "s" : ""}`} onMouseEnter={() => setHover(i)} onClick={() => onChange(i)}>
          <Star className={cn("size-7 transition-colors", i <= (hover || value) ? "fill-brand-gold text-brand-gold" : "fill-slate-200 text-slate-200")} />
        </button>
      ))}
    </div>
  );
}

// ---- Layout -------------------------------------------------------------------------------

const SYSTEM_TINT: Record<string, string> = {
  market: "from-[#041d40] via-[#0a2b5a] to-[#3a2a05]",
  finder: "from-[#041d40] via-[#06354f] to-[#0d4f4a]",
  groups: "from-[#041d40] via-[#1e1a5a] to-[#3b1c6b]",
  social: "from-[#041d40] via-[#0b2f6b] to-[#1a3f94]",
  learn: "from-[#041d40] via-[#2a1840] to-[#5a1530]",
  leadgen: "from-[#041d40] via-[#06345a] to-[#075e6e]",
  neutral: "from-[#041d40] via-[#072b5c] to-[#041d40]",
};

export function PageHero({
  eyebrow,
  title,
  text,
  system = "neutral",
  children,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  text?: React.ReactNode;
  system?: keyof typeof SYSTEM_TINT;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-gradient-to-br text-white", SYSTEM_TINT[system], className)}>
      <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="absolute -top-32 -right-24 size-96 rounded-full bg-brand-cream/15 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {eyebrow && <p className="mb-3 text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">{eyebrow}</p>}
        <h1 className="max-w-3xl font-hero text-3xl leading-tight font-bold tracking-normal sm:text-4xl lg:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">{text}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function SectionHeader({
  title,
  text,
  action,
  className,
}: {
  title: React.ReactNode;
  text?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-xl font-black tracking-tight text-primary sm:text-2xl">{title}</h2>
        {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function SeeAll(props: LinkProps & { children?: React.ReactNode }) {
  return (
    <Link {...props} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
      {props.children ?? "See all"} <ChevronRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

export function EmptyState({
  icon: Icon = Search,
  title,
  text,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  text?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center", className)}>
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="size-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-primary">{title}</h3>
      {text && <p className="mt-1 max-w-md text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Loading({ className, label = "Loading…" }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground", className)}>
      <Loader2 className="size-5 animate-spin" aria-hidden="true" /> {label}
    </div>
  );
}

export function CardGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-white">
          <div className="aspect-[4/3] bg-muted" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Pager({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="flex size-10 items-center justify-center rounded-full border bg-white disabled:opacity-40" aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </button>
      <span className="px-3 text-sm font-medium">
        Page {page} of {pages}
      </span>
      <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)} className="flex size-10 items-center justify-center rounded-full border bg-white disabled:opacity-40" aria-label="Next page">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}

const BADGE: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  hired: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  graded: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-800 ring-amber-600/20",
  in_review: "bg-amber-50 text-amber-800 ring-amber-600/20",
  reserved: "bg-amber-50 text-amber-800 ring-amber-600/20",
  requested: "bg-amber-50 text-amber-800 ring-amber-600/20",
  submitted: "bg-amber-50 text-amber-800 ring-amber-600/20",
  pending_payment: "bg-amber-50 text-amber-800 ring-amber-600/20",
  quoted: "bg-sky-50 text-sky-700 ring-sky-600/20",
  ready: "bg-sky-50 text-sky-700 ring-sky-600/20",
  shipped: "bg-sky-50 text-sky-700 ring-sky-600/20",
  shortlisted: "bg-sky-50 text-sky-700 ring-sky-600/20",
  reviewed: "bg-sky-50 text-sky-700 ring-sky-600/20",
  scheduled: "bg-sky-50 text-sky-700 ring-sky-600/20",
  used: "bg-slate-100 text-slate-600 ring-slate-500/20",
  draft: "bg-slate-100 text-slate-600 ring-slate-500/20",
  closed: "bg-slate-100 text-slate-600 ring-slate-500/20",
  hidden: "bg-slate-100 text-slate-600 ring-slate-500/20",
  archived: "bg-slate-100 text-slate-600 ring-slate-500/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  declined: "bg-red-50 text-red-700 ring-red-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  suspended: "bg-red-50 text-red-700 ring-red-600/20",
  blocked: "bg-red-50 text-red-700 ring-red-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
  revoked: "bg-red-50 text-red-700 ring-red-600/20",
  resubmit: "bg-red-50 text-red-700 ring-red-600/20",
};

export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset", BADGE[status] ?? BADGE.draft, className)}>
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}

export function Chip({ active, onClick, children, className }: { active?: boolean; onClick?: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "border-primary bg-primary text-white" : "border-border bg-white text-foreground hover:border-primary/40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function FavouriteButton({ type, id, className, label }: { type: FavouriteType; id: number; className?: string; label?: boolean }) {
  const { saved, toggle, pending } = useFavourite(type, id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from favourites" : "Save to favourites"}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full bg-white/95 text-primary shadow-sm backdrop-blur transition hover:scale-105",
        label ? "h-10 border px-4 text-sm font-semibold" : "size-9",
        className,
      )}
    >
      <Heart className={cn("size-4", saved && "fill-rose-500 text-rose-500")} aria-hidden="true" />
      {label && (saved ? "Saved" : "Save")}
    </button>
  );
}

// ---- Uploads ------------------------------------------------------------------------------

// Which API signs uploads: members use /me/uploads; the admin portal wraps its
// forms in <UploadEndpoint value="/admin/media"> to reuse these same fields.
const UploadEndpointContext = createContext("/me/uploads");
export const UploadEndpoint = UploadEndpointContext.Provider;

function useMemberUpload(folder: MediaFolder) {
  const endpoint = useContext(UploadEndpointContext);
  const [progress, setProgress] = useState<number | null>(null);
  const upload = async (file: File) => {
    setProgress(0);
    try {
      return await uploadToLibrary(file, folder, setProgress, endpoint);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
      return null;
    } finally {
      setProgress(null);
    }
  };
  return { progress, upload };
}

export function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-video",
  label = "Upload image",
  className,
  round,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder: MediaFolder;
  aspect?: string;
  label?: string;
  className?: string;
  round?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { progress, upload } = useMemberUpload(folder);
  const pick = async (file: File | undefined) => {
    if (!file) return;
    const asset = await upload(file);
    if (asset) onChange(asset.url);
    if (ref.current) ref.current.value = "";
  };
  return (
    <div className={cn("relative overflow-hidden border-2 border-dashed border-input bg-muted/60", round ? "rounded-full" : "rounded-xl", aspect, className)}>
      {value ? (
        <>
          <img src={value} alt="" className="size-full object-cover" />
          <div className="absolute top-2 right-2 flex gap-1">
            <button type="button" onClick={() => ref.current?.click()} className="rounded-full bg-white/90 p-1.5 shadow" aria-label="Replace image">
              <ImagePlus className="size-4" />
            </button>
            <button type="button" onClick={() => onChange(null)} className="rounded-full bg-white/90 p-1.5 shadow" aria-label="Remove image">
              <X className="size-4" />
            </button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} className="flex size-full flex-col items-center justify-center gap-1.5 p-3 text-center text-sm text-muted-foreground hover:text-primary">
          <UploadCloud className="size-6" aria-hidden="true" />
          <span className="font-medium">{label}</span>
        </button>
      )}
      {progress !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-semibold text-primary">
          <Loader2 className="mr-2 size-4 animate-spin" /> {Math.round(progress * 100)}%
        </div>
      )}
      <input ref={ref} type="file" accept={IMAGE_ACCEPT} className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
    </div>
  );
}

export function GalleryUpload({ value, onChange, folder, max = 8 }: { value: Array<string>; onChange: (urls: Array<string>) => void; folder: MediaFolder; max?: number }) {
  const ref = useRef<HTMLInputElement>(null);
  const { progress, upload } = useMemberUpload(folder);
  const pick = async (files: FileList | null) => {
    const list = Array.from(files ?? []).slice(0, max - value.length);
    const urls = [...value];
    for (const file of list) {
      const asset = await upload(file);
      if (asset) urls.push(asset.url);
    }
    onChange(urls);
    if (ref.current) ref.current.value = "";
  };
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {value.map((url, i) => (
        <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border">
          <img src={url} alt="" className="size-full object-cover" />
          {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">Cover</span>}
          <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition group-hover:opacity-100">
            {i > 0 && (
              <button type="button" onClick={() => onChange([url, ...value.filter((u) => u !== url)])} className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow">
                Make cover
              </button>
            )}
            <button type="button" onClick={() => onChange(value.filter((u) => u !== url))} className="rounded-full bg-white/90 p-1 shadow" aria-label="Remove">
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      ))}
      {value.length < max && (
        <button type="button" onClick={() => ref.current?.click()} disabled={progress !== null} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-input bg-muted/60 text-xs text-muted-foreground hover:text-primary">
          {progress !== null ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          {progress !== null ? `${Math.round(progress * 100)}%` : "Add photos"}
        </button>
      )}
      <input ref={ref} type="file" multiple accept={IMAGE_ACCEPT} className="hidden" onChange={(e) => void pick(e.target.files)} />
    </div>
  );
}

export function FileUpload({
  value,
  onChange,
  folder,
  kind = "document",
  label,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder: MediaFolder;
  kind?: "document" | "video" | "image";
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { progress, upload } = useMemberUpload(folder);
  const accept = kind === "video" ? VIDEO_ACCEPT : kind === "image" ? IMAGE_ACCEPT : DOCUMENT_ACCEPT;
  const pick = async (file: File | undefined) => {
    if (!file) return;
    const asset = await upload(file);
    if (asset) onChange(asset.url);
    if (ref.current) ref.current.value = "";
  };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-input bg-white px-3 py-2.5">
      <FileText className="size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1 text-sm">
        {progress !== null ? (
          <div>
            <div className="mb-1 text-xs text-muted-foreground">Uploading… {Math.round(progress * 100)}%</div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        ) : value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="block truncate font-medium text-primary hover:underline">
            {decodeURIComponent(value.split("/").pop() ?? "file")}
          </a>
        ) : (
          <span className="text-muted-foreground">{label ?? "No file chosen"}</span>
        )}
      </div>
      {value && (
        <button type="button" onClick={() => onChange(null)} className="rounded-full p-1 hover:bg-muted" aria-label="Remove file">
          <X className="size-4" />
        </button>
      )}
      <button type="button" onClick={() => ref.current?.click()} disabled={progress !== null} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted">
        <Paperclip className="size-4" /> {value ? "Replace" : "Choose"}
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
    </div>
  );
}

// ---- Tabs (route-aware) ------------------------------------------------------------------

export function TabLinks({ items, className }: { items: Array<{ to: string; label: string; exact?: boolean; params?: Record<string, string>; count?: number }>; className?: string }) {
  return (
    <nav className={cn("no-scrollbar flex gap-1 overflow-x-auto border-b border-border", className)}>
      {items.map((t) => (
        <Link
          key={t.to + t.label}
          to={t.to}
          params={t.params as never}
          activeOptions={{ exact: t.exact ?? false }}
          className="relative shrink-0 px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary [&.active]:text-primary [&.active]:after:absolute [&.active]:after:inset-x-3 [&.active]:after:-bottom-px [&.active]:after:h-0.5 [&.active]:after:rounded-full [&.active]:after:bg-brand-gold"
        >
          {t.label}
          {t.count ? <span className="ml-1.5 rounded-full bg-brand-gold px-1.5 py-0.5 text-[10px] font-bold text-primary">{t.count}</span> : null}
        </Link>
      ))}
    </nav>
  );
}

export function Prose({ html, className }: { html: string | null | undefined; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={cn("prose prose-slate max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-primary prose-img:rounded-xl", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Plain text with line breaks preserved and links made clickable.
export function TextBlock({ text, className }: { text: string | null | undefined; className?: string }) {
  if (!text) return null;
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <p className={cn("break-words whitespace-pre-line", className)}>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer nofollow" className="text-info underline">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </p>
  );
}
