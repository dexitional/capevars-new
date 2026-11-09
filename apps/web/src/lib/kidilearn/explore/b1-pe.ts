import type { CourseGuides } from './types'

// Basic 1 Physical Education, written for this course and scoped to the NaCCA
// Physical Education Curriculum for Primary Schools (2019), for five- and
// six-year-olds. Notes:
// - Codes are the curriculum's own. Misprints are given as the sequence
//   requires: sit and reach (B1.3.3.4.1) is B1.3.3.3.1, and human body parts
//   (B1.3.4.5.1) is B1.3.5.3.1.
// - Lesson 3's balancing in shapes has no Basic 1 indicator; it is linked to
//   B1.2.5.2.1, the base of support of balanced objects.
// - The curriculum says push-ups use the "biceps and triceps". They mainly
//   work the arms' triceps and the chest; children start on their knees.
// - Lessons 13 and 16 both name body parts: 13 the parts we move with,
//   16 the body as a whole, inside and out.

export const guides: CourseGuides = {
  'pe-01': {
    indicator: {
      code: 'B1.1.2.1.1',
      text: 'Roll a ball from a stationary position using the hands.',
    },
    hook: 'Can you roll a ball along the ground to a friend?',
    explain: [
      'Crouch down low.',
      'Hold the ball with two hands.',
      'Push it gently along the ground to your friend.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [{ pose: 'crouch', x: 220, kit: 1 }],
      balls: [[330, 290]],
      label: 'Crouch low and push gently',
    },
    artCaption: 'The ball rolls along the ground.',
    words: [
      { term: 'Roll', meaning: 'Push a ball along the ground.' },
      { term: 'Crouch', meaning: 'Bend low.' },
      { term: 'Gently', meaning: 'Softly, not hard.' },
    ],
    examples: [
      {
        title: 'Roll to a friend',
        situation:
          'Your friend sits in front of you. How do you roll the ball?',
        steps: [
          'Look at your friend.',
          'Push the ball gently.',
          'Keep it on the ground.',
        ],
        answer: 'Your friend can stop it.',
      },
    ],
    mistakes: [
      {
        wrong: 'Throwing the ball up high.',
        right: 'Keep the ball on the ground.',
      },
    ],
    realLife: [
      'Playing ball with friends.',
      'Bowling games.',
      'Sharing a ball.',
    ],
    tryIt: {
      need: 'A soft ball and a friend',
      steps: [
        'Sit facing your friend.',
        'Roll the ball to them.',
        'Roll it back and forth ten times.',
      ],
    },
    safety: ['Use a soft ball.', 'Play on flat ground.'],
  },
  'pe-02': {
    indicator: {
      code: 'B1.1.1.1.1',
      text: 'Travel over, under, in front of, behind and through objects using walking, jumping and crawling.',
    },
    hook: 'Can you go over a rope, under a table and around a chair?',
    explain: [
      'Over means across the top.',
      'Under means below.',
      'Through means in one side and out the other.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'leap', x: 220, kit: 2 },
        { pose: 'crouch', x: 440, kit: 3 },
      ],
      label: 'Over and under',
    },
    artCaption: 'Jump over, crawl under.',
    words: [
      { term: 'Over', meaning: 'Across the top.' },
      { term: 'Under', meaning: 'Below.' },
      { term: 'Through', meaning: 'In one side and out the other.' },
    ],
    examples: [
      {
        title: 'The obstacle path',
        situation: 'There is a rope, a box and a hoop. How do you go?',
        steps: [
          'Step over the rope.',
          'Walk around the box.',
          'Crawl through the hoop.',
        ],
        answer: 'Over, around and through.',
      },
    ],
    mistakes: [
      {
        wrong: 'Rushing and bumping into things.',
        right: 'Go slowly and look.',
      },
    ],
    realLife: [
      'Playground games.',
      'Climbing at the park.',
      'Moving around the house.',
    ],
    tryIt: {
      need: 'A rope, a box and a hoop',
      steps: [
        'Step over the rope.',
        'Crawl under or through the hoop.',
        'Walk around the box.',
      ],
    },
    safety: [
      'Use soft, safe things to go over and under.',
      'Go one at a time.',
    ],
  },
  'pe-03': {
    indicator: {
      code: 'B1.2.5.2.1',
      text: 'Balance still in different shapes, and identify the base of support.',
    },
    hook: 'Can you be a statue? Stand very still on one foot!',
    explain: [
      'Balance means staying still without falling.',
      'You can balance on one foot, or on your bottom.',
      'The part touching the ground is your base.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'beam', x: 220, kit: 1 },
        { pose: 'seatLift', x: 430, kit: 2 },
      ],
      label: 'Be a still statue',
    },
    artCaption: 'Arms out help you balance.',
    words: [
      { term: 'Balance', meaning: 'Staying still without falling.' },
      { term: 'Statue', meaning: 'Someone standing very still.' },
      { term: 'Base', meaning: 'The part touching the ground.' },
    ],
    examples: [
      {
        title: 'Statue game',
        situation: 'The music stops. What do you do?',
        steps: ['Stop moving.', 'Make a shape.', 'Stay very still.'],
        answer: 'Be a statue until the music starts.',
      },
    ],
    mistakes: [
      {
        wrong: 'Wobbling and giving up.',
        right: 'Put your arms out and try again.',
      },
    ],
    realLife: ['Putting on shoes.', 'Standing in a line.', 'Dancing games.'],
    tryIt: {
      need: 'Music',
      steps: [
        'Dance while the music plays.',
        'Freeze in a shape when it stops.',
        'Try a shape on one foot.',
      ],
    },
    safety: ['Balance on soft, flat ground.', 'Keep space around you.'],
  },
  'pe-04': {
    indicator: {
      code: 'B1.1.2.1.2',
      text: 'Strike a light ball upward continuously, using the arms, hands and feet.',
    },
    hook: 'Can you keep a balloon up in the air?',
    explain: [
      'Hit the balloon up with your hand.',
      'Watch it come down.',
      'Hit it up again. Try your arm and your foot too.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'forehand', x: 240, kit: 3 }],
      balls: [[300, 120]],
      label: 'Hit it up, watch it, hit again',
    },
    artCaption: 'Keep the ball in the air.',
    words: [
      { term: 'Strike', meaning: 'Hit.' },
      { term: 'Up', meaning: 'Towards the sky.' },
      { term: 'Light', meaning: 'Not heavy.' },
    ],
    examples: [
      {
        title: 'Count the hits',
        situation: 'How many times can you hit the balloon?',
        steps: ['Hit it up gently.', 'Count each hit.'],
        answer: 'Try to beat your number.',
      },
    ],
    mistakes: [{ wrong: 'Hitting very hard.', right: 'Small, gentle hits.' }],
    realLife: ['Balloon games at parties.', 'Volleyball.', 'Football.'],
    tryIt: {
      need: 'A balloon',
      steps: [
        'Hit it up with your hand.',
        'Hit it with your arm.',
        'Tap it with your foot.',
      ],
    },
    safety: [
      'Play with a balloon or soft ball.',
      'Keep away from tables and walls.',
    ],
  },
  'pe-05': {
    indicator: {
      code: 'B1.1.2.1.3',
      text: 'Strike a light ball upward continuously, using a large, short-handled paddle.',
    },
    hook: 'A bat can hit a ball too. Can you bounce a ball up on a bat?',
    explain: [
      'Hold the bat flat, like a plate.',
      'Put a light ball on it.',
      'Tap the ball up gently, again and again.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'forehand', x: 260, kit: 1, holds: 'racket' }],
      balls: [[330, 130]],
      label: 'Bat flat, tap the ball up',
    },
    artCaption: 'Gentle taps keep the ball up.',
    words: [
      { term: 'Bat', meaning: 'A flat thing to hit a ball with.' },
      { term: 'Tap', meaning: 'A small, gentle hit.' },
      { term: 'Flat', meaning: 'Level, like a table.' },
    ],
    examples: [
      {
        title: 'Bat bounces',
        situation: 'How do you keep the ball on the bat?',
        steps: [
          'Hold the bat flat.',
          'Tap the ball just a little.',
          'Watch the ball.',
        ],
        answer: 'Small taps, eyes on the ball.',
      },
    ],
    mistakes: [
      {
        wrong: 'Tilting the bat, so the ball rolls off.',
        right: 'Keep the bat flat.',
      },
    ],
    realLife: ['Table tennis.', 'Tennis.', 'Bat games with friends.'],
    tryIt: {
      need: 'A bat and a light ball, or a balloon',
      steps: [
        'Balance the ball on the bat.',
        'Tap it up once.',
        'Try to tap it up five times.',
      ],
    },
    safety: [
      'Keep space around you before you swing.',
      'Use a light ball or balloon.',
    ],
  },
  'pe-06': {
    indicator: {
      code: 'B1.1.2.1.5',
      text: 'Throw and catch a self-tossed ball.',
    },
    hook: 'Can you throw a ball up and catch it yourself?',
    explain: [
      'Toss the ball up a little way.',
      'Watch it with your eyes.',
      'Catch it with two hands.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'catch', x: 300, kit: 2 }],
      balls: [[350, 110]],
      label: 'Toss up, watch, catch',
    },
    artCaption: 'Watch the ball all the way.',
    words: [
      { term: 'Toss', meaning: 'Throw gently.' },
      { term: 'Catch', meaning: 'Hold a ball that comes to you.' },
      { term: 'Watch', meaning: 'Look carefully.' },
    ],
    examples: [
      {
        title: 'Just a little',
        situation: 'Should you throw the ball very high?',
        steps: ['Start with small tosses.', 'Go higher when you can catch it.'],
        answer: 'Small tosses first.',
      },
    ],
    mistakes: [
      { wrong: 'Closing your eyes.', right: 'Keep watching the ball.' },
    ],
    realLife: ['Playing catch.', 'Juggling.', 'Ball games.'],
    tryIt: {
      need: 'A soft ball or a bean bag',
      steps: [
        'Toss it up a little and catch it.',
        'Count your catches.',
        'Clap once before you catch.',
      ],
    },
    safety: ['Use a soft ball or bean bag.', 'Stand away from others.'],
  },
  'pe-07': {
    indicator: { code: 'B1.1.2.1.7', text: 'Kick a stationary ball.' },
    hook: 'The ball is still. Can you kick it to a friend?',
    explain: [
      'Stand next to the ball.',
      'Swing your kicking leg back.',
      'Kick the ball with the inside of your foot.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'kick', x: 280, kit: 1 }],
      balls: [[360, 270]],
      label: 'Swing back, then kick',
    },
    artCaption: 'Use the inside of your foot.',
    words: [
      { term: 'Kick', meaning: 'Hit a ball with your foot.' },
      { term: 'Still', meaning: 'Not moving.' },
      { term: 'Swing', meaning: 'Move your leg back and forward.' },
    ],
    examples: [
      {
        title: 'To a friend',
        situation: 'How do you kick the ball to a friend?',
        steps: ['Look at your friend.', 'Swing your leg.', 'Kick gently.'],
        answer: 'The ball rolls to your friend.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking with your toes.',
        right: 'Use the inside of your foot.',
      },
    ],
    realLife: ['Football.', 'Playing with friends.', 'Games at break.'],
    tryIt: {
      need: 'A soft football',
      steps: [
        'Put the ball on the ground.',
        'Kick it to a friend.',
        'Kick it between two stones.',
      ],
    },
    safety: ['Use a soft ball.', 'Check nobody is too close.'],
  },
  'pe-08': {
    indicator: {
      code: 'B1.1.2.1.9',
      text: 'Move a ball forward while dribbling with the hand and with the foot, varying the force.',
    },
    hook: 'Can you move a ball along by bouncing it? Can you move it with your feet too?',
    explain: [
      'With your hand, bounce the ball as you walk.',
      'With your foot, tap the ball as you walk.',
      'Soft pushes keep it close. Big pushes send it far.',
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
      label: 'Hand and foot dribbling',
    },
    artCaption: 'Soft pushes keep the ball close.',
    words: [
      { term: 'Dribble', meaning: 'Move a ball with small pushes.' },
      { term: 'Push', meaning: 'Move something away from you.' },
      { term: 'Force', meaning: 'How hard you push.' },
    ],
    examples: [
      {
        title: 'Soft or hard?',
        situation: 'The ball keeps running away. What do you change?',
        steps: ['Your pushes are too hard.', 'Use softer pushes.'],
        answer: 'Push more softly.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking the ball far ahead.',
        right: 'Use small, soft pushes.',
      },
    ],
    realLife: ['Basketball.', 'Football.', 'Playing with a ball.'],
    tryIt: {
      need: 'A bouncy ball',
      steps: [
        'Bounce the ball as you walk.',
        'Tap the ball with your feet as you walk.',
        'Try soft and hard pushes.',
      ],
    },
    safety: ['Walk, do not run, at first.', 'Look where you are going.'],
  },
  'pe-09': {
    indicator: {
      code: 'B1.1.2.1.10',
      text: 'Dribble a ball in a forward direction, using the inside of the foot.',
    },
    hook: 'Can you walk a ball along a line using only your feet?',
    explain: [
      'Use the inside of your foot.',
      'Tap the ball gently forward.',
      'Walk after it and tap again.',
    ],
    art: {
      kind: 'course',
      path: 'line',
      ball: true,
      label: 'Tap the ball along the line',
    },
    artCaption: 'Small taps in a straight line.',
    words: [
      { term: 'Forward', meaning: 'The way you are facing.' },
      {
        term: 'Inside of the foot',
        meaning: 'The side of your foot near your big toe.',
      },
      { term: 'Line', meaning: 'A straight mark.' },
    ],
    examples: [
      {
        title: 'Along the cones',
        situation: 'How do you dribble to the end of a line?',
        steps: ['Tap the ball.', 'Walk to it.', 'Tap it again.'],
        answer: 'Tap, walk, tap.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking the ball too hard.',
        right: 'Small taps keep it close.',
      },
    ],
    realLife: ['Football.', 'Games with friends.', 'Playing at home.'],
    tryIt: {
      need: 'A football and some stones or cones',
      steps: [
        'Make a straight line of stones.',
        'Tap the ball along the line.',
        'Try with your other foot.',
      ],
    },
    safety: ['Play on flat ground.', 'Look up so you do not bump into anyone.'],
  },
  'pe-10': {
    indicator: {
      code: 'B1.1.3.1.2',
      text: 'Change smoothly between even-beat and uneven-beat movements, in time to music or a beat.',
    },
    hook: 'Listen to the drum! Walk to a steady beat, then skip to a bouncy beat.',
    explain: [
      'A steady beat goes tap, tap, tap. We walk to it.',
      'A bouncy beat goes ta-tum, ta-tum. We skip or gallop to it.',
      'Listen, then change when the beat changes.',
    ],
    art: {
      kind: 'repeat',
      items: ['clap', 'clap', 'clap', 'clap', 'clap', 'clap'],
      label: 'A steady beat: tap, tap, tap',
    },
    artCaption: 'Every clap is the same distance apart.',
    words: [
      { term: 'Beat', meaning: 'The steady sound in music.' },
      { term: 'Steady', meaning: 'Always the same.' },
      { term: 'Skip', meaning: 'Step and hop, step and hop.' },
    ],
    examples: [
      {
        title: 'The drum changes',
        situation:
          'The drum goes from tap, tap to ta-tum, ta-tum. What do you do?',
        steps: ['Stop walking.', 'Start skipping.'],
        answer: 'Change with the beat.',
      },
    ],
    mistakes: [
      {
        wrong: 'Not listening to the drum.',
        right: 'Listen first, then move.',
      },
    ],
    realLife: ['Dancing.', 'Marching.', 'Music games.'],
    tryIt: {
      need: 'A drum, or hands to clap',
      steps: [
        'Walk to a steady beat.',
        'Skip to a bouncy beat.',
        'Change when the beat changes.',
      ],
    },
    safety: ['Keep your own space.', 'Stop when the drum stops.'],
  },
  'pe-11': {
    indicator: { code: 'B1.2.1.2.1', text: 'Identify personal space.' },
    hook: 'Stretch out your arms and turn around. That bubble around you is your personal space!',
    explain: [
      'Your personal space is the space all around you.',
      'Stretch your arms out to feel it.',
      'Keep out of other people’s space, and they keep out of yours.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'reach', x: 120, kit: 1 },
        { pose: 'reach', x: 320, kit: 2 },
        { pose: 'reach', x: 520, kit: 3 },
      ],
      label: 'Arms out: your space bubble',
    },
    artCaption: 'Everyone has their own space.',
    words: [
      { term: 'Personal space', meaning: 'The space all around you.' },
      { term: 'Bubble', meaning: 'A round space you cannot see.' },
      { term: 'Stretch', meaning: 'Reach out far.' },
    ],
    examples: [
      {
        title: 'Bubble check',
        situation: 'Can you touch anyone when your arms are out?',
        steps: ['Stretch your arms out.', 'Turn slowly around.'],
        answer: 'If not, you have your own space.',
      },
    ],
    mistakes: [
      {
        wrong: 'Standing too close to a friend.',
        right: 'Step back until your arms are free.',
      },
    ],
    realLife: ['Lining up.', 'Playing games.', 'Dancing.'],
    tryIt: {
      need: 'A clear space',
      steps: [
        'Stretch your arms out.',
        'Move around without popping anyone’s bubble.',
        'Freeze when the teacher claps.',
      ],
    },
    safety: ['Look where you are going.', 'Stop when you hear the signal.'],
  },
  'pe-12': {
    indicator: {
      code: 'B1.2.3.2.1',
      text: 'Explain the differences and similarities between a jog and a run, a hop and a jump, and a gallop and a slide.',
    },
    hook: 'A jog and a run are both moving fast. But they are not the same!',
    explain: [
      'A jog is slow. A run is fast.',
      'A hop is on one foot. A jump is on two feet.',
      'A gallop goes forward. A slide goes to the side.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 150, kit: 1 },
        { pose: 'skip', x: 330, kit: 2 },
        { pose: 'jumpUp', x: 500, kit: 3 },
      ],
      label: 'Run, hop, jump',
    },
    artCaption: 'Each one moves your body differently.',
    words: [
      { term: 'Jog', meaning: 'Run slowly.' },
      { term: 'Hop', meaning: 'Jump on one foot.' },
      { term: 'Slide', meaning: 'Step to the side.' },
    ],
    examples: [
      {
        title: 'Hop or jump?',
        situation: 'You go up on one foot. Is it a hop or a jump?',
        steps: ['One foot is a hop.'],
        answer: 'A hop.',
      },
    ],
    mistakes: [
      {
        wrong: 'Changing feet when you hop.',
        right: 'A hop stays on one foot.',
      },
    ],
    realLife: ['Playground games.', 'Hopscotch.', 'Dancing.'],
    tryIt: {
      need: 'A clear space',
      steps: ['Jog, then run.', 'Hop, then jump.', 'Gallop, then slide.'],
    },
    safety: ['Land softly with bent knees.', 'Keep your own space.'],
  },
  'pe-13': {
    indicator: { code: 'B1.2.4.2.1', text: 'Identify body parts.' },
    hook: 'Point to your head! Now your knees! Which parts do you use to move?',
    explain: [
      'Our body has a head, neck, chest, arms, hands, legs and feet.',
      'We use our legs and feet to walk and run.',
      'We use our arms and hands to throw and catch.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [{ pose: 'stand', x: 320, kit: 2 }],
      label: 'Head, chest, arms, hands, legs, feet',
    },
    artCaption: 'Point to each part.',
    words: [
      { term: 'Head', meaning: 'The top part of your body.' },
      { term: 'Chest', meaning: 'The front of your body, below your neck.' },
      { term: 'Legs', meaning: 'The long parts you stand on.' },
    ],
    examples: [
      {
        title: 'Which part?',
        situation: 'You kick a ball. Which body part do you use?',
        steps: ['You kick with your foot.', 'Your leg swings.'],
        answer: 'Your foot and leg.',
      },
    ],
    mistakes: [
      {
        wrong: 'Mixing up your elbow and your knee.',
        right: 'Your elbow is in your arm. Your knee is in your leg.',
      },
    ],
    realLife: [
      'Getting dressed.',
      'Telling a nurse where it hurts.',
      'Playing games.',
    ],
    tryIt: {
      need: 'A friend',
      steps: [
        'Your friend says a body part.',
        'You touch it.',
        'Swap and play again.',
      ],
    },
    safety: ['Touch only your own body.', 'Play gently.'],
  },
  'pe-14': {
    indicator: {
      code: 'B1.2.5.2.2',
      text: 'Identify different opportunities to use striking skills.',
    },
    hook: 'Striking means hitting. Where do we hit balls in games?',
    explain: [
      'We strike with our hands in volleyball.',
      'We strike with a bat in table tennis and cricket.',
      'We strike with our feet in football.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'forehand', x: 220, kit: 1, holds: 'racket' },
        { pose: 'kick', x: 440, kit: 3 },
      ],
      balls: [
        [300, 150],
        [520, 270],
      ],
      label: 'Strike with a bat, strike with a foot',
    },
    artCaption: 'Many games use striking.',
    words: [
      { term: 'Strike', meaning: 'Hit.' },
      { term: 'Bat', meaning: 'A tool for hitting a ball.' },
      { term: 'Game', meaning: 'Something we play with rules.' },
    ],
    examples: [
      {
        title: 'Name the game',
        situation: 'You hit a ball with your foot. Which game is that?',
        steps: ['Feet hit the ball in football.'],
        answer: 'Football.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking striking only means kicking.',
        right: 'We strike with hands, bats and feet.',
      },
    ],
    realLife: ['Football.', 'Table tennis.', 'Volleyball.'],
    tryIt: {
      need: 'A balloon and a bat',
      steps: [
        'Hit the balloon with your hand.',
        'Hit it with a bat.',
        'Kick a soft ball.',
      ],
    },
    safety: [
      'Keep space around you before you hit.',
      'Use soft balls and balloons.',
    ],
  },
  'pe-15': {
    indicator: {
      code: 'B1.3.2.3.1',
      text: 'Perform four continuous push-ups.',
    },
    hook: 'Push-ups make your arms strong. Can you do four?',
    explain: [
      'Lie face down with your hands under your shoulders.',
      'Push up until your arms are straight.',
      'Bend your arms to go down slowly. Start on your knees.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'pushUp', x: 220, kit: 1 },
        { pose: 'pushDown', x: 450, kit: 1 },
      ],
      label: 'Push up, then down slowly',
    },
    artCaption: 'Push-ups make your arms and chest strong.',
    words: [
      { term: 'Push-up', meaning: 'Pushing your body up with your arms.' },
      { term: 'Straight', meaning: 'Not bent.' },
      { term: 'Strong', meaning: 'Able to push and lift.' },
    ],
    examples: [
      {
        title: 'Count to four',
        situation: 'How do you do four push-ups in a row?',
        steps: ['Up, down: one.', 'Up, down: two.', 'Keep going to four.'],
        answer: 'Four push-ups.',
      },
    ],
    mistakes: [
      { wrong: 'Dropping down with a bump.', right: 'Go down slowly.' },
    ],
    realLife: ['Getting up from the floor.', 'Climbing.', 'Carrying things.'],
    tryIt: {
      need: 'A mat',
      steps: [
        'Do push-ups on your knees.',
        'Count to four.',
        'Rest, then try again.',
      ],
    },
    safety: ['Use a mat.', 'Start on your knees, and stop if it hurts.'],
  },
  'pe-16': {
    indicator: { code: 'B1.3.5.3.1', text: 'Identify human body parts.' },
    hook: 'Your heart is inside your chest. Can you feel it beating?',
    explain: [
      'Our body has parts outside, like arms and legs.',
      'It has parts inside too, like the heart and lungs.',
      'The heart beats faster when we play.',
    ],
    art: { kind: 'pulse', label: 'Feel your heart after playing' },
    artCaption: 'Your heart beats faster when you move.',
    words: [
      { term: 'Heart', meaning: 'The part inside that beats.' },
      { term: 'Lungs', meaning: 'The parts inside that breathe air.' },
      { term: 'Inside', meaning: 'Within your body.' },
    ],
    examples: [
      {
        title: 'Feel it',
        situation:
          'Jump ten times, then put your hand on your chest. What do you feel?',
        steps: ['Your heart is beating fast.'],
        answer: 'Playing makes your heart work.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking the heart is in your tummy.',
        right: 'Your heart is in your chest.',
      },
    ],
    realLife: [
      'Visiting the doctor.',
      'Breathing hard after running.',
      'Growing strong.',
    ],
    tryIt: {
      need: 'A clear space',
      steps: [
        'Sit still and feel your heart.',
        'Jump ten times.',
        'Feel your heart again.',
      ],
    },
    safety: ['Rest if you feel dizzy.', 'Be kind when talking about bodies.'],
  },
  'pe-17': {
    indicator: {
      code: 'B1.4.1.4.1',
      text: 'Take part in enjoyable physical activities for increasing periods of time.',
    },
    hook: 'What is your favourite way to play? Let us play it a little longer each day!',
    explain: [
      'Playing every day keeps you healthy.',
      'Choose games you enjoy, like dancing, skipping or football.',
      'Play a little longer each time.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'dance', x: 140, kit: 1 },
        { pose: 'skip', x: 330, kit: 2 },
        { pose: 'run', x: 510, kit: 3 },
      ],
      sun: true,
      label: 'Dancing, skipping, running',
    },
    artCaption: 'Find the games you enjoy.',
    words: [
      { term: 'Enjoy', meaning: 'Have fun doing something.' },
      { term: 'Healthy', meaning: 'Well and strong.' },
      { term: 'Longer', meaning: 'For more time.' },
    ],
    examples: [
      {
        title: 'A little more',
        situation: 'You skipped for 2 minutes today. What about tomorrow?',
        steps: ['Add a little more time.', '2 + 1 = 3.'],
        answer: 'Try 3 minutes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Playing so hard you feel sick.',
        right: 'Play at a pace you enjoy, and rest when you need to.',
      },
    ],
    realLife: [
      'Playing at break.',
      'Games with family.',
      'Dancing at parties.',
    ],
    tryIt: {
      need: 'A clear space',
      steps: [
        'Choose a game you enjoy.',
        'Play it for a few minutes.',
        'Play a little longer tomorrow.',
      ],
    },
    safety: ['Drink water.', 'Rest in the shade when it is hot.'],
  },
  'pe-18': {
    indicator: {
      code: 'B1.4.3.4.1',
      text: 'Explain the purpose of warming up before and cooling down after physical activity.',
    },
    hook: 'Before we play, we warm up. After we play, we cool down. Why?',
    explain: [
      'Warming up gets your body ready, so you do not get hurt.',
      'March, jog and swing your arms gently.',
      'Cooling down helps your body rest. Walk slowly and breathe deeply.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 220, kit: 1 },
        { pose: 'walk', x: 440, kit: 1 },
      ],
      label: 'Warm up first, cool down after',
    },
    artCaption: 'Start gently and finish gently.',
    words: [
      { term: 'Warm up', meaning: 'Gentle moves before playing.' },
      { term: 'Cool down', meaning: 'Slow moves after playing.' },
      { term: 'Ready', meaning: 'Prepared to start.' },
    ],
    examples: [
      {
        title: 'What first?',
        situation: 'You come out to play football. What do you do first?',
        steps: ['March and jog gently.', 'Swing your arms.'],
        answer: 'Warm up first.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stopping suddenly after running fast.',
        right: 'Slow down to a walk to cool down.',
      },
    ],
    realLife: ['Before sport.', 'Before dancing.', 'After a long walk.'],
    tryIt: {
      need: 'A clear space',
      steps: [
        'March and jog gently to warm up.',
        'Play a game.',
        'Walk slowly and breathe deeply to cool down.',
      ],
    },
    safety: ['Always warm up before you play.', 'Drink water after you play.'],
  },
  'pe-19': {
    indicator: {
      code: 'B1.5.2.5.1',
      text: 'Demonstrate sharing and cooperation in physical activity.',
    },
    hook: 'Games are more fun when we share and help each other!',
    explain: [
      'Sharing means letting others have a turn.',
      'Cooperation means working together.',
      'Pass the ball, wait your turn, and help your friends.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 200, kit: 1, holds: 'ball' },
        { pose: 'catch', x: 440, kit: 2, facing: -1 },
      ],
      label: 'Pass to a friend',
    },
    artCaption: 'Sharing the ball.',
    words: [
      { term: 'Share', meaning: 'Let others have some too.' },
      { term: 'Turn', meaning: 'Your time to have a go.' },
      { term: 'Cooperate', meaning: 'Work together.' },
    ],
    examples: [
      {
        title: 'One ball, two friends',
        situation: 'There is one ball and two of you. What do you do?',
        steps: ['Take turns.', 'Or pass it to each other.'],
        answer: 'Share it, so both can play.',
      },
    ],
    mistakes: [
      {
        wrong: 'Keeping the ball all the time.',
        right: 'Pass it so everyone plays.',
      },
    ],
    realLife: ['Playing at break.', 'Sharing toys at home.', 'Team games.'],
    tryIt: {
      need: 'A ball and some friends',
      steps: [
        'Stand in a circle.',
        'Pass the ball around.',
        'Say each friend’s name as you pass.',
      ],
    },
    safety: ['Pass gently.', 'Wait for your turn.'],
  },
  'pe-20': {
    indicator: {
      code: 'B1.5.4.5.1',
      text: 'Demonstrate how to solve a problem with another person during physical activity.',
    },
    hook: 'You bump into a friend in a game. What can you do to make it right?',
    explain: [
      'Stop and check that your friend is all right.',
      'Say sorry, and help them up.',
      'If you disagree, talk about it or ask your teacher.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'stand', x: 250, kit: 1 },
        { pose: 'stand', x: 400, kit: 3, facing: -1 },
      ],
      label: 'Say sorry, help up, play on',
    },
    artCaption: 'Kind words fix problems.',
    words: [
      {
        term: 'Sorry',
        meaning: 'A word that shows you feel bad about something.',
      },
      { term: 'Help', meaning: 'Make things easier for someone.' },
      { term: 'Disagree', meaning: 'Think differently.' },
    ],
    examples: [
      {
        title: 'A bump',
        situation: 'You knock a friend over by accident. What do you do?',
        steps: ['Stop.', 'Say sorry.', 'Help them up.'],
        answer: 'Then you can play again.',
      },
    ],
    mistakes: [
      {
        wrong: 'Walking away after a bump.',
        right: 'Stop, say sorry and help.',
      },
    ],
    realLife: ['Playing at break.', 'At home with family.', 'In class.'],
    tryIt: {
      need: 'A friend',
      steps: [
        'Act out a small bump in a game.',
        'Show how to say sorry and help.',
        'Swap and try again.',
      ],
    },
    safety: ['Never push or grab.', 'Ask a teacher for help.'],
  },
}
