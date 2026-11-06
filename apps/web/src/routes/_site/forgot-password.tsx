import { useState } from "react";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Button } from "#/components/ui/button";
import { AuthShell } from "#/components/auth/auth-shell";

export const Route = createFileRoute("/_site/forgot-password")({
  beforeLoad: ({ context }) => {
    if (context.member) throw redirect({ to: "/account/security" });
  },
  head: () => ({ meta: [{ title: "Reset your password | Capevars" }, { name: "robots", content: "noindex" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const send = useMutation({ mutationFn: () => api.post("/auth/password/forgot", { identifier }) });
  return (
    <AuthShell title="Reset your password" subtitle="Enter the email or phone number on your account and we'll send you a reset link.">
      {send.isSuccess ? (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="size-4 text-emerald-600" /> Check your messages
          </p>
          <p className="mt-1.5">
            If <strong>{identifier.trim()}</strong> is on a Capevars account, a reset link is on its way. It works once and expires in 30 minutes.
          </p>
          <p className="mt-1.5 text-xs">Joined with Google? You don't have a password to reset, so continue with Google instead.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="identifier">Email or phone number</Label>
            <Input id="identifier" autoComplete="username" className="h-11" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com or 024 123 4567" required />
          </div>
          {send.isError && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{send.error.message}</p>}
          <Button type="submit" className="h-11 w-full rounded-xl" disabled={send.isPending}>
            {send.isPending && <Loader2 className="animate-spin" />} Send reset link
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
