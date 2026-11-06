import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Button } from "#/components/ui/button";
import { AuthShell } from "#/components/auth/auth-shell";

export const Route = createFileRoute("/_site/reset-password")({
  validateSearch: z.object({ token: z.string().optional().catch(undefined) }),
  // The address holds the reset token, so it mustn't reach other sites or search engines.
  head: () => ({ meta: [{ title: "Choose a new password | Capevars" }, { name: "robots", content: "noindex" }, { name: "referrer", content: "no-referrer" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const mismatch = again.length > 0 && password !== again;
  const reset = useMutation({ mutationFn: () => api.post("/auth/password/reset", { token, newPassword: password }) });
  if (reset.isSuccess)
    return (
      <AuthShell title="Password changed" subtitle="You can now sign in with your new password.">
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-950">
          <CheckCircle2 className="size-4 text-emerald-600" /> Any other devices have been signed out.
        </p>
        <Button asChild className="mt-4 h-11 w-full rounded-xl">
          <Link to="/login">Sign in</Link>
        </Button>
      </AuthShell>
    );
  if (!token)
    return (
      <AuthShell title="This link isn't complete" subtitle="Open the full link from your message, or ask for a new one.">
        <Button asChild className="h-11 w-full rounded-xl">
          <Link to="/forgot-password">Get a new link</Link>
        </Button>
      </AuthShell>
    );
  return (
    <AuthShell title="Choose a new password" subtitle="Use at least 8 characters.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (password === again) reset.mutate();
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" autoComplete="new-password" className="h-11" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="again">Repeat it</Label>
          <Input id="again" type="password" autoComplete="new-password" className="h-11" value={again} onChange={(e) => setAgain(e.target.value)} aria-invalid={mismatch} required />
          {mismatch && <p className="text-xs text-destructive">These don't match yet.</p>}
        </div>
        {reset.isError && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {reset.error.message}{" "}
            <Link to="/forgot-password" className="font-semibold underline">
              Get a new link
            </Link>
          </p>
        )}
        <Button type="submit" className="h-11 w-full rounded-xl" disabled={reset.isPending || mismatch}>
          {reset.isPending && <Loader2 className="animate-spin" />} Save new password
        </Button>
      </form>
    </AuthShell>
  );
}
