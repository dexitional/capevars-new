// Imports the hostel list published on the main capevars.com site into The
// Finder (finder_listings, type "hostel").
//
//   npm run db:import-hostels                      # from https://www.capevars.com/
//   npm run db:import-hostels -- <url>             # another page with the same cards
//   npm run db:import-hostels -- --dry-run         # print what would change
//
// Safe to re-run: hostels are matched by slug (name + area). Re-running
// refreshes the details capevars.com owns (phone, area, availability) but
// never touches a listing's status, owner, photos, reviews or prices, so
// edits and moderation done on Capevars stick.
//
// Only data that is real per hostel is imported. The source shows the same
// amenities and the same "Excellent ★★★★★" on every card, so neither is copied
// as if it described the hostel.
import "dotenv/config";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";

const DEFAULT_URL = "https://www.capevars.com/";

const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AREAS: Record<string, string> = {
  amamoma: "Amamoma",
  ayensu: "Ayensu",
  kwapro: "Kwaprow",
  kwaprow: "Kwaprow",
  oldsite: "Old Site",
  science: "Science",
  "school bus road": "School Bus Road",
};

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

const decode = (s: string) =>
  s
    .replace(/<!-- -->/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

interface Hostel {
  name: string;
  area: string;
  notes: Array<string>; // e.g. "Male only"
  phone: string | null;
  slots: number;
}

function parse(html: string): Array<Hostel> {
  // Server-rendered markup only; the streamed RSC payload repeats it.
  const body = html.slice(0, html.indexOf("self.__next_f") > 0 ? html.indexOf("self.__next_f") : html.length);
  const cards = body.split('class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden').slice(1);
  const hostels: Array<Hostel> = [];
  for (const card of cards) {
    const kind = /tracking-wide text-white shadow[^"]*">([^<]+)<\/button>/.exec(card)?.[1];
    if (kind && kind.trim().toLowerCase() !== "hostel") continue;
    const rawName = /<h1[^>]*>([^<]+)<\/h1>/.exec(card)?.[1];
    const loc = /<span class="text-sm font-light text-gray-700">([\s\S]*?)<\/span>/.exec(card)?.[1];
    if (!rawName || !loc) continue;
    // Shouting words ("Greater Grace HOSTEL") are calmed; everything else is kept as published.
    const name = decode(rawName).replace(/\b[A-Z]{4,}\b/g, (w) => w[0] + w.slice(1).toLowerCase());
    const parts = decode(loc)
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const phone = parts.length > 1 && /^\+?\d[\d\s-]{6,}$/.test(parts[parts.length - 1]!) ? parts.pop()!.replace(/\D/g, "") : null;
    const areaKey = (parts.shift() ?? "").toLowerCase();
    const slotText = /underline-offset-4">([^<]+)<\/span>/.exec(card)?.[1] ?? "";
    hostels.push({
      name,
      area: AREAS[areaKey] ?? titleCase(areaKey),
      notes: parts,
      phone,
      slots: Number(/(\d+)/.exec(slotText)?.[1] ?? 0),
    });
  }
  return hostels;
}

// Ghana mobile numbers: 10 digits starting with 0. Anything else is kept as
// published but gets no WhatsApp link.
const whatsappFor = (phone: string | null) => (phone && /^0\d{9}$/.test(phone) ? `233${phone.slice(1)}` : null);

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const url = args.find((a) => /^https?:\/\//.test(a)) ?? DEFAULT_URL;

  const res = await fetch(url, { headers: { "user-agent": "Capevars hostel import" }, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  const hostels = parse(await res.text());
  if (hostels.length === 0) throw new Error(`No hostel cards found on ${url}. Has the page layout changed?`);
  console.log(`Found ${hostels.length} hostels on ${url}`);

  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is not set.");
  const db = await mysql.createConnection({ uri });
  try {
    const slugs = hostels.map((h) => slug(`${h.name} ${h.area}`));
    const [existingRows] = await db.query<RowDataPacket[]>("SELECT slug FROM finder_listings WHERE slug IN (?)", [slugs]);
    const existing = new Set(existingRows.map((r) => r.slug as string));

    let added = 0;
    let refreshed = 0;
    const noWhatsapp: Array<string> = [];
    for (const [i, h] of hostels.entries()) {
      const s = slugs[i]!;
      const residents = h.notes.join(", ");
      const tagline = `${residents ? `${residents} hostel` : "Student hostel"} in ${h.area}${h.slots > 0 ? ` · ${h.slots} slot${h.slots === 1 ? "" : "s"} available` : ""}`;
      const description =
        `${h.name} is a student hostel in ${h.area}, Cape Coast, close to the University of Cape Coast.` +
        (residents ? ` ${residents}.` : "") +
        (h.phone ? ` Call ${h.phone} to ask about rooms and prices.` : "");
      const attributes: Record<string, string> = {
        Availability: h.slots > 0 ? `${h.slots} slot${h.slots === 1 ? "" : "s"} available` : "No slots available right now",
        ...(residents ? { Residents: residents } : {}),
      };
      const whatsapp = whatsappFor(h.phone);
      if (h.phone && !whatsapp) noWhatsapp.push(`${h.name} (${h.area}): ${h.phone}`);

      if (dryRun) {
        console.log(`  ${existing.has(s) ? "~" : "+"} ${h.name} · ${h.area} · ${h.phone ?? "no phone"}${h.slots ? ` · ${h.slots} slots` : ""}`);
        continue;
      }
      await db.execute(
        `INSERT INTO finder_listings
           (type, name, slug, tagline, description, category, address, area, city, phone, whatsapp, attributes, is_featured, status)
         VALUES ('hostel', ?, ?, ?, ?, 'Student hostel', NULL, ?, 'Cape Coast', ?, ?, ?, ?, 'published')
         ON DUPLICATE KEY UPDATE
           tagline = VALUES(tagline), description = VALUES(description), area = VALUES(area),
           phone = VALUES(phone), whatsapp = VALUES(whatsapp), attributes = VALUES(attributes), is_featured = VALUES(is_featured)`,
        [h.name, s, tagline, description, h.area, h.phone, whatsapp, JSON.stringify(attributes), h.slots > 0 ? 1 : 0],
      );
      if (existing.has(s)) refreshed++;
      else added++;
    }

    if (dryRun) {
      console.log("\nDry run, nothing written.");
    } else {
      console.log(`\n✔ ${added} added, ${refreshed} refreshed.`);
    }
    if (noWhatsapp.length) {
      console.log(`\n⚠ ${noWhatsapp.length} phone numbers aren't valid Ghana mobile numbers (kept as published, no WhatsApp link):`);
      for (const n of noWhatsapp) console.log(`  ${n}`);
    }
  } finally {
    await db.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
