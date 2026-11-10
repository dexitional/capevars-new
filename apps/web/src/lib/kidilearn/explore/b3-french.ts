import type { CourseGuides } from './types'

// Basic 3 French, written for this course for seven- and eight-year-olds. The
// national French curriculum starts at Basic 4, so these follow KidiLearn's own
// early-French goals. Each lesson's goal at this level adds "Je peux poser une
// question et répondre": every guide practises asking and answering.
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
      'Greet people at different times of day, and ask and answer how they are.',
    ),
    hook: 'Morning, evening or bedtime: each has its own French greeting. Can you ask how someone is too?',
    explain: [
      'Say «Bonjour» in the day, «Bonsoir» in the evening and «Bonne nuit» at bedtime.',
      'To ask a friend how they are, say «Comment vas-tu ?»',
      'A good answer is «Très bien, merci. Et toi ?»',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Bonsoir, Kwame ! Comment vas-tu ?' },
        { who: 1, text: 'Très bien, merci. Et toi ?' },
        { who: 0, text: 'Ça va bien !' },
        { who: 1, text: 'Bonne nuit !' },
      ],
    },
    artCaption: 'Two friends greet each other in the evening.',
    words: [
      { term: 'Comment vas-tu ?', meaning: 'How are you?' },
      { term: 'Très bien, merci.', meaning: 'Very well, thank you.' },
      { term: 'Bonne nuit !', meaning: 'Good night!' },
      { term: 'Et toi ?', meaning: 'And you?' },
    ],
    examples: [
      {
        title: 'Bedtime',
        situation: 'It is time for bed. What do you say to your family?',
        steps: ['Bedtime has its own greeting.'],
        answer: '«Bonne nuit !»',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering «Comment vas-tu ?» without asking back.',
        right: 'Add «Et toi ?» to be friendly.',
      },
    ],
    realLife: ['Greetings at home.', 'Greeting friends after school.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Choose a time of day.',
        'Greet your friend the right way.',
        'Ask and answer «Comment vas-tu ?»',
      ],
    },
    quiz: [
      {
        prompt: 'What do you say at bedtime?',
        options: ['Bonne nuit !', 'Bonjour !', 'Bonsoir !'],
        answer: 0,
        why: 'That is the bedtime greeting.',
      },
    ],
    sayIt: { phrase: 'Comment vas-tu ?', meaning: 'How are you?' },
  },
  'french-02': {
    indicator: goal(
      'Ask and answer questions about names, your own and other people’s.',
    ),
    hook: 'Can you ask what a friend is called, and tell someone what another person is called?',
    explain: [
      'To ask a friend’s name, say «Comment tu t’appelles ?»',
      'To ask about a boy, say «Comment s’appelle-t-il ?» The answer is «Il s’appelle» and his name.',
      'For a girl, ask «Comment s’appelle-t-elle ?» The answer is «Elle s’appelle» and her name.',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Comment s’appelle-t-il ?' },
        { who: 1, text: 'Il s’appelle Yaw.' },
        { who: 0, text: 'Et elle ?' },
        { who: 1, text: 'Elle s’appelle Efua.' },
      ],
    },
    artCaption: 'Two friends talk about classmates’ names.',
    words: [
      { term: 'Il s’appelle', meaning: 'His name is.' },
      { term: 'Elle s’appelle', meaning: 'Her name is.' },
      { term: 'Comment s’appelle-t-il ?', meaning: 'What is his name?' },
    ],
    examples: [
      {
        title: 'Your teacher',
        situation:
          'Someone asks your teacher’s name. She is Mrs Asare. What do you say?',
        steps: ['She is a woman, so use «Elle».'],
        answer: '«Elle s’appelle Madame Asare.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Using «Il» for a girl.',
        right: 'Use «Elle» for a girl or a woman.',
      },
    ],
    realLife: ['Introducing friends.', 'Talking about your class.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Point to a classmate.',
        'Ask «Comment s’appelle-t-il ?» or «… -t-elle ?»',
        'Your friend answers.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence is about a girl?',
        options: ['Elle s’appelle Efua.', 'Il s’appelle Yaw.'],
        answer: 0,
        why: 'It uses the word for she.',
      },
    ],
    sayIt: { phrase: 'Il s’appelle Yaw.', meaning: 'His name is Yaw.' },
  },
  'french-03': {
    indicator: goal('Ask politely for permission and answer in French.'),
    hook: 'May I go out? May I borrow a pencil? Let us ask politely in French.',
    explain: [
      'To ask if you may do something, start with «Est-ce que je peux… ?»',
      'For example, «Est-ce que je peux sortir, s’il vous plaît ?»',
      'The answer may be «Oui, bien sûr» or «Non, pas maintenant».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Est-ce que je peux sortir ?' },
        { who: 1, text: 'Oui, bien sûr.' },
        { who: 0, text: 'Merci, Madame !' },
      ],
    },
    artCaption: 'A pupil asks to go out.',
    words: [
      { term: 'Est-ce que je peux… ?', meaning: 'May I…?' },
      { term: 'Oui, bien sûr.', meaning: 'Yes, of course.' },
      { term: 'Non, pas maintenant.', meaning: 'No, not now.' },
      { term: 'sortir', meaning: 'To go out.' },
    ],
    examples: [
      {
        title: 'Borrowing',
        situation: 'You want to borrow a pencil. How do you ask?',
        steps: [
          'Start with «Est-ce que je peux».',
          'Add «emprunter un crayon» and «s’il te plaît».',
        ],
        answer: '«Est-ce que je peux emprunter un crayon, s’il te plaît ?»',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving the room without asking.',
        right: 'Ask first with «Est-ce que je peux… ?»',
      },
    ],
    realLife: ['Asking to go out.', 'Borrowing things.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Ask permission for something.',
        'Your friend answers yes or no.',
        'Say «Merci» either way.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means yes, of course?',
        options: ['Oui, bien sûr.', 'Non, pas maintenant.'],
        answer: 0,
        why: 'That one says yes.',
      },
    ],
    sayIt: {
      phrase: 'Est-ce que je peux sortir, s’il vous plaît ?',
      meaning: 'May I go out, please?',
    },
  },
  'french-04': {
    indicator: goal('Add small numbers and say the answer in French.'),
    hook: 'Two mangoes and three mangoes make…? Let us do sums in French.',
    explain: [
      'Plus is «plus», and makes is «égale».',
      'Two plus three makes five is «Deux plus trois égale cinq».',
      'To ask, say «Combien font deux plus deux ?»',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🥭🥭', label: 'deux' },
        { icon: '+', label: 'plus' },
        { icon: '🥭🥭🥭', label: 'trois' },
        { icon: '=', label: 'égale cinq' },
      ],
    },
    artCaption: 'Two mangoes plus three mangoes make five.',
    words: [
      { term: 'plus', meaning: 'Plus, or add.' },
      { term: 'égale', meaning: 'Makes, or equals.' },
      { term: 'Combien font… ?', meaning: 'How much is…?' },
      { term: 'quatre', meaning: 'Four.' },
    ],
    examples: [
      {
        title: 'One and three',
        situation: 'What is one plus three? Say it in French.',
        steps: ['One and three make four.', 'Four is «quatre».'],
        answer: '«Un plus trois égale quatre.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying the answer without counting.',
        right: 'Count on your fingers, then say it.',
      },
    ],
    realLife: ['Counting money.', 'Sharing fruit.'],
    tryIt: {
      need: 'Five counters',
      steps: [
        'Make two small groups.',
        'Say the sum in French.',
        'Your friend checks by counting.',
      ],
    },
    quiz: [
      {
        prompt: 'Two plus two makes four. Which is the answer word?',
        options: ['quatre', 'cinq', 'trois'],
        answer: 0,
        why: 'Two and two make four.',
      },
    ],
    sayIt: {
      phrase: 'Deux plus trois égale cinq.',
      meaning: 'Two plus three equals five.',
    },
  },
  'french-05': {
    indicator: goal('Take away within ten and say the answer in French.'),
    hook: 'You have ten sweets and give four away. How many are left? Let us say it in French.',
    explain: [
      'Take away is «moins».',
      'Ten take away four makes six is «Dix moins quatre égale six».',
      'The numbers six to ten are «six, sept, huit, neuf, dix».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '10', label: 'dix' },
        { icon: '−', label: 'moins' },
        { icon: '4', label: 'quatre' },
        { icon: '=', label: 'égale six' },
      ],
    },
    artCaption: 'Ten take away four makes six.',
    words: [
      { term: 'moins', meaning: 'Take away, or minus.' },
      { term: 'six', meaning: 'Six.' },
      { term: 'neuf', meaning: 'Nine.' },
      { term: 'dix', meaning: 'Ten.' },
    ],
    examples: [
      {
        title: 'Nine take away two',
        situation: 'Nine take away two. What is left?',
        steps: ['Nine take away two leaves seven.', 'Seven is «sept».'],
        answer: '«Neuf moins deux égale sept.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up plus and minus.',
        right: 'Plus is «plus». Take away is «moins».',
      },
    ],
    realLife: ['Sharing sweets.', 'Counting change.'],
    tryIt: {
      need: 'Ten counters',
      steps: ['Start with ten.', 'Take some away.', 'Say the sum in French.'],
    },
    quiz: [
      {
        prompt: 'Which word means take away?',
        options: ['moins', 'plus'],
        answer: 0,
        why: 'That word means take away.',
      },
    ],
    sayIt: {
      phrase: 'Dix moins quatre égale six.',
      meaning: 'Ten minus four equals six.',
    },
  },
  'french-06': {
    indicator: goal('Ask and answer about favourite colours in French.'),
    hook: 'What is your favourite colour? Let us ask our friends in French.',
    explain: [
      'To ask, say «Quelle est ta couleur préférée ?»',
      'To answer, say «Ma couleur préférée est» and the colour.',
      'For example, «Ma couleur préférée est le vert».',
    ],
    art: {
      kind: 'cards',
      items: [
        { colour: '#d9412f', label: 'rouge' },
        { colour: '#2b6cb0', label: 'bleu' },
        { colour: '#1f8a70', label: 'vert' },
        { colour: '#f2c230', label: 'jaune' },
        { colour: '#7b4fb0', label: 'violet' },
        { colour: '#f08a24', label: 'orange' },
      ],
    },
    artCaption: 'Six colours to choose from.',
    words: [
      {
        term: 'Quelle est ta couleur préférée ?',
        meaning: 'What is your favourite colour?',
      },
      { term: 'préférée', meaning: 'Favourite.' },
      { term: 'violet', meaning: 'Purple.' },
    ],
    examples: [
      {
        title: 'Purple',
        situation: 'Your favourite colour is purple. What do you say?',
        steps: [
          'Start with «Ma couleur préférée est».',
          'Purple is «le violet».',
        ],
        answer: '«Ma couleur préférée est le violet.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering with only the colour.',
        right: 'Say the whole sentence.',
      },
    ],
    realLife: ['Choosing crayons.', 'Class surveys.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Ask five friends their favourite colour.',
        'Make a tally.',
        'Say which colour won.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means purple?',
        options: ['violet', 'vert', 'rouge'],
        answer: 0,
        why: 'That word means purple.',
      },
    ],
    sayIt: {
      phrase: 'Ma couleur préférée est le bleu.',
      meaning: 'My favourite colour is blue.',
    },
  },
  'french-07': {
    indicator: goal(
      'Ask if someone has a classroom thing, and answer yes or no.',
    ),
    hook: 'Have you got a ruler? Let us ask and answer in French.',
    explain: [
      'To ask, say «As-tu» and the thing: «As-tu un crayon ?»',
      'For yes, say «Oui, j’ai un crayon».',
      'For no, say «Non, je n’ai pas de crayon». The «un» changes to «de».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'As-tu une règle ?' },
        { who: 1, text: 'Non, je n’ai pas de règle.' },
        { who: 0, text: 'As-tu un crayon ?' },
        { who: 1, text: 'Oui, j’ai un crayon.' },
      ],
    },
    artCaption: 'Two pupils check what they have.',
    words: [
      { term: 'As-tu… ?', meaning: 'Have you got…?' },
      { term: 'une règle', meaning: 'A ruler.' },
      { term: 'une gomme', meaning: 'A rubber, or eraser.' },
      { term: 'je n’ai pas de', meaning: 'I have not got any.' },
    ],
    examples: [
      {
        title: 'No rubber',
        situation: 'You have no rubber. How do you answer «As-tu une gomme ?»',
        steps: ['Say «Non».', 'Use «je n’ai pas de».'],
        answer: '«Non, je n’ai pas de gomme.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «je n’ai pas une gomme».',
        right: 'After «pas», use «de»: «pas de gomme».',
      },
    ],
    realLife: ['Sharing in class.', 'Checking your bag.'],
    tryIt: {
      need: 'A friend and a school bag',
      steps: [
        'Ask «As-tu…?» about three things.',
        'Your friend checks the bag.',
        'Answer yes or no.',
      ],
    },
    quiz: [
      {
        prompt: 'Which answer says no, I have not got a ruler?',
        options: ['Non, je n’ai pas de règle.', 'Oui, j’ai une règle.'],
        answer: 0,
        why: 'That one says no.',
      },
    ],
    sayIt: { phrase: 'As-tu un crayon ?', meaning: 'Have you got a pencil?' },
  },
  'french-08': {
    indicator: goal('Ask and answer about brothers and sisters in French.'),
    hook: 'Have you got brothers or sisters? Let us ask our friends in French.',
    explain: [
      'To ask, say «As-tu des frères et des sœurs ?»',
      'To answer, use «J’ai» and the number: «J’ai deux frères et une sœur».',
      'If you have none, say «Je suis enfant unique».',
    ],
    art: {
      kind: 'family',
      rows: [
        ['papa', 'maman'],
        ['mon frère', 'moi', 'ma sœur', 'mon frère'],
      ],
    },
    artCaption: 'A family with two brothers and a sister.',
    words: [
      { term: 'des frères', meaning: 'Brothers.' },
      { term: 'des sœurs', meaning: 'Sisters.' },
      { term: 'Je suis enfant unique.', meaning: 'I am an only child.' },
    ],
    examples: [
      {
        title: 'Count them',
        situation: 'Look at the family. How many brothers does the child have?',
        steps: ['Count «mon frère».', 'There are two.'],
        answer: '«J’ai deux frères.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «un frères».',
        right: 'One is «un frère»; more than one is «deux frères».',
      },
    ],
    realLife: ['Talking about home.', 'Making friends.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Ask «As-tu des frères et des sœurs ?»',
        'Listen and count.',
        'Tell the class.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means I am an only child?',
        options: ['Je suis enfant unique.', 'J’ai une sœur.'],
        answer: 0,
        why: 'That means you have no brothers or sisters.',
      },
    ],
    sayIt: {
      phrase: 'J’ai deux frères et une sœur.',
      meaning: 'I have two brothers and a sister.',
    },
  },
  'french-09': {
    indicator: goal(
      'Say where it hurts, and ask someone how they feel, in French.',
    ),
    hook: 'If you feel unwell, you need to tell a grown-up. Let us learn how in French.',
    explain: [
      'To ask what is wrong, say «Qu’est-ce que tu as ?»',
      'To say where it hurts, say «J’ai mal à» and the body part.',
      'My head hurts is «J’ai mal à la tête». My tummy hurts is «J’ai mal au ventre».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🤕', label: 'la tête' },
        { icon: '🤢', label: 'le ventre' },
        { icon: '🦷', label: 'les dents' },
        { icon: '🦶', label: 'le pied' },
      ],
    },
    artCaption: 'Places that can hurt.',
    words: [
      { term: 'J’ai mal à la tête.', meaning: 'My head hurts.' },
      { term: 'J’ai mal au ventre.', meaning: 'My tummy hurts.' },
      { term: 'Qu’est-ce que tu as ?', meaning: 'What is wrong?' },
      { term: 'les dents', meaning: 'Teeth.' },
    ],
    examples: [
      {
        title: 'A sore foot',
        situation: 'You hurt your foot playing. How do you say it?',
        steps: ['Use «J’ai mal au» because foot is «le pied».'],
        answer: '«J’ai mal au pied.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Keeping quiet when you feel unwell.',
        right: 'Tell a grown-up straight away.',
      },
    ],
    realLife: ['Telling a teacher you feel ill.', 'Visiting the clinic.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Act as if something hurts.',
        'Your friend asks «Qu’est-ce que tu as ?»',
        'Answer with «J’ai mal à…»',
      ],
    },
    safety: ['If you are hurt or feel ill, always tell a grown-up you trust.'],
    quiz: [
      {
        prompt: 'Which one means my head hurts?',
        options: ['J’ai mal à la tête.', 'J’ai mal au ventre.'],
        answer: 0,
        why: 'That one is about your head.',
      },
    ],
    sayIt: { phrase: 'J’ai mal à la tête.', meaning: 'My head hurts.' },
  },
  'french-10': {
    indicator: goal('Ask and answer what day it is, and what day tomorrow is.'),
    hook: 'Today is Monday, so what is tomorrow? Let us ask and answer in French.',
    explain: [
      'To ask what day it is, say «Quel jour sommes-nous ?»',
      'Answer with «Aujourd’hui, c’est» and the day.',
      'For tomorrow, say «Demain, c’est» and the next day.',
    ],
    art: {
      kind: 'calendar',
      month: 'mars',
      days: 31,
      startsOn: 0,
      focus: 9,
      heads: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    },
    artCaption: 'A calendar. Today is a Monday.',
    words: [
      { term: 'Quel jour sommes-nous ?', meaning: 'What day is it?' },
      { term: 'demain', meaning: 'Tomorrow.' },
      { term: 'mardi', meaning: 'Tuesday.' },
      { term: 'jeudi', meaning: 'Thursday.' },
    ],
    examples: [
      {
        title: 'Tomorrow',
        situation: 'Today is Wednesday. What is tomorrow?',
        steps: ['After Wednesday comes Thursday.'],
        answer: '«Demain, c’est jeudi.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying the day before instead of after.',
        right: 'Tomorrow is the next day.',
      },
    ],
    realLife: ['The class calendar.', 'Planning the week.'],
    tryIt: {
      need: 'A calendar',
      steps: [
        'Ask «Quel jour sommes-nous ?»',
        'Answer for today.',
        'Say what day tomorrow is.',
      ],
    },
    quiz: [
      {
        prompt: 'Today is Monday. What is tomorrow?',
        options: ['mardi', 'dimanche', 'jeudi'],
        answer: 0,
        why: 'Tuesday comes after Monday.',
      },
    ],
    sayIt: { phrase: 'Demain, c’est mardi.', meaning: 'Tomorrow is Tuesday.' },
  },
  'french-11': {
    indicator: goal('Ask and answer what someone likes to eat in French.'),
    hook: 'What do your friends like to eat? Let us find out in French.',
    explain: [
      'To ask, say «Qu’est-ce que tu aimes manger ?»',
      'To answer, say «J’aime manger» and the food: «J’aime manger le riz».',
      'You can also ask «Tu aimes le poisson ?» and answer «Oui» or «Non».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Qu’est-ce que tu aimes manger ?' },
        { who: 1, text: 'J’aime manger le kenkey.' },
        { who: 0, text: 'Tu aimes le poisson ?' },
        { who: 1, text: 'Oui, j’aime le poisson !' },
      ],
    },
    artCaption: 'Two friends talk about food.',
    words: [
      { term: 'manger', meaning: 'To eat.' },
      {
        term: 'Qu’est-ce que tu aimes manger ?',
        meaning: 'What do you like to eat?',
      },
      { term: 'le poisson', meaning: 'Fish.' },
    ],
    examples: [
      {
        title: 'Your answer',
        situation: 'You like eating rice. How do you answer?',
        steps: ['Start with «J’aime manger».', 'Add «le riz».'],
        answer: '«J’aime manger le riz.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering a yes or no question with a long list.',
        right: 'Start with «Oui» or «Non».',
      },
    ],
    realLife: ['Lunch time.', 'Family meals.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Ask three friends what they like to eat.',
        'Write their answers.',
        'Tell the class.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means to eat?',
        options: ['manger', 'danser', 'chanter'],
        answer: 0,
        why: 'That word means to eat.',
      },
    ],
    sayIt: {
      phrase: 'Qu’est-ce que tu aimes manger ?',
      meaning: 'What do you like to eat?',
    },
  },
  'french-12': {
    indicator: goal('Ask and answer which animals you like in French.'),
    hook: 'Do you like dogs or cats? Let us ask about animals in French.',
    explain: [
      'To ask, say «Quel animal aimes-tu ?»',
      'To answer, use «J’aime» and the animal, with «les» for all of them: «J’aime les chiens».',
      'More animals: «un lapin» is a rabbit and «un poisson» is a fish.',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🐕', label: 'les chiens' },
        { icon: '🐈', label: 'les chats' },
        { icon: '🐇', label: 'les lapins' },
        { icon: '🐐', label: 'les chèvres' },
      ],
    },
    artCaption: 'Animals people like.',
    words: [
      { term: 'Quel animal aimes-tu ?', meaning: 'Which animal do you like?' },
      { term: 'un lapin', meaning: 'A rabbit.' },
      { term: 'les chiens', meaning: 'Dogs.' },
    ],
    examples: [
      {
        title: 'Rabbits',
        situation: 'You like rabbits. How do you answer?',
        steps: ['Start with «J’aime».', 'Use «les lapins» for all rabbits.'],
        answer: '«J’aime les lapins.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «J’aime un chien» for all dogs.',
        right: 'Say «J’aime les chiens».',
      },
    ],
    realLife: ['Pets at home.', 'Farm animals.'],
    tryIt: {
      need: 'Friends',
      steps: [
        'Ask «Quel animal aimes-tu ?»',
        'Make a tally of the answers.',
        'Say which animal is most popular.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means a rabbit?',
        options: ['un lapin', 'un chat'],
        answer: 0,
        why: 'That word means a rabbit.',
      },
    ],
    sayIt: {
      phrase: 'Quel animal aimes-tu ?',
      meaning: 'Which animal do you like?',
    },
  },
  'french-13': {
    indicator: goal(
      'Say what kind of place you live in, without giving an address.',
    ),
    hook: 'Do you live in a village or a town, in a house or a flat? Let us say it in French.',
    explain: [
      'A village is «un village» and a town is «une ville».',
      'A house is «une maison» and a flat is «un appartement».',
      'For example, «J’habite dans une maison, dans un village».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Tu habites où ?' },
        { who: 1, text: 'J’habite dans un village.' },
        { who: 0, text: 'Moi, dans une ville.' },
      ],
    },
    artCaption: 'Two children say where they live.',
    words: [
      { term: 'un village', meaning: 'A village.' },
      { term: 'une ville', meaning: 'A town.' },
      { term: 'une maison', meaning: 'A house.' },
      { term: 'un appartement', meaning: 'A flat.' },
    ],
    examples: [
      {
        title: 'A flat in a town',
        situation: 'You live in a flat in a town. How do you say it?',
        steps: ['A flat is «un appartement».', 'A town is «une ville».'],
        answer: '«J’habite dans un appartement, dans une ville.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Telling strangers your street.',
        right: 'Say only what kind of place you live in.',
      },
    ],
    realLife: ['Talking about home.', 'Drawing your town.'],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw where you live.',
        'Label it in French.',
        'Tell a friend about it.',
      ],
    },
    safety: ['Never tell strangers your street or house number.'],
    quiz: [
      {
        prompt: 'Which word means a town?',
        options: ['une ville', 'un village'],
        answer: 0,
        why: 'That word means a town.',
      },
    ],
    sayIt: {
      phrase: 'J’habite dans une maison.',
      meaning: 'I live in a house.',
    },
  },
  'french-14': {
    indicator: goal('Ask and answer at what time things happen in French.'),
    hook: 'What time does school start? Let us ask and answer in French.',
    explain: [
      'To ask when something happens, say «À quelle heure… ?»',
      'The answer starts with «À»: «À sept heures».',
      'School starts at eight is «L’école commence à huit heures».',
    ],
    art: { kind: 'clock', hour: 8, minute: 0, label: '8:00' },
    artCaption: 'The clock shows eight o’clock.',
    words: [
      { term: 'À quelle heure ?', meaning: 'At what time?' },
      { term: 'commence', meaning: 'Starts.' },
      { term: 'à huit heures', meaning: 'At eight o’clock.' },
    ],
    examples: [
      {
        title: 'Bedtime',
        situation:
          'You go to bed at seven. How do you answer «À quelle heure ?»',
        steps: ['Start with «À».', 'Seven is «sept».'],
        answer: '«À sept heures.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering «Il est» to a when question.',
        right: 'For when, start with «À».',
      },
    ],
    realLife: ['School times.', 'Meal times.'],
    tryIt: {
      need: 'A toy clock',
      steps: [
        'Ask a friend when they wake up.',
        'They set the clock and answer.',
        'Swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one asks at what time?',
        options: ['À quelle heure ?', 'Quelle heure est-il ?'],
        answer: 0,
        why: 'That one asks when something happens.',
      },
    ],
    sayIt: {
      phrase: 'L’école commence à huit heures.',
      meaning: 'School starts at eight o’clock.',
    },
  },
  'french-15': {
    indicator: goal('Ask and answer what someone is doing in French.'),
    hook: 'What are you doing? I am playing! Let us ask and answer in French.',
    explain: [
      'To ask, say «Qu’est-ce que tu fais ?»',
      'To answer, use «Je» and the action: «Je joue», «Je lis» or «Je dessine».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Qu’est-ce que tu fais ?' },
        { who: 1, text: 'Je dessine une maison.' },
        { who: 1, text: 'Et toi ?' },
        { who: 0, text: 'Je joue au football !' },
      ],
    },
    artCaption: 'Two friends say what they are doing.',
    words: [
      { term: 'Qu’est-ce que tu fais ?', meaning: 'What are you doing?' },
      { term: 'Je joue.', meaning: 'I am playing.' },
      { term: 'Je dessine.', meaning: 'I am drawing.' },
      { term: 'Je lis.', meaning: 'I am reading.' },
    ],
    examples: [
      {
        title: 'Reading',
        situation: 'You are reading a book. How do you answer?',
        steps: ['I read is «Je lis».', 'Add «un livre».'],
        answer: '«Je lis un livre.»',
      },
    ],
    mistakes: [
      { wrong: 'Forgetting «Je».', right: 'Start with «Je»: «Je joue».' },
    ],
    realLife: ['Break time.', 'Games at home.'],
    tryIt: {
      need: 'Friends',
      steps: [
        'Mime an action.',
        'Friends ask «Qu’est-ce que tu fais ?»',
        'Answer in French.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means I am drawing?',
        options: ['Je dessine.', 'Je joue.'],
        answer: 0,
        why: 'That means I am drawing.',
      },
    ],
    sayIt: {
      phrase: 'Qu’est-ce que tu fais ?',
      meaning: 'What are you doing?',
    },
  },
  'french-16': {
    indicator: goal(
      'Ask and answer what someone is wearing, with colours, in French.',
    ),
    hook: 'What are you wearing today? Let us describe clothes with colours in French.',
    explain: [
      'To ask, say «Qu’est-ce que tu portes ?»',
      'To answer, say «Je porte» and the clothes, then the colour: «Je porte un pantalon bleu».',
      'Trousers are «un pantalon» and a skirt is «une jupe».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '👖', label: 'un pantalon' },
        { icon: '👕', label: 'une chemise' },
        { icon: '👗', label: 'une robe' },
        { icon: '🧢', label: 'une casquette' },
      ],
    },
    artCaption: 'Clothes to describe.',
    words: [
      { term: 'Qu’est-ce que tu portes ?', meaning: 'What are you wearing?' },
      { term: 'un pantalon', meaning: 'Trousers.' },
      { term: 'une jupe', meaning: 'A skirt.' },
      { term: 'Je porte', meaning: 'I am wearing.' },
    ],
    examples: [
      {
        title: 'School uniform',
        situation: 'You are wearing brown trousers. How do you say it?',
        steps: [
          'Trousers are «un pantalon».',
          'Brown is «marron». It comes after.',
        ],
        answer: '«Je porte un pantalon marron.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Putting the colour first.',
        right: 'Clothes first, then the colour.',
      },
    ],
    realLife: ['School uniform.', 'Choosing clothes.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Ask «Qu’est-ce que tu portes ?»',
        'Answer with clothes and a colour.',
        'Swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means trousers?',
        options: ['un pantalon', 'une jupe'],
        answer: 0,
        why: 'That word means trousers.',
      },
    ],
    sayIt: {
      phrase: 'Je porte une chemise blanche.',
      meaning: 'I am wearing a white shirt.',
    },
  },
  'french-17': {
    indicator: goal(
      'Buy more than one thing at the market and understand the price.',
    ),
    hook: 'You want two mangoes. How much will they cost? Let us shop in French.',
    explain: [
      'To ask for two things, say «Je voudrais deux mangues, s’il vous plaît».',
      'The seller says the total with «Ça fait»: «Ça fait quatre cedis».',
      'For more than one, the French word usually adds an s.',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Je voudrais deux mangues.' },
        { who: 1, text: 'Ça fait quatre cedis.' },
        { who: 0, text: 'Voilà. Merci !' },
        { who: 1, text: 'Merci, au revoir !' },
      ],
    },
    artCaption: 'A child buys two mangoes.',
    words: [
      { term: 'Ça fait', meaning: 'That comes to.' },
      { term: 'deux mangues', meaning: 'Two mangoes.' },
      { term: 'cedis', meaning: 'Cedis, the money of Ghana.' },
    ],
    examples: [
      {
        title: 'Two oranges',
        situation: 'One orange costs one cedi. How much are two?',
        steps: ['One and one make two.', 'Two cedis is «deux cedis».'],
        answer: '«Ça fait deux cedis.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting the s on more than one.',
        right: 'Write «deux mangues» with an s.',
      },
    ],
    realLife: ['Going to the market with a grown-up.', 'Shop games.'],
    tryIt: {
      need: 'A friend and pretend money',
      steps: [
        'Ask for two or three things.',
        'The seller says the total.',
        'Pay and say «Merci».',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean that comes to?',
        options: ['Ça fait', 'C’est combien'],
        answer: 0,
        why: 'Those words give the total.',
      },
    ],
    sayIt: {
      phrase: 'Je voudrais deux mangues, s’il vous plaît.',
      meaning: 'I would like two mangoes, please.',
    },
  },
  'french-18': {
    indicator: goal(
      'Ask and answer about the weather and Ghana’s seasons in French.',
    ),
    hook: 'Ghana has a rainy season and a dry season. Let us talk about the weather in French.',
    explain: [
      'To ask about the weather today, say «Quel temps fait-il aujourd’hui ?»',
      'You can join two answers with «et»: «Il fait beau et chaud».',
      'The rainy season is «la saison des pluies», and the dry season is «la saison sèche».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🌧️', label: 'la saison des pluies' },
        { icon: '☀️', label: 'la saison sèche' },
      ],
    },
    artCaption: 'Ghana’s two main seasons.',
    words: [
      { term: 'la saison des pluies', meaning: 'The rainy season.' },
      { term: 'la saison sèche', meaning: 'The dry season.' },
      { term: 'aujourd’hui', meaning: 'Today.' },
      { term: 'et', meaning: 'And.' },
    ],
    examples: [
      {
        title: 'Today',
        situation: 'Today it is sunny and hot. How do you answer?',
        steps: [
          'Nice weather is «Il fait beau».',
          'Join it to «chaud» with «et».',
        ],
        answer: '«Il fait beau et chaud.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Only saying one word.',
        right: 'Make a full sentence: «Il fait chaud».',
      },
    ],
    realLife: ['The rainy season.', 'Harmattan in the dry season.'],
    tryIt: {
      need: 'A weather chart',
      steps: [
        'Ask «Quel temps fait-il aujourd’hui ?»',
        'Look outside.',
        'Answer and mark the chart.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means the rainy season?',
        options: ['la saison des pluies', 'la saison sèche'],
        answer: 0,
        why: 'That one is the rainy season.',
      },
    ],
    sayIt: {
      phrase: 'Il fait beau et chaud.',
      meaning: 'It is sunny and hot.',
    },
  },
  'french-19': {
    indicator: goal('Ask when and why, and answer with because, in French.'),
    hook: 'When? Why? Because! Let us ask bigger questions in French.',
    explain: [
      'When is «Quand ?» and why is «Pourquoi ?»',
      'Answer a why question with «Parce que», which means because.',
      'For example, «Pourquoi tu es content ? Parce que c’est mon anniversaire !»',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Pourquoi tu es content ?' },
        { who: 1, text: 'Parce que c’est la fête !' },
        { who: 0, text: 'Quand ?' },
        { who: 1, text: 'Aujourd’hui !' },
      ],
    },
    artCaption: 'Two friends ask why and when.',
    words: [
      { term: 'Quand ?', meaning: 'When?' },
      { term: 'Pourquoi ?', meaning: 'Why?' },
      { term: 'Parce que', meaning: 'Because.' },
      { term: 'content', meaning: 'Happy.' },
    ],
    examples: [
      {
        title: 'Because',
        situation:
          'Your friend asks «Pourquoi ?» How do you start your answer?',
        steps: ['A why question needs a reason.'],
        answer: 'Start with «Parce que».',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering a why question with a time.',
        right: 'Why needs a reason: «Parce que…»',
      },
    ],
    realLife: ['Asking the teacher questions.', 'Talking with friends.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Ask a «Pourquoi ?» question.',
        'Answer with «Parce que».',
        'Ask a «Quand ?» question too.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means why?',
        options: ['Pourquoi ?', 'Quand ?', 'Où ?'],
        answer: 0,
        why: 'That word means why.',
      },
    ],
    sayIt: { phrase: 'Pourquoi ? Parce que…', meaning: 'Why? Because…' },
  },
  'french-20': {
    indicator: goal(
      'Ask and answer four questions about yourself in a conversation.',
    ),
    hook: 'You can ask and answer lots of questions now. Let us have a real conversation!',
    explain: [
      'A good conversation goes both ways: you answer, then you ask back.',
      'Use questions you know, like «Comment tu t’appelles ?», «Quel âge as-tu ?» and «Qu’est-ce que tu aimes ?»',
      'End politely with «Au revoir» or «À bientôt».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Quel âge as-tu ?' },
        { who: 1, text: 'J’ai huit ans. Et toi ?' },
        { who: 0, text: 'Moi aussi ! Tu aimes le foot ?' },
        { who: 1, text: 'Oui, j’adore !' },
      ],
    },
    artCaption: 'A friendly conversation.',
    words: [
      { term: 'Quel âge as-tu ?', meaning: 'How old are you?' },
      { term: 'Moi aussi !', meaning: 'Me too!' },
      { term: 'J’adore !', meaning: 'I love it!' },
      { term: 'À bientôt !', meaning: 'See you soon!' },
    ],
    examples: [
      {
        title: 'Asking back',
        situation:
          'Your friend asks your age. After you answer, what can you ask?',
        steps: ['Ask the same question back.'],
        answer: '«Et toi ?»',
      },
    ],
    mistakes: [
      {
        wrong: 'Only answering, never asking.',
        right: 'Ask a question back to keep the talk going.',
      },
    ],
    realLife: ['Talking to a French-speaking visitor.', 'Class shows.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Write four questions.',
        'Take turns asking and answering.',
        'Perform it for the class.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one asks how old someone is?',
        options: ['Quel âge as-tu ?', 'Comment vas-tu ?'],
        answer: 0,
        why: 'That one asks about age.',
      },
    ],
    sayIt: { phrase: 'Quel âge as-tu ?', meaning: 'How old are you?' },
  },
}
