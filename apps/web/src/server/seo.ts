// What search engines and link previews fetch directly: /sitemap.xml, /robots.txt
// and the generated share pictures at /og/... . Server-only, as Nitro handlers
// (vite.config.ts), so sharp and the database never reach the browser bundle.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { QB_LEVELS } from "#/lib/quizbank";
import type { QbLevel } from "#/lib/quizbank";
import { LEVELS, SUBJECTS } from "#/lib/kidilearn/catalog";
import type { SubjectId } from "#/lib/kidilearn/catalog";
import { quizbankCourseName } from "#/lib/seo";
import { notKidiCourse } from "./api/lib/query.js";

const baseUrl = (request: Request) => (process.env.APP_URL?.replace(/\/$/, "") || new URL(request.url).origin);
const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const levelLabel = (id: string) => LEVELS.find((l) => l.id === id)?.label ?? id;
const subjectName = (id: string) => (SUBJECTS as Record<string, (typeof SUBJECTS)[SubjectId] | undefined>)[id]?.name ?? id;

// ---- robots.txt ------------------------------------------------------------------------------

export function handleRobots(request: Request) {
  const body = [
    "User-agent: *",
    "Allow: /",
    // Accounts, tools and anything personal: nothing here belongs in search results.
    ...["/admin", "/api/", "/account", "/seller", "/login", "/signup", "/welcome", "/verify-phone", "/forgot-password", "/reset-password", "/search", "/leadgen/portal", "/learn/kidilearn", "/learn/my", "/learn/teach", "/learn/quizbank/exam/", "/learn/quizbank/s/", "/learn/quizbank/bookmarks", "/*/study"].map((p) => `Disallow: ${p}`),
    "",
    `Sitemap: ${baseUrl(request)}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}

// ---- sitemap.xml -----------------------------------------------------------------------------

export async function handleSitemap(request: Request) {
  const base = baseUrl(request);
  const pool = getPool();
  const [[quizbank], [learn], [kidi]] = await Promise.all([
    pool.query<RowDataPacket[]>("SELECT slug, DATE_FORMAT(updated_at, '%Y-%m-%d') AS d FROM qb_courses WHERE status = 'published' ORDER BY id"),
    pool.query<RowDataPacket[]>(// kidiLearn courses are listed under their catalog page below, which their course page points to.
    `SELECT c.slug, DATE_FORMAT(c.updated_at, '%Y-%m-%d') AS d FROM courses c WHERE c.status = 'published' AND ${notKidiCourse()} ORDER BY c.id`),
    pool.query<RowDataPacket[]>(
      "SELECT k.level_key, k.subject_key, DATE_FORMAT(c.updated_at, '%Y-%m-%d') AS d FROM kidi_course_links k JOIN courses c ON c.id = k.course_id AND c.status = 'published' WHERE k.is_active = 1 ORDER BY k.id",
    ),
  ]);
  const entries: Array<[loc: string, lastmod?: string]> = [
    ["/"],
    ["/learn"],
    ["/learn/quizbank"],
    ["/kidilearn"],
    ...quizbank.map((r): [string, string] => [`/learn/quizbank/c/${r.slug}`, r.d]),
    ...learn.map((r): [string, string] => [`/learn/c/${r.slug}`, r.d]),
    ...kidi.map((r): [string, string] => [`/kidilearn/${r.level_key}/${r.subject_key}`, r.d]),
  ];
  const urls = entries.map(([loc, lastmod]) => `  <url><loc>${escapeXml(base + loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}

// ---- Share pictures --------------------------------------------------------------------------

interface Card {
  label: string;
  title: string;
  detail: string;
  version: string; // changes when the picture should be redrawn
}

async function cardFor(parts: Array<string>): Promise<Card | null> {
  const pool = getPool();
  const [kind, a, b] = parts;
  if (kind === "quizbank" && a) {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT title, code, level, question_count, updated_at FROM qb_courses WHERE slug = ? AND status = 'published'", [a]);
    const c = rows[0];
    if (!c) return null;
    return {
      label: "Quizbank",
      title: quizbankCourseName({ code: c.code as string | null, title: c.title as string }),
      detail: `${QB_LEVELS[c.level as QbLevel]}  ·  ${Number(c.question_count).toLocaleString("en-US")} questions with answers`,
      version: String(c.updated_at),
    };
  }
  if (kind === "learn" && a) {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT title, lesson_count, updated_at FROM courses WHERE slug = ? AND status = 'published'", [a]);
    const c = rows[0];
    if (!c) return null;
    return { label: "OpenLearn", title: c.title as string, detail: `Online course  ·  ${Number(c.lesson_count).toLocaleString("en-US")} lessons`, version: String(c.updated_at) };
  }
  if (kind === "kidilearn" && a && b) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT c.lesson_count, c.updated_at FROM kidi_course_links k JOIN courses c ON c.id = k.course_id AND c.status = 'published' WHERE k.level_key = ? AND k.subject_key = ? AND k.is_active = 1",
      [a, b],
    );
    const c = rows[0];
    if (!c) return null;
    return { label: "kidiLearn", title: `${subjectName(b)} for ${levelLabel(a)}`, detail: `Learn through play  ·  ${Number(c.lesson_count).toLocaleString("en-US")} lessons`, version: String(c.updated_at) };
  }
  return null;
}

const CACHE_DIR = path.join(process.env.IMAGE_CACHE_DIR || path.join(process.cwd(), ".cache", "images"), "og");

// Where public/ is: beside the build in production, the source folder in development.
function publicFile(file: string) {
  for (const dir of [path.join(process.cwd(), ".output", "public"), path.join(process.cwd(), "public")]) {
    const full = path.join(dir, file);
    if (existsSync(full)) return full;
  }
  return null;
}

async function textLayer(text: string, fontfile: string, size: number, color: string, width: number, bold = false) {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return sharp({
    text: { text: `<span foreground="${color}"${bold ? ' weight="bold"' : ""}>${safe}</span>`, font: `Fredoka ${size}`, fontfile, width, rgba: true, dpi: 72, wrap: "word" },
  })
    .png()
    .toBuffer();
}

const BACKGROUND = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#041d40"/><stop offset=".55" stop-color="#1e2a78"/><stop offset="1" stop-color="#4c1d95"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#fcd34d" stop-opacity=".28"/><stop offset="1" stop-color="#fcd34d" stop-opacity="0"/></radialGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#ffffff" fill-opacity=".09"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/><rect width="1200" height="630" fill="url(#dots)"/>
  <circle cx="1090" cy="560" r="330" fill="url(#glow)"/>
  <rect x="70" y="540" width="96" height="6" rx="3" fill="#fcd34d"/>
</svg>`);

async function drawCard(card: Card) {
  const fontfile = publicFile("kidilearn/fonts/fredoka.ttf");
  const logo = publicFile("logo-mark-light.png");
  if (!fontfile || !logo) return null;
  const titleText = card.title.length > 90 ? `${card.title.slice(0, 88).trimEnd()}…` : card.title;
  const size = titleText.length <= 26 ? 88 : titleText.length <= 52 ? 70 : 56;
  const [brand, label, title, detail, mark] = await Promise.all([
    textLayer("Capevars", fontfile, 38, "#ffffff", 400, true),
    textLayer(card.label.toUpperCase(), fontfile, 30, "#fcd34d", 700, true),
    textLayer(titleText, fontfile, size, "#ffffff", 1060, true),
    textLayer(card.detail, fontfile, 32, "#e2e8f0", 1060),
    sharp(logo).resize({ height: 68 }).png().toBuffer(),
  ]);
  const titleHeight = (await sharp(title).metadata()).height;
  return sharp(BACKGROUND)
    .composite([
      { input: mark, left: 70, top: 56 },
      { input: brand, left: 170, top: 70 },
      { input: label, left: 70, top: 190 },
      { input: title, left: 70, top: Math.max(240, 370 - Math.round(titleHeight / 2)) },
      { input: detail, left: 70, top: 562 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function handleOgImage(request: Request) {
  const pathname = decodeURIComponent(new URL(request.url).pathname);
  const parts = pathname.replace(/^\/og\//, "").replace(/\.png$/, "").split("/");
  const fallback = () => new Response(null, { status: 302, headers: { location: "/og.png", "cache-control": "public, max-age=300" } });
  try {
    const card = await cardFor(parts);
    if (!card) return fallback();
    const file = path.join(CACHE_DIR, `${createHash("sha1").update(JSON.stringify([parts, card])).digest("hex")}.png`);
    const cached = await readFile(file).catch(() => null);
    const image = cached ?? (await drawCard(card));
    if (!image) return fallback();
    if (!cached) {
      await mkdir(CACHE_DIR, { recursive: true });
      const temp = `${file}.${process.pid}.tmp`;
      await writeFile(temp, image);
      await rename(temp, file);
    }
    return new Response(new Uint8Array(image), { headers: { "content-type": "image/png", "cache-control": "public, max-age=86400, stale-while-revalidate=604800" } });
  } catch (err) {
    console.error("Share picture failed:", err);
    return fallback();
  }
}
