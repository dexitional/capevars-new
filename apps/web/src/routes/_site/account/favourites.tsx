import { Link, createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useFavourites } from "#/hooks/useFavourites";
import { EmptyState, FavouriteButton, Img, Loading } from "#/components/site/kit";

export const Route = createFileRoute("/_site/account/favourites")({ component: FavouritesPage });

const TYPE_LABEL: Record<string, string> = { listing: "Finder", product: "Product", job: "Job", course: "Course", event: "Event", store: "Store" };

function FavouritesPage() {
  const { data, isLoading } = useFavourites();
  if (isLoading) return <Loading />;
  if (!data?.items.length) {
    return <EmptyState icon={Heart} title="No favourites yet" text="Tap the heart on hostels, hotels, products, courses and more to save them here." />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((f) => (
        <Link key={`${f.type}:${f.id}`} to={f.link} className="card-hover relative flex gap-3 rounded-2xl border bg-white p-3">
          <Img src={f.image} className="size-20 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold tracking-wider text-brand-amber uppercase">{TYPE_LABEL[f.type]}</span>
            <p className="line-clamp-2 font-semibold text-primary">{f.title}</p>
            {f.subtitle && <p className="truncate text-xs text-muted-foreground capitalize">{f.subtitle}</p>}
          </div>
          <FavouriteButton type={f.type} id={f.id} className="absolute top-2 right-2 size-8 border" />
        </Link>
      ))}
    </div>
  );
}
