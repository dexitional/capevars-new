import { bandFor } from './storyboard'
import type {
  Beat,
  Check,
  Scene,
  SceneKind,
  SceneVisual,
  Storyboard,
} from './storyboard'
import type { ExploreGuide } from './explore/types'
import type { LearningLesson, LearningQuestion, Visual } from './library'

// Turns a lesson's notes, pictures and Play questions into a storyboard, so a
// lesson without a written script can still be told in the theatre. It only
// reorders what the lesson already says: nothing here invents teaching.

const ICONS: Record<string, string> = {
  mathematics: '🔢',
  numeracy: '🔢',
  english: '📖',
  literacy: '📖',
  science: '🔬',
  computing: '💻',
  creative: '🎨',
  world: '🌍',
  french: '🇫🇷',
  ghanaian: '🗣️',
  ghanaian_ga: '🗣️',
  ghanaian_mfantse: '🗣️',
  history: '🏛️',
  pe: '🏃',
  rme: '🕊️',
}

// What fits a 320px phone: its stage is only 191px tall. The words under the
// stage have room, so a long sentence is shown and read a piece at a time.
const LINE_CHARS = 95
const SCENE_CHARS = 120
const SCENE_POINTS = 3
const MAX_CHECKS = 2
const MAX_PICTURES = 4

const clean = (text: string) => text.replace(/\s+/g, ' ').trim()
const same = (text: string) =>
  text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')

const sentences = (text: string) =>
  clean(text)
    .split(/(?<=[.!?])\s+(?![»”])/)
    .filter(Boolean)

// A long sentence breaks at a comma or semicolon where possible, or else a space.
function pieces(sentence: string) {
  const out: Array<string> = []
  let rest = sentence
  while (rest.length > LINE_CHARS) {
    const window = rest.slice(0, LINE_CHARS)
    const clause = Math.max(window.lastIndexOf(', '), window.lastIndexOf('; '))
    const cut = clause > 30 ? clause + 1 : window.lastIndexOf(' ')
    if (cut <= 0) break
    out.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trim()
  }
  if (rest) out.push(rest)
  return out
}

const NOT_ENGLISH = /[^ -~’‘“”—–…]/
const READ_IT = 'Read the words on the screen.'

const capitalised = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1)

// What a sentence sounds like. The screen keeps it as written, but an English voice
// must not read the language being taught: it would teach the wrong sounds. French
// has a real voice, so it reads its own words. Ghanaian languages wait for a speaker.
function voiceFor(lesson: LearningLesson, subject: string) {
  if (subject === 'french')
    return (line: string): Array<Beat> => {
      const listed = /^Useful French expressions:\s*(.+)$/.exec(line)
      if (listed)
        return [
          { say: 'Here are some useful French expressions.' },
          { say: listed[1]!, lang: 'fr' },
        ]
      const quoted = [...line.matchAll(/«\s*([^»]+?)\s*»/g)].map((m) => m[1]!)
      const english = capitalised(
        line
          .replace(/«[^»]*»/g, 'this phrase')
          .replace(
            /this phrase(, this phrase)*,? and this phrase/g,
            'these words',
          ),
      )
      if (NOT_ENGLISH.test(english)) return [{ say: line, lang: 'fr' }]
      return [
        { say: english },
        ...quoted
          .filter((q) => !/\.\.\.|…/.test(q))
          .map((say): Beat => ({ say, lang: 'fr' })),
      ]
    }
  if (subject.startsWith('ghanaian')) {
    const phrase = phraseOf(lesson)?.phrase
    return (line: string): Array<Beat> => {
      const out = (
        phrase
          ? line
              .split(`“${phrase}”`)
              .join('this phrase')
              .split(phrase)
              .join('this phrase')
          : line
      ).replace(/“([^”]+)”/g, (all, inner: string) =>
        NOT_ENGLISH.test(inner) ? 'this phrase' : all,
      )
      return [
        {
          say: NOT_ENGLISH.test(out) ? READ_IT : capitalised(out),
        },
      ]
    }
  }
  return (line: string): Array<Beat> => [{ say: line }]
}

