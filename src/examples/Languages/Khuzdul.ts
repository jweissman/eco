// dwarrow-folk
import { assembleDictionary, Dictionary, Roots } from "../../ecosphere/Dictionary";
const khuzdulRoots: Roots = {
  shadow: 'um', //skado', //umbr', //fusk',

  tree: 'an',
  woman: 'llen',
  man: 'nil',
  mound: 'on',
  quick: 'e',
  time: 'enor',
  over: 'on-',
  at: 'e-',

  bitter: 'd', //mere, ',
  beauty: 'ari',
  high: 'l',
  wing: 'l',
  safe: '-ond',

  place: '-', 
  // place: 'ë',

  great: 'gh',
  hard: 'ekh',
  strong: 'l',
  heat: 'ut',
  light: 'ie',
  daughter: 'en',
  deep: 't', //grim',

  water: 'ul',
  many: 'o',
  cold: 'í',

  one: 'er',
  mere: 'sëa',

  all: 'er',
  wood: 'taf',
  cut: 'k',
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
  elephant: 'elefant',
  flower: 'ela',
  good: 'lu',
  heart: 'eru',
  horse: 'raph',
  ore: 'im',
  point: '-el',
  sleep: 'ol',
  small: 'i',
  snake: 'lug',
  soft: 'i',
  son: 'on',
  sweet: 'hl',
  tall: 'mu-',
  way: 'eh',
  wild: 'pel',
  sound: 'ada',
  face: 'vih',
  mantle: 'mötull', //re',
  slow: 'ikshu',
}

const khuzdulVocab = {
  prison: 'fengsel',
  iron: 'jern',
  holly: 'kristtorn',
  land: 'jord',
  mountain: 'fjell',
  'mountain-chain': 'fjellkjede',
  bay: 'vik',
  stars: 'stjerne',
  silence: 'stille',
  silver: 'sølv',
  river: 'elv',
  ice: 'is',
  icy: 'iskald',
  fangs: 'hoggtann',
  dragons: 'drager',
  giant: 'kjempe',
  hill: 'høyde',
  golden: 'gyllen',
  music: 'musikk',
  pine: 'furu',
  eagles: 'ørn',
  gray: 'grå-',
  fire: 'brann-',
  stronghold: 'fort',
  tyranny: 'grusomhet',
  nightingales: 'nattergal',
  vale: 'dal',
  magic: 'seith'
}

// todo add some vocab too? shield -- skjald
// and override: oak -- eik
const khuzdul: Dictionary = assembleDictionary('Khuzdul',
  khuzdulRoots,
  khuzdulVocab,
  {
    'llent': 'lion',
    'laú': 'lû',
    'eille': 'ye',
    'ielle': 'we',
    'oo': 'œ',
    'ieo': 'a',
    'ii': 'ī', //ié',
    'ilel': 'iel',
    'lel': 'iliel',
    'nillut': 'nt',
    'lll': 'l',
    'nina': 'on',
    // 'onenor': 'inion',
    'oul': 'il',
    'aa': 'a',
    // 'nn': 'm',
    'ilo': 'e',
    'ndon': 'ine',
    'eillio': 'eo',
    'iegh': 'gÿl',
    'igh': 'g',

    // 'll': 'l',
    'tie': 'tion',
    'onl': 'lÿ',
    'ïni': 'iel',
    'milk': 'mel',
    'ee': 'e',
    'ilr': 'ul',
    'eghl': 'elen',
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
  // 'īen': 'ilien',
  // 'aúri': 'uthi',
  // 'lll': 'lup',
  // 'ythe': 'eri',
  // 'dgn': 'ng',
  // 'nn': 'n',
  // 'arort': 'uir',
  // 'ieno': 'eo',
  // 'rlly': 'a',
  
  // 'aa': 'a',
  // 'thien': 'eth',
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