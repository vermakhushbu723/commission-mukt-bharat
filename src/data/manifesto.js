// Each demand is an array of text segments; { strong: true } renders the
// emphasised (gold) phrase, otherwise it is plain body copy.
export const DEMANDS = [
  {
    n: '01',
    segments: [
      { text: 'If Commission-Mukt Bharat comes to power, ' },
      { text: 'no food-delivery or quick-commerce app shall charge a restaurant a commission above 10%', strong: true },
      { text: ' — ending the era where platforms earn more from a meal than the kitchen that cooks it.' },
    ],
  },
  {
    n: '02',
    segments: [
      { text: 'Every bill shall be fully itemised, and all extra ' },
      { text: '“platform”, “convenience”, “handling” and “packaging” fees shall be banned or disclosed upfront', strong: true },
      { text: ', so no customer is charged a single rupee they cannot see and understand.' },
    ],
  },
  {
    n: '03',
    segments: [
      { text: 'Delivery riders and cab drivers shall take home ' },
      { text: 'at least 80% of the fare the customer actually pays', strong: true },
      { text: ', with a transparent breakup of every order and every ride shown to both the worker and the customer.' },
    ],
  },
  {
    n: '04',
    segments: [
      { text: 'Algorithmic ' },
      { text: 'surge and “dynamic” pricing shall be capped at 1.5× the base fare', strong: true },
      { text: ', and no app shall quote a different price to a different phone for the very same ride.' },
    ],
  },
  {
    n: '05',
    segments: [
      { text: 'Any platform that breaches the commission cap or deactivates a worker without cause shall ' },
      { text: 'face a public audit and lose its licence to operate on repeat violations', strong: true },
      { text: '.' },
    ],
  },
]
