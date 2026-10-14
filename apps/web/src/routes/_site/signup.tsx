import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { MEMBER_TYPES } from "#/lib/labels";
import { useSession } from "#/hooks/useMember";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Button } from "#/components/ui/button";
import { AuthShell, Divider, GoogleButton } from "#/components/auth/auth-shell";

const search = z.object({ next: z.string().optional().catch(undefined) });
const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/");

export const Route = createFileRoute("/_site/signup")({
  validateSearch: search,
  beforeLoad: ({ context, search: s }) => {
    if (context.member) throw redirect({ href: safeNext(s.next) });
  },
  head: () => ({ meta: [{ title: "Join Capevars" }] }),
  component: SignupPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
  memberType: z.enum(["public", "student", "staff", "alumni"]),
});
type Values = z.infer<typeof schema>;

function SignupPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const { refresh } = useSession();
  const { register, handleSubmit, setError, watch, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { memberType: "student" },
  });
  const memberType = watch("memberType");
  const signup = useMutation({
    mutationFn: (v: Values) => api.post("/auth/register", v),
    onSuccess: async () => {
      await refresh();
      await navigate({ to: "/welcome", search: { next: safeNext(next) } });
    },
    onError: (e) => setError("root", { message: e.message }),
  });
  return (
    <AuthShell title="Create your account" subtitle="Free, and it works across every Capevars platform.">
      <GoogleButton next={safeNext(next)} label="Sign up with Google" />
      <Divider text="or with email" />
      <form onSubmit={handleSubmit((v) => signup.mutate(v))} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" autoComplete="name" className="h-11" {...register("fullName")} aria-invalid={Boolean(errors.fullName)} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" className="h-11" {...register("email")} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" className="h-11" {...register("password")} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">I am a…</legend>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(MEMBER_TYPES) as Array<Values["memberType"]>).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setValue("memberType", t)}
                className={cn("rounded-xl border px-3 py-2 text-sm font-medium", memberType === t ? "border-primary bg-primary text-white" : "hover:bg-muted")}
              >
                {t === "public" ? "Member of public" : MEMBER_TYPES[t]}
              </button>
            ))}
          </div>
        </fieldset>
        {errors.root && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{errors.root.message}</p>}
        <Button type="submit" className="h-11 w-full rounded-xl" disabled={signup.isPending}>
          {signup.isPending && <Loader2 className="animate-spin" />} Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" search={{ next }} className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
