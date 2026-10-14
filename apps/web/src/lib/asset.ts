// Deploys at the domain root (Vite `base: '/'`) — a helper rather than
// hardcoded strings so a path-prefixed deploy stays a one-line change.
export function asset(path: string) {
  // import.meta.env is undefined outside Vite (e.g. tsx scripts).
  const base = (import.meta.env as Partial<ImportMetaEnv> | undefined)?.BASE_URL ?? "/";
  return `${base}${path.replace(/^\//, "")}`;
}

// Optional CDN in front of the app (CDN_URL, baked in at build time). Stored
// file URLs are always relative (/files/...), so a CDN domain is purely a
// deploy setting: the same database works in development and production.
const CDN = typeof __CDN_URL__ === "undefined" ? "" : __CDN_URL__;

/** Serves uploads (/files) and optimised images (/img) from the CDN when one is set. */
export function cdn(path: string) {
  return CDN && /^\/(files\/|img\b)/.test(path) ? `${CDN}${path}` : path;
}

// Uploads are /files/... paths (or absolute R2 URLs from before a storage
// switch); anything else is a public/ path.
export function imageSrc(url: string) {
  return /^https?:\/\//.test(url) ? url : cdn(asset(url));
}
