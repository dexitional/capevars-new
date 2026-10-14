import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { MEMBER_TYPES } from "#/lib/labels";
import { useSession } from "#/hooks/useMember";
import { ImageUpload, Loading } from "#/components/site/kit";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";
import { Field, Switch } from "#/components/admin/ui";

export const Route = createFileRoute("/_site/account/")({ component: ProfileSettings });

type Profile = Record<string, any>;

function ProfileSettings() {
  const { data } = useQuery({ queryKey: ["my-profile"], queryFn: () => api.get<{ profile: Profile }>("/me/profile") });
  if (!data) return <Loading />;
  return <ProfileForm profile={data.profile} />;
}

function ProfileForm({ profile }: { profile: Profile }) {
  const { refresh } = useSession();
  const [form, setForm] = useState({
    fullName: profile.full_name ?? "",
    username: profile.username ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    phone: profile.phone ?? "",
    website: profile.website ?? "",
    institution: profile.institution ?? "",
    memberType: profile.member_type ?? "public",
    avatarUrl: profile.avatar_url as string | null,
    coverUrl: profile.cover_url as string | null,
    skills: (profile.skills ?? []) as Array<string>,
    openToWork: profile.open_to_work === 1,
  });
  const [skill, setSkill] = useState("");
  useEffect(() => setSkill(""), [form.skills.length]);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const save = useMutation({
    mutationFn: () => api.patch("/me/profile", form),
    onSuccess: async () => {
      toast.success("Profile saved");
      await refresh();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
      className="grid gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5 rounded-2xl border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
          </Field>
          <Field label="Username" hint="Your profile lives at /u/username">
            <Input value={form.username} onChange={(e) => set("username", e.target.value.toLowerCase())} />
          </Field>
        </div>
        <Field label="Headline">
          <Input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="e.g. Final-year Nursing student · UCC" />
        </Field>
        <Field label="About you">
          <Textarea rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="I am a">
            <select value={form.memberType} onChange={(e) => set("memberType", e.target.value)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
              {Object.entries(MEMBER_TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="School / organisation">
            <Input value={form.institution} onChange={(e) => set("institution", e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Website" className="sm:col-span-2">
            <Input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
          </Field>
        </div>
        <Field label="Skills" hint="Shown on your profile and in Job Circle's talent search.">
          <div className="flex flex-wrap gap-1.5 rounded-md border border-input p-2">
            {form.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                {s}
                <button type="button" onClick={() => set("skills", form.skills.filter((x) => x !== s))} aria-label={`Remove ${s}`}>
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === ",") && skill.trim()) {
                  e.preventDefault();
                  if (!form.skills.includes(skill.trim())) set("skills", [...form.skills, skill.trim()].slice(0, 30));
                }
              }}
              placeholder="Type a skill and press Enter"
              className="min-w-40 flex-1 bg-transparent px-1 text-sm outline-none"
            />
          </div>
        </Field>
        <Switch checked={form.openToWork} onChange={(v) => set("openToWork", v)} label="Open to work" description="Employers can find you in Job Circle → Hire talent." />
        <Button type="submit" disabled={save.isPending}>
          {save.isPending && <Loader2 className="animate-spin" />} Save profile
        </Button>
      </div>
      <div className="space-y-5">
        <div className="rounded-2xl border bg-white p-5">
          <p className="mb-3 text-sm font-semibold">Profile photo</p>
          <div className="mx-auto w-36">
            <ImageUpload value={form.avatarUrl} onChange={(v) => set("avatarUrl", v)} folder="avatars" aspect="aspect-square" round />
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <p className="mb-3 text-sm font-semibold">Cover image</p>
          <ImageUpload value={form.coverUrl} onChange={(v) => set("coverUrl", v)} folder="covers" aspect="aspect-[3/1]" />
        </div>
      </div>
    </form>
  );
}
