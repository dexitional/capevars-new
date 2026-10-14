import type { MediaAssetRow } from "@cv/db";
import { api } from "./api-client";

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
// then records the file in the media library. Returns the library record (its `url` is public). `endpoint`
// is the API that signs and records it: /admin/media for the admin portal, or
// /me/uploads for a signed-in member (see uploadAsMember).
export async function uploadToLibrary(
  file: File,
  folder: MediaFolder,
  onProgress?: (fraction: number) => void,
  endpoint = "/admin/media",
): Promise<MediaAsset> {
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
