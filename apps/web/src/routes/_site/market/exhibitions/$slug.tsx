import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2, MapPin, Store } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { formatEventRange } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { useRequireMember } from "#/hooks/useMember";
import { Container, Img, TextBlock } from "#/components/site/kit";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const exQuery = (slug: string) => ({ queryKey: ["exhibition", slug], queryFn: () => api.get<{ exhibition: Row; exhibitors: Array<Row> }>(`/exhibitions/${slug}`) });

export const Route = createFileRoute("/_site/market/exhibitions/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(exQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.exhibition.title} | Capevars Exhibitions` }] : [] }),
  component: ExhibitionPage,
});

function ExhibitionPage() {
  const { slug } = Route.useParams();
  const { data } = useQuery(exQuery(slug));
  const requireMember = useRequireMember();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ businessName: "", contactPhone: "", booths: 1, products: "", services: [] as Array<string> });
  const book = useMutation({
    mutationFn: () => api.post(`/exhibitions/${data!.exhibition.id}/book`, form),
    onSuccess: () => setDone(true),
    onError: (e) => toast.error(e.message),
  });
  if (!data) return null;
  const x = data.exhibition;
  const left = x.booths_total - x.booths_taken;
  const upcoming = new Date(`${x.starts_at.replace(" ", "T")}Z`).getTime() > Date.now();
  return (
    <div className="pb-16">
      <div className="relative bg-primary">
        <Img src={x.cover_url} className="aspect-[3/1] max-h-[400px] w-full opacity-70" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-8 text-white">
          <h1 className="text-3xl font-black sm:text-5xl">{x.title}</h1>
          {x.theme && <p className="mt-2 text-lg text-brand-cream italic">“{x.theme}”</p>}
          <p className="mt-3 flex flex-wrap gap-4 text-white/80">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" /> {formatEventRange(x.starts_at, x.ends_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {x.venue}
              {x.city ? `, ${x.city}` : ""}
            </span>
          </p>
        </Container>
      </div>
      <Container className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-black text-primary">About</h2>
            <TextBlock text={x.description} className="mt-3 text-sm leading-relaxed" />
            {x.services?.length > 0 && (
              <>
                <h3 className="mt-6 font-bold text-primary">Exhibitor services</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {x.services.map((s: string) => (
                    <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>
          {data.exhibitors.length > 0 && (
            <section className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-black text-primary">Exhibitors ({data.exhibitors.length})</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {data.exhibitors.map((e) => (
                  <li key={e.business_name} className="flex gap-3 rounded-xl bg-muted p-3">
                    <Store className="size-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-semibold">{e.business_name}</span>
                      {e.products && <span className="line-clamp-2 block text-xs text-muted-foreground">{e.products}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {x.organizer && (
            <p className="text-sm text-muted-foreground">
              Organised by{" "}
              <Link to="/market/store/$slug" params={{ slug: x.organizer_slug }} className="font-semibold text-primary hover:underline">
                {x.organizer}
              </Link>
              {x.organizer_phone ? ` · ${x.organizer_phone}` : ""}
            </p>
          )}
        </div>
        <aside className="h-fit rounded-2xl border bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-black text-primary">Book a booth</h2>
          <p className="mt-1 text-sm">
            <strong className="text-lg text-primary">{formatMoney(x.booth_price, { free: "Free" })}</strong> per booth · {left} of {x.booths_total} left
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-brand-gold" style={{ width: `${(x.booths_taken / Math.max(1, x.booths_total)) * 100}%` }} />
          </div>
          {done ? (
            <div className="mt-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-success" />
              <p className="mt-3 font-bold text-primary">Request sent!</p>
              <p className="text-sm text-muted-foreground">The organiser will approve your booth and share payment details.</p>
            </div>
          ) : x.status !== "published" || !upcoming || left <= 0 ? (
            <p className="mt-4 rounded-xl bg-muted p-3 text-center text-sm text-muted-foreground">Booth booking is closed.</p>
          ) : (
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                requireMember(() => book.mutate());
              }}
            >
              <Field label="Business name">
                <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
              </Field>
              <Field label="Phone">
                <Input type="tel" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} required />
              </Field>
              <Field label="Booths">
                <Input type="number" min={1} max={Math.min(20, left)} value={form.booths} onChange={(e) => setForm({ ...form, booths: Number(e.target.value) })} />
              </Field>
              <Field label="What will you exhibit?">
                <Textarea rows={3} value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} />
              </Field>
              {x.services?.length > 0 && (
                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium">Extra services</legend>
                  {x.services.map((s: string) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={form.services.includes(s)}
                        onChange={(e) => setForm({ ...form, services: e.target.checked ? [...form.services, s] : form.services.filter((v) => v !== s) })}
                      />
                      {s}
                    </label>
                  ))}
                </fieldset>
              )}
              <div className="flex justify-between border-t pt-3 text-sm">
                <span>Total</span>
                <strong className="text-primary">{formatMoney(Number(x.booth_price) * form.booths)}</strong>
              </div>
              <Button type="submit" className="w-full" disabled={book.isPending}>
                Request booth
              </Button>
            </form>
          )}
        </aside>
      </Container>
    </div>
  );
}
