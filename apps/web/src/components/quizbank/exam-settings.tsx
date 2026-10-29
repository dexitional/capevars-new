import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { QB_EXAM } from "#/lib/quizbank";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { TopicPicker, useTopics } from "./topics";

export interface ExamSettings {
  examQuestions: number;
  examMinutes: number;
}

const PRESETS: Array<[number, number]> = [
  [10, 10],
  [20, 30],
  [40, 60],
  [60, 90],
];

// The member's own exam size and time limit for a course on their board.
export function ExamSettingsFields({ value, max, onChange }: { value: ExamSettings; max: number; onChange: (v: ExamSettings) => void }) {
  const cap = Math.max(1, Math.min(max || QB_EXAM.maxQuestions, QB_EXAM.maxQuestions));
  // Fewer questions to draw from (e.g. after narrowing topics) shrinks the exam to fit.
  useEffect(() => {
    if (value.examQuestions > cap) onChange({ ...value, examQuestions: cap });
  }, [cap, value, onChange]);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.filter(([n]) => n <= cap || n === PRESETS[0]?.[0]).map(([n, m]) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange({ examQuestions: Math.min(n, cap), examMinutes: m })}
            className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary hover:bg-accent"
          >
            {Math.min(n, cap)} Qs · {m} min
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Questions per exam" hint={`Up to ${cap} in this course`}>
          <Input type="number" min={QB_EXAM.minQuestions} max={cap} value={value.examQuestions} onChange={(e) => onChange({ ...value, examQuestions: Number(e.target.value) })} />
        </Field>
        <Field label="Time limit (minutes)" hint={`${QB_EXAM.minMinutes}–${QB_EXAM.maxMinutes} minutes`}>
          <Input type="number" min={QB_EXAM.minMinutes} max={QB_EXAM.maxMinutes} value={value.examMinutes} onChange={(e) => onChange({ ...value, examMinutes: Number(e.target.value) })} />
        </Field>
      </div>
    </div>
  );
}

export const clampSettings = (v: ExamSettings, max: number): ExamSettings => ({
  examQuestions: Math.min(Math.max(Math.round(v.examQuestions) || 1, QB_EXAM.minQuestions), Math.max(1, Math.min(max || QB_EXAM.maxQuestions, QB_EXAM.maxQuestions))),
  examMinutes: Math.min(Math.max(Math.round(v.examMinutes) || 1, QB_EXAM.minMinutes), QB_EXAM.maxMinutes),
});

// A board course's study plan: its topics, exam size and time limit.
export function ExamSettingsDialog({
  course,
  value,
  tagIds: initialTags,
  onClose,
  onSaved,
}: {
  course: { id: number; title: string; questionCount: number };
  value: ExamSettings;
  tagIds: Array<number>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState(value);
  const [tagIds, setTagIds] = useState(initialTags);
  const topics = useTopics([course.id], tagIds);
  const max = tagIds.length ? (topics.data?.matching ?? course.questionCount) : course.questionCount;
  const save = useMutation({
    mutationFn: () => api.patch(`/learn/quizbank/board/${course.id}`, { ...clampSettings(draft, max), tagIds }),
    onSuccess: () => {
      toast.success("Exam settings saved");
      onSaved();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Study plan</DialogTitle>
          <DialogDescription>{course.title} — the topics you practise, how many questions each exam asks, and how long you get.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="space-y-4"
        >
          <Field label="Topics" hint="More topics, more variety. One or two keeps you focused.">
            <TopicPicker data={topics.data} value={tagIds} onChange={setTagIds} />
          </Field>
          <ExamSettingsFields value={draft} max={max} onChange={setDraft} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Starts an exam simulation for a course or a study set (with the member's
// saved settings and topics unless given) and opens it.
export function useStartExam() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ courseId, variationId, settings }: { courseId?: number; variationId?: number; settings?: Partial<ExamSettings> & { tagIds?: Array<number> } }) =>
      api.post<{ id: number }>(variationId ? `/learn/quizbank/variations/${variationId}/exam` : `/learn/quizbank/courses/${courseId}/exam`, settings ?? {}),
    onSuccess: (r) => void navigate({ to: "/learn/quizbank/exam/$id", params: { id: String(r.id) } }),
    onError: (e) => toast.error(e.message),
  });
}
