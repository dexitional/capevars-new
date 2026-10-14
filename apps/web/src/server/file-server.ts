// GET/HEAD /files/<key>: serves uploads from local storage the way a CDN
// would. Keys are never reused, so responses are cacheable for a year
// (immutable) by browsers and any CDN in front. Revalidation
// (ETag / Last-Modified -> 304) and byte ranges (video seeking, resumable
// downloads) are supported, and bodies stream from disk.
//
// Server-only: mounted as a Nitro handler (files-handler.ts), like /img.
import { createReadStream } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { contentTypeFor, FILES_ROUTE, statLocalObject } from "./api/lib/local-storage";

const IMMUTABLE = "public, max-age=31536000, immutable";

// Types the browser shows itself. Anything else downloads.
const INLINE = /^(image\/|video\/|application\/pdf$)/;

function notFound(status = 404, text = "Not found") {
  // Never cached: a file may appear moments later (uploads, a storage sync).
  return new Response(text, { status, headers: { "cache-control": "no-store", "content-type": "text/plain" } });
}

function matchesEtag(header: string, etag: string) {
  return header.split(",").some((tag) => {
    const t = tag.trim();
    return t === "*" || t.replace(/^W\//, "") === etag;
  });
}

// One "bytes=start-end" range (or a suffix "bytes=-n"). Multi-range requests
// get the whole file, which the spec allows.
function parseRange(header: string, size: number): { start: number; end: number } | "invalid" | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return null;
  let start: number;
  let end: number;
  if (!match[1]) {
    start = Math.max(0, size - Number(match[2]));
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  }
  return start > end || start >= size ? "invalid" : { start, end };
}

export async function handleFileRequest(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
  }
  const pathname = new URL(request.url).pathname;
  let key: string;
  try {
    key = decodeURIComponent(pathname.slice(FILES_ROUTE.length + 1));
  } catch {
    return notFound();
  }
  const found = await statLocalObject(key);
  if (!found) return notFound();

  const { file, info } = found;
  const size = info.size;
  const etag = `"${size.toString(36)}-${Math.floor(info.mtimeMs).toString(36)}"`;
  const lastModified = info.mtime.toUTCString();
  const type = contentTypeFor(key);
  // Keys look like <random8>-<name>.<ext>: offer the name without the prefix.
  const name = path.basename(key).replace(/^[0-9a-f]{8}-/, "");

  const headers: Record<string, string> = {
    "cache-control": IMMUTABLE,
    etag,
    "last-modified": lastModified,
    "accept-ranges": "bytes",
    "x-content-type-options": "nosniff",
    // Embeddable from any origin (a CDN domain, other sites), never scriptable.
    "cross-origin-resource-policy": "cross-origin",
    "access-control-allow-origin": "*",
    "timing-allow-origin": "*",
    // Chrome won't render a PDF under a sandbox CSP, and PDFs can't run our scripts anyway.
    ...(type === "application/pdf" ? {} : { "content-security-policy": "default-src 'none'; sandbox" }),
  };

  const ifNoneMatch = request.headers.get("if-none-match");
  const ifModifiedSince = request.headers.get("if-modified-since");
  const fresh = ifNoneMatch
    ? matchesEtag(ifNoneMatch, etag)
    : !!ifModifiedSince && Date.parse(ifModifiedSince) >= Math.floor(info.mtimeMs / 1000) * 1000;
  if (fresh) return new Response(null, { status: 304, headers });

  headers["content-type"] = type;
  headers["content-disposition"] =
    `${INLINE.test(type) ? "inline" : "attachment"}; filename="${name.replace(/"/g, "")}"`;

  let start = 0;
  let end = size - 1;
  let status = 200;
  const rangeHeader = request.headers.get("range");
  const ifRange = request.headers.get("if-range");
  if (rangeHeader && (!ifRange || ifRange === etag || ifRange === lastModified)) {
    const range = parseRange(rangeHeader, size);
    if (range === "invalid") {
      return new Response(null, { status: 416, headers: { ...headers, "content-range": `bytes */${size}` } });
    }
    if (range) {
      ({ start, end } = range);
      status = 206;
      headers["content-range"] = `bytes ${start}-${end}/${size}`;
    }
  }
  headers["content-length"] = String(size === 0 ? 0 : end - start + 1);

  if (request.method === "HEAD" || size === 0) return new Response(null, { status, headers });
  const body = Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream<Uint8Array>;
  return new Response(body, { status, headers });
}
