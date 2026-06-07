// Each demand is an array of text segments; { strong: true } renders the
// emphasised (gold) phrase, otherwise it is plain body copy.
export const DEMANDS = [
  {
    n: '01',
    segments: [
      { text: 'If Commission-Mukt Bharat comes to power, ' },
      { text: 'no Chief Justice shall be granted a Rajya Sabha seat', strong: true },
      { text: ' as a post-retirement reward.' },
    ],
  },
  {
    n: '02',
    segments: [
      { text: 'If any legitimate vote is deleted, whether in a ruling or opposition state, the ' },
      { text: 'CEC shall be arrested under UAPA', strong: true },
      { text: ', as taking away voting rights of citizens is no less than terrorism.' },
    ],
  },
  {
    n: '03',
    segments: [
      { text: 'Women shall receive 50% reservation, not 33%', strong: true },
      { text: ', without increasing the strength of Parliament. Additionally, ' },
      { text: '50% of all Cabinet positions', strong: true },
      { text: ' shall be reserved for women.' },
    ],
  },
  {
    n: '04',
    segments: [
      { text: 'All media houses owned by ' },
      { text: 'Ambani and Adani shall have their licences cancelled', strong: true },
      {
        text:
          ' to make way for truly independent media. Bank accounts of Godi media anchors shall be investigated.',
      },
    ],
  },
  {
    n: '05',
    segments: [
      { text: 'Any MLA or MP who defects from one party to another shall be ' },
      {
        text:
          'barred from contesting elections — and from holding any public office — for a period of 20 years',
        strong: true,
      },
      { text: '.' },
    ],
  },
]
