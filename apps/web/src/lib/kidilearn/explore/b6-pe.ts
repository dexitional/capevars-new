import type { CourseGuides } from './types'

// Basic 6 Physical Education, written for this course and scoped to the NaCCA
// Physical Education Curriculum for Primary Schools (2019). Notes:
// - Codes are the curriculum's own. The imported lessons carry malformed
//   ones (such as B61.5.1.6). Lesson 18 was imported with its title cut to
//   "With"; the database record was corrected (see docs/kidilearn-explore.md).
// - The curriculum lists the effects of drug addiction as "madness,
//   uneasiness, death". The guide explains harm to the body and mind without
//   labels, and says that people with an addiction need help, not mockery.
// - Sit-ups are taught with bent knees and without pulling on the neck.

export const guides: CourseGuides = {
  'pe-01': {
    indicator: {
      code: 'B6.1.2.1.12',
      text: 'Develop a cooperative movement game that uses locomotor skills, object manipulation and an attacking strategy, and teach it to others.',
    },
    hook: 'The best games were once made up by children like you. Can your group invent one, and teach it to another group?',
    explain: [
      'A good game mixes moving skills, such as running and dodging, with ball skills, such as passing and catching.',
      'It needs a clear aim, simple rules and a fair way to score.',
      'An attacking strategy is a plan for scoring, such as passing quickly into open space.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 170, kit: 0, holds: 'ball' },
        { pose: 'run', x: 330, kit: 0 },
        { pose: 'catch', x: 480, kit: 3, facing: -1 },
      ],
      cones: [90, 560],
      label: 'Pass, move into space, score',
    },
    artCaption: 'Teammates move into space to receive the pass.',
    words: [
      {
        term: 'Cooperative game',
        meaning: 'A game where players work together towards a goal.',
      },
      { term: 'Strategy', meaning: 'A plan for winning or scoring.' },
      { term: 'Rules', meaning: 'What players may and may not do.' },
    ],
    examples: [
      {
        title: 'Cone ball',
        situation: 'Your group invents “cone ball”. How might it work?',
        steps: [
          'Two teams of five. Score by passing the ball to a teammate standing in a hoop by the cone.',
          'No running with the ball: pass within three steps.',
          'Defenders may block passes but never touch players.',
        ],
        answer: 'A simple, safe game with a clear aim and a scoring plan.',
      },
      {
        title: 'Teach it',
        situation: 'How do you teach your game to another group?',
        steps: [
          'Explain the aim in one sentence.',
          'Show one rule at a time.',
          'Play a short practice round, then answer questions.',
        ],
        answer: 'Short, clear steps help others learn quickly.',
      },
    ],
    mistakes: [
      {
        wrong: 'Making so many rules that nobody remembers them.',
        right: 'Keep three or four rules, and add more only if needed.',
      },
    ],
    realLife: [
      'Every sport began as an invented game.',
      'Playing with younger children at home.',
      'Leading activities at youth camps.',
    ],
    tryIt: {
      need: 'A ball, four cones and a group of friends',
      steps: [
        'Agree on an aim and three rules.',
        'Play for five minutes and change any rule that does not work.',
        'Teach the game to another group.',
      ],
    },
    safety: [
      'Choose rules with no pushing, tripping or hard tackles.',
      'Play on flat ground, well away from walls and gutters.',
    ],
  },
  'pe-02': {
    indicator: {
      code: 'B6.1.1.1.1',
      text: 'Jump for distance, landing on both feet and bending the hips, knees and ankles to reduce the impact force.',
    },
    hook: 'In the long jump, the run-up gives you speed, but a soft landing keeps you safe. How do you do both?',
    explain: [
      'A long jump has four parts: the run-up, the take-off, the flight and the landing.',
      'Take off from one strong foot, and swing your arms forward and up.',
      'Land on both feet, bending your hips, knees and ankles. Bending spreads the force of landing, like a cushion.',
    ],
    art: {
      kind: 'people',
      ground: 'track',
      people: [
        { pose: 'run', x: 150, kit: 2 },
        { pose: 'leap', x: 330, kit: 2 },
        { pose: 'land', x: 500, kit: 2 },
      ],
      label: 'Run, take off, fly, land softly',
    },
    artCaption: 'Bent knees on landing protect your joints.',
    words: [
      { term: 'Run-up', meaning: 'The run before the jump.' },
      { term: 'Take-off', meaning: 'The moment you leave the ground.' },
      {
        term: 'Impact force',
        meaning: 'The push of the ground on your body when you land.',
      },
    ],
    examples: [
      {
        title: 'Find your take-off foot',
        situation: 'Which foot should you take off from?',
        steps: [
          'Hop on each foot five times.',
          'The foot that feels stronger and steadier is usually your take-off foot.',
        ],
        answer: 'Use your stronger foot.',
      },
      {
        title: 'Why bend on landing?',
        situation: 'Why is landing with straight legs a bad idea?',
        steps: [
          'Straight legs stop you suddenly.',
          'All the force goes into your knees and back at once.',
        ],
        answer:
          'Bending makes the stop slower and softer, so less force hits your joints.',
      },
    ],
    mistakes: [
      {
        wrong: 'Slowing down just before the take-off board.',
        right: 'Keep your speed steady all the way to take-off.',
      },
      {
        wrong: 'Landing on straight legs.',
        right: 'Land on both feet with hips, knees and ankles bent.',
      },
    ],
    realLife: [
      'Jumping over a gutter safely.',
      'Athletics competitions.',
      'Landing from any jump in games.',
    ],
    tryIt: {
      need: 'A sandpit or soft grass, and a tape measure',
      steps: [
        'Practise a short run-up of six steps.',
        'Jump and land on both feet, knees bent.',
        'Measure three jumps and try to improve the best one.',
      ],
    },
    safety: [
      'Jump only into a raked sandpit or onto soft grass, never onto hard ground.',
      'Wait until the landing area is clear before you run.',
    ],
  },
  'pe-03': {
    indicator: {
      code: 'B6.1.2.1.1',
      text: 'Roll a ball using a stick in a game situation (hockey).',
    },
    hook: 'In hockey, you never touch the ball with your hands or feet. How do you control it with just a stick?',
    explain: [
      'Hold the stick with your left hand at the top and your right hand lower down.',
      'Use only the flat side of the stick to push or roll the ball.',
      'Keep the ball close in front of you, and look up to see your teammates.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'hockey', x: 290, kit: 3, holds: 'stick' }],
      balls: [[440, 288]],
      label: 'Left hand on top, flat side to the ball',
    },
    artCaption: 'Bend your knees and keep the ball close.',
    words: [
      { term: 'Grip', meaning: 'How you hold the stick.' },
      {
        term: 'Push pass',
        meaning: 'Sending the ball by pushing it along the ground.',
      },
      {
        term: 'Flat side',
        meaning: 'The only side of a hockey stick you may play with.',
      },
    ],
    examples: [
      {
        title: 'Rolling the ball',
        situation: 'How do you move the ball forward while walking?',
        steps: [
          'Bend your knees slightly.',
          'Tap the ball gently with the flat side, a little at a time.',
          'Keep it about one stick-length in front.',
        ],
        answer: 'Small, gentle taps keep control.',
      },
      {
        title: 'In a mini game',
        situation: 'A defender comes towards you. What do you do?',
        steps: [
          'Look up and find a free teammate.',
          'Push the ball along the ground to them.',
        ],
        answer: 'Pass early rather than losing the ball.',
      },
    ],
    mistakes: [
      {
        wrong: 'Swinging the stick above your waist.',
        right: 'Keep the stick low, below your waist, at all times.',
      },
    ],
    realLife: [
      'Hockey matches at school and in clubs.',
      'Ghana’s national hockey teams.',
      'Any game that needs hand–eye control.',
    ],
    tryIt: {
      need: 'A hockey stick (or a bent stick), a ball and cones',
      steps: [
        'Roll the ball slowly around four cones.',
        'Push-pass to a partner five metres away.',
        'Play a two-against-two mini game.',
      ],
    },
    safety: [
      'Keep the stick below your waist, so it cannot hit anyone.',
      'Leave at least two stick-lengths between players when practising.',
    ],
  },
  'pe-04': {
    indicator: {
      code: 'B6.1.2.1.3',
      text: 'Change direction quickly to keep your balance while running with an object through obstacles.',
    },
    hook: 'A good dodger changes direction so fast the defender is left behind. How do you turn quickly without falling?',
    explain: [
      'To turn sharply, lower your body by bending your knees.',
      'Plant your outside foot firmly and push off in the new direction.',
      'Keep the object close and your eyes up.',
    ],
    art: {
      kind: 'course',
      path: 'zigzag',
      ball: true,
      label: 'Zigzag through the cones',
    },
    artCaption: 'Low body, sharp push, eyes up.',
    words: [
      { term: 'Agility', meaning: 'Moving and changing direction quickly.' },
      { term: 'Plant', meaning: 'Put your foot down firmly.' },
      { term: 'Centre of gravity', meaning: 'The balance point of your body.' },
    ],
    examples: [
      {
        title: 'At each cone',
        situation: 'You reach a cone at speed. How do you turn?',
        steps: [
          'Shorten your steps just before the cone.',
          'Bend your knees and plant your outside foot.',
          'Push off sideways and speed up again.',
        ],
        answer: 'Slow a little, then turn and accelerate.',
      },
      {
        title: 'Why bend?',
        situation: 'Why do bent knees help you turn?',
        steps: [
          'They lower your balance point.',
          'A lower body is harder to knock over.',
        ],
        answer: 'You stay steady while changing direction.',
      },
    ],
    mistakes: [
      {
        wrong: 'Turning with straight legs at full speed.',
        right: 'Bend your knees and shorten your steps before turning.',
      },
    ],
    realLife: [
      'Dodging in football and netball.',
      'Playing chase games.',
      'Avoiding obstacles on a busy path.',
    ],
    tryIt: {
      need: 'Five cones and a ball or bean bag',
      steps: [
        'Walk the zigzag carrying the object.',
        'Jog it, stopping at each cone.',
        'Run it, and time yourself.',
      ],
    },
    safety: [
      'Space the cones well apart on flat, dry ground.',
      'Wear shoes with grip, or go barefoot on soft grass.',
    ],
  },
  'pe-05': {
    indicator: {
      code: 'B6.1.2.1.5',
      text: 'Strike a gently tossed ball with a bat, using forehand and backhand movement patterns.',
    },
    hook: 'Table tennis players hit forehands and backhands in a split second. What makes each stroke work?',
    explain: [
      'For a forehand, the bat swings on your bat-hand side, palm facing forward.',
      'For a backhand, the bat swings across your body, back of the hand forward.',
      'In both, stand with knees bent, lean slightly forward and keep your eyes on the ball.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'forehand', x: 200, kit: 1, holds: 'racket' },
        { pose: 'backhand', x: 440, kit: 3, holds: 'racket', facing: -1 },
      ],
      label: 'Forehand and backhand',
    },
    artCaption: 'Same ready stance, different swing.',
    words: [
      { term: 'Forehand', meaning: 'A stroke on your bat-hand side.' },
      { term: 'Backhand', meaning: 'A stroke across your body.' },
      {
        term: 'Ready position',
        meaning: 'Knees bent, leaning forward, bat in front.',
      },
    ],
    examples: [
      {
        title: 'Choosing the stroke',
        situation:
          'You are right-handed. The ball comes to your left side. Which stroke do you use?',
        steps: ['Your left is across your body.'],
        answer: 'A backhand.',
      },
      {
        title: 'Controlled practice',
        situation: 'Your partner tosses the ball gently. How do you practise?',
        steps: [
          'Start in the ready position.',
          'Swing smoothly forward and follow through towards the target.',
          'Do ten forehands, then ten backhands.',
        ],
        answer: 'Smooth swings first, power later.',
      },
    ],
    mistakes: [
      {
        wrong: 'Standing straight up with stiff legs.',
        right: 'Bend your knees so you can move quickly.',
      },
    ],
    realLife: [
      'Table tennis.',
      'Tennis and badminton.',
      'Any sport with a bat or racket.',
    ],
    tryIt: {
      need: 'A bat, a table tennis ball and a partner',
      steps: [
        'Your partner tosses the ball to your forehand side ten times.',
        'Then to your backhand side ten times.',
        'Count how many land on the target.',
      ],
    },
    safety: [
      'Keep a bat’s length clear around you before swinging.',
      'Hold the bat firmly so it cannot fly out of your hand.',
    ],
  },
  'pe-06': {
    indicator: {
      code: 'B6.1.2.1.7',
      text: 'Show how to adjust body position to catch a ball thrown off-centre.',
    },
    hook: 'Not every throw comes straight to your chest. How do you catch a ball that is high, low or to the side?',
    explain: [
      'Watch the ball from the moment it leaves the thrower’s hand.',
      'Move your feet to get your body behind the ball whenever you can.',
      'Reach with soft hands and pull the ball in towards your body.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'throw', x: 170, kit: 2, holds: 'ball' },
        { pose: 'catch', x: 470, kit: 1, facing: -1 },
      ],
      label: 'Step towards the ball, reach, pull in',
    },
    artCaption: 'Move your feet, not just your arms.',
    words: [
      { term: 'Off-centre', meaning: 'Not straight at you.' },
      { term: 'Track', meaning: 'Follow with your eyes.' },
      {
        term: 'Soft hands',
        meaning: 'Hands that give a little as the ball arrives.',
      },
    ],
    examples: [
      {
        title: 'A wide throw',
        situation: 'The ball is coming wide to your right. What do you do?',
        steps: [
          'Step to the right with your right foot.',
          'Reach out with both hands, fingers spread.',
          'Pull the ball in as you catch.',
        ],
        answer: 'Step, reach and pull in.',
      },
      {
        title: 'A low throw',
        situation: 'The ball is coming below your knees.',
        steps: [
          'Bend your knees to get lower.',
          'Point your fingers down, little fingers together.',
        ],
        answer: 'Get low, fingers down.',
      },
    ],
    mistakes: [
      {
        wrong: 'Keeping your feet still and only reaching.',
        right: 'Move your feet so your body is behind the ball.',
      },
    ],
    realLife: [
      'Catching in netball, cricket and rounders.',
      'Catching keys or a bag tossed to you.',
      'Goalkeeping.',
    ],
    tryIt: {
      need: 'A soft ball and a partner',
      steps: [
        'Your partner throws high, low, left and right.',
        'Move and catch each one.',
        'Count your catches out of ten.',
      ],
    },
    safety: [
      'Use a soft ball while learning.',
      'Throw underarm and gently at first.',
    ],
  },
  'pe-07': {
    indicator: {
      code: 'B6.1.2.1.9',
      text: 'Kick a ball dropped from the hands at a target (a goalkeeper’s punt).',
    },
    hook: 'Goalkeepers can send the ball far up the field with one kick. How do they do it?',
    explain: [
      'Hold the ball in front of you at waist height.',
      'Drop it, do not throw it up, and kick it just before it touches the ground.',
      'Point your toes, strike with your laces and follow through towards the target.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'volley', x: 300, kit: 2 }],
      balls: [[400, 200]],
      label: 'Drop, swing, strike with the laces',
    },
    artCaption: 'The ball meets the laces, not the toes.',
    words: [
      {
        term: 'Punt',
        meaning: 'Kicking a ball dropped from the hands before it bounces.',
      },
      { term: 'Laces', meaning: 'The top of your foot.' },
      {
        term: 'Follow through',
        meaning: 'Letting your leg keep swinging after the kick.',
      },
    ],
    examples: [
      {
        title: 'Hit the target',
        situation: 'A target is 15 metres away. How do you punt to it?',
        steps: [
          'Face the target and step forward with your standing foot.',
          'Drop the ball onto your kicking foot.',
          'Follow through towards the target.',
        ],
        answer: 'Aim with your body and your follow-through.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking with your toes.',
        right: 'Point your toes and strike with your laces for control.',
      },
    ],
    realLife: [
      'Goalkeeping in football.',
      'Rugby kicks.',
      'Clearing the ball in games.',
    ],
    tryIt: {
      need: 'A football and a target such as a hoop',
      steps: [
        'Drop the ball and catch it to practise the drop.',
        'Punt it to a partner.',
        'Try to land it in the target.',
      ],
    },
    safety: [
      'Make sure nobody stands close in front of you.',
      'Use a properly pumped football, not a heavy or hard ball.',
    ],
  },
  'pe-08': {
    indicator: {
      code: 'B6.1.2.1.11',
      text: 'Dribble a ball and kick (shoot) it towards a goal while being guarded.',
    },
    hook: 'Scoring is easy with no defender. With a defender in the way, it takes skill. What helps?',
    explain: [
      'Dribble with small touches, keeping the ball close.',
      'Keep your body between the defender and the ball.',
      'Look up for a gap, then shoot low and hard to the corner of the goal.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 220, kit: 0 },
        { pose: 'crouch', x: 480, kit: 3, facing: -1 },
      ],
      balls: [[270, 288]],
      cones: [560, 610],
      label: 'Shield the ball, find the gap',
    },
    artCaption: 'Keep your body between the defender and the ball.',
    words: [
      { term: 'Dribble', meaning: 'Moving the ball along with small touches.' },
      { term: 'Shield', meaning: 'Use your body to protect the ball.' },
      { term: 'Shoot', meaning: 'Kick the ball at goal.' },
    ],
    examples: [
      {
        title: 'Beat the defender',
        situation: 'A defender stands in front of you. What can you do?',
        steps: [
          'Slow down and keep the ball close.',
          'Pretend to go one way, then go the other.',
          'Shoot as soon as you see a gap.',
        ],
        answer: 'A change of speed or direction creates a gap.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking the ball too far ahead while dribbling.',
        right: 'Use small touches so the ball stays close.',
      },
    ],
    realLife: [
      'Football matches.',
      'Hockey and basketball, which use similar ideas.',
      'Playground games.',
    ],
    tryIt: {
      need: 'A football, cones and two small goals',
      steps: [
        'Dribble through five cones and shoot.',
        'Play one-against-one with a partner guarding.',
        'Swap roles after five tries.',
      ],
    },
    safety: [
      'Defenders try to block the ball, never kick players.',
      'Use goals that are firmly fixed or light enough not to fall on anyone.',
    ],
  },
  'pe-09': {
    indicator: {
      code: 'B6.1.3.1.2',
      text: 'Roll the body smoothly forward and backward (a combination of forward and backward rolls).',
    },
    hook: 'A smooth roll looks effortless. The secret is a round back and a tucked chin. Shall we find out why?',
    explain: [
      'For a forward roll, squat with your hands flat on the mat, tuck your chin to your chest and push off with both feet.',
      'Roll over on your rounded back, never on your head, and come up to your feet.',
      'For a backward roll, put your hands by your ears, palms up, and push the mat as you roll back over your shoulders.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'crouch', x: 320, kit: 1 }],
      label: 'Squat low, chin tucked, ready to roll',
    },
    artCaption: 'A round back rolls; a flat back bumps.',
    words: [
      { term: 'Tuck', meaning: 'Curl up small, chin to chest.' },
      { term: 'Rounded back', meaning: 'A back curved like a ball.' },
      { term: 'Mat', meaning: 'A soft surface for rolling.' },
    ],
    examples: [
      {
        title: 'Forward then backward',
        situation: 'How do you join a forward roll to a backward roll?',
        steps: [
          'Finish the forward roll in a squat.',
          'Without standing up, sit back and roll backwards.',
          'Push with your hands to come back to a squat.',
        ],
        answer: 'Finishing in a squat links the two rolls.',
      },
    ],
    mistakes: [
      {
        wrong: 'Rolling with your head on the mat.',
        right: 'Tuck your chin so your shoulders and back take your weight.',
      },
    ],
    realLife: [
      'Gymnastics.',
      'Falling safely in sport.',
      'Dance and acrobatics.',
    ],
    tryIt: {
      need: 'A thick mat and your teacher',
      steps: [
        'Rock back and forth on your rounded back.',
        'Do a forward roll down a gentle slope, with help.',
        'Try a backward roll only with your teacher supporting you.',
      ],
    },
    safety: [
      'Roll only on a thick mat, never on hard ground.',
      'Try backward rolls only with a teacher supporting you.',
      'Stop if your neck hurts.',
    ],
  },
  'pe-10': {
    indicator: {
      code: 'B6.2.2.2.1',
      text: 'Identify the time necessary to prepare for and begin a forehand stroke and a backhand stroke.',
    },
    hook: 'Fast players do not just swing fast. They get ready early. When should you start preparing your stroke?',
    explain: [
      'Preparation starts as soon as you see where the ball is going.',
      'Turn your shoulders and take the bat back while the ball is still travelling.',
      'A backhand usually needs a little less time to prepare than a forehand, because the bat starts in front of you.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'forehand', x: 220, kit: 2, holds: 'racket' },
        { pose: 'backhand', x: 430, kit: 2, holds: 'racket' },
      ],
      label: 'Turn early, swing smoothly',
    },
    artCaption: 'Getting ready early gives you time to swing well.',
    words: [
      {
        term: 'Preparation',
        meaning: 'Getting your body and bat ready before the hit.',
      },
      {
        term: 'Backswing',
        meaning: 'Taking the bat back before swinging forward.',
      },
      { term: 'Timing', meaning: 'Hitting the ball at the right moment.' },
    ],
    examples: [
      {
        title: 'Too late',
        situation: 'You keep hitting the ball late and into the net. Why?',
        steps: [
          'You start your backswing after the ball bounces.',
          'There is no time left for a full swing.',
        ],
        answer: 'Start preparing as the ball crosses the net.',
      },
    ],
    mistakes: [
      {
        wrong: 'Waiting until the ball reaches you to take the bat back.',
        right:
          'Take the bat back as soon as you know which side the ball is coming to.',
      },
    ],
    realLife: [
      'Table tennis and tennis.',
      'Batting in cricket.',
      'Any quick-reaction game.',
    ],
    tryIt: {
      need: 'A bat, a ball and a partner',
      steps: [
        'Your partner calls “forehand” or “backhand” as they toss.',
        'Prepare as soon as you hear the call.',
        'Notice how early preparation improves your hits.',
      ],
    },
    safety: [
      'Keep a clear space around the table.',
      'Pick up stray balls so nobody steps on them.',
    ],
  },
  'pe-11': {
    indicator: {
      code: 'B6.2.3.2.1',
      text: 'Illustrate how the intended direction of an object is affected by the angle of the implement or body part at the time of contact.',
    },
    hook: 'Tilt your bat slightly and the ball flies up; tilt it the other way and it dives into the net. Why?',
    explain: [
      'A ball leaves a bat, foot or hand roughly at right angles to the surface that hits it.',
      'An open bat face, tilted back, sends the ball upwards. A closed face, tilted forward, sends it down.',
      'To aim, set the angle of your bat, foot or hands before contact.',
    ],
    art: {
      kind: 'angle',
      degrees: 60,
      label: 'The angle at contact sets the direction',
    },
    artCaption: 'Change the angle, change the path.',
    words: [
      { term: 'Angle', meaning: 'The amount of tilt or turn.' },
      {
        term: 'Open face',
        meaning: 'A bat face tilted back, sending the ball up.',
      },
      {
        term: 'Closed face',
        meaning: 'A bat face tilted forward, sending the ball down.',
      },
    ],
    examples: [
      {
        title: 'Into the net',
        situation:
          'Your table tennis shots keep going into the net. What should you change?',
        steps: ['The bat face is too closed.', 'Open it slightly.'],
        answer: 'Tilt the bat back a little.',
      },
      {
        title: 'Passing with the foot',
        situation:
          'How do you send a pass to the left with the inside of your right foot?',
        steps: [
          'Turn your foot so its inside faces the target.',
          'Swing through towards the target.',
        ],
        answer: 'The foot’s angle aims the pass.',
      },
    ],
    mistakes: [
      {
        wrong: 'Swinging harder to fix a ball that goes too high.',
        right: 'Fix the angle of the bat, not the power.',
      },
    ],
    realLife: [
      'Table tennis and tennis.',
      'Passing in football.',
      'Setting in volleyball.',
    ],
    tryIt: {
      need: 'A bat or your hands, a ball and a wall',
      steps: [
        'Hit the ball against the wall with an open face.',
        'Hit it with a closed face.',
        'Describe the difference.',
      ],
    },
    safety: [
      'Hit gently while testing angles.',
      'Make sure nobody stands near the wall where the ball rebounds.',
    ],
  },
  'pe-12': {
    indicator: {
      code: 'B6.2.5.2.1',
      text: 'Identify opportunities to pass or dribble while being guarded (attack and defence).',
    },
    hook: 'Should you pass or dribble? Good players decide in a moment. What are they looking for?',
    explain: [
      'Pass when a teammate is free and closer to the goal than you are.',
      'Dribble when there is open space in front of you and no free teammate.',
      'Keep your body between the defender and the ball while you decide.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 160, kit: 0 },
        { pose: 'crouch', x: 360, kit: 3, facing: -1 },
        { pose: 'catch', x: 550, kit: 0, facing: -1 },
      ],
      balls: [[210, 288]],
      label: 'A free teammate: pass!',
    },
    artCaption: 'The defender blocks the path, so pass around them.',
    words: [
      { term: 'Attack', meaning: 'When your team has the ball.' },
      { term: 'Defence', meaning: 'When the other team has the ball.' },
      { term: 'Open space', meaning: 'An area with no players in it.' },
    ],
    examples: [
      {
        title: 'Decide',
        situation:
          'A defender is in front of you. Your teammate is unmarked to your right. Pass or dribble?',
        steps: ['The path ahead is blocked.', 'A teammate is free.'],
        answer: 'Pass.',
      },
      {
        title: 'Space ahead',
        situation:
          'All your teammates are marked, but there is space in front of you.',
        steps: ['No safe pass is on.'],
        answer: 'Dribble into the space.',
      },
    ],
    mistakes: [
      {
        wrong: 'Dribbling into a crowd of defenders.',
        right: 'Look up first: pass if a teammate is free.',
      },
    ],
    realLife: [
      'Football, handball, basketball and netball.',
      'Hockey.',
      'Teamwork in any group task.',
    ],
    tryIt: {
      need: 'A ball, cones and six players',
      steps: [
        'Play three attackers against two defenders.',
        'Before each move, call “pass” or “dribble”.',
        'Talk about which choices worked.',
      ],
    },
    safety: [
      'Defenders guard the ball, not the player’s body.',
      'Play in a marked area with no hard obstacles.',
    ],
  },
  'pe-13': {
    indicator: { code: 'B6.3.2.3.1', text: 'Perform 15 continuous sit-ups.' },
    hook: 'Strong stomach muscles protect your back and help you in every sport. Can you do 15 sit-ups in a row?',
    explain: [
      'Sit-ups strengthen the muscles at the front of your trunk, called the abdominals.',
      'Lie on your back with your knees bent and feet flat. Keep your arms by your sides or crossed on your chest.',
      'Curl up slowly towards your knees, then lower down slowly. Breathe out as you curl up.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'sitUp', x: 300, kit: 1 }],
      label: 'Knees bent, curl up slowly',
    },
    artCaption: 'Curl up towards your knees, then lower down slowly.',
    words: [
      {
        term: 'Abdominals',
        meaning: 'The muscles at the front of your stomach.',
      },
      { term: 'Continuous', meaning: 'Without stopping.' },
      { term: 'Repetition', meaning: 'One complete movement, up and down.' },
    ],
    examples: [
      {
        title: 'Building up',
        situation: 'You can do 8 sit-ups now. How do you reach 15?',
        steps: [
          'Do two sets of 8, with a rest in between.',
          'Each week, add one or two to the first set.',
        ],
        answer: 'Build up slowly, week by week.',
      },
    ],
    mistakes: [
      {
        wrong: 'Pulling on your head or neck to get up.',
        right:
          'Keep your hands off your neck and let your stomach muscles do the work.',
      },
    ],
    realLife: [
      'Lifting and carrying with a strong trunk.',
      'Good posture when sitting.',
      'All sports.',
    ],
    tryIt: {
      need: 'A mat and a partner to count',
      steps: [
        'Your partner holds your feet gently.',
        'Do as many slow sit-ups as you can, up to 15.',
        'Record your number and try again next week.',
      ],
    },
    safety: [
      'Never pull on your neck.',
      'Use a mat, and stop if your back hurts.',
    ],
  },
  'pe-14': {
    indicator: { code: 'B6.3.4.3.1', text: 'Perform trunk rotation.' },
    hook: 'Turning your upper body keeps your back flexible for throwing, batting and dancing. How far can you turn?',
    explain: [
      'Sit with your right leg straight. Bend your left leg and cross it over your right knee.',
      'Put your left hand on the floor behind you, and your right elbow outside your left knee.',
      'Turn your trunk slowly to the left, hold for ten seconds, then change sides.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'twist', x: 300, kit: 2 }],
      label: 'One leg straight, one crossed over, turn slowly',
    },
    artCaption: 'Turn only as far as is comfortable.',
    words: [
      {
        term: 'Trunk',
        meaning: 'The middle part of your body, from shoulders to hips.',
      },
      { term: 'Rotation', meaning: 'Turning around.' },
      {
        term: 'Flexibility',
        meaning: 'How far your joints and muscles can move.',
      },
    ],
    examples: [
      {
        title: 'In sport',
        situation:
          'Why does a cricket bowler or a thrower need trunk rotation?',
        steps: [
          'Turning the trunk adds power to the throw.',
          'A flexible trunk turns further, with less risk of strain.',
        ],
        answer: 'More power and fewer injuries.',
      },
    ],
    mistakes: [
      {
        wrong: 'Bouncing to turn further.',
        right: 'Turn slowly and hold still. Bouncing can strain muscles.',
      },
    ],
    realLife: [
      'Looking behind you while sitting.',
      'Throwing and batting.',
      'Dancing.',
    ],
    tryIt: {
      need: 'A mat',
      steps: [
        'Warm up with gentle arm circles.',
        'Do the twist three times on each side, holding ten seconds.',
        'Notice whether one side is tighter.',
      ],
    },
    safety: [
      'Warm up first.',
      'Turn gently, never with a jerk, and stop if it hurts.',
    ],
  },
  'pe-15': {
    indicator: {
      code: 'B6.4.1.4.1',
      text: 'Develop a one-day personal physical fitness plan specifying the frequency, intensity and type of activity.',
    },
    hook: 'Children need about an hour of activity every day. Could you plan yours so it fits around school and chores?',
    explain: [
      'A fitness plan says what you will do, when, for how long and how hard.',
      'Aim for at least 60 minutes of activity a day, some of it hard enough to make you breathe fast.',
      'Mix activities for the heart, for strength and for flexibility.',
    ],
    art: {
      kind: 'scroll',
      title: 'My fitness day',
      lines: [
        'Morning: walk to school, 20 minutes',
        'Break: skipping and games, 15 minutes',
        'Evening: football, 30 minutes',
        'Before bed: stretching, 5 minutes',
      ],
    },
    artCaption: 'Activity can fit into an ordinary school day.',
    words: [
      { term: 'Frequency', meaning: 'How often you exercise.' },
      { term: 'Intensity', meaning: 'How hard you exercise.' },
      { term: 'Duration', meaning: 'How long you exercise.' },
    ],
    examples: [
      {
        title: 'Check the total',
        situation: 'Does the plan above reach 60 minutes?',
        steps: ['20 + 15 + 30 = 65.', 'Add 5 minutes of stretching.'],
        answer: 'Yes: 70 minutes in all.',
      },
      {
        title: 'Intensity',
        situation: 'Which activity in the plan is the most intense?',
        steps: ['Football makes you run and breathe fast.'],
        answer: 'Football.',
      },
    ],
    mistakes: [
      {
        wrong: 'Planning one long, hard session and nothing else.',
        right: 'Spread activity through the day and mix the types.',
      },
    ],
    realLife: [
      'Staying healthy.',
      'Preparing for sports day.',
      'Building good habits for life.',
    ],
    tryIt: {
      need: 'Paper',
      steps: [
        'Write your own one-day plan with times and activities.',
        'Check that it reaches 60 minutes.',
        'Follow it for a day and tick off each part.',
      ],
    },
    safety: [
      'Drink water during and after exercise.',
      'Choose activities that suit your fitness, and build up slowly.',
    ],
  },
  'pe-16': {
    indicator: {
      code: 'B6.4.2.4.3',
      text: 'Plan a balanced diet menu to improve performance in physical activity.',
    },
    hook: 'Athletes eat to win. What should you eat to have energy for school, play and sport?',
    explain: [
      'A balanced diet has energy foods (such as rice, yam and kenkey), body-building foods (such as fish, beans and eggs), and protective foods (fruits and vegetables).',
      'Small amounts of oil, and plenty of clean water, complete the plate.',
      'Eat a meal or snack two to three hours before hard exercise, not just before.',
    ],
    art: {
      kind: 'scroll',
      title: 'A day’s menu',
      lines: [
        'Breakfast: koko with groundnuts, and a banana',
        'Lunch: waakye with egg, fish and salad',
        'Snack: pawpaw or an orange',
        'Supper: kenkey, fish, pepper and vegetables',
        'Water through the day',
      ],
    },
    artCaption: 'Every meal has energy, body-building and protective foods.',
    words: [
      {
        term: 'Energy foods',
        meaning: 'Foods that give you fuel, such as rice and yam.',
      },
      {
        term: 'Body-building foods',
        meaning: 'Foods that build muscle, such as fish and beans.',
      },
      {
        term: 'Protective foods',
        meaning: 'Fruits and vegetables that keep you healthy.',
      },
    ],
    examples: [
      {
        title: 'Fix the meal',
        situation: 'Kofi’s lunch is just gari and sugar. What is missing?',
        steps: [
          'Gari gives energy.',
          'There is no body-building or protective food.',
        ],
        answer: 'Add beans or fish, and a fruit or vegetable.',
      },
      {
        title: 'Before sports day',
        situation: 'Your race is at 10 o’clock. When should you eat breakfast?',
        steps: ['Leave two to three hours before hard exercise.'],
        answer: 'At about 7 o’clock.',
      },
    ],
    mistakes: [
      {
        wrong: 'Drinking sweet soft drinks instead of water during sport.',
        right: 'Water is best for most school sport.',
      },
    ],
    realLife: [
      'Packing a school lunch.',
      'Choosing food at the market.',
      'Preparing for competitions.',
    ],
    tryIt: {
      need: 'Paper and coloured pencils',
      steps: [
        'Plan a day’s menu using foods your family eats.',
        'Colour energy, body-building and protective foods differently.',
        'Check every meal has all three.',
      ],
    },
    safety: [
      'Do not do hard exercise straight after a big meal.',
      'Tell an adult about any food that makes you unwell.',
    ],
  },
  'pe-17': {
    indicator: {
      code: 'B6.4.4.4.5',
      text: 'Identify ways to minimise injuries when using PE equipment.',
    },
    hook: 'A ball left on the floor, a heavy box lifted badly, a bat swung too close: small mistakes cause most injuries. How can we prevent them?',
    explain: [
      'Check equipment before use: no cracks, sharp edges or loose parts.',
      'Carry heavy equipment with a partner, bending your knees and keeping your back straight.',
      'Put equipment away after use, and take turns so nobody is hit.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'liftGood', x: 200, kit: 1, holds: 'box', mark: 'good' },
        { pose: 'liftBad', x: 440, kit: 3, holds: 'box', mark: 'bad' },
      ],
      label: 'Bend your knees, not your back',
    },
    artCaption: 'Lift with your legs, keeping your back straight.',
    words: [
      {
        term: 'Equipment',
        meaning: 'Things used in PE, such as balls, bats and mats.',
      },
      { term: 'Hazard', meaning: 'Something that could cause harm.' },
      { term: 'Inspect', meaning: 'Check carefully.' },
    ],
    examples: [
      {
        title: 'Spot the hazard',
        situation:
          'Balls are scattered across the floor during a relay. What could happen?',
        steps: ['Runners could step on a ball and fall.'],
        answer: 'Collect loose balls before the race starts.',
      },
      {
        title: 'Moving a mat',
        situation: 'How should two pupils move a heavy mat?',
        steps: [
          'One at each end.',
          'Bend knees, lift together on “three”, walk slowly.',
        ],
        answer: 'Lift together, with straight backs.',
      },
    ],
    mistakes: [
      {
        wrong: 'Using a cracked bat because nothing else is available.',
        right: 'Report damaged equipment and do not use it.',
      },
    ],
    realLife: [
      'Lifting bags and buckets at home.',
      'Using tools safely.',
      'Playing sport outside school.',
    ],
    tryIt: {
      need: 'The PE store, with your teacher',
      steps: [
        'Inspect five pieces of equipment.',
        'List any that are damaged.',
        'Write three class rules for using equipment safely.',
      ],
    },
    safety: [
      'Never lift anything too heavy on your own.',
      'Report broken equipment to your teacher at once.',
    ],
  },
  'pe-18': {
    indicator: {
      code: 'B6.4.5.4.6',
      text: 'Discuss the effects of drug addiction.',
    },
    hook: 'Some substances can take over a person’s life. Knowing the facts helps you make safe choices and help others.',
    explain: [
      'A drug is a substance that changes how the body or mind works. Medicines are drugs that help when used as a health worker says.',
      'Misusing drugs, alcohol or tobacco can harm the brain, heart and lungs, and damage school work, sport and friendships.',
      'Addiction means a person feels they cannot stop. It is an illness, and people with an addiction need help and treatment, not mockery.',
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
        term: 'Drug',
        meaning: 'A substance that changes how the body or mind works.',
      },
      {
        term: 'Addiction',
        meaning:
          'Feeling unable to stop using something, even when it harms you.',
      },
      {
        term: 'Trusted adult',
        meaning: 'A parent, teacher, nurse or other grown-up you can talk to.',
      },
    ],
    examples: [
      {
        title: 'Effects on sport',
        situation: 'How could smoking affect a footballer?',
        steps: ['Smoke damages the lungs.', 'Less oxygen reaches the muscles.'],
        answer: 'They tire quickly and cannot run as far.',
      },
      {
        title: 'A safe choice',
        situation:
          'An older pupil offers you some pills “to feel good”. What do you do?',
        steps: ['Say no clearly, and walk away.', 'Tell a trusted adult.'],
        answer:
          'Never take pills that a health worker or your parent has not given you.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking that trying something once cannot hurt.',
        right:
          'Some substances can harm, or lead to addiction, from the first use.',
      },
    ],
    realLife: [
      'Making safe choices with friends.',
      'Taking medicines correctly.',
      'Supporting someone who needs help.',
    ],
    tryIt: {
      need: 'Paper and a small group',
      steps: [
        'List three ways drug misuse can affect sport and school.',
        'Practise a polite but firm way to say no.',
        'List trusted adults you could talk to.',
      ],
    },
    safety: [
      'Only take medicines given by a health worker or a parent, as directed.',
      'If you are worried about yourself or someone else, tell a trusted adult.',
    ],
  },
  'pe-19': {
    indicator: {
      code: 'B6.5.2.5.2',
      text: 'Provide positive feedback to peers during physical activities.',
    },
    hook: 'A kind, useful word from a teammate can make you try harder. How do you give feedback that really helps?',
    explain: [
      'Positive feedback tells someone what they did well.',
      'Make it specific: “Great pass, you looked up first” helps more than “good”.',
      'If you suggest an improvement, start and end with something positive.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'raise', x: 200, kit: 0 },
        { pose: 'run', x: 420, kit: 0 },
      ],
      label: '“Well done, you kept your head up!”',
    },
    artCaption: 'Specific praise helps teammates improve.',
    words: [
      { term: 'Feedback', meaning: 'Information about how someone did.' },
      { term: 'Specific', meaning: 'Exact, about one particular thing.' },
      { term: 'Encourage', meaning: 'Give someone confidence.' },
    ],
    examples: [
      {
        title: 'Make it specific',
        situation: 'Your friend’s throw reached the target. What do you say?',
        steps: ['Name what they did well.'],
        answer: '“Great throw, you stepped forward with the opposite foot!”',
      },
      {
        title: 'Suggesting a change',
        situation: 'Your friend’s jump landing is stiff. How do you help?',
        steps: [
          'Start positive: “Your run-up was fast.”',
          'Suggest: “Try bending your knees when you land.”',
          'End positive: “You’re getting further each time.”',
        ],
        answer: 'Positive, suggestion, positive.',
      },
    ],
    mistakes: [
      {
        wrong: 'Laughing at a mistake.',
        right: 'Encourage, and offer one helpful tip.',
      },
    ],
    realLife: [
      'Team sports.',
      'Group work in class.',
      'Helping brothers and sisters learn.',
    ],
    tryIt: {
      need: 'A partner and any skill you have learnt',
      steps: [
        'Watch your partner try the skill three times.',
        'Give one specific piece of praise and one tip.',
        'Swap roles.',
      ],
    },
    safety: [
      'Watch from a safe distance while your partner practises.',
      'Keep feedback kind, so everyone feels safe to try.',
    ],
  },
  'pe-20': {
    indicator: {
      code: 'B6.5.4.5.4',
      text: 'Evaluate individual responsibility in group efforts.',
    },
    hook: 'When a team wins, everyone helped. When it loses, did everyone do their part? How can you judge your own part?',
    explain: [
      'In a group, each person has a responsibility, such as a position, a task or a rule to follow.',
      'Evaluating means looking honestly at how well you did your part.',
      'Ask: Did I play my position? Did I communicate? Did I help others and follow the rules?',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 150, kit: 3, holds: 'ball' },
        { pose: 'catch', x: 320, kit: 3 },
        { pose: 'stand', x: 490, kit: 3 },
      ],
      label: 'Every player has a job',
    },
    artCaption: 'A team works when everyone does their part.',
    words: [
      {
        term: 'Responsibility',
        meaning: 'A job or duty you are trusted with.',
      },
      { term: 'Evaluate', meaning: 'Judge how well something was done.' },
      { term: 'Team effort', meaning: 'Everyone working together.' },
    ],
    examples: [
      {
        title: 'After a match',
        situation:
          'Your team lost a netball match. How do you evaluate your part?',
        steps: [
          'Did I stay in my area?',
          'Did I call for the ball and pass well?',
          'Did I encourage my teammates?',
        ],
        answer: 'Name one thing you did well and one to improve.',
      },
    ],
    mistakes: [
      {
        wrong: 'Blaming one player for the loss.',
        right: 'Look first at your own part, and support others.',
      },
    ],
    realLife: [
      'Sports teams.',
      'Group projects at school.',
      'Chores shared at home.',
    ],
    tryIt: {
      need: 'A team game and paper',
      steps: [
        'Play a team game.',
        'Write your job in the team and how well you did it, from 1 to 5.',
        'Write one goal for next time.',
      ],
    },
    safety: [
      'Agree on fair, safe rules before the game.',
      'Check that everyone knows their role so nobody collides.',
    ],
  },
}
