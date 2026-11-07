import type { CourseGuides } from './types'

// Basic 6 History, written for this course and scoped to the NaCCA History of
// Ghana Curriculum for Primary Schools (2019). Notes:
// - The course repeats its indicators: lessons 10 to 18 repeat 1 to 9, and 19
//   and 20 repeat 1 and 2 again. Each repeat takes a new angle.
// - Political history is told neutrally: dates, offices and events, with
//   debates presented as debates. No party or leader is praised or blamed.
// - Facts run to November 2026.

export const guides: CourseGuides = {
  'history-01': {
    indicator: {
      code: 'B6.3.4.1.1',
      text: 'Assess the changes that the European presence brought to Ghana.',
    },
    hook: 'Europeans were on Ghana’s coast for almost 500 years. Some of what they brought is still part of our daily lives. What changed?',
    explain: [
      'Formal education spread through mission and government schools. More people learned to read and write, and many became teachers, clerks, nurses and lawyers.',
      'Hospitals and clinics brought new medicines. Missionaries and Ghanaian scholars wrote down local languages and translated the Bible into them.',
      'New crops such as cocoa, new roads and railways, and money in coins and notes changed how people worked and traded.',
    ],
    art: { kind: 'thenNow', rows: ['home', 'travel', 'message', 'money'] },
    artCaption: 'Daily life changed in many ways over the centuries.',
    words: [
      { term: 'Impact', meaning: 'The effect that something has.' },
      {
        term: 'Formal education',
        meaning: 'Learning in schools, with teachers, books and lessons.',
      },
      {
        term: 'Assess',
        meaning:
          'Judge how good, bad or important something is, using evidence.',
      },
    ],
    examples: [
      {
        title: 'Sort the changes',
        situation:
          'Sort these changes: schools, hospitals, cocoa farming, railways.',
        steps: [
          'Social changes: schools and hospitals.',
          'Economic changes: cocoa farming and railways.',
        ],
        answer: 'European presence changed both social life and the economy.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghanaians only received changes passively.',
        right:
          'Ghanaians shaped these changes, as teachers, farmers, translators and leaders.',
      },
    ],
    realLife: [
      'English as Ghana’s official language.',
      'Schools and hospitals founded long ago.',
      'Cocoa farms across the forest regions.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'List five things in your daily life that came from contact with Europe.',
        'List five that are fully Ghanaian.',
        'Discuss which list was easier to make, and why.',
      ],
    },
  },
  'history-02': {
    indicator: {
      code: 'B6.4.4.1.1',
      text: 'Describe the features of British colonial rule in Ghana, including “direct” and “indirect” rule, 1874–1957.',
    },
    hook: 'Britain ruled the Gold Coast with only a few British officials. How could so few people govern so many?',
    explain: [
      'In direct rule, British officials governed people themselves, making and enforcing the laws.',
      'In indirect rule, the British governed through traditional chiefs. Chiefs kept their positions, collected taxes and judged local cases, but they had to follow the orders of British officers.',
      'Indirect rule was cheap for Britain and used leaders people already respected. But some people began to see chiefs as working for the British, and the educated elite were often left out.',
    ],
    art: {
      kind: 'family',
      rows: [['Governor'], ['British officers'], ['Chiefs'], ['The people']],
    },
    artCaption: 'Indirect rule: British power passed through the chiefs.',
    words: [
      {
        term: 'Direct rule',
        meaning: 'Governing people through your own officials.',
      },
      {
        term: 'Indirect rule',
        meaning: 'Governing people through their traditional rulers.',
      },
      {
        term: 'Educated elite',
        meaning:
          'People with a school or university education, such as lawyers and teachers.',
      },
    ],
    examples: [
      {
        title: 'Weigh it up',
        situation: 'Give one advantage and one disadvantage of indirect rule.',
        steps: [
          'Advantage: it was cheaper, and people knew their chiefs.',
          'Disadvantage: chiefs could lose respect if seen as serving the British.',
        ],
        answer:
          'Indirect rule worked for Britain, but it created tensions in communities.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking chiefs kept full power under indirect rule.',
        right: 'Chiefs ruled, but British officers had the final say.',
      },
    ],
    realLife: [
      'Chiefs and district assemblies working side by side today.',
      'District capitals, many of which date from colonial times.',
      'Debates about the role of chiefs in government.',
    ],
    tryIt: {
      need: 'Two or three classmates',
      steps: [
        'Act out indirect rule: one is the British officer, one the chief, and others the people.',
        'The officer gives an order through the chief.',
        'Discuss how each person felt.',
      ],
    },
  },
  'history-03': {
    indicator: {
      code: 'B6.5.2.1.1',
      text: 'Describe the role played by the leaders of the two major political parties (UGCC and CPP) in the independence struggle after the Second World War.',
    },
    hook: 'Two political parties led the Gold Coast to independence. Their leaders sometimes agreed and sometimes clashed. Who were they?',
    explain: [
      'A political party is a group of people with shared views who come together to contest elections and form a government.',
      'The United Gold Coast Convention (UGCC) was formed at Saltpond in 1947. Its leaders included J. B. Danquah and George Alfred Grant. They invited Kwame Nkrumah to be its general secretary.',
      'In 1949, Nkrumah broke away and formed the Convention People’s Party (CPP), with the slogan “Self-Government Now”. The UGCC wanted independence in the shortest possible time; the CPP wanted it immediately.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1947', 'UGCC formed'],
        ['1948', 'The Big Six arrested'],
        ['1949', 'CPP formed'],
      ],
    },
    artCaption: 'The parties that led the way to independence.',
    words: [
      {
        term: 'Political party',
        meaning:
          'A group with shared views that contests elections to form a government.',
      },
      { term: 'Self-government', meaning: 'A people ruling themselves.' },
      {
        term: 'Slogan',
        meaning: 'A short, memorable phrase that sums up a group’s aim.',
      },
    ],
    examples: [
      {
        title: 'Compare the parties',
        situation: 'How were the UGCC and the CPP different?',
        steps: [
          'UGCC: led mostly by lawyers and businessmen; independence “in the shortest possible time”.',
          'CPP: drew support from ordinary workers, farmers and young people; “Self-Government Now”.',
        ],
        answer:
          'Both wanted independence; they differed on speed and on whom they spoke for.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking one person won independence alone.',
        right: 'Many leaders and ordinary people played their part.',
      },
    ],
    realLife: [
      'Political parties in Ghana today.',
      'Party slogans at election time.',
      'Statues and streets named after independence leaders.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a table of UGCC and CPP.',
        'For each, write when it was formed, two leaders and its main aim.',
        'Write which slogan you find more powerful, and why.',
      ],
    },
  },
  'history-04': {
    indicator: {
      code: 'B6.5.4.1.1',
      text: 'Explain post-World War II developments in the Gold Coast.',
    },
    hook: 'After the riots of 1948, the British sent a commission to find out what had gone wrong. What did it say?',
    explain: [
      'In 1948, the British set up the Watson Commission to investigate the riots. It found that people were angry about rising prices and about having little say in their own government.',
      'It recommended a new constitution, giving Africans a bigger role. The British then set up the Coussey Committee, made up only of Africans, to draft it.',
      'The Coussey Committee, led by Justice Henley Coussey, reported in 1949. Its proposals led to the 1951 Constitution, which created an assembly with many elected African members.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1948', 'Watson Commission'],
        ['1949', 'Coussey Committee reports'],
        ['1951', 'New constitution'],
      ],
    },
    artCaption: 'From riots to a new constitution.',
    words: [
      {
        term: 'Commission',
        meaning:
          'A group set up to investigate something and recommend action.',
      },
      {
        term: 'Constitution',
        meaning: 'The set of basic laws by which a country is governed.',
      },
      { term: 'Recommendation', meaning: 'Advice on what should be done.' },
    ],
    examples: [
      {
        title: 'Cause and consequence',
        situation:
          'Link these: the 1948 riots, the Watson Commission, the Coussey Committee, the 1951 Constitution.',
        steps: [
          'The riots led Britain to set up the Watson Commission.',
          'The Commission recommended constitutional change.',
          'The Coussey Committee drafted the new constitution.',
          'The 1951 Constitution gave Africans more power.',
        ],
        answer:
          'Each event caused the next, moving the country towards self-rule.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the British handed over power willingly.',
        right: 'Pressure from the people pushed the British to change.',
      },
    ],
    realLife: [
      'Commissions of inquiry set up by governments today.',
      'Changing laws through peaceful processes.',
      'Learning lessons from difficult events.',
    ],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Draw a flow chart from the 1948 riots to the 1951 Constitution.',
        'Write one sentence in each box.',
        'Add arrows to show what caused what.',
      ],
    },
  },
  'history-05': {
    indicator: {
      code: 'B6.5.4.1.2',
      text: 'Explain how Ghana gained independence through constitutional means.',
    },
    hook: 'Ghana won independence not through war, but through elections. How?',
    explain: [
      'Under the 1951 Constitution, the Gold Coast held its first general election. The CPP won a large majority of the elected seats, even though Nkrumah was in prison. He was released and became Leader of Government Business, and Prime Minister in 1952.',
      'Further elections followed in 1954 and 1956. In 1956, the CPP won again, and the British agreed to grant independence.',
      'On 6 March 1957, the Gold Coast became independent Ghana, the first country in sub-Saharan Africa to gain independence from colonial rule.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1951', 'First general election'],
        ['1954', 'Election'],
        ['1956', 'Election'],
        ['1957', 'Independence'],
      ],
      focus: 3,
    },
    artCaption: 'Elections, not war, led to independence.',
    words: [
      {
        term: 'Constitutional means',
        meaning: 'Peaceful, lawful steps, such as elections and negotiations.',
      },
      {
        term: 'General election',
        meaning: 'An election in which the whole country votes.',
      },
      { term: 'Majority', meaning: 'More than half.' },
    ],
    examples: [
      {
        title: 'Why elections mattered',
        situation: 'Why did the 1956 election matter so much?',
        steps: [
          'The British wanted proof that the people supported independence.',
          'The CPP won a clear majority.',
          'This showed the will of the people, so Britain agreed to independence.',
        ],
        answer: 'The votes of the people opened the door to independence.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking independence came from one election.',
        right:
          'It came step by step, through three elections between 1951 and 1956.',
      },
    ],
    realLife: [
      'Voting in elections today.',
      'Independence Day parades on 6 March.',
      'Ghana inspiring other African countries towards independence.',
    ],
    tryIt: {
      need: 'Classmates',
      steps: [
        'Act out a polling station: officials, voters and party agents.',
        'Hold a short class vote on a simple question.',
        'Count the votes openly and announce the result.',
      ],
    },
  },
  'history-06': {
    indicator: {
      code: 'B6.6.1.1.1',
      text: 'Describe the events leading to the emergence of the Fourth Republic.',
    },
    hook: 'Ghana has been a constitutional democracy since 1993, its longest such period. How did the Fourth Republic begin?',
    explain: [
      'From 1981 to 1992, Ghana was ruled by a military government, the PNDC. Political parties were banned.',
      'In 1991, a Consultative Assembly drafted a new constitution. On 28 April 1992, Ghanaians approved it in a referendum. The ban on political parties was lifted, and new parties formed.',
      'Presidential and parliamentary elections were held in late 1992. The Fourth Republic began on 7 January 1993, with Jerry John Rawlings as its first President.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1991', 'Constitution drafted'],
        ['April 1992', 'Referendum'],
        ['1992', 'Parties formed, elections held'],
        ['7 Jan 1993', 'Fourth Republic begins'],
      ],
      focus: 3,
    },
    artCaption: 'The steps to the Fourth Republic.',
    words: [
      {
        term: 'Referendum',
        meaning: 'A vote by all the people on one important question.',
      },
      {
        term: 'Consultative Assembly',
        meaning: 'The group that drafted the 1992 Constitution.',
      },
      {
        term: 'Inauguration',
        meaning: 'The ceremony in which a new president takes office.',
      },
    ],
    examples: [
      {
        title: 'Put it in order',
        situation:
          'Order these: elections, referendum, drafting the constitution, the Republic begins.',
        steps: [
          'First: drafting the constitution, 1991.',
          'Then: the referendum, April 1992.',
          'Then: elections, late 1992.',
          'Last: the Republic begins, January 1993.',
        ],
        answer: 'Drafting, referendum, elections, Republic.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the Fourth Republic began in 1992.',
        right:
          'The constitution was approved in 1992, but the Republic began on 7 January 1993.',
      },
    ],
    realLife: [
      '7 January, when a newly elected President is sworn in.',
      'Constitution Day.',
      'Copies of the 1992 Constitution in libraries.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw a timeline of the steps to the Fourth Republic.',
        'Find out who was President when you were born.',
        'Add your birth year to the timeline.',
      ],
    },
  },
  'history-07': {
    indicator: {
      code: 'B6.6.1.1.2',
      text: 'Identify the political parties that have governed the country under the Fourth Republic.',
    },
    hook: 'Since 1993, Ghana has changed governing party through elections several times, without violence. Which parties have governed?',
    explain: [
      'Two parties have governed under the Fourth Republic: the National Democratic Congress (NDC) and the New Patriotic Party (NPP).',
      'The NDC governed from 1993 to 2001 under Jerry John Rawlings. The NPP governed from 2001 to 2009 under John Agyekum Kufuor. The NDC governed from 2009 to 2017 under John Evans Atta Mills and, after his death in 2012, John Dramani Mahama.',
      'The NPP governed from 2017 to 2025 under Nana Addo Dankwa Akufo-Addo. The NDC returned in January 2025 under John Dramani Mahama. Each change came through an election and a peaceful handover.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1993', 'NDC'],
        ['2001', 'NPP'],
        ['2009', 'NDC'],
        ['2017', 'NPP'],
        ['2025', 'NDC'],
      ],
    },
    artCaption:
      'Governing parties of the Fourth Republic, by the year they took office.',
    words: [
      {
        term: 'Governing party',
        meaning:
          'The party whose leader is President and forms the government.',
      },
      {
        term: 'Opposition',
        meaning: 'Parties not in government, which question and check it.',
      },
      {
        term: 'Peaceful handover',
        meaning: 'When power passes to the election winner without violence.',
      },
    ],
    examples: [
      {
        title: 'Count the handovers',
        situation:
          'How many times has power passed from one party to another through elections?',
        steps: [
          '2001: NDC to NPP.',
          '2009: NPP to NDC.',
          '2017: NDC to NPP.',
          '2025: NPP to NDC.',
        ],
        answer: 'Four peaceful handovers between parties.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only one party can be in government.',
        right:
          'Voters choose. Different parties have governed at different times.',
      },
    ],
    realLife: [
      'Election campaigns every four years.',
      'Parliament, where governing and opposition parties both sit.',
      'Your district assembly’s projects.',
    ],
    tryIt: {
      need: 'An adult to talk with',
      steps: [
        'Ask which elections they remember voting in.',
        'Ask what they think makes an election fair.',
        'Write three rules for a fair election.',
      ],
    },
  },
  'history-08': {
    indicator: {
      code: 'B6.6.2.1.1',
      text: 'Identify the leaders of the coups d’état and the names of their regimes.',
    },
    hook: 'Four times since 1966, soldiers seized power in Ghana and suspended the constitution. Who led these coups?',
    explain: [
      'A coup d’état is when a group, often soldiers, takes over a government by force.',
      'In February 1966, the National Liberation Council (NLC), led by Lieutenant-General Joseph Ankrah, overthrew Kwame Nkrumah. In January 1972, the National Redemption Council (NRC), led by Colonel Ignatius Kutu Acheampong, overthrew Prime Minister Busia.',
      'In June 1979, the Armed Forces Revolutionary Council (AFRC), led by Flight Lieutenant Jerry John Rawlings, took power, then handed over to an elected government that September. On 31 December 1981, Rawlings led another coup and formed the Provisional National Defence Council (PNDC).',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1966', 'NLC'],
        ['1972', 'NRC'],
        ['1979', 'AFRC'],
        ['1981', 'PNDC'],
      ],
    },
    artCaption: 'The four military takeovers since 1966.',
    words: [
      { term: 'Coup d’état', meaning: 'Taking over a government by force.' },
      {
        term: 'Regime',
        meaning: 'A government, especially one not elected by the people.',
      },
      { term: 'Military rule', meaning: 'Government by the armed forces.' },
    ],
    examples: [
      {
        title: 'Match the regime',
        situation: 'Match each coup to its regime.',
        steps: [
          '1966: National Liberation Council.',
          '1972: National Redemption Council.',
          '1979: Armed Forces Revolutionary Council.',
          '1981: Provisional National Defence Council.',
        ],
        answer: 'Four coups, four regimes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking military rule lasted the same each time.',
        right: 'The AFRC ruled for about three months; the PNDC for 11 years.',
      },
    ],
    realLife: [
      'Why Ghana’s Constitution protects civilian rule.',
      'Soldiers serving under elected governments today.',
      'Older people’s memories of military rule.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a table: year, regime, leader.',
        'Fill it in for all four coups.',
        'Write one question you would ask someone who lived through one.',
      ],
    },
  },
  'history-09': {
    indicator: {
      code: 'B6.6.2.2.2',
      text: 'Assess the consequences of military takeovers on Ghana’s development.',
    },
    hook: 'Coup leaders often said they acted to fix the country. Did military rule help Ghana, or hold it back?',
    explain: [
      'Each coup suspended the constitution, so people could no longer choose their leaders. Political parties were banned, and many people were detained without trial.',
      'There were serious human rights abuses. In 1979, eight senior military officers, including three former heads of state, were executed. Curfews and harsh rules made daily life hard, and changes of government disrupted development plans.',
      'Some argued the coups fought corruption. But most Ghanaians came to value constitutional rule, and since 1993 power has changed only through elections.',
    ],
    art: {
      kind: 'scroll',
      title: 'The Constitution',
      date: 'Suspended by every coup',
      lines: [
        'People choose their leaders.',
        'Rights are protected by law.',
        'Courts settle disputes.',
        'Power changes only through elections.',
      ],
    },
    artCaption: 'What a coup takes away.',
    words: [
      {
        term: 'Consequence',
        meaning: 'What happens as a result of something.',
      },
      {
        term: 'Human rights',
        meaning:
          'Rights every person has, such as life, freedom and a fair trial.',
      },
      {
        term: 'Curfew',
        meaning: 'A rule that people must stay indoors at certain times.',
      },
    ],
    examples: [
      {
        title: 'Hold a fair debate',
        situation:
          'Debate: “Military takeovers held back Ghana’s development.”',
        steps: [
          'For: constitutions were suspended, rights were abused, and plans were disrupted.',
          'Against: coup leaders claimed to fight corruption and restore order.',
          'Weigh the evidence on both sides.',
        ],
        answer:
          'Historians weigh both sides. Most conclude the costs were very high.',
      },
    ],
    mistakes: [
      {
        wrong: 'Judging without evidence.',
        right: 'Use sources and give reasons, as historians do.',
      },
    ],
    realLife: [
      'Ghana’s stable democracy since 1993.',
      'Courts protecting people’s rights.',
      'Other countries where coups still happen.',
    ],
    tryIt: {
      need: 'Classmates',
      steps: [
        'Split into two groups for a debate on military rule.',
        'Each group prepares three points with evidence.',
        'After the debate, write your own view with a reason.',
      ],
    },
  },
  'history-10': {
    indicator: {
      code: 'B6.3.4.1.1',
      text: 'Assess the changes that the European presence brought to Ghana: the harmful effects.',
    },
    hook: 'Not everything Europeans brought was welcome. Historians must look at the harm as honestly as the good.',
    explain: [
      'The Trans-Atlantic slave trade took millions of Africans from their homes and caused wars and suffering across the region.',
      'Colonial rule took away the right of Ghanaians to govern themselves. Wealth from gold, cocoa and timber went largely to Europe.',
      'Some Europeans taught that African customs and religions were wrong, harming respect for Ghanaian culture. Borders drawn by Europeans divided peoples such as the Ewe.',
    ],
    art: {
      kind: 'triangle',
      label: 'The slave trade: the worst harm of European contact',
    },
    artCaption: 'The trade that took millions of Africans away.',
    words: [
      {
        term: 'Exploitation',
        meaning: 'Using people or resources unfairly for your own gain.',
      },
      {
        term: 'Sovereignty',
        meaning: 'A people’s right to govern themselves.',
      },
      {
        term: 'Border',
        meaning: 'A line that divides one country from another.',
      },
    ],
    examples: [
      {
        title: 'Find the evidence',
        situation: 'What evidence shows that European borders divided peoples?',
        steps: [
          'Ewe communities live in both Ghana and Togo.',
          'Families are split across the border.',
        ],
        answer: 'The border between Ghana and Togo divides the Ewe people.',
      },
    ],
    mistakes: [
      {
        wrong: 'Looking at only the good, or only the bad.',
        right: 'Assess means weighing all the evidence.',
      },
    ],
    realLife: [
      'The castles at Cape Coast and Elmina.',
      'Families living on both sides of a border.',
      'Efforts to value Ghanaian languages and culture.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make two columns: “Helped Ghana” and “Harmed Ghana”.',
        'Write at least three points in each.',
        'Write your overall judgement with one reason.',
      ],
    },
  },
  'history-11': {
    indicator: {
      code: 'B6.4.4.1.1',
      text: 'Describe the features of British colonial rule: how the colony was organised.',
    },
    hook: 'At the top of the Gold Coast government sat one person: the Governor. Below him, who held power?',
    explain: [
      'The Governor, appointed by Britain, held the highest power. He was advised by an Executive Council, and laws were made with a Legislative Council.',
      'The Colony was divided into provinces, each run by a British Provincial Commissioner. Asante and the Northern Territories each had a Chief Commissioner.',
      'Provinces were divided into districts, run by District Commissioners. They worked with chiefs, who governed their people under indirect rule.',
    ],
    art: {
      kind: 'family',
      rows: [
        ['Governor'],
        ['Executive Council', 'Legislative Council'],
        ['Provincial Commissioners'],
        ['District Commissioners'],
      ],
    },
    artCaption: 'How the colonial government was organised.',
    words: [
      {
        term: 'Governor',
        meaning: 'The British official who ruled the colony.',
      },
      {
        term: 'Province',
        meaning: 'A large area of a country, with its own administration.',
      },
      {
        term: 'District Commissioner',
        meaning: 'The British officer in charge of a district.',
      },
    ],
    examples: [
      {
        title: 'Follow an order',
        situation:
          'The Governor wants a new road built. How might the order travel?',
        steps: [
          'The Governor decides, with his councils.',
          'The Provincial Commissioner passes on the order.',
          'The District Commissioner organises the work, with the chiefs.',
        ],
        answer: 'Orders passed down from the Governor to the districts.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Ghanaians had no voice at all.',
        right:
          'A few Africans sat on the Legislative Council, and their number grew over time.',
      },
    ],
    realLife: [
      'Regions and districts in Ghana today.',
      'District Chief Executives, who lead districts now.',
      'Old colonial district offices still standing.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw the colonial government as a chart, from the Governor down.',
        'Draw Ghana’s government today, from the President down.',
        'Write one similarity and one difference.',
      ],
    },
  },
  'history-12': {
    indicator: {
      code: 'B6.5.2.1.1',
      text: 'Describe the role played by the leaders of the UGCC and CPP: the Big Six.',
    },
    hook: 'After the 1948 riots, the British arrested six leaders and blamed them for the unrest. They became known as the Big Six.',
    explain: [
      'The Big Six were Kwame Nkrumah, J. B. Danquah, Edward Akufo-Addo, Ebenezer Ako-Adjei, Emmanuel Obetsebi-Lamptey and William Ofori Atta. All were leaders of the UGCC.',
      'They were arrested in 1948 and held in the north of the country for some weeks. Their arrest made them national heroes.',
      'Each went on to serve the country. Their faces appear on Ghana’s cedi notes, honouring their role in the independence struggle.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['28 Feb 1948', 'Shooting and riots'],
        ['March 1948', 'The Big Six arrested'],
        ['1949', 'Nkrumah forms the CPP'],
      ],
    },
    artCaption: 'From arrest to new parties.',
    words: [
      {
        term: 'Detention',
        meaning: 'Being held by the authorities, often without trial.',
      },
      { term: 'Hero', meaning: 'A person admired for courage or great deeds.' },
      { term: 'Unrest', meaning: 'Anger and protest across a country.' },
    ],
    examples: [
      {
        title: 'Name the Big Six',
        situation: 'List the Big Six.',
        steps: [
          'Kwame Nkrumah.',
          'J. B. Danquah.',
          'Edward Akufo-Addo.',
          'Ebenezer Ako-Adjei.',
          'Emmanuel Obetsebi-Lamptey.',
          'William Ofori Atta.',
        ],
        answer: 'Six leaders of the UGCC, honoured on our cedi notes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the Big Six caused the riots.',
        right:
          'The British blamed them, but the riots grew from widespread grievances.',
      },
    ],
    realLife: [
      'The Big Six on Ghana’s cedi notes.',
      'Streets and circles named after them.',
      'Statues at the Independence Square and elsewhere.',
    ],
    tryIt: {
      need: 'A cedi note, with an adult’s permission',
      steps: [
        'Look at the faces on the note.',
        'Find out which of the Big Six they are.',
        'Write one fact about each.',
      ],
    },
  },
  'history-13': {
    indicator: {
      code: 'B6.5.4.1.1',
      text: 'Explain post-World War II developments in the Gold Coast: Positive Action.',
    },
    hook: 'In January 1950, workers stopped work and shops closed across the Gold Coast. It was called Positive Action. What was it for?',
    explain: [
      'The CPP felt the new constitution did not go far enough. In January 1950, it launched Positive Action: strikes, boycotts and non-violent protest to press for self-government.',
      'The colonial government declared a state of emergency, and Nkrumah and other leaders were jailed.',
      'But Positive Action showed how strongly ordinary people wanted self-government. In the 1951 election, the CPP won while Nkrumah was still in prison.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1949', 'Coussey Committee reports'],
        ['January 1950', 'Positive Action'],
        ['1951', 'CPP wins election'],
      ],
      focus: 1,
    },
    artCaption:
      'Positive Action came between the new plans and the first election.',
    words: [
      { term: 'Strike', meaning: 'Workers refusing to work, as a protest.' },
      { term: 'Non-violent', meaning: 'Without using force or harm.' },
      {
        term: 'State of emergency',
        meaning: 'A time when a government gives itself extra powers.',
      },
    ],
    examples: [
      {
        title: 'Did it work?',
        situation: 'Positive Action led to arrests. Was it a failure?',
        steps: [
          'Short-term: leaders were jailed.',
          'Long-term: it showed the people’s strength.',
          'The CPP won the 1951 election soon after.',
        ],
        answer:
          'It cost a lot in the short term, but it pushed independence forward.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking protest always fails if leaders are arrested.',
        right: 'Popular support can still win, as the 1951 election showed.',
      },
    ],
    realLife: [
      'Peaceful strikes by workers today.',
      'Ghana’s right to peaceful protest.',
      'How public opinion influences governments.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a newspaper headline for January 1950.',
        'Write a short report of Positive Action.',
        'Include one view from a worker and one from a colonial official.',
      ],
    },
  },
  'history-14': {
    indicator: {
      code: 'B6.5.4.1.2',
      text: 'Explain how Ghana gained independence through constitutional means: Independence night.',
    },
    hook: 'At midnight on 5 March 1957, a crowd gathered at the Old Polo Ground in Accra. As the British flag came down, a new flag went up.',
    explain: [
      'At midnight, the Union Jack was lowered and the red, gold and green flag of Ghana was raised for the first time.',
      'Kwame Nkrumah told the crowd that “Ghana, your beloved country, is free forever”. He also said that Ghana’s independence was meaningless unless it was linked with the total liberation of Africa.',
      'Ghana became a symbol of hope for Africa. Over the next years, many African countries gained independence.',
    ],
    art: { kind: 'flag', label: 'Raised at midnight on 6 March 1957' },
    artCaption: 'The flag of independent Ghana.',
    words: [
      {
        term: 'Independence',
        meaning: 'A country governing itself, free from outside rule.',
      },
      { term: 'Liberation', meaning: 'Being set free.' },
      { term: 'Union Jack', meaning: 'The flag of the United Kingdom.' },
    ],
    examples: [
      {
        title: 'Why does it matter to Africa?',
        situation:
          'Why did Nkrumah link Ghana’s freedom with the rest of Africa?',
        steps: [
          'Most of Africa was still under colonial rule.',
          'He believed Africans should be free everywhere.',
          'Ghana could help and inspire others.',
        ],
        answer:
          'Ghana’s independence was meant to be the first step for all of Africa.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking independence was celebrated during the day.',
        right: 'The flag was raised at midnight, as 6 March began.',
      },
    ],
    realLife: [
      'Independence Day celebrations on 6 March.',
      'The Independence Arch and Square in Accra.',
      'The African Union, which works for African unity.',
    ],
    tryIt: {
      need: 'A family member who remembers an Independence Day celebration',
      steps: [
        'Ask them to describe an Independence Day they remember.',
        'Write their story in five sentences.',
        'Add a drawing of the flag.',
      ],
    },
  },
  'history-15': {
    indicator: {
      code: 'B6.6.1.1.1',
      text: 'Describe the events leading to the emergence of the Fourth Republic: the Constitution and the presidency.',
    },
    hook: 'Every four years, on 7 January, a President takes an oath before the nation. What does the 1992 Constitution say about this office?',
    explain: [
      'Under the 1992 Constitution, the President is elected by the people for a four-year term, and can serve at most two terms.',
      'The President swears to protect and defend the Constitution. The Chief Justice leads the swearing-in, and Parliament, the courts and the President share power.',
      'The Presidents of the Fourth Republic have been Jerry John Rawlings, John Agyekum Kufuor, John Evans Atta Mills, John Dramani Mahama, Nana Addo Dankwa Akufo-Addo, and John Dramani Mahama again from 2025.',
    ],
    art: {
      kind: 'scroll',
      title: 'The 1992 Constitution',
      date: 'Approved by referendum, 28 April 1992',
      lines: [
        'The President is elected by the people.',
        'A term lasts four years.',
        'No more than two terms.',
        'Power is shared with Parliament and the courts.',
      ],
    },
    artCaption: 'Key rules for the presidency.',
    words: [
      {
        term: 'Term limit',
        meaning: 'A rule on how many times a leader can serve.',
      },
      { term: 'Oath', meaning: 'A serious promise made in public.' },
      {
        term: 'Separation of powers',
        meaning:
          'Dividing power between the President, Parliament and the courts.',
      },
    ],
    examples: [
      {
        title: 'How many years?',
        situation: 'If a President serves two full terms, how long is that?',
        steps: ['One term is four years.', 'Two terms: 4 + 4 = 8.'],
        answer: 'Eight years at most.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the President can serve as long as he likes.',
        right: 'The Constitution limits a President to two four-year terms.',
      },
    ],
    realLife: [
      'The inauguration on 7 January after an election.',
      'Parliament debating laws.',
      'The courts ruling on disputes.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'List the Presidents of the Fourth Republic in order.',
        'Next to each, write the year their time in office began.',
        'Write why term limits might be a good idea.',
      ],
    },
  },
  'history-16': {
    indicator: {
      code: 'B6.6.1.1.2',
      text: 'Identify the political parties that have governed under the Fourth Republic: how elections work.',
    },
    hook: 'On election day, millions of Ghanaians queue to vote. What happens to a single vote, from the ballot box to the result?',
    explain: [
      'Any Ghanaian citizen aged 18 or above can register to vote. The Electoral Commission organises elections and keeps the voters’ register.',
      'At the polling station, a voter is checked against the register, receives a ballot paper, marks it in secret, and drops it in the ballot box.',
      'After voting ends, the votes are counted openly, in front of party agents. Results are collated and declared by the Electoral Commission.',
    ],
    art: { kind: 'ballot', label: 'One person, one vote, in secret' },
    artCaption: 'Every vote counts.',
    words: [
      {
        term: 'Electoral Commission',
        meaning: 'The body that runs elections in Ghana.',
      },
      {
        term: 'Secret ballot',
        meaning: 'Voting privately, so that no one can see your choice.',
      },
      { term: 'Polling station', meaning: 'The place where people vote.' },
    ],
    examples: [
      {
        title: 'Why count in public?',
        situation: 'Why are votes counted in front of party agents?',
        steps: [
          'Everyone can see the count is honest.',
          'Parties can check the result.',
          'People trust results they can see.',
        ],
        answer: 'Open counting builds trust in the result.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking one vote does not matter.',
        right: 'Some elections are decided by very few votes.',
      },
    ],
    realLife: [
      'Election day in your community.',
      'School prefect elections.',
      'Adults showing their inked finger after voting.',
    ],
    tryIt: {
      need: 'Classmates, paper and a box',
      steps: [
        'Hold a secret-ballot class election.',
        'Appoint officials and agents for each candidate.',
        'Count the votes openly and declare the result.',
      ],
    },
  },
  'history-17': {
    indicator: {
      code: 'B6.6.2.1.1',
      text: 'Identify the leaders of the coups d’état: civilian and military governments since 1957.',
    },
    hook: 'Since independence, Ghana has been governed sometimes by elected leaders and sometimes by soldiers. Can you sort them?',
    explain: [
      'Civilian governments were elected or constitutional: Nkrumah’s government from 1957, the Second Republic from 1969, the Third Republic from 1979, and the Fourth Republic from 1993.',
      'Military governments took power by force: the NLC from 1966, the NRC (later the Supreme Military Council) from 1972, the AFRC in 1979, and the PNDC from 1981.',
      'The longest period of uninterrupted constitutional rule is the Fourth Republic, from 1993 to today.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1957', 'Civilian'],
        ['1966', 'Military'],
        ['1969', 'Civilian'],
        ['1972', 'Military'],
        ['1979', 'Civilian'],
        ['1981', 'Military'],
        ['1993', 'Civilian'],
      ],
    },
    artCaption: 'Civilian and military rule since independence.',
    words: [
      { term: 'Civilian', meaning: 'Not part of the armed forces.' },
      {
        term: 'Military government',
        meaning: 'A government run by the armed forces.',
      },
      { term: 'Uninterrupted', meaning: 'Continuing without a break.' },
    ],
    examples: [
      {
        title: 'Count the years',
        situation:
          'The Fourth Republic began in 1993. How many years had it lasted by 2026?',
        steps: ['2026 − 1993 = 33.'],
        answer:
          'Thirty-three years, Ghana’s longest period of constitutional rule.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up the Republics and the military regimes.',
        right:
          'Republics were constitutional; the regimes between them were military.',
      },
    ],
    realLife: [
      'Grandparents who lived under several governments.',
      'Celebrating democracy on Constitution Day.',
      'Peaceful elections every four years.',
    ],
    tryIt: {
      need: 'Paper and two colours',
      steps: [
        'Draw a timeline from 1957 to today.',
        'Colour civilian periods in one colour and military periods in another.',
        'Which colour covers more years?',
      ],
    },
  },
  'history-18': {
    indicator: {
      code: 'B6.6.2.2.2',
      text: 'Assess the consequences of military takeovers: protecting the Constitution.',
    },
    hook: 'Ghana’s 1992 Constitution has a special rule: anyone who tries to overthrow it by force commits high treason. Why?',
    explain: [
      'The 1992 Constitution protects itself. It says that overthrowing it by force is high treason, the most serious crime against the state.',
      'It also says that citizens have the right and duty to defend it, and to resist anyone who tries to overthrow it.',
      'Courts, Parliament, a free press and peaceful elections all help protect constitutional rule. So do citizens who know their rights.',
    ],
    art: {
      kind: 'scroll',
      title: 'Protecting the Constitution',
      date: 'From the 1992 Constitution, in simple words',
      lines: [
        'Overthrowing it by force is high treason.',
        'Citizens have the duty to defend it.',
        'Power changes only through elections.',
      ],
    },
    artCaption: 'The Constitution protects itself, with the help of citizens.',
    words: [
      {
        term: 'High treason',
        meaning: 'The most serious crime against one’s own country.',
      },
      {
        term: 'Citizen',
        meaning: 'A full member of a country, with rights and duties.',
      },
      {
        term: 'Free press',
        meaning:
          'Newspapers, radio and television able to report without government control.',
      },
    ],
    examples: [
      {
        title: 'Who protects democracy?',
        situation:
          'Name four things that protect constitutional rule in Ghana.',
        steps: [
          'Courts that uphold the law.',
          'Parliament that makes laws and checks the government.',
          'A free press that reports honestly.',
          'Citizens who vote and know their rights.',
        ],
        answer:
          'Democracy is protected by institutions and by citizens together.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking democracy protects itself without anyone’s help.',
        right: 'Every citizen has a part to play in defending it.',
      },
    ],
    realLife: [
      'Learning about the Constitution in school.',
      'Radio and television debates on public issues.',
      'Voting when you turn 18.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write three duties of a good citizen.',
        'Write three rights that the Constitution protects.',
        'Make a poster: “How I can protect democracy”.',
      ],
    },
  },
  'history-19': {
    indicator: {
      code: 'B6.3.4.1.1',
      text: 'Assess the changes that the European presence brought to Ghana: what lasts today.',
    },
    hook: 'You speak English at school, follow laws in courts with judges, and live inside borders drawn in the colonial era. The past is all around you.',
    explain: [
      'English became Ghana’s official language, used in schools, courts and government, while Ghanaian languages remain spoken across the country.',
      'Our system of courts and many laws grew from British models. So did the idea of a Parliament.',
      'Ghanaians have made these inheritances their own: blending them with Ghanaian values, languages and traditions.',
    ],
    art: {
      kind: 'building',
      building: 'school',
      label: 'Inherited, and made Ghanaian',
    },
    artCaption: 'Schools are one legacy of the past.',
    words: [
      { term: 'Legacy', meaning: 'What is left behind from the past.' },
      {
        term: 'Official language',
        meaning: 'The language used by a country’s government and courts.',
      },
      { term: 'Blend', meaning: 'Mix things together to make something new.' },
    ],
    examples: [
      {
        title: 'Made our own',
        situation: 'How have Ghanaians made English their own?',
        steps: [
          'Ghanaian English has its own words and sayings.',
          'Many people switch between English and a Ghanaian language.',
          'Ghanaian writers write in English about Ghanaian life.',
        ],
        answer:
          'The language came from outside, but Ghanaians shaped how it is used.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking inherited things cannot change.',
        right: 'Each generation adapts what it inherits.',
      },
    ],
    realLife: [
      'Speaking English and a Ghanaian language at home.',
      'Courts and judges.',
      'Parliament in Accra.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'List five Ghanaian English words or sayings.',
        'Write what each means.',
        'Explain how they show English made Ghanaian.',
      ],
    },
  },
  'history-20': {
    indicator: {
      code: 'B6.4.4.1.1',
      text: 'Describe the features of British colonial rule: the road to African representation.',
    },
    hook: 'In 1874, the Legislative Council had almost no Africans. By 1951, Africans held most of the elected seats. How did that change happen?',
    explain: [
      'At first, the Legislative Council was made up mostly of British officials. A few Africans were nominated by the Governor.',
      'Over time, pressure from protest movements, chiefs and the educated elite gained Africans more seats. A few members were elected from the 1920s.',
      'After the 1948 riots, the 1951 Constitution gave Africans most of the elected seats. This was the last step before full self-government.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1874', 'Colony formed'],
        ['1920s', 'First elected African members'],
        ['1951', 'African majority'],
      ],
    },
    artCaption: 'Africans gained more voice, step by step.',
    words: [
      {
        term: 'Representation',
        meaning: 'Having people who speak for you in government.',
      },
      {
        term: 'Nominated',
        meaning: 'Chosen by someone in power, not elected.',
      },
      { term: 'Elected', meaning: 'Chosen by the votes of the people.' },
    ],
    examples: [
      {
        title: 'Nominated or elected?',
        situation:
          'Why does it matter whether a member is nominated or elected?',
        steps: [
          'A nominated member is chosen by the Governor, and may serve his wishes.',
          'An elected member is chosen by the people, and must answer to them.',
        ],
        answer:
          'Elected members represent the people. Nominated members represented the colonial government.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking Africans gained a voice all at once.',
        right: 'It took nearly 80 years of pressure and protest.',
      },
    ],
    realLife: [
      'Your Member of Parliament.',
      'Assembly members in your district.',
      'Student representatives in school.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Find out who your Member of Parliament is.',
        'Write one question you would ask them.',
        'Explain why elected representatives matter.',
      ],
    },
  },
}
