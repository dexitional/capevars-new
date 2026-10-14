// File storage. Two drivers, picked with STORAGE_DRIVER:
//
//   local (default) - files live on this server under STORAGE_DIR and are
//                     served from /files with CDN-style caching
//                     (local-storage.ts, server/file-server.ts).
//   r2              - Cloudflare R2 / any S3-compatible bucket.
//
// Either way, browsers upload straight to storage with a short-lived signed
// PUT, and every stored file URL is resolved back to its driver, so files
// already uploaded keep working after a switch.
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../middleware/error-handler.js";
import {
  deleteLocalObject,
  localKeyFromUrl,
  localPublicUrl,
  readLocalObject,
  signLocalUpload,
} from "./local-storage.js";

export type StorageDriver = "local" | "r2";

export function storageDriver(): StorageDriver {
  return process.env.STORAGE_DRIVER?.trim().toLowerCase() === "r2" ? "r2" : "local";
}

// Every key this app writes starts with this prefix ("capevars" by default),
// so a bucket can be shared with other sites safely.
export function keyPrefix() {
  const prefix = process.env.STORAGE_KEY_PREFIX ?? process.env.R2_KEY_PREFIX ?? "capevars";
  return prefix.replace(/^\/+|\/+$/g, "") || "capevars";
}

// ---- R2 -------------------------------------------------------------------------------

let client: S3Client | undefined;

function r2() {
  const { R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } =
    process.env;
  // Unset, or still a placeholder from .env.example.
  const missing = (v: string | undefined) => !v || /your[_-]/i.test(v);
  if (
    !R2_ENDPOINT ||
    !R2_ACCESS_KEY ||
    !R2_SECRET_KEY ||
    !R2_BUCKET_NAME ||
    !R2_PUBLIC_DOMAIN ||
    [R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY].some(missing)
  ) {
    throw new AppError("R2 storage isn't configured. Set the R2_* environment variables.", 400);
  }
  client ??= new S3Client({
    region: process.env.R2_REGION ?? "auto",
    endpoint: R2_ENDPOINT,
    credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
    // Newer SDKs sign a CRC32 of the (empty) body into presigned URLs by
    // default, which makes every browser PUT fail. Only checksum when asked.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return { s3: client, bucket: R2_BUCKET_NAME, publicDomain: R2_PUBLIC_DOMAIN.replace(/\/$/, "") };
}

function r2KeyFromUrl(url: string): string | null {
  const domain = (process.env.R2_PUBLIC_DOMAIN ?? "").replace(/\/$/, "");
  if (!domain || !url.startsWith(`${domain}/`)) return null;
  return decodeURIComponent(url.slice(domain.length + 1).split(/[?#]/)[0] ?? "");
}

// ---- Driver-neutral API ----------------------------------------------------------------

export function publicUrlFor(key: string, driver = storageDriver()) {
  return driver === "r2" ? `${r2().publicDomain}/${key}` : localPublicUrl(key);
}

/** Which driver and key a stored file URL belongs to, or null if it isn't ours. */
export function locateUrl(url: string): { driver: StorageDriver; key: string } | null {
  const local = localKeyFromUrl(url);
  if (local) return { driver: "local", key: local };
  const remote = r2KeyFromUrl(url);
  return remote ? { driver: "r2", key: remote } : null;
}

// The exact Content-Length is signed in, so the browser can't upload a
// larger file than the size the server approved.
export async function createPresignedUpload(key: string, contentType: string, size: number) {
  if (storageDriver() === "local") {
    return { uploadUrl: signLocalUpload(key, contentType, size), publicUrl: localPublicUrl(key) };
  }
  const { s3, bucket, publicDomain } = r2();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
    CacheControl: "public, max-age=31536000, immutable",
  });
  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 600,
    signableHeaders: new Set(["content-type", "content-length"]),
  });
  return { uploadUrl, publicUrl: `${publicDomain}/${key}` };
}

export async function deleteObject(key: string, driver = storageDriver()) {
  if (driver === "local") return deleteLocalObject(key);
  const { s3, bucket } = r2();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

// Reads a file straight from storage (the image optimiser uses this instead
// of the public URL, which may be a rate-limited r2.dev address).
export async function readObject(key: string, signal?: AbortSignal, driver = storageDriver()) {
  if (driver === "local") return readLocalObject(key);
  const { s3, bucket } = r2();
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }), {
    abortSignal: signal,
  });
  if (!res.Body) throw new Error(`Empty object: ${key}`);
  return {
    body: Buffer.from(await res.Body.transformToByteArray()),
    contentType: res.ContentType ?? "",
    size: res.ContentLength ?? 0,
  };
}
