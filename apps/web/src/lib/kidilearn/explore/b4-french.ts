import type { CourseGuides } from './types'

// Basic 4 French, written for this course and scoped to the NaCCA French
// Curriculum for Primary Schools, B4–B6 (2019), for eight- and nine-year-olds
// meeting French for the first time. Notes:
// - Explanations are in English. French sits inside «…», so the French voice
//   reads it and the English voice never does. Words, the phrase to say and
//   the answer options are French; questions and their reasons are English.
// - Names, addresses and phone numbers in examples are made up, and lessons
//   that ask for personal details say to keep real ones private.
// - The published curriculum has no Basic 4 pages for describing the family,
//   so the imported codes for french-05 and french-06 cannot be checked.
// - Where the curriculum describes people by "une grosse tête" or "le nez
//   plat", the guide describes height, hair and eyes, kindly.

export const guides: CourseGuides = {
  'french-01': {
    indicator: {
      code: 'B4.1.1.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel dans lequel deux personnes se saluent.',
    },
    hook: 'People greet each other all day, at home, at school and at the market. How do French speakers do it?',
    explain: [
      'In the morning and the afternoon, say «Bonjour». In the evening, say «Bonsoir».',
      'With friends, you can say «Salut». To an adult, add «Madame» or «Monsieur».',
      'When you leave, say «Au revoir», or «À demain» if you will meet again tomorrow.',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Bonjour, Kofi !' },
        { who: 1, text: 'Bonjour, Ama ! Ça va ?' },
        { who: 0, text: 'Ça va bien, merci.' },
        { who: 1, text: 'Au revoir !' },
      ],
    },
    artCaption: 'Two friends greet each other and say goodbye.',
    words: [
      { term: 'Bonjour', meaning: 'Hello, or good morning.' },
      { term: 'Bonsoir', meaning: 'Good evening.' },
      { term: 'Salut', meaning: 'Hi, or bye, between friends.' },
      { term: 'Au revoir', meaning: 'Goodbye.' },
      { term: 'À demain', meaning: 'See you tomorrow.' },
    ],
    examples: [
      {
        title: 'Greeting a teacher',
        situation:
          'You meet your teacher, Mrs Mensah, at eight in the morning. What do you say?',
        steps: [
          'It is morning, so use the morning greeting.',
          'She is an adult, so add «Madame».',
        ],
        answer: '«Bonjour, Madame !»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «Salut» to a teacher.',
        right: 'Say «Bonjour, Madame» or «Bonjour, Monsieur» to adults.',
      },
    ],
    realLife: [
      'Greeting teachers in the morning.',
      'Saying goodbye after school.',
      'Greeting visitors at home.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Greet your partner with «Bonjour».',
        'Ask «Ça va ?» and answer «Ça va bien, merci».',
        'Say «Au revoir» and wave.',
      ],
    },
    quiz: [
      {
        prompt:
          'You leave school in the afternoon. What do you say to your friend?',
        options: ['Au revoir !', 'Bonsoir !', 'Bonjour !'],
        answer: 0,
        why: 'That is how you say goodbye.',
      },
      {
        prompt: 'Which greeting is for the evening?',
        options: ['Bonsoir', 'Bonjour', 'Salut'],
        answer: 0,
        why: 'That is the evening greeting.',
      },
    ],
    sayIt: { phrase: 'Bonjour ! Ça va ?', meaning: 'Hello! How are you?' },
  },
  'french-02': {
    indicator: {
      code: 'B4.1.2.1.1',
      text: 'Écouter et comprendre un dialogue dans lequel des personnes se présentent.',
    },
    hook: 'When you meet someone new, you tell them your name. How do you do that in French?',
    explain: [
      'To ask someone’s name, say «Comment tu t’appelles ?»',
      'To answer, say «Je m’appelle» and then your name.',
      'To say you are from Ghana, a boy says «Je suis ghanéen» and a girl says «Je suis ghanéenne».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Comment tu t’appelles ?' },
        { who: 1, text: 'Je m’appelle Akosua. Et toi ?' },
        { who: 0, text: 'Je m’appelle Yaw.' },
        { who: 1, text: 'Enchantée, Yaw !' },
      ],
    },
    artCaption: 'Two children tell each other their names.',
    words: [
      { term: 'Je m’appelle', meaning: 'My name is.' },
      { term: 'Comment tu t’appelles ?', meaning: 'What is your name?' },
      { term: 'Et toi ?', meaning: 'And you?' },
      {
        term: 'Enchanté',
        meaning: 'Pleased to meet you. A girl writes it with an extra e.',
      },
    ],
    examples: [
      {
        title: 'Your turn to answer',
        situation:
          'A new pupil asks «Comment tu t’appelles ?» Your name is Kwesi. What do you say?',
        steps: ['Start with «Je m’appelle».', 'Add your name.'],
        answer: '«Je m’appelle Kwesi.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering with only your name.',
        right: 'Say the whole sentence: «Je m’appelle» and your name.',
      },
    ],
    realLife: [
      'Meeting a new classmate.',
      'French clubs and pen friends.',
      'Visitors from French-speaking countries next door.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Ask your partner «Comment tu t’appelles ?»',
        'Listen to the answer.',
        'Swap and answer with «Je m’appelle».',
      ],
    },
    quiz: [
      {
        prompt: 'Someone asks your name. How do you begin your answer?',
        options: ['Je m’appelle…', 'Au revoir…', 'Il est…'],
        answer: 0,
        why: 'Those words mean my name is.',
      },
      {
        prompt: 'A girl from Ghana says where she is from. Which is right?',
        options: ['Je suis ghanéenne.', 'Je suis ghanéen.'],
        answer: 0,
        why: 'A girl uses the form with the extra letters at the end.',
      },
    ],
    sayIt: {
      phrase: 'Je m’appelle… Et toi ?',
      meaning: 'My name is… And you?',
    },
  },
  'french-03': {
    indicator: {
      code: 'B4.1.3.2.1',
      text: 'Présenter quelqu’un en donnant son nom, son prénom, sa nationalité.',
    },
    hook: 'Can you introduce a friend to your family in French? Three short sentences will do it.',
    explain: [
      'To present a boy, say «Voici mon ami». For a girl, say «Voici mon amie».',
      'Then give the name with «Il s’appelle» for a boy or «Elle s’appelle» for a girl.',
      'Finish with the nationality: «Il est ghanéen» or «Elle est ghanéenne».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Voici mon amie.' },
        { who: 0, text: 'Elle s’appelle Efua Mensah.' },
        { who: 0, text: 'Elle est ghanéenne.' },
        { who: 1, text: 'Bonjour, Efua !' },
      ],
    },
    artCaption: 'A boy introduces his friend Efua.',
    words: [
      { term: 'Voici', meaning: 'Here is, or this is.' },
      { term: 'Il s’appelle', meaning: 'His name is.' },
      { term: 'Elle s’appelle', meaning: 'Her name is.' },
      { term: 'le prénom', meaning: 'Your first name.' },
      { term: 'le nom', meaning: 'Your family name.' },
    ],
    examples: [
      {
        title: 'Presenting Baba',
        situation: 'Present your friend Baba Seidu, a boy from Ghana.',
        steps: [
          'Start with «Voici mon ami».',
          'Give his name: «Il s’appelle Baba Seidu».',
          'Give his nationality: «Il est ghanéen».',
        ],
        answer: 'Three short sentences present him.',
      },
    ],
    mistakes: [
      {
        wrong: 'Using «Il» for a girl.',
        right: 'Use «Elle» for a girl or a woman.',
      },
    ],
    realLife: [
      'Introducing a friend to your parents.',
      'Presenting a visitor to the class.',
      'Filling in a name card.',
    ],
    tryIt: {
      need: 'A partner and a made-up name card',
      steps: [
        'Make a name card for a pretend person.',
        'Present them with «Voici mon ami» or «Voici mon amie».',
        'Give their name and nationality.',
      ],
    },
    quiz: [
      {
        prompt: 'You present a girl. Which sentence is right?',
        options: ['Elle s’appelle Ama.', 'Il s’appelle Ama.'],
        answer: 0,
        why: 'We use the word for she when we talk about a girl.',
      },
    ],
    sayIt: { phrase: 'Voici mon ami.', meaning: 'This is my friend.' },
  },
  'french-04': {
    indicator: {
      code: 'B4.1.4.2.1',
      text: 'Poser et répondre à des questions sur les caractéristiques physiques d’une personne.',
    },
    hook: 'Is your brother tall or short? Does your friend have long or short hair? Let us describe people in French.',
    explain: [
      'To ask what someone looks like, say «Comment est ton frère ?» or «Comment est ta sœur ?»',
      'Answer with «Il est grand» or «Elle est petite». A describing word for a girl often adds an e.',
      'For hair and eyes, use «Il a» or «Elle a»: «Elle a les cheveux longs».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Comment est ton frère ?' },
        { who: 1, text: 'Il est grand.' },
        { who: 0, text: 'Et ta sœur ?' },
        { who: 1, text: 'Elle est petite.' },
      ],
    },
    artCaption: 'Two friends describe their families.',
    words: [
      {
        term: 'grand',
        meaning: 'Tall, for a boy or a man. For a girl, it adds an e.',
      },
      { term: 'petit', meaning: 'Short or small. For a girl, it adds an e.' },
      { term: 'les cheveux', meaning: 'Hair.' },
      { term: 'les yeux', meaning: 'Eyes.' },
    ],
    examples: [
      {
        title: 'Describe Esi',
        situation: 'Esi is tall and has short hair. Describe her.',
        steps: [
          'She is a girl, so use «Elle» and add the e: «Elle est grande».',
          'Then the hair: «Elle a les cheveux courts».',
        ],
        answer: '«Elle est grande. Elle a les cheveux courts.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Describing someone in an unkind way.',
        right: 'Describe people kindly, by their height, hair or eyes.',
      },
    ],
    realLife: [
      'Describing family members.',
      'Finding a friend in a crowd.',
      'Guessing games in class.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Think of someone in your family.',
        'Your partner asks «Comment est-il ?» or «Comment est-elle ?»',
        'Answer with two sentences.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence describes a tall girl?',
        options: ['Elle est grande.', 'Elle est petite.', 'Il est grand.'],
        answer: 0,
        why: 'It uses the word for she, and the describing word adds an e for a girl.',
      },
    ],
    sayIt: {
      phrase: 'Comment est ton frère ?',
      meaning: 'What is your brother like?',
    },
  },
  'french-05': {
    indicator: {
      code: 'B4.1.3.4.3',
      text: 'Écrire une courte carte postale pour décrire un/une ami(e).',
    },
    hook: 'A postcard is a short letter on a card. What would you write to describe your best friend?',
    explain: [
      'Start a postcard with «Cher» and a boy’s name, or «Chère» and a girl’s name.',
      'Write a few short sentences about your friend, such as «Il est grand» and «Il aime le football».',
      'End with «À bientôt !» and your first name.',
    ],
    art: {
      kind: 'scroll',
      title: 'Chère Marie,',
      lines: [
        'Voici mon ami Kwame.',
        'Il est grand.',
        'Il a les cheveux courts.',
        'Il aime le football.',
        'À bientôt ! Ama',
      ],
      plain: true,
    },
    artCaption: 'Ama’s postcard describes her friend Kwame.',
    words: [
      { term: 'Cher', meaning: 'Dear, to a boy or a man.' },
      { term: 'Chère', meaning: 'Dear, to a girl or a woman.' },
      { term: 'la carte postale', meaning: 'Postcard.' },
      { term: 'À bientôt !', meaning: 'See you soon!' },
    ],
    examples: [
      {
        title: 'The first line',
        situation: 'You are writing to a boy called Paul. How do you start?',
        steps: ['Paul is a boy, so use «Cher».'],
        answer: '«Cher Paul,»',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing «Cher» to a girl.',
        right: 'Write «Chère» to a girl or a woman.',
      },
    ],
    realLife: [
      'Pen friends in other countries.',
      'Holiday postcards.',
      'Birthday cards.',
    ],
    tryIt: {
      need: 'A card and coloured pencils',
      steps: [
        'Draw a picture on one side.',
        'Write «Cher» or «Chère» and a name.',
        'Write three sentences about a friend and sign it.',
      ],
    },
    safety: [
      'Use a made-up address. Never send your real address to someone you do not know.',
    ],
    quiz: [
      {
        prompt: 'How do you start a postcard to a girl named Marie?',
        options: ['Chère Marie,', 'Cher Marie,'],
        answer: 0,
        why: 'For a girl, the word for dear takes an extra e.',
      },
    ],
    sayIt: { phrase: 'À bientôt !', meaning: 'See you soon!' },
  },
  'french-06': {
    indicator: {
      code: 'B4.1.5.3.2',
      text: 'Lire et comprendre un texte simple sur les membres d’une famille.',
    },
    hook: 'Who is in your family? Let us read about a family in French.',
    explain: [
      'Family words: «le père» is father, «la mère» is mother, «le frère» is brother and «la sœur» is sister.',
      'Use «mon» before a man’s or boy’s word: «mon père». Use «ma» before a woman’s or girl’s word: «ma mère».',
      'Use «mes» for more than one: «mes grands-parents».',
    ],
    art: {
      kind: 'family',
      rows: [
        ['le grand-père', 'la grand-mère'],
        ['le père', 'la mère'],
        ['moi', 'mon frère', 'ma sœur'],
      ],
    },
    artCaption: 'A family tree with French labels.',
    words: [
      { term: 'le père', meaning: 'Father.' },
      { term: 'la mère', meaning: 'Mother.' },
      { term: 'le frère', meaning: 'Brother.' },
      { term: 'la sœur', meaning: 'Sister.' },
      { term: 'les grands-parents', meaning: 'Grandparents.' },
    ],
    examples: [
      {
        title: 'Read and answer',
        situation:
          'Read: «Je m’appelle Abena. Mon père s’appelle Kojo. J’ai une sœur.» What is her father’s name?',
        steps: [
          'Find the sentence with «Mon père».',
          'Read the name after «s’appelle».',
        ],
        answer: 'Kojo.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «mon mère».',
        right: 'Mother is a feminine word, so say «ma mère».',
      },
    ],
    realLife: [
      'Talking about your family.',
      'Family photos.',
      'Letters to pen friends.',
    ],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Draw your family tree.',
        'Label it with «mon père», «ma mère» and so on.',
        'Read your labels to a partner.',
      ],
    },
    quiz: [
      {
        prompt: 'Which little word goes before the word for mother?',
        options: ['ma', 'mon', 'mes'],
        answer: 0,
        why: 'Mother is a feminine word, so it takes the feminine form.',
      },
    ],
    sayIt: { phrase: 'Voici ma famille.', meaning: 'Here is my family.' },
  },
  'french-07': {
    indicator: {
      code: 'B4.2.1.2.2',
      text: 'Réciter des poèmes, chanter des chansons sur des objets de la maison.',
    },
    hook: 'Look around your home. Can you name the things you see in French?',
    explain: [
      'Things at home have French names: «la table», «la chaise», «le lit», «la porte» and «la fenêtre».',
      'Every French noun is masculine or feminine. Learn each word with its «le» or «la».',
      'A short chant helps you remember. Say it with a beat, clapping on each word.',
    ],
    art: {
      kind: 'scroll',
      title: 'Dans ma maison',
      lines: [
        'La table, la chaise,',
        'le lit, la porte,',
        'la fenêtre, la radio,',
        'dans ma maison, bravo !',
      ],
      plain: true,
    },
    artCaption: 'A chant about things at home.',
    words: [
      { term: 'la table', meaning: 'Table.' },
      { term: 'la chaise', meaning: 'Chair.' },
      { term: 'le lit', meaning: 'Bed.' },
      { term: 'la porte', meaning: 'Door.' },
      { term: 'la fenêtre', meaning: 'Window.' },
    ],
    examples: [
      {
        title: 'Point and name',
        situation: 'Your partner points at the door. What do you say?',
        steps: ['Remember the word with its little word in front.'],
        answer: '«C’est la porte.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Learning the word without «le» or «la».',
        right: 'Always learn «le lit», «la table», with the little word.',
      },
    ],
    realLife: [
      'Naming things at home.',
      'Songs and chants in class.',
      'Treasure hunts.',
    ],
    tryIt: {
      need: 'Sticky notes',
      steps: [
        'Write French names for five things at home.',
        'Stick each one on the right thing.',
        'Say the chant to your family.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means bed?',
        options: ['le lit', 'la porte', 'la table'],
        answer: 0,
        why: 'That is the word for bed.',
      },
      {
        prompt: 'Which word means window?',
        options: ['la fenêtre', 'la chaise', 'la radio'],
        answer: 0,
        why: 'That is the word for window.',
      },
    ],
    sayIt: {
      phrase: 'Dans ma maison, il y a une table.',
      meaning: 'In my house, there is a table.',
    },
  },
  'french-08': {
    indicator: {
      code: 'B4.2.2.2.1',
      text: 'Poser et répondre à des questions sur ce que l’on fait avec les objets de la classe.',
    },
    hook: 'A pen, a ruler, a rubber: what do you do with each one? Let us ask and answer in French.',
    explain: [
      'To ask, say «Qu’est-ce que tu fais avec un stylo ?»',
      'To answer, say what you do: «J’écris avec un stylo» or «J’efface avec une gomme».',
      'More classroom things: «une règle», «un crayon», «un livre» and «un cahier».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Qu’est-ce que tu fais avec un stylo ?' },
        { who: 1, text: 'J’écris avec un stylo.' },
        { who: 0, text: 'Et avec une gomme ?' },
        { who: 1, text: 'J’efface avec une gomme.' },
      ],
    },
    artCaption: 'Two pupils talk about their classroom things.',
    words: [
      { term: 'un stylo', meaning: 'A pen.' },
      { term: 'une gomme', meaning: 'A rubber, or eraser.' },
      { term: 'une règle', meaning: 'A ruler.' },
      { term: 'un crayon', meaning: 'A pencil.' },
      { term: 'un cahier', meaning: 'An exercise book.' },
    ],
    examples: [
      {
        title: 'A book',
        situation: 'Your friend asks what you do with a book. What do you say?',
        steps: ['You read a book.', 'Say «Je lis» and name the thing.'],
        answer: '«Je lis un livre.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting «un» or «une» before a thing.',
        right: 'Say «un stylo», «une gomme», with the little word.',
      },
    ],
    realLife: [
      'Borrowing things in class.',
      'Packing your school bag.',
      'Dice games with classroom words.',
    ],
    tryIt: {
      need: 'A partner and some classroom things',
      steps: [
        'Hold up a thing.',
        'Your partner asks «Qu’est-ce que tu fais avec… ?»',
        'Answer, then swap.',
      ],
    },
    quiz: [
      {
        prompt: 'What do you say for I read?',
        options: ['Je lis.', 'J’efface.', 'Je dessine.'],
        answer: 0,
        why: 'Those words mean I read.',
      },
    ],
    sayIt: { phrase: 'J’écris avec un stylo.', meaning: 'I write with a pen.' },
  },
  'french-09': {
    indicator: {
      code: 'B4.3.1.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel sur les goûts de quelqu’un sur les fruits, les animaux, les couleurs et répondre à des questions.',
    },
    hook: 'Football or reading? Mangoes or oranges? Let us talk about what we like.',
    explain: [
      'To ask what someone likes, say «Qu’est-ce que tu aimes ?»',
      'To answer, say «J’aime» and the thing: «J’aime le football» or «J’aime les mangues».',
      'To ask about one thing, say «Tu aimes les animaux ?» and answer «Oui» or «Non».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Qu’est-ce que tu aimes ?' },
        { who: 1, text: 'J’aime le football.' },
        { who: 0, text: 'Tu aimes le fufu ?' },
        { who: 1, text: 'Oui, j’aime le fufu !' },
      ],
    },
    artCaption: 'Two friends talk about what they like.',
    words: [
      { term: 'J’aime', meaning: 'I like.' },
      { term: 'Tu aimes… ?', meaning: 'Do you like…?' },
      { term: 'les mangues', meaning: 'Mangoes.' },
      { term: 'la lecture', meaning: 'Reading.' },
    ],
    examples: [
      {
        title: 'Your favourite',
        situation:
          'Your friend asks «Qu’est-ce que tu aimes ?» You like mangoes. What do you say?',
        steps: ['Start with «J’aime».', 'Add «les mangues».'],
        answer: '«J’aime les mangues.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out the little word before the thing.',
        right: 'Say «J’aime le football», not just the sport.',
      },
    ],
    realLife: [
      'Talking with friends at break.',
      'Choosing snacks.',
      'Making new friends.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Ask «Qu’est-ce que tu aimes ?»',
        'Listen and remember the answer.',
        'Tell the class what your partner likes.',
      ],
    },
    quiz: [
      {
        prompt: 'How do you say I like mangoes?',
        options: ['J’aime les mangues.', 'Tu aimes les mangues ?'],
        answer: 0,
        why: 'The first one tells what you like. The second one asks a question.',
      },
    ],
    sayIt: { phrase: 'Qu’est-ce que tu aimes ?', meaning: 'What do you like?' },
  },
  'french-10': {
    indicator: {
      code: 'B4.3.1.4.1',
      text: 'Faire une liste d’objets que l’on aime.',
    },
    hook: 'Before going to the market, many people write a list. Let us write a list of things we like in French.',
    explain: [
      'Write one thing on each line, with «un», «une» or «des» in front.',
      '«Un» goes with a masculine word, «une» with a feminine word, and «des» with more than one.',
      'You can give your list a title, such as «Ma liste».',
    ],
    art: {
      kind: 'scroll',
      title: 'Ma liste',
      lines: [
        'des mangues',
        'des bananes',
        'une orange',
        'un ballon',
        'un livre',
      ],
      plain: true,
    },
    artCaption: 'A list of favourite things.',
    words: [
      { term: 'la liste', meaning: 'List.' },
      { term: 'un ballon', meaning: 'A ball.' },
      { term: 'des bananes', meaning: 'Some bananas.' },
      { term: 'une orange', meaning: 'An orange.' },
    ],
    examples: [
      {
        title: 'More than one',
        situation: 'You want three mangoes. What do you write on your list?',
        steps: ['More than one takes «des».', 'The word adds an s.'],
        answer: '«des mangues»',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing «un» before more than one thing.',
        right: 'Use «des» for more than one: «des bananes».',
      },
    ],
    realLife: [
      'Shopping lists.',
      'Birthday wish lists.',
      'Packing lists for a trip.',
    ],
    tryIt: {
      need: 'Paper and coloured pencils',
      steps: [
        'Write «Ma liste» at the top.',
        'List five things you like.',
        'Draw each one beside its word.',
      ],
    },
    quiz: [
      {
        prompt: 'Which is right for more than one banana?',
        options: ['des bananes', 'une banane', 'un bananes'],
        answer: 0,
        why: 'More than one takes the plural form.',
      },
    ],
    sayIt: { phrase: 'J’aime les bananes.', meaning: 'I like bananas.' },
  },
  'french-11': {
    indicator: {
      code: 'B4.3.2.3.1',
      text: 'Lire et comprendre un texte simple sur les goûts et préférences des personnes.',
    },
    hook: 'Kofi likes football, but does he like rice? Let us read about likes and dislikes.',
    explain: [
      'To say you like something, use «J’aime». To say you do not, use «Je n’aime pas».',
      'To say what you like best, use «Je préfère».',
      'When you read, look for these words to find out what someone likes.',
    ],
    art: {
      kind: 'scroll',
      title: 'Kofi et Ama',
      lines: [
        'Kofi aime le football.',
        'Il n’aime pas le riz.',
        'Ama aime la lecture.',
        'Elle préfère les mangues.',
      ],
      plain: true,
    },
    artCaption: 'A short text about two friends.',
    words: [
      { term: 'Je n’aime pas', meaning: 'I do not like.' },
      { term: 'Je préfère', meaning: 'I prefer, or I like best.' },
      { term: 'le riz', meaning: 'Rice.' },
    ],
    examples: [
      {
        title: 'Read and answer',
        situation:
          'Read: «Kofi aime le football. Il n’aime pas le riz.» Does Kofi like rice?',
        steps: ['Find the sentence about rice.', 'It says «n’aime pas».'],
        answer: 'No, he does not.',
      },
    ],
    mistakes: [
      {
        wrong: 'Missing the small word that makes a sentence negative.',
        right: 'Look for «ne» and «pas» around the verb.',
      },
    ],
    realLife: [
      'Food likes and dislikes.',
      'Choosing games.',
      'Getting to know a friend.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write one thing you like with «J’aime».',
        'Write one thing you do not like with «Je n’aime pas».',
        'Read them to a partner.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence says you do not like rice?',
        options: [
          'Je n’aime pas le riz.',
          'J’aime le riz.',
          'Je préfère le riz.',
        ],
        answer: 0,
        why: 'The words around the verb make it negative.',
      },
    ],
    sayIt: { phrase: 'Je préfère les mangues.', meaning: 'I prefer mangoes.' },
  },
  'french-12': {
    indicator: { code: 'B4.4.1.3.1', text: 'Lire à haute voix de 1 à 20.' },
    hook: 'Numbers are everywhere: on calendars, phone numbers and number plates. Let us count to twenty in French.',
    explain: [
      'From one to ten: «un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix».',
      'Eleven to sixteen have their own words: «onze, douze, treize, quatorze, quinze, seize».',
      'Then ten joins a number: «dix-sept, dix-huit, dix-neuf». Twenty is «vingt».',
    ],
    art: {
      kind: 'calendar',
      month: 'mars',
      days: 31,
      startsOn: 0,
      focus: 6,
      heads: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    },
    artCaption: 'A calendar. The sixth of March is Independence Day in Ghana.',
    words: [
      { term: 'onze', meaning: 'Eleven.' },
      { term: 'douze', meaning: 'Twelve.' },
      { term: 'quinze', meaning: 'Fifteen.' },
      { term: 'seize', meaning: 'Sixteen.' },
      { term: 'vingt', meaning: 'Twenty.' },
    ],
    examples: [
      {
        title: 'A house number',
        situation: 'Kwame lives at number 14. How does he say it in French?',
        steps: ['Fourteen is one of the special words from eleven to sixteen.'],
        answer: '«quatorze»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying ten and seven for seventeen.',
        right: 'Join them with a dash: «dix-sept».',
      },
    ],
    realLife: ['Dates on a calendar.', 'Phone numbers.', 'Counting in games.'],
    tryIt: {
      need: 'A partner',
      steps: [
        'Count from one to twenty together.',
        'Take turns, one number each.',
        'Read the dates on a calendar.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word is fifteen?',
        options: ['quinze', 'quatorze', 'cinq'],
        answer: 0,
        why: 'Fifteen has its own special word.',
      },
      {
        prompt: 'Which word is twenty?',
        options: ['vingt', 'douze', 'dix'],
        answer: 0,
        why: 'That is the word for twenty.',
      },
    ],
    sayIt: {
      phrase: 'dix-sept, dix-huit, dix-neuf, vingt',
      meaning: 'Seventeen, eighteen, nineteen, twenty.',
    },
  },
  'french-13': {
    indicator: {
      code: 'B4.4.2.3.2',
      text: 'Indiquer l’heure qu’il est en changeant les aiguilles d’une horloge.',
    },
    hook: 'What time is it? Let us move the hands of a clock and say the time in French.',
    explain: [
      'To ask the time, say «Quelle heure est-il ?»',
      'Answer with «Il est», the number and «heures»: «Il est trois heures».',
      'One o’clock is «une heure». Twelve noon is «midi», and twelve at night is «minuit».',
    ],
    art: { kind: 'clock', hour: 3, minute: 0, label: '3:00' },
    artCaption: 'The clock shows three o’clock.',
    words: [
      { term: 'Quelle heure est-il ?', meaning: 'What time is it?' },
      { term: 'Il est trois heures.', meaning: 'It is three o’clock.' },
      { term: 'midi', meaning: 'Twelve noon.' },
      { term: 'minuit', meaning: 'Midnight.' },
    ],
    examples: [
      {
        title: 'Read the clock',
        situation:
          'The short hand points to 7 and the long hand to 12. What time is it?',
        steps: [
          'The long hand on 12 means o’clock.',
          'The short hand shows the hour: seven.',
        ],
        answer: '«Il est sept heures.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «midi» for midnight.',
        right: '«Midi» is noon. Midnight is «minuit».',
      },
    ],
    realLife: [
      'School times.',
      'Bus and flight times.',
      'Television programmes.',
    ],
    tryIt: {
      need: 'A paper clock with moving hands',
      steps: [
        'Set the clock to an hour.',
        'Your partner asks «Quelle heure est-il ?»',
        'Answer, then swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence matches twelve noon?',
        options: ['Il est midi.', 'Il est minuit.', 'Il est deux heures.'],
        answer: 0,
        why: 'Noon has its own word, different from midnight.',
      },
    ],
    sayIt: { phrase: 'Quelle heure est-il ?', meaning: 'What time is it?' },
  },
  'french-14': {
    indicator: {
      code: 'B4.4.3.2.3',
      text: 'Réciter des poèmes ou chanter des chansons sur les jours de la semaine.',
    },
    hook: 'There are seven days in a week. Can you say them all in French?',
    explain: [
      'The school days are «lundi, mardi, mercredi, jeudi, vendredi».',
      'The weekend is «samedi» and «dimanche».',
      'French days do not start with a capital letter, unless they begin a sentence.',
    ],
    art: {
      kind: 'calendar',
      month: 'septembre',
      days: 30,
      startsOn: 2,
      focus: 7,
      heads: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    },
    artCaption: 'A calendar with the French day names at the top.',
    words: [
      { term: 'lundi', meaning: 'Monday.' },
      { term: 'mercredi', meaning: 'Wednesday.' },
      { term: 'vendredi', meaning: 'Friday.' },
      { term: 'samedi', meaning: 'Saturday.' },
      { term: 'dimanche', meaning: 'Sunday.' },
    ],
    examples: [
      {
        title: 'Tomorrow',
        situation: 'Today is «lundi». What day is tomorrow?',
        steps: ['The day after Monday is Tuesday.'],
        answer: '«mardi»',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing «Lundi» with a capital in the middle of a sentence.',
        right: 'Write «lundi» with a small letter.',
      },
    ],
    realLife: ['Class timetables.', 'Planning the weekend.', 'Market days.'],
    tryIt: {
      need: 'Friends',
      steps: [
        'Stand in a line of seven.',
        'Each person says one day, in order.',
        'Say it again, faster, as a chant.',
      ],
    },
    quiz: [
      {
        prompt: 'Which day comes after Friday?',
        options: ['samedi', 'dimanche', 'jeudi'],
        answer: 0,
        why: 'Saturday comes after Friday.',
      },
    ],
    sayIt: {
      phrase: 'lundi, mardi, mercredi',
      meaning: 'Monday, Tuesday, Wednesday.',
    },
  },
  'french-15': {
    indicator: {
      code: 'B4.4.4.2.2',
      text: 'Dire dans quel mois un événement/une activité a lieu.',
    },
    hook: 'In which month is Christmas? In which month were you born? Let us learn the months in French.',
    explain: [
      'The first six months are «janvier, février, mars, avril, mai, juin».',
      'The last six are «juillet, août, septembre, octobre, novembre, décembre».',
      'To say when something happens, use «en»: «Noël est en décembre».',
    ],
    art: {
      kind: 'calendar',
      month: 'mars',
      days: 31,
      startsOn: 0,
      focus: 6,
      heads: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    },
    artCaption: 'The sixth of March, Independence Day in Ghana.',
    words: [
      { term: 'le mois', meaning: 'Month.' },
      { term: 'en décembre', meaning: 'In December.' },
      {
        term: 'Je suis né',
        meaning: 'I was born. A girl writes it with an extra e.',
      },
      { term: 'Noël', meaning: 'Christmas.' },
    ],
    examples: [
      {
        title: 'A birthday',
        situation: 'Ama was born in July. How does she say it?',
        steps: [
          'Ama is a girl, so she says «Je suis née».',
          'Then she adds «en juillet».',
        ],
        answer: '«Je suis née en juillet.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing months with a capital letter.',
        right: 'French months start with a small letter: «mars», «août».',
      },
    ],
    realLife: [
      'Birthdays.',
      'Ghana’s Independence Day in March.',
      'Festivals such as Homowo.',
    ],
    tryIt: {
      need: 'A calendar',
      steps: [
        'Find your birthday month.',
        'Say «Je suis né en…» or «Je suis née en…»',
        'Ask three friends the same.',
      ],
    },
    quiz: [
      {
        prompt: 'In which month is Christmas?',
        options: ['en décembre', 'en janvier', 'en mars'],
        answer: 0,
        why: 'Christmas is on the twenty-fifth of December.',
      },
    ],
    sayIt: {
      phrase: 'Noël est en décembre.',
      meaning: 'Christmas is in December.',
    },
  },
  'french-16': {
    indicator: {
      code: 'B4.4.5.2.1',
      text: 'Simuler la conversation téléphonique entre deux interlocuteurs.',
    },
    hook: 'Ring, ring! Someone is calling. What do you say when you pick up the phone in French?',
    explain: [
      'Answer the phone with «Allô !»',
      'To ask who is calling, say «Qui est à l’appareil ?» The caller says «C’est» and their name.',
      'To ask for someone, say «Je voudrais parler à» and the name. «Ne quittez pas» means hold on.',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Allô ! Qui est à l’appareil ?' },
        { who: 1, text: 'C’est Kofi. Ama est là ?' },
        { who: 0, text: 'Oui. Ne quittez pas !' },
      ],
    },
    artCaption: 'A short phone call.',
    words: [
      { term: 'Allô !', meaning: 'Hello, on the phone.' },
      { term: 'Qui est à l’appareil ?', meaning: 'Who is speaking?' },
      { term: 'Je voudrais parler à', meaning: 'I would like to speak to.' },
      { term: 'Ne quittez pas', meaning: 'Hold on, please.' },
    ],
    examples: [
      {
        title: 'Asking for a friend',
        situation:
          'You call your friend’s house and want to speak to Yaw. What do you say?',
        steps: [
          'Greet with «Allô !»',
          'Say who you are: «C’est» and your name.',
          'Ask: «Je voudrais parler à Yaw, s’il vous plaît.»',
        ],
        answer: 'Greet, give your name, then ask politely.',
      },
    ],
    mistakes: [
      {
        wrong: 'Asking for someone without saying who you are.',
        right: 'Say «C’est» and your name first.',
      },
    ],
    realLife: [
      'Calling family.',
      'Answering the house phone.',
      'Role plays in class.',
    ],
    tryIt: {
      need: 'A partner and two pretend phones',
      steps: [
        'One of you calls and says «Allô !»',
        'Ask who is speaking and ask for someone.',
        'Swap roles.',
      ],
    },
    safety: ['Only talk on the phone with people you and your family know.'],
    quiz: [
      {
        prompt: 'How do you answer the phone in French?',
        options: ['Allô !', 'Au revoir !', 'Merci !'],
        answer: 0,
        why: 'That is the phone greeting.',
      },
    ],
    sayIt: {
      phrase: 'Allô ! Qui est à l’appareil ?',
      meaning: 'Hello! Who is speaking?',
    },
  },
  'french-17': {
    indicator: { code: 'B4.4.6.2.2', text: 'Accepter/refuser une invitation.' },
    hook: 'A friend invites you to a party. How do you say yes, or no, politely in French?',
    explain: [
      'To say yes, say «Avec plaisir !» or «Oui, je suis libre».',
      'To say no, say sorry first: «Non, je suis désolé». A girl writes «désolée».',
      'You can add «Je ne peux pas», which means I cannot.',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Tu viens à ma fête samedi ?' },
        { who: 1, text: 'Avec plaisir !' },
        { who: 0, text: 'Super ! À samedi !' },
      ],
    },
    artCaption: 'An invitation is accepted.',
    words: [
      { term: 'Avec plaisir !', meaning: 'With pleasure!' },
      { term: 'Je suis libre.', meaning: 'I am free.' },
      { term: 'Je suis désolé.', meaning: 'I am sorry.' },
      { term: 'Je ne peux pas.', meaning: 'I cannot.' },
      { term: 'la fête', meaning: 'Party, or festival.' },
    ],
    examples: [
      {
        title: 'Saying no kindly',
        situation:
          'You cannot go to a party because you have a lesson. What do you say?',
        steps: [
          'Say sorry: «Je suis désolé».',
          'Say you cannot: «Je ne peux pas».',
          'Give a reason: «J’ai un cours».',
        ],
        answer: 'Sorry, a no, and a reason.',
      },
    ],
    mistakes: [
      {
        wrong: 'Just saying «Non».',
        right: 'Add «Je suis désolé» to be polite.',
      },
    ],
    realLife: [
      'Birthday parties.',
      'Playing at a friend’s house.',
      'Family gatherings.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Invite your partner to something.',
        'Your partner accepts or refuses politely.',
        'Swap roles.',
      ],
    },
    quiz: [
      {
        prompt: 'Which answer says no politely?',
        options: [
          'Non, je suis désolé.',
          'Avec plaisir !',
          'Oui, je suis libre.',
        ],
        answer: 0,
        why: 'It says no and says sorry.',
      },
    ],
    sayIt: { phrase: 'Avec plaisir !', meaning: 'With pleasure!' },
  },
  'french-18': {
    indicator: {
      code: 'B4.4.7.2.1',
      text: 'Poser et répondre à des questions sur les métiers ou les professions des membres d’une famille ou d’autres personnes.',
    },
    hook: 'What does your father do? What does your mother do? Let us talk about jobs in French.',
    explain: [
      'To ask about a job, say «Que fait ton papa ?» or «Que fait ta maman ?»',
      'Answer with «Il est» or «Elle est» and the job, with no «un» or «une»: «Elle est infirmière».',
      'Many job words change for a woman: «enseignant» becomes «enseignante».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Que fait ton papa ?' },
        { who: 1, text: 'Il est agriculteur.' },
        { who: 0, text: 'Et ta maman ?' },
        { who: 1, text: 'Elle est commerçante.' },
      ],
    },
    artCaption: 'Two friends talk about their parents’ jobs.',
    words: [
      { term: 'agriculteur', meaning: 'Farmer.' },
      { term: 'commerçante', meaning: 'Trader, for a woman.' },
      { term: 'enseignant', meaning: 'Teacher, for a man.' },
      { term: 'infirmière', meaning: 'Nurse, for a woman.' },
      { term: 'policier', meaning: 'Police officer, for a man.' },
    ],
    examples: [
      {
        title: 'Guess the job',
        situation: 'A classmate mimes writing on a board. What job is it?',
        steps: [
          'Writing on a board is what a teacher does.',
          'Say it with «Il est» or «Elle est».',
        ],
        answer: '«Il est enseignant» or «Elle est enseignante».',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «Il est un médecin».',
        right: 'Leave out «un»: «Il est médecin».',
      },
    ],
    realLife: [
      'Talking about family.',
      'Careers day.',
      'People who help in the community.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Mime a job.',
        'Your friends guess with «Il est…» or «Elle est…»',
        'Take turns.',
      ],
    },
    quiz: [
      {
        prompt: 'How do you say she is a nurse?',
        options: [
          'Elle est infirmière.',
          'Il est infirmier.',
          'Elle est policière.',
        ],
        answer: 0,
        why: 'It uses the word for she and the job word for a woman nurse.',
      },
    ],
    sayIt: {
      phrase: 'Que fait ta maman ?',
      meaning: 'What does your mother do?',
    },
  },
  'french-19': {
    indicator: {
      code: 'B4.4.8.3.1',
      text: 'Situer sur une carte de la ville, la position des lieux publics.',
    },
    hook: 'Where is the bank? Where is the market? Let us find places in town in French.',
    explain: [
      '«à côté de» means next to: «La banque est à côté de l’école».',
      '«entre» means between: «Le marché est entre la banque et l’hôpital».',
      '«devant» means in front of, and «derrière» means behind.',
    ],
    art: {
      kind: 'town',
      places: ['l’école', 'la banque', 'le marché', 'l’hôpital', 'la poste'],
      focus: 2,
    },
    artCaption:
      'A street with a school, a bank, a market, a hospital and a post office.',
    words: [
      { term: 'à côté de', meaning: 'Next to.' },
      { term: 'entre', meaning: 'Between.' },
      { term: 'devant', meaning: 'In front of.' },
      { term: 'derrière', meaning: 'Behind.' },
      { term: 'la ville', meaning: 'Town.' },
    ],
    examples: [
      {
        title: 'Where is the market?',
        situation: 'Look at the street. Where is the market?',
        steps: [
          'The bank is on one side of it.',
          'The hospital is on the other side.',
        ],
        answer: '«Le marché est entre la banque et l’hôpital.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up «devant» and «derrière».',
        right: '«devant» is in front, «derrière» is behind.',
      },
    ],
    realLife: [
      'Giving directions.',
      'Reading a town map.',
      'Finding places on a school trip.',
    ],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Draw a street with four buildings.',
        'Label them in French.',
        'Write two sentences with «à côté de» or «entre».',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means between?',
        options: ['entre', 'devant', 'derrière'],
        answer: 0,
        why: 'That word means between.',
      },
    ],
    sayIt: {
      phrase: 'La banque est à côté de l’école.',
      meaning: 'The bank is next to the school.',
    },
  },
  'french-20': {
    indicator: { code: 'B4.4.9.4.1', text: 'Écrire pour donner des ordres.' },
    hook: 'Stand up! Sit down! Listen! Teachers give orders all day. Let us give them in French.',
    explain: [
      'An order tells someone to do something.',
      'To the whole class, a teacher says «Levez-vous !», «Asseyez-vous !» and «Écoutez !»',
      'To one friend, say «Lève-toi !», «Assieds-toi !» or «Écoute !»',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Levez-vous, s’il vous plaît.' },
        { who: 0, text: 'Ouvrez vos livres.' },
        { who: 1, text: 'Oui, Madame.' },
      ],
    },
    artCaption: 'A teacher gives orders to the class.',
    words: [
      { term: 'Levez-vous !', meaning: 'Stand up! To a group.' },
      { term: 'Asseyez-vous !', meaning: 'Sit down! To a group.' },
      { term: 'Écoutez !', meaning: 'Listen! To a group.' },
      { term: 'Répétez !', meaning: 'Repeat! To a group.' },
      { term: 'Ouvrez vos livres !', meaning: 'Open your books! To a group.' },
    ],
    examples: [
      {
        title: 'Match the picture',
        situation:
          'A picture shows a child closing the door. Which order matches?',
        steps: [
          'The verb for close is «fermer».',
          'To one person: «Ferme la porte !»',
        ],
        answer: '«Ferme la porte !»',
      },
    ],
    mistakes: [
      {
        wrong: 'Giving orders without «s’il vous plaît».',
        right: 'Add «s’il vous plaît» or «s’il te plaît» to be polite.',
      },
    ],
    realLife: [
      'Classroom instructions.',
      'Games like Simon says.',
      'Helping at home.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Write three orders on cards.',
        'Read one aloud.',
        'Your friends do the action.',
      ],
    },
    quiz: [
      {
        prompt: 'Which order means sit down, to one friend?',
        options: ['Assieds-toi !', 'Lève-toi !', 'Écoute !'],
        answer: 0,
        why: 'That is the order to sit down.',
      },
    ],
    sayIt: {
      phrase: 'Asseyez-vous, s’il vous plaît.',
      meaning: 'Sit down, please.',
    },
  },
}
