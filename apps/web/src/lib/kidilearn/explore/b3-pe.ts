import type { CourseGuides } from './types'

// Basic 3 Physical Education, written for this course and scoped to the NaCCA
// Physical Education Curriculum for Primary Schools (2019). Notes:
// - Codes are the curriculum's own. The imported lessons carry shifted ones.
//   Lesson 18 repeats lesson 15's topic (body composition) under a code that
//   does not exist, so it shares B3.3.5.3.1 and takes a new angle.
// - Body composition is taught without numbers, weighing or comments about
//   anyone's body.
// - The curriculum lists running among uneven-beat movements. Running has an
//   even beat; galloping, sliding and skipping are uneven.
// - It suggests solving problems by embracing after activity. The guide
//   teaches talking, listening and agreeing, with a handshake only if both wish.

export const guides: CourseGuides = {
  'pe-01': {
    indicator: {
      code: 'B3.1.3.1.2',
      text: 'Roll forward from a standing position many times, in a round shape.',
    },
    hook: 'Can you curl up like a ball and roll forward? Round things roll smoothly!',
    explain: [
      'Squat down and put your hands flat on the mat.',
      'Tuck your chin onto your chest, so your back is round.',
      'Push with your feet and roll over on your back, then come up to standing.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [{ pose: 'crouch', x: 320, kit: 1 }],
      label: 'Squat, hands down, chin on chest',
    },
    artCaption: 'A round back rolls smoothly.',
    words: [
      {
        term: 'Forward roll',
        meaning: 'Rolling over forwards on your rounded back.',
      },
      { term: 'Tuck', meaning: 'Curl up small.' },
      { term: 'Mat', meaning: 'A soft cover for the floor.' },
    ],
    examples: [
      {
        title: 'Rolling again and again',
        situation: 'How do you do three rolls in a row?',
        steps: [
          'Finish the first roll in a squat.',
          'Put your hands down again.',
          'Tuck and roll again.',
        ],
        answer: 'End each roll in a squat, ready for the next.',
      },
    ],
    mistakes: [
      {
        wrong: 'Rolling on the top of your head.',
        right: 'Tuck your chin so your back takes your weight.',
      },
    ],
    realLife: [
      'Gymnastics.',
      'Falling safely in games.',
      'Playing on soft grass.',
    ],
    tryIt: {
      need: 'A thick mat and your teacher',
      steps: [
        'Rock forwards and backwards on your round back.',
        'Do one forward roll with your teacher helping.',
        'Try two rolls in a row.',
      ],
    },
    safety: [
      'Roll only on a mat or very soft grass.',
      'Your teacher should help you at first.',
      'Stop if your neck hurts.',
    ],
  },
  'pe-02': {
    indicator: {
      code: 'B3.1.1.1.1',
      text: 'Change direction forward and back, right and left, while walking, running, hopping and jumping.',
    },
    hook: 'Forward, back, left, right! Can you change direction as fast as your teacher calls?',
    explain: [
      'Forward means the way you are facing. Back means behind you.',
      'Left and right are the two sides.',
      'To change direction safely, slow down, then turn.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'walk', x: 200, kit: 2 },
        { pose: 'run', x: 430, kit: 2, facing: -1 },
      ],
      label: 'Forward, then back the other way',
    },
    artCaption: 'Look before you change direction.',
    words: [
      { term: 'Direction', meaning: 'The way you are going.' },
      { term: 'Forward', meaning: 'The way you face.' },
      { term: 'Backward', meaning: 'The way behind you.' },
    ],
    examples: [
      {
        title: 'The calling game',
        situation: 'Your teacher calls “hop left”. What do you do?',
        steps: ['Stand on one foot.', 'Hop to your left side.'],
        answer: 'Hop sideways to the left.',
      },
    ],
    mistakes: [
      {
        wrong: 'Running backwards fast without looking.',
        right: 'Walk backwards slowly and look over your shoulder.',
      },
    ],
    realLife: [
      'Dodging in chase games.',
      'Moving out of someone’s way.',
      'Dancing.',
    ],
    tryIt: {
      need: 'A clear space and a partner',
      steps: [
        'Your partner calls a direction and a movement.',
        'Move that way.',
        'Swap after ten calls.',
      ],
    },
    safety: [
      'Look where you are going.',
      'Keep away from walls and other people.',
    ],
  },
  'pe-03': {
    indicator: {
      code: 'B3.1.2.1.1',
      text: 'Roll a ball from standing still, forward and back, using a stick.',
    },
    hook: 'Can you move a ball along the ground using only a stick? Hockey players do it all the time!',
    explain: [
      'Hold the stick with both hands, one above the other.',
      'Keep the end of the stick on the ground, next to the ball.',
      'Push the ball gently forward, then pull it back.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'hockey', x: 290, kit: 2, holds: 'stick' }],
      balls: [[440, 288]],
      label: 'Gentle pushes keep the ball close',
    },
    artCaption: 'Keep the stick low.',
    words: [
      { term: 'Stick', meaning: 'A long piece of wood used to move a ball.' },
      { term: 'Push', meaning: 'Move something away from you.' },
      { term: 'Control', meaning: 'Keep the ball where you want it.' },
    ],
    examples: [
      {
        title: 'Forward and back',
        situation: 'How do you roll the ball forward, then back to you?',
        steps: [
          'Push it gently forward.',
          'Stop it with the stick.',
          'Pull it back towards you.',
        ],
        answer: 'Small, gentle pushes and pulls.',
      },
    ],
    mistakes: [
      {
        wrong: 'Hitting the ball hard.',
        right: 'Push gently so it stays close.',
      },
    ],
    realLife: ['Hockey.', 'Golf.', 'Games with sticks and balls.'],
    tryIt: {
      need: 'A stick and a ball',
      steps: [
        'Push and pull the ball ten times.',
        'Roll it to a partner.',
        'Roll it between two cones.',
      ],
    },
    safety: [
      'Keep the stick low, below your knees.',
      'Stand well apart from others.',
    ],
  },
  'pe-04': {
    indicator: {
      code: 'B3.1.2.1.3',
      text: 'Balance while moving and manipulating an object on a ground-level balance beam.',
    },
    hook: 'Can you walk along a beam while holding a ball above your head? It takes great balance!',
    explain: [
      'A ground-level beam is a narrow board lying flat on the floor.',
      'Look ahead, not down, and walk slowly.',
      'Keep your body tall and steady while you hold the ball.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [{ pose: 'beam', x: 320, kit: 3, holds: 'ball' }],
      label: 'Look ahead, walk slowly',
    },
    artCaption: 'Steady steps on a narrow beam.',
    words: [
      { term: 'Balance', meaning: 'Staying steady without falling.' },
      { term: 'Beam', meaning: 'A long, narrow board.' },
      { term: 'Steady', meaning: 'Still and calm.' },
    ],
    examples: [
      {
        title: 'Make it harder',
        situation: 'You can walk the beam easily. What next?',
        steps: [
          'Hold a ball in front of you.',
          'Then hold it above your head.',
          'Then pass it from hand to hand as you walk.',
        ],
        answer: 'Each step makes balance a bit harder.',
      },
    ],
    mistakes: [
      {
        wrong: 'Looking down at your feet.',
        right: 'Look at the end of the beam.',
      },
    ],
    realLife: [
      'Crossing a narrow bridge.',
      'Gymnastics.',
      'Carrying things while walking.',
    ],
    tryIt: {
      need: 'A plank on the ground, or a chalk line, and a ball',
      steps: [
        'Walk the beam with arms out.',
        'Walk it holding a ball.',
        'Walk it holding the ball above your head.',
      ],
    },
    safety: [
      'Use a beam on the ground, never a raised one.',
      'Step off if you wobble.',
    ],
  },
  'pe-05': {
    indicator: {
      code: 'B3.1.2.1.5',
      text: 'Strike a gently tossed ball with a bat, using a side-on position.',
    },
    hook: 'Cricket and rounders players stand side-on to hit the ball. Why sideways?',
    explain: [
      'Stand side-on, with your shoulder pointing to the person tossing the ball.',
      'Hold the bat back, ready to swing.',
      'Watch the ball and swing level to hit it.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 170, kit: 1, holds: 'ball' },
        { pose: 'forehand', x: 450, kit: 3, holds: 'racket', facing: -1 },
      ],
      label: 'Side-on, watch the ball, swing',
    },
    artCaption: 'Standing side-on gives a bigger swing.',
    words: [
      { term: 'Bat', meaning: 'A tool for hitting a ball.' },
      { term: 'Side-on', meaning: 'Standing with your side to the ball.' },
      { term: 'Swing', meaning: 'Moving the bat to hit.' },
    ],
    examples: [
      {
        title: 'Why side-on?',
        situation: 'Why is it better to stand side-on?',
        steps: ['Your arms can swing further.', 'You can see the ball coming.'],
        answer: 'A longer swing gives a better hit.',
      },
    ],
    mistakes: [
      {
        wrong: 'Closing your eyes as you swing.',
        right: 'Keep watching the ball until you hit it.',
      },
    ],
    realLife: ['Cricket.', 'Rounders.', 'Baseball.'],
    tryIt: {
      need: 'A bat, a soft ball and a partner',
      steps: [
        'Your partner tosses the ball gently underarm.',
        'Hit it side-on.',
        'Count how many you hit out of ten.',
      ],
    },
    safety: [
      'Only the batter holds the bat. Everyone else stands well back.',
      'Use a soft ball.',
    ],
  },
  'pe-06': {
    indicator: {
      code: 'B3.1.2.1.7',
      text: 'Throw and catch a ball with a partner while both are moving, using underhand, overhand and sidearm throws.',
    },
    hook: 'Throwing to a friend who is moving is tricky. Where should you aim?',
    explain: [
      'There are three ways to throw: underhand (low), overhand (high) and sidearm (from the side).',
      'When your partner is moving, throw a little ahead of them.',
      'Catch with soft hands and pull the ball in.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'throw', x: 170, kit: 2, holds: 'ball' },
        { pose: 'catch', x: 470, kit: 1, facing: -1 },
      ],
      label: 'Throw ahead of your partner',
    },
    artCaption: 'Aim where your partner will be.',
    words: [
      {
        term: 'Underhand',
        meaning: 'Throwing with the hand below the shoulder.',
      },
      {
        term: 'Overhand',
        meaning: 'Throwing with the hand above the shoulder.',
      },
      { term: 'Sidearm', meaning: 'Throwing with the arm out to the side.' },
    ],
    examples: [
      {
        title: 'Aim ahead',
        situation: 'Your partner is walking to your left. Where do you throw?',
        steps: [
          'Look where they are going.',
          'Throw a little in front of them.',
        ],
        answer: 'Just ahead, so they walk into the catch.',
      },
    ],
    mistakes: [
      {
        wrong: 'Throwing to where your partner is now.',
        right: 'Throw to where they will be.',
      },
    ],
    realLife: ['Netball and handball.', 'Rounders.', 'Playground games.'],
    tryIt: {
      need: 'A soft ball and a partner',
      steps: [
        'Throw underhand while standing still.',
        'Walk and throw.',
        'Try overhand and sidearm throws too.',
      ],
    },
    safety: ['Use a soft ball.', 'Walk, do not run, until you can catch well.'],
  },
  'pe-07': {
    indicator: {
      code: 'B3.1.2.1.9',
      text: 'Kick a stationary ball into the air to a partner, using the inside of the foot.',
    },
    hook: 'Can you kick a ball up into the air so your friend can catch it?',
    explain: [
      'Put your standing foot beside the ball.',
      'Kick under the middle of the ball with the inside of your foot.',
      'Kicking low on the ball lifts it into the air.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'kick', x: 200, kit: 1 },
        { pose: 'catch', x: 470, kit: 2, facing: -1 },
      ],
      balls: [[330, 220]],
      label: 'Kick under the ball to lift it',
    },
    artCaption: 'Your partner catches the ball.',
    words: [
      { term: 'Stationary', meaning: 'Not moving.' },
      {
        term: 'Inside of the foot',
        meaning: 'The side of your foot near the big toe.',
      },
      { term: 'Lift', meaning: 'Make the ball go up.' },
    ],
    examples: [
      {
        title: 'Up, not along',
        situation:
          'Your kicks roll along the ground. How do you lift the ball?',
        steps: ['Lean back a little.', 'Kick lower on the ball.'],
        answer: 'Kicking under the ball sends it up.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking with your toes.',
        right: 'Use the inside of your foot.',
      },
    ],
    realLife: ['Football.', 'Passing to a teammate.', 'Playground games.'],
    tryIt: {
      need: 'A soft football and a partner',
      steps: [
        'Kick the ball gently to your partner’s hands.',
        'Move further apart.',
        'Kick to a partner who is walking.',
      ],
    },
    safety: ['Use a soft ball.', 'Kick gently while your partner is close.'],
  },
  'pe-08': {
    indicator: {
      code: 'B3.1.2.1.11',
      text: 'Foot-dribble a ball continuously while travelling and changing direction.',
    },
    hook: 'Can you keep the ball close to your feet while you weave through cones?',
    explain: [
      'Tap the ball gently with the inside or outside of your foot.',
      'Keep it close, so you can turn quickly.',
      'Look up between touches to see where to go.',
    ],
    art: {
      kind: 'course',
      path: 'zigzag',
      ball: true,
      label: 'Small taps around the cones',
    },
    artCaption: 'Keep the ball close as you turn.',
    words: [
      { term: 'Dribble', meaning: 'Move the ball with small kicks.' },
      { term: 'Weave', meaning: 'Go in and out between things.' },
      { term: 'Tap', meaning: 'A small, gentle touch.' },
    ],
    examples: [
      {
        title: 'Turning',
        situation: 'You reach a cone. How do you turn with the ball?',
        steps: [
          'Slow down.',
          'Tap the ball sideways with the inside of your foot.',
          'Go round the cone.',
        ],
        answer: 'Slow, tap and turn.',
      },
    ],
    mistakes: [
      {
        wrong: 'Kicking the ball far ahead.',
        right: 'Small taps keep it close.',
      },
    ],
    realLife: ['Football.', 'Running games with a ball.', 'Street games.'],
    tryIt: {
      need: 'A football and five cones',
      steps: [
        'Walk the ball around the cones.',
        'Jog it around.',
        'Time yourself and try again.',
      ],
    },
    safety: [
      'Space the cones out on flat ground.',
      'Look up so you do not bump into anyone.',
    ],
  },
  'pe-09': {
    indicator: {
      code: 'B3.1.1.1.4',
      text: 'Demonstrate the difference between a jog and a run, a hop and a jump, and a gallop and a slide.',
    },
    hook: 'Jogging and running look alike. So do hopping and jumping. Can you show the difference?',
    explain: [
      'A jog is slow and steady. A run is fast.',
      'A hop is on one foot. A jump takes off from two feet.',
      'A gallop goes forward, one foot leading. A slide goes sideways, feet coming together.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 150, kit: 1 },
        { pose: 'skip', x: 330, kit: 2 },
        { pose: 'jumpUp', x: 500, kit: 3 },
      ],
      label: 'Run, hop and jump',
    },
    artCaption: 'Each movement uses the body differently.',
    words: [
      { term: 'Hop', meaning: 'Take off and land on the same foot.' },
      { term: 'Gallop', meaning: 'Move forward with one foot always leading.' },
      { term: 'Slide', meaning: 'Move sideways, bringing your feet together.' },
    ],
    examples: [
      {
        title: 'Hop or jump?',
        situation:
          'You take off from both feet and land on both. Is it a hop or a jump?',
        steps: ['Two feet means a jump.'],
        answer: 'A jump.',
      },
    ],
    mistakes: [
      {
        wrong: 'Changing feet during a hop.',
        right: 'A hop stays on the same foot.',
      },
    ],
    realLife: [
      'Dancing.',
      'Playground games such as hopscotch.',
      'Sports warm-ups.',
    ],
    tryIt: {
      need: 'A marked space',
      steps: ['Jog, then run.', 'Hop, then jump.', 'Gallop, then slide.'],
    },
    safety: ['Land softly with bent knees.', 'Move in your own space.'],
  },
  'pe-10': {
    indicator: {
      code: 'B3.2.2.2.1',
      text: 'Compare and contrast movements done to even and uneven beats.',
    },
    hook: 'Clap, clap, clap, clap: that is an even beat. Can you move to it, and then to an uneven one?',
    explain: [
      'An even beat has the same gap between each sound, like a clock: tick, tick, tick.',
      'An uneven beat has long and short gaps.',
      'Walking, jogging and running fit even beats. Galloping, skipping and sliding fit uneven beats.',
    ],
    art: {
      kind: 'repeat',
      items: ['clap', 'clap', 'clap', 'clap', 'clap', 'clap'],
      label: 'An even beat: same gap every time',
    },
    artCaption: 'Every clap is the same distance apart.',
    words: [
      { term: 'Beat', meaning: 'The steady pulse in music.' },
      { term: 'Even', meaning: 'With equal gaps.' },
      { term: 'Uneven', meaning: 'With long and short gaps.' },
    ],
    examples: [
      {
        title: 'Uneven clapping',
        situation: 'Clap long, short, long, short. Which movement fits?',
        steps: ['A gallop goes da-dum, da-dum.'],
        answer: 'Galloping fits an uneven beat.',
      },
    ],
    mistakes: [
      {
        wrong: 'Moving faster than the beat.',
        right: 'Listen first, then move with the beat.',
      },
    ],
    realLife: ['Dancing to music.', 'Marching in a parade.', 'Drumming.'],
    tryIt: {
      need: 'A drum, or hands to clap',
      steps: [
        'Walk to an even beat.',
        'Gallop to an uneven beat.',
        'Take turns being the drummer.',
      ],
    },
    safety: ['Keep to your own space.', 'Stop when the drum stops.'],
  },
  'pe-11': {
    indicator: {
      code: 'B3.2.2.2.2',
      text: 'Identify steps and rhythm patterns in traditional and cultural dances.',
    },
    hook: 'Agbadza, adowa and kpanlogo are Ghanaian dances. Each one has its own steps and rhythm.',
    explain: [
      'Every dance has steps, which are how you move your feet and body.',
      'It also has a rhythm, a pattern of slow and quick beats from the drums.',
      'Listening to the drums tells you when to step.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'dance', x: 200, kit: 2 },
        { pose: 'dance', x: 440, kit: 0, facing: -1 },
      ],
      sun: true,
      label: 'Step with the drum',
    },
    artCaption: 'Dancers follow the drum.',
    words: [
      { term: 'Rhythm', meaning: 'A pattern of beats.' },
      { term: 'Step', meaning: 'A movement of the feet in a dance.' },
      {
        term: 'Tradition',
        meaning: 'Something passed down from older people.',
      },
    ],
    examples: [
      {
        title: 'Slow, quick, quick',
        situation: 'The drum plays slow, quick, quick. How do you step?',
        steps: [
          'One big step on “slow”.',
          'Two small steps on “quick, quick”.',
        ],
        answer: 'Your steps follow the rhythm.',
      },
    ],
    mistakes: [
      {
        wrong: 'Rushing ahead of the drum.',
        right: 'Listen, then step with the beat.',
      },
    ],
    realLife: [
      'Festivals.',
      'Weddings and celebrations.',
      'School cultural days.',
    ],
    tryIt: {
      need: 'Music, or a friend with a drum',
      steps: [
        'Listen to a traditional song.',
        'Clap the rhythm.',
        'Learn two steps and dance them to the beat.',
      ],
    },
    safety: ['Dance in a clear space.', 'Drink water if you get hot.'],
  },
  'pe-12': {
    indicator: {
      code: 'B3.2.5.2.1',
      text: 'Identify the key elements for increasing accuracy in rolling and throwing a ball.',
    },
    hook: 'How do you make a ball go exactly where you want? The secret is aim, swing and follow-through.',
    explain: [
      'Look at the target before you roll or throw.',
      'Step towards the target with the opposite foot.',
      'Let your arm follow through, pointing at the target.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [{ pose: 'throw', x: 230, kit: 1, holds: 'ball' }],
      cones: [520, 560],
      label: 'Look, step, follow through',
    },
    artCaption: 'Point at your target as you finish.',
    words: [
      { term: 'Accuracy', meaning: 'Hitting exactly where you aim.' },
      { term: 'Target', meaning: 'What you aim at.' },
      {
        term: 'Follow-through',
        meaning: 'Keeping your arm moving after you let go.',
      },
    ],
    examples: [
      {
        title: 'Missing to the side',
        situation: 'Your throws keep missing to the left. What can you change?',
        steps: [
          'Check that your foot steps straight at the target.',
          'Point your arm at the target as you finish.',
        ],
        answer: 'Step and point straight at the target.',
      },
    ],
    mistakes: [
      {
        wrong: 'Looking away as you throw.',
        right: 'Keep your eyes on the target.',
      },
    ],
    realLife: [
      'Throwing a ball to a friend.',
      'Bowling games.',
      'Netball shooting.',
    ],
    tryIt: {
      need: 'A ball and a target, such as a bucket or cones',
      steps: [
        'Roll the ball between two cones.',
        'Throw it into a bucket.',
        'Count your hits out of ten.',
      ],
    },
    safety: [
      'Throw only when the target area is clear.',
      'Collect balls when everyone has finished.',
    ],
  },
  'pe-13': {
    indicator: { code: 'B3.3.1.3.1', text: 'Dance for 10 minutes with music.' },
    hook: 'Dancing is a fun way to exercise. Can you keep dancing for 10 whole minutes?',
    explain: [
      'Dancing makes your heart beat faster and your lungs work harder.',
      'Moving for 10 minutes without stopping builds stamina.',
      'Start gently, dance at a steady pace, then slow down at the end.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'dance', x: 110, kit: 1 },
        { pose: 'dance', x: 300, kit: 2 },
        { pose: 'dance', x: 490, kit: 3 },
      ],
      sun: true,
      label: 'Keep moving to the music',
    },
    artCaption: 'Dancing together is good exercise.',
    words: [
      { term: 'Stamina', meaning: 'Being able to keep going.' },
      { term: 'Warm up', meaning: 'Gentle moves before exercise.' },
      { term: 'Cool down', meaning: 'Slow moves at the end.' },
    ],
    examples: [
      {
        title: 'Plan the 10 minutes',
        situation: 'How could you split 10 minutes of dancing?',
        steps: [
          '2 minutes of gentle warm-up dancing.',
          '6 minutes of lively dancing.',
          '2 minutes of slow cool-down dancing.',
        ],
        answer: '2 + 6 + 2 = 10 minutes.',
      },
    ],
    mistakes: [
      {
        wrong: 'Starting very fast and stopping after two minutes.',
        right: 'Start gently and keep a steady pace.',
      },
    ],
    realLife: [
      'Parties and festivals.',
      'Keeping fit at home.',
      'Church and mosque celebrations.',
    ],
    tryIt: {
      need: 'Music and a clear space',
      steps: [
        'Warm up with gentle steps.',
        'Dance for as long as you can, up to 10 minutes.',
        'Cool down slowly.',
      ],
    },
    safety: [
      'Drink water before and after.',
      'Rest in the shade if you feel dizzy.',
    ],
  },
  'pe-14': {
    indicator: {
      code: 'B3.3.3.3.1',
      text: 'Perform three sets of continuous step-ups.',
    },
    hook: 'Step up, step down. It sounds easy, but three sets will make your legs strong!',
    explain: [
      'Stand in front of a low, steady step.',
      'Step up with one foot, then the other. Step down with one foot, then the other.',
      'Do a set, rest, then do two more sets.',
    ],
    art: {
      kind: 'people',
      ground: 'compound',
      people: [
        { pose: 'walk', x: 260, kit: 1 },
        { pose: 'drink', x: 450, kit: 2 },
      ],
      label: 'One set, rest, repeat',
    },
    artCaption: 'Rest and drink water between sets.',
    words: [
      {
        term: 'Step-up',
        meaning: 'Stepping up onto a low step and back down.',
      },
      { term: 'Set', meaning: 'A group of repeats.' },
      { term: 'Leg muscles', meaning: 'The muscles that move your legs.' },
    ],
    examples: [
      {
        title: 'Count them',
        situation: 'You do three sets of 10 step-ups. How many is that?',
        steps: ['10 + 10 + 10 = 30.'],
        answer: '30 step-ups.',
      },
    ],
    mistakes: [
      {
        wrong: 'Using a wobbly chair as a step.',
        right: 'Use a low, steady block or step.',
      },
    ],
    realLife: ['Climbing stairs.', 'Walking uphill.', 'Climbing into a bus.'],
    tryIt: {
      need: 'A low, steady step and a partner',
      steps: [
        'Do 10 step-ups while your partner counts.',
        'Rest.',
        'Do two more sets.',
      ],
    },
    safety: ['Use a low, steady step, never a chair.', 'Rest between sets.'],
  },
  'pe-15': {
    indicator: {
      code: 'B3.3.5.3.1',
      text: 'Identify body composition using fat and fat-free body mass.',
    },
    hook: 'What is your body made of? Bones, muscles, water and a little fat. Each part has a job.',
    explain: [
      'Fat-free mass is everything that is not fat: muscles, bones, organs and water.',
      'Fat mass is stored energy. It also keeps you warm and protects your organs.',
      'Everybody needs some fat. Playing actively and eating well keep the balance healthy.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'stand', x: 200, kit: 1 },
        { pose: 'jumpUp', x: 430, kit: 2 },
      ],
      label: 'Muscles, bones and a little fat',
    },
    artCaption: 'Every part of the body has a job.',
    words: [
      { term: 'Body composition', meaning: 'What your body is made of.' },
      { term: 'Fat-free mass', meaning: 'Muscles, bones, organs and water.' },
      { term: 'Fat mass', meaning: 'Stored energy in the body.' },
    ],
    examples: [
      {
        title: 'What does fat do?',
        situation: 'Is fat bad for you?',
        steps: [
          'Some fat stores energy and keeps you warm.',
          'Too much or too little is not healthy.',
        ],
        answer: 'We need some fat. A healthy balance is best.',
      },
    ],
    mistakes: [
      {
        wrong: 'Making comments about other people’s bodies.',
        right: 'Every body is different. Be kind.',
      },
    ],
    realLife: [
      'Eating balanced meals.',
      'Playing actively every day.',
      'Growing up healthy.',
    ],
    tryIt: {
      need: 'Paper and crayons',
      steps: [
        'Draw a body.',
        'Label the bones, muscles and heart.',
        'Write one healthy habit you have.',
      ],
    },
    safety: [
      'Talk kindly about bodies, and never about a classmate’s.',
      'Tell your teacher if anything about your body worries you.',
    ],
  },
  'pe-16': {
    indicator: {
      code: 'B3.4.1.4.2',
      text: 'Describe the role of moderate to vigorous physical activity in achieving or maintaining good health.',
    },
    hook: 'Some activities make you breathe a little faster. Others make you puff! Both are good for you.',
    explain: [
      'Moderate activity, like brisk walking, makes you breathe a bit faster. You can still talk.',
      'Vigorous activity, like running or football, makes you breathe hard. It is hard to talk.',
      'Both make your heart and lungs stronger. Children need about an hour of activity every day.',
    ],
    art: {
      kind: 'people',
      ground: 'track',
      people: [
        { pose: 'walk', x: 200, kit: 1 },
        { pose: 'run', x: 430, kit: 3 },
      ],
      label: 'Moderate and vigorous',
    },
    artCaption: 'Walking briskly and running both help your heart.',
    words: [
      {
        term: 'Moderate',
        meaning: 'Medium effort: you breathe faster but can talk.',
      },
      { term: 'Vigorous', meaning: 'Hard effort: you breathe hard.' },
      { term: 'Health', meaning: 'How well your body works.' },
    ],
    examples: [
      {
        title: 'The talk test',
        situation:
          'You can talk, but not sing, while you exercise. Is it moderate or vigorous?',
        steps: ['You can still talk.'],
        answer: 'Moderate.',
      },
    ],
    mistakes: [
      {
        wrong: 'Thinking only hard exercise counts.',
        right: 'Brisk walking and playing count too.',
      },
    ],
    realLife: [
      'Walking to school.',
      'Playing football.',
      'Helping with chores.',
    ],
    tryIt: {
      need: 'A space to move',
      steps: [
        'Walk briskly for 2 minutes and try the talk test.',
        'Run for 1 minute and try again.',
        'Say which was moderate and which was vigorous.',
      ],
    },
    safety: ['Drink water.', 'Slow down if you feel dizzy.'],
  },
  'pe-17': {
    indicator: {
      code: 'B3.4.3.4.1',
      text: 'Identify flexibility exercises that are not safe for the joints and should be avoided.',
    },
    hook: 'Stretching makes you bendy, but some stretches can hurt your knees, back or neck. Which ones should we avoid?',
    explain: [
      'Bouncing while you stretch can tear muscles. Stretch slowly and hold still instead.',
      'Very deep squats, rocking on your knees and sitting with your legs bent back under you strain the knees.',
      'Rolling your head all the way back strains the neck. Tilt it gently side to side instead.',
    ],
    art: {
      kind: 'people',
      ground: 'floor',
      people: [
        { pose: 'reach', x: 200, kit: 1, mark: 'good' },
        { pose: 'crouch', x: 440, kit: 3, mark: 'bad' },
      ],
      label: 'Gentle and still, not bouncing',
    },
    artCaption: 'Stretch slowly and hold, never bounce.',
    words: [
      { term: 'Stretch', meaning: 'Moving a muscle to make it longer.' },
      { term: 'Joint', meaning: 'Where two bones meet, like the knee.' },
      { term: 'Flexibility', meaning: 'How far you can bend and stretch.' },
    ],
    examples: [
      {
        title: 'Safer swap',
        situation:
          'A friend bounces to touch their toes. What should they do instead?',
        steps: [
          'Bend the knees slightly.',
          'Reach down slowly and hold for ten seconds.',
        ],
        answer: 'A slow, still stretch.',
      },
    ],
    mistakes: [
      {
        wrong: 'Stretching until it hurts.',
        right: 'Stretch until you feel a gentle pull, then stop.',
      },
    ],
    realLife: [
      'Warming up for sport.',
      'Getting up in the morning.',
      'Dancing.',
    ],
    tryIt: {
      need: 'A mat',
      steps: [
        'Do a slow arm stretch and hold for ten seconds.',
        'Do a gentle side bend.',
        'Tell a partner one stretch to avoid.',
      ],
    },
    safety: ['Never bounce when stretching.', 'Stop if anything hurts.'],
  },
  'pe-18': {
    indicator: {
      code: 'B3.3.5.3.1',
      text: 'Identify body composition using fat and fat-free body mass.',
    },
    hook: 'How can you help your body grow strong muscles and bones? Your daily habits make a big difference!',
    explain: [
      'Playing and moving every day builds muscles and strong bones.',
      'Healthy food gives you energy. Water keeps your body working well.',
      'Good sleep helps your body grow and repair.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'run', x: 200, kit: 0 },
        { pose: 'drink', x: 430, kit: 2 },
      ],
      label: 'Play, eat well, drink water',
    },
    artCaption: 'Healthy habits help every body.',
    words: [
      { term: 'Habit', meaning: 'Something you do often.' },
      { term: 'Energy', meaning: 'What food gives you to move and grow.' },
      { term: 'Muscle', meaning: 'The part of your body that moves you.' },
    ],
    examples: [
      {
        title: 'A healthy day',
        situation: 'Name three habits that help your body.',
        steps: ['Play actively.', 'Eat fruit and vegetables.', 'Sleep well.'],
        answer: 'Moving, eating well and sleeping.',
      },
    ],
    mistakes: [
      {
        wrong: 'Skipping breakfast before PE.',
        right: 'Eat a healthy breakfast for energy.',
      },
    ],
    realLife: ['Meals at home.', 'Playtime.', 'Bedtime.'],
    tryIt: {
      need: 'Paper',
      steps: [
        'Draw your favourite active game.',
        'Draw a healthy meal.',
        'Share one new habit you will try.',
      ],
    },
    safety: [
      'Be kind when talking about bodies.',
      'Ask a grown-up if you have questions about your body.',
    ],
  },
  'pe-19': {
    indicator: {
      code: 'B3.5.2.5.1',
      text: 'Use cues for movement and positive words of encouragement while coaching others.',
    },
    hook: 'A good coach gives short, clear tips and kind words. Can you be a coach for a friend?',
    explain: [
      'A cue is a short reminder, such as “eyes on the ball” or “bend your knees”.',
      'Encouragement is kind words, such as “well done” or “keep trying”.',
      'Good coaches use both, and stay calm and friendly.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'raise', x: 200, kit: 1 },
        { pose: 'throw', x: 430, kit: 2, holds: 'ball' },
      ],
      label: '“Step and throw. Great job!”',
    },
    artCaption: 'A cue and a kind word.',
    words: [
      { term: 'Coach', meaning: 'Someone who helps others improve.' },
      { term: 'Cue', meaning: 'A short reminder.' },
      { term: 'Encourage', meaning: 'Help someone feel they can do it.' },
    ],
    examples: [
      {
        title: 'Coach a catch',
        situation: 'Your friend keeps dropping the ball. What do you say?',
        steps: [
          'Give a cue: “Watch the ball into your hands.”',
          'Add encouragement: “You nearly had it. Try again!”',
        ],
        answer: 'A cue plus kind words.',
      },
    ],
    mistakes: [
      {
        wrong: 'Shouting or laughing at mistakes.',
        right: 'Stay calm and kind.',
      },
    ],
    realLife: [
      'Helping brothers and sisters.',
      'Team captains.',
      'Teachers and coaches.',
    ],
    tryIt: {
      need: 'A ball and a partner',
      steps: [
        'Watch your partner throw.',
        'Give one cue and one kind word.',
        'Swap roles.',
      ],
    },
    safety: [
      'Stand to the side while your partner practises.',
      'Keep your words kind.',
    ],
  },
  'pe-20': {
    indicator: {
      code: 'B3.5.4.5.1',
      text: 'Demonstrate how to solve a problem with another person during physical activity.',
    },
    hook: 'Two friends both want the ball. What can they do so the game carries on happily?',
    explain: [
      'Stop and stay calm. Take a deep breath.',
      'Talk and listen. Each person says what happened.',
      'Agree on a fair answer, such as taking turns. Then shake hands or high-five, if you both want to.',
    ],
    art: {
      kind: 'people',
      ground: 'grass',
      people: [
        { pose: 'stand', x: 240, kit: 1 },
        { pose: 'stand', x: 400, kit: 3, facing: -1 },
      ],
      label: 'Stop, talk, listen, agree',
    },
    artCaption: 'Talking it through solves problems.',
    words: [
      { term: 'Problem', meaning: 'Something that is going wrong.' },
      { term: 'Fair', meaning: 'Right for everyone.' },
      { term: 'Agree', meaning: 'Decide together.' },
    ],
    examples: [
      {
        title: 'Who goes first?',
        situation: 'Two friends both want to bat first. How can they decide?',
        steps: ['Talk calmly.', 'Toss a coin, or take turns.'],
        answer: 'A fair way that both accept.',
      },
    ],
    mistakes: [
      {
        wrong: 'Grabbing or pushing.',
        right: 'Use words, and ask a teacher if you cannot agree.',
      },
    ],
    realLife: [
      'Playground games.',
      'Sharing toys at home.',
      'Working in groups.',
    ],
    tryIt: {
      need: 'A partner',
      steps: [
        'Act out a problem in a game.',
        'Solve it with stop, talk, listen, agree.',
        'Swap roles and try another problem.',
      ],
    },
    safety: [
      'Never push or grab.',
      'Ask a teacher for help if things get heated.',
    ],
  },
}
