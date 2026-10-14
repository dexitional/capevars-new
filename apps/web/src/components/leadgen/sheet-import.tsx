// Reads an Excel (.xlsx/.xls) or CSV sheet in the browser and turns it into
// contacts. Columns are matched by their headers (Name, Phone, Email, ...) and
// the member can correct the mapping before using the contacts.
import { useRef, useState } from "react";
import { FileSpreadsheet, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn } from "#/lib/utils";

export interface SheetContact {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  organization?: string | null;
  role?: string | null;
  location?: string | null;
}

const FIELDS = [
  ["name", "Name", /^(full\s*)?name|names|first\s*name|contact\s*name/i],
  ["phone", "Phone", /phone|mobile|tel|cell|msisdn|number|contact$/i],
  ["email", "Email", /e-?mail/i],
  ["organization", "Organisation", /org|company|business|institution|school|church|group/i],
  ["role", "Role / title", /role|title|position|designation/i],
  ["location", "Location", /location|region|city|town|address|area/i],
] as const;
type Field = (typeof FIELDS)[number][0];

const MAX_ROWS = 20_000;

export function SheetImport({ onContacts, compact }: { onContacts: (contacts: Array<SheetContact>, fileName: string) => void; compact?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState<{ name: string; headers: Array<string>; rows: Array<Array<unknown>> } | null>(null);
  const [mapping, setMapping] = useState<Partial<Record<Field, number>>>({});

  const read = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]!]!;
      const all = XLSX.utils.sheet_to_json<Array<unknown>>(ws, { header: 1, blankrows: false, raw: false });
      if (!all.length) throw new Error("That sheet is empty.");
      // Use the first row as headers when it looks like text labels.
      const first = (all[0] ?? []).map((c) => String(c ?? "").trim());
      const hasHeader = first.some((h) => FIELDS.some(([, , re]) => re.test(h)));
      const headers = hasHeader ? first : first.map((_, i) => `Column ${i + 1}`);
      const rows = (hasHeader ? all.slice(1) : all).slice(0, MAX_ROWS);
      const auto: Partial<Record<Field, number>> = {};
      for (const [key, , re] of FIELDS) {
        const idx = headers.findIndex((h, i) => re.test(h) && !Object.values(auto).includes(i));
        if (idx >= 0) auto[key] = idx;
      }
      // No headers: guess phone/email columns from the values.
      if (!hasHeader) {
        const sample = rows.slice(0, 20);
        headers.forEach((_, i) => {
          const vals = sample.map((r) => String(r[i] ?? ""));
          if (auto.email === undefined && vals.some((v) => v.includes("@"))) auto.email = i;
          else if (auto.phone === undefined && vals.filter((v) => /^\+?\d[\d\s-]{7,}$/.test(v)).length > sample.length / 2) auto.phone = i;
        });
      }
      setMapping(auto);
      setSheet({ name: file.name, headers, rows });
      if (all.length - (hasHeader ? 1 : 0) > MAX_ROWS) toast.warning(`Only the first ${MAX_ROWS.toLocaleString()} rows were read.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't read that file.");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  const contacts = (): Array<SheetContact> =>
    (sheet?.rows ?? [])
      .map((r) => {
        const out: SheetContact = {};
        for (const [key] of FIELDS) {
          const idx = mapping[key];
          if (idx !== undefined) out[key] = String(r[idx] ?? "").trim() || null;
        }
        return out;
      })
      .filter((c) => c.phone || c.email);

  if (!sheet) {
    return (
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-muted/50 text-center hover:border-primary/50 hover:bg-accent",
          compact ? "p-5" : "p-10",
        )}
      >
        {busy ? <Loader2 className="size-7 animate-spin text-primary" /> : <UploadCloud className="size-7 text-primary" />}
        <span className="font-semibold text-primary">Upload an Excel or CSV sheet</span>
        <span className="text-xs text-muted-foreground">Columns like Name, Phone, Email, Organisation. Up to {MAX_ROWS.toLocaleString()} rows.</span>
        <input ref={ref} type="file" accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" className="hidden" onChange={(e) => void read(e.target.files?.[0])} />
      </button>
    );
  }

  const usable = contacts();
  return (
    <div className="rounded-2xl border bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b p-4">
        <FileSpreadsheet className="size-5 text-success" />
        <div className="flex-1">
          <p className="font-semibold">{sheet.name}</p>
          <p className="text-xs text-muted-foreground">
            {sheet.rows.length.toLocaleString()} rows · {usable.length.toLocaleString()} with a phone or email
          </p>
        </div>
        <button type="button" onClick={() => setSheet(null)} className="text-sm font-semibold text-muted-foreground hover:text-destructive">
          Choose another file
        </button>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {FIELDS.map(([key, label]) => (
          <label key={key} className="text-sm">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
            <select
              value={mapping[key] ?? ""}
              onChange={(e) => setMapping({ ...mapping, [key]: e.target.value === "" ? undefined : Number(e.target.value) })}
              className="h-9 w-full rounded-md border bg-white px-2"
            >
              <option value="">— not in sheet —</option>
              {sheet.headers.map((h, i) => (
                <option key={i} value={i}>
                  {h || `Column ${i + 1}`}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="max-h-56 overflow-auto border-t">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted text-left">
            <tr>
              {FIELDS.filter(([k]) => mapping[k] !== undefined).map(([k, label]) => (
                <th key={k} className="px-3 py-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {usable.slice(0, 8).map((c, i) => (
              <tr key={i}>
                {FIELDS.filter(([k]) => mapping[k] !== undefined).map(([k]) => (
                  <td key={k} className="px-3 py-1.5">
                    {c[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end border-t p-4">
        <button
          type="button"
          disabled={!usable.length}
          onClick={() => onContacts(usable, sheet.name)}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
        >
          Use {usable.length.toLocaleString()} contacts
        </button>
      </div>
    </div>
  );
}
