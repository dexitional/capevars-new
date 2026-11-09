import type { CourseGuides } from './types'

// Basic 6 French, written for this course and scoped to the NaCCA French
// Curriculum for Primary Schools, B4–B6 (2019), for ten- and eleven-year-olds.
// Notes:
// - Explanations are in English, with French inside «…» so the French voice
//   reads it. Questions and their reasons are English; options French.
// - People, families and addresses are made up.
// - The curriculum's inventory example gives "4 cahiers x 5 cahiers = 20
//   cahiers"; the guide says four packs of five exercise books make twenty.
// - National dates are given by date only, not by whether they are holidays,
//   which can change.

export const guides: CourseGuides = {
  'french-01': {
    indicator: {
      code: 'B6.1.1.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel dans lequel deux personnes se saluent.',
    },
    hook: 'At the market in the evening, a girl meets an older neighbour. Listen to how they greet each other.',
    explain: [
      'The greeting depends on the time: «Bonjour» in the day and «Bonsoir» in the evening.',
      'It also depends on the person. To a friend, ask «Comment vas-tu ?» To an adult, ask «Comment allez-vous ?»',
      'When you leave in the evening, wish them «Bonne soirée !»',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Bonsoir, Madame Akua !' },
        { who: 1, text: 'Bonsoir, ma fille. Tu vas bien ?' },
        { who: 0, text: 'Oui, très bien, merci.' },
        { who: 1, text: 'Bonne soirée !' },
      ],
    },
    artCaption: 'A girl greets an older neighbour in the evening.',
    words: [
      { term: 'Comment vas-tu ?', meaning: 'How are you? To a friend.' },
      {
        term: 'Comment allez-vous ?',
        meaning: 'How are you? Polite, to an adult or a group.',
      },
      { term: 'Bonne soirée !', meaning: 'Have a good evening!' },
      { term: 'Je vais bien.', meaning: 'I am well.' },
    ],
    examples: [
      {
        title: 'At the clinic',
        situation:
          'In the morning, you greet the nurse at the clinic. What do you say?',
        steps: [
          'It is daytime, so start with «Bonjour».',
          'She is an adult, so ask politely.',
        ],
        answer: '«Bonjour, Madame. Comment allez-vous ?»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying «Bonsoir» when you leave someone in the evening.',
        right: 'When leaving, say «Bonne soirée» or «Au revoir».',
      },
    ],
    realLife: [
      'Greeting neighbours.',
      'Greeting at the clinic or market.',
      'Evening visits.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Choose a place and a time of day.',
        'Act out the greeting that fits.',
        'Swap roles and change the place.',
      ],
    },
    quiz: [
      {
        prompt: 'How do you politely ask an adult how they are?',
        options: ['Comment allez-vous ?', 'Comment vas-tu ?', 'Ça va, toi ?'],
        answer: 0,
        why: 'That is the polite form for adults.',
      },
    ],
    sayIt: {
      phrase: 'Bonsoir, Madame. Comment allez-vous ?',
      meaning: 'Good evening, madam. How are you?',
    },
  },
  'french-02': {
    indicator: {
      code: 'B6.1.2.1.1',
      text: 'Écouter et comprendre le dialogue où des personnes se présentent.',
    },
    hook: 'A new teacher introduces himself to the class. What does he tell you about himself?',
    explain: [
      'A formal introduction often starts with «Je me présente», which means let me introduce myself.',
      'To say where you come from, use «Je viens de». To say where you live now, use «J’habite à».',
      'A teacher speaking to the class says «votre professeur», which means your teacher.',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Je me présente : M. Mensah.' },
        { who: 0, text: 'Je suis votre professeur.' },
        { who: 0, text: 'Je viens de Takoradi.' },
        { who: 1, text: 'Bienvenue, Monsieur !' },
      ],
    },
    artCaption: 'A new teacher introduces himself.',
    words: [
      { term: 'Je me présente', meaning: 'Let me introduce myself.' },
      { term: 'Je viens de', meaning: 'I come from.' },
      { term: 'votre', meaning: 'Your, to a group or politely.' },
      { term: 'Bienvenue !', meaning: 'Welcome!' },
    ],
    examples: [
      {
        title: 'Where is he from?',
        situation: 'In the dialogue, where does the teacher come from?',
        steps: ['Find «Je viens de».', 'Read the town after it.'],
        answer: 'Takoradi.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up where you come from and where you live.',
        right:
          '«Je viens de» is where you come from; «J’habite à» is where you live now.',
      },
    ],
    realLife: [
      'A new teacher’s first day.',
      'Visitors to school.',
      'Introducing yourself at an event.',
    ],
    tryIt: {
      need: 'The class',
      steps: [
        'Write four lines to introduce yourself formally.',
        'Include where you come from.',
        'Present yourself to the class.',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean I come from?',
        options: ['Je viens de', 'J’habite à', 'Je me présente'],
        answer: 0,
        why: 'Those words tell where you come from.',
      },
    ],
    sayIt: {
      phrase: 'Je me présente : je m’appelle Ama.',
      meaning: 'Let me introduce myself: my name is Ama.',
    },
  },
  'french-03': {
    indicator: {
      code: 'B6.1.3.1.1',
      text: 'Écouter et comprendre un texte dans lequel on présente quelqu’un.',
    },
    hook: 'Read about a new pupil. Can you answer questions about him in French?',
    explain: [
      'Questions about a person include «Qui est-ce ?», «Quel âge a-t-il ?» and «D’où vient-il ?»',
      'The answers are in the text: look for the name, the number before «ans», and the town after «vient de».',
      'Answer in a full sentence when you can, such as «Il vient de Bolgatanga».',
    ],
    art: {
      kind: 'scroll',
      title: 'Qui est-ce ?',
      lines: [
        'C’est Awini. Il a douze ans.',
        'Il vient de Bolgatanga.',
        'Il habite maintenant à Accra.',
        'Il adore les sciences.',
      ],
      plain: true,
    },
    artCaption: 'A text about a new pupil, Awini.',
    words: [
      { term: 'Qui est-ce ?', meaning: 'Who is it?' },
      { term: 'D’où vient-il ?', meaning: 'Where does he come from?' },
      { term: 'maintenant', meaning: 'Now.' },
      { term: 'les sciences', meaning: 'Science, the school subject.' },
    ],
    examples: [
      {
        title: 'Read and answer',
        situation: 'Where does Awini live now?',
        steps: ['Find «maintenant».', 'Read the town after «habite».'],
        answer: '«Il habite maintenant à Accra.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering where he comes from when asked where he lives.',
        right:
          'Read the question carefully: «vient de» and «habite à» are different.',
      },
    ],
    realLife: [
      'Welcoming new pupils.',
      'Reading profiles.',
      'Class newsletters.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a short text about a made-up new pupil.',
        'Write three questions about it.',
        'Swap with a partner and answer.',
      ],
    },
    quiz: [
      {
        prompt: 'Where does Awini come from?',
        options: ['de Bolgatanga', 'd’Accra', 'de Kumasi'],
        answer: 0,
        why: 'The text says he comes from Bolgatanga.',
      },
    ],
    sayIt: { phrase: 'D’où vient-il ?', meaning: 'Where does he come from?' },
  },
  'french-04': {
    indicator: {
      code: 'B6.1.4.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel sur les caractéristiques physiques, l’habillement et les comportements d’une personne.',
    },
    hook: 'We can describe how someone looks, what they wear and how they behave. Which matters most to you?',
    explain: [
      'Words for behaviour describe character, such as «gentil», «poli» and «travailleur».',
      'For a girl, most of these add letters: «gentille», «polie», «travailleuse».',
      'Put them together to describe someone fully: «Elle est grande, elle porte un uniforme et elle est très gentille».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Comment est ta nouvelle amie ?' },
        { who: 1, text: 'Elle est grande et gentille.' },
        { who: 1, text: 'Elle est toujours polie.' },
        { who: 0, text: 'Super !' },
      ],
    },
    artCaption: 'A friend describes a new classmate.',
    words: [
      { term: 'gentil', meaning: 'Kind. For a girl it is «gentille».' },
      { term: 'poli', meaning: 'Polite. For a girl it is «polie».' },
      {
        term: 'travailleur',
        meaning: 'Hard-working. For a girl it is «travailleuse».',
      },
      { term: 'toujours', meaning: 'Always.' },
    ],
    examples: [
      {
        title: 'Describe Kwame',
        situation:
          'Kwame is short, wears a blue shirt and always works hard. Describe him.',
        steps: [
          'Looks: «Il est petit».',
          'Clothes: «Il porte une chemise bleue».',
          'Behaviour: «Il est toujours travailleur».',
        ],
        answer: 'Three sentences: looks, clothes and behaviour.',
      },
    ],
    mistakes: [
      {
        wrong: 'Describing only how someone looks.',
        right: 'Describe how they behave too. It often matters more.',
      },
    ],
    realLife: [
      'Describing friends.',
      'Writing about a hero.',
      'School reports.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Describe a made-up person in three sentences.',
        'Include one behaviour word.',
        'Your partner draws them.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence says she is kind?',
        options: ['Elle est gentille.', 'Il est gentil.', 'Elle est grande.'],
        answer: 0,
        why: 'It uses she, and the word for kind with the girl’s ending.',
      },
    ],
    sayIt: {
      phrase: 'Elle est toujours polie.',
      meaning: 'She is always polite.',
    },
  },
  'french-05': {
    indicator: {
      code: 'B6.1.5.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel qui décrit une famille élargie.',
    },
    hook: 'In Ghana, family means grandparents, uncles, aunts and cousins too. Let us name the whole family in French.',
    explain: [
      'An extended family is called «la famille élargie».',
      'Your parents’ parents are «les grands-parents». Their brothers and sisters are your uncles and aunts, «l’oncle» and «la tante».',
      'Their children are your cousins. A girl cousin is «la cousine».',
    ],
    art: {
      kind: 'family',
      rows: [
        ['le grand-père', 'la grand-mère'],
        ['l’oncle', 'la mère', 'la tante'],
        ['le cousin', 'moi', 'la cousine'],
      ],
    },
    artCaption: 'An extended family, with French labels.',
    words: [
      { term: 'la famille élargie', meaning: 'The extended family.' },
      { term: 'l’oncle', meaning: 'Uncle.' },
      { term: 'la cousine', meaning: 'Cousin, a girl.' },
      { term: 'le neveu', meaning: 'Nephew.' },
      { term: 'la nièce', meaning: 'Niece.' },
    ],
    examples: [
      {
        title: 'Who is she?',
        situation: 'Your mother’s sister has a daughter. Who is she to you?',
        steps: [
          'Your mother’s sister is your aunt.',
          'Her daughter is your cousin, a girl.',
        ],
        answer: '«C’est ma cousine.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Using «cousin» for a girl.',
        right: 'A girl cousin is «ma cousine».',
      },
    ],
    realLife: [
      'Family gatherings.',
      'Funerals and weddings.',
      'Holidays with relatives.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw your extended family tree.',
        'Label it in French.',
        'Explain two relationships to a partner.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means niece?',
        options: ['la nièce', 'le neveu', 'la tante'],
        answer: 0,
        why: 'That is niece. The others are nephew and aunt.',
      },
    ],
    sayIt: {
      phrase: 'Voici ma famille élargie.',
      meaning: 'Here is my extended family.',
    },
  },
  'french-06': {
    indicator: {
      code: 'B6.1.5.4.1',
      text: 'Décrire les membres de sa famille élargie : les liens de parenté, les professions et les goûts et préférences.',
    },
    hook: 'Write about your uncle, aunt or cousin: who they are, what they do and what they like.',
    explain: [
      'First say how they are related: «Mon oncle Kwesi est le frère de ma mère».',
      'Then give the job, with no «un» or «une»: «Il est chauffeur».',
      'Finish with a like: «Il aime la musique».',
    ],
    art: {
      kind: 'scroll',
      title: 'Mon oncle Kwesi',
      lines: [
        'Il est le frère de ma mère.',
        'Il est chauffeur à Cape Coast.',
        'Il aime la musique.',
        'Il a deux enfants.',
      ],
      plain: true,
    },
    artCaption: 'A description of an uncle.',
    words: [
      { term: 'le frère de ma mère', meaning: 'My mother’s brother.' },
      { term: 'chauffeur', meaning: 'Driver.' },
      { term: 'la sœur de mon père', meaning: 'My father’s sister.' },
      { term: 'les enfants', meaning: 'Children.' },
    ],
    examples: [
      {
        title: 'An aunt',
        situation:
          'Your father’s sister, Auntie Esi, is a nurse who loves cooking. Describe her.',
        steps: [
          'Relation: «Ma tante Esi est la sœur de mon père».',
          'Job: «Elle est infirmière».',
          'Like: «Elle aime cuisiner».',
        ],
        answer: 'Relation, job and a like.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing «le frère de mon mère».',
        right: 'Mother is feminine: «le frère de ma mère».',
      },
    ],
    realLife: [
      'Talking about relatives.',
      'Writing to pen friends.',
      'Family history projects.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Choose a relative.',
        'Write four sentences: relation, job, likes and one more fact.',
        'Read it to the class.',
      ],
    },
    quiz: [
      {
        prompt: 'How do you say my mother’s brother?',
        options: [
          'le frère de ma mère',
          'la sœur de mon père',
          'le fils de ma tante',
        ],
        answer: 0,
        why: 'That one names your mother and her brother.',
      },
    ],
    sayIt: {
      phrase: 'Mon oncle est le frère de ma mère.',
      meaning: 'My uncle is my mother’s brother.',
    },
  },
  'french-07': {
    indicator: {
      code: 'B6.2.1.3.1',
      text: 'Lire et comprendre un texte, une vidéo, une publicité, sur les objets, les pièces, les animaux, les fruits.',
    },
    hook: 'An advert offers a house to rent. How many rooms does it have? Let us read it.',
    explain: [
      'Rooms in a house: the kitchen is «la cuisine», the living room is «le salon» and a bedroom is «la chambre».',
      'The bathroom is «la salle de bains».',
      'Adverts are short. Look for numbers and room words to understand them.',
    ],
    art: {
      kind: 'scroll',
      title: 'À louer !',
      lines: [
        'Belle maison à Koforidua',
        'trois chambres, un salon,',
        'une cuisine, un jardin',
        'avec des manguiers',
      ],
      plain: true,
    },
    artCaption: 'An advert for a house to rent.',
    words: [
      { term: 'la cuisine', meaning: 'Kitchen.' },
      { term: 'le salon', meaning: 'Living room.' },
      { term: 'la chambre', meaning: 'Bedroom.' },
      { term: 'le jardin', meaning: 'Garden.' },
      { term: 'À louer', meaning: 'For rent.' },
    ],
    examples: [
      {
        title: 'Count the rooms',
        situation: 'How many bedrooms does the house in the advert have?',
        steps: ['Find «chambres».', 'The number before it is «trois».'],
        answer: 'Three.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking «la chambre» means any room.',
        right: '«La chambre» is a bedroom. A room in general is «une pièce».',
      },
    ],
    realLife: ['House adverts.', 'Describing your home.', 'Reading signs.'],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Draw a plan of your dream house.',
        'Label the rooms in French.',
        'Write a short advert for it.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means kitchen?',
        options: ['la cuisine', 'la chambre', 'le salon'],
        answer: 0,
        why: 'That is the kitchen.',
      },
    ],
    sayIt: {
      phrase: 'Il y a trois chambres et une cuisine.',
      meaning: 'There are three bedrooms and a kitchen.',
    },
  },
  'french-08': {
    indicator: {
      code: 'B6.2.2.2.2',
      text: 'Raconter ses activités journalières de l’école.',
    },
    hook: 'What does your class do from morning to evening? Let us tell our school day in French.',
    explain: [
      'To talk about the class, use «nous», which means we: «nous arrivons», «nous balayons».',
      'Time words order the day: «le matin», «à midi», «l’après-midi» and «le soir».',
      'A full example is «Le matin, nous arrivons à l’école à sept heures».',
    ],
    art: {
      kind: 'scroll',
      title: 'Notre journée',
      lines: [
        'Le matin, nous balayons la cour.',
        'Ensuite, nous avons cours.',
        'À midi, nous mangeons.',
        'L’après-midi, nous faisons du sport.',
        'Le soir, je fais mes devoirs.',
      ],
      plain: true,
    },
    artCaption: 'A school day, from morning to evening.',
    words: [
      { term: 'nous arrivons', meaning: 'We arrive.' },
      { term: 'nous balayons', meaning: 'We sweep.' },
      { term: 'ensuite', meaning: 'Then, next.' },
      { term: 'l’après-midi', meaning: 'The afternoon.' },
      { term: 'les devoirs', meaning: 'Homework.' },
    ],
    examples: [
      {
        title: 'At midday',
        situation: 'At midday your class eats lunch. How do you say it?',
        steps: ['Start with «À midi».', 'Add «nous mangeons».'],
        answer: '«À midi, nous mangeons.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Using the I form when you mean the whole class.',
        right: 'Use «nous» for we: «nous mangeons».',
      },
    ],
    realLife: [
      'Telling parents about your day.',
      'School diaries.',
      'Pen friend letters.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write five sentences about your school day.',
        'Use «le matin», «à midi» and «le soir».',
        'Read them in order to a partner.',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean in the afternoon?',
        options: ['l’après-midi', 'le matin', 'le soir'],
        answer: 0,
        why: 'That is the afternoon.',
      },
    ],
    sayIt: {
      phrase: 'Le matin, nous arrivons à l’école.',
      meaning: 'In the morning, we arrive at school.',
    },
  },
  'french-09': {
    indicator: {
      code: 'B6.3.1.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel sur les comportements qu’on aime chez les gens.',
    },
    hook: 'What do you like in a friend? Honesty? Kindness? Let us talk about good behaviour in French.',
    explain: [
      'To say what you like in people, use «J’aime les gens» and a describing word: «J’aime les gens honnêtes».',
      'Good qualities include «honnête», «généreux» and «patient».',
      'To say what you do not like, use «Je n’aime pas les gens méchants».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Qu’est-ce que tu aimes chez un ami ?' },
        { who: 1, text: 'J’aime les gens honnêtes.' },
        { who: 0, text: 'Moi, j’aime les gens généreux.' },
      ],
    },
    artCaption: 'Two friends talk about good qualities.',
    words: [
      { term: 'honnête', meaning: 'Honest.' },
      { term: 'généreux', meaning: 'Generous.' },
      { term: 'patient', meaning: 'Patient, the same as in English.' },
      { term: 'méchant', meaning: 'Unkind, or mean.' },
      { term: 'les gens', meaning: 'People.' },
    ],
    examples: [
      {
        title: 'A good friend',
        situation: 'Your friend always shares her food. What quality is that?',
        steps: [
          'Sharing shows generosity.',
          'For a girl, the word becomes «généreuse».',
        ],
        answer: '«Elle est généreuse.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Using a describing word without «les gens».',
        right: 'Say «J’aime les gens honnêtes».',
      },
    ],
    realLife: ['Choosing friends.', 'Class values.', 'Stories about heroes.'],
    tryIt: {
      need: 'A partner',
      steps: [
        'Name two qualities you like in people.',
        'Name one you do not like.',
        'Compare with your partner.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means honest?',
        options: ['honnête', 'méchant', 'généreux'],
        answer: 0,
        why: 'That is the word for honest.',
      },
    ],
    sayIt: {
      phrase: 'J’aime les gens honnêtes.',
      meaning: 'I like honest people.',
    },
  },
  'french-10': {
    indicator: {
      code: 'B6.4.1.1.1',
      text: 'Écouter/Regarder et comprendre un document audio-visuel sur les nombres.',
    },
    hook: 'French counts to one hundred in a surprising way. Seventy is sixty and ten! Let us hear it.',
    explain: [
      'Sixty is «soixante». Seventy is sixty plus ten: «soixante-dix».',
      'Eighty is four twenties: «quatre-vingts». Ninety is four twenties and ten: «quatre-vingt-dix».',
      'One hundred is «cent».',
    ],
    art: {
      kind: 'scroll',
      title: 'De soixante à cent',
      lines: [
        '60 soixante',
        '70 soixante-dix',
        '80 quatre-vingts',
        '90 quatre-vingt-dix',
        '100 cent',
      ],
      plain: true,
    },
    artCaption: 'The tens from sixty to one hundred.',
    words: [
      { term: 'soixante-dix', meaning: 'Seventy, sixty and ten.' },
      { term: 'quatre-vingts', meaning: 'Eighty, four twenties.' },
      { term: 'quatre-vingt-dix', meaning: 'Ninety, four twenties and ten.' },
      { term: 'cent', meaning: 'One hundred.' },
    ],
    examples: [
      {
        title: 'Seventy-five',
        situation: 'How do you say seventy-five?',
        steps: [
          'Seventy is sixty and ten.',
          'So seventy-five is sixty and fifteen.',
        ],
        answer: '«soixante-quinze»',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying seven-ten for seventy.',
        right: 'Say «soixante-dix».',
      },
    ],
    realLife: ['Prices.', 'Phone numbers, read in pairs.', 'Scores in games.'],
    tryIt: {
      need: 'A partner',
      steps: [
        'Say a number from sixty to one hundred.',
        'Your partner writes it in figures.',
        'Swap and check.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word is eighty?',
        options: ['quatre-vingts', 'soixante-dix', 'huit'],
        answer: 0,
        why: 'Eighty is four twenties.',
      },
    ],
    sayIt: {
      phrase: 'soixante-dix, quatre-vingts, quatre-vingt-dix, cent',
      meaning: 'Seventy, eighty, ninety, one hundred.',
    },
  },
  'french-11': {
    indicator: {
      code: 'B6.4.1.3.1',
      text: 'Lire et comprendre un inventaire.',
    },
    hook: 'The class prefect counts the supplies in the cupboard. Can you read the list and find the totals?',
    explain: [
      'An inventory lists things with how many of each.',
      'To ask how many there are, say «Il y a combien de… ?» The answer is «Il y a» and the number.',
      'To find a total, add: thirteen cedis and twelve cedis make twenty-five, «vingt-cinq cedis».',
    ],
    art: {
      kind: 'scroll',
      title: 'Inventaire',
      lines: ['12 crayons', '20 cahiers', '5 règles', '3 boîtes de craie'],
      plain: true,
    },
    artCaption: 'An inventory of class supplies.',
    words: [
      {
        term: 'un inventaire',
        meaning: 'An inventory, a list of how many of each thing.',
      },
      { term: 'Il y a combien de… ?', meaning: 'How many… are there?' },
      { term: 'en tout', meaning: 'In all, altogether.' },
      { term: 'une boîte', meaning: 'A box.' },
    ],
    examples: [
      {
        title: 'Packs of books',
        situation:
          'There are four packs of five exercise books. How many exercise books are there in all?',
        steps: ['Four packs of five make twenty.'],
        answer: '«Il y a vingt cahiers en tout.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Multiplying books by books.',
        right: 'Multiply the number of packs by the books in each pack.',
      },
    ],
    realLife: ['Stock lists in shops.', 'Class supplies.', 'Shopping totals.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Count five kinds of things in your classroom.',
        'Write an inventory in French.',
        'Ask a partner «Il y a combien de… ?»',
      ],
    },
    quiz: [
      {
        prompt: 'Thirteen cedis plus twelve cedis. Which is the total?',
        options: ['vingt-cinq cedis', 'vingt-trois cedis', 'quinze cedis'],
        answer: 0,
        why: 'Thirteen and twelve make twenty-five.',
      },
    ],
    sayIt: {
      phrase: 'Il y a combien de crayons ?',
      meaning: 'How many pencils are there?',
    },
  },
  'french-12': {
    indicator: {
      code: 'B6.4.2.2.1',
      text: 'Poser et répondre à des questions sur ce que l’on fait à certaines heures de la journée.',
    },
    hook: 'What do you do at six in the morning? And at midday? Let us ask and answer in French.',
    explain: [
      'To ask, say «Que fais-tu à six heures du matin ?»',
      'Morning actions often use «me»: I get up is «je me lève», and I wash is «je me lave».',
      'To say what you usually do, start with «D’habitude».',
    ],
    art: {
      kind: 'dialogue',
      lines: [
        { who: 0, text: 'Que fais-tu à six heures ?' },
        { who: 1, text: 'Je me lève et je me lave.' },
        { who: 0, text: 'Et à midi ?' },
        { who: 1, text: 'À midi, je déjeune.' },
      ],
    },
    artCaption: 'Two friends talk about their daily routines.',
    words: [
      { term: 'je me lève', meaning: 'I get up.' },
      { term: 'je me lave', meaning: 'I wash.' },
      { term: 'je m’habille', meaning: 'I get dressed.' },
      { term: 'je déjeune', meaning: 'I have lunch.' },
      { term: 'd’habitude', meaning: 'Usually.' },
    ],
    examples: [
      {
        title: 'Getting ready',
        situation: 'At half past six you get dressed. How do you say it?',
        steps: [
          'Half past six is «six heures et demie».',
          'I get dressed is «je m’habille».',
        ],
        answer: '«À six heures et demie, je m’habille.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving out «me» in «je me lève».',
        right: 'Keep it: «je me lève», «je me lave».',
      },
    ],
    realLife: [
      'Morning routines.',
      'Planning the day.',
      'Talking with friends.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Ask about three times of the day.',
        'Answer with what you usually do.',
        'Swap.',
      ],
    },
    quiz: [
      {
        prompt: 'Which words mean I get up?',
        options: ['je me lève', 'je me lave', 'je m’habille'],
        answer: 0,
        why: 'That one means I get up.',
      },
    ],
    sayIt: {
      phrase: 'D’habitude, je me lève à six heures.',
      meaning: 'Usually, I get up at six.',
    },
  },
  'french-13': {
    indicator: {
      code: 'B6.4.2.4.1',
      text: 'Écrire son agenda pour la journée ou la semaine en indiquant les heures des activités.',
    },
    hook: 'A diary of appointments helps you remember what to do and when. Let us write one in French.',
    explain: [
      'An agenda lists the day, then each time and activity.',
      'Times are often written with the letter h, short for «heures».',
      'Appointments use «rendez-vous avec», such as «rendez-vous avec l’infirmière».',
    ],
    art: {
      kind: 'scroll',
      title: 'Mon agenda : lundi',
      lines: [
        '7 h : arrivée à l’école',
        '10 h : rendez-vous avec l’infirmière',
        '12 h 30 : déjeuner',
        '15 h : club de français',
      ],
      plain: true,
    },
    artCaption: 'A diary for Monday.',
    words: [
      { term: 'l’agenda', meaning: 'Diary, or planner.' },
      { term: 'rendez-vous avec', meaning: 'Appointment with.' },
      { term: 'l’infirmière', meaning: 'The nurse, a woman.' },
      { term: 'le club', meaning: 'Club.' },
    ],
    examples: [
      {
        title: 'Read the agenda',
        situation: 'At what time is the appointment with the nurse?',
        steps: [
          'Find «rendez-vous avec l’infirmière».',
          'Read the time in front of it.',
        ],
        answer: 'At ten o’clock.',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing activities with no times.',
        right: 'Put the time first, then the activity.',
      },
    ],
    realLife: [
      'School timetables.',
      'Doctor’s appointments.',
      'Planning the week.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Write your agenda for tomorrow.',
        'Include four times and activities.',
        'Read it to a partner.',
      ],
    },
    quiz: [
      {
        prompt: 'In the agenda, what happens at half past twelve?',
        options: ['déjeuner', 'club de français', 'arrivée à l’école'],
        answer: 0,
        why: 'Lunch is at half past twelve.',
      },
    ],
    sayIt: {
      phrase: 'J’ai rendez-vous avec le directeur.',
      meaning: 'I have an appointment with the head teacher.',
    },
  },
  'french-14': {
    indicator: {
      code: 'B6.4.3.3.1',
      text: 'Lire et comprendre un texte simple sur les activités quotidiennes de quelqu’un.',
    },
    hook: 'A trader’s day starts before sunrise. Read about her day and answer questions.',
    explain: [
      'Texts about daily life use the he or she form: «elle se lève», «elle va», «elle vend».',
      'Time words tell the order: «d’abord», «ensuite», «enfin».',
      'To understand, find who, what and when in each sentence.',
    ],
    art: {
      kind: 'scroll',
      title: 'Madame Akosua',
      lines: [
        'Elle est commerçante.',
        'Elle se lève à cinq heures.',
        'Ensuite, elle va au marché.',
        'Elle vend des tomates.',
        'Le soir, elle rentre.',
      ],
      plain: true,
    },
    artCaption: 'The day of a market trader.',
    words: [
      { term: 'elle vend', meaning: 'She sells.' },
      { term: 'd’abord', meaning: 'First.' },
      { term: 'enfin', meaning: 'Finally.' },
      { term: 'elle rentre', meaning: 'She goes home.' },
      { term: 'quotidien', meaning: 'Daily, every day.' },
    ],
    examples: [
      {
        title: 'What does she sell?',
        situation: 'Read the text. What does Madame Akosua sell?',
        steps: ['Find «vend».', 'Read the words after it.'],
        answer: 'Tomatoes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Reading the words but not the order.',
        right: 'Use «d’abord», «ensuite» and «enfin» to follow the order.',
      },
    ],
    realLife: [
      'Traders at the market.',
      'People’s jobs in the community.',
      'Stories in books.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Choose a job: driver, nurse or teacher.',
        'Write five sentences about their day.',
        'Ask a partner two questions about it.',
      ],
    },
    quiz: [
      {
        prompt: 'At what time does Madame Akosua get up?',
        options: ['à cinq heures', 'à six heures', 'le soir'],
        answer: 0,
        why: 'The text says she gets up at five.',
      },
    ],
    sayIt: {
      phrase: 'Elle se lève à cinq heures.',
      meaning: 'She gets up at five o’clock.',
    },
  },
  'french-15': {
    indicator: {
      code: 'B6.4.4.4.1',
      text: 'Écrire une carte postale à un(e) correspondant(e) pour lui indiquer des dates d’évènements importants dans votre pays.',
    },
    hook: 'Your pen friend wants to know about Ghana. Tell them about important dates in a postcard.',
    explain: [
      'To give a date, put «le» before the number: «le 6 mars».',
      'The first of the month is «le premier», written «le 1er».',
      'Then say what happens: «Le 6 mars, c’est la fête de l’Indépendance du Ghana».',
    ],
    art: {
      kind: 'scroll',
      title: 'Cher Lucas,',
      lines: [
        'Au Ghana, le 6 mars,',
        'c’est la fête de l’Indépendance.',
        'Il y a des défilés !',
        'Le 25 décembre, c’est Noël.',
        'Bises, Abena',
      ],
      plain: true,
    },
    artCaption: 'A postcard about important dates in Ghana.',
    words: [
      { term: 'la fête de l’Indépendance', meaning: 'Independence Day.' },
      { term: 'le défilé', meaning: 'Parade, or march past.' },
      { term: 'le premier mai', meaning: 'The first of May.' },
      { term: 'Bises', meaning: 'Love, to end a friendly card.' },
    ],
    examples: [
      {
        title: 'Workers’ Day',
        situation:
          'Tell your pen friend that the first of May is Workers’ Day.',
        steps: [
          'The first is «le 1er».',
          'Workers’ Day is «la fête du Travail».',
        ],
        answer: '«Le 1er mai, c’est la fête du Travail.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing the month with a capital letter.',
        right: 'Months take a small letter: «le 6 mars».',
      },
    ],
    realLife: [
      'Independence Day parades.',
      'Pen friends abroad.',
      'Calendars.',
    ],
    tryIt: {
      need: 'A card',
      steps: [
        'Write to a made-up pen friend.',
        'Give two important dates in Ghana.',
        'Say what happens on each.',
      ],
    },
    safety: [
      'Use made-up addresses. Never send real addresses to people you have not met.',
    ],
    quiz: [
      {
        prompt: 'How do you write the sixth of March?',
        options: ['le 6 mars', 'le mars 6', 'le 6 Mars'],
        answer: 0,
        why: 'The number comes first, and the month has a small letter.',
      },
    ],
    sayIt: {
      phrase: 'Le 6 mars, c’est la fête de l’Indépendance.',
      meaning: 'The sixth of March is Independence Day.',
    },
  },
  'french-16': {
    indicator: {
      code: 'B6.4.5.3.1',
      text: 'Lire et comprendre de petites conversations téléphoniques entre deux personnes.',
    },
    hook: 'Read a short phone call. Who is calling, and what do they want to know?',
    explain: [
      'A phone call starts with «Allô». The caller often says who they want: «C’est la pharmacie ?»',
      'Then comes the question, often with «Je voudrais savoir», which means I would like to know.',
      'Look for the answer to the question, and how the call ends.',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Allô, c’est la pharmacie ?' },
        { who: 1, text: 'Oui, bonjour !' },
        { who: 0, text: 'Vous fermez à quelle heure ?' },
        { who: 1, text: 'À vingt heures.' },
      ],
    },
    artCaption: 'A short phone call to a pharmacy.',
    words: [
      { term: 'Je voudrais savoir', meaning: 'I would like to know.' },
      { term: 'Vous fermez', meaning: 'You close, to a shop or a group.' },
      {
        term: 'vingt heures',
        meaning: 'Eight in the evening, on a twenty-four hour clock.',
      },
      { term: 'Merci, au revoir !', meaning: 'Thank you, goodbye!' },
    ],
    examples: [
      {
        title: 'When does it close?',
        situation: 'In the call, when does the pharmacy close?',
        steps: [
          'Find the answer after the question.',
          '«Vingt heures» is twenty hundred hours.',
        ],
        answer: 'At eight in the evening.',
      },
    ],
    mistakes: [
      {
        wrong:
          'Thinking twenty hundred hours is twenty o’clock in the morning.',
        right:
          'On the twenty-four hour clock, twenty hundred hours is eight in the evening.',
      },
    ],
    realLife: [
      'Calling a shop.',
      'Asking for information.',
      'Bus station times.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Write a four-line phone call to a shop.',
        'Act it out.',
        'The class says what the caller wanted.',
      ],
    },
    safety: [
      'Only call numbers your family knows, with a grown-up’s permission.',
    ],
    quiz: [
      {
        prompt: 'Who does the caller want to speak to?',
        options: ['la pharmacie', 'la banque', 'l’école'],
        answer: 0,
        why: 'The caller asks if it is the pharmacy.',
      },
    ],
    sayIt: {
      phrase: 'Je voudrais savoir à quelle heure vous fermez.',
      meaning: 'I would like to know what time you close.',
    },
  },
  'french-17': {
    indicator: {
      code: 'B6.4.6.3.1',
      text: 'Lire et comprendre une lettre/une carte d’invitation.',
    },
    hook: 'You have received an invitation card. Who is inviting you, to what, and when?',
    explain: [
      'An invitation tells you what the event is, the date, the time and the place.',
      'It may say «chez moi», which means at my home.',
      'It may ask you to reply: «Réponds avant jeudi» means reply before Thursday.',
    ],
    art: {
      kind: 'scroll',
      title: 'Invitation',
      lines: [
        'Kofi fête ses douze ans !',
        'Samedi 14 juin,',
        'à quinze heures, chez lui.',
        'Réponds avant jeudi.',
      ],
      plain: true,
    },
    artCaption: 'An invitation to a birthday party.',
    words: [
      { term: 'fête ses douze ans', meaning: 'Celebrates turning twelve.' },
      { term: 'chez lui', meaning: 'At his home.' },
      { term: 'Réponds avant jeudi.', meaning: 'Reply before Thursday.' },
      { term: 'la carte d’invitation', meaning: 'Invitation card.' },
    ],
    examples: [
      {
        title: 'Find the details',
        situation: 'Read the invitation. When is the party?',
        steps: [
          'Find the day: «samedi 14 juin».',
          'Find the time: «quinze heures».',
        ],
        answer: 'Saturday the fourteenth of June, at three in the afternoon.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to reply.',
        right: 'Read the reply date and answer in time.',
      },
    ],
    realLife: [
      'Birthday parties.',
      'Weddings and naming ceremonies.',
      'School events.',
    ],
    tryIt: {
      need: 'Card and coloured pencils',
      steps: [
        'Make an invitation card in French.',
        'Include the event, date, time and place.',
        'Swap and write a reply.',
      ],
    },
    quiz: [
      {
        prompt: 'Where is the party?',
        options: ['chez lui', 'à l’école', 'au marché'],
        answer: 0,
        why: 'The card says at his home.',
      },
    ],
    sayIt: {
      phrase: 'Merci pour l’invitation !',
      meaning: 'Thank you for the invitation!',
    },
  },
  'french-18': {
    indicator: {
      code: 'B6.4.7.2.2',
      text: 'Dire la profession ou le métier que l’on veut exercer dans l’avenir.',
    },
    hook: 'What job would you like to do, and why? Let us give reasons in French.',
    explain: [
      'To say what you would like to be, use «J’aimerais être», which is softer than «Je veux être».',
      'Add a reason with «parce que»: «J’aimerais être banquier parce que j’aime les chiffres».',
      'More jobs include «jardinier», «journaliste», «avocat» and «informaticien».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Tu aimerais faire quel métier ?' },
        { who: 1, text: 'J’aimerais être journaliste.' },
        { who: 1, text: 'J’aime écrire !' },
        { who: 0, text: 'Moi, je veux être avocat.' },
      ],
    },
    artCaption: 'Two friends talk about future jobs.',
    words: [
      { term: 'J’aimerais être', meaning: 'I would like to be.' },
      { term: 'le métier', meaning: 'Job, or trade.' },
      { term: 'banquier', meaning: 'Banker.' },
      { term: 'avocat', meaning: 'Lawyer.' },
      { term: 'informaticien', meaning: 'Computer specialist.' },
    ],
    examples: [
      {
        title: 'Give a reason',
        situation:
          'You would like to be a gardener because you love plants. What do you say?',
        steps: [
          'Start with «J’aimerais être jardinier».',
          'Add «parce que j’aime les plantes».',
        ],
        answer: 'A job and a reason.',
      },
    ],
    mistakes: [
      {
        wrong: 'Naming a job without a reason.',
        right: 'Add «parce que» and your reason.',
      },
    ],
    realLife: [
      'Careers days.',
      'Talking with family about the future.',
      'Visiting workplaces.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the job you would like.',
        'Give two reasons with «parce que».',
        'Share with the class.',
      ],
    },
    quiz: [
      {
        prompt: 'Which sentence means I would like to be a lawyer?',
        options: [
          'J’aimerais être avocat.',
          'Je suis avocat.',
          'J’aime les avocats.',
        ],
        answer: 0,
        why: 'It says I would like to be, with the job.',
      },
    ],
    sayIt: {
      phrase: 'J’aimerais être médecin parce que j’aime aider.',
      meaning: 'I would like to be a doctor because I like helping.',
    },
  },
  'french-19': {
    indicator: {
      code: 'B6.4.8.2.2',
      text: 'Indiquer à quelqu’un la position d’un objet par rapport à une personne.',
    },
    hook: 'Where is my bag? Under the table? Let us say where things are in French.',
    explain: [
      'On is «sur» and under is «sous». In is «dans».',
      'In front of is «devant» and behind is «derrière». Next to is «à côté de».',
      'Use «se trouve» or «est»: «Le sac est sous la table».',
    ],
    art: {
      kind: 'dialogue',
      setting: 'floor',
      lines: [
        { who: 0, text: 'Où est mon sac ?' },
        { who: 1, text: 'Il est sous la table.' },
        { who: 0, text: 'Et mon livre ?' },
        { who: 1, text: 'Il est sur la chaise.' },
      ],
    },
    artCaption: 'Two friends look for their things.',
    words: [
      { term: 'sur', meaning: 'On.' },
      { term: 'sous', meaning: 'Under.' },
      { term: 'dans', meaning: 'In, inside.' },
      { term: 'derrière', meaning: 'Behind.' },
      { term: 'à côté de', meaning: 'Next to.' },
    ],
    examples: [
      {
        title: 'Behind the bus',
        situation: 'Ama is standing behind the bus. How do you say it?',
        steps: [
          'Behind is «derrière».',
          'Use «se trouve» for where someone is.',
        ],
        answer: '«Ama se trouve derrière le bus.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up «sur» and «sous».',
        right: '«Sur» is on top; «sous» is underneath.',
      },
    ],
    realLife: ['Finding lost things.', 'Tidying up.', 'Hide and seek.'],
    tryIt: {
      need: 'A partner and a small object',
      steps: [
        'Hide the object somewhere in the room.',
        'Your partner asks «Où est… ?»',
        'Answer with a position word.',
      ],
    },
    quiz: [
      {
        prompt: 'Which word means under?',
        options: ['sous', 'sur', 'dans'],
        answer: 0,
        why: 'That word means under.',
      },
    ],
    sayIt: {
      phrase: 'Le sac est sous la table.',
      meaning: 'The bag is under the table.',
    },
  },
  'french-20': {
    indicator: { code: 'B6.4.9.4.1', text: 'Écrire pour donner des ordres.' },
    hook: 'A recipe is a list of orders. Let us write one for a fruit salad in French.',
    explain: [
      'Recipes use the group order form, ending in «-ez»: «Lavez», «Coupez», «Mélangez».',
      'Put the steps in order, one order per line.',
      'Finish with «Bon appétit !»',
    ],
    art: {
      kind: 'scroll',
      title: 'Salade de fruits',
      lines: [
        'Lavez les fruits.',
        'Coupez les mangues et les bananes.',
        'Mettez-les dans un bol.',
        'Mélangez bien.',
        'Bon appétit !',
      ],
      plain: true,
    },
    artCaption: 'A recipe written as orders.',
    words: [
      { term: 'Lavez', meaning: 'Wash.' },
      { term: 'Coupez', meaning: 'Cut.' },
      { term: 'Mettez', meaning: 'Put.' },
      { term: 'Mélangez', meaning: 'Mix.' },
      { term: 'Bon appétit !', meaning: 'Enjoy your meal!' },
    ],
    examples: [
      {
        title: 'The first step',
        situation: 'Before cutting fruit, what must you do? Write the order.',
        steps: ['Fruit must be washed first.'],
        answer: '«Lavez les fruits.»',
      },
    ],
    mistakes: [
      {
        wrong: 'Writing the steps in the wrong order.',
        right: 'Number the steps, then write each order.',
      },
    ],
    realLife: ['Recipes.', 'Instructions for games.', 'Signs and rules.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Choose a simple snack.',
        'Write four orders to make it.',
        'Read them to a partner, who mimes each step.',
      ],
    },
    safety: ['Use a knife only with a grown-up helping you.'],
    quiz: [
      {
        prompt: 'Which order means mix?',
        options: ['Mélangez', 'Coupez', 'Lavez'],
        answer: 0,
        why: 'That is the order to mix.',
      },
    ],
    sayIt: {
      phrase: 'Lavez les fruits, s’il vous plaît.',
      meaning: 'Wash the fruit, please.',
    },
  },
}
