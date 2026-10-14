import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "#/lib/utils";
import { FINDER_AMENITIES, FINDER_TYPES, FINDER_TYPE_KEYS, PRICE_UNITS } from "#/lib/labels";
import type { FinderType } from "#/lib/labels";
import { GalleryUpload, ImageUpload } from "#/components/site/kit";
import { settingsQuery } from "#/components/site/site-footer";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";
import { TYPE_ICONS } from "./finder-search";

type Row = Record<string, any>;

export function emptyListing(listing?: Row | null) {
  return {
    type: (listing?.type ?? "hostel") as FinderType,
    name: listing?.name ?? "",
    tagline: listing?.tagline ?? "",
    description: listing?.description ?? "",
    category: listing?.category ?? "",
    coverUrl: (listing?.cover_url ?? null) as string | null,
    logoUrl: (listing?.logo_url ?? null) as string | null,
    images: (listing?.images ?? []) as Array<string>,
    address: listing?.address ?? "",
    area: listing?.area ?? "",
    city: listing?.city ?? "",
    latitude: listing?.latitude ?? "",
    longitude: listing?.longitude ?? "",
    phone: listing?.phone ?? "",
    whatsapp: listing?.whatsapp ?? "",
    email: listing?.email ?? "",
    website: listing?.website ?? "",
    priceFrom: listing?.price_from ?? "",
    priceTo: listing?.price_to ?? "",
    priceUnit: listing?.price_unit ?? "",
    starRating: listing?.star_rating ? String(listing.star_rating) : "",
    amenities: (listing?.amenities ?? []) as Array<string>,
    openingHours: listing?.opening_hours ?? "",
    attributes: Object.entries((listing?.attributes ?? {}) as Record<string, string>) as Array<[string, string]>,
  };
}
export type ListingValues = ReturnType<typeof emptyListing>;

export function listingPayload(v: ListingValues) {
  const n = (x: string | number) => (x === "" || x === null ? null : Number(x));
  return {
    ...v,
    latitude: n(v.latitude),
    longitude: n(v.longitude),
    priceFrom: n(v.priceFrom),
    priceTo: n(v.priceTo),
    starRating: n(v.starRating),
    attributes: Object.fromEntries(v.attributes.filter(([k, val]) => k.trim() && val.trim())),
  };
}

