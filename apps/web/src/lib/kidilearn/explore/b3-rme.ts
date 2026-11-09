import type { CourseGuides } from './types'

// Basic 3 Religious and Moral Education, written for this course and scoped
// to the NaCCA RME Curriculum for Primary Schools (2019), for seven- and
// eight-year-olds. Notes:
// - The three major religions in Ghana are taught side by side, each in its
//   own terms, to build understanding, not to preach.
// - No picture shows God, a prophet or a religious leader; sacred texts are
//   named, not quoted.
// - The imported code for rme-01 is cut short (B3.1.1.1); the curriculum
//   prints B3.1.1.1.1.
// - The curriculum says God promised Abraham eternal life. The Bible and the
//   Qur'an tell of a promise to bless him and his family, so rme-12 says that.

export const guides: CourseGuides = {
  'rme-01': {
    indicator: {
      code: 'B3.1.1.1.1',
      text: 'Narrate the creation stories of the three main religions of Ghana.',
    },
    hook: 'Where did the world come from? Each religion in Ghana has its own creation story.',
    explain: [
      'Christians read in the Bible that God made the world in six days and rested on the seventh. God made Adam, then Eve.',
      'Muslims read in the Qur’an that Allah created the heavens and the earth. Allah made Adam from clay, and then Hawwa, his wife.',
      'In African Traditional Religion, many Ghanaian peoples tell that God, the Creator, made the sky, the earth, people and animals.',
    ],
    art: { kind: 'nature', label: 'The world around us' },
    artCaption: 'Each religion tells how the world began.',
    words: [
      { term: 'Creation', meaning: 'Everything that God made.' },
      { term: 'Creator', meaning: 'The one who made everything.' },
      { term: 'Story', meaning: 'An account passed on by telling or writing.' },
    ],
    examples: [
      {
        title: 'Why is God far away?',
        situation:
          'An Akan story tells why God lives high above the sky. What happened?',
        steps: [
          'Long ago, the story says, God lived close to people.',
          'An old woman pounding fufu kept hitting God with her pestle.',
          'So God moved up, far away.',
        ],
        answer: 'Stories like this explain the world in a memorable way.',
      },
    ],
    mistakes: [
      {
        wrong: 'Saying one religion’s story is silly.',
        right: 'Listen to each story with respect.',
      },
    ],
    realLife: [
      'Stories told by grandparents.',
      'Bible and Qur’an classes.',
      'Making things from clay, like the first people.',
    ],
    tryIt: {
      need: 'Clay, corn husks or palm fronds',
      steps: [
        'Make something from natural things.',
        'Give it a name.',
        'Tell the class how you made it.',
      ],
    },
  },
  'rme-02': {
    indicator: {
      code: 'B3.1.2.1.1',
      text: 'Demonstrate ways to care for the environment.',
    },
    hook: 'A clean, green environment keeps everyone healthy. What can you do to help?',
    explain: [
      'We can plant trees, put rubbish in bins and keep gutters clear.',
      'Mining must be legal and careful, so rivers stay clean. Galamsey destroys land and water.',
      'Grass and trees stop rain from washing the soil away. This washing away is called erosion.',
    ],
    art: {
      kind: 'scroll',
      title: 'Caring for the environment',
      lines: [
        'Plant trees',
        'Put rubbish in a bin',
        'Clear choked gutters',
        'Join clean-up days',
        'Say no to galamsey',
      ],
    },
    artCaption: 'Ways we can all help.',
    words: [
      { term: 'Erosion', meaning: 'When rain or wind carries soil away.' },
      { term: 'Dispose', meaning: 'Get rid of rubbish properly.' },
      { term: 'Clean-up', meaning: 'When people work together to clear dirt.' },
    ],
    examples: [
      {
        title: 'A choked gutter',
        situation:
          'The gutter near your school is full of plastic. What can happen when it rains?',
        steps: [
          'Water cannot flow away.',
          'It spills over and can flood the area.',
        ],
        answer: 'Clear the gutter and put plastic in a bin.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only grown-ups can care for the environment.',
        right: 'Children can plant trees and keep places clean too.',
      },
    ],
    realLife: [
      'Sweeping the classroom.',
      'Tree-planting days.',
      'Sorting rubbish for recycling.',
    ],
    tryIt: {
      need: 'A teacher and a broom',
      steps: [
        'Choose a small area of your school.',
        'Clean it with your group.',
        'Draw it before and after.',
      ],
    },
  },
  'rme-03': {
    indicator: {
      code: 'B3.1.3.1.1',
      text: 'Explain the purpose of God’s creation of humankind.',
    },
    hook: 'Why are people here on earth? The religions give their answers.',
    explain: [
      'Christians and Muslims teach that Adam was the first person God created.',
      'Christianity teaches that God made people to care for the earth and worship Him. Islam teaches that people are caretakers on earth who worship Allah.',
      'African Traditional Religion teaches that people should live in peace with God, the ancestors and their community.',
    ],
    art: {
      kind: 'worship',
      label: 'Each religion explains why people were made',
    },
    artCaption: 'Three religions, three answers.',
    words: [
      { term: 'Humankind', meaning: 'All people.' },
      {
        term: 'Caretaker',
        meaning: 'Someone trusted to look after something.',
      },
      { term: 'Ancestors', meaning: 'Family members who lived long ago.' },
    ],
    examples: [
      {
        title: 'Looking after',
        situation: 'If people are caretakers, what should they do for animals?',
        steps: [
          'Feed them.',
          'Give them water and shelter.',
          'Never be cruel to them.',
        ],
        answer: 'Look after them well.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking people may destroy whatever they like.',
        right: 'The religions teach we must care for creation.',
      },
    ],
    realLife: [
      'Feeding pets and farm animals.',
      'Worship at home and in the community.',
      'Helping neighbours.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write two things people can do to care for creation.',
        'Write one way people worship.',
        'Share with a partner.',
      ],
    },
  },
  'rme-04': {
    indicator: {
      code: 'B3.1.3.1.2',
      text: 'Give reasons for protecting God’s creation.',
    },
    hook: 'If we use up all the trees, water and animals, what will be left for our grandchildren?',
    explain: [
      'We depend on creation for food, medicine, shelter and air.',
      'Protecting creation keeps it for people who will live after us.',
      'The religions teach that caring for creation is a duty to God and a service to people.',
    ],
    art: { kind: 'nature', label: 'Creation we must protect' },
    artCaption: 'Rivers, trees and animals for the future.',
    words: [
      { term: 'Protect', meaning: 'Keep safe from harm.' },
      { term: 'Generation', meaning: 'People born around the same time.' },
      { term: 'Duty', meaning: 'Something we should do.' },
    ],
    examples: [
      {
        title: 'Cut one, plant two',
        situation:
          'A carpenter cuts a tree for wood. What can he do for the future?',
        steps: ['Plant new trees in its place.'],
        answer: 'Then there will be trees for the next generation.',
      },
    ],
    mistakes: [
      { wrong: 'Wasting water and food.', right: 'Use only what you need.' },
    ],
    realLife: [
      'Turning off taps.',
      'Planting trees.',
      'Not killing animals for fun.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw something in creation you want to protect.',
        'Write why it matters.',
        'Write one way to protect it.',
      ],
    },
  },
  'rme-05': {
    indicator: {
      code: 'B3.1.3.1.3',
      text: 'Explain the need for good relationships among people of different ethnic groups.',
    },
    hook: 'Ghana has many peoples, with different languages and customs. How can we all live well together?',
    explain: [
      'Ghana’s peoples include the Akan, Ewe, Ga-Adangme, Mole-Dagbani and Guan, and many more.',
      'Respect, kindness, humility and friendliness help people of every group get on well.',
      'Good relationships bring peace, unity and teamwork.',
    ],
    art: {
      kind: 'belts',
      belts: [
        { name: 'North', places: ['Mole-Dagbani', 'Gonja'] },
        { name: 'Middle', places: ['Akan', 'Guan'] },
        {
          name: 'South and east',
          places: ['Ga-Adangme', 'Ewe', 'Fante (Akan)'],
        },
      ],
    },
    artCaption: 'Some of Ghana’s peoples. We are all Ghanaians.',
    words: [
      {
        term: 'Ethnic group',
        meaning: 'People who share a language and customs.',
      },
      { term: 'Unity', meaning: 'Being together as one.' },
      { term: 'Humility', meaning: 'Not thinking you are better than others.' },
    ],
    examples: [
      {
        title: 'A new classmate',
        situation:
          'A new pupil speaks a different language from you. How can you make friends?',
        steps: [
          'Greet them and smile.',
          'Learn one word in their language.',
          'Invite them to play.',
        ],
        answer: 'Kindness builds friendship.',
      },
    ],
    mistakes: [
      {
        wrong: 'Making fun of someone’s language or customs.',
        right: 'Respect every group’s ways.',
      },
    ],
    realLife: [
      'Friends from different groups in class.',
      'Learning greetings in other languages.',
      'National festivals.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Learn “hello” in two Ghanaian languages.',
        'Teach a friend.',
        'Act out welcoming a new pupil.',
      ],
    },
  },
  'rme-06': {
    indicator: {
      code: 'B3.2.1.1.1',
      text: 'Name the sacred scriptures of the three major religions.',
    },
    hook: 'Each religion has sacred teachings. Some are written in books and some are passed on by word of mouth.',
    explain: [
      'Christianity’s sacred scripture is the Holy Bible. Psalm 23 is a well-known part.',
      'Islam’s sacred scripture is the Holy Qur’an. Muslims also learn from the Hadith, the sayings of the Prophet.',
      'African Traditional Religion has no written book. Its teachings live in myths, proverbs, parables and taboos.',
    ],
    art: {
      kind: 'scroll',
      title: 'Sacred teachings',
      lines: [
        'Christianity: the Bible',
        'Islam: the Qur’an and Hadith',
        'Traditional: myths and proverbs',
        'Traditional: parables and taboos',
      ],
    },
    artCaption: 'Each religion and its teachings.',
    words: [
      { term: 'Scripture', meaning: 'Sacred writings of a religion.' },
      {
        term: 'Hadith',
        meaning: 'Reports of what the Prophet Muhammad said and did.',
      },
      {
        term: 'Taboo',
        meaning: 'Something a tradition says must not be done.',
      },
    ],
    examples: [
      {
        title: 'Match them',
        situation: 'Which religion uses the Qur’an?',
        steps: ['The Qur’an belongs to Islam.'],
        answer: 'Islam.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking African Traditional Religion has no teachings.',
        right: 'Its teachings are passed on by word of mouth.',
      },
    ],
    realLife: [
      'Bible reading in church.',
      'Qur’an lessons in the madrasa.',
      'Proverbs told by elders.',
    ],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Ask a grown-up for a proverb.',
        'Write it down.',
        'Explain its lesson to the class.',
      ],
    },
  },
  'rme-07': {
    indicator: {
      code: 'B3.2.1.1.2',
      text: 'Give reasons for studying the sacred scriptures of the three major religions among their followers.',
    },
    hook: 'Why do people read and learn their sacred teachings again and again?',
    explain: [
      'Christians study the Bible and Muslims study the Qur’an to learn God’s messages and grow closer to God.',
      'Followers of African Traditional Religion learn myths, proverbs and taboos from elders, to keep the community’s wisdom.',
      'In every religion, the teachings help people know right from wrong.',
    ],
    art: { kind: 'worship', label: 'Learning in every religion' },
    artCaption: 'People study to live good lives.',
    words: [
      { term: 'Study', meaning: 'Learn carefully.' },
      { term: 'Wisdom', meaning: 'Knowing what is good and right.' },
      { term: 'Message', meaning: 'Something one person tells another.' },
    ],
    examples: [
      {
        title: 'A proverb’s lesson',
        situation: 'An elder tells a proverb about sharing. Why?',
        steps: [
          'Proverbs teach good behaviour.',
          'This one teaches you to share.',
        ],
        answer: 'To pass on wisdom.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking scriptures are only for grown-ups.',
        right:
          'Children learn from them too, in Sunday school, madrasa and stories.',
      },
    ],
    realLife: ['Sunday school.', 'Madrasa.', 'Stories by the fire.'],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Ask about a lesson they learned from their religion’s teachings.',
        'Write it in one sentence.',
        'Say how you can use it.',
      ],
    },
  },
  'rme-08': {
    indicator: {
      code: 'B3.2.2.1.1',
      text: 'Describe how various festivals are celebrated.',
    },
    hook: 'Drums, dancing, prayers and feasts! How do people in Ghana celebrate their festivals?',
    explain: [
      'Muslims celebrate Eid al-Fitr after the fast of Ramadan, and Eid al-Adha to remember Ibrahim’s sacrifice.',
      'Christians celebrate Christmas, Easter, Ash Wednesday and Pentecost.',
      'Traditional festivals include Aboakyer, Hogbetsotso, Adae, Fetu Afahye and Feok, with durbars, drumming and dancing.',
    ],
    art: {
      kind: 'belts',
      belts: [
        { name: 'North', places: ['Feok (Sandema)'] },
        { name: 'Middle', places: ['Adae (Akan towns)'] },
        {
          name: 'South',
          places: [
            'Aboakyer (Winneba)',
            'Fetu Afahye (Cape Coast)',
            'Hogbetsotso (Anloga)',
          ],
        },
      ],
    },
    artCaption: 'Some traditional festivals and where they are held.',
    words: [
      {
        term: 'Durbar',
        meaning: 'A gathering where chiefs meet their people.',
      },
      { term: 'Ramadan', meaning: 'The month when Muslims fast.' },
      {
        term: 'Pentecost',
        meaning: 'A Christian festival fifty days after Easter.',
      },
    ],
    examples: [
      {
        title: 'Aboakyer',
        situation: 'What happens at Aboakyer in Winneba?',
        steps: [
          'Two groups race to catch a live deer.',
          'The deer is presented to the chief.',
        ],
        answer: 'A deer hunt and celebration.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking all festivals are held on the same day.',
        right: 'Each festival has its own time.',
      },
    ],
    realLife: [
      'Christmas carols.',
      'Eid prayers in open grounds.',
      'Durbars of chiefs.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a scene from a festival you have seen.',
        'Label it.',
        'Tell the class what happened.',
      ],
    },
  },
  'rme-09': {
    indicator: {
      code: 'B3.2.2.1.2',
      text: 'Demonstrate the importance of religious festivals.',
    },
    hook: 'Festivals are fun, but they also have important purposes. What are they?',
    explain: [
      'Festivals help people remember important events, such as the birth of Jesus at Christmas or a people’s journey at Hogbetsotso.',
      'Muslims, Christians and followers of African Traditional Religion use festivals to give thanks and renew their faith.',
      'Festivals bring families together and help people make peace with each other.',
    ],
    art: {
      kind: 'scroll',
      title: 'Why festivals matter',
      lines: [
        'Remember the past',
        'Give thanks',
        'Renew faith',
        'Make peace',
        'Bring families together',
      ],
    },
    artCaption: 'More than a party.',
    words: [
      { term: 'Reconciliation', meaning: 'Making peace after a quarrel.' },
      { term: 'Renew', meaning: 'Make new or strong again.' },
      { term: 'Thanksgiving', meaning: 'Showing thanks.' },
    ],
    examples: [
      {
        title: 'Making peace',
        situation:
          'Two neighbours quarrelled. A festival is coming. What could happen?',
        steps: [
          'Festivals encourage forgiveness.',
          'They can greet and share food.',
        ],
        answer: 'They can make peace.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking festivals are only about food and clothes.',
        right: 'They are about faith, thanks and togetherness.',
      },
    ],
    realLife: [
      'Family reunions.',
      'Thanksgiving services.',
      'Chiefs settling quarrels at festival time.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Pick a festival.',
        'Act out one way it helps people.',
        'Say what it teaches.',
      ],
    },
  },
  'rme-10': {
    indicator: {
      code: 'B3.3.1.1.1',
      text: 'Describe the youthful lives of the leaders of the three major religions in Ghana.',
    },
    hook: 'Before they became great leaders, they worked hard as young people. What jobs did they do?',
    explain: [
      'Christians read in the Bible that Jesus worked as a carpenter in Nazareth.',
      'Muslims teach that the young Prophet Muhammad, peace be upon him, was an honest trader who led caravans.',
      'In African Traditional Religion, Fante traditions remember Egya Ahor as a farmer who served his people.',
    ],
    art: { kind: 'worship', label: 'Stories of leaders in each religion' },
    artCaption: 'Each religion tells of its leaders.',
    words: [
      { term: 'Carpenter', meaning: 'Someone who makes things from wood.' },
      { term: 'Trader', meaning: 'Someone who buys and sells goods.' },
      {
        term: 'Caravan',
        meaning: 'A group of travellers with camels carrying goods.',
      },
    ],
    examples: [
      {
        title: 'Which job?',
        situation: 'Which leader worked with wood?',
        steps: ['A carpenter works with wood.', 'Jesus was a carpenter.'],
        answer: 'Jesus.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking great people never did ordinary work.',
        right: 'They worked hard, just like our parents.',
      },
    ],
    realLife: [
      'Carpenters in our towns.',
      'Traders in the market.',
      'Farmers growing our food.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the job of each leader.',
        'Write one job you would like to do.',
        'Say how you will work hard at it.',
      ],
    },
  },
  'rme-11': {
    indicator: {
      code: 'B3.3.1.1.2',
      text: 'Identify and explain the moral lessons of the youthful life of the religious leaders.',
    },
    hook: 'What can we learn from how these leaders lived when they were young?',
    explain: [
      'From Jesus the carpenter, Christians learn the value of hard work.',
      'From the Prophet Muhammad, the honest trader, Muslims learn honesty and patience.',
      'From Egya Ahor in African Traditional Religion, people learn courage and sacrifice for others.',
    ],
    art: {
      kind: 'scroll',
      title: 'Lessons for us',
      lines: [
        'Work hard',
        'Be honest',
        'Be patient',
        'Be brave',
        'Never give up',
      ],
    },
    artCaption: 'Good habits from great lives.',
    words: [
      { term: 'Perseverance', meaning: 'Not giving up when things are hard.' },
      { term: 'Sacrifice', meaning: 'Giving up something for others.' },
      { term: 'Patience', meaning: 'Waiting calmly.' },
    ],
    examples: [
      {
        title: 'Honest trading',
        situation:
          'You sell oranges for your mother. A buyer pays too much by mistake. What do you do?',
        steps: ['Count the money.', 'Give back the extra.'],
        answer: 'Honesty, like the young Prophet.',
      },
    ],
    mistakes: [
      {
        wrong: 'Giving up when work is hard.',
        right: 'Keep going. That is perseverance.',
      },
    ],
    realLife: [
      'Doing chores well.',
      'Telling the truth in trade.',
      'Standing up for others.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Choose a lesson: hard work, honesty or courage.',
        'Act out a short scene.',
        'Say how you will practise it.',
      ],
    },
  },
  'rme-12': {
    indicator: {
      code: 'B3.4.1.1.1',
      text: 'Discuss God’s promises to humankind.',
    },
    hook: 'A promise is something you say you will do. The religions teach that God makes promises too.',
    explain: [
      'Christians and Muslims both honour Abraham, called Ibrahim in Islam. They teach that God called him and promised to bless him and his family.',
      'They both tell how God called Moses, called Musa in Islam, from a burning bush, and promised to be with him.',
      'In African Traditional Religion, people believe God blesses those who keep the community’s laws and taboos.',
    ],
    art: { kind: 'worship', label: 'God’s promises in each religion' },
    artCaption: 'Each religion teaches about God’s promises.',
    words: [
      { term: 'Promise', meaning: 'Saying you will surely do something.' },
      { term: 'Call', meaning: 'When God asks someone to do special work.' },
      { term: 'Bless', meaning: 'Do good to someone.' },
    ],
    examples: [
      {
        title: 'Moses’ work',
        situation: 'What work did God call Moses to do?',
        steps: [
          'Moses’ people were slaves in Egypt.',
          'God called him to lead them to freedom.',
        ],
        answer: 'To lead his people out of Egypt.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Abraham and Ibrahim are two different people.',
        right:
          'They are the same person, named differently in English and Arabic.',
      },
    ],
    realLife: [
      'Keeping promises to friends.',
      'Stories at church and mosque.',
      'Elders teaching taboos.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Act out the call of Moses.',
        'Talk about how Moses felt.',
        'Say what he did next.',
      ],
    },
  },
  'rme-13': {
    indicator: {
      code: 'B3.4.1.1.2',
      text: 'Identify the benefits of responding to God’s call.',
    },
    hook: 'People answer God’s call by praying and helping others. What good comes from it?',
    explain: [
      'People respond to God’s call by praying, serving others, caring for the environment and helping people in need.',
      'Christianity, Islam and African Traditional Religion teach that this brings God’s blessings and draws people closer to God.',
      'Helping others also brings peace and friendship.',
    ],
    art: { kind: 'worship', label: 'Answering God’s call' },
    artCaption: 'Prayer and service in each religion.',
    words: [
      { term: 'Respond', meaning: 'Answer.' },
      { term: 'Charity', meaning: 'Helping people in need.' },
      { term: 'Service', meaning: 'Work done to help others.' },
    ],
    examples: [
      {
        title: 'Four ways',
        situation: 'Name four ways to respond to God’s call.',
        steps: [
          'Pray.',
          'Serve others.',
          'Care for the environment.',
          'Help the needy.',
        ],
        answer: 'Prayer, service, care and charity.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only adults can serve others.',
        right: 'Children can help too, in small ways.',
      },
    ],
    realLife: ['Visiting the sick.', 'Giving to the poor.', 'Helping at home.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write four benefits of helping others.',
        'Do one kind act this week.',
        'Tell the class about it.',
      ],
    },
  },
  'rme-14': {
    indicator: {
      code: 'B3.4.1.1.3',
      text: 'Identify moral lessons learnt from responding to God’s call.',
    },
    hook: 'When Abraham and Moses answered God’s call, what did they show us?',
    explain: [
      'Abraham left his home when God called him. This teaches obedience and trust.',
      'Moses was afraid, but he went to Pharaoh anyway. This teaches courage and commitment.',
      'Answering a call also teaches humility, respect for God and keeping promises.',
    ],
    art: {
      kind: 'scroll',
      title: 'Answering God’s call',
      lines: ['Obedience', 'Trust', 'Courage', 'Humility', 'Keeping promises'],
    },
    artCaption: 'Good values to live by.',
    words: [
      { term: 'Obedience', meaning: 'Doing what you are rightly asked.' },
      { term: 'Reverence', meaning: 'Deep respect, especially for God.' },
      { term: 'Commitment', meaning: 'Sticking to what you promised.' },
    ],
    examples: [
      {
        title: 'Be like Moses',
        situation:
          'You are afraid to tell the truth about a broken cup. What would courage look like?',
        steps: ['Admit what happened.', 'Say sorry.'],
        answer: 'Telling the truth even when afraid.',
      },
    ],
    mistakes: [
      {
        wrong: 'Obeying only when someone is watching.',
        right: 'Do right even when no one sees.',
      },
    ],
    realLife: [
      'Obeying parents and teachers.',
      'Keeping promises.',
      'Being brave to do right.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Choose one lesson.',
        'Act out a scene at home or school that shows it.',
        'Ask the class to guess the lesson.',
      ],
    },
  },
  'rme-15': {
    indicator: {
      code: 'B3.4.2.1.1',
      text: 'Explain the need to live in harmony with one another.',
    },
    hook: 'Harmony is when people live and work together peacefully. Why does it matter?',
    explain: [
      'Living in harmony brings peace and unity at home, at school and in the community.',
      'It helps keep law and order, so everyone is safe.',
      'Sharing, respect, truthfulness and forgiveness help us live in harmony.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'stand', x: 160, kit: 1 },
        { pose: 'walk', x: 320, kit: 2 },
        { pose: 'reach', x: 480, kit: 3 },
      ],
      sun: true,
      label: 'Living together in peace',
    },
    artCaption: 'Peace at home, school and in the community.',
    words: [
      { term: 'Harmony', meaning: 'Living together peacefully.' },
      {
        term: 'Forgive',
        meaning: 'Stop being angry with someone who hurt you.',
      },
      {
        term: 'Law and order',
        meaning: 'When people follow rules and stay safe.',
      },
    ],
    examples: [
      {
        title: 'A quarrel',
        situation:
          'Two friends want the same ball. How can they stay in harmony?',
        steps: ['Talk calmly.', 'Take turns.'],
        answer: 'Sharing keeps the peace.',
      },
    ],
    mistakes: [
      {
        wrong: 'Fighting to settle a quarrel.',
        right: 'Talk it out, or ask a grown-up to help.',
      },
    ],
    realLife: [
      'Taking turns in games.',
      'Sharing food at home.',
      'Saying sorry and forgiving.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'List three things that bring harmony in class.',
        'Make a class poster.',
        'Practise them this week.',
      ],
    },
  },
}
