const SWAMP = [
  {
    name: 'Two Beside',
    nick: 'TWO_BESIDE',
    biome: 'hilbertDelta',
    x: -30,
    y: 0,
    requirements: ['TIME_PARABOLA_CIRCLE'],
    defaultExpression: '0',
    goals: [
      {
        x: 8,
        y: 0,
      },
      {
        x: 8,
        y: -8,
      },
    ],
    sledders: [
      {
        speech: [
          {
            speakerX: -0.4,
            speakerY: 0.7,
            content: 'Well maybe a little.',
            direction: 'up-up-left',
            distance: 1.4,
            color: "#FFF",
            speech: {
              content: 'I\'m not going to sulk about it.',
              direction: 'up-left',
              color: "#FFF",
              distance: 0.8,
            },
          },
          {
            speakerX: 0.7,
            speakerY: 0.7,
            content: 'Ok...',
            color: "#FFF",
            direction: 'right-up',
            distance: 2.2,
            speech: {
              content: 'So you\'re sure you\'re ok with losing?',
              direction: 'up-right-right',
              color: "#FFF",
              distance: 2.2,
            },
          },
        ],
      },
    ],
    sprites: [],
  },
  {
    name: 'Two Below',
    nick: 'TWO_BELOW',
    biome: 'hilbertDelta',
    x: -10,
    y: 0,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 8,
        y: -8,
      },
      {
        x: -8,
        y: -8,
      },
    ],
    sprites: [],
    sledders: [
      {
        speech: [
          {
            distance: 1.5,
            speakerX: 0.4,
            speakerY: 0.75,
            color: '#FFF',
            direction: 'right-up-up',
            content: 'Yeah but you\'re ADA! You already rule.',
            speech: {
              distance: 1.5,
              color: '#FFF',
              direction: 'up-right',
              content: 'I still don\'t get why it\'s so important for you.',
            },
          },
          {
            distance: 2.2,
            speakerX: -0.25,
            speakerY: 0.65,
            color: '#FFF',
            content: 'It\'s different for you. Nobody thinks a girl can ride the sine waves.',
            direction: 'left-up-up',
            align: 'right',
          },
        ],
      },
    ],
  },
  {
    name: 'Four Around',
    nick: 'FOUR_AROUND',
    biome: 'hilbertDelta',
    x: -10,
    y: -10,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 0,
        y: -8,
      },
      {
        x: 8,
        y: 0,
      },
      {
        x: 0,
        y: 8,
      },
      {
        x: -8,
        y: 0,
      },
    ],
    sledders: [{}],
  },
  {
    name: 'False Cubic',
    nick: 'FALSE_CUBIC',
    biome: 'hilbertDelta',
    x: -10,
    y: 0,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 8,
        y: -8,
        order: 'A',
      },
      {
        x: 16,
        y: -8,
        order: 'B',
      },
      {
        x: 24,
        y: -16,
        order: 'C',
      },
    ],
    sledders: [{}],
  },
  {
    name: 'Zig Zag',
    nick: 'ZIG_ZAG',
    biome: 'hilbertDelta',
    x: -10,
    y: -10,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 16,
        y: -4,
        order: 'A',
      },
      {
        x: 0,
        y: -8,
        order: 'B',
      },
      {
        x: 16,
        y: -12,
        order: 'C',
      },
    ],
    sledders: [{}],
  },
  {
    name: 'Big Bump',
    nick: 'BIG_BUMP',
    biome: 'hilbertDelta',
    x: 0,
    y: -10,
    requirements: ['FALSE_CUBIC'],
    defaultExpression: '0',
    goals: [
      {
        x: 8,
        y: 4,
      },
      {
        x: 16,
        y: 0,
      },
    ],
    sledders: [{}],
  },
  {
    name: 'Dip Traverse',
    nick: 'DIP_TRAVERSE',
    biome: 'hilbertDelta',
    x: -10,
    y: -10,
    requirements: null,
    defaultExpression: '0',
    goals: [
      {
        x: 16,
        y: 0,
        order: 'A',
      },
      {
        x: 8,
        y: -8,
        order: 'B',
      },
    ],
    sledders: [{}],
  },
  ...OOO,
  ...CONVERGENCE,
]
