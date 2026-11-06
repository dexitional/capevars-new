// Bookmarks: questions a member saves in study mode, from any course, gathered
// into one study session they can page through.
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bookmark, Brain } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";

type Bookmarks = { questionIds: Array<number> };
const KEY = ["qb-bookmarks"];

export function useBookmarks() {
  return useQuery({ queryKey: KEY, queryFn: () => api.get<Bookmarks>("/learn/quizbank/bookmarks"), staleTime: 60_000 });
}

export function BookmarkToggle({ questionId }: { questionId: number }) {
  const queryClient = useQueryClient();
  const { data } = useBookmarks();
  const saved = data?.questionIds.includes(questionId) ?? false;
  // Flips straight away, and flips back if the server refuses.
  const toggle = useMutation({
    mutationFn: (save: boolean) => (save ? api.post(`/learn/quizbank/bookmarks/${questionId}`) : api.delete(`/learn/quizbank/bookmarks/${questionId}`)),
    onMutate: async (save) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const previous = queryClient.getQueryData<Bookmarks>(KEY);
      const others = previous?.questionIds.filter((id) => id !== questionId) ?? [];
      queryClient.setQueryData<Bookmarks>(KEY, { questionIds: save ? [questionId, ...others] : others });
      return { previous };
    },
    onError: (e, _save, context) => {
      queryClient.setQueryData(KEY, context?.previous);
      toast.error(e.message);
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: KEY }),
  });
  return (
    <button
      type="button"
      // Not `disabled` while saving: that would drop focus, and with it the ← → keys.
      onClick={() => data && !toggle.isPending && toggle.mutate(!saved)}
      aria-pressed={saved}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition-colors sm:py-1",
        saved ? "border-amber-300 bg-amber-100 text-amber-900" : "bg-white text-muted-foreground hover:border-primary/40 hover:text-primary",
      )}
    >
      <Bookmark className={cn("size-3.5", saved && "fill-current")} /> {saved ? "Bookmarked" : "Bookmark"}
    </button>
  );
}

// The way in from the Quizbank page.
export function BookmarksBar() {
  const { data } = useBookmarks();
  if (!data) return null;
  const n = data.questionIds.length;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-brand-gold/60 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-900">
          <Bookmark className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-black text-primary">My bookmarks</h2>
          <p className="text-sm text-muted-foreground">
            {n ? `${n.toLocaleString()} saved question${n === 1 ? "" : "s"} from across your courses.` : "Bookmark a question in study mode to save it here, mixed with questions from any other course."}
          </p>
        </div>
      </div>
      {n > 0 && (
        <Button asChild className="h-11 w-full rounded-xl sm:h-9 sm:w-auto sm:rounded-md">
          <Link to="/learn/quizbank/bookmarks">
            <Brain /> Study bookmarks
          </Link>
        </Button>
      )}
    </div>
  );
}
