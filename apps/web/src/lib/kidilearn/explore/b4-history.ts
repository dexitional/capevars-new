import type { CourseGuides } from './types'

// Basic 4 History, written for this course and scoped to the NaCCA History of
// Ghana Curriculum for Primary Schools (2019). Notes:
// - Lessons 12 to 20 repeat the indicators of lessons 1 to 9, so each repeat
//   takes a new angle: the same topic seen from another side, not the same text.
// - Lesson 11's indicator is printed as B4.5.3.1.2 but sits in the curriculum's
//   Basic 5 section; it is B5.5.3.1.2 here, taught at a Basic 4 level.
// - Where a date is uncertain or disputed, the guide says “about” or “is said
//   to”, rather than giving a precise date it cannot defend.

export const guides: CourseGuides = {
  'history-01': {
    indicator: {
      code: 'B4.1.1.1.1',
      text: 'Explain the importance of studying the history of Ghana.',
    },
    hook: 'Why do we celebrate 6 March? Why does your town hold its festival? The answers are all in history.',
    explain: [
      'History is the story of people in the past, told using evidence. The history of Ghana tells us who we are and how we came to be one nation.',
      'History keeps our customs, values and traditions alive. When we know why a festival or a name matters, we take care of it and pass it on.',
      'Learning the stories of all our peoples helps us respect each other and live together. It also gives us pride in Ghana and the courage to build it.',
    ],
    art: { kind: 'flag', label: 'Our flag carries our history' },
    artCaption:
      'Red for those who died for freedom, gold for our wealth, green for our land, and the black star of African freedom.',
    words: [
      {
        term: 'History',
        meaning: 'The study of what happened in the past, using evidence.',
      },
      {
        term: 'Identity',
        meaning: 'Who you are, and what makes you belong to a group.',
      },
      {
        term: 'Patriotism',
        meaning: 'Love for your country and the wish to serve it.',
      },
    ],
    examples: [
      {
        title: 'Why 6 March?',
        situation:
          'Ghana celebrates Independence Day on 6 March. What does history tell us about this date?',
        steps: [
          'On 6 March 1957, the Gold Coast became independent and took the name Ghana.',
          'Kwame Nkrumah declared that Ghana was free forever.',
          'The date also recalls the Bond of 1844, signed on 6 March, a step towards British rule.',
        ],
        answer:
          'The date marks the day we became free, chosen to remind us of how colonial rule began.',
        art: {
          kind: 'timeline',
          events: [
            ['1844', 'Bond of 1844 signed'],
            ['1957', 'Independence'],
            ['1960', 'Ghana becomes a Republic'],
          ],
          focus: 1,
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking history is only about kings and wars.',
        right:
          'History is about everyone: farmers, traders, children and families too.',
      },
      {
        wrong: 'Thinking the past has nothing to do with today.',
        right: 'Our names, festivals and laws all come from the past.',
      },
    ],
    realLife: [
      'Understanding why your town celebrates its festival.',
      'Knowing why your school or street has its name.',
      'Feeling proud when you sing the national anthem.',
    ],
    tryIt: {
      need: 'An older person in your family or community',
      steps: [
        'Ask them about one big event they remember in Ghana.',
        'Ask how it changed people’s lives.',
        'Write three sentences about what you learned.',
      ],
    },
  },
  'history-02': {
    indicator: {
      code: 'B4.1.1.2.1',
      text: 'Identify the sources of history, including archaeology, numismatics, oral tradition and wall paintings.',
    },
    hook: 'Historians are like detectives. They cannot travel back in time, so they search for clues. Where do they find them?',
    explain: [
      'A source is anything that tells us about the past. Historians collect sources the way detectives collect clues.',
      'Archaeology is digging up old things, such as pots, tools and buildings. Numismatics is the study of old coins and money. Oral tradition is history told aloud and passed from old to young, such as stories, drum language, songs and dirges.',
      'A primary source was made at the time, such as an old letter or a photograph. A secondary source was made later, about the past, such as a history book.',
    ],
    art: {
      kind: 'sources',
      items: [
        'pot',
        'coin',
        'drum',
        'painting',
        'letter',
        'photo',
        'newspaper',
        'brochure',
      ],
    },
    artCaption: 'Every object here is a clue about the past.',
    words: [
      {
        term: 'Source',
        meaning: 'Anything that gives us information about the past.',
      },
      {
        term: 'Archaeology',
        meaning: 'Studying the past by digging up and examining old objects.',
      },
      { term: 'Numismatics', meaning: 'The study of coins and money.' },
      {
        term: 'Oral tradition',
        meaning:
          'History passed on by word of mouth, in stories, songs and drumming.',
      },
    ],
    examples: [
      {
        title: 'Primary or secondary?',
        situation:
          'Sort these: a photograph of your grandmother’s wedding, and a history textbook.',
        steps: [
          'The photograph was made on the day itself.',
          'The textbook was written many years later, about the past.',
        ],
        answer:
          'The photograph is a primary source. The textbook is a secondary source.',
      },
      {
        title: 'What can a funeral brochure tell us?',
        situation:
          'You find a funeral brochure from 1980. What history can it hold?',
        steps: [
          'It gives dates of birth and death.',
          'It names family members and hometowns.',
          'Its life story may describe jobs, schools and events of the time.',
        ],
        answer:
          'A brochure can be a rich primary source about a person and their times.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only books are sources.',
        right: 'Objects, songs, photographs and even buildings are sources.',
      },
    ],
    realLife: [
      'Old family photographs in a living room.',
      'Talking drums at a durbar.',
      'Old coins kept by grandparents.',
    ],
    tryIt: {
      need: 'Objects at home, with an adult’s permission',
      steps: [
        'Find three old things at home, such as a photograph, a letter or a coin.',
        'For each one, write what it tells you about the past.',
        'Decide whether each is a primary or a secondary source.',
      ],
    },
  },
  'history-03': {
    indicator: {
      code: 'B4.2.1.1.1',
      text: 'Describe how one major kingdom was formed and the reasons behind its expansion.',
    },
    hook: 'A little over 300 years ago, several small Akan states in the forest joined together. They became one of the strongest kingdoms in West Africa. How?',
    explain: [
      'The Asante kingdom grew in the forest belt of Ghana around Kumasi. In the late 1600s, Osei Tutu became its leader, helped by the priest Okomfo Anokye.',
      'At that time, the Asante states paid tribute to the powerful Denkyira kingdom. Osei Tutu united the states under one ruler, the Asantehene. The Golden Stool became the symbol of the nation’s unity and soul.',
      'The united Asante defeated Denkyira at the Battle of Feyiase in 1701. Asante then expanded by conquering neighbouring states, and grew rich from trade in gold and kola nuts.',
    ],
    art: {
      kind: 'belts',
      belts: [
        { name: 'Savanna belt', places: ['Mole-Dagbani states', 'Gonja'] },
        {
          name: 'Forest belt',
          places: ['Bono', 'Adansi', 'Asante', 'Denkyira', 'Akwamu'],
        },
        {
          name: 'Coastal belt',
          places: ['Anlo', 'Fante', 'Ga-Adangme', 'Effutu'],
        },
      ],
    },
    artCaption:
      'Kingdoms of Ghana by belt, from north to south. Asante is in the forest belt.',
    words: [
      {
        term: 'Kingdom',
        meaning: 'A land and people ruled by a king or queen.',
      },
      { term: 'Unity', meaning: 'Being joined together as one.' },
      {
        term: 'Expansion',
        meaning: 'Growing bigger, by taking in more land or people.',
      },
    ],
    examples: [
      {
        title: 'Why did Asante grow strong?',
        situation: 'List the reasons Asante rose and expanded.',
        steps: [
          'Unity: the states joined under one Asantehene.',
          'A shared symbol: the Golden Stool held the nation together.',
          'Victory: defeating Denkyira in 1701 ended paying tribute.',
          'Wealth: trade in gold and kola paid for a strong army.',
        ],
        answer:
          'Unity, strong leaders, victory and trade made Asante powerful.',
        art: {
          kind: 'timeline',
          events: [
            ['late 1600s', 'Osei Tutu unites the states'],
            ['1701', 'Asante defeats Denkyira at Feyiase'],
            ['1700s', 'Asante expands by trade and war'],
          ],
          focus: 1,
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Asante was always one big kingdom.',
        right: 'It began as several small states that chose to unite.',
      },
    ],
    realLife: [
      'The Asantehene’s palace at Manhyia in Kumasi.',
      'The Akwasidae festival.',
      'How teams and groups grow stronger by working together.',
    ],
    tryIt: {
      need: 'Paper and coloured pencils',
      steps: [
        'Draw the three belts of Ghana, from north to south.',
        'Write the kingdoms of each belt in the right place.',
        'Circle the kingdom closest to where you live.',
      ],
    },
  },
  'history-04': {
    indicator: {
      code: 'B4.2.1.1.2',
      text: 'State the factors that led to the decline of the kingdom you have studied.',
    },
    hook: 'Asante was strong for nearly 200 years. By 1901 it had lost its independence. What went wrong?',
    explain: [
      'A kingdom declines when it becomes weaker and loses power. This usually happens for several reasons together.',
      'Asante fought several wars with the British. In 1874, British soldiers entered Kumasi and burned it. After this defeat, some states that Asante ruled broke away, and leaders disagreed over who should rule.',
      'In 1896, the British sent the Asantehene, Prempeh I, into exile. In 1900, Yaa Asantewaa, the Queen Mother of Ejisu, led a war to protect the Golden Stool. After it, Britain made Asante part of its Gold Coast territory.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1874', 'British troops burn Kumasi'],
        ['1896', 'Prempeh I sent into exile'],
        ['1900', 'Yaa Asantewaa War'],
        ['1901', 'Asante under British rule'],
      ],
    },
    artCaption: 'Steps in the decline of Asante.',
    words: [
      { term: 'Decline', meaning: 'Becoming weaker and losing power.' },
      {
        term: 'Exile',
        meaning: 'Being forced to live away from your home country.',
      },
      {
        term: 'Succession dispute',
        meaning: 'A quarrel about who should be the next ruler.',
      },
    ],
    examples: [
      {
        title: 'Sort the causes',
        situation:
          'Sort these causes of Asante’s decline into “inside the kingdom” and “from outside”.',
        steps: [
          'Inside: states breaking away, and quarrels over who should rule.',
          'Outside: wars with the British, and the exile of the Asantehene.',
        ],
        answer: 'Both inside troubles and outside pressure led to the decline.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking one battle ended the kingdom.',
        right: 'The decline happened over many years, for many reasons.',
      },
      {
        wrong: 'Thinking the Asante people gave up.',
        right:
          'Yaa Asantewaa and others resisted bravely. The Asantehene still reigns today.',
      },
    ],
    realLife: [
      'Yaa Asantewaa is remembered as a hero of resistance.',
      'Prempeh I later returned to Kumasi.',
      'Leaders today learn that unity keeps a group strong.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a timeline of the decline, with the four dates.',
        'Next to each, write one sentence about what happened.',
        'Underline the event you think mattered most, and explain why.',
      ],
    },
  },
  'history-05': {
    indicator: {
      code: 'B4.1.4.1.1',
      text: 'Describe the history of Ghana’s major historical locations, such as Flagstaff House, Burma Camp, the James Town Lighthouse, the Gbewaa Palace and the Larabanga Mosque.',
    },
    hook: 'Some buildings are history you can visit. Each one has a story about who built it, and why.',
    explain: [
      'The James Town Lighthouse in Accra was first built by the British in the 1870s, to guide ships along the coast. It was rebuilt later, and its red and white tower still stands.',
      'Burma Camp in Accra is the headquarters of the Ghana Armed Forces. It is named after Burma in Asia, where soldiers from the Gold Coast fought in the Second World War.',
      'The Larabanga Mosque in the Savannah Region is built of mud with wooden supports. It is said to date from the 1400s, which would make it one of the oldest mosques in West Africa. The Gbewaa Palace in Yendi is the home of the Ya Na, the king of Dagbon.',
    ],
    art: {
      kind: 'building',
      building: 'lighthouse',
      label: 'The James Town Lighthouse, Accra',
    },
    artCaption:
      'The lighthouse has guided ships into Accra for about 150 years.',
    words: [
      {
        term: 'Historical location',
        meaning:
          'A place where important events of the past happened, or which has a long history.',
      },
      {
        term: 'Lighthouse',
        meaning: 'A tower with a bright light that guides ships safely.',
      },
      {
        term: 'Heritage',
        meaning: 'Places and traditions passed down from the past.',
      },
    ],
    examples: [
      {
        title: 'Ask the right questions',
        situation:
          'You visit the Larabanga Mosque. What should a history detective ask?',
        steps: [
          'Where is it?',
          'When was it built, and by whom?',
          'Why was it built?',
          'How has it changed, and how is it used today?',
        ],
        answer: 'These four questions unlock the history of any building.',
        art: {
          kind: 'building',
          building: 'mosque',
          label: 'The Larabanga Mosque',
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Writing on or damaging old buildings.',
        right: 'Historical places are shared treasure. Protect them.',
      },
    ],
    realLife: [
      'School trips to the castles at Cape Coast and Elmina.',
      'Seeing the lighthouse at James Town.',
      'Visiting the Kumasi military museum.',
    ],
    tryIt: {
      need: 'A building or monument near your home',
      steps: [
        'Find one old building or monument nearby.',
        'Answer the four detective questions about it, by asking older people.',
        'Draw it and write its story.',
      ],
    },
  },
  'history-06': {
    indicator: {
      code: 'B4.2.5.1.1',
      text: 'Identify the role played by some traditional rulers in national development.',
    },
    hook: 'Long before Ghana had a president, kings and queens led our peoples. Some of them helped shape the nation we have today.',
    explain: [
      'Traditional rulers are chiefs, kings and queen mothers chosen according to custom. They lead their people, keep peace and protect traditions.',
      'Some founded or built great states. Na Gbewaa of Pusiga is remembered as the founder of the Mole-Dagbani kingdoms. Ndewura Jakpa led the expansion of Gonja in the 1600s. Osei Tutu I united the Asante states.',
      'Others worked for the nation in modern times. Nana Sir Ofori Atta I of Akyem Abuakwa served in the colonial Legislative Council and supported education in his state.',
    ],
    art: {
      kind: 'building',
      building: 'palace',
      label: 'A royal palace: a seat of tradition',
    },
    artCaption: 'Palaces are the centres of traditional rule.',
    words: [
      {
        term: 'Traditional ruler',
        meaning: 'A chief, king or queen mother chosen by custom.',
      },
      { term: 'Founder', meaning: 'The person who started a state or group.' },
      {
        term: 'Queen mother',
        meaning:
          'A female leader who advises the chief and helps choose a new one.',
      },
    ],
    examples: [
      {
        title: 'Match the ruler',
        situation: 'Match each ruler to what they are remembered for.',
        steps: [
          'Na Gbewaa: founder of the Mole-Dagbani kingdoms.',
          'Ndewura Jakpa: expanded Gonja.',
          'Osei Tutu I: united Asante.',
          'Nana Sir Ofori Atta I: served the nation in the Legislative Council.',
        ],
        answer: 'Each ruler helped build a part of Ghana’s story.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only kings matter in history.',
        right:
          'Queen mothers have always been leaders too, like Yaa Asantewaa.',
      },
    ],
    realLife: [
      'Chiefs leading festivals such as Damba and Homowo.',
      'Chiefs settling quarrels in the community.',
      'Traditional rulers supporting schools.',
    ],
    tryIt: {
      need: 'Someone who knows your local chief’s history',
      steps: [
        'Find out the name of your local chief or queen mother.',
        'Ask one thing they have done for the community.',
        'Write a short thank-you note about it.',
      ],
    },
  },
  'history-07': {
    indicator: {
      code: 'B4.3.3.1.1',
      text: 'Describe European missionary activities in Ghana.',
    },
    hook: 'Some Europeans came to the Gold Coast not to trade but to teach and to spread Christianity. They changed schools and languages for ever.',
    explain: [
      'Missionaries are people sent to spread their religion. Catholic priests came with the Portuguese to Elmina in the 1400s, and Anglican teachers worked at Cape Coast in the 1700s. The great missionary work began in the 1800s.',
      'The Basel Mission arrived in 1828 and worked in Christiansborg and Akropong-Akuapem. The Wesleyan Methodists arrived at Cape Coast in 1835. The Bremen Mission worked among the Ewe at Peki from 1847, and Catholic missionaries returned to Elmina in 1880.',
      'Missionaries built churches, schools, hospitals and workshops. They also wrote down local languages and translated the Bible into them.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1828', 'Basel Mission arrives'],
        ['1835', 'Wesleyan Methodists arrive'],
        ['1847', 'Bremen Mission at Peki'],
        ['1880', 'Catholic missionaries return'],
      ],
    },
    artCaption: 'Missionary societies in the 1800s, in order of arrival.',
    words: [
      { term: 'Missionary', meaning: 'A person sent to spread a religion.' },
      {
        term: 'Mission station',
        meaning: 'A place where missionaries lived, worshipped and taught.',
      },
      {
        term: 'Formal education',
        meaning: 'Learning in a school with teachers, books and lessons.',
      },
    ],
    examples: [
      {
        title: 'Where did they work?',
        situation: 'Match each mission to an area where it worked.',
        steps: [
          'Basel Mission: Akropong-Akuapem.',
          'Wesleyan Methodists: Cape Coast.',
          'Bremen Mission: Peki.',
          'Catholic missionaries: Elmina.',
        ],
        answer: 'Each mission had its own centre, from which it spread.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking missionaries only built churches.',
        right:
          'They also built schools, hospitals and workshops, and wrote down languages.',
      },
    ],
    realLife: [
      'Many old schools began as mission schools.',
      'Churches founded in the 1800s still worship today.',
      'Bibles in Twi, Ga and Ewe.',
    ],
    tryIt: {
      need: 'An older person or a church member',
      steps: [
        'Find out which mission started the oldest church or school near you.',
        'Ask when it was founded.',
        'Add it to a class timeline of missions.',
      ],
    },
  },
  'history-08': {
    indicator: { code: 'B4.4.1.1.1', text: 'Examine the Bond of 1844.' },
    hook: 'On 6 March 1844, coastal chiefs and a British officer signed a short agreement. It seemed small, but it opened the door to colonial rule.',
    explain: [
      'In the early 1800s, the British had forts on the coast and wanted more say over the peoples nearby. Coastal states such as the Fante also wanted British help against Asante.',
      'On 6 March 1844, Fante and other coastal chiefs signed the Bond with Commander Henry Worsley Hill at Cape Coast. They agreed that serious crimes, such as murder and robbery, would be tried by British officers together with the chiefs.',
      'The Bond also banned human sacrifice and panyarring, which was seizing a person to force their family to pay a debt. It did not hand over the land, but it was a first step towards British rule.',
    ],
    art: {
      kind: 'scroll',
      title: 'The Bond of 1844',
      date: 'Signed at Cape Coast, 6 March 1844',
      lines: [
        'British power over serious crimes is accepted.',
        'Murder and robbery to be tried by British',
        'officers together with the chiefs.',
        'Human sacrifice and panyarring are banned.',
      ],
    },
    artCaption: 'The main points of the Bond, in simple words.',
    words: [
      {
        term: 'Bond',
        meaning: 'A written agreement that people promise to keep.',
      },
      {
        term: 'Panyarring',
        meaning: 'Seizing a person to force their family to pay a debt.',
      },
      {
        term: 'Jurisdiction',
        meaning: 'The power to judge cases and make decisions.',
      },
    ],
    examples: [
      {
        title: 'Why does it matter?',
        situation: 'Explain why the Bond of 1844 is important.',
        steps: [
          'It gave the British a say in justice in the coastal states.',
          'From there, British power grew step by step.',
          'Ghana’s independence came on the same date, 6 March, in 1957.',
        ],
        answer:
          'The Bond was an early step towards colonial rule, which is why independence day recalls it.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the Bond gave Britain the land of the Gold Coast.',
        right:
          'It only dealt with justice in serious crimes. Colonial rule came later.',
      },
    ],
    realLife: [
      'Independence Day on 6 March.',
      'Agreements made between groups today.',
      'Visiting Cape Coast Castle, where the British governed the coast.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Write the three main points of the Bond in your own words.',
        'For each, write whether you think it was fair to the chiefs.',
        'Discuss your answers with a friend.',
      ],
    },
  },
  'history-09': {
    indicator: {
      code: 'B4.4.1.2.1',
      text: 'Describe how the Colony, Asante, the Northern Territories and British Togoland became one territory known as the Gold Coast.',
    },
    hook: 'Today Ghana is one country with 16 regions. But it was once four separate areas. How did they come together?',
    explain: [
      'The southern coastal area became the Gold Coast Colony in 1874. A colony is ruled directly by another country.',
      'After the war of 1900, Britain took control of Asante. The north became the Northern Territories, a protectorate, which is an area a stronger country controls and claims to protect. George Ekem Ferguson, a Gold Coast surveyor, signed treaties with northern chiefs for the British in the 1890s.',
      'After the First World War, part of German Togoland was given to Britain to look after. In 1956, the people of British Togoland voted to join the Gold Coast, which became independent Ghana in 1957.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1874', 'The Colony'],
        ['1901', 'Asante and Northern Territories'],
        ['after 1918', 'British Togoland'],
        ['1957', 'Ghana'],
      ],
    },
    artCaption: 'Four areas joined together, step by step.',
    words: [
      { term: 'Colony', meaning: 'An area ruled directly by another country.' },
      {
        term: 'Protectorate',
        meaning:
          'An area that a stronger country controls and claims to protect.',
      },
      {
        term: 'Plebiscite',
        meaning: 'A vote by the people on one important question.',
      },
    ],
    examples: [
      {
        title: 'Colony or protectorate?',
        situation:
          'Was the north a colony or a protectorate, and what is the difference?',
        steps: [
          'The north was the Northern Territories Protectorate.',
          'A colony was ruled directly.',
          'A protectorate kept more of its local rulers, under British control.',
        ],
        answer:
          'The north was a protectorate. In both, Britain held the real power.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghana always had the same borders.',
        right: 'British Togoland only joined in 1956, after a vote.',
      },
    ],
    realLife: [
      'Ghana’s regions today.',
      'Why Ghana borders Togo, Burkina Faso and Côte d’Ivoire.',
      'Ewe communities living on both sides of the eastern border.',
    ],
    tryIt: {
      need: 'A map of Ghana from an atlas or textbook',
      steps: [
        'Find where the coast, Asante and the north are.',
        'Find the area that was British Togoland, in the Volta and Oti regions.',
        'Name the region where you live today.',
      ],
    },
  },
  'history-10': {
    indicator: {
      code: 'B4.6.1.1.1',
      text: 'Explain that Ghana up to June 1960, though independent, had the Queen of the United Kingdom as Head of State, which limited its independence.',
    },
    hook: 'Ghana became independent in 1957. Yet for three more years, the head of state was the Queen of England. How could that be?',
    explain: [
      'From 1957 to 1960, Ghana was independent, but Queen Elizabeth II was still its Head of State. A Governor-General represented her in Ghana. Kwame Nkrumah led the government as Prime Minister.',
      'This limited Ghana’s independence. British officers still led the army, and the final court of appeal was in London.',
      'On 1 July 1960, Ghana became a republic: a country whose head of state is chosen by its people, not a king or queen. Kwame Nkrumah became Ghana’s first President.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['6 March 1957', 'Independence, under the Queen'],
        ['1 July 1960', 'Ghana becomes a Republic'],
      ],
      focus: 1,
    },
    artCaption: 'Ghana became fully self-governing as a republic in 1960.',
    words: [
      {
        term: 'Head of State',
        meaning: 'The top leader who represents a country.',
      },
      {
        term: 'Republic',
        meaning:
          'A country whose head of state is chosen by the people, not born to rule.',
      },
      {
        term: 'Governor-General',
        meaning:
          'The person who represented the Queen in Ghana from 1957 to 1960.',
      },
    ],
    examples: [
      {
        title: 'Before and after',
        situation: 'Compare Ghana in 1958 and in 1961.',
        steps: [
          '1958: the Queen was Head of State, and Nkrumah was Prime Minister.',
          '1961: Ghana was a republic, and Nkrumah was President and Head of State.',
        ],
        answer:
          'In 1960 Ghana took the final step: its own people chose its Head of State.',
      },
      {
        title: 'Ghana’s four Republics',
        situation: 'Ghana has had four republics. Who led each one?',
        steps: [
          'First Republic, 1960: President Kwame Nkrumah.',
          'Second Republic, 1969: Prime Minister Kofi Abrefa Busia led the government.',
          'Third Republic, 1979: President Hilla Limann.',
          'Fourth Republic, 1993 to today: first led by President Jerry John Rawlings.',
        ],
        answer: 'Between the republics, military governments ruled Ghana.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghana became a republic in 1957.',
        right: 'Independence came in 1957. The republic came in 1960.',
      },
    ],
    realLife: [
      'Republic Day on 1 July.',
      'Electing Ghana’s President today.',
      'Learning the names of Ghana’s presidents.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a timeline from 1957 to today.',
        'Mark the start of each of the four republics.',
        'Add the name of the leader for each.',
      ],
    },
  },
  'history-11': {
    indicator: {
      code: 'B5.5.3.1.2',
      text: 'Examine sources of evidence about what happened during the 1948 riots.',
    },
    hook: 'On 28 February 1948, ex-soldiers marched peacefully through Accra. By the end of the day, three of them had been shot dead. How do we know what happened?',
    explain: [
      'Many Gold Coast soldiers fought for Britain in the Second World War. When they came home, they did not receive the payments and help they had been promised. At the same time, imported goods were very expensive, and people boycotted European shops.',
      'On 28 February 1948, the ex-servicemen marched to Christiansborg Castle to present a petition to the Governor. At the Christiansborg crossroads, police opened fire. Sergeant Adjetey, Corporal Attipoe and Private Odartey Lamptey were killed. Riots spread in Accra and other towns.',
      'The British arrested six leaders of the United Gold Coast Convention, known as the Big Six, and set up the Watson Commission to investigate. These events sped up the road to independence.',
    ],
    art: { kind: 'sources', items: ['newspaper', 'photo', 'letter', 'drum'] },
    artCaption:
      'Newspapers, photographs, reports and memories all tell the story.',
    words: [
      { term: 'Ex-servicemen', meaning: 'People who used to be soldiers.' },
      {
        term: 'Petition',
        meaning:
          'A written request signed by people who want something changed.',
      },
      { term: 'Boycott', meaning: 'Refusing to buy goods to protest.' },
      {
        term: 'Commission',
        meaning: 'A group set up to find out what happened and why.',
      },
    ],
    examples: [
      {
        title: 'Weigh the evidence',
        situation:
          'Which sources would tell us about the shooting at the crossroads?',
        steps: [
          'Newspapers from February 1948.',
          'Photographs taken at the time.',
          'The Watson Commission report.',
          'The memories of people who were there, told to their children.',
        ],
        answer:
          'Using several sources together gives a fuller and fairer picture.',
      },
    ],
    mistakes: [
      {
        wrong: 'Trusting just one account of an event.',
        right:
          'Compare sources. Different people saw and remembered different things.',
      },
    ],
    realLife: [
      'The memorial at the Christiansborg crossroads in Osu.',
      'Remembering the three ex-servicemen who died.',
      'How people use petitions today.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Write what happened on 28 February 1948 in five sentences.',
        'Next to each sentence, name a source that could prove it.',
        'Discuss which source you would trust most, and why.',
      ],
    },
  },
  'history-12': {
    indicator: {
      code: 'B4.1.1.1.1',
      text: 'Explain the importance of studying the history of Ghana: how history defines our identity.',
    },
    hook: 'Your name, your hometown and your family all have a history. Knowing it helps you know yourself.',
    explain: [
      'Every person has a history. Your name may tell the day you were born, the family you belong to, or an ancestor you are named after.',
      'Among the Akan, for example, a boy born on Friday may be called Kofi and a girl Afua. Many Ghanaian peoples have naming customs with meanings.',
      'A family tree shows how the people in your family are related. Knowing your family history connects you to your community and to Ghana’s story.',
    ],
    art: {
      kind: 'family',
      rows: [['Grandfather', 'Grandmother'], ['Father', 'Mother'], ['Me']],
    },
    artCaption: 'A simple family tree, with three generations.',
    words: [
      {
        term: 'Ancestor',
        meaning: 'A family member who lived long before you.',
      },
      {
        term: 'Family tree',
        meaning: 'A chart that shows how family members are related.',
      },
      {
        term: 'Generation',
        meaning:
          'People born around the same time in a family, such as parents or grandparents.',
      },
    ],
    examples: [
      {
        title: 'What is in a name?',
        situation: 'Kwame was born on a Saturday. What does his name tell us?',
        steps: [
          'Among the Akan, Kwame is the name for a boy born on Saturday.',
          'His name records the day of his birth.',
        ],
        answer: 'A name can be a small piece of history.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking your family has no history.',
        right: 'Every family has a story worth learning.',
      },
    ],
    realLife: [
      'Naming ceremonies (outdooring).',
      'Family gatherings and funerals, where family histories are told.',
      'Answering “Where is your hometown?”',
    ],
    tryIt: {
      need: 'Family members to interview',
      steps: [
        'Ask what your name means and why it was chosen.',
        'Ask the names of your grandparents and where they came from.',
        'Draw your family tree for three generations.',
      ],
    },
  },
  'history-13': {
    indicator: {
      code: 'B4.1.1.2.1',
      text: 'Identify the sources of history: using them as evidence.',
    },
    hook: 'Two people tell you different stories about the same event. How does a historian decide what really happened?',
    explain: [
      'Evidence is information that shows something is true. A good historian never relies on one source alone.',
      'Check whether the source was made at the time, and by someone who was there. Ask whether the person had a reason to exaggerate.',
      'When different sources agree, we can be more confident. When they disagree, we look for more evidence.',
    ],
    art: {
      kind: 'sources',
      items: ['newspaper', 'letter', 'photo', 'brochure'],
    },
    artCaption: 'Compare the sources, like a detective.',
    words: [
      {
        term: 'Evidence',
        meaning: 'Information that shows whether something is true.',
      },
      { term: 'Reliable', meaning: 'Able to be trusted.' },
      {
        term: 'Bias',
        meaning: 'Favouring one side, so that a source is not fair.',
      },
    ],
    examples: [
      {
        title: 'The bushfire',
        situation:
          'An old newspaper says a bushfire destroyed 10 farms in 1983. A grandmother remembers that it was “many farms”. What can we say?',
        steps: [
          'Both sources agree there was a big bushfire.',
          'The newspaper gives a number. The memory gives a feeling.',
          'Together, they make the event more certain.',
        ],
        answer: 'There was a large bushfire in 1983 that destroyed many farms.',
      },
    ],
    mistakes: [
      {
        wrong: 'Believing a source just because it is old.',
        right: 'Old sources can be wrong too. Check them against others.',
      },
    ],
    realLife: [
      'Checking news before you share it.',
      'Listening to both sides in a quarrel.',
      'Reading more than one book on a topic.',
    ],
    tryIt: {
      need: 'Two people who remember the same event',
      steps: [
        'Ask each one about the event separately.',
        'Write down what they agree on.',
        'Write down where they differ, and think about why.',
      ],
    },
  },
  'history-14': {
    indicator: {
      code: 'B4.2.1.1.1',
      text: 'Describe how one major kingdom was formed and expanded: comparing kingdoms across Ghana.',
    },
    hook: 'Asante was not the only great kingdom. In the north, south and east, other peoples built strong states too.',
    explain: [
      'Ghana’s kingdoms grew in three belts. In the savanna belt of the north were the Mole-Dagbani states and Gonja. In the forest belt were Bono, Adansi, Denkyira, Akwamu and Asante. On the coast were the Anlo, Fante, Ga-Adangme and Effutu.',
      'Gonja grew in the north under Ndewura Jakpa in the 1600s. It expanded through war and controlled trade routes across the savanna.',
      'Each kingdom grew where it could farm, trade and defend itself. Location helped explain its strength.',
    ],
    art: {
      kind: 'belts',
      belts: [
        { name: 'Savanna belt', places: ['Mole-Dagbani states', 'Gonja'] },
        {
          name: 'Forest belt',
          places: ['Bono', 'Adansi', 'Asante', 'Denkyira', 'Akwamu'],
        },
        {
          name: 'Coastal belt',
          places: ['Anlo', 'Fante', 'Ga-Adangme', 'Effutu'],
        },
      ],
    },
    artCaption: 'Where Ghana’s kingdoms grew.',
    words: [
      { term: 'Savanna', meaning: 'Grassland with few trees, in the north.' },
      {
        term: 'Trade route',
        meaning: 'A path along which traders carried goods.',
      },
      { term: 'State', meaning: 'A people living under one government.' },
    ],
    examples: [
      {
        title: 'Compare two kingdoms',
        situation:
          'How were Gonja and Asante alike, and how were they different?',
        steps: [
          'Alike: both expanded through war, and both grew rich from trade.',
          'Different: Gonja was in the savanna, and Asante in the forest.',
          'Different: Asante traded gold and kola, while Gonja controlled northern trade routes.',
        ],
        answer:
          'Both used war and trade to grow, but their surroundings were different.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking all of Ghana’s kingdoms were Akan.',
        right:
          'Kingdoms grew among many peoples: Mole-Dagbani, Gonja, Ewe, Ga-Adangme and others.',
      },
    ],
    realLife: [
      'Festivals in every region celebrate their own history.',
      'Traditional areas and chiefs across Ghana today.',
      'Trade routes that became today’s roads.',
    ],
    tryIt: {
      need: 'Paper and coloured pencils',
      steps: [
        'Choose one kingdom from each belt.',
        'For each, write one fact about where it was and how it grew.',
        'Share your three facts with the class.',
      ],
    },
  },
  'history-15': {
    indicator: {
      code: 'B4.2.1.1.2',
      text: 'State the factors that led to the decline of a kingdom: comparing declines.',
    },
    hook: 'Asante was not the first kingdom to fall. Denkyira and Akwamu were once powerful too. What do their stories teach us?',
    explain: [
      'Denkyira was a strong forest kingdom that collected tribute from its neighbours. In 1701, the Asante defeated Denkyira at Feyiase, and its power fell.',
      'Akwamu once ruled a large area near Accra. Around 1730, its neighbours, led by Akyem, joined forces and defeated it. Many Akwamu people moved east of the Volta, where the Akwamu state continues today.',
      'Kingdoms declined for similar reasons: harsh rule that made neighbours angry, quarrels inside, defeat by stronger enemies, and later, British interference.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1701', 'Denkyira defeated'],
        ['about 1730', 'Akwamu defeated'],
        ['1874', 'Kumasi burned'],
        ['1901', 'Asante under British rule'],
      ],
    },
    artCaption: 'Three kingdoms, three declines.',
    words: [
      {
        term: 'Tribute',
        meaning: 'Payment that a weaker state had to give a stronger one.',
      },
      { term: 'Rebellion', meaning: 'Fighting against your own rulers.' },
      {
        term: 'Interference',
        meaning: 'Getting involved in other people’s affairs.',
      },
    ],
    examples: [
      {
        title: 'Find a pattern',
        situation:
          'What did the declines of Denkyira and Akwamu have in common?',
        steps: [
          'Both had ruled other peoples harshly.',
          'Those peoples joined their enemies.',
          'Both lost a major war.',
        ],
        answer:
          'Ruling neighbours harshly made enemies, and that weakened both kingdoms.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a kingdom disappears completely when it declines.',
        right:
          'Its people and traditions often continue, as Akwamu and Denkyira do today.',
      },
    ],
    realLife: [
      'Treating neighbours fairly keeps peace.',
      'Leaders today learn from the mistakes of the past.',
      'Traditional states that still exist today.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a table with three columns: Denkyira, Akwamu, Asante.',
        'Write one cause of decline for each.',
        'Circle any cause they share.',
      ],
    },
  },
  'history-16': {
    indicator: {
      code: 'B4.1.4.1.1',
      text: 'Describe the history of Ghana’s major historical locations: how they change over time.',
    },
    hook: 'A building can keep its walls but change its job. Some of Ghana’s historic places have had many lives.',
    explain: [
      'Historians study change and continuity. Change is what becomes different. Continuity is what stays the same.',
      'Flagstaff House in Accra was once used by Kwame Nkrumah as his office and home. Today, the seat of the Presidency, Jubilee House, stands on the same site.',
      'In Kumasi, the fort built by the British in the 1890s is now the Armed Forces Museum. The building stayed, but its use changed from fighting to remembering.',
    ],
    art: {
      kind: 'building',
      building: 'fort',
      coast: false,
      label: 'A fort that became a museum',
    },
    artCaption: 'Old forts now teach us about the past.',
    words: [
      { term: 'Change', meaning: 'What becomes different over time.' },
      { term: 'Continuity', meaning: 'What stays the same over time.' },
      {
        term: 'Museum',
        meaning: 'A building where objects from the past are kept and shown.',
      },
    ],
    examples: [
      {
        title: 'Then and now',
        situation:
          'The Kumasi fort was built by the British in the 1890s. Today it is a museum. What changed, and what stayed the same?',
        steps: [
          'Continuity: the walls and the place are the same.',
          'Change: it once held soldiers, but now holds history for visitors.',
        ],
        answer: 'The building continues, but its purpose has changed.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a place’s history stops when it is built.',
        right: 'Its history keeps growing as people use it in new ways.',
      },
    ],
    realLife: [
      'Old school buildings used for new classes.',
      'Castles that became museums.',
      'Markets that have been in the same place for generations.',
    ],
    tryIt: {
      need: 'An old building in your community',
      steps: [
        'Find out what it was first used for.',
        'Find out what it is used for now.',
        'Write one change and one continuity.',
      ],
    },
  },
  'history-17': {
    indicator: {
      code: 'B4.2.5.1.1',
      text: 'Identify the role played by traditional rulers in national development: their work today.',
    },
    hook: 'Chiefs and queen mothers are not only part of the past. Today they still help develop their communities and the nation.',
    explain: [
      'Traditional rulers take care of land, which in many communities belongs to the people and is held by the chief.',
      'They settle disputes, keep the peace, and lead festivals that keep culture alive. Many raise money for schools, clinics and roads.',
      'Ghana’s Constitution recognises chieftaincy. The National House of Chiefs brings traditional rulers together to advise on customs and national matters.',
    ],
    art: {
      kind: 'building',
      building: 'palace',
      label: 'Traditional rule continues today',
    },
    artCaption: 'Chiefs still serve their communities.',
    words: [
      {
        term: 'Chieftaincy',
        meaning: 'The traditional system of chiefs and queen mothers.',
      },
      {
        term: 'Custodian',
        meaning: 'A person who looks after something for others.',
      },
      {
        term: 'Development',
        meaning: 'Improving people’s lives, with schools, roads and clinics.',
      },
    ],
    examples: [
      {
        title: 'A chief at work',
        situation:
          'Two farmers argue about the boundary between their farms. How might a chief help?',
        steps: [
          'The chief listens to both farmers.',
          'Elders who know the history of the land are asked.',
          'The chief decides fairly, and peace is kept.',
        ],
        answer:
          'Settling disputes is one way chiefs keep their communities peaceful.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking chiefs have no role now that Ghana has a government.',
        right:
          'Chiefs and the government both serve the people, in different ways.',
      },
    ],
    realLife: [
      'Festivals led by chiefs.',
      'Education funds set up by traditional rulers.',
      'Chiefs welcoming visitors to a town.',
    ],
    tryIt: {
      need: 'Someone who knows your community well',
      steps: [
        'Find out one project your chief or queen mother has supported.',
        'Ask how it helps the community.',
        'Draw a picture of it.',
      ],
    },
  },
  'history-18': {
    indicator: {
      code: 'B4.3.3.1.1',
      text: 'Describe European missionary activities in Ghana: their lasting effects.',
    },
    hook: 'If you read a Bible in Twi or attend a school started by a church, you meet missionary history every day.',
    explain: [
      'Missionaries started schools that trained Ghana’s first teachers and clerks. The Basel Mission opened a teacher-training college at Akropong in 1848.',
      'Missionaries worked with Ghanaians to write languages in the alphabet. Johann Gottlieb Christaller completed a Bible in Twi in 1871, and Johannes Zimmermann translated the Bible into Ga.',
      'People still debate their effects. They brought schools, hospitals and new skills, but some taught that local customs were wrong, which harmed respect for Ghanaian culture.',
    ],
    art: {
      kind: 'building',
      building: 'school',
      label: 'Many of Ghana’s oldest schools began as mission schools',
    },
    artCaption: 'Mission schools trained Ghana’s first teachers.',
    words: [
      {
        term: 'Translation',
        meaning: 'Changing words from one language into another.',
      },
      { term: 'Legacy', meaning: 'What is left behind for the future.' },
      {
        term: 'Debate',
        meaning: 'A discussion where people give reasons for different views.',
      },
    ],
    examples: [
      {
        title: 'Weigh the effects',
        situation:
          'List one good effect and one harmful effect of missionary work.',
        steps: [
          'Good: schools and hospitals that still serve people.',
          'Harmful: some missionaries looked down on local customs and religions.',
        ],
        answer: 'Historians weigh both sides before making a judgement.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the effects were all good, or all bad.',
        right: 'Look at the evidence for both sides.',
      },
    ],
    realLife: [
      'Schools and hospitals named after churches.',
      'Hymns sung in Ghanaian languages.',
      'Ghanaian language books printed today.',
    ],
    tryIt: {
      need: 'A friend or classmates',
      steps: [
        'Hold a short debate: “Missionary work helped Ghana more than it harmed it.”',
        'One side gives reasons for, the other against.',
        'Each side must give evidence for its reasons.',
      ],
    },
  },
  'history-19': {
    indicator: {
      code: 'B4.4.1.1.1',
      text: 'Examine the Bond of 1844: reading it as a primary source.',
    },
    hook: 'The Bond of 1844 is a primary source: a document from the time. Historians read every line carefully, asking who wrote it and why.',
    explain: [
      'The Bond was written by the British and signed by Fante and other coastal chiefs, who marked their names on it.',
      'A careful reader asks: who gained most from this agreement? The British gained power over justice. The chiefs hoped for protection, and to end practices such as panyarring.',
      'Reading the Bond today, we can see how a small agreement about crimes grew, over the next decades, into British rule over the whole country.',
    ],
    art: {
      kind: 'scroll',
      title: 'The Bond of 1844',
      date: 'A primary source from Cape Coast',
      lines: [
        'Who wrote it?',
        'Who signed it?',
        'Why was it made?',
        'Who gained the most?',
      ],
    },
    artCaption: 'Four questions to ask of any document.',
    words: [
      {
        term: 'Primary source',
        meaning: 'A source made at the time of the events.',
      },
      { term: 'Motive', meaning: 'The reason someone does something.' },
      {
        term: 'Consequence',
        meaning: 'What happens as a result of something.',
      },
    ],
    examples: [
      {
        title: 'Read like a historian',
        situation: 'Why might coastal chiefs have signed the Bond?',
        steps: [
          'They wanted British help against Asante.',
          'They wanted trade with the British to continue.',
          'They did not expect it to lead to colonial rule.',
        ],
        answer:
          'The chiefs had their own reasons. Its consequences were bigger than they expected.',
      },
    ],
    mistakes: [
      {
        wrong: 'Judging people in the past only by what we know now.',
        right: 'Ask what they knew, and wanted, at the time.',
      },
    ],
    realLife: [
      'Reading terms carefully before agreeing to anything.',
      'Asking who benefits from a deal.',
      'Cape Coast Castle, where the British governed.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write the four questions from the picture.',
        'Answer each one about the Bond of 1844.',
        'Write one sentence: was the Bond fair? Give a reason.',
      ],
    },
  },
  'history-20': {
    indicator: {
      code: 'B4.4.1.2.1',
      text: 'Describe how the different areas became one territory: then and now.',
    },
    hook: 'Look at a map of the Gold Coast in 1955 and a map of Ghana today. What has changed, and what has stayed the same?',
    explain: [
      'In 1955, the Gold Coast was made up of the Colony, Asante, the Northern Territories, and British Togoland held as a trust territory.',
      'Today Ghana has 16 regions. The country’s outer borders are largely the same as when it became independent, but the regions inside have been divided again and again.',
      'Ghana has stayed one country, even though it was formed from different areas. Our unity is something each generation must protect.',
    ],
    art: { kind: 'flag', label: 'Four areas, one nation' },
    artCaption: 'The flag of Ghana, raised for the first time on 6 March 1957.',
    words: [
      {
        term: 'Region',
        meaning: 'An area of the country with its own regional capital.',
      },
      {
        term: 'Border',
        meaning: 'The line where one country ends and another begins.',
      },
      {
        term: 'Trust territory',
        meaning: 'An area one country looked after for the United Nations.',
      },
    ],
    examples: [
      {
        title: 'Then and now',
        situation:
          'What changed between the Gold Coast of 1955 and Ghana today?',
        steps: [
          'Then: four areas under British rule.',
          'Now: one independent country with 16 regions.',
          'The same: the land and the outer borders, mostly.',
        ],
        answer:
          'Ghana changed from a colony of four areas into one free nation.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking a map never changes.',
        right: 'Regions and names change as countries change.',
      },
    ],
    realLife: [
      'Your region and its capital.',
      'New regions created in recent years.',
      'Travelling across regions to visit family.',
    ],
    tryIt: {
      need: 'A map of Ghana today',
      steps: [
        'Count the regions.',
        'Find your region and its capital.',
        'Find a region that was part of the Northern Territories, and one that was part of British Togoland.',
      ],
    },
  },
}
