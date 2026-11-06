import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { useMember, useSession } from "#/hooks/useMember";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Field } from "#/components/admin/ui";
import { PhoneVerify } from "#/components/auth/phone-verify";

export const Route = createFileRoute("/_site/account/security")({ component: SecurityPage });

function SignInPhone() {
  const member = useMember()!;
  const { refresh } = useSession();
  const [changing, setChanging] = useState(false);
  const [currentPassword, setCurrent] = useState("");
  const remove = useMutation({
    mutationFn: () => api.post("/me/login-phone/remove", { currentPassword: currentPassword || undefined }),
    onSuccess: async () => {
      toast.success("Phone sign-in removed");
      setCurrent("");
      await refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="max-w-lg rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-bold text-primary">Sign in with your phone</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {member.loginPhone ? (
          <>
            You can sign in and reset your password with <strong>+{member.loginPhone}</strong>.
          </>
        ) : (
          "Confirm a number to sign in and reset your password with it, as well as your email."
        )}
      </p>
      {member.loginPhone && !changing ? (
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            remove.mutate();
          }}
        >
          {member.hasPassword && (
            <Field label="Current password" hint="Needed to remove this number.">
              <Input type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} />
            </Field>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setChanging(true)}>
              Change number
            </Button>
            <Button type="submit" variant="ghost" disabled={remove.isPending || (member.hasPassword && !currentPassword)}>
              Remove it
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-5">
          <PhoneVerify
            onDone={() => {
              setChanging(false);
              toast.success("You can now sign in with this number");
            }}
          />
          {changing && (
            <Button type="button" variant="ghost" className="mt-2" onClick={() => setChanging(false)}>
              Keep my current number
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

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
    <div className="space-y-6">
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
      <SignInPhone />
    </div>
  );
}
