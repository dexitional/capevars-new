import type { CourseGuides } from './types'

// Basic 5 Religious and Moral Education, written for this course and scoped
// to the NaCCA RME Curriculum for Primary Schools (2019), for nine- and
// ten-year-olds. Notes:
// - The three major religions in Ghana are taught side by side, each in its
//   own terms, to build understanding, not to preach.
// - No picture shows God, a prophet or a religious leader; sacred texts are
//   named, not quoted.
// - The curriculum suggests grouping pupils by colour and mass to show
//   difference. The guides use talents and fingerprints instead, and never
//   compare children's bodies.
// - Lessons on discipline say it should never hurt, and tell children to
//   speak to a trusted adult if someone harms them.

export const guides: CourseGuides = {
  'rme-01': {
    indicator: {
      code: 'B5.1.1.1.1',
      text: 'Explain how special each individual is.',
    },
    hook: 'No one else in the world has your fingerprints. What else makes you one of a kind?',
    explain: [
      'Every person is unique. Even twins have different fingerprints.',
      'People differ in looks, voices, talents and personalities. Some are good at drawing, others at sport, maths or helping.',
      'The religions teach that God made each person on purpose, so everyone deserves respect.',
    ],
    art: {
      kind: 'scroll',
      title: 'Ways we are unique',
      lines: [
        'Fingerprints',
        'Voice',
        'Talents',
        'Personality',
        'Dreams for the future',
      ],
    },
    artCaption: 'No two people are the same.',
    words: [
      { term: 'Unique', meaning: 'The only one of its kind.' },
      { term: 'Talent', meaning: 'Something a person does especially well.' },
      {
        term: 'Personality',
        meaning: 'The way a person thinks, feels and behaves.',
      },
    ],
    examples: [
      {
        title: 'Fingerprint check',
        situation:
          'Press your thumb on an ink pad, then on paper. Compare with a friend’s. What do you see?',
        steps: ['Look at the lines and swirls.', 'They are different.'],
        answer: 'Every fingerprint is unique.',
      },
    ],
    mistakes: [
      {
        wrong: 'Teasing people for being different.',
        right: 'Our differences make the class richer.',
      },
    ],
    realLife: [
      'Fingerprints on Ghana Cards.',
      'Different talents in a school team.',
      'Friends with different hobbies.',
    ],
    tryIt: {
      need: 'Paper and an ink pad',
      steps: [
        'Make your thumbprint.',
        'Write three things that make you unique.',
        'Share one with a partner.',
      ],
    },
  },
  'rme-02': {
    indicator: {
      code: 'B5.1.1.1.2',
      text: 'State the qualities of God that humankind should demonstrate.',
    },
    hook: 'The religions describe God as loving, patient and merciful. Can people show these qualities too?',
    explain: [
      'Christianity, Islam and African Traditional Religion describe God as loving, merciful, patient, kind and just.',
      'They teach that people should show these qualities in how they treat others.',
      'We can use our gifts to serve others, protect the environment, live in harmony and help our country develop.',
    ],
    art: {
      kind: 'scroll',
      title: 'Qualities to show',
      lines: ['Love', 'Patience', 'Mercy', 'Kindness', 'Honesty'],
    },
    artCaption: 'Good qualities we can practise.',
    words: [
      { term: 'Mercy', meaning: 'Kindness to someone who has done wrong.' },
      {
        term: 'Patience',
        meaning: 'Staying calm while you wait or face difficulty.',
      },
      {
        term: 'Accountability',
        meaning: 'Accepting responsibility for what you do.',
      },
    ],
    examples: [
      {
        title: 'Showing mercy',
        situation:
          'A classmate breaks your pencil by accident and says sorry. How can you show mercy?',
        steps: ['Accept the apology.', 'Stay friends.'],
        answer: 'Forgive them.',
      },
    ],
    mistakes: [
      {
        wrong: 'Being kind only to friends.',
        right: 'Show kindness to everyone.',
      },
    ],
    realLife: [
      'Forgiving a sibling.',
      'Being patient in a queue.',
      'Telling the truth.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Choose one quality.',
        'Practise it each day this week.',
        'Write what happened.',
      ],
    },
  },
  'rme-03': {
    indicator: {
      code: 'B5.1.1.1.3',
      text: 'Mention why individuals should maintain their God-given gifts of form and colour.',
    },
    hook: 'Your skin, your face and your body are part of who you are. Why should you look after them as they are?',
    explain: [
      'Christians teach that the body is a temple of God. Muslims teach that the body is a trust from Allah.',
      'In African Traditional Religion, each person is made by God with a purpose. All three teach that we should respect our bodies.',
      'Bleaching creams can burn and damage the skin. Be proud of your natural skin colour.',
    ],
    art: {
      kind: 'scroll',
      title: 'Respect your body',
      lines: [
        'Be proud of your skin',
        'Never use bleaching creams',
        'Eat well and keep clean',
        'Respect how others look',
        'Every body is valuable',
      ],
    },
    artCaption: 'Every body is valuable.',
    words: [
      { term: 'Bleaching', meaning: 'Using chemicals to make skin lighter.' },
      { term: 'Trust', meaning: 'Something given to you to look after.' },
      { term: 'Self-respect', meaning: 'Valuing yourself.' },
    ],
    examples: [
      {
        title: 'A harmful advert',
        situation:
          'An advert says a cream will make your skin lighter and more beautiful. What should you think?',
        steps: [
          'Bleaching creams can harm the skin.',
          'Every skin colour is beautiful.',
        ],
        answer: 'Do not believe it, and do not use it.',
      },
    ],
    mistakes: [
      {
        wrong: 'Making fun of someone’s looks or disability.',
        right: 'Every person is valuable, just as they are.',
      },
    ],
    realLife: [
      'Washing and caring for your skin.',
      'Eating healthy food.',
      'Speaking kindly about others’ looks.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write three things you like about yourself.',
        'Write one way to care for your body.',
        'Keep it somewhere you can see it.',
      ],
    },
    safety: [
      'Never put creams or chemicals on your skin unless a parent or health worker says they are safe.',
    ],
  },
  'rme-04': {
    indicator: {
      code: 'B5.1.2.1.1',
      text: 'Discuss the effects of human activities on the environment.',
    },
    hook: 'When forests disappear and rivers turn brown, the weather and our lives change too. How?',
    explain: [
      'Galamsey, cutting down too many trees, polluting rivers and burning rubbish all harm the environment.',
      'These activities help cause climate change: more heat, floods, storms and less reliable rain.',
      'When rain fails, crops die. That can lead to drought, hunger and famine.',
    ],
    art: {
      kind: 'scroll',
      title: 'Effects on the environment',
      lines: [
        'Hotter days',
        'Floods and storms',
        'Rain that does not come',
        'Drought and famine',
        'Dirty water',
      ],
    },
    artCaption: 'What happens when we harm the environment.',
    words: [
      {
        term: 'Deforestation',
        meaning: 'Cutting down forests without replanting.',
      },
      {
        term: 'Climate change',
        meaning: 'Long-term change in the world’s weather.',
      },
      { term: 'Famine', meaning: 'When a whole area has too little food.' },
    ],
    examples: [
      {
        title: 'Cause and effect',
        situation:
          'Many trees on a hillside are cut down. Heavy rain falls. What happens?',
        steps: [
          'No roots hold the soil.',
          'The rain washes soil down the hill.',
        ],
        answer: 'Erosion, and maybe floods below.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking one person’s rubbish does not matter.',
        right: 'Small actions add up, good or bad.',
      },
    ],
    realLife: [
      'Floods after heavy rain in cities.',
      'Brown rivers near mining sites.',
      'Hotter dry seasons.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Pick one harmful activity.',
        'Draw it and its effects as a chain of arrows.',
        'Explain your chain to the class.',
      ],
    },
  },
  'rme-05': {
    indicator: {
      code: 'B5.1.2.1.2',
      text: 'Demonstrate ways to care for the environment.',
    },
    hook: 'You can help the environment today. What can your class do?',
    explain: [
      'Plant trees, dispose of waste properly, support legal mining, join clean-ups and avoid pollution.',
      'Clear choked gutters and plant grass to stop erosion.',
      'A healthy environment helps bring enough rain and keeps temperatures balanced.',
    ],
    art: { kind: 'nature', label: 'A clean, green environment' },
    artCaption: 'Trees, clean water and healthy land.',
    words: [
      { term: 'Waste disposal', meaning: 'Getting rid of rubbish safely.' },
      { term: 'Recycle', meaning: 'Use old things to make new ones.' },
      { term: 'Climate', meaning: 'The usual weather of a place.' },
    ],
    examples: [
      {
        title: 'Plastic bottles',
        situation:
          'Your class has a pile of used plastic bottles. What could you do?',
        steps: [
          'Do not burn them.',
          'Collect them for recycling, or reuse them as plant pots.',
        ],
        answer: 'Recycle or reuse them.',
      },
    ],
    mistakes: [
      {
        wrong: 'Burning plastic rubbish.',
        right: 'Burning plastic makes harmful smoke. Recycle it instead.',
      },
    ],
    realLife: [
      'School clean-up days.',
      'Tree-planting projects.',
      'Recycling centres.',
    ],
    tryIt: {
      need: 'Your class and a teacher',
      steps: [
        'Plan a clean-up of one area.',
        'Do it together.',
        'Write what you learned.',
      ],
    },
  },
  'rme-06': {
    indicator: {
      code: 'B5.2.1.1.1',
      text: 'Discuss the moral importance of worship.',
    },
    hook: 'Worship is not only about prayer. How can it make people better?',
    explain: [
      'Worship includes prayer, songs, charity and sharing one’s faith.',
      'Christianity, Islam and African Traditional Religion teach that people depend on God, so worship shows thanks and humility.',
      'Worship teaches discipline, respect, generosity and care for others.',
    ],
    art: { kind: 'worship', label: 'Worship in the three religions' },
    artCaption: 'Worship shapes how people live.',
    words: [
      { term: 'Humility', meaning: 'Not thinking you are better than others.' },
      { term: 'Generosity', meaning: 'Being willing to give.' },
      { term: 'Depend', meaning: 'Need someone for help or support.' },
    ],
    examples: [
      {
        title: 'Charity',
        situation:
          'Christians give offerings and Muslims give Zakat. What moral value does this teach?',
        steps: ['Giving helps people in need.', 'It teaches sharing.'],
        answer: 'Generosity.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking worship ends when you leave church, mosque or shrine.',
        right: 'The values of worship guide daily life.',
      },
    ],
    realLife: [
      'Giving to the needy.',
      'Prayers at home.',
      'Quiet respect during worship.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write two forms of worship.',
        'For each, write a value it teaches.',
        'Share with a partner.',
      ],
    },
  },
  'rme-07': {
    indicator: {
      code: 'B5.2.1.1.2',
      text: 'Explain the moral significance of religious songs and recitations.',
    },
    hook: 'Songs and recitations stay in our memory for years. What do they teach?',
    explain: [
      'Christians sing hymns and choruses. Muslims recite the Qur’an and sing nasheeds. Followers of African Traditional Religion sing and drum at rituals and festivals.',
      'These songs make worship lively and tell of God’s goodness.',
      'Their words teach values such as thankfulness, hope, honesty and love.',
    ],
    art: { kind: 'worship', label: 'Songs and recitations in each religion' },
    artCaption: 'Music carries messages.',
    words: [
      { term: 'Recitation', meaning: 'Saying a text aloud from memory.' },
      { term: 'Theme', meaning: 'The main idea of a song or story.' },
      { term: 'Melody', meaning: 'The tune of a song.' },
    ],
    examples: [
      {
        title: 'Find the theme',
        situation:
          'A song thanks God for rain and food. What value does it teach?',
        steps: ['Its words give thanks.'],
        answer: 'Gratitude.',
      },
    ],
    mistakes: [
      {
        wrong: 'Singing without thinking about the words.',
        right: 'Listen to the message and live it.',
      },
    ],
    realLife: [
      'Choirs.',
      'Qur’an recitation competitions.',
      'Drumming at festivals.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Write a short song or poem about kindness or thankfulness.',
        'Give it a tune or rhythm.',
        'Perform it for the class.',
      ],
    },
  },
  'rme-08': {
    indicator: {
      code: 'B5.2.2.1.1',
      text: 'Identify the moral significance of sacred passages and oral traditions in the three main religions.',
    },
    hook: 'Some passages and stories are known by millions of people. What do they teach about how to live?',
    explain: [
      'Christians and Jews learn the Ten Commandments from Exodus 20. They teach respect for God, parents, life and other people’s property.',
      'Muslims recite Al-Fātiḥah in every prayer. It praises Allah and asks for guidance on the right path.',
      'In African Traditional Religion, folktales, proverbs and myths warn against greed and teach respect and wisdom.',
    ],
    art: {
      kind: 'scroll',
      title: 'Passages and traditions',
      lines: [
        'Christianity: Ten Commandments',
        'Islam: Al-Fātiḥah',
        'Traditional: folktales',
        'Traditional: proverbs',
      ],
    },
    artCaption: 'Texts and traditions that guide people.',
    words: [
      { term: 'Passage', meaning: 'A short part of a longer text.' },
      {
        term: 'Oral tradition',
        meaning: 'Teachings passed on by word of mouth.',
      },
      { term: 'Guidance', meaning: 'Help in choosing the right way.' },
    ],
    examples: [
      {
        title: 'An Ananse lesson',
        situation:
          'In a folktale, Ananse tries to keep all the world’s wisdom for himself. What does the story teach?',
        steps: [
          'His greed causes trouble.',
          'In the end, wisdom spreads to everyone.',
        ],
        answer: 'Greed does not pay. Share what you know.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking oral traditions are less important than written ones.',
        right: 'Each religion values its own teachings.',
      },
    ],
    realLife: [
      'Sunday school lessons.',
      'Daily prayers.',
      'Folktales at bedtime.',
    ],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Ask for a folktale or proverb.',
        'Write down its moral lesson.',
        'Say how you can use it this week.',
      ],
    },
  },
  'rme-09': {
    indicator: {
      code: 'B5.3.1.1.1',
      text: 'Describe the key events in the ministry of the leaders of the three religions.',
    },
    hook: 'A ministry is the work a religious leader does. What were the key moments for each leader?',
    explain: [
      'Christians read that Jesus was baptised, was tempted in the wilderness, called his disciples, and taught and healed people.',
      'Muslims teach that the Prophet Muhammad, peace be upon him, was called at Hira, preached in Makkah, moved to Madina, and returned to Makkah peacefully.',
      'In African Traditional Religion, priests train for years under older priests. Then they teach, heal with herbs and advise chiefs.',
    ],
    art: { kind: 'worship', label: 'The work of leaders in each religion' },
    artCaption: 'Each religion tells of its leaders’ work.',
    words: [
      { term: 'Ministry', meaning: 'The work of a religious leader.' },
      { term: 'Disciple', meaning: 'A follower who learns from a teacher.' },
      { term: 'Temptation', meaning: 'Being pulled towards doing wrong.' },
    ],
    examples: [
      {
        title: 'Okomfo Anokye',
        situation:
          'Akan traditions say Okomfo Anokye helped Osei Tutu. What did he do?',
        steps: [
          'Traditions say he brought down the Golden Stool.',
          'It united the Asante people.',
        ],
        answer: 'He helped unite Asante.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a leader’s work was easy.',
        right: 'Each faced hardship and kept going.',
      },
    ],
    realLife: [
      'Pastors, imams and priests in our communities.',
      'Teachers training new teachers.',
      'Leaders serving their people.',
    ],
    tryIt: {
      need: 'A group',
      steps: [
        'Choose one key event.',
        'Role play it respectfully, without acting as a prophet.',
        'Explain why it mattered.',
      ],
    },
  },
  'rme-10': {
    indicator: {
      code: 'B5.3.1.1.2',
      text: 'Outline the moral lessons from the ministry of the various leaders.',
    },
    hook: 'The leaders faced hard times. How they acted can teach us a lot.',
    explain: [
      'Jesus resisted temptation and served others. Christians learn obedience, humility and service.',
      'The Prophet Muhammad forgave his enemies when he returned to Makkah. Muslims learn patience and forgiveness.',
      'Traditional priests train for years. People learn commitment and loyalty to the community.',
    ],
    art: {
      kind: 'scroll',
      title: 'Lessons from their work',
      lines: ['Obedience', 'Patience', 'Forgiveness', 'Service', 'Commitment'],
    },
    artCaption: 'Values for leaders and followers.',
    words: [
      { term: 'Resist', meaning: 'Refuse to give in.' },
      {
        term: 'Forgiveness',
        meaning: 'Letting go of anger at someone who hurt you.',
      },
      { term: 'Loyalty', meaning: 'Staying faithful.' },
    ],
    examples: [
      {
        title: 'A class leader',
        situation:
          'You are made class prefect. Which lessons from the leaders can help you?',
        steps: [
          'Serve your classmates.',
          'Be patient and fair.',
          'Forgive mistakes.',
        ],
        answer: 'Service, patience and forgiveness.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking leaders are only there to give orders.',
        right: 'Good leaders serve.',
      },
    ],
    realLife: [
      'Prefects helping classmates.',
      'Forgiving friends.',
      'Sticking with hard tasks.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Choose one lesson.',
        'Write how you will practise it at school.',
        'Check yourself at the end of the week.',
      ],
    },
  },
  'rme-11': {
    indicator: {
      code: 'B5.4.1.1.1',
      text: 'Explain the need to be a committed member of the family.',
    },
    hook: 'Strong families need members who show up and help. Why does commitment matter?',
    explain: [
      'Committed members start family get-togethers, support family projects and visit elders.',
      'They help family members who fall behind and help younger ones learn good behaviour.',
      'Commitment brings unity, peace, respect and a strong family support system.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Grandfather', 'Grandmother'],
        ['Father', 'Mother', 'Uncle'],
        ['Me', 'Brother', 'Cousin'],
      ],
    },
    artCaption: 'Every member makes the family stronger.',
    words: [
      {
        term: 'Support system',
        meaning: 'People who help you when you need it.',
      },
      { term: 'Visitation', meaning: 'Taking time to visit someone.' },
      { term: 'Unity', meaning: 'Being together as one.' },
    ],
    examples: [
      {
        title: 'A family project',
        situation:
          'An aunt is sick and the family is caring for her. How can a child help?',
        steps: [
          'Visit and greet her.',
          'Run errands.',
          'Help with chores at home.',
        ],
        answer: 'Small help shows commitment.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking family duties are only for adults.',
        right: 'Children have a part too.',
      },
    ],
    realLife: [
      'Visiting grandparents.',
      'Family meetings.',
      'Helping younger siblings with homework.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Plan a short family sketch about commitment.',
        'Perform it.',
        'Ask the class what commitment they saw.',
      ],
    },
  },
  'rme-12': {
    indicator: {
      code: 'B5.4.1.1.2',
      text: 'Demonstrate things to do to show commitment as members of the family.',
    },
    hook: 'Weddings, funerals, naming ceremonies: family events need everyone. How can you take part?',
    explain: [
      'Take part in family programmes, such as get-togethers and clean-ups.',
      'Attend and help at weddings, funerals and naming ceremonies.',
      'Contribute what you can: time, help or a small gift.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'stand', x: 140, kit: 1 },
        { pose: 'reach', x: 320, kit: 2 },
        { pose: 'walk', x: 500, kit: 3 },
      ],
      sun: true,
      label: 'Helping at a family event',
    },
    artCaption: 'Everyone helps.',
    words: [
      { term: 'Contribute', meaning: 'Give your share.' },
      { term: 'Naming ceremony', meaning: 'A celebration to name a new baby.' },
      { term: 'Programme', meaning: 'A planned event.' },
    ],
    examples: [
      {
        title: 'At a naming ceremony',
        situation:
          'Your family is holding a naming ceremony for a new cousin. What can you do?',
        steps: [
          'Help set out chairs.',
          'Greet visitors.',
          'Help serve drinks.',
        ],
        answer: 'Help, greet and serve.',
      },
    ],
    mistakes: [
      {
        wrong: 'Staying away from family events without a reason.',
        right: 'Attend and help when you can.',
      },
    ],
    realLife: ['Weddings.', 'Funerals.', 'Naming ceremonies.'],
    tryIt: {
      need: 'A group',
      steps: [
        'Act out helping at a family event.',
        'Each person takes a different task.',
        'Discuss how it felt to help.',
      ],
    },
  },
  'rme-13': {
    indicator: {
      code: 'B5.5.1.1.1',
      text: 'Recognise parents as sources of discipline and character formation.',
    },
    hook: 'Parents correct us when we go wrong. Why does that help us grow?',
    explain: [
      'Parents guide children by advising, correcting, and sometimes taking away treats.',
      'They pray and worship with children, and show good behaviour for them to copy.',
      'Discipline helps children grow into responsible adults. It should teach, not hurt.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Father', 'Mother'],
        ['Me', 'Sister'],
      ],
    },
    artCaption: 'Parents guide and teach.',
    words: [
      { term: 'Discipline', meaning: 'Training to behave well.' },
      { term: 'Role model', meaning: 'Someone whose behaviour others copy.' },
      { term: 'Character', meaning: 'The kind of person you are.' },
    ],
    examples: [
      {
        title: 'Losing a treat',
        situation:
          'Kofi did not do his homework, so he cannot watch TV tonight. What should he learn?',
        steps: ['Actions have consequences.', 'Homework comes first.'],
        answer: 'Do your duties on time.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking parents correct us because they do not love us.',
        right: 'Correction is a way of caring.',
      },
    ],
    realLife: [
      'Advice at home.',
      'Family prayers.',
      'Copying good habits from parents.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Write one good habit you learned from a parent or carer.',
        'Write how it helps you.',
        'Thank them.',
      ],
    },
    safety: [
      'Discipline should never injure you. If any adult hurts you, tell a teacher or another trusted adult.',
    ],
  },
  'rme-14': {
    indicator: {
      code: 'B5.5.1.1.2',
      text: 'Explain the need to demonstrate responsible behaviour at home.',
    },
    hook: 'Being responsible means others can count on you. What does that look like at home?',
    explain: [
      'Responsible children do their chores, obey rules and take care of their things.',
      'They copy the good examples of parents and older family members.',
      'Responsible behaviour builds trust and prepares you to be a responsible adult.',
    ],
    art: {
      kind: 'scroll',
      title: 'Responsible at home',
      lines: [
        'Do your chores',
        'Obey family rules',
        'Care for your things',
        'Help younger ones',
        'Own up to mistakes',
      ],
    },
    artCaption: 'Habits that build trust.',
    words: [
      {
        term: 'Responsible',
        meaning: 'Able to be trusted to do the right thing.',
      },
      { term: 'Chore', meaning: 'A regular job at home.' },
      { term: 'Emulate', meaning: 'Copy someone you admire.' },
    ],
    examples: [
      {
        title: 'A broken plate',
        situation:
          'You break a plate while washing up. No one saw. What does a responsible child do?',
        steps: ['Tell a parent.', 'Say sorry.', 'Help clean up safely.'],
        answer: 'Own up.',
      },
    ],
    mistakes: [
      { wrong: 'Hiding mistakes.', right: 'Own up and fix what you can.' },
    ],
    realLife: [
      'Washing up.',
      'Keeping your room tidy.',
      'Caring for younger siblings.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a short essay: “How I will become a responsible adult.”',
        'Include three habits.',
        'Read it to the class.',
      ],
    },
  },
  'rme-15': {
    indicator: {
      code: 'B5.5.2.1.1',
      text: 'Discuss the importance of being a responsible member of the family.',
    },
    hook: 'When everyone in a family does their part, home runs smoothly. Why does each person matter?',
    explain: [
      'A responsible family member takes part in family activities, obeys elders and respects everyone.',
      'They do their duties, take initiative and help needy relatives.',
      'This brings unity, earns respect, and makes them reliable.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Grandmother'],
        ['Father', 'Mother'],
        ['Me', 'Brother', 'Sister'],
      ],
    },
    artCaption: 'Each member has a part.',
    words: [
      { term: 'Reliable', meaning: 'Someone others can count on.' },
      {
        term: 'Initiative',
        meaning: 'Doing something helpful without being asked.',
      },
      { term: 'Needy', meaning: 'Without enough of what they need.' },
    ],
    examples: [
      {
        title: 'Taking initiative',
        situation:
          'Grandmother’s compound is untidy and she is tired. What can you do?',
        steps: ['Offer to sweep it.', 'Do it carefully.'],
        answer: 'Help without being asked.',
      },
    ],
    mistakes: [
      {
        wrong: 'Waiting to be told every time.',
        right: 'See what needs doing and do it.',
      },
    ],
    realLife: ['Helping grandparents.', 'Sharing chores.', 'Family meetings.'],
    tryIt: {
      need: 'Friends',
      steps: [
        'Role-play a responsible family member.',
        'Show three helpful actions.',
        'Discuss why they matter.',
      ],
    },
  },
}
