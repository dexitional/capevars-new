import { useEffect, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { Container, Loading } from "#/components/site/kit";
import { ListingForm, emptyListing, listingPayload } from "#/components/finder/listing-form";
import type { ListingValues } from "#/components/finder/listing-form";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/finder/edit/$id")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  component: EditListing,
});

function EditListing() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["listing-edit", id], queryFn: () => api.get<{ listing: Record<string, any> }>(`/finder/listings/${id}/edit`) });
  const [value, setValue] = useState<ListingValues | null>(null);
  useEffect(() => {
    if (data && !value) setValue(emptyListing(data.listing));
  }, [data, value]);
  const save = useMutation({
    mutationFn: () => api.patch(`/finder/listings/${id}`, listingPayload(value!)),
    onSuccess: () => {
      toast.success("Saved");
      void navigate({ to: "/finder/l/$slug", params: { slug: data!.listing.slug } });
    },
    onError: (e) => toast.error(e.message),
  });
  if (!value) return <Loading />;
  return (
    <Container className="max-w-4xl py-8">
      <h1 className="mb-6 text-2xl font-black text-primary">Edit {data?.listing.name}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <ListingForm value={value} onChange={setValue} />
        <Button type="submit" size="lg" className="mt-6" disabled={save.isPending}>
          Save changes
        </Button>
      </form>
    </Container>
  );
}
