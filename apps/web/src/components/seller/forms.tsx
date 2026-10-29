// Editors used across the Seller Center. Each takes the existing row (or
// null for "new"), and saves through the seller API.
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, LocateFixed, Plus, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { toInputDateTime } from "#/lib/format";
import { EVENT_CATEGORIES, SELLER_KINDS } from "#/lib/labels";
import { FileUpload, GalleryUpload, ImageUpload } from "#/components/site/kit";
import { TagInput } from "#/components/site/tag-input";
import { formatPin, parsePin, pickupMapUrl } from "#/components/market/trip-pin";
import { Field, Switch } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Row = Record<string, any>;
const num = (v: string) => (v === "" ? null : Number(v));

function Select({ value, onChange, options, className }: { value: string; onChange: (v: string) => void; options: Array<[string, string]>; className?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={cn("h-9 w-full rounded-md border border-input bg-white px-3 text-sm", className)}>
      {options.map(([k, v]) => (
        <option key={k} value={k}>
          {v}
        </option>
      ))}
    </select>
  );
}

function EditorDialog({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn("max-h-[92vh] overflow-y-auto", wide ? "sm:max-w-3xl" : "sm:max-w-2xl")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function useSave(path: string, id: number | undefined, onDone: () => void, success: string) {
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => (id ? api.patch(`${path}/${id}`, body) : api.post(path, body)),
    onSuccess: () => {
      toast.success(success);
      onDone();
    },
    onError: (e) => toast.error(e.message),
  });
}

// ---- Store ----------------------------------------------------------------------------------