function phraseOf(lesson: LearningLesson) {
  for (const goal of lesson.content.goals) {
    const match = /“([^”]+)”[^“]*“([^”]+)”/.exec(goal)
    if (match) return { phrase: match[1]!, meaning: match[2]! }
  }
  return null
}

// Questions about the lesson itself test nothing a learner has just been taught.
const ABOUT_THE_LESSON =
  /mainly about|learning material or support|best activity|connected with this lesson|does this grade use|main skill in this lesson|resource helps us explore/i

function promptOf(question: LearningQuestion, title: string) {
  let text = clean(question.question.split('\n')[0]!)
  for (const mark of [`${title} — `, `${title}: `])
    if (text.startsWith(mark)) text = text.slice(mark.length)
  return text
}

function pictureOf(visual: Visual | null, level: string): SceneVisual | null {
  if (!visual) return null
  if (visual.type === 'fraction' && visual.parts)
    return {
      type: 'fraction',
      parts: visual.parts,
      filled: visual.filled ?? 0,
      inWords: level === 'b1' || level === 'b2',
    }
  if (visual.type === 'array' && visual.rows && visual.cols)
    return { type: 'array', rows: visual.rows, cols: visual.cols }
  if (visual.type === 'clock' && visual.hour !== undefined)
    return { type: 'clock', hour: visual.hour, minute: 0 }
  return { type: 'legacy', visual }
}

