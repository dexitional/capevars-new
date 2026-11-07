import type { CourseGuides } from './types'

// Basic 1 History, written for this course and scoped to the NaCCA History of
// Ghana Curriculum for Primary Schools (2019), in very short sentences for
// six-year-olds. Lessons repeat their indicators up to three times; each
// repeat takes a new angle. Presidents are named, not pictured. Facts run to
// November 2026.

export const guides: CourseGuides = {
  'history-01': {
    indicator: {
      code: 'B1.1.1.1.1',
      text: 'Explain that history deals with past human activities.',
    },
    hook: 'Do you remember your first day at school? That day is now in the past. It is part of your history!',
    explain: [
      'History is about things people did in the past.',
      'The past can be yesterday, last year or a very long time ago.',
      'Your first day at school is part of your own history.',
    ],
    art: {
      kind: 'building',
      building: 'school',
      label: 'My first day at school is my history',
    },
    artCaption: 'Things that happened before today are history.',
    words: [
      { term: 'History', meaning: 'What people did in the past.' },
      { term: 'Past', meaning: 'The time before now.' },
      { term: 'Event', meaning: 'Something that happens.' },
    ],
    examples: [
      {
        title: 'Past or not?',
        situation: 'Is your last birthday in the past?',
        steps: [
          'Your last birthday has already happened.',
          'So it is in the past.',
        ],
        answer: 'Yes. It is part of your history.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking history is only about very old things.',
        right: 'Yesterday is history too.',
      },
    ],
    realLife: [
      'Your first day at school.',
      'Your last birthday party.',
      'A festival you went to.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw your first day at school.',
        'Show your drawing to a friend.',
        'Tell them what happened that day.',
      ],
    },
  },
  'history-02': {
    indicator: {
      code: 'B1.1.1.1.2',
      text: 'Describe how sources of historical evidence help us find out about past human activities.',
    },
    hook: 'How do you know how small you were as a baby? Photographs and stories can show you!',
    explain: [
      'A source is something that tells us about the past.',
      'Old photographs, birth certificates and stories from grandparents are sources.',
      'Birthdays and festivals also help us remember the past.',
    ],
    art: { kind: 'sources', items: ['photo', 'letter', 'brochure', 'drum'] },
    artCaption: 'These things tell us about the past.',
    words: [
      { term: 'Source', meaning: 'Something that tells us about the past.' },
      { term: 'Photograph', meaning: 'A picture taken with a camera.' },
      {
        term: 'Celebration',
        meaning: 'A happy time to remember something special.',
      },
    ],
    examples: [
      {
        title: 'Find the source',
        situation: 'How can you find out what you looked like as a baby?',
        steps: [
          'Look at your baby photographs.',
          'Ask your mother or grandmother.',
        ],
        answer: 'Photographs and family stories are sources.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only books tell us about the past.',
        right: 'Photographs and stories tell us too.',
      },
    ],
    realLife: [
      'Family photograph albums.',
      'Birthday parties.',
      'Festivals in your town.',
    ],
    tryIt: {
      need: 'Family photographs, with an adult',
      steps: [
        'Find a photograph of you as a baby.',
        'Find one of you now.',
        'Say how you have changed.',
      ],
    },
  },
  'history-03': {
    indicator: {
      code: 'B1.1.4.2.1',
      text: 'State the similarities and differences between the communities where learners live.',
    },
    hook: 'Every town and village has its own old places and its own story. What is special about yours?',
    explain: [
      'A community is the place where you live, and the people who live there.',
      'Communities have old places, such as a chief’s palace, an old church or a forest grove.',
      'Some communities are alike in some ways and different in others.',
    ],
    art: {
      kind: 'building',
      building: 'palace',
      label: 'Old places tell a community’s story',
    },
    artCaption: 'A chief’s palace is an old place in many towns.',
    words: [
      {
        term: 'Community',
        meaning: 'The place where you live and its people.',
      },
      { term: 'Same', meaning: 'Alike in some way.' },
      { term: 'Different', meaning: 'Not alike.' },
    ],
    examples: [
      {
        title: 'Same or different?',
        situation:
          'Your town has a market. Your friend’s village has a market too. Is that the same or different?',
        steps: ['Both places have a market.'],
        answer: 'That is the same.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking your community has no history.',
        right: 'Every community has a story.',
      },
    ],
    realLife: [
      'The chief’s palace.',
      'An old church or mosque.',
      'The market in your town.',
    ],
    tryIt: {
      need: 'An adult to walk with',
      steps: [
        'Walk around your community with an adult.',
        'Find one old place.',
        'Draw it and tell the class about it.',
      ],
    },
  },
  'history-04': {
    indicator: {
      code: 'B1.2.3.1.1',
      text: 'Explain why, in the past, Ghana was known as the Gold Coast.',
    },
    hook: 'Long ago, our country had a different name: the Gold Coast. Why?',
    explain: [
      'Long ago, people from Portugal came to our coast. They found a lot of gold here.',
      'They called it “the coast of the mine”. Later, the English called it the Gold Coast.',
      'The name came from the gold found in our land.',
    ],
    art: {
      kind: 'goods',
      items: ['gold'],
      label: 'Gold gave the Gold Coast its name',
    },
    artCaption: 'Our land has a lot of gold.',
    words: [
      { term: 'Gold', meaning: 'A shiny yellow metal that is very valuable.' },
      { term: 'Coast', meaning: 'Where the land meets the sea.' },
      { term: 'Name', meaning: 'What something is called.' },
    ],
    examples: [
      {
        title: 'Why “Gold”?',
        situation: 'Why was the country called the Gold Coast?',
        steps: ['There was a lot of gold.', 'It was by the sea, on the coast.'],
        answer: 'Because of the gold found by the coast.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghana was always called Ghana.',
        right: 'It was once called the Gold Coast.',
      },
    ],
    realLife: [
      'Gold mines in Ghana today.',
      'Gold jewellery.',
      'The gold colour in our flag.',
    ],
    tryIt: {
      need: 'Yellow crayons and paper',
      steps: [
        'Draw the sea and the land.',
        'Draw shiny gold on the land.',
        'Write “Gold Coast” on your picture.',
      ],
    },
  },
  'history-05': {
    indicator: {
      code: 'B1.2.3.1.2',
      text: 'Recall when the name Ghana came into formal use.',
    },
    hook: 'On a special day, our country got a new name and a new flag. Which day was it?',
    explain: [
      'On 6 March 1957, our country became free. It was called Ghana from that day.',
      'The name Ghana comes from a great old kingdom in West Africa.',
      'Dr J. B. Danquah suggested the name.',
    ],
    art: { kind: 'flag', label: 'Ghana, from 6 March 1957' },
    artCaption: 'A new name and a new flag.',
    words: [
      { term: 'Ghana', meaning: 'The name of our country since 1957.' },
      { term: 'Independence', meaning: 'Being free to rule ourselves.' },
      {
        term: 'Flag',
        meaning: 'A cloth with colours that stands for a country.',
      },
    ],
    examples: [
      {
        title: 'When?',
        situation: 'On which day did our country become Ghana?',
        steps: ['It became free on 6 March 1957.'],
        answer: '6 March 1957.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the name Ghana came from a person.',
        right: 'It came from a great old kingdom.',
      },
    ],
    realLife: [
      'Independence Day on 6 March.',
      'Marching on Independence Day.',
      'Singing the national anthem.',
    ],
    tryIt: {
      need: 'Red, gold and green crayons',
      steps: [
        'Draw the flag of Ghana.',
        'Write “6 March 1957” under it.',
        'Show it to your family.',
      ],
    },
  },
  'history-06': {
    indicator: {
      code: 'B1.2.5.1.1',
      text: 'Identify Ghanaians of diverse fields who have contributed significantly to national development.',
    },
    hook: 'Who made our flag? Who wrote famous songs? Some Ghanaians did special things for our country.',
    explain: [
      'Theodosia Okoh designed the flag of Ghana. Amon Kotei designed our coat of arms.',
      'Ephraim Amu wrote many famous songs. Baba Yara was a great footballer.',
      'Kofi Antubam was an artist. Kow Ansah made films.',
    ],
    art: { kind: 'flag', label: 'Theodosia Okoh designed our flag' },
    artCaption: 'Red, gold, green and a black star.',
    words: [
      { term: 'Design', meaning: 'Plan how something will look.' },
      { term: 'Composer', meaning: 'A person who writes music.' },
      { term: 'Artist', meaning: 'A person who makes pictures or other art.' },
    ],
    examples: [
      {
        title: 'Match them',
        situation: 'Who designed the flag of Ghana?',
        steps: ['Theodosia Okoh designed the flag.'],
        answer: 'Theodosia Okoh.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only presidents help the country.',
        right: 'Artists, sports stars and musicians help too.',
      },
    ],
    realLife: [
      'The flag at your school.',
      'The Baba Yara Stadium in Kumasi.',
      'Songs sung in church and at school.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Think of what you want to be when you grow up.',
        'Draw yourself doing it.',
        'Tell the class how you will help Ghana.',
      ],
    },
  },
  'history-07': {
    indicator: {
      code: 'B1.3.1.1.1',
      text: 'Explore which Europeans came to Ghana.',
    },
    hook: 'Long ago, people sailed from Europe to our coast in big ships. Who were they?',
    explain: [
      'The first Europeans to come were from Portugal. They came in 1471.',
      'Later, people came from Britain, the Netherlands, Denmark, Sweden, Germany and France.',
      'They came to trade for gold.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1471', 'The Portuguese arrive'],
        ['Later', 'Other Europeans come'],
      ],
    },
    artCaption: 'The Portuguese came first.',
    words: [
      {
        term: 'Europe',
        meaning: 'A part of the world far to the north of Ghana.',
      },
      { term: 'Ship', meaning: 'A big boat that sails on the sea.' },
      { term: 'Trade', meaning: 'Buying and selling things.' },
    ],
    examples: [
      {
        title: 'Who came first?',
        situation: 'Which Europeans came to our coast first?',
        steps: ['They came in 1471.', 'They were from Portugal.'],
        answer: 'The Portuguese.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only one group of Europeans came.',
        right: 'People came from many countries in Europe.',
      },
    ],
    realLife: [
      'Old castles on our coast.',
      'Ships at the harbour.',
      'Visitors from other countries.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a big ship on the sea.',
        'Draw people on the coast waving.',
        'Write “1471” on your picture.',
      ],
    },
  },
  'history-08': {
    indicator: {
      code: 'B1.6.1.1.1',
      text: 'Identify the Presidents Ghana has had since 1960.',
    },
    hook: 'A President leads our country. Do you know who Ghana’s first President was?',
    explain: [
      'Kwame Nkrumah was Ghana’s first President, from 1960.',
      'Later Presidents were Edward Akufo-Addo, Hilla Limann, Jerry John Rawlings, John Agyekum Kufuor and John Evans Atta Mills.',
      'Then came John Dramani Mahama and Nana Addo Dankwa Akufo-Addo. John Dramani Mahama became President again in 2025.',
    ],
    art: { kind: 'flag', label: 'The President leads our country' },
    artCaption: 'Our Presidents serve all of Ghana.',
    words: [
      { term: 'President', meaning: 'The leader of our country.' },
      { term: 'Lead', meaning: 'Guide and look after others.' },
      { term: 'First', meaning: 'Before all the others.' },
    ],
    examples: [
      {
        title: 'Who was first?',
        situation: 'Who was Ghana’s first President?',
        steps: [
          'Ghana got its first President in 1960.',
          'It was Kwame Nkrumah.',
        ],
        answer: 'Kwame Nkrumah.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghana has only had one President.',
        right: 'Ghana has had many Presidents.',
      },
    ],
    realLife: [
      'The President on television.',
      'Pictures of the President at school.',
      'Voting for a President.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the name of Ghana’s first President.',
        'Write the name of today’s President.',
        'Ask an adult which President they remember.',
      ],
    },
  },
  'history-09': {
    indicator: {
      code: 'B1.1.1.1.1',
      text: 'Explain that history deals with past human activities: yesterday, today and tomorrow.',
    },
    hook: 'Yesterday is the past. Today is now. Tomorrow is the future. Which one is history?',
    explain: [
      'Yesterday is in the past. Things that happened yesterday are history.',
      'Today is now. Tomorrow is the future.',
      'Today will become history tomorrow!',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['Yesterday', 'The past'],
        ['Today', 'Now'],
        ['Tomorrow', 'The future'],
      ],
      focus: 0,
    },
    artCaption: 'The past comes before now.',
    words: [
      { term: 'Yesterday', meaning: 'The day before today.' },
      { term: 'Today', meaning: 'This day.' },
      { term: 'Tomorrow', meaning: 'The day after today.' },
    ],
    examples: [
      {
        title: 'Sort the days',
        situation: 'You ate rice yesterday. Is that history?',
        steps: ['Yesterday is in the past.'],
        answer: 'Yes. It is history.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking tomorrow is history.',
        right: 'Tomorrow is the future. History is the past.',
      },
    ],
    realLife: [
      'What you did yesterday.',
      'What you are doing today.',
      'Plans for tomorrow.',
    ],
    tryIt: {
      need: 'Paper folded into three parts',
      steps: [
        'Draw what you did yesterday.',
        'Draw what you are doing today.',
        'Draw what you will do tomorrow.',
      ],
    },
  },
  'history-10': {
    indicator: {
      code: 'B1.1.1.1.2',
      text: 'Describe how sources of historical evidence help us find out about the past: our class birthday chart.',
    },
    hook: 'When is your birthday? A class birthday chart keeps a record of all our birthdays.',
    explain: [
      'A record is something written down to remember.',
      'A birthday chart records the day each child was born.',
      'Records help us remember the past.',
    ],
    art: { kind: 'calendar', month: 'March', days: 31, startsOn: 0, focus: 6 },
    artCaption: 'A calendar helps us remember special days.',
    words: [
      { term: 'Record', meaning: 'Something written down to remember.' },
      { term: 'Birthday', meaning: 'The day you were born.' },
      { term: 'Chart', meaning: 'A big sheet with information on it.' },
    ],
    examples: [
      {
        title: 'Use the chart',
        situation: 'Ama’s birthday is on the 6th. How can the class remember?',
        steps: [
          'Write it on the birthday chart.',
          'Look at the chart every week.',
        ],
        answer: 'The chart is a record that helps us remember.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking we will always remember without writing.',
        right: 'Writing it down helps us remember.',
      },
    ],
    realLife: ['Birth certificates.', 'Calendars at home.', 'Class registers.'],
    tryIt: {
      need: 'A big sheet of paper',
      steps: [
        'Write your name and birthday on a card.',
        'Put all the class cards in order.',
        'Hang the chart in your classroom.',
      ],
    },
  },
  'history-11': {
    indicator: {
      code: 'B1.1.4.2.1',
      text: 'State the similarities and differences between communities: town and village.',
    },
    hook: 'Some children live in big towns. Some live in small villages. How are they alike, and how are they different?',
    explain: [
      'A town has many people, roads and shops.',
      'A village has fewer people. It may have farms all around.',
      'Both have homes, families and old places to visit.',
    ],
    art: { kind: 'thenNow', rows: ['home', 'travel'] },
    artCaption: 'Homes and travel can differ between places.',
    words: [
      { term: 'Town', meaning: 'A big place with many people.' },
      { term: 'Village', meaning: 'A small place with fewer people.' },
      { term: 'Alike', meaning: 'The same in some way.' },
    ],
    examples: [
      {
        title: 'Spot the difference',
        situation: 'Which has more cars, a big town or a small village?',
        steps: ['A town has more people and roads.'],
        answer: 'A big town usually has more cars.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking towns are better than villages.',
        right: 'Both are good places to live.',
      },
    ],
    realLife: [
      'Visiting family in a village.',
      'Going to the market in town.',
      'Seeing farms on a journey.',
    ],
    tryIt: {
      need: 'Paper folded in half',
      steps: [
        'Draw a town on one side.',
        'Draw a village on the other side.',
        'Say one thing that is the same.',
      ],
    },
  },
  'history-12': {
    indicator: {
      code: 'B1.2.3.1.1',
      text: 'Explain why, in the past, Ghana was known as the Gold Coast: the old kingdom of Ghana.',
    },
    hook: 'Long, long ago, there was a great kingdom called Ghana. Our country is named after it.',
    explain: [
      'Long ago, there was a rich kingdom called Ghana. It was far to the north-west of our country.',
      'It traded a lot of gold.',
      'When our country became free, we took the name of this great kingdom.',
    ],
    art: {
      kind: 'goods',
      items: ['gold', 'salt', 'cloth'],
      label: 'The old kingdom of Ghana traded gold',
    },
    artCaption: 'Gold, salt and cloth were traded long ago.',
    words: [
      { term: 'Kingdom', meaning: 'A land ruled by a king or queen.' },
      { term: 'Rich', meaning: 'Having a lot of money or valuable things.' },
      { term: 'Ancient', meaning: 'From a very long time ago.' },
    ],
    examples: [
      {
        title: 'Why this name?',
        situation: 'Why did we name our country Ghana?',
        steps: [
          'Ghana was a great old kingdom.',
          'We wanted a proud African name.',
        ],
        answer: 'To remember a great African kingdom.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the old kingdom was in the same place as Ghana today.',
        right: 'It was further north-west.',
      },
    ],
    realLife: [
      'Our country’s name.',
      'Stories about kings and queens.',
      'Gold jewellery.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a king or queen of long ago.',
        'Give them gold jewellery.',
        'Write “Ghana” on your picture.',
      ],
    },
  },
  'history-13': {
    indicator: {
      code: 'B1.2.3.1.2',
      text: 'Recall when the name Ghana came into formal use: Independence Day.',
    },
    hook: 'Every year on 6 March, we march, sing and wave flags. What are we celebrating?',
    explain: [
      'On 6 March 1957, the Gold Coast became free and was named Ghana.',
      'Every year, we celebrate this day. It is Independence Day.',
      'Children march, sing and wave the flag of Ghana.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'walk', x: 200, kit: 0 },
        { pose: 'walk', x: 320, kit: 2 },
        { pose: 'walk', x: 440, kit: 1 },
      ],
      label: 'Marching on Independence Day',
    },
    artCaption: 'We celebrate our freedom every year.',
    words: [
      { term: 'Celebrate', meaning: 'Do something happy for a special day.' },
      { term: 'March', meaning: 'Walk together in step.' },
      { term: 'Freedom', meaning: 'Being free.' },
    ],
    examples: [
      {
        title: 'Which day?',
        situation: 'On which day do we celebrate Independence Day?',
        steps: ['Ghana became free on 6 March 1957.'],
        answer: 'On 6 March, every year.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Independence Day is in December.',
        right: 'It is on 6 March.',
      },
    ],
    realLife: [
      'Independence Day parades.',
      'Flags on 6 March.',
      'Singing the national anthem.',
    ],
    tryIt: {
      need: 'Friends and a paper flag',
      steps: [
        'Make a paper flag of Ghana.',
        'March with your friends.',
        'Sing a song about Ghana.',
      ],
    },
  },
  'history-14': {
    indicator: {
      code: 'B1.2.5.1.1',
      text: 'Identify Ghanaians who have contributed to national development: music and sport.',
    },
    hook: 'Some Ghanaians made beautiful music. Some were amazing at sport. Let us meet two of them.',
    explain: [
      'Ephraim Amu wrote songs in Ghanaian languages. We still sing them today.',
      'Baba Yara was a famous footballer. He was so fast on the wing that people called him a king.',
      'The big stadium in Kumasi is named after Baba Yara.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'kick', x: 320, kit: 0 }],
      balls: [[396, 292]],
      label: 'Football stars make Ghana proud',
    },
    artCaption: 'Sport stars inspire us.',
    words: [
      { term: 'Musician', meaning: 'A person who makes music.' },
      { term: 'Footballer', meaning: 'A person who plays football.' },
      { term: 'Stadium', meaning: 'A big place where people watch sport.' },
    ],
    examples: [
      {
        title: 'Name the place',
        situation: 'Which stadium is named after Baba Yara?',
        steps: ['It is a big stadium in Kumasi.'],
        answer: 'The Baba Yara Stadium in Kumasi.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only famous people are special.',
        right: 'Everyone can do something good for Ghana.',
      },
    ],
    realLife: [
      'Songs you sing at school.',
      'Football matches on television.',
      'Playing football with friends.',
    ],
    tryIt: {
      need: 'Your class',
      steps: [
        'Learn a Ghanaian song.',
        'Sing it together.',
        'Talk about what you love to do.',
      ],
    },
  },
  'history-15': {
    indicator: {
      code: 'B1.3.1.1.1',
      text: 'Explore which Europeans came to Ghana: their big ships.',
    },
    hook: 'How did Europeans get to our coast long ago? There were no aeroplanes!',
    explain: [
      'Long ago, there were no aeroplanes. People travelled across the sea in sailing ships.',
      'The wind blew the sails and pushed the ships along.',
      'The journey from Europe took many weeks.',
    ],
    art: { kind: 'thenNow', rows: ['travel', 'message'] },
    artCaption: 'Travel long ago and today.',
    words: [
      { term: 'Sail', meaning: 'A big cloth on a ship that catches the wind.' },
      { term: 'Journey', meaning: 'A trip from one place to another.' },
      { term: 'Week', meaning: 'Seven days.' },
    ],
    examples: [
      {
        title: 'Then and now',
        situation: 'How do people come to Ghana from Europe today?',
        steps: ['Long ago, by sailing ship.', 'Today, mostly by aeroplane.'],
        answer: 'Today they mostly fly in aeroplanes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking people always flew in aeroplanes.',
        right: 'Long ago, they sailed in ships.',
      },
    ],
    realLife: [
      'Ships at Tema and Takoradi harbours.',
      'Aeroplanes in the sky.',
      'Canoes on the sea.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Fold a paper boat.',
        'Float it on water.',
        'Blow on it like the wind.',
      ],
    },
  },
  'history-16': {
    indicator: {
      code: 'B1.6.1.1.1',
      text: 'Identify the Presidents Ghana has had since 1960: what a President does.',
    },
    hook: 'What does a President do all day? A President has a very big job!',
    explain: [
      'The President leads the government of Ghana.',
      'The President works to keep Ghana safe and to help its people.',
      'Grown-ups vote to choose the President.',
    ],
    art: { kind: 'ballot', label: 'Grown-ups vote to choose the President' },
    artCaption: 'Voting chooses our leaders.',
    words: [
      {
        term: 'Government',
        meaning: 'The people who lead and run the country.',
      },
      { term: 'Vote', meaning: 'Choose by marking a paper.' },
      { term: 'Safe', meaning: 'Free from danger.' },
    ],
    examples: [
      {
        title: 'Who chooses?',
        situation: 'How does Ghana choose its President?',
        steps: [
          'Grown-ups go to vote.',
          'The person with the most votes wins.',
        ],
        answer: 'By voting in an election.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the President can do everything alone.',
        right: 'Many people help the President lead.',
      },
    ],
    realLife: [
      'Election day.',
      'The President on the news.',
      'Class prefects chosen by voting.',
    ],
    tryIt: {
      need: 'Your class',
      steps: [
        'Choose a class helper by voting.',
        'Each child votes once.',
        'Count the votes together.',
      ],
    },
  },
  'history-17': {
    indicator: {
      code: 'B1.1.1.1.1',
      text: 'Explain that history deals with past human activities: my family’s story.',
    },
    hook: 'Your grandparents were once children too! What was life like when they were young?',
    explain: [
      'Your family has its own history.',
      'Your grandparents can tell you what life was like long ago.',
      'Their stories are part of your history too.',
    ],
    art: {
      kind: 'family',
      rows: [['Grandfather', 'Grandmother'], ['Father', 'Mother'], ['Me']],
    },
    artCaption: 'My family tree.',
    words: [
      {
        term: 'Family',
        meaning: 'The people you belong to, such as parents and grandparents.',
      },
      { term: 'Grandparent', meaning: 'Your mother’s or father’s parent.' },
      { term: 'Story', meaning: 'Words that tell what happened.' },
    ],
    examples: [
      {
        title: 'Ask a question',
        situation: 'What could you ask your grandmother?',
        steps: [
          'Ask what games she played as a child.',
          'Ask what her school was like.',
        ],
        answer: 'Her answers tell you about the past.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking old people have nothing to teach us.',
        right: 'They remember many things we can learn.',
      },
    ],
    realLife: [
      'Visiting grandparents.',
      'Family gatherings.',
      'Stories told at night.',
    ],
    tryIt: {
      need: 'A grandparent or older family member',
      steps: [
        'Ask them about a game they played as a child.',
        'Learn to play it.',
        'Teach it to a friend.',
      ],
    },
  },
  'history-18': {
    indicator: {
      code: 'B1.1.1.1.2',
      text: 'Describe how sources of historical evidence help us find out about the past: festivals.',
    },
    hook: 'At festivals, people dance, drum and dress up. Festivals also help us remember our history!',
    explain: [
      'A festival is a special time when people celebrate together.',
      'Many festivals remind people of things that happened long ago.',
      'Drums, songs and dances at festivals keep our history alive.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'dance', x: 200, kit: 2 },
        { pose: 'dance', x: 320, facing: -1, kit: 1 },
        { pose: 'dance', x: 440, kit: 0 },
      ],
      label: 'Festivals keep our history alive',
    },
    artCaption: 'Dancing at a festival.',
    words: [
      {
        term: 'Festival',
        meaning: 'A special time when people celebrate together.',
      },
      { term: 'Drum', meaning: 'An instrument you hit to make a beat.' },
      { term: 'Remember', meaning: 'Keep something in your mind.' },
    ],
    examples: [
      {
        title: 'Why celebrate?',
        situation: 'Why do towns hold festivals every year?',
        steps: ['To remember their history.', 'To be happy together.'],
        answer: 'Festivals help us remember and celebrate.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking festivals are only for fun.',
        right: 'They also teach us our history.',
      },
    ],
    realLife: [
      'Your town’s festival.',
      'Drumming and dancing.',
      'Festival clothes.',
    ],
    tryIt: {
      need: 'A grown-up to ask',
      steps: [
        'Ask about a festival in your town.',
        'Ask what it helps people remember.',
        'Draw the festival.',
      ],
    },
  },
  'history-19': {
    indicator: {
      code: 'B1.1.4.2.1',
      text: 'State the similarities and differences between communities: our special places.',
    },
    hook: 'Some places in a community are very special. People look after them carefully. Why?',
    explain: [
      'Some places are special because they are very old.',
      'A sacred grove is a forest that people protect.',
      'Old places help us remember our community’s history.',
    ],
    art: {
      kind: 'building',
      building: 'palace',
      label: 'Special places in our community',
    },
    artCaption: 'We look after old and special places.',
    words: [
      { term: 'Special', meaning: 'Very important.' },
      { term: 'Protect', meaning: 'Keep safe.' },
      { term: 'Grove', meaning: 'A small forest.' },
    ],
    examples: [
      {
        title: 'Why look after it?',
        situation: 'Why do people protect an old grove?',
        steps: [
          'It is part of their history.',
          'They want it to last for their children.',
        ],
        answer: 'To keep their history safe.',
      },
    ],
    mistakes: [
      {
        wrong: 'Throwing litter at special places.',
        right: 'Keep special places clean and safe.',
      },
    ],
    realLife: [
      'A sacred grove near your town.',
      'An old tree in your town.',
      'The chief’s palace.',
    ],
    tryIt: {
      need: 'An adult',
      steps: [
        'Find out about a special place in your community.',
        'Ask why it is special.',
        'Draw it.',
      ],
    },
  },
  'history-20': {
    indicator: {
      code: 'B1.2.3.1.1',
      text: 'Explain why, in the past, Ghana was known as the Gold Coast: gold today.',
    },
    hook: 'Is there still gold in Ghana today? Yes! Ghana is one of the biggest gold producers in Africa.',
    explain: [
      'Gold is still found in Ghana today.',
      'People work in mines to dig out the gold.',
      'Gold is sold to other countries, which helps Ghana earn money.',
    ],
    art: {
      kind: 'goods',
      items: ['gold', 'cowries'],
      label: 'Gold, from long ago until today',
    },
    artCaption: 'Gold has always been part of Ghana’s story.',
    words: [
      {
        term: 'Mine',
        meaning: 'A place where people dig things out of the ground.',
      },
      { term: 'Miner', meaning: 'A person who works in a mine.' },
      { term: 'Valuable', meaning: 'Worth a lot of money.' },
    ],
    examples: [
      {
        title: 'Still gold?',
        situation: 'Is gold still found in Ghana?',
        steps: ['Yes. People still mine gold today.'],
        answer: 'Yes. Ghana still produces gold.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking all the gold is gone.',
        right: 'Ghana still produces a lot of gold.',
      },
    ],
    realLife: [
      'Gold mines in towns like Obuasi and Tarkwa.',
      'Gold jewellery.',
      'Ghana’s gold colour in the flag.',
    ],
    tryIt: {
      need: 'Paper and yellow crayons',
      steps: [
        'Draw a miner digging.',
        'Draw gold in the ground.',
        'Say why gold is valuable.',
      ],
    },
  },
}
