import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { imageTarget } from "#/lib/image-targets";
import { encodeForStorage } from "./image-upload.js";

// A photo-like test image: noise compresses about as badly as a real photo.
const photo = (width: number, height: number, channels: 3 | 4 = 3, sigma = 40) =>
  sharp({ create: { width, height, channels, background: "#7a8", noise: { type: "gaussian", mean: 128, sigma } } });

test("picks a target for each folder and leaves the rest alone", () => {
  assert.deepEqual(imageTarget("avatars", "image/jpeg"), { edge: 800, quality: 82 });
  assert.deepEqual(imageTarget("products", "image/png"), { edge: 2000, quality: 85 });
  assert.equal(imageTarget("general", "image/webp")?.edge, 2560);
  assert.equal(imageTarget("products", "image/gif"), null);
  assert.equal(imageTarget("settings", "image/png"), null);
  assert.equal(imageTarget("documents", "application/pdf"), null);
});

test("shrinks a big product photo to a smaller WebP", async () => {
  const jpeg = await photo(3000, 2000).jpeg({ quality: 95 }).toBuffer();
  const out = await encodeForStorage(jpeg, imageTarget("products", "image/jpeg")!);
  assert.ok(out);
  assert.equal((await sharp(out.body).metadata()).format, "webp");
  assert.deepEqual([out.width, out.height], [2000, 1333]);
  assert.ok(out.body.length < jpeg.length / 2, `${out.body.length} vs ${jpeg.length}`);
});

test("turns a sideways phone photo upright and strips its metadata", async () => {
  const jpeg = await photo(600, 400)
    .jpeg()
    .withMetadata({ orientation: 6 })
    .withExif({ IFD0: { Make: "Phone", Copyright: "Someone" } })
    .toBuffer();
  const out = await encodeForStorage(jpeg, imageTarget("avatars", "image/jpeg")!);
  assert.ok(out);
  assert.deepEqual([out.width, out.height], [400, 600]);
  const meta = await sharp(out.body).metadata();
  assert.equal(meta.exif, undefined);
  assert.ok(!meta.orientation || meta.orientation === 1);
});

test("keeps transparency", async () => {
  const png = await photo(300, 300, 4).png().toBuffer();
  const out = await encodeForStorage(png, imageTarget("products", "image/png")!);
  assert.ok(out);
  assert.equal((await sharp(out.body).metadata()).hasAlpha, true);
});

test("never enlarges, and keeps a WebP that is already compact", async () => {
  const small = await photo(200, 150).jpeg().toBuffer();
  const out = await encodeForStorage(small, imageTarget("general", "image/jpeg")!);
  assert.deepEqual([out?.width, out?.height], [200, 150]);
  // Gentler noise, closer to how a real photo compresses.
  const webp = await photo(1200, 800, 3, 12).webp({ quality: 80 }).toBuffer();
  assert.equal(await encodeForStorage(webp, imageTarget("general", "image/webp")!), null);
  // Too big for an avatar, so it is still resized.
  assert.equal((await encodeForStorage(webp, imageTarget("avatars", "image/webp")!))?.width, 800);
});
