import type { CourseGuides } from './types'

// Basic 2 Religious and Moral Education, written for this course and scoped
// to the NaCCA RME Curriculum for Primary Schools (2019), for six- and
// seven-year-olds. Notes:
// - As in Basic 1, the three major religions in Ghana are taught side by
//   side, each in its own terms, to build understanding, not to preach.
//   Reasons for worship and commitment are given as what the religions teach.
// - No picture shows God, a prophet or a religious leader; sacred texts are
//   named, not quoted.
// - Of the traditional leaders the curriculum names, the guides tell only of
//   Okomfo Anokye and Egya Ahor, as traditions.

export const guides: CourseGuides = {
  'rme-01': {
    indicator: {
      code: 'B2.1.1.1.1',
      text: 'Mention attributes of God that reveal His nature as Sustainer of life.',
    },
    hook: 'Rain falls, the sun shines and plants grow. Who keeps the world going?',
    explain: [
      'A sustainer is someone who keeps something alive and going.',
      'Christians, Muslims and followers of African Traditional Religion believe God sustains life. They say God gives rain, sunshine, air and food.',
      'Ghanaian languages have names for God too, such as Onyankopon in Akan and Mawu in Ewe.',
    ],
    art: { kind: 'nature', label: 'Rain, sunshine, air and plants' },
    artCaption: 'Everything we need to live.',
    words: [
      { term: 'Sustainer', meaning: 'One who keeps life going.' },
      { term: 'Attribute', meaning: 'A quality, such as kind or caring.' },
      { term: 'Provide', meaning: 'Give what is needed.' },
    ],
    examples: [
      {
        title: 'Rain and crops',
        situation: 'Why do farmers in Ghana thank God when the rain comes?',
        steps: ['Rain helps crops to grow.', 'Crops give us food.'],
        answer: 'Many farmers believe God sends the rain that feeds us.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to be thankful for food and water.',
        right: 'Say thank you, and do not waste them.',
      },
    ],
    realLife: [
      'Saying grace before meals.',
      'Thanksgiving services and harvest festivals.',
      'Caring for plants at home.',
    ],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Ask a grown-up what God is called in your home language.',
        'Ask what the name means.',
        'Share it with your class.',
      ],
    },
  },
  'rme-02': {
    indicator: {
      code: 'B2.1.2.1.1',
      text: 'Explain the importance of the environment.',
    },
    hook: 'Some things around us were made by people. Others were not. Can you tell which is which?',
    explain: [
      'Trees, rivers, stones and animals are natural. The religions teach that God made them.',
      'Buildings, cars, tables and chairs are made by people, from natural things like wood and stone.',
      'The environment gives us air, food, water and shelter. We need it to live.',
    ],
    art: { kind: 'nature', label: 'Our environment' },
    artCaption: 'Air, water, plants and animals keep us alive.',
    words: [
      { term: 'Environment', meaning: 'Everything around us.' },
      { term: 'Natural', meaning: 'Not made by people.' },
      { term: 'Shelter', meaning: 'A place that keeps us safe, like a house.' },
    ],
    examples: [
      {
        title: 'Made from nature',
        situation:
          'A wooden chair is made by people. What natural thing is it made from?',
        steps: ['Wood comes from trees.'],
        answer: 'From a tree.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking we do not need trees and rivers.',
        right: 'We need them for food, water, air and shelter.',
      },
    ],
    realLife: [
      'Drinking clean water.',
      'Eating food from farms.',
      'Resting in the shade of a tree.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Walk around your school with a teacher.',
        'List five natural things and five things people made.',
        'Say what each made thing is made from.',
      ],
    },
  },
  'rme-03': {
    indicator: {
      code: 'B2.1.2.1.2',
      text: 'Demonstrate human activities that destroy the environment.',
    },
    hook: 'When rivers turn brown and forests disappear, people and animals suffer. What causes this?',
    explain: [
      'Cutting down too many trees, illegal mining called galamsey, and throwing rubbish in rivers harm the environment.',
      'These activities make the land dry, the water dirty and the weather harsher.',
      'The religions teach us to care for creation. We can plant trees and keep water clean.',
    ],
    art: {
      kind: 'scroll',
      title: 'Harmful activities',
      lines: [
        'Cutting down too many trees',
        'Galamsey (illegal mining)',
        'Rubbish in rivers and gutters',
        'Burning bushes',
        'Dirty streets',
      ],
    },
    artCaption: 'Things that hurt the environment.',
    words: [
      {
        term: 'Galamsey',
        meaning: 'Illegal mining that damages land and rivers.',
      },
      { term: 'Pollution', meaning: 'Making air, land or water dirty.' },
      { term: 'Destroy', meaning: 'Damage badly.' },
    ],
    examples: [
      {
        title: 'The brown river',
        situation:
          'A river near a mining site has turned brown. What happened?',
        steps: ['Mud and chemicals from the mining went into it.'],
        answer: 'Galamsey polluted the river.',
      },
    ],
    mistakes: [
      {
        wrong: 'Throwing rubbish into gutters and rivers.',
        right: 'Put rubbish in a bin.',
      },
    ],
    realLife: [
      'Clean-up days.',
      'Tree-planting days.',
      'Keeping gutters clear.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a clean, safe environment.',
        'Draw an unsafe one.',
        'Say what people did to make each one.',
      ],
    },
  },
  'rme-04': {
    indicator: {
      code: 'B2.1.3.1.1',
      text: 'Explain the purpose of God’s creation.',
    },
    hook: 'Plants and animals are useful to us in many ways. How many can you think of?',
    explain: [
      'Plants give us food, medicine, wood and shade.',
      'Animals give us meat, milk, eggs and help with work.',
      'The religions teach that God gave us plants and animals, and that we must care for them.',
    ],
    art: { kind: 'nature', label: 'Plants and animals help us' },
    artCaption: 'Trees for shade, animals for food and work.',
    words: [
      { term: 'Purpose', meaning: 'What something is for.' },
      { term: 'Useful', meaning: 'Helpful.' },
      {
        term: 'Medicine',
        meaning: 'Something that helps sick people get better.',
      },
    ],
    examples: [
      {
        title: 'A useful tree',
        situation: 'How does a mango tree help us?',
        steps: ['It gives us fruit to eat.', 'It gives shade on hot days.'],
        answer: 'Food and shade.',
      },
    ],
    mistakes: [
      { wrong: 'Being cruel to animals.', right: 'Treat animals kindly.' },
    ],
    realLife: [
      'Eggs and milk for breakfast.',
      'Herbs used as medicine.',
      'Donkeys and bullocks that help farmers.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a useful plant.',
        'Draw a useful animal.',
        'Write how each helps people.',
      ],
    },
  },
  'rme-05': {
    indicator: {
      code: 'B2.2.1.1.1',
      text: 'Explain the importance of worship.',
    },
    hook: 'People of all three religions in Ghana worship. Why do they think worship matters?',
    explain: [
      'Christians, Muslims and followers of African Traditional Religion teach that worship is a way to honour and thank God.',
      'Christians worship in churches, Muslims in mosques, and traditional worshippers at shrines and at home.',
      'Worship also brings people together as a family and a community.',
    ],
    art: { kind: 'worship' },
    artCaption: 'Places of worship in Ghana.',
    words: [
      { term: 'Worship', meaning: 'Showing love, respect and thanks to God.' },
      { term: 'Honour', meaning: 'Show great respect.' },
      { term: 'Community', meaning: 'People living and working together.' },
    ],
    examples: [
      {
        title: 'Together',
        situation: 'How does worship bring people together?',
        steps: [
          'People meet at the church, mosque or shrine.',
          'They pray, sing and share.',
        ],
        answer: 'They become friends and help each other.',
      },
    ],
    mistakes: [
      {
        wrong: 'Making noise near a place of worship.',
        right: 'Be quiet and respectful near any place of worship.',
      },
    ],
    realLife: [
      'Sunday church services.',
      'Friday prayers at the mosque.',
      'Traditional prayers at festivals.',
    ],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Ask how your family worships.',
        'Ask why it is important to them.',
        'Share one reason with your class.',
      ],
    },
  },
  'rme-06': {
    indicator: {
      code: 'B2.2.1.1.2',
      text: 'Sing and recite simple texts from the three main religions in Ghana.',
    },
    hook: 'Every religion has words and songs that people learn by heart. Which ones do you know?',
    explain: [
      'Christians often learn the Lord’s Prayer from the Bible.',
      'Muslims learn Al-Fātiḥah, the first chapter of the Qur’an.',
      'In African Traditional Religion, elders say prayers and pour libation, and people sing traditional songs.',
    ],
    art: { kind: 'worship', label: 'Prayers and songs in each religion' },
    artCaption: 'Each religion has its own words and songs.',
    words: [
      { term: 'Recite', meaning: 'Say from memory.' },
      {
        term: 'Libation',
        meaning:
          'Pouring a drink on the ground while praying, in traditional worship.',
      },
      { term: 'Verse', meaning: 'A short part of a holy book or song.' },
    ],
    examples: [
      {
        title: 'Learning by heart',
        situation: 'How can you learn a prayer or song by heart?',
        steps: [
          'Listen to a grown-up say it.',
          'Say it with them, a line at a time.',
          'Practise every day.',
        ],
        answer: 'Practice helps you remember.',
      },
    ],
    mistakes: [
      {
        wrong: 'Laughing at another religion’s prayers.',
        right: 'Listen quietly and respectfully.',
      },
    ],
    realLife: [
      'School assembly.',
      'Prayers at home.',
      'Festivals and ceremonies.',
    ],
    tryIt: {
      need: 'A grown-up in your family',
      steps: [
        'Learn a short prayer, song or proverb from your family.',
        'Write down one line of it.',
        'Share what it means.',
      ],
    },
  },
  'rme-07': {
    indicator: {
      code: 'B2.2.2.1.1',
      text: 'Demonstrate activities which take place during the celebration of festivals.',
    },
    hook: 'Festivals are full of music, food and visitors. What happens at a festival you know?',
    explain: [
      'Christians celebrate Christmas and Easter. Muslims celebrate Eid al-Fitr and Eid al-Adha.',
      'Traditional festivals include Kundum, Odwira, Bugum, Damba and yam festivals.',
      'At festivals, people worship, share food, dance and visit family.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'dance', x: 120, kit: 1 },
        { pose: 'dance', x: 320, kit: 2 },
        { pose: 'dance', x: 520, kit: 3 },
      ],
      sun: true,
      label: 'Music, dancing and sharing',
    },
    artCaption: 'Festivals bring people together.',
    words: [
      { term: 'Festival', meaning: 'A special time of celebration.' },
      { term: 'Reunion', meaning: 'When family members meet again.' },
      { term: 'Share', meaning: 'Give some of what you have to others.' },
    ],
    examples: [
      {
        title: 'Eid',
        situation: 'What do Muslims do at Eid al-Fitr?',
        steps: [
          'They pray together in the morning.',
          'They give food to people in need.',
          'They visit family and friends.',
        ],
        answer: 'Prayer, sharing and visiting.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking festivals are only for eating.',
        right: 'They are also for worship, sharing and family.',
      },
    ],
    realLife: [
      'Christmas with family.',
      'Eid with neighbours.',
      'Traditional festivals in towns and villages.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Choose a festival.',
        'Act out what happens at it.',
        'Draw your favourite part.',
      ],
    },
  },
  'rme-08': {
    indicator: {
      code: 'B2.3.1.1.1',
      text: 'Narrate the early lives of leaders of the three main religions in Ghana.',
    },
    hook: 'Great leaders were once children too. What do the religions tell us about their early lives?',
    explain: [
      'Christians learn from the Bible that Jesus grew up in Nazareth. At twelve, he listened to the teachers in the Temple and asked questions.',
      'Muslims teach that the Prophet Muhammad, peace be upon him, lost his parents young and grew up with his grandfather and uncle. People called him Al-Amīn, the trustworthy.',
      'In African Traditional Religion, Akan traditions tell of Okomfo Anokye, a wise priest who served his people.',
    ],
    art: {
      kind: 'worship',
      label: 'Each religion tells the stories of its leaders',
    },
    artCaption: 'Stories from three religions.',
    words: [
      { term: 'Early life', meaning: 'The time when someone was a child.' },
      { term: 'Trustworthy', meaning: 'Someone you can always rely on.' },
      {
        term: 'Tradition',
        meaning: 'A story or custom passed down by older people.',
      },
    ],
    examples: [
      {
        title: 'A helpful hero',
        situation: 'Which Fante hero do traditions honour?',
        steps: [
          'Fante traditions tell of Egya Ahor.',
          'They say he gave his life to save his people from a disease.',
        ],
        answer: 'Egya Ahor.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up the stories of different religions.',
        right: 'Each religion tells its own stories.',
      },
    ],
    realLife: [
      'Christmas stories.',
      'Stories told at the mosque.',
      'Stories elders tell at festivals.',
    ],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Ask a grown-up for a story about a religious leader’s childhood.',
        'Act out one part with friends.',
        'Say what you learned.',
      ],
    },
  },
  'rme-09': {
    indicator: {
      code: 'B2.3.1.1.2',
      text: 'Outline the moral lessons in the early lives of the religious leaders.',
    },
    hook: 'Stories of great leaders teach us how to live. What lessons can we learn?',
    explain: [
      'From Jesus in the Temple, we learn to respect teachers and love learning.',
      'From the Prophet Muhammad being called the trustworthy, we learn honesty.',
      'From traditional heroes, we learn courage and to serve our community.',
    ],
    art: {
      kind: 'scroll',
      title: 'Lessons we learn',
      lines: [
        'Respect teachers and elders',
        'Love learning',
        'Be honest',
        'Be brave',
        'Serve others',
      ],
    },
    artCaption: 'Good ways to live.',
    words: [
      {
        term: 'Moral lesson',
        meaning: 'Something a story teaches about right and wrong.',
      },
      { term: 'Honesty', meaning: 'Telling the truth.' },
      { term: 'Courage', meaning: 'Being brave.' },
    ],
    examples: [
      {
        title: 'Use the lesson',
        situation:
          'You find a pen that is not yours. What would a trustworthy person do?',
        steps: [
          'Find out whose it is.',
          'Give it back, or give it to the teacher.',
        ],
        answer: 'Return it. That is honesty.',
      },
    ],
    mistakes: [
      {
        wrong: 'Keeping things that are not yours.',
        right: 'Return them. Be trustworthy.',
      },
    ],
    realLife: [
      'Telling the truth at home.',
      'Listening to teachers.',
      'Helping people in need.',
    ],
    tryIt: {
      need: 'Friends',
      steps: [
        'Choose one lesson: honesty, respect or courage.',
        'Act out a short story that shows it.',
        'Say how you will use it this week.',
      ],
    },
  },
  'rme-10': {
    indicator: {
      code: 'B2.4.1.1.1',
      text: 'Identify things that families do to show their commitment to God.',
    },
    hook: 'Many families do things every day or every week to show their faith. What does yours do?',
    explain: [
      'Many Christian families have morning prayers and go to church, often on Sundays, and give offerings.',
      'Many Muslim families pray five times a day, fast in Ramadan, and give Zakat and Sadaqah.',
      'Families in African Traditional Religion pray, pour libation and keep festivals and sacred days.',
    ],
    art: { kind: 'worship', label: 'Families worship in different ways' },
    artCaption: 'Each religion has its own practices.',
    words: [
      {
        term: 'Commitment',
        meaning: 'Keeping a promise and staying faithful.',
      },
      {
        term: 'Zakat',
        meaning: 'Money Muslims give to people in need each year.',
      },
      { term: 'Offering', meaning: 'A gift given at worship.' },
    ],
    examples: [
      {
        title: 'How often?',
        situation: 'How many times a day do Muslims pray?',
        steps: ['Muslims pray five times each day.'],
        answer: 'Five times.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking every family worships the same way.',
        right: 'Families worship in different ways. Respect them all.',
      },
    ],
    realLife: [
      'Morning devotion at home.',
      'Fasting in Ramadan.',
      'Harvest and thanksgiving.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'List things your family does for worship.',
        'Say if they happen daily, weekly or sometimes.',
        'Share one with a friend.',
      ],
    },
  },
  'rme-11': {
    indicator: {
      code: 'B2.4.1.1.2',
      text: 'Explain the need for commitment to God.',
    },
    hook: 'Being committed means staying faithful, even when it is hard. Why do the religions ask for it?',
    explain: [
      'Commitment means keeping your promises and staying faithful.',
      'Christianity, Islam and African Traditional Religion all teach that God asks people to be faithful, and that faithfulness brings blessings.',
      'Being faithful also helps us become honest and reliable people.',
    ],
    art: { kind: 'worship', label: 'Staying faithful' },
    artCaption: 'Each religion asks its followers to be faithful.',
    words: [
      { term: 'Faithful', meaning: 'Loyal and true.' },
      { term: 'Blessing', meaning: 'A good gift from God.' },
      { term: 'Reliable', meaning: 'Someone others can count on.' },
    ],
    examples: [
      {
        title: 'Keeping a promise',
        situation:
          'You promised to help your grandmother on Saturday. A friend invites you to play. What do you do?',
        steps: ['Remember your promise.', 'Help your grandmother first.'],
        answer: 'Keeping promises shows commitment.',
      },
    ],
    mistakes: [
      {
        wrong: 'Making promises you do not keep.',
        right: 'Only promise what you will do, then do it.',
      },
    ],
    realLife: [
      'Going to worship regularly.',
      'Keeping promises to family.',
      'Doing your homework every day.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Talk about a promise you kept.',
        'Talk about how it felt.',
        'Make one small promise for this week and keep it.',
      ],
    },
  },
  'rme-12': {
    indicator: {
      code: 'B2.4.1.1.3',
      text: 'Describe factors that promote good relationships between children and their parents.',
    },
    hook: 'What makes a home happy? Love, respect and kind words help a lot!',
    explain: [
      'Children show respect by greeting parents, listening and obeying.',
      'Parents show love by caring, teaching and providing.',
      'Kind words, honesty and helping each other keep families close.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Father', 'Mother'],
        ['Me', 'Brother', 'Sister'],
      ],
    },
    artCaption: 'Love and respect keep a family close.',
    words: [
      { term: 'Relationship', meaning: 'How people get on with each other.' },
      { term: 'Respect', meaning: 'Treating someone as important.' },
      { term: 'Obey', meaning: 'Do what you are rightly asked.' },
    ],
    examples: [
      {
        title: 'Greeting',
        situation:
          'You wake up in the morning. How can you show respect to your parents?',
        steps: ['Greet them politely.', 'Ask how you can help.'],
        answer: 'Greetings and help show respect.',
      },
    ],
    mistakes: [
      {
        wrong: 'Answering parents rudely.',
        right: 'Speak politely, even when you disagree.',
      },
    ],
    realLife: [
      'Greeting family members.',
      'Helping with chores.',
      'Saying sorry and thank you.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write three kind things you can say at home.',
        'Use them this week.',
        'Notice how your family responds.',
      ],
    },
  },
  'rme-13': {
    indicator: {
      code: 'B2.4.2.1.1',
      text: 'Describe ways of promoting personal hygiene and safety in the community.',
    },
    hook: 'Clean bodies and clean surroundings keep sickness away. How do you keep clean and safe?',
    explain: [
      'Bath twice a day, brush your teeth morning and night, and cut your nails.',
      'Wash your hands with soap and water, especially before eating and after using the toilet.',
      'Help keep the community safe and clean with brooms, rakes and by clearing rubbish.',
    ],
    art: {
      kind: 'scroll',
      title: 'Keep clean and safe',
      lines: [
        'Bath twice a day',
        'Brush your teeth twice a day',
        'Wash hands with soap',
        'Cut your nails',
        'Keep the compound clean',
      ],
    },
    artCaption: 'Good habits keep us healthy.',
    words: [
      {
        term: 'Hygiene',
        meaning: 'Keeping yourself and your surroundings clean.',
      },
      { term: 'Germs', meaning: 'Tiny living things that can make us sick.' },
      { term: 'Safety', meaning: 'Being protected from harm.' },
    ],
    examples: [
      {
        title: 'Before eating',
        situation:
          'You come in from playing and lunch is ready. What should you do first?',
        steps: ['Wash your hands with soap and water.'],
        answer: 'Washing removes germs.',
      },
    ],
    mistakes: [
      {
        wrong: 'Washing hands with water only, quickly.',
        right: 'Use soap and rub your hands well.',
      },
    ],
    realLife: [
      'Washing hands at school.',
      'Cleaning the compound at home.',
      'Community clean-up days.',
    ],
    tryIt: {
      need: 'Soap and water',
      steps: [
        'Wash your hands while singing a short song.',
        'Check your nails.',
        'Help sweep your compound.',
      ],
    },
  },
}
