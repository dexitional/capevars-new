import type { CourseGuides } from './types'

// Basic 2 Physical Education, written for this course and scoped to the NaCCA
// Physical Education Curriculum for Primary Schools (2019), for six- and
// seven-year-olds. Notes:
// - Codes are the curriculum's own. The imported lessons carry shifted ones.
//   The fitness standard's first indicator is missing from the curriculum
//   (only "B 2.3.1.3.1, Assess and maintain a level of physical fitness"), so
//   lesson 13 teaches a simple fitness check under that code; "B2.5.4.1" is
//   given as B2.5.4.5.1.
// - The curriculum lists "five major components of physical fitness" but
//   leaves out flexibility; the guide names all five.
// - Its body-parts exemplar says "apart from deformity"; the guide compares
//   left and right without that word, and says every body deserves respect.
// - Drug awareness is kept to what suits young children: medicines only from
//   a trusted grown-up, and saying no and telling a grown-up about anything else.

export const guides: CourseGuides = {
  'pe-01': {
    indicator: {
      code: 'B2.1.1.1.2',
      text: 'Skip forward and backward without a rope.',
    },
    hook: 'You can skip even without a rope. Can you skip forward, then backward?',
    explain: [
      'Stand with your feet together.',
      'Jump with both feet and land on both feet.',
      'Turn your arms in small circles, as if you were holding a rope.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'jumpUp', x: 220, kit: 1 },
        { pose: 'jumpUp', x: 420, kit: 2 },
      ],
      label: 'Jump on both feet, turn your arms',
    },
    artCaption: 'Pretend you have a rope.',
    words: [
      { term: 'Skip', meaning: 'Small jumps, again and again.' },
      { term: 'Forward', meaning: 'The way you are facing.' },
      { term: 'Backward', meaning: 'The way behind you.' },
    ],
    examples: [
      {
        title: 'Skip on the spot',
        situation: 'How do you skip in one place?',
        steps: [
          'Keep your feet together.',
          'Make small jumps.',
          'Land softly on your toes.',
        ],
        answer: 'Small, soft jumps.',
      },
      {
        title: 'Skip backward',
        situation: 'How do you skip backward safely?',
        steps: ['Look behind you first.', 'Make small jumps backward, slowly.'],
        answer: 'Look first, then go slowly.',
      },
    ],
    mistakes: [
      {
        wrong: 'Landing with a loud bump.',
        right: 'Land softly on your toes, with bent knees.',
      },
    ],
    realLife: ['Skipping games.', 'Warming up for sport.', 'Dancing.'],
    tryIt: {
      need: 'A flat, clear space',
      steps: [
        'Skip on the spot ten times.',
        'Skip forward to a line.',
        'Skip backward slowly.',
      ],
    },
    safety: [
      'Look behind you before moving backward.',
      'Skip on flat ground, away from others.',
    ],
  },
  'pe-02': {
    indicator: {
      code: 'B2.1.1.1.1',
      text: 'Travel in straight, curved and zigzag pathways, walking, running, leaping, jumping and hopping.',
    },
    hook: 'Can you move like a train on a straight track, a snake on a curvy path, and lightning in a zigzag?',
    explain: [
      'A pathway is the shape of the way you move.',
      'A straight path goes in a line. A curved path bends.',
      'A zigzag path turns sharply from side to side.',
    ],
    art: { kind: 'course', path: 'zigzag', label: 'A zigzag pathway' },
    artCaption: 'Sharp turns from side to side.',
    words: [
      { term: 'Pathway', meaning: 'The shape of the way you move.' },
      { term: 'Curved', meaning: 'Bending, like a snake.' },
      { term: 'Zigzag', meaning: 'Sharp turns from side to side.' },
    ],
    examples: [
      {
        title: 'Follow the path',
        situation: 'Your teacher draws a curvy line. How do you move along it?',
        steps: [
          'Walk along it slowly.',
          'Then jog along it.',
          'Then hop along it.',
        ],
        answer: 'Start slowly, then try new ways.',
      },
    ],
    mistakes: [
      {
        wrong: 'Running fast on the zigzag and slipping.',
        right: 'Slow down at each turn.',
      },
    ],
    realLife: ['Walking around puddles.', 'Dodging in games.', 'Dancing.'],
    tryIt: {
      need: 'Chalk or a stick to draw lines',
      steps: [
        'Draw a straight, a curved and a zigzag line.',
        'Walk each one.',
        'Hop or jump along each one.',
      ],
    },
    safety: [
      'Keep your eyes on the path.',
      'Leave space between you and others.',
    ],
  },
  'pe-03': {
    indicator: {
      code: 'B2.1.3.1.1',
      text: 'Balance on the ground and on objects, using bases of support other than both feet.',
    },
    hook: 'Can you balance on your bottom with your feet in the air? Or on one foot?',
    explain: [
      'Your base of support is the part of you touching the ground.',
      'You can balance on one foot, on your bottom, or on your hands and knees.',
      'A wide base is steadier than a small one.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'seatLift', x: 220, kit: 1 },
        { pose: 'beam', x: 430, kit: 3 },
      ],
      label: 'Different bases of support',
    },
    artCaption: 'Balancing on your bottom, and on your feet with arms out.',
    words: [
      { term: 'Balance', meaning: 'Staying steady without falling.' },
      {
        term: 'Base of support',
        meaning: 'The part of you touching the ground.',
      },
      { term: 'Steady', meaning: 'Still and not wobbling.' },
    ],
    examples: [
      {
        title: 'Sit and lift',
        situation:
          'Sit on the floor and lift your feet. How do you stay steady?',
        steps: [
          'Put your hands on the floor beside you.',
          'Lift your feet a little.',
          'Hold still and count to five.',
        ],
        answer: 'Your hands help you balance.',
      },
    ],
    mistakes: [
      {
        wrong: 'Holding your breath.',
        right: 'Breathe normally while you balance.',
      },
    ],
    realLife: [
      'Standing on one foot to put on a shoe.',
      'Climbing at the playground.',
      'Dancing.',
    ],
    tryIt: {
      need: 'A mat or soft grass',
      steps: [
        'Balance on one foot for five seconds.',
        'Balance on your bottom with feet up.',
        'Find a new way to balance.',
      ],
    },
    safety: [
      'Balance on a mat or soft grass.',
      'Only balance on objects your teacher says are safe.',
    ],
  },
  'pe-04': {
    indicator: {
      code: 'B2.1.2.1.2',
      text: 'Strike a ball continuously in an upward or forward motion, using a hand and a foot.',
    },
    hook: 'Can you keep a ball bouncing up with your hand, again and again?',
    explain: [
      'Strike means to hit.',
      'Use a flat hand to hit the ball up. Watch it come down, then hit it again.',
      'You can also tap the ball forward with your foot.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'forehand', x: 200, kit: 1 },
        { pose: 'kick', x: 440, kit: 2 },
      ],
      balls: [
        [260, 140],
        [510, 280],
      ],
      label: 'Hit with your hand, tap with your foot',
    },
    artCaption: 'Watch the ball all the time.',
    words: [
      { term: 'Strike', meaning: 'Hit.' },
      { term: 'Upward', meaning: 'Going up.' },
      { term: 'Again and again', meaning: 'Many times in a row.' },
    ],
    examples: [
      {
        title: 'Keep it up',
        situation: 'How do you hit a ball up many times?',
        steps: [
          'Use a flat hand.',
          'Hit it gently up.',
          'Watch it and hit it again.',
        ],
        answer: 'Gentle hits and watching eyes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Hitting very hard.',
        right: 'Gentle hits keep the ball close.',
      },
    ],
    realLife: ['Volleyball.', 'Football.', 'Balloon games at parties.'],
    tryIt: {
      need: 'A balloon or a soft, light ball',
      steps: [
        'Hit a balloon up with your hand.',
        'Count how many times before it falls.',
        'Tap a ball forward with your foot.',
      ],
    },
    safety: ['Use a balloon or soft ball.', 'Play in a clear space.'],
  },
  'pe-05': {
    indicator: {
      code: 'B2.1.2.1.4',
      text: 'Perform the overhand throw pattern.',
    },
    hook: 'Throwing a ball far needs your whole body, not just your arm. Let us learn how.',
    explain: [
      'Stand side-on to where you are throwing.',
      'Take your throwing arm back, high above your shoulder.',
      'Step forward with the other foot and throw. Let your arm follow through.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'throw', x: 300, kit: 2, holds: 'ball' }],
      label: 'Arm back, step, throw',
    },
    artCaption: 'Step with the opposite foot.',
    words: [
      {
        term: 'Overhand',
        meaning: 'Throwing with your hand above your shoulder.',
      },
      { term: 'Side-on', meaning: 'Your side facing where you throw.' },
      {
        term: 'Follow through',
        meaning: 'Your arm keeps moving after you throw.',
      },
    ],
    examples: [
      {
        title: 'Which foot?',
        situation: 'You throw with your right hand. Which foot steps forward?',
        steps: ['The opposite foot steps.'],
        answer: 'Your left foot.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stepping with the same foot as your throwing hand.',
        right: 'Step with the opposite foot.',
      },
    ],
    realLife: [
      'Playing catch.',
      'Cricket and rounders.',
      'Throwing a ball to a friend.',
    ],
    tryIt: {
      need: 'A soft ball and a wall',
      steps: [
        'Stand side-on to the wall.',
        'Arm back, step, throw.',
        'Throw ten times.',
      ],
    },
    safety: ['Throw only when nobody is in front of you.', 'Use a soft ball.'],
  },
  'pe-06': {
    indicator: {
      code: 'B2.1.2.1.6',
      text: 'Catch a flying ball below the waist.',
    },
    hook: 'A low ball can be hard to catch. Where do your hands go?',
    explain: [
      'Bend your knees to get low.',
      'Point your fingers down, with your little fingers together, like a scoop.',
      'Watch the ball into your hands, then pull it to your tummy.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 170, kit: 1, holds: 'ball' },
        { pose: 'catch', x: 460, kit: 2, facing: -1 },
      ],
      label: 'Low ball: fingers down',
    },
    artCaption: 'Make a scoop with your hands.',
    words: [
      { term: 'Catch', meaning: 'Take hold of a ball coming to you.' },
      { term: 'Waist', meaning: 'The middle of your body.' },
      { term: 'Scoop', meaning: 'Hands together like a bowl.' },
    ],
    examples: [
      {
        title: 'High or low?',
        situation: 'The ball comes below your waist. Fingers up or down?',
        steps: ['Low balls need fingers down.'],
        answer: 'Fingers down.',
      },
    ],
    mistakes: [
      {
        wrong: 'Standing straight and reaching down.',
        right: 'Bend your knees to get low.',
      },
    ],
    realLife: [
      'Catching games.',
      'Rounders.',
      'Catching something a friend tosses.',
    ],
    tryIt: {
      need: 'A soft ball and a partner',
      steps: [
        'Your partner rolls the ball. Scoop it up.',
        'Your partner tosses it low. Catch it.',
        'Count your catches.',
      ],
    },
    safety: ['Use a soft ball.', 'Toss gently and underarm.'],
  },
  'pe-07': {
    indicator: {
      code: 'B2.1.2.1.8',
      text: 'Hand-dribble a ball with control for a sustained period.',
    },
    hook: 'Can you bounce a ball again and again without losing it?',
    explain: [
      'Push the ball down with your fingertips.',
      'Keep it bouncing at about the height of your waist.',
      'Bend your knees a little and keep your eyes up.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'crouch', x: 300, kit: 3 }],
      balls: [[250, 290]],
      label: 'Fingertips push the ball down',
    },
    artCaption: 'Keep the ball low and close.',
    words: [
      { term: 'Dribble', meaning: 'Bounce the ball again and again.' },
      { term: 'Fingertips', meaning: 'The ends of your fingers.' },
      { term: 'Control', meaning: 'Keeping the ball where you want it.' },
    ],
    examples: [
      {
        title: 'Count your bounces',
        situation: 'How can you get better at dribbling?',
        steps: ['Bounce the ball and count.', 'Try to beat your number.'],
        answer: 'Practise and count.',
      },
    ],
    mistakes: [
      {
        wrong: 'Slapping the ball with a flat hand.',
        right: 'Push it with your fingertips.',
      },
    ],
    realLife: ['Basketball.', 'Handball.', 'Playground games.'],
    tryIt: {
      need: 'A bouncy ball',
      steps: [
        'Bounce with one hand ten times.',
        'Bounce with the other hand.',
        'Bounce while walking slowly.',
      ],
    },
    safety: ['Bounce in a clear space.', 'Keep away from windows and walls.'],
  },
  'pe-08': {
    indicator: {
      code: 'B2.1.2.1.10',
      text: 'Foot-dribble by controlling a ball on the ground.',
    },
    hook: 'Can you move a ball along with your feet, without kicking it away?',
    explain: [
      'Tap the ball gently with the inside of your foot.',
      'Keep the ball close to you.',
      'Use both feet, one after the other.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'run', x: 280, kit: 2 }],
      balls: [[335, 288]],
      cones: [470, 540],
      label: 'Small taps keep the ball close',
    },
    artCaption: 'Keep the ball close.',
    words: [
      {
        term: 'Foot-dribble',
        meaning: 'Move the ball with small taps of your feet.',
      },
      { term: 'Tap', meaning: 'A small, gentle touch.' },
      { term: 'Cone', meaning: 'A marker on the ground.' },
    ],
    examples: [
      {
        title: 'Around the cones',
        situation: 'How do you dribble around cones?',
        steps: ['Walk slowly with the ball.', 'Tap it gently past each cone.'],
        answer: 'Slow and gentle.',
      },
    ],
    mistakes: [
      { wrong: 'Kicking the ball far away.', right: 'Use small taps.' },
    ],
    realLife: ['Football.', 'Playing with friends.', 'Street games.'],
    tryIt: {
      need: 'A football and some cones or stones',
      steps: [
        'Walk the ball in a straight line.',
        'Walk it around the cones.',
        'Try with your other foot.',
      ],
    },
    safety: [
      'Play on flat ground with no stones.',
      'Look up so you do not bump into anyone.',
    ],
  },
  'pe-09': {
    indicator: {
      code: 'B2.1.1.1.3',
      text: 'Identify the right and left sides of the body, and movement from right to left.',
    },
    hook: 'Which is your right hand? Which is your left? Let us play a game to find out!',
    explain: [
      'Your body has a right side and a left side.',
      'Many people write and eat with their right hand. Some use their left. Both are fine.',
      'Moving right to left means going from your right side towards your left side.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [{ pose: 'beam', x: 320, kit: 2 }],
      label: 'Arms out: your right side and your left side',
    },
    artCaption: 'Know your right and left.',
    words: [
      { term: 'Right', meaning: 'One side of your body.' },
      { term: 'Left', meaning: 'The other side of your body.' },
      { term: 'Side', meaning: 'One half of your body.' },
    ],
    examples: [
      {
        title: 'Simon says',
        situation:
          'Your teacher says “Touch your left knee with your right hand.” What do you do?',
        steps: [
          'Find your right hand.',
          'Find your left knee.',
          'Touch them together.',
        ],
        answer: 'Right hand on left knee.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking everyone uses the right hand.',
        right: 'Some people use their left hand. Both are fine.',
      },
    ],
    realLife: [
      'Following directions.',
      'Crossing the road safely.',
      'Dancing.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Your friend calls “right” or “left”.',
        'Hop on that foot.',
        'Swap and call for your friend.',
      ],
    },
    safety: ['Leave space around you.', 'Hop on soft ground.'],
  },
  'pe-10': {
    indicator: { code: 'B2.2.1.2.1', text: 'Explain open spaces.' },
    hook: 'In a game, where should you run? To a space where nobody is!',
    explain: [
      'An open space is a place with nobody in it.',
      'Moving into open space stops you bumping into people.',
      'In ball games, a friend can pass to you in open space.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'reach', x: 120, kit: 1 },
        { pose: 'reach', x: 320, kit: 2 },
        { pose: 'reach', x: 520, kit: 3 },
      ],
      label: 'Spread out into open space',
    },
    artCaption: 'Everyone has room to move.',
    words: [
      { term: 'Open space', meaning: 'A place with nobody in it.' },
      { term: 'Spread out', meaning: 'Move away from each other.' },
      { term: 'Crowd', meaning: 'Many people close together.' },
    ],
    examples: [
      {
        title: 'Find a space',
        situation: 'Everyone is running to the ball. Where should you go?',
        steps: [
          'Look for a space with nobody in it.',
          'Move there and wave for the ball.',
        ],
        answer: 'Into open space.',
      },
    ],
    mistakes: [
      {
        wrong: 'Everyone chasing the ball together.',
        right: 'Spread out into open spaces.',
      },
    ],
    realLife: ['Ball games.', 'Walking in a busy market.', 'Playing at break.'],
    tryIt: {
      need: 'A marked space and a whistle',
      steps: [
        'Walk around without touching anyone.',
        'When the whistle blows, stop in an open space.',
        'Check: can you stretch your arms?',
      ],
    },
    safety: ['Look where you are going.', 'Stop when you hear the whistle.'],
  },
  'pe-11': {
    indicator: { code: 'B2.2.3.2.1', text: 'Compare the body parts.' },
    hook: 'Look at your two hands. Are they the same? What about your two feet?',
    explain: [
      'Your body has two sides that look almost the same.',
      'You have two hands, two arms, two legs and two feet.',
      'Every body is different, and every body deserves respect.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [{ pose: 'reach', x: 320, kit: 1 }],
      label: 'Two arms, two hands, two legs',
    },
    artCaption: 'Your two sides match.',
    words: [
      { term: 'Compare', meaning: 'Look for what is the same and different.' },
      { term: 'Pair', meaning: 'Two of the same thing.' },
      { term: 'Respect', meaning: 'Treating others kindly.' },
    ],
    examples: [
      {
        title: 'Hand to hand',
        situation: 'Put your two hands palm to palm. What do you notice?',
        steps: ['Look at the fingers.', 'Look at the size.'],
        answer: 'They are almost the same.',
      },
    ],
    mistakes: [
      {
        wrong: 'Laughing at how someone’s body looks.',
        right: 'Every body is different. Be kind.',
      },
    ],
    realLife: [
      'Clapping.',
      'Catching with two hands.',
      'Running with two legs.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Compare your two hands.',
        'Compare your two feet.',
        'Tell a friend one thing that matches.',
      ],
    },
    safety: [
      'Be kind when talking about bodies.',
      'Ask before touching a friend.',
    ],
  },
  'pe-12': {
    indicator: {
      code: 'B2.2.4.2.2',
      text: 'Identify the roles of the body parts not directly involved in catching.',
    },
    hook: 'You catch with your hands. But what are your legs and body doing?',
    explain: [
      'Your hands catch the ball.',
      'Your legs bend to keep you steady.',
      'Your eyes watch the ball, and your body soaks up the ball’s push.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'catch', x: 320, kit: 2 }],
      label: 'Legs bend, eyes watch, hands catch',
    },
    artCaption: 'The whole body helps.',
    words: [
      { term: 'Steady', meaning: 'Still and not falling.' },
      { term: 'Soak up', meaning: 'Take in softly.' },
      { term: 'Whole body', meaning: 'All your parts together.' },
    ],
    examples: [
      {
        title: 'Stiff or bendy?',
        situation: 'Why bend your knees when you catch?',
        steps: [
          'Bent knees keep you steady.',
          'They help you move to the ball.',
        ],
        answer: 'You catch better and do not fall.',
      },
    ],
    mistakes: [
      {
        wrong: 'Standing with stiff, straight legs.',
        right: 'Bend your knees a little.',
      },
    ],
    realLife: ['Catching games.', 'Netball.', 'Catching a bag from a friend.'],
    tryIt: {
      need: 'A soft ball and a partner',
      steps: [
        'Catch with stiff legs.',
        'Catch with bent knees.',
        'Say which felt steadier.',
      ],
    },
    safety: ['Use a soft ball.', 'Throw gently.'],
  },
  'pe-13': {
    indicator: {
      code: 'B2.3.1.3.1',
      text: 'Assess and maintain a level of physical fitness to improve health and performance.',
    },
    hook: 'How fit are you? A simple check can show you, and help you get fitter.',
    explain: [
      'Being fit means your body can play and work without getting tired quickly.',
      'You can check how many jumps or how many steps you can do.',
      'Check again later to see how you have improved.',
    ],
    art: { kind: 'pulse', label: 'Feel your heart beat after running' },
    artCaption: 'Your heart beats faster when you move.',
    words: [
      { term: 'Fit', meaning: 'Strong and healthy for playing.' },
      { term: 'Check', meaning: 'Find out how well you do.' },
      { term: 'Improve', meaning: 'Get better.' },
    ],
    examples: [
      {
        title: 'Jump check',
        situation: 'How many jumps can you do on the spot?',
        steps: [
          'Jump until you need a rest.',
          'Count your jumps.',
          'Write the number down.',
        ],
        answer: 'Try to beat it next week.',
      },
    ],
    mistakes: [
      {
        wrong: 'Comparing yourself with your friends.',
        right: 'Compare with your own last score.',
      },
    ],
    realLife: [
      'Playing longer without getting tired.',
      'Walking to school.',
      'Helping at home.',
    ],
    tryIt: {
      need: 'Paper and a pencil',
      steps: [
        'Count how many jumps you can do.',
        'Write it down.',
        'Try again next week.',
      ],
    },
    safety: ['Stop and rest if you feel dizzy.', 'Drink water.'],
  },
  'pe-14': {
    indicator: {
      code: 'B2.3.3.3.1',
      text: 'Perform two sets of four continuous abdominal curls.',
    },
    hook: 'Your tummy muscles help you sit up straight. Let us make them strong!',
    explain: [
      'Lie on your back with your knees bent and feet flat.',
      'Put your arms by your sides, palms down.',
      'Lift your head and shoulders a little, then lie back down. That is one curl.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'sitUp', x: 300, kit: 1 }],
      label: 'Knees bent, lift head and shoulders',
    },
    artCaption: 'Lift a little, then lie down.',
    words: [
      { term: 'Curl', meaning: 'Lifting your head and shoulders up a little.' },
      {
        term: 'Tummy muscles',
        meaning: 'The muscles at the front of your body.',
      },
      { term: 'Set', meaning: 'A group of repeats.' },
    ],
    examples: [
      {
        title: 'Count them',
        situation: 'You do two sets of four curls. How many is that?',
        steps: ['4 + 4 = 8.'],
        answer: '8 curls.',
      },
    ],
    mistakes: [
      {
        wrong: 'Pulling your head up with your hands.',
        right: 'Keep your arms by your sides. Your tummy does the work.',
      },
    ],
    realLife: [
      'Sitting up in bed.',
      'Carrying things.',
      'Sitting up straight in class.',
    ],
    tryIt: {
      need: 'A mat',
      steps: ['Do four curls.', 'Rest for a moment.', 'Do four more.'],
    },
    safety: ['Use a mat.', 'Never pull on your neck.'],
  },
  'pe-15': {
    indicator: {
      code: 'B2.3.5.3.1',
      text: 'Identify the parts of the human body, such as bones and muscles.',
    },
    hook: 'What is inside your body? Bones, muscles, a heart and lungs, all working together!',
    explain: [
      'Bones are hard. They hold you up and protect you.',
      'Muscles pull on your bones to make you move.',
      'Your heart pumps blood, and your lungs breathe in air.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'run', x: 300, kit: 2 }],
      label: 'Bones, muscles, heart and lungs work together',
    },
    artCaption: 'Running uses every part.',
    words: [
      { term: 'Bones', meaning: 'Hard parts that hold you up.' },
      { term: 'Muscles', meaning: 'Parts that pull to move you.' },
      { term: 'Lungs', meaning: 'Parts that take in air.' },
    ],
    examples: [
      {
        title: 'Feel it',
        situation:
          'Put your hand on your chest after running. What do you feel?',
        steps: ['Your heart beats fast.', 'You breathe hard.'],
        answer: 'Your heart and lungs are working hard.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking muscles are only in your arms.',
        right: 'Muscles are all over your body.',
      },
    ],
    realLife: ['Every time you move.', 'Breathing.', 'Growing up strong.'],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a person.',
        'Draw the heart and lungs inside.',
        'Show a friend where your muscles are.',
      ],
    },
    safety: [
      'Be kind when talking about bodies.',
      'Ask a grown-up if you have questions.',
    ],
  },
  'pe-16': {
    indicator: {
      code: 'B2.4.1.4.2',
      text: 'Mention the components of physical fitness.',
    },
    hook: 'Being fit is more than running fast. There are five parts to fitness!',
    explain: [
      'Heart fitness lets you run and play for a long time.',
      'Strength lets you lift and push. Endurance lets your muscles keep going.',
      'Flexibility lets you bend and stretch. Body composition is what your body is made of.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 140, kit: 1 },
        { pose: 'pushUp', x: 330, kit: 2 },
        { pose: 'reach', x: 520, kit: 3 },
      ],
      label: 'Running, pushing and stretching',
    },
    artCaption: 'Different activities build different parts of fitness.',
    words: [
      { term: 'Strength', meaning: 'How strong your muscles are.' },
      { term: 'Endurance', meaning: 'Keeping going for a long time.' },
      { term: 'Flexibility', meaning: 'How far you can bend and stretch.' },
    ],
    examples: [
      {
        title: 'Match them',
        situation: 'Which part of fitness does touching your toes use?',
        steps: ['It needs bending and stretching.'],
        answer: 'Flexibility.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking fitness is only about running.',
        right: 'Fitness has five parts.',
      },
    ],
    realLife: ['Playing all day.', 'Carrying a bag.', 'Reaching a high shelf.'],
    tryIt: {
      need: 'A clear space',
      steps: [
        'Jog on the spot.',
        'Do two push-ups on your knees.',
        'Stretch to touch your toes. Name each part of fitness.',
      ],
    },
    safety: ['Warm up before you stretch.', 'Rest if you get tired.'],
  },
  'pe-17': {
    indicator: {
      code: 'B2.4.3.4.1',
      text: 'Explain why it is safer to stretch a warm muscle than a cold muscle.',
    },
    hook: 'Stretch a cold rubber band and it may snap. Muscles are a bit like that!',
    explain: [
      'Warm muscles are soft and stretchy.',
      'Cold muscles are stiff and can get hurt.',
      'So we warm up first, with jogging or marching, then we stretch.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 220, kit: 1 },
        { pose: 'reach', x: 440, kit: 1 },
      ],
      label: 'Warm up first, then stretch',
    },
    artCaption: 'Jog, then stretch.',
    words: [
      { term: 'Warm up', meaning: 'Gentle moving to get your body ready.' },
      { term: 'Stretch', meaning: 'Making your muscles long, gently.' },
      { term: 'Stiff', meaning: 'Hard to bend.' },
    ],
    examples: [
      {
        title: 'What first?',
        situation: 'You come out for PE. Should you stretch or warm up first?',
        steps: ['Cold muscles are stiff.', 'Warm them up first.'],
        answer: 'Warm up, then stretch.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stretching hard as soon as you arrive.',
        right: 'Jog or march for a few minutes first.',
      },
    ],
    realLife: [
      'Before sport.',
      'Before dancing.',
      'Getting up in the morning.',
    ],
    tryIt: {
      need: 'A clear space',
      steps: [
        'March on the spot for one minute.',
        'Jog gently for one minute.',
        'Now stretch your arms and legs slowly.',
      ],
    },
    safety: ['Stretch slowly and never bounce.', 'Stop if it hurts.'],
  },
  'pe-18': {
    indicator: {
      code: 'B2.4.5.4.1',
      text: 'Identify types of drugs, and how to stay safe.',
    },
    hook: 'Some things help us when we are sick. Some things can harm us. How do we stay safe?',
    explain: [
      'Medicine can help when we are sick, if a grown-up gives it to us.',
      'Some older children and adults use things that harm the body, like cigarettes and alcohol.',
      'Never take anything unless a parent, teacher or nurse gives it to you.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'stand', x: 220, kit: 2 },
        { pose: 'raise', x: 420, kit: 1, facing: -1 },
      ],
      label: 'Say no, and tell a grown-up',
    },
    artCaption: 'It is always fine to say no.',
    words: [
      { term: 'Medicine', meaning: 'Something that helps when you are sick.' },
      { term: 'Harmful', meaning: 'Something that can hurt you.' },
      {
        term: 'Trusted grown-up',
        meaning: 'A parent, teacher or nurse you can talk to.',
      },
    ],
    examples: [
      {
        title: 'Found some pills',
        situation: 'You find some pills on a table. What do you do?',
        steps: [
          'Do not touch or taste them.',
          'Tell a grown-up straight away.',
        ],
        answer: 'Leave them and tell a grown-up.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking pills are sweets.',
        right: 'Never eat anything unless a grown-up gives it to you.',
      },
    ],
    realLife: [
      'Staying safe at home.',
      'Taking medicine the right way.',
      'Helping friends stay safe.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Practise saying “No, thank you.”',
        'Name three grown-ups you trust.',
        'Draw yourself playing a healthy game.',
      ],
    },
    safety: [
      'Only take medicine from a trusted grown-up.',
      'Tell a grown-up if anything worries you.',
    ],
  },
  'pe-19': {
    indicator: {
      code: 'B2.5.2.5.1',
      text: 'Take part in different group settings (partners, small groups and large groups) without interfering with others.',
    },
    hook: 'Sometimes you play with one friend, sometimes with a few, sometimes with the whole class. How can everyone have fun?',
    explain: [
      'With a partner, take turns and share.',
      'In a small group, listen to each other.',
      'In a big group, stay in your space so others can play too.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 110, kit: 1, holds: 'ball' },
        { pose: 'catch', x: 250, kit: 1, facing: -1 },
        { pose: 'run', x: 400, kit: 2 },
        { pose: 'stand', x: 540, kit: 2, facing: -1 },
      ],
      label: 'Pairs and groups, sharing the space',
    },
    artCaption: 'Every group has its own space.',
    words: [
      { term: 'Partner', meaning: 'One friend you work with.' },
      { term: 'Group', meaning: 'A few people together.' },
      { term: 'Take turns', meaning: 'One person, then the next.' },
    ],
    examples: [
      {
        title: 'The ball rolls away',
        situation: 'Your ball rolls into another group’s game. What do you do?',
        steps: ['Wait for a safe moment.', 'Ask politely for it back.'],
        answer: 'Do not run through their game.',
      },
    ],
    mistakes: [
      {
        wrong: 'Taking the ball all the time.',
        right: 'Take turns so everyone plays.',
      },
    ],
    realLife: ['Playing at break.', 'Group work in class.', 'Games at home.'],
    tryIt: {
      need: 'A ball',
      steps: [
        'Pass to a partner five times.',
        'Join another pair and pass in a group.',
        'Play a class game.',
      ],
    },
    safety: ['Stay in your group’s space.', 'Stop when the teacher calls.'],
  },
  'pe-20': {
    indicator: {
      code: 'B2.5.4.5.1',
      text: 'Collect data and record progress toward mastery of a motor skill.',
    },
    hook: 'Are you getting better at catching? Writing down your scores can show you!',
    explain: [
      'Choose one skill, like catching or skipping.',
      'Count how many you do, and write it down each day.',
      'Look at your numbers to see how you are improving.',
    ],
    art: {
      kind: 'bars',
      rows: [
        ['Monday', 3],
        ['Wednesday', 5],
        ['Friday', 7],
      ],
      label: 'My catches each day',
    },
    artCaption: 'The bars grow as you get better.',
    words: [
      { term: 'Record', meaning: 'Write down.' },
      { term: 'Progress', meaning: 'Getting better.' },
      { term: 'Skill', meaning: 'Something you can do well with practice.' },
    ],
    examples: [
      {
        title: 'Read your record',
        situation: 'You caught 3 on Monday and 7 on Friday. How many more?',
        steps: ['7 − 3 = 4.'],
        answer: '4 more catches.',
      },
    ],
    mistakes: [
      {
        wrong: 'Forgetting to write your score down.',
        right: 'Write it down straight away.',
      },
    ],
    realLife: [
      'Seeing yourself improve.',
      'Charts at school.',
      'Sports teams keep scores.',
    ],
    tryIt: {
      need: 'Paper, a pencil and a ball',
      steps: [
        'Count your catches today.',
        'Write the number down.',
        'Try again on three more days and compare.',
      ],
    },
    safety: ['Use a soft ball.', 'Practise in a clear space.'],
  },
}
