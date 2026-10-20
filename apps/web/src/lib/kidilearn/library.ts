export type Phase = 'explore' | 'play' | 'challenge'
export interface Visual {
  type: string
  nums?: Array<number | null>
  vals?: Array<number>
  a?: number | string
  b?: number
  n?: number
  p?: number
  v?: number
  rows?: number
  cols?: number
  parts?: number
  filled?: number
  hour?: number
  degrees?: number
  base?: number
  name?: string
  op?: string
  unit?: string
  left?: number
  right?: number
  digits?: number
}
export interface PlayInteraction {
  type:
    | 'tap'
    | 'half'
    | 'chart'
    | 'order'
    | 'directions'
    | 'numberline'
    | 'money'
    | 'groups'
    | 'measure'
  total?: number
  emoji?: string
  items?: Array<number>
  start?: number | Array<number>
  goal?: Array<number>
  size?: number
  base?: number
}
export interface LearningQuestion {
  id: number
  question: string
  options: Array<string>
  visual: Visual | null
  interaction?: PlayInteraction | null
}
export interface LessonContent {
  sourceScope?: string
  sourceVideo?: {
    audio: 'english-guide' | 'synthetic-english' | 'silent'
    transcript: string
    poster: string
    audioDownload?: string
  }
  sourceLesson?: {
    materials?: string
    ref?: string
    term?: number
    resource?: string
    local_example?: string
    translation?: string
    lang?: string
    steps: Array<string>
    reflection?: string
    product?: string
    evidence?: string
    teacher_assessment?: string
    original_indicator?: string
    indicator?: string
    source?: string
    curriculum_source?: string
    source_page?: number | null
    source_pdf_page?: number
    supplementary?: boolean
    keyword?: string
  }
  level?: string
  release?: number
  illustration?: string | null
  originalIllustration?: string
  visualGuide?: {
    panels: Array<{ title: string; text: string; image: string }>
    concepts: Array<{ term: string; meaning: string }>
    steps: Array<string>
    experiment: string
    context: string
    reflection: string
    sourceStatus: string
  }
  kind: string
  goals: Array<string>
  notes: Array<string>
  passage: string
  examples: Array<{ question: string; answer: string }>
  activities: Array<string>
  home: string
  safety: string
  scenes: Array<string>
  video: string
  pdf: string
  epub: string
}
export interface LessonSummary {
  id: number
  title: string
  strand: string
  completed: Array<Phase>
}
export interface SubjectLibrary {
  title: string
  progress: number
  resumeId: number | null
  lessons: Array<LessonSummary>
}
export interface LearningLesson extends LessonSummary {
  content: LessonContent
  play: Array<LearningQuestion>
  challenge: Array<LearningQuestion>
}
export interface LearningResult {
  score: number
  passed: boolean
  correct: number
  total: number
  results: Array<{
    questionId: number
    correct: boolean
    correctIndex: number
    explanation: string
  }>
  progress: number
}
