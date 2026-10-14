// Writes each platform logo as a standalone SVG (pale-yellow tile, navy mark)
// to public/brand/systems/, from the same shapes the site draws
// (src/lib/system-marks.ts). Re-run after changing a mark:
//   npm run brand:logos
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { SYSTEM_MARKS, systemLogoSvg } from "../src/lib/system-marks.js";
import type { SystemKey } from "../src/lib/system-marks.js";

const out = path.resolve(import.meta.dirname, "../public/brand/systems");
await mkdir(out, { recursive: true });
for (const key of Object.keys(SYSTEM_MARKS) as SystemKey[]) {
  await writeFile(path.join(out, `${key}.svg`), systemLogoSvg(key, 512) + "\n");
  console.log(`public/brand/systems/${key}.svg`);
}
