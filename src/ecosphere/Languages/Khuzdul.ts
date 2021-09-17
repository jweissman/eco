// dwarrow-folk
import { assembleDictionary, Dictionary, Roots } from "../Dictionary";
const khuzdulRoots: Roots = {
  shadow: 'uzn', //skado', //umbr', //fusk',

  tree: 'an',
  woman: 'llwyn',
  man: 'nor', //il',
  mound: 'hæð',
  // on',
  quick: 'e',
  time: 'enor',
  over: 'on-',
  at: 'ae-', // a-',

  bitter: 'd', //mere, ',
  beauty: 'ari',
  high: 'l',
  wing: 'l',
  safe: '-ond',

  place: '-', 
  // place: 'ë',

  great: 'val', //'gab', //'h',
  hard: 'ekh',
  strong: 'ell',
  heat: 'euth',
  light: 'ie',
  daughter: 'enne',
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
  bear: 'gruw', // bero
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
  jewel: 'silmaril',
  // horn: 'horn',
  summer: 'samhradh', //sumrum',
  prison: 'kharkhor', //carcern', //fengsel',
  iron: 'jern',
  holly: 'kristtorn',
  land: '-lann', // jord',
  mountain: 'fell', //'fjell',
  'mountain-chain': 'fellkjede',
  peak: 'felltindr',
  bay: 'vik-',
  stars: '-sterne',
  silence: '-stille',
  // silver: 'sølv',
  river: 'elv',
  ice: 'yses', //is',
  icy: 'iskald',
  fangs: 'hoggtann',
  dragons: 'drager',
  giant: 'kjempe',
  hill: 'høyde',
  golden: 'gyllen',
  gold: 'gull',
  music: 'musikk',
  pine: 'furu',
  eagles: 'orn-',
  gray: 'grå-',
  fire: 'brann-',
  stronghold: 'daingneach', //bfort',
  tyranny: 'tiren-', //grusomhet',
  nightingales: 'nattergal',
  vale: 'dal',
  valley: 'dalr',
  magic: 'seith',
  '-woman': 'víf',

  haven: '-cúan', //'höfn',
  swans: 'eala', // swoon', //'sisne', //'cygnus',
  day: 'dagaz', //

  cherry: 'kerásion',

  // actual khuzdul vocab!!
  lord: 'uzbad',
  path: 'nâla', // river-course
  black: 'narâg',
  cloud: 'shathûr',
  lake: 'zâram',
  silver: 'kibil', // 'zigil',
  stream: 'ûl',
  horn: 'inbar',
  fortress: 'gathol',
  great: 'gabil',
  laughter: 'gàire',
  spring: 'earrach',
}

// todo add some vocab too? shield -- skjald
// and override: oak -- eik
const khuzdul: Dictionary = assembleDictionary('Khuzdul',
  khuzdulRoots,
  khuzdulVocab,
  {
    'elleu': 'lû',
    'illwyn': 'n',
    // 'esv': 'aev',
  //   'llent': 'lion',
  //   'laú': 'lû',
  //   // 'eille': 'ye',
  //   'ielle': 'we',
  //   // 'oo': 'œ',
  //   'ieo': 'a',
  //   'ii': 'ī', //ié',
  //   'ilel': 'iel',
  //   'lel': 'iliel',
  //   'nillut': 'nt',
  //   'lll': 'l',
  //   'nina': 'on',
  //   // 'onenor': 'inion',
  //   'oul': 'il',
  //   'aa': 'a',
  //   // 'nn': 'm',
  //   'ilo': 'e',
  //   'ndon': 'ine',
  //   'eillio': 'eo',
  //   'iegh': 'gÿl',
  //   'igh': 'g',

  //   // 'll': 'l',
  //   'tie': 'tion',
  //   'onl': 'lÿ',
  //   'ïni': 'iel',
  //   'milk': 'mel',
  //   'ee': 'e',
  //   'ilr': 'ul',
  //   'eghl': 'elen',
  // // 'varl': 'l',
  // // 'gll': 'll',
  // // 'ienen': 'ien',
  // // 'gg': 'eg',
  // // // 'noa': 'na',
  // // 'rr': 'r',
  // // // 'aa': 'a',
  // // // 'glt': 'gut',
  // // // 'gn': 'n',
  // // 'ii': 'ī',
  // // 'īen': 'ilien',
  // // 'aúri': 'uthi',
  // // 'lll': 'lup',
  // // 'ythe': 'eri',
  // // 'dgn': 'ng',
  // // 'nn': 'n',
  // // 'arort': 'uir',
  // // 'ieno': 'eo',
  // // 'rlly': 'a',
  
  // // 'aa': 'a',
  // // 'thien': 'eth',
  // // 'iao': 'eo',
  // // 'rl': 'lin',
  // // 'gg': 'ph',
  // // 'eul': 'uil',
  // // 'gn': 'kn',
  // // 'gv': 'gev',
  // // 'gg': 'kh',
  // // '-': ''
})

export default khuzdul;