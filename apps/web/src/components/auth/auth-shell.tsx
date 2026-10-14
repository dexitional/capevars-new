import { Link } from "@tanstack/react-router";
import { GraduationCap, Map as MapIcon, MessageCircle, ShoppingBag, Users } from "lucide-react";
import { asset } from "#/lib/asset";
import { Logo } from "#/components/site/kit";

export function GoogleButton({ next, label = "Continue with Google" }: { next: string; label?: string }) {
  return (
    <a
      href={`/api/auth/google?next=${encodeURIComponent(next)}`}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-input bg-white text-sm font-semibold text-foreground shadow-xs transition hover:bg-muted"
    >
      <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      {label}
    </a>
  );
}

export function Divider({ text = "or" }: { text?: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      <span className="h-px flex-1 bg-border" /> {text} <span className="h-px flex-1 bg-border" />
    </div>
  );
}

const FEATURES = [
  { icon: ShoppingBag, text: "Shop, order food and book tickets" },
  { icon: MapIcon, text: "Find hostels, hotels and places" },
  { icon: Users, text: "Join campus groups and associations" },
  { icon: MessageCircle, text: "Connect and chat with friends" },
  { icon: GraduationCap, text: "Learn — or teach — online courses" },
];

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="hero-navy relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <Link to="/" className="relative">
          <Logo light />
        </Link>
        <div className="relative">
          <img src={asset("logo-mark-light.png")} alt="" className="mb-8 h-28 w-auto drop-shadow-2xl" />
          <p className="max-w-md text-3xl leading-tight font-black">One account. Your whole campus and community.</p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-white/80">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-brand-cream">
                  <f.icon className="size-4" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/50">Innovation in style.</p>
      </div>
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-black tracking-tight text-primary">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const OAUTH_ERRORS: Record<string, string> = {
  google_not_configured: "Google sign-in isn't set up yet. Use your email and password.",
  cancelled: "Google sign-in was cancelled.",
  invalid_state: "That sign-in link expired. Please try again.",
  google_failed: "We couldn't verify your Google account. Please try again.",
  suspended: "This account has been suspended. Contact support.",
};
