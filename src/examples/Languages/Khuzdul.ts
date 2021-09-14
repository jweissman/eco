// dwarrow-folk
import { assembleDictionary, Dictionary, Roots } from "../../ecosphere/Dictionary";
const khuzdulRoots: Roots = {
  tree: 'an',
  woman: 'or',
  man: 'nar',
  mound: 'tel',
  quick: 'e',
  time: 'eon',
  over: 'o-',
  at: 'e-',

  bitter: 'ra',
  beauty: 'egr',
  high: 'i',
  wing: 'l',
  safe: '-ond',

  place: '-', 
  // place: 'ë',

  great: 'g',
  hard: 'll',
  heat: 'yth',
  light: 'ien',
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
  coat: 'reth',

  slow: 'ikshu',
}

const khuzdul: Dictionary = assembleDictionary('Khuzdul', khuzdulRoots, {
  // 'varl': 'l',
  'gll': 'll',
  'enen': 'en',
  'gg': 'eg',
  // 'noa': 'na',
  'rr': 'r',
  // 'aa': 'a',
  // 'glt': 'gut',
  // 'gn': 'n',
  'ii': 'ī',
  'lll': 'lp',
  'ythe': 'eri',
  'dgn': 'ng',
  'nn': 'n',
  'arort': 'uir',
  'ieno': 'eo',
  'rlly': 'a',
  
  'aa': 'a',
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

export default khuzdul;
