// Uploads in local storage: inspect them, and carry them between machines.
//
//   npm run storage:status                    what's stored, and anything broken
//   npm run storage:push -- <url>             copy uploads to another server (e.g. production)
//   npm run storage:pack [-- <file>]          bundle uploads into one .tar.gz
//   npm run storage:unpack -- <file>          add a bundle's uploads to this machine
//
// Options: --dry-run (push/unpack: report only), --files-only (skip media-library
// rows), --token <t> (push: instead of STORAGE_SYNC_TOKEN).
//
// Every command only ever adds what's missing. Stored files never change, so
// nothing is overwritten and each command can safely be re-run. Each file's
// SHA-256 is checked on arrival. Media-library rows travel with their files,
// and the URLs in the database are relative (/files/...), so pages that use
// the files work on the other machine as soon as its database has the rows.
import { execFileSync } from "node:child_process";
import { createReadStream, createWriteStream, existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import { closePool } from "@cv/db";
import {
  contentTypeFor,
  filePathFor,
  sha256OfFile,
  statLocalObject,
  storageRoot,
  writeLocalObject,
} from "../src/server/api/lib/local-storage.js";
import {
  compareFiles,
  exportAssets,
  importAssets,
  scanStorage,
  type SyncAsset,
  type SyncFile,
} from "../src/server/api/lib/storage-sync.js";

const appDir = path.resolve(import.meta.dirname, "..");
try {
  process.loadEnvFile(path.join(appDir, ".env"));
} catch {
  // No .env: rely on the real environment.
}
// STORAGE_DIR defaults to <cwd>/storage, and npm may run this from elsewhere.
process.env.STORAGE_DIR ||= path.join(appDir, "storage");

const BUNDLE_FORMAT = "capevars-uploads";

interface Manifest {
  format: typeof BUNDLE_FORMAT;
  version: 1;
  createdAt: string;
  files: SyncFile[];
  assets: SyncAsset[];
}

// ---- Helpers -----------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--token");

function bytes(n: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i ? 1 : 0)} ${units[i]}`;
}

const total = (files: SyncFile[]) => bytes(files.reduce((sum, f) => sum + f.size, 0));

class CliError extends Error {}

// Throws rather than exiting, so temp folders are still cleaned up.
function fail(message: string): never {
  throw new CliError(message);
}

async function chunked<T>(items: T[], size: number, fn: (chunk: T[]) => Promise<void>) {
  for (let i = 0; i < items.length; i += size) await fn(items.slice(i, i + size));
}

// Runs `fn` over `items`, `limit` at a time.
async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) await fn(items[next++]!);
    }),
  );
}

async function loadAssets(keys: Set<string>): Promise<SyncAsset[]> {
  if (flag("files-only")) return [];
  try {
    return await exportAssets(keys);
  } catch (err) {
    fail(`Couldn't read the media library (${err instanceof Error ? err.message : err}). Check DATABASE_URL, or pass --files-only.`);
  }
}

async function scan() {
  process.stdout.write(`Scanning ${storageRoot()} … `);
  const files = await scanStorage(true);
  console.log(`${files.length} files, ${total(files)}`);
  return files;
}

// ---- status --------------------------------------------------------------------------

async function status() {
  const files = await scanStorage(false);
  console.log(`Driver:   ${process.env.STORAGE_DRIVER || "local"}`);
  console.log(`Storage:  ${storageRoot()}`);
  console.log(`Files:    ${files.length} (${total(files)})`);
  const assets = await exportAssets();
  const stored = new Set(files.map((f) => f.key));
  const inLibrary = new Set(assets.map((a) => a.file_key));
  const missing = assets.filter((a) => !stored.has(a.file_key));
  const unlisted = files.filter((f) => !inLibrary.has(f.key));
  console.log(`Library:  ${assets.length} media rows point at local storage`);
  if (missing.length) {
    console.log(`\n⚠ ${missing.length} media rows have no file here (copy them over with storage:push or storage:unpack):`);
    for (const a of missing.slice(0, 20)) console.log(`  ${a.file_key}`);
    if (missing.length > 20) console.log(`  … and ${missing.length - 20} more`);
  }
  if (unlisted.length) {
    console.log(`\nℹ ${unlisted.length} files aren't in the media library (usually uploads that were abandoned before saving).`);
  }
  if (!missing.length) console.log("\n✔ Every media row has its file.");
}

