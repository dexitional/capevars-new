import type { CourseGuides } from './types'

// Basic 2 French, written for this course for six- and seven-year-olds. The
// national French curriculum starts at Basic 4, so these follow KidiLearn's own
// early-French goals. They take each lesson's words from Basic 1 a step
// further, into short questions and answers.
// - Explanations are in English. French sits inside «…», so the French voice
//   reads it and the English voice never does.
// - Questions and their reasons are English; the answer options are French.

const goal = (text: string) => ({
  code: '',
  text,
  source: 'kidilearn' as const,
})

export const guides: CourseGuides = {
  'french-01': {
    indicator: goal(
      'Greet people, ask how they are and say goodbye in French.',
    ),
    hook: 'When we meet a friend, we say hello and ask how they are. Let us do it in French.',
    explain: [
      'In the morning, say «Bonjour». In the evening, say «Bonsoir».',
      'To ask how a friend is, say «Ça va ?»',
      'The answer is «Ça va bien, merci». When you leave, say «Au revoir».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Salut, Ama ! Ça va ?' },
        { who: 1, text: 'Ça va bien, merci !' },
        { who: 0, text: 'Au revoir !' },
        { who: 1, text: 'À demain !' },
      ],
    },
    artCaption: 'Two friends greet each other.',
    words: [
      { term: 'Bonsoir', meaning: 'Good evening.' },
      { term: 'Ça va ?', meaning: 'How are you?' },
      { term: 'Ça va bien, merci.', meaning: 'I am well, thank you.' },
      { term: 'À demain !', meaning: 'See you tomorrow!' },
    ],
    examples: [
      {
        title: 'Evening',
        situation: 'You meet your neighbour in the evening. What do you say?',
        steps: ['It is evening.'],
        answer: '«Bonsoir !»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «Bonsoir» in the morning.',
        right: 'Morning is «Bonjour». Evening is «Bonsoir».',
      },
    ],
    realLife: [
      'Greeting friends at school.',
      'Greeting neighbours in the evening.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Say «Salut» and ask «Ça va ?»',
        'Your friend answers.',
        'Say «À demain !»',
      ],
    },
    quiz: [
      {
        prompt: 'Your friend asks how you are. What do you answer?',
        options: ['Ça va bien, merci.', 'Bonsoir.'],
        answer: 0,
        why: 'That means I am well, thank you.',
      },
    ],
    sayIt: { phrase: 'Ça va ?', meaning: 'How are you?' },
  },
  'french-02': {
    indicator: goal(
      'Give your name, ask a friend’s name and say pleased to meet you.',
    ),
    hook: 'A new pupil has joined your class. How do you say hello and learn their name in French?',
    explain: [
      'Say your name with «Je m’appelle». Then ask back with «Et toi ?»',
      'To say pleased to meet you, a boy says «Enchanté» and a girl says «Enchantée».',
      'They sound the same. Only the spelling is different.',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Je m’appelle Kojo. Et toi ?' },
        { who: 1, text: 'Je m’appelle Abena.' },
        { who: 0, text: 'Enchanté, Abena !' },
        { who: 1, text: 'Enchantée, Kojo !' },
      ],
    },
    artCaption: 'Kojo and Abena meet.',
    words: [
      { term: 'Et toi ?', meaning: 'And you?' },
      { term: 'Enchanté', meaning: 'Pleased to meet you.' },
      { term: 'Je m’appelle', meaning: 'My name is.' },
    ],
    examples: [
      {
        title: 'Asking back',
        situation: 'You told a new friend your name. How do you ask theirs?',
        steps: ['Ask back with two words.'],
        answer: '«Et toi ?»',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to ask the other person’s name.',
        right: 'After your name, ask «Et toi ?»',
      },
    ],
    realLife: ['Welcoming a new pupil.', 'Meeting visitors.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Say your name and ask «Et toi ?»',
        'Listen to the answer.',
        'Say «Enchanté» and shake hands.',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean and you?',
        options: ['Et toi ?', 'Au revoir.'],
        answer: 0,
        why: 'Those words mean and you.',
      },
    ],
    sayIt: {
      phrase: 'Je m’appelle… Et toi ?',
      meaning: 'My name is… And you?',
    },
  },
  'french-03': {
    indicator: goal('Use please, thank you, sorry and excuse me in French.'),
    hook: 'Kind words make friends. Let us add sorry and excuse me to please and thank you.',
    explain: [
      'Please is «S’il vous plaît», and thank you is «Merci».',
      'If you bump into someone, say «Pardon».',
      'To get a grown-up’s attention politely, say «Excusez-moi».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Oh ! Pardon !' },
        { who: 1, text: 'Ce n’est pas grave.' },
        { who: 0, text: 'Merci !' },
        { who: 1, text: 'De rien !' },
      ],
    },
    artCaption: 'A child says sorry after bumping into a friend.',
    words: [
      { term: 'Pardon', meaning: 'Sorry.' },
      { term: 'Excusez-moi', meaning: 'Excuse me.' },
      { term: 'Ce n’est pas grave.', meaning: 'It does not matter.' },
      { term: 'De rien', meaning: 'You are welcome.' },
    ],
    examples: [
      {
        title: 'A question for the teacher',
        situation: 'You want to ask your teacher something. How do you start?',
        steps: ['Get her attention politely.'],
        answer: '«Excusez-moi, Madame.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Bumping into someone and walking away.',
        right: 'Stop and say «Pardon».',
      },
    ],
    realLife: ['Lining up in class.', 'Asking a grown-up for help.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Act out bumping into each other gently.',
        'Say «Pardon».',
        'Your friend says «Ce n’est pas grave».',
      ],
    },
    quiz: [
      {
        prompt: 'You bump into a friend. What do you say?',
        options: ['Pardon !', 'Merci !'],
        answer: 0,
        why: 'That means sorry.',
      },
    ],
    sayIt: { phrase: 'Excusez-moi, Madame.', meaning: 'Excuse me, madam.' },
  },
  'french-04': {
    indicator: goal('Count up to five things and say how many in French.'),
    hook: 'How many pencils do you have? Let us count and answer in French.',
    explain: [
      'Count with «un, deux, trois, quatre, cinq».',
      'To ask how many, say «Combien ?»',
      'To answer, say «J’ai» and the number: «J’ai trois crayons».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '✏️', label: 'un crayon' },
        { icon: '✏️✏️', label: 'deux crayons' },
        { icon: '✏️✏️✏️', label: 'trois crayons' },
      ],
    },
    artCaption: 'One, two and three pencils.',
    words: [
      { term: 'Combien ?', meaning: 'How many?' },
      { term: 'J’ai', meaning: 'I have.' },
      { term: 'trois', meaning: 'Three.' },
      { term: 'cinq', meaning: 'Five.' },
    ],
    examples: [
      {
        title: 'Four books',
        situation: 'You have four books. How do you say it?',
        steps: ['Start with «J’ai».', 'Four is «quatre».'],
        answer: '«J’ai quatre livres.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying the number without what you have.',
        right: 'Say «J’ai» and the number.',
      },
    ],
    realLife: ['Counting your pencils.', 'Sharing sweets.'],
    tryIt: {
      need: 'Pencils',
      steps: [
        'Hold some pencils.',
        'Your friend asks «Combien ?»',
        'Answer with «J’ai» and the number.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means how many?',
        options: ['Combien ?', 'Comment ?'],
        answer: 0,
        why: 'That word asks how many.',
      },
    ],
    sayIt: { phrase: 'J’ai trois crayons.', meaning: 'I have three pencils.' },
  },
  'french-05': {
    indicator: goal(
      'Count up to ten things and say how many there are in French.',
    ),
    hook: 'How many chairs are in your classroom row? Let us count to ten in French.',
    explain: [
      'Six to ten are «six, sept, huit, neuf, dix».',
      'To say how many there are, use «Il y a»: «Il y a huit chaises».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '6', label: 'six' },
        { icon: '7', label: 'sept' },
        { icon: '8', label: 'huit' },
        { icon: '9', label: 'neuf' },
        { icon: '10', label: 'dix' },
      ],
    },
    artCaption: 'The numbers six to ten.',
    words: [
      { term: 'Il y a', meaning: 'There are, or there is.' },
      { term: 'sept', meaning: 'Seven.' },
      { term: 'huit', meaning: 'Eight.' },
      { term: 'dix', meaning: 'Ten.' },
    ],
    examples: [
      {
        title: 'Nine chairs',
        situation: 'You count nine chairs. How do you say it?',
        steps: ['Start with «Il y a».', 'Nine is «neuf».'],
        answer: '«Il y a neuf chaises.»',
      },
    ],
    mistakes: [
      { wrong: 'Mixing up six and dix.', right: 'Six is «six». Ten is «dix».' },
    ],
    realLife: ['Counting chairs.', 'Counting steps on the stairs.'],
    tryIt: {
      need: 'Ten counters',
      steps: [
        'Put some counters on the table.',
        'Count them in French.',
        'Say «Il y a» and the number.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word is eight?',
        options: ['huit', 'neuf'],
        answer: 0,
        why: 'That word means eight.',
      },
    ],
    sayIt: { phrase: 'Il y a dix chaises.', meaning: 'There are ten chairs.' },
  },
  'french-06': {
    indicator: goal('Say the colour of things in French.'),
    hook: 'The sky is blue and the grass is green. Let us say colours in sentences.',
    explain: [
      'In French, the colour comes after the thing.',
      'The sky is blue is «Le ciel est bleu».',
      'The grass is green is «L’herbe est verte».',
    ],
    art: {
      kind: 'cards',
      items: [
        { colour: '#d9412f', label: 'rouge' },
        { colour: '#2b6cb0', label: 'bleu' },
        { colour: '#1f8a70', label: 'vert' },
        { colour: '#f2c230', label: 'jaune' },
      ],
    },
    artCaption: 'Four colours.',
    words: [
      { term: 'Le ciel est bleu.', meaning: 'The sky is blue.' },
      { term: 'De quelle couleur ?', meaning: 'What colour?' },
      { term: 'rouge', meaning: 'Red.' },
      { term: 'jaune', meaning: 'Yellow.' },
    ],
    examples: [
      {
        title: 'A red ball',
        situation: 'Your ball is red. How do you say it?',
        steps: ['The ball is «le ballon».', 'Red is «rouge».'],
        answer: '«Le ballon est rouge.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Putting the colour first.',
        right: 'Say the thing first, then the colour.',
      },
    ],
    realLife: ['Describing your clothes.', 'Drawing and colouring.'],
    tryIt: {
      need: 'Coloured things',
      steps: [
        'Hold up something.',
        'Your friend asks «De quelle couleur ?»',
        'Answer with the colour.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence means the sky is blue?',
        options: ['Le ciel est bleu.', 'Le ciel est rouge.'],
        answer: 0,
        why: 'That one says the sky is blue.',
      },
    ],
    sayIt: { phrase: 'Le ciel est bleu.', meaning: 'The sky is blue.' },
  },
  'french-07': {
    indicator: goal(
      'Ask what something is and name classroom things in French.',
    ),
    hook: 'What is this? Let us ask and answer about things in the classroom.',
    explain: [
      'To ask what something is, say «Qu’est-ce que c’est ?»',
      'To answer, say «C’est» and the thing: «C’est un livre».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Qu’est-ce que c’est ?' },
        { who: 1, text: 'C’est un stylo.' },
        { who: 0, text: 'Et ça ?' },
        { who: 1, text: 'C’est une table.' },
      ],
    },
    artCaption: 'Two pupils name things in the classroom.',
    words: [
      { term: 'Qu’est-ce que c’est ?', meaning: 'What is it?' },
      { term: 'C’est', meaning: 'It is.' },
      { term: 'un stylo', meaning: 'A pen.' },
      { term: 'une table', meaning: 'A table.' },
    ],
    examples: [
      {
        title: 'A bag',
        situation:
          'Your friend points at your bag and asks what it is. What do you say?',
        steps: ['Start with «C’est».', 'Add «un sac».'],
        answer: '«C’est un sac.»',
      },
    ],
    mistakes: [
      { wrong: 'Answering with only the thing.', right: 'Start with «C’est».' },
    ],
    realLife: ['Picture walks.', 'Guessing games.'],
    tryIt: {
      need: 'A friend and classroom things',
      steps: [
        'Point to something.',
        'Ask «Qu’est-ce que c’est ?»',
        'Your friend answers with «C’est».',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean it is?',
        options: ['C’est', 'Il y a'],
        answer: 0,
        why: 'Those words mean it is.',
      },
    ],
    sayIt: { phrase: 'Qu’est-ce que c’est ?', meaning: 'What is it?' },
  },
  'french-08': {
    indicator: goal('Introduce members of your family in French.'),
    hook: 'Let us show a family photo and say who is who, in French.',
    explain: [
      'To show someone, say «Voici», which means here is: «Voici mon papa».',
      'To say you have a brother, say «J’ai un frère». For a sister, say «J’ai une sœur».',
    ],
    art: {
      kind: 'family',
      rows: [
        ['mon papa', 'ma maman'],
        ['moi', 'mon frère', 'ma sœur'],
      ],
    },
    artCaption: 'A family photo with French names.',
    words: [
      { term: 'Voici', meaning: 'Here is.' },
      { term: 'mon papa', meaning: 'My daddy.' },
      { term: 'ma maman', meaning: 'My mummy.' },
      { term: 'J’ai un frère.', meaning: 'I have a brother.' },
    ],
    examples: [
      {
        title: 'A sister',
        situation: 'You have one sister. How do you say it?',
        steps: ['Start with «J’ai».', 'Add «une sœur».'],
        answer: '«J’ai une sœur.»',
      },
    ],
    mistakes: [
      { wrong: 'Saying «mon maman».', right: 'Say «ma maman» and «mon papa».' },
    ],
    realLife: ['Family photos.', 'Talking about home.'],
    tryIt: {
      need: 'A drawing of a pretend family',
      steps: [
        'Point to each person.',
        'Say «Voici» and who it is.',
        'Say how many brothers or sisters.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means here is my daddy?',
        options: ['Voici mon papa.', 'J’ai un frère.'],
        answer: 0,
        why: 'That one shows your daddy.',
      },
    ],
    sayIt: { phrase: 'Voici ma maman.', meaning: 'Here is my mummy.' },
  },
  'french-09': {
    indicator: goal('Follow simple body instructions in French.'),
    hook: 'Touch your head! Clap your hands! Let us play a body game in French.',
    explain: [
      'In the game, the teacher says «Touchez» and a body part.',
      'Touch your head is «Touchez la tête».',
      'Clap your hands is «Tapez des mains».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🙂', label: 'la tête' },
        { icon: '👀', label: 'les yeux' },
        { icon: '👂', label: 'les oreilles' },
        { icon: '👐', label: 'les mains' },
      ],
    },
    artCaption: 'Parts of the body.',
    words: [
      { term: 'Touchez', meaning: 'Touch.' },
      { term: 'les oreilles', meaning: 'The ears.' },
      { term: 'la bouche', meaning: 'The mouth.' },
      { term: 'Tapez des mains !', meaning: 'Clap your hands!' },
    ],
    examples: [
      {
        title: 'Listen and do',
        situation:
          'The teacher says «Touchez les oreilles». What do you touch?',
        steps: ['Listen for the body word.'],
        answer: 'Your ears.',
      },
    ],
    mistakes: [
      {
        wrong: 'Moving before you hear the body word.',
        right: 'Listen to the whole instruction first.',
      },
    ],
    realLife: ['Action songs.', 'PE warm-ups.'],
    tryIt: {
      need: 'Friends',
      steps: [
        'One person gives a «Touchez» instruction.',
        'Everyone touches that part.',
        'Take turns.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means the ears?',
        options: ['les oreilles', 'la bouche'],
        answer: 0,
        why: 'That means the ears.',
      },
    ],
    sayIt: { phrase: 'Touchez la tête !', meaning: 'Touch your head!' },
  },
  'french-10': {
    indicator: goal('Say what day it is today in French.'),
    hook: 'What day is it today? Let us say it in French.',
    explain: [
      'To say what day it is, say «Aujourd’hui, c’est» and the day.',
      'The days are «lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche».',
    ],
    art: {
      kind: 'calendar',
      month: 'mars',
      days: 31,
      startsOn: 0,
      focus: 4,
      heads: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    },
    artCaption: 'A calendar. Today is a Wednesday.',
    words: [
      { term: 'aujourd’hui', meaning: 'Today.' },
      { term: 'jeudi', meaning: 'Thursday.' },
      { term: 'vendredi', meaning: 'Friday.' },
      { term: 'dimanche', meaning: 'Sunday.' },
    ],
    examples: [
      {
        title: 'Friday',
        situation: 'Today is Friday. How do you say it?',
        steps: ['Start with «Aujourd’hui, c’est».', 'Friday is «vendredi».'],
        answer: '«Aujourd’hui, c’est vendredi.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Starting the week on Sunday in a French chant.',
        right: 'In French the week song usually starts with «lundi».',
      },
    ],
    realLife: ['Morning circle time.', 'The class calendar.'],
    tryIt: {
      need: 'A calendar',
      steps: [
        'Find today.',
        'Say «Aujourd’hui, c’est» and the day.',
        'Say all seven days in order.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means today?',
        options: ['aujourd’hui', 'dimanche'],
        answer: 0,
        why: 'That word means today.',
      },
    ],
    sayIt: { phrase: 'Aujourd’hui, c’est lundi.', meaning: 'Today is Monday.' },
  },
  'french-11': {
    indicator: goal('Say which food you like and do not like in French.'),
    hook: 'Some foods we love, and some we do not. Let us say both in French.',
    explain: [
      'To say you like something, say «J’aime».',
      'To say you do not like it, say «Je n’aime pas».',
      'For example, «J’aime le riz» and «Je n’aime pas le poisson».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🍚', label: 'le riz' },
        { icon: '🐟', label: 'le poisson' },
        { icon: '🍌', label: 'la banane' },
        { icon: '🍊', label: 'l’orange' },
      ],
    },
    artCaption: 'Foods to talk about.',
    words: [
      { term: 'Je n’aime pas', meaning: 'I do not like.' },
      { term: 'le poisson', meaning: 'Fish.' },
      { term: 'J’aime', meaning: 'I like.' },
    ],
    examples: [
      {
        title: 'Not fish',
        situation: 'You do not like fish. How do you say it?',
        steps: ['Start with «Je n’aime pas».', 'Add «le poisson».'],
        answer: '«Je n’aime pas le poisson.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Being rude about food someone made.',
        right: 'Say «Je n’aime pas» kindly, and say thank you.',
      },
    ],
    realLife: ['Lunch time.', 'Cooking at home.'],
    tryIt: {
      need: 'Food pictures',
      steps: [
        'Pick a picture.',
        'Say «J’aime» or «Je n’aime pas».',
        'Ask a friend «Tu aimes ?»',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means I do not like?',
        options: ['Je n’aime pas', 'J’aime'],
        answer: 0,
        why: 'Those words mean I do not like.',
      },
    ],
    sayIt: { phrase: 'J’aime la banane.', meaning: 'I like bananas.' },
  },
  'french-12': {
    indicator: goal('Name animals and say if they are big or small in French.'),
    hook: 'An elephant is big. A cat is small. Let us describe animals in French.',
    explain: [
      'Big is «grand» and small is «petit».',
      'To describe an animal, say «C’est un chat. Il est petit».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🐘', label: 'un éléphant' },
        { icon: '🐈', label: 'un chat' },
        { icon: '🐕', label: 'un chien' },
        { icon: '🐦', label: 'un oiseau' },
      ],
    },
    artCaption: 'Big and small animals.',
    words: [
      { term: 'grand', meaning: 'Big.' },
      { term: 'petit', meaning: 'Small.' },
      { term: 'un éléphant', meaning: 'An elephant.' },
      { term: 'un oiseau', meaning: 'A bird.' },
    ],
    examples: [
      {
        title: 'The elephant',
        situation: 'Is an elephant big or small? Say it in French.',
        steps: ['An elephant is very big.'],
        answer: '«Il est grand.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up big and small.',
        right: 'Big is «grand». Small is «petit».',
      },
    ],
    realLife: ['Zoo visits.', 'Animals at home.'],
    tryIt: {
      need: 'Animal pictures',
      steps: ['Pick an animal.', 'Say its name.', 'Say if it is big or small.'],
    },
    quiz: [
      {
        prompt: 'Which word means small?',
        options: ['petit', 'grand'],
        answer: 0,
        why: 'That word means small.',
      },
    ],
    sayIt: {
      phrase: 'C’est un chat. Il est petit.',
      meaning: 'It is a cat. It is small.',
    },
  },
  'french-13': {
    indicator: goal('Say which town you live in, without giving an address.'),
    hook: 'Ghana has many towns. Which one do you live in? Let us say it in French.',
    explain: [
      'For a country, say «J’habite au Ghana».',
      'For a town, use «à»: «J’habite à Kumasi».',
      'To ask, say «Où habites-tu ?»',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Où habites-tu ?' },
        { who: 1, text: 'J’habite à Kumasi.' },
        { who: 1, text: 'Et toi ?' },
        { who: 0, text: 'J’habite à Tamale.' },
      ],
    },
    artCaption: 'Two children say which town they live in.',
    words: [
      { term: 'Où habites-tu ?', meaning: 'Where do you live?' },
      { term: 'J’habite à', meaning: 'I live in, for a town.' },
      { term: 'J’habite au Ghana', meaning: 'I live in Ghana.' },
    ],
    examples: [
      {
        title: 'Cape Coast',
        situation: 'You live in Cape Coast. How do you say it?',
        steps: ['A town uses «à».'],
        answer: '«J’habite à Cape Coast.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Giving your house number to someone you do not know.',
        right: 'Say only your town or country.',
      },
    ],
    realLife: ['Talking to visitors.', 'Map games.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Ask «Où habites-tu ?»',
        'Answer with your town.',
        'Find the towns on a map of Ghana.',
      ],
    },
    safety: [
      'Only say your town or country. Never tell strangers your house or street.',
    ],
    quiz: [
      {
        prompt: 'Which one means where do you live?',
        options: ['Où habites-tu ?', 'Comment tu t’appelles ?'],
        answer: 0,
        why: 'That asks where you live.',
      },
    ],
    sayIt: { phrase: 'J’habite au Ghana.', meaning: 'I live in Ghana.' },
  },
  'french-14': {
    indicator: goal('Ask and say o’clock times from one to six in French.'),
    hook: 'What time is it? Let us ask and answer in French.',
    explain: [
      'To ask the time, say «Quelle heure est-il ?»',
      'To answer, say «Il est» and the hour: «Il est trois heures».',
    ],
    art: { kind: 'clock', hour: 3, minute: 0, label: '3:00' },
    artCaption: 'The clock shows three o’clock.',
    words: [
      { term: 'Quelle heure est-il ?', meaning: 'What time is it?' },
      { term: 'Il est trois heures.', meaning: 'It is three o’clock.' },
      { term: 'six heures', meaning: 'Six o’clock.' },
    ],
    examples: [
      {
        title: 'Five o’clock',
        situation:
          'The short hand points to 5 and the long hand to 12. What time is it?',
        steps: ['Start with «Il est».', 'Five is «cinq».'],
        answer: '«Il est cinq heures.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting «heures».',
        right: 'Say the number and then «heures».',
      },
    ],
    realLife: ['Break time.', 'Bed time.'],
    tryIt: {
      need: 'A toy clock',
      steps: [
        'Set an hour from one to six.',
        'Your friend asks «Quelle heure est-il ?»',
        'Answer, then swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one asks what time it is?',
        options: ['Quelle heure est-il ?', 'Il est trois heures.'],
        answer: 0,
        why: 'That one asks the time.',
      },
    ],
    sayIt: { phrase: 'Quelle heure est-il ?', meaning: 'What time is it?' },
  },
  'french-15': {
    indicator: goal('Say what you are doing in French.'),
    hook: 'I sing! I dance! Let us say what we do in French.',
    explain: [
      'To say what you do, start with «Je».',
      'I sing is «Je chante» and I dance is «Je danse».',
      'I walk is «Je marche» and I read is «Je lis».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🎤', label: 'Je chante.' },
        { icon: '💃', label: 'Je danse.' },
        { icon: '🚶', label: 'Je marche.' },
        { icon: '📚', label: 'Je lis.' },
      ],
    },
    artCaption: 'Saying what I do.',
    words: [
      { term: 'Je chante.', meaning: 'I sing.' },
      { term: 'Je danse.', meaning: 'I dance.' },
      { term: 'Je marche.', meaning: 'I walk.' },
      { term: 'Je lis.', meaning: 'I read.' },
    ],
    examples: [
      {
        title: 'Story time',
        situation: 'You are reading a book. What do you say?',
        steps: ['I read is «Je lis».'],
        answer: '«Je lis.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying only the action word.',
        right: 'Start with «Je»: «Je chante».',
      },
    ],
    realLife: ['Action games.', 'Music time.'],
    tryIt: {
      need: 'Friends',
      steps: [
        'Do an action.',
        'Say what you are doing with «Je».',
        'Your friends copy you.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means I dance?',
        options: ['Je danse.', 'Je chante.'],
        answer: 0,
        why: 'That one means I dance.',
      },
    ],
    sayIt: {
      phrase: 'Je chante et je danse !',
      meaning: 'I sing and I dance!',
    },
  },
  'french-16': {
    indicator: goal('Say what you are wearing in French.'),
    hook: 'What are you wearing today? Let us say it in French.',
    explain: [
      'To say what you wear, say «Je porte».',
      'For example, «Je porte une chemise» or «Je porte une robe».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '👕', label: 'une chemise' },
        { icon: '👗', label: 'une robe' },
        { icon: '👟', label: 'des chaussures' },
        { icon: '🧢', label: 'une casquette' },
      ],
    },
    artCaption: 'Clothes we wear.',
    words: [
      { term: 'Je porte', meaning: 'I am wearing.' },
      { term: 'une casquette', meaning: 'A cap.' },
      { term: 'des chaussures', meaning: 'Shoes.' },
    ],
    examples: [
      {
        title: 'A cap',
        situation: 'You are wearing a cap. How do you say it?',
        steps: ['Start with «Je porte».', 'Add «une casquette».'],
        answer: '«Je porte une casquette.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out «une» or «des».',
        right: 'Say «une robe», «des chaussures».',
      },
    ],
    realLife: ['Getting dressed.', 'Dressing-up games.'],
    tryIt: {
      need: 'Your clothes',
      steps: [
        'Point to something you wear.',
        'Say «Je porte» and its name.',
        'Do it for two things.',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean I am wearing?',
        options: ['Je porte', 'J’aime'],
        answer: 0,
        why: 'Those words mean I am wearing.',
      },
    ],
    sayIt: {
      phrase: 'Je porte une chemise.',
      meaning: 'I am wearing a shirt.',
    },
  },
  'french-17': {
    indicator: goal('Ask the price and buy something at the market in French.'),
    hook: 'At the market, we ask how much things cost. Let us do it in French.',
    explain: [
      'To ask the price, say «C’est combien ?»',
      'The seller answers with the price, such as «C’est deux cedis».',
      'Say «Merci» when you pay.',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Je voudrais une mangue.' },
        { who: 0, text: 'C’est combien ?' },
        { who: 1, text: 'C’est deux cedis.' },
        { who: 0, text: 'Voilà. Merci !' },
      ],
    },
    artCaption: 'A child buys a mango.',
    words: [
      { term: 'C’est combien ?', meaning: 'How much is it?' },
      { term: 'deux cedis', meaning: 'Two cedis.' },
      { term: 'Je voudrais', meaning: 'I would like.' },
    ],
    examples: [
      {
        title: 'Three cedis',
        situation:
          'The seller says the oranges cost three cedis. What does she say?',
        steps: ['Start with «C’est».', 'Three is «trois».'],
        answer: '«C’est trois cedis.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Taking something before you pay.',
        right: 'Ask the price, pay, then say «Merci».',
      },
    ],
    realLife: ['Going to the market with a grown-up.', 'Shop games.'],
    tryIt: {
      need: 'A friend and pretend money',
      steps: [
        'One of you sells fruit.',
        'Ask «C’est combien ?»',
        'Pay and say «Merci».',
      ],
    },
    quiz: [
      {
        prompt: 'How do you ask how much something costs?',
        options: ['C’est combien ?', 'Qu’est-ce que c’est ?'],
        answer: 0,
        why: 'That asks the price.',
      },
    ],
    sayIt: { phrase: 'C’est combien ?', meaning: 'How much is it?' },
  },
  'french-18': {
    indicator: goal('Describe more kinds of weather in French.'),
    hook: 'Hot, cold, rainy or windy? Let us describe the weather in French.',
    explain: [
      'Hot is «Il fait chaud» and cold is «Il fait froid».',
      'Rain is «Il pleut» and wind is «Il y a du vent».',
      'To ask about the weather, say «Quel temps fait-il ?»',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '☀️', label: 'Il fait chaud.' },
        { icon: '🥶', label: 'Il fait froid.' },
        { icon: '🌧️', label: 'Il pleut.' },
        { icon: '💨', label: 'Il y a du vent.' },
      ],
    },
    artCaption: 'Four kinds of weather.',
    words: [
      { term: 'Quel temps fait-il ?', meaning: 'What is the weather like?' },
      { term: 'Il fait froid.', meaning: 'It is cold.' },
      { term: 'Il y a du vent.', meaning: 'It is windy.' },
      { term: 'Il pleut.', meaning: 'It is raining.' },
    ],
    examples: [
      {
        title: 'A windy day',
        situation:
          'The trees are bending and leaves are flying. What is the weather?',
        steps: ['The wind is blowing.'],
        answer: '«Il y a du vent.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up hot and cold.',
        right: 'Hot is «chaud». Cold is «froid».',
      },
    ],
    realLife: ['The weather chart in class.', 'Harmattan mornings.'],
    tryIt: {
      need: 'A window',
      steps: [
        'Ask «Quel temps fait-il ?»',
        'Look outside.',
        'Answer in French.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means it is cold?',
        options: ['Il fait froid.', 'Il fait chaud.'],
        answer: 0,
        why: 'That means it is cold.',
      },
    ],
    sayIt: {
      phrase: 'Quel temps fait-il ?',
      meaning: 'What is the weather like?',
    },
  },
  'french-19': {
    indicator: goal('Ask and answer simple who and where questions in French.'),
    hook: 'Who is it? Where is the cat? Let us ask and answer in French.',
    explain: [
      'To ask who someone is, say «Qui est-ce ?» Answer with «C’est» and the name.',
      'To ask where something is, say «Où est» and the thing: «Où est le chat ?»',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Qui est-ce ?' },
        { who: 1, text: 'C’est Ama.' },
        { who: 0, text: 'Où est le chat ?' },
        { who: 1, text: 'Il est là !' },
      ],
    },
    artCaption: 'Two friends ask who and where.',
    words: [
      { term: 'Qui est-ce ?', meaning: 'Who is it?' },
      { term: 'Où est… ?', meaning: 'Where is…?' },
      { term: 'Il est là.', meaning: 'It is there.' },
    ],
    examples: [
      {
        title: 'Your teacher',
        situation:
          'A visitor points at your teacher and asks «Qui est-ce ?» What do you say?',
        steps: ['Start with «C’est».', 'Add her name.'],
        answer: '«C’est Madame Owusu.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering a where question with a name.',
        right: 'Where questions need a place: «Il est là».',
      },
    ],
    realLife: ['Finding lost things.', 'Meeting people.'],
    tryIt: {
      need: 'A friend and a toy',
      steps: [
        'Hide the toy.',
        'Your friend asks «Où est… ?»',
        'Point and say «Il est là !»',
      ],
    },
    quiz: [
      {
        prompt: 'Which one asks who it is?',
        options: ['Qui est-ce ?', 'Où est le chat ?'],
        answer: 0,
        why: 'That asks who someone is.',
      },
    ],
    sayIt: { phrase: 'Où est le chat ?', meaning: 'Where is the cat?' },
  },
  'french-20': {
    indicator: goal('Hold a short conversation about yourself in French.'),
    hook: 'Let us put together everything we know into one little conversation.',
    explain: [
      'Greet with «Bonjour», then say your name with «Je m’appelle».',
      'Say your age with «J’ai» and «ans»: «J’ai sept ans».',
      'Say something you like with «J’aime», then say «Au revoir».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Bonjour ! Je m’appelle Akosua.' },
        { who: 0, text: 'J’ai sept ans.' },
        { who: 0, text: 'J’aime le football.' },
        { who: 1, text: 'Super ! Au revoir !' },
      ],
    },
    artCaption: 'Akosua talks about herself.',
    words: [
      { term: 'J’ai sept ans.', meaning: 'I am seven years old.' },
      { term: 'Je m’appelle', meaning: 'My name is.' },
      { term: 'J’aime', meaning: 'I like.' },
    ],
    examples: [
      {
        title: 'Your age',
        situation: 'You are six. How do you say it?',
        steps: ['Start with «J’ai».', 'Add «six ans».'],
        answer: '«J’ai six ans.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting «ans» after your age.',
        right: 'Say «J’ai sept ans».',
      },
    ],
    realLife: ['Talking to a French-speaking visitor.', 'A class show.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Practise four sentences about yourself.',
        'Say them to your friend.',
        'Listen to theirs.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means I am seven years old?',
        options: ['J’ai sept ans.', 'Il est sept heures.'],
        answer: 0,
        why: 'That one tells your age.',
      },
    ],
    sayIt: {
      phrase: 'Je m’appelle… J’ai sept ans.',
      meaning: 'My name is… I am seven years old.',
    },
  },
}
