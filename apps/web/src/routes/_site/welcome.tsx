import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { MEMBER_TYPES } from "#/lib/labels";
import { useMember, useSession } from "#/hooks/useMember";
import { Avatar, ImageUpload } from "#/components/site/kit";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Button } from "#/components/ui/button";

const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/");

export const Route = createFileRoute("/_site/welcome")({
  validateSearch: z.object({ next: z.string().optional().catch(undefined) }),
  beforeLoad: ({ context }) => {
    if (!context.member) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Welcome to Capevars" }] }),
  component: WelcomePage,
});

// One quick step after joining: how you appear to others.
function WelcomePage() {
  const member = useMember()!;
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const { refresh } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(member.avatarUrl);
  const [headline, setHeadline] = useState("");
  const [institution, setInstitution] = useState("");
  const [memberType, setMemberType] = useState<string>(member.memberType);
  const save = useMutation({
    mutationFn: () => api.patch("/me/profile", { avatarUrl, headline, institution, memberType }),
    onSuccess: async () => {
      await refresh();
      await navigate({ href: safeNext(next) });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-bold tracking-wider text-brand-amber uppercase">Welcome aboard</p>
        <h1 className="mt-1 text-3xl font-black text-primary">Hi {member.fullName.split(" ")[0]} 👋</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add a few details so friends, groups and sellers recognise you. You can change these anytime.</p>
        <div className="mt-8 flex items-center gap-5">
          <div className="w-24">
            <ImageUpload value={avatarUrl} onChange={setAvatarUrl} folder="avatars" aspect="aspect-square" round label="Photo" />
          </div>
          <div className="text-sm text-muted-foreground">
            {avatarUrl ? <Avatar src={avatarUrl} name={member.fullName} size="sm" className="mb-1" /> : null}A clear photo of your face helps people find you.
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Computer Science student · UCC" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="institution">School / organisation</Label>
            <Input id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. University of Cape Coast" />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">I am a…</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(MEMBER_TYPES).map(([k, v]) => (
                <button key={k} type="button" onClick={() => setMemberType(k)} className={cn("rounded-xl border px-3 py-2 text-sm font-medium", memberType === k ? "border-primary bg-primary text-white" : "hover:bg-muted")}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => void navigate({ href: safeNext(next) })}>
            Skip for now
          </Button>
          <Button className="flex-1" disabled={save.isPending} onClick={() => save.mutate()}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
