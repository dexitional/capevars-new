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
  // Fifty numbers from start; focus lights its neighbours, marked are shaded.
  | { kind: 'chart'; start: number; focus?: number; marked?: Array<number> }
  | { kind: 'compare'; a: number; b: number }
  | {
      kind: 'balance'
      left: string
      right: string
      equal: boolean
      // Needed when the sides are things, not sums the drawing can add up.
      heavier?: 'left' | 'right'
    }
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
  | {
      kind: 'clock'
      hour: number
      minute?: number
      roman?: boolean
      label?: string
    }
  | { kind: 'tally'; rows: Array<[string, number]> }
  | {
      kind: 'picto'
      rows: Array<[string, number]>
      item: 'mango' | 'book' | 'child'
    }
  | {
      kind: 'people'
      ground: 'grass' | 'track' | 'floor' | 'compound'
      people: Array<Figure>
      // Balls placed on the scene, as [x, y] on a 640 by 360 picture.
      balls?: Array<[number, number]>
      cones?: Array<number>
      sun?: boolean
      label?: string
    }
  | { kind: 'course'; path: 'line' | 'zigzag'; ball?: boolean; label?: string }
  | { kind: 'pulse'; label?: string }
  | { kind: 'timeline'; events: Array<[string, string]>; focus?: number }
  | { kind: 'sources'; items: Array<HistorySource> }
  | {
      kind: 'building'
      building:
        'fort' | 'lighthouse' | 'mosque' | 'palace' | 'school' | 'hospital'
      // Forts and lighthouses stand by the sea unless this says otherwise.
      coast?: boolean
      label?: string
    }
  | { kind: 'scroll'; title: string; lines: Array<string>; date?: string }
  | { kind: 'family'; rows: Array<Array<string>> }
  | { kind: 'flag'; label?: string }
  | { kind: 'belts'; belts: Array<{ name: string; places: Array<string> }> }
  | { kind: 'thenNow'; rows: Array<ThenNow> }
  | { kind: 'triangle'; label?: string }
  | { kind: 'cocoa'; label?: string }
  | { kind: 'ballot'; label?: string }
  | { kind: 'goods'; items: Array<Good>; label?: string }
  // Coins by value in pesewas: 1, 5, 10, 20, 50 or 100 (one cedi).
  | { kind: 'coins'; coins: Array<number>; label?: string }
  | { kind: 'repeat'; items: Array<Motif | null>; label?: string }
  | { kind: 'grid'; rows: number; cols: number; label?: string }
  | { kind: 'angle'; degrees: number; label?: string }
  | { kind: 'ruler'; cm: number; label?: string }
  | { kind: 'compass'; eight?: boolean; label?: string }
  | { kind: 'symmetry'; shape: 'butterfly' | 'house' | 'leaf'; label?: string }
  // Square units; with shaded, also tenths or hundredths of a whole.
  | {
      kind: 'area'
      rows: number
      cols: number
      shaded?: number
      label?: string
    }
  | { kind: 'fractionLine'; parts: number; mark: number; label?: string }
  | { kind: 'bars'; rows: Array<[string, number]>; label?: string }
  | {
      kind: 'doubleBars'
      keys: [string, string]
      rows: Array<[string, number, number]>
      label?: string
    }
  // Column headings and digits, such as ['Th', '4'] or ['Tenths', '7'].
  | { kind: 'placeValue'; places: Array<[string, string]>; label?: string }
  | { kind: 'factorTree'; n: number; label?: string }
  | {
      kind: 'cubes'
      length: number
      width: number
      height: number
      label?: string
    }
  | {
      kind: 'spinner'
      sectors: Array<Tone>
      // Numbers the sectors 1, 2, 3 and so on.
      numbered?: boolean
      label?: string
    }
  | { kind: 'reflect'; move?: 'reflect' | 'translate'; label?: string }
  | {
      kind: 'numberLine'
      from: number
      to: number
      marks: Array<number>
      label?: string
    }
  | { kind: 'lineGraph'; points: Array<[string, number]>; label?: string }
  | { kind: 'net'; solid: 'box' | 'prism'; label?: string }
  // Rows of counters, one row for each part of a ratio.
  | { kind: 'ratio'; parts: Array<[string, number]>; label?: string }
  | {
      kind: 'position'
      word: 'above' | 'below' | 'beside' | 'in front of' | 'behind' | 'inside'
    }

export type Tone = 'red' | 'blue' | 'yellow' | 'green'

export type Solid =
  'cube' | 'sphere' | 'cylinder' | 'cone' | 'pyramid' | 'box' | 'prism'

export type Pose =
  | 'stand'
  | 'walk'
  | 'beam'
  | 'run'
  | 'skip'
  | 'leap'
  | 'tiptoe'
  | 'reach'
  | 'lean'
  | 'throw'
  | 'catch'
  | 'forehand'
  | 'backhand'
  | 'trap'
  | 'kick'
  | 'volley'
  | 'dance'
  | 'jumpUp'
  | 'crouch'
  | 'land'
  | 'pushUp'
  | 'pushDown'
  | 'drink'
  | 'liftGood'
  | 'liftBad'
  | 'raise'
  | 'pulse'
  | 'sitUp'
  | 'twist'
  | 'hockey'

export interface Figure {
  pose: Pose
  x: number
  facing?: 1 | -1
  // Kit colour, and how broad the build is (about 0.85 to 1.25).
  kit?: number
  build?: number
  holds?: 'ball' | 'racket' | 'box' | 'bottle' | 'lime' | 'stick'
  // A tick or a cross above the figure, for right and wrong ways.
  mark?: 'good' | 'bad'
}
export type Motif = 'star' | 'circle' | 'square' | 'triangle' | 'clap' | 'snap'

export type Good =
  | 'salt'
  | 'fish'
  | 'gold'
  | 'kola'
  | 'shea'
  | 'pot'
  | 'cloth'
  | 'iron'
  | 'cowries'
  | 'jar'
  | 'wax'

export type ThenNow = 'home' | 'travel' | 'message' | 'money'

export type HistorySource =
  | 'coin'
  | 'letter'
  | 'photo'
  | 'pot'
  | 'drum'
  | 'newspaper'
  | 'brochure'
  | 'painting'

export type Shape =
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'circle'
  | 'pentagon'
  | 'hexagon'
  | 'rhombus'
  | 'parallelogram'
  | 'trapezoid'

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
  // Shown before the task. Physical lessons must have it.
  safety?: Array<string>
}

export type CourseGuides = Record<string, ExploreGuide>
