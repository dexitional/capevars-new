import type { CourseGuides } from './types'

// Basic 4 Religious and Moral Education, written for this course and scoped
// to the NaCCA RME Curriculum for Primary Schools (2019), for eight- and
// nine-year-olds. Notes:
// - The three major religions in Ghana are taught side by side, each in its
//   own terms, to build understanding, not to preach.
// - No picture shows God, a prophet or a religious leader; sacred texts are
//   named, not quoted.
// - The curriculum places the Prophet's call in a "Cave-Hijrah". The cave was
//   Hira; the Hijrah was his later move to Madina. rme-07 says so.
// - The curriculum cites Matthew 14 for the boy who offered his loaves; only
//   John 6 mentions the boy, so rme-09 names John.

export const guides: CourseGuides = {
  'rme-01': {
    indicator: {
      code: 'B4.1.1.1.1',
      text: 'Explain the nature of God as the Creator.',
    },
    hook: 'Look around: people, trees, animals, rivers. The religions teach that they all have one source.',
    explain: [
      'Christians call God the Creator, who made everything, as the Bible’s first book, Genesis, tells.',
      'Muslims call Allah al-Khāliq, which means the Creator, as the Qur’an teaches.',
      'In African Traditional Religion, the Akan call God Odomankoma, the Creator, and the Ewe call God Mawu.',
    ],
    art: { kind: 'nature', label: 'People, trees, animals and water' },
    artCaption: 'Things the religions teach that God created.',
    words: [
      { term: 'Creator', meaning: 'The one who made everything.' },
      { term: 'Originator', meaning: 'The one who starts something.' },
      { term: 'Nature', meaning: 'What someone or something is really like.' },
    ],
    examples: [
      {
        title: 'Made by God or by people?',
        situation: 'A river and a bridge. Which do the religions say God made?',
        steps: ['People built the bridge.', 'The river is part of nature.'],
        answer: 'The river.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only one religion believes God is the Creator.',
        right: 'All three major religions in Ghana teach it.',
      },
    ],
    realLife: [
      'Nature walks.',
      'Harvest thanksgiving.',
      'Names for God in Ghanaian languages.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Go on a nature walk with your class.',
        'List ten things you see in nature.',
        'Group them: people, plants, animals, water.',
      ],
    },
  },
  'rme-02': {
    indicator: {
      code: 'B4.1.1.2.1',
      text: 'Identify the uniqueness of humankind from other creatures.',
    },
    hook: 'A goat can walk and eat, just like you. So what makes people different?',
    explain: [
      'People can think, speak, write, make tools and know good from evil.',
      'Christians teach that God made people in His own image. Muslims teach that Allah taught Adam the names of all things.',
      'In African Traditional Religion, the Akan teach that each person has an okra, a soul given by God.',
    ],
    art: {
      kind: 'scroll',
      title: 'What makes people special',
      lines: [
        'We think and plan',
        'We speak and write',
        'We make tools',
        'We know right from wrong',
        'We worship',
      ],
    },
    artCaption: 'Gifts that make humans different.',
    words: [
      { term: 'Unique', meaning: 'Unlike anything else.' },
      {
        term: 'Soul',
        meaning: 'The part of a person that the religions say comes from God.',
      },
      {
        term: 'Stewardship',
        meaning: 'Caring well for what you have been given.',
      },
    ],
    examples: [
      {
        title: 'Person or animal?',
        situation:
          'Which of these can only a person do: eat, sleep, write a letter?',
        steps: ['Animals also eat and sleep.', 'Only people write.'],
        answer: 'Write a letter.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking being special lets us mistreat animals.',
        right: 'Our gifts give us the duty to care for them.',
      },
    ],
    realLife: [
      'Writing and reading at school.',
      'Making things with our hands.',
      'Choosing to do right.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw an animal and a person.',
        'List three things both can do.',
        'List three things only the person can do.',
      ],
    },
  },
  'rme-03': {
    indicator: {
      code: 'B4.2.1.1.1',
      text: 'Name the various forms of worship.',
    },
    hook: 'People worship in many ways: with words, songs, gifts and silence. What forms do you know?',
    explain: [
      'Christians pray, sing hymns, read the Bible, listen to sermons, give offerings and share Holy Communion.',
      'Muslims pray five times a day, meet for Friday prayer, fast in Ramadan, give Zakat and go on Hajj.',
      'In African Traditional Religion, people pray, pour libation, make offerings at shrines, and drum and dance.',
    ],
    art: { kind: 'worship', label: 'Many forms of worship' },
    artCaption: 'Each religion worships in its own ways.',
    words: [
      { term: 'Sermon', meaning: 'A talk that teaches about faith.' },
      { term: 'Hajj', meaning: 'The journey Muslims make to Makkah.' },
      {
        term: 'Libation',
        meaning: 'Pouring a drink on the ground while praying.',
      },
    ],
    examples: [
      {
        title: 'Which religion?',
        situation:
          'People meet at midday on Friday for a special prayer. Which religion is this?',
        steps: ['Friday prayer, called Jumu’ah, is part of Islam.'],
        answer: 'Islam.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking prayer is the only form of worship.',
        right: 'Singing, giving, fasting and reading are forms of worship too.',
      },
    ],
    realLife: [
      'Church services.',
      'Mosque prayers.',
      'Libation at durbars and naming ceremonies.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a table with three columns, one per religion.',
        'Write two forms of worship in each.',
        'Compare with a partner.',
      ],
    },
  },
  'rme-04': {
    indicator: {
      code: 'B4.2.1.1.2',
      text: 'State the purpose of worship in the three main religions.',
    },
    hook: 'Why do people spend time worshipping? The religions give several reasons.',
    explain: [
      'Christianity, Islam and African Traditional Religion teach that worship draws people closer to God.',
      'Worship is a way to talk to God, give thanks and ask for help.',
      'It also shows obedience to God and brings believers together.',
    ],
    art: { kind: 'worship', label: 'Why people worship' },
    artCaption: 'Closer to God, and to each other.',
    words: [
      { term: 'Purpose', meaning: 'The reason for doing something.' },
      { term: 'Communicate', meaning: 'Share thoughts and feelings.' },
      { term: 'Obedience', meaning: 'Doing what you are rightly asked.' },
    ],
    examples: [
      {
        title: 'Thanksgiving',
        situation: 'A family has had a good harvest. Why might they worship?',
        steps: [
          'They believe the harvest is a gift.',
          'Worship lets them say thank you.',
        ],
        answer: 'To give thanks to God.',
      },
    ],
    mistakes: [
      {
        wrong: 'Playing or chatting during worship.',
        right: 'Take an active, respectful part.',
      },
    ],
    realLife: [
      'Thanksgiving services.',
      'Prayers before exams.',
      'Community prayers at festivals.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a worship scene from any religion.',
        'Write one purpose of the worship shown.',
        'Show your class.',
      ],
    },
  },
  'rme-05': {
    indicator: {
      code: 'B4.2.1.1.3',
      text: 'Differentiate between religious and non-religious songs.',
    },
    hook: 'Some songs are about God and faith. Others are about love, work or fun. How can you tell them apart?',
    explain: [
      'Religious songs express faith in God. Christians sing hymns and choruses, Muslims sing nasheeds, and followers of African Traditional Religion sing songs at rituals.',
      'Non-religious songs are about everyday life, such as love, work, play or the nation.',
      'To tell them apart, listen to the words.',
    ],
    art: {
      kind: 'scroll',
      title: 'Kinds of songs',
      lines: [
        'Religious: hymns and choruses',
        'Religious: Islamic nasheeds',
        'Religious: traditional ritual songs',
        'Other: highlife and hiplife',
        'Other: play and folk songs',
      ],
    },
    artCaption: 'Listen to the words to tell them apart.',
    words: [
      { term: 'Lyrics', meaning: 'The words of a song.' },
      { term: 'Hymn', meaning: 'A song of praise to God.' },
      {
        term: 'Nasheed',
        meaning: 'An Islamic song, often sung without instruments.',
      },
    ],
    examples: [
      {
        title: 'Sort it',
        situation:
          'A song’s words say, “Thank you, God, for this new day.” What kind of song is it?',
        steps: ['It speaks to God.', 'It expresses faith.'],
        answer: 'A religious song.',
      },
    ],
    mistakes: [
      {
        wrong: 'Judging a song by its beat alone.',
        right: 'Listen to the lyrics.',
      },
    ],
    realLife: [
      'Songs at church and mosque.',
      'Music on the radio.',
      'Songs at festivals and funerals.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'List three songs you know.',
        'Write what each one is about.',
        'Mark each religious or non-religious.',
      ],
    },
  },
  'rme-06': {
    indicator: {
      code: 'B4.2.2.1.1',
      text: 'Discuss festivals in their neighbourhood.',
    },
    hook: 'Which festivals happen where you live? Each one brings something good to the community.',
    explain: [
      'Christians celebrate Christmas and Easter. Muslims celebrate Eid al-Fitr and Eid al-Adha. Traditional festivals include Odwira and Aboakyer.',
      'Festivals teach moral values, such as sharing, forgiveness and thankfulness.',
      'They bring people together, and traders, drivers and hotels earn money from visitors.',
    ],
    art: {
      kind: 'scroll',
      title: 'What festivals give us',
      lines: [
        'Moral: sharing and forgiveness',
        'Moral: thanks to God',
        'Social: families reunite',
        'Economic: traders sell more',
        'Economic: visitors come',
      ],
    },
    artCaption: 'Moral, social and economic values.',
    words: [
      { term: 'Moral', meaning: 'About right and wrong.' },
      { term: 'Social', meaning: 'About people being together.' },
      { term: 'Economic', meaning: 'About money, work and trade.' },
    ],
    examples: [
      {
        title: 'Odwira',
        situation:
          'At Odwira in Akropong, people clean the town and remember their ancestors. Which value is this?',
        steps: [
          'Cleaning and remembering bring the people together.',
          'Remembering ancestors honours the past.',
        ],
        answer: 'Social and moral values.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking festivals only cost money.',
        right: 'Many people also earn money at festivals.',
      },
    ],
    realLife: [
      'Market traders at Christmas.',
      'Eid visits.',
      'Tourists at traditional festivals.',
    ],
    tryIt: {
      need: 'A group',
      steps: [
        'Choose a festival in your area.',
        'List one moral, one social and one economic value.',
        'Present to the class.',
      ],
    },
  },
  'rme-07': {
    indicator: {
      code: 'B4.3.1.1.1',
      text: 'Describe the call of the religious leaders.',
    },
    hook: 'Each religion tells of a moment when its leader’s great work began. What happened?',
    explain: [
      'Christians read that Jesus was baptised by John in the River Jordan. A voice from heaven called him God’s Son.',
      'Muslims teach that the Angel Jibril came to the Prophet Muhammad, peace be upon him, in the Cave of Hira. Years later came the Hijrah, his move to Madina.',
      'In African Traditional Religion, Akan traditions tell of Okomfo Anokye, and Ewe traditions tell of Togbi Tsali, priests known for great wisdom.',
    ],
    art: {
      kind: 'worship',
      label: 'Each religion tells of its leaders’ calls',
    },
    artCaption: 'Stories of calls from three religions.',
    words: [
      { term: 'Call', meaning: 'When God gives someone special work to do.' },
      {
        term: 'Baptism',
        meaning: 'A Christian washing with water to begin new life.',
      },
      { term: 'Hijrah', meaning: 'The Prophet’s move from Makkah to Madina.' },
    ],
    examples: [
      {
        title: 'Where?',
        situation: 'Where did the Angel Jibril come to the Prophet Muhammad?',
        steps: [
          'Muslims teach it was in a cave on a mountain near Makkah.',
          'It is called the Cave of Hira.',
        ],
        answer: 'The Cave of Hira.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up the Cave of Hira and the Hijrah.',
        right: 'Hira is the cave. The Hijrah was the journey to Madina.',
      },
    ],
    realLife: [
      'Baptisms in churches.',
      'Islamic New Year, which remembers the Hijrah.',
      'Stories elders tell at festivals.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Write two sentences about the call of one leader.',
        'Say where it happened.',
        'Read it to a partner.',
      ],
    },
  },
  'rme-08': {
    indicator: {
      code: 'B4.4.1.1.1',
      text: 'Explain the need to be committed to God.',
    },
    hook: 'Committed people keep going, day after day. Why do the religions ask people to be committed to God?',
    explain: [
      'People show commitment through prayer, serving others, caring for the environment and charity.',
      'Christianity, Islam and African Traditional Religion teach that God created us and provides for us, so we should honour Him.',
      'They teach that commitment brings blessings and draws people closer to God.',
    ],
    art: { kind: 'worship', label: 'Commitment in each religion' },
    artCaption: 'Faithful every day.',
    words: [
      {
        term: 'Commitment',
        meaning: 'Staying faithful to a promise or a duty.',
      },
      { term: 'Charity', meaning: 'Helping people in need.' },
      { term: 'Provide', meaning: 'Give what is needed.' },
    ],
    examples: [
      {
        title: 'Small acts count',
        situation:
          'Ama prays each morning and helps an old neighbour fetch water. What is she showing?',
        steps: ['Prayer is worship.', 'Helping is service.'],
        answer: 'Commitment to God.',
      },
    ],
    mistakes: [
      {
        wrong: 'Being faithful only when you need something.',
        right: 'Commitment means every day.',
      },
    ],
    realLife: ['Daily prayers.', 'Giving to the needy.', 'Clean-up days.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write four ways people show commitment to God.',
        'Pick one you can do this week.',
        'Report back next lesson.',
      ],
    },
  },
  'rme-09': {
    indicator: {
      code: 'B4.4.1.1.2',
      text: 'Identify deeds that attract rewards.',
    },
    hook: 'Some actions earn praise and thanks. Others lead to punishment. Which are which?',
    explain: [
      'Helping others, telling the truth and obeying parents, teachers and the laws of Ghana are good deeds.',
      'Christians learn from the Good Samaritan and the boy who shared his bread in John’s Gospel. Muslims learn from Surah Hud that righteous deeds are rewarded.',
      'In African Traditional Religion, folktales and proverbs teach that good deeds are rewarded and bad deeds punished.',
    ],
    art: {
      kind: 'scroll',
      title: 'Good deeds',
      lines: [
        'Helping someone in need',
        'Telling the truth',
        'Obeying parents and teachers',
        'Obeying the laws of Ghana',
        'Sharing what you have',
      ],
    },
    artCaption: 'Deeds that earn rewards.',
    words: [
      { term: 'Deed', meaning: 'Something a person does.' },
      { term: 'Reward', meaning: 'Something good given for good behaviour.' },
      { term: 'Constitution', meaning: 'The highest law of a country.' },
    ],
    examples: [
      {
        title: 'The Good Samaritan',
        situation:
          'In Jesus’ story, two people pass by a hurt man. A Samaritan stops. What does he do?',
        steps: [
          'He treats the man’s wounds.',
          'He takes him to an inn.',
          'He pays for his care.',
        ],
        answer: 'He helps a stranger in need.',
      },
    ],
    mistakes: [
      {
        wrong: 'Doing good only to get a reward.',
        right: 'Do good because it is right.',
      },
    ],
    realLife: [
      'Helping a classmate.',
      'Returning lost items.',
      'Obeying traffic rules.',
    ],
    tryIt: {
      need: 'A group',
      steps: [
        'List three deeds that are rewarded.',
        'List three that are punished.',
        'Act out one of each.',
      ],
    },
  },
  'rme-10': {
    indicator: {
      code: 'B4.4.1.1.3',
      text: 'Give reasons for rewarding good deeds.',
    },
    hook: 'Why do teachers give prizes and parents give praise? There are good reasons.',
    explain: [
      'Rewards include handshakes, hugs, praise, certificates, prizes and gifts.',
      'Rewarding good deeds encourages hard work and good behaviour.',
      'It helps keep law and order, because people want to do what is right.',
    ],
    art: {
      kind: 'scroll',
      title: 'Kinds of rewards',
      lines: [
        'A handshake or hug',
        'Words of praise',
        'A certificate',
        'A prize or gift',
        'Trust and respect',
      ],
    },
    artCaption: 'One good turn deserves another.',
    words: [
      { term: 'Encourage', meaning: 'Help someone want to keep going.' },
      { term: 'Certificate', meaning: 'A paper that shows you did well.' },
      {
        term: 'Law and order',
        meaning: 'When people follow rules and stay safe.',
      },
    ],
    examples: [
      {
        title: 'Best-kept classroom',
        situation:
          'Class 4 wins a prize for the cleanest classroom. What will the other classes do next term?',
        steps: ['They see the reward.', 'They want one too.'],
        answer: 'Work harder to keep their rooms clean.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking rewards must cost money.',
        right: 'Praise and a thank-you are rewards too.',
      },
    ],
    realLife: [
      'Speech and prize-giving days.',
      'Thank-you notes.',
      'Awards in the community.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a short essay: “Why I will always do good.”',
        'Include one reward you hope for.',
        'Read it to the class.',
      ],
    },
  },
  'rme-11': {
    indicator: {
      code: 'B4.5.1.1.1',
      text: 'Explain authority at home, school and in the community.',
    },
    hook: 'Who makes the rules where you live and learn? These people have authority.',
    explain: [
      'Authority is the right to lead, give instructions and make decisions.',
      'At home, parents and elders have authority. At school, the headteacher, teachers and prefects do.',
      'In the community, chiefs and assembly members lead, and pastors, imams and traditional priests lead in religion.',
    ],
    art: {
      kind: 'scroll',
      title: 'People in authority',
      lines: [
        'Home: parents and elders',
        'School: headteacher and teachers',
        'School: prefects',
        'Community: chiefs and assembly members',
        'Religion: pastors, imams, priests',
      ],
    },
    artCaption: 'Leaders at home, school and in the community.',
    words: [
      { term: 'Authority', meaning: 'The right to lead and make decisions.' },
      { term: 'Prefect', meaning: 'A pupil chosen to help lead others.' },
      {
        term: 'Assembly member',
        meaning: 'An elected leader in the district assembly.',
      },
    ],
    examples: [
      {
        title: 'Who decides?',
        situation: 'Who decides when your school closes for the day?',
        steps: ['It is a school rule.', 'The headteacher leads the school.'],
        answer: 'The headteacher.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking authority means bullying others.',
        right: 'Good leaders serve and protect the people they lead.',
      },
    ],
    realLife: ['Class prefects.', 'Chiefs at durbars.', 'Parents at home.'],
    tryIt: {
      need: 'Friends',
      steps: [
        'Act out a person in authority giving a fair instruction.',
        'Show how to obey politely.',
        'Discuss how it felt.',
      ],
    },
  },
  'rme-12': {
    indicator: {
      code: 'B4.5.2.1.1',
      text: 'Discuss the importance of being a committed member of the family.',
    },
    hook: 'Every family needs members who care and help. What does a committed family member do?',
    explain: [
      'A committed family member takes part in family activities, obeys elders and respects everyone.',
      'They do their duties without being reminded, and help needy relatives.',
      'This builds unity, earns respect and makes them trusted.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Grandfather', 'Grandmother'],
        ['Father', 'Mother', 'Aunt'],
        ['Me', 'Sister', 'Cousin'],
      ],
    },
    artCaption: 'Everyone has a part to play.',
    words: [
      { term: 'Committed', meaning: 'Loyal and dependable.' },
      {
        term: 'Initiative',
        meaning: 'Doing something helpful without being asked.',
      },
      { term: 'Relative', meaning: 'A member of your family.' },
    ],
    examples: [
      {
        title: 'Taking initiative',
        situation:
          'You notice the water barrel at home is empty. No one has asked you to fill it. What does a committed member do?',
        steps: ['Fill it, or tell an adult and offer to help.'],
        answer: 'Act without being asked.',
      },
    ],
    mistakes: [
      {
        wrong: 'Doing chores only when someone is watching.',
        right: 'Do your part every day.',
      },
    ],
    realLife: [
      'Family meetings.',
      'Helping at funerals and naming ceremonies.',
      'Sharing chores at home.',
    ],
    tryIt: {
      need: 'Your family',
      steps: [
        'Choose one new duty at home.',
        'Do it every day this week.',
        'Ask your family how it helped.',
      ],
    },
  },
}