export function buildBoard(
  lesson: LearningLesson,
  level: string,
  subject: string,
  guide?: ExploreGuide,
): Storyboard | null {
  const { content, title } = lesson
  const voice = voiceFor(lesson, subject)
  // A French goal inside an English sentence would be read in the wrong voice.
  const taught = [...content.goals, title].map(clean).filter(Boolean)
  const plain = (text: string) =>
    subject === 'french'
      ? taught.reduce(
          (out, t) => out.split(t).join('today’s topic'),
          clean(text),
        )
      : clean(text)
  const isLanguage = subject === 'french' || subject.startsWith('ghanaian')
  const scenes: Array<Scene> = []
  const said = new Set<string>()
  let lastTeach: string | undefined

  // Lessons repeat themselves across their notes, pictures and steps.
  const fresh = (text: string) => {
    const key = same(text)
    if (!key || said.has(key)) return false
    said.add(key)
    return true
  }
  const scene = (
    kind: SceneKind,
    chapter: string,
    visual: SceneVisual,
    beats: Array<Beat>,
    check?: Check,
  ) => {
    const id = `${kind}-${scenes.length}`
    scenes.push({
      id,
      chapter,
      kind,
      visual,
      beats,
      check,
      reteach: check ? lastTeach : undefined,
    })
    if (kind === 'teach') lastTeach = id
  }
  // Short groups of points, each read as it appears.
  const ideas = (
    kind: SceneKind,
    chapter: string,
    texts: Array<string>,
    heading: string,
    icon?: string,
    repeat = false,
  ) => {
    let points: Array<string> = []
    let beats: Array<Beat> = []
    let parts = 0
    const size = (list: Array<string>) => list.join('').length
    const flush = () => {
      if (!points.length) return
      parts++
      scene(
        kind,
        parts > 1 ? `${chapter} ${parts}` : chapter,
        { type: 'idea', heading, icon, points },
        beats.length ? beats : [{ say: READ_IT, show: points.length - 1 }],
      )
      points = []
      beats = []
    }
    for (const sentence of texts.map(plain).flatMap(sentences)) {
      if (!repeat && !fresh(sentence)) continue
      const bits = pieces(sentence)
      // A sentence stays in one scene if it fits in one.
      if (
        points.length + bits.length > SCENE_POINTS ||
        size(points) + size(bits) > SCENE_CHARS
      )
        flush()
      for (const bit of bits) {
        if (
          points.length >= SCENE_POINTS ||
          size(points) + bit.length > SCENE_CHARS
        )
          flush()
        points.push(bit)
        if (!isLanguage) beats.push({ say: bit, show: points.length - 1 })
      }
      if (isLanguage)
        beats.push(
          ...voice(sentence).map((b) => ({ ...b, show: points.length - 1 })),
        )
    }
    flush()
  }

  const phrase = subject.startsWith('ghanaian') ? phraseOf(lesson) : null
  const language = content.sourceLesson?.lang ?? 'this language'
  const goal = content.goals[0] ? clean(content.goals[0]) : ''
  const picture = content.visualGuide?.panels ?? []
  const concepts = content.visualGuide?.concepts ?? []
  const notes = content.notes.map(clean).filter(Boolean)
  if (!notes.length && !picture.length) return null

  if (guide) return guideBoard()

  // Open: the lesson's name, and what it is for.
  scene(
    'hook',
    'Welcome',
    {
      type: 'title',
      icon: ICONS[subject] ?? '⭐',
      title,
      // A long title fills a small stage by itself.
      tagline: title.length > 55 ? undefined : lesson.strand,
    },
    [
      {
        say: isLanguage
          ? 'Let us start today’s language lesson.'
          : goal && same(goal) !== same(title)
            ? `Today's goal: ${goal}`
            : `Today's lesson: ${title}.`,
      },
    ],
  )
  fresh(goal)

  // The phrase being taught, on the screen and never in an English voice.
  if (phrase) {
    fresh(phrase.phrase)
    scene(
      'teach',
      'The phrase',
      {
        type: 'phrase',
        lang: language,
        items: [{ phrase: phrase.phrase, meaning: phrase.meaning }],
      },
      [
        { say: `This phrase means: ${phrase.meaning}.` },
        { say: 'Look at how it is written.', show: 0 },
        {
          say: `Ask someone who speaks ${language} to say it for you.`,
          show: 0,
        },
      ],
    )
  }

  // Teach: what the notes say, then named ideas where the lesson lists them.
  const meanings = concepts.map((c) => same(c.meaning))
  const teaching = notes.filter(
    (n) => !meanings.some((m) => m && same(n).includes(m)),
  )
  ideas('teach', 'Big idea', teaching, 'Big idea', '💡')
  const terms = concepts
    .filter((c) => c.term && c.meaning && fresh(`${c.term} ${c.meaning}`))
    .slice(0, 6)
  if (terms.length)
    scene(
      'teach',
      'New words',
      { type: 'terms', terms },
      terms.map((c, show) => ({ say: `${c.term}: ${c.meaning}`, show })),
    )
  // A lesson without a picture guide may still name its parts: "SUNNY: The sun…".
  if (!content.visualGuide) {
    const named = content.scenes
      .map((s) => /^([A-Z][A-Z ]+):\s*(.+)$/.exec(clean(s)))
      .filter((m): m is RegExpExecArray => Boolean(m))
      .filter((m) => fresh(m[2]!))
      .slice(0, 6)
    if (named.length)
      scene(
        'teach',
        'New words',
        {
          type: 'terms',
          terms: named.map((m) => ({ term: m[1]!, meaning: m[2]! })),
        },
        named.map((m, show) => ({ say: `${m[1]}: ${m[2]}`, show })),
      )
  }

  // Questions come from the Play bank, so the server holds their answers.
  const bank = lesson.play.filter(
    (q) =>
      !q.interaction &&
      !ABOUT_THE_LESSON.test(q.question) &&
      q.options.length > 1 &&
      !(isLanguage && NOT_ENGLISH.test(promptOf(q, title))) &&
      !(isLanguage && q.question.includes('«')) &&
      !(phrase && q.question.includes(phrase.phrase)),
  )
  const questions = bank.slice(0, MAX_CHECKS)
  const ask = () => {
    const question = questions.shift()
    if (!question) return
    const prompt = promptOf(question, title)
    fresh(prompt)
    const visual = pictureOf(question.visual, level)
    scene(
      'check',
      'Your turn',
      visual ?? {
        type: 'idea',
        heading: 'Your turn',
        icon: '✏️',
        points: ['Think about what you have just learned.'],
      },
      [
        {
          say: visual ? 'Look at this picture.' : 'Now it is your turn.',
          show: 9,
        },
      ],
      {
        type: 'choice',
        prompt,
        options: question.options,
        answer: -1,
        questionId: question.id,
        mute: isLanguage || undefined,
      },
    )
  }
  ask()

  // Read together, a little at a time: the page below keeps the whole passage.
  if (content.passage && !isLanguage) {
    const passage = sentences(content.passage)
      .filter(fresh)
      .flatMap(pieces)
      .slice(0, 8)
    for (let i = 0; i < passage.length; i += 2) {
      const pair = passage.slice(i, i + 2)
      scene(
        'teach',
        i ? `Read together ${i / 2 + 1}` : 'Read together',
        { type: 'words', sentences: pair.map((text) => ({ text })) },
        pair.map((say) => ({ say })),
      )
    }
  }

  // Look: each different picture, with whatever it adds to the notes.
  const seenImages = new Set<string>()
  let looks = 0
  for (const panel of picture) {
    if (looks >= MAX_PICTURES || !panel.image || seenImages.has(panel.image))
      continue
    const fresher = sentences(plain(panel.text)).filter(fresh)
    const beats = isLanguage
      ? fresher.flatMap(voice)
      : fresher.flatMap(pieces).map((say): Beat => ({ say }))
    if (!beats.length) continue
    seenImages.add(panel.image)
    looks++
    scene(
      'teach',
      looks > 1 ? `Look closely ${looks}` : 'Look closely',
      { type: 'image', src: panel.image, alt: clean(panel.text) || title },
      beats.map((beat) => ({ ...beat, show: 0 })),
    )
  }
  if (!looks && content.illustration && !picture.length)
    scene(
      'hook',
      'Look closely',
      { type: 'image', src: content.illustration, alt: title },
      [{ say: 'Look at this picture. What do you notice?' }],
    )

  // Think: a worked example to answer in the head before seeing it.
  const example = isLanguage
    ? undefined
    : content.examples.find(
        (e) =>
          e.question.length > 5 &&
          e.answer.length < 160 &&
          !/what do you notice/i.test(e.question) &&
          fresh(e.question),
      )
  if (example)
    scene(
      'example',
      'Think it through',
      {
        type: 'idea',
        heading: 'Think it through',
        icon: '🤔',
        points: pieces(clean(example.question)).slice(0, 2),
      },
      [{ say: 'Think about this one.', show: 9 }],
      {
        type: 'reveal',
        prompt: clean(example.question),
        answer: clean(example.answer),
      },
    )

  ask()

  // A lesson's safety advice always comes before what it asks a child to do.
  const safety = clean(content.safety)
  if (safety) ideas('teach', 'Stay safe', [safety], 'Stay safe', '🦺')
  ideas('teach', 'Try it', content.activities.slice(0, 2), 'Try it', '🙌')

  if (phrase)
    scene(
      'try',
      'Say it',
      {
        type: 'phrase',
        lang: language,
        items: [{ phrase: phrase.phrase, meaning: phrase.meaning }],
      },
      [{ say: 'Now it is your turn to say it.', show: 0 }],
      {
        type: 'say',
        phrase: phrase.phrase,
        meaning: phrase.meaning,
        lang: language,
        prompt: 'Practise saying this phrase out loud.',
      },
    )

  // Close on the goal, and something to do away from the screen.
  const home = clean(content.home)
  const closing = [
    !isLanguage && goal && same(goal) !== same(title)
      ? `Remember: ${goal}`
      : '',
    home && !said.has(same(home)) ? `At home: ${home}` : '',
  ].filter(Boolean)
  ideas(
    'recap',
    'Well done',
    closing.length
      ? closing
      : ['Well done! You have finished this part of the lesson.'],
    'Well done',
    '⭐',
    true,
  )

  return finished()

  function finished(): Storyboard {
    return {
      id: `${level}/${subject}/${content.key ?? `lesson-${lesson.id}`}`,
      title,
      band: bandFor(content.level ?? level),
      scenes,
    }
  }

  // A written guide already explains the lesson well, so the theatre follows it.
  function guideBoard(): Storyboard {
    const written = guide!
    const beatsOf = (text: string): Array<Beat> =>
      sentences(text)
        .filter(fresh)
        .flatMap(pieces)
        .map((say) => ({ say, show: 0 }))
    scene(
      'hook',
      'Welcome',
      {
        type: 'title',
        icon: ICONS[subject] ?? '⭐',
        title,
        tagline: lesson.strand,
      },
      beatsOf(written.hook),
    )
    const told = written.explain.flatMap(beatsOf)
    scene(
      'teach',
      'Big idea',
      { type: 'art', art: written.art, alt: written.artCaption },
      told.length ? told : [{ say: written.artCaption, show: 0 }],
    )
    const words = written.words.filter((w) => fresh(w.term))
    if (words.length)
      scene(
        'teach',
        'New words',
        { type: 'terms', terms: words },
        words.map((w, show) => ({ say: `${w.term}: ${w.meaning}`, show })),
      )
    const worked = written.examples[0]
    if (worked) {
      scene(
        'example',
        'Work it out',
        worked.art
          ? { type: 'art', art: worked.art, alt: worked.title }
          : {
              type: 'idea',
              heading: worked.title,
              icon: '🤔',
              points: pieces(clean(worked.situation)),
            },
        [
          { say: clean(worked.situation), show: 0 },
          ...worked.steps.map((say): Beat => ({ say, show: 0 })),
          { say: worked.answer, show: 0 },
        ],
      )
    }
    const usable = lesson.play.filter(
      (q) =>
        !q.interaction &&
        !ABOUT_THE_LESSON.test(q.question) &&
        q.options.length > 1,
    )
    for (const question of usable.slice(0, MAX_CHECKS)) {
      const visual = pictureOf(question.visual, level)
      scene(
        'check',
        'Your turn',
        visual ?? {
          type: 'idea',
          heading: 'Your turn',
          icon: '✏️',
          points: ['Think about what you have just learned.'],
        },
        [
          {
            say: visual ? 'Look at this picture.' : 'Now it is your turn.',
            show: 9,
          },
        ],
        {
          type: 'choice',
          prompt: promptOf(question, title),
          options: question.options,
          answer: -1,
          questionId: question.id,
        },
      )
    }
    const mistake = written.mistakes[0]
    if (mistake)
      scene(
        'teach',
        'Watch out',
        {
          type: 'idea',
          heading: 'Watch out',
          icon: '⚠️',
          points: pieces(mistake.right),
        },
        [{ say: mistake.right, show: 0 }],
      )
    // Safety advice always comes before what the lesson asks a child to do.
    const cautions = written.safety?.slice(0, 2) ?? []
    if (cautions.length)
      scene(
        'teach',
        'Stay safe',
        {
          type: 'idea',
          heading: 'Stay safe',
          icon: '🦺',
          points: cautions.flatMap(pieces),
        },
        cautions.map((say, show) => ({ say, show })),
      )
    scene(
      'recap',
      'Try it yourself',
      {
        type: 'steps',
        steps: written.tryIt.steps.slice(0, 3).map((text) => ({ text })),
      },
      written.tryIt.steps.slice(0, 3).map((say, show) => ({ say, show })),
    )
    return finished()
  }
}
