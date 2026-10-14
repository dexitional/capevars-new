import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { Container } from "#/components/site/kit";
import { PageForm } from "#/components/social/page-form";

export const Route = createFileRoute("/_site/social/pages/new")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  component: NewPage,
});

function NewPage() {
  const navigate = useNavigate();
  const create = useMutation({
    mutationFn: (v: Record<string, unknown>) => api.post<{ slug: string }>("/social/pages", v),
    onSuccess: (r) => void navigate({ to: "/social/pages/$slug", params: { slug: r.slug } }),
    onError: (e) => toast.error(e.message),
  });
  return (
    <Container className="max-w-3xl py-8">
      <h1 className="mb-6 text-2xl font-black text-primary">Create a page</h1>
      <PageForm onSubmit={(v) => create.mutate(v)} pending={create.isPending} submitLabel="Create page" />
    </Container>
  );
}
