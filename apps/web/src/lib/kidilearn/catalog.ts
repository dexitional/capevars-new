import { z } from 'zod'

export const LEVEL_IDS = [
  'kg1',
  'kg2',
  'b1',
  'b2',
  'b3',
  'b4',
  'b5',
  'b6',
  'b7',
  'b8',
  'b9',
] as const
export type LevelId = (typeof LEVEL_IDS)[number]
export const STAGES = [
  'Kindergarten',
  'Lower primary',
  'Upper primary',
  'JHS',
] as const
export const LEVELS = LEVEL_IDS.map((id, index) => ({
  id,
  label: index < 2 ? `KG ${index + 1}` : `Basic ${index - 1}`,
  stage: STAGES[index < 2 ? 0 : index < 5 ? 1 : index < 8 ? 2 : 3],
  detail:
    index >= 8
      ? `JHS ${index - 7}`
      : index < 2
        ? 'Learn through play'
        : 'Build your foundations',
}))

export const SUBJECTS = {
  literacy: {
    name: 'Language & literacy',
    description: 'Listen, tell stories, read and write.',
    mark: 'Aa',
    tone: 'bg-violet-100 text-violet-800',
  },
  numeracy: {
    name: 'Numeracy',
    description: 'Explore numbers, shapes and patterns.',
    mark: '123',
    tone: 'bg-amber-100 text-amber-800',
  },
  world: {
    name: 'Our world & our people',
    description: 'Discover yourself, your community and nature.',
    mark: '🌍',
    tone: 'bg-emerald-100 text-emerald-800',
  },
  english: {
    name: 'English language',
    description: 'Grow your reading, writing and speaking skills.',
    mark: 'Aa',
    tone: 'bg-violet-100 text-violet-800',
  },
  mathematics: {
    name: 'Mathematics',
    description: 'Build confidence with numbers and problem solving.',
    mark: '÷',
    tone: 'bg-amber-100 text-amber-800',
  },
  science: {
    name: 'Science',
    description: 'Ask questions and discover how things work.',
    mark: '🔬',
    tone: 'bg-sky-100 text-sky-800',
  },
  ghanaian: {
    name: 'Ghanaian language · Twi',
    description: 'Explore language, stories and our heritage.',
    mark: 'Ak',
    tone: 'bg-orange-100 text-orange-800',
  },
  ghanaian_ga: {
    name: 'Ghanaian language · Ga',
    description: 'Practise Ga expressions, reading and conversation.',
    mark: 'Ga',
    tone: 'bg-orange-100 text-orange-800',
  },
  ghanaian_mfantse: {
    name: 'Ghanaian language · Mfantse',
    description: 'Practise Mfantse expressions, reading and conversation.',
    mark: 'Mf',
    tone: 'bg-orange-100 text-orange-800',
  },
  creative: {
    name: 'Creative arts',
    description: 'Make, draw, sing and express your ideas.',
    mark: '🎨',
    tone: 'bg-rose-100 text-rose-800',
  },
  history: {
    name: 'History',
    description: "Discover Ghana's people, places and past.",
    mark: '🏛',
    tone: 'bg-orange-100 text-orange-800',
  },
  rme: {
    name: 'Religious & moral education',
    description: 'Learn about values, respect and caring for others.',
    mark: '♡',
    tone: 'bg-pink-100 text-pink-800',
  },
  computing: {
    name: 'Computing',
    description: 'Create and solve problems with technology.',
    mark: '</>',
    tone: 'bg-indigo-100 text-indigo-800',
  },
  pe: {
    name: 'Physical education',
    description: 'Move, play and build healthy habits.',
    mark: '⚽',
    tone: 'bg-lime-100 text-lime-800',
  },
  french: {
    name: 'French',
    description: 'Discover a new language, one conversation at a time.',
    mark: 'Fr',
    tone: 'bg-blue-100 text-blue-800',
  },
  social: {
    name: 'Social studies',
    description: 'Understand communities, citizenship and our world.',
    mark: '🌍',
    tone: 'bg-teal-100 text-teal-800',
  },
  career: {
    name: 'Career technology',
    description: 'Develop practical skills and explore possibilities.',
    mark: '🛠',
    tone: 'bg-orange-100 text-orange-800',
  },
  design: {
    name: 'Creative arts & design',
    description: 'Combine imagination, art and design.',
    mark: '🎨',
    tone: 'bg-rose-100 text-rose-800',
  },
  health: {
    name: 'Physical education & health',
    description: 'Stay active and learn to care for your wellbeing.',
    mark: '⚽',
    tone: 'bg-lime-100 text-lime-800',
  },
  arabic: {
    name: 'Arabic',
    description: 'Explore Arabic reading, writing and conversation.',
    mark: 'ع',
    tone: 'bg-emerald-100 text-emerald-800',
  },
} as const
export type SubjectId = keyof typeof SUBJECTS

