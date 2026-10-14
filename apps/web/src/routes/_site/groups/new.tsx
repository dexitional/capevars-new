import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { Container } from "#/components/site/kit";
import { GroupForm, groupValues } from "#/components/groups/group-form";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/groups/new")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Create a group | Capevars" }] }),
  component: NewGroup,
});

function NewGroup() {
  const navigate = useNavigate();
  const [value, setValue] = useState(groupValues());
  const save = useMutation({
    mutationFn: () => api.post<{ slug: string }>("/groups", value),
    onSuccess: (r) => {
      toast.success("Group created! It goes live once a moderator approves it.");
      void navigate({ to: "/groups/$slug", params: { slug: r.slug } });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Container className="max-w-3xl py-8">
      <h1 className="text-2xl font-black text-primary">Create a group</h1>
      <p className="mt-1 text-sm text-muted-foreground">New groups are reviewed by Capevars moderators before they appear publicly. You'll be the owner.</p>
      <form
        className="mt-6 rounded-2xl border bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <GroupForm value={value} onChange={setValue} />
        <Button type="submit" size="lg" className="mt-6" disabled={save.isPending}>
          {save.isPending && <Loader2 className="animate-spin" />} Create group
        </Button>
      </form>
    </Container>
  );
}
