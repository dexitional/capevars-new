// The signed-in member's banner at the top of SocialNet: their cover and
// photo in a card that tilts in 3D toward the pointer. Its layers sit at
// different depths: the cover drifts behind (parallax), info chips float
// in the middle, and the photo and name stand out in front, under a glare
// that follows the pointer. Motion is in styles.css ("Profile hero") and
// stops for visitors who prefer reduced motion.
//
// The outer card carries the 3D transform without overflow-hidden (which
// would flatten 3D); only the cover plane is clipped to the rounded shape.
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, GraduationCap, MapPin, Newspaper, Pencil, Sparkles, Users, UsersRound } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { initials } from "#/lib/format";
import { OptimizedImage } from "#/components/site/optimized-image";

type Row = Record<string, any>;
interface Profile {
  profile: Row;
  counts: { friends: number; posts: number };
  friends: Array<Row>;
  groups: Array<Row>;
}

// Same cache entry as the profile page (/u/$username).
const profileQuery = (username: string) => ({
  queryKey: ["profile", username],
  queryFn: () => api.get<Profile>(`/social/u/${username}`),
  staleTime: 60_000,
});

// One layer of the card, lifted toward the viewer by `z` pixels.
function Layer({ z, className, children }: { z: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("absolute", className)} style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

function Chip({ icon: Icon, children, delay }: { icon: typeof MapPin; children: React.ReactNode; delay: number }) {
  return (
    <span className="profile-hero-chip inline-flex items-center gap-1.5 rounded-full border-2 border-white/[0.18] bg-primary/75 px-3 py-1.5 text-xs font-semibold text-brand-cream shadow-lg backdrop-blur-sm" style={{ animationDelay: `${delay}s` }}>
      <Icon className="size-3.5 text-brand-cream" /> {children}
    </span>
  );
}

function Stat({ icon: Icon, label, value, children }: { icon: typeof Users; label: string; value: number; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-white/[0.18] bg-primary/75 px-4 py-2.5 text-white shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-white/70 uppercase">
        <Icon className="size-3.5 text-brand-gold" /> {label}
      </div>
      <div className="mt-0.5 flex items-center gap-2">
        <span className="text-2xl font-black tabular-nums">{value}</span>
        {children}
      </div>
    </div>
  );
}

export function ProfileHero({ username, fallbackName, fallbackAvatar }: { username: string; fallbackName: string; fallbackAvatar: string | null }) {
  const card = useRef<HTMLDivElement>(null);
  const { data } = useQuery(profileQuery(username));
  const p = data?.profile ?? {};
  const name = (p.full_name as string | undefined) ?? fallbackName;
  const avatar = (p.avatar_url as string | null | undefined) ?? fallbackAvatar;
  const cover = p.cover_url as string | null;
  const friends = data?.friends ?? [];

  // Tilt toward the pointer (mouse/pen only; touch scrolls normally).
  const onMove = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--px", `${((0.5 - x) * 24).toFixed(1)}px`);
    el.style.setProperty("--py", `${((0.5 - y) * 16).toFixed(1)}px`);
    el.dataset.tilt = "on";
  };
  const onLeave = () => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--px", "0px");
    el.style.setProperty("--py", "0px");
    el.dataset.tilt = "off";
  };

  return (
    <section className="profile-hero-stage mb-3" aria-label="Your profile">
      <div ref={card} className="profile-hero-card relative h-[16rem] sm:h-[13.5rem]" onPointerMove={onMove} onPointerLeave={onLeave}>
        {/* Back plane: the cover, clipped to the card, drifting slightly against the tilt.
            It ignores the pointer: once the card tilts, 3D hit-testing would otherwise
            hand clicks meant for the front-layer links to this plane. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem] bg-primary shadow-[0_40px_80px_-30px_rgb(4_29_64/0.7)]">
          <div className="profile-hero-parallax absolute -inset-8">
            {cover ? (
              <OptimizedImage src={cover} alt="" priority sizes="(min-width: 1280px) 1280px, 100vw" className="profile-hero-cover size-full object-cover" />
            ) : (
              <div className="profile-hero-cover size-full bg-[radial-gradient(60%_80%_at_20%_20%,#1d4277,transparent),radial-gradient(50%_70%_at_85%_30%,rgb(245_184_20/0.45),transparent),linear-gradient(135deg,#041d40,#0b2d5c)]" />
            )}
          </div>
          {/* Legibility wash, a faint dot grid and the pointer glare. */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-primary/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-transparent to-transparent" />
          <div className="dot-grid absolute inset-0 opacity-30" />
          <div className="profile-hero-glare absolute inset-0" />
          {/* Drifting orbs. */}
          <span className="profile-hero-orb absolute top-6 left-[12%] size-24 rounded-full bg-brand-gold/30 blur-2xl" />
          <span className="profile-hero-orb absolute right-[18%] bottom-10 size-32 rounded-full bg-brand-cream/20 blur-3xl" style={{ animationDelay: "-3s" }} />
          <span className="profile-hero-orb absolute top-1/3 right-[40%] size-16 rounded-full bg-sky-300/20 blur-2xl" style={{ animationDelay: "-6s" }} />
        </div>

        {/* Middle layer: floating info chips. */}
        <Layer z={24} className="top-6 right-9 hidden flex-wrap justify-end gap-2 lg:flex">
          {p.institution && (
            <Chip icon={GraduationCap} delay={0}>
              {p.institution}
            </Chip>
          )}
          {p.location && (
            <Chip icon={MapPin} delay={0.6}>
              {p.location}
            </Chip>
          )}
          {Number(p.is_verified) ? (
            <Chip icon={BadgeCheck} delay={1.2}>
              Verified
            </Chip>
          ) : null}
        </Layer>

        {/* Front layer: photo, name and headline. */}
        <Layer z={42} className="bottom-7 left-7 sm:left-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="profile-hero-rise relative" style={{ animationDelay: "0.1s" }}>
              <span className="profile-hero-ring absolute -inset-1.5 rounded-full" aria-hidden="true" />
              <span className="absolute -inset-1.5 rounded-full shadow-[0_0_40px_6px_rgb(245_184_20/0.45)]" aria-hidden="true" />
              {avatar ? (
                <OptimizedImage src={avatar} alt={name} sizes="128px" className="relative size-24 rounded-full border-4 border-primary object-cover sm:size-28" />
              ) : (
                <span className="relative flex size-24 items-center justify-center rounded-full border-4 border-primary bg-brand-cream text-3xl font-black text-primary sm:size-28">
                  {initials(name)}
                </span>
              )}
              {Number(p.is_verified) ? (
                <span className="absolute right-0 bottom-1 flex size-7 items-center justify-center rounded-full bg-brand-gold text-primary ring-4 ring-primary">
                  <BadgeCheck className="size-4" />
                </span>
              ) : null}
            </div>
            <div className="profile-hero-rise text-white" style={{ animationDelay: "0.25s" }}>
              <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">
                <Sparkles className="size-3.5" /> Welcome back
              </p>
              <h1 className="mt-1 font-hero text-3xl leading-none font-bold tracking-normal drop-shadow-[0_4px_12px_rgb(0_0_0/0.45)] sm:text-4xl">{name}</h1>
              <p className="mt-1.5 text-sm text-white/80">
                @{username}
                {p.headline ? ` · ${p.headline}` : ""}
              </p>
            </div>
          </div>
        </Layer>

        {/* Front layer: stats and actions. */}
        <Layer z={32} className="right-10 bottom-7 hidden lg:block">
          <div className="profile-hero-rise flex flex-col items-end gap-3" style={{ animationDelay: "0.4s" }}>
            <div className="flex gap-2.5">
              <Stat icon={Users} label="Friends" value={data?.counts.friends ?? 0}>
                <span className="flex -space-x-2">
                  {friends.slice(0, 4).map((f) => (
                    <span key={f.id} className="size-6 overflow-hidden rounded-full border-2 border-primary bg-brand-cream">
                      {f.avatar_url ? (
                        <OptimizedImage src={f.avatar_url} alt="" sizes="24px" className="size-full object-cover" />
                      ) : (
                        <span className="flex size-full items-center justify-center text-[9px] font-black text-primary">{initials(f.full_name ?? "")}</span>
                      )}
                    </span>
                  ))}
                </span>
              </Stat>
              <Stat icon={Newspaper} label="Posts" value={data?.counts.posts ?? 0} />
              <Stat icon={UsersRound} label="Groups" value={data?.groups.length ?? 0} />
            </div>
            <div className="flex gap-2">
              <Link to="/account" className="btn-shine bg-primary/75! backdrop-blur-sm">
                <Pencil className="btn-shine-icon" /> Edit profile
              </Link>
              <Link to="/u/$username" params={{ username }} className="btn-shine bg-primary/75! backdrop-blur-sm">
                View profile
              </Link>
            </div>
          </div>
        </Layer>

        {/* Small screens: actions under the name. */}
        <Layer z={32} className="top-5 right-6 flex gap-2 lg:hidden">
          <Link to="/u/$username" params={{ username }} className="btn-shine bg-primary/75! backdrop-blur-sm">
            View profile
          </Link>
        </Layer>
      </div>
    </section>
  );
}