export function StoreForm({ store, onSaved, terms }: { store: Row | null; onSaved: () => void; terms?: string }) {
  const [f, setF] = useState({
    storeName: store?.store_name ?? "",
    kinds: store ? String(store.kinds).split(",").filter(Boolean) : ["products"],
    tagline: store?.tagline ?? "",
    description: store?.description ?? "",
    logoUrl: store?.logo_url ?? null,
    bannerUrl: store?.banner_url ?? null,
    email: store?.email ?? "",
    phone: store?.phone ?? "",
    whatsapp: store?.whatsapp ?? "",
    location: store?.location ?? "",
    businessRegNo: store?.business_reg_no ?? "",
    idDocumentUrl: store?.id_document_url ?? null,
    cuisine: store?.cuisine ?? "",
    openingHours: store?.opening_hours ?? "",
    delivers: store ? store.delivers === 1 : false,
    deliveryFee: String(store?.delivery_fee ?? "0"),
    isOpen: store ? store.is_open === 1 : true,
  });
  const [agree, setAgree] = useState(Boolean(store));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = useMutation({
    mutationFn: () => {
      const body = { ...f, deliveryFee: Number(f.deliveryFee) || 0 };
      return store ? api.patch("/seller/store", body) : api.post("/seller/store", body);
    },
    onSuccess: () => {
      toast.success(store ? "Store saved" : "Application submitted! We'll review it shortly.");
      onSaved();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 font-bold text-primary">What will you sell?</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SELLER_KINDS).map(([k, v]) => {
            const on = f.kinds.includes(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => set("kinds", on ? f.kinds.filter((x: string) => x !== k) : [...f.kinds, k])}
                className={cn("rounded-xl border-2 p-3 text-left", on ? "border-primary bg-accent" : "border-border")}
              >
                <span className="block text-sm font-bold">{v.label}</span>
                <span className="block text-xs text-muted-foreground">{v.text}</span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-2">
        <Field label="Store name">
          <Input value={f.storeName} onChange={(e) => set("storeName", e.target.value)} required />
        </Field>
        <Field label="Tagline">
          <Input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Affordable gadgets for students" />
        </Field>
        <Field label="About the store" className="sm:col-span-2">
          <Textarea rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Logo">
          <ImageUpload value={f.logoUrl} onChange={(v) => set("logoUrl", v)} folder="stores" aspect="aspect-square" className="w-32" />
        </Field>
        <Field label="Banner">
          <ImageUpload value={f.bannerUrl} onChange={(v) => set("bannerUrl", v)} folder="stores" aspect="aspect-[3/1]" />
        </Field>
        <Field label="Phone">
          <Input type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} required />
        </Field>
        <Field label="WhatsApp">
          <Input type="tel" value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Location">
          <Input value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Amamoma, Cape Coast" />
        </Field>
        {f.kinds.includes("food") && (
          <>
            <Field label="Cuisine">
              <Input value={f.cuisine} onChange={(e) => set("cuisine", e.target.value)} placeholder="e.g. Ghanaian, Continental" />
            </Field>
            <Field label="Opening hours">
              <Input value={f.openingHours} onChange={(e) => set("openingHours", e.target.value)} placeholder="Mon–Sat, 7am–9pm" />
            </Field>
          </>
        )}
        <div className="space-y-3 sm:col-span-2">
          <Switch checked={f.delivers} onChange={(v) => set("delivers", v)} label="I deliver" description="Buyers can choose delivery as well as pickup." />
          {f.delivers && (
            <Field label="Delivery fee (GH₵)" className="max-w-40">
              <Input inputMode="decimal" value={f.deliveryFee} onChange={(e) => set("deliveryFee", e.target.value)} />
            </Field>
          )}
          {store && <Switch checked={f.isOpen} onChange={(v) => set("isOpen", v)} label="Open for orders" description="Turn off when you're closed or away." />}
        </div>
      </section>
      <section className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-2">
        <h2 className="font-bold text-primary sm:col-span-2">Verification</h2>
        <Field label="Business registration no. (optional)">
          <Input value={f.businessRegNo} onChange={(e) => set("businessRegNo", e.target.value)} />
        </Field>
        <Field label="Ghana Card / ID (PDF or image)" hint="Only seen by Capevars staff.">
          <FileUpload value={f.idDocumentUrl} onChange={(v) => set("idDocumentUrl", v)} folder="stores" />
        </Field>
        {!store && (
          <label className="flex items-start gap-2 rounded-xl bg-accent p-3 text-sm sm:col-span-2">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-4 accent-primary" />
            <span>
              I agree to the seller rules.
              {terms && <span className="mt-1 block text-xs text-muted-foreground">{terms}</span>}
            </span>
          </label>
        )}
      </section>
      <Button type="submit" size="lg" disabled={save.isPending || !agree || !f.kinds.length}>
        {save.isPending && <Loader2 className="animate-spin" />} {store ? "Save store" : "Submit application"}
      </Button>
    </form>
  );
}

// ---- Products & menu items --------------------------------------------------------------------

export function ProductEditor({
  product,
  kind,
  open,
  onClose,
  onSaved,
  endpoint = "/seller/products",
  moderator = false,
}: {
  product: Row | null;
  kind: "product" | "food";
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** Where it saves: the seller's own products, or /admin/products for moderators. */
  endpoint?: string;
  /** Admin editing: "Blocked" is a status option and is kept as it is. */
  moderator?: boolean;
}) {
  const { data: cats } = useQuery({ queryKey: ["market-categories"], queryFn: () => api.get<{ categories: Array<Row> }>("/market/categories"), staleTime: 300_000 });
  const [f, setF] = useState(() => ({
    title: product?.title ?? "",
    categoryId: product?.category_id ? String(product.category_id) : "",
    description: product?.description ?? "",
    menuSection: product?.menu_section ?? "",
    price: product?.price ?? "",
    compareAtPrice: product?.compare_at_price ?? "",
    stock: product?.stock === null || product?.stock === undefined ? "" : String(product.stock),
    itemCondition: product?.item_condition ?? "new",
    images: (product?.images ?? []) as Array<string>,
    tags: (product?.tags ?? []) as Array<string>,
    status: product?.status === "blocked" && !moderator ? "hidden" : (product?.status ?? "active"),
  }));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = useSave(endpoint, product?.id, () => (onSaved(), onClose()), "Saved");
  const all = cats?.categories ?? [];
  const options: Array<[string, string]> = [
    ["", "— Category —"],
    ...all
      .filter((c) => !c.parent_id && Boolean(c.is_food) === (kind === "food"))
      .flatMap((p) => [[String(p.id), p.name] as [string, string], ...all.filter((c) => c.parent_id === p.id).map((c) => [String(c.id), `   ${p.name} › ${c.name}`] as [string, string])]),
  ];
  return (
    <EditorDialog open={open} onClose={onClose} title={product ? `Edit ${kind === "food" ? "menu item" : "product"}` : kind === "food" ? "New menu item" : "New product"} wide>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate({
            kind,
            title: f.title,
            categoryId: f.categoryId ? Number(f.categoryId) : null,
            description: f.description,
            menuSection: kind === "food" ? f.menuSection : null,
            price: Number(f.price),
            compareAtPrice: num(String(f.compareAtPrice)),
            stock: num(f.stock),
            itemCondition: kind === "food" ? "new" : f.itemCondition,
            images: f.images,
            tags: f.tags,
            status: f.status,
          });
        }}
      >
        <Field label="Photos" className="sm:col-span-2" hint="The first photo is the cover. Up to 8.">
          <GalleryUpload value={f.images} onChange={(v) => set("images", v)} folder="products" />
        </Field>
        <Field label="Title" className="sm:col-span-2">
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
        <Field label="Category">
          <Select value={f.categoryId} onChange={(v) => set("categoryId", v)} options={options} />
        </Field>
        {kind === "food" ? (
          <Field label="Menu section" hint="e.g. Rice dishes, Drinks, Sides">
            <Input value={f.menuSection} onChange={(e) => set("menuSection", e.target.value)} />
          </Field>
        ) : (
          <Field label="Condition">
            <Select value={f.itemCondition} onChange={(v) => set("itemCondition", v)} options={[["new", "New"], ["used", "Used"], ["refurbished", "Refurbished"]]} />
          </Field>
        )}
        <Field label="Price (GH₵)">
          <Input inputMode="decimal" value={f.price} onChange={(e) => set("price", e.target.value)} required />
        </Field>
        <Field label="Was (GH₵, optional)" hint="Shows a discount badge.">
          <Input inputMode="decimal" value={f.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
        </Field>
        <Field label="Stock" hint="Leave empty for unlimited.">
          <Input inputMode="numeric" value={f.stock} onChange={(e) => set("stock", e.target.value)} />
        </Field>
        <Field label="Visibility">
          <Select
            value={f.status}
            onChange={(v) => set("status", v)}
            options={[["active", "Live"], ["draft", "Draft"], ["hidden", "Hidden"], ...(moderator ? [["blocked", "Blocked"] as [string, string]] : [])]}
          />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <Textarea rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Tags" className="sm:col-span-2">
          <TagInput value={f.tags} onChange={(v) => set("tags", v)} max={15} />
        </Field>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} Save
          </Button>
        </div>
      </form>
    </EditorDialog>
  );
}

