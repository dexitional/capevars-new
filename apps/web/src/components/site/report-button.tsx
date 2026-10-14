import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { useRequireMember } from "#/hooks/useMember";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";

const REASONS: Array<[string, string]> = [
  ["spam", "Spam or misleading"],
  ["scam", "Scam or fraud"],
  ["counterfeit", "Counterfeit / fake item"],
  ["harassment", "Harassment or bullying"],
  ["hate", "Hate speech"],
  ["nudity", "Nudity or sexual content"],
  ["violence", "Violence"],
  ["misinformation", "False information"],
  ["other", "Something else"],
];

export function ReportButton({
  entityType,
  entityId,
  className,
  children,
}: {
  entityType: "post" | "comment" | "user" | "page" | "group" | "product" | "listing" | "job" | "course" | "event";
  entityId: number;
  className?: string;
  children: React.ReactNode;
}) {
  const requireMember = useRequireMember();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const send = useMutation({
    mutationFn: () => api.post("/social/report", { entityType, entityId, reason, details }),
    onSuccess: () => {
      toast.success("Thanks — our moderators will take a look.");
      setOpen(false);
      setDetails("");
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <>
      <button type="button" onClick={() => requireMember(() => setOpen(true))} className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive", className)}>
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report</DialogTitle>
            <DialogDescription>Reports are private. Tell us what's wrong.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            {REASONS.map(([k, v]) => (
              <label key={k} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
                <input type="radio" name="reason" value={k} checked={reason === k} onChange={() => setReason(k)} className="accent-primary" /> {v}
              </label>
            ))}
          </div>
          <Textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Anything else we should know? (optional)" />
          <Button onClick={() => send.mutate()} disabled={send.isPending}>
            Send report
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
