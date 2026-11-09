import type { CourseGuides } from './types'

// Basic 1 Religious and Moral Education, written for this course and scoped
// to the NaCCA RME Curriculum for Primary Schools (2019), for five- and
// six-year-olds. Notes:
// - As the curriculum asks, the three major religions in Ghana (Christianity,
//   Islam and African Traditional Religion) are taught side by side, each in
//   its own terms ("Christians believe…"), to build understanding and
//   tolerance, not to preach.
// - No picture shows God, a prophet or a religious leader. Sacred texts are
//   named, not quoted, so the narrator never recites them.
// - The curriculum lists Damba as a traditional festival; it marks the birth
//   of the Prophet Muhammad with Dagomba traditions, and the guide says so.
// - African Traditional Religion has no single founder. The guide says this
//   rather than give it a birth story, and tells Akan traditions about the
//   priest Okomfo Anokye as traditions.

export const guides: CourseGuides = {
  'rme-01': {
    indicator: { code: 'B1.1.1.1.1', text: 'Explore God’s creation.' },
    hook: 'Look around you. The sky, the trees, the animals and people. Who made them all?',
    explain: [
      'Christians, Muslims and followers of African Traditional Religion all believe that God created the world.',
      'They believe God made everything, and gives us air, water and food.',
      'So we care for the world and say thank you.',
    ],
    art: { kind: 'nature', label: 'The world around us' },
    artCaption: 'Sky, land, water, plants, animals and people.',
    words: [
      { term: 'Create', meaning: 'Make something new.' },
      { term: 'Creator', meaning: 'The one who makes something.' },
      { term: 'Creation', meaning: 'Everything that was made.' },
    ],
    examples: [
      {
        title: 'What do we need?',
        situation: 'What do we need every day to live?',
        steps: [
          'We need air to breathe.',
          'We need water to drink.',
          'We need food to eat.',
        ],
        answer: 'The three religions teach that God gives us these things.',
      },
    ],
    mistakes: [
      {
        wrong: 'Wasting food and water.',
        right: 'Use them well and say thank you.',
      },
    ],
    realLife: [
      'Saying grace before meals.',
      'Caring for plants and animals.',
      'Keeping our surroundings clean.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Go outside with a grown-up.',
        'Look at the sky, plants and animals.',
        'Draw your favourite thing in nature.',
      ],
    },
  },
  'rme-02': {
    indicator: {
      code: 'B1.1.1.1.2',
      text: 'Mention the names of some of the things God created.',
    },
    hook: 'Can you name ten things in the world around you? Let us try!',
    explain: [
      'In the sky, there are the sun, moon and stars.',
      'On land, there are mountains, trees, animals and people.',
      'In the water, there are rivers, the sea and fish.',
    ],
    art: { kind: 'nature', label: 'Sky, land and water' },
    artCaption: 'Point to the sun, trees, river and fish.',
    words: [
      { term: 'Sky', meaning: 'The space above us.' },
      { term: 'Land', meaning: 'The ground we walk on.' },
      { term: 'Sea', meaning: 'A very big body of salty water.' },
    ],
    examples: [
      {
        title: 'Sort them',
        situation: 'Where do these belong: a fish, a star and a goat?',
        steps: [
          'A fish lives in water.',
          'A star is in the sky.',
          'A goat lives on land.',
        ],
        answer: 'Water, sky and land.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking people made the sun and the sea.',
        right:
          'People make cars and houses. The religions teach that God made the sun and the sea.',
      },
    ],
    realLife: [
      'Walking to school.',
      'Visiting the beach.',
      'Looking at the night sky.',
    ],
    tryIt: {
      need: 'Paper, crayons and old magazines',
      steps: [
        'Fold your paper into three: sky, land and water.',
        'Draw or stick pictures in each part.',
        'Name everything you drew.',
      ],
    },
  },
  'rme-03': {
    indicator: { code: 'B1.1.1.1.3', text: 'Examine some attributes of God.' },
    hook: 'If you could describe God in one word, what would it be? Loving? Kind?',
    explain: [
      'The three religions in Ghana describe God as loving, kind, patient and merciful.',
      'Christians say God. Muslims say Allah. In African Traditional Religion, Akan people say Onyame and Ewe people say Mawu.',
      'We can show love, kindness and patience to others too.',
    ],
    art: {
      kind: 'scroll',
      title: 'God is…',
      lines: ['Loving', 'Kind', 'Patient', 'Merciful', 'Truthful'],
    },
    artCaption: 'Words the three religions use to describe God.',
    words: [
      { term: 'Attribute', meaning: 'A quality, such as kind or patient.' },
      { term: 'Merciful', meaning: 'Ready to forgive.' },
      { term: 'Patient', meaning: 'Able to wait calmly.' },
    ],
    examples: [
      {
        title: 'Being kind like God',
        situation: 'Your friend falls and cries. How can you show kindness?',
        steps: [
          'Help your friend up.',
          'Say kind words.',
          'Tell a teacher if they are hurt.',
        ],
        answer: 'Helping shows kindness.',
      },
    ],
    mistakes: [
      {
        wrong: 'Laughing when someone makes a mistake.',
        right: 'Be patient and kind, as we learn God is.',
      },
    ],
    realLife: [
      'Sharing at home.',
      'Helping a friend at school.',
      'Visiting someone who is sick.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Act out helping a friend who is sad.',
        'Act out sharing your snack.',
        'Say which good quality you showed.',
      ],
    },
  },
  'rme-04': {
    indicator: {
      code: 'B1.2.1.1.1',
      text: 'Name the three main types of worship in Ghana.',
    },
    hook: 'People in Ghana worship in different ways. Do you know the three main ones?',
    explain: [
      'Christians worship in a church. They pray, sing and read the Bible.',
      'Muslims worship in a mosque. They pray five times a day and read the Qur’an.',
      'In African Traditional Religion, people pray through the ancestors, often at shrines.',
    ],
    art: { kind: 'worship' },
    artCaption: 'A church, a mosque and a shrine.',
    words: [
      { term: 'Worship', meaning: 'Showing love and respect to God.' },
      { term: 'Pray', meaning: 'Talk to God.' },
      {
        term: 'Religion',
        meaning: 'A way of believing in and worshipping God.',
      },
    ],
    examples: [
      {
        title: 'Where do they worship?',
        situation: 'Where do Muslims gather for Friday prayers?',
        steps: ['Muslims pray together at the mosque on Fridays.'],
        answer: 'At the mosque.',
      },
    ],
    mistakes: [
      {
        wrong: 'Making fun of how other people worship.',
        right: 'Respect every religion’s way of worship.',
      },
    ],
    realLife: [
      'Church on Sundays.',
      'Friday prayers at the mosque.',
      'Festivals with traditional prayers.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a church, a mosque and a shrine.',
        'Say who worships in each.',
        'Tell a friend one thing you learned.',
      ],
    },
  },
  'rme-05': {
    indicator: {
      code: 'B1.2.1.1.2',
      text: 'Recite religious passages and sing religious songs.',
    },
    hook: 'Every religion has special words and songs. Do you know one from your family?',
    explain: [
      'Many Christians learn the Lord’s Prayer and Psalm 23.',
      'Muslims recite Al-Fātiḥah, the opening chapter of the Qur’an, in every prayer.',
      'In African Traditional Religion, people use proverbs, songs and prayers for the ancestors.',
    ],
    art: {
      kind: 'worship',
      label: 'Each religion has special words and songs',
    },
    artCaption: 'Prayers, songs and sayings are part of worship.',
    words: [
      { term: 'Recite', meaning: 'Say words from memory.' },
      { term: 'Passage', meaning: 'A part of a holy book.' },
      { term: 'Proverb', meaning: 'A short, wise saying.' },
    ],
    examples: [
      {
        title: 'Listening well',
        situation:
          'A classmate says a prayer from another religion. What do you do?',
        steps: ['Sit still and listen quietly.', 'Do not laugh or talk.'],
        answer: 'Listening shows respect.',
      },
    ],
    mistakes: [
      {
        wrong: 'Talking while others pray.',
        right: 'Keep quiet and respectful.',
      },
    ],
    realLife: [
      'Morning assembly.',
      'Worship with family.',
      'Festivals and celebrations.',
    ],
    tryIt: {
      need: 'A grown-up in your family',
      steps: [
        'Ask them to teach you a prayer, song or proverb.',
        'Learn it by heart.',
        'Share what it means with your class.',
      ],
    },
  },
  'rme-06': {
    indicator: {
      code: 'B1.2.2.1.1',
      text: 'Describe religious festivals in Ghana.',
    },
    hook: 'Festivals bring food, music and joy. Which festivals do you celebrate?',
    explain: [
      'Christians celebrate Christmas and Easter. Muslims celebrate Eid al-Fitr and Eid al-Adha.',
      'Traditional festivals include Homowo, Odwira, Hogbetsotso and Fetu Afahye.',
      'Damba marks the birth of the Prophet Muhammad with Dagomba traditions.',
    ],
    art: {
      kind: 'scroll',
      title: 'Festivals in Ghana',
      lines: [
        'Christian: Christmas, Easter',
        'Muslim: Eid al-Fitr, Eid al-Adha',
        'Ga: Homowo. Ewe: Hogbetsotso',
        'Akan: Odwira, Fetu Afahye',
        'Dagomba: Damba',
      ],
    },
    artCaption: 'Each religion has its own festivals.',
    words: [
      { term: 'Festival', meaning: 'A special time of celebration.' },
      { term: 'Celebrate', meaning: 'Do something happy for a special day.' },
      { term: 'Eid', meaning: 'A Muslim festival.' },
    ],
    examples: [
      {
        title: 'Which religion?',
        situation: 'Easter is a festival of which religion?',
        steps: ['Christians celebrate Easter.'],
        answer: 'Christianity.',
      },
      {
        title: 'A Ga festival',
        situation: 'Which festival do the Ga people celebrate?',
        steps: ['The Ga celebrate Homowo.'],
        answer: 'Homowo.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only one religion has festivals.',
        right: 'All three religions have festivals.',
      },
    ],
    realLife: [
      'Christmas at home.',
      'Eid with neighbours.',
      'Homowo, Odwira and other festivals in towns.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw your favourite festival.',
        'Say which religion or people celebrate it.',
        'Tell how people celebrate it.',
      ],
    },
  },
  'rme-07': {
    indicator: {
      code: 'B1.3.1.1.1',
      text: 'Narrate the stories of the birth of religious leaders.',
    },
    hook: 'Every religion has stories about its great leaders. Let us hear how two of them were born.',
    explain: [
      'Christians believe Jesus was born in Bethlehem to Mary, and laid in a manger.',
      'Muslims believe the Prophet Muhammad, peace be upon him, was born in Makkah.',
      'African Traditional Religion has no single founder. Its leaders are priests, chiefs and elders.',
    ],
    art: {
      kind: 'worship',
      label: 'Three religions, each with its own stories',
    },
    artCaption: 'Each religion tells the stories of its leaders.',
    words: [
      { term: 'Leader', meaning: 'A person who guides others.' },
      { term: 'Prophet', meaning: 'A person who brings God’s message.' },
      { term: 'Founder', meaning: 'The person who starts something.' },
    ],
    examples: [
      {
        title: 'A traditional story',
        situation: 'Who is a famous priest in Akan traditions?',
        steps: [
          'Akan traditions tell of Okomfo Anokye.',
          'They say he was born at Awukugua in Akuapem.',
        ],
        answer: 'Okomfo Anokye.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up the stories of different religions.',
        right: 'Each religion tells its own stories. Listen carefully to each.',
      },
    ],
    realLife: [
      'Christmas tells of the birth of Jesus.',
      'Many Muslims mark the Prophet’s birthday.',
      'Elders tell stories of great ancestors.',
    ],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Ask a grown-up to tell you a story about a religious leader.',
        'Draw a picture of a place in the story.',
        'Retell the story to a friend.',
      ],
    },
  },
  'rme-08': {
    indicator: {
      code: 'B1.4.1.1.1',
      text: 'Identify the role of the individual members of the family.',
    },
    hook: 'Everyone in a family has a job. What jobs do you do at home?',
    explain: [
      'Parents give the family food, a home, care and schooling.',
      'Children help with chores and run errands.',
      'When everyone helps, the home is happy.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Grandparents'],
        ['Father', 'Mother'],
        ['Me', 'Brother', 'Sister'],
      ],
    },
    artCaption: 'Everyone in the family helps.',
    words: [
      {
        term: 'Family',
        meaning: 'The people we live with and are related to.',
      },
      { term: 'Chore', meaning: 'A small job at home.' },
      { term: 'Errand', meaning: 'A short trip to get something for someone.' },
    ],
    examples: [
      {
        title: 'Helping at home',
        situation: 'Your mother is cooking. How can you help?',
        steps: [
          'Fetch water.',
          'Wash the plates.',
          'Set out the mats or table.',
        ],
        answer: 'Small jobs help a lot.',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaving all the work to grown-ups.',
        right: 'Children can help too.',
      },
    ],
    realLife: [
      'Sweeping the compound.',
      'Running errands.',
      'Caring for younger children.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw the people in your family.',
        'Write one job each person does.',
        'Choose a new job to help with this week.',
      ],
    },
  },
  'rme-09': {
    indicator: {
      code: 'B1.4.1.1.2',
      text: 'Explain the role of the community in the upbringing of its members.',
    },
    hook: 'A Ghanaian saying tells us that one person alone cannot raise a child. Who helps us grow?',
    explain: [
      'Our community is the people who live around us.',
      'Teachers teach us. Elders give advice. Nurses keep us well.',
      'Neighbours and religious leaders help us learn good ways.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'stand', x: 120, kit: 1 },
        { pose: 'walk', x: 260, kit: 2 },
        { pose: 'stand', x: 400, kit: 3, facing: -1 },
        { pose: 'stand', x: 530, kit: 0, facing: -1 },
      ],
      label: 'Our community helps us grow',
    },
    artCaption: 'Many people help a child grow.',
    words: [
      { term: 'Community', meaning: 'The people who live around us.' },
      { term: 'Elder', meaning: 'An older person we respect.' },
      { term: 'Advice', meaning: 'Help about what to do.' },
    ],
    examples: [
      {
        title: 'Who helps?',
        situation: 'You are sick. Who in the community can help?',
        steps: ['A nurse or doctor at the clinic.'],
        answer: 'Health workers.',
      },
    ],
    mistakes: [
      {
        wrong: 'Being rude to elders and neighbours.',
        right: 'Greet and respect the people who help you.',
      },
    ],
    realLife: [
      'Teachers at school.',
      'Nurses at the clinic.',
      'Elders at home.',
    ],
    tryIt: {
      need: 'A grown-up',
      steps: [
        'Name three people in your community who help you.',
        'Say how each one helps.',
        'Thank one of them this week.',
      ],
    },
  },
}
