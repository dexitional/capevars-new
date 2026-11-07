import type { CourseGuides } from './types'

// Basic 6 Mathematics, written for this course and scoped to the NaCCA
// Mathematics Curriculum for Primary Schools, Basic 4–6 (2019). Notes:
// - The imported lessons carry no indicator codes; each guide names the
//   indicator its lesson teaches. HCF and LCM share one indicator, as do the
//   three algebraic-expression lessons.
// - Misprinted codes are given as the sequence requires: the integer
//   indicators are B6.1.2.6.1 to .3; the transformation standard, printed
//   with the same code as the compass standard (B6.3.3.5), is B6.3.3.6; the
//   questionnaire indicator, printed B6.5.2.2, is B6.4.1.2.2; and P6.4.2.2.3
//   is B6.4.2.2.3.
// - Numbers are read to 1,000,000,000; multiplication facts go to 12 × 12;
//   division is by one-digit numbers.
// - Ratios are written with spaces, as in 2 : 3, so they are read “2 to 3”.

export const guides: CourseGuides = {
  'mathematics-01': {
    indicator: {
      code: 'B6.1.1.1.1',
      text: 'Model number quantities up to 1,000,000 using graph sheets and multi-base blocks.',
    },
    hook: 'A big district might have 806,592 people. What does each digit of that number tell us?',
    explain: [
      'Each digit has a place: hundred thousands, ten thousands, thousands, hundreds, tens and ones.',
      'Each place is worth ten times the place to its right.',
      'On graph paper, a block of 10 by 10 squares is 100. A thousand such blocks make 100,000.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['HTh', '8'],
        ['TTh', '0'],
        ['Th', '6'],
        ['H', '5'],
        ['T', '9'],
        ['O', '2'],
      ],
      label: '806,592',
    },
    artCaption: 'The 0 holds the ten thousands place.',
    words: [
      { term: 'Place value', meaning: 'What a digit is worth in its place.' },
      {
        term: 'Expanded form',
        meaning: 'A number written as the sum of its place values.',
      },
      { term: 'Graph sheet', meaning: 'Paper ruled in small squares.' },
    ],
    examples: [
      {
        title: 'Expand it',
        situation: 'Write 806,592 in expanded form.',
        steps: [
          '8 hundred thousands, no ten thousands and 6 thousands.',
          '5 hundreds, 9 tens and 2 ones.',
        ],
        answer: '806592 = 800000 + 6000 + 500 + 90 + 2.',
      },
      {
        title: 'Thousands in a million',
        situation: 'How many thousands make one million?',
        steps: ['1000000 ÷ 1000 = 1000.'],
        answer: 'One thousand thousands.',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out the zero and writing 86,592.',
        right: 'A zero must hold every empty place: 806,592.',
      },
    ],
    realLife: ['Population figures.', 'Government budgets.', 'Counting votes.'],
    tryIt: {
      need: 'Graph paper',
      steps: [
        'Shade a 10 by 10 block and label it 100.',
        'Work out how many such blocks make 10,000.',
        'Explain how you would show 1,000,000.',
      ],
    },
  },
  'mathematics-02': {
    indicator: {
      code: 'B6.1.1.1.2',
      text: 'Read and write numbers in figures and in words up to 1,000,000,000.',
    },
    hook: 'Countries count their people in millions, and some budgets reach billions. How do we read such huge numbers?',
    explain: [
      'Big numbers are split into groups of three digits called periods: millions, thousands and ones.',
      'Read each period, then say its name: 507,030,400 is five hundred and seven million, thirty thousand, four hundred.',
      'One billion is a thousand millions: 1,000,000,000.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['Millions', '507'],
        ['Thousands', '030'],
        ['Ones', '400'],
      ],
      label: '507,030,400',
    },
    artCaption: 'Read each period, then its name.',
    words: [
      { term: 'Period', meaning: 'A group of three digits in a big number.' },
      { term: 'Million', meaning: 'A thousand thousands: 1,000,000.' },
      { term: 'Billion', meaning: 'A thousand millions: 1,000,000,000.' },
    ],
    examples: [
      {
        title: 'Words to figures',
        situation: 'Write three million, forty thousand and nine in figures.',
        steps: [
          'Millions period: 3.',
          'Thousands period: 040.',
          'Ones period: 009.',
        ],
        answer: '3,040,009.',
      },
      {
        title: 'Figures to words',
        situation: 'Write 12,500,000 in words.',
        steps: ['12 millions.', '500 thousands.', 'No ones.'],
        answer: 'Twelve million, five hundred thousand.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing three million, forty thousand and nine as 340,009.',
        right: 'Each period needs three digits: 3,040,009.',
      },
    ],
    realLife: ['Census results.', 'National budgets.', 'Distances in space.'],
    tryIt: {
      need: 'A newspaper or an adult’s phone',
      steps: [
        'Find a number in the millions.',
        'Read it aloud by periods.',
        'Write it in words.',
      ],
    },
  },
  'mathematics-03': {
    indicator: {
      code: 'B6.1.1.1.3',
      text: 'Identify numbers in different positions around a given number in a number chart.',
    },
    hook: 'Number charts work for big numbers too. If you know the pattern, you can find any neighbour.',
    explain: [
      'On a chart that counts in ones, moving right adds 1 and moving down adds 10.',
      'On a chart that counts in hundreds, moving right adds 100 and moving down adds 1,000.',
      'Find the step between columns and the step between rows first.',
    ],
    art: { kind: 'chart', start: 701, focus: 735 },
    artCaption: 'The neighbours of 735 are 725, 745, 734 and 736.',
    words: [
      { term: 'Neighbour', meaning: 'A number next to another on a chart.' },
      { term: 'Step', meaning: 'How much the numbers change each move.' },
      { term: 'Diagonal', meaning: 'A slanting move across rows and columns.' },
    ],
    examples: [
      {
        title: 'A chart of hundreds',
        situation:
          'A chart counts in hundreds, with ten in each row. What is below 45,300?',
        steps: ['Each row adds ten hundreds.', '45300 + 1000 = 46300.'],
        answer: '46,300.',
      },
      {
        title: 'A diagonal move',
        situation: 'On a chart of ones, what is down and to the right of 735?',
        steps: ['Down adds 10 and right adds 1.', '735 + 11 = 746.'],
        answer: '746.',
      },
    ],
    mistakes: [
      {
        wrong: 'Using the same step for every chart.',
        right: 'Check how much each chart counts by.',
      },
    ],
    realLife: ['Seat numbers in a stadium.', 'House numbers.', 'Spreadsheets.'],
    tryIt: {
      need: 'Squared paper',
      steps: [
        'Make a chart counting in 1000s from 250,000.',
        'Circle any number.',
        'Write its four neighbours.',
      ],
    },
  },
  'mathematics-04': {
    indicator: {
      code: 'B6.1.1.1.4',
      text: 'Compare and order whole numbers and represent the comparison using <, > or =.',
    },
    hook: 'Three stadiums sold 452,310, 425,310 and 452,130 tickets in a season. Which sold the most?',
    explain: [
      'Line up the digits by place value.',
      'Compare from the left. The first place with different digits decides.',
      'Use > for “greater than” and < for “less than”.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Stadium A', 452310],
        ['Stadium B', 425310],
        ['Stadium C', 452130],
      ],
      label: 'Tickets sold in a season',
    },
    artCaption: 'Close numbers need careful comparing.',
    words: [
      { term: 'Greater than (>)', meaning: 'Bigger than.' },
      { term: 'Less than (<)', meaning: 'Smaller than.' },
      { term: 'Descending', meaning: 'From biggest to smallest.' },
    ],
    examples: [
      {
        title: 'Compare',
        situation: 'Compare 452,310 and 452,130.',
        steps: [
          'Hundred thousands, ten thousands and thousands match.',
          'Hundreds: 3 and 1.',
        ],
        answer: '452,310 > 452,130.',
      },
      {
        title: 'Order them',
        situation: 'Order all three from smallest.',
        steps: [
          '425,310 has only 2 ten thousands.',
          'Then compare the other two.',
        ],
        answer: '425,310 < 452,130 < 452,310.',
      },
    ],
    mistakes: [
      {
        wrong: 'Comparing the last digits first.',
        right: 'Start from the biggest place.',
      },
    ],
    realLife: [
      'Comparing sales.',
      'Comparing populations.',
      'Ranking results.',
    ],
    tryIt: {
      need: 'Digit cards',
      steps: [
        'Make three six-digit numbers.',
        'Order them in descending order.',
        'Write them with < and >.',
      ],
    },
  },
  'mathematics-05': {
    indicator: {
      code: 'B6.1.1.1.5',
      text: 'Round whole numbers to the nearest ten thousand, thousand, hundred and ten.',
    },
    hook: 'A report says “about 390,000 people” when the count was 386,451. How did they get that?',
    explain: [
      'Find the place you are rounding to.',
      'Look at the digit to its right. Round up if it is 5 or more; round down if it is less.',
      'Rounding helps you estimate answers quickly.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['HTh', '3'],
        ['TTh', '8'],
        ['Th', '6'],
        ['H', '4'],
        ['T', '5'],
        ['O', '1'],
      ],
      label: '386,451 rounds to 390,000',
    },
    artCaption: 'To the nearest ten thousand, look at the thousands digit.',
    words: [
      { term: 'Round off', meaning: 'Go to the nearest simpler number.' },
      { term: 'Estimate', meaning: 'A close answer found by rounding.' },
      { term: 'Approximately', meaning: 'About, not exactly.' },
    ],
    examples: [
      {
        title: 'Four ways',
        situation: 'Round 386,451 to the nearest 10, 100, 1000 and 10,000.',
        steps: [
          'Nearest 10: 386,450.',
          'Nearest 100: 386,500.',
          'Nearest 1000: 386,000. Nearest 10,000: 390,000.',
        ],
        answer: '386,450, 386,500, 386,000 and 390,000.',
      },
      {
        title: 'Estimate a sum',
        situation: 'Estimate 48,750 + 31,260 to the nearest thousand.',
        steps: [
          '48,750 is about 49,000, and 31,260 is about 31,000.',
          '49000 + 31000 = 80000.',
        ],
        answer: 'About 80,000.',
      },
    ],
    mistakes: [
      {
        wrong: 'Rounding 386,451 to the nearest hundred as 386,400.',
        right: 'The tens digit is 5, so round up to 386,500.',
      },
    ],
    realLife: ['News reports.', 'Estimating costs.', 'Planning supplies.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the population of a place you find in a book or newspaper.',
        'Round it in four ways.',
        'Say which rounding is most useful.',
      ],
    },
  },
  'mathematics-06': {
    indicator: {
      code: 'B6.1.1.1.6',
      text: 'Skip count forwards and backwards in 5000s and 10,000s, up to and from 1,000,000.',
    },
    hook: 'A road project spends 5,000 cedis a day. Can you count its spending in big jumps?',
    explain: [
      'Skip counting in 5000s or 10,000s changes the bigger places.',
      'In 10,000s, the ten thousands digit goes up by one each time.',
      'Watch for when a place passes 9 and carries over.',
    ],
    art: {
      kind: 'pattern',
      terms: [25000, 30000, 35000, 40000, null],
      rule: 'Add 5000 each time.',
    },
    artCaption: 'Counting on in 5000s.',
    words: [
      { term: 'Skip count', meaning: 'Count by jumping the same amount.' },
      { term: 'Carry over', meaning: 'Pass ten into the next place.' },
      { term: 'Sequence', meaning: 'Numbers in order.' },
    ],
    examples: [
      {
        title: 'Count on in 10,000s',
        situation: 'Count on three times in 10,000s from 946,500.',
        steps: ['946,500 + 10,000 = 956,500.', 'Then 966,500 and 976,500.'],
        answer: '956,500, 966,500, 976,500.',
      },
      {
        title: 'Count back in 5000s',
        situation: 'Count back three times in 5000s from 1,000,000.',
        steps: ['Take away 5,000 each time.'],
        answer: '995,000, 990,000, 985,000.',
      },
    ],
    mistakes: [
      {
        wrong: 'Changing the thousands digit when counting in 10,000s.',
        right: 'Only the ten thousands place changes, unless it carries.',
      },
    ],
    realLife: ['Tracking spending.', 'Counting stock.', 'Long distances.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Say a six-digit number.',
        'Your friend counts on five times in 10,000s.',
        'Swap and count back in 5000s.',
      ],
    },
  },
  'mathematics-07': {
    indicator: {
      code: 'B6.1.1.2.1',
      text: 'Recognise the Roman numeral system up to C (100).',
    },
    hook: 'Roman numerals have only a few letters, yet they can show every number to 100. How?',
    explain: [
      'The letters up to 100 are I, V, X, L and C.',
      'Add letters that are in order from biggest to smallest: LXX is 70.',
      'Subtract when a smaller letter stands before a bigger one: XL is 40 and XC is 90.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['XL', '40'],
        ['L', '50'],
        ['XC', '90'],
        ['C', '100'],
      ],
      label: 'Key numerals up to C',
    },
    artCaption: 'XL and XC use subtraction.',
    words: [
      { term: 'Numeral', meaning: 'A symbol that stands for a number.' },
      { term: 'Add', meaning: 'Smaller letters after bigger ones.' },
      { term: 'Subtract', meaning: 'A smaller letter before a bigger one.' },
    ],
    examples: [
      {
        title: 'Read it',
        situation: 'What is LXXIV?',
        steps: ['L is 50, XX is 20 and IV is 4.', '50 + 20 + 4 = 74.'],
        answer: '74.',
      },
      {
        title: 'Read another',
        situation: 'What is XCIX?',
        steps: ['XC is 90 and IX is 9.', '90 + 9 = 99.'],
        answer: '99.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing 99 as IC.',
        right: 'Write the tens and ones separately: XCIX.',
      },
    ],
    realLife: [
      'Clock faces.',
      'Book chapters.',
      'Event names, such as the XXXIII Olympic Games.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write 40 to 50 in Roman numerals.',
        'Write 90 to 100.',
        'Circle every subtraction pair.',
      ],
    },
  },
  'mathematics-08': {
    indicator: {
      code: 'B6.1.1.2.2',
      text: 'Count and convert Hindu-Arabic numbers to Roman numerals up to 100 (C) and back.',
    },
    hook: 'Can you write your age, your class and this year’s date in Roman numerals?',
    explain: [
      'Split the number into tens and ones.',
      'Change each part into Roman numerals.',
      'Write them together, tens first.',
    ],
    art: { kind: 'clock', hour: 9, roman: true, label: 'IX is 9' },
    artCaption: 'IX is one before X.',
    words: [
      { term: 'Convert', meaning: 'Change to another form.' },
      { term: 'Tens', meaning: 'The 10s part of a number.' },
      { term: 'Ones', meaning: 'The units part of a number.' },
    ],
    examples: [
      {
        title: 'To Roman',
        situation: 'Write 87 in Roman numerals.',
        steps: ['80 is LXXX.', '7 is VII.'],
        answer: 'LXXXVII.',
      },
      {
        title: 'From Roman',
        situation: 'What is XLVIII?',
        steps: ['XL is 40 and VIII is 8.', '40 + 8 = 48.'],
        answer: '48.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing 4 as IIII and 40 as XXXX.',
        right: 'Use IV for 4 and XL for 40.',
      },
    ],
    realLife: ['Reading clocks.', 'Numbering lists.', 'Reading old buildings.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write five numbers up to 100.',
        'Your friend writes them in Roman numerals.',
        'Check each other’s answers.',
      ],
    },
  },
  'mathematics-09': {
    indicator: {
      code: 'B6.1.1.3.1',
      text: 'Determine the HCF and LCM of two or three numbers using prime factors.',
    },
    hook: 'A teacher has 18 pencils, 24 pens and 30 rulers. What is the most equal packs she can make with nothing left?',
    explain: [
      'Write each number as a product of prime factors.',
      'The HCF is the product of the primes that all the numbers share.',
      'Use the smallest number of times each shared prime appears.',
    ],
    art: { kind: 'factorTree', n: 60 },
    artCaption: 'A factor tree breaks a number into primes.',
    words: [
      {
        term: 'Prime factorisation',
        meaning: 'Writing a number as a product of primes.',
      },
      { term: 'HCF', meaning: 'Highest common factor.' },
      { term: 'Common', meaning: 'Shared by all.' },
    ],
    examples: [
      {
        title: 'The packs',
        situation: 'Find the HCF of 18, 24 and 30.',
        steps: [
          '18 = 2 × 3 × 3 and 24 = 2 × 2 × 2 × 3.',
          '30 = 2 × 3 × 5.',
          'All share one 2 and one 3: 2 × 3 = 6.',
        ],
        answer: 'The HCF is 6, so 6 packs.',
      },
      {
        title: 'Two numbers',
        situation: 'Find the HCF of 60 and 84.',
        steps: [
          '60 = 2 × 2 × 3 × 5.',
          '84 = 2 × 2 × 3 × 7.',
          'Shared: 2 × 2 × 3 = 12.',
        ],
        answer: 'The HCF is 12.',
      },
    ],
    mistakes: [
      {
        wrong: 'Multiplying all the primes together.',
        right: 'Use only the primes every number shares.',
      },
    ],
    realLife: [
      'Packing items equally.',
      'Cutting cloth into equal lengths.',
      'Making equal teams.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw factor trees for 36 and 90.',
        'Find their HCF.',
        'Check by dividing both numbers by it.',
      ],
    },
  },
  'mathematics-10': {
    indicator: {
      code: 'B6.1.1.3.1',
      text: 'Determine the HCF and LCM of two or three numbers using prime factors.',
    },
    hook: 'Three bells ring every 18, 24 and 30 minutes. They ring together at 8 o’clock. When will they next ring together?',
    explain: [
      'The LCM is the smallest number that all the numbers divide into.',
      'Write each number as a product of primes.',
      'Take every prime the greatest number of times it appears in any one number, then multiply.',
    ],
    art: { kind: 'factorTree', n: 24 },
    artCaption: '24 = 2 × 2 × 2 × 3.',
    words: [
      { term: 'Multiple', meaning: 'A number in a times table.' },
      { term: 'LCM', meaning: 'Lowest common multiple.' },
      { term: 'Prime', meaning: 'A number with exactly two factors.' },
    ],
    examples: [
      {
        title: 'The bells',
        situation: 'Find the LCM of 18, 24 and 30.',
        steps: [
          '18 = 2 × 3 × 3, 24 = 2 × 2 × 2 × 3 and 30 = 2 × 3 × 5.',
          'Take three 2s, two 3s and one 5.',
          '2 × 2 × 2 × 3 × 3 × 5 = 360.',
        ],
        answer:
          '360 minutes, which is 6 hours. They ring together again at 2 o’clock.',
      },
      {
        title: 'Two numbers',
        situation: 'Find the LCM of 12 and 18.',
        steps: [
          '12 = 2 × 2 × 3 and 18 = 2 × 3 × 3.',
          'Take two 2s and two 3s: 2 × 2 × 3 × 3 = 36.',
        ],
        answer: 'The LCM is 36.',
        art: { kind: 'factorTree', n: 18 },
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up HCF and LCM.',
        right: 'The HCF divides into the numbers. The LCM is divided by them.',
      },
    ],
    realLife: [
      'Timetables that repeat.',
      'Buying items sold in different pack sizes.',
      'Planning events.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Find the LCM of 8 and 12.',
        'Find the LCM of 6, 10 and 15.',
        'Check by listing multiples.',
      ],
    },
  },
  'mathematics-11': {
    indicator: {
      code: 'B6.1.2.1.1',
      text: 'Apply mental strategies, including patterns in the 9s and 11s, for multiplication facts to 144 and related division.',
    },
    hook: 'The 11 times table has a beautiful pattern. 11 × 3 = 33, 11 × 4 = 44. Does it continue?',
    explain: [
      'For 11 times a single digit, write the digit twice: 11 × 7 = 77.',
      'For 9s, multiply by 10 and take one group away: 9 × 12 = 120 − 12 = 108.',
      'Double a fact you know: 6 × 12 = 72, so 12 × 12 = 72 + 72 = 144.',
    ],
    art: { kind: 'grid', rows: 3, cols: 11, label: '3 × 11 = 33' },
    artCaption: 'Three rows of 11.',
    words: [
      { term: 'Fact', meaning: 'A multiplication you know by heart.' },
      { term: 'Pattern', meaning: 'Something that repeats in a rule.' },
      {
        term: 'Related division',
        meaning: 'The division that undoes a multiplication.',
      },
    ],
    examples: [
      {
        title: 'Beyond 9',
        situation: 'Work out 11 × 12.',
        steps: ['10 × 12 = 120.', 'Add one more 12: 120 + 12 = 132.'],
        answer: '11 × 12 = 132.',
      },
      {
        title: 'Related division',
        situation: 'Use 11 × 12 = 132 to find 132 ÷ 11.',
        steps: ['Division undoes multiplication.'],
        answer: '132 ÷ 11 = 12.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the double-digit trick works for 11 × 12.',
        right: 'It only works for single digits. 11 × 12 = 132.',
      },
    ],
    realLife: [
      'Counting eggs in trays of 12.',
      'Months in years.',
      'Quick shopping sums.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Quiz each other on the 11 and 12 times tables.',
        'Explain the strategy for any hard fact.',
        'Write four related division facts.',
      ],
    },
  },
  'mathematics-12': {
    indicator: {
      code: 'B6.1.2.1.2',
      text: 'Apply mental strategies for multiplication, such as annexing zeros, halving and doubling, and the distributive property.',
    },
    hook: 'A trader buys 7 bags of rice at 98 cedis each. Can you find the total in your head?',
    explain: [
      'Annexing zeros: 40 × 300 is 4 × 3 = 12, followed by three zeros: 12000.',
      'Halving and doubling: 25 × 48 is the same as 50 × 24, which is 100 × 12 = 1200.',
      'The distributive property: 7 × 98 = 700 − 14 = 686.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['7 × 100', 700],
        ['7 × 2', 14],
      ],
      label: '7 × 98 = 700 − 14 = 686',
    },
    artCaption: 'Use 100, then take 2 away.',
    words: [
      { term: 'Annex', meaning: 'Join on at the end.' },
      {
        term: 'Halving and doubling',
        meaning: 'Halve one factor and double the other.',
      },
      {
        term: 'Distributive property',
        meaning: 'Multiply the parts separately, then combine.',
      },
    ],
    examples: [
      {
        title: 'The rice',
        situation: 'Work out 7 × 98.',
        steps: ['7 × 100 = 700.', '7 × 2 = 14.', '700 − 14 = 686.'],
        answer: '686 cedis.',
      },
      {
        title: 'Halve and double',
        situation: 'Work out 25 × 48.',
        steps: ['25 × 48 = 50 × 24.', '50 × 24 = 100 × 12 = 1200.'],
        answer: '1200.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding instead of subtracting after rounding 98 up to 100.',
        right: 'You used 2 too many, so take 7 × 2 away.',
      },
    ],
    realLife: ['Shopping in bulk.', 'Checking bills.', 'Estimating costs.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Work out 60 × 400 by annexing zeros.',
        'Work out 35 × 4 by halving and doubling.',
        'Work out 9 × 99 using 9 × 100.',
      ],
    },
  },
  'mathematics-13': {
    indicator: {
      code: 'B6.1.2.2.1',
      text: 'Multiply multi-digit numbers by 2-digit or 3-digit numbers efficiently.',
    },
    hook: 'A school orders 125 boxes of chalk with 234 sticks in each. How many sticks is that?',
    explain: [
      'Split the second number into hundreds, tens and ones.',
      'Multiply the first number by each part.',
      'Add the partial products.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['234 × 100', 23400],
        ['234 × 20', 4680],
        ['234 × 5', 1170],
      ],
      label: '23400 + 4680 + 1170 = 29250',
    },
    artCaption: 'Three partial products.',
    words: [
      { term: 'Partial product', meaning: 'The answer for one part.' },
      {
        term: 'Column method',
        meaning: 'Writing numbers one under the other.',
      },
      { term: 'Product', meaning: 'The answer to a multiplication.' },
    ],
    examples: [
      {
        title: 'The chalk',
        situation: 'Work out 234 × 125.',
        steps: [
          '234 × 100 = 23400.',
          '234 × 20 = 4680 and 234 × 5 = 1170.',
          '23400 + 4680 + 1170 = 29250.',
        ],
        answer: '29,250 sticks.',
      },
      {
        title: 'Two digits',
        situation: 'Work out 46 × 37.',
        steps: ['46 × 30 = 1380.', '46 × 7 = 322.', '1380 + 322 = 1702.'],
        answer: '46 × 37 = 1702.',
      },
    ],
    mistakes: [
      {
        wrong: 'Treating the 2 in 125 as 2 instead of 20.',
        right: 'Use the value of each digit.',
      },
    ],
    realLife: [
      'School supplies.',
      'Wages for many workers.',
      'Stock in warehouses.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 312 × 24.',
        'Check with an estimate: 300 × 25.',
        'Make up a story for your sum.',
      ],
    },
  },
  'mathematics-14': {
    indicator: {
      code: 'B6.1.2.3.1',
      text: 'Determine basic division facts and their related multiplication facts.',
    },
    hook: 'Three numbers, four facts! 7, 8 and 56 make a fact family.',
    explain: [
      'A fact family links multiplication and division.',
      '7 × 8 = 56, 8 × 7 = 56, 56 ÷ 7 = 8 and 56 ÷ 8 = 7.',
      'If you know one fact, you know all four.',
    ],
    art: { kind: 'grid', rows: 6, cols: 7, label: '6 × 7 = 42, so 42 ÷ 6 = 7' },
    artCaption: 'One array, a whole family of facts.',
    words: [
      {
        term: 'Fact family',
        meaning: 'Related multiplication and division facts.',
      },
      { term: 'Inverse', meaning: 'The opposite operation.' },
      { term: 'Quotient', meaning: 'The answer to a division.' },
    ],
    examples: [
      {
        title: 'Write the family',
        situation: 'Write the fact family for 9, 12 and 108.',
        steps: [
          '9 × 12 = 108 and 12 × 9 = 108.',
          '108 ÷ 9 = 12 and 108 ÷ 12 = 9.',
        ],
        answer: 'Four facts.',
      },
      {
        title: 'Use the family',
        situation: 'Find 144 ÷ 12.',
        steps: ['12 × 12 = 144.'],
        answer: '144 ÷ 12 = 12.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing 7 ÷ 56 = 8.',
        right: 'Divide the biggest number: 56 ÷ 7 = 8.',
      },
    ],
    realLife: ['Sharing equally.', 'Packing goods.', 'Checking answers.'],
    tryIt: {
      need: 'Card',
      steps: [
        'Make fact-family triangles for five facts.',
        'Cover one number.',
        'Ask a friend to find it.',
      ],
    },
  },
  'mathematics-15': {
    indicator: {
      code: 'B6.1.2.4.1',
      text: 'Divide 3-digit numbers by 1-digit numbers efficiently.',
    },
    hook: '936 mangoes are packed into crates of 8. How many crates are filled?',
    explain: [
      'Take away large groups of the divisor first, such as 100 groups.',
      'Then take away smaller groups until nothing, or a remainder, is left.',
      'Add the groups. Check by multiplying.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['100 eights', 800],
        ['10 eights', 80],
        ['7 eights', 56],
      ],
      label: '800 + 80 + 56 = 936',
    },
    artCaption: '100 + 10 + 7 = 117 crates.',
    words: [
      { term: 'Divisor', meaning: 'The number you divide by.' },
      { term: 'Dividend', meaning: 'The number being divided.' },
      { term: 'Remainder', meaning: 'What is left over.' },
    ],
    examples: [
      {
        title: 'The mangoes',
        situation: 'Work out 936 ÷ 8.',
        steps: [
          '8 × 100 = 800. 936 − 800 = 136.',
          '8 × 10 = 80. 136 − 80 = 56.',
          '8 × 7 = 56. 100 + 10 + 7 = 117.',
        ],
        answer: '117 crates.',
      },
      {
        title: 'A remainder',
        situation: 'Work out 745 ÷ 6.',
        steps: ['6 × 124 = 744.', '745 − 744 = 1.'],
        answer: '124 remainder 1.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing a remainder bigger than the divisor.',
        right: 'The remainder must be smaller than the divisor.',
      },
    ],
    realLife: ['Packing fruit.', 'Sharing money.', 'Planning transport.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 852 ÷ 6.',
        'Work out 619 ÷ 4.',
        'Check each answer by multiplying.',
      ],
    },
  },
  'mathematics-16': {
    indicator: {
      code: 'B6.1.2.5.1',
      text: 'Solve multi-step word problems involving the four basic operations.',
    },
    hook: 'A trader buys eggs, sells them and wants to know the profit. That takes several steps!',
    explain: [
      'Read the problem twice and write down what you know.',
      'Plan the steps and the operation for each one.',
      'Work through the steps, then check the answer makes sense.',
    ],
    art: {
      kind: 'cedis',
      notes: [100, 100, 20, 5],
      label: 'Profit: 900 − 675 = 225 cedis',
    },
    artCaption: 'Selling price minus cost.',
    words: [
      { term: 'Profit', meaning: 'Money made after paying costs.' },
      { term: 'Cost', meaning: 'What you pay.' },
      { term: 'Income', meaning: 'Money you receive.' },
    ],
    examples: [
      {
        title: 'The eggs',
        situation:
          'A trader buys 15 crates of 30 eggs at 45 cedis a crate. She sells every egg for 2 cedis. Find her profit.',
        steps: [
          'Eggs: 15 × 30 = 450.',
          'Cost: 15 × 45 = 675. Income: 450 × 2 = 900.',
          '900 − 675 = 225.',
        ],
        answer: '225 cedis.',
      },
      {
        title: 'Books for classes',
        situation:
          '480 books are shared equally among 42, 38 and 40 pupils. How many books does each pupil get?',
        steps: ['42 + 38 + 40 = 120 pupils.', '480 ÷ 120 = 4.'],
        answer: '4 books each.',
      },
    ],
    mistakes: [
      {
        wrong: 'Using the cost of one crate as the total cost.',
        right: 'Multiply by the number of crates.',
      },
    ],
    realLife: ['Running a business.', 'Planning a party.', 'Sharing supplies.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write a profit problem with three steps.',
        'Swap and solve.',
        'Compare your methods.',
      ],
    },
  },
  'mathematics-17': {
    indicator: {
      code: 'B6.1.2.6.1',
      text: 'Locate, compare and order integers using the number line and the symbols <, > and =.',
    },
    hook: 'At dawn on a mountain it is −4 °C; in the afternoon it is 3 °C. Which is colder, and by how much?',
    explain: [
      'Integers are whole numbers and their opposites: … −3, −2, −1, 0, 1, 2, 3 …',
      'On a number line, numbers get bigger to the right and smaller to the left.',
      'Every positive number has an opposite: the opposite of 4 is −4.',
    ],
    art: {
      kind: 'numberLine',
      from: -6,
      to: 6,
      marks: [-4, 3],
      label: '−4 is to the left of 3',
    },
    artCaption: 'Further left means smaller.',
    words: [
      { term: 'Integer', meaning: 'A whole number or its negative opposite.' },
      {
        term: 'Opposite',
        meaning: 'The same distance from zero on the other side.',
      },
      {
        term: 'Order',
        meaning: 'Arrange from smallest to biggest, or the reverse.',
      },
    ],
    examples: [
      {
        title: 'Compare',
        situation: 'Which is colder: −4 °C or 3 °C? How far apart are they?',
        steps: [
          '−4 is further left.',
          'From −4 to 0 is 4, and from 0 to 3 is 3.',
        ],
        answer: '−4 °C is colder, by 7 degrees.',
      },
      {
        title: 'Order',
        situation: 'Order −7, 2, −1, 5 and −3 from smallest.',
        steps: ['Negatives come first, the furthest from zero first.'],
        answer: '−7 < −3 < −1 < 2 < 5.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking −7 > −3 because 7 > 3.',
        right: '−7 is further left, so −7 < −3.',
      },
    ],
    realLife: [
      'Temperatures.',
      'Bank balances.',
      'Heights above and below sea level.',
    ],
    tryIt: {
      need: 'A number line from −10 to 10',
      steps: [
        'Mark −8, −2, 0, 4 and 9.',
        'Write three comparisons with < and >.',
        'Write the opposite of each number.',
      ],
    },
  },
  'mathematics-18': {
    indicator: {
      code: 'B6.1.2.6.2',
      text: 'Solve simple addition and subtraction problems involving integers.',
    },
    hook: 'Kojo owes 2 cedis. He then earns 9 cedis. How much does he have now?',
    explain: [
      'Adding a positive number moves right on the number line.',
      'Subtracting a positive number, or adding a negative one, moves left.',
      'Start at the first number, then move.',
    ],
    art: { kind: 'jumps', start: -2, jumps: [9], label: '−2 + 9 = 7' },
    artCaption: 'Start at −2 and move 9 to the right.',
    words: [
      { term: 'Debt', meaning: 'Money you owe.' },
      { term: 'Move right', meaning: 'Get bigger.' },
      { term: 'Move left', meaning: 'Get smaller.' },
    ],
    examples: [
      {
        title: 'Kojo’s money',
        situation: 'Work out −2 + 9.',
        steps: ['Start at −2.', 'Move 9 to the right.'],
        answer: '−2 + 9 = 7 cedis.',
      },
      {
        title: 'Getting colder',
        situation:
          'It is −4 °C and the temperature falls by 3 degrees. What is it now?',
        steps: ['Start at −4.', 'Move 3 to the left.'],
        answer: '−4 − 3 = −7 °C.',
      },
      {
        title: 'More practice',
        situation: 'Work out 1 + −3 and −8 − 8.',
        steps: ['From 1, move 3 left to −2.', 'From −8, move 8 left to −16.'],
        answer: '1 + −3 = −2, and −8 − 8 = −16.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking −8 − 8 = 0.',
        right: 'Both moves go left: −8 − 8 = −16.',
      },
    ],
    realLife: [
      'Owing and earning money.',
      'Temperature changes.',
      'Lifts going below ground.',
    ],
    tryIt: {
      need: 'A number line from −20 to 20',
      steps: [
        'Work out −6 + 5 and 4 − 6.',
        'Make up a money story for one.',
        'Check on the number line.',
      ],
    },
  },
  'mathematics-19': {
    indicator: {
      code: 'B6.1.2.6.3',
      text: 'Perform simple multiplication with integers.',
    },
    hook: 'A diver goes down 4 m, three times. Where is she compared with the surface?',
    explain: [
      'Multiplying is repeated adding, even with negative numbers.',
      '3 × −4 means three jumps of −4 from zero: −4, −8, −12.',
      'A positive number times a negative number gives a negative answer.',
    ],
    art: {
      kind: 'jumps',
      start: 0,
      jumps: [-4, -4, -4],
      label: '3 × −4 = −12',
    },
    artCaption: 'Three jumps of 4 to the left.',
    words: [
      {
        term: 'Repeated addition',
        meaning: 'Adding the same number many times.',
      },
      { term: 'Negative', meaning: 'Less than zero.' },
      { term: 'Product', meaning: 'The answer to a multiplication.' },
    ],
    examples: [
      {
        title: 'The diver',
        situation: 'Work out 3 × −4.',
        steps: ['Start at 0.', 'Jump 4 left, three times.'],
        answer: '3 × −4 = −12, so 12 m below the surface.',
      },
      {
        title: 'Find the pattern',
        situation: 'Continue: 3 × 2 = 6, 3 × 1 = 3, 3 × 0 = 0, …',
        steps: ['Each answer goes down by 3.', '3 × −1 = −3 and 3 × −2 = −6.'],
        answer: '−3, −6.',
      },
    ],
    mistakes: [
      { wrong: 'Thinking 5 × −2 = 10.', right: 'Five jumps of −2 end at −10.' },
    ],
    realLife: [
      'Losses over several days.',
      'Temperature falling each hour.',
      'Diving depths.',
    ],
    tryIt: {
      need: 'A number line',
      steps: [
        'Show 4 × −3 with jumps.',
        'Show 2 × −5.',
        'Write a story for one of them.',
      ],
    },
  },
  'mathematics-20': {
    indicator: {
      code: 'B6.1.3.1.1',
      text: 'Compare and order a mixture of common fractions, percents and decimals.',
    },
    hook: 'Three shops offer 3/5 off, 0.65 off and 58% off. Which is the biggest discount?',
    explain: [
      'Change them all into the same form, such as percents.',
      '3/5 = 60/100 = 60%, and 0.65 = 65%.',
      'Then compare them as you would whole numbers.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['3/5', 60],
        ['0.65', 65],
        ['58%', 58],
      ],
      label: 'All three as percents',
    },
    artCaption: '0.65 is the biggest.',
    words: [
      { term: 'Convert', meaning: 'Change into another form.' },
      { term: 'Percent', meaning: 'Out of a hundred.' },
      { term: 'Decimal', meaning: 'A number with a decimal point.' },
    ],
    examples: [
      {
        title: 'The discounts',
        situation: 'Order 3/5, 0.65 and 58% from smallest.',
        steps: ['3/5 = 60%.', '0.65 = 65%.'],
        answer: '58% < 3/5 < 0.65.',
      },
      {
        title: 'Eighths',
        situation: 'Which is bigger: 7/8 or 0.85?',
        steps: ['7/8 = 875/1000 = 0.875.', '0.875 > 0.850.'],
        answer: '7/8 is bigger.',
      },
    ],
    mistakes: [
      {
        wrong: 'Comparing 3/5 with 58% by the numbers 3 and 58.',
        right: 'Change them into the same form first.',
      },
    ],
    realLife: [
      'Comparing discounts.',
      'Comparing test scores.',
      'Comparing interest rates.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Order 0.3, 1/4 and 28%.',
        'Order 2/3, 0.6 and 65%.',
        'Explain your method.',
      ],
    },
  },
  'mathematics-21': {
    indicator: {
      code: 'B6.1.3.1.2',
      text: 'Add and subtract unlike and mixed fractions.',
    },
    hook: 'Esi walks 1/3 of a kilometre to her friend’s house, then 2/5 of a kilometre to school. How far does she walk?',
    explain: [
      'Unlike fractions have different denominators. Change them to a common denominator.',
      'For mixed numbers, work with the whole numbers and the fractions separately.',
      'Simplify the answer if you can.',
    ],
    art: { kind: 'cake', parts: 15, picked: 11, label: '5/15 + 6/15 = 11/15' },
    artCaption: 'Fifteenths fit both thirds and fifths.',
    words: [
      {
        term: 'Unlike fractions',
        meaning: 'Fractions with different denominators.',
      },
      { term: 'Mixed number', meaning: 'A whole number and a fraction.' },
      { term: 'LCD', meaning: 'Lowest common denominator.' },
    ],
    examples: [
      {
        title: 'Esi’s walk',
        situation: 'Work out 1/3 + 2/5.',
        steps: ['The LCD is 15.', '1/3 + 2/5 = 5/15 + 6/15 = 11/15.'],
        answer: '11/15 of a kilometre.',
      },
      {
        title: 'Mixed numbers',
        situation: 'Add 2 and 1/3 to 3 and 2/5.',
        steps: ['Wholes: 2 + 3 = 5.', 'Fractions: 5/15 + 6/15 = 11/15.'],
        answer: '5 and 11/15.',
      },
      {
        title: 'Subtract',
        situation: 'Take 2 and 1/3 from 3 and 2/5.',
        steps: ['Wholes: 3 − 2 = 1.', 'Fractions: 6/15 − 5/15 = 1/15.'],
        answer: '1 and 1/15.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding the denominators: 1/3 + 2/5 = 3/8.',
        right: 'Use a common denominator: 11/15.',
      },
    ],
    realLife: [
      'Adding distances.',
      'Combining ingredients.',
      'Measuring cloth.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 3/4 − 1/6.',
        'Work out 1 and 1/2 + 2 and 2/3.',
        'Draw one answer to check it.',
      ],
    },
  },
  'mathematics-22': {
    indicator: {
      code: 'B6.1.3.1.3',
      text: 'Use models to explain multiplying a common or mixed fraction by a whole number.',
    },
    hook: 'A recipe needs 4 and 4/5 cups of flour. You make it 5 times for a party. How much flour?',
    explain: [
      'Change a mixed number to an improper fraction first.',
      'Multiply the numerator by the whole number.',
      'Simplify, and change back to a mixed number if you need to.',
    ],
    art: {
      kind: 'cake',
      parts: 5,
      picked: 4,
      label: '4/5 × 5 = 4 whole cakes',
    },
    artCaption: 'Four fifths, five times, is twenty fifths.',
    words: [
      {
        term: 'Improper fraction',
        meaning: 'A fraction more than one, such as 24/5.',
      },
      { term: 'Mixed number', meaning: 'A whole number and a fraction.' },
      { term: 'Simplify', meaning: 'Write in the simplest form.' },
    ],
    examples: [
      {
        title: 'The flour',
        situation: 'Work out 4 and 4/5 × 5.',
        steps: ['4 and 4/5 = 24/5.', '24/5 × 5 = 120/5 = 24.'],
        answer: '24 cups.',
      },
      {
        title: 'A common fraction',
        situation: 'Work out 2/3 × 5.',
        steps: ['2 × 5 = 10, so 10/3.', '10/3 = 3 and 1/3.'],
        answer: '3 and 1/3.',
      },
    ],
    mistakes: [
      {
        wrong: 'Multiplying only the whole part: 4 and 4/5 × 5 = 20 and 4/5.',
        right: 'Multiply the fraction part too, or use 24/5.',
      },
    ],
    realLife: [
      'Scaling recipes.',
      'Buying cloth for several outfits.',
      'Mixing paint.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 3/4 × 8.',
        'Work out 1 and 1/2 × 6.',
        'Draw a model for one of them.',
      ],
    },
  },
  'mathematics-23': {
    indicator: {
      code: 'B6.1.4.1.1',
      text: 'Use concrete and pictorial models to explain a ratio and its simplest form.',
    },
    hook: 'A class has 4 girls for every 6 boys in a team. How can we compare these numbers?',
    explain: [
      'A ratio compares two amounts. 4 girls to 6 boys is written 4 : 6.',
      'Simplify a ratio by dividing both parts by their HCF: 4 : 6 = 2 : 3.',
      'Order matters: girls to boys is 2 : 3, but boys to girls is 3 : 2.',
    ],
    art: {
      kind: 'ratio',
      parts: [
        ['Girls', 4],
        ['Boys', 6],
      ],
      label: '4 : 6 = 2 : 3',
    },
    artCaption: 'For every 2 girls there are 3 boys.',
    words: [
      { term: 'Ratio', meaning: 'A comparison of two amounts.' },
      {
        term: 'Simplest form',
        meaning: 'A ratio that cannot be divided further.',
      },
      { term: 'Part', meaning: 'One of the amounts in a ratio.' },
    ],
    examples: [
      {
        title: 'Boys and girls',
        situation:
          'A class of 24 has 10 girls. Find the ratio of boys to girls in simplest form.',
        steps: ['Boys: 24 − 10 = 14.', '14 : 10 = 7 : 5.'],
        answer: '7 : 5.',
      },
      {
        title: 'Orange drink',
        situation:
          'Concentrate and water are mixed 3 : 8. What fraction of the drink is concentrate?',
        steps: ['Total parts: 3 + 8 = 11.'],
        answer: '3/11.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing boys to girls as 5 : 7.',
        right: 'Keep the order of the words: boys first.',
      },
    ],
    realLife: ['Mixing drinks.', 'Recipes.', 'Maps and models.'],
    tryIt: {
      need: 'Bottle tops in two colours',
      steps: [
        'Make a group of 6 red and 9 blue.',
        'Write the ratio and simplify it.',
        'Make a new group in the same ratio.',
      ],
    },
  },
  'mathematics-24': {
    indicator: {
      code: 'B6.1.4.1.2',
      text: 'Express ratios in equivalent forms, and compare and order ratios.',
    },
    hook: 'Afia, Bedu and Caro mix squash and water as 3 : 14, 2 : 7 and 1 : 4. Whose drink is strongest?',
    explain: [
      'Equivalent ratios are made by multiplying or dividing both parts by the same number.',
      'To compare, write each ratio as a fraction and use a common denominator.',
      'The bigger fraction of squash gives the stronger drink.',
    ],
    art: {
      kind: 'ratio',
      parts: [
        ['Squash', 2],
        ['Water', 7],
      ],
      label: 'Bedu’s drink: 2 : 7',
    },
    artCaption: '2 cups of squash to 7 cups of water.',
    words: [
      {
        term: 'Equivalent ratios',
        meaning: 'Ratios that show the same comparison.',
      },
      { term: 'Compare', meaning: 'Decide which is greater.' },
      { term: 'Total ratio', meaning: 'All the parts added together.' },
    ],
    examples: [
      {
        title: 'The strongest drink',
        situation: 'Compare 3/14, 2/7 and 1/4.',
        steps: ['The LCD is 28.', '3/14 = 6/28, 2/7 = 8/28 and 1/4 = 7/28.'],
        answer: 'Bedu’s drink is strongest.',
      },
      {
        title: 'A missing number',
        situation: '10 : q = 2 : 3. Find q.',
        steps: ['10 ÷ 2 = 5.', 'Multiply 3 by 5: q is 15.'],
        answer: 'q = 15.',
      },
      {
        title: 'Sharing a total',
        situation:
          'Boys and girls are in the ratio 7 : 11. There are 36 pupils. How many of each?',
        steps: [
          'Total parts: 7 + 11 = 18. 36 ÷ 18 = 2.',
          'Boys: 7 × 2 = 14. Girls: 11 × 2 = 22.',
        ],
        answer: '14 boys and 22 girls.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding the same number to both parts.',
        right: 'Multiply or divide both parts by the same number.',
      },
    ],
    realLife: [
      'Mixing drinks and paints.',
      'Sharing profits.',
      'Scale drawings.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write three ratios equivalent to 3 : 5.',
        'Compare 2 : 3 and 3 : 5.',
        'Share 40 sweets in the ratio 3 : 5.',
      ],
    },
  },
  'mathematics-25': {
    indicator: {
      code: 'B6.1.4.2.1',
      text: 'Use models to explain proportion as a comparison between quantities with equal ratios.',
    },
    hook: 'One goat has 4 legs. Three goats have 12. Do legs and goats grow together in the same way?',
    explain: [
      'Two quantities are in proportion when their ratios stay equal.',
      '3 goats to 12 legs and 4 goats to 16 legs: 3 : 12 = 4 : 16.',
      'If one quantity doubles, the other doubles too.',
    ],
    art: {
      kind: 'lineGraph',
      points: [
        ['1 goat', 4],
        ['2 goats', 8],
        ['3 goats', 12],
        ['4 goats', 16],
      ],
      label: 'Legs grow in proportion to goats',
    },
    artCaption: 'A straight line from zero shows proportion.',
    words: [
      { term: 'Proportion', meaning: 'Two ratios that are equal.' },
      { term: 'Proportional', meaning: 'Growing at the same rate.' },
      { term: 'Mapping', meaning: 'Matching each number to another.' },
    ],
    examples: [
      {
        title: 'Is it proportional?',
        situation:
          '2 maps to 6, 3 maps to 9 and 5 maps to 15. Is it proportional?',
        steps: ['Each number is multiplied by 3.'],
        answer: 'Yes: 2 : 6 = 3 : 9 = 5 : 15.',
      },
      {
        title: 'Not proportional',
        situation:
          'A taxi charges 5 cedis to start, plus 2 cedis a kilometre. Is the fare proportional to the distance?',
        steps: ['1 km costs 7 cedis.', '2 km cost 9 cedis, not 14.'],
        answer: 'No. Doubling the distance does not double the fare.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking anything that grows is proportional.',
        right: 'Check that the ratios stay equal.',
      },
    ],
    realLife: [
      'Prices of goods sold by weight.',
      'Recipes.',
      'Speed and distance.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a table: number of pens and their cost at 3 cedis each.',
        'Check that the ratios are equal.',
        'Draw it as a line graph.',
      ],
    },
  },
  'mathematics-26': {
    indicator: {
      code: 'B6.1.4.2.3',
      text: 'Use various strategies to solve proportional reasoning problems.',
    },
    hook: 'Two kilograms of meat cost 8 cedis. What would 25 kilograms cost?',
    explain: [
      'Find the value of one unit first. This is the unitary method.',
      'Then multiply to find any amount.',
      'You can also scale up or down using equal ratios.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['2 kg', 8],
        ['5 kg', 20],
        ['12 kg', 48],
      ],
      label: '4 cedis for every kilogram',
    },
    artCaption: 'The cost grows in proportion.',
    words: [
      {
        term: 'Unitary method',
        meaning: 'Finding the value of one unit first.',
      },
      {
        term: 'Rate',
        meaning: 'An amount for each unit, such as cedis per kilogram.',
      },
      { term: 'Scale', meaning: 'Make bigger or smaller in the same ratio.' },
    ],
    examples: [
      {
        title: 'The meat',
        situation: 'Two kilograms cost 8 cedis. Find the cost of 25 kg.',
        steps: ['One kilogram: 8 ÷ 2 = 4 cedis.', '25 kg: 4 × 25 = 100.'],
        answer: '100 cedis.',
      },
      {
        title: 'Cooking rice',
        situation:
          '3 cups of rice feed 6 people. How many cups feed 10 people?',
        steps: [
          'One person needs 3 ÷ 6 = 0.5 cups.',
          '10 people: 0.5 × 10 = 5.',
        ],
        answer: '5 cups.',
      },
    ],
    mistakes: [
      {
        wrong:
          'Adding instead of multiplying: 2 kg is 8 cedis, so 5 kg is 11 cedis.',
        right: 'Find the price of 1 kg, then multiply.',
      },
    ],
    realLife: [
      'Shopping by weight.',
      'Cooking for more people.',
      'Fuel for longer journeys.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        '4 pens cost 10 cedis. Find the cost of 10 pens.',
        'Make up a recipe problem.',
        'Solve it with the unitary method.',
      ],
    },
  },
  'mathematics-27': {
    indicator: {
      code: 'B6.2.1.1.4',
      text: 'Represent a given pattern visually to verify predictions.',
    },
    hook: 'Sena makes squares in a row with matchsticks. If she uses 64 sticks, how many squares does she make?',
    explain: [
      'Build or draw the first few steps of the pattern.',
      'Record the steps in a table and look for the rule.',
      'Use the rule to predict, then draw to check.',
    ],
    art: {
      kind: 'pattern',
      terms: [4, 7, 10, 13, null],
      rule: 'Matchsticks for 1, 2, 3 and 4 squares',
    },
    artCaption: 'Each new square adds 3 sticks.',
    words: [
      { term: 'Predict', meaning: 'Say what comes next.' },
      { term: 'Verify', meaning: 'Check that it is true.' },
      { term: 'Step', meaning: 'One stage of a pattern.' },
    ],
    examples: [
      {
        title: 'Ten squares',
        situation: 'How many matchsticks for 10 squares?',
        steps: ['The rule is 3 × n + 1.', '3 × 10 + 1 = 31.'],
        answer: '31 matchsticks.',
      },
      {
        title: 'Working back',
        situation: 'Sena used 64 matchsticks. How many squares did she make?',
        steps: ['Take away the extra 1: 64 − 1 = 63.', '63 ÷ 3 = 21.'],
        answer: '21 squares.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking each square needs 4 new sticks.',
        right: 'Joined squares share a side, so each adds 3.',
      },
    ],
    realLife: ['Fencing.', 'Building with blocks.', 'Tiling.'],
    tryIt: {
      need: 'Matchsticks or sticks',
      steps: [
        'Make triangles in a row.',
        'Record the sticks for 1 to 5 triangles.',
        'Predict for 20 triangles, then check with a drawing.',
      ],
    },
  },
  'mathematics-28': {
    indicator: {
      code: 'B6.2.1.1.7',
      text: 'Write a rule in words and in algebra to represent a given pattern.',
    },
    hook: 'The pattern 7, 12, 17, 22 goes up by 5. Can you find the 20th term without counting?',
    explain: [
      'In words: start at 7 and add 5 each time.',
      'In algebra: the nth term is 5 × n + 2.',
      'Check the rule with a term you know: 5 × 3 + 2 = 17.',
    ],
    art: {
      kind: 'pattern',
      terms: [7, 12, 17, 22, 27],
      rule: 'Rule: 5 × n + 2',
    },
    artCaption: 'The difference, 5, is the number multiplying n.',
    words: [
      { term: 'nth term', meaning: 'The term in position n.' },
      { term: 'Difference', meaning: 'How much each term goes up by.' },
      { term: 'Algebra', meaning: 'Maths using letters for numbers.' },
    ],
    examples: [
      {
        title: 'The 20th term',
        situation: 'Use 5 × n + 2 to find the 20th term.',
        steps: ['5 × 20 + 2 = 102.'],
        answer: '102.',
      },
      {
        title: 'Find a rule',
        situation: 'Find a rule for 3, 7, 11, 15.',
        steps: [
          'The difference is 4, so start with 4 × n.',
          '4 × 1 = 4, and the first term is 3: take away 1.',
        ],
        answer: '4 × n − 1.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing the rule as n + 5.',
        right: 'Multiply n by the difference, then adjust.',
      },
    ],
    realLife: [
      'Working out costs for any quantity.',
      'Planning seating.',
      'Computer programs.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Find the rule for 2, 5, 8, 11.',
        'Use it to find the 50th term.',
        'Make a pattern for a friend.',
      ],
    },
  },
  'mathematics-29': {
    indicator: {
      code: 'B6.2.1.1.8',
      text: 'Describe the relationship in a table or chart using a mathematical expression.',
    },
    hook: 'A taxi charges 5 cedis to start and 3 cedis for every kilometre. Can one expression give every fare?',
    explain: [
      'Look at how the output changes as the input goes up by one.',
      'That change multiplies the input. Then add or subtract to fit.',
      'For the taxi: cost = 3 × k + 5, where k is the distance in kilometres.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['1 km', 8],
        ['2 km', 11],
        ['3 km', 14],
        ['4 km', 17],
      ],
      label: 'Cost = 3 × k + 5',
    },
    artCaption: 'Each kilometre adds 3 cedis.',
    words: [
      { term: 'Input', meaning: 'The number you start with.' },
      { term: 'Output', meaning: 'The number you get.' },
      { term: 'Expression', meaning: 'A maths phrase, such as 3 × k + 5.' },
    ],
    examples: [
      {
        title: 'A long ride',
        situation: 'Find the fare for 12 km.',
        steps: ['3 × 12 + 5 = 41.'],
        answer: '41 cedis.',
      },
      {
        title: 'Read a table',
        situation: 'Input 1, 2, 3 gives output 6, 11, 16. Find the expression.',
        steps: [
          'The output goes up by 5.',
          '5 × 1 = 5, and the output is 6: add 1.',
        ],
        answer: '5 × n + 1.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting the starting fee.',
        right: 'Check the expression with the first row of the table.',
      },
    ],
    realLife: [
      'Taxi fares.',
      'Phone bills.',
      'Ticket prices with a booking fee.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a table for a bus that charges 2 cedis plus 1 cedi a stop.',
        'Write the expression.',
        'Find the fare for 15 stops.',
      ],
    },
  },
  'mathematics-30': {
    indicator: {
      code: 'B6.2.2.1.1',
      text: 'Demonstrate understanding of algebraic expressions as phrases with letters for numbers and operations.',
    },
    hook: 'Ama has some cedis and her aunt gives her 15 more. We do not know how many she had. How can we write it?',
    explain: [
      'An algebraic expression uses letters for unknown numbers.',
      '“15 more than x” is x + 15. “Take 4 from m” is m − 4.',
      '7g means 7 × g. A number next to a letter means multiply.',
    ],
    art: {
      kind: 'cedis',
      notes: [10, 5],
      label: 'x cedis and 15 more: x + 15',
    },
    artCaption: 'We do not know x yet.',
    words: [
      {
        term: 'Expression',
        meaning: 'A maths phrase, without an equals sign.',
      },
      { term: 'Variable', meaning: 'A letter that stands for a number.' },
      {
        term: 'Coefficient',
        meaning: 'The number in front of a letter, such as 7 in 7g.',
      },
    ],
    examples: [
      {
        title: 'Words to algebra',
        situation: 'Write: the sum of 8 and s; subtract 4 from 7 times g.',
        steps: [
          'The sum of 8 and s is 8 + s.',
          '7 times g is 7g, then subtract 4.',
        ],
        answer: '8 + s and 7g − 4.',
      },
      {
        title: 'Brackets',
        situation: 'Write: 9 times the sum of 8 and q.',
        steps: [
          'The sum comes first, in brackets: (8 + q).',
          'Then multiply by 9.',
        ],
        answer: '9(8 + q).',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing “subtract 4 from m” as 4 − m.',
        right: 'Start with m and take 4 away: m − 4.',
      },
    ],
    realLife: [
      'Spreadsheet formulas.',
      'Prices for any quantity.',
      'Recipes for any number of people.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write expressions for five phrases of your own.',
        'Swap with a friend.',
        'Turn each other’s expressions back into words.',
      ],
    },
  },
  'mathematics-31': {
    indicator: {
      code: 'B6.2.2.1.1',
      text: 'Demonstrate understanding of algebraic expressions as phrases with letters for numbers and operations.',
    },
    hook: 'You have 3 apples, then get 5 more apples and 2 bananas. How would you write that in algebra?',
    explain: [
      'Like terms have the same letter: 3a and 5a are like terms.',
      'Combine like terms by adding or subtracting their numbers: 3a + 5a = 8a.',
      'Unlike terms, such as 8a and 2b, stay separate.',
    ],
    art: {
      kind: 'ratio',
      parts: [
        ['3a', 3],
        ['5a', 5],
        ['8a', 8],
      ],
      label: '3a + 5a = 8a',
    },
    artCaption: 'Three apples and five apples make eight apples.',
    words: [
      { term: 'Term', meaning: 'One part of an expression, such as 3a.' },
      { term: 'Like terms', meaning: 'Terms with the same letter.' },
      { term: 'Simplify', meaning: 'Write in a shorter way.' },
    ],
    examples: [
      {
        title: 'Combine',
        situation: 'Simplify 4x + 2y + x.',
        steps: [
          '4x and x are like terms: 4x + x = 5x.',
          '2y has a different letter.',
        ],
        answer: '5x + 2y.',
      },
      {
        title: 'With subtraction',
        situation: 'Simplify 9m − 3m + 4.',
        steps: ['9m − 3m = 6m.', '4 has no letter, so it stays.'],
        answer: '6m + 4.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing 8a + 2b as 10ab.',
        right: 'Unlike terms cannot be combined.',
      },
    ],
    realLife: [
      'Counting stock of different items.',
      'Adding up bills.',
      'Shortening long calculations.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Simplify 6p + 3q − 2p + q.',
        'Make up an expression with four terms.',
        'Ask a friend to simplify it.',
      ],
    },
  },
  'mathematics-32': {
    indicator: {
      code: 'B6.2.2.1.1',
      text: 'Demonstrate understanding of algebraic expressions as phrases with letters for numbers and operations.',
    },
    hook: 'The expression 7d gives the cost of d drinks at 7 cedis each. What does it give when d is 4?',
    explain: [
      'To substitute, replace each letter with its number.',
      'Remember that 7d means 7 × d.',
      'Multiply and divide before adding and subtracting.',
    ],
    art: { kind: 'groups', groups: 4, each: 7, label: 'When d is 4, 7d is 28' },
    artCaption: 'Four groups of 7.',
    words: [
      { term: 'Substitute', meaning: 'Put a number in place of a letter.' },
      { term: 'Evaluate', meaning: 'Work out the value.' },
      {
        term: 'Order of operations',
        meaning: 'Multiply and divide before you add and subtract.',
      },
    ],
    examples: [
      {
        title: 'Two letters',
        situation: 'Find z + 7d when z is 7 and d is 4.',
        steps: [
          'Replace the letters: 7 + 7 × 4.',
          'Multiply first: 7 + 28 = 35.',
        ],
        answer: '35.',
      },
      {
        title: 'Three terms',
        situation: 'Find 7d − 2f + 9 when d is 2 and f is 5.',
        steps: ['7 × 2 − 2 × 5 + 9.', '14 − 10 + 9 = 13.'],
        answer: '13.',
      },
    ],
    mistakes: [
      { wrong: 'Reading 7d with d = 4 as 74.', right: '7d means 7 × 4 = 28.' },
    ],
    realLife: [
      'Working out bills.',
      'Spreadsheet formulas.',
      'Science formulas.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Find 8k + d when k is 2 and d is 3.',
        'Find 3a + 2b when a is 5 and b is 6.',
        'Make one for a friend.',
      ],
    },
  },
  'mathematics-33': {
    indicator: {
      code: 'B6.2.3.1.2',
      text: 'Identify the unknown in a problem, represent it with an equation, and solve it.',
    },
    hook: 'Kofi had some marbles and won 18 more. Now he has 45. How many did he start with?',
    explain: [
      'Choose a letter for the unknown and write an equation: x + 18 = 45.',
      'Do the opposite operation to both sides to find the letter.',
      'Check by putting your answer back into the equation.',
    ],
    art: { kind: 'balance', left: 'x + 18', right: '45', equal: true },
    artCaption: 'Take 18 from both sides.',
    words: [
      { term: 'Equation', meaning: 'A number sentence with an equals sign.' },
      {
        term: 'Inverse operation',
        meaning: 'The operation that undoes another.',
      },
      { term: 'Check', meaning: 'Put the answer back in to test it.' },
    ],
    examples: [
      {
        title: 'Kofi’s marbles',
        situation: 'Solve x + 18 = 45.',
        steps: ['Subtract 18 from both sides.', '45 − 18 = 27.'],
        answer: 'x = 27.',
      },
      {
        title: 'Multiplication',
        situation: 'Four equal bags hold 52 oranges. Solve 4y = 52.',
        steps: ['Divide both sides by 4.', '52 ÷ 4 = 13.'],
        answer: 'y = 13 oranges.',
      },
      {
        title: 'Unknown taken away',
        situation: 'Solve 25 = 35 − p.',
        steps: ['p is what was taken from 35 to leave 25.', '35 − 25 = 10.'],
        answer: 'p = 10.',
      },
    ],
    mistakes: [
      {
        wrong: 'Doing an operation to one side only.',
        right: 'Keep the equation balanced: do the same to both sides.',
      },
    ],
    realLife: ['Finding missing amounts.', 'Budgeting.', 'Puzzles.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Solve p − 9 = 16 and 3p = 12.',
        'Check each answer.',
        'Write a story for one equation.',
      ],
    },
  },
  'mathematics-34': {
    indicator: {
      code: 'B6.2.3.1.3',
      text: 'Create a problem for a given equation.',
    },
    hook: 'The equation 3p = 24 can tell many stories. What story can you tell with it?',
    explain: [
      'Decide what the letter stands for.',
      'Choose a real situation that uses the same operation.',
      'Write the story, then solve it to check it works.',
    ],
    art: { kind: 'balance', left: '3p', right: '24', equal: true },
    artCaption: 'p is 8.',
    words: [
      { term: 'Context', meaning: 'The real-life setting of a problem.' },
      { term: 'Create', meaning: 'Make something new.' },
      { term: 'Solve', meaning: 'Find the unknown.' },
    ],
    examples: [
      {
        title: 'A story for 3p = 24',
        situation: 'Write and solve a story for 3p = 24.',
        steps: [
          'Three equal notebooks cost 24 cedis. What does one cost?',
          '24 ÷ 3 = 8.',
        ],
        answer: 'p = 8 cedis.',
      },
      {
        title: 'A story for x − 12 = 30',
        situation: 'Write a story for x − 12 = 30.',
        steps: [
          'Abena had some money. She spent 12 cedis and has 30 left. How much did she have?',
          '30 + 12 = 42.',
        ],
        answer: 'x = 42 cedis.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing a story that needs a different operation.',
        right: 'Check the story matches the equation.',
      },
    ],
    realLife: ['Making puzzles.', 'Explaining maths.', 'Planning purchases.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write an equation each.',
        'Swap and write a story for each other’s equation.',
        'Solve both stories.',
      ],
    },
  },
  'mathematics-35': {
    indicator: {
      code: 'B6.3.1.1.1',
      text: 'Identify rectangular and triangular prisms in the classroom and the environment, and name their parts.',
    },
    hook: 'A shoebox and a tent are both prisms. What do they have in common?',
    explain: [
      'A prism has two identical ends, joined by flat rectangular faces.',
      'A rectangular prism has rectangle ends. A triangular prism has triangle ends.',
      'Faces are flat surfaces, edges are where faces meet, and vertices are corners.',
    ],
    art: { kind: 'solids', names: ['box', 'prism', 'cube'] },
    artCaption: 'A box, a triangular prism and a cube.',
    words: [
      { term: 'Face', meaning: 'A flat surface of a solid.' },
      { term: 'Edge', meaning: 'Where two faces meet.' },
      { term: 'Vertex', meaning: 'A corner. More than one are vertices.' },
    ],
    examples: [
      {
        title: 'Count the parts',
        situation:
          'How many faces, edges and vertices does a rectangular prism have?',
        steps: [
          '6 faces, 12 edges and 8 vertices.',
          'Check: faces + vertices − edges is always 2. 6 + 8 − 12 = 2.',
        ],
        answer: '6 faces, 12 edges, 8 vertices.',
      },
      {
        title: 'A triangular prism',
        situation:
          'How many faces, edges and vertices does a triangular prism have?',
        steps: [
          '2 triangles and 3 rectangles: 5 faces.',
          '9 edges and 6 vertices. 5 + 6 − 9 = 2.',
        ],
        answer: '5 faces, 9 edges, 6 vertices.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a pyramid is a prism.',
        right: 'A prism has two identical ends; a pyramid comes to a point.',
      },
    ],
    realLife: ['Boxes and cartons.', 'Tents and roofs.', 'Buildings.'],
    tryIt: {
      need: 'Boxes from home',
      steps: [
        'Find three prisms at home or school.',
        'Count their faces, edges and vertices.',
        'Check with faces + vertices − edges.',
      ],
    },
  },
  'mathematics-36': {
    indicator: {
      code: 'B6.3.1.1.2',
      text: 'Construct rectangular and triangular prisms from their nets.',
    },
    hook: 'Open a cereal box flat. The shape you see is called a net. Can you fold it back?',
    explain: [
      'A net is a flat shape that folds up into a solid.',
      'A rectangular prism’s net has 6 rectangles. A triangular prism’s net has 3 rectangles and 2 triangles.',
      'Some flat shapes with the right faces still will not fold into a closed solid.',
    ],
    art: { kind: 'net', solid: 'box' },
    artCaption: 'Fold up the sides to make a box.',
    words: [
      { term: 'Net', meaning: 'A flat pattern that folds into a solid.' },
      { term: 'Fold', meaning: 'Bend along a line.' },
      { term: 'Construct', meaning: 'Build or make.' },
    ],
    examples: [
      {
        title: 'A triangular prism',
        situation: 'What faces does a triangular prism’s net need?',
        steps: [
          'The two ends are triangles.',
          'The three sides are rectangles.',
        ],
        answer: '2 triangles and 3 rectangles.',
        art: { kind: 'net', solid: 'prism' },
      },
      {
        title: 'Will it fold?',
        situation:
          'Six squares in one straight row. Will they fold into a cube?',
        steps: [
          'The end squares would overlap.',
          'No squares would form the top and bottom.',
        ],
        answer: 'No.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking any 6 squares make a cube.',
        right: 'They must be arranged so that every face has a place.',
      },
    ],
    realLife: ['Packaging.', 'Gift boxes.', 'Paper models.'],
    tryIt: {
      need: 'Card, ruler, scissors and glue, with an adult',
      steps: [
        'Draw a net of a box with flaps for glue.',
        'Cut it out and fold it.',
        'Glue it into a prism.',
      ],
    },
  },
  'mathematics-37': {
    indicator: {
      code: 'B6.3.3.5.1',
      text: 'Tell the position and motion of objects using the cardinal points, including north-east, north-west, south-east and south-west.',
    },
    hook: 'The market is not exactly north of your school, and not exactly east. Which direction is it?',
    explain: [
      'Between the four main directions are four more: north-east (NE), south-east (SE), south-west (SW) and north-west (NW).',
      'North-east is halfway between north and east.',
      'Routes can be described as moves in these directions.',
    ],
    art: { kind: 'compass', eight: true, label: 'Eight compass directions' },
    artCaption: 'NE is halfway between N and E.',
    words: [
      { term: 'North-east (NE)', meaning: 'Halfway between north and east.' },
      { term: 'South-west (SW)', meaning: 'Halfway between south and west.' },
      { term: 'Route', meaning: 'The way from one place to another.' },
    ],
    examples: [
      {
        title: 'Find the market',
        situation:
          'From school, walk 3 blocks north and then 3 blocks east. Which way is the market from school?',
        steps: ['Equal moves north and east.'],
        answer: 'North-east.',
      },
      {
        title: 'The opposite',
        situation:
          'The market is north-east of the school. Which way is the school from the market?',
        steps: ['Go the opposite way.'],
        answer: 'South-west.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing east-north instead of north-east.',
        right: 'North or south always comes first.',
      },
    ],
    realLife: [
      'Reading maps.',
      'Giving directions.',
      'Wind directions in weather reports.',
    ],
    tryIt: {
      need: 'Squared paper',
      steps: [
        'Draw a map with your school in the middle.',
        'Place four places, one in each in-between direction.',
        'Write a route to each.',
      ],
    },
  },
  'mathematics-38': {
    indicator: {
      code: 'B6.3.3.6.1',
      text: 'Perform and identify a reflection of 2D shapes in a plane.',
    },
    hook: 'Look at a still pond. The trees appear upside down in the water. That is a reflection!',
    explain: [
      'A reflection flips a shape over a mirror line.',
      'The image is the same size and shape, but faces the other way.',
      'Each point of the image is the same distance from the mirror line as the original.',
    ],
    art: { kind: 'reflect' },
    artCaption: 'The blue shape is the reflection.',
    words: [
      { term: 'Reflection', meaning: 'A flip over a mirror line.' },
      { term: 'Object', meaning: 'The shape before it moves.' },
      { term: 'Image', meaning: 'The shape after it moves.' },
    ],
    examples: [
      {
        title: 'Reflect a point',
        situation:
          'A corner is 3 squares left of the mirror line. Where is its image?',
        steps: ['Same distance, other side.'],
        answer: '3 squares right of the mirror line.',
      },
      {
        title: 'Check an image',
        situation:
          'An image is bigger than the object. Can it be a reflection?',
        steps: ['A reflection never changes size.'],
        answer: 'No.',
      },
    ],
    mistakes: [
      {
        wrong: 'Measuring distances from the edge of the grid.',
        right: 'Measure from the mirror line.',
      },
    ],
    realLife: [
      'Mirrors.',
      'Water reflections.',
      'Designs in cloth and buildings.',
    ],
    tryIt: {
      need: 'Squared paper and a mirror',
      steps: [
        'Draw a shape and a mirror line.',
        'Draw its reflection.',
        'Check with a mirror.',
      ],
    },
  },
  'mathematics-39': {
    indicator: {
      code: 'B6.3.3.6.2',
      text: 'Identify images of a single transformation, reflection or translation, of 2D shapes in a plane.',
    },
    hook: 'When you slide a book across a table without turning it, the book has been translated.',
    explain: [
      'A translation slides a shape without turning or flipping it.',
      'Describe it with two moves: how far right or left, then how far up or down.',
      'Every point of the shape moves the same way.',
    ],
    art: { kind: 'reflect', move: 'translate' },
    artCaption: 'The shape slides 6 right and 1 down.',
    words: [
      { term: 'Translation', meaning: 'A slide without turning.' },
      { term: 'Vector', meaning: 'The moves that describe a translation.' },
      { term: 'Transformation', meaning: 'A change in a shape’s position.' },
    ],
    examples: [
      {
        title: 'Describe it',
        situation:
          'A shape moves from one place to another 2 squares right and 3 squares down. Describe the translation.',
        steps: ['Right first, then down.'],
        answer: '2 right, 3 down.',
      },
      {
        title: 'Reflection or translation?',
        situation:
          'An image faces the same way as the object. Which transformation is it?',
        steps: ['A reflection would face the other way.'],
        answer: 'A translation.',
      },
    ],
    mistakes: [
      {
        wrong: 'Turning the shape while sliding it.',
        right: 'A translation keeps the shape facing the same way.',
      },
    ],
    realLife: ['Sliding doors.', 'Moving furniture.', 'Patterns on cloth.'],
    tryIt: {
      need: 'Squared paper',
      steps: [
        'Draw a shape.',
        'Translate it 4 right and 2 up.',
        'Describe the move to a friend.',
      ],
    },
  },
  'mathematics-40': {
    indicator: {
      code: 'B6.4.1.1.1',
      text: 'Draw a line graph with a title, labelled axes and a scale, and interpret it.',
    },
    hook: 'How does the temperature change during a hot day? A line graph shows it clearly.',
    explain: [
      'A line graph shows how something changes over time.',
      'Time goes along the bottom axis. The amount goes up the side axis.',
      'Plot each point, then join them with straight lines.',
    ],
    art: {
      kind: 'lineGraph',
      points: [
        ['6 am', 22],
        ['9 am', 26],
        ['12 pm', 31],
        ['3 pm', 33],
        ['6 pm', 28],
      ],
      label: 'Temperature on a hot day (°C)',
    },
    artCaption: 'Hottest at 3 pm.',
    words: [
      { term: 'Axis', meaning: 'A line along the side or bottom of a graph.' },
      { term: 'Scale', meaning: 'The numbers marked evenly on an axis.' },
      { term: 'Plot', meaning: 'Mark a point on a graph.' },
    ],
    examples: [
      {
        title: 'Read it',
        situation: 'When was it hottest, and how hot?',
        steps: ['The highest point is at 3 pm.'],
        answer: '33 °C at 3 pm.',
      },
      {
        title: 'Find the change',
        situation: 'How much did the temperature rise from 6 am to 12 pm?',
        steps: ['31 − 22 = 9.'],
        answer: '9 degrees.',
      },
    ],
    mistakes: [
      {
        wrong: 'Using an uneven scale on an axis.',
        right: 'Space the numbers evenly.',
      },
    ],
    realLife: [
      'Weather reports.',
      'Growth charts at the clinic.',
      'Sales over a year.',
    ],
    tryIt: {
      need: 'A thermometer and graph paper',
      steps: [
        'Record the temperature every two hours.',
        'Draw a line graph with a title and labels.',
        'Write what it shows.',
      ],
    },
  },
  'mathematics-41': {
    indicator: {
      code: 'B6.4.1.1.2',
      text: 'Determine whether a set of data can be represented by a line graph.',
    },
    hook: 'Can you draw a line graph of your class’s favourite fruits? Should you?',
    explain: [
      'Line graphs suit data that changes over time, such as height or temperature.',
      'The points between readings have a meaning, so joining them makes sense.',
      'For separate groups, such as favourite fruits, use a bar graph.',
    ],
    art: {
      kind: 'lineGraph',
      points: [
        ['Wk 1', 4],
        ['Wk 2', 7],
        ['Wk 3', 11],
        ['Wk 4', 14],
      ],
      label: 'Height of a bean plant (cm)',
    },
    artCaption: 'Change over time suits a line graph.',
    words: [
      {
        term: 'Continuous data',
        meaning: 'Data that changes smoothly, such as height.',
      },
      {
        term: 'Discrete data',
        meaning: 'Data in separate groups, such as fruit types.',
      },
      { term: 'Suitable', meaning: 'Right for the purpose.' },
    ],
    examples: [
      {
        title: 'Choose a graph',
        situation:
          'Which needs a line graph: a baby’s weight each month, or pupils’ favourite colours?',
        steps: ['Weight changes over time.', 'Colours are separate groups.'],
        answer: 'The baby’s weight.',
      },
      {
        title: 'Between the points',
        situation:
          'About how tall was the plant halfway through week 2 and week 3?',
        steps: ['Halfway between 7 and 11.'],
        answer: 'About 9 cm.',
      },
    ],
    mistakes: [
      {
        wrong: 'Joining bars for separate groups with a line.',
        right: 'Only join points when the in-between values mean something.',
      },
    ],
    realLife: ['Growth charts.', 'Rainfall over months.', 'Prices over years.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'List three sets of data from school life.',
        'Say which suit line graphs.',
        'Explain why.',
      ],
    },
  },
  'mathematics-42': {
    indicator: {
      code: 'B6.4.1.1.3',
      text: 'Create a line graph from a table of values and use it to solve problems.',
    },
    hook: 'A walker covers 3 km every hour. How far will she have gone after two and a half hours?',
    explain: [
      'Make a table of values first.',
      'Plot each pair as a point, then join the points.',
      'Read between the points to answer new questions.',
    ],
    art: {
      kind: 'lineGraph',
      points: [
        ['0 h', 0],
        ['1 h', 3],
        ['2 h', 6],
        ['3 h', 9],
        ['4 h', 12],
      ],
      label: 'Distance walked (km)',
    },
    artCaption: '3 km each hour.',
    words: [
      {
        term: 'Table of values',
        meaning: 'Pairs of numbers set out in rows or columns.',
      },
      { term: 'Interpret', meaning: 'Explain what something shows.' },
      { term: 'Read off', meaning: 'Find a value from a graph.' },
    ],
    examples: [
      {
        title: 'Between hours',
        situation: 'How far after 2 and a half hours?',
        steps: ['Read halfway between 2 h and 3 h.', '3 × 2.5 = 7.5.'],
        answer: '7.5 km.',
      },
      {
        title: 'Work back',
        situation: 'How long does she take to walk 9 km?',
        steps: ['Find 9 on the side axis and read across.'],
        answer: '3 hours.',
      },
    ],
    mistakes: [
      {
        wrong: 'Starting the graph at 1 hour.',
        right: 'At 0 hours she has walked 0 km. Start there.',
      },
    ],
    realLife: ['Planning journeys.', 'Saving money.', 'Science experiments.'],
    tryIt: {
      need: 'Graph paper',
      steps: [
        'Make a table: 4 cedis saved each week, for 6 weeks.',
        'Draw the line graph.',
        'Read off when you reach 18 cedis.',
      ],
    },
  },
  'mathematics-43': {
    indicator: {
      code: 'B6.4.1.2.1',
      text: 'Select a method for collecting data to answer a given question, and justify the choice.',
    },
    hook: 'Your class is planning a party. How will you find out which drinks to buy?',
    explain: [
      'Data can be collected by questionnaires, interviews, observation, experiments, databases or the internet.',
      'Choose the method that answers your question best.',
      'Explain why you chose it.',
    ],
    art: {
      kind: 'tally',
      rows: [
        ['Coke', 4],
        ['Fanta', 6],
        ['Sprite', 3],
      ],
    },
    artCaption: 'Tallying answers to a quick class survey.',
    words: [
      { term: 'Questionnaire', meaning: 'A set of written questions.' },
      { term: 'Interview', meaning: 'Asking questions face to face.' },
      { term: 'Observation', meaning: 'Watching and recording.' },
    ],
    examples: [
      {
        title: 'Party drinks',
        situation: 'Which method suits choosing party drinks?',
        steps: [
          'Everyone’s opinion matters.',
          'A short questionnaire reaches the whole class.',
        ],
        answer: 'A questionnaire.',
      },
      {
        title: 'Desks',
        situation: 'Which method suits counting the desks in each classroom?',
        steps: ['You can see and count them.'],
        answer: 'Observation.',
      },
    ],
    mistakes: [
      {
        wrong: 'Asking only your friends.',
        right: 'Ask a fair sample of the people the question is about.',
      },
    ],
    realLife: [
      'Planning events.',
      'Shops choosing what to sell.',
      'Health surveys.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write three questions you want answered about your school.',
        'Choose a method for each.',
        'Explain your choices.',
      ],
    },
  },
  'mathematics-44': {
    indicator: {
      code: 'B6.4.1.2.2',
      text: 'Design and administer a questionnaire for collecting data to answer a given question, and record the results.',
    },
    hook: 'A good survey question gets a clear answer. A poor one gets a muddle. What makes the difference?',
    explain: [
      'Good questions are short, clear and easy to answer.',
      'Give answer choices where you can, such as tick boxes.',
      'Avoid questions that push people towards one answer.',
    ],
    art: {
      kind: 'scroll',
      title: 'Class survey',
      lines: [
        'How old are you?',
        'What is your favourite drink?',
        'How do you come to school?',
      ],
    },
    artCaption: 'Short, clear questions.',
    words: [
      { term: 'Survey', meaning: 'Collecting answers from many people.' },
      { term: 'Respondent', meaning: 'A person who answers a survey.' },
      {
        term: 'Biased question',
        meaning: 'A question that pushes towards an answer.',
      },
    ],
    examples: [
      {
        title: 'Fix the question',
        situation:
          'Improve: “Don’t you agree that football is the best sport?”',
        steps: [
          'It pushes people to say yes.',
          'Ask neutrally and give choices.',
        ],
        answer:
          '“Which sport do you like best? Football, athletics, netball or other.”',
      },
      {
        title: 'Clear numbers',
        situation: 'Improve: “Do you spend a lot on bus fare?”',
        steps: ['“A lot” means different things to different people.'],
        answer: '“How much do you spend on bus fare each day, in cedis?”',
      },
    ],
    mistakes: [
      {
        wrong: 'Asking two things in one question.',
        right: 'Ask one thing at a time.',
      },
    ],
    realLife: [
      'School surveys.',
      'Customer surveys in shops.',
      'National census forms.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a five-question survey.',
        'Ask ten pupils.',
        'Record the answers in a table.',
      ],
    },
  },
  'mathematics-45': {
    indicator: {
      code: 'B6.4.1.2.3',
      text: 'Organise, analyse and graph questionnaire data to solve problems.',
    },
    hook: 'You have 32 survey forms. How do you turn them into an answer?',
    explain: [
      'Tally the answers for each question.',
      'Put the totals in a frequency table.',
      'Draw a bar or line graph, then write a conclusion.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Coke', 8],
        ['Fanta', 12],
        ['Sprite', 5],
        ['Malt', 7],
      ],
      label: 'Favourite drinks in Class 6',
    },
    artCaption: 'Fanta is the most popular.',
    words: [
      { term: 'Frequency', meaning: 'How many times something happens.' },
      { term: 'Frequency table', meaning: 'A table of totals.' },
      { term: 'Conclusion', meaning: 'What the data tells you.' },
    ],
    examples: [
      {
        title: 'Check the total',
        situation: 'Do the totals match the 32 forms?',
        steps: ['8 + 12 + 5 + 7 = 32.'],
        answer: 'Yes.',
      },
      {
        title: 'As a fraction',
        situation: 'What fraction of the class chose Fanta?',
        steps: ['12/32 = 3/8.'],
        answer: '3/8 of the class.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to check that the totals add up.',
        right: 'The totals should equal the number of forms.',
      },
    ],
    realLife: ['Planning a party.', 'School reports.', 'Business decisions.'],
    tryIt: {
      need: 'Your survey results',
      steps: [
        'Make a frequency table.',
        'Draw a bar graph.',
        'Write two conclusions.',
      ],
    },
  },
  'mathematics-46': {
    indicator: {
      code: 'B6.4.2.2.1',
      text: 'List the possible outcomes of a probability experiment, such as tossing a coin or spinning a spinner.',
    },
    hook: 'Before you spin a spinner, can you list everything that could happen?',
    explain: [
      'An outcome is one possible result.',
      'A coin has two outcomes: heads or tails. A die has six: 1, 2, 3, 4, 5 and 6.',
      'For two coins, list them in order: HH, HT, TH, TT.',
    ],
    art: {
      kind: 'spinner',
      sectors: ['red', 'blue', 'yellow', 'green', 'blue'],
      numbered: true,
      label: 'Outcomes: 1, 2, 3, 4 or 5',
    },
    artCaption: 'A five-sector spinner has five outcomes.',
    words: [
      { term: 'Outcome', meaning: 'A possible result.' },
      { term: 'Experiment', meaning: 'A test that is repeated.' },
      { term: 'Equally likely', meaning: 'Each has the same chance.' },
    ],
    examples: [
      {
        title: 'Two coins',
        situation: 'List the outcomes of tossing two coins.',
        steps: ['First coin H: HH, HT.', 'First coin T: TH, TT.'],
        answer: '4 outcomes: HH, HT, TH, TT.',
      },
      {
        title: 'A die',
        situation: 'List the even outcomes of rolling a die.',
        steps: ['Even numbers from 1 to 6.'],
        answer: '2, 4 and 6.',
      },
    ],
    mistakes: [
      {
        wrong: 'Counting HT and TH as the same outcome.',
        right: 'They are different: which coin shows heads differs.',
      },
    ],
    realLife: [
      'Games and sport.',
      'Choosing who starts.',
      'Weather forecasts.',
    ],
    tryIt: {
      need: 'Two coins',
      steps: [
        'List all the outcomes.',
        'Toss them 20 times and tally.',
        'Which outcome came most?',
      ],
    },
  },
  'mathematics-47': {
    indicator: {
      code: 'B6.4.2.2.2',
      text: 'Predict the probability of an outcome using theoretical probability.',
    },
    hook: 'An 8-sector spinner is numbered 1 to 8. What chance do you have of spinning a 2?',
    explain: [
      'Theoretical probability is what should happen in theory.',
      'Probability = number of favourable outcomes ÷ number of possible outcomes.',
      'It is written as a fraction from 0 (impossible) to 1 (certain).',
    ],
    art: {
      kind: 'spinner',
      sectors: [
        'red',
        'blue',
        'yellow',
        'green',
        'red',
        'blue',
        'yellow',
        'green',
      ],
      numbered: true,
      label: 'Spinning a 2: 1 chance in 8',
    },
    artCaption: 'Eight equal sectors.',
    words: [
      { term: 'Probability', meaning: 'How likely something is, from 0 to 1.' },
      { term: 'Favourable outcome', meaning: 'An outcome you want.' },
      {
        term: 'Theoretical',
        meaning: 'Worked out by reasoning, not by trying.',
      },
    ],
    examples: [
      {
        title: 'Spin a 2',
        situation: 'What is the probability of spinning a 2?',
        steps: ['One favourable outcome out of 8.'],
        answer: '1/8.',
      },
      {
        title: 'More than 4',
        situation: 'What is the probability of a number greater than 4?',
        steps: ['5, 6, 7 and 8: four outcomes.', '4/8 = 1/2.'],
        answer: '1/2.',
      },
      {
        title: '1 or 3',
        situation: 'What is the probability of a 1 or a 3?',
        steps: ['Two outcomes out of 8.', '2/8 = 1/4.'],
        answer: '1/4.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing the probability as more than 1.',
        right: 'Probability is never more than 1.',
      },
    ],
    realLife: ['Games of chance.', 'Weather forecasts.', 'Sports predictions.'],
    tryIt: {
      need: 'A die',
      steps: [
        'Write the probability of rolling a 6.',
        'Write the probability of an odd number.',
        'Explain your reasoning.',
      ],
    },
  },
  'mathematics-48': {
    indicator: {
      code: 'B6.4.2.2.3',
      text: 'Explain that experimental probability gets closer to theoretical probability as the number of trials increases.',
    },
    hook: 'You spin a 5-sector spinner 10 times and never get a 2. Is the spinner broken?',
    explain: [
      'Experimental probability = times an outcome happened ÷ number of trials.',
      'With few trials, results can be far from the theory.',
      'With many trials, the experimental probability gets closer to the theoretical probability.',
    ],
    art: {
      kind: 'spinner',
      sectors: ['red', 'blue', 'yellow', 'green', 'blue'],
      numbered: true,
      label: 'Theory: a 2 comes up 1 time in 5',
    },
    artCaption: 'Five equal sectors.',
    words: [
      { term: 'Trial', meaning: 'One go of an experiment.' },
      {
        term: 'Experimental probability',
        meaning: 'Found by doing the experiment.',
      },
      { term: 'Theoretical probability', meaning: 'Found by reasoning.' },
    ],
    examples: [
      {
        title: 'One hundred spins',
        situation: 'In 100 spins, 2 came up 23 times. Compare with the theory.',
        steps: ['Experimental: 23/100.', 'Theoretical: 1/5 = 20/100.'],
        answer: 'Close: 23 out of 100 against 20 out of 100.',
      },
      {
        title: 'Ten spins',
        situation: 'Why might 10 spins give no 2s at all?',
        steps: ['With few trials, chance has a big effect.'],
        answer: 'It is not broken. More trials would show the pattern.',
      },
    ],
    mistakes: [
      {
        wrong: 'Expecting exactly 20 twos in 100 spins.',
        right: 'Expect about 20. Results vary.',
      },
    ],
    realLife: [
      'Testing seeds.',
      'Quality checks in factories.',
      'Sports statistics.',
    ],
    tryIt: {
      need: 'A paper spinner with 5 equal sectors',
      steps: [
        'Spin 20 times and record the 2s.',
        'Combine your results with other groups.',
        'Compare with 1/5.',
      ],
    },
  },
}
