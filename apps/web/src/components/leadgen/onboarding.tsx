// The first-visit LeadGen popup for student accounts: pick a campaign target
// to unlock, free, the Capevars private lead lists tagged with it. Shown once;
// "Maybe later" hides it for this browser session.
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Gift, Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { useMember } from "#/hooks/useMember";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Campaign = { id: string; label: string; lists: number; contacts: number };
type Onboarding = { show: boolean; campaign: string | null; campaigns: Array<Campaign> };
type Unlocked = { campaign: string; unlocked: Array<{ title: string; contacts: number; voucher: string }> };

const LATER_KEY = "leadgen-onboarding-later";

export function LeadgenOnboarding() {
  const member = useMember();
  const queryClient = useQueryClient();
  const [later, setLater] = useState(true);
  useEffect(() => {
    try {
      setLater(sessionStorage.getItem(LATER_KEY) === "1");
    } catch {
      setLater(false);
    }
  }, []);
  const student = member?.memberType === "student";
  const { data } = useQuery({ queryKey: ["leadgen-onboarding"], queryFn: () => api.get<Onboarding>("/leadgen/onboarding"), enabled: student, staleTime: 5 * 60_000 });
  const [campaign, setCampaign] = useState("");
  const [done, setDone] = useState<Unlocked | null>(null);
  const choose = useMutation({
    mutationFn: () => api.post<Unlocked>("/leadgen/onboarding", { campaign }),
    onSuccess: (r) => {
      setDone(r);
      void queryClient.invalidateQueries({ queryKey: ["leadgen-onboarding"] });
    },
    onError: (e) => toast.error(e.message),
  });
  const open = student && !later && (Boolean(data?.show) || done !== null);
  const close = () => {
    if (!done) {
      try {
        sessionStorage.setItem(LATER_KEY, "1");
      } catch {
        // Storage blocked: it closes for now and may show again on reload.
      }
    }
    setLater(true);
  };
  const picked = data?.campaigns.find((c) => c.id === campaign);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-600" /> Your leads are unlocked
              </DialogTitle>
              <DialogDescription>
                {done.unlocked.length} list{done.unlocked.length === 1 ? "" : "s"} for {data?.campaigns.find((c) => c.id === done.campaign)?.label ?? done.campaign}. Use them in the Broadcast portal.
              </DialogDescription>
            </DialogHeader>
            <ul className="divide-y rounded-lg border text-sm">
              {done.unlocked.map((l) => (
                <li key={l.voucher} className="flex items-center justify-between gap-3 px-3 py-2">
                  <span className="min-w-0 truncate font-medium text-primary">{l.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{l.contacts.toLocaleString()} contacts</span>
                </li>
              ))}
            </ul>
            <DialogFooter>
              <Button asChild className="bg-sys-leadgen hover:bg-sys-leadgen/90" onClick={() => setLater(true)}>
                <Link to="/leadgen/portal/leads">See my leads</Link>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="size-5 text-sys-leadgen" /> Free leads for your campaign
              </DialogTitle>
              <DialogDescription>Choose the campaign you’re working on. We’ll unlock its private lead lists for you, free. You can only choose once.</DialogDescription>
            </DialogHeader>
            <label className="block text-sm font-semibold text-primary" htmlFor="leadgen-campaign">
              Target campaign
            </label>
            <select
              id="leadgen-campaign"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
            >
              <option value="">Choose a campaign…</option>
              {data?.campaigns.map((c) => (
                <option key={c.id} value={c.id} disabled={c.lists === 0}>
                  {c.label}
                  {c.lists ? ` · ${c.lists} list${c.lists === 1 ? "" : "s"}, ${c.contacts.toLocaleString()} contacts` : " · no leads yet"}
                </option>
              ))}
            </select>
            {picked && (
              <p className="text-xs text-muted-foreground">
                Unlocks {picked.lists} list{picked.lists === 1 ? "" : "s"} with {picked.contacts.toLocaleString()} contacts.
              </p>
            )}
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={close}>
                Maybe later
              </Button>
              <Button className="bg-sys-leadgen hover:bg-sys-leadgen/90" disabled={!picked || choose.isPending} onClick={() => choose.mutate()}>
                {choose.isPending && <Loader2 className="animate-spin" />} Unlock my free leads
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
