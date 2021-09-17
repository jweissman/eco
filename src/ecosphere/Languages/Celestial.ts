// TODO keep thinking it would be interesting
// .    to have an 'incomprehensible' language
//
//      axaxaxa ml
//
//      IOIOIOIOIO
//
// .    with weird replacement rules too?

// now just thinking making a beautiful language
// for its own sake is an intersting exercise
// (would be good to tease apart)

import { assembleDictionary, Dictionary, Roots } from "../Dictionary";
const celestialRoots: Roots = {
  tree: 'ö',
  woman: 'ml',
  man: 'na',
  mound: 'e',
  quick: 'e',
  time: 'exa',
  over: 'ò-',
  at: 'e-',

  bitter: 'ax',
  beauty: 'evl',
  high: 'i',
  wing: 'l',
  safe: '-on',

  place: '-', 
  // place: 'ë',

  great: 'x',
  hard: 'yy',
  strong: 'xo',
  heat: 'út',
  light: 'yan',
  daughter: 'en',
  deep: 't', //grim',

  water: 'ul',
  many: 'g',
  cold: 'ksa',

  one: 'er',
  mere: 'sëa',

  all: 'er',
  wood: 'taf',
  cut: 'kh',
  crown: 'lï',
  run: 'r',
  sorrow: 'uj',
  joy: 'je',
  no: 'u-',
  sing: 'ina',
  fear: 'ga',
  tooth: 'tur',
  color: 'o',

  fight: 'klak',
  air: 'ur',
  bad: 'nu',
  bear: 'gruw',
  bell: 'du',
  cove: 'cof',
  death: 'lun',
  dog: 'hu',
  drink: 'le',
  eat: 'zu',
  elephant: 'ofan',
  flower: 'ela',
  good: 'lu',
  heart: 'eru',
  horse: 'raph',
  ore: 'im',
  point: 'el',
  shadow: 'al',
  sleep: 'ol',
  small: 'i',
  snake: 'lug',
  soft: 'i',
  son: 'on',
  sweet: 'hl',
  tall: 'mu',
  way: 'eh',
  wild: 'pel',
  sound: 'ada',
  face: 'vih',
  mantle: 'reth',

  slow: 'ikshu',
}

// also: clearer structure for roots + stems
// build all combinations --> 'kernel'
// then from all these we build general vocab
// (with maybe an intermediate stage)
// - narrow down the set of roots
// - richer set of stems/modifiers
// - prepositions? syntax?
const Celestial: Dictionary = assembleDictionary('Celestial',
  celestialRoots,
  {
  // 'varl': 'l',
  // 'gll': 'll',
  // 'ienen': 'ien',
  // 'gg': 'eg',
  // // 'noa': 'na',
  // 'rr': 'r',
  // // 'aa': 'a',
  // // 'glt': 'gut',
  // // 'gn': 'n',
  // 'ii': 'ī',
  // 'lll': 'lp',
  // 'ythe': 'eri',
  // 'dgn': 'ng',
  // 'nn': 'n',
  // 'arort': 'uir',
  // 'ieno': 'eo',
  // 'rlly': 'a',
  
  // 'aa': 'a',
  // 'thien': 'eth',
  // 'ii': 'ié',
  // 'iao': 'eo',
  // 'rl': 'lin',
  // 'gg': 'ph',
  // 'eul': 'uil',
  // 'gn': 'kn',
  // 'gv': 'gev',
  // 'gg': 'kh',
  // '-': ''
})

export { Celestial };
