import { useState } from "react";
import { cn } from "#/lib/utils";
import { GROUP_CATEGORIES } from "#/lib/labels";
import { ImageUpload } from "#/components/site/kit";
import { RichTextEditor } from "#/components/admin/rich-text-editor";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;

export function groupValues(g?: Row | null) {
  return {
    name: g?.name ?? "",
    category: g?.category ?? "club",
    tagline: g?.tagline ?? "",
    about: g?.about ?? "",
    logoUrl: (g?.logo_url ?? null) as string | null,
    coverUrl: (g?.cover_url ?? null) as string | null,
    visibility: (g?.visibility ?? "public") as "public" | "private",
    joinPolicy: (g?.join_policy ?? "open") as "open" | "approval",
    contactEmail: g?.contact_email ?? "",
  };
}
export type GroupValues = ReturnType<typeof groupValues>;

export function GroupForm({ value, onChange }: { value: GroupValues; onChange: (v: GroupValues) => void }) {
  const set = <K extends keyof GroupValues>(k: K, v: GroupValues[K]) => onChange({ ...value, [k]: v });
  const [aboutKey] = useState(() => Math.random());
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
        <Field label="Logo">
          <ImageUpload value={value.logoUrl} onChange={(v) => set("logoUrl", v)} folder="groups" aspect="aspect-square" />
        </Field>
        <Field label="Cover image">
          <ImageUpload value={value.coverUrl} onChange={(v) => set("coverUrl", v)} folder="groups" aspect="aspect-[3/1]" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Group name" className="sm:col-span-2">
          <Input value={value.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label="Category">
          <select value={value.category} onChange={(e) => set("category", e.target.value)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
            {Object.entries(GROUP_CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Contact email">
          <Input type="email" value={value.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
        </Field>
        <Field label="Tagline" className="sm:col-span-2">
          <Input value={value.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="One line about the group" />
        </Field>
      </div>
      <Field label="About">
        <RichTextEditor key={aboutKey} value={value.about} onChange={(html) => set("about", html)} folder="groups" memberUploads minHeight="min-h-40" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-sm font-medium">Who can see posts?</p>
          {(
            [
              ["public", "Public", "Anyone can see posts, forum and members."],
              ["private", "Private", "Only members see content; others see About."],
            ] as const
          ).map(([k, label, text]) => (
            <button key={k} type="button" onClick={() => set("visibility", k)} className={cn("mb-2 block w-full rounded-xl border-2 p-3 text-left", value.visibility === k ? "border-sys-groups bg-violet-50" : "border-border")}>
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-xs text-muted-foreground">{text}</span>
            </button>
          ))}
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium">Who can join?</p>
          {(
            [
              ["open", "Anyone", "Members join instantly."],
              ["approval", "By approval", "Admins approve join requests."],
            ] as const
          ).map(([k, label, text]) => (
            <button key={k} type="button" onClick={() => set("joinPolicy", k)} className={cn("mb-2 block w-full rounded-xl border-2 p-3 text-left", value.joinPolicy === k ? "border-sys-groups bg-violet-50" : "border-border")}>
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-xs text-muted-foreground">{text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
