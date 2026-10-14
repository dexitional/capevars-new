// Carrying uploads between machines (development -> production, or a backup
// restore). Shared by the /storage/sync endpoints and scripts/storage.ts.
//
// Files are matched by key and verified by SHA-256. Keys are unique and
// stored files never change, so a sync only ever adds what's missing and
// can safely be re-run. Media-library rows travel with the files, matched by
// file_key, and owners are matched by email (database ids differ between
// machines).
import { readdir } from "node:fs/promises";
import path from "node:path";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { filePathFor, localPublicUrl, sha256OfFile, statLocalObject, storageRoot } from "./local-storage.js";

export interface SyncFile {
  key: string;
  size: number;
  sha256: string;
}

export interface SyncAsset {
  file_key: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  folder: string;
  created_at: string;
  admin_email: string | null;
  user_email: string | null;
}

/** Every file in local storage, with its SHA-256 unless `hashes` is false. */
export async function scanStorage(hashes = true): Promise<SyncFile[]> {
  const root = storageRoot();
  let entries;
  try {
    entries = await readdir(root, { recursive: true, withFileTypes: true });
  } catch {
    return [];
  }
  const files: SyncFile[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || entry.name.endsWith(".part")) continue;
    const key = path.relative(root, path.join(entry.parentPath, entry.name)).split(path.sep).join("/");
    const found = filePathFor(key) ? await statLocalObject(key) : null;
    if (!found) continue;
    files.push({ key, size: found.info.size, sha256: hashes ? await sha256OfFile(found.file) : "" });
  }
  return files.sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Which of `files` this machine doesn't have, and which keys hold a different
 * file. Stored files never change, so a matching size means it already
 * arrived intact (it was hash-checked on the way in): re-hashing every
 * synced video on each run would make syncs crawl.
 */
export async function compareFiles(files: Array<Pick<SyncFile, "key" | "size">>) {
  const missing: string[] = [];
  const conflicts: string[] = [];
  for (const file of files) {
    const found = filePathFor(file.key) ? await statLocalObject(file.key) : null;
    if (!found) missing.push(file.key);
    else if (found.info.size !== file.size) conflicts.push(file.key);
  }
  return { missing, conflicts };
}

/** Media-library rows for files in local storage (optionally only these keys). */
export async function exportAssets(keys?: Set<string>): Promise<SyncAsset[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT m.file_key, m.filename, m.mime_type, m.size_bytes, m.width, m.height, m.alt_text, m.folder,
            m.created_at, a.email AS admin_email, u.email AS user_email
       FROM media_assets m
       LEFT JOIN admins a ON a.id = m.uploaded_by
       LEFT JOIN users u ON u.id = m.user_id
      WHERE m.url LIKE '/files/%'
      ORDER BY m.id`,
  );
  const assets = rows as SyncAsset[];
  return keys ? assets.filter((a) => keys.has(a.file_key)) : assets;
}

/**
 * Adds media-library rows, and refreshes the details (alt text, folder, ...)
 * of ones already here. Rows whose file
 * isn't in storage here are skipped, so the library never lists a broken file.
 */
export async function importAssets(assets: SyncAsset[]) {
  const pool = getPool();
  const ids = async (table: "admins" | "users", emails: Array<string | null>) => {
    const list = [...new Set(emails.filter((e): e is string => !!e))];
    if (!list.length) return new Map<string, number>();
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT id, email FROM ${table} WHERE email IN (?)`, [list]);
    return new Map(rows.map((r) => [String(r.email).toLowerCase(), r.id as number]));
  };
  const admins = await ids("admins", assets.map((a) => a.admin_email?.toLowerCase() ?? null));
  const users = await ids("users", assets.map((a) => a.user_email?.toLowerCase() ?? null));

  const [existingRows] = assets.length
    ? await pool.query<RowDataPacket[]>("SELECT file_key FROM media_assets WHERE file_key IN (?)", [assets.map((a) => a.file_key)])
    : [[]];
  const existing = new Set(existingRows.map((r) => r.file_key as string));

  let added = 0;
  let existed = 0;
  const skipped: string[] = [];
  for (const asset of assets) {
    if (!(await statLocalObject(asset.file_key))) {
      skipped.push(asset.file_key);
      continue;
    }
    await pool.execute(
      `INSERT INTO media_assets
         (file_key, url, filename, mime_type, size_bytes, width, height, alt_text, folder, uploaded_by, user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE url = VALUES(url), filename = VALUES(filename), alt_text = VALUES(alt_text),
         folder = VALUES(folder), width = VALUES(width), height = VALUES(height)`,
      [
        asset.file_key,
        localPublicUrl(asset.file_key),
        asset.filename,
        asset.mime_type,
        asset.size_bytes,
        asset.width,
        asset.height,
        asset.alt_text,
        asset.folder,
        admins.get(asset.admin_email?.toLowerCase() ?? "") ?? null,
        users.get(asset.user_email?.toLowerCase() ?? "") ?? null,
        asset.created_at,
      ],
    );
    if (existing.has(asset.file_key)) existed++;
    else added++;
  }
  return { added, existed, skipped };
}
