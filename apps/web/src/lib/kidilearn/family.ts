export const CHILD_AVATARS = {
  sun: '☀️',
  star: '⭐',
  lion: '🦁',
  butterfly: '🦋',
  rocket: '🚀',
  tree: '🌳',
} as const
export type ChildAvatar = keyof typeof CHILD_AVATARS
export type KidiSession = {
  mode: 'parent' | 'child'
  name: string
  childId: number | null
  level: string | null
  avatar: ChildAvatar | null
  photoUrl: string | null
} | null
export interface ChildProfile {
  id: number
  name: string
  level: string
  avatar: ChildAvatar
  photoUrl: string | null
  active: boolean
  lastLoginAt: string | null
}
export interface ChildReport {
  child: ChildProfile
  plans: Array<{
    level: string
    days: Array<string>
    minutesPerSession: number
    subjects: Array<{
      subjectId: string
      quizEnabled: boolean
      questionCount: number
      passMark: number
    }>
  }>
  subjects: Array<{
    level: string
    subjectId: string
    title: string
    lessons: number
    completedSteps: number
    progress: number
    practiceAttempts: number
    practiceAverage: number | null
    finalAttempts: number
    finalAverage: number | null
    finalPasses: number
    lastActivity: string | null
  }>
  weeklyActivity: Array<{ date: string; submissions: number }>
  recentQuizzes: Array<{
    id: string
    level: string
    subjectId: string
    score: number
    passed: boolean
    submittedAt: string
  }>
}
