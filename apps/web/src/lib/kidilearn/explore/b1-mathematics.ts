import type { CourseGuides } from './types'

// Basic 1 Mathematics, written for this course and scoped to the NaCCA
// Mathematics Curriculum for Primary Schools (2019), in very short sentences
// for six-year-olds. Scope notes:
// - Counting and comparing go to 100; adding and subtracting stay within 20.
// - Halves are in words and pictures only: the curriculum excludes notation.
// - Coins are 1, 5, 10, 20 and 50 pesewas and one cedi.
// - Patterns have 2 to 4 repeating parts; data has up to three categories.

export const guides: CourseGuides = {
  'mathematics-01': {
    indicator: {
      code: 'B1.1.1.1.1',
      text: 'Use number names, counting sequences and how to count to find out “how many?”',
    },
    hook: 'How many mangoes are in the basket? Let us count them together!',
    explain: [
      'We count to find out how many.',
      'Touch each thing once, and say one number for each.',
      'The last number you say tells you how many there are.',
    ],
    art: {
      kind: 'groups',
      groups: 1,
      each: 8,
      label: 'Count: 1, 2, 3, 4, 5, 6, 7, 8',
    },
    artCaption: 'There are 8 bottle caps.',
    words: [
      { term: 'Count', meaning: 'Say numbers in order to find how many.' },
      { term: 'How many', meaning: 'The number of things in a group.' },
      { term: 'Skip count', meaning: 'Count in jumps, such as 2, 4, 6.' },
    ],
    examples: [
      {
        title: 'Count the caps',
        situation: 'How many bottle caps are there?',
        steps: ['Touch each cap once.', 'Say 1, 2, 3, 4, 5, 6, 7, 8.'],
        answer: 'There are 8 caps.',
        art: { kind: 'groups', groups: 1, each: 8 },
      },
      {
        title: 'Count by 10s',
        situation: 'Count by 10s up to 50.',
        steps: ['Say 10, 20, 30, 40, 50.'],
        answer: '10, 20, 30, 40, 50.',
        art: {
          kind: 'pattern',
          terms: [10, 20, 30, 40, 50],
          rule: 'Jump by 10 each time.',
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Touching one cap twice.',
        right: 'Touch each thing only once.',
      },
      {
        wrong: 'Counting 1, 2, 3, 5.',
        right: 'Say every number in order: 1, 2, 3, 4, 5.',
      },
    ],
    realLife: [
      'Counting your pencils.',
      'Counting children in a line.',
      'Counting oranges at the market.',
    ],
    tryIt: {
      need: 'Stones or bottle caps',
      steps: [
        'Put some stones in a line.',
        'Count them, touching each one.',
        'Mix them up and count again. Is it the same?',
      ],
    },
  },
  'mathematics-02': {
    indicator: {
      code: 'B1.1.1.1.2',
      text: 'Identify numbers in different positions around a given number (0–100).',
    },
    hook: 'Every number on a number chart has neighbours. Who lives next to 15?',
    explain: [
      'A number chart shows numbers in rows of ten.',
      'The number to the right is 1 more. The number to the left is 1 less.',
      'The number below is 10 more. The number above is 10 less.',
    ],
    art: { kind: 'chart', start: 1, focus: 15 },
    artCaption: 'The neighbours of 15 are 5, 14, 16 and 25.',
    words: [
      { term: 'Number chart', meaning: 'A grid of numbers in order.' },
      { term: 'Neighbour', meaning: 'A number right next to another.' },
      { term: 'Row', meaning: 'Numbers going across.' },
    ],
    examples: [
      {
        title: 'Find the neighbours',
        situation: 'Which numbers are next to 15?',
        steps: ['Left: 14.', 'Right: 16.', 'Above: 5.', 'Below: 25.'],
        answer: '14, 16, 5 and 25.',
        art: { kind: 'chart', start: 1, focus: 15 },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the number below is 1 more.',
        right: 'Going down a row adds 10.',
      },
    ],
    realLife: [
      'Finding a page in a book.',
      'House numbers on a street.',
      'Seat numbers in church.',
    ],
    tryIt: {
      need: 'A number chart, or one you draw',
      steps: [
        'Point to any number.',
        'Say the number to its left and to its right.',
        'Ask a friend to check.',
      ],
    },
  },
  'mathematics-03': {
    indicator: {
      code: 'B1.1.1.1.3',
      text: 'Use number names and non-standard units for measuring to find out “how long or how much?”',
    },
    hook: 'How long is your desk? You can measure it with your hands!',
    explain: [
      'We can measure with hand spans, feet or sticks.',
      'Put them end to end, with no gaps, and count them.',
      'We can find how much a bucket holds by counting cups of water.',
    ],
    art: {
      kind: 'measure',
      unit: 'hand',
      count: 5,
      label: 'The desk is 5 hand spans long.',
    },
    artCaption: 'Count each hand span.',
    words: [
      { term: 'Measure', meaning: 'Find how long or how much.' },
      {
        term: 'Hand span',
        meaning: 'From your thumb to your little finger, stretched out.',
      },
      { term: 'Long', meaning: 'How far from one end to the other.' },
    ],
    examples: [
      {
        title: 'Measure the desk',
        situation: 'How many hand spans long is the desk?',
        steps: [
          'Start at one end.',
          'Put your hand down, then the next one, with no gaps.',
          'Count: 1, 2, 3, 4, 5.',
        ],
        answer: '5 hand spans.',
        art: { kind: 'measure', unit: 'hand', count: 5 },
      },
      {
        title: 'Fill the bucket',
        situation:
          'Ama pours 7 cups of water into a bucket to fill it. How much does it hold?',
        steps: ['Count the cups.'],
        answer: '7 cups.',
        art: { kind: 'fill', cups: 7 },
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving gaps between hand spans.',
        right: 'Put each one right after the last.',
      },
    ],
    realLife: [
      'Measuring cloth.',
      'Filling a bucket with water.',
      'Measuring rice with a cup.',
    ],
    tryIt: {
      need: 'A cup and a bowl of water, with an adult',
      steps: [
        'Guess how many cups fill the bowl.',
        'Fill it one cup at a time.',
        'Count the cups.',
      ],
    },
  },
  'mathematics-04': {
    indicator: {
      code: 'B1.1.1.1.4',
      text: 'Use comparative language to describe the relationship between quantities up to 100.',
    },
    hook: 'Kofi has 6 sweets. Ama has 9. Who has more?',
    explain: [
      'We say “more than”, “less than” or “the same as” to compare.',
      'Line up two groups to see which has more.',
      'One more than 9 is 10. One less than 9 is 8.',
    ],
    art: { kind: 'compare', a: 6, b: 9 },
    artCaption: '6 is less than 9.',
    words: [
      { term: 'More than', meaning: 'A bigger number.' },
      { term: 'Less than', meaning: 'A smaller number.' },
      { term: 'The same as', meaning: 'Equal, not more or less.' },
    ],
    examples: [
      {
        title: 'Who has more?',
        situation: 'Kofi has 6 sweets. Ama has 9 sweets. Who has more?',
        steps: ['Line up the sweets.', 'Ama has 3 left over with no partner.'],
        answer: 'Ama has more.',
      },
      {
        title: 'One more, one less',
        situation: 'What is one more than 12? What is one less?',
        steps: ['One more: 13.', 'One less: 11.'],
        answer: '13 and 11.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking bigger things are always more.',
        right: 'Count them. Small things can be more in number.',
      },
    ],
    realLife: [
      'Sharing sweets.',
      'Comparing scores in a game.',
      'Who has more pencils.',
    ],
    tryIt: {
      need: 'Two handfuls of beans',
      steps: [
        'Grab a handful each with a friend.',
        'Line them up side by side.',
        'Say who has more.',
      ],
    },
  },
  'mathematics-05': {
    indicator: {
      code: 'B1.1.1.1.5',
      text: 'Represent the comparison of two numbers up to 100 using the symbols >, < or =.',
    },
    hook: 'Some signs are like a hungry crocodile. Its open mouth eats the bigger number!',
    explain: [
      'The sign > means “greater than”. The sign < means “less than”.',
      'The open side always faces the bigger number.',
      'The sign = means “the same as”.',
    ],
    art: { kind: 'compare', a: 23, b: 15 },
    artCaption: '23 > 15: 23 is greater than 15.',
    words: [
      { term: 'Greater than (>)', meaning: 'Bigger than.' },
      { term: 'Less than (<)', meaning: 'Smaller than.' },
      { term: 'Equal to (=)', meaning: 'The same as.' },
    ],
    examples: [
      {
        title: 'Which sign?',
        situation: 'Put the right sign between 8 and 12.',
        steps: ['12 is bigger.', 'The open side faces 12.'],
        answer: '8 < 12.',
        art: { kind: 'compare', a: 8, b: 12 },
      },
    ],
    mistakes: [
      {
        wrong: 'Turning the sign the wrong way.',
        right: 'The open mouth faces the bigger number.',
      },
    ],
    realLife: ['Comparing ages.', 'Comparing scores.', 'Comparing prices.'],
    tryIt: {
      need: 'Number cards',
      steps: [
        'Pick two cards.',
        'Put them side by side.',
        'Draw the right sign between them.',
      ],
    },
  },
  'mathematics-06': {
    indicator: {
      code: 'B1.1.1.1.6',
      text: 'Describe the relationship between quantities and numbers up to 100.',
    },
    hook: 'Johnson has 3 mangoes. Adwoa has 7. What can you say about them?',
    explain: [
      'We can say one number is a little or a lot bigger.',
      '7 is 4 more than 3. 3 is 4 less than 7.',
      'A number line helps us see how far apart numbers are.',
    ],
    art: {
      kind: 'jumps',
      start: 3,
      jumps: [4],
      label: 'From 3 to 7 is 4 more',
    },
    artCaption: '7 is 4 more than 3.',
    words: [
      { term: 'Number line', meaning: 'A line with numbers in order.' },
      { term: 'A lot bigger', meaning: 'Much bigger.' },
      { term: 'A little bigger', meaning: 'Only a bit bigger.' },
    ],
    examples: [
      {
        title: 'Johnson and Adwoa',
        situation: 'Johnson has 3 mangoes. Adwoa has 7. What can you say?',
        steps: [
          'Adwoa has more.',
          'Count on from 3 to 7: 4, 5, 6, 7. That is 4.',
        ],
        answer: 'Adwoa has 4 more mangoes than Johnson.',
      },
      {
        title: 'A little or a lot?',
        situation: 'Is 50 a little or a lot bigger than 49?',
        steps: ['50 is just 1 more than 49.'],
        answer: 'A little bigger.',
      },
    ],
    mistakes: [
      { wrong: 'Only saying who has more.', right: 'Also say how many more.' },
    ],
    realLife: [
      'Comparing marks.',
      'Comparing heights.',
      'Sharing fruit fairly.',
    ],
    tryIt: {
      need: 'Stones',
      steps: [
        'Make a group of 5 and a group of 8.',
        'Say which has more.',
        'Say how many more.',
      ],
    },
  },
  'mathematics-07': {
    indicator: {
      code: 'B1.1.2.1.1',
      text: 'Demonstrate understanding of addition as joining and subtraction as separating; numbers 0 to 20.',
    },
    hook: 'Sena has 8 bottle caps. Kofi gives her 5 more. How many does she have now?',
    explain: [
      'Adding means putting groups together to find how many altogether.',
      'Subtracting means taking some away to find how many are left.',
      'The sign + means add. The sign − means take away.',
    ],
    art: { kind: 'tenframe', first: 8, second: 5, label: '8 + 5 = 13' },
    artCaption: 'Put 8 and 5 together to make 13.',
    words: [
      { term: 'Add (+)', meaning: 'Put together.' },
      { term: 'Subtract (−)', meaning: 'Take away.' },
      { term: 'Altogether', meaning: 'All of them put together.' },
    ],
    examples: [
      {
        title: 'Join them',
        situation: 'Sena has 8 caps. Kofi gives her 5 more. How many now?',
        steps: ['Put the groups together.', '8 + 5 = 13.'],
        answer: 'Sena has 13 caps.',
        art: { kind: 'tenframe', first: 8, second: 5 },
      },
      {
        title: 'Take away',
        situation: 'Kojo has 15 pencils. He gives 7 to Ato. How many are left?',
        steps: ['Take away 7.', '15 − 7 = 8.'],
        answer: 'Kojo has 8 pencils left.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding when something is taken away.',
        right: 'If some go away, subtract.',
      },
    ],
    realLife: ['Sharing sweets.', 'Getting more toys.', 'Eating some oranges.'],
    tryIt: {
      need: 'Bottle caps',
      steps: [
        'Put 6 caps in a group and 4 in another.',
        'Push them together and count.',
        'Take 3 away. How many are left?',
      ],
    },
  },
  'mathematics-08': {
    indicator: {
      code: 'B1.1.2.2.1',
      text: 'Use objects and pictures to solve word problems with unknowns, within 20.',
    },
    hook: 'A box says 13 + __ = 19. What number is hiding in the box?',
    explain: [
      'The sign = means “the same as”. Both sides must be equal.',
      'A box or a line can stand for a missing number.',
      'Use counters to find the missing number.',
    ],
    art: { kind: 'balance', left: '13 + 6', right: '19', equal: true },
    artCaption: '13 + 6 is the same as 19.',
    words: [
      { term: 'Equal (=)', meaning: 'The same as.' },
      { term: 'Missing number', meaning: 'A number we need to find.' },
      { term: 'Counter', meaning: 'A small object used for counting.' },
    ],
    examples: [
      {
        title: 'Find the missing number',
        situation: '13 + __ = 19. What is missing?',
        steps: [
          'Start at 13.',
          'Count on to 19: 14, 15, 16, 17, 18, 19.',
          'That is 6 jumps.',
        ],
        answer: '13 + 6 = 19.',
        art: { kind: 'jumps', start: 13, jumps: [6] },
      },
      {
        title: 'Add them up',
        situation: '9 + 7 = __.',
        steps: ['Start at 9.', 'Count on 7.'],
        answer: '9 + 7 = 16.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking = means “write the answer here”.',
        right: '= means both sides are the same.',
      },
    ],
    realLife: [
      'Sharing equally.',
      'Finding how many more you need.',
      'Balancing a see-saw.',
    ],
    tryIt: {
      need: 'Counters',
      steps: [
        'Make 14 + __ = 18 with counters.',
        'Find the missing number.',
        'Make up your own for a friend.',
      ],
    },
  },
  'mathematics-09': {
    indicator: {
      code: 'B1.1.2.2.2',
      text: 'Use the relationship between addition and subtraction to show equality for numbers within 20.',
    },
    hook: '10 take away 8 is a hard question. Can an adding question help?',
    explain: [
      'Adding and subtracting are connected.',
      '10 − 8 asks: what do I add to 8 to make 10?',
      'Change a take-away into an adding question to make it easier.',
    ],
    art: {
      kind: 'jumps',
      start: 8,
      jumps: [2],
      label: '8 + 2 = 10, so 10 − 8 = 2',
    },
    artCaption: 'Count up from 8 to 10.',
    words: [
      { term: 'Connected', meaning: 'Linked together.' },
      { term: 'Count up', meaning: 'Count forward from a number.' },
      { term: 'Difference', meaning: 'How far apart two numbers are.' },
    ],
    examples: [
      {
        title: 'Take away by adding',
        situation: 'Work out 10 − 8.',
        steps: ['Think: 8 + __ = 10.', 'Count up: 9, 10. That is 2.'],
        answer: '10 − 8 = 2.',
      },
      {
        title: 'Another one',
        situation: 'Work out 7 − 5.',
        steps: ['Think: 5 + __ = 7.', 'Count up: 6, 7. That is 2.'],
        answer: '7 − 5 = 2.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking adding and subtracting are not related.',
        right: 'One undoes the other.',
      },
    ],
    realLife: [
      'Working out change.',
      'How many more you need.',
      'Checking your answers.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write 12 − 9.',
        'Change it to 9 + __ = 12.',
        'Find the answer by counting up.',
      ],
    },
  },
  'mathematics-10': {
    indicator: {
      code: 'B1.1.2.2.3',
      text: 'Generate and solve word problems when given a number sentence, within 20.',
    },
    hook: 'Can you turn 6 − 2 = 4 into a story?',
    explain: [
      'A number sentence is like 6 − 2 = 4.',
      'We can make a story that matches it.',
      'Stories help us see what the numbers mean.',
    ],
    art: {
      kind: 'groups',
      groups: 1,
      each: 6,
      label: '6 bulbs, 2 do not work: 6 − 2 = 4',
    },
    artCaption: 'A story for 6 − 2 = 4.',
    words: [
      {
        term: 'Number sentence',
        meaning: 'Numbers and signs, such as 6 − 2 = 4.',
      },
      { term: 'Story problem', meaning: 'A maths question told as a story.' },
      { term: 'Match', meaning: 'Go together.' },
    ],
    examples: [
      {
        title: 'Make a story',
        situation: 'Make a story for 6 − 2 = 4.',
        steps: [
          'Daniel’s family has 6 bulbs.',
          '2 bulbs do not work.',
          'How many bulbs work?',
        ],
        answer: '4 bulbs work. 6 − 2 = 4.',
      },
      {
        title: 'Your turn',
        situation: 'Make a story for 5 + 3 = 8.',
        steps: [
          'Esi has 5 mangoes.',
          'She picks 3 more.',
          'How many does she have?',
        ],
        answer: 'She has 8 mangoes. 5 + 3 = 8.',
      },
    ],
    mistakes: [
      {
        wrong: 'Making a take-away story for an adding sentence.',
        right: 'For +, the story must put things together.',
      },
    ],
    realLife: [
      'Stories about sharing food.',
      'Stories about buying things.',
      'Stories about friends.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write a number sentence, such as 9 − 4 = 5.',
        'Tell a story that matches it.',
        'Ask your friend to act it out.',
      ],
    },
  },
  'mathematics-11': {
    indicator: {
      code: 'B1.1.2.3.1',
      text: 'Use strategies for basic addition facts and related subtraction facts to 10.',
    },
    hook: 'What do you add to 7 to make 10? Some numbers are good friends!',
    explain: [
      'Pairs that make 10 are friends: 1 and 9, 2 and 8, 3 and 7, 4 and 6, 5 and 5.',
      'A double is a number added to itself, such as 4 + 4 = 8.',
      'One more than 6 is 7. Two more than 6 is 8.',
    ],
    art: { kind: 'tenframe', first: 7, second: 3, label: '7 + 3 = 10' },
    artCaption: '7 and 3 are friends of 10.',
    words: [
      { term: 'Friends of 10', meaning: 'Two numbers that add up to 10.' },
      { term: 'Double', meaning: 'A number added to itself.' },
      { term: 'Strategy', meaning: 'A clever way to work something out.' },
    ],
    examples: [
      {
        title: 'Make 10',
        situation: 'What goes with 6 to make 10?',
        steps: ['Count up from 6: 7, 8, 9, 10.', 'That is 4.'],
        answer: '6 + 4 = 10.',
        art: { kind: 'tenframe', first: 6, second: 4 },
      },
      {
        title: 'Doubles',
        situation: 'What is double 5?',
        steps: ['5 + 5 = 10.'],
        answer: 'Double 5 is 10.',
      },
    ],
    mistakes: [
      {
        wrong: 'Counting every time.',
        right: 'Remember friends of 10 and doubles. They are quicker.',
      },
    ],
    realLife: ['Ten fingers.', 'Pairs of shoes.', 'Two equal teams.'],
    tryIt: {
      need: 'Your ten fingers',
      steps: [
        'Hold up 3 fingers.',
        'How many fingers are down?',
        'Say: 3 and 7 make 10.',
      ],
    },
  },
  'mathematics-12': {
    indicator: {
      code: 'B1.1.2.4.1',
      text: 'Use counting on, counting down and missing addend strategies for adding and subtracting within 20.',
    },
    hook: 'To add 5 + 3, you do not need to count from 1. Start at 5 and count on!',
    explain: [
      'To add, start at the bigger number and count on.',
      'To take away, start at the big number and count back.',
      'You can also make 10 first: 8 + 3 = 8 + 2 + 1 = 11.',
    ],
    art: {
      kind: 'jumps',
      start: 5,
      jumps: [1, 1, 1],
      label: '5 + 3: count on 6, 7, 8',
    },
    artCaption: 'Start at 5 and count on 3.',
    words: [
      { term: 'Count on', meaning: 'Count forward from a number.' },
      { term: 'Count back', meaning: 'Count backward from a number.' },
      { term: 'Make 10', meaning: 'Get to 10 first, then add the rest.' },
    ],
    examples: [
      {
        title: 'Count on',
        situation: 'Work out 5 + 3.',
        steps: ['Start at 5.', 'Count on 3: 6, 7, 8.'],
        answer: '5 + 3 = 8.',
        art: { kind: 'jumps', start: 5, jumps: [1, 1, 1] },
      },
      {
        title: 'Count back',
        situation: 'Work out 15 − 3.',
        steps: ['Start at 15.', 'Count back 3: 14, 13, 12.'],
        answer: '15 − 3 = 12.',
        art: { kind: 'jumps', start: 15, jumps: [-1, -1, -1] },
      },
    ],
    mistakes: [
      {
        wrong: 'Saying the starting number as your first count.',
        right: 'Start at 5, then say 6 as your first count.',
      },
    ],
    realLife: [
      'Adding scores in a game.',
      'Counting money.',
      'Counting days to a birthday.',
    ],
    tryIt: {
      need: 'A number line drawn on the ground',
      steps: [
        'Stand on 7.',
        'Jump forward 4. Where are you?',
        'Now jump back 2.',
      ],
    },
  },
  'mathematics-13': {
    indicator: {
      code: 'B1.1.2.4.2',
      text: 'Solve one-step word problems involving addition and subtraction within 20.',
    },
    hook: 'Ama has 10 mangoes. She gets 3 more. How many does she have? Let us solve maths stories!',
    explain: [
      'Read or listen to the story carefully.',
      'Decide: do things join together, or go away?',
      'Use objects, drawings or counting to find the answer.',
    ],
    art: { kind: 'groups', groups: 2, each: 5, label: 'Draw it to solve it' },
    artCaption: 'Pictures help us solve stories.',
    words: [
      { term: 'Word problem', meaning: 'A maths question told as a story.' },
      { term: 'Altogether', meaning: 'All put together.' },
      { term: 'Left', meaning: 'What remains.' },
    ],
    examples: [
      {
        title: 'Mangoes',
        situation: 'Ama has 10 mangoes and gets 3 more. How many altogether?',
        steps: ['They join together, so add.', '10 + 3 = 13.'],
        answer: 'Ama has 13 mangoes.',
      },
      {
        title: 'How many more?',
        situation:
          'Kafui has 5 pencils. Kwame has 3. How many more does Kafui have?',
        steps: ['Compare them.', '5 − 3 = 2.'],
        answer: 'Kafui has 2 more pencils.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding all the numbers you see.',
        right: 'Think about the story first.',
      },
    ],
    realLife: ['Buying and selling.', 'Sharing toys.', 'Counting animals.'],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Listen to a story from a friend.',
        'Draw it.',
        'Count your drawing to find the answer.',
      ],
    },
  },
  'mathematics-14': {
    indicator: {
      code: 'B1.1.3.1.1',
      text: 'Understand the fraction one-half as one of two equal parts of a whole.',
    },
    hook: 'You have one orange and a friend wants to share. How can you share it fairly?',
    explain: [
      'A whole is one complete thing.',
      'Cut it into two equal parts. Equal means the same size.',
      'Each part is called one-half.',
    ],
    art: {
      kind: 'loaf',
      cuts: 2,
      picked: 0,
      label: 'Two equal parts: each is one-half',
    },
    artCaption: 'One-half is one of two equal parts.',
    words: [
      { term: 'Whole', meaning: 'One complete thing.' },
      { term: 'Half', meaning: 'One of two equal parts.' },
      { term: 'Equal', meaning: 'The same size.' },
    ],
    examples: [
      {
        title: 'Is it a half?',
        situation:
          'A bread is cut into one big piece and one small piece. Is each piece a half?',
        steps: ['Look at the sizes.', 'They are not the same size.'],
        answer: 'No. Halves must be equal.',
        art: { kind: 'loaf', cuts: 2, unequal: true },
      },
    ],
    mistakes: [
      {
        wrong: 'Calling any piece a half.',
        right: 'Halves are two pieces of the same size.',
      },
    ],
    realLife: [
      'Sharing an orange.',
      'Folding paper in half.',
      'Cutting bread for two.',
    ],
    tryIt: {
      need: 'A sheet of paper',
      steps: [
        'Fold it so the edges meet.',
        'Open it. How many parts?',
        'Colour one-half.',
      ],
    },
  },
  'mathematics-15': {
    indicator: {
      code: 'B1.1.3.1.2',
      text: 'Count in halves using concrete and pictorial representations.',
    },
    hook: 'You have some half oranges. Can you count them?',
    explain: [
      'We can count halves: one-half, two-halves, three-halves.',
      'Two halves make one whole.',
      'Four halves make two wholes.',
    ],
    art: {
      kind: 'cake',
      parts: 2,
      picked: 2,
      label: 'Two halves make one whole',
    },
    artCaption: 'Count the halves.',
    words: [
      { term: 'Halves', meaning: 'More than one half.' },
      { term: 'Whole', meaning: 'One complete thing.' },
      { term: 'Count', meaning: 'Say numbers in order.' },
    ],
    examples: [
      {
        title: 'Count the halves',
        situation: 'There are 3 half oranges. Count them.',
        steps: ['Say one-half, two-halves, three-halves.'],
        answer: 'Three-halves.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying “three-two” for three halves.',
        right: 'Say “three-halves”.',
      },
    ],
    realLife: [
      'Half oranges at break time.',
      'Half loaves of bread.',
      'Half sheets of paper.',
    ],
    tryIt: {
      need: 'Paper circles and scissors, with an adult',
      steps: [
        'Cut 2 circles into halves.',
        'Count the halves out loud.',
        'Put them back into wholes.',
      ],
    },
  },
  'mathematics-16': {
    indicator: {
      code: 'B1.1.4.1.1',
      text: 'Recognise Ghanaian coins by name and value and describe the relationship among them.',
    },
    hook: 'Ghana’s coins come in different sizes. Can you name them?',
    explain: [
      'Our coins are 1, 5, 10, 20 and 50 pesewas, and one cedi.',
      'Each coin has a number that shows its value.',
      'Two 5 pesewa coins make 10 pesewas. 100 pesewas make one cedi.',
    ],
    art: {
      kind: 'coins',
      coins: [1, 5, 10, 20, 50, 100],
      label: 'Ghana’s coins',
    },
    artCaption: 'Pesewas and one cedi.',
    words: [
      { term: 'Coin', meaning: 'Round metal money.' },
      { term: 'Pesewa', meaning: 'A small unit of Ghana’s money.' },
      { term: 'Cedi', meaning: 'Ghana’s money. One cedi is 100 pesewas.' },
    ],
    examples: [
      {
        title: 'Swap coins',
        situation: 'How many 5 pesewa coins make 10 pesewas?',
        steps: ['5 + 5 = 10.'],
        answer: 'Two 5 pesewa coins.',
        art: { kind: 'coins', coins: [5, 5] },
      },
      {
        title: 'Make a cedi',
        situation: 'How many 50 pesewa coins make one cedi?',
        steps: ['50 + 50 = 100.', '100 pesewas make one cedi.'],
        answer: 'Two 50 pesewa coins.',
        art: { kind: 'coins', coins: [50, 50] },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a bigger coin is always worth more.',
        right: 'Read the number on the coin.',
      },
    ],
    realLife: [
      'Buying sweets.',
      'Saving coins in a money box.',
      'Paying for a trotro ride.',
    ],
    tryIt: {
      need: 'Coins, with an adult',
      steps: [
        'Sort the coins by value.',
        'Find two coins that make 10 pesewas.',
        'Find coins that make one cedi.',
      ],
    },
  },
  'mathematics-17': {
    indicator: {
      code: 'B1.2.1.1.1',
      text: 'Demonstrate an understanding of repeating patterns with 2 to 4 repeating elements.',
    },
    hook: 'Clap, snap, clap, snap. What comes next?',
    explain: [
      'A pattern repeats again and again.',
      'Find the part that repeats. Then you can say what comes next.',
      'Patterns can be shapes, sounds, actions or numbers.',
    ],
    art: {
      kind: 'repeat',
      items: ['star', 'circle', 'star', 'circle', 'star', null],
      label: 'Star, circle, star, circle… what comes next?',
    },
    artCaption: 'The part that repeats is star, circle.',
    words: [
      { term: 'Pattern', meaning: 'Something that repeats in order.' },
      { term: 'Repeat', meaning: 'Happen again and again.' },
      { term: 'Next', meaning: 'What comes after.' },
    ],
    examples: [
      {
        title: 'What comes next?',
        situation: 'Star, circle, star, circle, star, ___.',
        steps: [
          'The part that repeats is star, circle.',
          'After star comes circle.',
        ],
        answer: 'Circle.',
      },
      {
        title: 'A sound pattern',
        situation: 'Clap, clap, snap, clap, clap, ___.',
        steps: ['The part that repeats is clap, clap, snap.'],
        answer: 'Snap.',
        art: {
          kind: 'repeat',
          items: ['clap', 'clap', 'snap', 'clap', 'clap', null],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Guessing without finding what repeats.',
        right: 'Find the repeating part first.',
      },
    ],
    realLife: [
      'Patterns in kente cloth.',
      'Clapping in songs.',
      'Beads on a string.',
    ],
    tryIt: {
      need: 'Beads or bottle caps of two colours',
      steps: [
        'Make a pattern: red, blue, red, blue.',
        'Ask a friend what comes next.',
        'Make a pattern with three parts.',
      ],
    },
  },
  'mathematics-18': {
    indicator: {
      code: 'B1.3.1.1.1',
      text: 'Distinguish between attributes that define a shape and attributes that do not.',
    },
    hook: 'Is a big red triangle still a triangle if it is small and blue? Yes! Why?',
    explain: [
      'A triangle has 3 sides and 3 corners. That makes it a triangle.',
      'Its colour and size do not change its name.',
      'Turning a shape does not change its name either.',
    ],
    art: { kind: 'shapes', names: ['triangle', 'square', 'circle'] },
    artCaption: 'Sides and corners give a shape its name.',
    words: [
      { term: 'Side', meaning: 'A straight edge of a shape.' },
      { term: 'Corner', meaning: 'Where two sides meet.' },
      { term: 'Shape', meaning: 'The form of something.' },
    ],
    examples: [
      {
        title: 'Still a triangle?',
        situation: 'A triangle is turned upside down. Is it still a triangle?',
        steps: ['It still has 3 sides and 3 corners.'],
        answer: 'Yes, it is still a triangle.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking colour makes a different shape.',
        right: 'Only sides and corners matter.',
      },
    ],
    realLife: [
      'Shapes on signs.',
      'Shapes in your classroom.',
      'Shapes in drawings.',
    ],
    tryIt: {
      need: 'Paper shapes in different colours',
      steps: [
        'Sort them by shape, not by colour.',
        'Count the sides of each.',
        'Say each shape’s name.',
      ],
    },
  },
  'mathematics-19': {
    indicator: {
      code: 'B1.3.1.1.2',
      text: 'Identify three-dimensional shapes, including spheres, cylinders, rectangular prisms, cubes and triangular prisms.',
    },
    hook: 'A ball, a tin and a box are all solid shapes. Do you know their names?',
    explain: [
      'A ball is a sphere. It is round all over.',
      'A tin of milk is a cylinder. A box is a rectangular prism, also called a cuboid.',
      'A dice is a cube. A tent can look like a triangular prism.',
    ],
    art: {
      kind: 'solids',
      names: ['sphere', 'cylinder', 'box', 'cube', 'prism'],
    },
    artCaption: 'Solid shapes all around us.',
    words: [
      { term: 'Sphere', meaning: 'A shape round like a ball.' },
      { term: 'Cylinder', meaning: 'A shape like a tin.' },
      { term: 'Cube', meaning: 'A box with all sides the same size.' },
    ],
    examples: [
      {
        title: 'Name it',
        situation: 'What shape is a tin of milk?',
        steps: ['It has two round flat ends.', 'It has a curved side.'],
        answer: 'A cylinder.',
        art: { kind: 'solids', names: ['cylinder'] },
      },
    ],
    mistakes: [
      {
        wrong: 'Calling a sphere a circle.',
        right: 'A circle is flat. A sphere is a solid ball.',
      },
    ],
    realLife: [
      'A football is a sphere.',
      'A milk tin is a cylinder.',
      'A chalk box is a cuboid.',
    ],
    tryIt: {
      need: 'Things from home',
      steps: [
        'Find a ball, a tin and a box.',
        'Name each shape.',
        'Which ones can roll?',
      ],
    },
  },
  'mathematics-20': {
    indicator: {
      code: 'B1.3.1.1.3',
      text: 'Identify two-dimensional shapes, including circles, triangles, rectangles, squares, rhombuses and hexagons.',
    },
    hook: 'Flat shapes are everywhere: on windows, coins and signs. Let us name them!',
    explain: [
      'A circle is round. A triangle has 3 sides.',
      'A rectangle has 4 sides. A square is a special rectangle with 4 equal sides.',
      'A rhombus has 4 equal slanted sides. A hexagon has 6 sides.',
    ],
    art: {
      kind: 'shapes',
      names: [
        'circle',
        'triangle',
        'rectangle',
        'square',
        'rhombus',
        'hexagon',
      ],
    },
    artCaption: 'Count the sides to name the shape.',
    words: [
      { term: 'Flat', meaning: 'Not solid, like a drawing.' },
      { term: 'Rhombus', meaning: 'A shape with 4 equal slanted sides.' },
      { term: 'Hexagon', meaning: 'A shape with 6 sides.' },
    ],
    examples: [
      {
        title: 'Count the sides',
        situation: 'A shape has 6 sides. What is it?',
        steps: ['Count the sides: 6.'],
        answer: 'A hexagon.',
        art: { kind: 'shapes', names: ['hexagon'] },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a square is not a rectangle.',
        right: 'A square is a special rectangle.',
      },
    ],
    realLife: [
      'A window is a rectangle.',
      'A coin is a circle.',
      'Some tiles are hexagons.',
    ],
    tryIt: {
      need: 'Sticks or straws',
      steps: [
        'Make a triangle with 3 sticks.',
        'Make a square with 4 sticks.',
        'Make a hexagon with 6 sticks.',
      ],
    },
  },
  'mathematics-21': {
    indicator: {
      code: 'B1.3.2.1.1',
      text: 'Tell the position of objects relative to other objects using words such as above, below and to the right.',
    },
    hook: 'Where is the ball? Above the box? Below it? Beside it?',
    explain: [
      'Position words tell us where things are.',
      'Above means higher. Below means lower.',
      'Beside means next to. Behind means at the back.',
    ],
    art: { kind: 'position', word: 'above' },
    artCaption: 'The ball is above the box.',
    words: [
      { term: 'Above', meaning: 'Higher than.' },
      { term: 'Below', meaning: 'Lower than.' },
      { term: 'Beside', meaning: 'Next to.' },
    ],
    examples: [
      {
        title: 'Where is it?',
        situation: 'Where is the ball?',
        steps: [
          'Look at the ball and the box.',
          'The ball is next to the box.',
        ],
        answer: 'The ball is beside the box.',
        art: { kind: 'position', word: 'beside' },
      },
      {
        title: 'Inside or behind?',
        situation:
          'You cannot see the ball because the box hides it. Where is it?',
        steps: ['It is at the back of the box.'],
        answer: 'The ball is behind the box.',
        art: { kind: 'position', word: 'behind' },
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up left and right.',
        right: 'Your right hand is the one you usually write with. Check!',
      },
    ],
    realLife: [
      'Finding your seat in class.',
      'Following directions.',
      'Tidying toys.',
    ],
    tryIt: {
      need: 'A ball and a box',
      steps: [
        'Put the ball above, below and beside the box.',
        'Say where it is each time.',
        'Give a friend directions to follow.',
      ],
    },
  },
  'mathematics-22': {
    indicator: {
      code: 'B1.3.3.1.1',
      text: 'Develop an understanding of measuring as comparing pairs of items.',
    },
    hook: 'Which is taller: you or your friend? Which is heavier: a stone or a feather?',
    explain: [
      'We compare two things to find which is longer, taller or heavier.',
      'Put them side by side, starting from the same place.',
      'We can also compare which holds more water.',
    ],
    art: {
      kind: 'bottles',
      heights: [150, 220],
      label: 'Which bottle is taller?',
    },
    artCaption: 'Stand them side by side to compare.',
    words: [
      { term: 'Taller', meaning: 'Higher from bottom to top.' },
      { term: 'Heavier', meaning: 'Weighs more.' },
      { term: 'Holds more', meaning: 'Has room for more inside.' },
    ],
    examples: [
      {
        title: 'Who is taller?',
        situation: 'How can you find who is taller, you or a friend?',
        steps: [
          'Stand back to back.',
          'Start from the same floor.',
          'See whose head is higher.',
        ],
        answer: 'The one whose head is higher is taller.',
      },
    ],
    mistakes: [
      {
        wrong: 'Comparing without starting at the same place.',
        right: 'Line up the ends first.',
      },
    ],
    realLife: [
      'Lining up from shortest to tallest.',
      'Choosing the bigger bag.',
      'Carrying heavy and light things.',
    ],
    tryIt: {
      need: 'Two pencils, two stones',
      steps: [
        'Put the pencils side by side. Which is longer?',
        'Hold a stone in each hand. Which is heavier?',
        'Tell a friend.',
      ],
    },
  },
  'mathematics-23': {
    indicator: {
      code: 'B1.4.1.1.1',
      text: 'Organise and represent data, using pictures or objects, with up to three categories.',
    },
    hook: 'How many boys and how many girls are in your class? Pictures can show us!',
    explain: [
      'We can use pictures to show how many.',
      'One picture stands for one thing.',
      'Line the pictures up to compare.',
    ],
    art: {
      kind: 'picto',
      item: 'child',
      rows: [
        ['Boys', 6],
        ['Girls', 7],
      ],
    },
    artCaption: 'One picture for each child.',
    words: [
      { term: 'Picture graph', meaning: 'Pictures that show how many.' },
      { term: 'Group', meaning: 'Things put together because they are alike.' },
      { term: 'Compare', meaning: 'Find which has more or fewer.' },
    ],
    examples: [
      {
        title: 'Read the graph',
        situation:
          'There are 6 boys and 7 girls. How many children altogether?',
        steps: ['6 + 7 = 13.'],
        answer: '13 children.',
      },
      {
        title: 'How many more?',
        situation: 'How many more girls than boys?',
        steps: ['7 − 6 = 1.'],
        answer: '1 more girl.',
      },
    ],
    mistakes: [
      {
        wrong: 'Drawing pictures of different sizes.',
        right: 'Make every picture the same size.',
      },
    ],
    realLife: [
      'Counting boys and girls.',
      'Counting pets.',
      'Counting favourite fruits.',
    ],
    tryIt: {
      need: 'Bottle caps of two colours',
      steps: [
        'Use one colour for boys and one for girls.',
        'Put one cap for each child.',
        'Line them up and compare.',
      ],
    },
  },
  'mathematics-24': {
    indicator: {
      code: 'B1.4.1.1.2',
      text: 'Organise a set of data into three categories, find the total and compare the categories.',
    },
    hook: 'What is the favourite drink in your class? Let us ask and keep count!',
    explain: [
      'We can ask a question and count the answers.',
      'A tally mark is a quick line for each answer.',
      'Then we can see which answer got the most.',
    ],
    art: {
      kind: 'tally',
      rows: [
        ['Water', 5],
        ['Juice', 8],
        ['Milk', 3],
      ],
    },
    artCaption: 'One line for each answer.',
    words: [
      { term: 'Tally', meaning: 'A line used to keep count.' },
      { term: 'Total', meaning: 'All of them added together.' },
      { term: 'Most', meaning: 'The biggest number.' },
    ],
    examples: [
      {
        title: 'Which is the favourite?',
        situation: 'Water 5, juice 8, milk 3. Which drink is the favourite?',
        steps: ['8 is the biggest number.'],
        answer: 'Juice.',
      },
      {
        title: 'Find the total',
        situation: 'How many children answered?',
        steps: ['5 + 8 = 13.', '13 + 3 = 16.'],
        answer: '16 children.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to count one group.',
        right: 'Add all the groups to find the total.',
      },
    ],
    realLife: [
      'Voting for a class game.',
      'Counting favourite colours.',
      'Keeping score.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Ask 10 friends their favourite fruit, from three choices.',
        'Make a tally mark for each answer.',
        'Which fruit got the most?',
      ],
    },
  },
}
