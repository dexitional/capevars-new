import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import { ImageUpload } from "#/components/site/kit";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

export function PageForm({ initial, onSubmit, pending, submitLabel }: { initial?: Record<string, any>; onSubmit: (v: Record<string, unknown>) => void; pending: boolean; submitLabel: string }) {
  const { data } = useQuery({ queryKey: ["pages", "", ""], queryFn: () => api.get<{ categories: Array<string> }>("/social/pages") });
  const [f, setF] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? "Community",
    about: initial?.about ?? "",
    avatarUrl: (initial?.avatar_url ?? null) as string | null,
    coverUrl: (initial?.cover_url ?? null) as string | null,
    website: initial?.website ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
  });
  return (
    <form
      className="grid gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(f);
      }}
    >
      <Field label="Cover" className="sm:col-span-2">
        <ImageUpload value={f.coverUrl} onChange={(v) => setF({ ...f, coverUrl: v })} folder="covers" aspect="aspect-[3/1]" />
      </Field>
      <Field label="Profile picture">
        <ImageUpload value={f.avatarUrl} onChange={(v) => setF({ ...f, avatarUrl: v })} folder="avatars" aspect="aspect-square" className="w-32" round />
      </Field>
      <div className="space-y-4">
        <Field label="Page name">
          <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
        </Field>
        <Field label="Category">
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm">
            {(data?.categories ?? [f.category]).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="About" className="sm:col-span-2">
        <Textarea rows={4} value={f.about} onChange={(e) => setF({ ...f, about: e.target.value })} />
      </Field>
      <Field label="Website">
        <Input value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} placeholder="https://" />
      </Field>
      <Field label="Phone">
        <Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      </Field>
      <Field label="Email">
        <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </Field>
      <div className="flex items-end">
        <Button type="submit" disabled={pending} className="bg-sys-social">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
