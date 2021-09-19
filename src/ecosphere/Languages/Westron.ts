// todo thinking Common could be interesting
// idea is to fill in the dictionary but choose 
// poetic wording where possible
// (quality here depends on better solutions
// for syntax / ordering / particles / etc too)

// actually just doing old english now but it's still metal

import { Dictionary, Vocabulary } from "../Dictionary"


const westronVocab: Vocabulary = {
  heat: 'hǣte',
  cold: 'cheald',
  abundant: 'ofer',
  afternoon: 'ofernón',//afternoon',
  apple: 'æppel', // apple',
  autumn: 'hærfest', 
  awe: 'ondrysnu', //awe',
  battle: 'gefeoht', //'feoht',
  bay: 'berie', //'-iâ',
  bears: 'bera',
  beautiful: 'cyrten',
  bell: 'cnyll', //bell',
  birch: 'beorc',
  bitter: 'āfor',
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
  day: 'dæg', //day',
  dark: 'dearc',
  deep: 'deop', //deopnes',
  dew: 'deaw',
  divine: 'týr', //sublim', //godcund', //godbearn',
  dragons: 'fýrdraca', //wyrm //sky-serpent',
  dread: 'bróga', //ghastly',
  dream: 'drēam', // dréam',
  dusk: 'dosk', //eventide',
  dusty: 'dystig',

  eagles: 'earn',
  earth: 'aarde',
  elderberry: 'elder',
  elephants: 'elpend', //oliphaunt',
  elm: 'wych', //wahu',

  evening: 'ǣfnung', //evendim',
  fangs: '-fon',
  fate: 'déaþwyrd', //fate',
  fell: 'fell', // deadly
  fire: 'fýr', //furen', //'fier', //bæl', //fire', //'naur-',
  firmament: 'heuene-Rof', //heavens',
  fish: 'fisc',
  foe: '-feond', //enemy',
  forest: 'forwest',
  fortress: 'healden',
  fortunate: 'eádeg', //lucky',
  freedom: 'freodom',
  friend: 'frēond', //friend',
  frost: 'hrīm', //rime',
  giant: 'ēoten', // colossus',
  glen: 'glyn', // dell
  gloom: 'glōm', //murk',
  gold: 'guld',
  golden: 'gylden',
  gray: 'grár', //græ',
  great: 'ærgod', // great',
  green: 'grene',

  harbor: 'hyth',
  haven: '-haff', //hæfen', //port',
  hill: '-holm', // 'hyll', // tun
  holy: 'hāliġ',
  honey: 'huniġ',
  horns: 'kern',
  horror: 'fyrhtu',
  horses: 'eoh',

  ice: 'īs',
  iron: 'ísen',
  isle: 'īegland', //island',

  jewel: 'siġel',
  journey: 'faru',
  joy: 'drēam', // 'ġefēa', //joy',
  king: 'kenning',
  kingdom: 'kenningdom',
  laughter: 'hleahtor',
  lake: 'lac',
  land: 'lond', //eäth',
  large: 'rum',
  light: 'leoht',
  lily: 'lilie',
  lofty: 'hoch',
  lonely: '-syndrig',

  lord: 'frēa', //-lord',

  love: 'leof',
  magic: 'rún', //charm',
  mantle: 'hacele',
  midnight: 'midnyght',
  mist: '-hase', //'mistur',
  moon: 'mēnô', //mone', // 'mōna',
  morning: '-morn',
  mound: 'tel-',
  mountain: 'munt-',
  music: 'dréam', //cræft', //-song',

  narrow: 'nearunes',//narrow-',
  needle: 'nædl', //needle',
  night: 'nyght',
  nightingales: 'stærlinc', //thrush',
  noon: 'noon',

  oak: 'eik',
  orange: 'orenge',

  pale: 'wann-',
  path: 'pade-', //brimlad',
  peak: 'piic', //pinca', // see point, needle
  peoples: '-folk',
  pine: 'pintreow',
  place: '-stead',//bídung', //place',
  point: '-gad',
  pool: '-clæne', //mere',
  poppy: 'popiġ', //celandine',
  prison: '-cweartern', //gaol', // 'carcern'

  quick: 'cwic', //fast',
  rain: 'reġn', // regn',
  rainbow: 'reġnboga', //rainbow',

  realm: '-ríce', //ward',
  red: 'reod-',
  region: '-guard',
  river: '-ex',
  road: 'rād', //road',
  rose: 'róse',

  sea: 'sǣ', // 'estmere', //'mer',
  secret: 'hord', //secret',
  shade: 'sceadu',
  shadow: 'sceaduwe', //shadow', // 'gwath', //dûl',
  sharp: 'sharp',
  ship: 'scip',
  silence: 'swīġe', //stilnes', //stige',
  silver: 'seolfor',
  skill: 'cræft', //searu',
  sky: 'heofon', //sky',
  slave: 'träl', //thrall',
  small: 'smæl',
  smith: '-wyrhta',
  snakes: 'natra',
  snow: 'snáw', //snow-',
  sorrow: 'sorh',
  spark: 'ysl', //spark-',
  sparkling: 'bladesung',
  speech: 'sprǽc', //speech*',
  spirit: 'arodnes-',
  splendid: 'from', //splendid-',
  spring: 'lencten',
  spruce: 'sæppe',
  starlight: 'tunglenleoht', //light',
  stars: '-tunglen', // tungol // steorra', //star',
  // astronomy: 'tungolcræft',
  stream: 'strēam', //river',
  stronghold: '-fæsten',
  summer: 'haf', //sumor', //aer',
  sun: 'sunu',
  swans: 'ilfetu', //swan',
  sweet: 'swéte', //sweet',

  tall: "brant-", //nd-",
  tears: 'hróp', //tears',
  thought: 'thóht', //thought*',
  tin: '-zin',
  tiny: 'tyne*',
  tomorrow: 'tōmorgen', //morrow',
  tower: 'stipel-',
  treasure: 'sinc',
  tyranny: 'mánbealu',

  valley: 'dæl', //vale',
  veil: 'oferbræ', //veil',
  water: 'wæter', //water',
  wax: 'weax',
  white: 'albe', // hwit
  wide: 'wide',
  willow: 'welig',
  wind: 'wend',
  wine: '-win',
  winter: 'yver', //'winter',
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
  'ever-': 'ǣfre-', //even-', // 'ever-dusk' --> evendim
  'at-': 'æt-', //upon-',

  // fem/masculine suffices
  '-person': '-wight',
  '-man': '-man',
  '-son': '-ing',

  '-woman': '-fro',
  '-maid': '-magað', //'-mæden', //maid',
  '-daughter': '-dohtor',
  
  'mountain-chain': 'beorgstede',
}

const replacements: { [key: string]: string } = {
  'lenlond': 'llin',
}

const Westron = new Dictionary('Westron', westronVocab, (input: string) => {
  Object.keys(replacements).forEach(key => {
    if (input.includes(key)) {
      input = input.replaceAll(key, replacements[key])
    }
  })
  return input
})

export default Westron
