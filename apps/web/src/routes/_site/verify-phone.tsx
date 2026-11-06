import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { pageSeo } from "#/lib/seo";
import { AuthShell } from "#/components/auth/auth-shell";
import { PhoneVerify } from "#/components/auth/phone-verify";

const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/");

export const Route = createFileRoute("/_site/verify-phone")({
  validateSearch: z.object({ next: z.string().optional().catch(undefined) }),
  beforeLoad: ({ context }) => {
    if (!context.member) throw redirect({ to: "/login" });
  },
  head: () => pageSeo({ title: "Confirm your phone number | Capevars", description: "Confirm your phone number to finish joining Capevars.", path: "/verify-phone", noindex: true }),
  component: VerifyPhonePage,
});

function VerifyPhonePage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const carryOn = () => void navigate({ href: safeNext(next) });
  return (
    <AuthShell title="Confirm your phone number" subtitle="You can then sign in and reset your password with it too.">
      <PhoneVerify
        onDone={() => {
          toast.success("Your number is confirmed");
          carryOn();
        }}
        onSkip={carryOn}
      />
    </AuthShell>
  );
}
