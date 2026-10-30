import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Facebook, Instagram, Play, Youtube } from "lucide-react";
import { cn } from "#/lib/utils";
import { TextBlock } from "#/components/site/kit";

// Links to YouTube, Facebook, Instagram and X posts render as the platform's own embed.
// YouTube is a click-to-play thumbnail; the others load their official widget script once,
// and only when the post scrolls near the viewport. A blocked or private post falls back to a link card.

export type Embed =
  | { kind: "youtube"; url: string; id?: string; list?: string; start?: number; vertical: boolean }
  | { kind: "facebook"; url: string; video: boolean; vertical: boolean }
  | { kind: "instagram"; url: string; permalink: string }
  | { kind: "x"; url: string; id: string };

// Full URLs, plus bare links to the supported platforms (people paste "web.facebook.com/reel/…" without the scheme).
const URL_RE = /(?:https?:\/\/|(?<![\w.@/-])(?:(?:www|m|mobile|web|music)\.)?(?:youtube\.com|youtu\.be|facebook\.com|fb\.watch|instagram\.com|x\.com|twitter\.com)\/)[^\s<>"']*/g;
const YT_ID = /^[\w-]{11}$/;

function seconds(t: string | null) {
  if (!t) return undefined;
  if (/^\d+$/.test(t)) return Number(t);
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  return m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) || undefined : undefined;
}

export function parseEmbed(raw: string): Embed | null {
  let u: URL;
  try {
    const clean = raw.replace(/[).,!?;:]+$/, "");
    u = new URL(/^https?:\/\//i.test(clean) ? clean : `https://${clean}`);
  } catch {
    return null;
  }
  const url = u.toString();
  const host = u.hostname.replace(/^(www|m|mobile|web|music)\./, "");
  const parts = u.pathname.split("/").filter(Boolean);

  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    const start = seconds(u.searchParams.get("t") ?? u.searchParams.get("start"));
    const list = u.searchParams.get("list") ?? undefined;
    let id: string | undefined;
    if (host === "youtu.be") id = parts[0];
    else if (parts[0] === "watch") id = u.searchParams.get("v") ?? undefined;
    else if (["shorts", "embed", "live", "v"].includes(parts[0] ?? "")) id = parts[1];
    if (id && !YT_ID.test(id)) id = undefined;
    if (!id && !(parts[0] === "playlist" && list)) return null;
    return { kind: "youtube", url, id, list, start, vertical: parts[0] === "shorts" };
  }

  if (host === "fb.watch") return { kind: "facebook", url, video: true, vertical: false };
  if (host === "facebook.com") {
    const path = u.pathname;
    const video = /\/(videos|reel|watch)\b|^\/share\/[vr]\//.test(path);
    const post = /\/(posts|permalink|photos?|story\.php|permalink\.php|photo\.php)\b|^\/share\/p\//.test(path) || u.searchParams.has("story_fbid") || u.searchParams.has("fbid");
    return video || post ? { kind: "facebook", url, video, vertical: /\/reel\/|^\/share\/r\//.test(path) } : null;
  }

  if (host === "instagram.com") {
    const at = parts.findIndex((p) => ["p", "reel", "reels", "tv"].includes(p));
    const code = at >= 0 ? parts[at + 1] : undefined;
    if (!code) return null;
    return { kind: "instagram", url, permalink: `https://www.instagram.com/${parts[at] === "reels" ? "reel" : parts[at]}/${code}/` };
  }

  if (host === "x.com" || host === "twitter.com") {
    const at = parts.findIndex((p) => p === "status" || p === "statuses");
    const id = at >= 0 ? parts[at + 1] : undefined;
    return id && /^\d+$/.test(id) ? { kind: "x", url, id } : null;
  }
  return null;
}

export function findEmbeds(text: string | null | undefined, max = 3): Array<Embed> {
  const seen = new Set<string>();
  const out: Array<Embed> = [];
  for (const m of text?.match(URL_RE) ?? []) {
    const e = parseEmbed(m);
    const key = e && (e.kind === "youtube" ? `yt:${e.id ?? e.list}` : e.kind === "x" ? `x:${e.id}` : e.kind === "instagram" ? e.permalink : e.url);
    if (!e || !key || seen.has(key)) continue;
    seen.add(key);
    out.push(e);
    if (out.length === max) break;
  }
  return out;
}

