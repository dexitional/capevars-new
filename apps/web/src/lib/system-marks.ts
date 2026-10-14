// The Capevars system marks: one glyph per platform, drawn on the same 32×32
// grid with the same weights, so they read as one family. Always navy
// (--primary) on the brand's pale yellow (--brand-cream), never a third
// colour: cut-outs ("knock") and the rims that separate overlapping shapes
// take the tile colour.
//
// Pure data (no React), so the site (components/site/system-logo.tsx) and the
// brand-file export (scripts/export-system-logos.ts) draw the same thing.

export type SystemKey = "home" | "market" | "finder" | "groups" | "social" | "learn" | "leadgen";

/**
 * One shape. `paint`: fg = navy (the default), knock = the tile colour. `stroke` draws a line of that
 * width instead of a fill. `outline` adds a knock-coloured rim, separating a
 * shape from what it overlaps.
 */
export interface MarkPart {
  d: string;
  paint?: "fg" | "knock";
  stroke?: number;
  outline?: number;
}

export const BRAND = { navy: "#041D40", cream: "#FFEFAA" } as const;

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;

export const SYSTEM_MARKS: Record<SystemKey, MarkPart[]> = {
  // Home: the hub every platform hangs off.
  home: [
    { d: "M16 5.2 4.6 14a1.5 1.5 0 0 0 .92 2.7H7.4v8.6a1.8 1.8 0 0 0 1.8 1.8h13.6a1.8 1.8 0 0 0 1.8-1.8v-8.6h1.88a1.5 1.5 0 0 0 .92-2.7z" },
    { d: "M13.4 27.1v-5.4a2.6 2.6 0 0 1 5.2 0v5.4z", paint: "knock" },
  ],
  // Marketplace: a shopping bag that smiles back.
  market: [
    { d: "M8.4 11.2h15.2a1.6 1.6 0 0 1 1.6 1.5l.95 12.2a2.2 2.2 0 0 1-2.2 2.4H8.05a2.2 2.2 0 0 1-2.2-2.4l.95-12.2a1.6 1.6 0 0 1 1.6-1.5z" },
    { d: "M11.6 14.2V10a4.4 4.4 0 0 1 8.8 0v4.2", stroke: 2.4 },
    { d: circle(11.6, 14.6, 1.25), paint: "knock" },
    { d: circle(20.4, 14.6, 1.25), paint: "knock" },
    { d: "M12.4 19.2a3.6 3.6 0 0 0 7.2 0", paint: "knock", stroke: 2.2 },
  ],
  // The Finder: a pin found under the lens.
  finder: [
    { d: circle(13.8, 13.8, 8.4), stroke: 2.7 },
    { d: "M20.3 20.3 26.4 26.4", stroke: 3.8 },
    { d: "M13.8 8.4a4.2 4.2 0 0 0-4.2 4.2c0 3.1 4.2 7.1 4.2 7.1s4.2-4 4.2-7.1a4.2 4.2 0 0 0-4.2-4.2z" },
    { d: circle(13.8, 12.6, 1.6), paint: "knock" },
  ],
  // Campus Groups: a leader in front of the circle.
  groups: [
    { d: circle(7.9, 13.6, 2.9) },
    { d: "M2.6 26.3v-1.5a4.7 4.7 0 0 1 4.7-4.7h1.2a4.7 4.7 0 0 1 4.7 4.7v1.5z" },
    { d: circle(24.1, 13.6, 2.9) },
    { d: "M18.8 26.3v-1.5a4.7 4.7 0 0 1 4.7-4.7h1.2a4.7 4.7 0 0 1 4.7 4.7v1.5z" },
    { d: "M9.4 26.6v-2.4a6.1 6.1 0 0 1 6.1-6.1h1a6.1 6.1 0 0 1 6.1 6.1v2.4z", outline: 1.8 },
    { d: circle(16, 10.6, 4.1), outline: 1.8 },
  ],
  // SocialNet: a conversation, mid-reply.
  social: [
    { d: "M6.6 4.8h10.8a3.6 3.6 0 0 1 3.6 3.6v5.4a3.6 3.6 0 0 1-3.6 3.6h-6.6L6.4 21v-3.7A3.6 3.6 0 0 1 3 13.8V8.4a3.6 3.6 0 0 1 3.6-3.6z" },
    { d: "M14.6 10.8h10.8a3.6 3.6 0 0 1 3.6 3.6V20a3.6 3.6 0 0 1-3.2 3.58v3.62l-4.4-3.6h-6.8A3.6 3.6 0 0 1 11 20v-5.6a3.6 3.6 0 0 1 3.6-3.6z", outline: 1.8 },
    { d: circle(15.9, 17.2, 1.35), paint: "knock" },
    { d: circle(20, 17.2, 1.35), paint: "knock" },
    { d: circle(24.1, 17.2, 1.35), paint: "knock" },
  ],
  // OpenLearn: an open book, reading on one page and a lesson playing on the other.
  learn: [
    { d: "M15 8.5c-2.5-1.6-5.9-2.2-9.6-1.9A1.4 1.4 0 0 0 4.1 8v14.7a1.4 1.4 0 0 0 1.5 1.4c3.5-.3 6.8.4 9.4 2.1z" },
    { d: "M17 8.5c2.5-1.6 5.9-2.2 9.6-1.9A1.4 1.4 0 0 1 27.9 8v14.7a1.4 1.4 0 0 1-1.5 1.4c-3.5-.3-6.8.4-9.4 2.1z" },
    { d: "M7.4 11.7c1.9-.1 3.7.2 5.1.9M7.4 15.6c1.9-.1 3.7.2 5.1.9M7.4 19.5c1.2-.05 2.3.05 3.3.35", paint: "knock", stroke: 1.7 },
    { d: "M19.9 12.3v6.4a.6.6 0 0 0 .9.5l4.9-3.2a.6.6 0 0 0 0-1l-4.9-3.2a.6.6 0 0 0-.9.5z", paint: "knock" },
  ],
  // LeadGen: a megaphone, broadcasting.
  leadgen: [
    { d: "M5.7 12.4h4.3l9.8-5.4a1.3 1.3 0 0 1 1.95 1.15v15.7a1.3 1.3 0 0 1-1.95 1.15l-9.8-5.4H5.7a2.2 2.2 0 0 1-2.2-2.2v-2.8a2.2 2.2 0 0 1 2.2-2.2z" },
    { d: "M10 12.9v6.2", paint: "knock", stroke: 1.6 },
    { d: "M7.3 19.6h3.6l1.4 5a1.4 1.4 0 0 1-1.35 1.8h-.9a1.5 1.5 0 0 1-1.44-1.1z" },
    { d: "M24.4 13.2a4 4 0 0 1 0 5.6", stroke: 2.4 },
    { d: "M26.8 10.6a7.4 7.4 0 0 1 0 10.8", stroke: 2.4 },
  ],
};

/** A complete tile (rounded square, pale yellow, navy mark) as standalone SVG markup. */
export function systemLogoSvg(key: SystemKey, size = 256): string {
  const color = (p: MarkPart) => (p.paint === "knock" ? BRAND.cream : BRAND.navy);
  const parts = SYSTEM_MARKS[key]
    .map((p) => {
      if (p.stroke) {
        return `<path d="${p.d}" fill="none" stroke="${color(p)}" stroke-width="${p.stroke}" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      const rim = p.outline ? ` stroke="${BRAND.cream}" stroke-width="${p.outline}" stroke-linejoin="round"` : "";
      return `<path d="${p.d}" fill="${color(p)}"${rim}/>`;
    })
    .join("");
  // Same proportions as the on-site tile: 28% corner radius, mark at 70%.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><rect width="32" height="32" rx="8.96" fill="${BRAND.cream}"/><g transform="translate(4.8 4.8) scale(.7)">${parts}</g></svg>`;
}
