import { bandFor } from './storyboard'
import type { Storyboard } from './storyboard'

// Written lesson scripts. A lesson's id can differ between databases, so a
// script finds its lesson by level, subject and title; a retitled lesson falls
// back to its video. Answers here are marked in the browser: Play question ids
// change when a bank changes, so a script cannot rely on them.

const halvesAndQuarters: Storyboard = {
  id: 'b2/mathematics/explore-halves-and-quarters',
  title: 'Explore halves and quarters',
  band: bandFor('b2'),
  authored: true,
  scenes: [
    {
      id: 'hook',
      chapter: 'Sharing fairly',
      kind: 'hook',
      visual: {
        type: 'title',
        icon: '🍞',
        title: 'Halves and quarters',
        tagline: 'How can we share fairly?',
      },
      beats: [
        { say: 'Ama has one loaf of bread to share with Kofi.' },
        { say: 'How can they both get the same amount?' },
      ],
    },
    {
      id: 'half',
      chapter: 'One-half',
      kind: 'teach',
      visual: { type: 'fraction', parts: 2, filled: 1, inWords: true },
      beats: [
        { say: 'Here is one whole loaf of bread.' },
        {
          say: 'Cut it into two equal parts. Equal means the parts are the same size.',
        },
        { say: 'Each part is called one-half.' },
      ],
    },
    {
      id: 'half-check',
      chapter: 'Try halves',
      kind: 'check',
      visual: { type: 'fraction', parts: 2, filled: 1, inWords: true },
      beats: [{ say: 'Now it is your turn.', show: 1 }],
      reteach: 'half',
      check: {
        type: 'choice',
        prompt:
          'A whole is shared into two equal pieces. What is one piece called?',
        options: ['one-half', 'one-quarter', 'one-third'],
        answer: 0,
        why: 'Two equal parts make two halves.',
      },
    },
    {
      id: 'quarter',
      chapter: 'One-quarter',
      kind: 'teach',
      visual: {
        type: 'fraction',
        form: 'circle',
        parts: 4,
        filled: 1,
        inWords: true,
      },
      beats: [
        { say: 'Here is one whole round cake.' },
        { say: 'Cut it into four equal parts.' },
        {
          say: 'Each part is called one-quarter. Some people say one-fourth. They mean the same thing.',
        },
      ],
    },
    {
      id: 'quarter-check',
      chapter: 'Try quarters',
      kind: 'try',
      visual: {
        type: 'fraction',
        form: 'circle',
        parts: 4,
        filled: 1,
        inWords: true,
      },
      beats: [{ say: 'Look at the cake and count the pieces.', show: 1 }],
      reteach: 'quarter',
      check: {
        type: 'number',
        prompt: 'How many quarters make one whole?',
        answer: 4,
        why: 'Four equal quarters make one whole.',
      },
    },
    {
      id: 'equal',
      chapter: 'Equal or not?',
      kind: 'example',
      visual: {
        type: 'columns',
        left: {
          title: 'Equal',
          items: ['2 pieces, same size', '4 pieces, same size'],
        },
        right: {
          title: 'Not equal',
          items: ['1 big piece, 1 small piece', '4 pieces, different sizes'],
        },
      },
      beats: [
        { say: 'Be careful! Check the sizes before you name the pieces.' },
        { say: 'Two pieces of the same size. These are halves.' },
        { say: 'One big piece and one small piece. These are not halves.' },
        { say: 'Four pieces of the same size. These are quarters.' },
        { say: 'Four pieces of different sizes. These are not quarters.' },
      ],
    },
    {
      id: 'equal-check',
      chapter: 'Try sorting',
      kind: 'check',
      visual: {
        type: 'idea',
        icon: '⚖️',
        heading: 'Check the sizes',
        points: ['Are the two pieces the same size?'],
      },
      beats: [{ say: 'Are the two pieces the same size?' }],
      reteach: 'equal',
      check: {
        type: 'sort',
        prompt: 'Which of these are halves? Sort each one.',
        left: 'Halves',
        right: 'Not halves',
        items: [
          { text: 'Two pieces, same size', side: 'left' },
          { text: 'A big piece and a small piece', side: 'right' },
          { text: 'Two equal pieces', side: 'left' },
          { text: 'A long piece and a short piece', side: 'right' },
        ],
        why: 'Pieces must be the same size before we call them halves.',
      },
    },
    {
      id: 'recap',
      chapter: 'What we learned',
      kind: 'recap',
      visual: {
        type: 'idea',
        icon: '⭐',
        heading: 'What we learned',
        points: [
          'Equal parts are the same size.',
          'Two equal parts: halves.',
          'Four equal parts: quarters.',
        ],
      },
      beats: [
        { say: 'Equal parts are the same size.' },
        { say: 'When there are two equal parts, each one is one-half.' },
        { say: 'When there are four equal parts, each one is one-quarter.' },
        {
          say: 'At home, share a paper rectangle equally between four people.',
        },
      ],
    },
  ],
}

export const BOARDS = new Map<string, Storyboard>([
  ['b2/mathematics/Explore halves and quarters', halvesAndQuarters],
])

export function boardFor(level: string, subject: string, title: string) {
  return BOARDS.get(`${level}/${subject}/${title}`)
}
