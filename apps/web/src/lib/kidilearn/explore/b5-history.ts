import type { CourseGuides } from './types'

// Basic 5 History, written for this course and scoped to the NaCCA History of
// Ghana Curriculum for Primary Schools (2019). Notes:
// - Lessons 13 to 20 repeat the indicators of lessons 1 to 8, so each repeat
//   takes a new angle on the topic.
// - The slave trade is taught with care for ten-year-olds: through the humanity
//   of the people taken, their resistance, abolition and remembrance, without
//   graphic detail.
// - People are honoured by what they did. No picture claims to show them.
// - Uncertain dates say “about”.

export const guides: CourseGuides = {
  'history-01': {
    indicator: {
      code: 'B5.2.1.1.1',
      text: 'Describe how our ancestors lived in ancient times (before the 15th century) and compare it with how we live today.',
    },
    hook: 'Imagine a day 600 years ago, with no cars, phones or electricity. How did people eat, travel and send messages?',
    explain: [
      'Before the 15th century, our ancestors farmed with iron hoes and cutlasses. They grew yams, millet and sorghum, and kept animals. Many also hunted, fished and gathered fruits.',
      'They built homes of mud with thatched roofs. They travelled on foot, and by canoe on rivers and the sea. Drums, horns and messengers carried news between towns.',
      'Skilled people made pots, smelted iron, wove cloth and worked gold. Traders exchanged goods, sometimes using cowrie shells and gold dust as money.',
    ],
    art: { kind: 'thenNow', rows: ['home', 'travel', 'message', 'money'] },
    artCaption: 'The same needs, met in different ways.',
    words: [
      {
        term: 'Ancestors',
        meaning: 'Family members who lived long before us.',
      },
      { term: 'Ancient', meaning: 'From a very long time ago.' },
      {
        term: 'Barter',
        meaning: 'Trading goods for other goods, without money.',
      },
    ],
    examples: [
      {
        title: 'What changed? What stayed?',
        situation: 'Compare how food was grown then and now.',
        steps: [
          'Then: by hand, with hoes and cutlasses.',
          'Now: often still by hand on small farms, but also with tractors on big ones.',
          'The same: many of our foods, such as yam and millet, are still grown.',
        ],
        answer:
          'Some things changed a lot, but many old ways and foods continue.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking people long ago were not clever.',
        right:
          'They smelted iron, built towns and traded over long distances, all without machines.',
      },
    ],
    realLife: [
      'Farmers who still use hoes and cutlasses.',
      'Talking drums at festivals.',
      'Pottery made the old way in villages today.',
    ],
    tryIt: {
      need: 'A grandparent or older neighbour',
      steps: [
        'Ask how life was different when they were young.',
        'Ask about food, travel and how people sent messages.',
        'Make a “then and now” chart of what you learn.',
      ],
    },
  },
  'history-02': {
    indicator: {
      code: 'B5.2.1.1.2',
      text: 'Describe some ancient towns in Ghana.',
    },
    hook: 'Hundreds of years ago, there were busy market towns in Ghana. Traders arrived from far away with salt, cloth and gold. Where were they?',
    explain: [
      'Begho, in today’s Bono Region, was a great trading town. Traders from the north bought gold and kola nuts there and brought cloth and salt.',
      'Bono-Manso, near Techiman, was the capital of the Bono state, one of the earliest Akan states. Salaga, in the north, became a famous market for kola nuts.',
      'Daboya, on the White Volta, was known for making salt and weaving cloth. At Kintampo, archaeologists found signs of some of the earliest farming villages in Ghana.',
    ],
    art: {
      kind: 'belts',
      belts: [
        { name: 'North', places: ['Salaga', 'Daboya'] },
        { name: 'Middle belt', places: ['Begho', 'Bono-Manso', 'Kintampo'] },
        { name: 'Coast', places: ['Eguafo', 'Dawhenya'] },
      ],
    },
    artCaption:
      'Ancient towns and places named in the curriculum, from north to south.',
    words: [
      {
        term: 'Trading town',
        meaning: 'A town where many people came to buy and sell.',
      },
      {
        term: 'Archaeologist',
        meaning: 'A person who studies the past by digging up old things.',
      },
      {
        term: 'Kola nut',
        meaning: 'A nut from the forest, traded widely in West Africa.',
      },
    ],
    examples: [
      {
        title: 'Why did towns grow there?',
        situation:
          'Begho sat between the forest and the savanna. Why was that a good place for a market?',
        steps: [
          'Gold and kola came from the forest to the south.',
          'Salt and cloth came from the north.',
          'Begho was where the two met.',
        ],
        answer:
          'Traders from both regions could meet in one place to exchange goods.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking towns only appeared when Europeans arrived.',
        right: 'Ghana had busy towns and trade long before then.',
      },
    ],
    realLife: [
      'Techiman’s big market today, near old Bono-Manso.',
      'Smocks woven in the north.',
      'Salaga’s history, which people still visit to learn about.',
    ],
    tryIt: {
      need: 'A map of Ghana',
      steps: [
        'Find the regions where Begho, Salaga and Kintampo are.',
        'Mark them on your own drawing of Ghana.',
        'Write one fact about each.',
      ],
    },
  },
  'history-03': {
    indicator: {
      code: 'B5.2.5.1.1',
      text: 'Name Ghanaians who have made significant contributions locally and internationally.',
    },
    hook: 'Ghanaians have led the United Nations, won world titles and created art seen in the world’s great museums. Who are they?',
    explain: [
      'Kofi Annan was Secretary-General of the United Nations from 1997 to 2006. He won the Nobel Peace Prize in 2001.',
      'El Anatsui makes huge sculptures from bottle tops and metal pieces. David Adjaye designed buildings around the world. Efua Sutherland wrote plays and started the Ghana Drama Studio.',
      'In sport, Abedi Ayew “Pele” was named African Footballer of the Year three times, and Azumah Nelson became a world boxing champion. Professor Frimpong-Boateng set up the heart centre at Korle Bu.',
    ],
    art: { kind: 'flag', label: 'Ghanaians who made the world take notice' },
    artCaption: 'Achievers in many fields carry Ghana’s name.',
    words: [
      {
        term: 'Contribution',
        meaning: 'Something a person gives or does that helps others.',
      },
      { term: 'International', meaning: 'Involving many countries.' },
      {
        term: 'Role model',
        meaning: 'A person whose example others want to follow.',
      },
    ],
    examples: [
      {
        title: 'Match the field',
        situation: 'Match each person to their field.',
        steps: [
          'Kofi Annan: international diplomacy.',
          'Efua Sutherland: theatre and writing.',
          'El Anatsui: sculpture.',
          'Azumah Nelson: boxing.',
          'Professor Francis Allotey: mathematics and science.',
        ],
        answer: 'Ghanaians have excelled in many different fields.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only famous people make contributions.',
        right:
          'Teachers, nurses and farmers in your own community contribute too.',
      },
    ],
    realLife: [
      'Kofi Annan’s name on the peacekeeping training centre in Accra.',
      'Ghanaian athletes at international games.',
      'Ghanaian art in museums abroad.',
    ],
    tryIt: {
      need: 'Books, a newspaper or an adult to ask',
      steps: [
        'Choose one Ghanaian from this lesson.',
        'Find three facts about their life and work.',
        'Make a poster about them for your class.',
      ],
    },
  },
  'history-04': {
    indicator: {
      code: 'B5.3.2.1.1',
      text: 'Investigate why the Europeans began trading in humans by the 16th century.',
    },
    hook: 'When the Portuguese arrived in 1471, they came to trade in gold. Within a few generations, Europeans were buying and selling people. Why did this happen?',
    explain: [
      'In the 1500s, Europeans set up huge farms called plantations in the Americas, to grow sugar, and later cotton and tobacco. They wanted many workers and did not want to pay them.',
      'Europeans bought captured Africans and forced them across the Atlantic Ocean to work as enslaved people. The Portuguese, Dutch, British, Danes and others all took part. Some African rulers and traders also sold captives, often in exchange for guns.',
      'The trade went in a triangle. Ships carried goods from Europe to Africa, enslaved people from Africa to the Americas, and plantation crops back to Europe. Millions of Africans were taken from their homes.',
    ],
    art: {
      kind: 'triangle',
      label: 'The Trans-Atlantic trade (a diagram, not a map)',
    },
    artCaption: 'The three sides of the trade.',
    words: [
      {
        term: 'Enslaved',
        meaning: 'Forced to work for others, with no freedom or pay.',
      },
      {
        term: 'Plantation',
        meaning: 'A very large farm growing one crop to sell.',
      },
      { term: 'Trans-Atlantic', meaning: 'Across the Atlantic Ocean.' },
    ],
    examples: [
      {
        title: 'Follow the triangle',
        situation: 'Explain the three journeys of the trade.',
        steps: [
          'Europe to Africa: guns, cloth and alcohol.',
          'Africa to the Americas: enslaved Africans, on a journey called the Middle Passage.',
          'The Americas to Europe: sugar, cotton and tobacco.',
        ],
        answer:
          'European traders made money on each side of the triangle, at a terrible human cost.',
      },
    ],
    mistakes: [
      {
        wrong:
          'Calling the people who were taken “slaves”, as if that was who they were.',
        right:
          'Say “enslaved people”. They were people first, with names, families and homes.',
      },
    ],
    realLife: [
      'Visiting the castles at Cape Coast and Elmina.',
      'African descendants in the Americas today.',
      'Remembering the trade so that it never happens again.',
    ],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Draw the triangle of trade with its three places.',
        'Label what moved along each side.',
        'Write one sentence about why we must remember this history.',
      ],
    },
  },
  'history-05': {
    indicator: {
      code: 'B5.4.2.1.1',
      text: 'Identify the developments in education during the colonial era (1874–1957).',
    },
    hook: 'Many of Ghana’s famous senior high schools are more than 100 years old. Who started them, and why?',
    explain: [
      'Churches started most of the first schools. Mfantsipim was founded at Cape Coast in 1876, and Adisadel College in 1910. Wesley Girls’ High School began from a Methodist girls’ school founded in 1836.',
      'The colonial government made laws called ordinances to support schools, give them money and set rules for teachers.',
      'Governor Guggisberg made education a priority in the 1920s. Achimota School opened in 1927, with Dr James Kwegyir Aggrey among its founding staff.',
    ],
    art: {
      kind: 'building',
      building: 'school',
      label: 'Schools grew across the Gold Coast',
    },
    artCaption: 'Many schools began in the colonial period.',
    words: [
      { term: 'Ordinance', meaning: 'A law made by the colonial government.' },
      {
        term: 'Colonial era',
        meaning: 'The time when Britain ruled the Gold Coast.',
      },
      { term: 'Mission school', meaning: 'A school started by a church.' },
    ],
    examples: [
      {
        title: 'Which came first?',
        situation:
          'Put these schools in order of founding: Achimota (1927), Mfantsipim (1876), Adisadel (1910).',
        steps: [
          'The earliest date is 1876: Mfantsipim.',
          'Next is 1910: Adisadel.',
          'Then 1927: Achimota.',
        ],
        answer: 'Mfantsipim, Adisadel, Achimota.',
        art: {
          kind: 'timeline',
          events: [
            ['1876', 'Mfantsipim'],
            ['1910', 'Adisadel'],
            ['1927', 'Achimota'],
          ],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the government built all the early schools.',
        right:
          'Churches built most of them. The government helped with money and rules.',
      },
    ],
    realLife: [
      'Old schools in your district and the dates on their gates.',
      'School anniversaries and speech days.',
      'Old students supporting their schools.',
    ],
    tryIt: {
      need: 'Someone who knows the oldest school near you',
      steps: [
        'Find the oldest school in your area.',
        'Find out who started it and when.',
        'Add it to a class timeline of schools.',
      ],
    },
  },
  'history-06': {
    indicator: {
      code: 'B5.4.2.1.2',
      text: 'Identify some of the health facilities and housing projects in the colonial period.',
    },
    hook: 'Korle Bu is one of Ghana’s biggest hospitals. It is more than 100 years old. How did it start?',
    explain: [
      'Korle Bu Hospital in Accra opened in 1923, during Governor Guggisberg’s time. Hospitals were also built in Kumasi, Takoradi and other towns.',
      'Hospitals and clinics helped fight diseases such as malaria and yellow fever. Clean water and drains also improved health in the towns.',
      'After the Accra earthquake of 1939 destroyed many homes, the government built new houses for people who had lost theirs.',
    ],
    art: {
      kind: 'building',
      building: 'hospital',
      label: 'Hospitals built in the colonial period still serve us',
    },
    artCaption: 'Korle Bu opened in 1923.',
    words: [
      {
        term: 'Health facility',
        meaning:
          'A place where sick people are cared for, such as a hospital or clinic.',
      },
      {
        term: 'Housing project',
        meaning: 'A plan to build many homes for people.',
      },
      {
        term: 'Social services',
        meaning:
          'Services that help people live well, such as health, water and education.',
      },
    ],
    examples: [
      {
        title: 'Why did it matter?',
        situation: 'Why was building Korle Bu important?',
        steps: [
          'It gave many people hospital care for the first time.',
          'It trained nurses and later doctors.',
          'It still serves patients today.',
        ],
        answer: 'Korle Bu improved health care, and its work continues.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking these services reached everyone.',
        right:
          'Most were built in towns. Many villages had little health care.',
      },
    ],
    realLife: [
      'Visiting a hospital or clinic in your town.',
      'Getting vaccinated.',
      'Drains and clean water in your community.',
    ],
    tryIt: {
      need: 'An adult who knows your community',
      steps: [
        'Find the nearest hospital or clinic.',
        'Find out when it was built.',
        'Write how it helps people today.',
      ],
    },
  },
  'history-07': {
    indicator: {
      code: 'B5.4.3.2.1',
      text: 'Describe the economic measures introduced during the colonial period, including transport and communication projects.',
    },
    hook: 'Ghana is one of the world’s top cocoa growers. Yet cocoa does not come from Ghana. How did it get here?',
    explain: [
      'Tetteh Quarshie, a Ghanaian blacksmith, is said to have brought cocoa beans from the island of Fernando Po in 1879. He planted them at Mampong-Akuapem. Cocoa soon became the Gold Coast’s most important crop.',
      'The colonial government set up the Aburi Botanical Gardens in 1890, and agricultural stations such as Bunso, to study crops.',
      'To carry cocoa, gold and timber to the coast for export, the colonial government built railways, roads and Takoradi Harbour, which opened in 1928.',
    ],
    art: { kind: 'cocoa', label: 'A cocoa pod and its beans' },
    artCaption: 'Cocoa became the Gold Coast’s most important crop.',
    words: [
      {
        term: 'Cash crop',
        meaning: 'A crop grown to sell, not to eat at home.',
      },
      { term: 'Export', meaning: 'Sending goods to sell in other countries.' },
      {
        term: 'Harbour',
        meaning: 'A safe place where ships can load and unload.',
      },
    ],
    examples: [
      {
        title: 'Follow the cocoa',
        situation: 'How did cocoa get from a farm in Ashanti to a ship?',
        steps: [
          'Farmers harvested and dried the beans.',
          'Lorries carried them along roads to a railway station.',
          'Trains took them to the coast.',
          'Ships at Takoradi carried them abroad.',
        ],
        answer:
          'Roads, railways and harbours were built to move goods for export.',
        art: {
          kind: 'timeline',
          events: [
            ['1879', 'Cocoa planted at Mampong'],
            ['1890', 'Aburi Botanical Gardens'],
            ['1928', 'Takoradi Harbour opens'],
          ],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking cocoa has always grown in Ghana.',
        right: 'It was brought from abroad in the 1800s.',
      },
    ],
    realLife: [
      'Cocoa farms and buying centres.',
      'Takoradi Harbour today.',
      'The Tetteh Quarshie farm, which you can still visit.',
    ],
    tryIt: {
      need: 'A chocolate wrapper or cocoa drink tin',
      steps: [
        'Find where the cocoa in it came from.',
        'Draw the journey of cocoa from farm to factory.',
        'Label one way of transport for each step.',
      ],
    },
  },
  'history-08': {
    indicator: {
      code: 'B5.5.1.1.1',
      text: 'Identify the early protest movements in Ghana before 1945.',
    },
    hook: 'Long before independence, Gold Coast people stood up against unfair colonial laws. They did not use weapons. They used petitions, newspapers and meetings.',
    explain: [
      'A protest movement is a group of people who join together to speak against something they think is unfair.',
      'The Aborigines’ Rights Protection Society (ARPS) was formed in 1897 to protect people’s land from a colonial land law. The National Congress of British West Africa, planned from 1917, brought leaders from several British colonies together.',
      'The Gold Coast Youth Conference, formed in 1929, encouraged young educated people to discuss how to improve the country.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1897', 'ARPS formed'],
        ['1917', 'NCBWA planned'],
        ['1929', 'Gold Coast Youth Conference'],
      ],
    },
    artCaption: 'Early protest movements, in order.',
    words: [
      {
        term: 'Protest',
        meaning: 'Showing strong disagreement with something.',
      },
      {
        term: 'Movement',
        meaning: 'A group of people working together for a cause.',
      },
      { term: 'Petition', meaning: 'A written request signed by many people.' },
    ],
    examples: [
      {
        title: 'Why protest?',
        situation:
          'In 1897, a colonial law threatened to take control of land away from the people. What did the ARPS do?',
        steps: [
          'Leaders met and formed the ARPS.',
          'They wrote petitions against the law.',
          'They sent a delegation to London.',
          'The land law was withdrawn.',
        ],
        answer: 'Peaceful, organised protest succeeded in protecting the land.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the fight for independence began only in 1947.',
        right:
          'Gold Coast people protested against unfair rule for 50 years before that.',
      },
    ],
    realLife: [
      'Peaceful petitions people send today.',
      'Clubs and associations that speak for their members.',
      'Newspapers that report on public issues.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Think of something in your school you would like to improve.',
        'Write a short, polite petition about it.',
        'Explain your reasons clearly, as the ARPS did.',
      ],
    },
  },
  'history-09': {
    indicator: {
      code: 'B5.5.1.1.2',
      text: 'Examine sources of evidence about the role of Joseph Mensah Sarbah in the Aborigines’ Rights Protection Society (ARPS), 1897.',
    },
    hook: 'Joseph Mensah Sarbah was the first Gold Coast African to become a lawyer. He used the law to defend his people’s land.',
    explain: [
      'Joseph Mensah Sarbah was born in Cape Coast in 1864. He studied law in England and became a lawyer in 1887.',
      'He was a leading member of the ARPS. He used his legal knowledge to argue against the land law of 1897, which the colonial government later withdrew.',
      'He wrote books about Fante customary laws, which are still used as sources today. He also worked to develop education, including at Mfantsipim School.',
    ],
    art: {
      kind: 'sources',
      items: ['letter', 'newspaper', 'photo', 'brochure'],
    },
    artCaption: 'His books, letters and newspapers are sources about his life.',
    words: [
      {
        term: 'Lawyer',
        meaning:
          'A person trained to give advice about the law and argue cases.',
      },
      { term: 'Customary law', meaning: 'The traditional rules of a people.' },
      { term: 'Delegation', meaning: 'A group sent to speak for others.' },
    ],
    examples: [
      {
        title: 'Use the sources',
        situation: 'Which sources would tell us about Mensah Sarbah’s role?',
        steps: [
          'His own books on customary law.',
          'ARPS petitions and records.',
          'Newspapers of the 1890s.',
        ],
        answer:
          'His writings and the society’s records show what he did and believed.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking leaders only lead with speeches.',
        right: 'Mensah Sarbah led with knowledge, writing and the law.',
      },
    ],
    realLife: [
      'Lawyers who defend people’s rights today.',
      'Writing down our customs so they are not lost.',
      'Cape Coast, home of many early leaders.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a fact file on Joseph Mensah Sarbah.',
        'Include his birthplace, his work and his role in the ARPS.',
        'Write one quality of his you admire.',
      ],
    },
  },
  'history-10': {
    indicator: {
      code: 'B5.5.1.1.3',
      text: 'Examine sources of evidence about the role of Joseph Ephraim Casely-Hayford in the National Congress of British West Africa (NCBWA).',
    },
    hook: 'Joseph Ephraim Casely-Hayford dreamed of West Africans working together. He brought leaders from four colonies to the same table.',
    explain: [
      'Joseph Ephraim Casely-Hayford was born in Cape Coast in 1866. He was a lawyer, a journalist and a writer.',
      'He led the founding of the National Congress of British West Africa, which brought together leaders from the Gold Coast, Nigeria, Sierra Leone and the Gambia. Its first conference met in Accra in 1920.',
      'The Congress asked for Africans to have a real voice in their governments. Casely-Hayford also served on the Legislative Council.',
    ],
    art: { kind: 'sources', items: ['newspaper', 'letter', 'photo'] },
    artCaption: 'Newspapers he wrote for are sources about his ideas.',
    words: [
      {
        term: 'Congress',
        meaning: 'A formal meeting of people chosen to represent others.',
      },
      {
        term: 'Journalist',
        meaning: 'A person who writes news for newspapers.',
      },
      {
        term: 'Legislative Council',
        meaning: 'The colonial body that discussed and made laws.',
      },
    ],
    examples: [
      {
        title: 'One voice for West Africa',
        situation:
          'Why did Casely-Hayford bring leaders from four colonies together?',
        steps: [
          'All four colonies were ruled by Britain.',
          'Speaking together made their requests stronger.',
          'They wanted Africans to share in governing.',
        ],
        answer: 'Unity across colonies gave their demands more weight.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking each colony fought alone.',
        right: 'Leaders across West Africa worked together.',
      },
    ],
    realLife: [
      'ECOWAS, where West African countries work together today.',
      'Casford Hall at the University of Cape Coast, named after him.',
      'Journalists who speak up on public issues.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a fact file on Casely-Hayford.',
        'List the four colonies of the Congress.',
        'Explain in one sentence why unity mattered to him.',
      ],
    },
  },
  'history-11': {
    indicator: {
      code: 'B5.5.1.1.4',
      text: 'Examine sources of evidence about the role of Dr Joseph Boakye Danquah in the Gold Coast Youth Conference.',
    },
    hook: 'The name “Ghana” was suggested by a scholar who spent his life working for his country. Who was he?',
    explain: [
      'Dr Joseph Boakye Danquah was born at Bepong in Kwahu in 1895. He became a lawyer and a scholar who studied Akan history and philosophy.',
      'He organised the Gold Coast Youth Conference from 1929. It brought young people together to discuss the country’s problems and its future.',
      'Danquah later helped found the United Gold Coast Convention in 1947, and is credited with suggesting the name “Ghana”. Danquah Circle in Accra is named after him.',
    ],
    art: {
      kind: 'flag',
      label: 'Danquah is credited with suggesting the name Ghana',
    },
    artCaption: 'The name Ghana recalls an ancient West African empire.',
    words: [
      { term: 'Scholar', meaning: 'A person who studies a subject deeply.' },
      {
        term: 'Conference',
        meaning: 'A large meeting to discuss important matters.',
      },
      {
        term: 'Convention',
        meaning: 'An organised group or meeting with a shared goal.',
      },
    ],
    examples: [
      {
        title: 'Why “Ghana”?',
        situation: 'Why might Danquah have suggested the name Ghana?',
        steps: [
          'Ghana was the name of a great ancient West African empire.',
          'Using it gave the new nation a proud, African name.',
          'It replaced “Gold Coast”, a name given by Europeans.',
        ],
        answer: 'The name linked the new nation to Africa’s great past.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the ancient Ghana Empire was where Ghana is today.',
        right:
          'It was further north-west, in parts of today’s Mali and Mauritania.',
      },
    ],
    realLife: [
      'Danquah Circle in Accra.',
      'Our country’s name.',
      'Young people’s groups that discuss the future.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make a fact file on J. B. Danquah.',
        'Include his birthplace and his role in the Youth Conference.',
        'Explain why the name Ghana was a good choice.',
      ],
    },
  },
  'history-12': {
    indicator: {
      code: 'B5.5.3.1.1',
      text: 'Explain why people were unhappy in the country after the Second World War.',
    },
    hook: 'Gold Coast soldiers came home from fighting for Britain in the Second World War. They expected a better life. Instead, many found hardship. Why?',
    explain: [
      'The Second World War lasted from 1939 to 1945. Thousands of Gold Coast soldiers fought for Britain, some as far away as Burma.',
      'When they returned, many did not receive the jobs and payments they had been promised. At the same time, imported goods became very expensive, and there were not enough houses.',
      'Cocoa farmers were also angry: to stop a disease called swollen shoot, the government cut down their infected trees. In early 1948, people began a boycott of European goods. Anger grew into the riots of February 1948.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1939–1945', 'Second World War'],
        ['January 1948', 'Boycott of European goods'],
        ['28 February 1948', 'Ex-servicemen’s march'],
      ],
      focus: 2,
    },
    artCaption: 'The road to the 1948 riots.',
    words: [
      {
        term: 'Grievance',
        meaning: 'A reason to feel you have been treated unfairly.',
      },
      { term: 'Boycott', meaning: 'Refusing to buy goods to protest.' },
      { term: 'Swollen shoot', meaning: 'A disease that kills cocoa trees.' },
    ],
    examples: [
      {
        title: 'List the grievances',
        situation: 'Name three reasons people were unhappy after the war.',
        steps: [
          'Ex-servicemen did not get what they were promised.',
          'Imported goods cost too much.',
          'Cocoa farmers lost trees that were cut down.',
        ],
        answer:
          'Many groups had grievances at once, which made the anger spread.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the riots had only one cause.',
        right: 'Several grievances came together at the same time.',
      },
    ],
    realLife: [
      'Remembering the ex-servicemen on 28 February.',
      'Veterans’ associations today.',
      'Why governments must keep their promises.',
    ],
    tryIt: {
      need: 'Paper and pencils',
      steps: [
        'Draw a poster linking the boycott, the shooting and the riots of 1948.',
        'Use arrows to show cause and effect.',
        'Discuss: were the people right to be angry? Give reasons.',
      ],
    },
  },
  'history-13': {
    indicator: {
      code: 'B5.2.1.1.1',
      text: 'Describe how our ancestors lived in ancient times: what archaeology shows.',
    },
    hook: 'Our ancestors left no diaries. So how do we know how they lived 3,000 years ago? We dig!',
    explain: [
      'Archaeologists dig carefully at old sites. They find pots, stone and iron tools, beads, and the remains of houses and food.',
      'At Kintampo, archaeologists found evidence that people were farming and keeping animals about 3,500 years ago, among the earliest in Ghana.',
      'Each object is a clue. A broken pot can show what people cooked, and beads from far away show they traded.',
    ],
    art: { kind: 'sources', items: ['pot', 'coin', 'painting'] },
    artCaption: 'Things dug up from the ground tell us how people lived.',
    words: [
      { term: 'Excavation', meaning: 'A careful dig at an old site.' },
      { term: 'Artefact', meaning: 'An object made by people long ago.' },
      {
        term: 'Museum',
        meaning: 'A place where artefacts are kept and shown.',
      },
    ],
    examples: [
      {
        title: 'Read the clue',
        situation:
          'Archaeologists find grinding stones at an old village. What can they tell?',
        steps: [
          'Grinding stones are used to crush grain.',
          'So the people grew or gathered grain.',
          'They stayed in one place long enough to farm.',
        ],
        answer: 'The people of the village were likely farmers.',
      },
    ],
    mistakes: [
      {
        wrong: 'Digging up old sites to keep the objects.',
        right:
          'Only trained archaeologists should dig, so that clues are not destroyed.',
      },
    ],
    realLife: [
      'The National Museum in Accra.',
      'Old pots found when digging foundations.',
      'Protecting old sites in your area.',
    ],
    tryIt: {
      need: 'Old objects at home, with permission',
      steps: [
        'Pretend you are an archaeologist in 500 years’ time.',
        'Choose three objects from your home today.',
        'Write what each would tell a future historian about us.',
      ],
    },
  },
  'history-14': {
    indicator: {
      code: 'B5.2.1.1.2',
      text: 'Describe some ancient towns in Ghana: why trade made towns grow.',
    },
    hook: 'Why do big towns often grow where roads meet? Ghana’s ancient towns grew for the same reason.',
    explain: [
      'Trade routes were paths that traders walked, carrying goods on their heads or on donkeys. Towns grew where routes crossed or ended.',
      'Salaga grew as a meeting point of traders from the north and the forest, especially for kola nuts. Begho grew where forest gold met northern traders.',
      'Some towns declined when trade routes moved or wars came. Bono-Manso was abandoned after the Asante conquered Bono in the 1720s.',
    ],
    art: {
      kind: 'belts',
      belts: [
        { name: 'From the north', places: ['salt', 'cloth', 'livestock'] },
        { name: 'Market towns', places: ['Salaga', 'Begho'] },
        { name: 'From the forest', places: ['kola nuts', 'gold'] },
      ],
    },
    artCaption: 'Market towns grew where goods from north and south met.',
    words: [
      {
        term: 'Trade route',
        meaning: 'A path along which traders carried goods.',
      },
      { term: 'Market', meaning: 'A place where people buy and sell.' },
      { term: 'Decline', meaning: 'Becoming weaker or smaller.' },
    ],
    examples: [
      {
        title: 'Rise and fall',
        situation: 'Why did Bono-Manso decline?',
        steps: [
          'It was the capital of the Bono state.',
          'The Asante conquered Bono in the 1720s.',
          'People left the town.',
        ],
        answer: 'War ended the town’s importance.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking towns last forever.',
        right: 'Towns grow and shrink as trade and history change.',
      },
    ],
    realLife: [
      'Big markets in towns where roads meet today.',
      'Lorry stations as meeting points.',
      'Techiman market, near old Bono-Manso.',
    ],
    tryIt: {
      need: 'A map of your district',
      steps: [
        'Find where the main roads in your area meet.',
        'Is there a market or a busy town there?',
        'Explain why it grew there.',
      ],
    },
  },
  'history-15': {
    indicator: {
      code: 'B5.2.5.1.1',
      text: 'Name Ghanaians who have made significant contributions: what makes a role model.',
    },
    hook: 'What do a judge, a surgeon and a football star have in common? Hard work, and a wish to make a difference.',
    explain: [
      'Professor Akua Kuenyehia served as a judge of the International Criminal Court. Professor Frimpong-Boateng set up the National Cardiothoracic Centre at Korle Bu, so that heart surgery could be done in Ghana.',
      'Dr R. E. G. Armattoe was a doctor and scientist who did medical research in the 1940s. Osibisa, a band formed by Ghanaian musicians in London, took Afro-rock music around the world.',
      'Role models usually share qualities: hard work, courage, honesty and a wish to serve others. You can build these qualities too.',
    ],
    art: { kind: 'flag', label: 'Qualities you can build too' },
    artCaption: 'Every achiever started as a learner.',
    words: [
      { term: 'Perseverance', meaning: 'Not giving up when things are hard.' },
      { term: 'Integrity', meaning: 'Being honest and doing what is right.' },
      {
        term: 'Inspire',
        meaning: 'Give someone the wish to do something great.',
      },
    ],
    examples: [
      {
        title: 'Find the quality',
        situation:
          'Abedi Pele practised football from childhood and became one of Africa’s best players. Which quality does this show?',
        steps: [
          'He practised for many years.',
          'He kept going through difficulties.',
        ],
        answer: 'Perseverance.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking success only comes from talent.',
        right: 'Most achievers worked very hard over many years.',
      },
    ],
    realLife: [
      'Teachers and nurses in your community.',
      'Older students who help younger ones.',
      'People who volunteer their time.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Choose a Ghanaian role model, famous or from your community.',
        'Write three qualities they have.',
        'Choose one quality to practise this week.',
      ],
    },
  },
  'history-16': {
    indicator: {
      code: 'B5.3.2.1.1',
      text: 'Investigate the trade in humans: remembering and resisting.',
    },
    hook: 'At Assin Manso, there is a river where captives were made to bathe for the last time on their journey to the coast. Today, people go there to remember.',
    explain: [
      'Captives were often marched to the coast and held in forts and castles, such as Cape Coast and Elmina, before ships took them away. Many castles have a “Door of No Return”.',
      'People resisted in many ways: escaping, fighting back and keeping their songs, languages and beliefs alive. In the Americas, their descendants kept African culture alive.',
      'Britain made the trade illegal in 1807, and other countries followed. In 2019, Ghana held the “Year of Return”, welcoming people of African descent to visit their ancestral home.',
    ],
    art: {
      kind: 'building',
      building: 'fort',
      label: 'The castles are places of remembrance',
    },
    artCaption:
      'Coastal castles where captives were held now teach us to remember.',
    words: [
      { term: 'Captive', meaning: 'A person held by force.' },
      { term: 'Resistance', meaning: 'Fighting against injustice.' },
      {
        term: 'Abolition',
        meaning: 'Officially ending something, such as the slave trade.',
      },
    ],
    examples: [
      {
        title: 'Why remember?',
        situation: 'Why do we keep places like the castles and Assin Manso?',
        steps: [
          'They honour the millions who suffered.',
          'They teach the truth about the past.',
          'They help make sure it never happens again.',
        ],
        answer: 'Remembering honours the victims and protects the future.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking enslaved people accepted their fate.',
        right: 'Many resisted, and their courage and culture survived.',
      },
    ],
    realLife: [
      'Emancipation Day remembrances.',
      'Visitors from the Americas coming to Ghana.',
      'Speaking out against unfairness today.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write a short, respectful message to honour the people who were taken.',
        'Include one thing we can do today to defend human freedom.',
        'Share it with your class.',
      ],
    },
  },
  'history-17': {
    indicator: {
      code: 'B5.4.2.1.1',
      text: 'Identify the developments in education during the colonial era: Dr Kwegyir Aggrey.',
    },
    hook: 'A piano has black keys and white keys. Dr Aggrey said that to play a good tune, you need both. What did he mean?',
    explain: [
      'Dr James Emman Kwegyir Aggrey was born at Anomabu in 1875. He studied in the United States and became a famous teacher and speaker.',
      'He returned to help found Achimota School, which opened in 1927 as a school for boys and girls together, at a time when few girls went to school.',
      'Aggrey taught that Africans and Europeans should work together as equals, like the black and white keys of a piano. He also believed in educating girls: “Educate a woman, and you educate a nation.”',
    ],
    art: {
      kind: 'building',
      building: 'school',
      label: 'Achimota opened in 1927',
    },
    artCaption: 'Aggrey helped found Achimota.',
    words: [
      {
        term: 'Co-education',
        meaning: 'Boys and girls learning in the same school.',
      },
      {
        term: 'Equality',
        meaning: 'Being treated the same, with the same rights.',
      },
      { term: 'Educator', meaning: 'A person who teaches and leads learning.' },
    ],
    examples: [
      {
        title: 'Read the saying',
        situation:
          '“Educate a man, and you educate an individual. Educate a woman, and you educate a nation.” What does it mean?',
        steps: [
          'An educated mother often teaches her children.',
          'Her knowledge spreads through her whole family.',
          'Many families together make a nation.',
        ],
        answer: 'Educating girls benefits everyone.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking school was only ever for boys.',
        right: 'Leaders like Aggrey worked hard for girls’ education.',
      },
    ],
    realLife: [
      'Girls and boys learning together in your class.',
      'Aggrey Memorial School in Cape Coast, named after him.',
      'Scholarships for girls today.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write Aggrey’s piano saying in your own words.',
        'Draw a piano with black and white keys.',
        'Explain how your class can “play in harmony”.',
      ],
    },
  },
  'history-18': {
    indicator: {
      code: 'B5.4.2.1.2',
      text: 'Identify some of the health facilities in the colonial period: then and now.',
    },
    hook: 'Korle Bu began in 1923. Today it trains doctors for all of Ghana. How did a colonial hospital become what it is now?',
    explain: [
      'When Korle Bu opened, Gold Coast patients could be treated in a large modern hospital for the first time. Nurses were trained there.',
      'After independence, the University of Ghana Medical School was founded in 1962, and Korle Bu became its teaching hospital.',
      'Today it has special centres, such as the National Cardiothoracic Centre for heart surgery. One building has grown into a whole medical city.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1923', 'Korle Bu opens'],
        ['1962', 'Medical school founded'],
        ['Today', 'A national teaching hospital'],
      ],
    },
    artCaption: 'Korle Bu, then and now.',
    words: [
      {
        term: 'Teaching hospital',
        meaning: 'A hospital where doctors and nurses are trained.',
      },
      {
        term: 'Specialist',
        meaning: 'A doctor who is expert in one area of medicine.',
      },
      { term: 'Continuity', meaning: 'What stays the same over time.' },
    ],
    examples: [
      {
        title: 'Change and continuity',
        situation:
          'What has changed at Korle Bu, and what has stayed the same?',
        steps: [
          'Continuity: it still cares for the sick, in the same place.',
          'Change: it now trains doctors and does advanced surgery.',
        ],
        answer:
          'Its purpose continues, but it has grown and changed a great deal.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking old buildings stop being useful.',
        right: 'Many colonial-era hospitals still serve people today.',
      },
    ],
    realLife: [
      'Teaching hospitals in Kumasi, Tamale and Cape Coast.',
      'Doctors trained in Ghana.',
      'Health posts in rural communities.',
    ],
    tryIt: {
      need: 'A health worker or an adult to ask',
      steps: [
        'Find out where the nearest hospital is, and when it opened.',
        'Ask what has changed there over the years.',
        'Write one change and one thing that stayed the same.',
      ],
    },
  },
  'history-19': {
    indicator: {
      code: 'B5.4.3.2.1',
      text: 'Describe the economic measures introduced during the colonial period: who benefited?',
    },
    hook: 'The colonial government built railways and a harbour. But where did the railways go, and whom did they serve?',
    explain: [
      'The first railways linked the gold mines and cocoa areas to the coast. The line from Sekondi reached Kumasi in 1903.',
      'This helped export gold, cocoa and timber. Much of the profit went to British companies and the colonial government.',
      'Gold Coast people gained too: farmers earned money from cocoa, and roads and railways made travel easier. Historians weigh both sides.',
    ],
    art: {
      kind: 'timeline',
      events: [
        ['1903', 'Railway reaches Kumasi'],
        ['1923', 'Accra–Kumasi line'],
        ['1928', 'Takoradi Harbour'],
      ],
    },
    artCaption: 'Transport built to carry goods to the coast.',
    words: [
      { term: 'Profit', meaning: 'Money left over after costs are paid.' },
      {
        term: 'Raw material',
        meaning:
          'A natural product used to make other things, such as cocoa or gold.',
      },
      {
        term: 'Infrastructure',
        meaning: 'Roads, railways and buildings that a country needs.',
      },
    ],
    examples: [
      {
        title: 'Weigh both sides',
        situation: 'Who gained from the colonial railways?',
        steps: [
          'British companies: they could export gold and cocoa cheaply.',
          'Cocoa farmers: they could sell more.',
          'But many areas without exports got no railway at all.',
        ],
        answer:
          'Railways mainly served exports, though some people gained too.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking railways were built mainly to help people travel.',
        right: 'They were built mainly to carry goods for export.',
      },
    ],
    realLife: [
      'Old railway stations in Kumasi and Sekondi.',
      'Ghana still exporting cocoa and gold.',
      'New railways being built today.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Make two columns: “Who gained?” and “Who lost out?”',
        'Write at least two points in each.',
        'Discuss whether the railways were good for the Gold Coast.',
      ],
    },
  },
  'history-20': {
    indicator: {
      code: 'B5.5.1.1.1',
      text: 'Identify the early protest movements in Ghana before 1945: how peaceful protest works.',
    },
    hook: 'Can words win against a powerful government? In 1897, they did.',
    explain: [
      'Peaceful protest uses words, numbers and organisation, not weapons. Petitions, newspapers, meetings and delegations are its tools.',
      'In 1897, the ARPS wrote petitions, printed articles and sent a delegation to London to argue against the land law. The law was withdrawn.',
      'Each movement taught the next. The ARPS, the National Congress and the Youth Conference prepared the way for the independence movement.',
    ],
    art: {
      kind: 'scroll',
      title: 'A Petition',
      date: 'The tools of peaceful protest',
      lines: [
        'Explain the problem clearly.',
        'Give reasons and evidence.',
        'Collect many signatures.',
        'Deliver it to those in power.',
      ],
    },
    artCaption: 'How a petition works.',
    words: [
      {
        term: 'Peaceful protest',
        meaning: 'Disagreeing publicly without violence.',
      },
      {
        term: 'Signature',
        meaning: 'A person’s name, written to show agreement.',
      },
      { term: 'Delegation', meaning: 'A group sent to speak for others.' },
    ],
    examples: [
      {
        title: 'Plan a petition',
        situation:
          'Your class wants a reading corner. How could you use a petition?',
        steps: [
          'Explain why a reading corner would help.',
          'Collect signatures from classmates.',
          'Deliver it politely to the head teacher.',
        ],
        answer:
          'Clear reasons, many supporters and respectful delivery make a strong petition.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking protest means shouting or fighting.',
        right: 'The most lasting protests were peaceful and well organised.',
      },
    ],
    realLife: [
      'Petitions to local assemblies.',
      'Letters to newspapers.',
      'Student representatives speaking for classmates.',
    ],
    tryIt: {
      need: 'Paper and classmates',
      steps: [
        'Choose a small, fair change for your school.',
        'Write a petition with three reasons.',
        'Ask classmates to sign, and share it politely.',
      ],
    },
  },
}
