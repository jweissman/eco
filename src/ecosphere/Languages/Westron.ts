// todo thinking Common could be interesting
// idea is to fill in the dictionary but choose 
// poetic wording where possible
// (quality here depends on better solutions
// for syntax / ordering / particles / etc too)

// actually just doing old english now but it's still metal

import { Dictionary, Vocabulary } from "../Dictionary"


const westronVocab: Vocabulary = {
  abundant: 'ofer',
  afternoon: 'ofernón',//afternoon',
  apple: 'æppel', // apple',
  autumn: 'hærfest', 
  awe: 'ondrysnu', //awe',
  battle: 'feoht',
  bay: 'berie', //'-iâ',
  bears: 'bera',
  beautiful: 'cyrten',
  bell: 'cnyll', //bell',
  birch: 'beorc',
  birds: 'bord',
  black: 'blæc', //black',
  blood: 'blod',
  blue: 'bleó', //blaw',
  bold: 'baldor',
  bread: 'hláf', //bread',
  candle: 'condell',
  cherry: 'cirse', // cherry',
  citadel: 'burhfæsten', //city',
  claws: 'clif',
  cloudy: 'genipfull', //clouded',
  daisy: 'dæges', // woundwort',
  dandelion: 'æg-wyrt', // puffball',
  day: 'day', //day',
  deep: 'deopnes',
  dew: 'deaw',
  divine: 'godbearn',
  dragons: 'fýrdraca', //wyrm //sky-serpent',
  dread: 'bróga', //ghastly',
  dream: 'dréam',
  dusk: 'eventide',
  dusty: 'dystig',

  eagles: 'earn',
  earth: 'werdle',
  elderberry: 'elder',
  elephants: 'oliphaunt',
  elm: 'wahu',

  evening: 'evendim',
  fangs: 'fon',
  fate: 'déaþwyrd', //fate',
  fell: 'fell', // deadly
  fire: 'fier', //bæl', //fire', //'naur-',
  firmament: 'heuene-Rof', //heavens',
  fish: 'fisc',
  foe: '-feond', //enemy',
  forest: 'forwest',
  fortress: 'hold',
  fortunate: 'eádeg', //lucky',
  freedom: 'freodom',
  friend: 'frēond', //friend',
  frost: 'rime',
  giant: 'ēoten', // colossus',
  glen: 'dell', // dell
  gloom: 'murk',
  gold: 'gold',
  golden: 'gylden',
  gray: 'græ',
  great: 'ærgod', // great',
  green: 'grene',

  harbor: 'hyth',
  haven: '-haff', //hæfen', //port',
  hill: 'dun', // tun
  holy: 'hāliġ',
  honey: 'huniġ',
  horns: 'horns',
  horror: 'fyrhtu',
  horses: 'eoh',

  ice: 'īs',
  iron: 'ísen',
  isle: 'īegland', //island',

  jewel: 'siġel',
  journey: 'faru',
  joy: 'ġefēa', //joy',
  king: 'kenning',
  kingdom: 'kenningdom',
  laughter: 'hleahtor',
  lake: 'lac',
  land: 'lond', //eäth',
  large: 'rum',
  light: 'leoht',
  lily: 'lilie',
  lofty: 'lofty',
  lonely: 'syndrig',

  lord: 'frēa', //-lord',

  love: 'leof',
  magic: 'rún', //charm',
  mantle: 'hacele',
  midnight: 'midnyght',
  mist: 'mistur',
  moon: 'mēnô', //mone', // 'mōna',
  morning: '-morn',
  mound: 'tel-',
  mountain: 'munt-',
  music: 'dréamcræft', //-song',

  narrow: 'nearunes',//narrow-',
  needle: 'nædl', //needle',
  night: 'nyght',
  nightingales: 'stærlinc', //thrush',
  noon: 'noon',

  oak: 'eik',
  orange: 'orenge',

  pale: 'wann-',
  path: 'brimlad',
  peak: 'pinca', // see point, needle
  peoples: '-folk',
  pine: 'pintreow',
  place: '-stead',//bídung', //place',
  point: '-gad',
  pool: '-clæne', //mere',
  poppy: 'popiġ', //celandine',
  prison: 'gaol', // 'carcern'

  quick: 'fast',
  rain: 'reġn', // regn',
  rainbow: 'reġnboga', //rainbow',

  realm: '-ríce', //ward',
  red: 'reod-',
  region: '-guard',
  river: '-ex',
  road: 'road',
  rose: 'róse',

  sea: 'estmere', //'mer',
  secret: 'hord', //secret',
  shade: 'sceadu',
  shadow: 'sceaduwe', //shadow', // 'gwath', //dûl',
  sharp: 'sharp',
  ship: 'scip',
  silence: 'stige',
  silver: 'seolfor',
  skill: 'cræft', //searu',
  sky: 'heofon', //sky',
  slave: 'thrall',
  small: 'smæl',
  smith: '-wyrhta',
  snakes: 'serpent',
  snow: 'snáw', //snow-',
  sorrow: 'sorh',
  spark: 'ysl', //spark-',
  sparkling: 'bladesung',
  speech: 'sprǽc', //speech*',
  spirit: 'arodnes-',
  splendid: 'from', //splendid-',
  spring: 'spring',
  spruce: 'sæppe',
  starlight: 'starlight',
  stars: '-steorra', //star',
  stream: 'strēam', //river',
  stronghold: '-fæsten',
  summer: 'sumor', //aer',
  sun: 'sunu',
  swans: 'ilfetu', //swan',
  sweet: 'swéte', //sweet',

  tall: "brant-", //nd-",
  tears: 'hróp', //tears',
  thought: 'þóht', //thought*',
  tin: '-zin',
  tiny: 'tyne*',
  tomorrow: 'morrow',
  tower: 'stipel-',
  treasure: 'sinc',
  tyranny: 'mánbealu',

  valley: 'dæl', //vale',
  veil: 'oferbræ', //veil',
  water: 'water',
  wax: 'weax',
  white: 'albe', // hwit
  wide: 'wide',
  willow: 'welig',
  wind: 'wend',
  wine: '-win',
  winter: 'winter',
  holly: 'holen-',
  garden: 'gewyrtún', //garden',
  queen: 'cwen', //queen',
  prince: 'prince',
  princess: 'princess',
  cloud: 'genip', //cloud',
  hounds: 'hund',
  wolves: 'wulf',
  embers: 'ysl', //embers',
  soot: 'hrum', //soot',
  ash: 'asce',
  salt: 'sealt',
  void: 'rūm', //space',
  steam: 'stēam',
  magma: 'lava',
  radiance: 'glæm', //brilliance',

  '-less': 'no-',
  'ever-': 'even-', // 'ever-dusk' --> evendim
  'at-': 'upon-',

  // fem/masculine suffices
  '-person': '-person',
  '-man': '-man',
  '-son': '-ing',

  '-woman': '-wiman',
  '-maid': '-mæden', //maid',
  '-daughter': '-dohtor',
  
  'mountain-chain': 'beorgstede',
}

const replacements: { [key: string]: string } = {
  'lenlond': 'llin',
}

const Westron = new Dictionary('Common', westronVocab, (input: string) => {
  Object.keys(replacements).forEach(key => {
    if (input.includes(key)) {
      input = input.replaceAll(key, replacements[key])
    }
  })
  return input
})

export default Westron
