// The LeadGen onboarding for student accounts, new and existing: each answers
// once whether they work on a student leadership agenda or campaign, and if
// so picks the target. A target unlocks, free, the Capevars private lead
// lists tagged with it, now and as more are tagged. Only admins change the
// answer after. "Maybe later" hides it for this browser session.
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Flag, Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { useMember } from "#/hooks/useMember";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Campaign = { id: string; label: string; lists: number; contacts: number };
type Onboarding = { show: boolean; campaign: string | null; campaigns: Array<Campaign> };
type Answered = { campaign: string | null; unlocked: Array<{ id: number; title: string; contacts: number }> };

const LATER_KEY = "leadgen-onboarding-later";
const ONCE = "You can only set this once. To change it later, contact a Capevars admin.";

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
  const [step, setStep] = useState<"ask" | "choose">("ask");
  const [campaign, setCampaign] = useState("");
  const [done, setDone] = useState<Answered | null>(null);
  const answer = useMutation({
    mutationFn: (value: string | null) => api.post<Answered>("/leadgen/onboarding", { campaign: value }),
    onSuccess: (r) => {
      void queryClient.invalidateQueries({ queryKey: ["leadgen-onboarding"] });
      if (r.campaign) setDone(r);
      else {
        toast.success("Thanks, noted. You can use LeadGen as usual.");
        setLater(true);
      }
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
  const label = (id: string | null) => data?.campaigns.find((c) => c.id === id)?.label ?? id;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-600" /> Campaign set: {label(done.campaign)}
              </DialogTitle>
              <DialogDescription>
                {done.unlocked.length
                  ? `${done.unlocked.length} lead list${done.unlocked.length === 1 ? " is" : "s are"} unlocked for you. Use them in the Broadcast portal.`
                  : "No lead lists are tagged for this campaign yet. They'll appear in My leads as soon as Capevars adds them."}
              </DialogDescription>
            </DialogHeader>
            {done.unlocked.length > 0 && (
              <ul className="divide-y rounded-lg border text-sm">
                {done.unlocked.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="min-w-0 truncate font-medium text-primary">{l.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{l.contacts.toLocaleString()} contacts</span>
                  </li>
                ))}
              </ul>
            )}
            <DialogFooter>
              <Button asChild className="bg-sys-leadgen hover:bg-sys-leadgen/90" onClick={() => setLater(true)}>
                <Link to="/leadgen/portal/leads">See my leads</Link>
              </Button>
            </DialogFooter>
          </>
        ) : step === "ask" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="size-5 text-sys-leadgen" /> Student leadership
              </DialogTitle>
              <DialogDescription>Are you working on a student leadership agenda or campaign? Campaign teams get free lead lists for their target.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Button className="h-auto justify-start bg-sys-leadgen py-3 text-left hover:bg-sys-leadgen/90" onClick={() => setStep("choose")}>
                Yes, I’m working on a campaign
              </Button>
              <Button variant="outline" className="h-auto justify-start py-3 text-left" disabled={answer.isPending} onClick={() => confirm(`Answer "No"? ${ONCE}`) && answer.mutate(null)}>
                No, I’m not
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{ONCE}</p>
            <DialogFooter>
              <Button variant="ghost" onClick={close}>
                Maybe later
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="size-5 text-sys-leadgen" /> Choose your campaign
              </DialogTitle>
              <DialogDescription>We’ll unlock its private lead lists for you, free, including any added later.</DialogDescription>
            </DialogHeader>
            <label className="block text-sm font-semibold text-primary" htmlFor="leadgen-campaign">
              Target campaign
            </label>
            <select id="leadgen-campaign" value={campaign} onChange={(e) => setCampaign(e.target.value)} className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm">
              <option value="">Choose a campaign…</option>
              {data?.campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                  {c.lists ? ` · ${c.lists} list${c.lists === 1 ? "" : "s"}, ${c.contacts.toLocaleString()} contacts` : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {picked ? (picked.lists ? `Unlocks ${picked.lists} list${picked.lists === 1 ? "" : "s"} with ${picked.contacts.toLocaleString()} contacts now. ` : "No lists yet; they unlock as Capevars adds them. ") : ""}
              {ONCE}
            </p>
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setStep("ask")}>
                <ArrowLeft /> Back
              </Button>
              <Button className="bg-sys-leadgen hover:bg-sys-leadgen/90" disabled={!picked || answer.isPending} onClick={() => answer.mutate(campaign)}>
                {answer.isPending && <Loader2 className="animate-spin" />} Confirm campaign
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
