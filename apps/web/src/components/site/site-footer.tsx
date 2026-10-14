import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { api } from "#/lib/api-client";
import { DEFAULT_SETTINGS } from "#/lib/settings";
import type { SiteSettings } from "#/lib/settings";
import { Logo } from "./kit";
import { SYSTEMS } from "./site-header";
import { SystemLogo } from "./system-logo";

export const settingsQuery = {
  queryKey: ["public-settings"] as const,
  queryFn: () => api.get<Pick<SiteSettings, "identity" | "socials" | "notice" | "home" | "finder" | "marketplace">>("/public/settings"),
  staleTime: 5 * 60_000,
};

const SOCIAL_ICONS = { facebook: Facebook, x: Twitter, instagram: Instagram, youtube: Youtube, linkedin: Linkedin, tiktok: null } as const;

export function SiteFooter() {
  const { data } = useQuery(settingsQuery);
  const identity = data?.identity ?? DEFAULT_SETTINGS.identity;
  const socials = data?.socials ?? DEFAULT_SETTINGS.socials;
  return (
    <footer className="relative overflow-hidden bg-primary text-white">
      <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1.4fr_repeat(6,1fr)]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm text-white/70">{identity.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              {identity.address && (
                <li className="flex gap-2">
                  <MapPin className="size-4 shrink-0 text-brand-cream" /> {identity.address}
                </li>
              )}
              {identity.supportEmail && (
                <li className="flex gap-2">
                  <Mail className="size-4 shrink-0 text-brand-cream" />
                  <a href={`mailto:${identity.supportEmail}`} className="hover:text-white">
                    {identity.supportEmail}
                  </a>
                </li>
              )}
              {identity.supportPhone && (
                <li className="flex gap-2">
                  <Phone className="size-4 shrink-0 text-brand-cream" /> {identity.supportPhone}
                </li>
              )}
            </ul>
            <div className="mt-5 flex gap-2">
              {Object.entries(socials)
                .filter(([, url]) => url)
                .map(([key, url]) => {
                  const Icon = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={key} className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                      {Icon ? <Icon className="size-4" /> : <span className="text-xs font-bold uppercase">{key.slice(0, 2)}</span>}
                    </a>
                  );
                })}
            </div>
          </div>
          {SYSTEMS.map((s) => (
            <div key={s.key}>
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-cream">
                <SystemLogo system={s.key} size="xs" />
                {s.label}
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} search={l.search as never} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {identity.name}. {identity.tagline}.
          </p>
          <div className="flex gap-4">
            <Link to="/search" className="hover:text-white">
              Search
            </Link>
            <Link to="/seller/apply" className="hover:text-white">
              Sell on Capevars
            </Link>
            <Link to="/learn/teach" className="hover:text-white">
              Teach
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
