import type { CourseGuides } from './types'

// Basic 4 Physical Education, written for this course and scoped to the NaCCA
// Physical Education Curriculum for Primary Schools (2019). Notes:
// - Codes are the curriculum's own. The imported lessons carry shifted ones.
//   Misprints are given as the sequence requires: B4.1.2.1.1sa0 is
//   B4.1.2.1.10, and the drug indicator printed B4.5.5.4.1 sits in strand 4,
//   so it is B4.4.5.4.1.
// - The tripod lesson has no Basic 4 indicator (the tripod is only in the
//   glossary). It is linked to B4.1.2.1.2, balance with control, and taught
//   only on a mat with a teacher.
// - The curriculum says push-ups strengthen the biceps and chin-ups the
//   triceps. It is the other way round, and the guide says so.
// - Its “v” push-up is a seated lift: legs straight in a V, palms pressing
//   the floor to lift the hips.
// - Body types are taught as the curriculum asks, never as labels for classmates.

export const guides: CourseGuides = {
  'pe-01': {
    indicator: {
      code: 'B4.1.1.1.1',
      text: 'Demonstrate the difference between slow and fast, heavy and light, hard and soft while moving.',
    },
    hook: 'Can you move like a tortoise, then like a cheetah? Like a feather, then like an elephant?',
    explain: [
      'Speed is how fast you move: slow or fast.',
      'Weight is how heavy or light your steps feel. Light steps are quiet. Heavy steps are loud.',
      'Force is how hard or soft you push. A hard stamp is strong. A soft tap is gentle.',
    ],
    art: {
      kind: 'people',
      ground: 'track',
      people: [
        { pose: 'walk', x: 200, kit: 1 },
        { pose: 'run', x: 430, kit: 2 },
      ],
      label: 'Slow and fast',
    },
    artCaption: 'The same body can move in many ways.',
    words: [
      { term: 'Speed', meaning: 'How fast you move.' },
      { term: 'Light', meaning: 'Quiet and gentle, like a feather.' },
      { term: 'Heavy', meaning: 'Strong and loud, like an elephant.' },
    ],
    examples: [
      {
        title: 'Animal moves',
        situation: 'Your teacher calls out animals. How do you move?',
        steps: [
          '“Tortoise”: walk slowly.',
          '“Cheetah”: run fast.',
          '“Cat”: tiptoe lightly.',
          '“Elephant”: stamp heavily.',
        ],
        answer: 'Each animal shows a different speed or weight.',
      },
    ],
    mistakes: [
      {
        wrong: 'Running fast every time.',
        right: 'Listen to the call and change your speed and weight.',
      },
    ],
    realLife: [
      'Walking quietly past a sleeping baby.',
      'Running to catch a bus.',
      'Dancing to slow and fast music.',
    ],
    tryIt: {
      need: 'A marked space and a drum or clapping',
      steps: [
        'Move slowly to slow beats.',
        'Move fast to fast beats.',
        'Make your steps light, then heavy.',
      ],
    },
    safety: [
      'Keep your own space so you do not bump into others.',
      'Run fast only in a clear, flat area.',
    ],
  },
  'pe-02': {
    indicator: {
      code: 'B4.1.1.1.2',
      text: 'Enter, jump and leave a long swinging rope turned by others.',
    },
    hook: 'Two friends turn a long rope. Can you run in, jump and run out without touching it?',
    explain: [
      'Stand near one turner and watch the rope go round.',
      'Run in just after the rope hits the ground and goes up.',
      'Jump on the balls of your feet, then run out the other side.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'stand', x: 120, kit: 1 },
        { pose: 'jumpUp', x: 320, kit: 2 },
        { pose: 'stand', x: 520, kit: 1, facing: -1 },
      ],
      label: 'Enter, jump, leave',
    },
    artCaption: 'Two turners and one jumper.',
    words: [
      { term: 'Turner', meaning: 'A person who swings the rope.' },
      { term: 'Rhythm', meaning: 'A steady beat.' },
      {
        term: 'Balls of the feet',
        meaning: 'The front part of your feet, behind the toes.',
      },
    ],
    examples: [
      {
        title: 'When to run in',
        situation: 'When is the best moment to run in?',
        steps: [
          'Watch the rope hit the ground.',
          'Run in as it rises away from you.',
        ],
        answer: 'Just after it passes the ground.',
      },
      {
        title: 'Counting',
        situation: 'How do you know when to jump?',
        steps: [
          'Say “jump” each time the rope touches the ground.',
          'Jump as you say it.',
        ],
        answer: 'Counting aloud helps you keep the rhythm.',
      },
    ],
    mistakes: [
      {
        wrong: 'Jumping very high.',
        right: 'Small, quick jumps on the balls of your feet are best.',
      },
    ],
    realLife: [
      'Playground skipping games.',
      'Boxers and footballers use ropes for fitness.',
      'Team games that need good timing.',
    ],
    tryIt: {
      need: 'A long rope and two turners',
      steps: [
        'Jump a still rope on the ground.',
        'Jump while the rope swings gently side to side.',
        'Run in, jump three times and run out.',
      ],
    },
    safety: [
      'Turners turn slowly at first.',
      'Jump on flat, soft ground, and wear shoes or go barefoot on grass.',
    ],
  },
  'pe-03': {
    indicator: {
      code: 'B4.1.2.1.2',
      text: 'Balance with control (the tripod balance).',
    },
    hook: 'In a tripod balance, your two hands and forehead make a triangle. Why is a triangle so steady?',
    explain: [
      'A tripod has three points of support, like a three-legged stool.',
      'Place your hands flat on the mat. Put the top of your forehead in front of them, so the three points make a triangle.',
      'Rest your bent knees on your elbows, one at a time. Hold still, then come down slowly.',
    ],
    art: { kind: 'shapes', names: ['triangle'] },
    artCaption: 'Two hands and your forehead make a triangle base.',
    words: [
      { term: 'Tripod', meaning: 'A balance with three points of support.' },
      {
        term: 'Base of support',
        meaning: 'The parts of your body touching the floor.',
      },
      { term: 'Inverted', meaning: 'Upside down, or partly upside down.' },
    ],
    examples: [
      {
        title: 'Why a triangle?',
        situation: 'Why is it easier to balance on three points than on two?',
        steps: [
          'Two points make a line, so you tip over sideways.',
          'Three points make a wide triangle.',
        ],
        answer: 'A wider base is steadier.',
      },
    ],
    mistakes: [
      {
        wrong: 'Putting your hands and head in a straight line.',
        right: 'Make a triangle, with your head in front of your hands.',
      },
      {
        wrong: 'Kicking up into a headstand.',
        right: 'Keep your knees on your elbows. Do not kick your legs up.',
      },
    ],
    realLife: [
      'Gymnastics and acrobatics.',
      'Yoga.',
      'Strong arms and good balance for all sports.',
    ],
    tryIt: {
      need: 'A thick mat and your teacher',
      steps: [
        'Kneel and make the triangle with your hands and forehead.',
        'Lift one knee onto an elbow, then the other.',
        'Hold for three seconds, then come down slowly.',
      ],
    },
    safety: [
      'Try this only on a thick mat, with your teacher beside you.',
      'Keep most of your weight on your hands, not your head.',
      'Come down at once if your neck hurts.',
    ],
  },
  'pe-04': {
    indicator: {
      code: 'B4.1.2.1.3',
      text: 'Strike a bounced ball with the hands and feet.',
    },
    hook: 'A ball bounces towards you. Can you hit it back with your hand, and then with your foot?',
    explain: [
      'Watch the ball as it bounces.',
      'Hit it as it comes up from the bounce.',
      'Use a flat hand for a hand strike, and the inside of your foot for a foot strike.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'forehand', x: 200, kit: 1 },
        { pose: 'kick', x: 440, kit: 3 },
      ],
      label: 'Strike with the hand, strike with the foot',
    },
    artCaption: 'Watch the ball all the way.',
    words: [
      { term: 'Strike', meaning: 'Hit.' },
      { term: 'Bounce', meaning: 'When a ball hits the ground and comes up.' },
      { term: 'Underhand', meaning: 'With the hand moving low and upwards.' },
    ],
    examples: [
      {
        title: 'Hand strike',
        situation:
          'Your partner bounces a ball to you. How do you hit it back?',
        steps: [
          'Stand side-on, knees bent.',
          'Swing your flat hand forward and up.',
          'Hit the ball after it bounces.',
        ],
        answer: 'A smooth swing sends it back to your partner.',
      },
    ],
    mistakes: [
      {
        wrong: 'Hitting the ball before it bounces up.',
        right: 'Wait for the bounce, then strike.',
      },
    ],
    realLife: [
      'Volleyball and handball.',
      'Football.',
      'Playground ball games.',
    ],
    tryIt: {
      need: 'A soft, light ball and a partner',
      steps: [
        'Your partner bounces the ball to you.',
        'Hit it back with your hand five times.',
        'Then strike it with your foot five times.',
      ],
    },
    safety: ['Use a soft, light ball.', 'Keep a clear space between pairs.'],
  },
  'pe-05': {
    indicator: {
      code: 'B4.1.2.1.5',
      text: 'Throw a flying disc for distance using the backhand movement pattern.',
    },
    hook: 'A flying disc can glide a long way. The secret is a backhand throw and a flat release.',
    explain: [
      'Hold the disc with your thumb on top and fingers underneath.',
      'Stand side-on. Swing the disc across your body, then swing it out towards the target.',
      'Let go with the disc flat, and flick your wrist.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'backhand', x: 300, kit: 2 }],
      label: 'Side-on, swing across, release flat',
    },
    artCaption: 'A flat disc flies furthest.',
    words: [
      {
        term: 'Flying disc',
        meaning: 'A plastic disc thrown for fun and sport.',
      },
      { term: 'Backhand', meaning: 'Throwing from across your body.' },
      { term: 'Release', meaning: 'The moment you let go.' },
    ],
    examples: [
      {
        title: 'Why flat?',
        situation: 'Your disc keeps curving into the ground. Why?',
        steps: ['It is tilted when you let go.'],
        answer: 'Release it flat, level with the ground.',
      },
    ],
    mistakes: [
      {
        wrong: 'Throwing the disc like a ball, overarm.',
        right: 'Use the backhand swing across your body.',
      },
    ],
    realLife: [
      'Ultimate frisbee.',
      'Beach games.',
      'Playing catch with friends.',
    ],
    tryIt: {
      need: 'A flying disc (or a paper plate) and cones',
      steps: [
        'Throw gently to a partner five metres away.',
        'Step back and throw further.',
        'Mark your longest throw with a cone.',
      ],
    },
    safety: [
      'Throw only when the area in front is clear.',
      'Call “disc” to warn others before you throw.',
    ],
  },
  'pe-06': {
    indicator: {
      code: 'B4.1.2.1.7',
      text: 'Catch a ball above the head and near the middle of the body while jogging and running.',
    },
    hook: 'Catching while standing still is easy. Can you catch while you are running?',
    explain: [
      'Keep your eyes on the ball the whole time.',
      'For a high ball, make a “W” with your thumbs together above your head.',
      'For a ball at your middle, make a basket with your little fingers together, and pull the ball in.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 170, kit: 1, holds: 'ball' },
        { pose: 'catch', x: 470, kit: 2, facing: -1 },
      ],
      label: 'Eyes on the ball, hands ready',
    },
    artCaption: 'Reach for the ball, then pull it in.',
    words: [
      { term: 'Catch', meaning: 'Take hold of a moving ball.' },
      { term: 'Jog', meaning: 'Run slowly and steadily.' },
      { term: 'Hand shape', meaning: 'How you hold your hands to catch.' },
    ],
    examples: [
      {
        title: 'High or middle?',
        situation:
          'The ball is coming above your head. Which hand shape do you use?',
        steps: ['Thumbs together, fingers up.'],
        answer: 'The “W” shape.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stopping to catch.',
        right: 'Keep jogging and reach for the ball.',
      },
    ],
    realLife: [
      'Netball and handball.',
      'Rounders.',
      'Catching a bag thrown to you.',
    ],
    tryIt: {
      need: 'A soft ball and a partner',
      steps: [
        'Catch standing still, high and low.',
        'Catch while walking.',
        'Catch while jogging.',
      ],
    },
    safety: [
      'Use a soft ball.',
      'Jog in a clear space and look where you are going.',
    ],
  },
  'pe-07': {
    indicator: {
      code: 'B4.1.2.1.9',
      text: 'Keep a hand-dribbled ball away from a defensive partner.',
    },
    hook: 'Your partner wants the ball. Can you keep bouncing it so they cannot take it?',
    explain: [
      'Bounce the ball with your fingertips, not your palm.',
      'Keep your body between the ball and your partner.',
      'Bounce it low and use the hand furthest from your partner.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'crouch', x: 220, kit: 1 },
        { pose: 'reach', x: 430, kit: 3, facing: -1 },
      ],
      balls: [[170, 290]],
      label: 'Body between the ball and the defender',
    },
    artCaption: 'Shield the ball with your body.',
    words: [
      { term: 'Dribble', meaning: 'Bounce the ball again and again.' },
      { term: 'Defender', meaning: 'A player trying to get the ball.' },
      { term: 'Fingertips', meaning: 'The ends of your fingers.' },
    ],
    examples: [
      {
        title: 'Which hand?',
        situation:
          'Your partner is on your right. Which hand should bounce the ball?',
        steps: ['Use the hand furthest from them.'],
        answer: 'Your left hand.',
      },
    ],
    mistakes: [
      {
        wrong: 'Slapping the ball with a flat palm.',
        right: 'Push it down with your fingertips.',
      },
    ],
    realLife: [
      'Basketball and handball.',
      'Netball footwork practice.',
      'Playground ball games.',
    ],
    tryIt: {
      need: 'A bouncy ball and a partner',
      steps: [
        'Dribble on the spot with each hand.',
        'Dribble while walking.',
        'Keep the ball from your partner for ten seconds.',
      ],
    },
    safety: [
      'Defenders try for the ball, never push.',
      'Play in a clear area away from walls.',
    ],
  },
  'pe-08': {
    indicator: {
      code: 'B4.1.2.1.10',
      text: 'Keep a foot-dribbled ball away from a defensive partner.',
    },
    hook: 'Footballers keep the ball close so defenders cannot steal it. How do they do it?',
    explain: [
      'Use small touches with the inside and outside of your foot.',
      'Keep the ball close, about one step away.',
      'Turn your body to keep it between the ball and your partner.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 220, kit: 0 },
        { pose: 'crouch', x: 470, kit: 3, facing: -1 },
      ],
      balls: [[275, 288]],
      label: 'Small touches, ball close',
    },
    artCaption: 'Keep the ball close to your feet.',
    words: [
      { term: 'Foot-dribble', meaning: 'Move the ball with small kicks.' },
      { term: 'Touch', meaning: 'One small tap of the ball.' },
      { term: 'Shield', meaning: 'Use your body to protect the ball.' },
    ],
    examples: [
      {
        title: 'Change feet',
        situation: 'Why practise with both feet?',
        steps: [
          'Defenders come from both sides.',
          'Using both feet lets you turn either way.',
        ],
        answer: 'You become harder to stop.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking the ball far ahead.',
        right: 'Use small touches so it stays close.',
      },
    ],
    realLife: ['Football.', 'Futsal.', 'Street games with friends.'],
    tryIt: {
      need: 'A football and a partner',
      steps: [
        'Dribble around cones with your right foot, then your left.',
        'Keep the ball from your partner for ten seconds.',
        'Swap roles.',
      ],
    },
    safety: [
      'Defenders go for the ball, never kick legs.',
      'Play on grass or flat ground without stones.',
    ],
  },
  'pe-09': {
    indicator: {
      code: 'B4.1.2.1.11',
      text: 'Perform a movement skill with one hand or one foot, and compare it with two hands and two feet.',
    },
    hook: 'Is it easier to catch with one hand or two? To jump off one foot or two? Let us test it!',
    explain: [
      'Some skills use one hand or foot, like dribbling a basketball or hopping.',
      'Some use two, like catching a big ball or jumping high.',
      'Two hands or feet usually give more control. One gives more reach or speed.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'throw', x: 200, kit: 1, holds: 'ball' },
        { pose: 'catch', x: 440, kit: 2, facing: -1 },
      ],
      label: 'One hand to throw, two hands to catch',
    },
    artCaption: 'Different skills need one hand or two.',
    words: [
      { term: 'One-handed', meaning: 'Using only one hand.' },
      { term: 'Two-handed', meaning: 'Using both hands.' },
      { term: 'Compare', meaning: 'Find what is the same and different.' },
    ],
    examples: [
      {
        title: 'Catching test',
        situation:
          'Catch ten balls with one hand, then ten with two. Which is better?',
        steps: ['Count the catches each way.'],
        answer:
          'Most people catch more with two hands, because they have more control.',
      },
    ],
    mistakes: [
      {
        wrong: 'Using only your stronger hand or foot.',
        right: 'Practise with both sides so each gets better.',
      },
    ],
    realLife: [
      'Carrying a full bucket with two hands.',
      'Hopping games.',
      'Choosing the right way to catch in games.',
    ],
    tryIt: {
      need: 'A ball',
      steps: [
        'Bounce the ball with one hand, then with two.',
        'Hop on one foot, then jump on two.',
        'Tell a friend which felt more controlled.',
      ],
    },
    safety: ['Hop on soft, flat ground.', 'Keep space between you and others.'],
  },
  'pe-10': {
    indicator: {
      code: 'B4.2.1.2.1',
      text: 'Distinguish between self-space and open space.',
    },
    hook: 'If everyone runs in the same corner, people bump. Space keeps games safe and fun.',
    explain: [
      'Self-space is the space around you that you can reach while standing still.',
      'Open space, or general space, is the rest of the playing area that everyone shares.',
      'In games, look for open space to move into, and respect other people’s self-space.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'reach', x: 120, kit: 1 },
        { pose: 'reach', x: 320, kit: 2 },
        { pose: 'reach', x: 520, kit: 3 },
      ],
      label: 'Arms out: your self-space',
    },
    artCaption: 'Everyone has room to move.',
    words: [
      {
        term: 'Self-space',
        meaning: 'The space you can reach without moving your feet.',
      },
      { term: 'Open space', meaning: 'Shared space with no one in it.' },
      { term: 'Spread out', meaning: 'Move apart from each other.' },
    ],
    examples: [
      {
        title: 'Find your space',
        situation: 'How do you check you have enough self-space?',
        steps: [
          'Stretch your arms out and turn around.',
          'If you touch no one, you have enough.',
        ],
        answer: 'Arms out and turn.',
      },
      {
        title: 'In a game',
        situation: 'Your teammate has the ball. Where should you go?',
        steps: ['Move into open space, away from defenders.'],
        answer: 'Somewhere they can pass to you.',
      },
    ],
    mistakes: [
      {
        wrong: 'Everyone chasing the ball in a crowd.',
        right: 'Spread out into open space.',
      },
    ],
    realLife: [
      'Team games.',
      'Walking in a busy market.',
      'Lining up at school.',
    ],
    tryIt: {
      need: 'A marked area',
      steps: [
        'Find your self-space and stretch.',
        'Walk around the open space without touching anyone.',
        'Freeze when the whistle blows and check your space.',
      ],
    },
    safety: ['Look up while moving.', 'Stop quickly when you hear the signal.'],
  },
  'pe-11': {
    indicator: {
      code: 'B4.2.3.2.1',
      text: 'Identify the parts of the body that are used for kicking a ball.',
    },
    hook: 'A good kick uses more than your foot. Which other body parts help?',
    explain: [
      'Your foot strikes the ball: the inside for passing, the laces for power.',
      'Your kicking leg swings from the hip, and the knee straightens as you kick.',
      'Your standing foot points to the target, and your arms help you balance.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'kick', x: 300, kit: 2 }],
      balls: [[390, 260]],
      label: 'Hip, knee, foot and arms all help',
    },
    artCaption: 'The whole body works in a kick.',
    words: [
      { term: 'Instep', meaning: 'The top of your foot, where the laces are.' },
      { term: 'Standing foot', meaning: 'The foot you are not kicking with.' },
      { term: 'Swing', meaning: 'Moving the leg back and through.' },
    ],
    examples: [
      {
        title: 'Pass or shoot?',
        situation: 'Which part of the foot do you use for a short pass?',
        steps: ['The inside of the foot is wide and flat.'],
        answer: 'The inside of the foot, for control.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking with your toes.',
        right: 'Use the inside of your foot or your laces.',
      },
    ],
    realLife: ['Football.', 'Rugby.', 'Kicking games in the playground.'],
    tryIt: {
      need: 'A football and a wall',
      steps: [
        'Pass against the wall with the inside of your foot.',
        'Kick with your laces.',
        'Name the body parts you used.',
      ],
    },
    safety: [
      'Use a proper football, not a stone or heavy ball.',
      'Check nobody is near the wall.',
    ],
  },
  'pe-12': {
    indicator: {
      code: 'B4.2.5.2.1',
      text: 'Identify the difference between dribbling a ball with the hand and with the foot, moving forward and changing direction.',
    },
    hook: 'Basketball players dribble with their hands. Footballers dribble with their feet. What is the same, and what is different?',
    explain: [
      'With the hand, you bounce the ball down and it comes back up.',
      'With the foot, you push the ball along the ground with small touches.',
      'In both, keep the ball close and look up. To change direction, slow down first.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'crouch', x: 200, kit: 1 },
        { pose: 'run', x: 430, kit: 2 },
      ],
      balls: [
        [150, 290],
        [485, 288],
      ],
      label: 'Hand dribble and foot dribble',
    },
    artCaption: 'Same idea, different body part.',
    words: [
      { term: 'Hand dribble', meaning: 'Bouncing the ball as you move.' },
      {
        term: 'Foot dribble',
        meaning: 'Pushing the ball along with your feet.',
      },
      { term: 'Change direction', meaning: 'Turn to go another way.' },
    ],
    examples: [
      {
        title: 'Same or different?',
        situation: 'Name one thing that is the same and one that is different.',
        steps: [
          'Same: keep the ball close and look up.',
          'Different: bounce with the hand, roll with the foot.',
        ],
        answer: 'Control is the same idea; the action is different.',
      },
    ],
    mistakes: [
      {
        wrong: 'Looking down at the ball all the time.',
        right: 'Glance at the ball, then look up.',
      },
    ],
    realLife: [
      'Basketball and handball.',
      'Football.',
      'Choosing the right skill in a game.',
    ],
    tryIt: {
      need: 'A bouncy ball, a football and cones',
      steps: [
        'Dribble by hand around the cones.',
        'Dribble by foot around the cones.',
        'Tell a partner which was harder when turning.',
      ],
    },
    safety: [
      'Keep a clear path between cones.',
      'Do not run into others while looking at the ball.',
    ],
  },
  'pe-13': {
    indicator: {
      code: 'B4.3.2.3.1',
      text: 'Perform a continuous “v” push-up.',
    },
    hook: 'Can you lift your whole body off the floor using only your arms? Let us try the “v” push-up!',
    explain: [
      'Sit on the floor with your legs straight and open in a “v” shape.',
      'Put your palms flat on the floor beside your hips.',
      'Press down through your hands to lift your hips, then lower slowly.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'seatLift', x: 300, kit: 2 }],
      label: 'Legs in a “v”, palms down, press up',
    },
    artCaption: 'Your arms lift your body.',
    words: [
      { term: 'Press', meaning: 'Push down hard.' },
      { term: 'Continuous', meaning: 'Again and again without stopping.' },
      { term: 'Arm strength', meaning: 'How strong your arm muscles are.' },
    ],
    examples: [
      {
        title: 'Counting',
        situation: 'How many can you do in a row?',
        steps: [
          'Lift and lower slowly.',
          'Count each lift.',
          'Stop before your arms are too tired to control the movement.',
        ],
        answer: 'Write your number and try to beat it next week.',
      },
    ],
    mistakes: [
      {
        wrong: 'Dropping down with a bump.',
        right: 'Lower your hips slowly and gently.',
      },
    ],
    realLife: [
      'Climbing out of a swimming pool.',
      'Pushing yourself up from the floor.',
      'Gymnastics.',
    ],
    tryIt: {
      need: 'A mat',
      steps: [
        'Sit in the “v” with palms flat.',
        'Lift your hips and hold for two seconds.',
        'Do as many as you can with good control.',
      ],
    },
    safety: [
      'Use a mat or smooth floor.',
      'Keep your fingers pointing forward, and stop if your wrists hurt.',
    ],
  },
  'pe-14': {
    indicator: {
      code: 'B4.3.3.3.1',
      text: 'Perform two sets of eight continuous “v” push-ups.',
    },
    hook: 'A set is a group of repeats. Can you do two sets of eight, with a rest in between?',
    explain: [
      'A repetition is one lift and lower. A set is a group of repetitions.',
      'Do eight “v” push-ups in a row, then rest.',
      'Resting lets your muscles recover, so the second set is as good as the first.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'seatLift', x: 220, kit: 1 },
        { pose: 'drink', x: 450, kit: 1 },
      ],
      label: 'One set, a rest, then another',
    },
    artCaption: 'Rest and drink water between sets.',
    words: [
      { term: 'Repetition', meaning: 'One complete movement.' },
      { term: 'Set', meaning: 'A group of repetitions.' },
      { term: 'Recover', meaning: 'Get your strength back.' },
    ],
    examples: [
      {
        title: 'Count them',
        situation: 'How many push-ups are in two sets of eight?',
        steps: ['8 + 8 = 16.'],
        answer: '16 push-ups.',
      },
    ],
    mistakes: [
      {
        wrong: 'Rushing the second set without resting.',
        right: 'Rest for a few minutes between sets.',
      },
    ],
    realLife: [
      'Training for sport.',
      'Building strength safely.',
      'Planning exercise.',
    ],
    tryIt: {
      need: 'A mat and a partner to count',
      steps: [
        'Do eight “v” push-ups.',
        'Rest and drink some water.',
        'Do eight more.',
      ],
    },
    safety: ['Rest between sets.', 'Stop if your wrists or arms hurt.'],
  },
  'pe-15': {
    indicator: {
      code: 'B4.3.5.3.2',
      text: 'Identify body types: endomorph, mesomorph and ectomorph.',
    },
    hook: 'People come in all shapes and sizes. Scientists use three words to describe body types.',
    explain: [
      'An ectomorph is slim and long.',
      'A mesomorph builds muscle easily.',
      'An endomorph is broader and rounder. Most people are a mix, and every body can be active and skilful.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'stand', x: 170, kit: 1, build: 0.85 },
        { pose: 'stand', x: 320, kit: 2, build: 1.05 },
        { pose: 'stand', x: 470, kit: 3, build: 1.25 },
      ],
      label: 'Different builds, all ready to play',
    },
    artCaption: 'Every build can be active and skilled.',
    words: [
      { term: 'Ectomorph', meaning: 'A slim, long body type.' },
      { term: 'Mesomorph', meaning: 'A body type that builds muscle easily.' },
      { term: 'Endomorph', meaning: 'A broader, rounder body type.' },
    ],
    examples: [
      {
        title: 'Everyone plays',
        situation: 'Does your body type decide which sport you can play?',
        steps: [
          'Different builds can help in different ways.',
          'Practice and enjoyment matter much more.',
        ],
        answer: 'No. Anyone can learn any sport.',
      },
    ],
    mistakes: [
      {
        wrong: 'Calling classmates names because of their body.',
        right: 'Respect every body. Use these words only to learn.',
      },
    ],
    realLife: [
      'Understanding athletes.',
      'Choosing activities you enjoy.',
      'Respecting others.',
    ],
    tryIt: {
      need: 'Pictures of athletes from different sports',
      steps: [
        'Look at the athletes.',
        'Talk about how each sport uses the body.',
        'Draw yourself doing an activity you enjoy.',
      ],
    },
    safety: [
      'Talk kindly about bodies. Never point at or label a classmate.',
      'Ask your teacher if you feel unhappy about your body.',
    ],
  },
  'pe-16': {
    indicator: {
      code: 'B4.4.1.4.2',
      text: 'Discuss how prolonged physical activity increases endurance, allowing movement for longer.',
    },
    hook: 'The first time you jog, you may tire quickly. After weeks of practice you can go much longer. Why?',
    explain: [
      'Endurance is being able to keep moving for a long time.',
      'Activities like jogging, brisk walking and skipping make your heart and lungs stronger.',
      'A stronger heart sends more oxygen to your muscles, so you tire less quickly.',
    ],
    art: {
      kind: 'people',
      ground: 'track',
      people: [
        { pose: 'run', x: 220, kit: 1 },
        { pose: 'run', x: 420, kit: 3 },
      ],
      label: 'A steady pace you can keep up',
    },
    artCaption: 'Regular activity trains your heart.',
    words: [
      { term: 'Endurance', meaning: 'Keeping going for a long time.' },
      { term: 'Oxygen', meaning: 'The part of the air your body needs.' },
      { term: 'Prolonged', meaning: 'Lasting a long time.' },
    ],
    examples: [
      {
        title: 'Week by week',
        situation:
          'Ama jogs for 5 minutes this week. What could she do next week?',
        steps: ['Add a little each week.', '5 + 2 = 7.'],
        answer: 'Jog for 7 minutes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Running as fast as you can to build endurance.',
        right: 'Go at a steady pace you can keep up.',
      },
    ],
    realLife: [
      'Walking to school.',
      'Playing a whole football match.',
      'Carrying water home.',
    ],
    tryIt: {
      need: 'A track or field and a watch',
      steps: [
        'Jog or walk briskly for as long as you can at a steady pace.',
        'Write down your time.',
        'Try again next week and compare.',
      ],
    },
    safety: [
      'Start slowly and build up.',
      'Drink water and rest in the shade if you feel dizzy.',
    ],
  },
  'pe-17': {
    indicator: {
      code: 'B4.4.3.4.1',
      text: 'Identify muscles being strengthened during particular physical activities.',
    },
    hook: 'Push-ups, chin-ups and step-ups each work different muscles. Which ones?',
    explain: [
      'Push-ups strengthen the triceps (the back of your upper arm) and the chest.',
      'Chin-ups strengthen the biceps (the front of your upper arm) and the back.',
      'Step-ups strengthen the thigh muscles: the quadriceps at the front and the hamstrings at the back.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'pushUp', x: 220, kit: 1 },
        { pose: 'pushDown', x: 450, kit: 1 },
      ],
      label: 'Push-ups work the triceps and chest',
    },
    artCaption: 'Pushing up straightens the arms using the triceps.',
    words: [
      { term: 'Biceps', meaning: 'Muscles at the front of the upper arm.' },
      { term: 'Triceps', meaning: 'Muscles at the back of the upper arm.' },
      { term: 'Quadriceps', meaning: 'Muscles at the front of the thigh.' },
    ],
    examples: [
      {
        title: 'Feel it',
        situation:
          'Bend and straighten your arm. Which muscle tightens when you straighten it?',
        steps: ['Touch the back of your upper arm as you straighten.'],
        answer: 'The triceps.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking push-ups mainly work the biceps.',
        right: 'Push-ups mainly work the triceps and chest.',
      },
    ],
    realLife: [
      'Lifting and carrying.',
      'Climbing stairs.',
      'Pushing a wheelbarrow.',
    ],
    tryIt: {
      need: 'A mat and a low step',
      steps: [
        'Do five push-ups on your knees.',
        'Do ten step-ups.',
        'Point to the muscles that worked.',
      ],
    },
    safety: [
      'Use a low, steady step.',
      'Do push-ups on your knees if full ones are too hard.',
    ],
  },
  'pe-18': {
    indicator: {
      code: 'B4.4.5.4.1',
      text: 'Identify the effects of drug use on physical activity.',
    },
    hook: 'Healthy bodies play, run and learn best. Some substances can harm the body. Let us learn how to stay safe.',
    explain: [
      'Medicines help us when a health worker or parent gives them correctly.',
      'Other drugs, alcohol and cigarettes can harm the body and the mind.',
      'They can cause poor sleep, poor appetite, a racing heart and feeling scared or unwell, and make sport and school harder.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'stand', x: 220, kit: 2 },
        { pose: 'raise', x: 420, kit: 1, facing: -1 },
      ],
      label: 'Say no, and tell a trusted adult',
    },
    artCaption: 'It is always fine to say no.',
    words: [
      {
        term: 'Medicine',
        meaning: 'A drug that helps you get better, used as directed.',
      },
      { term: 'Harmful', meaning: 'Something that can hurt you.' },
      {
        term: 'Trusted adult',
        meaning: 'A parent, teacher or nurse you can talk to.',
      },
    ],
    examples: [
      {
        title: 'A safe choice',
        situation: 'Someone offers you a pill or a cigarette. What do you do?',
        steps: [
          'Say “No, thank you” clearly.',
          'Walk away.',
          'Tell a trusted adult.',
        ],
        answer: 'Say no, go, and tell.',
      },
    ],
    mistakes: [
      {
        wrong: 'Taking medicine you find at home.',
        right: 'Only take medicine a parent or health worker gives you.',
      },
    ],
    realLife: [
      'Staying healthy for sport.',
      'Taking medicine correctly.',
      'Helping friends stay safe.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Practise saying “No, thank you” firmly.',
        'Name three trusted adults.',
        'List three healthy ways to feel good, such as playing.',
      ],
    },
    safety: [
      'Never take medicine that was not given to you by a parent or health worker.',
      'If you are worried, tell a trusted adult.',
    ],
  },
  'pe-19': {
    indicator: {
      code: 'B4.5.2.5.2',
      text: 'Participate in a variety of group settings (partners, small groups and large groups) without interfering with others.',
    },
    hook: 'Sometimes you work with one partner, sometimes with a small group, sometimes with the whole class. How do you help each group work well?',
    explain: [
      'In pairs, take turns and share the equipment.',
      'In small groups, listen and give everyone a job.',
      'In large groups, keep to your space and follow the signals so others can play too.',
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
      label: 'Pairs and groups, each in their own space',
    },
    artCaption: 'Groups share the field without getting in each other’s way.',
    words: [
      { term: 'Partner', meaning: 'One person you work with.' },
      { term: 'Group', meaning: 'Several people working together.' },
      { term: 'Interfere', meaning: 'Get in the way of others.' },
    ],
    examples: [
      {
        title: 'Stray ball',
        situation: 'Your ball rolls into another group’s game. What do you do?',
        steps: [
          'Wait until it is safe.',
          'Ask politely, or wait for them to send it back.',
        ],
        answer: 'Do not run through their game.',
      },
    ],
    mistakes: [
      {
        wrong: 'Running through other groups’ spaces.',
        right: 'Go around, or wait.',
      },
    ],
    realLife: ['Group work in class.', 'Sports teams.', 'Family tasks.'],
    tryIt: {
      need: 'Balls and a marked area for each group',
      steps: [
        'Pass with a partner.',
        'Join another pair and pass in a group of four.',
        'Play a whole-class game, keeping to the rules.',
      ],
    },
    safety: [
      'Keep to your group’s area.',
      'Stop and look when the signal is given.',
    ],
  },
  'pe-20': {
    indicator: {
      code: 'B4.5.4.5.1',
      text: 'Distinguish between acts of physical courage and physically reckless acts, and explain the key features of each.',
    },
    hook: 'Trying something new takes courage. Doing something dangerous just to show off is reckless. Can you tell the difference?',
    explain: [
      'Physical courage means trying something hard while taking care and following the rules.',
      'A reckless act ignores safety and the rules, and can hurt you or others.',
      'Brave players think before they act. Reckless players do not.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'catch', x: 200, kit: 1, mark: 'good' },
        { pose: 'leap', x: 440, kit: 3, mark: 'bad' },
      ],
      label: 'Brave and careful, not reckless',
    },
    artCaption: 'Courage follows the rules. Recklessness ignores them.',
    words: [
      { term: 'Courage', meaning: 'Doing something hard, with care.' },
      { term: 'Reckless', meaning: 'Careless about danger.' },
      { term: 'Rules', meaning: 'What keeps a game fair and safe.' },
    ],
    examples: [
      {
        title: 'Courage or reckless?',
        situation:
          'A goalkeeper dives for the ball on soft grass, arms out. Courage or reckless?',
        steps: ['The goalkeeper follows the rules and uses safe technique.'],
        answer: 'Courage.',
      },
      {
        title: 'Another',
        situation: 'A player jumps off a high wall to impress friends.',
        steps: ['There is no safe landing, and no reason but showing off.'],
        answer: 'Reckless.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking that the riskiest act is the bravest.',
        right: 'Real courage includes taking care.',
      },
    ],
    realLife: ['Sport.', 'Standing up for a friend.', 'Crossing roads safely.'],
    tryIt: {
      need: 'Paper and a small group',
      steps: [
        'List three brave acts in sport.',
        'List three reckless acts.',
        'Explain what makes each one brave or reckless.',
      ],
    },
    safety: [
      'Never copy dangerous stunts you see online.',
      'Ask your teacher before trying a new skill.',
    ],
  },
}
