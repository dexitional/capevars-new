// Local file storage: uploads live on this server's disk under STORAGE_DIR and
// are served from /files/<key> (server/file-server.ts) with CDN-style caching.
// Browsers still upload straight to storage with a short-lived signed PUT URL,
// the same flow as R2's presigned URLs, so the upload UI doesn't care which
// driver is on.
//
// Keys are unique and never reused (<prefix>/<owner>/<folder>/<yyyy>/<mm>/
// <random>-name.ext) and a stored file is never overwritten, so every URL can
// be cached forever. The database only ever holds relative /files/... URLs,
// which is what makes the storage folder portable between machines (see
// scripts/storage.ts).
//
// Plain Node only (no Vite or Hono imports): the file server, the image
// optimiser and the CLI scripts all share it.
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { link, mkdir, readFile, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export const FILES_ROUTE = "/files";

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 403 | 404 | 409 = 400,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export function storageRoot() {
  return path.resolve(process.env.STORAGE_DIR || path.join(process.cwd(), "storage"));
}

// ---- Keys and URLs -------------------------------------------------------------------

// Every segment starts with a letter or digit, so "." and ".." can't appear.
const KEY_RE = /^[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*$/i;

/** Absolute path for a key, or null when the key isn't one we'd ever write. */
export function filePathFor(key: string): string | null {
  if (key.length > 500 || !KEY_RE.test(key)) return null;
  const root = storageRoot();
  const file = path.resolve(root, key);
  return file.startsWith(root + path.sep) ? file : null;
}

/** Always relative: a domain is a deploy setting (CDN_URL), never stored. */
export const localPublicUrl = (key: string) => `${FILES_ROUTE}/${key}`;

/**
 * The key behind a /files URL. Relative URLs are the norm. Absolute ones are
 * accepted when they point at this app (APP_URL) or its CDN (CDN_URL).
 */
export function localKeyFromUrl(url: string): string | null {
  let pathname = url;
  if (!url.startsWith("/") || url.startsWith("//")) {
    const bases = [process.env.APP_URL, process.env.CDN_URL]
      .map((b) => (b ?? "").trim().replace(/\/+$/, ""))
      .filter(Boolean);
    const base = bases.find((b) => url.startsWith(`${b}${FILES_ROUTE}/`));
    if (!base) return null;
    pathname = url.slice(base.length);
  }
  pathname = pathname.split(/[?#]/)[0] ?? "";
  if (!pathname.startsWith(`${FILES_ROUTE}/`)) return null;
  let key: string;
  try {
    key = decodeURIComponent(pathname.slice(FILES_ROUTE.length + 1));
  } catch {
    return null;
  }
  return filePathFor(key) ? key : null;
}

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export function contentTypeFor(key: string) {
  return MIME[path.extname(key).slice(1).toLowerCase()] ?? "application/octet-stream";
}

// ---- Signed upload URLs ----------------------------------------------------------------

function signingKey() {
  const secret = process.env.STORAGE_SIGNING_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Set STORAGE_SIGNING_SECRET (or ADMIN_SESSION_SECRET) to sign uploads.");
  return createHmac("sha256", secret).update("capevars:storage-upload:v1").digest();
}

const sign = (payload: string) => createHmac("sha256", signingKey()).update(payload).digest("base64url");

/** Like an S3 presigned PUT: key, type and exact size are signed in, valid for `ttl` seconds. */
export function signLocalUpload(key: string, contentType: string, size: number, ttl = 600) {
  const exp = String(Math.floor(Date.now() / 1000) + ttl);
  const sig = sign([key, contentType, size, exp].join("\n"));
  return `/api/storage/upload?${new URLSearchParams({ key, type: contentType, size: String(size), exp, sig })}`;
}

export interface UploadGrant {
  key: string;
  contentType: string;
  size: number;
}

export function verifyLocalUpload(params: URLSearchParams): UploadGrant | null {
  const key = params.get("key") ?? "";
  const contentType = params.get("type") ?? "";
  const size = Number(params.get("size"));
  const exp = Number(params.get("exp"));
  const sig = Buffer.from(params.get("sig") ?? "");
  if (!filePathFor(key) || !contentType || !Number.isInteger(size) || size <= 0) return null;
  if (!Number.isInteger(exp) || exp < Date.now() / 1000) return null;
  const expected = Buffer.from(sign([key, contentType, size, exp].join("\n")));
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;
  return { key, contentType, size };
}

// ---- Reading and writing ----------------------------------------------------------------

// The first bytes of each type we accept. A file that claims to be an image
// but isn't (an HTML page renamed .jpg, say) is refused.
const MAGIC: Array<[RegExp, (b: Buffer) => boolean]> = [
  [/^image\/jpeg$/, (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  [/^image\/png$/, (b) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))],
  [/^image\/gif$/, (b) => b.subarray(0, 4).toString("latin1") === "GIF8"],
  [/^image\/webp$/, (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP"],
  [/^image\/avif$/, (b) => b.subarray(4, 8).toString("latin1") === "ftyp"],
  [/^application\/pdf$/, (b) => b.subarray(0, 4).toString("latin1") === "%PDF"],
  [/^video\/(mp4|quicktime)$/, (b) => /^(ftyp|moov|mdat|wide|free|skip)$/.test(b.subarray(4, 8).toString("latin1"))],
  [/^video\/webm$/, (b) => b.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))],
  [/openxmlformats|^application\/zip$/, (b) => b.subarray(0, 4).toString("latin1") === "PK\x03\x04"],
  [/^application\/(msword|vnd\.ms-)/, (b) => b.subarray(0, 4).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0]))],
];

function looksLike(head: Buffer, contentType: string) {
  const check = MAGIC.find(([type]) => type.test(contentType));
  return !check || check[1](head);
}

/**
 * Streams `body` into storage at `key`: exactly `size` bytes, content matching
 * `contentType`, never replacing a file that's already there. Returns the
 * file's SHA-256.
 */
export async function writeLocalObject(
  key: string,
  body: ReadableStream<Uint8Array> | NodeJS.ReadableStream,
  size: number,
  contentType: string,
): Promise<string> {
  const file = filePathFor(key);
  if (!file) throw new StorageError("Invalid file key.");
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomUUID()}.part`;
  const hash = createHash("sha256");
  let received = 0;
  let head = Buffer.alloc(0);
  const meter = new Transform({
    transform(chunk: Buffer, _encoding, done) {
      received += chunk.length;
      if (received > size) return done(new StorageError("The file is larger than the upload allows."));
      if (head.length < 16) head = Buffer.concat([head, chunk]).subarray(0, 16);
      hash.update(chunk);
      done(null, chunk);
    },
  });
  const source = body instanceof ReadableStream ? Readable.fromWeb(body as import("node:stream/web").ReadableStream) : body;
  try {
    await pipeline(source, meter, createWriteStream(tmp, { flags: "wx" }));
    if (received !== size) throw new StorageError("The upload was incomplete. Try again.");
    if (!looksLike(head, contentType)) throw new StorageError("The file's contents don't match its type.");
    // link() refuses to replace an existing file (rename would overwrite it),
    // so a published URL always keeps serving the same bytes.
    await link(tmp, file).catch((err: NodeJS.ErrnoException) => {
      throw err.code === "EEXIST" ? new StorageError("That file has already been uploaded.", 409) : err;
    });
    return hash.digest("hex");
  } finally {
    await unlink(tmp).catch(() => undefined);
  }
}

export async function readLocalObject(key: string) {
  const file = filePathFor(key);
  if (!file) throw new StorageError("Invalid file key.", 404);
  const body = await readFile(file);
  return { body, contentType: contentTypeFor(key), size: body.length };
}

export async function statLocalObject(key: string) {
  const file = filePathFor(key);
  if (!file) return null;
  try {
    const info = await stat(file);
    return info.isFile() ? { file, info } : null;
  } catch {
    return null;
  }
}

export async function deleteLocalObject(key: string) {
  const file = filePathFor(key);
  if (!file) return;
  await unlink(file).catch((err: NodeJS.ErrnoException) => {
    if (err.code !== "ENOENT") throw err;
  });
}

export async function sha256OfFile(file: string): Promise<string> {
  const hash = createHash("sha256");
  await pipeline(createReadStream(file), hash);
  return hash.digest("hex");
}
