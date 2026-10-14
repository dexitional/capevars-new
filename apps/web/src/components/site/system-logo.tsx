// The system logos on the site: a pale-yellow tile with the platform's navy
// mark (lib/system-marks.ts), plus a "Capevars / Name" lockup. One family,
// one colour pair, everywhere a platform is named.
import { cn } from "#/lib/utils";
import { SYSTEM_MARKS } from "#/lib/system-marks";
import type { MarkPart, SystemKey } from "#/lib/system-marks";

export type { SystemKey };

const KNOCK = "var(--mark-knock, var(--brand-cream))";

function Part({ part }: { part: MarkPart }) {
  const color = part.paint === "knock" ? KNOCK : "currentColor";
  if (part.stroke) {
    return <path d={part.d} fill="none" style={{ stroke: color }} strokeWidth={part.stroke} strokeLinecap="round" strokeLinejoin="round" />;
  }
  return (
    <path
      d={part.d}
      style={{ fill: color, ...(part.outline ? { stroke: KNOCK } : {}) }}
      strokeWidth={part.outline}
      strokeLinejoin="round"
    />
  );
}

/** The bare mark, in the current text colour. */
export function SystemMark({ system, className }: { system: SystemKey; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      {SYSTEM_MARKS[system].map((part, i) => (
        <Part key={i} part={part} />
      ))}
    </svg>
  );
}

const SIZES = { xs: 22, sm: 28, md: 34, lg: 44, xl: 56, "2xl": 72 } as const;
export type LogoSize = keyof typeof SIZES;

/** The tile: pale yellow, navy mark, 28% corner radius (the app-icon proportion). */
export function SystemLogo({
  system,
  size = "md",
  className,
  label,
}: {
  system: SystemKey;
  size?: LogoSize;
  className?: string;
  /** Accessible name, when the logo stands alone (no text beside it). */
  label?: string;
}) {
  const px = SIZES[size];
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center bg-brand-cream text-primary",
        // A lit top edge and a hairline rim: crisp on white, navy and cream alike.
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.75),inset_0_0_0_1px_rgb(4_29_64/0.1),0_1px_2px_rgb(4_29_64/0.18)]",
        className,
      )}
      style={{ width: px, height: px, borderRadius: px * 0.28 }}
    >
      <SystemMark system={system} className="size-[70%]" />
    </span>
  );
}

const LOCKUP_TEXT: Partial<Record<LogoSize, string>> = {
  sm: "text-[15px]",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
};

/** Tile + "CAPEVARS" eyebrow + platform name. `tone="light"` for navy backgrounds. */
export function SystemLockup({
  system,
  name,
  size = "md",
  tone = "dark",
  className,
}: {
  system: SystemKey;
  name: string;
  size?: LogoSize;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <SystemLogo system={system} size={size} />
      <span className="leading-none">
        <span className={cn("block text-[9px] font-bold tracking-[0.26em] uppercase", tone === "light" ? "text-brand-cream/75" : "text-primary/55")}>
          Capevars
        </span>
        <span className={cn("mt-1 block font-display font-black tracking-tight", LOCKUP_TEXT[size] ?? "text-sm", tone === "light" ? "text-white" : "text-primary")}>
          {name}
        </span>
      </span>
    </span>
  );
}
