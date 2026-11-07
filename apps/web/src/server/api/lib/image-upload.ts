// Stores uploaded photos as WebP, sized for their folder (lib/image-targets.ts).
// Browsers usually do this before uploading, but every image is checked here
// too: Safari can't encode WebP, and uploads can come from other clients.
// The /img optimiser then serves smaller AVIF/WebP variants from this copy.
import sharp from "sharp";
import { type ImageTarget, WEBP_BYTES_PER_PIXEL, imageTarget, webpName } from "#/lib/image-targets";
import { AppError } from "../middleware/error-handler.js";
import { deleteObject, readObject, writeObject } from "./storage.js";

export interface StoredFile {
  key: string;
  filename: string;
  contentType: string;
  size: number;
  width: number | null;
  height: number | null;
}

/**
 * Re-encodes an image as WebP within its target, turned upright and without
 * metadata (such as GPS position). Returns null when it should be kept as it
 * is: an animation, or a WebP that is already small enough.
 */
export async function encodeForStorage(body: Buffer, target: ImageTarget) {
  const meta = await sharp(body).metadata();
  if ((meta.pages ?? 1) > 1 || !meta.width || !meta.height) return null;
  const upright = !meta.orientation || meta.orientation === 1;
  const fits = Math.max(meta.width, meta.height) <= target.edge;
  const compact = body.length <= meta.width * meta.height * WEBP_BYTES_PER_PIXEL;
  if (meta.format === "webp" && upright && fits && compact) return null;
  const { data, info } = await sharp(body)
    .rotate()
    .resize({ width: target.edge, height: target.edge, fit: "inside", withoutEnlargement: true })
    .webp({ quality: target.quality, alphaQuality: 90, effort: 5, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });
  return { body: data, width: info.width, height: info.height };
}

// Swaps an uploaded image for its WebP copy, under a new key (stored files
// are never replaced in place, since their URLs are cached for a year).
export async function optimiseUpload(folder: string, file: StoredFile): Promise<StoredFile> {
  const target = imageTarget(folder, file.contentType);
  if (!target) return file;
  let source: Buffer;
  try {
    source = (await readObject(file.key)).body;
  } catch {
    throw new AppError("The upload didn't finish. Try again.", 400);
  }
  let encoded: Awaited<ReturnType<typeof encodeForStorage>>;
  try {
    encoded = await encodeForStorage(source, target);
  } catch {
    await deleteObject(file.key).catch(() => undefined);
    throw new AppError("That image couldn't be read. Try another file.", 400);
  }
  if (!encoded) return file;
  const base = file.key.replace(/\.[a-z0-9]+$/, "");
  const key = file.key.endsWith(".webp") ? `${base}-w.webp` : `${base}.webp`;
  await writeObject(key, encoded.body, "image/webp");
  await deleteObject(file.key).catch((err) =>
    console.warn("[upload] couldn't delete the original:", err instanceof Error ? err.message : err),
  );
  return {
    key,
    filename: webpName(file.filename),
    contentType: "image/webp",
    size: encoded.body.length,
    width: encoded.width,
    height: encoded.height,
  };
}
