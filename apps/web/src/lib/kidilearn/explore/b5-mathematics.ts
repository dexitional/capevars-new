import type { CourseGuides } from './types'

// Basic 5 Mathematics, written for this course and scoped to the NaCCA
// Mathematics Curriculum for Primary Schools, Basic 4–6 (2019). Notes:
// - The imported lessons carry no indicator codes; each guide names the
//   indicator its lesson teaches.
// - Numbers go to 1,000,000; Roman numerals to C; factors to 100; division
//   is by one-digit numbers; decimals go to thousandths.
// - Errors in the curriculum's examples are corrected here: counting on in
//   500s from 15,290 skips 16,790; 1 m³ is 100 cm × 100 cm × 100 cm, not
//   × 10 cm; and a 2 cm × 2 cm × 6 cm box holds 24 cubes, not 12.

export const guides: CourseGuides = {
  'mathematics-01': {
    indicator: {
      code: 'B5.1.1.1.1',
      text: 'Model number quantities up to 1,000,000 using graph sheets and multi-base blocks.',
    },
    hook: 'A football stadium in Ghana can hold about 40,000 fans. Could you picture one million people?',
    explain: [
      'Our number system has places for ones, tens, hundreds, thousands, ten thousands and hundred thousands.',
      'Each place is worth ten times the place on its right.',
      'Ten hundred thousands make one million, written 1,000,000.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['HTh', '3'],
        ['TTh', '4'],
        ['Th', '5'],
        ['H', '2'],
        ['T', '0'],
        ['O', '6'],
      ],
      label: '345,206',
    },
    artCaption: 'The 3 in 345,206 is worth 300,000.',
    words: [
      {
        term: 'Hundred thousands (HTh)',
        meaning: 'The place to the left of ten thousands.',
      },
      { term: 'One million', meaning: 'A thousand thousands: 1,000,000.' },
      { term: 'Value', meaning: 'What a digit is worth in its place.' },
    ],
    examples: [
      {
        title: 'Expand it',
        situation: 'Write 345,206 in expanded form.',
        steps: [
          '3 hundred thousands, 4 ten thousands and 5 thousands.',
          '2 hundreds, no tens and 6 ones.',
        ],
        answer: '345206 = 300000 + 40000 + 5000 + 200 + 6.',
      },
      {
        title: 'Build a million',
        situation: 'How many hundred thousands make one million?',
        steps: [
          'Count in hundred thousands: 100,000, 200,000, 300,000 and so on.',
          '10 × 100000 = 1000000.',
        ],
        answer: 'Ten hundred thousands.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the 4 in 345,206 is worth 4,000.',
        right: 'It is in the ten thousands place, so it is worth 40,000.',
      },
    ],
    realLife: [
      'Populations of towns and regions.',
      'Prices of land and houses.',
      'Distances in space.',
    ],
    tryIt: {
      need: 'Graph paper',
      steps: [
        'Count the small squares in one 10 by 10 block.',
        'Work out how many such blocks make 10,000 squares.',
        'Explain how many would make one million.',
      ],
    },
  },
  'mathematics-02': {
    indicator: {
      code: 'B5.1.1.1.2',
      text: 'Read and write numbers in figures and in words up to 1,000,000.',
    },
    hook: 'A cheque must show an amount in figures and in words. Why do you think banks ask for both?',
    explain: [
      'Read big numbers in groups of three digits, from the left.',
      'In 708,045 the first group is seven hundred and eight thousand, and the second is forty-five.',
      'So we read it as seven hundred and eight thousand and forty-five.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['HTh', '7'],
        ['TTh', '0'],
        ['Th', '8'],
        ['H', '0'],
        ['T', '4'],
        ['O', '5'],
      ],
      label: '708,045 in figures',
    },
    artCaption: 'Zeros hold the empty places.',
    words: [
      { term: 'Figures', meaning: 'Numbers written with digits.' },
      { term: 'Words', meaning: 'Numbers written as we say them.' },
      { term: 'Comma', meaning: 'Separates big numbers into groups of three.' },
    ],
    examples: [
      {
        title: 'Words to figures',
        situation:
          'Write two hundred and fifty thousand, three hundred in figures.',
        steps: [
          'Two hundred and fifty thousand is 250,000.',
          'Three hundred is 300.',
          'There are no tens or ones.',
        ],
        answer: '250,300.',
      },
      {
        title: 'Figures to words',
        situation: 'Write 91,016 in words.',
        steps: ['91 thousands: ninety-one thousand.', '016: sixteen.'],
        answer: 'Ninety-one thousand and sixteen.',
      },
    ],
    mistakes: [
      {
        wrong:
          'Writing two hundred and fifty thousand, three hundred as 250300000.',
        right: 'Each group has only three digits: 250,300.',
      },
    ],
    realLife: [
      'Writing cheques.',
      'Reading election results.',
      'Reading prices of cars and land.',
    ],
    tryIt: {
      need: 'A friend and paper',
      steps: [
        'Say a six-digit number aloud.',
        'Your friend writes it in figures.',
        'Swap, then check each other.',
      ],
    },
  },
  'mathematics-03': {
    indicator: {
      code: 'B5.1.1.1.3',
      text: 'Identify numbers in different positions around a given number in a number chart.',
    },
    hook: 'On a number chart, every number has neighbours. Can you find them without counting one by one?',
    explain: [
      'On a chart that counts in ones, the number on the right is 1 more, and the number below is 10 more.',
      'The number on the left is 1 less, and the number above is 10 less.',
      'On a chart that counts in thousands, the same moves add or take away 1,000 and 10,000.',
    ],
    art: { kind: 'chart', start: 451, focus: 476 },
    artCaption: 'The neighbours of 476 are 466, 486, 475 and 477.',
    words: [
      { term: 'Number chart', meaning: 'Numbers set out in rows and columns.' },
      { term: 'Row', meaning: 'A line going across.' },
      { term: 'Column', meaning: 'A line going down.' },
    ],
    examples: [
      {
        title: 'Find the neighbours',
        situation: 'On a chart counting in ones, what is just below 476?',
        steps: ['Below is 10 more.', '476 + 10 = 486.'],
        answer: '486.',
      },
      {
        title: 'A chart in thousands',
        situation:
          'A chart counts in thousands. What is to the right of 34,000, and what is below it?',
        steps: [
          'Right is 1,000 more: 35,000.',
          'Below is 10,000 more: 44,000.',
        ],
        answer: '35,000 and 44,000.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding 1 when moving down a row.',
        right: 'Moving down a row adds 10 on a chart of ones.',
      },
    ],
    realLife: [
      'Finding seats in a stadium.',
      'Finding houses on a street.',
      'Reading calendars.',
    ],
    tryIt: {
      need: 'A 1 to 100 chart',
      steps: [
        'Cover any number with a bottle top.',
        'Ask a friend to name its four neighbours.',
        'Lift the top to check.',
      ],
    },
  },
  'mathematics-04': {
    indicator: {
      code: 'B5.1.1.1.4',
      text: 'Compare and order whole numbers up to 100,000 and represent the comparison using the symbols <, > or =.',
    },
    hook: 'Three towns have 84,500, 84,050 and 48,500 people. Which is the biggest?',
    explain: [
      'Line the numbers up by place value.',
      'Compare from the biggest place. The first place where the digits differ decides.',
      'Use > for “greater than” and < for “less than”.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Town A', 84500],
        ['Town B', 84050],
        ['Town C', 48500],
      ],
      label: 'Populations of three towns',
    },
    artCaption: 'The tallest bar is the biggest number.',
    words: [
      { term: 'Greater than (>)', meaning: 'Bigger than.' },
      { term: 'Less than (<)', meaning: 'Smaller than.' },
      { term: 'Ascending', meaning: 'Smallest to biggest.' },
    ],
    examples: [
      {
        title: 'Compare',
        situation: 'Compare 84,500 and 84,050.',
        steps: [
          'Ten thousands: both 8. Thousands: both 4.',
          'Hundreds: 5 and 0.',
        ],
        answer: '84,500 > 84,050.',
      },
      {
        title: 'Order them',
        situation: 'Put 84,500, 84,050 and 48,500 in ascending order.',
        steps: [
          '48,500 has only 4 ten thousands, so it is smallest.',
          'Then 84,050, then 84,500.',
        ],
        answer: '48,500 < 84,050 < 84,500.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 84,050 is bigger because it has a 5 near the end.',
        right: 'Compare the biggest places first.',
      },
    ],
    realLife: [
      'Comparing populations.',
      'Comparing prices.',
      'Ranking scores.',
    ],
    tryIt: {
      need: 'Digit cards',
      steps: [
        'Make two five-digit numbers.',
        'Write them with <, > or =.',
        'Make the biggest and smallest numbers you can.',
      ],
    },
  },
  'mathematics-05': {
    indicator: {
      code: 'B5.1.1.1.5',
      text: 'Round whole numbers up to 100,000 to the nearest ten thousand, thousand, hundred and ten.',
    },
    hook: 'A news report says “about 130,000 people”. The exact count was 129,500. Is that fair?',
    explain: [
      'To round, look at the digit just to the right of the place you are rounding to.',
      'If it is 5 or more, round up. If it is less than 5, round down.',
      'Rounding to the nearest ten thousand: 129,500 becomes 130,000.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['HTh', '2'],
        ['TTh', '1'],
        ['Th', '4'],
        ['H', '7'],
        ['T', '6'],
        ['O', '5'],
      ],
      label: '214,765 rounds to 215,000',
    },
    artCaption: 'To the nearest thousand, look at the hundreds digit: 7.',
    words: [
      { term: 'Round off', meaning: 'Change to the nearest simpler number.' },
      { term: 'Round up', meaning: 'Go to the bigger nearby number.' },
      { term: 'Round down', meaning: 'Go to the smaller nearby number.' },
    ],
    examples: [
      {
        title: 'Round 214,765',
        situation: 'Round 214,765 to the nearest ten, hundred and thousand.',
        steps: [
          'Nearest ten: the ones digit is 5, so 214,770.',
          'Nearest hundred: the tens digit is 6, so 214,800.',
          'Nearest thousand: the hundreds digit is 7, so 215,000.',
        ],
        answer: '214,770, 214,800 and 215,000.',
      },
      {
        title: 'Estimate a sum',
        situation:
          'Estimate 19,100 + 31,800 by rounding to the nearest thousand.',
        steps: [
          '19,100 is about 19,000.',
          '31,800 is about 32,000.',
          '19000 + 32000 = 51000.',
        ],
        answer: 'About 51,000.',
      },
    ],
    mistakes: [
      {
        wrong: 'Rounding 214,765 to the nearest thousand as 214,000.',
        right:
          'The hundreds digit is 7, which is 5 or more, so round up to 215,000.',
      },
    ],
    realLife: ['News reports.', 'Estimating costs.', 'Talking about crowds.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a six-digit number.',
        'Round it to the nearest 10, 100, 1000 and 10,000.',
        'Explain each answer.',
      ],
    },
  },
  'mathematics-06': {
    indicator: {
      code: 'B5.1.1.1.6',
      text: 'Skip count forwards and backwards in 500s and 1000s up to and from 100,000.',
    },
    hook: 'A savings club adds 500 cedis each month. Can you count its savings in 500s?',
    explain: [
      'Skip counting means adding or taking away the same amount each time.',
      'In 500s, the hundreds digit changes by 5 each step.',
      'In 1000s, only the thousands digit changes, unless it passes 9.',
    ],
    art: {
      kind: 'pattern',
      terms: [2500, 3000, 3500, 4000, null],
      rule: 'Add 500 each time.',
    },
    artCaption: 'Counting on in 500s.',
    words: [
      { term: 'Skip count', meaning: 'Count by jumping the same amount.' },
      { term: 'Forwards', meaning: 'Getting bigger.' },
      { term: 'Backwards', meaning: 'Getting smaller.' },
    ],
    examples: [
      {
        title: 'Count on in 500s',
        situation: 'Count on four times in 500s from 15,290.',
        steps: [
          '15,290 + 500 = 15,790.',
          'Then 16,290, then 16,790, then 17,290.',
        ],
        answer: '15,790, 16,290, 16,790, 17,290.',
      },
      {
        title: 'Count back in 1000s',
        situation: 'Count back three times in 1000s from 36,285.',
        steps: ['Take 1,000 away each time.'],
        answer: '35,285, 34,285, 33,285.',
      },
    ],
    mistakes: [
      {
        wrong:
          'Skipping a step, such as going from 16,290 to 17,290 when counting in 500s.',
        right: 'Add exactly 500 each time: 16,290, then 16,790.',
      },
    ],
    realLife: [
      'Counting savings.',
      'Counting stock in hundreds.',
      'Distances on a long trip.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Say a five-digit number.',
        'Your friend counts on five times in 500s.',
        'Swap and count back in 1000s.',
      ],
    },
  },
  'mathematics-07': {
    indicator: {
      code: 'B5.1.1.2.1',
      text: 'Recognise the Roman numeral system up to C (100).',
    },
    hook: 'Some old buildings show dates in letters, not digits. What could L and C mean?',
    explain: [
      'Roman numerals use five letters up to 100: I is 1, V is 5, X is 10, L is 50 and C is 100.',
      'A smaller letter after a bigger one is added: LX is 50 + 10 = 60.',
      'A smaller letter before a bigger one is subtracted: XL is 50 − 10 = 40.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['I', '1'],
        ['V', '5'],
        ['X', '10'],
        ['L', '50'],
        ['C', '100'],
      ],
      label: 'The Roman symbols up to C',
    },
    artCaption: 'Every Roman numeral up to 100 is made from these.',
    words: [
      { term: 'L', meaning: 'Fifty.' },
      { term: 'C', meaning: 'One hundred.' },
      {
        term: 'Symbol',
        meaning: 'A letter or sign that stands for something.',
      },
    ],
    examples: [
      {
        title: 'Read it',
        situation: 'What is LVI?',
        steps: ['L is 50, V is 5 and I is 1.', '50 + 5 + 1 = 56.'],
        answer: '56.',
      },
      {
        title: 'Read another',
        situation: 'What is XL?',
        steps: ['X comes before L, so subtract.', '50 − 10 = 40.'],
        answer: '40.',
      },
    ],
    mistakes: [
      {
        wrong: 'Reading XL as 60.',
        right: 'X before L means 50 − 10 = 40. LX is 60.',
      },
    ],
    realLife: ['Clock faces.', 'Chapters in books.', 'Dates on old buildings.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the multiples of ten from X to C in Roman numerals.',
        'Circle the ones that use subtraction.',
        'Read them to a friend.',
      ],
    },
  },
  'mathematics-08': {
    indicator: {
      code: 'B5.1.1.2.2',
      text: 'Count and convert Hindu-Arabic numbers to Roman numerals up to 100 (C) and back.',
    },
    hook: 'How would you write 94 in Roman numerals? It takes some careful thinking!',
    explain: [
      'Split the number into tens and ones.',
      'Write the tens, then the ones, in Roman numerals.',
      'Remember the subtraction pairs: IV is 4, IX is 9, XL is 40 and XC is 90.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['XC', '90'],
        ['IV', '4'],
      ],
      label: 'XCIV is 90 + 4 = 94',
    },
    artCaption: 'Tens first, then ones.',
    words: [
      { term: 'Convert', meaning: 'Change from one form to another.' },
      {
        term: 'Hindu-Arabic numerals',
        meaning: 'The digits 0 to 9 that we usually use.',
      },
      {
        term: 'Subtraction pair',
        meaning: 'A smaller letter before a bigger one, such as IX.',
      },
    ],
    examples: [
      {
        title: 'To Roman',
        situation: 'Write 68 in Roman numerals.',
        steps: ['60 is LX.', '8 is VIII.'],
        answer: 'LXVIII.',
      },
      {
        title: 'From Roman',
        situation: 'What is XCIV?',
        steps: ['XC is 100 − 10 = 90.', 'IV is 5 − 1 = 4.', '90 + 4 = 94.'],
        answer: '94.',
      },
    ],
    mistakes: [{ wrong: 'Writing 90 as LXXXX.', right: 'Write 90 as XC.' }],
    realLife: [
      'Reading clocks.',
      'Numbering parts of a document.',
      'Names such as Pope John Paul II.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write your age and your house number in Roman numerals.',
        'Write five Roman numerals for a friend.',
        'Your friend converts them back.',
      ],
    },
  },
  'mathematics-09': {
    indicator: {
      code: 'B5.1.1.3.1',
      text: 'Identify the factors of whole numbers from 1 to 100.',
    },
    hook: 'A teacher wants to arrange 24 desks in equal rows. How many ways can she do it?',
    explain: [
      'A factor divides a number exactly.',
      'Factors come in pairs: 4 × 6 = 24, so 4 and 6 are both factors of 24.',
      'Search from 1 upwards until the pairs start to repeat.',
    ],
    art: { kind: 'grid', rows: 4, cols: 6, label: '4 × 6 = 24' },
    artCaption: 'One array shows a pair of factors.',
    words: [
      { term: 'Factor', meaning: 'A number that divides another exactly.' },
      {
        term: 'Factor pair',
        meaning: 'Two factors that multiply to make the number.',
      },
      { term: 'Array', meaning: 'Objects in equal rows.' },
    ],
    examples: [
      {
        title: 'Factors of 24',
        situation: 'List all the factors of 24.',
        steps: [
          '1 × 24 = 24 and 2 × 12 = 24.',
          '3 × 8 = 24 and 4 × 6 = 24.',
          'After 4 and 6, the pairs repeat.',
        ],
        answer: '1, 2, 3, 4, 6, 8, 12 and 24.',
      },
      {
        title: 'Factors of 36',
        situation: 'List all the factors of 36.',
        steps: ['1 × 36, 2 × 18, 3 × 12, 4 × 9 and 6 × 6.'],
        answer: '1, 2, 3, 4, 6, 9, 12, 18 and 36.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stopping before finding every pair.',
        right: 'Check each number in order until the pairs repeat.',
      },
    ],
    realLife: [
      'Arranging desks and chairs.',
      'Packing goods in boxes.',
      'Sharing equally.',
    ],
    tryIt: {
      need: '36 bottle tops',
      steps: [
        'Make every rectangle array you can.',
        'Write each as a factor pair.',
        'List all the factors of 36.',
      ],
    },
  },
  'mathematics-10': {
    indicator: {
      code: 'B5.1.1.3.2',
      text: 'Generate and identify prime and composite numbers between 1 and 100.',
    },
    hook: 'Some numbers can only be arranged in a single row. They are called prime numbers.',
    explain: [
      'A prime number has exactly two factors: 1 and itself.',
      'A composite number has more than two factors.',
      'The number 1 has only one factor, so it is neither prime nor composite.',
    ],
    art: {
      kind: 'chart',
      start: 1,
      marked: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
    },
    artCaption: 'The prime numbers up to 50 are shaded.',
    words: [
      { term: 'Prime number', meaning: 'A number with exactly two factors.' },
      {
        term: 'Composite number',
        meaning: 'A number with more than two factors.',
      },
      {
        term: 'Sieve',
        meaning: 'A way of crossing out numbers to find primes.',
      },
    ],
    examples: [
      {
        title: 'Prime or composite?',
        situation: 'Is 21 prime or composite?',
        steps: ['21 = 3 × 7.', 'So 21 has the factors 1, 3, 7 and 21.'],
        answer: 'Composite.',
      },
      {
        title: 'Another',
        situation: 'Is 29 prime?',
        steps: ['Try 2, 3 and 5. None divides 29 exactly.'],
        answer: 'Yes, 29 is prime.',
      },
    ],
    mistakes: [
      {
        wrong: 'Calling 1 a prime number.',
        right: '1 has only one factor, so it is not prime.',
      },
    ],
    realLife: [
      'Codes that keep bank cards safe use prime numbers.',
      'Arranging items that will not split evenly.',
      'Number puzzles.',
    ],
    tryIt: {
      need: 'A 1 to 100 chart',
      steps: [
        'Cross out 1.',
        'Circle 2, then cross out every other multiple of 2. Do the same for 3, 5 and 7.',
        'The numbers left are prime.',
      ],
    },
  },
  'mathematics-11': {
    indicator: {
      code: 'B5.1.1.3.3',
      text: 'Identify even and odd numbers between 1 and 100 as numbers that can or cannot be arranged in twos.',
    },
    hook: 'At break, the class lines up in pairs. Will everyone have a partner today?',
    explain: [
      'An even number of objects can be put into pairs with none left over.',
      'An odd number always has one left over.',
      'Even numbers end in 0, 2, 4, 6 or 8. Odd numbers end in 1, 3, 5, 7 or 9.',
    ],
    art: {
      kind: 'grid',
      rows: 2,
      cols: 7,
      label: '14 makes 7 pairs, so it is even',
    },
    artCaption: 'Every object has a partner.',
    words: [
      { term: 'Even', meaning: 'Can be put into pairs with none left.' },
      { term: 'Odd', meaning: 'Has one left over after pairing.' },
      { term: 'Pair', meaning: 'A group of two.' },
    ],
    examples: [
      {
        title: 'Check 37',
        situation: 'Is 37 even or odd?',
        steps: ['It ends in 7.', '18 pairs make 36, and 1 is left.'],
        answer: 'Odd.',
      },
      {
        title: 'Add them',
        situation:
          'Is an odd number plus an odd number even or odd? Try 7 + 5.',
        steps: ['7 + 5 = 12.', 'The two leftover ones make a pair.'],
        answer: 'Even.',
      },
    ],
    mistakes: [
      {
        wrong: 'Looking at the first digit to decide.',
        right: 'Look at the last digit.',
      },
    ],
    realLife: [
      'Lining up in pairs.',
      'House numbers: odd on one side, even on the other.',
      'Sharing between two people.',
    ],
    tryIt: {
      need: 'Bottle tops',
      steps: [
        'Take a handful and arrange them in pairs.',
        'Say whether the number is even or odd.',
        'Repeat five times.',
      ],
    },
  },
  'mathematics-12': {
    indicator: {
      code: 'B5.1.1.3.4',
      text: 'Determine the highest common factor (HCF) of two or three numbers by prime factorisation.',
    },
    hook: 'You have 36 oranges and 48 mangoes. What is the biggest number of equal bags you can pack, with no fruit left over?',
    explain: [
      'A factor tree breaks a number into prime factors.',
      'Write each number as a product of primes.',
      'Multiply the primes they share to get the HCF.',
    ],
    art: { kind: 'factorTree', n: 36 },
    artCaption: 'Keep splitting until every branch is prime.',
    words: [
      { term: 'Prime factor', meaning: 'A factor that is a prime number.' },
      {
        term: 'Factor tree',
        meaning: 'A diagram that splits a number into prime factors.',
      },
      {
        term: 'HCF',
        meaning: 'Highest common factor: the biggest factor numbers share.',
      },
    ],
    examples: [
      {
        title: 'Oranges and mangoes',
        situation: 'Find the HCF of 36 and 48.',
        steps: [
          '36 = 2 × 2 × 3 × 3.',
          '48 = 2 × 2 × 2 × 2 × 3.',
          'Both share 2, 2 and 3: 2 × 2 × 3 = 12.',
        ],
        answer: 'The HCF is 12, so 12 bags.',
        art: { kind: 'factorTree', n: 48 },
      },
      {
        title: 'Three numbers',
        situation: 'Find the HCF of 12, 20 and 30.',
        steps: [
          '12 = 2 × 2 × 3.',
          '20 = 2 × 2 × 5.',
          '30 = 2 × 3 × 5. Only 2 is in all three.',
        ],
        answer: 'The HCF is 2.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stopping a factor tree at a number like 9.',
        right: 'Keep going: 9 = 3 × 3.',
      },
    ],
    realLife: [
      'Packing fruit into equal bags.',
      'Cutting cloth into equal strips.',
      'Grouping pupils into equal teams.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw factor trees for 24 and 60.',
        'Underline the primes they share.',
        'Find their HCF.',
      ],
    },
  },
  'mathematics-13': {
    indicator: {
      code: 'B5.1.1.3.5',
      text: 'Recognise the relationship between factors and multiples of whole numbers from 1 to 100.',
    },
    hook: 'Some numbers are called perfect. 6 is one of them. What could make a number perfect?',
    explain: [
      'If 4 × 6 = 24, then 4 and 6 are factors of 24, and 24 is a multiple of both.',
      'Divisibility tests help: a number is a multiple of 4 if its last two digits are.',
      'A perfect number equals the sum of its factors, apart from itself.',
    ],
    art: {
      kind: 'pattern',
      terms: [6, 12, 18, 24, 30, 36],
      rule: 'Multiples of 6',
    },
    artCaption: 'Every multiple of 6 has 6 as a factor.',
    words: [
      { term: 'Multiple', meaning: 'A number in a times table.' },
      {
        term: 'Divisibility test',
        meaning: 'A quick check for whether a number divides exactly.',
      },
      {
        term: 'Perfect number',
        meaning: 'A number equal to the sum of its smaller factors.',
      },
    ],
    examples: [
      {
        title: 'Is it perfect?',
        situation: 'Check whether 28 is a perfect number.',
        steps: [
          'The factors of 28 are 1, 2, 4, 7, 14 and 28.',
          'Leave out 28: 1 + 2 + 4 + 7 + 14 = 28.',
        ],
        answer: 'Yes, 28 is perfect.',
      },
      {
        title: 'Test for 4',
        situation: 'Is 316 a multiple of 4?',
        steps: ['The last two digits are 16.', '16 ÷ 4 = 4.'],
        answer: 'Yes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying 24 is a factor of 6.',
        right: '6 is a factor of 24, and 24 is a multiple of 6.',
      },
    ],
    realLife: [
      'Checking if items share equally.',
      'Timetables that repeat.',
      'Number puzzles.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'List the multiples of 4 and of 6 up to 60.',
        'Circle the ones they share.',
        'Is 12 a factor or a multiple of 4?',
      ],
    },
  },
  'mathematics-14': {
    indicator: {
      code: 'B5.1.2.1.1',
      text: 'Apply mental strategies, such as skip counting from a known fact, doubling, halving and patterns in the 9s, for multiplication facts to 81 and related division.',
    },
    hook: 'You may forget 7 × 8. But if you know 8 × 8 = 64, you can still work it out fast!',
    explain: [
      'Count back one group from a fact you know: 8 × 8 = 64, so 7 × 8 = 64 − 8 = 56.',
      'Use doubling: 4 × 3 = 12, so 8 × 3 = 12 + 12 = 24.',
      'Use halving for division: 60 ÷ 4 is half of 60, then half again.',
    ],
    art: { kind: 'grid', rows: 7, cols: 8, label: '7 × 8 = 64 − 8 = 56' },
    artCaption: 'Seven rows of 8 is one row less than 8 rows.',
    words: [
      { term: 'Known fact', meaning: 'A fact you already remember.' },
      { term: 'Doubling', meaning: 'Multiplying by 2.' },
      { term: 'Halving', meaning: 'Dividing by 2.' },
    ],
    examples: [
      {
        title: 'Count on a group',
        situation: 'You know 5 × 7 = 35. Find 6 × 7.',
        steps: ['Add one more 7.', '35 + 7 = 42.'],
        answer: '6 × 7 = 42.',
      },
      {
        title: 'Halve twice',
        situation: 'Work out 60 ÷ 4.',
        steps: ['60 ÷ 2 = 30.', '30 ÷ 2 = 15.'],
        answer: '60 ÷ 4 = 15.',
      },
    ],
    mistakes: [
      {
        wrong: 'Taking away 7 instead of 8 when counting back from 8 × 8.',
        right: 'Each group is 8, so take away 8.',
      },
    ],
    realLife: [
      'Quick shopping sums.',
      'Sharing in the market.',
      'Checking change.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Ask each other ten facts up to 9 × 9.',
        'For each hard one, say which known fact helped.',
        'Practise the 9s pattern: 9 × 6 is 60 − 6.',
      ],
    },
  },
  'mathematics-15': {
    indicator: {
      code: 'B5.1.2.1.2',
      text: 'Apply mental strategies for multiplication, such as annexing zeros, halving and doubling, and the distributive property.',
    },
    hook: 'How can you work out 32 × 5 in your head in two seconds? There is a trick!',
    explain: [
      'Annexing zeros: for 3 × 200, work out 3 × 2 = 6, then add two zeros to get 600.',
      'Halving and doubling: halve one factor and double the other. 32 × 5 is the same as 16 × 10.',
      'The distributive property: split a number to make it easier. 6 × 18 = 60 + 48 = 108.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['6 × 10', 60],
        ['6 × 8', 48],
      ],
      label: '6 × 18 = 60 + 48 = 108',
    },
    artCaption: 'Split 18 into 10 and 8.',
    words: [
      { term: 'Annex', meaning: 'Add on at the end.' },
      {
        term: 'Distributive property',
        meaning: 'Multiplying each part of a number separately, then adding.',
      },
      { term: 'Factor', meaning: 'A number being multiplied.' },
    ],
    examples: [
      {
        title: 'Halve and double',
        situation: 'Work out 32 × 5.',
        steps: ['Halve 32 to get 16. Double 5 to get 10.', '16 × 10 = 160.'],
        answer: '32 × 5 = 160.',
      },
      {
        title: 'Close to ten',
        situation: 'Work out 29 × 7.',
        steps: ['30 × 7 = 210.', 'Take away one 7: 210 − 7 = 203.'],
        answer: '29 × 7 = 203.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 9 × 0 = 9.',
        right: 'Any number times 0 is 0. Any number times 1 stays the same.',
      },
    ],
    realLife: [
      'Working out prices fast.',
      'Estimating costs.',
      'Checking a bill.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Work out 4 × 300 by annexing zeros.',
        'Work out 18 × 5 by halving and doubling.',
        'Work out 7 × 19 using 7 × 20.',
      ],
    },
  },
  'mathematics-16': {
    indicator: {
      code: 'B5.1.2.2.1',
      text: 'Multiply multi-digit numbers by 2-digit numbers efficiently.',
    },
    hook: 'A school buys 25 crates of soft drinks with 32 bottles in each. How many bottles is that?',
    explain: [
      'Split the 2-digit number into tens and ones.',
      'Multiply each part separately.',
      'Add the parts to get the answer.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['20 × 32', 640],
        ['5 × 32', 160],
      ],
      label: '25 × 32 = 640 + 160 = 800',
    },
    artCaption: 'Twenty crates, then five more.',
    words: [
      { term: 'Partial product', meaning: 'The answer for one part.' },
      {
        term: 'Column method',
        meaning: 'Writing the numbers one under the other to multiply.',
      },
      { term: 'Product', meaning: 'The answer to a multiplication.' },
    ],
    examples: [
      {
        title: 'The crates',
        situation: 'Work out 25 × 32.',
        steps: ['20 × 32 = 640.', '5 × 32 = 160.', '640 + 160 = 800.'],
        answer: '800 bottles.',
      },
      {
        title: 'Three digits',
        situation: 'Work out 143 × 12.',
        steps: ['143 × 10 = 1430.', '143 × 2 = 286.', '1430 + 286 = 1716.'],
        answer: '143 × 12 = 1716.',
      },
    ],
    mistakes: [
      {
        wrong: 'Multiplying by 2 instead of 20 for the tens.',
        right: 'The 2 in 25 means 20.',
      },
    ],
    realLife: [
      'Counting goods in crates.',
      'Working out wages for many days.',
      'Planning school supplies.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 34 × 21 by splitting 21.',
        'Check by the column method.',
        'Make up a story for your sum.',
      ],
    },
  },
  'mathematics-17': {
    indicator: {
      code: 'B5.1.2.3.1',
      text: 'Determine basic division facts up to 81, and use divisibility tests.',
    },
    hook: '54 pupils must form teams of 9. How many teams? Your times tables know the answer.',
    explain: [
      'Each multiplication fact gives a division fact: 6 × 9 = 54, so 54 ÷ 9 = 6.',
      'A number divides by 3 if its digits add up to a multiple of 3.',
      'A number divides by 9 if its digits add up to a multiple of 9.',
    ],
    art: { kind: 'grid', rows: 6, cols: 9, label: '54 ÷ 9 = 6' },
    artCaption: 'Six rows of 9 make 54.',
    words: [
      { term: 'Division fact', meaning: 'A division you know by heart.' },
      { term: 'Divisible', meaning: 'Can be divided exactly.' },
      { term: 'Digit sum', meaning: 'The digits of a number added together.' },
    ],
    examples: [
      {
        title: 'Use a fact',
        situation: 'Work out 63 ÷ 7.',
        steps: ['7 × 9 = 63.'],
        answer: '63 ÷ 7 = 9.',
      },
      {
        title: 'Test it',
        situation: 'Does 252 divide by 3, and by 9?',
        steps: ['2 + 5 + 2 = 9.', '9 is a multiple of 3 and of 9.'],
        answer: 'Yes to both: 252 ÷ 3 = 84, and 252 ÷ 9 = 28.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking every number ending in 3 divides by 3.',
        right: 'Use the digit sum: 13 does not divide by 3.',
      },
    ],
    realLife: [
      'Forming teams.',
      'Sharing goods.',
      'Checking if a price splits evenly.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write all the division facts for the 8 times table.',
        'Test 117, 135 and 142 for 3 and 9.',
        'Check by dividing.',
      ],
    },
  },
  'mathematics-18': {
    indicator: {
      code: 'B5.1.2.4.1',
      text: 'Divide 3-digit numbers by a 1-digit number efficiently.',
    },
    hook: '738 exercise books are shared equally between 6 classes. How many does each class get?',
    explain: [
      'Take away big groups of the divisor, such as 100 groups, then 10 groups.',
      'Keep going until nothing, or a small remainder, is left.',
      'Add up all the groups you took.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['100 sixes', 600],
        ['20 sixes', 120],
        ['3 sixes', 18],
      ],
      label: '600 + 120 + 18 = 738',
    },
    artCaption: '100 + 20 + 3 = 123 groups of 6.',
    words: [
      { term: 'Divisor', meaning: 'The number you divide by.' },
      { term: 'Quotient', meaning: 'The answer to a division.' },
      { term: 'Remainder', meaning: 'What is left over.' },
    ],
    examples: [
      {
        title: 'Share the books',
        situation: 'Work out 738 ÷ 6.',
        steps: [
          '6 × 100 = 600. 738 − 600 = 138.',
          '6 × 20 = 120. 138 − 120 = 18.',
          '6 × 3 = 18. 100 + 20 + 3 = 123.',
        ],
        answer: '738 ÷ 6 = 123.',
      },
      {
        title: 'With a remainder',
        situation: 'Work out 425 ÷ 4.',
        steps: ['4 × 100 = 400. 425 − 400 = 25.', '4 × 6 = 24. 25 − 24 = 1.'],
        answer: '106 remainder 1.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting the remainder.',
        right: 'Write what is left over as the remainder.',
      },
    ],
    realLife: [
      'Sharing books between classes.',
      'Packing eggs in trays.',
      'Splitting costs.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 856 ÷ 4.',
        'Work out 517 ÷ 5.',
        'Check each by multiplying back.',
      ],
    },
  },
  'mathematics-19': {
    indicator: {
      code: 'B5.1.2.5.1',
      text: 'Solve multi-step word problems involving the four basic operations.',
    },
    hook: 'Four friends pool their money to buy a football. Will they get any change? It takes more than one step to find out.',
    explain: [
      'Read the problem and find what it asks.',
      'Plan the steps, and choose an operation for each.',
      'Work through the steps, then check your answer makes sense.',
    ],
    art: {
      kind: 'cedis',
      notes: [50, 20, 20, 10],
      label: 'The friends pool 100 cedis',
    },
    artCaption: 'First add, then subtract, then share.',
    words: [
      { term: 'Multi-step', meaning: 'Needing more than one calculation.' },
      {
        term: 'Operation',
        meaning: 'Adding, subtracting, multiplying or dividing.',
      },
      { term: 'Check', meaning: 'Make sure the answer is right.' },
    ],
    examples: [
      {
        title: 'The football',
        situation:
          'Friends give 25, 30, 18 and 27 cedis. A ball costs 84 cedis. They share the change. How much each?',
        steps: ['25 + 30 + 18 + 27 = 100.', '100 − 84 = 16.', '16 ÷ 4 = 4.'],
        answer: '4 cedis each.',
      },
      {
        title: 'Bottles left',
        situation:
          'A school buys 12 crates of 24 bottles. 35 bottles are used at sports. How many are left?',
        steps: ['12 × 24 = 288.', '288 − 35 = 253.'],
        answer: '253 bottles.',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering after the first step.',
        right: 'Re-read the question to check what it asks.',
      },
    ],
    realLife: [
      'Shopping with friends.',
      'Planning school events.',
      'Sharing costs.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write a problem that needs two different operations.',
        'Swap and solve.',
        'Explain your steps to each other.',
      ],
    },
  },
  'mathematics-20': {
    indicator: {
      code: 'B5.1.2.6.1',
      text: 'Solve simple addition and subtraction problems involving integers.',
    },
    hook: 'In the morning the temperature on a mountain is −6 °C. By noon it rises by 8 degrees. How warm is it?',
    explain: [
      'Integers are whole numbers that can be positive, negative or zero.',
      'On a number line, adding a positive number moves right. Subtracting moves left.',
      'Adding a negative number also moves left.',
    ],
    art: { kind: 'jumps', start: -6, jumps: [8], label: '−6 + 8 = 2' },
    artCaption: 'Start at −6 and move 8 to the right.',
    words: [
      {
        term: 'Integer',
        meaning: 'A whole number: positive, negative or zero.',
      },
      { term: 'Negative', meaning: 'Less than zero.' },
      { term: 'Number line', meaning: 'A line with numbers in order.' },
    ],
    examples: [
      {
        title: 'The mountain',
        situation: 'Work out −6 + 8.',
        steps: [
          'Start at −6.',
          'Move 8 to the right: 6 steps reach 0, then 2 more.',
        ],
        answer: '−6 + 8 = 2 °C.',
      },
      {
        title: 'More moves',
        situation: 'Work out −3 + −5 and 2 − 6.',
        steps: ['From −3, move 5 left to −8.', 'From 2, move 6 left to −4.'],
        answer: '−3 + −5 = −8, and 2 − 6 = −4.',
      },
      {
        title: 'A missing number',
        situation: 'Some number added to 5 makes −11. What is it?',
        steps: ['☐ + 5 = −11.', 'Go back 5 from −11: −11 − 5 = −16.'],
        answer: '−16.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking −8 is bigger than −3.',
        right: '−8 is further left on the number line, so it is smaller.',
      },
    ],
    realLife: [
      'Temperatures below zero.',
      'Owing and paying back money.',
      'Floors below ground.',
    ],
    tryIt: {
      need: 'A number line from −20 to 20',
      steps: [
        'Work out 9 + −4 and −5 − 7.',
        'Make up a temperature story.',
        'Check your answers on the line.',
      ],
    },
  },
  'mathematics-21': {
    indicator: {
      code: 'B5.1.3.1.1',
      text: 'Determine equivalent fractions of given fractions.',
    },
    hook: 'Ama ate 2/3 of a pizza. Kofi ate 4/6 of the same size pizza. Who ate more?',
    explain: [
      'Equivalent fractions show the same amount.',
      'Multiply or divide the top and bottom by the same number.',
      '2/3 = 4/6 = 6/9 = 8/12.',
    ],
    art: {
      kind: 'fractionLine',
      parts: 6,
      mark: 4,
      label: '4/6 is the same point as 2/3',
    },
    artCaption: 'Same point, different names.',
    words: [
      { term: 'Equivalent', meaning: 'Equal in value.' },
      { term: 'Numerator', meaning: 'The top number.' },
      { term: 'Denominator', meaning: 'The bottom number.' },
    ],
    examples: [
      {
        title: 'Make an equivalent',
        situation: 'Find a fraction equal to 2/3 with 12 at the bottom.',
        steps: ['3 × 4 = 12.', 'Multiply the top by 4 too: 2 × 4 = 8.'],
        answer: '2/3 = 8/12.',
      },
      {
        title: 'Simplify',
        situation: 'Write 15/20 in its simplest form.',
        steps: ['The HCF of 15 and 20 is 5.', '15 ÷ 5 = 3 and 20 ÷ 5 = 4.'],
        answer: '15/20 = 3/4.',
      },
    ],
    mistakes: [
      {
        wrong: 'Multiplying only the bottom number.',
        right: 'Multiply the top and bottom by the same number.',
      },
    ],
    realLife: ['Sharing food fairly.', 'Recipes.', 'Measuring cloth.'],
    tryIt: {
      need: 'Paper strips',
      steps: [
        'Fold strips into thirds, sixths and twelfths.',
        'Find the strips equal to 2/3.',
        'Write the equivalent fractions.',
      ],
    },
  },
  'mathematics-22': {
    indicator: { code: 'B5.1.3.1.2', text: 'Compare and order fractions.' },
    hook: 'One recipe needs 3/4 of a cup of sugar. Another needs 5/6. Which needs more?',
    explain: [
      'Find the lowest common denominator (LCD) of the fractions.',
      'Change each fraction to an equivalent fraction with that denominator.',
      'Then compare the numerators.',
    ],
    art: { kind: 'cake', parts: 12, picked: 10, label: '5/6 = 10/12' },
    artCaption: 'Ten twelfths.',
    words: [
      { term: 'LCD', meaning: 'Lowest common denominator.' },
      { term: 'Compare', meaning: 'Decide which is bigger.' },
      { term: 'Order', meaning: 'Arrange by size.' },
    ],
    examples: [
      {
        title: 'Which is more?',
        situation: 'Compare 3/4 and 5/6.',
        steps: ['The LCD of 4 and 6 is 12.', '3/4 = 9/12 and 5/6 = 10/12.'],
        answer: '5/6 is more.',
      },
      {
        title: 'Order three',
        situation: 'Order 2/3, 3/4 and 5/6 from smallest.',
        steps: ['Change to twelfths: 8/12, 9/12 and 10/12.'],
        answer: '2/3, 3/4, 5/6.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 1/6 is bigger than 1/4 because 6 is bigger.',
        right: 'More equal parts means smaller parts, so 1/6 is smaller.',
      },
    ],
    realLife: [
      'Comparing recipes.',
      'Comparing shares of land.',
      'Comparing test marks.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Order 1/2, 2/5 and 3/10.',
        'Explain how you chose the denominator.',
        'Check with drawings.',
      ],
    },
  },
  'mathematics-23': {
    indicator: {
      code: 'B5.1.3.1.3',
      text: 'Use equivalent fractions to change fractions to the same denominator.',
    },
    hook: 'Before you can add 1/4 and 1/6, the pieces must be the same size. How?',
    explain: [
      'Fractions with different denominators have different-sized parts.',
      'Find the LCM of the denominators.',
      'Change each fraction to that denominator.',
    ],
    art: { kind: 'cake', parts: 12, picked: 8, label: '2/3 = 8/12' },
    artCaption: 'Twelfths are a common size for thirds and quarters.',
    words: [
      { term: 'Common denominator', meaning: 'The same bottom number.' },
      { term: 'LCM', meaning: 'Lowest common multiple.' },
      {
        term: 'Like fractions',
        meaning: 'Fractions with the same denominator.',
      },
    ],
    examples: [
      {
        title: 'Quarters and sixths',
        situation: 'Change 1/4 and 1/6 to the same denominator.',
        steps: ['The LCM of 4 and 6 is 12.', '1/4 = 3/12 and 1/6 = 2/12.'],
        answer: '3/12 and 2/12.',
      },
      {
        title: 'Thirds and fifths',
        situation: 'Change 2/3 and 2/5 to the same denominator.',
        steps: ['The LCM of 3 and 5 is 15.', '2/3 = 10/15 and 2/5 = 6/15.'],
        answer: '10/15 and 6/15.',
      },
    ],
    mistakes: [
      {
        wrong: 'Changing the denominator but not the numerator.',
        right: 'Multiply both by the same number.',
      },
    ],
    realLife: [
      'Adding parts of a recipe.',
      'Combining shares.',
      'Measuring with different rulers.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Change 1/2 and 1/3 to the same denominator.',
        'Change 3/4 and 1/8 to the same denominator.',
        'Explain your method.',
      ],
    },
  },
  'mathematics-24': {
    indicator: {
      code: 'B5.1.3.1.4',
      text: 'Use equivalent fractions to add and subtract fractions.',
    },
    hook: 'Kwame paints 2/3 of a wall in the morning and 1/4 in the afternoon. How much has he painted?',
    explain: [
      'To add or subtract fractions, first make the denominators the same.',
      'Then add or subtract the numerators. Keep the denominator.',
      'For mixed numbers, add the wholes and the fractions separately.',
    ],
    art: { kind: 'cake', parts: 12, picked: 11, label: '8/12 + 3/12 = 11/12' },
    artCaption: 'Eleven twelfths painted.',
    words: [
      {
        term: 'Mixed number',
        meaning: 'A whole number and a fraction together.',
      },
      {
        term: 'Improper fraction',
        meaning: 'A fraction more than one, such as 7/4.',
      },
      { term: 'Sum', meaning: 'The answer to an addition.' },
    ],
    examples: [
      {
        title: 'The wall',
        situation: 'Work out 2/3 + 1/4.',
        steps: [
          'The LCD is 12.',
          '2/3 = 8/12 and 1/4 = 3/12.',
          '8/12 + 3/12 = 11/12.',
        ],
        answer: '11/12 of the wall.',
      },
      {
        title: 'Subtract',
        situation: 'Work out 5/6 − 1/4.',
        steps: ['The LCD is 12.', '10/12 − 3/12 = 7/12.'],
        answer: '7/12.',
      },
      {
        title: 'Mixed numbers',
        situation: 'Add 2 and 1/3 to 3 and 1/3.',
        steps: ['Wholes: 2 + 3 = 5.', 'Fractions: 1/3 + 1/3 = 2/3.'],
        answer: '5 and 2/3.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding the bottoms: 1/4 + 1/4 = 2/8.',
        right: 'Keep the denominator: 1/4 + 1/4 = 2/4.',
      },
    ],
    realLife: [
      'Painting and building jobs.',
      'Combining ingredients.',
      'Working out how much is left.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 1/2 + 1/3.',
        'Work out 3/4 − 1/3.',
        'Draw a picture to check one answer.',
      ],
    },
  },
  'mathematics-25': {
    indicator: {
      code: 'B5.1.3.1.5',
      text: 'Use models to explain the result of multiplying a whole number by a fraction.',
    },
    hook: 'Each pupil drinks 2/3 of a bottle of water at break. How many bottles do 5 pupils drink?',
    explain: [
      'Multiplying a whole number by a fraction means adding the fraction again and again.',
      '5 × 2/3 means 2/3 + 2/3 + 2/3 + 2/3 + 2/3.',
      'Multiply the whole number by the numerator, and keep the denominator.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['1 pupil', 2],
        ['2 pupils', 4],
        ['3 pupils', 6],
        ['4 pupils', 8],
        ['5 pupils', 10],
      ],
      label: 'Thirds of a bottle drunk',
    },
    artCaption: 'Each pupil adds 2 thirds: 10 thirds for 5 pupils.',
    words: [
      {
        term: 'Repeated addition',
        meaning: 'Adding the same amount many times.',
      },
      { term: 'Improper fraction', meaning: 'A fraction more than one.' },
      {
        term: 'Mixed number',
        meaning: 'A whole number and a fraction together.',
      },
    ],
    examples: [
      {
        title: 'The water',
        situation: 'Work out 5 × 2/3.',
        steps: ['5 × 2 = 10, so 10/3.', '9/3 makes 3 wholes, with 1/3 left.'],
        answer: '10/3, which is 3 and 1/3 bottles.',
      },
      {
        title: 'A mixed number',
        situation: 'Work out 3 × 2 and 2/3.',
        steps: ['3 × 2 = 6.', '3 × 2/3 = 6/3 = 2.', '6 + 2 = 8.'],
        answer: '8.',
      },
    ],
    mistakes: [
      {
        wrong: 'Multiplying the denominator too: 5 × 2/3 = 10/15.',
        right: 'Only the numerator is multiplied: 10/3.',
      },
    ],
    realLife: [
      'Working out food for a group.',
      'Measuring cloth for several dresses.',
      'Recipes for more people.',
    ],
    tryIt: {
      need: 'Paper circles',
      steps: [
        'Cut circles into quarters.',
        'Show 3 × 3/4 with the pieces.',
        'Write the answer as a mixed number.',
      ],
    },
  },
  'mathematics-26': {
    indicator: {
      code: 'B5.1.3.1.6',
      text: 'Use models to explain the result of multiplying a fraction by a whole number, as a fraction “of” a number.',
    },
    hook: 'There are 15 mangoes. You get 2/3 of them. How many mangoes is that?',
    explain: [
      'A fraction of a number means a fraction times that number.',
      'Divide by the denominator to find one part.',
      'Multiply by the numerator to find the parts you need.',
    ],
    art: {
      kind: 'groups',
      groups: 3,
      each: 5,
      label: 'Split 15 into 3 equal groups',
    },
    artCaption: 'Two of the three groups make 2/3.',
    words: [
      { term: 'Of', meaning: 'In fractions, “of” means multiply.' },
      { term: 'Part', meaning: 'One of the equal groups.' },
      { term: 'Whole', meaning: 'The full amount.' },
    ],
    examples: [
      {
        title: 'The mangoes',
        situation: 'What is 2/3 of 15?',
        steps: ['15 ÷ 3 = 5.', '5 × 2 = 10.'],
        answer: '2/3 of 15 is 10 mangoes.',
      },
      {
        title: 'Money',
        situation: 'What is 3/4 of 20 cedis?',
        steps: ['20 ÷ 4 = 5.', '5 × 3 = 15.'],
        answer: '15 cedis.',
      },
    ],
    mistakes: [
      {
        wrong: 'Dividing by the numerator.',
        right: 'Divide by the denominator, then multiply by the numerator.',
      },
    ],
    realLife: [
      'Sharing harvests.',
      'Spending part of your savings.',
      'Discounts.',
    ],
    tryIt: {
      need: '24 bottle tops',
      steps: [
        'Find 1/4 of 24 by making 4 groups.',
        'Find 3/4 of 24.',
        'Find 2/3 of 24.',
      ],
    },
  },
  'mathematics-27': {
    indicator: {
      code: 'B5.1.4.1.1',
      text: 'Describe and represent decimals up to thousandths concretely, pictorially and symbolically.',
    },
    hook: 'A sprinter runs 100 m in 10.345 seconds. Timers can measure to thousandths of a second!',
    explain: [
      'After the decimal point come tenths, then hundredths, then thousandths.',
      'In 2.345, the 3 is 3 tenths, the 4 is 4 hundredths and the 5 is 5 thousandths.',
      'One thousandth is one part in a thousand: 0.001.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['Ones', '2'],
        ['Tenths', '3'],
        ['Hundredths', '4'],
        ['Thousandths', '5'],
      ],
      label: '2.345',
    },
    artCaption: 'Each place is a tenth of the place to its left.',
    words: [
      { term: 'Tenth', meaning: '0.1, one part in ten.' },
      { term: 'Hundredth', meaning: '0.01, one part in a hundred.' },
      { term: 'Thousandth', meaning: '0.001, one part in a thousand.' },
    ],
    examples: [
      {
        title: 'Read it',
        situation: 'What is 0.007 as a fraction?',
        steps: ['The 7 is in the thousandths place.'],
        answer: '7/1000.',
      },
      {
        title: 'Fraction to decimal',
        situation: 'Write 3/8 as a decimal.',
        steps: ['3/8 = 375/1000.'],
        answer: '0.375.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing seven thousandths as 0.7.',
        right: 'Seven thousandths is 0.007.',
      },
    ],
    realLife: ['Race times.', 'Medicine doses.', 'Measuring with scales.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write 4.506 in a place value table.',
        'Say what each digit is worth.',
        'Write 1/4 and 1/8 as decimals.',
      ],
    },
  },
  'mathematics-28': {
    indicator: {
      code: 'B5.1.4.1.2',
      text: 'Compare and order decimals and a mixture of common fractions, decimals and percents, using <, > or =.',
    },
    hook: 'Three bottles are 5/8, 0.758 and 73% full. Which holds the most water?',
    explain: [
      'To compare, write them all in the same form.',
      'Percents are often easiest: 5/8 = 0.625 = 62.5%.',
      'Then order them as usual.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['5/8', 62.5],
        ['73%', 73],
        ['0.758', 75.8],
      ],
      label: 'All three as percents',
    },
    artCaption: 'Same form, easy to compare.',
    words: [
      { term: 'Decimal', meaning: 'A number with a decimal point.' },
      { term: 'Percent', meaning: 'Out of one hundred.' },
      { term: 'Common fraction', meaning: 'A fraction such as 3/4.' },
    ],
    examples: [
      {
        title: 'The bottles',
        situation: 'Order 5/8, 0.758 and 73% from least.',
        steps: ['5/8 = 62.5%.', '0.758 = 75.8%.'],
        answer: '5/8 < 73% < 0.758.',
      },
      {
        title: 'Two decimals',
        situation: 'Which is bigger: 0.4 or 0.38?',
        steps: ['0.4 = 0.40.', '40 hundredths is more than 38 hundredths.'],
        answer: '0.4 > 0.38.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 0.38 > 0.4 because 38 > 4.',
        right: 'Give them the same number of places: 0.40 > 0.38.',
      },
    ],
    realLife: [
      'Comparing prices.',
      'Comparing marks.',
      'Comparing battery levels.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Order 0.5, 3/5 and 45%.',
        'Write each as a percent first.',
        'Explain your order.',
      ],
    },
  },
  'mathematics-29': {
    indicator: {
      code: 'B5.1.4.1.3',
      text: 'Round decimals to the nearest tenth and hundredth.',
    },
    hook: 'A shop scale shows 4.085 kg. The shopkeeper says “about 4.1 kg”. Is he right?',
    explain: [
      'Rounding decimals works like rounding whole numbers.',
      'To the nearest tenth, look at the hundredths digit. To the nearest hundredth, look at the thousandths digit.',
      'If that digit is 5 or more, round up. Otherwise round down.',
    ],
    art: {
      kind: 'placeValue',
      places: [
        ['Ones', '4'],
        ['Tenths', '0'],
        ['Hundredths', '8'],
        ['Thousandths', '5'],
      ],
      label: '4.085 rounds to 4.1',
    },
    artCaption: 'The hundredths digit, 8, is 5 or more.',
    words: [
      { term: 'Nearest tenth', meaning: 'One digit after the point.' },
      { term: 'Nearest hundredth', meaning: 'Two digits after the point.' },
      { term: 'Round', meaning: 'Change to a nearby simpler number.' },
    ],
    examples: [
      {
        title: 'The scale',
        situation: 'Round 4.085 to the nearest tenth.',
        steps: [
          'The tenths digit is 0.',
          'The hundredths digit is 8, so round up.',
        ],
        answer: '4.1.',
      },
      {
        title: 'To the nearest hundredth',
        situation: 'Round 30.084 and 18.096 to the nearest hundredth.',
        steps: [
          '30.084: the thousandths digit is 4, so round down.',
          '18.096: the thousandths digit is 6, so round up.',
        ],
        answer: '30.08 and 18.10.',
      },
    ],
    mistakes: [
      {
        wrong: 'Rounding 18.096 to 18.1 when asked for hundredths.',
        right: 'Keep two places: 18.10.',
      },
    ],
    realLife: [
      'Weighing in the market.',
      'Measuring height.',
      'Prices in cedis and pesewas.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Round 56.584 to the nearest tenth.',
        'Round it to the nearest hundredth.',
        'Explain each answer.',
      ],
    },
  },
  'mathematics-30': {
    indicator: {
      code: 'B5.1.4.1.4',
      text: 'Use models to explain addition and subtraction of decimals up to thousandths.',
    },
    hook: 'A bottle holds 0.645 litres of juice. You add 0.39 litres more. How much now?',
    explain: [
      'Line up the decimal points.',
      'Fill empty places with zeros, so 0.39 becomes 0.390.',
      'Add or subtract as with whole numbers, and keep the point in line.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['0.645', 0.645],
        ['0.39', 0.39],
        ['Total', 1.035],
      ],
      label: '0.645 + 0.39 = 1.035',
    },
    artCaption: 'Line up the points, then add.',
    words: [
      { term: 'Decimal point', meaning: 'The dot between wholes and parts.' },
      { term: 'Place holder', meaning: 'A zero that fills an empty place.' },
      { term: 'Difference', meaning: 'The answer to a subtraction.' },
    ],
    examples: [
      {
        title: 'Add',
        situation: 'Work out 0.645 + 0.39.',
        steps: [
          'Write 0.39 as 0.390.',
          '645 thousandths + 390 thousandths = 1035 thousandths.',
        ],
        answer: '0.645 + 0.39 = 1.035 litres.',
      },
      {
        title: 'Subtract',
        situation: 'Work out 0.6 − 0.395.',
        steps: ['Write 0.6 as 0.600.', '600 − 395 = 205 thousandths.'],
        answer: '0.6 − 0.395 = 0.205.',
      },
    ],
    mistakes: [
      {
        wrong: 'Lining up the last digits instead of the points.',
        right: 'Always line up the decimal points.',
      },
    ],
    realLife: ['Adding liquids.', 'Adding weights.', 'Working out change.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 2.35 + 1.405.',
        'Work out 5 − 2.125.',
        'Check one answer with the other operation.',
      ],
    },
  },
  'mathematics-31': {
    indicator: {
      code: 'B5.1.4.1.5',
      text: 'Use models to explain multiplying a decimal up to thousandths by a whole number.',
    },
    hook: 'A pencil costs 0.4 cedis. How much do 10 pencils cost?',
    explain: [
      'Multiplying a decimal by a whole number is repeated addition.',
      'Ignore the point, multiply the whole numbers, then put the point back.',
      'The answer has the same number of decimal places as the decimal.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['0.4 × 1', 0.4],
        ['0.4 × 5', 2],
        ['0.4 × 10', 4],
      ],
      label: '0.4 × 10 = 4',
    },
    artCaption: 'Multiplying by 10 moves each digit one place left.',
    words: [
      { term: 'Decimal places', meaning: 'Digits after the point.' },
      { term: 'Product', meaning: 'The answer to a multiplication.' },
      {
        term: 'Repeated addition',
        meaning: 'Adding the same amount many times.',
      },
    ],
    examples: [
      {
        title: 'The pencils',
        situation: 'Work out 0.4 × 10.',
        steps: ['4 × 10 = 40.', 'One decimal place: 4.0.'],
        answer: '4 cedis.',
      },
      {
        title: 'Thousandths',
        situation: 'Work out 1.205 × 4.',
        steps: ['1205 × 4 = 4820.', 'Three decimal places: 4.820.'],
        answer: '1.205 × 4 = 4.82.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing 0.4 × 10 as 0.40.',
        right: 'Multiplying by 10 makes it bigger: 4.',
      },
    ],
    realLife: [
      'Working out costs of several items.',
      'Doubling a recipe.',
      'Measuring cloth for many shirts.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Work out 0.25 × 3.',
        'Work out 2.5 × 6.',
        'Check by repeated addition.',
      ],
    },
  },
  'mathematics-32': {
    indicator: {
      code: 'B5.1.5.1.1',
      text: 'Determine the percentage of a given quantity (2-digit whole numbers), and find what percent one number is of another.',
    },
    hook: 'A class of 45 pupils is told 20% will go on a trip. How many pupils go?',
    explain: [
      'Percent means out of 100, so 20% is 20/100, which is 1/5.',
      'To find 20% of a number, find 1/5 of it.',
      'To find what percent one number is of another, write it as a fraction, then change it to hundredths.',
    ],
    art: {
      kind: 'groups',
      groups: 5,
      each: 9,
      label: '45 in 5 equal groups: one group is 20%',
    },
    artCaption: '20% of 45 is one group of 9.',
    words: [
      { term: 'Percent (%)', meaning: 'Out of one hundred.' },
      { term: 'Quantity', meaning: 'An amount.' },
      { term: 'Of', meaning: 'Means multiply.' },
    ],
    examples: [
      {
        title: 'The trip',
        situation: 'What is 20% of 45?',
        steps: ['20% = 1/5.', '45 ÷ 5 = 9.'],
        answer: '20% of 45 is 9 pupils.',
      },
      {
        title: 'What percent?',
        situation: 'What percent of 48 is 12?',
        steps: ['12/48 = 1/4.', '1/4 = 25/100.'],
        answer: '25%.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking 20% of 45 is 20.',
        right: '20% means 20 out of every 100, so find 1/5 of 45.',
      },
    ],
    realLife: ['Class surveys.', 'Discounts.', 'Test results.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Find 10% and 50% of 60.',
        'What percent of 40 is 10?',
        'Make up a percent question for a friend.',
      ],
    },
  },
  'mathematics-33': {
    indicator: {
      code: 'B5.1.5.1.2',
      text: 'Determine benchmark percentages from their common fractions, and use them to estimate.',
    },
    hook: 'Some percents are worth knowing by heart. 50% is half. What is 25%?',
    explain: [
      'Benchmark percents are ones we use often: 10%, 20%, 25%, 50% and 75%.',
      'Each matches a simple fraction: 50% = 1/2, 25% = 1/4 and 75% = 3/4.',
      'Use them to estimate and work out harder percents.',
    ],
    art: { kind: 'cake', parts: 4, picked: 1, label: '1/4 = 25%' },
    artCaption: 'A quarter of the whole.',
    words: [
      { term: 'Benchmark', meaning: 'A standard you compare with.' },
      { term: 'Estimate', meaning: 'Find a close answer.' },
      { term: 'Equivalent', meaning: 'Equal in value.' },
    ],
    examples: [
      {
        title: 'Use a benchmark',
        situation: 'Work out 60% of 45.',
        steps: ['20% of 45 is 9.', '60% is three lots of 20%: 3 × 9 = 27.'],
        answer: '27.',
      },
      {
        title: 'Estimate',
        situation: 'Is 48% of 80 more or less than 40?',
        steps: ['50% of 80 is 40.', '48% is a little less than 50%.'],
        answer: 'A little less than 40.',
      },
    ],
    mistakes: [
      { wrong: 'Thinking 25% is 1/25.', right: '25% = 25/100 = 1/4.' },
    ],
    realLife: [
      'Half-price sales.',
      'Phone battery levels.',
      'Sharing profits.',
    ],
    tryIt: {
      need: 'Card',
      steps: [
        'Make matching cards for 1/2, 1/4, 3/4, 1/5 and 1/10 and their percents.',
        'Play a matching game.',
        'Use them to find 75% of 40.',
      ],
    },
  },
  'mathematics-34': {
    indicator: {
      code: 'B5.1.5.1.3',
      text: 'Identify and describe percent in real-life contexts, and solve problems using percent.',
    },
    hook: 'A shop says “25% off”. A school bag costs 80 cedis. How much do you pay now?',
    explain: [
      'Percents appear in shops, banks, health reports and test results.',
      'A discount is an amount taken off a price.',
      'Find the percent of the price, then subtract it.',
    ],
    art: {
      kind: 'cedis',
      notes: [50, 10],
      label: '80 cedis − 20 cedis = 60 cedis',
    },
    artCaption: 'You pay 60 cedis.',
    words: [
      { term: 'Discount', meaning: 'Money taken off a price.' },
      { term: 'Sale price', meaning: 'The price after a discount.' },
      { term: 'Score', meaning: 'Marks out of a total.' },
    ],
    examples: [
      {
        title: 'The bag',
        situation: 'A 80 cedi bag has 25% off. What is the sale price?',
        steps: ['25% of 80 is 80 ÷ 4 = 20.', '80 − 20 = 60.'],
        answer: '60 cedis.',
      },
      {
        title: 'A test score',
        situation: 'Abena scores 18 out of 20. What percent is that?',
        steps: ['18/20 = 90/100.'],
        answer: '90%.',
      },
    ],
    mistakes: [
      {
        wrong: 'Taking 25 cedis off for “25% off”.',
        right: 'Find 25% of the price first.',
      },
    ],
    realLife: ['Shop sales.', 'Test results.', 'Mobile money charges.'],
    tryIt: {
      need: 'Adverts or price tags',
      steps: [
        'Find a percent in an advert.',
        'Work out the sale price.',
        'Explain what the percent means.',
      ],
    },
  },
  'mathematics-35': {
    indicator: {
      code: 'B5.2.1.1.1',
      text: 'Extend a given pattern with and without concrete materials, and explain how each element differs from the one before.',
    },
    hook: 'A tiler lays 20 tiles, then 40, then 60. How many next?',
    explain: [
      'A pattern follows a rule.',
      'Look at how each term changes from the one before.',
      'Use the rule to extend the pattern.',
    ],
    art: {
      kind: 'pattern',
      terms: [20, 40, 60, 80, null],
      rule: 'Add 20 each time.',
    },
    artCaption: 'Each term is 20 more.',
    words: [
      { term: 'Term', meaning: 'One number in a pattern.' },
      { term: 'Extend', meaning: 'Continue further.' },
      { term: 'Increasing', meaning: 'Getting bigger.' },
    ],
    examples: [
      {
        title: 'Extend it',
        situation: 'What are the next two terms? 2,500, 3,000, 3,500, ...',
        steps: ['The rule is add 500.'],
        answer: '4,000 and 4,500.',
      },
      {
        title: 'A shrinking pattern',
        situation: 'What comes next? 96, 48, 24, ...',
        steps: ['Each term is half the one before.', '24 ÷ 2 = 12.'],
        answer: '12.',
      },
    ],
    mistakes: [
      {
        wrong: 'Using only the first two terms to guess the rule.',
        right: 'Check the rule works for every term.',
      },
    ],
    realLife: ['Tiling.', 'Savings plans.', 'Bead patterns.'],
    tryIt: {
      need: 'Beads or bottle tops',
      steps: [
        'Make a growing pattern with four steps.',
        'Ask a friend to build the fifth.',
        'Describe the rule in words.',
      ],
    },
  },
  'mathematics-36': {
    indicator: {
      code: 'B5.2.1.1.3',
      text: 'Predict subsequent elements in a given pattern, and represent the pattern visually to verify predictions.',
    },
    hook: 'One square takes 4 matchsticks. Two squares in a row take 7. How many for 9 squares?',
    explain: [
      'Build the first few steps and record them in a table.',
      'Find the rule and use it to predict.',
      'Draw or build the next step to check your prediction.',
    ],
    art: {
      kind: 'pattern',
      terms: [4, 7, 10, 13, null],
      rule: 'Matchsticks for 1, 2, 3 and 4 squares in a row',
    },
    artCaption: 'Each new square adds 3 sticks.',
    words: [
      { term: 'Predict', meaning: 'Say what will happen next.' },
      { term: 'Verify', meaning: 'Check that something is true.' },
      { term: 'Table', meaning: 'Rows and columns of numbers.' },
    ],
    examples: [
      {
        title: 'The 9th step',
        situation: 'How many matchsticks for 9 squares in a row?',
        steps: [
          'The first square needs 4. Each new one adds 3.',
          '4 + 8 × 3 = 28.',
        ],
        answer: '28 matchsticks.',
      },
    ],
    mistakes: [
      {
        wrong: 'Multiplying 9 × 4 = 36, as if the squares were apart.',
        right: 'Joined squares share a stick, so each new one adds only 3.',
      },
    ],
    realLife: ['Building fences.', 'Laying tiles.', 'Planning rows of seats.'],
    tryIt: {
      need: 'Matchsticks or sticks',
      steps: [
        'Build triangles in a row.',
        'Record sticks for 1 to 5 triangles.',
        'Predict the 10th, then check.',
      ],
    },
  },
  'mathematics-37': {
    indicator: {
      code: 'B5.2.1.1.5',
      text: 'Solve a given problem by using a pattern rule to determine subsequent elements.',
    },
    hook: 'Ama’s plant is 5 cm tall today. It grows 2 cm a day. When will it be 75 cm tall?',
    explain: [
      'Put the information in a table.',
      'Find the pattern rule.',
      'Use the rule to solve the problem without listing every step.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Today', 5],
        ['Day 1', 7],
        ['Day 2', 9],
        ['Day 3', 11],
      ],
      label: 'Ama’s plant grows 2 cm a day',
    },
    artCaption: 'The plant grows by 2 cm each day.',
    words: [
      { term: 'Pattern rule', meaning: 'A rule that tells you each term.' },
      { term: 'Growth', meaning: 'How much something increases.' },
      { term: 'Solve', meaning: 'Find the answer.' },
    ],
    examples: [
      {
        title: 'The plant',
        situation: 'When will the plant reach 75 cm?',
        steps: ['It needs to grow 75 − 5 = 70 cm.', '70 ÷ 2 = 35.'],
        answer: 'In 35 days.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting the 5 cm it started with.',
        right: 'Subtract the starting height first.',
      },
    ],
    realLife: [
      'Tracking plant growth.',
      'Saving up for something.',
      'Planning a journey.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Kofi saves 3 cedis a day and has 6 cedis now.',
        'Make a table for 5 days.',
        'When will he have 36 cedis?',
      ],
    },
  },
  'mathematics-38': {
    indicator: {
      code: 'B5.2.1.1.7',
      text: 'Write a rule in words and in algebra to represent a given pattern.',
    },
    hook: 'Can you write a rule that gives any term of 5, 8, 11, 14 without counting?',
    explain: [
      'A rule in words: start at 5 and add 3 each time.',
      'A rule in algebra uses n for the term number: 3 × n + 2.',
      'Check the rule: when n is 4, 3 × 4 + 2 = 14.',
    ],
    art: {
      kind: 'pattern',
      terms: [5, 8, 11, 14, 17],
      rule: 'Rule: 3 × n + 2',
    },
    artCaption: 'The 1st term is 5, the 2nd is 8.',
    words: [
      { term: 'Algebra', meaning: 'Maths that uses letters for numbers.' },
      {
        term: 'Term number (n)',
        meaning: 'The position of a term: 1st, 2nd, 3rd.',
      },
      { term: 'Rule', meaning: 'How each term is found.' },
    ],
    examples: [
      {
        title: 'The 10th term',
        situation: 'Use 3 × n + 2 to find the 10th term.',
        steps: ['n is 10.', '3 × 10 + 2 = 32.'],
        answer: '32.',
      },
      {
        title: 'Find a rule',
        situation: 'Find a rule for 4, 8, 12, 16.',
        steps: ['Each term is 4 times its position.'],
        answer: '4 × n.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing the rule as “add 3” and stopping.',
        right: 'Link each term to its position to get 3 × n + 2.',
      },
    ],
    realLife: [
      'Working out costs for any number of items.',
      'Planning seating.',
      'Computer programs.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the first five terms of 2 × n + 1.',
        'Make your own rule.',
        'Ask a friend to find its 10th term.',
      ],
    },
  },
  'mathematics-39': {
    indicator: {
      code: 'B5.2.2.1.1',
      text: 'Demonstrate an understanding of algebraic expressions as mathematical phrases with letters for unknowns.',
    },
    hook: 'Kofi has some marbles and gets 5 more. We do not know how many he had. How can we write it?',
    explain: [
      'An algebraic expression uses letters for unknown numbers.',
      'Kofi’s marbles can be written n + 5.',
      'If we later learn the number, we can substitute it into the expression.',
    ],
    art: {
      kind: 'groups',
      groups: 3,
      each: 4,
      label: '3 bags of n sweets: 3n',
    },
    artCaption: 'When n is 4, there are 12 sweets.',
    words: [
      { term: 'Expression', meaning: 'A maths phrase, such as n + 5.' },
      { term: 'Substitute', meaning: 'Put a number in place of a letter.' },
      {
        term: 'Like terms',
        meaning: 'Terms with the same letter, such as 3a and 2a.',
      },
    ],
    examples: [
      {
        title: 'Substitute',
        situation: 'Find 8k + d when k is 2 and d is 3.',
        steps: ['8k means 8 × k.', '8 × 2 + 3 = 19.'],
        answer: '19.',
      },
      {
        title: 'Collect like terms',
        situation: 'Simplify 3a + 2a + 4.',
        steps: [
          '3a and 2a are like terms: they make 5a.',
          '4 has no letter, so it stays.',
        ],
        answer: '5a + 4.',
      },
    ],
    mistakes: [{ wrong: 'Reading 8k as 8 + k.', right: '8k means 8 × k.' }],
    realLife: [
      'Working out prices for any quantity.',
      'Spreadsheet formulas.',
      'Planning budgets.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write an expression for “4 more than y”.',
        'Write one for “twice a number”.',
        'Substitute 6 into each.',
      ],
    },
  },
  'mathematics-40': {
    indicator: {
      code: 'B5.2.3.1.1',
      text: 'Express a given problem as an equation where the unknown is represented by a letter, and solve it.',
    },
    hook: 'Esi had some money. After receiving 9 cedis, she has 24 cedis. How much did she have?',
    explain: [
      'An equation says two sides are equal.',
      'Use a letter for the unknown: p + 9 = 24.',
      'Undo the operation to find the letter: subtract 9 from both sides.',
    ],
    art: { kind: 'balance', left: 'p + 9', right: '24', equal: true },
    artCaption: 'Both sides balance.',
    words: [
      { term: 'Equation', meaning: 'A number sentence with an equals sign.' },
      { term: 'Unknown', meaning: 'The number we want to find.' },
      { term: 'Solve', meaning: 'Find the value of the unknown.' },
    ],
    examples: [
      {
        title: 'Esi’s money',
        situation: 'Solve p + 9 = 24.',
        steps: ['Take 9 from both sides.', '24 − 9 = 15.'],
        answer: 'p = 15 cedis.',
      },
      {
        title: 'Multiplication',
        situation:
          'Three equal pens cost 12 cedis. Write and solve an equation.',
        steps: ['3p = 12.', '12 ÷ 3 = 4.'],
        answer: 'p = 4 cedis.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding 9 instead of subtracting.',
        right: 'Do the opposite operation to undo it.',
      },
    ],
    realLife: ['Working out missing amounts.', 'Planning budgets.', 'Puzzles.'],
    tryIt: {
      need: 'A balance or two bags',
      steps: [
        'Solve 14 − p = 8.',
        'Solve 24 = p + 9.',
        'Check each answer by substituting.',
      ],
    },
  },
  'mathematics-41': {
    indicator: {
      code: 'B5.2.3.1.3',
      text: 'Create a problem for a given equation.',
    },
    hook: 'Here is an equation: 5 + k = 9. What story could it tell?',
    explain: [
      'An equation can describe many different stories.',
      'Decide what each number and the letter stand for.',
      'Check your story matches the operation in the equation.',
    ],
    art: { kind: 'balance', left: '5 + k', right: '9', equal: true },
    artCaption: 'k is 4.',
    words: [
      { term: 'Create', meaning: 'Make something new.' },
      { term: 'Context', meaning: 'The real-life situation in a problem.' },
      { term: 'Match', meaning: 'Fit together correctly.' },
    ],
    examples: [
      {
        title: 'Two stories',
        situation: 'Write two stories for 5 + k = 9.',
        steps: [
          'Story 1: Yaw had 5 goats and bought some more. Now he has 9.',
          'Story 2: 5 pupils are in the room. Some more come in, making 9.',
        ],
        answer: 'In both stories, k = 4.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing a sharing story for an adding equation.',
        right: 'An adding equation needs a story about putting together.',
      },
    ],
    realLife: [
      'Making puzzles for friends.',
      'Explaining maths to others.',
      'Planning purchases.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write a story for 3p = 12.',
        'Your friend writes one for p − 9 = 16.',
        'Solve each other’s stories.',
      ],
    },
  },
  'mathematics-42': {
    indicator: {
      code: 'B5.3.1.1.1',
      text: 'Demonstrate an understanding of the properties of squares and rectangles (sides, angles and diagonals).',
    },
    hook: 'A carpenter checks if a door frame is a true rectangle by measuring its diagonals. Why?',
    explain: [
      'A square has four equal sides and four right angles.',
      'A rectangle has opposite sides equal and four right angles.',
      'In both, the two diagonals are equal in length.',
    ],
    art: { kind: 'shapes', names: ['square', 'rectangle'], labelled: true },
    artCaption: 'Both have four right angles.',
    words: [
      { term: 'Diagonal', meaning: 'A line joining opposite corners.' },
      { term: 'Right angle', meaning: 'A square corner of 90°.' },
      { term: 'Opposite sides', meaning: 'Sides that face each other.' },
    ],
    examples: [
      {
        title: 'Compare them',
        situation: 'How is a square different from a rectangle?',
        steps: [
          'A square’s sides are all equal.',
          'A rectangle’s sides are equal only in opposite pairs.',
        ],
        answer:
          'Every square is a rectangle, but not every rectangle is a square.',
      },
      {
        title: 'Lines of symmetry',
        situation: 'How many lines of symmetry does each have?',
        steps: [
          'A square folds evenly 4 ways.',
          'A rectangle folds evenly 2 ways.',
        ],
        answer: 'Square 4, rectangle 2.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a rectangle’s diagonals are lines of symmetry.',
        right: 'Fold to check: the halves do not match.',
      },
    ],
    realLife: ['Door and window frames.', 'Football pitches.', 'Floor tiles.'],
    tryIt: {
      need: 'Paper squares and rectangles',
      steps: [
        'Fold each along its diagonals.',
        'Measure the diagonals.',
        'Write what you find.',
      ],
    },
  },
  'mathematics-43': {
    indicator: {
      code: 'B5.3.1.1.3',
      text: 'Prove that a polygon is regular by measuring its sides and angles, or by folding.',
    },
    hook: 'A stop sign has eight equal sides and equal corners. Shapes like this are called regular.',
    explain: [
      'A polygon is a flat shape with straight sides.',
      'A regular polygon has all sides equal and all angles equal.',
      'If any side or angle is different, the polygon is irregular.',
    ],
    art: {
      kind: 'shapes',
      names: ['triangle', 'square', 'pentagon', 'hexagon'],
    },
    artCaption: 'Regular polygons with 3, 4, 5 and 6 sides.',
    words: [
      { term: 'Polygon', meaning: 'A flat shape with straight sides.' },
      { term: 'Regular', meaning: 'All sides and angles are equal.' },
      { term: 'Irregular', meaning: 'Sides or angles are not all equal.' },
    ],
    examples: [
      {
        title: 'Is it regular?',
        situation: 'A rhombus has four equal sides. Is it regular?',
        steps: ['Its angles are not all equal.'],
        answer: 'No, it is irregular.',
        art: { kind: 'shapes', names: ['rhombus'] },
      },
      {
        title: 'A rectangle',
        situation: 'A rectangle has four equal angles. Is it regular?',
        steps: ['Its sides are not all equal.'],
        answer: 'No. Only a square is a regular four-sided shape.',
      },
    ],
    mistakes: [
      {
        wrong: 'Checking only the sides.',
        right: 'Check the sides and the angles.',
      },
    ],
    realLife: ['Road signs.', 'Floor tiles.', 'Honeycomb.'],
    tryIt: {
      need: 'A ruler and paper shapes',
      steps: [
        'Measure the sides of three shapes.',
        'Fold to compare their angles.',
        'Say which are regular.',
      ],
    },
  },
  'mathematics-44': {
    indicator: {
      code: 'B5.3.2.1.1',
      text: 'Estimate perimeter using referents for the centimetre and metre, and calculate the actual perimeter.',
    },
    hook: 'Your thumb is about 1 cm wide. Two strides are about a metre. Can you estimate the distance around your classroom?',
    explain: [
      'Perimeter is the distance around a shape.',
      'Estimate first using referents, such as a thumb width or a stride.',
      'Then measure every side and add them up.',
    ],
    art: {
      kind: 'area',
      rows: 3,
      cols: 7,
      label: 'Perimeter: 7 + 3 + 7 + 3 = 20 units',
    },
    artCaption: 'Go all the way around.',
    words: [
      { term: 'Perimeter', meaning: 'The distance around a shape.' },
      { term: 'Referent', meaning: 'A familiar object used to estimate size.' },
      { term: 'Compound shape', meaning: 'A shape made of simpler shapes.' },
    ],
    examples: [
      {
        title: 'An exercise book',
        situation: 'A book is 21 cm by 15 cm. Find its perimeter.',
        steps: ['21 + 15 + 21 + 15 = 72.'],
        answer: '72 cm.',
      },
      {
        title: 'An L-shape',
        situation:
          'An L-shaped garden has sides of 8, 2, 5, 4, 3 and 6 metres. Find its perimeter.',
        steps: ['Add every side: 8 + 2 + 5 + 4 + 3 + 6 = 28.'],
        answer: '28 m.',
      },
    ],
    mistakes: [
      {
        wrong: 'Missing a side of an L-shape.',
        right: 'Count every side as you go round.',
      },
    ],
    realLife: [
      'Fencing a garden.',
      'Putting a border on a notice board.',
      'Running around a field.',
    ],
    tryIt: {
      need: 'A tape measure',
      steps: [
        'Estimate the perimeter of your classroom in strides.',
        'Measure it in metres.',
        'Compare your estimate.',
      ],
    },
  },
  'mathematics-45': {
    indicator: {
      code: 'B5.3.2.1.3',
      text: 'Calculate the area of given shapes, including compound shapes, in square centimetres and square metres.',
    },
    hook: 'A classroom floor is 6 m by 4 m. How many 1 m² tiles will cover it?',
    explain: [
      'The area of a rectangle is length × width.',
      'For a compound shape, split it into rectangles.',
      'Find each area, then add them.',
    ],
    art: { kind: 'area', rows: 4, cols: 6, label: '6 × 4 = 24 square units' },
    artCaption: 'Length times width.',
    words: [
      { term: 'Area', meaning: 'The surface a shape covers.' },
      { term: 'Square metre (m²)', meaning: 'A square 1 m on each side.' },
      {
        term: 'Square centimetre (cm²)',
        meaning: 'A square 1 cm on each side.',
      },
    ],
    examples: [
      {
        title: 'The floor',
        situation: 'Find the area of a 6 m by 4 m floor.',
        steps: ['6 × 4 = 24.'],
        answer: '24 m², so 24 tiles.',
      },
      {
        title: 'An L-shape',
        situation:
          'An L-shape splits into an 8 m by 2 m rectangle and a 3 m by 4 m rectangle. Find its area.',
        steps: ['8 × 2 = 16.', '3 × 4 = 12.', '16 + 12 = 28.'],
        answer: '28 m².',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding length and width.',
        right: 'Multiply length by width for area.',
      },
    ],
    realLife: ['Tiling floors.', 'Buying land.', 'Painting walls.'],
    tryIt: {
      need: 'A tape measure',
      steps: [
        'Measure your desk top.',
        'Work out its area in cm².',
        'Draw an L-shape and find its area.',
      ],
    },
  },
  'mathematics-46': {
    indicator: {
      code: 'B5.3.2.2.1',
      text: 'Select and justify referents for cubic centimetres (cm³) and cubic metres (m³).',
    },
    hook: 'A sugar cube takes up about 1 cm³ of space. What takes up about 1 m³?',
    explain: [
      'Volume is the amount of space an object takes up.',
      'A cubic centimetre is a cube 1 cm on each side, about the size of a sugar cube.',
      'A cubic metre is a cube 1 m on each side, about the size of a big box or a small water tank.',
    ],
    art: {
      kind: 'cubes',
      length: 3,
      width: 2,
      height: 1,
      label: '6 cubes of 1 cm³: 6 cm³',
    },
    artCaption: 'Count the cubes to find the volume.',
    words: [
      { term: 'Volume', meaning: 'The space an object takes up.' },
      { term: 'Cubic centimetre (cm³)', meaning: 'A cube 1 cm on each side.' },
      { term: 'Cubic metre (m³)', meaning: 'A cube 1 m on each side.' },
    ],
    examples: [
      {
        title: 'Choose a unit',
        situation: 'Would you measure a matchbox in cm³ or m³?',
        steps: ['A matchbox is small.'],
        answer: 'Cubic centimetres (cm³).',
      },
      {
        title: 'A litre',
        situation: 'How many cm³ are in a 10 cm by 10 cm by 10 cm box?',
        steps: ['10 × 10 × 10 = 1000.'],
        answer: '1000 cm³, which holds 1 litre.',
      },
    ],
    mistakes: [
      { wrong: 'Measuring a room in cm³.', right: 'Use m³ for big spaces.' },
    ],
    realLife: ['Water tanks.', 'Packing boxes.', 'Bottles and cups.'],
    tryIt: {
      need: 'Sugar cubes or small blocks',
      steps: [
        'Find three objects for cm³.',
        'Find two objects for m³.',
        'Explain your choices.',
      ],
    },
  },
  'mathematics-47': {
    indicator: {
      code: 'B5.3.2.2.3',
      text: 'Determine the volume of boxes using 1 cm³ cubes, and find different boxes with the same volume.',
    },
    hook: 'You have 12 small cubes. How many different boxes can you build with all of them?',
    explain: [
      'Count the cubes on the bottom layer, then multiply by the number of layers.',
      'Volume = length × width × height.',
      'Different boxes can have the same volume.',
    ],
    art: {
      kind: 'cubes',
      length: 6,
      width: 2,
      height: 1,
      label: '6 × 2 × 1 = 12 cubes',
    },
    artCaption: 'One layer of 12 cubes.',
    words: [
      { term: 'Layer', meaning: 'One level of cubes.' },
      { term: 'Dimensions', meaning: 'Length, width and height.' },
      { term: 'Volume', meaning: 'The space inside a box.' },
    ],
    examples: [
      {
        title: 'Count the layers',
        situation:
          'A box has a base of 2 by 7 cubes and is 3 layers high. Find its volume.',
        steps: ['The base holds 2 × 7 = 14 cubes.', '14 × 3 = 42.'],
        answer: '42 cm³.',
      },
      {
        title: 'Twelve cubes',
        situation: 'Find boxes that hold exactly 12 cubes.',
        steps: [
          '1 × 1 × 12 = 12 and 1 × 2 × 6 = 12.',
          '1 × 3 × 4 = 12 and 2 × 2 × 3 = 12.',
        ],
        answer: 'Four different boxes.',
        art: {
          kind: 'cubes',
          length: 3,
          width: 2,
          height: 2,
          label: '3 × 2 × 2 = 12 cubes',
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Counting only the cubes you can see.',
        right: 'Multiply length × width × height to include hidden cubes.',
      },
    ],
    realLife: [
      'Packing boxes.',
      'Building with blocks.',
      'Filling water tanks.',
    ],
    tryIt: {
      need: '24 small cubes or sugar cubes',
      steps: [
        'Build as many boxes as you can with 24 cubes.',
        'Write the dimensions of each.',
        'Which looks most like a cube?',
      ],
    },
  },
  'mathematics-48': {
    indicator: {
      code: 'B5.3.3.3.2',
      text: 'Measure angles with a protractor and classify them by size.',
    },
    hook: 'An open door, a clock’s hands and a pair of scissors all make angles. How big are they?',
    explain: [
      'An angle measures a turn, in degrees (°).',
      'A right angle is 90°. An acute angle is less than 90°. An obtuse angle is between 90° and 180°.',
      'To measure, put the centre of the protractor on the corner, and line up 0 with one arm.',
    ],
    art: { kind: 'angle', degrees: 60, label: 'An acute angle: 60°' },
    artCaption: 'Smaller than a right angle.',
    words: [
      { term: 'Protractor', meaning: 'A tool for measuring angles.' },
      { term: 'Acute angle', meaning: 'Less than 90°.' },
      { term: 'Obtuse angle', meaning: 'More than 90° but less than 180°.' },
    ],
    examples: [
      {
        title: 'Classify it',
        situation: 'An angle measures 120°. What kind is it?',
        steps: ['120° is more than 90° but less than 180°.'],
        answer: 'Obtuse.',
        art: { kind: 'angle', degrees: 120, label: 'An obtuse angle: 120°' },
      },
      {
        title: 'In the classroom',
        situation: 'What angle does the corner of a book make?',
        steps: ['It is a square corner.'],
        answer: 'A right angle, 90°.',
      },
    ],
    mistakes: [
      {
        wrong: 'Reading the wrong scale on the protractor.',
        right: 'Start from 0 on the arm you lined up.',
      },
    ],
    realLife: ['Opening doors.', 'Roof slopes.', 'Clock hands.'],
    tryIt: {
      need: 'A protractor and paper',
      steps: [
        'Draw angles of 30°, 90° and 150°.',
        'Label each as acute, right or obtuse.',
        'Find three angles in your classroom.',
      ],
    },
  },
  'mathematics-49': {
    indicator: {
      code: 'B5.3.4.1.1',
      text: 'Tell the position and motion of objects using the cardinal points north, south, east and west.',
    },
    hook: 'A visitor asks the way from Kofi’s house to the market. Can you give clear directions?',
    explain: [
      'The four cardinal points are north, east, south and west.',
      'On most maps, north is at the top.',
      'Give directions by saying how far to move and in which direction.',
    ],
    art: { kind: 'compass', label: 'North is at the top of the map' },
    artCaption: 'North, east, south and west.',
    words: [
      { term: 'Cardinal points', meaning: 'North, east, south and west.' },
      { term: 'Grid', meaning: 'Squares on a map that help find places.' },
      { term: 'Direction', meaning: 'The way to go.' },
    ],
    examples: [
      {
        title: 'Follow the directions',
        situation:
          'From Kofi’s house, move 2 squares east, then 3 squares north. You reach the market. Where is the market from the house?',
        steps: ['East is to the right, north is up.'],
        answer: 'North-east of the house.',
      },
      {
        title: 'Turn around',
        situation:
          'You face east and turn half way round. Which way do you face?',
        steps: ['The opposite of east is west.'],
        answer: 'West.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up east and west on a map.',
        right: 'With north at the top, east is on the right.',
      },
    ],
    realLife: [
      'Giving directions.',
      'Reading maps.',
      'Finding a house in a new town.',
    ],
    tryIt: {
      need: 'Squared paper',
      steps: [
        'Draw a map of your area with north at the top.',
        'Mark your home and school.',
        'Write directions from one to the other.',
      ],
    },
  },
  'mathematics-50': {
    indicator: {
      code: 'B5.3.4.2.2',
      text: 'Identify images of a single reflection of 2D shapes in a plane.',
    },
    hook: 'When you look in a mirror, your right hand looks like a left hand. That is reflection!',
    explain: [
      'A reflection flips a shape over a mirror line.',
      'The image is the same size and shape, but faces the other way.',
      'Each point of the image is as far from the mirror line as the original point.',
    ],
    art: { kind: 'reflect' },
    artCaption: 'The blue shape is the image of the red shape.',
    words: [
      { term: 'Reflection', meaning: 'A flip over a mirror line.' },
      { term: 'Mirror line', meaning: 'The line a shape is flipped over.' },
      { term: 'Image', meaning: 'The shape after it is reflected.' },
    ],
    examples: [
      {
        title: 'Find the image',
        situation:
          'A square is 2 squares left of the mirror line. Where is its image?',
        steps: ['The image is the same distance away, on the other side.'],
        answer: '2 squares right of the mirror line.',
      },
    ],
    mistakes: [
      {
        wrong: 'Sliding the shape across instead of flipping it.',
        right: 'A reflection faces the opposite way.',
      },
    ],
    realLife: ['Mirrors.', 'Reflections in still water.', 'Patterns in cloth.'],
    tryIt: {
      need: 'Squared paper and a mirror',
      steps: [
        'Draw a mirror line and a shape on one side.',
        'Draw its reflection.',
        'Check with a mirror.',
      ],
    },
  },
  'mathematics-51': {
    indicator: {
      code: 'B5.4.1.1.1',
      text: 'Explain the difference between first-hand and second-hand data.',
    },
    hook: 'Your class measures rainfall every day for a week. A newspaper also prints rainfall figures. How are these different?',
    explain: [
      'First-hand data is data you collect yourself, by counting, measuring or asking.',
      'Second-hand data is data someone else collected, such as in newspapers or on websites.',
      'Both are useful, but we should check where second-hand data comes from.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Mon', 12],
        ['Tue', 0],
        ['Wed', 8],
        ['Thu', 20],
        ['Fri', 5],
      ],
      label: 'Rainfall we measured (mm)',
    },
    artCaption: 'This is first-hand data.',
    words: [
      { term: 'First-hand data', meaning: 'Data you collect yourself.' },
      { term: 'Second-hand data', meaning: 'Data collected by someone else.' },
      { term: 'Source', meaning: 'Where data comes from.' },
    ],
    examples: [
      {
        title: 'Which kind?',
        situation:
          'You read a football league table in a newspaper. What kind of data is it?',
        steps: ['You did not collect it yourself.'],
        answer: 'Second-hand data.',
      },
      {
        title: 'Read the chart',
        situation: 'How much rain fell from Monday to Friday?',
        steps: ['12 + 0 + 8 + 20 + 5 = 45.'],
        answer: '45 mm.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking data from the internet is always correct.',
        right: 'Check who collected it and when.',
      },
    ],
    realLife: ['Weather reports.', 'League tables.', 'School surveys.'],
    tryIt: {
      need: 'A cup and a ruler',
      steps: [
        'Collect first-hand data, such as rainfall or favourite foods.',
        'Find some second-hand data in a newspaper.',
        'Compare the two.',
      ],
    },
  },
  'mathematics-52': {
    indicator: {
      code: 'B5.4.1.2.1',
      text: 'Draw double bar graphs with a title, labelled axes and a key, to answer questions.',
    },
    hook: 'Do boys and girls in your class like the same sports? A double bar graph can show both at once.',
    explain: [
      'A double bar graph shows two sets of data side by side.',
      'A key tells which colour stands for which set.',
      'It makes comparing the two groups easy.',
    ],
    art: {
      kind: 'doubleBars',
      keys: ['Boys', 'Girls'],
      rows: [
        ['Football', 12, 5],
        ['Netball', 2, 9],
        ['Athletics', 6, 7],
      ],
      label: 'Favourite sports in Class 5',
    },
    artCaption: 'Red bars are boys, blue bars are girls.',
    words: [
      {
        term: 'Double bar graph',
        meaning: 'A graph with two bars for each category.',
      },
      { term: 'Key', meaning: 'Tells what each colour means.' },
      { term: 'Axis', meaning: 'A line along the side or bottom of a graph.' },
    ],
    examples: [
      {
        title: 'Compare',
        situation: 'Which sport do girls like more than boys?',
        steps: ['Netball: girls 9, boys 2.', 'Athletics: girls 7, boys 6.'],
        answer: 'Netball and athletics.',
      },
      {
        title: 'How many?',
        situation: 'How many pupils chose football?',
        steps: ['12 + 5 = 17.'],
        answer: '17 pupils.',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out the key.',
        right: 'Without a key, readers cannot tell the bars apart.',
      },
    ],
    realLife: [
      'Comparing results of two years.',
      'Sales of two shops.',
      'Boys’ and girls’ choices.',
    ],
    tryIt: {
      need: 'Paper and coloured pencils',
      steps: [
        'Ask boys and girls their favourite fruit.',
        'Draw a double bar graph with a title, axes and a key.',
        'Write two things it shows.',
      ],
    },
  },
  'mathematics-53': {
    indicator: {
      code: 'B5.4.2.1.1',
      text: 'Classify the likelihood of an outcome as impossible, possible or certain.',
    },
    hook: 'Will the sun rise tomorrow? Will it rain? Will a goat fly? Some things are certain, some are possible, and some are impossible.',
    explain: [
      'Impossible means it cannot happen.',
      'Certain means it will definitely happen.',
      'Possible means it might happen. It can be likely or unlikely.',
    ],
    art: {
      kind: 'spinner',
      sectors: ['red', 'red', 'red', 'blue'],
      label: 'Landing on red is likely',
    },
    artCaption: 'Three red parts and one blue part.',
    words: [
      { term: 'Impossible', meaning: 'Cannot happen.' },
      { term: 'Certain', meaning: 'Will definitely happen.' },
      { term: 'Likely', meaning: 'Will probably happen.' },
    ],
    examples: [
      {
        title: 'The spinner',
        situation: 'On this spinner, how likely is red, blue and green?',
        steps: [
          'Red covers three parts, blue covers one, and there is no green.',
        ],
        answer: 'Red is likely, blue is unlikely, and green is impossible.',
      },
      {
        title: 'A day of the week',
        situation: 'How likely is it that tomorrow comes after today?',
        steps: ['This always happens.'],
        answer: 'Certain.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying “possible” means it will happen.',
        right: 'Possible means it might happen.',
      },
    ],
    realLife: ['Weather forecasts.', 'Games with dice.', 'Making plans.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write two impossible, two possible and two certain events.',
        'Share them with a friend.',
        'Agree on each one.',
      ],
    },
  },
  'mathematics-54': {
    indicator: {
      code: 'B5.4.2.1.2',
      text: 'Design and conduct an experiment in which the likelihood of a single outcome changes.',
    },
    hook: 'If you change the colours on a spinner, does red become easier or harder to get? Let us test it!',
    explain: [
      'An experiment is a fair test that we repeat many times.',
      'Record each result with a tally.',
      'Change one thing, such as the colours on a spinner, and see how the results change.',
    ],
    art: {
      kind: 'spinner',
      sectors: ['red', 'blue', 'yellow', 'green'],
      label: 'Each colour has the same chance',
    },
    artCaption: 'Four equal parts.',
    words: [
      { term: 'Experiment', meaning: 'A test to find something out.' },
      { term: 'Outcome', meaning: 'A possible result.' },
      { term: 'Trial', meaning: 'One go of an experiment.' },
    ],
    examples: [
      {
        title: 'Change the spinner',
        situation:
          'Red is one of four equal parts. You colour a second part red. What happens?',
        steps: ['Red now covers half the spinner.', 'Red becomes more likely.'],
        answer: 'You will get red more often.',
      },
      {
        title: 'Toss a coin',
        situation:
          'You toss a coin 20 times. About how many heads would you expect?',
        steps: ['Heads and tails are equally likely.', '20 ÷ 2 = 10.'],
        answer: 'About 10, but it may not be exactly 10.',
      },
    ],
    mistakes: [
      {
        wrong: 'Expecting exact results every time.',
        right: 'Results vary, but more trials give a clearer picture.',
      },
    ],
    realLife: ['Games of chance.', 'Weather forecasting.', 'Testing seeds.'],
    tryIt: {
      need: 'A paper spinner and a pencil',
      steps: [
        'Spin 20 times and tally the colours.',
        'Recolour the spinner so red covers half.',
        'Spin 20 times again and compare.',
      ],
    },
  },
}