/** Post text with its links embedded below. A link on a line of its own is dropped from the text, since the embed shows it. */
export function PostText({ text, className }: { text: string | null | undefined; className?: string }) {
  const [embeds, shown] = useMemo(() => {
    const found = findEmbeds(text);
    if (!found.length) return [found, text] as const;
    const urls = new Set(found.map((e) => e.url));
    const rest = (text ?? "")
      .split("\n")
      .filter((line) => {
        const t = line.trim();
        const e = t && !/\s/.test(t) ? parseEmbed(t) : null;
        return !(e && urls.has(e.url));
      })
      .join("\n")
      .trim();
    return [found, rest] as const;
  }, [text]);
  return (
    <>
      {shown && <TextBlock text={shown} className={className} />}
      {embeds.map((e) => (
        <LinkEmbed key={e.url} embed={e} />
      ))}
    </>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const BRAND = {
  youtube: { label: "YouTube", icon: Youtube, tone: "bg-red-600" },
  facebook: { label: "Facebook", icon: Facebook, tone: "bg-[#1877F2]" },
  instagram: { label: "Instagram", icon: Instagram, tone: "bg-linear-to-br from-amber-400 via-pink-500 to-purple-600" },
  x: { label: "X", icon: XLogo, tone: "bg-black" },
} as const;

function LinkCard({ embed }: { embed: Embed }) {
  const b = BRAND[embed.kind];
  const u = new URL(embed.url);
  return (
    <a href={embed.url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3 transition-colors hover:bg-muted">
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg text-white", b.tone)}>
        <b.icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">View on {b.label}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {u.hostname.replace(/^www\./, "")}
          {u.pathname}
        </span>
      </span>
      <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
    </a>
  );
}

function LinkEmbed({ embed }: { embed: Embed }) {
  return <div className="mt-3">{embed.kind === "youtube" ? <YouTube embed={embed} /> : <Widget embed={embed} />}</div>;
}

function YouTube({ embed }: { embed: Extract<Embed, { kind: "youtube" }> }) {
  const [playing, setPlaying] = useState(false);
  const src = embed.id
    ? `https://www.youtube-nocookie.com/embed/${embed.id}?${new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1", ...(embed.start ? { start: String(embed.start) } : {}), ...(embed.list ? { list: embed.list } : {}) })}`
    : `https://www.youtube-nocookie.com/embed/videoseries?list=${embed.list}`;
  const frame = cn("relative overflow-hidden rounded-xl bg-black", embed.vertical ? "mx-auto aspect-9/16 w-full max-w-80" : "aspect-video w-full");
  if (playing || !embed.id)
    return (
      <div className={frame}>
        <iframe src={src} title="YouTube video" className="absolute inset-0 size-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </div>
    );
  return (
    <button type="button" onClick={() => setPlaying(true)} className={cn(frame, "group block")} aria-label="Play YouTube video">
      <img src={`https://i.ytimg.com/vi/${embed.id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
      <span className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
      <span className="absolute top-1/2 left-1/2 flex h-12 w-17 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-red-600 shadow-lg transition-transform group-hover:scale-110">
        <Play className="size-6 fill-white text-white" />
      </span>
      <span className="absolute bottom-2 left-3 flex items-center gap-1.5 text-xs font-semibold text-white">
        <Youtube className="size-4" /> YouTube
      </span>
    </button>
  );
}

// ---- Facebook, Instagram and X: the platform's own widget script ----

declare global {
  interface Window {
    twttr?: { widgets: { createTweet: (id: string, el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLElement | undefined> } };
    instgrm?: { Embeds: { process: () => void } };
    FB?: { init: (opts: Record<string, unknown>) => void; XFBML: { parse: (el?: HTMLElement, done?: () => void) => void } };
    fbAsyncInit?: () => void;
  }
}

const loading = new Map<string, Promise<void>>();

/** Loads a widget script once, then waits for its global: these scripts can finish loading before they define it. */
function loadScript(src: string, ready: () => boolean, setup?: () => void) {
  if (ready()) return Promise.resolve();
  let p = loading.get(src);
  if (!p) {
    p = new Promise<void>((resolve, reject) => {
      const fail = () => {
        loading.delete(src);
        reject(new Error(`Could not load ${src}`));
      };
      setup?.();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => {
        const until = Date.now() + 8000;
        const check = () => (ready() ? resolve() : Date.now() > until ? fail() : window.setTimeout(check, 100));
        check();
      };
      s.onerror = fail;
      document.body.appendChild(s);
    });
    loading.set(src, p);
  }
  return p;
}

const FB_VERSION = "v23.0";
let fbReady = false;

const loaders = {
  x: () => loadScript("https://platform.twitter.com/widgets.js", () => typeof window.twttr?.widgets.createTweet === "function"),
  instagram: () => loadScript("https://www.instagram.com/embed.js", () => typeof window.instgrm?.Embeds.process === "function"),
  facebook: () =>
    loadScript(
      "https://connect.facebook.net/en_US/sdk.js",
      () => fbReady,
      () => {
        if (!document.getElementById("fb-root")) document.body.prepend(Object.assign(document.createElement("div"), { id: "fb-root" }));
        window.fbAsyncInit = () => {
          window.FB!.init({ xfbml: false, version: FB_VERSION });
          fbReady = true;
        };
      },
    ),
};

function attr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Renders the widget into a fresh child node so a remount (or Strict Mode) never doubles it up. */
async function render(embed: Exclude<Embed, { kind: "youtube" }>, host: HTMLElement): Promise<boolean> {
  await loaders[embed.kind]();
  if (embed.kind === "x") {
    const el = await window.twttr!.widgets.createTweet(embed.id, host, { dnt: true, align: "center", conversation: "none" });
    return Boolean(el);
  }
  if (embed.kind === "instagram") {
    host.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${attr(embed.permalink)}" data-instgrm-captioned data-instgrm-version="14" style="margin:0 auto;max-width:540px;min-width:280px;width:100%;border:0"></blockquote>`;
    window.instgrm!.Embeds.process();
    return true;
  }
  const room = host.parentElement?.clientWidth ?? 500;
  // Reels are 9:16, so they get the same 320px column as YouTube Shorts instead of the full card width.
  const width = Math.round(embed.vertical ? Math.min(320, room) : Math.min(750, Math.max(350, room)));
  host.innerHTML = embed.video
    ? `<div class="fb-video" data-href="${attr(embed.url)}" data-width="${width}" data-allowfullscreen="true" data-show-text="false"></div>`
    : `<div class="fb-post" data-href="${attr(embed.url)}" data-width="${width}" data-show-text="true"></div>`;
  await new Promise<void>((done) => window.FB!.XFBML.parse(host, done));
  return Boolean(host.querySelector("iframe"));
}

function useNearViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === "undefined") return setNear(true);
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setNear(true), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  return [ref, near] as const;
}

function Widget({ embed }: { embed: Exclude<Embed, { kind: "youtube" }> }) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  useEffect(() => {
    const box = ref.current;
    if (!near || !box) return;
    let live = true;
    const host = document.createElement("div");
    host.className = "flex justify-center [&>*]:max-w-full";
    box.appendChild(host);
    const settle = (ok: boolean) => live && setState(ok ? "ready" : "failed");
    // Show the widget as soon as its iframe exists: the platform's own "done" callback can come late or not at all.
    const watch = new MutationObserver(() => host.querySelector("iframe") && settle(true));
    watch.observe(host, { childList: true, subtree: true });
    // Slow connections: after 15s show the link card meanwhile, but keep going; a late widget still replaces it.
    const timeout = window.setTimeout(() => !host.querySelector("iframe") && settle(false), 15000);
    // One retry covers a dropped script download.
    render(embed, host)
      .catch(() => new Promise((r) => window.setTimeout(r, 3000)).then(() => (live ? render(embed, host) : false)))
      .then(settle, () => settle(false));
    return () => {
      live = false;
      watch.disconnect();
      window.clearTimeout(timeout);
      host.remove();
    };
  }, [near, embed, ref]);
  const b = BRAND[embed.kind];
  return (
    <div className="relative overflow-hidden">
      {state === "failed" && <LinkCard embed={embed} />}
      {state === "loading" && (
        <div className="flex h-56 animate-pulse flex-col items-center justify-center gap-2 rounded-xl border bg-muted/50 text-sm text-muted-foreground">
          <span className={cn("flex size-10 items-center justify-center rounded-lg text-white", b.tone)}>
            <b.icon className="size-5" />
          </span>
          Loading {b.label} post…
        </div>
      )}
      {/* Stays mounted while loading or failed, out of sight, so the widget can still arrive. */}
      <div ref={ref} aria-hidden={state !== "ready"} className={cn(state !== "ready" && "pointer-events-none absolute inset-x-0 top-0 opacity-0")} />
    </div>
  );
}
