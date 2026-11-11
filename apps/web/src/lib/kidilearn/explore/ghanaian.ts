import type { Art, CourseGuides, ExploreGuide } from './types'

// Guides for the Ghanaian language courses: Twi, Ga and Mfantse, Basic 1 to 6.
// Each lesson teaches one phrase from the course's own source data, and the same
// twelve phrases recur at every level, so the guides are built here from one
// table per language and grow with the learner's age.
// - The guides use only those source phrases: no other word in the language is
//   added. A test holds this.
// - No voice reads a phrase. It sits inside «…», shows on the screen, and the
//   narration says "this phrase" instead. Children hear it from a speaker.
// - Explanations are in English and describe customs most Ghanaian homes share.

type Phrase = { phrase: string; meaning: string }
export type Language = {
  name: 'Twi' | 'Ga' | 'Mfantse'
  subject: string
  // Where the language is mainly spoken, for the hook.
  where: string
  // The twelve lesson phrases, in lesson order.
  phrases: Array<Phrase>
}

export const TWI: Language = {
  name: 'Twi',
  subject: 'ghanaian',
  where: 'Twi is spoken by many people across Ghana.',
  phrases: [
    { phrase: 'Maakye', meaning: 'Good morning' },
    { phrase: 'Maaha', meaning: 'Good afternoon' },
    { phrase: 'Maadwo', meaning: 'Good evening' },
    { phrase: 'Meda wo ase', meaning: 'Thank you' },
    { phrase: 'Akwaaba', meaning: 'Welcome' },
    { phrase: 'Agoo', meaning: 'A greeting or call for attention' },
    { phrase: 'Wo ho te sɛn?', meaning: 'How are you?' },
    { phrase: 'Me ho yɛ', meaning: 'I am fine' },
    { phrase: 'Baako', meaning: 'One' },
    { phrase: 'Mmienu', meaning: 'Two' },
    { phrase: 'Mmiɛnsa', meaning: 'Three' },
    { phrase: 'Da yie', meaning: 'Sleep well / good night' },
  ],
}

export const GA: Language = {
  name: 'Ga',
  subject: 'ghanaian_ga',
  where: 'Ga is spoken by the Ga people of the Greater Accra area.',
  phrases: [
    { phrase: 'Ojekoo', meaning: 'Good morning' },
    { phrase: "M'naokoo", meaning: 'Good afternoon' },
    { phrase: 'Oshwiee', meaning: 'Good evening' },
    { phrase: 'Oyiwaladɔŋ', meaning: 'Thank you' },
    { phrase: 'Miifala', meaning: 'Welcome' },
    { phrase: 'Ofainɛ', meaning: 'Please' },
    { phrase: 'Te oyɔɔ tɛŋ?', meaning: 'How are you?' },
    { phrase: 'Miyɔɔ tɛŋŋ', meaning: 'I am fine' },
    { phrase: 'Kome', meaning: 'One' },
    { phrase: 'Enyɔ', meaning: 'Two' },
    { phrase: 'Etɛ', meaning: 'Three' },
    { phrase: 'Yaaba jogbaŋŋ', meaning: 'Goodbye' },
  ],
}

export const MFANTSE: Language = {
  name: 'Mfantse',
  subject: 'ghanaian_mfantse',
  where:
    'Mfantse is spoken in the Central Region, in towns such as Cape Coast.',
  phrases: [
    { phrase: 'Me ma wo akye', meaning: 'Good morning' },
    { phrase: 'Me ma wo aha', meaning: 'Good afternoon' },
    { phrase: 'Me ma wo adwe', meaning: 'Good evening' },
    { phrase: 'Meda wo ase', meaning: 'Thank you' },
    { phrase: 'Akwaaba', meaning: 'Welcome' },
    { phrase: 'Agoo', meaning: 'A greeting or call for attention' },
    { phrase: 'Wo ho tse dɛn?', meaning: 'How are you?' },
    { phrase: 'Moho ye', meaning: 'I am fine' },
    { phrase: 'Kor', meaning: 'One' },
    { phrase: 'Ebien', meaning: 'Two' },
    { phrase: 'Ebaasa', meaning: 'Three' },
    { phrase: 'Da yie', meaning: 'Good night' },
  ],
}

type Band = 'young' | 'middle' | 'older'
const bandOf = (level: number): Band =>
  level <= 2 ? 'young' : level <= 4 ? 'middle' : 'older'