// ---- Events ---------------------------------------------------------------------------------

interface TicketType {
  id?: number;
  name: string;
  description: string;
  price: string;
  quantity: string;
  maxPerOrder: string;
  sold?: number;
}

export function EventEditor({
  event,
  types,
  open,
  onClose,
  onSaved,
  endpoint = "/seller/events",
}: {
  event: Row | null;
  types: Array<Row>;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** Where it saves: the organiser's own events, or /admin/tickets/events for moderators. */
  endpoint?: string;
}) {
  const [f, setF] = useState(() => ({
    title: event?.title ?? "",
    category: event?.category ?? "campus",
    summary: event?.summary ?? "",
    description: event?.description ?? "",
    coverUrl: event?.cover_url ?? null,
    venue: event?.venue ?? "",
    city: event?.city ?? "",
    startsAt: toInputDateTime(event?.starts_at),
    endsAt: toInputDateTime(event?.ends_at),
  }));
  const [tt, setTt] = useState<Array<TicketType>>(() =>
    types.length
      ? types.map((t) => ({ id: t.id, name: t.name, description: t.description ?? "", price: String(t.price), quantity: String(t.quantity), maxPerOrder: String(t.max_per_order), sold: t.sold }))
      : [{ name: "Regular", description: "", price: "0", quantity: "100", maxPerOrder: "10" }],
  );
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = useSave(endpoint, event?.id, () => (onSaved(), onClose()), event ? "Event saved" : "Event submitted for review");
  return (
    <EditorDialog open={open} onClose={onClose} title={event ? "Edit event" : "New event"} wide>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate({
            ...f,
            endsAt: f.endsAt || null,
            submit: true,
            ticketTypes: tt.map((t) => ({ id: t.id, name: t.name, description: t.description, price: Number(t.price) || 0, quantity: Number(t.quantity), maxPerOrder: Number(t.maxPerOrder) || 10 })),
          });
        }}
      >
        <Field label="Cover image" className="sm:col-span-2">
          <ImageUpload value={f.coverUrl} onChange={(v) => set("coverUrl", v)} folder="events" aspect="aspect-[3/1]" />
        </Field>
        <Field label="Event title" className="sm:col-span-2">
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
        <Field label="Category">
          <Select value={f.category} onChange={(v) => set("category", v)} options={Object.entries(EVENT_CATEGORIES)} />
        </Field>
        <Field label="Short summary">
          <Input value={f.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <Field label="Venue">
          <Input value={f.venue} onChange={(e) => set("venue", e.target.value)} required />
        </Field>
        <Field label="City">
          <Input value={f.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Starts">
          <Input type="datetime-local" value={f.startsAt} onChange={(e) => set("startsAt", e.target.value)} required />
        </Field>
        <Field label="Ends (optional)">
          <Input type="datetime-local" value={f.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <Textarea rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-semibold">Ticket types</p>
          <div className="space-y-2">
            {tt.map((t, i) => (
              <div key={t.id ?? `new-${i}`} className="grid grid-cols-2 gap-2 rounded-xl border p-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
                <Input placeholder="Name (e.g. VIP)" value={t.name} onChange={(e) => setTt(tt.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} required />
                <Input placeholder="Price" inputMode="decimal" value={t.price} onChange={(e) => setTt(tt.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} />
                <Input placeholder="Quantity" inputMode="numeric" value={t.quantity} onChange={(e) => setTt(tt.map((x, j) => (j === i ? { ...x, quantity: e.target.value } : x)))} required />
                <Input placeholder="Max/order" inputMode="numeric" value={t.maxPerOrder} onChange={(e) => setTt(tt.map((x, j) => (j === i ? { ...x, maxPerOrder: e.target.value } : x)))} />
                <button type="button" disabled={Boolean(t.sold) || tt.length === 1} onClick={() => setTt(tt.filter((_, j) => j !== i))} className="rounded-lg p-2 text-muted-foreground hover:text-destructive disabled:opacity-30" aria-label="Remove ticket type">
                  <Trash2 className="size-4" />
                </button>
                <Input className="col-span-2 sm:col-span-5" placeholder="What's included (optional)" value={t.description} onChange={(e) => setTt(tt.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setTt([...tt, { name: "", description: "", price: "0", quantity: "50", maxPerOrder: "10" }])}>
            <Plus /> Add ticket type
          </Button>
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2">New and rejected events are reviewed by Capevars before tickets go on sale.</p>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} {event ? "Save event" : "Submit event"}
          </Button>
        </div>
      </form>
    </EditorDialog>
  );
}

// ---- Bus trips ------------------------------------------------------------------------------

export function TripEditor({
  trip,
  open,
  onClose,
  onSaved,
  endpoint = "/seller/trips",
}: {
  trip: Row | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** Where it saves: the operator's own trips, or /admin/tickets/trips for moderators. */
  endpoint?: string;
}) {
  const [f, setF] = useState(() => ({
    origin: trip?.origin ?? "",
    destination: trip?.destination ?? "",
    pickupPoint: trip?.pickup_point ?? "",
    pickupPin: formatPin(trip?.pickup_lat, trip?.pickup_lng),
    departsAt: toInputDateTime(trip?.departs_at),
    arrivesAt: toInputDateTime(trip?.arrives_at),
    busType: trip?.bus_type ?? "",
    amenities: (trip?.amenities ?? []) as Array<string>,
    seatsTotal: String(trip?.seats_total ?? "30"),
    price: String(trip?.price ?? ""),
    status: trip?.status ?? "scheduled",
  }));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = useSave(endpoint, trip?.id, () => (onSaved(), onClose()), "Trip saved");
  const pin = parsePin(f.pickupPin);
  const pinError =
    f.pickupPin.trim() && !pin ? "Enter coordinates like 5.1036, -1.2825, or a full Google Maps link (open a short maps.app.goo.gl link first, then copy the address bar)." : undefined;
  const [locating, setLocating] = useState(false);
  const useMyLocation = () => {
    if (!("geolocation" in navigator)) return toast.error("This browser can't share your location.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => (setLocating(false), set("pickupPin", `${p.coords.latitude.toFixed(6)}, ${p.coords.longitude.toFixed(6)}`)),
      () => (setLocating(false), toast.error("Couldn't get your location. Allow location access, or paste a map link.")),
      { enableHighAccuracy: true, timeout: 15_000 },
    );
  };
  return (
    <EditorDialog open={open} onClose={onClose} title={trip ? "Edit trip" : "New bus trip"}>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (pinError) return;
          const { pickupPin: _, ...rest } = f;
          save.mutate({
            ...rest,
            pickupLat: pin?.lat ?? null,
            pickupLng: pin?.lng ?? null,
            arrivesAt: f.arrivesAt || null,
            seatsTotal: Number(f.seatsTotal),
            price: Number(f.price),
            status: trip ? f.status : undefined,
          });
        }}
      >
        <Field label="From">
          <Input value={f.origin} onChange={(e) => set("origin", e.target.value)} required />
        </Field>
        <Field label="To">
          <Input value={f.destination} onChange={(e) => set("destination", e.target.value)} required />
        </Field>
        <Field label="Pickup point" className="sm:col-span-2">
          <Input value={f.pickupPoint} onChange={(e) => set("pickupPoint", e.target.value)} placeholder="e.g. UCC Science bus stop" />
        </Field>
        <Field
          label="Pickup map pin (optional)"
          className="sm:col-span-2"
          error={pinError}
          hint={
            pin ? (
              <a href={pickupMapUrl({ pickup_lat: pin.lat, pickup_lng: pin.lng })} target="_blank" rel="noreferrer" className="underline">
                Check this pin on Google Maps
              </a>
            ) : (
              "Paste a Google Maps link or coordinates, or stand at the pickup point and use your location. The trip flyer's QR code gives passengers directions here."
            )
          }
        >
          <div className="flex gap-2">
            <Input value={f.pickupPin} onChange={(e) => set("pickupPin", e.target.value)} placeholder="5.1036, -1.2825 or a Google Maps link" />
            <Button type="button" variant="outline" onClick={useMyLocation} disabled={locating}>
              {locating ? <Loader2 className="animate-spin" /> : <LocateFixed />} My location
            </Button>
          </div>
        </Field>
        <Field label="Departs">
          <Input type="datetime-local" value={f.departsAt} onChange={(e) => set("departsAt", e.target.value)} required />
        </Field>
        <Field label="Arrives (optional)">
          <Input type="datetime-local" value={f.arrivesAt} onChange={(e) => set("arrivesAt", e.target.value)} />
        </Field>
        <Field label="Bus type">
          <Input value={f.busType} onChange={(e) => set("busType", e.target.value)} placeholder="e.g. VIP coach, Sprinter" />
        </Field>
        <Field label="Seats">
          <Input inputMode="numeric" value={f.seatsTotal} onChange={(e) => set("seatsTotal", e.target.value)} required />
        </Field>
        <Field label="Price per seat (GH₵)">
          <Input inputMode="decimal" value={f.price} onChange={(e) => set("price", e.target.value)} required />
        </Field>
        {trip && (
          <Field label="Status">
            <Select value={f.status} onChange={(v) => set("status", v)} options={[["scheduled", "Scheduled"], ["completed", "Completed"], ["cancelled", "Cancelled"]]} />
          </Field>
        )}
        <Field label="Amenities" className="sm:col-span-2">
          <TagInput value={f.amenities} onChange={(v) => set("amenities", v)} max={10} suggestions={["A/C", "Wi-Fi", "USB charging", "Reclining seats", "Snacks", "TV"]} />
        </Field>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={save.isPending}>
            Save trip
          </Button>
        </div>
      </form>
    </EditorDialog>
  );
}

// ---- Bus rentals ----------------------------------------------------------------------------

export function RentalEditor({
  rental,
  open,
  onClose,
  onSaved,
  endpoint = "/seller/rentals",
  moderator = false,
}: {
  rental: Row | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** Where it saves: the operator's own rentals, or /admin/tickets/rentals for moderators. */
  endpoint?: string;
  /** Admin editing: "Blocked" is a status option and is kept as it is. */
  moderator?: boolean;
}) {
  const [f, setF] = useState(() => ({
    title: rental?.title ?? "",
    vehicleType: rental?.vehicle_type ?? "",
    capacity: String(rental?.capacity ?? ""),
    pricePerDay: String(rental?.price_per_day ?? ""),
    description: rental?.description ?? "",
    images: (rental?.images ?? []) as Array<string>,
    features: (rental?.features ?? []) as Array<string>,
    status: rental?.status === "blocked" && !moderator ? "hidden" : (rental?.status ?? "active"),
  }));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = useSave(endpoint, rental?.id, () => (onSaved(), onClose()), "Rental saved");
  return (
    <EditorDialog open={open} onClose={onClose} title={rental ? "Edit rental" : "New bus rental"}>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate({ ...f, capacity: Number(f.capacity), pricePerDay: Number(f.pricePerDay) });
        }}
      >
        <Field label="Photos" className="sm:col-span-2">
          <GalleryUpload value={f.images} onChange={(v) => set("images", v)} folder="transport" />
        </Field>
        <Field label="Title" className="sm:col-span-2">
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 50-seater Yutong coach" required />
        </Field>
        <Field label="Vehicle type">
          <Input value={f.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} required />
        </Field>
        <Field label="Seats">
          <Input inputMode="numeric" value={f.capacity} onChange={(e) => set("capacity", e.target.value)} required />
        </Field>
        <Field label="Price per day (GH₵)">
          <Input inputMode="decimal" value={f.pricePerDay} onChange={(e) => set("pricePerDay", e.target.value)} required />
        </Field>
        <Field label="Visibility">
          <Select
            value={f.status}
            onChange={(v) => set("status", v)}
            options={[["active", "Listed"], ["hidden", "Hidden"], ...(moderator ? [["blocked", "Blocked"] as [string, string]] : [])]}
          />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <Textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Features" className="sm:col-span-2">
          <TagInput value={f.features} onChange={(v) => set("features", v)} suggestions={["A/C", "Driver included", "Fuel included", "PA system", "Luggage hold"]} />
        </Field>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={save.isPending}>
            Save rental
          </Button>
        </div>
      </form>
    </EditorDialog>
  );
}

// ---- Exhibitions ------------------------------------------------------------------------------

export function ExhibitionEditor({ exhibition, open, onClose, onSaved }: { exhibition: Row | null; open: boolean; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState(() => ({
    title: exhibition?.title ?? "",
    theme: exhibition?.theme ?? "",
    description: exhibition?.description ?? "",
    coverUrl: exhibition?.cover_url ?? null,
    venue: exhibition?.venue ?? "",
    city: exhibition?.city ?? "",
    startsAt: toInputDateTime(exhibition?.starts_at),
    endsAt: toInputDateTime(exhibition?.ends_at),
    boothPrice: String(exhibition?.booth_price ?? ""),
    boothsTotal: String(exhibition?.booths_total ?? "20"),
    services: (exhibition?.services ?? []) as Array<string>,
  }));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = useSave("/seller/exhibitions", exhibition?.id, () => (onSaved(), onClose()), exhibition ? "Saved" : "Exhibition submitted for review");
  return (
    <EditorDialog open={open} onClose={onClose} title={exhibition ? "Edit exhibition" : "New exhibition"} wide>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate({ ...f, boothPrice: Number(f.boothPrice) || 0, boothsTotal: Number(f.boothsTotal) });
        }}
      >
        <Field label="Cover image" className="sm:col-span-2">
          <ImageUpload value={f.coverUrl} onChange={(v) => set("coverUrl", v)} folder="exhibitions" aspect="aspect-[3/1]" />
        </Field>
        <Field label="Title">
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
        <Field label="Theme">
          <Input value={f.theme} onChange={(e) => set("theme", e.target.value)} />
        </Field>
        <Field label="Venue">
          <Input value={f.venue} onChange={(e) => set("venue", e.target.value)} required />
        </Field>
        <Field label="City">
          <Input value={f.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Starts">
          <Input type="datetime-local" value={f.startsAt} onChange={(e) => set("startsAt", e.target.value)} required />
        </Field>
        <Field label="Ends">
          <Input type="datetime-local" value={f.endsAt} onChange={(e) => set("endsAt", e.target.value)} required />
        </Field>
        <Field label="Booth price (GH₵)">
          <Input inputMode="decimal" value={f.boothPrice} onChange={(e) => set("boothPrice", e.target.value)} />
        </Field>
        <Field label="Number of booths">
          <Input inputMode="numeric" value={f.boothsTotal} onChange={(e) => set("boothsTotal", e.target.value)} required />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <Textarea rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Exhibitor services" className="sm:col-span-2">
          <TagInput value={f.services} onChange={(v) => set("services", v)} suggestions={["Power socket", "Table & chairs", "Branding", "Wi-Fi", "Security", "Extra badge"]} />
        </Field>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={save.isPending}>
            Save exhibition
          </Button>
        </div>
      </form>
    </EditorDialog>
  );
}
