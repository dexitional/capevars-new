import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { useSession } from "#/hooks/useMember";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Button } from "#/components/ui/button";
import { AuthShell, Divider, GoogleButton, OAUTH_ERRORS } from "#/components/auth/auth-shell";

const search = z.object({ next: z.string().optional().catch(undefined), error: z.string().optional().catch(undefined) });
const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/");

export const Route = createFileRoute("/_site/login")({
  validateSearch: search,
  beforeLoad: ({ context, search: s }) => {
    if (context.member) throw redirect({ href: safeNext(s.next) });
  },
  head: () => ({ meta: [{ title: "Sign in | Capevars" }] }),
  component: LoginPage,
});

const schema = z.object({ email: z.string().trim().email("Enter a valid email"), password: z.string().min(1, "Enter your password") });
type Values = z.infer<typeof schema>;

function LoginPage() {
  const { next, error } = Route.useSearch();
  const navigate = useNavigate();
  const { refresh } = useSession();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });
  const login = useMutation({
    mutationFn: (v: Values) => api.post("/auth/login", v),
    onSuccess: async () => {
      await refresh();
      await navigate({ href: safeNext(next) });
    },
    onError: (e) => setError("root", { message: e.message }),
  });
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to Capevars.">
      {error && <p className="mb-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{OAUTH_ERRORS[error] ?? "Sign-in failed. Please try again."}</p>}
      <GoogleButton next={safeNext(next)} />
      <Divider text="or with email" />
      <form onSubmit={handleSubmit((v) => login.mutate(v))} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" className="h-11" {...register("email")} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" className="h-11" {...register("password")} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        {errors.root && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{errors.root.message}</p>}
        <Button type="submit" className="h-11 w-full rounded-xl" disabled={login.isPending}>
          {login.isPending && <Loader2 className="animate-spin" />} Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Capevars?{" "}
        <Link to="/signup" search={{ next }} className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
