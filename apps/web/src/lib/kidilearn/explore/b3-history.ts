import type { CourseGuides } from './types'

// Basic 3 History, written for this course and scoped to the NaCCA History of
// Ghana Curriculum for Primary Schools (2019), in short sentences for
// eight-year-olds. Notes:
// - The course repeats its indicators, most of them three times. Each repeat
//   takes a new angle on the topic.
// - Three lessons carry the malformed code “B32.2.1.1”; the guides use
//   B3.2.2.1.1.
// - Where people came from is told as what each people’s traditions say:
//   these are histories handed down, and historians still study them.
// - The curriculum names several entrepreneurs; only those whose stories are
//   well documented are described in detail.

export const guides: CourseGuides = {
  'history-01': {
    indicator: {
      code: 'B3.2.1.1.1',
      text: 'Discuss the origins of the major ethnic groups in Ghana.',
    },
    hook: 'Ghana is home to many peoples. Each has a story about where its ancestors came from. Do you know yours?',
    explain: [
      'An ethnic group is a people who share a language, customs and history. Ghana’s major groups include the Akan, the Mole-Dagbani, the Ewe, the Ga-Adangme and the Guan.',
      'Each group has traditions about where its ancestors came from. The Guan are often said to be among the earliest people in Ghana.',
      'Ewe traditions say their ancestors came from Notsie, in today’s Togo. Ga-Adangme traditions say they came from the east. Mole-Dagbani traditions tell of founders who came from the north-east.',
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
    artCaption: 'Some of Ghana’s major peoples, from north to south.',
    words: [
      {
        term: 'Ethnic group',
        meaning: 'People who share a language, customs and history.',
      },
      { term: 'Origin', meaning: 'Where something began.' },
      {
        term: 'Tradition',
        meaning: 'A story or custom handed down from long ago.',
      },
    ],
    examples: [
      {
        title: 'Match the people',
        situation: 'Which group’s traditions say they came from Notsie?',
        steps: [
          'Notsie is in today’s Togo.',
          'The Ewe tell of leaving Notsie.',
        ],
        answer: 'The Ewe.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking one group is better than another.',
        right: 'Every group has its own proud history. All are Ghanaian.',
      },
    ],
    realLife: [
      'The language you speak at home.',
      'Festivals that tell where a people came from.',
      'Friends from other ethnic groups in your class.',
    ],
    tryIt: {
      need: 'An older family member',
      steps: [
        'Ask which ethnic group your family belongs to.',
        'Ask what your people’s traditions say about where they came from.',
        'Draw a picture of the story.',
      ],
    },
  },
  'history-02': {
    indicator: {
      code: 'B3.2.2.1.1',
      text: 'Discuss the nature of exchanges among the ethnic groups.',
    },
    hook: 'Long ago, the peoples of Ghana did not live apart. They met, traded, married and sometimes fought. How did they mix?',
    explain: [
      'Groups traded goods with each other. People from the coast, the forest and the north each had things the others needed.',
      'People married into other groups. Their children learned the customs and languages of both families.',
      'Groups also fought wars, and sometimes joined together as allies against a common enemy.',
    ],
    art: {
      kind: 'goods',
      items: ['salt', 'fish', 'gold', 'kola', 'shea', 'cloth'],
      label: 'Each area had goods to share',
    },
    artCaption: 'Trade linked the coast, the forest and the north.',
    words: [
      {
        term: 'Exchange',
        meaning: 'Giving something and getting something back.',
      },
      { term: 'Trade', meaning: 'Buying, selling or swapping goods.' },
      {
        term: 'Intermarriage',
        meaning: 'Marriage between people from different groups.',
      },
    ],
    examples: [
      {
        title: 'Name the exchanges',
        situation: 'List four ways groups came into contact.',
        steps: ['Trade.', 'Marriage.', 'War.', 'Alliances.'],
        answer: 'Trade, marriage, war and alliances.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking groups only fought each other.',
        right: 'Most contact was peaceful: trade and marriage.',
      },
    ],
    realLife: [
      'Markets where people from many groups trade.',
      'Families with parents from different groups.',
      'Words borrowed from one language into another.',
    ],
    tryIt: {
      need: 'Your family',
      steps: [
        'Ask if anyone in your family married into another ethnic group.',
        'Find one custom or food your family shares with another group.',
        'Tell the class.',
      ],
    },
  },
  'history-03': {
    indicator: {
      code: 'B3.2.2.1.2',
      text: 'Name some of the items exchanged among the various groups.',
    },
    hook: 'People on the coast had fish and salt. People in the forest had gold and kola. People in the north had shea butter. What do you think they did?',
    explain: [
      'People on the coast made salt and dried fish. People in the forest had gold and kola nuts.',
      'People in the savanna of the north made shea butter and wove cloth. Potters and blacksmiths made pots and iron tools in many places.',
      'Each area needed what the others had, so they traded.',
    ],
    art: {
      kind: 'goods',
      items: ['salt', 'fish', 'gold', 'kola', 'shea', 'pot', 'cloth', 'iron'],
    },
    artCaption: 'Goods that the peoples of Ghana traded.',
    words: [
      {
        term: 'Goods',
        meaning: 'Things that are made or grown to use or sell.',
      },
      { term: 'Savanna', meaning: 'Grassland with few trees, in the north.' },
      { term: 'Blacksmith', meaning: 'A person who makes things from iron.' },
    ],
    examples: [
      {
        title: 'Where does it come from?',
        situation:
          'Match each good to where it came from: salt, kola, shea butter.',
        steps: [
          'Salt: the coast.',
          'Kola nuts: the forest.',
          'Shea butter: the savanna in the north.',
        ],
        answer: 'Each area traded what it had.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking every area had everything it needed.',
        right: 'No area had everything, so they traded.',
      },
    ],
    realLife: [
      'Shea butter on your skin or in food.',
      'Kola nuts given at ceremonies.',
      'Dried fish in the market.',
    ],
    tryIt: {
      need: 'A trip to the market, with an adult',
      steps: [
        'Find three goods from the list in the market.',
        'Ask where each one came from.',
        'Draw them with labels.',
      ],
    },
  },
  'history-04': {
    indicator: {
      code: 'B3.2.2.1.3',
      text: 'Describe the conflicts and alliances that existed among the ethnic groups in Ghana.',
    },
    hook: 'Sometimes groups fought each other. Sometimes they joined together as friends. Why?',
    explain: [
      'A conflict is a fight or a war. Long ago, groups sometimes fought over land, trade or power.',
      'In 1701, at the Battle of Feyiase, the Asante defeated the Denkyira, who had ruled over them.',
      'An alliance is when groups join together. Groups made alliances to protect themselves from a strong enemy.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1701', 'Battle of Feyiase'],
        ['1826', 'Battle of Katamanso'],
        ['1869', 'Ada War'],
      ],
    },
    artCaption: 'Some wars between Ghana’s peoples.',
    words: [
      { term: 'Conflict', meaning: 'A fight or a war.' },
      {
        term: 'Alliance',
        meaning: 'Groups joining together, as friends, for a shared goal.',
      },
      {
        term: 'Ally',
        meaning: 'A friend who helps you in a fight or a struggle.',
      },
    ],
    examples: [
      {
        title: 'Why join together?',
        situation:
          'A small group is afraid of a strong neighbour. What can it do?',
        steps: [
          'It can join with other groups.',
          'Together they are stronger.',
        ],
        answer: 'It can form an alliance.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking old wars mean groups should be enemies today.',
        right: 'Those wars are history. Today we are one nation.',
      },
    ],
    realLife: [
      'Friends helping each other.',
      'Countries working together today.',
      'Settling quarrels by talking.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write what “conflict” means.',
        'Write what “alliance” means.',
        'Draw a picture of friends standing together.',
      ],
    },
  },
  'history-05': {
    indicator: {
      code: 'B3.2.4.1.1',
      text: 'Identify the forts and castles built along the coast of Ghana.',
    },
    hook: 'Along Ghana’s coast stand big white buildings, some over 500 years old. They are forts and castles. Who built them?',
    explain: [
      'Europeans built forts and castles along the coast. They used them for trade and to defend themselves.',
      'A castle is big. The leader of the Europeans lived there. A fort is smaller.',
      'Elmina Castle was built by the Portuguese in 1482. It is the oldest European building in Africa south of the Sahara.',
    ],
    art: {
      kind: 'building',
      building: 'fort',
      label: 'Forts and castles line Ghana’s coast',
    },
    artCaption: 'Many are now museums.',
    words: [
      { term: 'Fort', meaning: 'A strong building made to defend people.' },
      { term: 'Castle', meaning: 'A very large fort where a leader lived.' },
      { term: 'Coast', meaning: 'Where the land meets the sea.' },
    ],
    examples: [
      {
        title: 'Fort or castle?',
        situation: 'What is the difference between a fort and a castle?',
        steps: [
          'A castle is bigger.',
          'The European leader lived in the castle.',
        ],
        answer: 'A castle is a large fort where the leader lived.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghanaians built the forts.',
        right: 'Europeans built them, often with African workers.',
      },
    ],
    realLife: [
      'Elmina and Cape Coast castles.',
      'School trips to the forts.',
      'Pictures of castles on posters and stamps.',
    ],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Draw a castle by the sea.',
        'Label the walls, the gate and the guns.',
        'Write who built Elmina Castle and when.',
      ],
    },
  },
  'history-06': {
    indicator: {
      code: 'B3.2.5.1.1',
      text: 'Describe Ghanaian entrepreneurs who have made significant contributions.',
    },
    hook: 'Some Ghanaians started with very little and built big businesses. They made jobs for many people. Who were they?',
    explain: [
      'An entrepreneur is a person who starts a business and takes a risk to make it grow.',
      'Esther Ocloo began making marmalade with very little money. Her company, Nkulenu Industries, makes foods that people still buy today.',
      'George Alfred Grant, known as Paa Grant, was a timber merchant from Axim. He used his wealth to support the movement for independence.',
    ],
    art: {
      kind: 'goods',
      items: ['jar', 'cloth', 'gold'],
      label: 'Good ideas and hard work build businesses',
    },
    artCaption: 'Ghanaian businesses make goods that people need.',
    words: [
      {
        term: 'Entrepreneur',
        meaning: 'A person who starts and runs a business.',
      },
      { term: 'Business', meaning: 'Making or selling things to earn money.' },
      { term: 'Risk', meaning: 'A chance that something might go wrong.' },
    ],
    examples: [
      {
        title: 'What makes an entrepreneur?',
        situation: 'Esther Ocloo started small. What helped her grow?',
        steps: [
          'She had a good idea.',
          'She worked hard.',
          'She kept going when things were difficult.',
        ],
        answer: 'A good idea, hard work and not giving up.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking you need a lot of money to start.',
        right: 'Many entrepreneurs began with very little.',
      },
    ],
    realLife: [
      'Shops and businesses in your town.',
      'Ghanaian foods in the supermarket.',
      'People who sell in the market.',
    ],
    tryIt: {
      need: 'An adult who runs a business',
      steps: [
        'Ask how they started their business.',
        'Ask what was hardest.',
        'Write two things you learned.',
      ],
    },
  },
  'history-07': {
    indicator: {
      code: 'B3.3.1.1.1',
      text: 'Describe how the Europeans settled on the Gold Coast, including forming alliances with local chiefs.',
    },
    hook: 'In 1482, Portuguese sailors asked a chief at Elmina if they could build a castle. What did he say?',
    explain: [
      'The Portuguese were the first Europeans to reach the Gold Coast, in 1471. They came to trade for gold.',
      'In 1482, they met the chief of Elmina, Kwamena Ansa. He did not want them to stay, but in the end he allowed them to build a castle.',
      'Later, the Dutch, English, Danes, Swedes and Germans came too. They made agreements with chiefs and paid them rent for the land.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1471', 'Portuguese arrive'],
        ['1482', 'Elmina Castle built'],
        ['1600s', 'Other Europeans arrive'],
      ],
    },
    artCaption: 'The Europeans came one after another.',
    words: [
      { term: 'Settle', meaning: 'Come to live in a new place.' },
      { term: 'Agreement', meaning: 'A promise between two sides.' },
      { term: 'Rent', meaning: 'Money paid to use land or a building.' },
    ],
    examples: [
      {
        title: 'Who came first?',
        situation: 'Which Europeans came first to the Gold Coast?',
        steps: ['The Portuguese came in 1471.', 'Others came later.'],
        answer: 'The Portuguese.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Europeans took the land at once.',
        right: 'At first, they paid chiefs rent and needed their permission.',
      },
    ],
    realLife: [
      'Elmina, where the Portuguese first built.',
      'Portuguese and Dutch words in some Ghanaian names.',
      'Visitors to Ghana’s castles today.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Act out the meeting between the Portuguese and Kwamena Ansa.',
        'One of you is the chief, and one is the Portuguese captain.',
        'What would the chief say?',
      ],
    },
  },
  'history-08': {
    indicator: {
      code: 'B3.2.1.1.1',
      text: 'Discuss the origins of the major ethnic groups: the story of Notsie.',
    },
    hook: 'Ewe traditions tell of a cruel king, a wall and a clever escape. Let us hear the story.',
    explain: [
      'Ewe traditions say their ancestors once lived in the walled town of Notsie, in today’s Togo. A harsh king named Agokoli ruled there.',
      'The story says the people poured water on one part of the wall, every day, until it became soft. Then they broke through it and escaped at night.',
      'To hide their tracks, they are said to have walked backwards. They travelled west and settled in the lands where Ewe people live today.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['Long ago', 'Life in Notsie'],
        ['The escape', 'Through the softened wall'],
        ['After', 'Settling in new lands'],
      ],
    },
    artCaption: 'The Ewe story of leaving Notsie.',
    words: [
      {
        term: 'Migration',
        meaning: 'Moving from one place to live in another.',
      },
      { term: 'Escape', meaning: 'Getting away from danger.' },
      { term: 'Ancestors', meaning: 'Family members who lived long ago.' },
    ],
    examples: [
      {
        title: 'Why remember it?',
        situation: 'Why do Ewe people still tell this story?',
        steps: [
          'It explains where they came from.',
          'It shows courage and cleverness.',
          'It is remembered at the Hogbetsotso festival.',
        ],
        answer: 'The story keeps the people’s history and values alive.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking traditions are just made-up tales.',
        right: 'Traditions carry real history, handed down by word of mouth.',
      },
    ],
    realLife: [
      'The Hogbetsotso festival of the Anlo Ewe.',
      'Stories told by grandparents.',
      'Festivals that remember journeys.',
    ],
    tryIt: {
      need: 'Paper and coloured pencils',
      steps: [
        'Draw the Notsie story in three pictures.',
        'Write a sentence under each picture.',
        'Retell the story to someone at home.',
      ],
    },
  },
  'history-09': {
    indicator: {
      code: 'B3.2.2.1.1',
      text: 'Discuss the nature of exchanges among the ethnic groups: sharing customs.',
    },
    hook: 'Kente is woven by both the Asante and the Ewe. How can two peoples share one craft?',
    explain: [
      'When peoples meet, they share ideas, not only goods. Crafts, foods, words and music pass from one group to another.',
      'Both the Asante and the Ewe weave kente cloth, each in their own styles and colours.',
      'Marriage between groups also mixes customs, because children learn from both families.',
    ],
    art: {
      kind: 'goods',
      items: ['cloth', 'pot', 'shea'],
      label: 'Crafts and foods pass between peoples',
    },
    artCaption: 'Kente is woven by more than one people.',
    words: [
      {
        term: 'Custom',
        meaning: 'Something a people usually does, such as a way of greeting.',
      },
      { term: 'Craft', meaning: 'Making things skilfully by hand.' },
      { term: 'Share', meaning: 'Give a part of something to others.' },
    ],
    examples: [
      {
        title: 'Spot the sharing',
        situation: 'Name one thing shared between two groups.',
        steps: [
          'Kente weaving is shared by the Asante and the Ewe.',
          'Many foods are eaten across Ghana.',
        ],
        answer: 'Crafts and foods are shared across peoples.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a custom belongs to only one group.',
        right: 'Many customs are shared and changed as they travel.',
      },
    ],
    realLife: [
      'Kente worn at special occasions.',
      'Foods like kenkey and tuo zaafi eaten in many places.',
      'Children who speak two Ghanaian languages.',
    ],
    tryIt: {
      need: 'Your family',
      steps: [
        'Find one food your family eats that comes from another group.',
        'Ask where it came from.',
        'Share it with your class.',
      ],
    },
  },
  'history-10': {
    indicator: {
      code: 'B3.2.2.1.2',
      text: 'Name some of the items exchanged: from barter to cowrie shells.',
    },
    hook: 'You have fish, and you want salt. But the salt seller does not want fish. What can you do?',
    explain: [
      'At first, people bartered: they swapped one good for another. But barter only works if each person wants what the other has.',
      'So people began using cowrie shells as money. Everyone accepted them, so you could sell fish for cowries, then buy salt with cowries.',
      'Gold dust was also used as money, especially for big trades.',
    ],
    art: {
      kind: 'goods',
      items: ['fish', 'cowries', 'salt'],
      label: 'Fish for cowries, then cowries for salt',
    },
    artCaption: 'Cowries made trading easier.',
    words: [
      { term: 'Barter', meaning: 'Swapping goods without money.' },
      {
        term: 'Cowrie shell',
        meaning: 'A small shiny shell used as money long ago.',
      },
      {
        term: 'Medium of exchange',
        meaning: 'Something everyone accepts as payment, such as money.',
      },
    ],
    examples: [
      {
        title: 'Why cowries?',
        situation: 'Why were cowries better than barter?',
        steps: [
          'Everyone accepted cowries.',
          'They were small and easy to carry.',
          'They could be counted.',
        ],
        answer: 'Cowries made buying and selling much easier.',
        art: { kind: 'goods', items: ['cowries'] },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking money was always notes and coins.',
        right: 'Shells and gold dust were once used as money.',
      },
    ],
    realLife: [
      'Cowrie shells in jewellery and decorations.',
      'Swapping things with friends.',
      'Paying for things with cedis today.',
    ],
    tryIt: {
      need: 'Some small objects and stones as “cowries”',
      steps: [
        'With friends, try swapping objects by barter.',
        'Then use stones as cowries to buy and sell.',
        'Which was easier? Why?',
      ],
    },
  },
  'history-11': {
    indicator: {
      code: 'B3.2.2.1.3',
      text: 'Describe the conflicts and alliances among the ethnic groups: the Battle of Katamanso.',
    },
    hook: 'In 1826, many groups joined together against the mighty Asante army. Could they win?',
    explain: [
      'In 1826, the Asante army marched towards Accra. The Ga, Fante, Akyem, Akwamu, Denkyira and others joined with the British against them.',
      'They fought at Katamanso, near Dodowa. The alliance defeated the Asante.',
      'The battle shows how groups that were not always friends could join together against a common enemy.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1701', 'Asante defeats Denkyira'],
        ['1826', 'Alliance defeats Asante at Katamanso'],
      ],
      focus: 1,
    },
    artCaption: 'Alliances could change who was strongest.',
    words: [
      {
        term: 'Alliance',
        meaning: 'Groups joining together for a shared goal.',
      },
      { term: 'Common enemy', meaning: 'An enemy that several groups share.' },
      { term: 'Battle', meaning: 'A big fight between armies.' },
    ],
    examples: [
      {
        title: 'Strength in numbers',
        situation: 'Why did the alliance win at Katamanso?',
        steps: [
          'Many groups joined together.',
          'Together they had a bigger army.',
        ],
        answer: 'Working together made them strong.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the strongest group always wins.',
        right: 'Smaller groups working together can win.',
      },
    ],
    realLife: [
      'Teams working together in games.',
      'Friends helping each other.',
      'Countries joining together in groups like ECOWAS.',
    ],
    tryIt: {
      need: 'Some friends',
      steps: [
        'Play tug of war: one strong player against two smaller ones.',
        'Who wins?',
        'Talk about why working together helps.',
      ],
    },
  },
  'history-12': {
    indicator: {
      code: 'B3.2.4.1.1',
      text: 'Identify the forts and castles: who built them?',
    },
    hook: 'Ghana has more old European forts than most countries in Africa. Different Europeans built them. Who were they?',
    explain: [
      'The Portuguese built Elmina Castle in 1482. The Dutch later took it, and built Fort St. Jago on the hill nearby.',
      'Cape Coast Castle became the headquarters of the British. Christiansborg Castle, also called Osu Castle, was built by the Danes in Accra.',
      'The Swedes and Germans also built forts. Many forts changed hands as Europeans fought each other for the trade.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1482', 'Elmina (Portuguese)'],
        ['1600s', 'Cape Coast'],
        ['1600s', 'Christiansborg (Danes)'],
      ],
    },
    artCaption: 'Different Europeans built different forts.',
    words: [
      { term: 'Headquarters', meaning: 'The main office of a group.' },
      { term: 'Changed hands', meaning: 'Passed from one owner to another.' },
      { term: 'Defend', meaning: 'Protect from attack.' },
    ],
    examples: [
      {
        title: 'Match the castle',
        situation: 'Which Europeans built Christiansborg Castle?',
        steps: ['It is in Osu, Accra.', 'It was built by the Danes.'],
        answer: 'The Danes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking one country built all the forts.',
        right:
          'The Portuguese, Dutch, British, Danes, Swedes and Germans all built forts.',
      },
    ],
    realLife: [
      'Osu Castle in Accra.',
      'Fort St. Jago in Elmina.',
      'The castles on Ghana’s coast that visitors come to see.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a table of three castles.',
        'Write who built each one.',
        'Draw your favourite castle.',
      ],
    },
  },
  'history-13': {
    indicator: {
      code: 'B3.2.5.1.1',
      text: 'Describe Ghanaian entrepreneurs: the story of Esther Ocloo.',
    },
    hook: 'Esther Ocloo began her business with a small amount of money and a big idea. Her company still makes food today.',
    explain: [
      'Esther Ocloo was a Ghanaian businesswoman. She started by making marmalade and selling it with very little money to begin with.',
      'She worked hard and her business grew into Nkulenu Industries. It makes jams, marmalade and other foods.',
      'She also helped other women start businesses. She helped found Women’s World Banking, which lends money to women who want to start a business.',
    ],
    art: {
      kind: 'goods',
      items: ['jar'],
      label: 'Nkulenu Industries makes Ghanaian foods',
    },
    artCaption: 'Her business began with marmalade.',
    words: [
      { term: 'Businesswoman', meaning: 'A woman who runs a business.' },
      { term: 'Loan', meaning: 'Money you borrow and pay back later.' },
      { term: 'Grow', meaning: 'Get bigger.' },
    ],
    examples: [
      {
        title: 'Helping others',
        situation: 'How did Esther Ocloo help other women?',
        steps: [
          'She knew starting a business was hard.',
          'She helped make it easier for women to borrow money.',
        ],
        answer: 'She helped women get loans to start their own businesses.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking business is only for men.',
        right: 'Many great Ghanaian entrepreneurs are women.',
      },
    ],
    realLife: [
      'Women traders in the market.',
      'Ghanaian jams and foods in shops.',
      'Groups that lend money to small businesses.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a label for a jar of jam you would make.',
        'Give your business a name.',
        'Write what makes your product special.',
      ],
    },
  },
  'history-14': {
    indicator: {
      code: 'B3.3.1.1.1',
      text: 'Describe how the Europeans settled on the Gold Coast: how they stayed.',
    },
    hook: 'Europeans stayed on the Gold Coast for hundreds of years. How did they manage to stay?',
    explain: [
      'Europeans needed the chiefs’ permission. They signed agreements and paid rent, called “notes”, for the land under their forts.',
      'They made friends and allies of some chiefs, and sometimes helped them in wars.',
      'Some Europeans married local women. Their children often became traders and leaders on the coast.',
    ],
    art: {
      kind: 'building',
      building: 'fort',
      label: 'Forts were built with the chiefs’ permission',
    },
    artCaption: 'Europeans paid rent for the land under their forts.',
    words: [
      { term: 'Permission', meaning: 'Being allowed to do something.' },
      {
        term: 'Note',
        meaning: 'Here, a paper promising rent paid to a chief.',
      },
      { term: 'Ally', meaning: 'A friend who helps you.' },
    ],
    examples: [
      {
        title: 'Why pay rent?',
        situation: 'Why did Europeans pay chiefs rent?',
        steps: [
          'The land belonged to the chiefs’ people.',
          'Europeans needed the chiefs to keep trading.',
        ],
        answer: 'Paying rent kept the chiefs as friends and kept trade going.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Europeans were in charge from the start.',
        right: 'At first, chiefs had the power, and Europeans needed them.',
      },
    ],
    realLife: [
      'Ghanaian family names that come from European ancestors.',
      'Agreements people make about land today.',
      'The forts that still stand.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Act out an agreement between a chief and a trader.',
        'Decide what rent the trader pays.',
        'Write your agreement down and both sign it.',
      ],
    },
  },
  'history-15': {
    indicator: {
      code: 'B3.2.1.1.1',
      text: 'Discuss the origins of the major ethnic groups: many peoples, one nation.',
    },
    hook: 'More than 70 languages are spoken in Ghana. Yet we all sing one national anthem. How do so many peoples make one nation?',
    explain: [
      'Each ethnic group has its own language, festivals and history. This variety is one of Ghana’s treasures.',
      'At the same time, we share one flag, one anthem and one country. We are all Ghanaians.',
      'Respecting each other’s languages and customs keeps our nation peaceful and strong.',
    ],
    art: { kind: 'flag', label: 'Many peoples, one nation' },
    artCaption: 'One flag for all of Ghana’s peoples.',
    words: [
      { term: 'Nation', meaning: 'A country and all its people.' },
      { term: 'Unity', meaning: 'Being together as one.' },
      { term: 'Respect', meaning: 'Treating others and their ways kindly.' },
    ],
    examples: [
      {
        title: 'Unity in variety',
        situation:
          'Your class has children from three ethnic groups. How can you show respect?',
        steps: [
          'Learn a greeting in each other’s languages.',
          'Ask about each other’s festivals.',
          'Never laugh at someone’s language.',
        ],
        answer: 'Learning about each other builds friendship.',
      },
    ],
    mistakes: [
      {
        wrong: 'Laughing at someone’s language or name.',
        right: 'Every language and name is worth respecting.',
      },
    ],
    realLife: [
      'Singing the national anthem.',
      'Independence Day, celebrated by all.',
      'Friends from different groups.',
    ],
    tryIt: {
      need: 'Classmates',
      steps: [
        'Learn to say “good morning” in two Ghanaian languages.',
        'Teach a friend a greeting from your language.',
        'Make a class poster of greetings.',
      ],
    },
  },
  'history-16': {
    indicator: {
      code: 'B3.2.2.1.1',
      text: 'Discuss the nature of exchanges among the ethnic groups: why they helped everyone.',
    },
    hook: 'If the north, the forest and the coast each kept everything for themselves, what would happen?',
    explain: [
      'Each area had some goods and lacked others. The north had shea butter but no sea salt. The coast had salt but no kola.',
      'By trading, each group got what it needed. Traders earned a living, and towns grew around the markets.',
      'Trade also spread new ideas and friendships between peoples.',
    ],
    art: {
      kind: 'belts',
      belts: [
        { name: 'North', places: ['shea butter', 'cloth', 'livestock'] },
        { name: 'Forest', places: ['gold', 'kola nuts'] },
        { name: 'Coast', places: ['salt', 'fish'] },
      ],
    },
    artCaption: 'Each area had something the others needed.',
    words: [
      { term: 'Need', meaning: 'Something you must have.' },
      { term: 'Benefit', meaning: 'Something good that you get.' },
      { term: 'Depend', meaning: 'Need someone else’s help.' },
    ],
    examples: [
      {
        title: 'Who benefits?',
        situation:
          'A coastal trader swaps salt for northern shea butter. Who benefits?',
        steps: [
          'The coastal trader gets shea butter.',
          'The northern trader gets salt.',
        ],
        answer: 'Both of them benefit.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking in a trade one side must lose.',
        right: 'In a fair trade, both sides gain.',
      },
    ],
    realLife: [
      'Food from the north sold in southern markets.',
      'Fish from the coast sold in the north.',
      'Lorries carrying goods across Ghana.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw the north, the forest and the coast.',
        'Draw what each area has.',
        'Draw arrows to show trade between them.',
      ],
    },
  },
  'history-17': {
    indicator: {
      code: 'B3.2.2.1.2',
      text: 'Name some of the items exchanged: the story of the cedi.',
    },
    hook: 'Why is our money called the cedi? The answer goes back to the cowrie shell.',
    explain: [
      'In the Akan language, a cowrie shell is called a “sedie”. Cowries were once used as money.',
      'When Ghana created its own money in 1965, it was named the cedi, remembering the cowrie.',
      'In 2007, Ghana introduced a new cedi, the Ghana cedi, that we use today. One cedi is made of 100 pesewas.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['Long ago', 'Cowrie shells'],
        ['1965', 'The cedi'],
        ['2007', 'The Ghana cedi'],
      ],
      focus: 2,
    },
    artCaption: 'From the cowrie shell to the Ghana cedi.',
    words: [
      { term: 'Cedi', meaning: 'Ghana’s money, named after the cowrie shell.' },
      { term: 'Pesewa', meaning: 'A smaller unit: 100 pesewas make one cedi.' },
      { term: 'Currency', meaning: 'The money a country uses.' },
    ],
    examples: [
      {
        title: 'Count the pesewas',
        situation: 'How many pesewas are in 2 cedis?',
        steps: ['1 cedi = 100 pesewas.', '100 + 100 = 200.'],
        answer: '200 pesewas.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the name “cedi” is just a made-up word.',
        right: 'It comes from “sedie”, the Akan word for cowrie.',
      },
    ],
    realLife: [
      'Cedi notes and pesewa coins.',
      'Buying things at the shop.',
      'Cowries used in decorations today.',
    ],
    tryIt: {
      need: 'Some coins and notes, with an adult',
      steps: [
        'Look at the cedi notes and coins.',
        'Find the pictures on them.',
        'Count how many pesewas make one cedi.',
      ],
    },
  },
  'history-18': {
    indicator: {
      code: 'B3.2.2.1.3',
      text: 'Describe the conflicts and alliances among the ethnic groups: making peace.',
    },
    hook: 'Wars end, and neighbours must live together again. How did groups make peace long ago, and how do we do it today?',
    explain: [
      'After a war, leaders met to agree on peace. They sometimes sealed peace with oaths, gifts or marriages between royal families.',
      'In the 1830s, the Peki and other Krepi states fought the Akwamu to win their freedom. Afterwards, they lived as free neighbours.',
      'Today, we settle quarrels by talking, by asking elders and chiefs to help, and through the courts.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'stand', x: 240, kit: 1 },
        { pose: 'stand', x: 400, facing: -1, kit: 3 },
      ],
      label: 'Talking settles quarrels',
    },
    artCaption: 'Peace begins when people talk.',
    words: [
      { term: 'Peace', meaning: 'Living without fighting.' },
      { term: 'Oath', meaning: 'A serious promise.' },
      { term: 'Settle', meaning: 'End a quarrel by agreeing.' },
    ],
    examples: [
      {
        title: 'Make peace',
        situation: 'Two friends argue over a ball. How can they make peace?',
        steps: [
          'Each one explains how they feel.',
          'They listen to each other.',
          'They agree to take turns.',
        ],
        answer: 'Talking and sharing settles the quarrel.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking fighting is the only way to solve a problem.',
        right: 'Talking and listening work better.',
      },
    ],
    realLife: [
      'Elders settling quarrels in the community.',
      'Teachers helping pupils make up.',
      'Countries making peace agreements.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Act out a quarrel over a toy.',
        'Then act out making peace by talking.',
        'Write a rule for making peace.',
      ],
    },
  },
  'history-19': {
    indicator: {
      code: 'B3.2.4.1.1',
      text: 'Identify the forts and castles: how their uses changed.',
    },
    hook: 'A building can do different jobs over time. Ghana’s castles have been trading posts, prisons, schools and museums.',
    explain: [
      'At first, forts and castles were used for trade, and as homes for European traders and soldiers.',
      'They were also used to hold captives during the slave trade. Later, some became offices, schools and prisons.',
      'For many years, Christiansborg Castle in Accra was the seat of Ghana’s government. Today, many castles are museums, and some are World Heritage Sites.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['First', 'Trade'],
        ['Later', 'Government and prisons'],
        ['Today', 'Museums'],
      ],
    },
    artCaption: 'The same buildings, used in new ways.',
    words: [
      {
        term: 'Museum',
        meaning: 'A place where old things are kept for people to see.',
      },
      {
        term: 'World Heritage Site',
        meaning:
          'A place the world agrees to protect because it is so important.',
      },
      {
        term: 'Seat of government',
        meaning: 'The place where a country’s leaders work.',
      },
    ],
    examples: [
      {
        title: 'Then and now',
        situation: 'How has Elmina Castle changed?',
        steps: [
          'Then: a trading post and a place where captives were held.',
          'Now: a museum where people learn history.',
        ],
        answer: 'Its use changed from trade to teaching and remembering.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking old buildings have no use today.',
        right: 'They teach us about the past.',
      },
    ],
    realLife: [
      'Visitors touring Cape Coast Castle.',
      'Old buildings in your town used for new things.',
      'Museums you can visit.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a castle three times: long ago, later and today.',
        'Write what it was used for each time.',
        'Share your drawings.',
      ],
    },
  },
  'history-20': {
    indicator: {
      code: 'B3.2.5.1.1',
      text: 'Describe Ghanaian entrepreneurs: how a small business works.',
    },
    hook: 'You buy oranges for 1 cedi each and sell them for 2 cedis each. Are you an entrepreneur?',
    explain: [
      'Entrepreneurs buy or make things, then sell them for more than they cost. The money left over is called profit.',
      'Great Ghanaian entrepreneurs, such as Esther Ocloo, George Grant, B. A. Mensah, Kwabena Pepra, J. K. Siaw and Alhaji Adam Iddrisu, built big businesses step by step.',
      'Businesses create jobs and supply the goods people need, which helps the whole country.',
    ],
    art: {
      kind: 'cedis',
      notes: [2, 2, 1],
      label: 'Selling for more than it cost leaves a profit',
    },
    artCaption: 'Profit is what is left after paying your costs.',
    words: [
      {
        term: 'Profit',
        meaning: 'Money left after you pay for what you sold.',
      },
      { term: 'Cost', meaning: 'What you pay to buy or make something.' },
      { term: 'Customer', meaning: 'A person who buys from you.' },
    ],
    examples: [
      {
        title: 'Work out the profit',
        situation:
          'You buy 10 oranges for 1 cedi each and sell them for 2 cedis each. What is your profit?',
        steps: [
          'Cost: 10 oranges at 1 cedi each is 10 cedis.',
          'Sales: 10 oranges at 2 cedis each is 20 cedis.',
          'Profit: 20 − 10 = 10.',
        ],
        answer: 'Your profit is 10 cedis.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking all the money you take in is profit.',
        right: 'Take away what you paid first. What is left is the profit.',
      },
    ],
    realLife: [
      'Traders in the market.',
      'Shops in your area.',
      'Selling things at a school fair.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Plan a small business selling something at school.',
        'Write what it costs you and what you will sell it for.',
        'Work out your profit.',
      ],
    },
  },
}
