import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { MOMO_NETWORKS } from "#/lib/credits";
import type { MomoAccount, MomoNetwork } from "#/lib/credits";
import { SOCIAL_PLATFORMS } from "#/lib/settings";
import type { SettingsKey, SiteSettings } from "#/lib/settings";
import { canManage } from "#/lib/permissions";
import { AdminPageHeader, Field, Panel, Switch, errorToast } from "#/components/admin/ui";
import { ImageField } from "#/components/admin/media-fields";
import { TagInput } from "#/components/site/tag-input";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/admin/_admin/settings")({ component: SettingsPage });

const GROUPS: Array<[SettingsKey, string]> = [
  ["identity", "Identity & contact"],
  ["home", "Home page"],
  ["notice", "Notice bar"],
  ["socials", "Social links"],
  ["marketplace", "Marketplace"],
  ["finder", "The Finder"],
  ["learn", "OpenLearn"],
  ["leadgen", "LeadGen"],
];

function SettingsPage() {
  const { admin } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [group, setGroup] = useState<SettingsKey>("identity");
  const { data } = useQuery({ queryKey: ["admin-settings"], queryFn: () => api.get<{ settings: SiteSettings }>("/admin/settings") });
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  useEffect(() => {
    if (data && !draft) setDraft(data.settings);
  }, [data, draft]);
  const save = useMutation({
    mutationFn: () => api.put(`/admin/settings/${group}`, draft![group]),
    onSuccess: () => {
      toast.success("Settings saved");
      void queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: errorToast("Couldn't save settings."),
  });
  if (!draft) return null;
  const set = <K extends SettingsKey>(key: K, value: Partial<SiteSettings[K]>) => setDraft({ ...draft, [key]: { ...draft[key], ...value } });
  const editable = canManage(admin.role, "settings");
  const d = draft;
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Settings" description="Platform-wide content and rules for all six systems." />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {GROUPS.map(([k, label]) => (
            <button key={k} type="button" onClick={() => setGroup(k)} className={cn("shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium", group === k ? "bg-primary text-white" : "hover:bg-white")}>
              {label}
            </button>
          ))}
        </nav>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <fieldset disabled={!editable} className="space-y-6">
            {group === "identity" && (
              <Panel title="Identity & contact">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Platform name">
                    <Input value={d.identity.name} onChange={(e) => set("identity", { name: e.target.value })} />
                  </Field>
                  <Field label="Tagline">
                    <Input value={d.identity.tagline} onChange={(e) => set("identity", { tagline: e.target.value })} />
                  </Field>
                  <Field label="Description" className="sm:col-span-2" hint="Used in the footer and search engines.">
                    <Textarea rows={3} value={d.identity.description} onChange={(e) => set("identity", { description: e.target.value })} />
                  </Field>
                  <Field label="Support email">
                    <Input value={d.identity.supportEmail} onChange={(e) => set("identity", { supportEmail: e.target.value })} />
                  </Field>
                  <Field label="Support phone">
                    <Input value={d.identity.supportPhone} onChange={(e) => set("identity", { supportPhone: e.target.value })} />
                  </Field>
                  <Field label="Address" className="sm:col-span-2">
                    <Input value={d.identity.address} onChange={(e) => set("identity", { address: e.target.value })} />
                  </Field>
                </div>
              </Panel>
            )}
            {group === "home" && (
              <Panel title="Home page hero">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Eyebrow" className="sm:col-span-2">
                    <Input value={d.home.heroEyebrow} onChange={(e) => set("home", { heroEyebrow: e.target.value })} />
                  </Field>
                  <Field label="Headline">
                    <Input value={d.home.heroTitle} onChange={(e) => set("home", { heroTitle: e.target.value })} />
                  </Field>
                  <Field label="Highlighted words">
                    <Input value={d.home.heroHighlight} onChange={(e) => set("home", { heroHighlight: e.target.value })} />
                  </Field>
                  <Field label="Intro text" className="sm:col-span-2">
                    <Textarea rows={3} value={d.home.heroText} onChange={(e) => set("home", { heroText: e.target.value })} />
                  </Field>
                  <Field label="Search placeholder" className="sm:col-span-2">
                    <Input value={d.home.searchPlaceholder} onChange={(e) => set("home", { searchPlaceholder: e.target.value })} />
                  </Field>
                  <Field label="Trending searches" className="sm:col-span-2">
                    <TagInput value={d.home.trendingSearches} onChange={(v) => set("home", { trendingSearches: v })} max={10} />
                  </Field>
                  <ImageField label="Hero image (optional)" value={d.home.heroImageUrl} onChange={(url) => set("home", { heroImageUrl: url ?? "" })} folder="settings" className="sm:col-span-2" />
                </div>
              </Panel>
            )}
            {group === "notice" && (
              <Panel title="Notice bar" description="A one-line announcement above the header on every page.">
                <div className="space-y-4">
                  <Switch checked={d.notice.enabled} onChange={(v) => set("notice", { enabled: v })} label="Show the notice bar" />
                  <Field label="Text">
                    <Input value={d.notice.text} onChange={(e) => set("notice", { text: e.target.value })} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Link label">
                      <Input value={d.notice.linkLabel} onChange={(e) => set("notice", { linkLabel: e.target.value })} />
                    </Field>
                    <Field label="Link" hint="A path like /market or a full URL.">
                      <Input value={d.notice.linkUrl} onChange={(e) => set("notice", { linkUrl: e.target.value })} />
                    </Field>
                  </div>
                </div>
              </Panel>
            )}
            {group === "socials" && (
              <Panel title="Social links">
                <div className="grid gap-4 sm:grid-cols-2">
                  {SOCIAL_PLATFORMS.map((p) => (
                    <Field key={p} label={p === "x" ? "X (Twitter)" : p[0]!.toUpperCase() + p.slice(1)}>
                      <Input value={d.socials[p]} onChange={(e) => set("socials", { [p]: e.target.value })} placeholder="https://" />
                    </Field>
                  ))}
                </div>
              </Panel>
            )}
            {group === "marketplace" && (
              <Panel title="Marketplace">
                <div className="space-y-4">
                  <Field label="Currency code">
                    <Input value={d.marketplace.currency} onChange={(e) => set("marketplace", { currency: e.target.value })} className="w-32" />
                  </Field>
                  <Field label="Seller rules" hint="Shown when people apply to open a store.">
                    <Textarea rows={8} value={d.marketplace.sellerTerms} onChange={(e) => set("marketplace", { sellerTerms: e.target.value })} />
                  </Field>
                  <Field label="Default delivery note">
                    <Input value={d.marketplace.defaultDeliveryNote} onChange={(e) => set("marketplace", { defaultDeliveryNote: e.target.value })} />
                  </Field>
                </div>
              </Panel>
            )}
            {group === "finder" && (
              <Panel title="The Finder" description="Suggested cities and areas for listings and search.">
                <div className="space-y-4">
                  <Field label="Cities">
                    <TagInput value={d.finder.cities} onChange={(v) => set("finder", { cities: v })} max={40} />
                  </Field>
                  <Field label="Areas / neighbourhoods">
                    <TagInput value={d.finder.areas} onChange={(v) => set("finder", { areas: v })} max={80} />
                  </Field>
                </div>
              </Panel>
            )}
            {group === "learn" && (
              <Panel title="OpenLearn">
                <div className="space-y-4">
                  <Field label="Course creation guidelines" hint="One guideline per line. Shown to every instructor.">
                    <Textarea rows={12} value={d.learn.instructorGuidelines} onChange={(e) => set("learn", { instructorGuidelines: e.target.value })} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Minimum lessons to publish">
                      <Input type="number" min={1} value={d.learn.minLessons} onChange={(e) => set("learn", { minLessons: Number(e.target.value) })} />
                    </Field>
                    <Field label="Platform fee on paid courses (%)">
                      <Input type="number" min={0} max={60} value={d.learn.platformFeePercent} onChange={(e) => set("learn", { platformFeePercent: Number(e.target.value) })} />
                    </Field>
                  </div>
                </div>
              </Panel>
            )}
            {group === "leadgen" && (
              <>
                <Panel title="Broadcast pricing" description="Credits charged per message. Members buy credits in bundles.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Credits per SMS segment (160 chars)">
                      <Input type="number" step="0.01" value={d.leadgen.smsCreditCost} onChange={(e) => set("leadgen", { smsCreditCost: Number(e.target.value) })} />
                    </Field>
                    <Field label="Credits per email">
                      <Input type="number" step="0.01" value={d.leadgen.emailCreditCost} onChange={(e) => set("leadgen", { emailCreditCost: Number(e.target.value) })} />
                    </Field>
                  </div>
                  <p className="mt-5 mb-2 text-sm font-medium">Credit bundles</p>
                  <div className="space-y-2">
                    {d.leadgen.bundles.map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input type="number" value={b.credits} onChange={(e) => set("leadgen", { bundles: d.leadgen.bundles.map((x, j) => (j === i ? { ...x, credits: Number(e.target.value) } : x)) })} className="w-32" />
                        <span className="text-sm">credits for GH₵</span>
                        <Input type="number" step="0.01" value={b.price} onChange={(e) => set("leadgen", { bundles: d.leadgen.bundles.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)) })} className="w-32" />
                        <span className="text-xs text-muted-foreground">({(b.price / Math.max(1, b.credits)).toFixed(3)}/credit)</span>
                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => set("leadgen", { bundles: d.leadgen.bundles.filter((_, j) => j !== i) })} aria-label="Remove bundle">
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                    {d.leadgen.bundles.length < 8 && (
                      <Button type="button" size="sm" variant="outline" onClick={() => set("leadgen", { bundles: [...d.leadgen.bundles, { credits: 1000, price: 40 }] })}>
                        <Plus /> Add bundle
                      </Button>
                    )}
                  </div>
                </Panel>
                <Panel title="Rules & limits">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Default SMS sender ID" hint="Must be registered on SMSOnlineGH.">
                      <Input value={d.leadgen.defaultSmsSender} maxLength={11} onChange={(e) => set("leadgen", { defaultSmsSender: e.target.value })} />
                    </Field>
                    <Field label="Default email sender name">
                      <Input value={d.leadgen.defaultEmailSender} onChange={(e) => set("leadgen", { defaultEmailSender: e.target.value })} />
                    </Field>
                    <Field label="Platform fee on list sales (%)">
                      <Input type="number" value={d.leadgen.platformFeePercent} onChange={(e) => set("leadgen", { platformFeePercent: Number(e.target.value) })} />
                    </Field>
                    <Field label="Minimum payout (GH₵)">
                      <Input type="number" value={d.leadgen.minPayout} onChange={(e) => set("leadgen", { minPayout: Number(e.target.value) })} />
                    </Field>
                    <Field label="Daily email limit" hint="Gmail allows ~500/day (2,000 on Google Workspace).">
                      <Input type="number" value={d.leadgen.emailDailyLimit} onChange={(e) => set("leadgen", { emailDailyLimit: Number(e.target.value) })} />
                    </Field>
                    <Field label="Max recipients per broadcast">
                      <Input type="number" value={d.leadgen.maxRecipients} onChange={(e) => set("leadgen", { maxRecipients: Number(e.target.value) })} />
                    </Field>
                    <Field label="Lead-sharing terms" className="sm:col-span-2" hint="Shown when members create or publish lead lists.">
                      <Textarea rows={5} value={d.leadgen.terms} onChange={(e) => set("leadgen", { terms: e.target.value })} />
                    </Field>
                  </div>
                </Panel>
                <Panel
                  title="Mobile money payments"
                  description="Wallets members can send money to by hand when buying credits. The number gets an SMS each time a payment is claimed; approve it under LeadGen → MoMo payments."
                >
                  <div className="space-y-2">
                    {d.leadgen.momoAccounts.map((a, i) => {
                      const update = (patch: Partial<MomoAccount>) => set("leadgen", { momoAccounts: d.leadgen.momoAccounts.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
                      return (
                        <div key={i} className="flex flex-wrap items-center gap-2">
                          <select value={a.network} onChange={(e) => update({ network: e.target.value as MomoNetwork })} className="h-9 rounded-md border bg-white px-3 text-sm" aria-label="Network">
                            {Object.entries(MOMO_NETWORKS).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v}
                              </option>
                            ))}
                          </select>
                          <Input value={a.name} onChange={(e) => update({ name: e.target.value })} placeholder="Account name" className="w-64" aria-label="Account name" />
                          <Input value={a.number} onChange={(e) => update({ number: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="0241234567" inputMode="numeric" className="w-36 font-mono" aria-label="Number" />
                          <Button type="button" size="icon-sm" variant="ghost" onClick={() => set("leadgen", { momoAccounts: d.leadgen.momoAccounts.filter((_, j) => j !== i) })} aria-label="Remove account">
                            <Trash2 />
                          </Button>
                        </div>
                      );
                    })}
                    {d.leadgen.momoAccounts.length === 0 && <p className="text-sm text-muted-foreground">No accounts: members can only pay online or redeem vouchers.</p>}
                    {d.leadgen.momoAccounts.length < 4 && (
                      <Button type="button" size="sm" variant="outline" onClick={() => set("leadgen", { momoAccounts: [...d.leadgen.momoAccounts, { network: "mtn", name: "", number: "" }] })}>
                        <Plus /> Add account
                      </Button>
                    )}
                  </div>
                </Panel>
              </>
            )}
            {editable && (
              <Button type="submit" disabled={save.isPending}>
                Save {GROUPS.find(([k]) => k === group)?.[1]}
              </Button>
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
}
