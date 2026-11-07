import type { CourseGuides } from './types'

// Basic 5 Physical Education, written for this course and scoped to the NaCCA
// Physical Education Curriculum for Primary Schools (2019). Notes:
// - Codes are the curriculum's own. The imported lessons carry different ones.
// - The curriculum says the body is "75% water"; a child is closer to two-thirds,
//   so these guides say "more than half".
// - Body types are taught as the curriculum asks, but never as labels for
//   classmates: every build can be active and skilled.

export const guides: CourseGuides = {
  'pe-01': {
    indicator: {
      code: 'B5.1.1.1.1',
      text: 'Walk on straight lines and edges.',
    },
    hook: 'Walking looks easy, until you must stay on a narrow line. Can you walk the whole line without stepping off?',
    explain: [
      'Walking on a line trains balance. Balance is your body’s skill of staying steady over the small space your feet cover.',
      'Place one foot right in front of the other, heel touching toe. Keep your eyes on the end of the line, not on your feet.',
      'Hold your arms out to your sides. They work like the pole of a tightrope walker, helping you correct a wobble.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [{ pose: 'beam', x: 320, kit: 1 }],
      label: 'Arms out, eyes ahead, heel to toe',
    },
    artCaption: 'Arms out wide help you balance on the line.',
    words: [
      { term: 'Balance', meaning: 'Keeping your body steady without falling.' },
      {
        term: 'Heel to toe',
        meaning: 'Putting the heel of one foot against the toes of the other.',
      },
      {
        term: 'Focus point',
        meaning: 'A spot you look at to help you stay steady.',
      },
    ],
    examples: [
      {
        title: 'The straight line',
        situation:
          'Your teacher draws a line 5 metres long. How do you walk it without stepping off?',
        steps: [
          'Stand at the start with your arms out.',
          'Look at the far end of the line.',
          'Step heel to toe, slowly.',
          'If you wobble, pause, breathe, and then go on.',
        ],
        answer: 'Going slowly and steadily wins. Speed comes later.',
        art: {
          kind: 'course',
          path: 'line',
          label: 'Heel to toe along the line',
        },
      },
      {
        title: 'Make it harder',
        situation:
          'You can walk the line easily. How can you make it a bigger challenge?',
        steps: [
          'Walk it backwards.',
          'Carry a light bean bag on your head.',
          'Walk it with your arms folded.',
        ],
        answer: 'Each change makes balance harder, so your body learns more.',
      },
    ],
    mistakes: [
      {
        wrong: 'Looking down at your feet.',
        right:
          'Look at the end of the line. Your head stays up and you wobble less.',
      },
      {
        wrong: 'Rushing to finish first.',
        right: 'A steady pace keeps you on the line.',
      },
    ],
    realLife: [
      'Crossing a narrow footbridge or a log over a stream.',
      'Walking along a gutter edge or a kerb carefully.',
      'Every sport, because balance helps you run, kick and dodge.',
    ],
    tryIt: {
      need: 'A line in chalk or string, about 5 metres long',
      steps: [
        'Walk the line forwards, heel to toe.',
        'Count how many times you step off.',
        'Try again and beat your score.',
        'Then try walking it backwards.',
      ],
    },
    safety: [
      'Use a line on flat, dry ground, not a raised edge or wall.',
      'Warm up first with gentle marching on the spot.',
    ],
  },
  'pe-02': {
    indicator: { code: 'B5.1.1.1.2', text: 'Skip and leap continuously.' },
    hook: 'A skip and a leap both take you off the ground. What makes them different?',
    explain: [
      'A skip is a step and then a small hop on the same foot. Then you change feet: step-hop, step-hop.',
      'A leap is a long, high stride. You push off one foot, fly through the air, and land on the other foot.',
      'For both, push hard with the front part of your foot, swing your arms, and land softly with bent knees.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'skip', x: 190, kit: 2 },
        { pose: 'leap', x: 450, kit: 3 },
      ],
      label: 'A skip (left) and a leap (right)',
    },
    artCaption: 'In a leap you stay in the air longer.',
    words: [
      {
        term: 'Skip',
        meaning: 'A step and a hop on the same foot, then the other foot.',
      },
      {
        term: 'Leap',
        meaning: 'A long jump from one foot onto the other foot.',
      },
      { term: 'Rhythm', meaning: 'A steady, repeating beat in your movement.' },
    ],
    examples: [
      {
        title: 'Find the skipping rhythm',
        situation:
          'You keep stumbling when you skip. How can you get the rhythm?',
        steps: [
          'Say “step-hop” out loud as you move.',
          'Swing the opposite arm to your knee.',
          'Start slowly, then speed up.',
        ],
        answer: 'Saying the rhythm helps your feet follow it.',
      },
      {
        title: 'Leap over a stream',
        situation:
          'Two ropes on the ground make a “stream” about 1 metre wide. How do you leap across?',
        steps: [
          'Take three running steps.',
          'Push off hard with one foot.',
          'Reach forward with the other leg.',
          'Land on that foot and bend your knee.',
        ],
        answer: 'A running start and a strong push carry you across.',
        art: {
          kind: 'people',
          ground: 'grass',
          people: [{ pose: 'leap', x: 320, kit: 0 }],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Landing with straight, stiff legs.',
        right:
          'Bend your knees as you land so that your legs soak up the force.',
      },
      {
        wrong: 'Taking off and landing on the same foot in a leap.',
        right: 'A leap takes off from one foot and lands on the other.',
      },
    ],
    realLife: [
      'Jumping over a puddle on the way to school.',
      'Playing ampe, which uses quick jumps and rhythm.',
      'Running and jumping in athletics and football.',
    ],
    tryIt: {
      need: 'An open space and a friend to watch',
      steps: [
        'Skip for 20 metres.',
        'Leap over a line 10 times, changing your take-off foot.',
        'Ask your friend to watch whether your landings are soft.',
      ],
    },
    safety: [
      'Clear the area of stones and holes first.',
      'Wear shoes or practise on soft grass.',
      'Stop and rest if you feel dizzy.',
    ],
  },
  'pe-03': {
    indicator: {
      code: 'B5.1.2.1.2',
      text: 'Perform simple small-group balance stunts by distributing weight and base of support.',
    },
    hook: 'Two people holding hands and leaning back can balance in a way neither could alone. How does that work?',
    explain: [
      'Your base of support is the area under you that holds you up, such as your feet. A wider base is steadier than a narrow one.',
      'Your centre of gravity is the point where your weight balances. A lower one is steadier: think of a crouching wrestler.',
      'In a partner balance, each person shares weight with the other. If one leans back, the other must lean back too, or both fall.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'lean', x: 250, kit: 1 },
        { pose: 'lean', x: 390, facing: -1, kit: 3 },
      ],
      label: 'Leaning back together, sharing weight',
    },
    artCaption: 'Both partners lean back by the same amount.',
    words: [
      {
        term: 'Base of support',
        meaning: 'The area under your body that holds you up.',
      },
      {
        term: 'Centre of gravity',
        meaning: 'The point where your body’s weight is balanced.',
      },
      {
        term: 'Counterbalance',
        meaning:
          'Two people leaning away from each other, so that they hold each other up.',
      },
    ],
    examples: [
      {
        title: 'Rise on your toes together',
        situation:
          'You and a partner hold hands, then rise up onto your toes. How do you stay up longer?',
        steps: [
          'Stand facing each other and hold hands firmly.',
          'Rise onto your toes at the same time, on a count of three.',
          'Keep your bodies tall and tight.',
          'Take tiny steps if you need to, rather than letting go.',
        ],
        answer: 'Rising together and staying tall keeps you balanced.',
        art: {
          kind: 'people',
          ground: 'floor',
          people: [
            { pose: 'reach', x: 262, kit: 2 },
            { pose: 'reach', x: 378, facing: -1, kit: 0 },
          ],
        },
      },
      {
        title: 'Wide or narrow?',
        situation:
          'Stand on one foot, then on two feet apart. Which is steadier, and why?',
        steps: [
          'On one foot the base is small.',
          'With two feet apart, the base is wide.',
        ],
        answer:
          'Feet apart is steadier, because the base of support is bigger.',
      },
    ],
    mistakes: [
      {
        wrong: 'Letting go suddenly while your partner leans.',
        right:
          'Agree a signal, such as “3, 2, 1, up”, before you both come back.',
      },
      {
        wrong: 'Standing with your feet together for a group stunt.',
        right: 'Spread your feet to make a wider base.',
      },
    ],
    realLife: [
      'Standing in a moving trotro.',
      'Carrying a load on your head.',
      'Defending in football with your knees bent.',
    ],
    tryIt: {
      need: 'A partner and a soft floor or grass',
      steps: [
        'Hold hands and lean back slowly, together.',
        'Count how many seconds you can hold it.',
        'Try it with your feet wider apart. Is it easier?',
      ],
    },
    safety: [
      'Practise on grass or mats, never on concrete.',
      'Do not climb on anyone’s back or shoulders without your teacher.',
      'Come out of every balance slowly and together.',
    ],
  },
  'pe-04': {
    indicator: {
      code: 'B5.1.2.1.3',
      text: 'Change direction quickly while walking with an object within obstacles, but keep one’s balance.',
    },
    hook: 'In a spoon-and-lime race, you must weave around obstacles without dropping the lime. What is the secret?',
    explain: [
      'Agility is the skill of changing direction quickly and staying in control.',
      'When you turn, bend your knees a little and take short steps. This lowers your body and keeps you steady.',
      'Keep the arm that carries the object still, and keep your eyes looking ahead to the next turn.',
    ],
    art: { kind: 'course', path: 'zigzag', label: 'Weave around each cone' },
    artCaption: 'Zigzag through the cones to the finish.',
    words: [
      {
        term: 'Agility',
        meaning: 'Changing direction quickly while staying in control.',
      },
      {
        term: 'Obstacle',
        meaning: 'Something in your way that you must go around.',
      },
      { term: 'Zigzag', meaning: 'A path with sharp turns from side to side.' },
    ],
    examples: [
      {
        title: 'Spoon-and-lime weave',
        situation:
          'You walk with a lime on a spoon through five cones. How do you keep the lime on?',
        steps: [
          'Hold the spoon close to your body, with your elbow bent.',
          'Take short steps as you get near a cone.',
          'Bend your knees a little as you turn.',
          'Look at the next cone, not at the lime.',
        ],
        answer: 'Short steps and soft knees keep the lime steady.',
        art: {
          kind: 'people',
          ground: 'grass',
          people: [{ pose: 'walk', x: 300, kit: 2, holds: 'lime' }],
          cones: [130, 480],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Taking big steps at the turns.',
        right: 'Shorten your steps before each turn.',
      },
      {
        wrong: 'Staring at the object you carry.',
        right: 'Look ahead. Your hand will learn to stay steady.',
      },
    ],
    realLife: [
      'Weaving through a crowded market with a tray.',
      'Dodging defenders in football or handball.',
      'Carrying a cup of water across a busy room.',
    ],
    tryIt: {
      need: 'A spoon, a lime or small stone, and five cones or bottles',
      steps: [
        'Set the cones in a zigzag line, about 2 metres apart.',
        'Weave through with the lime on the spoon.',
        'Time yourself, then try to be faster without dropping it.',
      ],
    },
    safety: [
      'Space the cones far enough apart to turn safely.',
      'Walk first. Only jog when you can turn without slipping.',
    ],
  },
  'pe-05': {
    indicator: {
      code: 'B5.1.2.1.5',
      text: 'Strike a dropped ball, with a racket or paddle, toward a target using forehand and backhand movements.',
    },
    hook: 'A good hit with a racket is not about strength. It is about where you stand and when you swing.',
    explain: [
      'A forehand is hit on the same side as the hand holding the racket. The palm faces the way the ball will go.',
      'A backhand is hit on the other side, with the racket crossing your body. The back of your hand faces the way the ball goes.',
      'Stand side-on to the target. Swing from low to high, and follow through towards your partner.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [{ pose: 'forehand', x: 300, kit: 0, holds: 'racket' }],
      balls: [[392, 168]],
      label: 'Side-on, swing low to high',
    },
    artCaption: 'A forehand: the racket meets the ball beside your body.',
    words: [
      {
        term: 'Forehand',
        meaning: 'A hit on the same side as your racket hand.',
      },
      {
        term: 'Backhand',
        meaning: 'A hit across your body, on the other side.',
      },
      {
        term: 'Follow through',
        meaning:
          'Letting the racket keep moving towards the target after the hit.',
      },
    ],
    examples: [
      {
        title: 'Drop and hit',
        situation:
          'Your partner stands 6 metres away. How do you send a dropped ball to them?',
        steps: [
          'Stand side-on, with your racket back.',
          'Drop the ball beside your front foot.',
          'Let it bounce once.',
          'Swing low to high and follow through towards your partner.',
        ],
        answer:
          'Side-on, a steady swing and a follow through send the ball straight.',
      },
      {
        title: 'Try the backhand',
        situation: 'The ball comes to your other side. What changes?',
        steps: [
          'Turn so that your racket shoulder faces the target.',
          'Bring the racket across your body.',
          'Swing forward and up through the ball.',
        ],
        answer: 'Turning your shoulder lets you swing freely across your body.',
        art: {
          kind: 'people',
          ground: 'compound',
          people: [{ pose: 'backhand', x: 320, kit: 3, holds: 'racket' }],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Facing the target square-on.',
        right: 'Stand side-on, so that your body can turn into the hit.',
      },
      {
        wrong: 'Stopping the racket as soon as it touches the ball.',
        right: 'Follow through towards your target.',
      },
    ],
    realLife: [
      'Table tennis and badminton.',
      'Tennis at a sports club.',
      'Hitting a tennis ball against a wall at home with a homemade paddle.',
    ],
    tryIt: {
      need: 'A paddle or flat piece of board, a light ball and a wall',
      steps: [
        'Stand 3 metres from a wall.',
        'Hit 10 forehands against it, letting the ball bounce once each time.',
        'Then try 10 backhands.',
        'Count how many in a row you can do.',
      ],
    },
    safety: [
      'Keep 3 metres between pairs so that rackets do not hit anyone.',
      'Hold the racket firmly so that it cannot fly out of your hand.',
    ],
  },
  'pe-06': {
    indicator: {
      code: 'B5.1.2.1.6',
      text: 'Throw a ball to a moving partner to catch while walking, jogging and running.',
    },
    hook: 'If you throw a ball to where your running partner is now, it will land behind them. Where should you throw it?',
    explain: [
      'A moving partner will not be in the same place when the ball arrives. Throw to the space in front of them. This is called leading the pass.',
      'Step towards your partner as you throw, and point your hand at the target after letting go.',
      'To catch, show your hands early. Watch the ball into your hands, and pull it in towards your body.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 150, kit: 0 },
        { pose: 'run', x: 480, kit: 0 },
      ],
      balls: [[330, 120]],
      label: 'Throw ahead of your running partner',
    },
    artCaption: 'The ball and the runner meet at the same place.',
    words: [
      {
        term: 'Lead pass',
        meaning: 'Throwing to the space a moving player is running into.',
      },
      {
        term: 'Target hand',
        meaning: 'Your hands held up to show where you want the ball.',
      },
    ],
    examples: [
      {
        title: 'Passing on the move',
        situation:
          'Your partner is jogging across in front of you. Where do you aim?',
        steps: [
          'Watch which way and how fast they move.',
          'Aim about two steps in front of them.',
          'Throw with a smooth, flat pass.',
        ],
        answer: 'Aiming in front lets your partner run onto the ball.',
      },
    ],
    mistakes: [
      {
        wrong: 'Throwing at your partner’s body while they run.',
        right: 'Throw to where they will be.',
      },
      {
        wrong: 'Catching with stiff arms.',
        right: 'Give with your arms and pull the ball in.',
      },
    ],
    realLife: [
      'Handball and basketball passes.',
      'Netball games at school.',
      'Tossing a ball to a friend in the compound.',
    ],
    tryIt: {
      need: 'A ball and a partner',
      steps: [
        'Pass to your partner while they walk.',
        'Then while they jog.',
        'Then while they run.',
        'Count how many catches you make in a row.',
      ],
    },
    safety: [
      'Use a soft or light ball while you learn.',
      'Call your partner’s name before you throw.',
    ],
  },
  'pe-07': {
    indicator: {
      code: 'B5.1.2.1.8',
      text: 'Stop a kicked ball by trapping it with the foot while standing or moving.',
    },
    hook: 'Footballers make stopping a fast ball look easy. Their trick is a soft foot.',
    explain: [
      'Trapping means stopping a moving ball and controlling it.',
      'Move to line up with the ball. As it arrives, pull your foot back a little to cushion it, so that it does not bounce away.',
      'You can use the inside of your foot or the sole. Keep your eyes on the ball until it stops.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'trap', x: 300, kit: 1 }],
      label: 'Cushion the ball with a soft foot',
    },
    artCaption: 'The sole of the foot stops the ball.',
    words: [
      { term: 'Trap', meaning: 'Stop and control a ball with your body.' },
      {
        term: 'Cushion',
        meaning: 'Give a little as the ball arrives, to make it soft.',
      },
      {
        term: 'First touch',
        meaning: 'The first contact you make with the ball.',
      },
    ],
    examples: [
      {
        title: 'Trapping a pass',
        situation:
          'Your partner rolls the ball fast to you. How do you stop it dead?',
        steps: [
          'Move so the ball comes straight at you.',
          'Lift your foot slightly and turn it sideways.',
          'As the ball touches, draw your foot back a little.',
        ],
        answer: 'The ball stops at your feet, ready for your next move.',
      },
    ],
    mistakes: [
      {
        wrong: 'Holding your foot stiff, so that the ball bounces off.',
        right: 'Draw your foot back as the ball arrives.',
      },
      {
        wrong: 'Looking up before the ball arrives.',
        right: 'Watch it all the way to your foot.',
      },
    ],
    realLife: [
      'Receiving a pass in football.',
      'Stopping a ball that rolls towards a road.',
      'Playing keep-ups with friends.',
    ],
    tryIt: {
      need: 'A football and a wall',
      steps: [
        'Kick the ball against a wall.',
        'Trap it when it comes back.',
        'Count clean traps in a row.',
        'Use your other foot next.',
      ],
    },
    safety: [
      'Play away from roads and windows.',
      'Use a properly pumped ball. A hard, over-full ball can hurt.',
    ],
  },
  'pe-08': {
    indicator: {
      code: 'B5.1.2.1.10',
      text: 'Dribble a ball by foot and kick it to a partner at a distance of about five metres.',
    },
    hook: 'Dribbling is running with the ball as if it were tied to your feet. Then comes the pass. Can you do both?',
    explain: [
      'Dribble with small taps of the inside and outside of your foot. Keep the ball close, so that you can change direction.',
      'Look up between touches to see your partner and the space around you.',
      'To pass, put your standing foot beside the ball and pointing at your partner. Strike the middle of the ball with the inside of your foot.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'kick', x: 260, kit: 3 }],
      balls: [[332, 292]],
      cones: [110, 470, 560],
      label: 'Standing foot beside the ball, strike with the inside',
    },
    artCaption: 'Dribble through the cones, then pass.',
    words: [
      { term: 'Dribble', meaning: 'Move with the ball using small touches.' },
      { term: 'Pass', meaning: 'Kick the ball to a teammate.' },
      {
        term: 'Standing foot',
        meaning: 'The foot you stand on while kicking with the other.',
      },
    ],
    examples: [
      {
        title: 'Dribble and pass',
        situation:
          'Dribble through four cones, then pass to a partner 5 metres away.',
        steps: [
          'Tap the ball gently past each cone.',
          'After the last cone, look up at your partner.',
          'Put your standing foot beside the ball.',
          'Pass with the inside of your foot.',
        ],
        answer: 'Close touches, then a firm, flat pass.',
        art: { kind: 'course', path: 'zigzag', ball: true },
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking the ball far ahead while dribbling.',
        right: 'Use soft, small touches so that the ball stays near you.',
      },
      {
        wrong: 'Passing with your toe.',
        right: 'The inside of the foot is bigger and more accurate.',
      },
    ],
    realLife: [
      'Football at school and in the neighbourhood.',
      'Moving a ball past a defender.',
      'Futsal and other small games.',
    ],
    tryIt: {
      need: 'A ball, four cones or bottles, and a partner',
      steps: [
        'Set the cones in a line, 1 metre apart.',
        'Dribble in and out of them.',
        'Pass to your partner standing 5 metres away.',
        'Swap roles.',
      ],
    },
    safety: [
      'Warm up your legs first with jogging and gentle stretches.',
      'Keep away from other groups when you pass.',
    ],
  },
  'pe-09': {
    indicator: {
      code: 'B5.1.3.1.1',
      text: 'Organise traditional music and dance.',
    },
    hook: 'Every region of Ghana has dances that tell stories. When you dance, you join in a story much older than you.',
    explain: [
      'Traditional dances often move in time with a bell that keeps a steady pattern. The drums play around that pattern.',
      'Adowa, an Akan dance, uses graceful hand movements that carry meaning. Kpanlogo comes from the Ga people, and Agbadza from the Ewe.',
      'Dancing builds rhythm, coordination and fitness. It is also a way to respect and enjoy our culture.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'dance', x: 160, kit: 2 },
        { pose: 'dance', x: 320, facing: -1, kit: 1 },
        { pose: 'dance', x: 480, kit: 0 },
      ],
      label: 'Knees soft, moving with the beat',
    },
    artCaption: 'Dancers move together with the drum and bell.',
    words: [
      { term: 'Rhythm', meaning: 'A pattern of beats that repeats.' },
      {
        term: 'Timeline',
        meaning: 'The steady pattern of the bell that everyone follows.',
      },
      {
        term: 'Gesture',
        meaning: 'A hand or body movement that carries a meaning.',
      },
    ],
    examples: [
      {
        title: 'Plan a class dance',
        situation:
          'Your group must share a short dance at assembly. How do you organise it?',
        steps: [
          'Choose a dance and listen to its music together.',
          'Pick three simple steps that fit the beat.',
          'Decide who drums, who dances and who leads.',
          'Practise, then perform it for the class.',
        ],
        answer: 'Clear roles and practice make a confident performance.',
      },
    ],
    mistakes: [
      {
        wrong: 'Dancing faster than the music.',
        right: 'Listen for the bell and move with it.',
      },
      {
        wrong: 'Laughing at someone’s dance.',
        right: 'Cheer them on. Everyone learns at a different pace.',
      },
    ],
    realLife: [
      'Festivals such as Homowo and Aboakyer.',
      'Cultural days at school.',
      'Weddings and family celebrations.',
    ],
    tryIt: {
      need: 'Music, or someone clapping a steady beat',
      steps: [
        'Clap along with the beat until it feels steady.',
        'Step from side to side in time.',
        'Add an arm movement.',
        'Teach your steps to a family member.',
      ],
    },
    safety: [
      'Dance in a space clear of furniture.',
      'Drink water during long practices.',
    ],
  },
  'pe-10': {
    indicator: {
      code: 'B5.2.2.2.1',
      text: 'Explain the differences in applying and receiving force when jumping for height and distance.',
    },
    hook: 'When you jump, you push the ground, and the ground pushes you back up! How you push decides where you go.',
    explain: [
      'Applying force means pushing. When you push down hard on the ground, the ground pushes back just as hard, and that lifts you.',
      'To jump high, push straight down and swing your arms straight up. To jump far, take a run-up and push down and back, swinging your arms forward.',
      'Receiving force means landing. Bend your ankles, knees and hips as you land so that your legs soak up the force like a spring.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'crouch', x: 140, kit: 3 },
        { pose: 'jumpUp', x: 320, kit: 3 },
        { pose: 'land', x: 500, kit: 3 },
      ],
      label: 'Push down, fly up, land soft',
    },
    artCaption: 'Crouch, take off, and land on bent knees.',
    words: [
      { term: 'Force', meaning: 'A push or a pull.' },
      {
        term: 'Take-off',
        meaning: 'The moment your feet push away from the ground.',
      },
      {
        term: 'Landing',
        meaning: 'Coming back to the ground and taking your weight.',
      },
    ],
    examples: [
      {
        title: 'High or far?',
        situation: 'Compare a standing high jump with a long jump.',
        steps: [
          'High jump: crouch, then push straight down and reach up.',
          'Long jump: run, then push off one foot and drive forward.',
          'In both, land with bent knees.',
        ],
        answer: 'The direction you push decides the direction you fly.',
      },
      {
        title: 'Why bend your knees?',
        situation:
          'Jump and land once with straight legs, gently. Then with bent knees. What do you feel?',
        steps: [
          'Straight legs stop you suddenly, and the jolt goes up your body.',
          'Bent knees slow you down over a longer time.',
        ],
        answer: 'Bent knees make landing softer and safer.',
        art: {
          kind: 'people',
          ground: 'grass',
          people: [{ pose: 'land', x: 320, kit: 1 }],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Keeping your arms still.',
        right: 'Swing your arms in the direction you want to go.',
      },
      {
        wrong: 'Landing on stiff legs.',
        right: 'Land on the balls of your feet, then bend your knees.',
      },
    ],
    realLife: [
      'The long jump on sports day.',
      'Jumping to head a football.',
      'Jumping down from a step.',
    ],
    tryIt: {
      need: 'A tape measure or strides, and soft ground or a sand pit',
      steps: [
        'Do a standing long jump and mark where your heels land.',
        'Try again, swinging your arms harder.',
        'Measure both. Did the arm swing help?',
      ],
    },
    safety: [
      'Land on sand, grass or mats, not concrete.',
      'Check the landing area is clear before every jump.',
    ],
  },
  'pe-11': {
    indicator: {
      code: 'B5.2.3.2.1',
      text: 'Compare the difference in throwing a ball with the left and right hand, and kicking with the left and right foot, for distance.',
    },
    hook: 'Most people have a stronger side. Do you know which hand and which foot are stronger for you?',
    explain: [
      'Your stronger side is called your dominant side. It is usually more accurate and powerful because you use it more.',
      'Your other side gets stronger with practice too. Players who can use both sides are harder to defend against.',
      'To compare fairly, use the same ball, the same run-up and the same measuring method for both sides.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'throw', x: 320, kit: 2 }],
      label: 'Step forward with the opposite foot',
    },
    artCaption: 'Throwing with the stronger arm.',
    words: [
      {
        term: 'Dominant side',
        meaning: 'The hand or foot you use most and best.',
      },
      {
        term: 'Fair test',
        meaning: 'A comparison where only one thing changes.',
      },
      { term: 'Distance', meaning: 'How far something travels.' },
    ],
    examples: [
      {
        title: 'Run a fair test',
        situation:
          'Esi throws 14 strides with her right hand and 9 strides with her left. How much further did the right hand go?',
        steps: ['Find the difference: 14 − 9 = 5.'],
        answer: 'Her right hand threw 5 strides further.',
      },
      {
        title: 'Make it fair',
        situation:
          'Kwame kicks with his right foot after a run-up, and with his left foot standing still. Is that fair?',
        steps: [
          'Two things changed: the foot and the run-up.',
          'You cannot tell which one made the difference.',
        ],
        answer: 'No. Use the same run-up for both feet.',
      },
    ],
    mistakes: [
      {
        wrong: 'Only ever practising with your stronger side.',
        right: 'Give your other side some practice every time.',
      },
    ],
    realLife: [
      'Footballers who can shoot with either foot.',
      'Throwing in from the sideline.',
      'Writing or carrying with either hand when one is tired.',
    ],
    tryIt: {
      need: 'A ball, a partner and a way to mark distances',
      steps: [
        'Throw three times with each hand and mark the best distance.',
        'Kick three times with each foot.',
        'Record your results in a table.',
        'Which is your dominant hand and foot?',
      ],
    },
    safety: [
      'Throw only when the field ahead is clear.',
      'Warm up your shoulders with arm circles first.',
    ],
  },
  'pe-12': {
    indicator: {
      code: 'B5.2.5.2.1',
      text: 'Distinguish between volleying and kicking, and describe the similarities and differences.',
    },
    hook: 'Both a volley and a kick send the ball away with your foot. So what makes them different?',
    explain: [
      'A kick strikes the ball when it is on the ground.',
      'A volley strikes the ball while it is still in the air, before it touches the ground. Volleys happen in football, volleyball and tennis.',
      'Both need you to watch the ball and time your strike. A volley is harder because the ball is moving through the air.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'kick', x: 170, kit: 0 },
        { pose: 'volley', x: 450, kit: 2 },
      ],
      balls: [
        [242, 292],
        [540, 196],
      ],
      label: 'A kick from the ground, and a volley in the air',
    },
    artCaption: 'Where is the ball when each player strikes it?',
    words: [
      { term: 'Kick', meaning: 'Striking a ball that is on the ground.' },
      {
        term: 'Volley',
        meaning: 'Striking a ball before it touches the ground.',
      },
      {
        term: 'Timing',
        meaning: 'Doing something at exactly the right moment.',
      },
    ],
    examples: [
      {
        title: 'Sort the strikes',
        situation:
          'Is a goalkeeper’s drop from the hands, struck before it lands, a kick or a volley?',
        steps: [
          'Ask: is the ball touching the ground when it is struck?',
          'No. It is still in the air.',
        ],
        answer: 'It is a volley.',
      },
    ],
    mistakes: [
      {
        wrong: 'Leaning back on a volley, so that the ball flies high.',
        right: 'Keep your body over the ball and strike its middle.',
      },
    ],
    realLife: [
      'Volleyball, where you volley with your hands.',
      'Football goal kicks and volleys.',
      'Tennis volleys at the net.',
    ],
    tryIt: {
      need: 'A soft ball and a partner',
      steps: [
        'Kick the ball from the ground to your partner five times.',
        'Drop it from your hands and volley it five times.',
        'Which was easier? Explain why.',
      ],
    },
    safety: [
      'Use a soft ball for volleys while learning.',
      'Keep a safe space between pairs.',
    ],
  },
  'pe-13': {
    indicator: {
      code: 'B5.3.1.3.1',
      text: 'Perform 10 minutes of jogging with music.',
    },
    hook: 'Ten minutes of jogging makes your heart and lungs stronger. Music makes the time go faster!',
    explain: [
      'Jogging is running at an easy, steady pace. It builds endurance, which is how long your body can keep going.',
      'Use the talk test: you should be able to talk while you jog, but not sing. Then your pace is about right.',
      'Music with a steady beat helps you keep your rhythm. Warm up first, and cool down by walking afterwards.',
    ],
    art: {
      kind: 'people',
      ground: 'track',
      people: [
        { pose: 'run', x: 150, kit: 1 },
        { pose: 'run', x: 330, kit: 2 },
        { pose: 'run', x: 510, kit: 3 },
      ],
      label: 'A steady pace you can keep for 10 minutes',
    },
    artCaption: 'Jogging together on the track.',
    words: [
      {
        term: 'Endurance',
        meaning: 'Keeping going for a long time without stopping.',
      },
      { term: 'Pace', meaning: 'How fast you are moving.' },
      { term: 'Cool down', meaning: 'Slowing down gently after exercise.' },
    ],
    examples: [
      {
        title: 'Pace yourself',
        situation:
          'Abena sprints hard at the start and has to stop after 3 minutes. What should she change?',
        steps: [
          'Start slowly.',
          'Use the talk test.',
          'Only speed up near the end if she still feels good.',
        ],
        answer:
          'A slower, steady start lets her keep going for all 10 minutes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Starting too fast.',
        right: 'Begin gently. Ten minutes is a long time.',
      },
      {
        wrong: 'Stopping suddenly at the end.',
        right: 'Walk for two minutes to cool down.',
      },
    ],
    realLife: [
      'Running to school when you are late, without getting exhausted.',
      'Cross-country races.',
      'Lasting a whole football match.',
    ],
    tryIt: {
      need: 'A song or two with a steady beat, and a safe route',
      steps: [
        'Warm up by walking for 2 minutes.',
        'Jog for 10 minutes, using the talk test.',
        'Walk for 2 minutes to cool down.',
        'Next week, see if it feels easier.',
      ],
    },
    safety: [
      'Jog in the cool morning or evening, not in the midday heat.',
      'Drink water before and after.',
      'Stop and tell an adult if you feel dizzy or have chest pain.',
      'Use a safe route, away from traffic.',
    ],
  },
  'pe-14': {
    indicator: {
      code: 'B5.3.3.3.1',
      text: 'Perform two sets of continuous push-ups.',
    },
    hook: 'A push-up uses your arms, chest, shoulders and tummy all at once. That is why athletes love it.',
    explain: [
      'Start with your hands flat on the ground, a little wider than your shoulders. Stretch your legs back, so that your body is straight like a plank.',
      'Bend your elbows to lower your chest close to the ground. Then push back up until your arms are straight.',
      'A set is a group of push-ups done one after the other. Rest for about a minute between sets.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'pushUp', x: 170, kit: 0 },
        { pose: 'pushDown', x: 430, kit: 0 },
      ],
      label: 'Up, then down, with a straight body',
    },
    artCaption: 'Keep your body straight from head to heels.',
    words: [
      { term: 'Set', meaning: 'A group of repetitions done without stopping.' },
      { term: 'Repetition', meaning: 'Doing a movement one time.' },
      {
        term: 'Plank position',
        meaning: 'Holding your body straight and stiff, like a board.',
      },
    ],
    examples: [
      {
        title: 'Two sets',
        situation:
          'Kofi does 8 push-ups, rests, then does 6 more. How many did he do?',
        steps: ['First set: 8.', 'Second set: 6.', '8 + 6 = 14.'],
        answer: 'Kofi did 14 push-ups in two sets.',
      },
      {
        title: 'The easier version',
        situation:
          'Full push-ups are too hard for you at first. What can you do?',
        steps: [
          'Do them with your knees on the ground.',
          'Keep your body straight from your knees to your head.',
          'When that feels easy, try full push-ups.',
        ],
        answer: 'Start with knee push-ups and build up.',
      },
    ],
    mistakes: [
      {
        wrong: 'Letting your hips sag or stick up.',
        right: 'Squeeze your tummy so that your body stays straight.',
      },
      {
        wrong: 'Only bending your elbows a tiny bit.',
        right: 'Lower your chest until it is close to the ground.',
      },
    ],
    realLife: [
      'Getting up from the ground quickly.',
      'Pushing a heavy door or a cart.',
      'Holding yourself up in games and gymnastics.',
    ],
    tryIt: {
      need: 'A mat or a clean, flat floor',
      steps: [
        'Warm up with arm circles.',
        'Do as many good push-ups as you can.',
        'Rest for 1 minute.',
        'Do a second set. Write down both numbers.',
      ],
    },
    safety: [
      'Quality matters more than numbers. Stop when your body starts to sag.',
      'Do not do push-ups on rough or hot ground.',
    ],
  },
  'pe-15': {
    indicator: {
      code: 'B5.3.5.3.1',
      text: 'Identify the capabilities of the various body types.',
    },
    hook: 'Look at top athletes: sprinters, wrestlers and long-distance runners all look different. Every body has its strengths.',
    explain: [
      'Scientists describe three broad body types. An ectomorph is slim and long, and is often good at long-distance running and high jumping.',
      'A mesomorph builds muscle easily, and is often good at sprinting and strength sports. An endomorph is broader, and is often strong and steady in sports like wrestling or as a goalkeeper.',
      'Most people are a mix, and bodies change as children grow. Your body type does not limit you. Training, practice and enjoyment matter much more.',
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
        title: 'Match a strength',
        situation:
          'A team needs a long-distance runner, a sprinter and a goalkeeper. How can different builds help?',
        steps: [
          'A slim build is often light for long runs.',
          'A muscular build is often powerful for sprints.',
          'A broader build is often strong and steady in goal.',
        ],
        answer:
          'A good team uses everyone’s strengths. Anyone can learn any position.',
      },
    ],
    mistakes: [
      {
        wrong: 'Giving classmates labels, or teasing anyone about their body.',
        right: 'Body types describe science, not people to judge. Be kind.',
      },
      {
        wrong: 'Thinking your body type decides what you can do.',
        right: 'Practice and effort matter far more.',
      },
    ],
    realLife: [
      'Choosing roles in a team game.',
      'Finding a sport you enjoy.',
      'Respecting athletes of every shape.',
    ],
    tryIt: {
      need: 'A notebook',
      steps: [
        'Write down three sports you enjoy.',
        'For each, list one skill it needs, such as speed or strength.',
        'Choose one skill to practise this week.',
      ],
    },
    safety: ['Talk about bodies kindly. Every body deserves respect.'],
  },
  'pe-16': {
    indicator: {
      code: 'B5.4.1.4.1',
      text: 'Monitor the intensity of one’s heart rate during physical activity.',
    },
    hook: 'Your heart is a pump that never stops. You can count how hard it works, using just two fingers and a clock.',
    explain: [
      'Your heart rate is how many times your heart beats in one minute. Each beat sends a push of blood, which you can feel as your pulse.',
      'Find your pulse on the thumb side of your wrist with your first two fingers. Do not use your thumb, as it has its own pulse.',
      'Count the beats for 15 seconds, then multiply by 4 to get beats per minute. At rest, a child’s heart beats about 70 to 100 times a minute. Exercise makes it beat faster.',
    ],
    art: { kind: 'pulse', label: 'Count for 15 seconds, then multiply by 4' },
    artCaption: 'Two fingers on the thumb side of the wrist.',
    words: [
      {
        term: 'Heart rate',
        meaning: 'How many times your heart beats in a minute.',
      },
      {
        term: 'Pulse',
        meaning: 'The beat you feel as blood is pushed through your body.',
      },
      { term: 'Intensity', meaning: 'How hard your body is working.' },
    ],
    examples: [
      {
        title: 'Work it out',
        situation:
          'After skipping, Ama counts 30 beats in 15 seconds. What is her heart rate?',
        steps: ['A minute is four lots of 15 seconds.', '30 × 4 = 120.'],
        answer: 'Her heart rate is 120 beats a minute.',
      },
      {
        title: 'Rest and exercise',
        situation:
          'At rest Yaw counts 21 beats in 15 seconds. After running he counts 35. What changed?',
        steps: [
          'At rest: 21 × 4 = 84 beats a minute.',
          'After running: 35 × 4 = 140 beats a minute.',
        ],
        answer:
          'Running made his heart beat much faster, to send more blood to his muscles.',
      },
    ],
    mistakes: [
      {
        wrong: 'Pressing too hard, so the pulse disappears.',
        right: 'Press gently with two fingertips.',
      },
      {
        wrong: 'Counting with your thumb.',
        right: 'Use your first two fingers.',
      },
    ],
    realLife: [
      'Doctors and nurses check your pulse.',
      'Athletes use heart rate to train well.',
      'Some watches and phones measure heart rate.',
    ],
    tryIt: {
      need: 'A clock or watch with seconds',
      steps: [
        'Count your pulse at rest for 15 seconds and multiply by 4.',
        'Jog on the spot for 1 minute.',
        'Count again at once.',
        'Rest for 2 minutes and count once more. What do you notice?',
      ],
    },
    safety: [
      'If your heart races and will not slow down, or your chest hurts, stop and tell an adult.',
    ],
  },
  'pe-17': {
    indicator: {
      code: 'B5.4.2.4.1',
      text: 'Explain why dehydration impairs temperature regulation and physical and mental performance.',
    },
    hook: 'On a hot afternoon of football, your body loses water every minute. What happens if you do not drink?',
    explain: [
      'More than half of your body is water. Water carries food to your cells, keeps your joints moving smoothly and helps you think clearly.',
      'When you are hot, you sweat. As sweat dries on your skin, it carries heat away and cools you down.',
      'Dehydration means your body has lost too much water. Then you cannot sweat as well, so you overheat. You get tired, may get a headache and find it hard to concentrate.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      sun: true,
      people: [{ pose: 'drink', x: 320, kit: 1, holds: 'bottle' }],
      label: 'Drink water before, during and after exercise',
    },
    artCaption: 'Sip water often, especially in the heat.',
    words: [
      {
        term: 'Dehydration',
        meaning: 'When the body has lost too much water.',
      },
      {
        term: 'Sweat',
        meaning: 'Water from your skin that cools you as it dries.',
      },
      {
        term: 'Temperature regulation',
        meaning: 'How your body keeps itself at the right warmth.',
      },
    ],
    examples: [
      {
        title: 'Spot the signs',
        situation:
          'After playing in the sun, Kojo has a headache, feels very tired and his mouth is dry. What could be wrong?',
        steps: [
          'A dry mouth means thirst.',
          'A headache and tiredness are other signs.',
          'He played in the heat and sweated a lot.',
        ],
        answer:
          'He may be dehydrated. He should rest in the shade and sip water.',
      },
    ],
    mistakes: [
      {
        wrong: 'Waiting until you are very thirsty to drink.',
        right: 'Thirst is a late sign. Drink a little and often.',
      },
      {
        wrong: 'Drinking only sugary drinks during sport.',
        right: 'Plain clean water is best for most activity.',
      },
    ],
    realLife: [
      'Taking a water bottle to school.',
      'Drinking water at half-time in a match.',
      'Resting in the shade on very hot days.',
    ],
    tryIt: {
      need: 'A water bottle and a notebook',
      steps: [
        'For one school day, write down each time you drink water.',
        'Note when you felt tired or had a headache.',
        'Do you see a pattern?',
      ],
    },
    safety: [
      'Drink only clean, safe water.',
      'If someone stops sweating and feels confused in the heat, tell an adult at once.',
    ],
  },
  'pe-18': {
    indicator: {
      code: 'B5.4.3.4.1',
      text: 'Describe the role of muscle strength and proper lifting in the prevention of back injuries.',
    },
    hook: 'Many children carry buckets of water and bags of books every day. Lifting the right way protects your back for life.',
    explain: [
      'Your back has a column of small bones called the spine. Muscles around it hold it steady. Strong tummy and back muscles protect it.',
      'Your leg muscles are the strongest in your body. Use them to lift, not your back.',
      'To lift safely: stand close, bend your knees, keep your back straight, hold the load close, then stand up using your legs. Do not twist while you lift.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'liftGood', x: 190, kit: 1, holds: 'box', mark: 'good' },
        { pose: 'liftBad', x: 460, kit: 0, holds: 'box', mark: 'bad' },
      ],
      label: 'Bend your knees, not your back',
    },
    artCaption:
      'Left: knees bent, back straight. Right: back bent, which can hurt it.',
    words: [
      {
        term: 'Spine',
        meaning: 'The column of bones down the middle of your back.',
      },
      { term: 'Posture', meaning: 'How you hold your body.' },
      { term: 'Load', meaning: 'Something heavy that you carry.' },
    ],
    examples: [
      {
        title: 'Lift a bucket of water',
        situation:
          'You must lift a full bucket of water from the ground. How do you do it safely?',
        steps: [
          'Stand close, with your feet apart.',
          'Bend your knees and keep your back straight.',
          'Grip the handle firmly, close to your body.',
          'Stand up using your legs.',
        ],
        answer: 'Your legs do the work, so your back is protected.',
        art: {
          kind: 'people',
          ground: 'compound',
          people: [
            { pose: 'liftGood', x: 320, kit: 2, holds: 'box', mark: 'good' },
          ],
        },
      },
    ],
    mistakes: [
      {
        wrong: 'Bending over with straight legs to pick something up.',
        right: 'Bend your knees and keep your back straight.',
      },
      {
        wrong: 'Twisting while you hold something heavy.',
        right: 'Turn your whole body by moving your feet.',
      },
    ],
    realLife: [
      'Carrying water, firewood or shopping.',
      'Lifting your school bag.',
      'Helping to move chairs and tables.',
    ],
    tryIt: {
      need: 'A light box or bag of books',
      steps: [
        'Show the safe lift to a family member.',
        'Ask them to watch for a straight back.',
        'Practise five times. Then teach them!',
      ],
    },
    safety: [
      'Never lift something too heavy for you. Ask for help or share the load.',
      'Wear your school bag on both shoulders.',
    ],
  },
  'pe-19': {
    indicator: {
      code: 'B5.5.1.5.1',
      text: 'Participate independently in fitness and skill development activities outside school.',
    },
    hook: 'PE lessons are only a small part of your week. What can you do to stay active at home?',
    explain: [
      'Children need about 60 minutes of active play every day. It strengthens your heart, bones and muscles, and helps you sleep and learn.',
      'You do not need a stadium. Ampe, skipping rope, football, dancing, running errands on foot and helping at home all count.',
      'Being independent means choosing to be active yourself. Plan it, do it and keep track of it.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'jumpUp', x: 200, kit: 2 },
        { pose: 'jumpUp', x: 300, facing: -1, kit: 3 },
        { pose: 'kick', x: 470, kit: 0 },
      ],
      balls: [[540, 292]],
      label: 'Ampe and football after school',
    },
    artCaption: 'Active games count as exercise.',
    words: [
      { term: 'Active', meaning: 'Moving your body enough to breathe faster.' },
      {
        term: 'Independent',
        meaning: 'Doing something by your own choice, without being told.',
      },
      { term: 'Routine', meaning: 'Something you do regularly.' },
    ],
    examples: [
      {
        title: 'Plan your week',
        situation:
          'Ama is active for 20 minutes walking to school and 25 minutes playing ampe. How many more minutes does she need to reach 60?',
        steps: [
          'Add her active time: 20 + 25 = 45.',
          'Find what is left: 60 − 45 = 15.',
        ],
        answer:
          'She needs 15 more minutes, such as a skipping game after dinner.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only sport at school counts.',
        right: 'Any play that makes you breathe faster counts.',
      },
    ],
    realLife: [
      'Ampe and skipping with friends.',
      'Football in the neighbourhood.',
      'Walking or cycling to places nearby.',
    ],
    tryIt: {
      need: 'A notebook for an activity diary',
      steps: [
        'Write down every active thing you do for one week.',
        'Add up the minutes each day.',
        'Which day was the most active?',
        'Set yourself a goal for next week.',
      ],
    },
    safety: [
      'Play in safe places, away from roads and gutters.',
      'Always tell an adult where you are going.',
    ],
  },
  'pe-20': {
    indicator: {
      code: 'B5.5.4.5.1',
      text: 'Contribute ideas and listen to the ideas of others in cooperative problem-solving activities.',
    },
    hook: 'Your relay team must choose the running order. Everyone has an opinion. How do you decide together?',
    explain: [
      'In a cooperative activity, the group wins together. Every person’s ideas count.',
      'Good teammates listen while others talk, wait for their turn, and build on others’ ideas, saying “Yes, and…”.',
      'When you disagree, explain your reasons calmly, and then decide fairly, such as by a vote. Praise good ideas. “Ayekoo!”',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'stand', x: 160, kit: 1 },
        { pose: 'raise', x: 290, kit: 2 },
        { pose: 'stand', x: 420, facing: -1, kit: 3 },
        { pose: 'stand', x: 530, facing: -1, kit: 0 },
      ],
      label: 'Take turns to share ideas',
    },
    artCaption: 'One person speaks while the others listen.',
    words: [
      { term: 'Cooperate', meaning: 'Work together towards a shared goal.' },
      { term: 'Contribute', meaning: 'Give your own idea or help.' },
      {
        term: 'Compromise',
        meaning: 'Agree on a choice where everyone gives a little.',
      },
    ],
    examples: [
      {
        title: 'Choose the relay order',
        situation:
          'Your team of four must choose the running order. Two people both want to run last.',
        steps: [
          'Each person says one reason for their choice.',
          'The team listens without interrupting.',
          'Try both orders in practice and time them.',
          'Choose the faster order, and praise both runners.',
        ],
        answer:
          'A fair test settles the disagreement, and everyone feels heard.',
      },
    ],
    mistakes: [
      {
        wrong: 'Talking over others to get your idea chosen.',
        right: 'Wait your turn, then explain your idea.',
      },
      {
        wrong: 'Sulking when your idea is not chosen.',
        right: 'Support the team’s choice and give it your best.',
      },
    ],
    realLife: [
      'Planning games with friends.',
      'Group work in class.',
      'Sharing chores at home.',
    ],
    tryIt: {
      need: 'A group of three or four',
      steps: [
        'Choose a challenge, such as moving a ball across a space without using your hands.',
        'Each person suggests one idea.',
        'Try the ideas, then choose the best.',
        'Say one thing each teammate did well.',
      ],
    },
    safety: ['Agree on the rules before starting a group game.'],
  },
}
