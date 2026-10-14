// /storage: the local storage driver's upload endpoint, plus the sync API
// that scripts/storage.ts pushes uploads to (development -> production).
import { createHash, timingSafeEqual } from "node:crypto";
import type { Context } from "hono";
import { Hono } from "hono";
import { z } from "zod";
import { AppError } from "../../middleware/error-handler.js";
import { validate } from "../../lib/validate.js";
import {
  contentTypeFor,
  deleteLocalObject,
  filePathFor,
  StorageError,
  verifyLocalUpload,
  writeLocalObject,
} from "../../lib/local-storage.js";
import { compareFiles, importAssets } from "../../lib/storage-sync.js";
import { storageDriver } from "../../lib/storage.js";

async function store(...args: Parameters<typeof writeLocalObject>) {
  try {
    return await writeLocalObject(...args);
  } catch (err) {
    if (err instanceof StorageError) throw new AppError(err.message, err.status);
    throw err;
  }
}

// Sync requests carry STORAGE_SYNC_TOKEN as a bearer token. Without a token
// configured, the sync API doesn't exist.
function requireSyncToken(c: Context) {
  const token = process.env.STORAGE_SYNC_TOKEN ?? "";
  if (token.length < 32) throw new AppError("Not found.", 404);
  const given = (c.req.header("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const digest = (v: string) => createHash("sha256").update(v).digest();
  if (!timingSafeEqual(digest(given), digest(token))) throw new AppError("Invalid sync token.", 401);
  if (storageDriver() !== "local") {
    throw new AppError("This server stores files in R2 (STORAGE_DRIVER=r2), so there's nothing to sync to.", 409);
  }
}

const key = z.string().min(1).max(500).refine((k) => filePathFor(k) !== null, "Invalid key");

const diffSchema = z.object({
  files: z.array(z.object({ key, size: z.number().int().nonnegative() })).max(5000),
});

const assetsSchema = z.object({
  assets: z
    .array(
      z.object({
        file_key: key,
        filename: z.string().min(1).max(255),
        mime_type: z.string().min(1).max(120),
        size_bytes: z.coerce.number().int().nonnegative(),
        width: z.number().int().positive().nullable(),
        height: z.number().int().positive().nullable(),
        alt_text: z.string().max(255).nullable(),
        folder: z.string().min(1).max(40),
        created_at: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
        admin_email: z.string().max(190).nullable(),
        user_email: z.string().max(190).nullable(),
      }),
    )
    .max(2000),
});

export const storageRoute = new Hono()
  // The browser's PUT for a signed upload URL (local driver).
  .put("/upload", async (c) => {
    const grant = verifyLocalUpload(new URL(c.req.url).searchParams);
    if (!grant) throw new AppError("This upload link is invalid or has expired. Try again.", 403);
    const type = (c.req.header("content-type") ?? "").split(";")[0]!.trim().toLowerCase();
    if (type !== grant.contentType) throw new AppError("The file type doesn't match the upload link.", 400);
    const declared = c.req.header("content-length");
    if (declared !== undefined && Number(declared) !== grant.size) {
      throw new AppError("The file size doesn't match the upload link.", 400);
    }
    if (!c.req.raw.body) throw new AppError("No file was sent.", 400);
    await store(grant.key, c.req.raw.body, grant.size, grant.contentType);
    return c.json({ ok: true }, 201);
  })

  // ---- Sync (scripts/storage.ts push) ----------------------------------------------
  .get("/sync/ping", (c) => {
    requireSyncToken(c);
    return c.json({ ok: true, driver: storageDriver() });
  })
  .post("/sync/diff", validate("json", diffSchema), async (c) => {
    requireSyncToken(c);
    return c.json(await compareFiles(c.req.valid("json").files));
  })
  .put("/sync/file", async (c) => {
    requireSyncToken(c);
    const q = new URL(c.req.url).searchParams;
    const fileKey = q.get("key") ?? "";
    const size = Number(q.get("size"));
    const sha256 = q.get("sha256") ?? "";
    if (!filePathFor(fileKey) || !Number.isInteger(size) || size < 0 || !/^[0-9a-f]{64}$/.test(sha256)) {
      throw new AppError("key, size and sha256 are required.", 400);
    }
    if (!c.req.raw.body) throw new AppError("No file was sent.", 400);
    const written = await store(fileKey, c.req.raw.body, size, contentTypeFor(fileKey));
    if (written !== sha256) {
      await deleteLocalObject(fileKey);
      throw new AppError("The file arrived damaged (checksum mismatch). Run the sync again.", 400);
    }
    return c.json({ ok: true }, 201);
  })
  .post("/sync/assets", validate("json", assetsSchema), async (c) => {
    requireSyncToken(c);
    return c.json(await importAssets(c.req.valid("json").assets));
  });
