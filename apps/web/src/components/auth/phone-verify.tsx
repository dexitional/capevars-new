// Confirming a phone number: enter it, then the code texted to it. Used straight
// after joining and on the security page.
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { useSession } from "#/hooks/useMember";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Button } from "#/components/ui/button";

type PhoneStatus = { loginPhone: string | null; suggested: string | null; passwordNeeded: boolean; pending: { phone: string; retryAfter: number } | null };
const statusKey = ["me-phone"];

// `onSkip` offers a way to carry on only once they've had a fair chance at the text, or it has failed.
export function PhoneVerify({ onDone, onSkip }: { onDone: () => void; onSkip?: () => void }) {
  const queryClient = useQueryClient();
  const { refresh } = useSession();
  const { data } = useQuery({ queryKey: statusKey, queryFn: () => api.get<PhoneStatus>("/me/phone"), staleTime: 0 });
  const [phone, setPhone] = useState<string | null>(null);
  const [currentPassword, setCurrent] = useState("");
  const [code, setCode] = useState("");
  const [editing, setEditing] = useState(false);
  const [wait, setWait] = useState(0);
  const [failed, setFailed] = useState(false);
  const pending = data?.pending ?? null;

  useEffect(() => setWait(pending?.retryAfter ?? 0), [pending?.retryAfter, pending?.phone]);
  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const number = phone ?? (data?.suggested ? `+${data.suggested}` : "");
  const send = useMutation({
    mutationFn: (to: string) => api.post("/me/phone/code", { phone: to, currentPassword: currentPassword || undefined }),
    onSuccess: async () => {
      setEditing(false);
      setCode("");
      setCurrent("");
      setFailed(false);
    },
    onError: () => setFailed(true),
    // A text that failed cancels its code, so the page goes back to asking for the number.
    onSettled: () => queryClient.invalidateQueries({ queryKey: statusKey }),
  });
  const verify = useMutation({
    mutationFn: () => api.post("/me/phone/verify", { code }),
    onSuccess: async () => {
      await refresh();
      await queryClient.invalidateQueries({ queryKey: statusKey });
      onDone();
    },
  });
  if (!data) return <Loader2 className="size-5 animate-spin text-muted-foreground" />;

  const later = onSkip && (failed || (pending && wait === 0)) && (
    <Button type="button" variant="ghost" className="w-full" onClick={onSkip}>
      Do this later
    </Button>
  );

  if (!pending || editing) {
    return (
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          verify.reset();
          send.mutate(number.trim());
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="verify-phone">Phone number</Label>
          <Input id="verify-phone" type="tel" autoComplete="tel" className="h-11" value={number} onChange={(e) => setPhone(e.target.value)} placeholder="024 123 4567" required />
        </div>
        {data.passwordNeeded && (
          <div className="space-y-1.5">
            <Label htmlFor="verify-password">Current password</Label>
            <Input id="verify-password" type="password" autoComplete="current-password" className="h-11" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} required />
            <p className="text-xs text-muted-foreground">Needed because this number can reset your account.</p>
          </div>
        )}
        {send.error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{send.error.message}</p>}
        <Button type="submit" className="h-11 w-full rounded-xl" disabled={send.isPending}>
          {send.isPending && <Loader2 className="animate-spin" />} Text me a code
        </Button>
        {pending && (
          <Button type="button" variant="ghost" className="w-full" onClick={() => setEditing(false)}>
            Back to entering the code
          </Button>
        )}
        {later}
      </form>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        send.reset();
        verify.mutate();
      }}
    >
      <p className="text-sm text-muted-foreground">
        We texted a 6-digit code to <strong>+{pending.phone}</strong>. It can take a minute to arrive.
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="verify-code">Code</Label>
        <Input
          id="verify-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className="h-11 font-mono tracking-widest"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          required
        />
      </div>
      {(verify.error ?? send.error) && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{(verify.error ?? send.error)!.message}</p>}
      <Button type="submit" className="h-11 w-full rounded-xl" disabled={verify.isPending || code.length !== 6}>
        {verify.isPending && <Loader2 className="animate-spin" />} Confirm number
      </Button>
      <div className="flex flex-wrap justify-center gap-2">
        {data.passwordNeeded ? (
          <Button type="button" variant="ghost" size="sm" disabled={wait > 0} onClick={() => setEditing(true)}>
            {wait > 0 ? `Send again in ${wait}s` : "Send again"}
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" disabled={wait > 0 || send.isPending} onClick={() => send.mutate(pending.phone)}>
            {wait > 0 ? `Send again in ${wait}s` : "Send again"}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setPhone(`+${pending.phone}`);
            setEditing(true);
          }}
        >
          Use a different number
        </Button>
      </div>
      {later}
    </form>
  );
}
