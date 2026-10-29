// Quizbank (OpenLearn): a bank of questions with options, answers, per-option
// hints and explanations. Questions belong to one or more courses; courses
// carry free tags and one major level (Tertiary, SHS, ...). Members pin
// courses to their Study Board and practise them in exam or study mode.
// Client-safe: the admin editor and the API validate with these schemas.
import { z } from "zod";

export const QB_LEVELS = { tertiary: "Tertiary", shs: "SHS", jhs: "JHS", tvet: "TVET", nvti: "NVTI" } as const;
export type QbLevel = keyof typeof QB_LEVELS;
export const QB_LEVEL_IDS = Object.keys(QB_LEVELS) as [QbLevel, ...Array<QbLevel>];

export const QB_DIFFICULTY = { easy: "Easy", medium: "Medium", hard: "Hard" } as const;
export type QbDifficulty = keyof typeof QB_DIFFICULTY;

export const QB_DISCUSSION_KINDS = { insight: "Insight", correction: "Correction", remark: "Remark", explanation: "Better explanation" } as const;
export type QbDiscussionKind = keyof typeof QB_DISCUSSION_KINDS;

// Bounds for a member's exam simulation settings.
export const QB_EXAM = { minQuestions: 1, maxQuestions: 200, minMinutes: 1, maxMinutes: 300 } as const;
export const QB_MAX_OPTIONS = 8;
export const QB_MAX_TEXT_ANSWER = 5000;

// A diagram or picture on a question: an uploaded image, or a vector drawing
// pasted as SVG markup (always shown through <img>, so scripts in it never run).
export interface QbMedia {
  kind: "image" | "svg";
  url?: string;
  svg?: string;
  caption?: string;
}
export interface QbOption {
  text: string;
  hint?: string;
  imageUrl?: string;
}

// A question as members see it before answering: no answer, no option hints.
export interface QbPublicQuestion {
  id: number;
  type: "choice" | "text";
  body: string;
  media: Array<QbMedia>;
  options: Array<{ text: string; imageUrl?: string }>;
  hint: string | null;
  marks: number;
  difficulty: QbDifficulty;
  discussionCount: number;
}

// How one answer was marked; `marker` says whether Claude or the basic
// word-overlap fallback marked a written answer.
export interface QbMark {
  questionId: number;
  correct: boolean;
  score: number; // 0..1 of the question's marks
  feedback?: string | null;
  marker?: "exact" | "ai" | "basic";
}

export const svgDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
export const mediaSrc = (m: QbMedia) => (m.kind === "svg" ? svgDataUrl(m.svg ?? "") : (m.url ?? ""));

const trimmed = (max: number) => z.string().trim().max(max);
// Blank, null (as loaded from the database) or missing all mean "not set".
const optionalText = (max: number) =>
  trimmed(max)
    .nullish()
    .transform((v) => v || undefined);

export const qbMediaSchema = z
  .object({
    kind: z.enum(["image", "svg"]),
    url: optionalText(500),
    svg: z.string().trim().max(200_000).optional(),
    caption: optionalText(300),
  })
  .refine((m) => (m.kind === "image" ? Boolean(m.url) : /^(<\?xml[^>]*>\s*)?<svg[\s>]/i.test(m.svg ?? "")), "Add an image, or paste SVG markup that starts with <svg");

export const qbQuestionSchema = z
  .object({
    type: z.enum(["choice", "text"]),
    body: trimmed(10_000).min(3, "Write the question"),
    media: z.array(qbMediaSchema).max(6).default([]),
    options: z
      .array(z.object({ text: trimmed(2000), hint: optionalText(2000), imageUrl: optionalText(500) }))
      .max(QB_MAX_OPTIONS)
      .default([]),
    correctIndex: z.number().int().min(0).max(QB_MAX_OPTIONS - 1).nullable().default(null),
    answer: optionalText(5000),
    explanation: optionalText(10_000),
    hint: optionalText(1000),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    marks: z.number().min(0.5).max(100).default(1),
    status: z.enum(["draft", "published"]).default("published"),
    courseIds: z.array(z.number().int().positive()).max(50).default([]),
    // Topic tags members filter a course's questions by; also added to its courses' tags.
    tags: z.array(trimmed(60).min(1)).max(15).default([]),
  })
  .superRefine((q, ctx) => {
    if (q.type === "choice") {
      if (q.options.length < 2) ctx.addIssue({ code: "custom", path: ["options"], message: "Give at least two options" });
      if (q.options.some((o) => !o.text && !o.imageUrl)) ctx.addIssue({ code: "custom", path: ["options"], message: "Every option needs text or a picture" });
      if (q.correctIndex === null || q.correctIndex >= q.options.length) ctx.addIssue({ code: "custom", path: ["correctIndex"], message: "Mark the correct option" });
    } else if (!q.answer) {
      ctx.addIssue({ code: "custom", path: ["answer"], message: "Write the model answer that responses are marked against" });
    }
  });
export type QbQuestionInput = z.input<typeof qbQuestionSchema>;

export const qbCourseSchema = z.object({
  title: trimmed(200).min(3),
  code: optionalText(40),
  level: z.enum(QB_LEVEL_IDS),
  description: optionalText(5000),
  coverUrl: optionalText(500),
  examQuestions: z.number().int().min(QB_EXAM.minQuestions).max(QB_EXAM.maxQuestions).default(20),
  examMinutes: z.number().int().min(QB_EXAM.minMinutes).max(QB_EXAM.maxMinutes).default(30),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(trimmed(60).min(1)).max(20).default([]),
});
export type QbCourseInput = z.input<typeof qbCourseSchema>;

// A member's own mix: questions from one or more courses, optionally only
// those carrying some topic tags. No tags means every question of the courses.
export const qbVariationSchema = z.object({
  name: trimmed(120).min(2, "Name your study set"),
  courseIds: z.array(z.number().int().positive()).min(1, "Pick at least one course").max(20),
  tagIds: z.array(z.number().int().positive()).max(50).default([]),
  examQuestions: z.number().int().min(QB_EXAM.minQuestions).max(QB_EXAM.maxQuestions).default(20),
  examMinutes: z.number().int().min(QB_EXAM.minMinutes).max(QB_EXAM.maxMinutes).default(30),
});
export type QbVariationInput = z.input<typeof qbVariationSchema>;

// A topic tag with how many questions carry it within some courses.
export interface QbTopic {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}
