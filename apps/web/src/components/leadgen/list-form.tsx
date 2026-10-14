import { TagInput } from "#/components/site/tag-input";
import { Field, Switch } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { LEAD_CATEGORIES } from "./lead-card";

export interface ListFormValues {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  region: string;
  tags: Array<string>;
  price: string;
  allowDownload: boolean;
  consentConfirmed: boolean;
}

export const EMPTY_LIST: ListFormValues = {
  title: "",
  category: "community",
  subcategory: "",
  description: "",
  region: "",
  tags: [],
  price: "0",
  allowDownload: false,
  consentConfirmed: false,
};

export function toPayload(v: ListFormValues) {
  return { ...v, price: Number(v.price) || 0 };
}

export function ListForm({ value, onChange, terms }: { value: ListFormValues; onChange: (v: ListFormValues) => void; terms?: string }) {
  const set = <K extends keyof ListFormValues>(k: K, v: ListFormValues[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="List title" className="sm:col-span-2">
        <Input value={value.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. UCC SRC executives 2026" required />
      </Field>
      <Field label="Category">
        <select value={value.category} onChange={(e) => set("category", e.target.value)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
          {Object.entries(LEAD_CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Sub-category">
        <Input value={value.subcategory} onChange={(e) => set("subcategory", e.target.value)} placeholder="e.g. Pharmacies, Church youth, Alumni" />
      </Field>
      <Field label="Description" className="sm:col-span-2">
        <Textarea rows={3} value={value.description} onChange={(e) => set("description", e.target.value)} placeholder="Who is in this list and how it was collected" />
      </Field>
      <Field label="Region / location">
        <Input value={value.region} onChange={(e) => set("region", e.target.value)} placeholder="e.g. Central Region" />
      </Field>
      <Field label="Price (GH₵)" hint="0 makes it free for everyone.">
        <Input inputMode="decimal" value={value.price} onChange={(e) => set("price", e.target.value)} />
      </Field>
      <Field label="Tags" className="sm:col-span-2">
        <TagInput value={value.tags} onChange={(v) => set("tags", v)} max={15} />
      </Field>
      <div className="space-y-3 sm:col-span-2">
        <Switch checked={value.allowDownload} onChange={(v) => set("allowDownload", v)} label="Allow buyers to download (CSV)" description="Off: buyers can broadcast to the list but never see raw contacts." />
        <label className="flex items-start gap-2 rounded-xl bg-accent p-3 text-sm">
          <input type="checkbox" checked={value.consentConfirmed} onChange={(e) => set("consentConfirmed", e.target.checked)} className="mt-0.5 size-4 accent-primary" />
          <span>
            I confirm these contacts were collected with consent and I'm allowed to share them.
            {terms && <span className="mt-1 block text-xs text-muted-foreground">{terms}</span>}
          </span>
        </label>
      </div>
    </div>
  );
}