export function ListingForm({ value, onChange }: { value: ListingValues; onChange: (v: ListingValues) => void }) {
  const { data: settings } = useQuery(settingsQuery);
  const set = <K extends keyof ListingValues>(k: K, v: ListingValues[K]) => onChange({ ...value, [k]: v });
  const [custom, setCustom] = useState("");
  const suggested = FINDER_AMENITIES[value.type];
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5">
        <p className="mb-3 font-bold text-primary">What are you listing?</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {FINDER_TYPE_KEYS.map((t) => {
            const Icon = TYPE_ICONS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ ...value, type: t, priceUnit: value.priceUnit || PRICE_UNITS[t] })}
                className={cn("flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-sm font-semibold", value.type === t ? "border-sys-finder bg-teal-50 text-teal-800" : "border-border")}
              >
                <Icon className="size-5" /> {FINDER_TYPES[t].one}
              </button>
            );
          })}
        </div>
      </section>
      <section className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-2">
        <Field label={value.type === "person" ? "Full name" : "Name"} className="sm:col-span-2">
          <Input value={value.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label="Tagline" className="sm:col-span-2" hint={value.type === "person" ? "e.g. Certified electrician · 10 years' experience" : "A one-line highlight"}>
          <Input value={value.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label={value.type === "person" ? "Profession" : "Category"}>
          <Input value={value.category} onChange={(e) => set("category", e.target.value)} placeholder={value.type === "restaurant" ? "e.g. Ghanaian, Pizza" : value.type === "person" ? "e.g. Plumber, Tutor" : ""} />
        </Field>
        {value.type === "hotel" && (
          <Field label="Star rating">
            <select value={value.starRating} onChange={(e) => set("starRating", e.target.value)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
              <option value="">Not rated</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} star
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Description" className="sm:col-span-2">
          <Textarea rows={5} value={value.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </section>
      <section className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_160px]">
        <Field label="Cover photo">
          <ImageUpload value={value.coverUrl} onChange={(v) => set("coverUrl", v)} folder="listings" aspect="aspect-[16/9]" />
        </Field>
        <Field label={value.type === "person" ? "Photo" : "Logo"}>
          <ImageUpload value={value.logoUrl} onChange={(v) => set("logoUrl", v)} folder="listings" aspect="aspect-square" />
        </Field>
        <Field label="More photos" className="sm:col-span-2">
          <GalleryUpload value={value.images} onChange={(v) => set("images", v)} folder="listings" max={12} />
        </Field>
      </section>
      <section className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-3">
        <Field label="Address" className="sm:col-span-3">
          <Input value={value.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, landmark or GhanaPost GPS" />
        </Field>
        <Field label="Area / neighbourhood">
          <Input list="finder-areas" value={value.area} onChange={(e) => set("area", e.target.value)} />
          <datalist id="finder-areas">
            {settings?.finder.areas.map((a) => <option key={a} value={a} />)}
          </datalist>
        </Field>
        <Field label="City">
          <Input list="finder-city-list" value={value.city} onChange={(e) => set("city", e.target.value)} />
          <datalist id="finder-city-list">
            {settings?.finder.cities.map((c) => <option key={c} value={c} />)}
          </datalist>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Latitude">
            <Input inputMode="decimal" value={value.latitude} onChange={(e) => set("latitude", e.target.value)} />
          </Field>
          <Field label="Longitude">
            <Input inputMode="decimal" value={value.longitude} onChange={(e) => set("longitude", e.target.value)} />
          </Field>
        </div>
        <Field label="Phone">
          <Input type="tel" value={value.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="WhatsApp">
          <Input type="tel" value={value.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={value.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Website" className="sm:col-span-2">
          <Input value={value.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
        </Field>
        <Field label="Opening hours">
          <Input value={value.openingHours} onChange={(e) => set("openingHours", e.target.value)} placeholder="Mon–Sun, 24 hours" />
        </Field>
      </section>
      <section className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-3">
        <Field label="Price from (GH₵)">
          <Input inputMode="decimal" value={value.priceFrom} onChange={(e) => set("priceFrom", e.target.value)} />
        </Field>
        <Field label="Price to (GH₵)">
          <Input inputMode="decimal" value={value.priceTo} onChange={(e) => set("priceTo", e.target.value)} />
        </Field>
        <Field label="Per">
          <Input value={value.priceUnit} onChange={(e) => set("priceUnit", e.target.value)} placeholder={PRICE_UNITS[value.type]} />
        </Field>
        {(suggested.length > 0 || value.amenities.length > 0) && (
          <Field label="Amenities" className="sm:col-span-3">
            <div className="flex flex-wrap gap-2">
              {[...new Set([...suggested, ...value.amenities])].map((a) => {
                const on = value.amenities.includes(a);
                return (
                  <button key={a} type="button" onClick={() => set("amenities", on ? value.amenities.filter((x) => x !== a) : [...value.amenities, a])} className={cn("rounded-full border px-3 py-1 text-sm", on ? "border-sys-finder bg-teal-50 font-semibold text-teal-800" : "")}>
                    {a}
                  </button>
                );
              })}
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && custom.trim()) {
                    e.preventDefault();
                    set("amenities", [...value.amenities, custom.trim()]);
                    setCustom("");
                  }
                }}
                placeholder="+ Other (Enter)"
                className="rounded-full border px-3 py-1 text-sm outline-none"
              />
            </div>
          </Field>
        )}
        <div className="sm:col-span-3">
          <p className="mb-2 text-sm font-medium">Extra details</p>
          <p className="mb-2 text-xs text-muted-foreground">{value.type === "hostel" ? "e.g. Room types → 1-in-a-room, 2-in-a-room · Distance to campus → 5 min walk" : "Anything else people should know."}</p>
          {value.attributes.map(([k, val], i) => (
            <div key={i} className="mb-2 flex gap-2">
              <Input value={k} onChange={(e) => set("attributes", value.attributes.map((a, j) => (j === i ? [e.target.value, a[1]] : a)))} placeholder="Label" />
              <Input value={val} onChange={(e) => set("attributes", value.attributes.map((a, j) => (j === i ? [a[0], e.target.value] : a)))} placeholder="Value" />
              <Button type="button" variant="ghost" size="icon" onClick={() => set("attributes", value.attributes.filter((_, j) => j !== i))} aria-label="Remove">
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => set("attributes", [...value.attributes, ["", ""]])}>
            <Plus /> Add detail
          </Button>
        </div>
      </section>
    </div>
  );
}