// Starter learning areas; the content directory can extend this catalogue.
// KG uses integrated learning areas rather than separate primary subjects.
const PRIMARY: Array<SubjectId> = [
  'world',
  'english',
  'mathematics',
  'science',
  'ghanaian',
  'ghanaian_ga',
  'ghanaian_mfantse',
  'french',
  'creative',
  'history',
  'rme',
  'computing',
  'pe',
]
export function subjectsForLevel(level: LevelId): Array<SubjectId> {
  if (level.startsWith('kg'))
    return ['literacy', 'numeracy', 'creative', 'world']
  if (['b1', 'b2', 'b3'].includes(level)) return PRIMARY
  if (['b4', 'b5', 'b6'].includes(level)) return PRIMARY
  return [
    'english',
    'mathematics',
    'science',
    'ghanaian',
    'social',
    'rme',
    'computing',
    'career',
    'design',
    'health',
    'french',
    'arabic',
  ]
}

export const DAYS = [
  { id: 'mon', label: 'Monday', short: 'Mon' },
  { id: 'tue', label: 'Tuesday', short: 'Tue' },
  { id: 'wed', label: 'Wednesday', short: 'Wed' },
  { id: 'thu', label: 'Thursday', short: 'Thu' },
  { id: 'fri', label: 'Friday', short: 'Fri' },
  { id: 'sat', label: 'Saturday', short: 'Sat' },
  { id: 'sun', label: 'Sunday', short: 'Sun' },
] as const
export const subjectPlanSchema = z.object({
  subjectId: z.enum(Object.keys(SUBJECTS) as [SubjectId, ...Array<SubjectId>]),
  quizEnabled: z.boolean(),
  questionCount: z.union([
    z.literal(5),
    z.literal(10),
    z.literal(15),
    z.literal(20),
  ]),
  passMark: z.number().int().min(50).max(100),
})
export const planSchema = z
  .object({
    level: z.enum(LEVEL_IDS),
    days: z
      .array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']))
      .min(1, 'Choose at least one study day.')
      .max(7),
    minutesPerSession: z.number().int().min(10).max(60),
    subjects: z
      .array(subjectPlanSchema)
      .min(1, 'Choose at least one subject.')
      .max(13),
  })
  .superRefine((plan, ctx) => {
    if (new Set(plan.days).size !== plan.days.length)
      ctx.addIssue({
        code: 'custom',
        path: ['days'],
        message: 'Choose each study day only once.',
      })
    if (
      new Set(plan.subjects.map((s) => s.subjectId)).size !==
      plan.subjects.length
    )
      ctx.addIssue({
        code: 'custom',
        path: ['subjects'],
        message: 'Choose each subject only once.',
      })
    if (
      plan.subjects.some(
        (s) => !subjectsForLevel(plan.level).includes(s.subjectId),
      )
    )
      ctx.addIssue({
        code: 'custom',
        path: ['subjects'],
        message: 'Choose subjects for your selected level.',
      })
  })
export type StudyPlan = z.infer<typeof planSchema>
export type SubjectPlan = z.infer<typeof subjectPlanSchema>
export type SavedPlan = StudyPlan & { updatedAt: string }
export function newPlan(level: LevelId): StudyPlan {
  return {
    level,
    days: ['mon', 'wed', 'fri'],
    minutesPerSession: level.startsWith('kg') ? 15 : 25,
    subjects: [],
  }
}

export interface CourseLink {
  level: LevelId
  subjectId: SubjectId
  title: string
  slug: string
  lessons: number
  interactive: boolean
  questionCount: number
  canQuiz: boolean
  progress: number
}
export interface AttemptSummary {
  id: string
  level: LevelId
  subjectId: SubjectId
  score: number | null
  passed: boolean | null
  questionCount: number
  submittedAt: string | null
}
export interface KidiDashboard {
  preferredLevel?: LevelId | null
  plans: Array<SavedPlan>
  courses: Array<CourseLink>
  attempts: Array<AttemptSummary>
}
export interface QuizQuestion {
  id: number
  question: string
  options: Array<string>
}
export interface QuizAttempt {
  id: string
  level: LevelId
  subjectId: SubjectId
  passMark: number
  questions: Array<QuizQuestion>
  result: null | {
    score: number
    passed: boolean
    correct: number
    total: number
  }
}
