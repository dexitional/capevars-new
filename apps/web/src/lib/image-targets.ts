// How uploaded photos are stored: as WebP, no larger than their folder needs.
// Shared by the browser (lib/upload.ts), which shrinks photos before they are
// uploaded, and the server (server/api/lib/image-upload.ts), which checks
// every image again and finishes the job.

export interface ImageTarget {
  /** The longest side, in pixels. */
  edge: number;
  /** WebP quality, 1 to 100. */
  quality: number;
}

// Avatars show small, so 800 px covers a sharp 400 px circle. Product and
// cover photos keep more detail for zooming and wide banners.
const TARGETS: Record<string, ImageTarget> = {
  avatars: { edge: 800, quality: 82 },
  products: { edge: 2000, quality: 85 },
  stores: { edge: 2000, quality: 84 },
  covers: { edge: 2400, quality: 82 },
};
const DEFAULT_TARGET: ImageTarget = { edge: 2560, quality: 82 };

// Kept as uploaded: animations, and site settings (logos, favicons and
// sharing images, which some platforms can't read as WebP).
const KEEP_TYPES = new Set(["image/gif", "image/svg+xml"]);
const KEEP_FOLDERS = new Set(["settings"]);

export function imageTarget(folder: string, contentType: string): ImageTarget | null {
  if (!contentType.startsWith("image/")) return null;
  if (KEEP_TYPES.has(contentType) || KEEP_FOLDERS.has(folder)) return null;
  return TARGETS[folder] ?? DEFAULT_TARGET;
}

// A WebP that fits its target and averages no more than this many bytes per
// pixel is already well compressed, so it is stored as is rather than encoded
// a second time. Photos at quality 85 average well under 0.2.
export const WEBP_BYTES_PER_PIXEL = 0.5;

export const webpName = (filename: string) => `${filename.replace(/\.[^./]+$/, "") || "image"}.webp`;
