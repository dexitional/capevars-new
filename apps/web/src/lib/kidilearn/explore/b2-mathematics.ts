import type { CourseGuides } from './types'

// Basic 2 Mathematics, indicator by indicator, from the NaCCA Mathematics
// Curriculum for Primary Schools (2019). Scope notes worth keeping:
// - Fractions are in words and pictures only. The curriculum says "exclude
//   notation" until Basic 3, so nothing here writes a fraction with a slash.
// - Comparing is to 100, and counting and place value go to 1000.
// - Measuring uses body parts and objects. Standard units are only introduced as
//   a need, not used.
// - Its example 26 + 39 misprints 26 + 40 as 76. It is 66, so the answer is 65.

export const guides: CourseGuides = {
  'mathematics-01': {
    indicator: {
      code: 'B2.1.1.1.1',
      text: 'Use number names, counting sequences and how to count to find out “how many?”',
    },
    hook: 'Kojo’s mother has a big basket of oranges to sell. Counting them one by one takes a long time. How can Kojo count faster?',
    explain: [
      'Skip counting means jumping over numbers as you count. When you count by 5s, you say 5, 10, 15, 20. You do not say the numbers in between.',
      'You can skip count backwards too: 1000, 990, 980, 970. Each jump takes away 10.',
      'An estimate is a clever guess. You look at a small part, count it, and use it to think about the whole group.',
    ],
    art: {
      kind: 'groups',
      groups: 6,
      each: 5,
      label: '6 heaps of 5: 5, 10, 15, 20, 25, 30',
    },
    artCaption: 'Heaps of 5 make counting quick.',
    words: [
      {
        term: 'Skip count',
        meaning: 'Count in equal jumps, such as 2s, 5s or 10s.',
      },
      {
        term: 'Estimate',
        meaning: 'A careful guess of how many, before you count.',
      },
      { term: 'How many?', meaning: 'The question counting answers.' },
    ],
    examples: [
      {
        title: 'Count the oranges',
        situation:
          'Kojo puts the oranges in 6 heaps. Each heap has 5 oranges. How many oranges are there?',
        steps: ['Count one jump for each heap.', 'Say 5, 10, 15, 20, 25, 30.'],
        answer: 'There are 30 oranges.',
        art: { kind: 'groups', groups: 6, each: 5 },
      },
      {
        title: 'Find the mistake',
        situation: 'Ama counts by 10s: 100, 110, 130, 140. What went wrong?',
        steps: [
          'Each jump should add 10.',
          '100 to 110 is a jump of 10.',
          '110 to 130 is a jump of 20, so a number is missing.',
        ],
        answer: 'Ama missed 120.',
      },
      {
        title: 'Estimate the bottle caps',
        situation:
          'One row in a tray has 10 caps. There are 8 rows like it. About how many caps are in the tray?',
        steps: [
          'Count by 10s, one jump for each row.',
          '10, 20, 30, 40, 50, 60, 70, 80.',
        ],
        answer: 'There are about 80 caps.',
      },
    ],
    mistakes: [
      {
        wrong: 'Counting by 5s and saying 5, 10, 15, 25.',
        right: 'Say every jump in order: 5, 10, 15, 20, 25.',
      },
      {
        wrong: 'Thinking a good estimate must be exactly right.',
        right: 'An estimate only needs to be close. Count afterwards to check.',
      },
    ],
    realLife: [
      'Counting money in 5 cedi notes.',
      'Counting pairs of shoes by 2s.',
      'Counting bundles of 10 exercise books at school.',
    ],
    tryIt: {
      need: 'About 50 bottle caps, stones or seeds',
      steps: [
        'Guess how many you have and say your guess.',
        'Put them in groups of 5.',
        'Count by 5s, then add any left over.',
        'How close was your guess?',
      ],
    },
  },
  'mathematics-02': {
    indicator: {
      code: 'B2.1.1.1.2',
      text: 'Identify numbers in different positions around a given number in a number chart (1–1000).',
    },
    hook: 'Numbers on a number chart live on a street. Every number has neighbours. Can you find who lives next door to 18?',
    explain: [
      'A number chart puts numbers in rows of ten. Moving one square to the right adds 1. Moving one square to the left takes away 1.',
      'Moving one square down adds 10. Moving one square up takes away 10.',
      'These rules work for big numbers too, all the way to 1000.',
    ],
    art: { kind: 'chart', start: 1, focus: 18 },
    artCaption:
      'The neighbours of 18 are 8 above, 28 below, 17 on the left and 19 on the right.',
    words: [
      {
        term: 'Neighbour',
        meaning: 'A number right beside another number on the chart.',
      },
      { term: 'Row', meaning: 'Numbers going across.' },
      { term: 'Column', meaning: 'Numbers going down.' },
    ],
    examples: [
      {
        title: 'The neighbours of 18',
        situation: 'Find the numbers above, below, left and right of 18.',
        steps: [
          'Above: 18 − 10 = 8.',
          'Below: 18 + 10 = 28.',
          'Left: 18 − 1 = 17.',
          'Right: 18 + 1 = 19.',
        ],
        answer: '8, 28, 17 and 19.',
        art: { kind: 'chart', start: 1, focus: 18 },
      },
      {
        title: 'A bigger number',
        situation:
          'Imagine the chart reaches 345. What is below 345 and what is to its left?',
        steps: [
          'Below adds 10: 345 + 10 = 355.',
          'Left takes away 1: 345 − 1 = 344.',
        ],
        answer: '355 is below and 344 is on the left.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the number below is 1 more.',
        right: 'Going down one row adds 10. Going right adds 1.',
      },
    ],
    realLife: [
      'Finding a seat number in a row at church or the stadium.',
      'Finding a house on a numbered street.',
      'Finding a page near the one you want in a book.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Draw a chart of the numbers 1 to 30, in rows of ten.',
        'Circle any number.',
        'Ask a friend to name its four neighbours.',
        'Check using the add 1 and add 10 rules.',
      ],
    },
  },
  'mathematics-03': {
    indicator: {
      code: 'B2.1.1.1.3',
      text: 'Use number names and non-standard units for measuring lengths and volumes to count and find out “how long or how much?”',
    },
    hook: 'You have no ruler, but you want to know how long your table is. Your own hands can help you find out!',
    explain: [
      'To measure means to find out how long something is, or how much it can hold.',
      'You can measure length with hand spans, feet, strides or a stick. Place them end to end, with no gaps, and count them.',
      'You can measure how much a container holds using a cup or a bottle. Fill it, pour it in, and count each one.',
    ],
    art: {
      kind: 'measure',
      unit: 'hand',
      count: 6,
      label: 'The table is 6 hand spans long.',
    },
    artCaption: 'Count each hand span along the table.',
    words: [
      {
        term: 'Measure',
        meaning: 'Find out how long something is, or how much it holds.',
      },
      {
        term: 'Hand span',
        meaning:
          'The distance from your thumb to your little finger when your hand is stretched.',
      },
      { term: 'Stride', meaning: 'One long step.' },
    ],
    examples: [
      {
        title: 'How long is the table?',
        situation:
          'Esi stretches her hand along a table. She moves it along 6 times.',
        steps: [
          'Begin at one edge of the table.',
          'Put each hand span where the last one ended.',
          'Count 1, 2, 3, 4, 5, 6.',
        ],
        answer: 'The table is 6 of Esi’s hand spans long.',
        art: { kind: 'measure', unit: 'hand', count: 6 },
      },
      {
        title: 'How much does the bucket hold?',
        situation:
          'Yaw fills a bucket using a cup. He pours in 9 cups before it is full.',
        steps: [
          'Fill the cup each time.',
          'Pour it into the bucket and count.',
          'Stop when the bucket is full.',
        ],
        answer: 'The bucket holds 9 cups.',
        art: { kind: 'fill', cups: 9 },
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving gaps between your hand spans.',
        right: 'Start each one exactly where the last one ended.',
      },
      {
        wrong: 'Using a half-full cup.',
        right: 'Fill the cup the same way each time.',
      },
    ],
    realLife: [
      'Measuring cloth by arm length at the market.',
      'Pacing out a goal post for football.',
      'Using an olonka or cup to measure rice.',
    ],
    tryIt: {
      need: 'A cup, a bottle and some water',
      steps: [
        'Guess how many cups will fill the bottle.',
        'Fill it one cup at a time, outside or over a basin.',
        'Count each cup.',
        'Compare your guess and your count.',
      ],
    },
  },
  'mathematics-04': {
    indicator: {
      code: 'B2.1.1.1.4',
      text: 'Demonstrate a conceptual understanding of place value of whole numbers.',
    },
    hook: 'Look at 4 in 43 and 4 in 34. It is the same digit, so why is one worth so much more than the other?',
    explain: [
      'The place of a digit tells you what it is worth. In 43, the 4 is in the tens place, so it means 4 tens, or forty.',
      'Ten ones make one ten. Ten tens make one hundred.',
      'You can break a number into parts: 153 is 100 + 50 + 3. Read it as one hundred and fifty-three, not one, five, three.',
    ],
    art: {
      kind: 'caps',
      hundreds: 1,
      tens: 5,
      ones: 3,
      label: '153 = 100 + 50 + 3',
    },
    artCaption: 'A full board is 100, a string is 10, and a loose cap is 1.',
    words: [
      {
        term: 'Digit',
        meaning: 'One of the symbols 0 to 9 that we use to write numbers.',
      },
      {
        term: 'Place value',
        meaning: 'What a digit is worth because of where it stands.',
      },
      {
        term: 'Hundreds, tens, ones',
        meaning: 'The names of the first three places in a number.',
      },
    ],
    examples: [
      {
        title: 'Break up 245',
        situation: 'Show 245 with bottle caps.',
        steps: [
          'The 2 means 2 hundreds, which is 200.',
          'The 4 means 4 tens, which is 40.',
          'The 5 means 5 ones.',
        ],
        answer: '245 = 200 + 40 + 5',
        art: { kind: 'caps', hundreds: 2, tens: 4, ones: 5 },
      },
      {
        title: 'More than one way',
        situation: 'Break 47 into parts in two different ways.',
        steps: [
          'One way: 40 + 7.',
          'Another way: 20 + 20 + 7.',
          'Both ways still make 47.',
        ],
        answer: '47 = 40 + 7 = 20 + 20 + 7',
      },
    ],
    mistakes: [
      {
        wrong: 'Reading 43 as four, three.',
        right: 'Read it as forty-three, because the 4 means four tens.',
      },
      {
        wrong: 'Thinking the 4 in 34 and the 4 in 43 are worth the same.',
        right: 'In 34 it means 4 ones. In 43 it means 40.',
      },
    ],
    realLife: [
      'Reading the price of an item in the shop.',
      'Bundling sticks into tens for counting.',
      'Saying a house or bus number correctly.',
    ],
    tryIt: {
      need: 'Bottle caps or sticks, and string',
      steps: [
        'Count out 34 caps.',
        'Make groups of ten and tie or thread them.',
        'How many tens and how many ones are there?',
        'Say the number, then write it in parts.',
      ],
    },
  },
  'mathematics-05': {
    indicator: {
      code: 'B2.1.1.1.5',
      text: 'Represent number quantities up to 1000 in equivalent ways, focusing on place value and equality.',
    },
    hook: 'A number can wear many costumes. 147 can also be “3 less than 150”. It is still the same number!',
    explain: [
      'Equivalent means having the same value. You can describe one number in many ways.',
      '147 is 3 less than 150, and it is 7 more than 140. It is a little bigger than 145, but a lot bigger than 15.',
      'You can also arrange objects in equal groups. Sometimes a few are left over.',
    ],
    art: {
      kind: 'groups',
      groups: 6,
      each: 11,
      label: '66 is six groups of 11.',
    },
    artCaption: 'The same 66 caps can be grouped in more than one way.',
    words: [
      {
        term: 'Equivalent',
        meaning: 'Different ways of showing the same amount.',
      },
      {
        term: 'Equal groups',
        meaning: 'Groups that each have the same number.',
      },
      {
        term: 'Left over',
        meaning: 'What remains when no more equal groups can be made.',
      },
    ],
    examples: [
      {
        title: 'Describe 147',
        situation: 'Tell us about 147 using nearby numbers.',
        steps: [
          '147 + 3 = 150, so it is 3 less than 150.',
          '140 + 7 = 147, so it is 7 more than 140.',
        ],
        answer: '147 is 3 less than 150 and 7 more than 140.',
      },
      {
        title: 'Group 66 caps',
        situation: 'Put 66 caps into equal groups in different ways.',
        steps: [
          '2 groups of 33 make 66.',
          '6 groups of 11 make 66.',
          '5 groups of 12 make 60, so 6 caps are left over.',
        ],
        answer: 'Each way still uses all 66 caps.',
        art: { kind: 'groups', groups: 5, each: 12, left: 6 },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a number changes when you group it differently.',
        right: 'The groups change, but the total stays the same.',
      },
    ],
    realLife: [
      'Sharing sweets into equal bags for friends.',
      'Saying a price is “nearly 50 cedis”.',
      'Arranging chairs in equal rows.',
    ],
    tryIt: {
      need: '24 stones or seeds',
      steps: [
        'Make equal groups of 2. How many groups do you have?',
        'Try groups of 3, 4 and 6.',
        'Try groups of 5. How many are left over?',
      ],
    },
  },
  'mathematics-06': {
    indicator: {
      code: 'B2.1.1.1.6',
      text: 'Use place value to compare and order whole numbers up to 100, using comparative language, numbers and symbols (>, < or =).',
    },
    hook: 'Ahmed has 23 chickens and Amina has 46. Who has more? How can you be sure without counting every chicken?',
    explain: [
      'Look at the tens first. The number with more tens is bigger.',
      'If the tens are the same, look at the ones.',
      'The sign > means “is greater than”. The sign < means “is less than”. The sign = means “is equal to”. The open side of the sign faces the bigger number.',
    ],
    art: { kind: 'compare', a: 23, b: 46 },
    artCaption: '23 has 2 tens and 46 has 4 tens, so 23 is less than 46.',
    words: [
      { term: 'Greater than (>)', meaning: 'Bigger than another number.' },
      { term: 'Less than (<)', meaning: 'Smaller than another number.' },
      {
        term: 'Order',
        meaning:
          'Put numbers in a line from smallest to biggest, or biggest to smallest.',
      },
    ],
    examples: [
      {
        title: 'Chickens',
        situation: 'Ahmed has 23 chickens and Amina has 46.',
        steps: [
          '23 has 2 tens. 46 has 4 tens.',
          '4 tens is more than 2 tens.',
          'So 46 > 23.',
        ],
        answer: 'Amina has more chickens.',
        art: { kind: 'compare', a: 46, b: 23 },
      },
      {
        title: 'Same tens',
        situation: 'Compare 37 and 34.',
        steps: [
          'Both have 3 tens.',
          'Now compare the ones: 7 ones is more than 4 ones.',
        ],
        answer: '37 > 34',
      },
      {
        title: 'Put them in order',
        situation: 'Order 42, 37 and 34 from smallest to biggest.',
        steps: [
          'Find the fewest tens: 37 and 34 have 3 tens.',
          'Of these, 34 has fewer ones, so it comes first.',
          'Then 37, and then 42.',
        ],
        answer: '34, 37, 42',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying 29 is bigger than 31 because 9 is big.',
        right: 'Compare the tens first: 3 tens is more than 2 tens.',
      },
      {
        wrong: 'Turning the sign the wrong way.',
        right: 'The open side of the sign always faces the bigger number.',
      },
    ],
    realLife: [
      'Comparing the price of two items.',
      'Seeing which team scored more goals.',
      'Lining up from the lowest ticket number.',
    ],
    tryIt: {
      need: 'Number cards from 1 to 9',
      steps: [
        'Pick two cards to make a 2-digit number.',
        'A friend does the same.',
        'Say whose number is greater, and why.',
        'Write it using > or <.',
      ],
    },
  },
  'mathematics-07': {
    indicator: {
      code: 'B2.1.2.1.1',
      text: 'Use conceptual understanding of addition and subtraction to add and subtract numbers to 100.',
    },
    hook: 'If you pick 35 mangoes and then 54 more, or 54 first and then 35, do you end up with a different number?',
    explain: [
      'You can add numbers in any order and the sum stays the same. 35 + 54 and 54 + 35 are both 89.',
      'Adding 0 or taking away 0 does not change a number: 27 + 0 = 27 and 55 − 0 = 55.',
      'Addition and subtraction undo each other. If 7 + 5 = 12, then 12 − 5 = 7.',
    ],
    art: { kind: 'balance', left: '35 + 54', right: '54 + 35', equal: true },
    artCaption: 'The order changes, but the sum does not.',
    words: [
      { term: 'Sum', meaning: 'The answer when you add.' },
      { term: 'Difference', meaning: 'The answer when you subtract.' },
      {
        term: 'Missing number',
        meaning: 'A number you must work out to make a sentence true.',
      },
    ],
    examples: [
      {
        title: 'Add in a different order',
        situation: 'Work out 18 + 12 + 3, then 3 + 18 + 12.',
        steps: [
          '18 + 12 = 30, and 30 + 3 = 33.',
          '3 + 18 = 21, and 21 + 12 = 33.',
        ],
        answer: 'Both are 33.',
      },
      {
        title: 'Find the missing number',
        situation:
          'Abena had 34 beads and got some more. Now she has 57. Write 34 + ___ = 57.',
        steps: [
          'Count up from 34 to 54. That is 20.',
          'Count up from 54 to 57. That is 3.',
          '20 + 3 = 23.',
        ],
        answer: 'She got 23 beads. 34 + 23 = 57.',
      },
      {
        title: 'Make up your own',
        situation: 'Write a sum and a story with the answer 53.',
        steps: [
          'Choose two numbers that make 53: 50 + 3.',
          'Tell a story about them.',
        ],
        answer: 'Kofi has 50 cedis and earns 3 more. Now he has 53 cedis.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking subtraction works in any order.',
        right: 'Only addition does. 9 − 4 is not the same as 4 − 9.',
      },
      {
        wrong: 'Thinking 27 + 0 = 0.',
        right: 'Adding nothing leaves the number as it was.',
      },
    ],
    realLife: [
      'Adding your money in any order.',
      'Working out how many more you need.',
      'Checking change by adding back.',
    ],
    tryIt: {
      need: 'Two heaps of stones',
      steps: [
        'Count each heap and write the sum.',
        'Add them in the other order.',
        'Take one heap away. Which number is left?',
        'Say what you notice.',
      ],
    },
  },
  'mathematics-08': {
    indicator: {
      code: 'B2.1.2.2.1',
      text: 'Use the concept of “equal to” and “not equal to” to solve addition and subtraction problems with sums up to 100.',
    },
    hook: 'A market scale tips when one side is heavier. Number sentences work the same way. Are both sides really equal?',
    explain: [
      'The sign = means both sides have the same value. It does not just mean “here comes the answer”.',
      'The sign ≠ means “not equal to”. 16 ≠ 8 + 5, because 8 + 5 is 13.',
      'You can turn a subtraction into an addition. 40 − 28 asks the same thing as 28 + what = 40.',
    ],
    art: { kind: 'balance', left: '16', right: '8 + 5', equal: false },
    artCaption: 'The sides do not match, so we write 16 ≠ 8 + 5.',
    words: [
      { term: 'Equal to (=)', meaning: 'Both sides have the same value.' },
      {
        term: 'Not equal to (≠)',
        meaning: 'The two sides have different values.',
      },
      {
        term: 'Number sentence',
        meaning: 'Numbers and signs that say something, such as 8 + 5 = 13.',
      },
    ],
    examples: [
      {
        title: 'Equal or not?',
        situation: 'Is 8 + 5 the same as 10 + 3?',
        steps: ['8 + 5 = 13.', '10 + 3 = 13.', 'Both sides are 13.'],
        answer: '8 + 5 = 10 + 3',
        art: { kind: 'balance', left: '8 + 5', right: '10 + 3', equal: true },
      },
      {
        title: 'Change a subtraction',
        situation: 'Work out 40 − 28 by adding.',
        steps: [
          'Write it as 28 + ___ = 40.',
          '28 + 2 = 30.',
          '30 + 10 = 40.',
          '2 + 10 = 12.',
        ],
        answer: '40 − 28 = 12',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking = always comes before the answer.',
        right: '13 = 8 + 5 is also true. Both sides just need to match.',
      },
    ],
    realLife: [
      'Sharing sweets so that two friends have equal amounts.',
      'Checking that two piles of money are the same.',
      'Balancing goods on a market scale.',
    ],
    tryIt: {
      need: 'Stones and two plates',
      steps: [
        'Put 7 stones on one plate and 7 on the other. Write =.',
        'Move one stone across. Write ≠.',
        'Explain what changed and why.',
      ],
    },
  },
  'mathematics-09': {
    indicator: {
      code: 'B2.1.2.3.1',
      text: 'Use mental strategies for basic addition facts to 19 and related subtraction facts.',
    },
    hook: 'Can you add 7 + 5 without using your fingers? Your brain has some clever shortcuts!',
    explain: [
      'Making ten is easy to add with. Break a number up to fill a ten: 7 + 5 = 7 + 3 + 2 = 12.',
      'Doubles are easy to remember, such as 6 + 6 = 12. Use a double that is close: 4 + 5 = 4 + 4 + 1 = 9.',
      'To subtract, count down from the big number, or change it to an addition. For 7 − 3, think 3 + ___ = 7.',
    ],
    art: {
      kind: 'tenframe',
      first: 7,
      second: 5,
      label: '7 + 5: fill the ten, then 2 more makes 12',
    },
    artCaption: 'Three of the blue caps fill the first ten. Two are left.',
    words: [
      { term: 'Mental maths', meaning: 'Working out an answer in your head.' },
      { term: 'Double', meaning: 'A number added to itself.' },
      { term: 'Make ten', meaning: 'Find what joins a number to reach 10.' },
    ],
    examples: [
      {
        title: 'Make a ten',
        situation: 'Work out 8 + 6.',
        steps: [
          '8 needs 2 more to make 10.',
          'Take 2 from the 6. That leaves 4.',
          '10 + 4 = 14.',
        ],
        answer: '8 + 6 = 14',
        art: { kind: 'tenframe', first: 8, second: 6 },
      },
      {
        title: 'Use a double',
        situation: 'Work out 6 + 7.',
        steps: [
          'You know 6 + 6 = 12.',
          '7 is one more than 6.',
          '12 + 1 = 13.',
        ],
        answer: '6 + 7 = 13',
      },
      {
        title: 'Count down',
        situation: 'Work out 15 − 3.',
        steps: ['Start at the big number, 15.', 'Count back 3: 14, 13, 12.'],
        answer: '15 − 3 = 12',
      },
    ],
    mistakes: [
      {
        wrong: 'Counting the first number when you count back.',
        right: 'Start at 15, and say 14 as your first step back.',
      },
    ],
    realLife: [
      'Working out your change quickly.',
      'Adding scores in a game of oware.',
      'Counting how many more children are needed for a team.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'One says a number from 1 to 12.',
        'The other says its double as fast as possible.',
        'Swap turns. Next, try “what makes 10?”',
      ],
    },
  },
  'mathematics-10': {
    indicator: {
      code: 'B2.1.2.4.1',
      text: 'Use a conventional strategy to add and subtract within 100.',
    },
    hook: 'What can you do when the ones add up to more than 9? You trade ten of them for one ten!',
    explain: [
      'Write the numbers in a frame, with tens under tens and ones under ones. Always start with the ones.',
      'When the ones make 10 or more, trade ten ones for one ten and carry it to the tens. This is called regrouping.',
      'When subtracting, if you do not have enough ones, trade one ten for ten ones.',
    ],
    art: {
      kind: 'frame',
      sign: '+',
      rows: [
        [4, 7],
        [3, 6],
      ],
      answer: [8, 3],
    },
    artCaption: '7 + 6 = 13. Write 3 and carry 1 ten. Then 4 + 3 + 1 = 8 tens.',
    words: [
      {
        term: 'Regroup',
        meaning: 'Trade ten ones for one ten, or one ten for ten ones.',
      },
      {
        term: 'Frame',
        meaning: 'A table that keeps tens and ones in their own columns.',
      },
    ],
    examples: [
      {
        title: 'No trading needed',
        situation: 'Work out 34 + 25.',
        steps: ['Ones: 4 + 5 = 9.', 'Tens: 3 + 2 = 5.'],
        answer: '34 + 25 = 59',
        art: {
          kind: 'frame',
          sign: '+',
          rows: [
            [3, 4],
            [2, 5],
          ],
          answer: [5, 9],
        },
      },
      {
        title: 'Trade ones for a ten',
        situation: 'Work out 47 + 36.',
        steps: [
          'Ones: 7 + 6 = 13. Write 3 and carry 1 ten.',
          'Tens: 4 + 3 + 1 = 8.',
        ],
        answer: '47 + 36 = 83',
        art: {
          kind: 'frame',
          sign: '+',
          rows: [
            [4, 7],
            [3, 6],
          ],
          answer: [8, 3],
        },
      },
      {
        title: 'Trade a ten for ones',
        situation: 'Work out 52 − 27.',
        steps: [
          'You cannot take 7 from 2, so trade 1 ten. Now there are 4 tens and 12 ones.',
          'Ones: 12 − 7 = 5.',
          'Tens: 4 − 2 = 2.',
        ],
        answer: '52 − 27 = 25',
        art: {
          kind: 'frame',
          sign: '−',
          rows: [
            [5, 2],
            [2, 7],
          ],
          answer: [2, 5],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to add the ten you carried.',
        right: 'Write the carried 1 above the tens so you remember it.',
      },
      {
        wrong: 'In 52 − 27, doing 7 − 2 because it looks easier.',
        right:
          'Always take the bottom number away from the top. Trade if you need to.',
      },
    ],
    realLife: [
      'Adding two prices.',
      'Working out how many eggs remain in a crate.',
      'Adding the scores of two teams.',
    ],
    tryIt: {
      need: 'Sticks tied in tens and some loose sticks',
      steps: [
        'Make 47 and 36 with your sticks.',
        'Put the loose sticks together.',
        'Tie ten of them into a new bundle.',
        'Count the tens and ones. Do you get 83?',
      ],
    },
  },
  'mathematics-11': {
    indicator: {
      code: 'B2.1.2.4.2',
      text: 'Use personal strategies to add and subtract within 100.',
    },
    hook: 'There is more than one road to the same answer. Which road would you choose for 26 + 39?',
    explain: [
      'Split the numbers: 28 + 47 is 20 + 40 + 8 + 7. That is 60 + 15, which makes 75.',
      'Friendly jumps: start at one number and jump by easy amounts, such as tens.',
      'Make a friendly number: 26 + 39 is close to 26 + 40. That gives 66. You added 1 too many, so take it away to get 65.',
    ],
    art: {
      kind: 'jumps',
      start: 26,
      jumps: [10, 10, 10, 2],
      label: '26 + 32 in friendly jumps: 58',
    },
    artCaption: 'Jump three tens and then 2 ones.',
    words: [
      { term: 'Strategy', meaning: 'A plan for solving a problem.' },
      {
        term: 'Friendly number',
        meaning: 'A number that is easy to work with, such as 30 or 40.',
      },
    ],
    examples: [
      {
        title: 'Friendly jumps',
        situation: 'Work out 26 + 32.',
        steps: [
          'Start at 26.',
          'Jump 10 three times: 36, 46, 56.',
          'Jump 2 more: 58.',
        ],
        answer: '26 + 32 = 58',
        art: { kind: 'jumps', start: 26, jumps: [10, 10, 10, 2] },
      },
      {
        title: 'Move a little across',
        situation: 'Work out 29 + 56.',
        steps: [
          'Take 1 from 56 and give it to 29.',
          'Now you have 30 + 55.',
          '30 + 55 = 85.',
        ],
        answer: '29 + 56 = 85',
      },
      {
        title: 'Add too much, then fix it',
        situation: 'Work out 26 + 39.',
        steps: [
          '39 is 1 less than 40.',
          '26 + 40 = 66.',
          'You added 1 too many: 66 − 1 = 65.',
        ],
        answer: '26 + 39 = 65',
        art: { kind: 'jumps', start: 26, jumps: [40, -1] },
      },
    ],
    mistakes: [
      {
        wrong: 'Using a friendly number but forgetting to fix the answer.',
        right: 'If you added 1 extra, take 1 away at the end.',
      },
    ],
    realLife: [
      'Adding prices in your head at the market.',
      'Working out your points in a game.',
      'Finding out how far you have walked.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Choose a sum, such as 38 + 25.',
        'Solve it with two different strategies.',
        'Do you get the same answer?',
        'Tell a friend which one you liked best.',
      ],
    },
  },
  'mathematics-12': {
    indicator: {
      code: 'B2.1.2.4.3',
      text: 'Solve one-step and multi-step word problems involving addition and subtraction within 100.',
    },
    hook: 'Maths stories happen every day. Araba needs 8 cedis for exercise books but has only 5. What should she do?',
    explain: [
      'First read the story and see what it is asking.',
      'Decide if the amount gets bigger (often adding) or smaller (often subtracting). Words like “altogether” or “left” can help, but think about the story.',
      'Work it out and check that your answer makes sense in the story. Some stories have two steps.',
    ],
    art: {
      kind: 'jumps',
      start: 45,
      jumps: [-10, -1],
      label: '45 books, give away 11: 34 left',
    },
    artCaption: 'Giving books away moves us back along the line.',
    words: [
      { term: 'Altogether', meaning: 'All the groups put together.' },
      { term: 'Left', meaning: 'What remains after some are taken away.' },
      {
        term: 'Two-step problem',
        meaning: 'A story that needs two sums to solve.',
      },
    ],
    examples: [
      {
        title: 'Altogether',
        situation:
          'Yaw has 32 books. Aisha adds 13 more. How many books are there altogether?',
        steps: ['The number of books grows, so add.', '32 + 13 = 45.'],
        answer: 'There are 45 books.',
      },
      {
        title: 'How much more?',
        situation:
          'Araba needs 8 cedis to buy exercise books. She has 5 cedis. How much more does she need?',
        steps: ['Think 5 + ___ = 8.', 'Count up: 6, 7, 8. That is 3 jumps.'],
        answer: 'She needs 3 more cedis.',
      },
      {
        title: 'Two steps',
        situation:
          'Esi has 24 oranges. She sells 10 and then picks 15 more. How many does she have now?',
        steps: ['First: 24 − 10 = 14.', 'Next: 14 + 15 = 29.'],
        answer: 'She has 29 oranges.',
      },
    ],
    mistakes: [
      {
        wrong: 'Adding every time you see two numbers.',
        right: 'Picture the story first. Does the amount grow or shrink?',
      },
      {
        wrong: 'Stopping after the first step.',
        right: 'Read the question again to check you have answered it.',
      },
    ],
    realLife: [
      'Working out your change at the shop.',
      'Finding how many more chairs a class needs.',
      'Sharing out the fruit you sold and kept.',
    ],
    tryIt: {
      need: 'A family member',
      steps: [
        'Ask about something real at home, such as eggs or cups.',
        'Make up a maths story about it.',
        'Solve it together with objects.',
      ],
    },
  },
  'mathematics-13': {
    indicator: {
      code: 'B2.1.3.1.1',
      text: 'Understand the fraction one-half and one-quarter as the quantity obtained by taking 1 part when a whole is partitioned into two or four equal parts.',
    },
    hook: 'Ama and Kofi must share one loaf of bread fairly. What must be true about the two pieces?',
    explain: [
      'A whole can be split into equal parts. Equal means the same size.',
      'Split a whole into 2 equal parts and each part is one-half.',
      'Split a whole into 4 equal parts and each part is one-quarter. We also call it one-fourth.',
    ],
    art: {
      kind: 'loaf',
      cuts: 2,
      picked: 0,
      label: 'Two equal parts: each one is one-half',
    },
    artCaption: 'The raised piece is one-half of the loaf.',
    words: [
      { term: 'Whole', meaning: 'One complete thing, before it is cut.' },
      { term: 'One-half', meaning: 'One of 2 equal parts of a whole.' },
      {
        term: 'One-quarter',
        meaning:
          'One of 4 equal parts of a whole. It is also called one-fourth.',
      },
    ],
    examples: [
      {
        title: 'Share a round cake',
        situation:
          'Four friends share one cake equally. What part does each child get?',
        steps: [
          'Cut the cake into 4 pieces of the same size.',
          'Each child gets 1 of the 4 pieces.',
        ],
        answer: 'Each child gets one-quarter.',
        art: { kind: 'cake', parts: 4, picked: 1 },
      },
      {
        title: 'Is it really a half?',
        situation:
          'Kofi cuts a loaf into a big piece and a small piece. Is each one a half?',
        steps: [
          'Look at the sizes.',
          'The pieces are not the same size, so they are not equal.',
        ],
        answer: 'No. They are not halves.',
        art: { kind: 'loaf', cuts: 2, unequal: true },
      },
    ],
    mistakes: [
      {
        wrong: 'Calling any one of two pieces a half.',
        right: 'The two pieces must be equal to be halves.',
      },
      {
        wrong:
          'Thinking a quarter is bigger than a half because 4 is bigger than 2.',
        right:
          'More cuts make smaller pieces, so a half of a loaf is bigger than a quarter of it.',
      },
    ],
    realLife: [
      'Sharing an orange or a loaf of bread.',
      'Folding a sheet of paper.',
      'Cutting a yam or a pineapple for a family.',
    ],
    tryIt: {
      need: 'A sheet of paper',
      steps: [
        'Fold it in half, with the edges meeting. Open it. How many equal parts do you see?',
        'Fold it in half, and then in half again.',
        'Open it. Colour one-quarter.',
      ],
    },
  },
  'mathematics-14': {
    indicator: {
      code: 'B2.1.3.1.2',
      text: 'Count in halves and quarters (fourths) using concrete and pictorial representations.',
    },
    hook: 'You already count 1, 2, 3 with whole things. You can count pieces too!',
    explain: [
      'To count fourths, say: one-fourth, two-fourths, three-fourths, four-fourths.',
      'To count halves, say: one-half, two-halves, three-halves.',
      'Each piece you add makes the count one piece bigger. The name of the piece stays the same.',
    ],
    art: {
      kind: 'cake',
      parts: 4,
      picked: 3,
      label: 'Three-fourths are chosen',
    },
    artCaption:
      'Count the coloured pieces: one-fourth, two-fourths, three-fourths.',
    words: [
      {
        term: 'Fourths',
        meaning:
          'Pieces from a whole cut into 4 equal parts. They are also called quarters.',
      },
      {
        term: 'Halves',
        meaning: 'Pieces from a whole cut into 2 equal parts.',
      },
    ],
    examples: [
      {
        title: 'Count the cake pieces',
        situation:
          'Three pieces of a cake cut into fourths are on a plate. What is the count?',
        steps: [
          'Point to each piece.',
          'Say one-fourth, two-fourths, three-fourths.',
        ],
        answer: 'There are three-fourths of a cake.',
        art: { kind: 'cake', parts: 4, picked: 3 },
      },
      {
        title: 'Count the halves',
        situation:
          'Two loaves are each cut in half. How many halves are there?',
        steps: [
          'Each loaf gives 2 halves.',
          'Count: one-half, two-halves, three-halves, four-halves.',
        ],
        answer: 'There are four halves.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying “three-four” when counting.',
        right: 'Say the name of the piece: three-fourths.',
      },
    ],
    realLife: [
      'Counting pieces of a fruit you cut for your family.',
      'Counting slices of bread.',
      'Counting cups when a recipe uses half cups.',
    ],
    tryIt: {
      need: 'Paper circles and scissors, with an adult nearby',
      steps: [
        'Fold and cut two circles into fourths.',
        'Lay the pieces in a line.',
        'Count them out loud in fourths.',
      ],
    },
  },
  'mathematics-15': {
    indicator: {
      code: 'B2.1.3.1.3',
      text: 'Determine the number of halves and quarters in a whole.',
    },
    hook: 'If everybody in your family has one-quarter of a cake, how many people can share it?',
    explain: [
      'Two halves make one whole.',
      'Four quarters make one whole.',
      'Two quarters cover the same amount as one half. So one half is bigger than one quarter.',
    ],
    art: { kind: 'loaf', cuts: 4, label: 'Four quarters make one whole loaf' },
    artCaption: 'Put all the parts together and you have the whole again.',
    words: [
      { term: 'Whole', meaning: 'All of the equal parts together.' },
      {
        term: 'Same amount',
        meaning: 'Covering the same space, even if the pieces differ.',
      },
    ],
    examples: [
      {
        title: 'Build a whole',
        situation: 'How many quarters do you need to make one whole cake?',
        steps: [
          'Cut a cake into 4 equal parts.',
          'Each part is one quarter.',
          'Put the 4 parts back together.',
        ],
        answer: 'Four quarters make one whole.',
        art: { kind: 'cake', parts: 4, picked: 4 },
      },
      {
        title: 'Half or quarters?',
        situation: 'How many quarters cover one half of a loaf?',
        steps: [
          'Cut the loaf into 4 equal parts.',
          'Cover half of the loaf with quarters.',
          'Two quarters fit exactly.',
        ],
        answer: 'Two quarters make one half.',
        art: {
          kind: 'cake',
          parts: 4,
          picked: 2,
          label: 'Two quarters cover one half',
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking three quarters make a whole.',
        right: 'A whole cut into 4 parts needs all 4 parts.',
      },
    ],
    realLife: [
      'Sharing a pizza or a loaf at a party.',
      'Cutting a paper into equal parts for a craft.',
      'Sharing out kenkey among a family.',
    ],
    tryIt: {
      need: 'Two sheets of paper, the same size',
      steps: [
        'Fold one into halves and the other into quarters. Cut along the folds.',
        'Place two quarters on top of one half.',
        'Do they cover it? Tell someone what you notice.',
      ],
    },
  },
  'mathematics-16': {
    indicator: {
      code: 'B2.1.4.1.1',
      text: 'Recognise Ghanaian coins and currency notes and determine the value of a collection of coins and notes up to at least 50 Ghana cedis.',
    },
    hook: 'Your aunt gives you some notes for school items. How do you know how much you have?',
    explain: [
      'We use money in Ghana to buy and sell. Our money is the Ghana cedi. Look at each note’s number, colour and picture.',
      'Different notes can make the same value. Two 5 cedi notes are worth the same as one 10 cedi note.',
      'To find the total, begin with the biggest note and add the others.',
    ],
    art: {
      kind: 'cedis',
      notes: [20, 10, 5, 2],
      label: '20 + 10 + 5 + 2 = 37 cedis',
    },
    artCaption: 'Practice notes for counting. Start with the biggest.',
    words: [
      { term: 'Cedi', meaning: 'The money of Ghana. Its sign is GH₵.' },
      { term: 'Note', meaning: 'Paper money.' },
      { term: 'Coin', meaning: 'Round metal money.' },
    ],
    examples: [
      {
        title: 'Count the money',
        situation:
          'Ama has a 20 cedi note, a 10 cedi note, a 5 cedi note and a 2 cedi note.',
        steps: [
          'Start with 20.',
          '20 + 10 = 30.',
          '30 + 5 = 35.',
          '35 + 2 = 37.',
        ],
        answer: 'Ama has 37 cedis.',
        art: { kind: 'cedis', notes: [20, 10, 5, 2] },
      },
      {
        title: 'Swap notes',
        situation:
          'How many 2 cedi notes make 10 cedis? How many 10 cedi notes make 50 cedis?',
        steps: [
          'Count by 2s to 10: 2, 4, 6, 8, 10. That is 5 notes.',
          'Count by 10s to 50: 10, 20, 30, 40, 50. That is 5 notes.',
        ],
        answer:
          'Five 2 cedi notes make 10 cedis. Five 10 cedi notes make 50 cedis.',
        art: { kind: 'cedis', notes: [2, 2, 2, 2, 2] },
      },
    ],
    mistakes: [
      {
        wrong: 'Counting the number of notes instead of their value.',
        right: 'Three notes can be worth a little or a lot. Add their values.',
      },
    ],
    realLife: [
      'Paying for food at the school canteen.',
      'Paying for a trotro ride.',
      'Saving coins in a money box.',
    ],
    tryIt: {
      need: 'Paper to make play notes',
      steps: [
        'Make play notes for 1, 2, 5, 10 and 20 cedis.',
        'Play shop with a friend.',
        'Find two different ways to pay 15 cedis.',
      ],
    },
  },
  'mathematics-17': {
    indicator: {
      code: 'B2.2.1.1.1',
      text: 'Demonstrate an understanding of increasing and decreasing number patterns.',
    },
    hook: 'Some numbers follow a secret rule. Find the rule and you can say what comes next!',
    explain: [
      'A number pattern follows a rule. In 2, 4, 6, 8 the rule is “add 2”. The numbers grow, so it is increasing.',
      'In 20, 18, 16, 14 the rule is “take away 2”. The numbers get smaller, so it is decreasing.',
      'To find a rule, look at the jump from each number to the next. Every jump should be the same.',
    ],
    art: {
      kind: 'pattern',
      terms: [2, 4, 6, 8, null],
      rule: 'The rule is “add 2”. What comes next?',
    },
    artCaption: 'Each jump is the same size.',
    words: [
      { term: 'Pattern', meaning: 'Something that follows a rule.' },
      {
        term: 'Rule',
        meaning: 'What you do each time to get the next number.',
      },
      {
        term: 'Increasing and decreasing',
        meaning: 'Going up and going down.',
      },
    ],
    examples: [
      {
        title: 'Keep it going',
        situation: 'What comes next in 10, 20, 30, 40?',
        steps: ['Each jump adds 10.', '40 + 10 = 50.', '50 + 10 = 60.'],
        answer: 'Next come 50 and 60.',
        art: {
          kind: 'pattern',
          terms: [10, 20, 30, 40, null, null],
          rule: 'Add 10 each time.',
        },
      },
      {
        title: 'Find the mistake',
        situation: 'Look at 5, 10, 20, 25, 30. What is wrong?',
        steps: [
          '5 to 10 is a jump of 5.',
          '10 to 20 is a jump of 10.',
          'A number is missing between them.',
        ],
        answer: '15 is missing.',
        art: {
          kind: 'pattern',
          terms: [5, 10, null, 20, 25, 30],
          rule: 'Add 5 each time.',
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Checking only the first two numbers.',
        right: 'Check that every jump follows the rule.',
      },
    ],
    realLife: [
      'House numbers that go up by 2 along a street.',
      'Counting the eyes of a group of friends by 2s.',
      'Saving 5 cedis every week.',
    ],
    tryIt: {
      need: 'Bottle caps or stones',
      steps: [
        'Make a row of 2 caps, then 4, and then 6.',
        'Build the next row.',
        'Say the rule.',
        'Make your own pattern, and ask a friend to find the rule.',
      ],
    },
  },
  'mathematics-18': {
    indicator: {
      code: 'B2.2.1.1.2',
      text: 'Identify, create and describe the rule for simple number patterns involving repeated addition or subtraction, skip counting and arrays of objects.',
    },
    hook: 'Now you can be the rule-maker. What pattern will you invent?',
    explain: [
      'Some patterns repeat the same numbers: 9, 1, 3, 5, 9, 1, 3, 5. After 5, it starts again.',
      'Other patterns add the same amount each time: 54, 55, 56, 57. This rule is “add 1”.',
      'Rows of objects also make a pattern. If every row has 3 cups, count 3, 6, 9, 12.',
    ],
    art: {
      kind: 'groups',
      groups: 4,
      each: 3,
      label: 'Rows of 3: 3, 6, 9, 12',
    },
    artCaption: 'Each group adds 3 more.',
    words: [
      {
        term: 'Repeating pattern',
        meaning: 'The same part comes again and again.',
      },
      { term: 'Array', meaning: 'Objects set out in equal rows.' },
    ],
    examples: [
      {
        title: 'What repeats?',
        situation:
          'Find the next two numbers: 9, 1, 3, 5, 9, 1, 3, 5, ___, ___',
        steps: [
          'The part that repeats is 9, 1, 3, 5.',
          'After 5, it starts again.',
        ],
        answer: 'The next two numbers are 9 and 1.',
      },
      {
        title: 'Say the rule',
        situation: 'What is the rule for 5, 10, 15, 20?',
        steps: ['10 − 5 = 5.', '15 − 10 = 5.', 'The jump is always 5.'],
        answer: 'The rule is “add 5”.',
        art: {
          kind: 'pattern',
          terms: [5, 10, 15, 20, null],
          rule: 'Add 5 each time.',
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Expecting every pattern to grow.',
        right: 'Some patterns repeat, and some get smaller.',
      },
    ],
    realLife: [
      'The rhythm of a drum in a song.',
      'Patterns in kente cloth.',
      'Rows of seedlings on a farm.',
    ],
    tryIt: {
      need: 'Seeds, stones or coloured paper',
      steps: [
        'Make a repeating pattern with four parts.',
        'Say what repeats.',
        'Ask a friend to continue it.',
      ],
    },
  },
  'mathematics-19': {
    indicator: {
      code: 'B2.3.1.1.1',
      text: 'Identify the common features of 3D objects (spheres, cylinders, cones, pyramids, cubes).',
    },
    hook: 'A football rolls, but a box does not. Why? It is all about their shape!',
    explain: [
      'Solid objects that you can hold are called 3D objects. They have faces, edges and corners.',
      'A cube has 6 square faces. A sphere is round like a ball and has no corners. A cylinder has 2 flat circle faces, like a milk tin.',
      'A cone has one circle face and one point. A pyramid has flat faces that meet at the top. An object can be turned any way and it stays the same shape.',
    ],
    art: {
      kind: 'solids',
      names: ['cube', 'sphere', 'cylinder', 'cone', 'pyramid'],
    },
    artCaption: 'Five 3D objects to look for at school and at home.',
    words: [
      { term: 'Face', meaning: 'A flat side of a 3D object.' },
      { term: 'Corner', meaning: 'A point where edges meet.' },
      { term: 'Edge', meaning: 'A line where two faces meet.' },
    ],
    examples: [
      {
        title: 'Sort by rolling',
        situation: 'Which of these can roll: a cube, a sphere or a cylinder?',
        steps: [
          'Look for a curved surface.',
          'A sphere is curved all round.',
          'A cylinder has a curved side.',
          'A cube has only flat faces.',
        ],
        answer: 'The sphere and the cylinder can roll.',
        art: { kind: 'solids', names: ['cube', 'sphere', 'cylinder'] },
      },
      {
        title: 'What is my name?',
        situation: 'I have 6 faces and all of them are squares. What am I?',
        steps: [
          'A cylinder has circle faces, so it is not that.',
          'A pyramid has a point at its top, so it is not that.',
          'Only one has 6 square faces.',
        ],
        answer: 'I am a cube.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a cone turned upside down is a new shape.',
        right: 'Turning an object does not change its shape.',
      },
    ],
    realLife: [
      'A football is a sphere.',
      'A tin of milk is a cylinder.',
      'A chalk box can look like a cube.',
    ],
    tryIt: {
      need: 'Objects from around your home',
      steps: [
        'Collect five objects.',
        'Name the shape of each one.',
        'Sort them into “can roll” and “cannot roll”.',
        'Say your sorting rule.',
      ],
    },
  },
  'mathematics-20': {
    indicator: {
      code: 'B2.3.1.1.2',
      text: 'Identify the common features of 2D shapes (squares, triangles, rectangles, circles, pentagons, hexagons).',
    },
    hook: 'Look around your classroom. How many different flat shapes can you spot?',
    explain: [
      '2D shapes are flat, like a drawing. We name them by their sides and corners.',
      'A triangle has 3 sides. A square has 4 equal sides. A rectangle has 4 sides, with opposite sides equal. A pentagon has 5 sides. A hexagon has 6 sides. A circle is round, with no corners.',
      'If you turn a shape, it keeps its name. A triangle upside down is still a triangle.',
    ],
    art: {
      kind: 'shapes',
      names: [
        'square',
        'rectangle',
        'triangle',
        'circle',
        'pentagon',
        'hexagon',
      ],
    },
    artCaption: 'Count the sides to name each shape.',
    words: [
      { term: 'Side', meaning: 'A straight line that makes part of a shape.' },
      {
        term: 'Corner',
        meaning: 'Where two sides meet. It is also called a vertex.',
      },
      { term: '2D', meaning: 'Flat, with no thickness.' },
    ],
    examples: [
      {
        title: 'Name it',
        situation: 'A shape has 5 sides and 5 corners. What is it?',
        steps: [
          '3 sides is a triangle and 4 sides is a square or a rectangle.',
          '5 sides is a pentagon.',
        ],
        answer: 'It is a pentagon.',
        art: { kind: 'shapes', names: ['pentagon'] },
      },
      {
        title: 'Sort the shapes',
        situation:
          'Sort a square, triangle and rectangle into “4 sides” and “not 4 sides”.',
        steps: [
          'A square has 4 sides.',
          'A rectangle has 4 sides.',
          'A triangle has 3 sides.',
        ],
        answer: 'The square and rectangle have 4 sides. The triangle does not.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying a square on its corner is a new shape.',
        right: 'It is still a square, because it still has 4 equal sides.',
      },
    ],
    realLife: [
      'A window is a rectangle.',
      'A coin looks like a circle.',
      'A road sign can be a triangle.',
    ],
    tryIt: {
      need: 'A walk around your school or compound',
      steps: [
        'Find one object for each shape.',
        'Draw what you find.',
        'Label each shape and count its sides.',
      ],
    },
  },
  'mathematics-21': {
    indicator: {
      code: 'B2.3.1.1.3',
      text: 'Create two-dimensional shapes based on given attributes, including number of sides and vertices.',
    },
    hook: 'Can you draw a shape from just a clue? “I have 3 sides and 3 corners.” Now you are a shape builder!',
    explain: [
      'A vertex is another name for a corner. Shapes made of straight sides have as many vertices as sides.',
      'To draw a shape from a clue, mark the corners first. Then join them with straight lines using a ruler or a straight edge.',
      '3D objects have 2D faces. The flat end of a can or a bucket is a circle.',
    ],
    art: { kind: 'shapes', names: ['triangle', 'pentagon', 'hexagon'] },
    artCaption: 'Sides and vertices tell you the shape.',
    words: [
      {
        term: 'Vertex',
        meaning: 'A corner of a shape. More than one is “vertices”.',
      },
      {
        term: 'Attribute',
        meaning: 'A feature of a shape, such as its number of sides.',
      },
    ],
    examples: [
      {
        title: 'Follow the clue',
        situation: 'Draw a shape with 6 sides and 6 vertices.',
        steps: [
          'Mark 6 dots in a ring.',
          'Join each dot to the next with a straight line.',
          'Count the sides and vertices to check.',
        ],
        answer: 'You have drawn a hexagon.',
        art: { kind: 'shapes', names: ['hexagon'] },
      },
      {
        title: 'Faces of a tin',
        situation: 'What flat shapes do you see on a milk tin?',
        steps: ['Look at the top and bottom.', 'They are flat and round.'],
        answer: 'The top and bottom are circles.',
        art: { kind: 'solids', names: ['cylinder'] },
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving a gap, so that the shape is not closed.',
        right: 'Every side must join the next, with no gaps.',
      },
    ],
    realLife: [
      'Drawing a house with a triangle roof.',
      'Cutting shapes for a craft.',
      'Laying out a play area with sticks.',
    ],
    tryIt: {
      need: 'Sticks or straws',
      steps: [
        'Make a shape with 3 sticks.',
        'Make shapes with 4, 5 and 6 sticks.',
        'Count the sides and vertices of each.',
      ],
    },
  },
  'mathematics-22': {
    indicator: {
      code: 'B2.3.2.1.1',
      text: 'Prove that the placement or direction of a shape or object does not change its length.',
    },
    hook: 'Three sticks lie on the floor in different ways. One looks longest. Is it really?',
    explain: [
      'A stick does not grow or shrink when you move it. Its length stays the same.',
      'The direction can trick your eyes. Things that stand up can look longer than things that lie down.',
      'To compare fairly, lay the objects side by side with their ends lined up at the same start.',
    ],
    art: { kind: 'sticks', together: false },
    artCaption: 'They look different here. Are they?',
    words: [
      { term: 'Length', meaning: 'How long something is from end to end.' },
      { term: 'Direction', meaning: 'The way something is pointing.' },
      {
        term: 'Line up',
        meaning: 'Start objects at the same point to compare.',
      },
    ],
    examples: [
      {
        title: 'Test the sticks',
        situation:
          'Yaa says the standing stick is the longest. How can she check?',
        steps: [
          'Pick up all the sticks.',
          'Lay them side by side.',
          'Line up the ends at one start.',
          'See where the other ends finish.',
        ],
        answer: 'They finish together, so they all have the same length.',
        art: { kind: 'sticks', together: true },
      },
    ],
    mistakes: [
      {
        wrong: 'Deciding by looking only.',
        right: 'Your eyes can be tricked. Line them up to prove it.',
      },
    ],
    realLife: [
      'A pencil is just as long in your bag as on your desk.',
      'A ladder stays the same length when you lay it down.',
      'A rope is as long when it is curled as when it is straight.',
    ],
    tryIt: {
      need: 'Three sticks or pencils of the same length',
      steps: [
        'Place them in different directions.',
        'Ask a friend which is the longest.',
        'Line them up together and prove the answer.',
      ],
    },
  },
  'mathematics-23': {
    indicator: {
      code: 'B2.3.3.1.1',
      text: 'Demonstrate an understanding of how to measure lengths, capacities or mass, directly or indirectly, using non-standard units.',
    },
    hook: 'Would you measure your classroom with a paper clip? You could, but it would take a very long time!',
    explain: [
      'Length is how long something is. Capacity is how much a container can hold. Mass tells how heavy something is.',
      'Choose a unit that suits the job: a hand span for a desk, and strides for the classroom.',
      'A small unit gives a big count, and a large unit gives a small count. The object has not changed. Only the unit has.',
    ],
    art: {
      kind: 'measure',
      unit: 'stick',
      count: 4,
      label: 'The desk is 4 stick lengths long.',
    },
    artCaption: 'A longer unit gives a smaller count.',
    words: [
      { term: 'Unit', meaning: 'What you use each time you measure.' },
      { term: 'Capacity', meaning: 'How much a container can hold.' },
      { term: 'Mass', meaning: 'How heavy something is.' },
    ],
    examples: [
      {
        title: 'Why is the count different?',
        situation:
          'A desk is 4 sticks long and 12 paper clips long. Which unit is longer?',
        steps: [
          'It takes more paper clips than sticks to cover the desk.',
          'So each paper clip must be shorter.',
        ],
        answer: 'The stick is the longer unit.',
        art: { kind: 'measure', unit: 'clip', count: 12 },
      },
      {
        title: 'Estimate, then measure',
        situation:
          'Abena guesses her book is 8 bottle caps long. She measures 10.',
        steps: [
          'Write the guess: 8 caps.',
          'Measure: 10 caps.',
          'The difference is 10 − 8 = 2.',
        ],
        answer: 'Her guess was 2 caps short.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying the object changed because the count changed.',
        right: 'The length is the same. You only used a different unit.',
      },
    ],
    realLife: [
      'Using an olonka to buy gari.',
      'Pacing out a garden bed.',
      'Feeling which of two bags is heavier.',
    ],
    tryIt: {
      need: 'A book, a pencil and some bottle caps',
      steps: [
        'Guess the book’s length in caps and write it down.',
        'Measure it and write the result.',
        'Do the same using pencils.',
        'Why are the two counts different?',
      ],
    },
  },
  'mathematics-24': {
    indicator: {
      code: 'B2.3.3.1.2',
      text: 'Develop an understanding of measuring as a process of comparing three or more items.',
    },
    hook: 'Three bottles stand in a row. How would you put them in order, from shortest to tallest?',
    explain: [
      'With two things we say “longer” and “shorter”. With three or more, we also say “longest” and “shortest”.',
      'We can say heavier and heaviest, or bigger and biggest, in the same way.',
      'Sometimes you can compare directly by placing things together. If not, use a unit and compare the counts.',
    ],
    art: {
      kind: 'bottles',
      heights: [130, 180, 225],
      label: 'Short, taller, tallest',
    },
    artCaption: 'Stand them on the same line to compare.',
    words: [
      { term: 'Longest', meaning: 'Longer than all the others.' },
      { term: 'Heaviest', meaning: 'Heavier than all the others.' },
      { term: 'Biggest', meaning: 'Bigger than all the others.' },
    ],
    examples: [
      {
        title: 'Order by length',
        situation:
          'A rope is 9 strides long, a mat is 3 strides long and a bench is 5 strides long.',
        steps: [
          'The smallest count is 3, the mat.',
          'Next is 5, the bench.',
          'The biggest count is 9, the rope.',
        ],
        answer: 'From shortest to longest: mat, bench, rope.',
      },
      {
        title: 'Order by weight',
        situation:
          'A yam is heavier than a mango. A pawpaw is heavier than the mango, but lighter than the yam.',
        steps: [
          'The mango is lighter than both, so it is the lightest.',
          'The yam is heavier than the pawpaw and the mango.',
        ],
        answer:
          'The yam is the heaviest. Then comes the pawpaw, then the mango.',
      },
    ],
    mistakes: [
      {
        wrong: 'Comparing objects that start at different places.',
        right: 'Line them up so they start at one point.',
      },
    ],
    realLife: [
      'Lining up from shortest to tallest at assembly.',
      'Choosing the heaviest yam at the market.',
      'Finding the biggest bowl to hold the soup.',
    ],
    tryIt: {
      need: 'Three bottles or cups',
      steps: [
        'Order them by height.',
        'Fill them with water. Which holds the most?',
        'Does the tallest always hold the most? Find out.',
      ],
    },
  },
  'mathematics-25': {
    indicator: {
      code: 'B2.3.3.2.1',
      text: 'Recognize the need for a standard unit of measurement of length.',
    },
    hook: 'Kwame says the wall is 6 hand spans high. Adwoa says it is 8. They measured the same wall. Who is right?',
    explain: [
      'Kwame’s hand is bigger than Adwoa’s, so he needs fewer spans. Both of them measured properly.',
      'This causes a problem. If you buy “6 hand spans” of cloth, whose hand do you use?',
      'We need a unit that is the same for everybody. That is called a standard unit. Rulers and tape measures show standard units, and you will use them later.',
    ],
    art: { kind: 'hands', counts: [6, 8], label: 'Same wall, different hands' },
    artCaption: 'The wall did not change, but the counts did.',
    words: [
      {
        term: 'Standard unit',
        meaning: 'A unit that is the same size for everybody.',
      },
      { term: 'Ruler', meaning: 'A straight tool marked with standard units.' },
    ],
    examples: [
      {
        title: 'Measure a learner’s height',
        situation:
          'Four learners use hand spans to measure a mark on the wall. They get 6, 7, 7 and 8.',
        steps: [
          'The mark on the wall has not moved.',
          'Each learner’s hand is a different size.',
          'So the counts are different.',
        ],
        answer: 'We need a unit that does not change with the person.',
        art: { kind: 'hands', counts: [7, 8] },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking that someone must have measured wrongly.',
        right: 'Each count may be right. The unit is the problem.',
      },
    ],
    realLife: [
      'A tailor uses a tape measure.',
      'A carpenter uses a metre rule.',
      'Shoes come in standard sizes.',
    ],
    tryIt: {
      need: 'A wall or door, and two people',
      steps: [
        'Each person measures with hand spans.',
        'Write down each count.',
        'Talk about why the counts differ.',
        'What could you use so that they agree?',
      ],
    },
  },
  'mathematics-26': {
    indicator: {
      code: 'B2.3.3.3.1',
      text: 'Read the calendar and solve problems involving the number of days in a week and the number of months in a year.',
    },
    hook: 'Ghana’s Independence Day is on 6 March. How can you find which day of the week it falls on?',
    explain: [
      'A week has 7 days, starting with Sunday on most calendars. A year has 12 months.',
      'On a calendar, find the month at the top. Then find the date. Look up the column to read the day.',
      'Learn the rhyme: 30 days has September, April, June and November. All the rest have 31, except February, which has 28 or 29.',
    ],
    art: { kind: 'calendar', month: 'March', days: 31, startsOn: 0, focus: 6 },
    artCaption: 'On this calendar, 6 March is a Friday.',
    words: [
      {
        term: 'Calendar',
        meaning: 'A chart that shows the days, weeks and months of a year.',
      },
      {
        term: 'Date',
        meaning: 'The number of a day in a month, such as 6 March.',
      },
    ],
    examples: [
      {
        title: 'Read the calendar',
        situation: 'On this March calendar, which day is the 6th?',
        steps: [
          'Find the 6 in the calendar.',
          'Look up to the top of its column.',
        ],
        answer: 'It is a Friday.',
        art: {
          kind: 'calendar',
          month: 'March',
          days: 31,
          startsOn: 0,
          focus: 6,
        },
      },
      {
        title: 'Before and after',
        situation:
          'Which month comes just before April? Which comes just after April?',
        steps: [
          'Say the months in order: January, February, March, April, May.',
        ],
        answer: 'March comes before and May comes after.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking that every month has 30 days.',
        right: 'Use the rhyme to remember which months have 30 or 31.',
      },
    ],
    realLife: [
      'Finding your birthday.',
      'Knowing when school will reopen.',
      'Planning for Independence Day or Farmers’ Day.',
    ],
    tryIt: {
      need: 'A calendar',
      steps: [
        'Find your birthday.',
        'Which day of the week is it this year?',
        'Count how many days there are from today until then.',
      ],
    },
  },
  'mathematics-27': {
    indicator: {
      code: 'B2.3.3.3.2',
      text: 'Use arbitrary units and the hour on the clock to measure the time taken to complete simple events.',
    },
    hook: 'How long does it take you to walk round your classroom? You can measure it with claps!',
    explain: [
      'You can measure a short time by counting claps, or using a dripping water timer. These are arbitrary units, as a clap can be fast or slow.',
      'An hour is the time the long hand takes to go right round the clock.',
      'Some events take less than an hour, like eating a banana. Some take more, like a school day.',
    ],
    art: { kind: 'clock', hour: 8, label: '8 o’clock' },
    artCaption:
      'At 8 o’clock the short hand points to 8 and the long hand points to 12.',
    words: [
      { term: 'Hour', meaning: 'A unit of time. A day has 24 hours.' },
      {
        term: 'O’clock',
        meaning: 'Says the hour exactly, with the long hand on 12.',
      },
      { term: 'Hour hand', meaning: 'The short hand of the clock.' },
    ],
    examples: [
      {
        title: 'Count with claps',
        situation:
          'Kofi claps while Ama walks round the class. He claps 25 times.',
        steps: [
          'Clap at a steady pace.',
          'Begin when she starts.',
          'Stop when she finishes.',
        ],
        answer: 'The walk took 25 claps.',
      },
      {
        title: 'How long at school?',
        situation:
          'School starts at 8 o’clock and closes at 2 o’clock. How many hours is that?',
        steps: [
          'Count each hour from 8: 9, 10, 11, 12, 1, 2.',
          'That is 6 counts.',
        ],
        answer: 'It is 6 hours.',
        art: { kind: 'clock', hour: 2, label: 'School closes at 2 o’clock' },
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up the hour hand and the long hand.',
        right: 'The short hand tells you the hour.',
      },
    ],
    realLife: [
      'Knowing when to catch the school bus.',
      'Timing a football game.',
      'Waiting for food to cook.',
    ],
    tryIt: {
      need: 'A clock or watch',
      steps: [
        'Look at the clock when you start your homework.',
        'Look again when you finish.',
        'Did it take more or less than an hour?',
      ],
    },
  },
  'mathematics-28': {
    indicator: {
      code: 'B2.4.1.1.1',
      text: 'Use tallies, checkmarks, charts, lists or objects to collect and organise data to answer and pose questions.',
    },
    hook: 'What is the favourite food in your class? Do not guess. Ask everyone and keep a record!',
    explain: [
      'Data is information that we collect, such as what food each friend likes.',
      'A tally is a quick way to keep count. Draw one line for each answer. The fifth line goes across the first four, making a bundle of 5.',
      'When your data is organised, you can answer questions and ask new ones.',
    ],
    art: {
      kind: 'tally',
      rows: [
        ['Waakye', 8],
        ['Jollof', 12],
        ['Banku', 5],
      ],
    },
    artCaption: 'Count the tallies by 5s, then add the rest.',
    words: [
      { term: 'Data', meaning: 'Information that we collect.' },
      { term: 'Tally', meaning: 'A mark used to keep count.' },
      {
        term: 'Chart',
        meaning: 'A table or drawing that organises information.',
      },
    ],
    examples: [
      {
        title: 'Read the tallies',
        situation: 'Look at the food chart. Which food do most learners like?',
        steps: [
          'Waakye has 8.',
          'Jollof has 12.',
          'Banku has 5.',
          '12 is the biggest number.',
        ],
        answer: 'Most learners like jollof.',
        art: {
          kind: 'tally',
          rows: [
            ['Waakye', 8],
            ['Jollof', 12],
            ['Banku', 5],
          ],
        },
      },
      {
        title: 'How many learners?',
        situation: 'If each learner chose once, how many learners answered?',
        steps: ['8 + 12 = 20.', '20 + 5 = 25.'],
        answer: '25 learners answered.',
      },
    ],
    mistakes: [
      {
        wrong: 'Drawing a fifth line beside the first four.',
        right: 'The fifth line goes across them. It is easier to count.',
      },
    ],
    realLife: [
      'Counting votes for a class leader.',
      'Keeping score in a game.',
      'Finding out the most popular colour for a class team.',
    ],
    tryIt: {
      need: 'Paper, a pencil and some friends or family',
      steps: [
        'Choose a question, such as “What is your favourite sport?”',
        'Give three choices.',
        'Ask everyone and make a tally mark for each answer.',
        'Which got the most? Ask a new question about your data.',
      ],
    },
  },
  'mathematics-29': {
    indicator: {
      code: 'B2.4.1.2.1',
      text: 'Draw and interpret concrete graphs and pictographs.',
    },
    hook: 'A picture can show numbers. One look at a picture graph can tell you who picked the most mangoes!',
    explain: [
      'A pictograph uses pictures to show data. Here, each picture stands for one thing.',
      'Put pictures the same size and in neat rows, so that it is fair to compare.',
      'You can use the graph to find how many altogether, or how many more one row has than another.',
    ],
    art: {
      kind: 'picto',
      item: 'mango',
      rows: [
        ['Kofi', 4],
        ['Ama', 7],
        ['Esi', 5],
      ],
    },
    artCaption: 'Each mango picture stands for one mango.',
    words: [
      {
        term: 'Pictograph',
        meaning: 'A graph that uses pictures to show data.',
      },
      { term: 'Row', meaning: 'A line of pictures going across.' },
      {
        term: 'Compare',
        meaning: 'Find which has more or less, and by how many.',
      },
    ],
    examples: [
      {
        title: 'Most mangoes',
        situation:
          'Kofi picked 4 mangoes, Ama picked 7 and Esi picked 5. Who picked the most?',
        steps: ['Compare the rows.', 'Ama’s row is the longest.'],
        answer: 'Ama picked the most.',
        art: {
          kind: 'picto',
          item: 'mango',
          rows: [
            ['Kofi', 4],
            ['Ama', 7],
            ['Esi', 5],
          ],
        },
      },
      {
        title: 'How many more?',
        situation: 'How many more mangoes did Ama pick than Kofi?',
        steps: ['Ama has 7 and Kofi has 4.', '7 − 4 = 3.'],
        answer: 'Ama picked 3 more.',
      },
      {
        title: 'Altogether',
        situation: 'How many mangoes did all three pick?',
        steps: ['4 + 7 = 11.', '11 + 5 = 16.'],
        answer: 'They picked 16 mangoes.',
      },
    ],
    mistakes: [
      {
        wrong:
          'Drawing pictures of different sizes, so that a short row looks long.',
        right: 'Keep the pictures the same size, and count them.',
      },
    ],
    realLife: [
      'Showing books read by each class.',
      'Showing how many goats a family keeps.',
      'Showing fruits sold each day.',
    ],
    tryIt: {
      need: 'Real objects or small drawings',
      steps: [
        'Choose three groups, such as three types of fruit.',
        'Line up one object or drawing for each one you count.',
        'Say which row has the most, and how many more.',
      ],
    },
  },
}
