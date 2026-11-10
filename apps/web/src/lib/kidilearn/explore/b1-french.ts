import type { CourseGuides } from './types'

// Basic 1 French, written for this course for five- and six-year-olds. The
// national French curriculum starts at Basic 4, so these follow KidiLearn's own
// early-French goals: each guide teaches the words its lesson lists, a few at a
// time, by listening and repeating.
// - Explanations are in English, short enough for a young child. French sits
//   inside «…», so the French voice reads it and the English voice never does.
// - Questions and their reasons are English; the answer options are French.

const goal = (text: string) => ({
  code: '',
  text,
  source: 'kidilearn' as const,
})

export const guides: CourseGuides = {
  'french-01': {
    indicator: goal('Greet people and say goodbye in French.'),
    hook: 'People in France say hello in French. Shall we try?',
    explain: [
      'To say hello, say «Bonjour».',
      'To a friend, you can say «Salut».',
      'To say goodbye, say «Au revoir».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Bonjour, Madame !' },
        { who: 1, text: 'Bonjour, Kojo !' },
        { who: 0, text: 'Au revoir !' },
        { who: 1, text: 'Au revoir !' },
      ],
    },
    artCaption: 'Kojo greets his teacher.',
    words: [
      { term: 'Bonjour', meaning: 'Hello.' },
      { term: 'Salut', meaning: 'Hi, to a friend.' },
      { term: 'Au revoir', meaning: 'Goodbye.' },
    ],
    examples: [
      {
        title: 'Going home',
        situation: 'School is over. What do you say to your teacher?',
        steps: ['Wave goodbye.'],
        answer: 'Say «Au revoir».',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «Salut» to a teacher.',
        right: 'Say «Bonjour» to grown-ups.',
      },
    ],
    realLife: [
      'Saying hello at school.',
      'Saying goodbye at home time.',
      'Greeting visitors.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Wave and say «Bonjour».',
        'Your friend says it back.',
        'Wave and say «Au revoir».',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means goodbye?',
        options: ['Au revoir', 'Bonjour'],
        answer: 0,
        why: 'That is how you say goodbye.',
      },
    ],
    sayIt: { phrase: 'Bonjour !', meaning: 'Hello!' },
  },
  'french-02': {
    indicator: goal('Say your name and ask someone’s name in French.'),
    hook: 'Everyone has a name. Can you say yours in French?',
    explain: [
      'To say your name, say «Je m’appelle» and then your name.',
      'To ask a friend their name, say «Comment tu t’appelles ?»',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Comment tu t’appelles ?' },
        { who: 1, text: 'Je m’appelle Kojo.' },
      ],
    },
    artCaption: 'Two children say their names.',
    words: [
      { term: 'Je m’appelle', meaning: 'My name is.' },
      { term: 'Comment tu t’appelles ?', meaning: 'What is your name?' },
    ],
    examples: [
      {
        title: 'Your name',
        situation: 'Your name is Esi. How do you say it?',
        steps: ['Start with «Je m’appelle».', 'Add your name.'],
        answer: '«Je m’appelle Esi.»',
      },
    ],
    mistakes: [
      { wrong: 'Saying only your name.', right: 'Say «Je m’appelle» first.' },
    ],
    realLife: ['Meeting a new friend.', 'The first day of school.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Ask «Comment tu t’appelles ?»',
        'Listen to the answer.',
        'Now say your own name.',
      ],
    },
    quiz: [
      {
        prompt: 'How do you start telling someone your name?',
        options: ['Je m’appelle…', 'Au revoir…'],
        answer: 0,
        why: 'Those words mean my name is.',
      },
    ],
    sayIt: { phrase: 'Je m’appelle…', meaning: 'My name is…' },
  },
  'french-03': {
    indicator: goal('Say please, thank you and you’re welcome in French.'),
    hook: 'Kind words make everyone happy. Let us learn them in French.',
    explain: [
      'Please is «S’il vous plaît».',
      'Thank you very much is «Merci beaucoup».',
      'When someone thanks you, say «De rien».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Un crayon, s’il vous plaît.' },
        { who: 1, text: 'Voilà !' },
        { who: 0, text: 'Merci beaucoup !' },
        { who: 1, text: 'De rien !' },
      ],
    },
    artCaption: 'A child asks for a pencil kindly.',
    words: [
      { term: 'S’il vous plaît', meaning: 'Please.' },
      { term: 'Merci beaucoup', meaning: 'Thank you very much.' },
      { term: 'De rien', meaning: 'You are welcome.' },
    ],
    examples: [
      {
        title: 'A gift',
        situation: 'Your friend gives you a sweet. What do you say?',
        steps: ['Say thank you.'],
        answer: '«Merci beaucoup !»',
      },
    ],
    mistakes: [
      { wrong: 'Forgetting to say thank you.', right: 'Always say «Merci».' },
    ],
    realLife: ['Asking for things in class.', 'Saying thank you at home.'],
    tryIt: {
      need: 'A friend and a pencil',
      steps: [
        'Ask for the pencil with «S’il vous plaît».',
        'Say «Merci».',
        'Your friend says «De rien».',
      ],
    },
    quiz: [
      {
        prompt: 'Someone says thank you to you. What do you say?',
        options: ['De rien', 'Merci'],
        answer: 0,
        why: 'That means you are welcome.',
      },
    ],
    sayIt: { phrase: 'Merci beaucoup !', meaning: 'Thank you very much!' },
  },
  'french-04': {
    indicator: goal('Count from one to five in French.'),
    hook: 'Hold up one hand. Five fingers! Let us count them in French.',
    explain: [
      'One, two, three is «un, deux, trois».',
      'Four, five is «quatre, cinq».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '1', label: 'un' },
        { icon: '2', label: 'deux' },
        { icon: '3', label: 'trois' },
        { icon: '4', label: 'quatre' },
        { icon: '5', label: 'cinq' },
      ],
    },
    artCaption: 'The numbers one to five.',
    words: [
      { term: 'un', meaning: 'One.' },
      { term: 'deux', meaning: 'Two.' },
      { term: 'trois', meaning: 'Three.' },
      { term: 'quatre', meaning: 'Four.' },
      { term: 'cinq', meaning: 'Five.' },
    ],
    examples: [
      {
        title: 'Count the pencils',
        situation: 'There are three pencils. How do you say three?',
        steps: ['Count with me.'],
        answer: '«trois»',
      },
    ],
    mistakes: [
      {
        wrong: 'Skipping a number.',
        right: 'Touch each thing as you count it.',
      },
    ],
    realLife: ['Counting fingers.', 'Counting pencils.'],
    tryIt: {
      need: 'Five small stones',
      steps: [
        'Count the stones in French.',
        'Hide some.',
        'Count what is left.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word is two?',
        options: ['deux', 'cinq'],
        answer: 0,
        why: 'That word means two.',
      },
    ],
    sayIt: {
      phrase: 'un, deux, trois, quatre, cinq',
      meaning: 'One, two, three, four, five.',
    },
  },
  'french-05': {
    indicator: goal('Count from six to ten in French.'),
    hook: 'Now hold up both hands. Ten fingers! Let us count to ten.',
    explain: [
      'Six, seven, eight is «six, sept, huit».',
      'Nine, ten is «neuf, dix».',
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
      { term: 'six', meaning: 'Six.' },
      { term: 'sept', meaning: 'Seven.' },
      { term: 'huit', meaning: 'Eight.' },
      { term: 'neuf', meaning: 'Nine.' },
      { term: 'dix', meaning: 'Ten.' },
    ],
    examples: [
      {
        title: 'Ten fingers',
        situation: 'How many fingers do you have?',
        steps: ['Count them all.'],
        answer: '«dix»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying the last letter of «sept» or «huit» loudly.',
        right: 'Listen to the French voice and copy it.',
      },
    ],
    realLife: ['Counting ten counters.', 'Counting steps.'],
    tryIt: {
      need: 'Ten counters',
      steps: [
        'Count six counters.',
        'Add one at a time and say the number.',
        'Stop at ten.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word is ten?',
        options: ['dix', 'six'],
        answer: 0,
        why: 'That word means ten.',
      },
    ],
    sayIt: {
      phrase: 'six, sept, huit, neuf, dix',
      meaning: 'Six, seven, eight, nine, ten.',
    },
  },
  'french-06': {
    indicator: goal('Name six colours in French.'),
    hook: 'Look around. So many colours! Let us name them in French.',
    explain: [
      'Red is «rouge», blue is «bleu» and green is «vert».',
      'Yellow is «jaune», white is «blanc» and black is «noir».',
    ],
    art: {
      kind: 'cards',
      items: [
        { colour: '#d9412f', label: 'rouge' },
        { colour: '#2b6cb0', label: 'bleu' },
        { colour: '#1f8a70', label: 'vert' },
        { colour: '#f2c230', label: 'jaune' },
        { colour: '#ffffff', label: 'blanc' },
        { colour: '#1f1f1f', label: 'noir' },
      ],
    },
    artCaption: 'Six colours.',
    words: [
      { term: 'rouge', meaning: 'Red.' },
      { term: 'bleu', meaning: 'Blue.' },
      { term: 'vert', meaning: 'Green.' },
      { term: 'jaune', meaning: 'Yellow.' },
      { term: 'noir', meaning: 'Black.' },
    ],
    examples: [
      {
        title: 'A banana',
        situation: 'What colour is a ripe banana?',
        steps: ['It is yellow.'],
        answer: '«jaune»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up blue and black.',
        right: 'Blue is «bleu». Black is «noir».',
      },
    ],
    realLife: ['Crayons.', 'Clothes.', 'The flag of Ghana.'],
    tryIt: {
      need: 'Crayons',
      steps: [
        'Pick a crayon.',
        'Say its colour in French.',
        'Draw something that colour.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word is red?',
        options: ['rouge', 'vert'],
        answer: 0,
        why: 'That word means red.',
      },
    ],
    sayIt: { phrase: 'rouge, jaune, vert', meaning: 'Red, yellow, green.' },
  },
  'french-07': {
    indicator: goal('Name things in the classroom in French.'),
    hook: 'What is in your school bag? Let us name it in French.',
    explain: [
      'A book is «un livre» and a pen is «un stylo».',
      'A bag is «un sac» and a table is «une table».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '📖', label: 'un livre' },
        { icon: '🖊️', label: 'un stylo' },
        { icon: '🎒', label: 'un sac' },
        { icon: '✏️', label: 'un crayon' },
      ],
    },
    artCaption: 'Things we use at school.',
    words: [
      { term: 'un livre', meaning: 'A book.' },
      { term: 'un stylo', meaning: 'A pen.' },
      { term: 'un sac', meaning: 'A bag.' },
      { term: 'une table', meaning: 'A table.' },
    ],
    examples: [
      {
        title: 'Reading time',
        situation: 'You read a story from it. What is it?',
        steps: ['We read books.'],
        answer: '«un livre»',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out the little word in front.',
        right: 'Say «un livre», not just the thing.',
      },
    ],
    realLife: ['Packing your school bag.', 'Tidying the classroom.'],
    tryIt: {
      need: 'Your school bag',
      steps: [
        'Take out one thing.',
        'Say its name in French.',
        'Do it for three things.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means a bag?',
        options: ['un sac', 'un stylo'],
        answer: 0,
        why: 'That is a bag.',
      },
    ],
    sayIt: { phrase: 'un livre, un stylo', meaning: 'A book, a pen.' },
  },
  'french-08': {
    indicator: goal('Name the people in a family in French.'),
    hook: 'Who lives in your house? Let us name your family in French.',
    explain: [
      'Mummy is «maman» and Daddy is «papa».',
      'A brother is «frère» and a sister is «sœur».',
      'The whole family is «la famille».',
    ],
    art: {
      kind: 'family',
      rows: [
        ['papa', 'maman'],
        ['moi', 'mon frère', 'ma sœur'],
      ],
    },
    artCaption: 'A family with French names.',
    words: [
      { term: 'maman', meaning: 'Mummy.' },
      { term: 'papa', meaning: 'Daddy.' },
      { term: 'frère', meaning: 'Brother.' },
      { term: 'sœur', meaning: 'Sister.' },
      { term: 'la famille', meaning: 'The family.' },
    ],
    examples: [
      {
        title: 'A sister',
        situation: 'Ama is a girl in your family. She is your…?',
        steps: ['A girl in your family is your sister.'],
        answer: '«sœur»',
      },
    ],
    mistakes: [
      {
        wrong: 'Calling a brother a sister.',
        right: 'A boy is «frère». A girl is «sœur».',
      },
    ],
    realLife: ['Talking about family.', 'Family photos.'],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a pretend family.',
        'Point to each person.',
        'Say who they are in French.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means Mummy?',
        options: ['maman', 'papa'],
        answer: 0,
        why: 'That is Mummy.',
      },
    ],
    sayIt: { phrase: 'papa, maman', meaning: 'Daddy, Mummy.' },
  },
  'french-09': {
    indicator: goal('Name parts of the body in French.'),
    hook: 'Touch your head! Now your hands! Let us name them in French.',
    explain: [
      'The head is «la tête» and the eyes are «les yeux».',
      'The hands are «les mains» and the feet are «les pieds».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🙂', label: 'la tête' },
        { icon: '👀', label: 'les yeux' },
        { icon: '👐', label: 'les mains' },
        { icon: '🦶', label: 'les pieds' },
      ],
    },
    artCaption: 'Parts of the body.',
    words: [
      { term: 'la tête', meaning: 'The head.' },
      { term: 'les yeux', meaning: 'The eyes.' },
      { term: 'les mains', meaning: 'The hands.' },
      { term: 'les pieds', meaning: 'The feet.' },
    ],
    examples: [
      {
        title: 'Clapping',
        situation: 'What do you clap with?',
        steps: ['We clap with our hands.'],
        answer: '«les mains»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up hands and feet.',
        right: 'Hands are «les mains». Feet are «les pieds».',
      },
    ],
    realLife: ['Action songs.', 'Washing hands.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Your friend says a body word in French.',
        'You touch that part.',
        'Swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means the eyes?',
        options: ['les yeux', 'les pieds'],
        answer: 0,
        why: 'That means the eyes.',
      },
    ],
    sayIt: {
      phrase: 'la tête, les mains, les pieds',
      meaning: 'The head, the hands, the feet.',
    },
  },
  'french-10': {
    indicator: goal('Say the days of the week in French.'),
    hook: 'There are seven days in a week. Let us sing them in French.',
    explain: [
      'School days are «lundi, mardi, mercredi, jeudi, vendredi».',
      'The weekend is «samedi, dimanche».',
    ],
    art: {
      kind: 'calendar',
      month: 'mars',
      days: 31,
      startsOn: 0,
      focus: 2,
      heads: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    },
    artCaption: 'A calendar with French day names.',
    words: [
      { term: 'lundi', meaning: 'Monday.' },
      { term: 'mardi', meaning: 'Tuesday.' },
      { term: 'mercredi', meaning: 'Wednesday.' },
      { term: 'samedi', meaning: 'Saturday.' },
      { term: 'dimanche', meaning: 'Sunday.' },
    ],
    examples: [
      {
        title: 'First school day',
        situation: 'Which day does the school week start on?',
        steps: ['It starts on Monday.'],
        answer: '«lundi»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying the days out of order.',
        right: 'Start with «lundi» and go in order.',
      },
    ],
    realLife: ['The class calendar.', 'Weekend plans.'],
    tryIt: {
      need: 'Seven day cards',
      steps: [
        'Put the cards in order.',
        'Point to each one.',
        'Say two days aloud.',
      ],
    },
    quiz: [
      {
        prompt: 'Which day is Sunday?',
        options: ['dimanche', 'lundi'],
        answer: 0,
        why: 'That is Sunday.',
      },
    ],
    sayIt: {
      phrase: 'lundi, mardi, mercredi',
      meaning: 'Monday, Tuesday, Wednesday.',
    },
  },
  'french-11': {
    indicator: goal('Say which food you like in French.'),
    hook: 'What is your favourite food? Let us say it in French.',
    explain: [
      'To say you like something, say «J’aime».',
      'I like rice is «J’aime le riz».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🍚', label: 'le riz' },
        { icon: '🍌', label: 'la banane' },
        { icon: '🥭', label: 'la mangue' },
        { icon: '🍞', label: 'le pain' },
      ],
    },
    artCaption: 'Foods we enjoy.',
    words: [
      { term: 'J’aime', meaning: 'I like.' },
      { term: 'le riz', meaning: 'Rice.' },
      { term: 'la banane', meaning: 'Banana.' },
      { term: 'la mangue', meaning: 'Mango.' },
    ],
    examples: [
      {
        title: 'A banana',
        situation: 'You like bananas. How do you say it?',
        steps: ['Start with «J’aime».', 'Add «la banane».'],
        answer: '«J’aime la banane.»',
      },
    ],
    mistakes: [
      { wrong: 'Saying only the food.', right: 'Start with «J’aime».' },
    ],
    realLife: ['Lunch time.', 'The market.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Think of a food you like.',
        'Say «J’aime» and the food.',
        'Ask your friend to say theirs.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one means I like rice?',
        options: ['J’aime le riz.', 'J’aime la banane.'],
        answer: 0,
        why: 'That one is about rice.',
      },
    ],
    sayIt: { phrase: 'J’aime le riz.', meaning: 'I like rice.' },
  },
  'french-12': {
    indicator: goal('Name animals in French.'),
    hook: 'Woof! Meow! Let us name animals in French.',
    explain: [
      'A dog is «un chien» and a cat is «un chat».',
      'A bird is «un oiseau» and a goat is «une chèvre».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🐕', label: 'un chien' },
        { icon: '🐈', label: 'un chat' },
        { icon: '🐦', label: 'un oiseau' },
        { icon: '🐐', label: 'une chèvre' },
      ],
    },
    artCaption: 'Animals we know.',
    words: [
      { term: 'un chien', meaning: 'A dog.' },
      { term: 'un chat', meaning: 'A cat.' },
      { term: 'un oiseau', meaning: 'A bird.' },
      { term: 'une chèvre', meaning: 'A goat.' },
    ],
    examples: [
      {
        title: 'It flies',
        situation: 'This animal has wings and flies. What is it?',
        steps: ['A bird flies.'],
        answer: '«un oiseau»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up dog and cat.',
        right: 'A dog is «un chien». A cat is «un chat».',
      },
    ],
    realLife: ['Animals at home.', 'Animals in the compound.'],
    tryIt: {
      need: 'Animal pictures',
      steps: [
        'Look at a picture.',
        'Say the animal in French.',
        'Make its sound!',
      ],
    },
    quiz: [
      {
        prompt: 'Which one is a goat?',
        options: ['une chèvre', 'un chat'],
        answer: 0,
        why: 'That is a goat.',
      },
    ],
    sayIt: { phrase: 'un chien, un chat', meaning: 'A dog, a cat.' },
  },
  'french-13': {
    indicator: goal('Say where you live, in general terms, in French.'),
    hook: 'We live in Ghana! Let us say it in French.',
    explain: [
      'I live in Ghana is «J’habite au Ghana».',
      'To show your house, say «Voici ma maison».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Où habites-tu ?' },
        { who: 1, text: 'J’habite au Ghana.' },
        { who: 1, text: 'Voici ma maison !' },
      ],
    },
    artCaption: 'A child says where she lives.',
    words: [
      { term: 'J’habite', meaning: 'I live.' },
      { term: 'au Ghana', meaning: 'In Ghana.' },
      { term: 'Voici ma maison', meaning: 'Here is my house.' },
    ],
    examples: [
      {
        title: 'Our country',
        situation: 'Which country do we live in?',
        steps: ['We live in Ghana.'],
        answer: '«J’habite au Ghana.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Telling strangers your full address.',
        right: 'Say only your country or town.',
      },
    ],
    realLife: ['Talking to visitors.', 'Drawing your house.'],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw your house.',
        'Point to it and say «Voici ma maison».',
        'Say «J’habite au Ghana».',
      ],
    },
    safety: ['Never tell strangers where you live.'],
    quiz: [
      {
        prompt: 'Which one means here is my house?',
        options: ['Voici ma maison.', 'J’aime le riz.'],
        answer: 0,
        why: 'That is about your house.',
      },
    ],
    sayIt: { phrase: 'J’habite au Ghana.', meaning: 'I live in Ghana.' },
  },
  'french-14': {
    indicator: goal('Say simple o’clock times in French.'),
    hook: 'Tick, tock! What time is it? Let us say it in French.',
    explain: [
      'One o’clock is «Il est une heure».',
      'Two o’clock is «Il est deux heures».',
    ],
    art: { kind: 'clock', hour: 2, minute: 0, label: '2:00' },
    artCaption: 'The clock shows two o’clock.',
    words: [
      { term: 'Il est une heure.', meaning: 'It is one o’clock.' },
      { term: 'Il est deux heures.', meaning: 'It is two o’clock.' },
    ],
    examples: [
      {
        title: 'Read the clock',
        situation:
          'The short hand points to 1. The long hand points to 12. What time is it?',
        steps: ['The short hand shows the hour.'],
        answer: '«Il est une heure.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Looking at the long hand for the hour.',
        right: 'The short hand shows the hour.',
      },
    ],
    realLife: ['Break time.', 'Home time.'],
    tryIt: {
      need: 'A toy clock',
      steps: [
        'Set the clock to one o’clock.',
        'Say the time in French.',
        'Now try two o’clock.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one is two o’clock?',
        options: ['Il est deux heures.', 'Il est une heure.'],
        answer: 0,
        why: 'That says two o’clock.',
      },
    ],
    sayIt: { phrase: 'Il est une heure.', meaning: 'It is one o’clock.' },
  },
  'french-15': {
    indicator: goal('Name simple actions in French.'),
    hook: 'Walk, sing, read and dance! Let us do them and say them in French.',
    explain: [
      'To walk is «marcher» and to sing is «chanter».',
      'To read is «lire» and to dance is «danser».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🚶', label: 'marcher' },
        { icon: '🎤', label: 'chanter' },
        { icon: '📚', label: 'lire' },
        { icon: '💃', label: 'danser' },
      ],
    },
    artCaption: 'Four actions.',
    words: [
      { term: 'marcher', meaning: 'To walk.' },
      { term: 'chanter', meaning: 'To sing.' },
      { term: 'lire', meaning: 'To read.' },
      { term: 'danser', meaning: 'To dance.' },
    ],
    examples: [
      {
        title: 'Music time',
        situation:
          'The music starts and you move your body. What are you doing?',
        steps: ['Moving to music is dancing.'],
        answer: '«danser»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying the word without doing the action.',
        right: 'Do the action as you say it. It helps you remember.',
      },
    ],
    realLife: ['Action games.', 'Music lessons.'],
    tryIt: {
      need: 'Space to move',
      steps: [
        'Listen to an action word.',
        'Do the action.',
        'Say the word too.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means to sing?',
        options: ['chanter', 'marcher'],
        answer: 0,
        why: 'That word means to sing.',
      },
    ],
    sayIt: { phrase: 'chanter, danser', meaning: 'To sing, to dance.' },
  },
  'french-16': {
    indicator: goal('Name clothes in French.'),
    hook: 'What are you wearing today? Let us name it in French.',
    explain: [
      'A shirt is «une chemise» and a dress is «une robe».',
      'Shoes are «des chaussures».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '👕', label: 'une chemise' },
        { icon: '👗', label: 'une robe' },
        { icon: '👟', label: 'des chaussures' },
      ],
    },
    artCaption: 'Clothes we wear.',
    words: [
      { term: 'une chemise', meaning: 'A shirt.' },
      { term: 'une robe', meaning: 'A dress.' },
      { term: 'des chaussures', meaning: 'Shoes.' },
    ],
    examples: [
      {
        title: 'On your feet',
        situation: 'What do you wear on your feet?',
        steps: ['We wear shoes on our feet.'],
        answer: '«des chaussures»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «un» for shoes.',
        right: 'There are two shoes, so say «des chaussures».',
      },
    ],
    realLife: ['Getting dressed.', 'School uniform.'],
    tryIt: {
      need: 'Clothes pictures',
      steps: [
        'Point to a picture.',
        'Say its name in French.',
        'Point to something you are wearing.',
      ],
    },
    quiz: [
      {
        prompt: 'Which one is a dress?',
        options: ['une robe', 'une chemise'],
        answer: 0,
        why: 'That is a dress.',
      },
    ],
    sayIt: { phrase: 'une chemise, une robe', meaning: 'A shirt, a dress.' },
  },
  'french-17': {
    indicator: goal('Ask politely for something at the market in French.'),
    hook: 'Let us go to the market and buy a mango, in French!',
    explain: [
      'Greet the seller with «Bonjour».',
      'Ask with «Je voudrais», which means I would like.',
      'Then say «Merci».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Bonjour !' },
        { who: 0, text: 'Je voudrais une mangue.' },
        { who: 1, text: 'Voilà !' },
        { who: 0, text: 'Merci !' },
      ],
    },
    artCaption: 'A child buys a mango.',
    words: [
      { term: 'Je voudrais', meaning: 'I would like.' },
      { term: 'une mangue', meaning: 'A mango.' },
      { term: 'Voilà', meaning: 'Here you are.' },
    ],
    examples: [
      {
        title: 'A banana',
        situation: 'You want a banana. What do you say?',
        steps: ['Start with «Je voudrais».', 'Add «une banane».'],
        answer: '«Je voudrais une banane.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Asking without a greeting.',
        right: 'Say «Bonjour» first and «Merci» at the end.',
      },
    ],
    realLife: ['Going to the market with a grown-up.', 'Shop games.'],
    tryIt: {
      need: 'A friend and pretend fruit',
      steps: [
        'One of you is the seller.',
        'Greet, ask for a fruit and say thank you.',
        'Swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean I would like?',
        options: ['Je voudrais', 'Au revoir'],
        answer: 0,
        why: 'Those words mean I would like.',
      },
    ],
    sayIt: {
      phrase: 'Je voudrais une mangue.',
      meaning: 'I would like a mango.',
    },
  },
  'french-18': {
    indicator: goal('Describe the weather in French.'),
    hook: 'Look outside. Is it sunny or rainy? Let us say it in French.',
    explain: [
      'When it is hot, say «Il fait chaud».',
      'When it rains, say «Il pleut».',
      'When the weather is nice, say «Il fait beau».',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '☀️', label: 'Il fait chaud.' },
        { icon: '🌧️', label: 'Il pleut.' },
        { icon: '🌤️', label: 'Il fait beau.' },
      ],
    },
    artCaption: 'Three kinds of weather.',
    words: [
      { term: 'Il fait chaud.', meaning: 'It is hot.' },
      { term: 'Il pleut.', meaning: 'It is raining.' },
      { term: 'Il fait beau.', meaning: 'The weather is nice.' },
    ],
    examples: [
      {
        title: 'Rain!',
        situation: 'Water is falling from the clouds. What do you say?',
        steps: ['That is rain.'],
        answer: '«Il pleut.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying it is hot when it is raining.',
        right: 'Look outside first, then say the weather.',
      },
    ],
    realLife: ['The rainy season.', 'Hot afternoons.'],
    tryIt: {
      need: 'A window',
      steps: ['Look outside.', 'Say the weather in French.', 'Draw it.'],
    },
    quiz: [
      {
        prompt: 'Which one means it is raining?',
        options: ['Il pleut.', 'Il fait chaud.'],
        answer: 0,
        why: 'That means it is raining.',
      },
    ],
    sayIt: { phrase: 'Il fait beau !', meaning: 'The weather is nice!' },
  },
  'french-19': {
    indicator: goal('Use simple question words in French.'),
    hook: 'Who? What? Where? How? Questions help us find out. Let us ask in French.',
    explain: [
      'Who is «Qui ?» and what is «Quoi ?»',
      'Where is «Où ?» and how is «Comment ?»',
    ],
    art: {
      kind: 'cards',
      items: [
        { icon: '🧒', label: 'Qui ?' },
        { icon: '📦', label: 'Quoi ?' },
        { icon: '📍', label: 'Où ?' },
        { icon: '🤔', label: 'Comment ?' },
      ],
    },
    artCaption: 'Four question words.',
    words: [
      { term: 'Qui ?', meaning: 'Who?' },
      { term: 'Quoi ?', meaning: 'What?' },
      { term: 'Où ?', meaning: 'Where?' },
      { term: 'Comment ?', meaning: 'How?' },
    ],
    examples: [
      {
        title: 'A lost ball',
        situation: 'You cannot find your ball. Which question word do you use?',
        steps: ['You want to know the place.'],
        answer: '«Où ?»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up who and where.',
        right: 'Who is «Qui». Where is «Où».',
      },
    ],
    realLife: ['Asking the teacher.', 'Games with friends.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Hide a toy.',
        'Your friend asks «Où ?»',
        'Point to the hiding place.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means who?',
        options: ['Qui ?', 'Où ?'],
        answer: 0,
        why: 'That word means who.',
      },
    ],
    sayIt: { phrase: 'Qui ? Quoi ? Où ?', meaning: 'Who? What? Where?' },
  },
  'french-20': {
    indicator: goal('Hold a short conversation in French.'),
    hook: 'You know lots of French now! Let us put it together in a little talk.',
    explain: [
      'Start with «Bonjour !» Then say your name with «Je m’appelle».',
      'Say something you like with «J’aime».',
      'End with «Au revoir !»',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Bonjour ! Je m’appelle Akosua.' },
        { who: 1, text: 'Bonjour, Akosua !' },
        { who: 0, text: 'J’aime le football.' },
        { who: 1, text: 'Au revoir !' },
      ],
    },
    artCaption: 'A short conversation.',
    words: [
      { term: 'Bonjour', meaning: 'Hello.' },
      { term: 'Je m’appelle', meaning: 'My name is.' },
      { term: 'J’aime', meaning: 'I like.' },
      { term: 'Au revoir', meaning: 'Goodbye.' },
    ],
    examples: [
      {
        title: 'Your talk',
        situation: 'Make your own four sentences.',
        steps: [
          'Say hello.',
          'Say your name.',
          'Say something you like.',
          'Say goodbye.',
        ],
        answer: 'Four short sentences make a conversation.',
      },
    ],
    mistakes: [
      { wrong: 'Forgetting to say goodbye.', right: 'End with «Au revoir».' },
    ],
    realLife: [
      'Talking with a French-speaking visitor.',
      'Showing your family what you learned.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Practise your four sentences.',
        'Say them to your friend.',
        'Listen to theirs.',
      ],
    },
    quiz: [
      {
        prompt: 'How should the conversation end?',
        options: ['Au revoir !', 'Bonjour !'],
        answer: 0,
        why: 'We end by saying goodbye.',
      },
    ],
    sayIt: {
      phrase: 'Bonjour ! Je m’appelle… Au revoir !',
      meaning: 'Hello! My name is… Goodbye!',
    },
  },
}
