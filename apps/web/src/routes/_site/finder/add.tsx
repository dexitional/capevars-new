import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { Container } from "#/components/site/kit";
import { ListingForm, emptyListing, listingPayload } from "#/components/finder/listing-form";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/finder/add")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Add a listing | The Finder" }] }),
  component: AddListing,
});

function AddListing() {
  const navigate = useNavigate();
  const [value, setValue] = useState(emptyListing());
  const save = useMutation({
    mutationFn: () => api.post<{ slug: string }>("/finder/listings", listingPayload(value)),
    onSuccess: () => {
      toast.success("Submitted! It goes live after a quick review.");
      void navigate({ to: "/finder/mine" });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Container className="max-w-4xl py-8">
      <h1 className="text-2xl font-black text-primary">Add to The Finder</h1>
      <p className="mt-1 text-sm text-muted-foreground">Listings are free and reviewed before they appear in search.</p>
      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <ListingForm value={value} onChange={setValue} />
        <Button type="submit" size="lg" className="mt-6" disabled={save.isPending}>
          {save.isPending && <Loader2 className="animate-spin" />} Submit listing
        </Button>
      </form>
    </Container>
  );
}
