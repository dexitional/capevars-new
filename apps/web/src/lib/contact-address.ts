// Phone numbers and email addresses in the one form they are stored and sent in.
// Ghana numbers to 233XXXXXXXXX; other numbers must already carry a country
// code (with or without "+"). Returns null for anything that isn't a phone number.
export function normalizePhone(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim();
  if (!s) return null;
  s = s.replace(/[\s\-().]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  else if (s.startsWith("00")) s = s.slice(2);
  if (!/^\d+$/.test(s)) return null;
  if (s.length === 10 && s.startsWith("0")) s = `233${s.slice(1)}`;
  else if (s.length === 9 && /^[235]/.test(s)) s = `233${s}`; // leading zero dropped by spreadsheets
  if (s.startsWith("233") && s.length !== 12) return null;
  return s.length >= 10 && s.length <= 15 ? s : null;
}

export function normalizeEmail(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(s) && s.length <= 150 ? s : null;
}
