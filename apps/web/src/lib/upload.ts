import type { MediaAssetRow } from "@cv/db";
import { api } from "./api-client";
import { type ImageTarget, imageTarget, webpName } from "./image-targets";

export type MediaFolder =
  | "general"
  | "settings"
  | "avatars"
  | "covers"
  | "stores"
  | "products"
  | "events"
  | "transport"
  | "exhibitions"
  | "jobs"
  | "cvs"
  | "listings"
  | "groups"
  | "posts"
  | "chats"
  | "courses"
  | "lessons"
  | "documents";

export const MEDIA_FOLDERS: Array<{ key: MediaFolder; label: string }> = [
  { key: "general", label: "General" },
  { key: "settings", label: "Site settings" },
  { key: "stores", label: "Stores" },
  { key: "products", label: "Products" },
  { key: "events", label: "Events" },
  { key: "listings", label: "Finder" },
  { key: "groups", label: "Groups" },
  { key: "posts", label: "Social posts" },
  { key: "courses", label: "Courses" },
  { key: "lessons", label: "Lessons" },
  { key: "avatars", label: "Avatars" },
  { key: "documents", label: "Documents" },
];

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";
export const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";
export const DOCUMENT_ACCEPT =
  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";

export type MediaAsset = MediaAssetRow & { uploaded_by_name?: string | null };

export const isImage = (asset: Pick<MediaAssetRow, "mime_type">) =>
  asset.mime_type.startsWith("image/");

function imageSize(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

// Halves the picture until one more step reaches the target size, so a big
// reduction still blends every pixel instead of skipping most of them.
function shrink(source: CanvasImageSource, width: number, height: number, toWidth: number, toHeight: number) {
  let current = source;
  let canvas: HTMLCanvasElement;
  do {
    const half = width / 2 >= toWidth && height / 2 >= toHeight;
    width = half ? Math.round(width / 2) : toWidth;
    height = half ? Math.round(height / 2) : toHeight;
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(current, 0, 0, width, height);
    current = canvas;
  } while (width !== toWidth || height !== toHeight);
  return canvas;
}

// Turns a photo upright, fits it to its folder's target and encodes it as
// WebP, so uploads are small and quick. Anything that can't be done here
// (Safari can't encode WebP) is uploaded as it is and finished by the server.
async function prepareImage(file: File, target: ImageTarget): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, target.edge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = shrink(bitmap, bitmap.width, bitmap.height, width, height);
    bitmap.close();
    if (!canvas) return file;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", target.quality / 100),
    );
    if (!blob || blob.type !== "image/webp") return file;
    if (file.type === "image/webp" && scale === 1 && blob.size >= file.size) return file;
    return new File([blob], webpName(file.name), { type: "image/webp", lastModified: file.lastModified });
  } catch {
    return file;
  }
}

// The local storage endpoint explains a refused upload in JSON; R2 sends XML.
function uploadError(body: string) {
  try {
    const { error } = JSON.parse(body) as { error?: string };
    if (error) return error;
  } catch {
    // Not JSON.
  }
  return "Upload to storage failed.";
}

// Uploads straight to storage (this server's disk, or R2) with a signed URL,
// then records the file in the media library. Photos are first converted to
// WebP sized for their folder (lib/image-targets.ts). Returns the library record (its `url` is public). `endpoint`
// is the API that signs and records it: /admin/media for the admin portal, or
// /me/uploads for a signed-in member (see uploadAsMember).
export async function uploadToLibrary(
  original: File,
  folder: MediaFolder,
  onProgress?: (fraction: number) => void,
  endpoint = "/admin/media",
): Promise<MediaAsset> {
  const target = imageTarget(folder, original.type);
  const file = target ? await prepareImage(original, target) : original;
  const { uploadUrl, key } = await api.post<{ uploadUrl: string; key: string }>(`${endpoint}/presign`, {
    filename: file.name,
    contentType: file.type,
    size: file.size,
    folder,
  });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(uploadError(xhr.responseText)));
    xhr.onerror = () =>
      reject(new Error("Couldn't reach file storage. Check your connection and try again."));
    xhr.send(file);
  });

  const size = await imageSize(file);
  const { asset } = await api.post<{ asset: MediaAsset }>(endpoint, {
    key,
    filename: file.name,
    contentType: file.type,
    size: file.size,
    width: size?.width ?? null,
    height: size?.height ?? null,
    folder,
  });
  return asset;
}

// Member uploads (avatars, product photos, CVs, lesson videos, ...).
export const uploadAsMember = (file: File, folder: MediaFolder, onProgress?: (fraction: number) => void) =>
  uploadToLibrary(file, folder, onProgress, "/me/uploads");
