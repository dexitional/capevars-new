import type { CourseGuides } from './types'

// Basic 6 Religious and Moral Education, written for this course and scoped
// to the NaCCA RME Curriculum for Primary Schools (2019), for ten- and
// eleven-year-olds. Notes:
// - The three major religions in Ghana are taught side by side, each in its
//   own terms, to build understanding, not to preach.
// - No picture shows God, a prophet or a religious leader; sacred texts are
//   named, not quoted.
// - The curriculum lists a festival called "Tedudu", which we could not
//   confirm, so rme-05 names festivals we could.
// - Okomfo Anokye's later life is told as tradition.

export const guides: CourseGuides = {
  'rme-01': {
    indicator: {
      code: 'B6.1.1.1.1',
      text: 'Describe the nature of God through His attributes.',
    },
    hook: 'What is God like? Each religion describes God with special names and qualities.',
    explain: [
      'Christians describe God as loving, merciful, all-knowing, all-powerful and present everywhere.',
      'Muslims learn the ninety-nine names of Allah, such as Ar-Raḥmān, the Most Merciful, and Al-ʿAlīm, the All-Knowing.',
      'In African Traditional Religion, the Akan call God Otumfuo, the Almighty, and the Ga call God Ataa Naa Nyonmo, Father-Mother God.',
    ],
    art: {
      kind: 'scroll',
      title: 'Attributes of God',
      lines: [
        'Loving',
        'Merciful',
        'Patient',
        'All-knowing (omniscient)',
        'All-powerful (omnipotent)',
      ],
    },
    artCaption: 'Qualities the religions use to describe God.',
    words: [
      { term: 'Attribute', meaning: 'A quality or feature.' },
      { term: 'Omniscient', meaning: 'Knowing everything.' },
      { term: 'Omnipotent', meaning: 'Having all power.' },
    ],
    examples: [
      {
        title: 'Attributes in people',
        situation: 'Which of God’s attributes can people also show?',
        steps: [
          'People cannot know everything.',
          'But people can love, be patient and show mercy.',
        ],
        answer: 'Love, patience and mercy.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only one language has names for God.',
        right: 'Every Ghanaian language has its own names for God.',
      },
    ],
    realLife: [
      'Names for God in songs and prayers.',
      'Showing mercy to others.',
      'Patience with younger children.',
    ],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Ask for a name of God in your home language.',
        'Find out which attribute it describes.',
        'Write a short essay about it.',
      ],
    },
  },
  'rme-02': {
    indicator: {
      code: 'B6.1.2.1.1',
      text: 'Explain how humankind and the environment interrelate.',
    },
    hook: 'You breathe out what plants take in, and plants give out what you breathe in. How else do we depend on each other?',
    explain: [
      'People and animals depend on plants for oxygen, food, medicine and shelter.',
      'Plants depend on people and animals too. Animals spread seeds, and people plant trees.',
      'Some animals eat other animals, and parasites live on hosts. All living things are connected.',
    ],
    art: { kind: 'nature', label: 'Living things depend on each other' },
    artCaption: 'Air, water, land, plants and animals are connected.',
    words: [
      { term: 'Interrelate', meaning: 'Depend on and affect each other.' },
      { term: 'Carnivore', meaning: 'An animal that eats other animals.' },
      {
        term: 'Parasite',
        meaning: 'A living thing that lives on another and feeds from it.',
      },
    ],
    examples: [
      {
        title: 'Seed travellers',
        situation:
          'A bird eats a fruit and flies away. How does this help the tree?',
        steps: [
          'The seed passes through the bird.',
          'It drops far away and grows.',
        ],
        answer: 'The bird spreads the tree’s seeds.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking people do not need nature.',
        right: 'Our survival depends on the environment.',
      },
    ],
    realLife: [
      'Herbal medicine.',
      'Shade trees in the compound.',
      'Bees pollinating crops.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a chain: sun, grass, goat, person.',
        'Add arrows showing who depends on whom.',
        'Explain it to a partner.',
      ],
    },
  },
  'rme-03': {
    indicator: {
      code: 'B6.1.2.1.2',
      text: 'Explain the religious and moral lessons in preserving the environment.',
    },
    hook: 'Some forests in Ghana have been protected for centuries, by faith and tradition. Why?',
    explain: [
      'Christianity and Islam teach that people are stewards of the earth who must answer to God for how they treat it.',
      'In African Traditional Religion, sacred groves and taboos protect nature. Many coastal towns do not fish on Tuesdays.',
      'We preserve the environment by planting trees, fishing and hunting properly, legal mining and avoiding bush fires.',
    ],
    art: { kind: 'nature', label: 'Protected by faith and tradition' },
    artCaption: 'Forests, rivers and animals worth protecting.',
    words: [
      { term: 'Steward', meaning: 'Someone trusted to look after something.' },
      {
        term: 'Sacred grove',
        meaning: 'A forest protected for religious reasons.',
      },
      { term: 'Afforestation', meaning: 'Planting trees to make a forest.' },
    ],
    examples: [
      {
        title: 'Boabeng-Fiema',
        situation:
          'In the Bono East villages of Boabeng and Fiema, monkeys are protected by tradition. What has happened to them?',
        steps: ['People do not hunt them.', 'Their forest is kept.'],
        answer: 'The monkeys thrive, and visitors come to see them.',
      },
    ],
    mistakes: [
      {
        wrong: 'Setting bushes on fire to clear land.',
        right: 'Bush fires destroy plants, animals and soil.',
      },
    ],
    realLife: [
      'Sacred groves.',
      'Tree-planting days.',
      'Rules on fishing nets and closed seasons.',
    ],
    tryIt: {
      need: 'A group and a teacher',
      steps: [
        'Plan a small tree-planting or clean-up project.',
        'Carry it out.',
        'Write what you did and learned.',
      ],
    },
  },
  'rme-04': {
    indicator: {
      code: 'B6.2.1.1.1',
      text: 'Discuss the importance of prayer in our lives.',
    },
    hook: 'Prayer is talking with God. Why do so many people pray every day?',
    explain: [
      'Christians pray prayers of thanksgiving, confession, supplication for themselves and intercession for others.',
      'Muslims perform Salat, five daily prayers, and meet for Jumu’ah prayer on Fridays.',
      'In African Traditional Religion, people pray in thanksgiving and for others, often while pouring libation. All three teach that prayer draws people closer to God.',
    ],
    art: { kind: 'worship', label: 'Prayer in the three religions' },
    artCaption: 'Each religion has its own ways to pray.',
    words: [
      { term: 'Intercession', meaning: 'Praying for other people.' },
      { term: 'Supplication', meaning: 'Asking humbly for help.' },
      {
        term: 'Confession',
        meaning: 'Admitting wrongs and asking forgiveness.',
      },
    ],
    examples: [
      {
        title: 'Which kind?',
        situation:
          'Esi prays for her sick grandmother to get well. What kind of prayer is this?',
        steps: ['She is praying for someone else.'],
        answer: 'Intercession.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking prayer is only for asking for things.',
        right: 'Prayer also gives thanks and asks forgiveness.',
      },
    ],
    realLife: [
      'Prayers before meals.',
      'School assembly prayers.',
      'Prayers at naming ceremonies.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the four types of prayer.',
        'Give one example of each.',
        'Discuss with a partner.',
      ],
    },
  },
  'rme-05': {
    indicator: {
      code: 'B6.2.2.1.1',
      text: 'Gather and record data on religious festivals.',
    },
    hook: 'Which festivals do your classmates celebrate? A simple survey can tell you.',
    explain: [
      'Ghana’s festivals include Christmas, Easter, Eid al-Fitr, Eid al-Adha, Damba, Homowo, Odwira and Hogbetsotso.',
      'To gather data, ask each classmate which festival they celebrate, and record each answer with a tally mark.',
      'Then count the tallies and describe what you found.',
    ],
    art: {
      kind: 'tally',
      rows: [
        ['Christmas', 9],
        ['Eid al-Fitr', 6],
        ['Homowo', 4],
        ['Damba', 3],
      ],
    },
    artCaption:
      'One class’s survey of the festival each pupil celebrates most.',
    words: [
      { term: 'Data', meaning: 'Facts collected to learn something.' },
      { term: 'Survey', meaning: 'Asking many people the same question.' },
      { term: 'Tally', meaning: 'A mark used to count.' },
    ],
    examples: [
      {
        title: 'Read the survey',
        situation: 'In the survey, how many pupils were asked?',
        steps: ['Add the tallies: 9 + 6 + 4 + 3 = 22.'],
        answer: '22 pupils.',
      },
    ],
    mistakes: [
      {
        wrong: 'Counting the same person twice.',
        right: 'Ask each person once and record one answer.',
      },
    ],
    realLife: [
      'Class surveys.',
      'News reports about festivals.',
      'Planning school celebrations.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Survey your class about their favourite festival.',
        'Record tallies.',
        'Write an essay on how the top festival is celebrated.',
      ],
    },
  },
  'rme-06': {
    indicator: {
      code: 'B6.2.2.1.2',
      text: 'Explain the need for celebrating various festivals.',
    },
    hook: 'Festivals happen year after year. Why do communities keep celebrating them?',
    explain: [
      'Christians celebrate Christmas and Easter, Muslims celebrate the two Eids, and followers of African Traditional Religion keep festivals like Odwira.',
      'Festivals teach love and sacrifice, and remind people of their history and faith.',
      'They promote unity and brotherliness, and bring reconciliation between people.',
    ],
    art: { kind: 'worship', label: 'Festivals in the three religions' },
    artCaption: 'Each religion has its festivals.',
    words: [
      { term: 'Brotherliness', meaning: 'Treating others like family.' },
      {
        term: 'Sacrifice',
        meaning: 'Giving up something for others or for God.',
      },
      { term: 'Reconciliation', meaning: 'Making peace after a quarrel.' },
    ],
    examples: [
      {
        title: 'Eid al-Adha',
        situation:
          'At Eid al-Adha, many Muslim families share meat with the poor. What does this teach?',
        steps: [
          'It remembers Ibrahim’s willingness to sacrifice.',
          'Sharing helps people in need.',
        ],
        answer: 'Sacrifice and generosity.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking festivals are only holidays.',
        right: 'They carry meaning and values.',
      },
    ],
    realLife: [
      'Families reuniting.',
      'Gifts to the needy.',
      'Chiefs settling disputes.',
    ],
    tryIt: {
      need: 'A group',
      steps: [
        'Choose a festival.',
        'Dramatise sharing or reconciliation at it.',
        'Write a short essay on why it is celebrated.',
      ],
    },
  },
  'rme-07': {
    indicator: {
      code: 'B6.2.2.1.3',
      text: 'Discuss moral lessons from the festivals.',
    },
    hook: 'Every festival has lessons for daily life. What can we learn?',
    explain: [
      'Festivals teach generosity, kindness and gratitude.',
      'They teach endurance, sacrifice and perseverance, such as fasting in Ramadan or preparing a harvest.',
      'They teach forgiveness, reconciliation and bravery, remembering heroes of the past.',
    ],
    art: {
      kind: 'scroll',
      title: 'Lessons from festivals',
      lines: ['Generosity', 'Gratitude', 'Endurance', 'Forgiveness', 'Bravery'],
    },
    artCaption: 'Values to live by all year.',
    words: [
      { term: 'Endurance', meaning: 'Keeping going through difficulty.' },
      { term: 'Gratitude', meaning: 'Being thankful.' },
      { term: 'Perseverance', meaning: 'Not giving up.' },
    ],
    examples: [
      {
        title: 'Hogbetsotso',
        situation:
          'Hogbetsotso remembers the Anlo Ewe escape from Notsie. What lessons can it teach?',
        steps: ['The escape needed courage.', 'The journey needed endurance.'],
        answer: 'Bravery and endurance.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting festival lessons after the festival ends.',
        right: 'Practise them all year.',
      },
    ],
    realLife: [
      'Sharing during Christmas and Eid.',
      'Forgiving at festival time.',
      'Thanksgiving for harvest.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Choose three moral lessons.',
        'Write how you will practise each this term.',
        'Present to the class.',
      ],
    },
  },
  'rme-08': {
    indicator: {
      code: 'B6.3.1.1.1',
      text: 'Narrate the story of the latter lives of the leaders of the major religions.',
    },
    hook: 'How did the leaders’ lives end, and what do their followers remember most?',
    explain: [
      'Christians remember Jesus entering Jerusalem on Palm Sunday, the Last Supper, his arrest, trial and crucifixion. They believe he rose again at Easter.',
      'Muslims remember the Prophet Muhammad’s return to Makkah, his farewell sermon during his last pilgrimage, and his illness and death in Madina.',
      'In African Traditional Religion, Akan traditions say Okomfo Anokye planted a sword in Kumasi that no one can pull out, and later went away and never returned.',
    ],
    art: { kind: 'worship', label: 'Each religion remembers its leaders' },
    artCaption: 'Stories from three religions.',
    words: [
      { term: 'Crucifixion', meaning: 'Putting someone to death on a cross.' },
      { term: 'Resurrection', meaning: 'Rising from death to life.' },
      { term: 'Farewell sermon', meaning: 'A last speech of advice.' },
    ],
    examples: [
      {
        title: 'Palm Sunday',
        situation:
          'Why do some Christians wave palm branches on the Sunday before Easter?',
        steps: [
          'They remember crowds welcoming Jesus into Jerusalem with palm branches.',
        ],
        answer: 'To remember his entry into Jerusalem.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing the stories of different religions.',
        right: 'Each religion tells its own story.',
      },
    ],
    realLife: [
      'Palm Sunday and Easter.',
      'Hajj, which the Prophet made in his last year.',
      'The Okomfo Anokye sword site in Kumasi.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Choose one leader.',
        'Write three events from their later life, in order.',
        'Share one virtue it teaches.',
      ],
    },
  },
  'rme-09': {
    indicator: {
      code: 'B6.4.1.1.1',
      text: 'Demonstrate ways they can commit themselves to the community.',
    },
    hook: 'A community is like a big family. How can you play your part?',
    explain: [
      'Commitment to the community means caring for it and working for its good.',
      'You can join communal labour and clean-up exercises.',
      'You can protect public property, and tell a trusted adult if you see a crime.',
    ],
    art: {
      kind: 'scroll',
      title: 'Serving the community',
      lines: [
        'Join communal labour',
        'Take part in clean-ups',
        'Protect public property',
        'Report crime to adults',
        'Help neighbours',
      ],
    },
    artCaption: 'Ways to commit yourself to your community.',
    words: [
      {
        term: 'Communal labour',
        meaning: 'Work done together for the whole community.',
      },
      {
        term: 'Public property',
        meaning:
          'Things that belong to everyone, like schools and streetlights.',
      },
      { term: 'Citizen', meaning: 'A member of a country or community.' },
    ],
    examples: [
      {
        title: 'A broken streetlight',
        situation:
          'Some boys are throwing stones at a streetlight. What can you do?',
        steps: [
          'Do not join them.',
          'Tell a trusted adult or the assembly member.',
        ],
        answer: 'Protect public property safely.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking public property belongs to nobody.',
        right: 'It belongs to everyone, so everyone protects it.',
      },
    ],
    realLife: [
      'Communal labour days.',
      'Neighbourhood watch.',
      'Keeping school property safe.',
    ],
    tryIt: {
      need: 'A group',
      steps: [
        'Dramatise one way to serve the community.',
        'Write a group essay about it.',
        'Present to the class.',
      ],
    },
    safety: ['Never try to stop a crime yourself. Tell a trusted adult.'],
  },
  'rme-10': {
    indicator: {
      code: 'B6.4.1.1.2',
      text: 'Explain the need to be committed members of the community.',
    },
    hook: 'What happens to a town when everyone helps, and when no one does?',
    explain: [
      'Committed citizens bring peace and harmony to the community.',
      'Their work leads to progress and development, such as clean streets and safe schools.',
      'The religions teach that serving others brings blessings, and people respect those who serve.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'reach', x: 140, kit: 1 },
        { pose: 'walk', x: 320, kit: 2 },
        { pose: 'stand', x: 500, kit: 3 },
      ],
      sun: true,
      label: 'Working together',
    },
    artCaption: 'Many hands make light work.',
    words: [
      { term: 'Development', meaning: 'Growth and improvement.' },
      { term: 'Harmony', meaning: 'Living together peacefully.' },
      { term: 'Committed', meaning: 'Loyal and dependable.' },
    ],
    examples: [
      {
        title: 'Two towns',
        situation:
          'In Town A, everyone joins clean-ups. In Town B, no one does. Which town is healthier?',
        steps: [
          'Clean-ups remove rubbish.',
          'Less rubbish means fewer mosquitoes and germs.',
        ],
        answer: 'Town A.',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving community work to others.',
        right: 'Everyone has a part to play.',
      },
    ],
    realLife: ['Community projects.', 'Volunteers at clinics.', 'Youth clubs.'],
    tryIt: {
      need: 'Friends',
      steps: [
        'Act out a committed citizen helping their town.',
        'Show what changes.',
        'Discuss why it matters.',
      ],
    },
  },
  'rme-11': {
    indicator: {
      code: 'B6.5.1.1.1',
      text: 'Identify the role of children in promoting harmony with other family members.',
    },
    hook: 'Harmony at home needs everyone, including you. What can children do?',
    explain: [
      'Children promote harmony by being respectful, obedient and humble.',
      'Other relatives help too, by being caring, protective and respectful.',
      'Grandparents, aunts, uncles and cousins all help shape a child’s character.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Grandfather', 'Grandmother'],
        ['Father', 'Mother', 'Aunt'],
        ['Me', 'Cousin'],
      ],
    },
    artCaption: 'Every member helps keep the peace.',
    words: [
      { term: 'Harmony', meaning: 'Living together peacefully.' },
      { term: 'Humble', meaning: 'Not proud or boastful.' },
      { term: 'Character', meaning: 'The kind of person you are.' },
    ],
    examples: [
      {
        title: 'A family quarrel',
        situation: 'Your siblings are arguing about the TV. How can you help?',
        steps: ['Stay calm.', 'Suggest taking turns.'],
        answer: 'Be a peacemaker.',
      },
    ],
    mistakes: [
      {
        wrong: 'Taking sides loudly in family quarrels.',
        right: 'Speak calmly and help find a fair solution.',
      },
    ],
    realLife: [
      'Greeting elders.',
      'Sharing with siblings.',
      'Listening to grandparents’ advice.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Role play a grandparent teaching a child.',
        'Show how the child responds respectfully.',
        'Discuss what you learned.',
      ],
    },
  },
  'rme-12': {
    indicator: {
      code: 'B6.5.1.1.2',
      text: 'Explain the need for cordial relationships among family members.',
    },
    hook: 'A cordial family is warm and friendly. Why does that matter so much?',
    explain: [
      'Cordial relationships bring peace and unity to the family.',
      'They help children form good character.',
      'When families get on well, they work together to provide food, shelter and school fees.',
    ],
    art: {
      kind: 'scroll',
      title: 'Why get on well',
      lines: [
        'Peace and unity',
        'Good character',
        'Family progress',
        'Food and shelter',
        'School fees paid',
      ],
    },
    artCaption: 'Friendly families grow together.',
    words: [
      { term: 'Cordial', meaning: 'Warm and friendly.' },
      { term: 'Progress', meaning: 'Moving forward and improving.' },
      {
        term: 'Basic needs',
        meaning: 'Things everyone needs, like food and shelter.',
      },
    ],
    examples: [
      {
        title: 'Helping together',
        situation:
          'An uncle helps pay a nephew’s school fees. What makes this possible?',
        steps: [
          'The family members care for each other.',
          'They share what they have.',
        ],
        answer: 'A cordial relationship.',
      },
    ],
    mistakes: [
      {
        wrong: 'Holding grudges against relatives.',
        right: 'Forgive, talk and rebuild trust.',
      },
    ],
    realLife: [
      'Family gatherings.',
      'Relatives supporting each other.',
      'Saying thank you at home.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'List five behaviours that keep a family cordial.',
        'Write an essay on why they matter.',
        'Read it to the class.',
      ],
    },
  },
  'rme-13': {
    indicator: {
      code: 'B6.5.2.1.1',
      text: 'Identify attitudes and behaviours of a responsible family member.',
    },
    hook: 'Is it good to be committed to your family? Let us look at what a responsible member does.',
    explain: [
      'A responsible family member takes part in family activities, obeys elders and respects everyone.',
      'They do their duties, take initiative and help needy relatives.',
      'This promotes unity, earns respect, builds trust and raises the family’s good name.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Grandmother', 'Grandfather'],
        ['Mother', 'Father'],
        ['Me', 'Sister', 'Brother'],
      ],
    },
    artCaption: 'Responsible members strengthen the family.',
    words: [
      {
        term: 'Attitude',
        meaning: 'The way you think and feel about something.',
      },
      {
        term: 'Initiative',
        meaning: 'Doing something helpful without being asked.',
      },
      {
        term: 'Debate',
        meaning: 'A discussion where two sides argue a question.',
      },
    ],
    examples: [
      {
        title: 'Prepare a debate',
        situation:
          'The motion is: “It is good to be committed to one’s family.” Give one point for the motion.',
        steps: ['Think of what commitment brings.'],
        answer: 'It builds unity and trust.',
      },
    ],
    mistakes: [
      {
        wrong: 'Helping only when it benefits you.',
        right: 'Help because you care.',
      },
    ],
    realLife: [
      'Helping at family events.',
      'Caring for elderly relatives.',
      'Doing chores without reminders.',
    ],
    tryIt: {
      need: 'Your class',
      steps: [
        'Split into two groups.',
        'Debate the motion.',
        'Vote and discuss what you learned.',
      ],
    },
  },
}
