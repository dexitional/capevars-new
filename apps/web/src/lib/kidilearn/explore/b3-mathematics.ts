import type { CourseGuides } from './types'

// Basic 3 Mathematics, written for this course and scoped to the NaCCA
// Mathematics Curriculum for Primary Schools (2019), in short sentences for
// eight-year-olds. Scope notes:
// - Counting and place value go to 10,000; adding and subtracting stay within
//   1,000; multiplication goes up to 5 × 5, with the chart to 9 × 9.
// - Fractions are now written in symbols as well as words.
// - Negative numbers go down to minus ten.
// - The curriculum’s compensation example for 48 − 19 is misprinted (it gives
//   48 − 20 as 18). The guide uses 48 − 20 = 28, so 48 − 19 = 29.

export const guides: CourseGuides = {
  'mathematics-01': {
    indicator: {
      code: 'B3.1.1.1.1',
      text: 'Use number names and the counting sequence to count and estimate quantities up to 10,000.',
    },
    hook: 'A football stadium can hold thousands of people. How can we count such big numbers?',
    explain: [
      'We can skip count by 10s, 50s, 100s, 500s and 1000s.',
      'Counting by 1000s: 1000, 2000, 3000 and so on, up to 10,000.',
      'An estimate is a careful guess. We choose the estimate that makes most sense.',
    ],
    art: {
      kind: 'pattern',
      terms: [1000, 2000, 3000, 4000, null],
      rule: 'Count by 1000s. What comes next?',
    },
    artCaption: 'Skip counting helps us count big numbers.',
    words: [
      { term: 'Skip count', meaning: 'Count in equal jumps.' },
      { term: 'Thousand', meaning: 'Ten hundreds, written 1000.' },
      { term: 'Estimate', meaning: 'A careful guess of how many.' },
    ],
    examples: [
      {
        title: 'Count by 500s',
        situation: 'Count by 500s from 500 to 3000.',
        steps: ['Say 500, 1000, 1500, 2000, 2500, 3000.'],
        answer: '500, 1000, 1500, 2000, 2500, 3000.',
      },
      {
        title: 'Find the mistake',
        situation: 'Count by 100s: 700, 800, 1000, 1100. What is missing?',
        steps: ['Each jump should add 100.', '800 to 1000 is a jump of 200.'],
        answer: '900 is missing.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking an estimate must be exact.',
        right: 'An estimate only needs to be close.',
      },
    ],
    realLife: [
      'Counting money in big amounts.',
      'Crowds at a stadium.',
      'Numbers of people in a town.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Count by 50s from 50 to 500 and write it down.',
        'Count back by 100s from 1000.',
        'Check with a friend.',
      ],
    },
  },
  'mathematics-02': {
    indicator: {
      code: 'B3.1.1.1.2',
      text: 'Identify numbers in different positions around a given number in a number chart.',
    },
    hook: 'On a big number chart, every number has neighbours above, below, left and right. Who lives next to 3,456?',
    explain: [
      'Moving right on a chart adds 1. Moving left takes away 1.',
      'Moving down adds 10. Moving up takes away 10.',
      'These rules work for big numbers too.',
    ],
    art: { kind: 'chart', start: 1, focus: 34 },
    artCaption: 'The neighbours of 34 are 24, 44, 33 and 35.',
    words: [
      { term: 'Neighbour', meaning: 'A number next to another on a chart.' },
      { term: 'Above', meaning: 'Higher on the chart: 10 less.' },
      { term: 'Below', meaning: 'Lower on the chart: 10 more.' },
    ],
    examples: [
      {
        title: 'Big neighbours',
        situation: 'Find the neighbours of 3456.',
        steps: [
          'Left: 3456 − 1 = 3455.',
          'Right: 3456 + 1 = 3457.',
          'Above: 3456 − 10 = 3446.',
          'Below: 3456 + 10 = 3466.',
        ],
        answer: '3455, 3457, 3446 and 3466.',
      },
    ],
    mistakes: [
      { wrong: 'Adding 1 when moving down.', right: 'Moving down adds 10.' },
    ],
    realLife: [
      'Page numbers in a thick book.',
      'House numbers.',
      'Seat numbers in a stadium.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write any four-digit number.',
        'Write its four neighbours.',
        'Ask a friend to check.',
      ],
    },
  },
  'mathematics-03': {
    indicator: {
      code: 'B3.1.1.1.3',
      text: 'Describe numbers from 0 to 10,000 in equivalent ways using place value.',
    },
    hook: 'The number 4,036 has a zero in it. What does that zero tell us?',
    explain: [
      'Each digit has a place: thousands, hundreds, tens and ones.',
      'In 4036, the 4 means 4 thousands, the 0 means no hundreds, the 3 means 3 tens, and the 6 means 6 ones.',
      'So 4036 = 4000 + 30 + 6.',
    ],
    art: {
      kind: 'caps',
      hundreds: 3,
      tens: 2,
      ones: 7,
      label: '327 = 300 + 20 + 7',
    },
    artCaption: 'Hundreds, tens and ones.',
    words: [
      {
        term: 'Place value',
        meaning: 'What a digit is worth because of its place.',
      },
      { term: 'Digit', meaning: 'One of the symbols 0 to 9.' },
      { term: 'Thousands', meaning: 'The place to the left of hundreds.' },
    ],
    examples: [
      {
        title: 'Break it up',
        situation: 'Write 5274 in parts.',
        steps: [
          '5 thousands is 5000.',
          '2 hundreds is 200.',
          '7 tens is 70.',
          '4 ones is 4.',
        ],
        answer: '5274 = 5000 + 200 + 70 + 4.',
      },
      {
        title: 'Read it right',
        situation: 'How do we read 435?',
        steps: ['4 hundreds, 3 tens and 5 ones.'],
        answer: 'Four hundred and thirty-five.',
      },
    ],
    mistakes: [
      {
        wrong: 'Reading 435 as “four three five”.',
        right: 'Read it as four hundred and thirty-five.',
      },
    ],
    realLife: [
      'Reading prices.',
      'Reading the year.',
      'Reading the number of pupils in a school.',
    ],
    tryIt: {
      need: 'Bottle caps and string',
      steps: [
        'Make 10 strings of 10 caps to show 100.',
        'Show 245 using strings and loose caps.',
        'Say the number in parts.',
      ],
    },
  },
  'mathematics-04': {
    indicator: {
      code: 'B3.1.1.1.4',
      text: 'Compare and order whole numbers up to 10,000 using >, < or =.',
    },
    hook: 'Agbo has 230 chickens. Dzifa has 460. What can you say?',
    explain: [
      'Compare the biggest place first: thousands, then hundreds, then tens, then ones.',
      'The first place that is different tells you which number is bigger.',
      'Use > for greater than, < for less than and = for equal.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['230', 'Agbo'],
        ['460', 'Dzifa'],
      ],
    },
    artCaption: '460 is further along than 230.',
    words: [
      { term: 'Compare', meaning: 'Find which is bigger or smaller.' },
      {
        term: 'Order',
        meaning:
          'Put numbers from smallest to biggest, or biggest to smallest.',
      },
      { term: 'Greater than (>)', meaning: 'Bigger than.' },
    ],
    examples: [
      {
        title: 'Chickens',
        situation: 'Agbo has 230 chickens. Dzifa has 460. What can you say?',
        steps: [
          'Compare hundreds: 2 hundreds and 4 hundreds.',
          '460 is bigger.',
          '460 − 230 = 230.',
        ],
        answer: 'Dzifa has 230 more chickens. In fact, she has twice as many.',
      },
      {
        title: 'Order them',
        situation: 'Order 3402, 3240 and 3420 from smallest to biggest.',
        steps: [
          'All have 3 thousands.',
          'Hundreds: 4, 2, 4. So 3240 is smallest.',
          'Tens: 3402 has 0 tens, 3420 has 2 tens.',
        ],
        answer: '3240, 3402, 3420.',
      },
    ],
    mistakes: [
      {
        wrong: 'Comparing the ones first.',
        right: 'Always start with the biggest place.',
      },
    ],
    realLife: [
      'Comparing prices.',
      'Comparing scores.',
      'Comparing populations of towns.',
    ],
    tryIt: {
      need: 'Digit cards 0 to 9',
      steps: [
        'Each friend makes a four-digit number.',
        'Compare them using > or <.',
        'Order all the numbers.',
      ],
    },
  },
  'mathematics-05': {
    indicator: {
      code: 'B3.1.1.2.1',
      text: 'Describe situations having opposite directions or values.',
    },
    hook: 'Up and down, left and right, in and out. Opposites are everywhere. Let us play the opposite game!',
    explain: [
      'Opposites go in different directions.',
      'Stand back to back with a friend. Walk 3 steps each. You go in opposite directions.',
      'Opposites help us understand numbers on both sides of zero.',
    ],
    art: { kind: 'jumps', start: 0, jumps: [3], label: '3 steps one way' },
    artCaption: 'From zero, we can move either way.',
    words: [
      {
        term: 'Opposite',
        meaning: 'As different as possible, such as up and down.',
      },
      { term: 'Direction', meaning: 'The way something moves.' },
      { term: 'Zero', meaning: 'The starting point.' },
    ],
    examples: [
      {
        title: 'Name the opposite',
        situation: 'What is the opposite of “3 steps forward”?',
        steps: ['Forward and backward are opposites.'],
        answer: '3 steps backward.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking opposites mean the same.',
        right: 'Opposites go different ways.',
      },
    ],
    realLife: [
      'Going up and down stairs.',
      'Earning and spending money.',
      'Getting hotter and colder.',
    ],
    tryIt: {
      need: 'A friend and a chalk line',
      steps: [
        'Stand back to back on a cross.',
        'Each walk 4 steps.',
        'How far apart are you now?',
      ],
    },
  },
  'mathematics-06': {
    indicator: {
      code: 'B3.1.1.2.2',
      text: 'Use real-life contexts to deduce positive and negative number representations.',
    },
    hook: 'A bird flies above the sea. A fish swims below it. How can numbers show above and below?',
    explain: [
      'The top of the sea is called sea level. It is like zero.',
      'Above sea level, we use positive numbers. Below sea level, we use negative numbers.',
      'A minus sign shows a negative number: −3 means 3 below zero.',
    ],
    art: { kind: 'jumps', start: 0, jumps: [-3], label: 'Below zero: minus 3' },
    artCaption: 'Below zero, numbers are negative.',
    words: [
      { term: 'Sea level', meaning: 'The height of the sea, used as zero.' },
      { term: 'Positive', meaning: 'Above zero.' },
      { term: 'Negative', meaning: 'Below zero, written with a minus sign.' },
    ],
    examples: [
      {
        title: 'Above or below?',
        situation: 'A fish is 5 metres below sea level. How can we write that?',
        steps: ['Below sea level is negative.'],
        answer: '−5 metres.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking −5 is bigger than 5.',
        right: '−5 is below zero, so it is smaller.',
      },
    ],
    realLife: [
      'Divers below the sea.',
      'Aeroplanes above the sea.',
      'Very cold places below zero degrees.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw the sea with a line for sea level.',
        'Draw a bird above and a fish below.',
        'Label them with a positive and a negative number.',
      ],
    },
  },
  'mathematics-07': {
    indicator: {
      code: 'B3.1.1.3.1',
      text: 'Describe situations using positive and negative values, down to −10.',
    },
    hook: 'On a number line, what is on the other side of zero?',
    explain: [
      'A number line can go past zero.',
      'To the right of zero: 1, 2, 3. To the left of zero: −1, −2, −3.',
      'Negative numbers go down to −10 and further.',
    ],
    art: {
      kind: 'jumps',
      start: 2,
      jumps: [-1, -1, -1, -1, -1],
      label: 'From 2, count back 5 steps',
    },
    artCaption: 'Counting back through zero.',
    words: [
      { term: 'Number line', meaning: 'A line with numbers in order.' },
      { term: 'Through zero', meaning: 'Passing zero to the other side.' },
      { term: 'Minus', meaning: 'The sign − in a negative number.' },
    ],
    examples: [
      {
        title: 'Count back',
        situation: 'Start at 2. Count back 5 steps. Where do you land?',
        steps: ['2, 1, 0, −1, −2, −3.'],
        answer: '−3.',
        art: { kind: 'jumps', start: 2, jumps: [-1, -1, -1, -1, -1] },
      },
    ],
    mistakes: [
      {
        wrong: 'Stopping at zero.',
        right: 'Keep counting past zero: −1, −2, −3.',
      },
    ],
    realLife: [
      'Floors below the ground in a building.',
      'Very cold temperatures.',
      'Owing money.',
    ],
    tryIt: {
      need: 'A number line from −10 to 10, drawn on the floor',
      steps: [
        'Stand on 4.',
        'Hop back 7. Where are you?',
        'Hop forward 3. Where are you now?',
      ],
    },
  },
  'mathematics-08': {
    indicator: {
      code: 'B3.1.2.1.1',
      text: 'Use a standard strategy or procedure to add or subtract within 1000.',
    },
    hook: 'What number goes in the box? 227 + ☐ = 609',
    explain: [
      'A box or a line can stand for a missing number.',
      'To find it, change the question: 227 + ☐ = 609 means 609 − 227 = ☐.',
      'We can split numbers into hundreds, tens and ones to add or subtract.',
    ],
    art: {
      kind: 'jumps',
      start: 345,
      jumps: [100, 20, 3],
      label: '345 + 123 = 468',
    },
    artCaption: 'Add the hundreds, then the tens, then the ones.',
    words: [
      { term: 'Unknown', meaning: 'A number we need to find.' },
      { term: 'Decompose', meaning: 'Split a number into parts.' },
      { term: 'Sum', meaning: 'The answer to an addition.' },
    ],
    examples: [
      {
        title: 'Find the box',
        situation: '227 + ☐ = 609.',
        steps: [
          'Change it: 609 − 227.',
          'Hundreds: 600 − 200 = 400.',
          'Then 9 − 27 needs regrouping: 409 − 27 = 382.',
        ],
        answer: '☐ = 382, because 227 + 382 = 609.',
      },
      {
        title: 'Split and add',
        situation: '345 + 123.',
        steps: [
          'Hundreds: 300 + 100 = 400.',
          'Tens: 40 + 20 = 60.',
          'Ones: 5 + 3 = 8.',
          '400 + 60 + 8 = 468.',
        ],
        answer: '345 + 123 = 468.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding 227 and 609 to find the box.',
        right: 'Subtract to find a missing part.',
      },
    ],
    realLife: [
      'How much more money you need.',
      'Pages left to read.',
      'Adding prices.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a sum with a box, like 150 + ☐ = 400.',
        'Swap with a friend.',
        'Solve each other’s.',
      ],
    },
  },
  'mathematics-09': {
    indicator: {
      code: 'B3.1.2.2.1',
      text: 'Use the concept of “equal to” and “not equal to”.',
    },
    hook: 'Is 160 the same as 80 + 50? Let us check with a balance.',
    explain: [
      'The sign = means both sides have the same value.',
      'The sign ≠ means “not equal to”.',
      '160 ≠ 80 + 50, because 80 + 50 = 130.',
    ],
    art: { kind: 'balance', left: '160', right: '80 + 50', equal: false },
    artCaption: '160 is heavier than 130.',
    words: [
      { term: 'Equal (=)', meaning: 'The same value.' },
      { term: 'Not equal (≠)', meaning: 'Different values.' },
      { term: 'Balance', meaning: 'When both sides are the same.' },
    ],
    examples: [
      {
        title: 'Equal or not?',
        situation: 'Is 200 + 50 the same as 125 + 125?',
        steps: ['200 + 50 = 250.', '125 + 125 = 250.'],
        answer: 'Yes: 200 + 50 = 125 + 125.',
        art: {
          kind: 'balance',
          left: '200 + 50',
          right: '125 + 125',
          equal: true,
        },
      },
      {
        title: 'Subtract by adding',
        situation: 'Work out 40 − 28 by adding.',
        steps: [
          'Think 28 + ☐ = 40.',
          '28 + 2 = 30, and 30 + 10 = 40.',
          '2 + 10 = 12.',
        ],
        answer: '40 − 28 = 12.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing = between unequal sides.',
        right: 'Use ≠ when the sides differ.',
      },
    ],
    realLife: ['Sharing fairly.', 'Checking change.', 'Balancing a see-saw.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write two sums that are equal.',
        'Write two sums that are not equal.',
        'Use = and ≠ correctly.',
      ],
    },
  },
  'mathematics-10': {
    indicator: {
      code: 'B3.1.2.3.1',
      text: 'Use strategies to mentally add and subtract whole numbers within 100.',
    },
    hook: 'Can you add 25 + 26 in your head? Doubles can help!',
    explain: [
      'Use doubles: 25 + 26 is 25 + 25 + 1.',
      'Make tens: 28 + 47 is the same as 30 + 45.',
      'Count up in friendly jumps to subtract.',
    ],
    art: {
      kind: 'jumps',
      start: 36,
      jumps: [10, 10, 10, 5],
      label: '71 − 36: jump from 36 to 71',
    },
    artCaption: 'The jumps add up to 35.',
    words: [
      { term: 'Mental maths', meaning: 'Working out in your head.' },
      { term: 'Double', meaning: 'A number added to itself.' },
      { term: 'Friendly jump', meaning: 'An easy jump, such as 10.' },
    ],
    examples: [
      {
        title: 'Near doubles',
        situation: 'Work out 25 + 26.',
        steps: ['25 + 25 = 50.', 'Add 1 more: 51.'],
        answer: '25 + 26 = 51.',
      },
      {
        title: 'Count up',
        situation: 'Work out 71 − 36.',
        steps: [
          'Start at 36.',
          'Jump 10 three times: 46, 56, 66.',
          'Jump 5 more: 71.',
          '10 + 10 + 10 + 5 = 35.',
        ],
        answer: '71 − 36 = 35.',
      },
      {
        title: 'Take too much, then fix it',
        situation: 'Work out 48 − 19.',
        steps: [
          '48 − 20 = 28.',
          'You took 1 too many, so add 1 back: 28 + 1 = 29.',
        ],
        answer: '48 − 19 = 29.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to fix the answer after using a friendly number.',
        right: 'Add back what you took too much.',
      },
    ],
    realLife: [
      'Adding prices in your head.',
      'Working out change.',
      'Keeping score.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Say a near-double, like 30 + 31.',
        'Your friend answers quickly.',
        'Take turns.',
      ],
    },
  },
  'mathematics-11': {
    indicator: {
      code: 'B3.1.2.4.1',
      text: 'Use a variety of personal strategies for adding within 1000.',
    },
    hook: 'There is more than one way to add 326 + 232. Which way do you like best?',
    explain: [
      'Friendly jumps: start at 326, add 100 twice, then 10 three times, then 2.',
      'Splitting: add the hundreds, then the tens, then the ones.',
      'Choose the way that feels easiest for the numbers.',
    ],
    art: {
      kind: 'jumps',
      start: 326,
      jumps: [100, 100, 30, 2],
      label: '326 + 232 = 558',
    },
    artCaption: 'Friendly jumps of 100, 100, 30 and 2.',
    words: [
      { term: 'Strategy', meaning: 'A way of working something out.' },
      { term: 'Partial sum', meaning: 'Adding one place at a time.' },
      {
        term: 'Hundreds frame',
        meaning: 'A table for hundreds, tens and ones.',
      },
    ],
    examples: [
      {
        title: 'Friendly jumps',
        situation: 'Work out 326 + 232.',
        steps: [
          '326 + 100 = 426.',
          '426 + 100 = 526.',
          '526 + 30 = 556.',
          '556 + 2 = 558.',
        ],
        answer: '326 + 232 = 558.',
      },
      {
        title: 'Split',
        situation: 'Work out 168 + 384.',
        steps: [
          '100 + 300 = 400.',
          '60 + 80 = 140.',
          '8 + 4 = 12.',
          '400 + 140 + 12 = 552.',
        ],
        answer: '168 + 384 = 552.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up hundreds and tens.',
        right: 'Keep each place separate.',
      },
    ],
    realLife: [
      'Adding money.',
      'Adding pupils in two classes.',
      'Adding scores.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Choose a sum like 245 + 132.',
        'Solve it two ways.',
        'Which way was easier?',
      ],
    },
  },
  'mathematics-12': {
    indicator: {
      code: 'B3.1.2.4.2',
      text: 'Use personal and standard strategies to solve subtraction and addition problems.',
    },
    hook: 'Taking 296 away from 547 sounds hard. What if you took 300 instead?',
    explain: [
      'Take away a friendly number, then fix the answer.',
      'Or count up from the smaller number to the bigger one.',
      'Or split the number you take away into easy parts.',
    ],
    art: {
      kind: 'jumps',
      start: 547,
      jumps: [-300, 4],
      label: '547 − 300 + 4 = 251',
    },
    artCaption: 'Take away 300, then add back 4.',
    words: [
      {
        term: 'Compensation',
        meaning: 'Making a number friendlier, then fixing the answer.',
      },
      { term: 'Difference', meaning: 'The answer to a subtraction.' },
      {
        term: 'Count up',
        meaning: 'Count from the small number to the big one.',
      },
    ],
    examples: [
      {
        title: 'Take a friendly number',
        situation: 'Work out 547 − 296.',
        steps: [
          '547 − 300 = 247.',
          'You took 4 too many, so add 4: 247 + 4 = 251.',
        ],
        answer: '547 − 296 = 251.',
      },
      {
        title: 'Split it',
        situation: 'Work out 127 − 38.',
        steps: ['127 − 20 = 107.', '107 − 10 = 97.', '97 − 8 = 89.'],
        answer: '127 − 38 = 89.',
      },
    ],
    mistakes: [
      {
        wrong: 'Subtracting the extra instead of adding it back.',
        right: 'If you took too many, add the extra back.',
      },
    ],
    realLife: [
      'Working out change.',
      'Finding how many are left.',
      'Comparing two amounts.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 452 − 199 by taking away 200 first.',
        'Fix your answer.',
        'Check by adding.',
      ],
    },
  },
  'mathematics-13': {
    indicator: {
      code: 'B3.1.2.4.3',
      text: 'Develop and explain strategies to estimate sums and differences up to 1000.',
    },
    hook: 'You have about 900 cedis. Can you buy two items costing 430 and 561 cedis? Estimate first!',
    explain: [
      'To estimate, use round numbers that are close.',
      '430 is close to 400. 561 is close to 500 or 600.',
      'An estimate tells you if an answer makes sense.',
    ],
    art: {
      kind: 'jumps',
      start: 400,
      jumps: [500],
      label: 'About 400 + 500 = 900',
    },
    artCaption: 'Round, then add.',
    words: [
      { term: 'Estimate', meaning: 'A close, careful guess.' },
      { term: 'Round', meaning: 'Change a number to a nearby easy one.' },
      { term: 'About', meaning: 'Close to, not exact.' },
    ],
    examples: [
      {
        title: 'Estimate a sum',
        situation: 'Estimate 430 + 561.',
        steps: [
          'Use 400 + 500 = 900.',
          'The real sum is a bit more, because both were rounded down.',
        ],
        answer: 'About 900. (The exact answer is 991.)',
      },
      {
        title: 'Estimate a difference',
        situation: 'Estimate 660 − 430.',
        steps: ['Use 700 − 400 = 300 or 600 − 400 = 200.'],
        answer: 'Between 200 and 300. (The exact answer is 230.)',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking an estimate is wrong because it is not exact.',
        right: 'An estimate only needs to be close.',
      },
    ],
    realLife: [
      'Checking if you have enough money.',
      'Guessing travel time.',
      'Planning food for a party.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Estimate 312 + 489.',
        'Work out the exact answer.',
        'How close was your estimate?',
      ],
    },
  },
  'mathematics-14': {
    indicator: {
      code: 'B3.1.2.4.4',
      text: 'Show an understanding of the property of commutativity.',
    },
    hook: 'Is 236 + 453 the same as 453 + 236? Try it and see!',
    explain: [
      'You can add numbers in any order. The sum stays the same.',
      'This is called the commutative property.',
      'It does not work for subtraction: 9 − 4 is not the same as 4 − 9.',
    ],
    art: {
      kind: 'balance',
      left: '236 + 453',
      right: '453 + 236',
      equal: true,
    },
    artCaption: 'Swap the order, the sum stays the same.',
    words: [
      {
        term: 'Commutative',
        meaning: 'The order can change without changing the answer.',
      },
      { term: 'Addend', meaning: 'A number being added.' },
      { term: 'Order', meaning: 'Which comes first.' },
    ],
    examples: [
      {
        title: 'Swap them',
        situation: 'Work out 236 + 453 and 453 + 236.',
        steps: ['236 + 453 = 689.', '453 + 236 = 689.'],
        answer: 'Both are 689.',
      },
    ],
    mistakes: [
      {
        wrong: 'Swapping the order in a subtraction.',
        right: 'Only addition can be swapped.',
      },
    ],
    realLife: [
      'Adding two prices in either order.',
      'Counting two groups of children.',
      'Adding scores.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Pick two numbers.',
        'Add them in both orders.',
        'Do you get the same answer?',
      ],
    },
  },
  'mathematics-15': {
    indicator: {
      code: 'B3.1.2.5.1',
      text: 'Represent and explain multiplication using equal groupings.',
    },
    hook: 'You have 12 straws. How many ways can you share them into equal groups?',
    explain: [
      'Multiplying means adding equal groups.',
      '3 groups of 4 is written 3 × 4.',
      '3 × 4 = 4 + 4 + 4 = 12.',
    ],
    art: {
      kind: 'groups',
      groups: 3,
      each: 4,
      label: '3 groups of 4: 3 × 4 = 12',
    },
    artCaption: 'Three equal groups of four.',
    words: [
      { term: 'Multiply (×)', meaning: 'Add equal groups.' },
      { term: 'Equal groups', meaning: 'Groups with the same number in each.' },
      { term: 'Product', meaning: 'The answer to a multiplication.' },
    ],
    examples: [
      {
        title: 'Group 12 straws',
        situation: 'Make equal groups with 12 straws.',
        steps: [
          '3 groups of 4: 3 × 4 = 12.',
          '4 groups of 3: 4 × 3 = 12.',
          '2 groups of 6: 2 × 6 = 12.',
        ],
        answer: 'Many groupings make 12.',
        art: { kind: 'groups', groups: 4, each: 3 },
      },
    ],
    mistakes: [
      {
        wrong: 'Making groups of different sizes.',
        right: 'All groups must be equal.',
      },
    ],
    realLife: ['Packs of biscuits.', 'Rows of chairs.', 'Pairs of shoes.'],
    tryIt: {
      need: '12 straws or sticks',
      steps: [
        'Make 2 equal groups.',
        'Make 3, then 4, then 6 equal groups.',
        'Write a multiplication for each.',
      ],
    },
  },
  'mathematics-16': {
    indicator: {
      code: 'B3.1.2.5.2',
      text: 'Represent and explain multiplication using rectangular arrays.',
    },
    hook: 'Chairs in rows make a rectangle. Rows and columns can help us multiply!',
    explain: [
      'An array is objects in equal rows and columns.',
      '2 rows of 3 is written 2 × 3. Count them: 6.',
      'A multiplication chart shows many products at once.',
    ],
    art: { kind: 'grid', rows: 2, cols: 3, label: '2 rows of 3: 2 × 3 = 6' },
    artCaption: 'An array of 2 rows and 3 columns.',
    words: [
      { term: 'Array', meaning: 'Objects in equal rows and columns.' },
      { term: 'Row', meaning: 'A line going across.' },
      { term: 'Column', meaning: 'A line going down.' },
    ],
    examples: [
      {
        title: 'Count the array',
        situation: 'There are 4 rows of 5 chairs. How many chairs?',
        steps: ['4 × 5.', 'Count by 5s: 5, 10, 15, 20.'],
        answer: '4 × 5 = 20 chairs.',
        art: { kind: 'grid', rows: 4, cols: 5 },
      },
    ],
    mistakes: [
      {
        wrong: 'Counting rows only.',
        right: 'Multiply rows by the number in each row.',
      },
    ],
    realLife: ['Eggs in a tray.', 'Chairs in rows.', 'Windows on a building.'],
    tryIt: {
      need: 'Bottle caps',
      steps: ['Make 3 rows of 4 caps.', 'Count them.', 'Write 3 × 4 = 12.'],
    },
  },
  'mathematics-17': {
    indicator: {
      code: 'B3.1.2.6.1',
      text: 'Explain division as equal sharing.',
    },
    hook: '12 sweets for 4 friends. How many does each friend get?',
    explain: [
      'Dividing means sharing equally.',
      'Share one at a time, in turns, until all are gone.',
      '12 shared by 4 is written 12 ÷ 4 = 3.',
    ],
    art: { kind: 'groups', groups: 4, each: 3, label: '12 ÷ 4 = 3 each' },
    artCaption: 'Each of 4 friends gets 3.',
    words: [
      { term: 'Divide (÷)', meaning: 'Share equally.' },
      { term: 'Share', meaning: 'Give out fairly.' },
      { term: 'Each', meaning: 'Every one.' },
    ],
    examples: [
      {
        title: 'Share the straws',
        situation: '12 straws are shared by 4 pupils. How many each?',
        steps: ['Give out one at a time.', 'Each pupil ends up with 3.'],
        answer: '12 ÷ 4 = 3.',
      },
    ],
    mistakes: [
      {
        wrong: 'Giving some friends more.',
        right: 'Sharing equally means everyone gets the same.',
      },
    ],
    realLife: [
      'Sharing sweets.',
      'Sharing books in class.',
      'Sharing fruit at home.',
    ],
    tryIt: {
      need: '15 stones and 3 friends',
      steps: [
        'Share the stones equally.',
        'Count how many each person has.',
        'Write it as a division.',
      ],
    },
  },
  'mathematics-18': {
    indicator: {
      code: 'B3.1.2.6.2',
      text: 'Explain division as repeated subtraction.',
    },
    hook: 'You have 12 oranges and put 3 in each bag. How many bags can you fill?',
    explain: [
      'Take away equal groups again and again.',
      'Count how many groups you made.',
      '12 − 3 − 3 − 3 − 3 = 0, so there are 4 groups of 3.',
    ],
    art: {
      kind: 'jumps',
      start: 12,
      jumps: [-3, -3, -3, -3],
      label: '12 ÷ 3 = 4 jumps',
    },
    artCaption: 'Four jumps of 3 back to zero.',
    words: [
      {
        term: 'Repeated subtraction',
        meaning: 'Taking away the same number again and again.',
      },
      { term: 'Group', meaning: 'A set of things together.' },
      { term: 'Remainder', meaning: 'What is left over.' },
    ],
    examples: [
      {
        title: 'Fill the bags',
        situation: '12 oranges, 3 in each bag. How many bags?',
        steps: ['Take 3 away four times: 12, 9, 6, 3, 0.'],
        answer: '12 ÷ 3 = 4 bags.',
      },
    ],
    mistakes: [
      {
        wrong: 'Counting the oranges instead of the groups.',
        right: 'Count how many times you took a group away.',
      },
    ],
    realLife: [
      'Packing fruit into bags.',
      'Putting pupils into teams.',
      'Filling boxes.',
    ],
    tryIt: {
      need: '20 stones',
      steps: [
        'Take away 5 at a time.',
        'Count how many groups you made.',
        'Write 20 ÷ 5 = 4.',
      ],
    },
  },
  'mathematics-19': {
    indicator: {
      code: 'B3.1.2.6.3',
      text: 'Explain division as the inverse of multiplication.',
    },
    hook: 'If 3 × 4 = 12, what is 12 ÷ 3? Multiplying can help you divide!',
    explain: [
      'Division undoes multiplication.',
      '12 ÷ 3 asks: 3 times what makes 12?',
      'Since 3 × 4 = 12, we know 12 ÷ 3 = 4.',
    ],
    art: { kind: 'grid', rows: 3, cols: 4, label: '3 × 4 = 12, so 12 ÷ 3 = 4' },
    artCaption: 'One array, two facts.',
    words: [
      {
        term: 'Inverse',
        meaning: 'The opposite operation, which undoes the other.',
      },
      {
        term: 'Fact family',
        meaning: 'Related multiplication and division facts.',
      },
      { term: 'Multiplication chart', meaning: 'A table of products.' },
    ],
    examples: [
      {
        title: 'Use multiplication',
        situation: 'Work out 15 ÷ 5.',
        steps: ['Think: 5 × ☐ = 15.', '5 × 3 = 15.'],
        answer: '15 ÷ 5 = 3.',
      },
      {
        title: 'A fact family',
        situation: 'Write the fact family for 2, 5 and 10.',
        steps: ['2 × 5 = 10.', '5 × 2 = 10.', '10 ÷ 2 = 5.', '10 ÷ 5 = 2.'],
        answer: 'Four facts from one array.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking multiplying and dividing are not related.',
        right: 'Each undoes the other.',
      },
    ],
    realLife: [
      'Sharing equally.',
      'Checking your answers.',
      'Working out prices.',
    ],
    tryIt: {
      need: 'Bottle caps',
      steps: [
        'Make 4 rows of 3.',
        'Write the multiplication.',
        'Write the two divisions.',
      ],
    },
  },
  'mathematics-20': {
    indicator: {
      code: 'B3.1.3.1.1',
      text: 'Understand a unit fraction as one part of a whole cut into equal parts.',
    },
    hook: 'You cut a cake into 4 equal pieces and take one. What fraction is your piece?',
    explain: [
      'A unit fraction is one equal part of a whole.',
      'Cut a whole into 4 equal parts. One part is one-quarter, written 1/4.',
      'The bottom number shows how many equal parts. The top number shows how many we take.',
    ],
    art: { kind: 'cake', parts: 4, picked: 1, label: 'One piece of four: 1/4' },
    artCaption: 'One of four equal parts is 1/4.',
    words: [
      { term: 'Fraction', meaning: 'A part of a whole.' },
      { term: 'Unit fraction', meaning: 'One equal part, such as 1/3 or 1/5.' },
      {
        term: 'Denominator',
        meaning: 'The bottom number: how many equal parts.',
      },
    ],
    examples: [
      {
        title: 'Name the fraction',
        situation:
          'A bar is cut into 5 equal parts. One part is shaded. What fraction is shaded?',
        steps: [
          '5 equal parts, so the bottom number is 5.',
          '1 part is shaded.',
        ],
        answer: '1/5, one-fifth.',
        art: { kind: 'cake', parts: 5, picked: 1 },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 1/5 is bigger than 1/4 because 5 is bigger.',
        right: 'More parts means smaller parts. 1/4 is bigger.',
      },
    ],
    realLife: ['Sharing a pizza.', 'Cutting a cake.', 'Folding paper.'],
    tryIt: {
      need: 'Paper strips',
      steps: [
        'Fold a strip into 2, another into 4, another into 8.',
        'Label one part of each: 1/2, 1/4, 1/8.',
        'Which part is biggest?',
      ],
    },
  },
  'mathematics-21': {
    indicator: {
      code: 'B3.1.3.1.2',
      text: 'Use fractions to represent parts of a group of objects and points on a number line.',
    },
    hook: 'You have 8 oranges and give half to your friend. How many is half of 8?',
    explain: [
      'A fraction can be part of a group, not only one thing.',
      'Half of 8 oranges: share 8 into 2 equal groups. Each group has 4.',
      'Fractions can also be points on a number line between 0 and 1.',
    ],
    art: { kind: 'groups', groups: 2, each: 4, label: 'Half of 8 is 4' },
    artCaption: 'Two equal groups of 4.',
    words: [
      { term: 'Fraction of a group', meaning: 'A part of a set of things.' },
      { term: 'Half', meaning: 'One of two equal parts: 1/2.' },
      {
        term: 'Number line',
        meaning: 'A line with numbers, including fractions.',
      },
    ],
    examples: [
      {
        title: 'Half of a group',
        situation: 'What is half of 10 sweets?',
        steps: ['Share 10 into 2 equal groups.', 'Each group has 5.'],
        answer: 'Half of 10 is 5.',
      },
      {
        title: 'A quarter of a group',
        situation: 'What is 1/4 of 12 pencils?',
        steps: ['Share 12 into 4 equal groups.', 'Each group has 3.'],
        answer: '1/4 of 12 is 3.',
        art: { kind: 'groups', groups: 4, each: 3 },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking half of 8 is 2.',
        right: 'Share 8 into 2 groups. Half is 4.',
      },
    ],
    realLife: [
      'Sharing sweets.',
      'Half a class going outside.',
      'A quarter of an hour.',
    ],
    tryIt: {
      need: '12 stones',
      steps: [
        'Find half of 12.',
        'Find a quarter of 12.',
        'Find a third of 12.',
      ],
    },
  },
  'mathematics-22': {
    indicator: {
      code: 'B3.1.3.1.3',
      text: 'Compare and order unit fractions and fractions with like denominators.',
    },
    hook: 'Would you rather have 1/3 or 1/6 of a cake? Think before you choose!',
    explain: [
      'For unit fractions, the bigger the bottom number, the smaller the piece.',
      'So 1/3 is bigger than 1/6.',
      'When the bottom numbers are the same, compare the top numbers: 3/8 is bigger than 1/8.',
    ],
    art: { kind: 'cake', parts: 3, picked: 1, label: 'One-third of a cake' },
    artCaption: 'Fewer parts means bigger pieces.',
    words: [
      {
        term: 'Like denominators',
        meaning: 'Fractions with the same bottom number.',
      },
      { term: 'Numerator', meaning: 'The top number: how many parts we take.' },
      { term: 'Compare', meaning: 'Find which is bigger.' },
    ],
    examples: [
      {
        title: 'Which is bigger?',
        situation: 'Which is bigger, 1/3 or 1/6?',
        steps: [
          'Thirds are made from 3 parts.',
          'Sixths are made from 6 parts, so they are smaller.',
        ],
        answer: '1/3 is bigger.',
      },
      {
        title: 'Same bottom number',
        situation: 'Order 2/8, 5/8 and 3/8 from smallest to biggest.',
        steps: [
          'The bottom numbers are the same.',
          'Compare the top numbers: 2, 3, 5.',
        ],
        answer: '2/8, 3/8, 5/8.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 1/8 is bigger than 1/4.',
        right: 'Eighths are smaller pieces than quarters.',
      },
    ],
    realLife: [
      'Sharing food fairly.',
      'Choosing a piece of cake.',
      'Fractions of an hour.',
    ],
    tryIt: {
      need: 'Paper strips of the same length',
      steps: [
        'Fold one into thirds and one into sixths.',
        'Compare one-third and one-sixth.',
        'Which is bigger?',
      ],
    },
  },
  'mathematics-23': {
    indicator: {
      code: 'B3.1.4.1.1',
      text: 'Use different denominations of money to buy and give change.',
    },
    hook: 'You buy pencils for 7 cedis and pay with a 10 cedi note. How much change should you get?',
    explain: [
      'Ghana’s notes include 1, 2, 5, 10, 20 and 50 cedis.',
      'Change is the money you get back when you pay too much.',
      'Count up from the price to the money you paid.',
    ],
    art: { kind: 'cedis', notes: [10, 5, 2, 1], label: 'Ghana cedi notes' },
    artCaption: 'Different notes make different amounts.',
    words: [
      { term: 'Denomination', meaning: 'The value of a note or coin.' },
      { term: 'Change', meaning: 'Money you get back.' },
      { term: 'Price', meaning: 'What something costs.' },
    ],
    examples: [
      {
        title: 'Give change',
        situation: 'Pencils cost 7 cedis. You pay 10 cedis. What change?',
        steps: ['Count up from 7 to 10: 8, 9, 10.', 'That is 3.'],
        answer: '3 cedis change.',
      },
      {
        title: 'Make 30 cedis',
        situation: 'Find a way to make 30 cedis with notes.',
        steps: ['20 + 10 = 30.', 'Or 10 + 10 + 5 + 5 = 30.'],
        answer: 'There are many ways.',
        art: { kind: 'cedis', notes: [20, 10] },
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to count your change.',
        right: 'Always check your change.',
      },
    ],
    realLife: [
      'Shopping at the market.',
      'Paying for a trotro ride.',
      'Buying food at school.',
    ],
    tryIt: {
      need: 'Play money',
      steps: [
        'Play shop with a friend.',
        'Buy something and pay with a bigger note.',
        'Count the change.',
      ],
    },
  },
  'mathematics-24': {
    indicator: {
      code: 'B3.2.1.1.1',
      text: 'Demonstrate an understanding of increasing and decreasing patterns.',
    },
    hook: '3, 6, 9, 12, 15… What is the rule? What comes next?',
    explain: [
      'A pattern follows a rule.',
      '3, 6, 9, 12 adds 3 each time. It is increasing.',
      '30, 27, 24, 21 takes away 3 each time. It is decreasing.',
    ],
    art: {
      kind: 'pattern',
      terms: [3, 6, 9, 12, 15, null],
      rule: 'Add 3 each time.',
    },
    artCaption: 'Each jump is 3.',
    words: [
      { term: 'Rule', meaning: 'What you do each time.' },
      { term: 'Increasing', meaning: 'Getting bigger.' },
      { term: 'Decreasing', meaning: 'Getting smaller.' },
    ],
    examples: [
      {
        title: 'Continue it',
        situation: 'What comes next: 30, 27, 24, 21, 18?',
        steps: ['Each jump takes away 3.', '18 − 3 = 15.', '15 − 3 = 12.'],
        answer: '15 and 12.',
      },
      {
        title: 'Find the missing one',
        situation: '45, 40, 35, 30, ___, 20.',
        steps: ['Each jump takes away 5.', '30 − 5 = 25.'],
        answer: '25.',
      },
    ],
    mistakes: [
      {
        wrong: 'Only checking one jump.',
        right: 'Check that every jump follows the rule.',
      },
    ],
    realLife: [
      'Saving the same amount each week.',
      'Counting by 5s on a clock.',
      'Rows of seats getting longer.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a pattern with the rule “add 10”.',
        'Make one with “take away 2”.',
        'Ask a friend to find your rule.',
      ],
    },
  },
  'mathematics-25': {
    indicator: {
      code: 'B3.3.1.1.1',
      text: 'Describe 3D objects by their faces, edges and vertices, and sort polygons by their sides.',
    },
    hook: 'A box has flat faces, straight edges and pointy corners. Can you count them?',
    explain: [
      'A face is a flat surface. An edge is where two faces meet. A vertex is a corner.',
      'A cube has 6 faces, 12 edges and 8 vertices.',
      'Flat shapes, called polygons, are sorted by how many sides they have.',
    ],
    art: { kind: 'solids', names: ['cube', 'box', 'pyramid', 'cylinder'] },
    artCaption: 'Count the faces, edges and corners.',
    words: [
      { term: 'Face', meaning: 'A flat surface of a solid.' },
      { term: 'Edge', meaning: 'Where two faces meet.' },
      { term: 'Vertex', meaning: 'A corner. More than one are vertices.' },
    ],
    examples: [
      {
        title: 'Count the cube',
        situation: 'How many faces, edges and vertices does a cube have?',
        steps: [
          'Faces: top, bottom, front, back, left, right: 6.',
          'Edges: 12.',
          'Vertices: 8.',
        ],
        answer: '6 faces, 12 edges, 8 vertices.',
        art: { kind: 'solids', names: ['cube'] },
      },
    ],
    mistakes: [
      {
        wrong: 'Counting the same edge twice.',
        right: 'Mark each edge as you count it.',
      },
    ],
    realLife: ['Boxes and packets.', 'Dice.', 'Buildings.'],
    tryIt: {
      need: 'A small box',
      steps: ['Count its faces.', 'Count its edges.', 'Count its vertices.'],
    },
  },
  'mathematics-26': {
    indicator: { code: 'B3.3.1.1.2', text: 'Draw and identify angles.' },
    hook: 'When two lines meet, they make an angle. Open a book slowly and watch the angle grow!',
    explain: [
      'An angle is made when two lines meet at a point.',
      'The more the lines open, the bigger the angle.',
      'We can draw shapes with given sides and measure their sides.',
    ],
    art: { kind: 'angle', degrees: 50 },
    artCaption: 'Two lines meeting make an angle.',
    words: [
      { term: 'Angle', meaning: 'The turn between two lines that meet.' },
      { term: 'Arm', meaning: 'One of the two lines of an angle.' },
      { term: 'Polygon', meaning: 'A flat shape with straight sides.' },
    ],
    examples: [
      {
        title: 'Bigger or smaller?',
        situation: 'A door opens a little, then wide. Which angle is bigger?',
        steps: ['A wide-open door has arms further apart.'],
        answer: 'The wide-open door makes the bigger angle.',
        art: { kind: 'angle', degrees: 130 },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking longer arms make a bigger angle.',
        right: 'Only the opening matters, not the length.',
      },
    ],
    realLife: [
      'Opening a door.',
      'The hands of a clock.',
      'Corners of a book.',
    ],
    tryIt: {
      need: 'Two pencils',
      steps: [
        'Hold them together at one end.',
        'Open them a little, then wide.',
        'Draw both angles.',
      ],
    },
  },
  'mathematics-27': {
    indicator: {
      code: 'B3.3.1.1.3',
      text: 'Use a square corner to tell which angles are right angles and which are not.',
    },
    hook: 'The corner of your exercise book is a perfect square corner. Use it to test other angles!',
    explain: [
      'A square corner is called a right angle.',
      'Fold a paper twice to make a square corner tester.',
      'Angles smaller or bigger than your tester are not right angles.',
    ],
    art: { kind: 'angle', degrees: 90 },
    artCaption: 'A right angle is a square corner.',
    words: [
      { term: 'Right angle', meaning: 'A square corner.' },
      { term: 'Tester', meaning: 'A tool to check something.' },
      { term: 'Square corner', meaning: 'A corner like the corner of a page.' },
    ],
    examples: [
      {
        title: 'Test the corner',
        situation: 'Is the corner of a door a right angle?',
        steps: ['Hold your paper tester in the corner.', 'It fits exactly.'],
        answer: 'Yes, it is a right angle.',
      },
    ],
    mistakes: [
      { wrong: 'Guessing by looking.', right: 'Use your tester to check.' },
    ],
    realLife: [
      'Corners of windows.',
      'Corners of tables.',
      'Corners of a football pitch.',
    ],
    tryIt: {
      need: 'A sheet of paper',
      steps: [
        'Fold it in half, then in half again, to make a square corner.',
        'Find 3 right angles in your classroom.',
        'Find 2 angles that are not right angles.',
      ],
    },
  },
  'mathematics-28': {
    indicator: {
      code: 'B3.3.1.1.4',
      text: 'Recognise rhombuses, parallelograms, trapezoids, rectangles and squares as quadrilaterals.',
    },
    hook: 'All these shapes have four sides. So why do they have different names?',
    explain: [
      'A quadrilateral is any shape with 4 straight sides.',
      'Squares and rectangles have 4 right angles. A rhombus has 4 equal sides.',
      'A parallelogram has opposite sides parallel. A trapezoid has one pair of parallel sides.',
    ],
    art: {
      kind: 'shapes',
      names: ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid'],
    },
    artCaption: 'Every shape here is a quadrilateral.',
    words: [
      { term: 'Quadrilateral', meaning: 'A shape with 4 straight sides.' },
      {
        term: 'Parallel',
        meaning: 'Lines that never meet, like train tracks.',
      },
      {
        term: 'Trapezoid',
        meaning: 'A quadrilateral with one pair of parallel sides.',
      },
    ],
    examples: [
      {
        title: 'Name it',
        situation: 'A shape has 4 equal sides but no right angles. What is it?',
        steps: [
          '4 equal sides: a square or a rhombus.',
          'No right angles: not a square.',
        ],
        answer: 'A rhombus.',
        art: { kind: 'shapes', names: ['rhombus'] },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a square is not a rhombus.',
        right: 'A square is a special rhombus with right angles.',
      },
    ],
    realLife: ['Windows and doors.', 'Floor tiles.', 'Kite shapes in the sky.'],
    tryIt: {
      need: 'Four sticks',
      steps: [
        'Make a square.',
        'Push it to make a rhombus.',
        'What changed? What stayed the same?',
      ],
    },
  },
  'mathematics-29': {
    indicator: {
      code: 'B3.3.2.1.1',
      text: 'Represent whole numbers as distances from any given location on a number line.',
    },
    hook: 'A rod starts at 3 and ends at 8 on a number line. How long is it?',
    explain: [
      'Distance on a number line is the number of spaces between two points.',
      'From 3 to 8, count the spaces: 5.',
      'The length stays the same wherever you put the rod.',
    ],
    art: {
      kind: 'jumps',
      start: 3,
      jumps: [5],
      label: 'From 3 to 8 is 5 units',
    },
    artCaption: 'Count the spaces, not the marks.',
    words: [
      { term: 'Distance', meaning: 'How far apart two points are.' },
      { term: 'Unit', meaning: 'One space on the number line.' },
      { term: 'Interval', meaning: 'The space between two marks.' },
    ],
    examples: [
      {
        title: 'Measure the rod',
        situation: 'A rod goes from 4 to 11. How long is it?',
        steps: ['11 − 4 = 7.'],
        answer: '7 units.',
      },
    ],
    mistakes: [
      {
        wrong: 'Counting the marks instead of the spaces.',
        right: 'Count the spaces between the marks.',
      },
    ],
    realLife: [
      'Measuring with a ruler not starting at 0.',
      'Distance between towns on a road.',
      'Steps on a ladder.',
    ],
    tryIt: {
      need: 'A ruler and a pencil',
      steps: [
        'Put the pencil from 2 to 9 on the ruler.',
        'Count the spaces.',
        'Move it to start at 0. Is it the same length?',
      ],
    },
  },
  'mathematics-30': {
    indicator: {
      code: 'B3.3.3.1.1',
      text: 'Model and describe the relationship between the metre and the centimetre.',
    },
    hook: 'A ruler shows centimetres. A metre rule is much longer. How many centimetres make a metre?',
    explain: [
      'Centimetres (cm) measure short lengths, such as a pencil.',
      'Metres (m) measure long lengths, such as a classroom.',
      '100 centimetres make 1 metre.',
    ],
    art: { kind: 'ruler', cm: 7, label: 'This pencil is 7 cm long' },
    artCaption: 'Start at 0 and read the end.',
    words: [
      { term: 'Centimetre (cm)', meaning: 'A short unit of length.' },
      { term: 'Metre (m)', meaning: 'A longer unit: 100 cm.' },
      { term: 'Ruler', meaning: 'A tool marked in centimetres.' },
    ],
    examples: [
      {
        title: 'Measure a pencil',
        situation:
          'A pencil starts at 0 and ends at 7 on a ruler. How long is it?',
        steps: ['Read the number at the end: 7.'],
        answer: '7 cm.',
      },
      {
        title: 'Change the units',
        situation: 'How many centimetres are in 2 metres?',
        steps: ['1 metre is 100 cm.', '100 + 100 = 200.'],
        answer: '200 cm.',
      },
    ],
    mistakes: [
      { wrong: 'Starting to measure from 1.', right: 'Start from 0.' },
    ],
    realLife: [
      'Measuring cloth at the tailor’s.',
      'Measuring your height.',
      'Measuring a room.',
    ],
    tryIt: {
      need: 'A ruler',
      steps: [
        'Measure your pencil, your book and your hand.',
        'Write each length in cm.',
        'Which is longest?',
      ],
    },
  },
  'mathematics-31': {
    indicator: {
      code: 'B3.3.3.1.2',
      text: 'Select and justify referents for the metre and centimetre.',
    },
    hook: 'Would you measure a road in centimetres? Choosing the right unit matters!',
    explain: [
      'A referent is something you know the size of, to help you estimate.',
      'Your fingernail is about 1 cm wide. A big step is about 1 m.',
      'Use cm for small things and m for big things.',
    ],
    art: {
      kind: 'ruler',
      cm: 1,
      label: 'About the width of a fingernail: 1 cm',
    },
    artCaption: '1 cm is very small.',
    words: [
      {
        term: 'Referent',
        meaning: 'Something you know, used to estimate size.',
      },
      { term: 'Suitable', meaning: 'Right for the job.' },
      { term: 'Justify', meaning: 'Give a reason.' },
    ],
    examples: [
      {
        title: 'Choose the unit',
        situation: 'Which unit for a classroom: cm or m?',
        steps: ['A classroom is large.', 'Many big steps fit along it.'],
        answer: 'Metres.',
      },
    ],
    mistakes: [
      {
        wrong: 'Measuring a long road in centimetres.',
        right: 'Use metres for long distances.',
      },
    ],
    realLife: [
      'Tailors measuring in cm.',
      'Builders measuring in m.',
      'Running races in m.',
    ],
    tryIt: {
      need: 'A ruler',
      steps: [
        'Find something about 1 cm wide.',
        'Take a step about 1 m long, and check with a metre rule.',
        'Use them to estimate a desk.',
      ],
    },
  },
  'mathematics-32': {
    indicator: {
      code: 'B3.3.3.1.3',
      text: 'Estimate lengths and perimeters of shapes and verify by measuring.',
    },
    hook: 'You want to put a fence around a garden. How much fence do you need?',
    explain: [
      'The perimeter is the distance all the way around a shape.',
      'Add the lengths of all the sides.',
      'Different shapes can have the same perimeter.',
    ],
    art: { kind: 'shapes', names: ['rectangle'] },
    artCaption: 'Add all the sides to find the perimeter.',
    words: [
      { term: 'Perimeter', meaning: 'The distance around a shape.' },
      { term: 'Side', meaning: 'One edge of a shape.' },
      { term: 'Fence', meaning: 'A wall around an area.' },
    ],
    examples: [
      {
        title: 'Around the garden',
        situation: 'A garden is 5 m long and 3 m wide. What is its perimeter?',
        steps: ['5 + 3 + 5 + 3 = 16.'],
        answer: '16 m.',
      },
      {
        title: 'Same perimeter',
        situation: 'Can a square have the same perimeter of 16 m?',
        steps: ['A square has 4 equal sides.', '4 + 4 + 4 + 4 = 16.'],
        answer: 'Yes, a square with 4 m sides.',
      },
    ],
    mistakes: [
      { wrong: 'Adding only two sides.', right: 'Add all the sides.' },
    ],
    realLife: [
      'Fencing a garden.',
      'Putting a border on a notice board.',
      'Running around a field.',
    ],
    tryIt: {
      need: 'A ruler and a book',
      steps: [
        'Estimate the perimeter of your book.',
        'Measure each side.',
        'Add them. How close was your estimate?',
      ],
    },
  },
  'mathematics-33': {
    indicator: {
      code: 'B3.3.3.2.1',
      text: 'Model and describe the relationship between kilograms and grams, and litres and millilitres.',
    },
    hook: 'A bag of rice is heavy. A sweet is light. We use different units for each!',
    explain: [
      'Grams (g) measure light things. Kilograms (kg) measure heavy things.',
      '1000 grams make 1 kilogram.',
      'Millilitres (ml) measure small amounts of liquid. 1000 ml make 1 litre (l).',
    ],
    art: { kind: 'fill', cups: 4, label: '4 cups of 250 ml make 1 litre' },
    artCaption: '250 + 250 + 250 + 250 = 1000 ml.',
    words: [
      { term: 'Gram (g)', meaning: 'A small unit of mass.' },
      { term: 'Kilogram (kg)', meaning: 'A big unit of mass: 1000 g.' },
      { term: 'Litre (l)', meaning: 'A unit of capacity: 1000 ml.' },
    ],
    examples: [
      {
        title: 'Fill a litre',
        situation: 'A cup holds 250 ml. How many cups make 1 litre?',
        steps: ['250 + 250 + 250 + 250 = 1000.', '1000 ml is 1 litre.'],
        answer: '4 cups.',
      },
      {
        title: 'Choose the unit',
        situation: 'Would you weigh a bag of rice in g or kg?',
        steps: ['A bag of rice is heavy.'],
        answer: 'Kilograms.',
      },
    ],
    mistakes: [{ wrong: 'Thinking 1 kg is 100 g.', right: '1 kg is 1000 g.' }],
    realLife: [
      'Buying rice in kilograms.',
      'Water in 1 litre bottles.',
      'Medicine in millilitres.',
    ],
    tryIt: {
      need: 'Empty bottles and packets at home',
      steps: [
        'Find the labels.',
        'Write down any g, kg, ml or l you see.',
        'Sort them: mass or capacity?',
      ],
    },
  },
  'mathematics-34': {
    indicator: {
      code: 'B3.3.3.2.2',
      text: 'Estimate masses and volumes using referents and verify by measuring.',
    },
    hook: 'Which is heavier: a pineapple or a mango? Guess first, then check!',
    explain: [
      'Use something you know as a referent: a 1 litre bottle, a 1 kg bag of sugar.',
      'Estimate first by comparing.',
      'Then check with a scale or a measuring jug.',
    ],
    art: {
      kind: 'balance',
      left: 'pineapple',
      right: 'mango',
      equal: false,
      heavier: 'left',
    },
    artCaption: 'The heavier side goes down.',
    words: [
      { term: 'Mass', meaning: 'How heavy something is.' },
      { term: 'Volume', meaning: 'How much space a liquid takes up.' },
      { term: 'Verify', meaning: 'Check if something is true.' },
    ],
    examples: [
      {
        title: 'Estimate and check',
        situation:
          'A bucket is filled with 1 litre bottles of water. You estimate 8. You count 10. How close?',
        steps: ['10 − 8 = 2.'],
        answer: 'Your estimate was 2 litres short.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking bigger things are always heavier.',
        right: 'Check with a scale. Some big things are light.',
      },
    ],
    realLife: [
      'Buying fruit by weight.',
      'Filling water containers.',
      'Weighing yourself.',
    ],
    tryIt: {
      need: 'A 1 litre bottle and a bowl',
      steps: [
        'Estimate how many litres fill the bowl.',
        'Fill it and count.',
        'Compare with your estimate.',
      ],
    },
  },
  'mathematics-35': {
    indicator: {
      code: 'B3.3.3.3.1',
      text: 'Use units to measure the time taken to complete simple events.',
    },
    hook: 'A game of ampe starts at 10:30 and ends at 10:45. How long did it last?',
    explain: [
      'We measure time in seconds, minutes and hours.',
      'To find how long something takes, count from the start time to the end time.',
      'Some things take minutes. Some take hours or days.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['10:30', 'Ampe starts'],
        ['10:45', 'Ampe ends'],
      ],
    },
    artCaption: 'From 10:30 to 10:45 is 15 minutes.',
    words: [
      { term: 'Minute', meaning: '60 seconds.' },
      { term: 'Hour', meaning: '60 minutes.' },
      { term: 'Duration', meaning: 'How long something lasts.' },
    ],
    examples: [
      {
        title: 'How long?',
        situation: 'Netball starts at 9:00 and ends at 10:00. How long?',
        steps: ['From 9:00 to 10:00 is 1 hour.'],
        answer: '1 hour.',
      },
      {
        title: 'Ampe',
        situation: 'Ampe starts at 10:30 and ends at 10:45. How long?',
        steps: ['Count the minutes from 30 to 45.', '45 − 30 = 15.'],
        answer: '15 minutes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Taking the start time away from the wrong number.',
        right: 'Count from the start time to the end time.',
      },
    ],
    realLife: [
      'How long school lasts.',
      'How long a football match takes.',
      'Cooking times.',
    ],
    tryIt: {
      need: 'A clock or watch',
      steps: [
        'Note the time you start your homework.',
        'Note the time you finish.',
        'Work out how long it took.',
      ],
    },
  },
  'mathematics-36': {
    indicator: {
      code: 'B3.3.3.3.2',
      text: 'Read dates on the calendar, order dates of events and count days, weeks and months.',
    },
    hook: 'How many days until your birthday? A calendar can tell you!',
    explain: [
      'A calendar shows days, weeks and months.',
      'Remember: 30 days has September, April, June and November. All the rest have 31, except February.',
      'Count days on a calendar to find how long until an event.',
    ],
    art: { kind: 'calendar', month: 'March', days: 31, startsOn: 0, focus: 6 },
    artCaption: '6 March is Independence Day.',
    words: [
      { term: 'Date', meaning: 'The day and month, such as 6 March.' },
      { term: 'Leap year', meaning: 'A year when February has 29 days.' },
      { term: 'Week', meaning: '7 days.' },
    ],
    examples: [
      {
        title: 'Count the days',
        situation: 'Today is 1 March. How many days until 6 March?',
        steps: ['Count on: 2, 3, 4, 5, 6.'],
        answer: '5 days.',
      },
      {
        title: 'Weeks and days',
        situation: 'How many days are in 3 weeks?',
        steps: ['7 + 7 + 7 = 21.'],
        answer: '21 days.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking every month has 30 days.',
        right: 'Use the rhyme to remember.',
      },
    ],
    realLife: [
      'Planning a birthday party.',
      'School holidays.',
      'Festivals and Christmas.',
    ],
    tryIt: {
      need: 'A calendar',
      steps: [
        'Find your birthday.',
        'Count the weeks until then.',
        'Mark three special days this year.',
      ],
    },
  },
  'mathematics-37': {
    indicator: {
      code: 'B3.3.3.3.3',
      text: 'Relate seconds to a minute, minutes to an hour and days to a month in problems.',
    },
    hook: 'How many seconds are in one minute? Let us count and find out!',
    explain: [
      '60 seconds make 1 minute. 60 minutes make 1 hour.',
      '24 hours make 1 day. 7 days make 1 week.',
      '12 months make 1 year, and a year has about 52 weeks.',
    ],
    art: {
      kind: 'clock',
      hour: 3,
      label: 'A clock measures hours and minutes',
    },
    artCaption: 'Time units fit inside each other.',
    words: [
      { term: 'Second', meaning: 'A very short unit of time.' },
      { term: 'Day', meaning: '24 hours.' },
      { term: 'Year', meaning: '12 months.' },
    ],
    examples: [
      {
        title: 'Change the units',
        situation: 'How many minutes are in 2 hours?',
        steps: ['1 hour is 60 minutes.', '60 + 60 = 120.'],
        answer: '120 minutes.',
      },
      {
        title: 'Days in two weeks',
        situation: 'How many days are in 2 weeks?',
        steps: ['7 + 7 = 14.'],
        answer: '14 days.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking an hour has 100 minutes.',
        right: 'An hour has 60 minutes.',
      },
    ],
    realLife: [
      'Timing a race in seconds.',
      'Counting days of the school holiday.',
      'Months until your birthday.',
    ],
    tryIt: {
      need: 'A clock with a seconds hand',
      steps: [
        'Count 60 seconds while watching the clock.',
        'How many times can you clap in 1 minute?',
        'Write your result.',
      ],
    },
  },
  'mathematics-38': {
    indicator: {
      code: 'B3.4.1.1.1',
      text: 'Gather and record data using tallies, checkmarks, charts, lists or tables.',
    },
    hook: 'How do pupils in your class come to school? Collect the data and find out!',
    explain: [
      'Data is information we collect.',
      'Tallies and tables help us keep count.',
      'We use the data to answer questions.',
    ],
    art: {
      kind: 'tally',
      rows: [
        ['Walk', 12],
        ['Trotro', 7],
        ['Car', 4],
      ],
    },
    artCaption: 'How pupils come to school.',
    words: [
      { term: 'Data', meaning: 'Information we collect.' },
      { term: 'Tally', meaning: 'A mark to keep count, in groups of five.' },
      { term: 'Table', meaning: 'Rows and columns of information.' },
    ],
    examples: [
      {
        title: 'Read the data',
        situation: 'Walk 12, trotro 7, car 4. How many pupils?',
        steps: ['12 + 7 = 19.', '19 + 4 = 23.'],
        answer: '23 pupils.',
      },
      {
        title: 'Compare',
        situation: 'How many more pupils walk than come by car?',
        steps: ['12 − 4 = 8.'],
        answer: '8 more walk.',
      },
    ],
    mistakes: [
      {
        wrong: 'Asking the same person twice.',
        right: 'Ask each person once.',
      },
    ],
    realLife: ['Class surveys.', 'Counting votes.', 'Keeping scores.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Ask 15 classmates how they come to school.',
        'Record with tallies.',
        'Write two facts from your data.',
      ],
    },
  },
  'mathematics-39': {
    indicator: {
      code: 'B3.4.1.2.1',
      text: 'Draw and interpret concrete graphs and pictographs to solve problems.',
    },
    hook: 'In a pictograph, one picture can stand for more than one thing. How many does each picture mean?',
    explain: [
      'A pictograph uses pictures to show data.',
      'A key tells you what each picture stands for, such as 1 picture = 2 mangoes.',
      'Count the pictures, then use the key.',
    ],
    art: {
      kind: 'picto',
      item: 'mango',
      rows: [
        ['Mon', 3],
        ['Tue', 5],
        ['Wed', 2],
      ],
    },
    artCaption: 'Key: each mango stands for 2 mangoes sold.',
    words: [
      { term: 'Pictograph', meaning: 'A graph made with pictures.' },
      { term: 'Key', meaning: 'Tells what each picture stands for.' },
      { term: 'Title', meaning: 'Tells what the graph is about.' },
    ],
    examples: [
      {
        title: 'Use the key',
        situation:
          'On Tuesday there are 5 mango pictures. Each stands for 2 mangoes. How many were sold?',
        steps: ['2 + 2 + 2 + 2 + 2 = 10.'],
        answer: '10 mangoes.',
      },
      {
        title: 'Compare days',
        situation:
          'Monday has 3 pictures and Wednesday has 2. How many more mangoes on Monday?',
        steps: [
          'Monday: 2 + 2 + 2 = 6.',
          'Wednesday: 2 + 2 = 4.',
          '6 − 4 = 2.',
        ],
        answer: '2 more mangoes on Monday.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to use the key.',
        right: 'Check what each picture stands for.',
      },
    ],
    realLife: [
      'Charts in newspapers.',
      'School data displays.',
      'Market sales records.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Collect data on favourite fruits.',
        'Draw a pictograph with a key.',
        'Give it a title.',
      ],
    },
  },
}
