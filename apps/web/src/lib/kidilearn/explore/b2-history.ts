import type { CourseGuides } from './types'

// Basic 2 History, written for this course and scoped to the NaCCA History of
// Ghana Curriculum for Primary Schools (2019), in very short sentences for
// seven-year-olds. The course has four indicators, each repeated five times,
// so each repeat takes a new angle. The slave site at Assin Manso is
// explained gently, as a place of remembrance.

export const guides: CourseGuides = {
  'history-01': {
    indicator: {
      code: 'B2.2.1.1.1',
      text: 'Identify the ethnic groups in each region in Ghana.',
    },
    hook: 'Ghana has 16 regions. In each region live different peoples. Which people live in your region?',
    explain: [
      'Ghana is divided into 16 regions. Each region has a capital town.',
      'Different ethnic groups live in different regions.',
      'For example, many Ewe live in the Volta Region. Many Ga live in the Greater Accra Region.',
    ],
    art: {
      kind: 'belts',
      belts: [
        {
          name: 'North',
          places: ['Dagomba', 'Mamprusi', 'Gonja', 'Dagaaba', 'Frafra'],
        },
        { name: 'Middle', places: ['Asante', 'Bono', 'Guan'] },
        { name: 'South', places: ['Ga', 'Ewe', 'Fante', 'Nzema', 'Akyem'] },
      ],
    },
    artCaption: 'Some of the peoples of Ghana, from north to south.',
    words: [
      { term: 'Region', meaning: 'A big part of the country.' },
      {
        term: 'Ethnic group',
        meaning: 'People who share a language and customs.',
      },
      { term: 'Capital', meaning: 'The main town of a region or country.' },
    ],
    examples: [
      {
        title: 'Match them',
        situation: 'In which region do many Ga people live?',
        steps: ['The Ga live around Accra.'],
        answer: 'The Greater Accra Region.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only one people lives in each region.',
        right: 'Many peoples live together in every region.',
      },
    ],
    realLife: [
      'Your region and its capital.',
      'Languages you hear around you.',
      'Friends from other regions.',
    ],
    tryIt: {
      need: 'An adult to ask',
      steps: [
        'Find out which region you live in.',
        'Find out its capital.',
        'Name one people who live there.',
      ],
    },
  },
  'history-02': {
    indicator: {
      code: 'B2.2.4.1.1',
      text: 'Discuss the history of Ghana’s major historical locations.',
    },
    hook: 'Some places in Ghana are very old and very important. They tell us stories about the past.',
    explain: [
      'A historical location is a place where important things happened long ago.',
      'In Kumasi, there is a military museum inside an old fort, and the Komfo Anokye Sword.',
      'In Yendi, there is the Gbewaa Palace. At Assin Manso, people go to remember those taken away long ago.',
    ],
    art: {
      kind: 'building',
      building: 'fort',
      coast: false,
      label: 'The Kumasi military museum is in an old fort',
    },
    artCaption: 'Old places tell us stories.',
    words: [
      { term: 'Historical', meaning: 'About the past.' },
      { term: 'Location', meaning: 'A place.' },
      {
        term: 'Museum',
        meaning: 'A place where old things are kept for people to see.',
      },
    ],
    examples: [
      {
        title: 'Where is it?',
        situation: 'In which town is the Gbewaa Palace?',
        steps: ['It is the palace of the king of Dagbon.', 'It is in Yendi.'],
        answer: 'Yendi.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking old places are not important.',
        right: 'They help us learn our history.',
      },
    ],
    realLife: [
      'School trips to museums.',
      'Pictures of old places on television.',
      'Old places in your town.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Choose one historical place.',
        'Draw it.',
        'Write one thing you know about it.',
      ],
    },
  },
  'history-03': {
    indicator: {
      code: 'B2.2.5.1.1',
      text: 'Identify Ghanaian women who have made significant contributions to national development.',
    },
    hook: 'Who was Ghana’s first woman pilot? Who was the first woman Chief Justice? Let us meet some great women.',
    explain: [
      'Many Ghanaian women have done great things for our country.',
      'Melody Danquah was Ghana’s first woman pilot. Georgina Wood was Ghana’s first woman Chief Justice.',
      'Joyce Bamford-Addo was the first woman Speaker of Parliament. Elizabeth Ohene was the first woman editor of the Daily Graphic.',
    ],
    art: { kind: 'flag', label: 'Great Ghanaian women' },
    artCaption: 'Women have led in many ways.',
    words: [
      { term: 'Pilot', meaning: 'A person who flies an aeroplane.' },
      { term: 'Chief Justice', meaning: 'The top judge in Ghana.' },
      { term: 'First', meaning: 'Before anyone else.' },
    ],
    examples: [
      {
        title: 'Who was first?',
        situation: 'Who was Ghana’s first woman Chief Justice?',
        steps: [
          'The Chief Justice is the top judge.',
          'The first woman to do this job was Georgina Wood.',
        ],
        answer: 'Georgina Wood.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking some jobs are only for men.',
        right: 'Women can do any job.',
      },
    ],
    realLife: [
      'Women teachers and nurses.',
      'Women leaders in your town.',
      'Women on the news.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Think of a woman you admire.',
        'Tell your friend why.',
        'Draw her at her work.',
      ],
    },
  },
  'history-04': {
    indicator: {
      code: 'B2.3.2.1.1',
      text: 'Describe how early trade was carried out between Ghanaians and Europeans.',
    },
    hook: 'When Europeans came to our coast, they wanted gold. What did they give in return?',
    explain: [
      'Europeans came to our coast to trade.',
      'They brought cloth, iron bars, tobacco, gin, guns and gunpowder.',
      'Ghanaians gave gold and ivory in return. Swapping goods like this is called barter.',
    ],
    art: {
      kind: 'goods',
      items: ['cloth', 'iron', 'gold', 'cowries'],
      label: 'Goods were swapped at the coast',
    },
    artCaption: 'Europeans and Ghanaians swapped goods.',
    words: [
      { term: 'Trade', meaning: 'Buying, selling or swapping goods.' },
      { term: 'Barter', meaning: 'Swapping one thing for another.' },
      { term: 'Ivory', meaning: 'The hard white tusk of an elephant.' },
    ],
    examples: [
      {
        title: 'What was swapped?',
        situation: 'What did Ghanaians give the Europeans?',
        steps: ['The Europeans wanted gold.', 'They also wanted ivory.'],
        answer: 'Gold and ivory.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking people always used money.',
        right: 'Long ago, people often swapped goods.',
      },
    ],
    realLife: [
      'Buying and selling at the market.',
      'Swapping things with friends.',
      'Cloth sold in shops.',
    ],
    tryIt: {
      need: 'Some toys or pencils',
      steps: [
        'With a friend, swap one thing for another.',
        'Was it a fair swap?',
        'Talk about what barter means.',
      ],
    },
  },
  'history-05': {
    indicator: {
      code: 'B2.2.1.1.1',
      text: 'State the characteristics of the ethnic groups in Ghana: festivals.',
    },
    hook: 'Each people in Ghana has its own festival. Some celebrate harvest. Some remember a journey. Which festival do you know?',
    explain: [
      'The Ga celebrate Homowo. The Anlo Ewe celebrate Hogbetsotso.',
      'The Effutu of Winneba celebrate Aboakyer. The Asante celebrate Akwasidae.',
      'Festivals bring people together to remember and give thanks.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'dance', x: 200, kit: 2 },
        { pose: 'dance', x: 320, facing: -1, kit: 0 },
        { pose: 'dance', x: 440, kit: 1 },
      ],
      label: 'Dancing at a festival',
    },
    artCaption: 'Every people has its festivals.',
    words: [
      {
        term: 'Festival',
        meaning: 'A special time when people celebrate together.',
      },
      { term: 'Harvest', meaning: 'When crops are gathered from the farm.' },
      { term: 'Give thanks', meaning: 'Say thank you for good things.' },
    ],
    examples: [
      {
        title: 'Match the festival',
        situation: 'Which people celebrate Homowo?',
        steps: ['Homowo is a festival in Accra.', 'It belongs to the Ga.'],
        answer: 'The Ga.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking all peoples have the same festival.',
        right: 'Each people has its own festivals.',
      },
    ],
    realLife: [
      'A festival in your town.',
      'Festival songs and dances.',
      'Special festival food.',
    ],
    tryIt: {
      need: 'An adult to ask',
      steps: [
        'Ask about your town’s festival.',
        'Ask what it celebrates.',
        'Draw it.',
      ],
    },
  },
  'history-06': {
    indicator: {
      code: 'B2.2.4.1.1',
      text: 'Discuss the history of major historical locations: the Komfo Anokye Sword.',
    },
    hook: 'In Kumasi, there is a sword stuck in the ground. A story says no one can pull it out!',
    explain: [
      'Okomfo Anokye was a famous priest who helped found the Asante kingdom.',
      'A story says he pushed a sword into the ground in Kumasi.',
      'The story says the sword must never be pulled out. It stands for the unity of the Asante.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['Long ago', 'Okomfo Anokye plants the sword'],
        ['Today', 'The sword is still in Kumasi'],
      ],
    },
    artCaption: 'The sword has stayed in the ground for hundreds of years.',
    words: [
      { term: 'Sword', meaning: 'A long metal blade.' },
      { term: 'Priest', meaning: 'A religious leader.' },
      { term: 'Unity', meaning: 'Being together as one.' },
    ],
    examples: [
      {
        title: 'What does it mean?',
        situation: 'What does the sword stand for?',
        steps: ['It was planted when the Asante came together.'],
        answer: 'It stands for the unity of the Asante.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking stories cannot teach us anything.',
        right: 'Stories carry history and lessons.',
      },
    ],
    realLife: [
      'Kumasi, where the sword is.',
      'Stories told by elders.',
      'Things that stand for unity, like our flag.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw the sword in the ground.',
        'Write “unity” under it.',
        'Tell the story to someone at home.',
      ],
    },
  },
  'history-07': {
    indicator: {
      code: 'B2.2.5.1.1',
      text: 'Identify Ghanaian women who have contributed to national development: Yaa Asantewaa.',
    },
    hook: 'More than 100 years ago, a brave Queen Mother led her people to defend the Golden Stool. Who was she?',
    explain: [
      'Yaa Asantewaa was the Queen Mother of Ejisu.',
      'In 1900, she led the Asante to fight to protect the Golden Stool.',
      'She is remembered for her great courage.',
    ],
    art: {
      kind: 'building',
      building: 'palace',
      label: 'Yaa Asantewaa, Queen Mother of Ejisu',
    },
    artCaption: 'A brave leader of her people.',
    words: [
      {
        term: 'Queen Mother',
        meaning: 'A woman leader who advises the chief.',
      },
      { term: 'Courage', meaning: 'Being brave.' },
      { term: 'Defend', meaning: 'Keep safe from attack.' },
    ],
    examples: [
      {
        title: 'Why remember her?',
        situation: 'Why do we remember Yaa Asantewaa?',
        steps: [
          'She was very brave.',
          'She led her people to protect the Golden Stool.',
        ],
        answer: 'Because of her courage.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only men led long ago.',
        right: 'Queen Mothers like Yaa Asantewaa were great leaders.',
      },
    ],
    realLife: [
      'Schools named after Yaa Asantewaa.',
      'Queen Mothers in our towns today.',
      'Being brave to do what is right.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw Yaa Asantewaa as a brave leader.',
        'Write one word about her.',
        'Tell the class why you chose that word.',
      ],
    },
  },
  'history-08': {
    indicator: {
      code: 'B2.3.2.1.1',
      text: 'Describe how early trade was carried out: the story of wax prints.',
    },
    hook: 'Many Ghanaians wear colourful printed cloth. Did you know that some of it first came by ship from Europe?',
    explain: [
      'Dutch traders brought wax print cloth to West Africa long ago.',
      'Ghanaians loved the bright colours and patterns.',
      'Today, wax print is part of Ghanaian dress. Ghanaians give the patterns their own names.',
    ],
    art: { kind: 'goods', items: ['wax'], label: 'Wax print cloth' },
    artCaption: 'Bright cloth came with trade.',
    words: [
      { term: 'Cloth', meaning: 'Material for making clothes.' },
      { term: 'Pattern', meaning: 'Shapes and colours that repeat.' },
      { term: 'Dutch', meaning: 'People from the Netherlands.' },
    ],
    examples: [
      {
        title: 'Where from?',
        situation: 'Who first brought wax print cloth?',
        steps: ['It came by ship long ago.', 'The Dutch brought it.'],
        answer: 'Dutch traders.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking all Ghanaian cloth came from Europe.',
        right: 'Ghanaians also weave their own cloth, like kente.',
      },
    ],
    realLife: [
      'Wax print clothes at church and parties.',
      'Cloth sellers in the market.',
      'Kente cloth.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a cloth with a pattern.',
        'Give your pattern a name.',
        'Show it to the class.',
      ],
    },
  },
  'history-09': {
    indicator: {
      code: 'B2.2.1.1.1',
      text: 'Identify the ethnic groups in each region: the regions of Ghana.',
    },
    hook: 'Ghana once had fewer regions. In 2019, six new regions were created. Can you name your region?',
    explain: [
      'Ghana has 16 regions.',
      'In 2019, six new regions were made: Ahafo, Bono East, North East, Oti, Savannah and Western North.',
      'Each region has its own capital town.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['Before 2019', '10 regions'],
        ['2019', '16 regions'],
      ],
      focus: 1,
    },
    artCaption: 'Ghana now has 16 regions.',
    words: [
      { term: 'Region', meaning: 'A big part of the country.' },
      { term: 'Capital', meaning: 'The main town of a region.' },
      { term: 'New', meaning: 'Just made.' },
    ],
    examples: [
      {
        title: 'Count them',
        situation:
          'Ghana had 10 regions. Then 6 new ones were made. How many now?',
        steps: ['10 + 6 = 16.'],
        answer: '16 regions.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghana has always had 16 regions.',
        right: 'Six were added in 2019.',
      },
    ],
    realLife: [
      'Your region’s name.',
      'Regional capitals like Kumasi and Tamale.',
      'Weather news for each region.',
    ],
    tryIt: {
      need: 'An adult to help',
      steps: [
        'Name your region.',
        'Name its capital.',
        'Name one other region.',
      ],
    },
  },
  'history-10': {
    indicator: {
      code: 'B2.2.4.1.1',
      text: 'Discuss the history of major historical locations: Assin Manso.',
    },
    hook: 'At Assin Manso, there is a quiet river. People go there to remember. Why?',
    explain: [
      'Long ago, many Africans were taken away from their homes and sent across the sea. This was very wrong.',
      'At Assin Manso, there is a river where they stopped on their journey.',
      'Today, people visit Assin Manso to remember them and honour them.',
    ],
    art: {
      kind: 'scroll',
      title: 'We Remember',
      date: 'Assin Manso',
      lines: [
        'Everyone should be free.',
        'We remember the people taken away.',
        'We treat everyone fairly.',
      ],
    },
    artCaption: 'We remember the people who were taken away.',
    words: [
      { term: 'Remember', meaning: 'Keep someone in your mind.' },
      { term: 'Honour', meaning: 'Show great respect.' },
      { term: 'Wrong', meaning: 'Not right or fair.' },
    ],
    examples: [
      {
        title: 'Why visit?',
        situation: 'Why do people visit Assin Manso?',
        steps: [
          'To remember the people taken away.',
          'To make sure it never happens again.',
        ],
        answer: 'To remember and honour them.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking we should forget sad history.',
        right: 'Remembering helps us do what is right.',
      },
    ],
    realLife: [
      'Visitors to Assin Manso.',
      'Remembering people we have lost.',
      'Treating everyone fairly.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a flower to honour the people who were taken away.',
        'Write “We remember”.',
        'Talk about why everyone should be free.',
      ],
    },
  },
  'history-11': {
    indicator: {
      code: 'B2.2.5.1.1',
      text: 'Identify Ghanaian women who have contributed: firsts in the sky and in the news.',
    },
    hook: 'Who was the first Ghanaian woman to fly a plane? Who was the first woman to run a big newspaper?',
    explain: [
      'Melody Danquah was the first woman pilot in Ghana’s Air Force.',
      'Elizabeth Ohene was the first woman editor of the Daily Graphic newspaper.',
      'They showed that girls can do any job.',
    ],
    art: { kind: 'sources', items: ['newspaper', 'photo'] },
    artCaption: 'Women made history in many jobs.',
    words: [
      { term: 'Air Force', meaning: 'The part of the army that flies planes.' },
      { term: 'Editor', meaning: 'The person in charge of a newspaper.' },
      { term: 'Newspaper', meaning: 'Printed pages with news.' },
    ],
    examples: [
      {
        title: 'Match the job',
        situation: 'Which woman flew planes?',
        steps: ['Melody Danquah was a pilot.'],
        answer: 'Melody Danquah.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking girls cannot fly planes.',
        right: 'Melody Danquah did, and so can you.',
      },
    ],
    realLife: [
      'Women pilots today.',
      'Women writing the news.',
      'Girls dreaming big.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a woman flying a plane.',
        'Or draw a woman reading the news.',
        'Say what job you want one day.',
      ],
    },
  },
  'history-12': {
    indicator: {
      code: 'B2.3.2.1.1',
      text: 'Describe how early trade was carried out: what Ghanaians traded.',
    },
    hook: 'Europeans sailed a long way to trade with us. What did Ghana have that they wanted so much?',
    explain: [
      'Ghana had a lot of gold. This was what Europeans wanted most.',
      'Ghanaians also traded ivory and other goods.',
      'In return, they got cloth, metal tools and other things from Europe.',
    ],
    art: {
      kind: 'goods',
      items: ['gold', 'cloth', 'iron'],
      label: 'Gold was traded for European goods',
    },
    artCaption: 'Ghana’s gold was famous.',
    words: [
      { term: 'Goods', meaning: 'Things to buy and sell.' },
      { term: 'Gold', meaning: 'A shiny, valuable metal.' },
      { term: 'In return', meaning: 'Given back in exchange.' },
    ],
    examples: [
      {
        title: 'What did they want?',
        situation: 'What did the Europeans want most from Ghana?',
        steps: ['They named the coast after it.'],
        answer: 'Gold.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghana had nothing to trade.',
        right: 'Ghana had gold, which was very valuable.',
      },
    ],
    realLife: ['Gold mines today.', 'Gold jewellery.', 'Shops selling goods.'],
    tryIt: {
      need: 'Yellow paper',
      steps: [
        'Cut out paper “gold”.',
        'Play trading with friends.',
        'What will you swap for your gold?',
      ],
    },
  },
  'history-13': {
    indicator: {
      code: 'B2.2.1.1.1',
      text: 'State the characteristics of the ethnic groups: food, dress and language.',
    },
    hook: 'Fufu, banku, tuo zaafi, kenkey and akple: different peoples have different favourite foods! What is yours?',
    explain: [
      'Each people has its own language, food and way of dressing.',
      'Many people in the north enjoy tuo zaafi. Many Ga enjoy kenkey. Many Ewe enjoy akple.',
      'Today, people all over Ghana enjoy each other’s foods.',
    ],
    art: {
      kind: 'goods',
      items: ['pot', 'shea', 'fish'],
      label: 'Every people has its own favourite foods',
    },
    artCaption: 'Food is part of a people’s culture.',
    words: [
      { term: 'Culture', meaning: 'The way of life of a people.' },
      { term: 'Language', meaning: 'The words people speak.' },
      { term: 'Dress', meaning: 'The clothes people wear.' },
    ],
    examples: [
      {
        title: 'Match the food',
        situation: 'Which food do many Ga people enjoy?',
        steps: ['Kenkey is made from maize.', 'It is popular in Accra.'],
        answer: 'Kenkey.',
      },
    ],
    mistakes: [
      {
        wrong: 'Laughing at food from another people.',
        right: 'Try it! Every people’s food is special.',
      },
    ],
    realLife: [
      'Food at home.',
      'Food sold at chop bars.',
      'Food shared at festivals.',
    ],
    tryIt: {
      need: 'Your family',
      steps: [
        'Ask what food your family loves most.',
        'Ask which people it comes from.',
        'Draw it.',
      ],
    },
  },
  'history-14': {
    indicator: {
      code: 'B2.2.4.1.1',
      text: 'Discuss the history of major historical locations: the Gbewaa Palace.',
    },
    hook: 'In Yendi lives the Ya Na, the king of Dagbon. His palace is called the Gbewaa Palace. Who was Gbewaa?',
    explain: [
      'Na Gbewaa is remembered as the founder of the Mole-Dagbani kingdoms.',
      'The palace in Yendi is named after him.',
      'Today, the Ya Na lives there and leads the people of Dagbon.',
    ],
    art: {
      kind: 'building',
      building: 'palace',
      label: 'The Gbewaa Palace in Yendi',
    },
    artCaption: 'The home of the king of Dagbon.',
    words: [
      { term: 'Palace', meaning: 'The home of a king or chief.' },
      { term: 'Founder', meaning: 'The person who started something.' },
      { term: 'Dagbon', meaning: 'The kingdom of the Dagomba people.' },
    ],
    examples: [
      {
        title: 'Who lives there?',
        situation: 'Who lives in the Gbewaa Palace today?',
        steps: ['It is the palace of the king of Dagbon.'],
        answer: 'The Ya Na.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking all palaces look the same.',
        right: 'Palaces in the north and south are built in different styles.',
      },
    ],
    realLife: [
      'Chiefs’ palaces in your area.',
      'The Damba festival in the north.',
      'Pictures of Yendi.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a palace with round rooms and thatched roofs.',
        'Write “Gbewaa Palace”.',
        'Say who lives there.',
      ],
    },
  },
  'history-15': {
    indicator: {
      code: 'B2.2.5.1.1',
      text: 'Identify Ghanaian women who have contributed: leaders in law.',
    },
    hook: 'Judges make sure laws are fair. Two Ghanaian women became leaders in law and Parliament. Who?',
    explain: [
      'Georgina Wood became Ghana’s first woman Chief Justice. She led all the judges.',
      'Joyce Bamford-Addo became the first woman Speaker of Parliament. She led the meetings of Parliament.',
      'They helped make Ghana fair and just.',
    ],
    art: {
      kind: 'scroll',
      title: 'Fair Laws',
      date: 'Women leaders in law',
      lines: [
        'Laws keep us safe.',
        'Judges make sure laws are fair.',
        'Women lead in law too.',
      ],
    },
    artCaption: 'Laws help everyone live together.',
    words: [
      { term: 'Law', meaning: 'A rule that everyone must follow.' },
      { term: 'Judge', meaning: 'A person who decides if laws were broken.' },
      { term: 'Parliament', meaning: 'Where leaders meet to make laws.' },
    ],
    examples: [
      {
        title: 'Match the leader',
        situation: 'Who was the first woman Speaker of Parliament?',
        steps: ['The Speaker leads the meetings of Parliament.'],
        answer: 'Joyce Bamford-Addo.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking laws do not matter to children.',
        right: 'Laws protect children too.',
      },
    ],
    realLife: ['Class rules.', 'Traffic rules.', 'Courts in your town.'],
    tryIt: {
      need: 'Your class',
      steps: [
        'Make three fair rules for your class.',
        'Vote on them.',
        'Write them on a poster.',
      ],
    },
  },
  'history-16': {
    indicator: {
      code: 'B2.3.2.1.1',
      text: 'Describe how early trade was carried out: from barter to money.',
    },
    hook: 'If you want a book, can you give a fish for it? Long ago, people often did!',
    explain: [
      'At first, people bartered: they swapped goods.',
      'Later, people used cowrie shells and gold dust as money.',
      'Today, we use cedis and pesewas.',
    ],
    art: { kind: 'thenNow', rows: ['money'] },
    artCaption: 'Money long ago and today.',
    words: [
      { term: 'Money', meaning: 'What we use to buy things.' },
      { term: 'Cowrie', meaning: 'A small shell used as money long ago.' },
      { term: 'Cedi', meaning: 'Ghana’s money today.' },
    ],
    examples: [
      {
        title: 'Old and new',
        situation: 'What was used as money long ago?',
        steps: ['People used shells and gold dust.'],
        answer: 'Cowrie shells and gold dust.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking people always used paper money.',
        right: 'Shells and gold dust were money long ago.',
      },
    ],
    realLife: [
      'Cedi notes and coins.',
      'Buying sweets.',
      'Cowrie shells in jewellery.',
    ],
    tryIt: {
      need: 'Stones as “cowries”',
      steps: [
        'Use stones as money.',
        'Play shop with friends.',
        'Buy and sell using your stones.',
      ],
    },
  },
  'history-17': {
    indicator: {
      code: 'B2.2.1.1.1',
      text: 'State the characteristics of the ethnic groups: respecting everyone.',
    },
    hook: 'In your class, children may speak different languages at home. How can we all be friends?',
    explain: [
      'Ghana has many peoples, each with its own ways.',
      'We can learn greetings in each other’s languages.',
      'Being kind to everyone makes Ghana a happy home for all.',
    ],
    art: { kind: 'flag', label: 'Many peoples, one Ghana' },
    artCaption: 'We are all Ghanaians.',
    words: [
      { term: 'Respect', meaning: 'Treating others kindly.' },
      { term: 'Greeting', meaning: 'Words we say when we meet someone.' },
      { term: 'Friend', meaning: 'Someone you like and care about.' },
    ],
    examples: [
      {
        title: 'Be a friend',
        situation: 'A new pupil speaks a different language. What can you do?',
        steps: ['Smile and say hello.', 'Learn a greeting in their language.'],
        answer: 'Be kind and learn from each other.',
      },
    ],
    mistakes: [
      {
        wrong: 'Laughing at someone’s language.',
        right: 'Every language is special.',
      },
    ],
    realLife: [
      'Friends from other peoples.',
      'Greetings in many languages.',
      'Playing together.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Teach your friend a greeting in your language.',
        'Learn one from them.',
        'Use it every morning.',
      ],
    },
  },
  'history-18': {
    indicator: {
      code: 'B2.2.4.1.1',
      text: 'Discuss the history of historical locations: places in my community.',
    },
    hook: 'You do not need to travel far to find history. There may be old places right near your home!',
    explain: [
      'Every community has places with a history.',
      'It may be an old church, a mosque, a market, a tree or a palace.',
      'Elders can tell you the stories of these places.',
    ],
    art: {
      kind: 'building',
      building: 'school',
      label: 'Old places near home',
    },
    artCaption: 'History is all around us.',
    words: [
      {
        term: 'Community',
        meaning: 'The place where you live and its people.',
      },
      { term: 'Elder', meaning: 'An older, wise person.' },
      { term: 'Old', meaning: 'From a long time ago.' },
    ],
    examples: [
      {
        title: 'Find it',
        situation: 'How can you learn the story of an old church in your town?',
        steps: ['Ask an elder.', 'Ask the church leader.'],
        answer: 'Ask people who know its history.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking history is only in big cities.',
        right: 'Every town has history.',
      },
    ],
    realLife: [
      'The oldest building in your town.',
      'A big old tree.',
      'The market.',
    ],
    tryIt: {
      need: 'An adult to walk with',
      steps: [
        'Find an old place near you.',
        'Ask an elder about it.',
        'Tell the class its story.',
      ],
    },
  },
  'history-19': {
    indicator: {
      code: 'B2.2.5.1.1',
      text: 'Identify Ghanaian women who have contributed: women in my community.',
    },
    hook: 'Great women are not only on television. They are in your own community too!',
    explain: [
      'Many women help our communities every day.',
      'Teachers, nurses, traders, farmers and mothers all help Ghana grow.',
      'Charity Zormelo-Fiawoo was the first Ghanaian woman to earn a university degree. She opened the way for many women.',
    ],
    art: {
      kind: 'building',
      building: 'school',
      label: 'Women build our communities',
    },
    artCaption: 'Women help in many ways.',
    words: [
      { term: 'Admire', meaning: 'Think someone is very good.' },
      { term: 'University', meaning: 'A place for learning after school.' },
      { term: 'Help', meaning: 'Do something good for others.' },
    ],
    examples: [
      {
        title: 'Who helps?',
        situation: 'Name a woman who helps your community.',
        steps: [
          'Think of a teacher, a nurse or a trader.',
          'Think of what she does.',
        ],
        answer: 'Every helper makes our community better.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only famous women are great.',
        right: 'Women around us do great things every day.',
      },
    ],
    realLife: [
      'Your teacher.',
      'Nurses at the clinic.',
      'Women traders in the market.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Think of a woman you admire.',
        'Tell your partner why.',
        'Make her a thank-you card.',
      ],
    },
  },
  'history-20': {
    indicator: {
      code: 'B2.3.2.1.1',
      text: 'Describe how early trade was carried out: towns that grew on the coast.',
    },
    hook: 'Elmina, Cape Coast and Accra grew into big towns. Trade helped them grow. How?',
    explain: [
      'Europeans built forts by the sea to trade.',
      'Many people came to these places to buy and sell.',
      'Little villages grew into big towns, like Elmina, Cape Coast and Accra.',
    ],
    art: {
      kind: 'building',
      building: 'fort',
      label: 'Towns grew around the forts',
    },
    artCaption: 'Trade helped coastal towns grow.',
    words: [
      { term: 'Town', meaning: 'A place where many people live.' },
      { term: 'Grow', meaning: 'Get bigger.' },
      { term: 'Village', meaning: 'A small place where people live.' },
    ],
    examples: [
      {
        title: 'Why did it grow?',
        situation: 'Why did Cape Coast become a big town?',
        steps: ['A big castle was built there.', 'Many people came to trade.'],
        answer: 'Trade brought many people.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking big towns were always big.',
        right: 'Many began as small villages.',
      },
    ],
    realLife: [
      'Accra, our capital.',
      'Cape Coast and Elmina.',
      'Markets that make towns busy.',
    ],
    tryIt: {
      need: 'Blocks or boxes',
      steps: [
        'Build a small village.',
        'Add a market and more houses.',
        'Watch your village grow into a town!',
      ],
    },
  },
}
