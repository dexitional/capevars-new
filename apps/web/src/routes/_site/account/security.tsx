import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { useMember, useSession } from "#/hooks/useMember";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Field } from "#/components/admin/ui";

export const Route = createFileRoute("/_site/account/security")({ component: SecurityPage });

function SecurityPage() {
  const member = useMember()!;
  const { refresh } = useSession();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const save = useMutation({
    mutationFn: () => api.post("/me/password", { currentPassword, newPassword }),
    onSuccess: async () => {
      toast.success(member.hasPassword ? "Password changed" : "Password set — you can now also sign in with email");
      setCurrent("");
      setNew("");
      await refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="max-w-lg rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-bold text-primary">{member.hasPassword ? "Change password" : "Set a password"}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as <strong>{member.email}</strong>.{" "}
        {member.hasPassword ? "" : "You joined with Google; add a password to also sign in with your email."}
      </p>
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        {member.hasPassword && (
          <Field label="Current password">
            <Input type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} required />
          </Field>
        )}
        <Field label="New password" hint="At least 8 characters.">
          <Input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNew(e.target.value)} minLength={8} required />
        </Field>
        <Button type="submit" disabled={save.isPending}>
          Save password
        </Button>
      </form>
    </div>
  );
}
