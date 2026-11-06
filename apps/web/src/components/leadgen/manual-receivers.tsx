// Adding people to a broadcast by hand, on top of any lead lists and uploads.
// One at a time with a name, or several numbers or emails pasted together.
import { useState } from "react";
import { Plus, UserPlus, X } from "lucide-react";
import { normalizeEmail, normalizePhone } from "#/lib/contact-address";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";

export type ManualReceiver = { name: string | null; phone?: string; email?: string };

export function ManualReceivers({ channel, value, onChange }: { channel: "sms" | "email"; value: Array<ManualReceiver>; onChange: (next: Array<ManualReceiver>) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const field = channel === "sms" ? "phone" : "email";
  const shown = value.filter((r) => r[field]);

  const add = (text: string) => {
    const entries = text.split(/[\n,;]+/).map((t) => t.trim()).filter(Boolean);
    const known = new Set(shown.map((r) => r[field]));
    const added: Array<ManualReceiver> = [];
    const invalid: Array<string> = [];
    let repeated = 0;
    for (const entry of entries) {
      const clean = channel === "sms" ? normalizePhone(entry) : normalizeEmail(entry);
      if (!clean) invalid.push(entry);
      else if (known.has(clean)) repeated++;
      else {
        known.add(clean);
        added.push({ name: entries.length === 1 ? name.trim() || null : null, [field]: clean });
      }
    }
    if (added.length) onChange([...value, ...added]);
    setAddress(invalid.join(", "));
    if (!invalid.length) setName("");
    setError(
      invalid.length
        ? channel === "sms"
          ? "Check these numbers. Use a format like 024 123 4567, or include the country code for numbers outside Ghana."
          : "Check these email addresses."
        : repeated
          ? `${repeated === 1 ? "That's" : `${repeated} of those are`} already on the list.`
          : null,
    );
  };

  if (!open && !shown.length) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-cyan-700 hover:underline">
        + Add receivers manually
      </button>
    );
  }
  return (
    <div className="rounded-xl border p-3">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <UserPlus className="size-3.5" /> Add receivers manually
      </p>
      <form
        className="grid gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          add(address);
        }}
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" maxLength={150} aria-label="Receiver's name" />
        <Input
          value={address}
          type={channel === "sms" ? "tel" : "text"}
          inputMode={channel === "sms" ? "tel" : "email"}
          onChange={(e) => setAddress(e.target.value)}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (!/[\n,;]/.test(text.trim())) return;
            e.preventDefault();
            add(text);
          }}
          placeholder={channel === "sms" ? "024 123 4567" : "name@example.com"}
          aria-label={channel === "sms" ? "Receiver's phone number" : "Receiver's email"}
        />
        <Button type="submit" variant="outline" disabled={!address.trim()}>
          <Plus /> Add
        </Button>
      </form>
      <p className="mt-1.5 text-xs text-muted-foreground">To add several at once, separate them with commas or paste a list.</p>
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
      {shown.length > 0 && (
        <>
          <div className="mt-3 flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
            <span>{shown.length.toLocaleString()} added</span>
            <button type="button" className="text-destructive" onClick={() => onChange(value.filter((r) => !r[field]))}>
              Remove all
            </button>
          </div>
          <ul className="mt-1.5 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
            {shown.map((r) => (
              <li key={r[field]} className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs">
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  {r.name && <strong className="mr-1 font-semibold">{r.name}</strong>}
                  {channel === "sms" ? `+${r.phone}` : r.email}
                </span>
                <button type="button" className="shrink-0" onClick={() => onChange(value.filter((x) => x !== r))} aria-label={`Remove ${r[field]}`}>
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