// ---- push ------------------------------------------------------------------------------

async function push() {
  const target = positional[1]?.replace(/\/+$/, "");
  if (!target || !/^https?:\/\//.test(target)) fail("Usage: npm run storage:push -- https://your-site.com [--dry-run]");
  const token = option("token") ?? process.env.STORAGE_SYNC_TOKEN ?? "";
  if (!token) fail("Set STORAGE_SYNC_TOKEN (the same value as on the target server) or pass --token.");
  const api = `${target}/api/storage/sync`;
  const headers = { authorization: `Bearer ${token}` };

  const call = async <T>(pathname: string, init: RequestInit = {}): Promise<T> => {
    const res = await fetch(`${api}${pathname}`, { ...init, headers: { ...headers, ...init.headers } });
    const body = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (!res.ok) {
      if (res.status === 404 && pathname === "/ping") fail(`${target} doesn't accept pushes. Set STORAGE_SYNC_TOKEN there (at least 32 characters) and restart it.`);
      fail(`${target} answered ${res.status}: ${body.error ?? res.statusText}`);
    }
    return body;
  };

  await call("/ping");
  console.log(`✔ Connected to ${target}`);

  const files = await scan();
  const missing: string[] = [];
  const conflicts: string[] = [];
  await chunked(files, 1000, async (chunk) => {
    const diff = await call<{ missing: string[]; conflicts: string[] }>("/diff", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ files: chunk.map(({ key, size }) => ({ key, size })) }),
    });
    missing.push(...diff.missing);
    conflicts.push(...diff.conflicts);
  });
  const toSend = files.filter((f) => missing.includes(f.key));
  console.log(`${files.length - toSend.length - conflicts.length} already there, ${toSend.length} to send (${total(toSend)})`);

  if (flag("dry-run")) {
    for (const f of toSend) console.log(`  + ${f.key}`);
  } else {
    let done = 0;
    await pool(toSend, 4, async (file) => {
      const found = await statLocalObject(file.key);
      if (!found) fail(`${file.key} disappeared while pushing.`);
      const query = new URLSearchParams({ key: file.key, size: String(file.size), sha256: file.sha256 });
      await call(`/file?${query}`, {
        method: "PUT",
        headers: { "content-type": "application/octet-stream" },
        body: Readable.toWeb(createReadStream(found.file)) as ReadableStream,
        duplex: "half",
      } as RequestInit & { duplex: "half" });
      done++;
      console.log(`  [${done}/${toSend.length}] ${file.key} (${bytes(file.size)})`);
    });
  }

  const assets = await loadAssets(new Set(files.map((f) => f.key)));
  let added = 0;
  let existed = 0;
  let skipped = 0;
  if (assets.length && !flag("dry-run")) {
    await chunked(assets, 500, async (chunk) => {
      const res = await call<{ added: number; existed: number; skipped: string[] }>("/assets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assets: chunk }),
      });
      added += res.added;
      existed += res.existed;
      skipped += res.skipped.length;
    });
  }

  console.log(`\n${flag("dry-run") ? "Dry run, nothing sent." : "✔ Push complete."}`);
  if (!flag("dry-run")) {
    console.log(`  Files sent: ${toSend.length} (${total(toSend)})`);
    if (assets.length) console.log(`  Media library: ${added} added, ${existed} already there${skipped ? `, ${skipped} skipped (file missing)` : ""}`);
  }
  reportConflicts(conflicts);
}

function reportConflicts(conflicts: string[]) {
  if (!conflicts.length) return;
  console.log(`\n⚠ ${conflicts.length} keys already hold a different file there and were left alone:`);
  for (const key of conflicts) console.log(`  ${key}`);
}

// ---- pack / unpack -----------------------------------------------------------------------

function stamp() {
  return new Date().toISOString().slice(0, 16).replace(/[-:]/g, "").replace("T", "-");
}

