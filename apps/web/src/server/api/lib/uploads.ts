// Upload rules shared by the admin media library and member uploads: which
// types are accepted, how large, and where keys live in storage. The exact
// size is signed into each upload URL, so limits are enforced by storage
// itself (local-storage.ts or R2).
import { randomUUID } from "node:crypto";
import { getPool } from "@cv/db";
import type { MediaAssetRow } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { AppError } from "../middleware/error-handler.js";
import { createPresignedUpload, keyPrefix, publicUrlFor, storageDriver } from "./storage.js";
import { localPublicUrl, statLocalObject } from "./local-storage.js";
import { insertRow } from "./columns.js";
import { slugify } from "./slug.js";
import { optionalText } from "./fields.js";

export const MEDIA_FOLDERS = [
  "general",
  "settings",
  "avatars",
  "covers",
  "stores",
  "products",
  "events",
  "transport",
  "exhibitions",
  "jobs",
  "cvs",
  "listings",
  "groups",
  "posts",
  "chats",
  "courses",
  "lessons",
  "documents",
] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

const MB = 1024 * 1024;
const IMAGE = 12 * MB;
const DOC = 25 * MB;
const VIDEO = 1024 * MB;

const TYPES: Record<string, { ext: string; maxBytes: number; kind: "image" | "document" | "video" }> = {
  "image/jpeg": { ext: "jpg", maxBytes: IMAGE, kind: "image" },
  "image/png": { ext: "png", maxBytes: IMAGE, kind: "image" },
  "image/webp": { ext: "webp", maxBytes: IMAGE, kind: "image" },
  "image/gif": { ext: "gif", maxBytes: 8 * MB, kind: "image" },
  "image/avif": { ext: "avif", maxBytes: IMAGE, kind: "image" },
  "application/pdf": { ext: "pdf", maxBytes: 40 * MB, kind: "document" },
  "application/msword": { ext: "doc", maxBytes: DOC, kind: "document" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { ext: "docx", maxBytes: DOC, kind: "document" },
  "application/vnd.ms-excel": { ext: "xls", maxBytes: DOC, kind: "document" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { ext: "xlsx", maxBytes: DOC, kind: "document" },
  "application/vnd.ms-powerpoint": { ext: "ppt", maxBytes: 40 * MB, kind: "document" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { ext: "pptx", maxBytes: 40 * MB, kind: "document" },
  "application/zip": { ext: "zip", maxBytes: 100 * MB, kind: "document" },
  "video/mp4": { ext: "mp4", maxBytes: VIDEO, kind: "video" },
  "video/webm": { ext: "webm", maxBytes: VIDEO, kind: "video" },
  "video/quicktime": { ext: "mov", maxBytes: VIDEO, kind: "video" },
};

// Members may only upload these kinds into each folder.
const MEMBER_FOLDERS: Partial<Record<MediaFolder, Array<"image" | "document" | "video">>> = {
  avatars: ["image"],
  covers: ["image"],
  stores: ["image", "document"],
  products: ["image"],
  events: ["image"],
  transport: ["image"],
  exhibitions: ["image"],
  jobs: ["image"],
  cvs: ["document"],
  listings: ["image"],
  groups: ["image", "document"],
  posts: ["image"],
  chats: ["image", "document"],
  courses: ["image", "video"],
  lessons: ["image", "document", "video"],
};

const folder = z.enum(MEDIA_FOLDERS);

export const presignSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  contentType: z.string().min(1).max(120),
  size: z.number().int().positive(),
  folder,
});

export const registerSchema = presignSchema.extend({
  key: z.string().min(1).max(500),
  width: z.number().int().positive().max(100_000).nullable().optional(),
  height: z.number().int().positive().max(100_000).nullable().optional(),
  altText: optionalText(255),
});

type Owner = { adminId: number } | { userId: number };
const ownerSegment = (owner: Owner) => ("adminId" in owner ? "cms" : `u${owner.userId}`);

function keyPattern(owner: Owner) {
  const prefix = keyPrefix().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${prefix}/${ownerSegment(owner)}/[a-z]+/\\d{4}/\\d{2}/[0-9a-f]{8}-[a-z0-9-]+\\.[a-z0-9]+$`);
}

function checkType(owner: Owner, contentType: string, size: number, target: MediaFolder) {
  const type = TYPES[contentType];
  if (!type) throw new AppError("That file type isn't supported. Upload images, PDFs, Office files or MP4/WebM video.", 400);
  if ("userId" in owner) {
    const allowed = MEMBER_FOLDERS[target];
    if (!allowed?.includes(type.kind)) throw new AppError(`You can't upload that kind of file here.`, 400);
  }
  if (size > type.maxBytes) throw new AppError(`That file is too large — the limit is ${type.maxBytes / MB} MB.`, 400);
  return type;
}

export async function presignUpload(owner: Owner, input: z.infer<typeof presignSchema>) {
  const type = checkType(owner, input.contentType, input.size, input.folder);
  const now = new Date();
  const base = slugify(input.filename.replace(/\.[^.]+$/, "")).slice(0, 60);
  const key = `${keyPrefix()}/${ownerSegment(owner)}/${input.folder}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID().slice(0, 8)}-${base}.${type.ext}`;
  const { uploadUrl, publicUrl } = await createPresignedUpload(key, input.contentType, input.size);
  return { uploadUrl, publicUrl, key };
}

export async function registerUpload(owner: Owner, input: z.infer<typeof registerSchema>) {
  checkType(owner, input.contentType, input.size, input.folder);
  if (!keyPattern(owner).test(input.key)) throw new AppError("Invalid upload.", 400);
  if (storageDriver() === "local") {
    const found = await statLocalObject(input.key);
    if (!found || found.info.size !== input.size) throw new AppError("The upload didn't finish. Try again.", 400);
  }
  const id = await insertRow(
    "media_assets",
    {
      key: input.key,
      url: publicUrlFor(input.key),
      filename: input.filename,
      contentType: input.contentType,
      size: input.size,
      width: input.width ?? null,
      height: input.height ?? null,
      altText: input.altText,
      folder: input.folder,
    },
    {
      key: "file_key",
      url: "url",
      filename: "filename",
      contentType: "mime_type",
      size: "size_bytes",
      width: "width",
      height: "height",
      altText: "alt_text",
      folder: "folder",
    },
    "adminId" in owner ? { uploaded_by: owner.adminId } : { user_id: owner.userId },
  );
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM media_assets WHERE id = ?", [id]);
  const asset = rows[0] as MediaAssetRow;
  if (storageDriver() === "local" && asset.mime_type.startsWith("image/")) prewarm(asset.file_key);
  return asset;
}

// Renders the sizes cards and pages ask for most, in the background, so the
// first visitor (usually the uploader, looking at their preview) gets a cached
// image. Nearly every browser accepts AVIF, the optimiser's first choice.
const PREWARM_WIDTHS = [384, 768];

function prewarm(key: string) {
  if (process.env.IMAGE_PREWARM === "false") return;
  void (async () => {
    const { handleImageRequest } = await import("../../image-optimizer.js");
    for (const w of PREWARM_WIDTHS) {
      const src = encodeURIComponent(localPublicUrl(key));
      await handleImageRequest(
        new Request(`http://prewarm.internal/img?src=${src}&w=${w}&q=75`, { headers: { accept: "image/avif,image/webp" } }),
      );
    }
  })().catch((err) => console.warn("[img] prewarm failed:", err instanceof Error ? err.message : err));
}
