import type { CourseGuides } from './types'

// Basic 5 French, written for this course and scoped to the NaCCA French
// Curriculum for Primary Schools, B4–B6 (2019), for nine- and ten-year-olds.
// Notes:
// - Explanations are in English, with French inside «…» so the French voice
//   reads it. French comes at the end of a sentence where possible, so the
//   narration flows. Questions and their reasons are English; options French.
// - People, families and addresses are made up. The curriculum's example of a
//   public figure's family is the President's; the guide uses a made-up
//   athlete, so it never goes out of date.

export const guides: CourseGuides = {
  'french-01': {
    indicator: {
      code: 'B5.1.1.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel dans lequel deux personnes se saluent.',
    },
    hook: 'You greet a friend one way and your head teacher another. French does the same. Let us hear how.',
    explain: [
      'To a friend, you can say «Salut ! Ça va ?»',
      'To an adult or someone you do not know, be more polite: «Bonjour, Madame. Comment allez-vous ?»',
      'A polite answer is «Très bien, merci. Et vous ?» When you leave in the day, say «Bonne journée !»',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Bonjour, Madame. Comment allez-vous ?' },
        { who: 1, text: 'Très bien, merci. Et toi ?' },
        { who: 0, text: 'Ça va bien, merci.' },
        { who: 1, text: 'Bonne journée !' },
      ],
    },
    artCaption: 'A pupil greets a teacher politely.',
    words: [
      {
        term: 'Comment allez-vous ?',
        meaning: 'How are you? Polite, to an adult.',
      },
      { term: 'Ça va ?', meaning: 'How are you? To a friend.' },
      { term: 'Très bien, merci.', meaning: 'Very well, thank you.' },
      { term: 'Bonne journée !', meaning: 'Have a good day!' },
      { term: 'Bonne nuit !', meaning: 'Good night!' },
    ],
    examples: [
      {
        title: 'Polite or friendly?',
        situation:
          'You meet your friend’s grandfather in the morning. Which greeting fits?',
        steps: [
          'He is an elder, so be polite.',
          'Greet him first, as we do in Ghana.',
        ],
        answer: 'Say «Bonjour, Monsieur. Comment allez-vous ?»',
      },
    ],
    mistakes: [
      {
        wrong:
          'Greeting an elder with only a short word, as you would a friend.',
        right:
          'Greet elders politely and first: «Bonjour, Madame» or «Bonjour, Monsieur».',
      },
    ],
    realLife: [
      'Greeting teachers and elders.',
      'Meeting visitors.',
      'Leaving a shop politely.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Act out greeting a friend.',
        'Act out greeting a teacher.',
        'Say how the two greetings were different.',
      ],
    },
    quiz: [
      {
        prompt: 'Which greeting is polite enough for a head teacher?',
        options: ['Bonjour, Madame. Comment allez-vous ?', 'Salut ! Ça va ?'],
        answer: 0,
        why: 'The first one is the polite greeting for an adult.',
      },
      {
        prompt: 'What do you say to wish someone a good day?',
        options: ['Bonne journée !', 'Bonne nuit !', 'Bonsoir !'],
        answer: 0,
        why: 'That wishes someone a good day.',
      },
    ],
    sayIt: {
      phrase: 'Bonjour, Madame. Comment allez-vous ?',
      meaning: 'Hello, madam. How are you?',
    },
  },
  'french-02': {
    indicator: {
      code: 'B5.1.2.1.1',
      text: 'Écouter et comprendre un dialogue entre deux personnes qui se présentent et identifier oralement les personnes.',
    },
    hook: 'Two new friends meet. Can you understand who they are, how old they are and where they live?',
    explain: [
      'To give your name, say «Je m’appelle». To give your age, say «J’ai» and the number with «ans».',
      'For example, ten years old is «J’ai dix ans».',
      'To ask where someone lives, say «Tu habites où ?» The answer starts with «J’habite à».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Je m’appelle Ekow. J’ai dix ans.' },
        { who: 1, text: 'Moi, c’est Fatima. J’ai neuf ans.' },
        { who: 0, text: 'Tu habites où ?' },
        { who: 1, text: 'J’habite à Tamale.' },
      ],
    },
    artCaption: 'Ekow and Fatima introduce themselves.',
    words: [
      { term: 'J’ai dix ans.', meaning: 'I am ten years old.' },
      { term: 'Quel âge as-tu ?', meaning: 'How old are you?' },
      { term: 'J’habite à', meaning: 'I live in.' },
      { term: 'Tu habites où ?', meaning: 'Where do you live?' },
    ],
    examples: [
      {
        title: 'Who is who?',
        situation:
          'In the dialogue, how old is Fatima and where does she live?',
        steps: [
          'She says «J’ai neuf ans», so she is nine.',
          'She says «J’habite à Tamale».',
        ],
        answer: 'She is nine and lives in Tamale.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying your age with the word for I am.',
        right: 'In French you have years: «J’ai dix ans».',
      },
    ],
    realLife: [
      'Meeting new classmates.',
      'Making a pen friend.',
      'Filling in a form.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Ask your partner their name, age and town.',
        'Answer the same questions.',
        'Tell the class about your partner.',
      ],
    },
    safety: [
      'Use your town only, never your full address, when you talk to people you do not know.',
    ],
    quiz: [
      {
        prompt: 'How do you say I am ten years old?',
        options: ['J’ai dix ans.', 'Je suis dix ans.', 'J’habite dix ans.'],
        answer: 0,
        why: 'French uses the verb to have for age.',
      },
    ],
    sayIt: {
      phrase: 'J’ai dix ans. J’habite à Accra.',
      meaning: 'I am ten years old. I live in Accra.',
    },
  },
  'french-03': {
    indicator: {
      code: 'B5.1.3.1.1',
      text: 'Écouter et comprendre un texte dans lequel on présente quelqu’un.',
    },
    hook: 'Read a short text about a boy. Can you find his name, his age and where he is from?',
    explain: [
      'A text that presents someone often gives the name, the age, the nationality and the town.',
      'Look for the key words: «Il s’appelle», «Il a… ans», «Il est» and «Il habite à».',
      'Questions about the text use «Quel est son prénom ?» and «Quel âge a-t-il ?»',
    ],
    art: {
      kind: 'scroll',
      title: 'Voici Kojo',
      lines: [
        'Il s’appelle Kojo Asante.',
        'Il a onze ans.',
        'Il est ghanéen.',
        'Il habite à Ho.',
        'Il aime la musique.',
      ],
      plain: true,
    },
    artCaption: 'A short text presenting Kojo.',
    words: [
      { term: 'son prénom', meaning: 'His or her first name.' },
      { term: 'Quel âge a-t-il ?', meaning: 'How old is he?' },
      {
        term: 'la nationalité',
        meaning: 'Nationality, the country you belong to.',
      },
      { term: 'Il habite à', meaning: 'He lives in.' },
    ],
    examples: [
      {
        title: 'Find the answer',
        situation: 'Where does Kojo live?',
        steps: [
          'Find the line that starts «Il habite».',
          'Read the town after it.',
        ],
        answer: 'In Ho.',
      },
    ],
    mistakes: [
      {
        wrong: 'Guessing instead of reading.',
        right: 'Find the key words in the text, then answer.',
      },
    ],
    realLife: [
      'Reading about new classmates.',
      'Profiles in magazines.',
      'Letters from pen friends.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write five lines presenting a made-up person.',
        'Swap with a partner.',
        'Ask each other three questions about the texts.',
      ],
    },
    quiz: [
      {
        prompt: 'How old is Kojo?',
        options: ['onze ans', 'dix ans', 'douze ans'],
        answer: 0,
        why: 'The text says he is eleven.',
      },
    ],
    sayIt: { phrase: 'Quel âge a-t-il ?', meaning: 'How old is he?' },
  },
  'french-04': {
    indicator: {
      code: 'B5.1.3.4.1',
      text: 'Écrire une carte postale à un(e) correspondant(e) pour lui présenter quelqu’un : âge, profession/occupation, son adresse.',
    },
    hook: 'You have a pen friend in another country. Write to tell them about someone you know.',
    explain: [
      'Start with «Cher» or «Chère» and the name, then a greeting.',
      'Present the person with «Je te présente», then give the name, age, job and town.',
      'Ages over twenty use tens: thirty is «trente», forty is «quarante». End with «Grosses bises».',
    ],
    art: {
      kind: 'scroll',
      title: 'Chère Ama,',
      lines: [
        'Je te présente mon oncle.',
        'Il s’appelle Yaw Boateng.',
        'Il a quarante ans.',
        'Il est médecin à Wa.',
        'Grosses bises, Kofi',
      ],
      plain: true,
    },
    artCaption: 'Kofi’s postcard presents his uncle.',
    words: [
      { term: 'Je te présente', meaning: 'Let me introduce, to a friend.' },
      {
        term: 'le correspondant',
        meaning: 'Pen friend. A girl pen friend is la correspondante.',
      },
      { term: 'trente', meaning: 'Thirty.' },
      { term: 'quarante', meaning: 'Forty.' },
      {
        term: 'Grosses bises',
        meaning: 'Lots of love, to end a friendly letter.',
      },
    ],
    examples: [
      {
        title: 'A teacher',
        situation:
          'Present your maths teacher, Mr Ntow, who is thirty-eight and lives in Kumasi.',
        steps: [
          'Start with «Je te présente mon professeur de maths».',
          'Add «Il a trente-huit ans».',
          'Add «Il habite à Kumasi».',
        ],
        answer: 'Name, age and town, in three sentences.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting the greeting and the ending.',
        right:
          'Start with «Cher» or «Chère» and end with «Grosses bises» and your name.',
      },
    ],
    realLife: [
      'Pen friends abroad.',
      'Postcards from trips.',
      'Messages to family.',
    ],
    tryIt: {
      need: 'A card',
      steps: [
        'Write to a made-up pen friend.',
        'Present someone in four sentences.',
        'Sign it and draw a stamp.',
      ],
    },
    safety: [
      'Use made-up addresses. Never send real addresses to people you have not met.',
    ],
    quiz: [
      {
        prompt: 'How do you write forty years old?',
        options: ['quarante ans', 'quatorze ans', 'trente ans'],
        answer: 0,
        why: 'Forty has its own word, different from fourteen.',
      },
    ],
    sayIt: {
      phrase: 'Je te présente mon oncle.',
      meaning: 'Let me introduce my uncle.',
    },
  },
  'french-05': {
    indicator: {
      code: 'B5.1.4.3.1',
      text: 'Lire et comprendre des textes simples qui décrivent les caractéristiques physiques et l’habillement d’une personne.',
    },
    hook: 'Who is wearing the green shirt? Read descriptions of clothes and find the right person.',
    explain: [
      'To describe clothes, use «Il porte» or «Elle porte», which means he wears or she wears.',
      'Clothes words include «une chemise», «un pantalon», «une robe» and «une jupe».',
      'Colours come after the thing, and add an e for a feminine word: «une chemise verte».',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'stand', x: 220, kit: 1 },
        { pose: 'stand', x: 420, kit: 3, facing: -1 },
      ],
      sun: true,
      label: 'Qui porte une chemise verte ?',
    },
    artCaption: 'Two children, one in green and one in blue.',
    words: [
      { term: 'Il porte', meaning: 'He wears.' },
      { term: 'une chemise', meaning: 'A shirt.' },
      { term: 'un pantalon', meaning: 'Trousers.' },
      { term: 'une robe', meaning: 'A dress.' },
      { term: 'vert', meaning: 'Green. It adds an e after a feminine word.' },
    ],
    examples: [
      {
        title: 'Read and point',
        situation: 'Read: «Il porte une chemise bleue.» Which child is it?',
        steps: [
          'Find the colour word: blue.',
          'Look for the child in a blue shirt.',
        ],
        answer: 'The child on the right.',
      },
    ],
    mistakes: [
      {
        wrong: 'Putting the colour before the thing.',
        right: 'In French the colour comes after: «une robe rouge».',
      },
    ],
    realLife: [
      'School uniforms.',
      'Describing someone you are looking for.',
      'Shopping for clothes.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Describe what a classmate is wearing.',
        'Your partner guesses who it is.',
        'Swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence says she wears a red dress?',
        options: [
          'Elle porte une robe rouge.',
          'Il porte une robe rouge.',
          'Elle porte une rouge robe.',
        ],
        answer: 0,
        why: 'It uses she, and the colour comes after the dress.',
      },
    ],
    sayIt: {
      phrase: 'Il porte une chemise verte.',
      meaning: 'He is wearing a green shirt.',
    },
  },
  'french-06': {
    indicator: {
      code: 'B5.1.5.3.1',
      text: 'Lire et comprendre un texte simple sur les membres de la famille d’une personnalité publique.',
    },
    hook: 'Famous people have families too. Let us read about the family of a made-up champion runner.',
    explain: [
      'More family words: a husband is «le mari», a wife is «la femme», a son is «le fils» and a daughter is «la fille».',
      'An uncle is «l’oncle», an aunt is «la tante» and a cousin is «le cousin».',
      'To show whose family it is, use «son» or «sa»: «son mari» means her husband.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Adjoa Owusu', 'son mari, Kwaku'],
        ['son fils, Kobby', 'sa fille, Esi'],
      ],
    },
    artCaption: 'The family of Adjoa Owusu, a made-up runner.',
    words: [
      { term: 'le mari', meaning: 'Husband.' },
      { term: 'la femme', meaning: 'Wife, or woman.' },
      { term: 'le fils', meaning: 'Son.' },
      { term: 'la fille', meaning: 'Daughter, or girl.' },
      { term: 'la tante', meaning: 'Aunt.' },
    ],
    examples: [
      {
        title: 'Read and answer',
        situation:
          'Read: «Adjoa Owusu est une athlète. Son mari s’appelle Kwaku. Elle a deux enfants.» How many children does she have?',
        steps: [
          'Find the sentence with «enfants».',
          'The number before it is two.',
        ],
        answer: 'Two.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking «son» means a boy child.',
        right: 'Here it means his or her: «son mari» is her husband.',
      },
    ],
    realLife: [
      'Reading about sports stars.',
      'News stories.',
      'Talking about your own family.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Invent a famous person.',
        'Write three sentences about their family.',
        'Ask a partner a question about it.',
      ],
    },
    quiz: [
      {
        prompt: 'What is the French word for daughter?',
        options: ['la fille', 'le fils', 'la tante'],
        answer: 0,
        why: 'That is daughter. The other two are son and aunt.',
      },
    ],
    sayIt: {
      phrase: 'Son mari s’appelle Kwaku.',
      meaning: 'Her husband’s name is Kwaku.',
    },
  },
  'french-07': {
    indicator: {
      code: 'B5.2.1.2.2',
      text: 'Réciter des poèmes, chanter des chansons sur des objets, des animaux, des fruits, etc.',
    },
    hook: 'Mangoes, pineapples, goats and chickens! Let us learn their French names with a chant.',
    explain: [
      'Fruits we know in Ghana include «la mangue», «l’ananas», «la papaye» and «la banane».',
      'Animals around us include «le chien», «le chat», «la chèvre» and «la poule».',
      'Clap a steady beat and say each word on a clap. Rhythm helps you remember.',
    ],
    art: {
      kind: 'scroll',
      title: 'Au marché',
      lines: [
        'Une mangue, une banane,',
        'un ananas, une papaye !',
        'Une chèvre, une poule,',
        'au marché, on chante tous !',
      ],
      plain: true,
    },
    artCaption: 'A market chant about fruits and animals.',
    words: [
      { term: 'la mangue', meaning: 'Mango.' },
      { term: 'l’ananas', meaning: 'Pineapple.' },
      { term: 'la papaye', meaning: 'Pawpaw.' },
      { term: 'la chèvre', meaning: 'Goat.' },
      { term: 'la poule', meaning: 'Hen, or chicken.' },
    ],
    examples: [
      {
        title: 'Name it',
        situation:
          'Your partner shows a picture of a pineapple. What do you say?',
        steps: ['Remember the word with its little word in front.'],
        answer: '«C’est un ananas.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying every word the English way.',
        right: 'Listen to the French voice, and copy the sounds.',
      },
    ],
    realLife: [
      'Shopping at the market.',
      'Farm animals at home.',
      'Songs in class.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Say the chant together, clapping.',
        'Add a new line with two more words.',
        'Perform it for the class.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means goat?',
        options: ['la chèvre', 'la poule', 'le chat'],
        answer: 0,
        why: 'That is the word for goat.',
      },
    ],
    sayIt: {
      phrase: 'Une mangue, une banane, un ananas !',
      meaning: 'A mango, a banana, a pineapple!',
    },
  },
  'french-08': {
    indicator: {
      code: 'B5.2.2.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel sur l’environnement de l’école.',
    },
    hook: 'Where do you eat, read and play at school? Let us name the places in French.',
    explain: [
      'Places at school include «la salle de classe», «la cour» and «la bibliothèque».',
      'Pupils eat at «la cantine», and the head teacher works in «le bureau du directeur».',
      'To say what a school has, use «Dans mon école, il y a…»',
    ],
    art: {
      kind: 'town',
      places: ['la classe', 'la bibliothèque', 'la cantine', 'le bureau'],
      label: 'Mon école',
    },
    artCaption: 'Places in a school.',
    words: [
      { term: 'la salle de classe', meaning: 'Classroom.' },
      { term: 'la cour', meaning: 'Playground, or compound.' },
      { term: 'la bibliothèque', meaning: 'Library.' },
      { term: 'la cantine', meaning: 'Canteen, where pupils eat.' },
      { term: 'le terrain de sport', meaning: 'Sports field.' },
    ],
    examples: [
      {
        title: 'Where are you?',
        situation: 'You are borrowing a book. Where are you?',
        steps: ['Books are borrowed from the library.'],
        answer: '«Je suis à la bibliothèque.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking «la librairie» is a library.',
        right: 'A library is «la bibliothèque». «La librairie» is a bookshop.',
      },
    ],
    realLife: [
      'Showing a visitor round school.',
      'Finding your way at a new school.',
      'School maps.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a map of your school.',
        'Label five places in French.',
        'Describe it with «Dans mon école, il y a…»',
      ],
    },
    quiz: [
      {
        prompt: 'Where do pupils eat at school?',
        options: ['à la cantine', 'à la bibliothèque', 'au bureau'],
        answer: 0,
        why: 'The canteen is where pupils eat.',
      },
    ],
    sayIt: {
      phrase: 'Dans mon école, il y a une bibliothèque.',
      meaning: 'In my school, there is a library.',
    },
  },
  'french-09': {
    indicator: {
      code: 'B5.2.2.4.1',
      text: 'Compléter un texte, une annonce, une affiche par des mots sur l’environnement de l’école.',
    },
    hook: 'A poster on the school notice board has some missing words. Can you fill them in?',
    explain: [
      'An announcement tells people about an event: what, where and when.',
      'To fill a gap, read the whole sentence and choose the word that makes sense.',
      'School words you know will help, such as «la cour», «la cantine» and «la bibliothèque».',
    ],
    art: {
      kind: 'scroll',
      title: 'Grande nouvelle !',
      lines: [
        'La nouvelle bibliothèque',
        'ouvre lundi à neuf heures.',
        'Venez lire des livres !',
        'Le directeur',
      ],
      plain: true,
    },
    artCaption: 'A poster about the new library.',
    words: [
      { term: 'une annonce', meaning: 'An announcement.' },
      { term: 'une affiche', meaning: 'A poster.' },
      { term: 'ouvre', meaning: 'Opens.' },
      { term: 'Venez !', meaning: 'Come! To a group.' },
    ],
    examples: [
      {
        title: 'Fill the gap',
        situation: 'Complete: «Nous mangeons à la ____.» We eat at the…?',
        steps: ['Think of where pupils eat.'],
        answer: '«cantine»',
      },
    ],
    mistakes: [
      {
        wrong: 'Choosing a word without reading the whole sentence.',
        right: 'Read the full sentence first, then choose.',
      },
    ],
    realLife: ['Notice boards.', 'School events.', 'Posters in town.'],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Make a poster for a school event.',
        'Leave out two words.',
        'Ask a partner to fill them in.',
      ],
    },
    quiz: [
      {
        prompt:
          'Complete the poster: the library opens on Monday at nine. Which word means opens?',
        options: ['ouvre', 'ferme', 'mange'],
        answer: 0,
        why: 'That word means opens.',
      },
    ],
    sayIt: {
      phrase: 'Venez lire des livres !',
      meaning: 'Come and read books!',
    },
  },
  'french-10': {
    indicator: {
      code: 'B5.3.1.4.1',
      text: 'Écrire des phrases sur ce que l’on aime et de ce que l’on n’aime pas.',
    },
    hook: 'Do you love dancing? Do you dislike rain? Let us write about our likes and dislikes, with reasons.',
    explain: [
      'Write what you like with «J’aime» and what you do not like with «Je n’aime pas».',
      'Give a reason with «parce que», which means because.',
      'For example, «J’aime la musique parce que c’est joyeux».',
    ],
    art: {
      kind: 'scroll',
      title: 'Mes goûts',
      lines: [
        'J’aime la fête.',
        'J’aime le football.',
        'Je n’aime pas la pluie.',
        'J’adore les mangues !',
      ],
      plain: true,
    },
    artCaption: 'A list of likes and dislikes.',
    words: [
      { term: 'J’adore', meaning: 'I love.' },
      { term: 'Je déteste', meaning: 'I hate.' },
      { term: 'parce que', meaning: 'Because.' },
      { term: 'la pluie', meaning: 'Rain.' },
    ],
    examples: [
      {
        title: 'Add a reason',
        situation: 'You like football because it is fun. How do you write it?',
        steps: [
          'Start with «J’aime le football».',
          'Add «parce que c’est amusant».',
        ],
        answer: '«J’aime le football parce que c’est amusant.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out «ne» in a negative sentence when writing.',
        right: 'Write both parts: «Je n’aime pas».',
      },
    ],
    realLife: [
      'Talking about hobbies.',
      'Choosing food.',
      'Writing to pen friends.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write three things you like.',
        'Write two things you do not like.',
        'Add a reason to one of them.',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean because?',
        options: ['parce que', 'j’adore', 'je déteste'],
        answer: 0,
        why: 'Those words introduce a reason.',
      },
    ],
    sayIt: {
      phrase: 'J’aime la musique parce que c’est joyeux.',
      meaning: 'I like music because it is joyful.',
    },
  },
  'french-11': {
    indicator: {
      code: 'B5.4.1.2.3',
      text: 'Chanter des chansons/Réciter des poèmes sur les nombres.',
    },
    hook: 'Can you count in tens in French, all the way to sixty? Let us chant it.',
    explain: [
      'Counting in tens goes «dix, vingt, trente, quarante, cinquante, soixante».',
      'For twenty-two, join the ten and the number with a dash: «vingt-deux».',
      'Twenty-one, thirty-one and so on add «et un», as in «vingt et un».',
    ],
    art: {
      kind: 'scroll',
      title: 'Je compte',
      lines: [
        'Dix, vingt, trente,',
        'quarante, cinquante,',
        'soixante, bravo !',
        'Vingt et un, vingt-deux…',
      ],
      plain: true,
    },
    artCaption: 'A counting chant in tens.',
    words: [
      { term: 'vingt', meaning: 'Twenty.' },
      { term: 'trente', meaning: 'Thirty.' },
      { term: 'cinquante', meaning: 'Fifty.' },
      { term: 'soixante', meaning: 'Sixty.' },
      { term: 'vingt et un', meaning: 'Twenty-one.' },
    ],
    examples: [
      {
        title: 'Thirty-five',
        situation: 'How do you say thirty-five?',
        steps: [
          'Thirty is «trente».',
          'Five is «cinq».',
          'Join them with a dash.',
        ],
        answer: '«trente-cinq»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «vingt-un» for twenty-one.',
        right: 'Say «vingt et un».',
      },
    ],
    realLife: [
      'Prices at the market.',
      'Ages of family members.',
      'Page numbers.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Chant the tens together.',
        'Clap and count from twenty to thirty.',
        'Take turns saying a number for others to write.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word is fifty?',
        options: ['cinquante', 'quinze', 'cinq'],
        answer: 0,
        why: 'Fifty is the ten that sounds like five.',
      },
    ],
    sayIt: {
      phrase: 'dix, vingt, trente, quarante, cinquante',
      meaning: 'Ten, twenty, thirty, forty, fifty.',
    },
  },
  'french-12': {
    indicator: {
      code: 'B5.4.2.2.1',
      text: 'Se renseigner sur l’heure.',
    },
    hook: 'What time does school start? When does the bus leave? Let us ask about times in French.',
    explain: [
      'To ask when something happens, say «À quelle heure… ?»',
      'The answer starts with «à»: «À huit heures» or «À midi».',
      'For the morning, add «du matin». For the evening, add «du soir».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'À quelle heure commencent les cours ?' },
        { who: 1, text: 'À huit heures du matin.' },
        { who: 0, text: 'Et la récréation ?' },
        { who: 1, text: 'À dix heures.' },
      ],
    },
    artCaption: 'Two pupils ask about school times.',
    words: [
      { term: 'À quelle heure ?', meaning: 'At what time?' },
      { term: 'le rendez-vous', meaning: 'Appointment, or meeting.' },
      { term: 'du matin', meaning: 'In the morning.' },
      { term: 'du soir', meaning: 'In the evening.' },
      { term: 'la récréation', meaning: 'Break time.' },
    ],
    examples: [
      {
        title: 'The bus',
        situation:
          'The bus leaves at nine in the morning. How do you answer a question about it?',
        steps: ['Start with «à».', 'Add the time and «du matin».'],
        answer: '«À neuf heures du matin.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering a when question without «à».',
        right: 'Say «à» before the time: «À dix heures».',
      },
    ],
    realLife: [
      'School timetables.',
      'Bus and train times.',
      'Doctor’s appointments.',
    ],
    tryIt: {
      need: 'A partner and a timetable',
      steps: [
        'Ask your partner when three things happen.',
        'Answer with «à» and the time.',
        'Swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which answer means at eight in the evening?',
        options: [
          'À huit heures du soir.',
          'À huit heures du matin.',
          'Il est huit heures.',
        ],
        answer: 0,
        why: 'That one says at eight, in the evening.',
      },
    ],
    sayIt: {
      phrase: 'À quelle heure est le rendez-vous ?',
      meaning: 'What time is the appointment?',
    },
  },
  'french-13': {
    indicator: {
      code: 'B5.4.3.1.1',
      text: 'Écouter/Regarder et comprendre un document audio/audio-visuel sur les jours de la semaine.',
    },
    hook: 'In Ghana, many names tell the day you were born. Do you know your day in French?',
    explain: [
      'To say what day it is today, use «Aujourd’hui, c’est».',
      'For tomorrow, use «Demain, c’est». For yesterday, use «Hier, c’était».',
      'Kofi is a name for a boy born on Friday, which is «vendredi».',
    ],
    art: {
      kind: 'calendar',
      month: 'novembre',
      days: 30,
      startsOn: 0,
      focus: 10,
      heads: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    },
    artCaption: 'A calendar. Today is a Tuesday.',
    words: [
      { term: 'aujourd’hui', meaning: 'Today.' },
      { term: 'demain', meaning: 'Tomorrow.' },
      { term: 'hier', meaning: 'Yesterday.' },
      {
        term: 'Je suis né le',
        meaning: 'I was born on. A girl writes it with an extra e.',
      },
    ],
    examples: [
      {
        title: 'Born on a Saturday',
        situation: 'Ama was born on a Saturday. How does she say it?',
        steps: [
          'She is a girl, so she says «Je suis née».',
          'Saturday is «samedi».',
        ],
        answer: '«Je suis née un samedi.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up «demain» and «hier».',
        right: 'Tomorrow is «demain»; yesterday is «hier».',
      },
    ],
    realLife: [
      'Ghanaian day names.',
      'Planning the week.',
      'Talking about yesterday and tomorrow.',
    ],
    tryIt: {
      need: 'A calendar',
      steps: [
        'Say what day it is today.',
        'Say tomorrow and yesterday.',
        'Find the day you were born, and say it in French.',
      ],
    },
    quiz: [
      {
        prompt: 'Today is Tuesday. What is tomorrow?',
        options: ['mercredi', 'lundi', 'jeudi'],
        answer: 0,
        why: 'Wednesday comes after Tuesday.',
      },
    ],
    sayIt: {
      phrase: 'Aujourd’hui, c’est mardi.',
      meaning: 'Today is Tuesday.',
    },
  },
  'french-14': {
    indicator: {
      code: 'B5.4.3.4.1',
      text: 'Écrire ce que l’on fait chaque jour de la semaine.',
    },
    hook: 'What do you do on Mondays? And on Saturdays? Let us write a diary of our week.',
    explain: [
      'To say every Monday, put «le» before the day: «le lundi».',
      'Then say what you do: «Le lundi, je vais à l’école».',
      'Useful actions include «je joue», «je lis» and «j’aide ma mère».',
    ],
    art: {
      kind: 'scroll',
      title: 'Mon journal',
      lines: [
        'Le lundi, je vais à l’école.',
        'Le mercredi, je joue au football.',
        'Le samedi, j’aide ma mère.',
        'Le dimanche, je rends visite à mamie.',
      ],
      plain: true,
    },
    artCaption: 'A diary of the week.',
    words: [
      { term: 'le lundi', meaning: 'On Mondays, every Monday.' },
      { term: 'je vais', meaning: 'I go.' },
      { term: 'je joue', meaning: 'I play.' },
      { term: 'j’aide', meaning: 'I help.' },
      { term: 'le journal', meaning: 'Diary, or newspaper.' },
    ],
    examples: [
      {
        title: 'Every Saturday',
        situation: 'Every Saturday you play football. How do you write it?',
        steps: ['Every Saturday is «le samedi».', 'Add «je joue au football».'],
        answer: '«Le samedi, je joue au football.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out «le» when you mean every week.',
        right: '«Le samedi» means every Saturday.',
      },
    ],
    realLife: ['Weekly routines.', 'Class timetables.', 'Keeping a diary.'],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Write one sentence for four days of your week.',
        'Draw a small picture for each.',
        'Read your diary to a partner.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence means every Monday, I go to school?',
        options: [
          'Le lundi, je vais à l’école.',
          'Lundi, je joue.',
          'Le dimanche, je vais à l’école.',
        ],
        answer: 0,
        why: 'It names Monday and going to school.',
      },
    ],
    sayIt: {
      phrase: 'Le samedi, j’aide ma mère.',
      meaning: 'On Saturdays, I help my mother.',
    },
  },
  'french-15': {
    indicator: {
      code: 'B5.4.4.4.1',
      text: 'Écrire les mois où sont nés les membres de sa famille.',
    },
    hook: 'When are your family’s birthdays? Let us write them in French.',
    explain: [
      'For a man or boy, write «Il est né en» and the month. For a woman or girl, write «Elle est née en».',
      'For example, «Ma mère est née en mars».',
      'Months start with a small letter, like «octobre».',
    ],
    art: {
      kind: 'family',
      rows: [
        ['papa : octobre', 'maman : mars'],
        ['moi : juillet', 'ma sœur : mai'],
      ],
    },
    artCaption: 'Birthday months in a family.',
    words: [
      { term: 'Il est né en', meaning: 'He was born in.' },
      { term: 'Elle est née en', meaning: 'She was born in.' },
      { term: 'l’anniversaire', meaning: 'Birthday.' },
      { term: 'octobre', meaning: 'October.' },
    ],
    examples: [
      {
        title: 'Father’s birthday',
        situation: 'Your father was born in October. How do you write it?',
        steps: [
          'He is a man, so write «Il est né» or «Mon père est né».',
          'Add «en octobre».',
        ],
        answer: '«Mon père est né en octobre.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing «née» for a man.',
        right: 'Add the extra e only for a woman or girl.',
      },
    ],
    realLife: [
      'Birthday calendars.',
      'Family celebrations.',
      'Cards and messages.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Ask three family members their birthday month.',
        'Write a sentence for each.',
        'Make a birthday calendar.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence is right for your sister?',
        options: ['Ma sœur est née en mai.', 'Ma sœur est né en mai.'],
        answer: 0,
        why: 'A girl takes the extra e.',
      },
    ],
    sayIt: {
      phrase: 'Ma mère est née en mars.',
      meaning: 'My mother was born in March.',
    },
  },
  'french-16': {
    indicator: {
      code: 'B5.4.5.4.1',
      text: 'Envoyer des textos.',
    },
    hook: 'A short text message can say hello, ask a question or make a plan. Let us write some in French.',
    explain: [
      'A text message is short. Start with a greeting, such as «Salut, Ama !»',
      'Then ask or tell one thing, such as «Tu viens à l’école demain ?»',
      'End kindly, such as «À demain !»',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Salut Ama ! Ça va ?' },
        { who: 1, text: 'Oui, ça va ! Et toi ?' },
        { who: 0, text: 'Super ! À demain à l’école.' },
        { who: 1, text: 'À demain !' },
      ],
    },
    artCaption: 'Two friends text each other.',
    words: [
      { term: 'un texto', meaning: 'A text message.' },
      { term: 'envoyer', meaning: 'To send.' },
      { term: 'Tu viens ?', meaning: 'Are you coming?' },
      { term: 'À plus tard !', meaning: 'See you later!' },
    ],
    examples: [
      {
        title: 'Making a plan',
        situation:
          'You want to ask Kwame if he is coming to football on Saturday. What do you text?',
        steps: [
          'Greet him: «Salut Kwame !»',
          'Ask: «Tu viens au football samedi ?»',
        ],
        answer: 'A greeting and one clear question.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing a very long text.',
        right: 'Keep it short: a greeting, one message and a goodbye.',
      },
    ],
    realLife: ['Messages to friends.', 'Family group chats.', 'Reminders.'],
    tryIt: {
      need: 'Paper shaped like a phone screen',
      steps: [
        'Write a text to a friend in French.',
        'Swap with a partner.',
        'Write a reply.',
      ],
    },
    safety: [
      'Only message people you and your family know. Never send photos or your address to strangers.',
    ],
    quiz: [
      {
        prompt: 'Which text asks if a friend is coming tomorrow?',
        options: ['Tu viens demain ?', 'À demain !', 'Salut !'],
        answer: 0,
        why: 'That one is a question about tomorrow.',
      },
    ],
    sayIt: {
      phrase: 'Salut ! Tu viens à l’école demain ?',
      meaning: 'Hi! Are you coming to school tomorrow?',
    },
  },
  'french-17': {
    indicator: {
      code: 'B5.4.6.2.3',
      text: 'Dire pourquoi on accepte ou on refuse une invitation.',
    },
    hook: 'When you say yes or no to an invitation, it is kind to give a reason. How do you do that in French?',
    explain: [
      'To accept with a reason, say «J’accepte, car» and the reason.',
      'To refuse kindly, say sorry and give a reason: «Désolé, mais je suis malade».',
      'You can also use «parce que»: «Je ne peux pas parce que j’ai un devoir».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Tu viens à mon anniversaire ?' },
        { who: 1, text: 'Désolée, mais je suis malade.' },
        { who: 0, text: 'Oh ! Bon rétablissement !' },
      ],
    },
    artCaption: 'A friend refuses an invitation kindly.',
    words: [
      { term: 'J’accepte', meaning: 'I accept.' },
      { term: 'car', meaning: 'Because, or as.' },
      { term: 'Je suis malade.', meaning: 'I am ill.' },
      { term: 'un devoir', meaning: 'A piece of homework.' },
      { term: 'Bon rétablissement !', meaning: 'Get well soon!' },
    ],
    examples: [
      {
        title: 'Saying yes',
        situation:
          'You are invited to a dance and you love dancing. How do you accept with a reason?',
        steps: ['Start with «J’accepte».', 'Add «car j’adore danser».'],
        answer: '«J’accepte, car j’adore danser !»',
      },
    ],
    mistakes: [
      {
        wrong: 'Refusing without a reason or a sorry.',
        right: 'Say sorry and give a reason.',
      },
    ],
    realLife: [
      'Party invitations.',
      'Being invited to play.',
      'Family events.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Invite your partner to something.',
        'Your partner accepts or refuses, with a reason.',
        'Swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which answer refuses with a reason?',
        options: [
          'Désolé, mais je suis malade.',
          'J’accepte !',
          'Avec plaisir !',
        ],
        answer: 0,
        why: 'It says sorry and gives a reason.',
      },
    ],
    sayIt: {
      phrase: 'J’accepte, car j’adore danser !',
      meaning: 'I accept, because I love dancing!',
    },
  },
  'french-18': {
    indicator: {
      code: 'B5.4.7.2.2',
      text: 'Dire la profession ou le métier que l’on veut exercer dans l’avenir.',
    },
    hook: 'What do you want to be when you grow up? Let us say it in French.',
    explain: [
      'To say the job you want, use «Je veux être» and the job: «Je veux être médecin».',
      'Or say what you want to do: «Je veux enseigner» or «Je veux réparer des voitures».',
      'Remember, there is no «un» or «une» before the job.',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Tu veux être quoi plus tard ?' },
        { who: 1, text: 'Je veux être ingénieure.' },
        { who: 1, text: 'Et toi ?' },
        { who: 0, text: 'Je veux être pilote !' },
      ],
    },
    artCaption: 'Two friends talk about future jobs.',
    words: [
      { term: 'Je veux être', meaning: 'I want to be.' },
      { term: 'plus tard', meaning: 'Later, when I grow up.' },
      { term: 'ingénieur', meaning: 'Engineer. It adds e for a woman.' },
      { term: 'pilote', meaning: 'Pilot.' },
      { term: 'comptable', meaning: 'Accountant.' },
    ],
    examples: [
      {
        title: 'A nurse',
        situation: 'Abena wants to be a nurse. How does she say it?',
        steps: [
          'A woman nurse is «infirmière».',
          'Use «Je veux être» with no «une».',
        ],
        answer: '«Je veux être infirmière.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «Je veux être un médecin».',
        right: 'Leave out «un»: «Je veux être médecin».',
      },
    ],
    realLife: [
      'Careers days.',
      'Visiting workplaces.',
      'Dreaming about the future.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw yourself in your dream job.',
        'Write «Je veux être» and the job.',
        'Say why to a partner.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence means I want to be a pilot?',
        options: [
          'Je veux être pilote.',
          'Je suis pilote.',
          'Je veux un pilote.',
        ],
        answer: 0,
        why: 'It says I want to be, with no little word before the job.',
      },
    ],
    sayIt: {
      phrase: 'Je veux être médecin.',
      meaning: 'I want to be a doctor.',
    },
  },
  'french-19': {
    indicator: {
      code: 'B5.4.8.3.1',
      text: 'Situer sur une carte de la ville la position des lieux publics.',
    },
    hook: 'A visitor asks you where the bank is. Can you tell them in French?',
    explain: [
      'To ask where a place is, say «Où se trouve la banque ?»',
      'Left is «à gauche de» and right is «à droite de». Opposite is «en face de».',
      'Near is «près de» and far is «loin de».',
    ],
    art: {
      kind: 'town',
      places: ['la pharmacie', 'la banque', 'la poste', 'le marché'],
      focus: 1,
    },
    artCaption: 'A street with a pharmacy, a bank, a post office and a market.',
    words: [
      { term: 'Où se trouve… ?', meaning: 'Where is…?' },
      { term: 'à gauche de', meaning: 'To the left of.' },
      { term: 'à droite de', meaning: 'To the right of.' },
      { term: 'en face de', meaning: 'Opposite.' },
      { term: 'la pharmacie', meaning: 'Chemist, or pharmacy.' },
    ],
    examples: [
      {
        title: 'Where is the bank?',
        situation:
          'Look at the street. The bank is next to the pharmacy, on its right. What do you say?',
        steps: [
          'From where you stand, the pharmacy is on the left of the bank.',
          'So the bank is to the right of the pharmacy.',
        ],
        answer: '«La banque est à droite de la pharmacie.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up «gauche» and «droite».',
        right: 'Left is «gauche», right is «droite».',
      },
    ],
    realLife: [
      'Giving directions to visitors.',
      'Reading town maps.',
      'Finding a pharmacy.',
    ],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Draw a street with five places.',
        'Write three sentences about where they are.',
        'Ask a partner «Où se trouve… ?»',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean opposite?',
        options: ['en face de', 'à gauche de', 'près de'],
        answer: 0,
        why: 'Those words mean opposite.',
      },
    ],
    sayIt: {
      phrase: 'Où se trouve la banque ?',
      meaning: 'Where is the bank?',
    },
  },
  'french-20': {
    indicator: { code: 'B5.4.9.4.1', text: 'Écrire pour donner des ordres.' },
    hook: 'Class rules tell us what to do and what not to do. Let us write them in French.',
    explain: [
      'An order to a group ends in «-ez»: «Écoutez !» means listen.',
      'To tell people not to do something, put «ne» and «pas» around the verb: «Ne courez pas !»',
      'Be polite and add «s’il vous plaît».',
    ],
    art: {
      kind: 'scroll',
      title: 'Les règles de la classe',
      lines: [
        'Écoutez le professeur.',
        'Levez la main.',
        'Ne courez pas.',
        'Lavez-vous les mains.',
        'Respectez les autres.',
      ],
      plain: true,
    },
    artCaption: 'Class rules, written as orders.',
    words: [
      { term: 'Levez la main.', meaning: 'Raise your hand.' },
      { term: 'Ne courez pas.', meaning: 'Do not run.' },
      { term: 'Lavez-vous les mains.', meaning: 'Wash your hands.' },
      { term: 'Respectez les autres.', meaning: 'Respect others.' },
    ],
    examples: [
      {
        title: 'A negative order',
        situation: 'Write a rule telling the class not to shout.',
        steps: [
          'To shout is «crier». The group order is «criez».',
          'Put «ne» and «pas» around it.',
        ],
        answer: '«Ne criez pas !»',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting «ne» in a written negative order.',
        right: 'Write both parts: «Ne courez pas».',
      },
    ],
    realLife: [
      'Class rules.',
      'Signs in public places.',
      'Recipes and instructions.',
    ],
    tryIt: {
      need: 'Card and markers',
      steps: [
        'Write five class rules in French.',
        'Include one with «ne… pas».',
        'Make a poster for the wall.',
      ],
    },
    quiz: [
      {
        prompt: 'Which order means do not run?',
        options: ['Ne courez pas.', 'Courez !', 'Levez la main.'],
        answer: 0,
        why: 'The two small words around the verb make it negative.',
      },
    ],
    sayIt: {
      phrase: 'Levez la main, s’il vous plaît.',
      meaning: 'Raise your hand, please.',
    },
  },
}