async function pack() {
  const out = path.resolve(positional[1] ?? `capevars-uploads-${stamp()}.tar.gz`);
  const files = await scan();
  if (!files.length) fail("Nothing to pack: local storage is empty.");
  const assets = await loadAssets(new Set(files.map((f) => f.key)));
  const manifest: Manifest = { format: BUNDLE_FORMAT, version: 1, createdAt: new Date().toISOString(), files, assets };

  const tmp = await mkdtemp(path.join(os.tmpdir(), "cv-pack-"));
  try {
    await writeFile(path.join(tmp, "manifest.json"), JSON.stringify(manifest));
    await writeFile(path.join(tmp, "files.txt"), files.map((f) => f.key).join("\n") + "\n");
    // Plain tar, then append the manifest, then gzip: the one sequence GNU tar
    // (Linux) and bsdtar (macOS) agree on. COPYFILE_DISABLE stops macOS adding
    // ._ metadata files.
    const tarball = path.join(tmp, "bundle.tar");
    const env = { ...process.env, COPYFILE_DISABLE: "1" };
    execFileSync("tar", ["-cf", tarball, "-C", storageRoot(), "-T", path.join(tmp, "files.txt")], { stdio: "inherit", env });
    execFileSync("tar", ["-rf", tarball, "-C", tmp, "manifest.json"], { stdio: "inherit", env });
    await pipeline(createReadStream(tarball), createGzip({ level: 6 }), createWriteStream(out));
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
  console.log(`\n✔ Packed ${files.length} files (${total(files)}) and ${assets.length} media rows into\n  ${out}`);
  console.log(`\nOn the other machine: npm run storage:unpack -- ${path.basename(out)}`);
}

async function unpack() {
  const bundle = positional[1] && path.resolve(positional[1]);
  if (!bundle || !existsSync(bundle)) fail("Usage: npm run storage:unpack -- <capevars-uploads-….tar.gz> [--dry-run]");
  const tmp = await mkdtemp(path.join(os.tmpdir(), "cv-unpack-"));
  try {
    execFileSync("tar", ["-xzf", bundle, "-C", tmp], { stdio: "inherit" });
    const manifest = JSON.parse(await readFile(path.join(tmp, "manifest.json"), "utf8")) as Manifest;
    if (manifest.format !== BUNDLE_FORMAT || manifest.version !== 1) fail("That isn't a Capevars uploads bundle.");
    console.log(`Bundle from ${manifest.createdAt}: ${manifest.files.length} files (${total(manifest.files)}), ${manifest.assets.length} media rows`);
    console.log(`Into ${storageRoot()}\n`);

    const { missing, conflicts } = await compareFiles(manifest.files);
    const toAdd = manifest.files.filter((f) => missing.includes(f.key));
    console.log(`${manifest.files.length - toAdd.length - conflicts.length} already here, ${toAdd.length} to add (${total(toAdd)})`);
    if (flag("dry-run")) {
      for (const f of toAdd) console.log(`  + ${f.key}`);
      reportConflicts(conflicts);
      return console.log("\nDry run, nothing changed.");
    }

    let done = 0;
    for (const file of toAdd) {
      const source = filePathFor(file.key) && path.join(tmp, file.key);
      if (!source || !existsSync(source)) fail(`The bundle is missing ${file.key}.`);
      if ((await sha256OfFile(source)) !== file.sha256) fail(`${file.key} is damaged in the bundle (checksum mismatch).`);
      await writeLocalObject(file.key, createReadStream(source), file.size, contentTypeFor(file.key));
      console.log(`  [${++done}/${toAdd.length}] ${file.key}`);
    }

    const assets = flag("files-only") ? [] : manifest.assets;
    const result = assets.length ? await importAssets(assets) : { added: 0, existed: 0, skipped: [] };
    console.log(`\n✔ Unpack complete.\n  Files added: ${toAdd.length} (${total(toAdd)})`);
    if (assets.length) {
      console.log(`  Media library: ${result.added} added, ${result.existed} already there${result.skipped.length ? `, ${result.skipped.length} skipped (file missing)` : ""}`);
    }
    reportConflicts(conflicts);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

// ---- Main ---------------------------------------------------------------------------------

const commands: Record<string, () => Promise<void>> = { status, push, pack, unpack };
const command = commands[positional[0] ?? ""];
if (!command) {
  console.log(`Usage:
  npm run storage:status
  npm run storage:push -- <https://your-site.com> [--dry-run] [--files-only] [--token <t>]
  npm run storage:pack [-- <file.tar.gz>] [--files-only]
  npm run storage:unpack -- <file.tar.gz> [--dry-run] [--files-only]`);
  process.exit(positional[0] ? 1 : 0);
}
try {
  await command();
} catch (err) {
  if (!(err instanceof CliError)) throw err;
  console.error(`\n✖ ${err.message}`);
  process.exitCode = 1;
} finally {
  await closePool().catch(() => undefined);
}
