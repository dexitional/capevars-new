import { likePattern } from "./query.js";

// "red  sneakers!" → "+red* +sneakers*" for MySQL boolean-mode FULLTEXT.
// Words under 3 letters are skipped (InnoDB doesn't index them by default).
export function fullTextTerms(q: string) {
  return q
    .split(/\s+/)
    .map((w) => w.replace(/[+\-><()~*"@']/g, ""))
    .filter((w) => w.length >= 3)
    .slice(0, 8)
    .map((w) => `+${w}*`)
    .join(" ");
}

// WHERE fragment matching `q` by FULLTEXT (ranked) or, for short/odd terms,
// by LIKE on a few columns. `ftColumns` must list exactly the columns of a
// FULLTEXT index. Column names come from fixed call sites only.
export function textSearch(ftColumns: string, likeColumns: Array<string>, q: string) {
  const terms = fullTextTerms(q);
  const like = likePattern(q.trim());
  const likes = likeColumns.map((col) => `${col} LIKE ?`);
  if (terms) {
    return {
      sql: `(MATCH(${ftColumns}) AGAINST (? IN BOOLEAN MODE) OR ${likes.join(" OR ")})`,
      params: [terms, ...likeColumns.map(() => like)] as Array<string | number>,
    };
  }
  return { sql: `(${likes.join(" OR ")})`, params: likeColumns.map(() => like) as Array<string | number> };
}

export const money = (v: unknown) => Math.round(Number(v ?? 0) * 100) / 100;
