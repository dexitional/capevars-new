import type { CourseGuides } from './types'

// Basic 4 Mathematics, written for this course and scoped to the NaCCA
// Mathematics Curriculum for Primary Schools, Basic 4–6 (2019). Notes:
// - The imported lessons carry no indicator codes, and each covers two topics,
//   so each guide names the indicator its lesson mainly teaches.
// - Numbers go to 100,000; Roman numerals to XXX; factors to 50; multiplication
//   facts to 12 × 12; division is by one-digit numbers.
// - The curriculum’s rounding table gives 14,765 to the nearest ten as 14,970.
//   It is 14,770, which is what the guide uses.

export const guides: CourseGuides = {
  'mathematics-01': {
    indicator: {
      code: 'B4.1.1.1.1',
      text: 'Model number quantities and place value for multi-digit numbers, and read and write numbers up to 100,000.',
    },
    hook: 'A big school may have 2,350 pupils. A town may have 45,000 people. How do we read such big numbers?',
    explain: [
      'Each digit has a place: ten thousands, thousands, hundreds, tens and ones.',
      'In 45,302 the 4 means 40,000, the 5 means 5000, the 3 means 300, the 0 means no tens, and the 2 means 2.',
      'We read it as forty-five thousand, three hundred and two.',
    ],
    art: {
      kind: 'caps',
      hundreds: 2,
      tens: 3,
      ones: 5,
      label: '235 = 200 + 30 + 5',
    },
    artCaption: 'Every place is worth ten times the place to its right.',
    words: [
      {
        term: 'Place value',
        meaning: 'What a digit is worth because of its place.',
      },
      { term: 'Ten thousands', meaning: 'The place to the left of thousands.' },
      {
        term: 'Expanded form',
        meaning: 'A number written as the sum of its parts.',
      },
    ],
    examples: [
      {
        title: 'Expand it',
        situation: 'Write 67,148 in expanded form.',
        steps: [
          '6 ten thousands is 60000.',
          '7 thousands is 7000.',
          '1 hundred is 100, 4 tens is 40, and 8 ones is 8.',
        ],
        answer: '67148 = 60000 + 7000 + 100 + 40 + 8.',
      },
      {
        title: 'Write it in figures',
        situation: 'Write “twelve thousand and five” in figures.',
        steps: [
          'Twelve thousand is 12,000.',
          'There are no hundreds or tens.',
          'Add 5 ones.',
        ],
        answer: '12,005.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing twelve thousand and five as 1205.',
        right: 'Use zeros to hold empty places: 12,005.',
      },
    ],
    realLife: [
      'Reading the population of your town.',
      'Reading big prices.',
      'Counting votes in an election.',
    ],
    tryIt: {
      need: 'Digit cards 0 to 9',
      steps: [
        'Pick five cards to make a number.',
        'Read it aloud.',
        'Write it in words and in expanded form.',
      ],
    },
  },
  'mathematics-02': {
    indicator: {
      code: 'B4.1.1.1.3',
      text: 'Identify numbers around a given number in a number chart, and compare and order whole numbers.',
    },
    hook: 'Which is bigger, 45,099 or 45,100? Place value can tell you quickly.',
    explain: [
      'On a number chart, the number to the right is 1 more and the number below is 10 more.',
      'To compare, start with the biggest place and stop at the first digit that differs.',
      'Use >, < and = to show the comparison.',
    ],
    art: { kind: 'chart', start: 1, focus: 27 },
    artCaption: 'The neighbours of 27 are 17, 37, 26 and 28.',
    words: [
      { term: 'Compare', meaning: 'Decide which is bigger or smaller.' },
      { term: 'Ascending', meaning: 'From smallest to biggest.' },
      { term: 'Descending', meaning: 'From biggest to smallest.' },
    ],
    examples: [
      {
        title: 'Compare',
        situation: 'Which is bigger: 45,099 or 45,100?',
        steps: [
          'Ten thousands: both 4. Thousands: both 5.',
          'Hundreds: 0 and 1. So 45,100 is bigger.',
        ],
        answer: '45,100 > 45,099.',
      },
      {
        title: 'Order them',
        situation: 'Put 8,203, 8,320 and 8,032 in ascending order.',
        steps: ['All have 8 thousands.', 'Hundreds: 2, 3 and 0.'],
        answer: '8,032, 8,203, 8,320.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking more digits after a 9 make a bigger number.',
        right: 'Compare from the biggest place first.',
      },
    ],
    realLife: ['Comparing prices.', 'Ranking scores.', 'Comparing distances.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write five four-digit numbers.',
        'Order them in ascending order.',
        'Then order them in descending order.',
      ],
    },
  },
  'mathematics-03': {
    indicator: {
      code: 'B4.1.1.1.5',
      text: 'Round whole numbers up to 10,000 to the nearest 10, 100 and 1000, and skip count in 50s and 100s.',
    },
    hook: 'A newspaper says “about 15,000 people came”. The real number was 14,765. Why do we round?',
    explain: [
      'Rounding gives a simpler number that is close.',
      'Look at the digit to the right of the place you are rounding to. If it is 5 or more, round up. If it is less than 5, round down.',
      '14,765 to the nearest ten is 14,770. To the nearest hundred it is 14,800. To the nearest thousand it is 15,000.',
    ],
    art: {
      kind: 'pattern',
      terms: [240, 290, 340, 390, null],
      rule: 'Skip count by 50.',
    },
    artCaption: 'Skip counting in 50s.',
    words: [
      { term: 'Round', meaning: 'Change to a nearby, simpler number.' },
      { term: 'Nearest', meaning: 'Closest.' },
      { term: 'Estimate', meaning: 'A close answer found by rounding.' },
    ],
    examples: [
      {
        title: 'Round to the nearest hundred',
        situation: 'Round 3,462 to the nearest hundred.',
        steps: [
          'The hundreds digit is 4.',
          'The digit to its right is 6, which is 5 or more.',
          'Round up to 3,500.',
        ],
        answer: '3,500.',
      },
      {
        title: 'Skip count down',
        situation: 'Count back in 100s from 1,285.',
        steps: ['1285, 1185, 1085, 985, 885.'],
        answer: '1,285, 1,185, 1,085, 985, 885.',
      },
    ],
    mistakes: [
      {
        wrong: 'Looking at the wrong digit to decide.',
        right: 'Look at the digit just to the right of the rounding place.',
      },
    ],
    realLife: [
      'Reporting crowd sizes.',
      'Estimating shopping totals.',
      'Talking about distances.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write 6,749.',
        'Round it to the nearest 10, 100 and 1000.',
        'Explain each answer to a friend.',
      ],
    },
  },
  'mathematics-04': {
    indicator: {
      code: 'B4.1.1.2.1',
      text: 'Develop an understanding of the Roman numeral system up to XXX, and convert between Roman and Hindu-Arabic numerals.',
    },
    hook: 'Some clocks show XII instead of 12. These are Roman numerals. Can you read them?',
    explain: [
      'Roman numerals use letters: I is 1, V is 5 and X is 10.',
      'Add when a smaller letter comes after a bigger one: VI is 5 + 1 = 6.',
      'Subtract when a smaller letter comes before a bigger one: IV is 5 − 1 = 4, and IX is 10 − 1 = 9.',
    ],
    art: {
      kind: 'clock',
      hour: 12,
      roman: true,
      label: 'XII is 12, and VI is 6',
    },
    artCaption: 'XII means 10 + 1 + 1.',
    words: [
      {
        term: 'Roman numeral',
        meaning: 'A number written with letters, such as X for 10.',
      },
      {
        term: 'Hindu-Arabic numeral',
        meaning: 'The digits we usually use: 0 to 9.',
      },
      { term: 'Convert', meaning: 'Change from one form to another.' },
    ],
    examples: [
      {
        title: 'Read it',
        situation: 'What is XIV?',
        steps: ['X is 10.', 'IV is 4.', '10 + 4 = 14.'],
        answer: 'XIV is 14.',
      },
      {
        title: 'Write it',
        situation: 'Write 29 in Roman numerals.',
        steps: ['20 is XX.', '9 is IX.'],
        answer: 'XXIX.',
      },
    ],
    mistakes: [{ wrong: 'Writing 4 as IIII.', right: 'Write 4 as IV.' }],
    realLife: [
      'Clock faces.',
      'Chapter numbers in books.',
      'Names of kings and queens, such as Elizabeth II.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the numbers 1 to 30 in Roman numerals.',
        'Circle the ones that use subtraction.',
        'Write today’s date using Roman numerals for the day.',
      ],
    },
  },
  'mathematics-05': {
    indicator: {
      code: 'B4.1.1.3.1',
      text: 'Determine the set of factors of numbers up to 50, and the highest common factor (HCF) of two numbers.',
    },
    hook: '12 chairs can be arranged in equal rows in many ways. Each way shows a factor of 12!',
    explain: [
      'A factor divides a number exactly, with nothing left over.',
      'The factors of 12 are 1, 2, 3, 4, 6 and 12.',
      'The highest common factor (HCF) of two numbers is the biggest factor they share.',
    ],
    art: {
      kind: 'grid',
      rows: 3,
      cols: 4,
      label: '3 × 4 = 12: 3 and 4 are factors of 12',
    },
    artCaption: 'Each array shows a pair of factors.',
    words: [
      { term: 'Factor', meaning: 'A number that divides another exactly.' },
      { term: 'Common factor', meaning: 'A factor two numbers share.' },
      { term: 'HCF', meaning: 'The highest common factor.' },
    ],
    examples: [
      {
        title: 'Find the factors',
        situation: 'List the factors of 18.',
        steps: ['1 × 18 = 18.', '2 × 9 = 18.', '3 × 6 = 18.'],
        answer: '1, 2, 3, 6, 9 and 18.',
      },
      {
        title: 'Find the HCF',
        situation: 'Find the HCF of 12 and 18.',
        steps: [
          'Factors of 12: 1, 2, 3, 4, 6, 12.',
          'Factors of 18: 1, 2, 3, 6, 9, 18.',
          'Common: 1, 2, 3, 6.',
        ],
        answer: 'The HCF is 6.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting 1 and the number itself.',
        right: 'Every number has 1 and itself as factors.',
      },
    ],
    realLife: [
      'Arranging chairs in rows.',
      'Sharing sweets into equal packs.',
      'Cutting cloth into equal pieces.',
    ],
    tryIt: {
      need: '24 bottle caps',
      steps: [
        'Arrange them in as many different rectangles as you can.',
        'Write each as a multiplication.',
        'List all the factors of 24.',
      ],
    },
  },
  'mathematics-06': {
    indicator: {
      code: 'B4.1.1.3.3',
      text: 'Determine the lowest common multiple (LCM) of two numbers, and recognise the relationship between factors and multiples.',
    },
    hook: 'One bus leaves every 4 minutes, another every 6 minutes. When will they leave together again?',
    explain: [
      'Multiples are what you get when you skip count: multiples of 4 are 4, 8, 12, 16.',
      'The lowest common multiple (LCM) is the smallest multiple two numbers share.',
      'Since 12 = 4 × 3, 4 and 3 are factors of 12, and 12 is a multiple of both.',
    ],
    art: {
      kind: 'pattern',
      terms: [4, 8, 12, 16, 20, 24],
      rule: 'Multiples of 4',
    },
    artCaption: 'Skip counting makes multiples.',
    words: [
      {
        term: 'Multiple',
        meaning: 'The result of multiplying by a whole number.',
      },
      { term: 'Common multiple', meaning: 'A multiple two numbers share.' },
      { term: 'LCM', meaning: 'The lowest common multiple.' },
    ],
    examples: [
      {
        title: 'The buses',
        situation: 'Find the LCM of 4 and 6.',
        steps: [
          'Multiples of 4: 4, 8, 12, 16, 20, 24.',
          'Multiples of 6: 6, 12, 18, 24.',
          'The smallest shared one is 12.',
        ],
        answer: 'The LCM is 12, so the buses leave together after 12 minutes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up factors and multiples.',
        right: 'Factors go into a number. Multiples come out of skip counting.',
      },
    ],
    realLife: [
      'Buses and trains that meet.',
      'Planning events that repeat.',
      'Buying items in packs.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'List the multiples of 3 and of 5 up to 30.',
        'Circle the common multiples.',
        'Which is the LCM?',
      ],
    },
  },
  'mathematics-07': {
    indicator: {
      code: 'B4.1.1.3.5',
      text: 'Generate and analyse patterns in square numbers, and represent square numbers using factors.',
    },
    hook: 'Some numbers of caps make perfect squares. Which ones?',
    explain: [
      'A square number is made by multiplying a number by itself.',
      '1 × 1 = 1, 2 × 2 = 4, 3 × 3 = 9, 4 × 4 = 16.',
      'Square numbers can be drawn as square arrays.',
    ],
    art: {
      kind: 'grid',
      rows: 4,
      cols: 4,
      label: '4 × 4 = 16, a square number',
    },
    artCaption: '16 caps make a perfect square.',
    words: [
      { term: 'Square number', meaning: 'A number times itself.' },
      { term: 'Square array', meaning: 'Equal rows and columns.' },
      { term: 'Pattern', meaning: 'Numbers that follow a rule.' },
    ],
    examples: [
      {
        title: 'Find the pattern',
        situation: 'What is the next square number after 1, 4, 9, 16, 25?',
        steps: ['5 × 5 = 25.', '6 × 6 = 36.'],
        answer: '36.',
      },
      {
        title: 'Is it square?',
        situation: 'Is 20 a square number?',
        steps: [
          '4 × 4 = 16.',
          '5 × 5 = 25.',
          'No whole number times itself makes 20.',
        ],
        answer: 'No.',
      },
    ],
    mistakes: [
      { wrong: 'Thinking 3 squared is 6.', right: '3 squared is 3 × 3 = 9.' },
    ],
    realLife: [
      'Square floor tiles.',
      'Chessboards.',
      'Arranging chairs in a square.',
    ],
    tryIt: {
      need: 'Bottle caps',
      steps: [
        'Make square arrays with 1, 4, 9 and 16 caps.',
        'Can you make one with 12 caps?',
        'Write the square numbers you find.',
      ],
    },
  },
  'mathematics-08': {
    indicator: {
      code: 'B4.1.1.4.1',
      text: 'Describe real-life situations using positive and negative values, and count through zero.',
    },
    hook: 'If you owe a friend 5 cedis, how can numbers show that?',
    explain: [
      'Positive numbers are above zero. Negative numbers are below zero.',
      'We use negative numbers for owing money, cold temperatures and going below the ground.',
      'On a number line, we can count forwards and backwards through zero.',
    ],
    art: {
      kind: 'jumps',
      start: 3,
      jumps: [-1, -1, -1, -1, -1, -1],
      label: 'From 3, count back 6',
    },
    artCaption: 'Counting back through zero.',
    words: [
      { term: 'Positive', meaning: 'Greater than zero.' },
      { term: 'Negative', meaning: 'Less than zero.' },
      {
        term: 'Through zero',
        meaning: 'Passing from positive to negative, or back.',
      },
    ],
    examples: [
      {
        title: 'Count through zero',
        situation: 'Start at 3. Count back 6.',
        steps: ['3, 2, 1, 0, −1, −2, −3.'],
        answer: '−3.',
      },
      {
        title: 'Owing money',
        situation: 'You have 2 cedis and spend 5. How do we show what you owe?',
        steps: ['You are 3 cedis short.'],
        answer: '−3 cedis.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking −8 is bigger than −2.',
        right: '−8 is further below zero, so it is smaller.',
      },
    ],
    realLife: [
      'Owing money.',
      'Freezer temperatures.',
      'Floors below the ground.',
    ],
    tryIt: {
      need: 'A number line from −10 to 10',
      steps: [
        'Start at 5 and count back 8.',
        'Start at −4 and count forward 6.',
        'Make up a story for one of them.',
      ],
    },
  },
  'mathematics-09': {
    indicator: {
      code: 'B4.1.2.1.1',
      text: 'Determine basic multiplication facts up to 12 × 12.',
    },
    hook: 'Knowing your times tables makes maths much faster. How many can you already say?',
    explain: [
      'Multiplication facts tell us the product of two numbers, such as 7 × 8 = 56.',
      'You can build facts with arrays, or by skip counting.',
      'Swapping the order gives the same answer: 6 × 9 = 9 × 6.',
    ],
    art: { kind: 'grid', rows: 3, cols: 7, label: '3 × 7 = 21' },
    artCaption: '3 rows of 7.',
    words: [
      { term: 'Product', meaning: 'The answer to a multiplication.' },
      { term: 'Times table', meaning: 'A list of multiplication facts.' },
      { term: 'Array', meaning: 'Equal rows and columns.' },
    ],
    examples: [
      {
        title: 'Skip count',
        situation: 'Find 4 × 8 by skip counting.',
        steps: ['Count in 8s: 8, 16, 24, 32.'],
        answer: '4 × 8 = 32.',
      },
      {
        title: 'Use a known fact',
        situation: 'You know 10 × 12 = 120. What is 11 × 12?',
        steps: ['Add one more 12: 120 + 12 = 132.'],
        answer: '11 × 12 = 132.',
      },
    ],
    mistakes: [
      {
        wrong: 'Guessing when you forget a fact.',
        right: 'Work it out from a fact you know.',
      },
    ],
    realLife: [
      'Packs of items.',
      'Rows of seats.',
      'Prices for several items.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Take turns asking times table questions up to 12 × 12.',
        'Explain how you got any you were unsure of.',
        'Practise your hardest table.',
      ],
    },
  },
  'mathematics-10': {
    indicator: {
      code: 'B4.1.2.2.1',
      text: 'Apply mental mathematics strategies, such as doubling, halving and known facts, for multiplication and related division.',
    },
    hook: 'How can 8 × 3 be worked out from 4 × 3? Doubling is a clever trick!',
    explain: [
      'Doubling: if 4 × 3 = 12, then 8 × 3 = 12 + 12 = 24.',
      'For 9s: 9 × 6 is 10 × 6 = 60, then 60 − 6 = 54.',
      'Adding zeros: 3 × 200 is 3 × 2 = 6 with two zeros, so 600.',
    ],
    art: {
      kind: 'grid',
      rows: 2,
      cols: 6,
      label: '2 × 6 = 12; double it: 4 × 6 = 24',
    },
    artCaption: 'Doubling one factor doubles the answer.',
    words: [
      { term: 'Doubling', meaning: 'Multiplying by 2.' },
      { term: 'Halving', meaning: 'Dividing by 2.' },
      { term: 'Mental maths', meaning: 'Working out in your head.' },
    ],
    examples: [
      {
        title: 'The 9s trick',
        situation: 'Work out 7 × 9.',
        steps: ['7 × 10 = 70.', '70 − 7 = 63.'],
        answer: '7 × 9 = 63.',
      },
      {
        title: 'Close to a ten',
        situation: 'Work out 29 × 7.',
        steps: ['30 × 7 = 210.', 'Take away one 7: 210 − 7 = 203.'],
        answer: '29 × 7 = 203.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to subtract after using a friendly number.',
        right: 'Fix the answer by taking away the extra group.',
      },
    ],
    realLife: [
      'Working out prices quickly.',
      'Doubling a recipe.',
      'Counting in packs.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Work out 6 × 9 using the 9s trick.',
        'Work out 8 × 7 by doubling 4 × 7.',
        'Explain your method.',
      ],
    },
  },
  'mathematics-11': {
    indicator: {
      code: 'B4.1.2.3.1',
      text: 'Multiply multi-digit numbers efficiently.',
    },
    hook: 'A trader packs 448 oranges into each of 2 lorries. How many oranges is that?',
    explain: [
      'Split the big number into hundreds, tens and ones.',
      'Multiply each part, then add the answers.',
      '448 × 2 = 800 + 80 + 16 = 896.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['400 × 2', 800],
        ['40 × 2', 80],
        ['8 × 2', 16],
      ],
      label: '800 + 80 + 16 = 896',
    },
    artCaption: 'Multiply each part, then add.',
    words: [
      { term: 'Expand', meaning: 'Split a number into its parts.' },
      { term: 'Partial product', meaning: 'The answer for one part.' },
      { term: 'Total', meaning: 'All the parts added together.' },
    ],
    examples: [
      {
        title: 'Expand and box',
        situation: 'Work out 448 × 2.',
        steps: [
          '400 × 2 = 800.',
          '40 × 2 = 80.',
          '8 × 2 = 16.',
          '800 + 80 + 16 = 896.',
        ],
        answer: '448 × 2 = 896.',
      },
      {
        title: 'Another',
        situation: 'Work out 54 × 3.',
        steps: ['50 × 3 = 150.', '4 × 3 = 12.', '150 + 12 = 162.'],
        answer: '54 × 3 = 162.',
      },
    ],
    mistakes: [
      {
        wrong: 'Multiplying only the ones.',
        right: 'Multiply every part: hundreds, tens and ones.',
      },
    ],
    realLife: [
      'Working out costs of many items.',
      'Counting goods in boxes.',
      'Planning food for an event.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a box for 236 × 3.',
        'Fill in each part.',
        'Add to find the answer.',
      ],
    },
  },
  'mathematics-12': {
    indicator: {
      code: 'B4.1.2.4.1',
      text: 'Determine basic division facts up to 81, and use divisibility tests.',
    },
    hook: 'If you know 8 × 7 = 56, you also know 56 ÷ 8. Why?',
    explain: [
      'Division undoes multiplication.',
      '56 ÷ 8 asks: 8 times what is 56? The answer is 7.',
      'Divisibility tests help: even numbers divide by 2, and numbers ending in 0 or 5 divide by 5.',
    ],
    art: { kind: 'grid', rows: 7, cols: 8, label: '8 × 7 = 56, so 56 ÷ 8 = 7' },
    artCaption: 'One array gives a multiplication and a division.',
    words: [
      { term: 'Divide', meaning: 'Share equally or find how many groups.' },
      { term: 'Quotient', meaning: 'The answer to a division.' },
      { term: 'Divisible', meaning: 'Can be divided exactly.' },
    ],
    examples: [
      {
        title: 'Use a fact',
        situation: 'Work out 63 ÷ 9.',
        steps: ['9 × 7 = 63.'],
        answer: '63 ÷ 9 = 7.',
      },
      {
        title: 'Test it',
        situation: 'Is 135 divisible by 5?',
        steps: ['It ends in 5.'],
        answer: 'Yes. 135 ÷ 5 = 27.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking every odd number divides by 3.',
        right:
          'Use the test: add the digits and see if the total divides by 3.',
      },
    ],
    realLife: [
      'Sharing money equally.',
      'Packing items into boxes.',
      'Splitting a bill.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write five division facts from the 6 times table.',
        'Check three numbers for divisibility by 2 and 5.',
        'Explain your tests.',
      ],
    },
  },
  'mathematics-13': {
    indicator: {
      code: 'B4.1.2.5.1',
      text: 'Divide 2-digit and 3-digit numbers by a 1-digit number efficiently.',
    },
    hook: 'How can you share 276 books between 3 schools? Take away big groups at a time!',
    explain: [
      'Take away large groups of the divisor, then smaller ones.',
      'Keep a record of how many groups you took.',
      'Add the groups to get the answer.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['40 threes', 120],
        ['50 threes', 150],
        ['2 threes', 6],
      ],
      label: '120 + 150 + 6 = 276, so 276 ÷ 3 = 92',
    },
    artCaption: '40 + 50 + 2 = 92 groups of 3.',
    words: [
      { term: 'Divisor', meaning: 'The number you divide by.' },
      { term: 'Dividend', meaning: 'The number being divided.' },
      { term: 'Remainder', meaning: 'What is left over.' },
    ],
    examples: [
      {
        title: 'Share the books',
        situation: 'Work out 276 ÷ 3.',
        steps: [
          '3 × 40 = 120. 276 − 120 = 156.',
          '3 × 50 = 150. 156 − 150 = 6.',
          '3 × 2 = 6. 6 − 6 = 0.',
          '40 + 50 + 2 = 92.',
        ],
        answer: '276 ÷ 3 = 92.',
      },
      {
        title: 'A smaller one',
        situation: 'Work out 84 ÷ 4.',
        steps: ['4 × 20 = 80. 84 − 80 = 4.', '4 × 1 = 4.', '20 + 1 = 21.'],
        answer: '84 ÷ 4 = 21.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to add up all the groups.',
        right: 'Add every group you took away.',
      },
    ],
    realLife: [
      'Sharing books between classes.',
      'Splitting money.',
      'Packing goods.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 96 ÷ 4.',
        'Work out 255 ÷ 5.',
        'Check each by multiplying.',
      ],
    },
  },
  'mathematics-14': {
    indicator: {
      code: 'B4.1.2.6.1',
      text: 'Solve multi-step word problems involving the four basic operations.',
    },
    hook: 'Ama buys 3 books at 12 cedis each and pays with a 50 cedi note. How much change?',
    explain: [
      'Read the problem carefully and find what it asks.',
      'Break it into steps. Decide which operation each step needs.',
      'Check that your answer makes sense.',
    ],
    art: {
      kind: 'cedis',
      notes: [20, 20, 10],
      label: 'Ama pays with 50 cedis',
    },
    artCaption: 'Two steps: multiply, then subtract.',
    words: [
      { term: 'Multi-step', meaning: 'Needing more than one calculation.' },
      {
        term: 'Operation',
        meaning: 'Adding, subtracting, multiplying or dividing.',
      },
      { term: 'Change', meaning: 'Money given back.' },
    ],
    examples: [
      {
        title: 'Books and change',
        situation: '3 books at 12 cedis each, paid with 50 cedis. What change?',
        steps: ['Cost: 3 × 12 = 36.', 'Change: 50 − 36 = 14.'],
        answer: '14 cedis change.',
      },
      {
        title: 'Sharing',
        situation:
          '4 friends pick 18 mangoes and 22 oranges, and share them all equally. How many fruits each?',
        steps: ['Total: 18 + 22 = 40.', 'Share: 40 ÷ 4 = 10.'],
        answer: '10 fruits each.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stopping after the first step.',
        right: 'Re-read the question to check you answered it.',
      },
    ],
    realLife: [
      'Shopping with change.',
      'Sharing food fairly.',
      'Planning trips.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write a two-step money problem.',
        'Swap with a friend and solve.',
        'Check each other’s steps.',
      ],
    },
  },
  'mathematics-15': {
    indicator: {
      code: 'B4.1.3.1.1',
      text: 'Generate unit fractions and locate them on a number line, and recognise equivalent fractions.',
    },
    hook: 'Where is one-eighth on a number line between 0 and 1?',
    explain: [
      'Split the line from 0 to 1 into 8 equal parts. Each part is 1/8.',
      'Equivalent fractions name the same amount: 1/2 = 2/4 = 4/8.',
      'Fraction charts show which fractions are equal.',
    ],
    art: {
      kind: 'fractionLine',
      parts: 8,
      mark: 1,
      label: 'One-eighth on a number line',
    },
    artCaption: '0 to 1 split into 8 equal parts.',
    words: [
      {
        term: 'Unit fraction',
        meaning: 'A fraction with 1 on top, such as 1/8.',
      },
      { term: 'Equivalent', meaning: 'Equal in value.' },
      { term: 'Interval', meaning: 'A space between two points on a line.' },
    ],
    examples: [
      {
        title: 'Equal fractions',
        situation: 'Is 2/4 the same as 1/2?',
        steps: [
          'On a line split into 4, 2/4 is halfway.',
          '1/2 is halfway too.',
        ],
        answer: 'Yes: 1/2 = 2/4.',
        art: {
          kind: 'fractionLine',
          parts: 4,
          mark: 2,
          label: '2/4 is the same point as 1/2',
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Splitting the line into unequal parts.',
        right: 'All the parts must be equal.',
      },
    ],
    realLife: ['Measuring cloth.', 'Sharing food.', 'Reading a ruler.'],
    tryIt: {
      need: 'Paper strips',
      steps: [
        'Fold strips into halves, quarters and eighths.',
        'Line them up.',
        'Find fractions that are equal.',
      ],
    },
  },
  'mathematics-16': {
    indicator: {
      code: 'B4.1.3.1.3',
      text: 'Find the simplest form of fractions, and recognise improper fractions.',
    },
    hook: '6/8 of a pizza and 3/4 of a pizza are the same. Which is simpler?',
    explain: [
      'To simplify, divide the top and bottom by their highest common factor.',
      '6/8: the HCF of 6 and 8 is 2. 6 ÷ 2 = 3 and 8 ÷ 2 = 4, so 6/8 = 3/4.',
      'An improper fraction is more than one whole, such as 5/4.',
    ],
    art: { kind: 'cake', parts: 4, picked: 3, label: '6/8 simplifies to 3/4' },
    artCaption: 'Three-quarters of a cake.',
    words: [
      {
        term: 'Simplest form',
        meaning: 'A fraction that cannot be simplified further.',
      },
      { term: 'Improper fraction', meaning: 'A fraction greater than one.' },
      { term: 'Numerator', meaning: 'The top number.' },
    ],
    examples: [
      {
        title: 'Simplify',
        situation: 'Simplify 12/16.',
        steps: ['The HCF of 12 and 16 is 4.', '12 ÷ 4 = 3 and 16 ÷ 4 = 4.'],
        answer: '12/16 = 3/4.',
      },
      {
        title: 'Improper fraction',
        situation: 'You have 5 quarter pieces. How much cake is that?',
        steps: ['4 quarters make 1 whole.', '1 more quarter is left.'],
        answer: '5/4, which is 1 whole and 1 quarter.',
      },
    ],
    mistakes: [
      {
        wrong: 'Dividing only the top number.',
        right: 'Divide the top and bottom by the same number.',
      },
    ],
    realLife: [
      'Cooking with recipes.',
      'Sharing pizza.',
      'Measuring ingredients.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Simplify 4/8, 6/9 and 10/15.',
        'Draw 7/4 using circles.',
        'Explain your answers.',
      ],
    },
  },
  'mathematics-17': {
    indicator: {
      code: 'B4.1.3.2.1',
      text: 'Compare and order fractions, and give examples of where fractions are used.',
    },
    hook: 'Which is more: 3/4 of a litre of oil or 5/8 of a litre? Let us compare.',
    explain: [
      'To compare fractions with different bottoms, change them to the same bottom.',
      '3/4 = 6/8. Now compare 6/8 and 5/8: 6/8 is bigger.',
      'We use fractions when we sell liquids, share food or buy things in packets.',
    ],
    art: { kind: 'cake', parts: 8, picked: 6, label: '3/4 = 6/8' },
    artCaption: 'Use equal parts to compare.',
    words: [
      { term: 'Common denominator', meaning: 'The same bottom number.' },
      { term: 'Compare', meaning: 'Decide which is bigger.' },
      { term: 'Order', meaning: 'Put in order of size.' },
    ],
    examples: [
      {
        title: 'Which is more?',
        situation: 'Compare 3/4 and 5/8.',
        steps: ['3/4 = 6/8.', '6/8 is bigger than 5/8.'],
        answer: '3/4 is more.',
      },
      {
        title: 'Order them',
        situation: 'Order 1/2, 3/8 and 3/4 from smallest to biggest.',
        steps: ['Change to eighths: 4/8, 3/8 and 6/8.'],
        answer: '3/8, 1/2, 3/4.',
      },
    ],
    mistakes: [
      {
        wrong: 'Comparing only the top numbers when the bottoms differ.',
        right: 'Make the bottoms the same first.',
      },
    ],
    realLife: [
      'Buying half a litre of oil.',
      'Sharing a cake.',
      'Half-price sales.',
    ],
    tryIt: {
      need: 'Fraction strips',
      steps: [
        'Compare 2/3 and 3/4 using strips.',
        'Find where you see fractions at home.',
        'List three examples.',
      ],
    },
  },
  'mathematics-18': {
    indicator: {
      code: 'B4.1.4.1.1',
      text: 'Describe and represent decimals (tenths and hundredths), and round decimals to the nearest tenth.',
    },
    hook: 'A runner’s time is 12.47 seconds. What do the numbers after the point mean?',
    explain: [
      'Decimals show parts of a whole. The first place after the point is tenths. The second is hundredths.',
      '0.35 means 35 hundredths: 3 tenths and 5 hundredths.',
      'To round to the nearest tenth, look at the hundredths digit. 2.47 rounds to 2.5.',
    ],
    art: {
      kind: 'area',
      rows: 10,
      cols: 10,
      shaded: 35,
      label: '35 out of 100 squares: 0.35',
    },
    artCaption: '35 hundredths.',
    words: [
      {
        term: 'Decimal',
        meaning: 'A number with a point, showing parts of a whole.',
      },
      { term: 'Tenth', meaning: 'One part of ten: 0.1.' },
      { term: 'Hundredth', meaning: 'One part of a hundred: 0.01.' },
    ],
    examples: [
      {
        title: 'Read it',
        situation: 'What does 0.7 mean?',
        steps: ['The 7 is in the tenths place.'],
        answer: 'Seven tenths, or 7/10.',
      },
      {
        title: 'Round it',
        situation: 'Round 3.62 to the nearest tenth.',
        steps: [
          'The hundredths digit is 2, which is less than 5.',
          'Round down.',
        ],
        answer: '3.6.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 0.5 is smaller than 0.35 because 5 is less than 35.',
        right: '0.5 is 50 hundredths, which is bigger than 35 hundredths.',
      },
    ],
    realLife: [
      'Race times.',
      'Prices in cedis and pesewas.',
      'Measuring with a ruler.',
    ],
    tryIt: {
      need: 'Squared paper',
      steps: [
        'Draw a 10 by 10 grid.',
        'Shade 0.42 of it.',
        'Write it as a fraction too.',
      ],
    },
  },
  'mathematics-19': {
    indicator: {
      code: 'B4.1.4.1.3',
      text: 'Use models to explain addition and subtraction of decimals up to hundredths.',
    },
    hook: 'A drink costs 1.50 cedis and a pie costs 2.25 cedis. How much for both?',
    explain: [
      'Line up the decimal points, so tenths are under tenths and hundredths under hundredths.',
      'Add or subtract as with whole numbers.',
      'Put the decimal point in the answer, under the others.',
    ],
    art: { kind: 'area', rows: 10, cols: 10, shaded: 64, label: '0.64 shaded' },
    artCaption: 'Hundredths can be added like whole numbers.',
    words: [
      {
        term: 'Decimal point',
        meaning: 'The dot that separates wholes from parts.',
      },
      { term: 'Line up', meaning: 'Put places under each other.' },
      { term: 'Sum', meaning: 'The answer to an addition.' },
    ],
    examples: [
      {
        title: 'Add',
        situation: 'Work out 1.50 + 2.25.',
        steps: [
          'Line up the points.',
          'Hundredths: 0 + 5 = 5. Tenths: 5 + 2 = 7. Ones: 1 + 2 = 3.',
        ],
        answer: '1.50 + 2.25 = 3.75 cedis.',
      },
      {
        title: 'Subtract',
        situation: 'Work out 0.64 − 0.39.',
        steps: ['64 hundredths − 39 hundredths = 25 hundredths.'],
        answer: '0.64 − 0.39 = 0.25.',
      },
    ],
    mistakes: [
      {
        wrong: 'Not lining up the decimal points.',
        right: 'Always line up the points first.',
      },
    ],
    realLife: ['Adding prices.', 'Working out change.', 'Adding measurements.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Add 2.35 + 1.40.',
        'Subtract 5.75 − 2.50.',
        'Check with play money.',
      ],
    },
  },
  'mathematics-20': {
    indicator: {
      code: 'B4.1.5.1.1',
      text: 'Model percent as a fraction of hundredths, and compare and order fractions, decimals and percents.',
    },
    hook: 'A shop says “25% off”. What does 25% mean?',
    explain: [
      'Percent means out of 100. 25% means 25 out of 100.',
      '25% = 25/100 = 0.25.',
      'To compare fractions, decimals and percents, change them all into the same form.',
    ],
    art: {
      kind: 'area',
      rows: 10,
      cols: 10,
      shaded: 25,
      label: '25 out of 100: 25%',
    },
    artCaption: '25% is a quarter of the grid.',
    words: [
      { term: 'Percent (%)', meaning: 'Out of 100.' },
      { term: 'Discount', meaning: 'Money taken off a price.' },
      { term: 'Convert', meaning: 'Change from one form to another.' },
    ],
    examples: [
      {
        title: 'Convert',
        situation: 'Write 40% as a decimal and a fraction.',
        steps: ['40% is 40 out of 100.'],
        answer: '0.40, or 40/100.',
      },
      {
        title: 'Order them',
        situation: 'Order 0.78, 85% and 3/4 from smallest to biggest.',
        steps: ['Change all to decimals: 0.78, 0.85 and 0.75.'],
        answer: '3/4, 0.78, 85%.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 50% means 50 things.',
        right: '50% means 50 out of every 100: half.',
      },
    ],
    realLife: [
      'Discounts in shops.',
      'Test scores.',
      'Battery levels on phones.',
    ],
    tryIt: {
      need: 'Squared paper',
      steps: [
        'Shade 30% of a 10 by 10 grid.',
        'Write it as a decimal and a fraction.',
        'Find a percent in a shop or advert.',
      ],
    },
  },
  'mathematics-21': {
    indicator: {
      code: 'B4.2.1.1.1',
      text: 'Describe the pattern in a table or chart, and determine missing elements.',
    },
    hook: 'Each table at a party seats 4 people. How many people fit at 5 tables?',
    explain: [
      'A table of values can show a pattern.',
      'Look at how the numbers change from one row to the next.',
      'Use the rule to find missing numbers.',
    ],
    art: {
      kind: 'pattern',
      terms: [4, 8, 12, null, 20],
      rule: 'Add 4 for each table.',
    },
    artCaption: 'Tables 1 to 5, with one missing.',
    words: [
      { term: 'Table', meaning: 'Numbers set out in rows and columns.' },
      { term: 'Rule', meaning: 'How each number is found.' },
      { term: 'Missing term', meaning: 'A number that has been left out.' },
    ],
    examples: [
      {
        title: 'Find the missing number',
        situation: 'People: 4, 8, 12, ___, 20.',
        steps: ['The rule is add 4.', '12 + 4 = 16.'],
        answer: '16.',
      },
    ],
    mistakes: [
      {
        wrong: 'Checking only the first two numbers.',
        right: 'Check the rule works for every step.',
      },
    ],
    realLife: [
      'Seating plans.',
      'Prices for several items.',
      'Saving money each week.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a table: number of bicycles and wheels.',
        'Fill it in for 1 to 6 bicycles.',
        'Describe the rule.',
      ],
    },
  },
  'mathematics-22': {
    indicator: {
      code: 'B4.2.1.1.3',
      text: 'Identify errors in a given table or chart.',
    },
    hook: 'Something is wrong in this table: 5, 10, 15, 21, 25. Can you find the mistake?',
    explain: [
      'Find the rule from the numbers that agree.',
      'Check each number against the rule.',
      'The number that breaks the rule is the error.',
    ],
    art: {
      kind: 'pattern',
      terms: [5, 10, 15, 21, 25],
      rule: 'One number breaks the rule.',
    },
    artCaption: 'Check each step.',
    words: [
      { term: 'Error', meaning: 'A mistake.' },
      { term: 'Check', meaning: 'Make sure something is right.' },
      { term: 'Correct', meaning: 'Make a mistake right.' },
    ],
    examples: [
      {
        title: 'Find the error',
        situation: '5, 10, 15, 21, 25.',
        steps: ['The rule is add 5.', '15 + 5 = 20, not 21.'],
        answer: '21 should be 20.',
      },
    ],
    mistakes: [
      {
        wrong: 'Changing the rule to fit the error.',
        right: 'Use the rule most numbers follow.',
      },
    ],
    realLife: [
      'Checking prices on a bill.',
      'Spotting mistakes in scores.',
      'Checking homework.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write a pattern with one mistake in it.',
        'Swap with a friend.',
        'Find and correct each other’s mistakes.',
      ],
    },
  },
  'mathematics-23': {
    indicator: {
      code: 'B4.2.1.2.1',
      text: 'Create concrete representations of patterns in a table, and tables from concrete patterns.',
    },
    hook: 'You build triangles with sticks. 1 triangle needs 3 sticks. How many sticks for 4 triangles?',
    explain: [
      'Build a pattern with objects, step by step.',
      'Count what you used at each step and record it in a table.',
      'The table helps you predict the next steps.',
    ],
    art: {
      kind: 'pattern',
      terms: [3, 6, 9, 12],
      rule: 'Sticks for 1, 2, 3 and 4 separate triangles',
    },
    artCaption: 'Each triangle adds 3 sticks.',
    words: [
      { term: 'Concrete', meaning: 'Made with real objects.' },
      { term: 'Predict', meaning: 'Say what will come next.' },
      { term: 'Step', meaning: 'One stage of a pattern.' },
    ],
    examples: [
      {
        title: 'Triangles',
        situation:
          'Separate triangles: 1 needs 3 sticks, 2 need 6, 3 need 9. How many for 5?',
        steps: ['Each triangle adds 3.', '5 × 3 = 15.'],
        answer: '15 sticks.',
      },
    ],
    mistakes: [
      {
        wrong: 'Guessing the next step without a table.',
        right: 'Record each step in a table first.',
      },
    ],
    realLife: ['Building fences.', 'Laying tiles.', 'Stacking chairs.'],
    tryIt: {
      need: 'Sticks or matchsticks',
      steps: [
        'Make squares in a row, each separate.',
        'Record sticks used in a table.',
        'Predict sticks for 10 squares.',
      ],
    },
  },
  'mathematics-24': {
    indicator: {
      code: 'B4.2.1.3.1',
      text: 'Translate a problem into a table, and use patterns in the table to solve it.',
    },
    hook: 'Kofi saves 5 cedis every week. How long until he has 40 cedis?',
    explain: [
      'Put the information from a story into a table.',
      'Look for the pattern.',
      'Extend the table until you find the answer.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Wk 1', 5],
        ['Wk 2', 10],
        ['Wk 3', 15],
        ['Wk 4', 20],
      ],
      label: 'Kofi’s savings each week',
    },
    artCaption: 'His savings grow by 5 cedis each week.',
    words: [
      { term: 'Translate', meaning: 'Change from words into numbers.' },
      { term: 'Extend', meaning: 'Continue further.' },
      { term: 'Savings', meaning: 'Money kept for later.' },
    ],
    examples: [
      {
        title: 'Kofi’s savings',
        situation: 'Kofi saves 5 cedis a week. When will he have 40 cedis?',
        steps: [
          'Week 1: 5. Week 2: 10. Week 3: 15.',
          'Keep adding 5: 20, 25, 30, 35, 40.',
          '40 ÷ 5 = 8.',
        ],
        answer: 'After 8 weeks.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stopping the table too early.',
        right: 'Continue until you reach the answer you need.',
      },
    ],
    realLife: [
      'Saving money.',
      'Planting rows of crops.',
      'Planning a journey.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'A plant grows 2 cm a week. Make a table for 6 weeks.',
        'When will it be 12 cm tall?',
        'Explain how the table helped.',
      ],
    },
  },
  'mathematics-25': {
    indicator: {
      code: 'B4.2.2.1.1',
      text: 'Write a problem as an equation using a symbol for an unknown, and express pictures as equations.',
    },
    hook: 'Esi has some mangoes. She picks 7 more and now has 15. How many did she have? Let us write it as an equation.',
    explain: [
      'An equation says two things are equal.',
      'We use a box or a letter for the unknown number.',
      'Esi’s story becomes ☐ + 7 = 15.',
    ],
    art: { kind: 'balance', left: '☐ + 7', right: '15', equal: true },
    artCaption: 'Both sides balance.',
    words: [
      { term: 'Equation', meaning: 'A number sentence with an equals sign.' },
      { term: 'Unknown', meaning: 'A number we do not know yet.' },
      {
        term: 'Symbol',
        meaning: 'A sign, such as ☐, that stands for something.',
      },
    ],
    examples: [
      {
        title: 'Write and solve',
        situation:
          'Esi has some mangoes. She picks 7 more and has 15. How many did she start with?',
        steps: ['Write ☐ + 7 = 15.', '15 − 7 = 8.'],
        answer: '☐ = 8 mangoes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Putting the numbers in the wrong places.',
        right: 'Follow the order of the story.',
      },
    ],
    realLife: [
      'Working out missing amounts.',
      'Planning purchases.',
      'Solving puzzles.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a story with a missing number.',
        'Write it as an equation.',
        'Solve it.',
      ],
    },
  },
  'mathematics-26': {
    indicator: {
      code: 'B4.2.2.2.1',
      text: 'Solve one-step equations using manipulatives, and describe the meaning of an unknown.',
    },
    hook: 'A bag holds some stones. With 4 more stones there are 10 in all. How many are in the bag?',
    explain: [
      'Use objects to model the equation.',
      'Take away the same amount from both sides to keep it balanced.',
      'What is left tells you the unknown.',
    ],
    art: { kind: 'balance', left: 'n + 4', right: '10', equal: true },
    artCaption: 'Take 4 from both sides.',
    words: [
      { term: 'One-step equation', meaning: 'An equation solved in one step.' },
      { term: 'Manipulatives', meaning: 'Objects used to model maths.' },
      {
        term: 'Variable',
        meaning: 'A letter that stands for an unknown number.',
      },
    ],
    examples: [
      {
        title: 'Solve with objects',
        situation: 'n + 4 = 10. Find n.',
        steps: ['Take 4 stones from each side.', '10 − 4 = 6.'],
        answer: 'n = 6.',
      },
    ],
    mistakes: [
      {
        wrong: 'Taking away from one side only.',
        right: 'Do the same to both sides.',
      },
    ],
    realLife: [
      'Finding missing amounts.',
      'Balancing loads.',
      'Puzzles and riddles.',
    ],
    tryIt: {
      need: 'Stones and a bag',
      steps: [
        'Hide some stones in a bag.',
        'Add 3 more stones beside it and tell a friend the total.',
        'Ask your friend to work out what is in the bag.',
      ],
    },
  },
  'mathematics-27': {
    indicator: {
      code: 'B4.2.2.2.3',
      text: 'Solve equations with the unknown on either side, and use guess and check.',
    },
    hook: '20 = ☐ + 12. The box is on the right this time. Does that change anything?',
    explain: [
      'An equation balances, so the unknown can be on either side.',
      '20 = ☐ + 12 means the same as ☐ + 12 = 20.',
      'Guess and check: try a number, check it, and adjust.',
    ],
    art: { kind: 'balance', left: '20', right: '☐ + 12', equal: true },
    artCaption: 'Either side can hold the unknown.',
    words: [
      {
        term: 'Guess and check',
        meaning: 'Try an answer, then check and improve it.',
      },
      { term: 'Balance', meaning: 'Both sides are equal.' },
      { term: 'Adjust', meaning: 'Change a little.' },
    ],
    examples: [
      {
        title: 'Guess and check',
        situation: 'Solve 20 = ☐ + 12.',
        steps: [
          'Try 6: 6 + 12 = 18. Too small.',
          'Try 8: 8 + 12 = 20. Correct!',
        ],
        answer: '☐ = 8.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the answer must be on the right of =.',
        right: 'The = sign just means both sides match.',
      },
    ],
    realLife: ['Working out prices.', 'Sharing amounts.', 'Puzzles.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Solve 30 = ☐ + 18 by guess and check.',
        'Solve ☐ − 5 = 11.',
        'Write how many guesses you needed.',
      ],
    },
  },
  'mathematics-28': {
    indicator: {
      code: 'B4.2.2.2.5',
      text: 'Identify the unknown in a problem, represent it with an equation, and solve part-part-whole problems.',
    },
    hook: 'A class has 35 pupils. 19 are girls. How many are boys? It is a part-part-whole problem!',
    explain: [
      'Part + part = whole.',
      'If you know the whole and one part, subtract to find the other part.',
      'Write it as an equation first: 19 + ☐ = 35.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Girls', 19],
        ['Boys', 16],
        ['Whole class', 35],
      ],
      label: '19 + 16 = 35',
    },
    artCaption: 'Two parts make the whole.',
    words: [
      { term: 'Part', meaning: 'A piece of the whole.' },
      { term: 'Whole', meaning: 'All the parts together.' },
      { term: 'Represent', meaning: 'Show in another way.' },
    ],
    examples: [
      {
        title: 'The class',
        situation: '35 pupils, 19 girls. How many boys?',
        steps: ['19 + ☐ = 35.', '35 − 19 = 16.'],
        answer: '16 boys.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding the whole and a part.',
        right: 'Subtract the known part from the whole.',
      },
    ],
    realLife: [
      'Boys and girls in a class.',
      'Money spent and saved.',
      'Pages read and left.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a part-part-whole story.',
        'Write the equation.',
        'Solve it and check.',
      ],
    },
  },
  'mathematics-29': {
    indicator: {
      code: 'B4.2.2.2.7',
      text: 'Create a problem for a given equation with one unknown.',
    },
    hook: 'Here is an equation: ☐ × 4 = 24. Can you make up a story that matches it?',
    explain: [
      'Every equation can tell a story.',
      'Decide what the numbers stand for, such as legs, cedis or sweets.',
      'Make sure the story matches the operation.',
    ],
    art: { kind: 'groups', groups: 6, each: 4, label: '6 groups of 4 make 24' },
    artCaption: 'A story for ☐ × 4 = 24.',
    words: [
      { term: 'Create', meaning: 'Make something new.' },
      { term: 'Match', meaning: 'Go together correctly.' },
      { term: 'Story problem', meaning: 'A maths question told as a story.' },
    ],
    examples: [
      {
        title: 'Make a story',
        situation: 'Write a story for ☐ × 4 = 24.',
        steps: [
          'Each goat has 4 legs.',
          'There are 24 legs in all.',
          'How many goats?',
        ],
        answer: '6 goats, because 6 × 4 = 24.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing an adding story for a multiplying equation.',
        right: 'Multiplying stories use equal groups.',
      },
    ],
    realLife: [
      'Making up puzzles for friends.',
      'Explaining maths to others.',
      'Planning shopping.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write an equation with one unknown.',
        'Your friend writes a matching story.',
        'Swap roles.',
      ],
    },
  },
  'mathematics-30': {
    indicator: {
      code: 'B4.3.1.1.1',
      text: 'Complete drawings to make them symmetrical, and identify lines of symmetry.',
    },
    hook: 'Fold a butterfly picture down the middle. Do both sides match?',
    explain: [
      'A shape is symmetrical if one half is the mirror image of the other.',
      'The fold line is called a line of symmetry.',
      'Some shapes have many lines of symmetry. A square has 4.',
    ],
    art: { kind: 'symmetry', shape: 'butterfly' },
    artCaption: 'Both halves match.',
    words: [
      { term: 'Symmetry', meaning: 'When both halves match exactly.' },
      {
        term: 'Line of symmetry',
        meaning: 'The fold line where halves match.',
      },
      { term: 'Mirror image', meaning: 'A reflection, as in a mirror.' },
    ],
    examples: [
      {
        title: 'Count the lines',
        situation: 'How many lines of symmetry does a rectangle have?',
        steps: [
          'Fold it top to bottom: it matches.',
          'Fold it side to side: it matches.',
          'Fold it corner to corner: it does not match.',
        ],
        answer: '2 lines of symmetry.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a rectangle’s diagonal is a line of symmetry.',
        right: 'Fold to check: the halves do not match.',
      },
    ],
    realLife: [
      'Butterflies and leaves.',
      'Kente and other cloth patterns.',
      'Buildings and logos.',
    ],
    tryIt: {
      need: 'Paper and scissors, with an adult',
      steps: [
        'Fold a paper in half.',
        'Cut a shape along the fold.',
        'Open it and find the line of symmetry.',
      ],
    },
  },
  'mathematics-31': {
    indicator: {
      code: 'B4.3.2.1.1',
      text: 'Tell the position and motion of objects using the cardinal points north, south, east and west.',
    },
    hook: 'The sun rises in the east and sets in the west. Can you find north from where you stand?',
    explain: [
      'The four cardinal points are north, south, east and west.',
      'If you face north, east is on your right and west is on your left.',
      'We use these directions to describe where things are and how to move.',
    ],
    art: { kind: 'compass', label: 'North, east, south and west' },
    artCaption: 'A compass shows the four cardinal points.',
    words: [
      { term: 'Cardinal points', meaning: 'North, south, east and west.' },
      { term: 'Compass', meaning: 'A tool that shows directions.' },
      { term: 'Direction', meaning: 'The way to go.' },
    ],
    examples: [
      {
        title: 'Find the way',
        situation:
          'You face north and turn to your right. Which way do you face?',
        steps: ['East is on the right when facing north.'],
        answer: 'East.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up east and west.',
        right: 'Remember: the sun rises in the east.',
      },
    ],
    realLife: [
      'Giving directions.',
      'Reading maps.',
      'Finding your way in a new town.',
    ],
    tryIt: {
      need: 'The morning sun',
      steps: [
        'Face the rising sun: that is east.',
        'Point to west, north and south.',
        'Describe where your school gate is.',
      ],
    },
  },
  'mathematics-32': {
    indicator: {
      code: 'B4.3.3.1.1',
      text: 'Estimate perimeter using referents, and measure and record perimeter in cm and m.',
    },
    hook: 'How far is it all the way around your classroom? Estimate, then measure!',
    explain: [
      'Perimeter is the distance all the way around a shape.',
      'Estimate using things you know, like a 1 m stride.',
      'Measure each side and add the lengths.',
    ],
    art: {
      kind: 'area',
      rows: 2,
      cols: 4,
      label: 'Perimeter: 4 + 2 + 4 + 2 = 12 units',
    },
    artCaption: 'Add every side to find the perimeter.',
    words: [
      { term: 'Perimeter', meaning: 'The distance around a shape.' },
      { term: 'Referent', meaning: 'Something used to estimate a length.' },
      { term: 'Record', meaning: 'Write down.' },
    ],
    examples: [
      {
        title: 'Measure the book',
        situation:
          'A book is 25 cm long and 18 cm wide. What is its perimeter?',
        steps: ['25 + 18 + 25 + 18 = 86.'],
        answer: '86 cm.',
      },
      {
        title: 'An irregular shape',
        situation:
          'A field has sides of 30 m, 25 m, 40 m and 20 m. Find its perimeter.',
        steps: ['30 + 25 + 40 + 20 = 115.'],
        answer: '115 m.',
      },
    ],
    mistakes: [{ wrong: 'Leaving out a side.', right: 'Count every side.' }],
    realLife: ['Fencing land.', 'Framing a picture.', 'Running round a field.'],
    tryIt: {
      need: 'A tape measure',
      steps: [
        'Estimate the perimeter of your desk.',
        'Measure each side.',
        'Compare your estimate with the real answer.',
      ],
    },
  },
  'mathematics-33': {
    indicator: {
      code: 'B4.3.3.1.3',
      text: 'Develop and apply a formula for the perimeter of squares and rectangles, and construct rectangles with the same perimeter.',
    },
    hook: 'Do you have to add all four sides every time? A rule can make it faster!',
    explain: [
      'A rectangle has two lengths and two widths. Perimeter = 2 × length + 2 × width.',
      'A square has four equal sides. Perimeter = 4 × side.',
      'Different rectangles can have the same perimeter.',
    ],
    art: {
      kind: 'area',
      rows: 3,
      cols: 5,
      label: 'A 5 by 3 rectangle: perimeter 16 units',
    },
    artCaption: '5 + 3 + 5 + 3 = 16.',
    words: [
      { term: 'Formula', meaning: 'A rule for working something out.' },
      { term: 'Length', meaning: 'The longer side.' },
      { term: 'Width', meaning: 'The shorter side.' },
    ],
    examples: [
      {
        title: 'Use the formula',
        situation: 'A rectangle is 7 m long and 4 m wide. Find the perimeter.',
        steps: ['2 × 7 = 14.', '2 × 4 = 8.', '14 + 8 = 22.'],
        answer: '22 m.',
      },
      {
        title: 'Same perimeter',
        situation: 'Find two rectangles with a perimeter of 12 cm.',
        steps: ['5 by 1: 5 + 1 + 5 + 1 = 12.', '4 by 2: 4 + 2 + 4 + 2 = 12.'],
        answer: '5 cm by 1 cm, and 4 cm by 2 cm.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding only one length and one width.',
        right: 'There are two of each.',
      },
    ],
    realLife: [
      'Fencing a garden.',
      'Borders on notice boards.',
      'Lining a football pitch.',
    ],
    tryIt: {
      need: 'Squared paper',
      steps: [
        'Draw three rectangles with a perimeter of 20 squares.',
        'Check each with the formula.',
        'Which looks most like a square?',
      ],
    },
  },
  'mathematics-34': {
    indicator: {
      code: 'B4.3.3.2.1',
      text: 'Recognise that area is measured in square units, and choose suitable units (cm² or m²).',
    },
    hook: 'How much paper covers your exercise book? Count the squares!',
    explain: [
      'Area is the amount of surface a shape covers.',
      'We measure area in square units: square centimetres (cm²) or square metres (m²).',
      'Use cm² for small things like a book, and m² for big things like a floor.',
    ],
    art: { kind: 'area', rows: 4, cols: 6, label: '24 square units' },
    artCaption: 'Count the squares to find the area.',
    words: [
      { term: 'Area', meaning: 'The surface a shape covers.' },
      {
        term: 'Square centimetre (cm²)',
        meaning: 'A square 1 cm on each side.',
      },
      { term: 'Square metre (m²)', meaning: 'A square 1 m on each side.' },
    ],
    examples: [
      {
        title: 'Count the squares',
        situation: 'A shape covers 4 rows of 6 squares. What is its area?',
        steps: ['4 × 6 = 24.'],
        answer: '24 square units.',
      },
      {
        title: 'Choose a unit',
        situation: 'Would you measure a classroom floor in cm² or m²?',
        steps: ['A floor is large.'],
        answer: 'Square metres (m²).',
      },
    ],
    mistakes: [
      {
        wrong: 'Confusing area with perimeter.',
        right: 'Area covers the inside. Perimeter goes around the edge.',
      },
    ],
    realLife: ['Tiling a floor.', 'Painting a wall.', 'Buying land.'],
    tryIt: {
      need: 'Squared paper',
      steps: [
        'Cut out 1 cm squares.',
        'Cover a small card with them.',
        'Count the squares to find its area.',
      ],
    },
  },
  'mathematics-35': {
    indicator: {
      code: 'B4.3.3.2.3',
      text: 'Estimate area using referents, and develop and apply a formula for the area of rectangles.',
    },
    hook: 'Counting every square takes a long time. Is there a faster way to find area?',
    explain: [
      'Estimate area using a known square, such as a 1 m² sheet of newspaper.',
      'For a rectangle, area = length × width.',
      'A rectangle 5 cm by 3 cm has area 5 × 3 = 15 cm².',
    ],
    art: { kind: 'area', rows: 3, cols: 5, label: '5 × 3 = 15 square units' },
    artCaption: 'Length times width.',
    words: [
      { term: 'Formula', meaning: 'A rule for working something out.' },
      { term: 'Estimate', meaning: 'A close guess.' },
      {
        term: 'Length × width',
        meaning: 'The rule for the area of a rectangle.',
      },
    ],
    examples: [
      {
        title: 'Use the formula',
        situation: 'A room is 6 m long and 4 m wide. What is its area?',
        steps: ['6 × 4 = 24.'],
        answer: '24 m².',
      },
    ],
    mistakes: [
      { wrong: 'Adding length and width for area.', right: 'Multiply them.' },
    ],
    realLife: [
      'Buying floor tiles.',
      'Measuring a farm plot.',
      'Covering a book.',
    ],
    tryIt: {
      need: 'A ruler',
      steps: [
        'Measure your book’s length and width.',
        'Work out its area.',
        'Check by counting squares on squared paper.',
      ],
    },
  },
  'mathematics-36': {
    indicator: {
      code: 'B4.3.3.2.5',
      text: 'Construct different rectangles for a given area to show that many rectangles can have the same area.',
    },
    hook: 'You have 12 square tiles. How many different rectangles can you make?',
    explain: [
      'Different rectangles can have the same area.',
      'With 12 tiles: 1 by 12, 2 by 6 or 3 by 4.',
      'They cover the same amount, but their perimeters are different.',
    ],
    art: {
      kind: 'area',
      rows: 2,
      cols: 6,
      label: '2 × 6 = 12, and 3 × 4 = 12 too',
    },
    artCaption: 'Same area, different shape.',
    words: [
      { term: 'Same area', meaning: 'Covering the same amount of surface.' },
      { term: 'Arrangement', meaning: 'A way of placing things.' },
      { term: 'Dimensions', meaning: 'The length and width.' },
    ],
    examples: [
      {
        title: '12 tiles',
        situation: 'Find all the rectangles made from 12 square tiles.',
        steps: ['1 × 12 = 12.', '2 × 6 = 12.', '3 × 4 = 12.'],
        answer: 'Three rectangles: 1 by 12, 2 by 6 and 3 by 4.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the same area means the same perimeter.',
        right: 'Perimeters can differ even when areas match.',
      },
    ],
    realLife: ['Arranging tiles.', 'Planning gardens.', 'Arranging desks.'],
    tryIt: {
      need: 'Square tiles or squared paper',
      steps: [
        'Make every rectangle you can with 16 squares.',
        'Write each area and perimeter.',
        'Which has the smallest perimeter?',
      ],
    },
  },
  'mathematics-37': {
    indicator: {
      code: 'B4.3.3.3.1',
      text: 'Tell the time in hours and minutes on analogue and digital clocks, including the 24-hour clock.',
    },
    hook: 'A bus timetable says 14:30. What time is that on a normal clock?',
    explain: [
      'An analogue clock has hands. The short hand shows hours, and the long hand shows minutes.',
      'Quarter past is 15 minutes past. Half past is 30. Quarter to is 15 minutes before the hour.',
      'The 24-hour clock counts hours from 0 to 23. For afternoon times, take away 12: 14:30 is 2:30 p.m.',
    ],
    art: { kind: 'clock', hour: 2, minute: 30, label: 'Half past two: 14:30' },
    artCaption: '2:30 p.m. is 14:30 on a 24-hour clock.',
    words: [
      { term: 'Analogue clock', meaning: 'A clock with hands.' },
      { term: 'Digital clock', meaning: 'A clock showing numbers only.' },
      {
        term: '24-hour clock',
        meaning: 'A way of telling time from 00:00 to 23:59.',
      },
    ],
    examples: [
      {
        title: 'Change the time',
        situation: 'What is 17:45 on a 12-hour clock?',
        steps: ['17 − 12 = 5.', 'So it is 5:45 p.m.'],
        answer: 'Quarter to six in the evening.',
      },
      {
        title: 'How long?',
        situation:
          'A football match starts at 3:30 p.m. and ends at 5:00 p.m. How long is it?',
        steps: ['3:30 to 4:30 is 1 hour.', '4:30 to 5:00 is 30 minutes.'],
        answer: '1 hour 30 minutes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Reading the long hand as the hour.',
        right: 'The short hand shows the hour.',
      },
    ],
    realLife: [
      'Bus and flight times.',
      'Television schedules.',
      'School timetables.',
    ],
    tryIt: {
      need: 'A clock',
      steps: [
        'Write three times from your day in 24-hour form.',
        'Show one on a drawn analogue clock.',
        'Work out how long school lasts.',
      ],
    },
  },
  'mathematics-38': {
    indicator: {
      code: 'B4.3.3.3.3',
      text: 'State dates of events and record calendar dates in a variety of formats.',
    },
    hook: 'The same date can be written in many ways. 28/08/2018 and 28th August 2018 mean the same day!',
    explain: [
      'A date can be written in words, such as Tuesday, 28th August 2018.',
      'It can be written in short form, such as 28-Aug-18 or 28/08/2018.',
      'In Ghana, we usually write the day first, then the month, then the year.',
    ],
    art: {
      kind: 'calendar',
      month: 'August',
      days: 31,
      startsOn: 3,
      focus: 28,
    },
    artCaption: '28th August on a calendar.',
    words: [
      { term: 'Date', meaning: 'The day, month and year.' },
      { term: 'Format', meaning: 'The way something is written.' },
      {
        term: 'Abbreviation',
        meaning: 'A short form, such as Aug for August.',
      },
    ],
    examples: [
      {
        title: 'Write it another way',
        situation: 'Write 6th March 1957 in short form.',
        steps: [
          'The day is 06.',
          'March is the 3rd month: 03.',
          'The year is 1957.',
        ],
        answer: '06/03/1957.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing the month first by mistake.',
        right: 'In Ghana, write the day first.',
      },
    ],
    realLife: ['Dates on forms.', 'Expiry dates on food.', 'Dates on letters.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write your birthday in four different formats.',
        'Write today’s date in two formats.',
        'Find a date on a food packet.',
      ],
    },
  },
  'mathematics-39': {
    indicator: {
      code: 'B4.4.1.1.1',
      text: 'Use one-to-one and many-to-one correspondence to read and construct graphs.',
    },
    hook: 'If one picture stands for 2 pupils, how many pictures do you need for 10 pupils?',
    explain: [
      'In one-to-one graphs, one picture stands for one thing.',
      'In many-to-one graphs, one picture stands for several things.',
      'The key tells you how many each picture stands for.',
    ],
    art: {
      kind: 'picto',
      item: 'child',
      rows: [
        ['Malaria', 5],
        ['Cold', 3],
        ['Rash', 2],
      ],
    },
    artCaption: 'Key: each picture stands for 2 pupils.',
    words: [
      { term: 'One-to-one', meaning: 'One picture stands for one thing.' },
      {
        term: 'Many-to-one',
        meaning: 'One picture stands for several things.',
      },
      { term: 'Key', meaning: 'Tells what each picture stands for.' },
    ],
    examples: [
      {
        title: 'Read the key',
        situation:
          'Each picture stands for 2 pupils. Malaria has 5 pictures. How many pupils?',
        steps: ['5 × 2 = 10.'],
        answer: '10 pupils.',
      },
      {
        title: 'Make the graph',
        situation:
          '14 pupils had colds. How many pictures, if each stands for 2?',
        steps: ['14 ÷ 2 = 7.'],
        answer: '7 pictures.',
      },
    ],
    mistakes: [
      {
        wrong: 'Counting pictures and forgetting the key.',
        right: 'Multiply by what each picture stands for.',
      },
    ],
    realLife: ['Health records.', 'Charts in newspapers.', 'Sales charts.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Collect data from your class.',
        'Draw a pictograph where each picture is 2 pupils.',
        'Add a key and a title.',
      ],
    },
  },
  'mathematics-40': {
    indicator: {
      code: 'B4.4.1.1.3',
      text: 'Compare graphs of the same data, and find graphs in print and electronic media.',
    },
    hook: 'The same data can be shown as pictures or as bars. Which is easier to read?',
    explain: [
      'A pictograph uses pictures. A bar graph uses bars.',
      'Both can show the same data.',
      'Newspapers, television and websites use graphs to share information.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Malaria', 10],
        ['Cold', 6],
        ['Rash', 4],
      ],
      label: 'The same data as a bar graph',
    },
    artCaption: 'Bars make it easy to compare.',
    words: [
      { term: 'Bar graph', meaning: 'A graph that uses bars.' },
      { term: 'Data', meaning: 'Information collected.' },
      { term: 'Media', meaning: 'Newspapers, television and the internet.' },
    ],
    examples: [
      {
        title: 'Compare',
        situation: 'Which illness affected the most pupils?',
        steps: ['The tallest bar is malaria, with 10.'],
        answer: 'Malaria.',
      },
      {
        title: 'How many more?',
        situation: 'How many more pupils had malaria than a rash?',
        steps: ['10 − 4 = 6.'],
        answer: '6 more.',
      },
    ],
    mistakes: [
      {
        wrong: 'Reading the bar’s width instead of its height.',
        right: 'Read the height of each bar.',
      },
    ],
    realLife: ['Weather charts on TV.', 'Sales graphs.', 'School results.'],
    tryIt: {
      need: 'A newspaper or an adult’s phone',
      steps: [
        'Find a graph.',
        'Say what it shows.',
        'Draw the same data as a different kind of graph.',
      ],
    },
  },
  'mathematics-41': {
    indicator: {
      code: 'B4.4.1.2.1',
      text: 'Identify common features of graphs, and use them to create graphs and solve problems.',
    },
    hook: 'You want to know your class’s favourite sport. How can a graph help you decide?',
    explain: [
      'Good graphs have a title, labels and, for pictographs, a key.',
      'Collect your data, then choose a graph to show it.',
      'Use the graph to answer questions and make decisions.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Football', 14],
        ['Netball', 8],
        ['Athletics', 6],
      ],
      label: 'Our class’s favourite sports',
    },
    artCaption: 'A title and labels make a graph clear.',
    words: [
      { term: 'Title', meaning: 'Tells what the graph is about.' },
      { term: 'Label', meaning: 'Names a bar or an axis.' },
      { term: 'Interpret', meaning: 'Explain what something shows.' },
    ],
    examples: [
      {
        title: 'Decide',
        situation: 'The class can play one sport. Which should they choose?',
        steps: ['Football has the tallest bar: 14 votes.'],
        answer: 'Football is the most popular choice.',
      },
      {
        title: 'Total',
        situation: 'How many pupils voted?',
        steps: ['14 + 8 + 6 = 28.'],
        answer: '28 pupils.',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out the title or labels.',
        right: 'Every graph needs a title and labels.',
      },
    ],
    realLife: [
      'Choosing a class trip.',
      'Planning school events.',
      'Reports and presentations.',
    ],
    tryIt: {
      need: 'Paper and a ruler',
      steps: [
        'Ask your class a question with three choices.',
        'Draw a bar graph with a title and labels.',
        'Use it to make a decision.',
      ],
    },
  },
}