// What each lesson asks the learner to do, from its title.
const ACTIVITY = [
  'Observe and listen',
  'Speak clearly',
  'Take turns',
  'Read the words',
  'Write the words',
  'Choose the context',
  'Listen and respond',
  'Work in pairs',
  'Read with expression',
  'Explain the meaning',
  'Create a dialogue',
  'Share and reflect',
]

const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

function build(L: Language, i: number, level: number): ExploreGuide {
  const band = bandOf(level)
  const p = L.phrases[i]!
  const q = (n: number) => `«${L.phrases[n]!.phrase}»`
  const say = q(i)
  const meaning = lower(p.meaning)
  const word = (n: number) => ({
    term: L.phrases[n]!.phrase,
    meaning: `${L.phrases[n]!.meaning}.`,
  })
  const talk = (lines: Array<[0 | 1, number]>): Art => ({
    kind: 'dialogue',
    lines: lines.map(([who, n]) => ({ who, text: L.phrases[n]!.phrase })),
  })
  const others = (pool: Array<number>) =>
    pool.filter((n) => n !== i).map((n) => L.phrases[n]!.phrase)
  const quizFor = (prompt: string, pool: Array<number>, why: string) => [
    {
      prompt,
      options: [p.phrase, ...others(pool).slice(0, 2)],
      answer: 0,
      why,
    },
  ]
  const tasks: Record<Band, Array<string>> = {
    young: [
      `${ACTIVITY[i]}: ask a speaker to say the phrase.`,
      'Copy it slowly, two or three times.',
      'Use it with a friend or someone at home.',
    ],
    middle: [
      `${ACTIVITY[i]}: listen to a speaker say the phrase.`,
      'Practise it until it sounds like theirs.',
      'Use it three times today, at the right moment.',
    ],
    older: [
      `${ACTIVITY[i]}: ask a speaker when they use the phrase, and with whom.`,
      'Write the phrase and its meaning in your book.',
      'Teach it to a younger child.',
    ],
  }
  const goal = {
    code: '',
    text: `Use “${p.phrase}” appropriately for “${p.meaning}”.`,
    source: 'kidilearn' as const,
  }
  const base = {
    indicator: goal,
    words: [word(i)],
    realLife: [
      'Greeting family members at home.',
      'Greeting teachers and visitors at school.',
      'Visiting relatives who speak the language.',
    ],
    tryIt: { need: `A speaker of ${L.name}`, steps: tasks[band] },
    sayIt: p,
  }

  const greeting = (
    when: string,
    time: string,
    moment: string,
    others3: [number, number],
  ) => ({
    ...base,
    hook:
      band === 'young'
        ? `How do we greet people ${when} in ${L.name}?`
        : `${L.where} Let us learn how its speakers greet each other ${when}.`,
    explain: [
      `To say ${meaning} in ${L.name}, people say ${say}.`,
      `Use it ${time}.`,
      band === 'young'
        ? 'Children usually greet grown-ups first, with a smile.'
        : 'In Ghana, younger people usually greet older people first. Not greeting can seem rude.',
    ],
    art: talk([
      [0, i],
      [1, i],
    ]),
    artCaption: `Two people greet each other ${when}.`,
    words:
      band === 'young'
        ? [word(i)]
        : [word(i), word(others3[0]), word(others3[1])],
    examples: [
      {
        title: 'The right time',
        situation: `It is ${moment}. You meet your grandmother. Which greeting fits?`,
        steps: [
          `The greeting for this time is ${say}.`,
          'Greet her first, because she is older.',
        ],
        answer: `Say ${say} with a smile.`,
      },
    ],
    mistakes: [
      {
        wrong: 'Using the greeting for the wrong time of day.',
        right: `Use ${say} only ${time}.`,
      },
    ],
    quiz: quizFor(
      `Which phrase means ${meaning}?`,
      [0, 1, 2],
      `That is the greeting for ${moment}.`,
    ),
  })

  switch (i) {
    case 0:
      return greeting('in the morning', 'in the morning', 'the morning', [1, 2])
    case 1:
      return greeting(
        'in the afternoon',
        'from about midday until late afternoon',
        'early afternoon',
        [0, 2],
      )
    case 2:
      return greeting(
        'in the evening',
        'after sunset, in the evening',
        'the evening',
        [0, 1],
      )
    case 3:
      return {
        ...base,
        hook: 'Someone gives you a gift or helps you. What do you say?',
        explain: [
          `To say thank you in ${L.name}, people say ${say}.`,
          'Say it when someone gives you something, helps you or shares food with you.',
          band === 'young'
            ? 'Take things with your right hand, or with both hands.'
            : 'In Ghana, people give and receive with the right hand, or with both hands to show respect.',
        ],
        art: talk([[1, 3]]),
        artCaption: 'A child says thank you for a gift.',
        examples: [
          {
            title: 'A gift',
            situation: 'Your aunt gives you a mango. What do you do?',
            steps: [
              'Take it with your right hand or both hands.',
              `Say ${say}.`,
            ],
            answer: 'Receive it politely and say thank you.',
          },
        ],
        mistakes: [
          {
            wrong: 'Taking a gift with your left hand.',
            right: 'Use your right hand, or both hands.',
          },
        ],
        quiz: quizFor(
          'Which phrase means thank you?',
          [3, 4, 5],
          'That is how you say thank you.',
        ),
      }
    case 4:
      return {
        ...base,
        hook:
          band === 'young'
            ? 'A visitor is at the door! How do we welcome them?'
            : 'Ghana is known for its warm welcome. How do you welcome a visitor?',
        explain: [
          `To say welcome in ${L.name}, people say ${say}.`,
          'Say it when a visitor arrives at your home or your school.',
          'In many Ghanaian homes, a visitor is welcomed and offered water to drink.',
        ],
        art:
          L.name === 'Ga'
            ? talk([
                [0, 0],
                [1, 4],
              ])
            : talk([
                [0, 5],
                [1, 4],
              ]),
        artCaption: 'A visitor arrives and is welcomed.',
        examples: [
          {
            title: 'A visitor',
            situation:
              'Your uncle arrives from another town. What do you say and do?',
            steps: [
              `Greet him and say ${say}.`,
              'Offer him a seat and some water.',
            ],
            answer: 'Welcome him warmly.',
          },
        ],
        mistakes: [
          {
            wrong: 'Ignoring a visitor who arrives.',
            right: `Welcome them with ${say} and offer a seat.`,
          },
        ],
        quiz: quizFor(
          'Which phrase means welcome?',
          [4, 3, 7],
          'That is how you welcome a visitor.',
        ),
      }
    case 5:
      if (L.name === 'Ga')
        return {
          ...base,
          hook: 'Asking politely makes people happy to help. How do you say please in Ga?',
          explain: [
            `To say please in Ga, people say ${say}.`,
            'Use it whenever you ask for something.',
            band === 'young'
              ? 'Asking politely shows respect.'
              : 'Asking politely shows respect, especially to older people.',
          ],
          art: talk([
            [0, 5],
            [1, 4],
          ]),
          artCaption: 'A child asks politely.',
          examples: [
            {
              title: 'Asking for help',
              situation:
                'You need your sister to pass you a cup. How do you ask?',
              steps: ['Ask for the cup.', `Add ${say}.`],
              answer: 'Ask politely, then say thank you.',
            },
          ],
          mistakes: [
            {
              wrong: 'Demanding things without asking politely.',
              right: `Add ${say} when you ask.`,
            },
          ],
          quiz: quizFor(
            'Which phrase means please?',
            [5, 3, 4],
            'That is how you say please.',
          ),
        }
      return {
        ...base,
        hook: 'You arrive at a friend’s house and the door is open. How do you let people know you are there?',
        explain: [
          `In ${L.name}, people call out ${say} to ask for attention.`,
          'Say it when you arrive at someone’s house, before you go in.',
          'You can also say it politely when you need to pass through a group of people.',
        ],
        art: talk([
          [0, 5],
          [1, 4],
        ]),
        artCaption: 'A visitor calls out at the door and is welcomed.',
        examples: [
          {
            title: 'At the door',
            situation:
              'You arrive at your grandmother’s compound. What do you do first?',
            steps: [`Call out ${say}.`, 'Wait to be welcomed in.'],
            answer: 'Ask for attention before you walk in.',
          },
        ],
        mistakes: [
          {
            wrong: 'Walking into someone’s house without calling out.',
            right: `Call ${say} and wait to be welcomed.`,
          },
        ],
        quiz: quizFor(
          'Which phrase do you call out when you arrive at someone’s house?',
          [5, 4, 3],
          'That phrase asks for attention.',
        ),
      }
    case 6:
    case 7:
      return {
        ...base,
        hook:
          i === 6
            ? 'After greeting, people often ask how you are. How do they ask in ' +
              L.name +
              '?'
            : 'Someone asks how you are. How do you answer in ' + L.name + '?',
        explain: [
          `To ask how are you, people say ${q(6)}.`,
          `A common answer is ${q(7)}, which means I am fine.`,
          band === 'young'
            ? 'Look at the person and speak kindly.'
            : 'Greeting, asking how someone is and answering usually go together.',
        ],
        art: talk([
          [0, 6],
          [1, 7],
          [0, 3],
        ]),
        artCaption: 'Two people ask and answer how they are.',
        words: [word(6), word(7)],
        examples: [
          {
            title: 'Answering',
            situation: `Your teacher asks ${q(6)}. What do you answer?`,
            steps: ['She is asking how you are.', `Answer ${q(7)}.`],
            answer: 'Answer that you are fine, and smile.',
          },
        ],
        mistakes: [
          {
            wrong: 'Walking away without answering.',
            right: 'Always answer when someone asks how you are.',
          },
        ],
        quiz: quizFor(
          i === 6
            ? 'Which phrase asks how are you?'
            : 'Which phrase means I am fine?',
          [6, 7, 3],
          i === 6
            ? 'That phrase asks how someone is.'
            : 'That phrase means I am fine.',
        ),
      }
    case 8:
    case 9:
    case 10:
      return {
        ...base,
        hook:
          band === 'young'
            ? `Let us count to three in ${L.name}!`
            : `Counting in ${L.name} is useful at the market and in games. Let us count to three.`,
        explain: [
          `One is ${q(8)}, two is ${q(9)} and three is ${q(10)}.`,
          `Today we practise ${meaning}: ${say}.`,
          'Point to one thing at a time as you count.',
        ],
        art: {
          kind: 'cards',
          items: [8, 9, 10].map((n, k) => ({
            icon: String(k + 1),
            label: L.phrases[n]!.phrase,
          })),
        },
        artCaption: `One, two and three in ${L.name}.`,
        words: [word(8), word(9), word(10)],
        examples: [
          {
            title: 'Counting oranges',
            situation:
              i === 8
                ? 'There is one orange on the table. Which number word do you use?'
                : `There are ${meaning} oranges on the table. Which number word do you use?`,
            steps: ['Count them, touching each one.'],
            answer: `Say ${say}.`,
          },
        ],
        mistakes: [
          {
            wrong: 'Saying the numbers out of order.',
            right: 'Count one, two, three, in order.',
          },
        ],
        quiz: quizFor(
          `Which word is ${meaning}?`,
          [8, 9, 10],
          `That is the word for ${meaning}.`,
        ),
      }
    default:
      return {
        ...base,
        hook:
          L.name === 'Ga'
            ? 'When you leave, it is kind to say goodbye. How do we say it in Ga?'
            : `At bedtime, families wish each other a good night. How do we say it in ${L.name}?`,
        explain: [
          L.name === 'Ga'
            ? `To say goodbye in Ga, people say ${say}.`
            : `To wish someone a good night, people say ${say}.`,
          L.name === 'Ga'
            ? 'Say it when you leave someone, or when they leave you.'
            : 'Say it at bedtime, to your family.',
          band === 'young'
            ? 'Kind words at the end of the day make everyone happy.'
            : 'Ending the day kindly is part of good manners at home.',
        ],
        art: talk([
          [0, 11],
          [1, 11],
        ]),
        artCaption:
          L.name === 'Ga'
            ? 'Two friends say goodbye.'
            : 'A family says good night.',
        examples: [
          {
            title: L.name === 'Ga' ? 'Leaving' : 'Bedtime',
            situation:
              L.name === 'Ga'
                ? 'You are leaving your friend’s house. What do you say?'
                : 'It is bedtime. What do you say to your mother?',
            steps: [`Say ${say}.`],
            answer: 'End kindly.',
          },
        ],
        mistakes: [
          {
            wrong:
              L.name === 'Ga'
                ? 'Leaving without a word.'
                : 'Going to bed without a word.',
            right: `Say ${say} first.`,
          },
        ],
        quiz: quizFor(
          `Which phrase means ${meaning}?`,
          [11, 0, 3],
          `That phrase means ${meaning}.`,
        ),
      }
  }
}

// Every lesson's guide for one language at one level, keyed as the lessons are.
export function guidesFor(L: Language, level: number): CourseGuides {
  const out: CourseGuides = {}
  L.phrases.forEach((_, i) => {
    out[`${L.subject}-${String(i + 1).padStart(2, '0')}`] = build(L, i, level)
  })
  return out
}
