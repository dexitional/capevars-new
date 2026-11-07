// A lesson's Explore section: what the idea means, how to work with it and where
// a child meets it. Written to one level's scope in the NaCCA curriculum.

export type Art =
  | {
      kind: 'loaf'
      cuts: 1 | 2 | 4
      picked?: number
      unequal?: boolean
      label?: string
    }
  | { kind: 'cake'; parts: number; picked: number; label?: string }
  | {
      kind: 'caps'
      hundreds: number
      tens: number
      ones: number
      label?: string
    }
  | {
      kind: 'groups'
      groups: number
      each: number
      left?: number
      label?: string
    }
  | { kind: 'chart'; start: number; focus: number }
  | { kind: 'compare'; a: number; b: number }
  | { kind: 'balance'; left: string; right: string; equal: boolean }
  | { kind: 'tenframe'; first: number; second: number; label?: string }
  | {
      kind: 'frame'
      rows: Array<[number, number]>
      answer?: [number, number]
      sign: '+' | '−'
    }
  | { kind: 'jumps'; start: number; jumps: Array<number>; label?: string }
  | { kind: 'cedis'; notes: Array<number>; label?: string }
  | { kind: 'pattern'; terms: Array<number | null>; rule?: string }
  | { kind: 'solids'; names: Array<Solid> }
  | { kind: 'shapes'; names: Array<Shape>; labelled?: boolean }
  | { kind: 'sticks'; together: boolean }
  | {
      kind: 'measure'
      unit: 'hand' | 'stick' | 'clip'
      count: number
      label?: string
    }
  | { kind: 'fill'; cups: number; label?: string }
  | { kind: 'bottles'; heights: Array<number>; label?: string }
  | { kind: 'hands'; counts: [number, number]; label?: string }
  | {
      kind: 'calendar'
      month: string
      days: number
      startsOn: number
      focus?: number
    }
  | { kind: 'clock'; hour: number; label?: string }
  | { kind: 'tally'; rows: Array<[string, number]> }
  | { kind: 'picto'; rows: Array<[string, number]>; item: 'mango' | 'book' }

export type Solid = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'pyramid'
export type Shape =
  'square' | 'rectangle' | 'triangle' | 'circle' | 'pentagon' | 'hexagon'

export interface WorkedExample {
  title: string
  // The situation, as a child would meet it.
  situation: string
  steps: Array<string>
  answer: string
  art?: Art
}

export interface ExploreGuide {
  // The curriculum indicator this lesson teaches.
  indicator: { code: string; text: string }
  hook: string
  explain: Array<string>
  art: Art
  artCaption: string
  words: Array<{ term: string; meaning: string }>
  examples: Array<WorkedExample>
  mistakes: Array<{ wrong: string; right: string }>
  realLife: Array<string>
  tryIt: { need: string; steps: Array<string> }
}

export type CourseGuides = Record<string, ExploreGuide>
