// todo thinking Common could be interesting
// idea is to fill in the dictionary but choose 
// poetic wording where possible
// (quality here depends on better solutions
// for syntax / ordering / particles / etc too)

// actually just doing old english now but it's still metal

import { Dictionary, Vocabulary } from "../../ecosphere/Dictionary"


const westronVocab: Vocabulary = {
  abundant: 'over',
  afternoon: 'afternoon',
  apple: 'æppel', // apple',
  autumn: 'hærfest', 
  awe: 'awe',
  battle: 'feoht',
  bay: 'berie', //'-iâ',
  bears: 'bear',
  beautiful: 'beautiful',
  bell: 'cnyll', //bell',
  birch: 'birce',
  birds: 'bridd',
  black: 'blæc', //black',
  blood: 'blood',
  blue: 'blue',
  bold: 'bold',
  bread: 'bread',
  candle: 'candle',
  cherry: 'cirse', // cherry',
  citadel: 'city',
  claws: 'claws',
  cloudy: 'clouded',
  daisy: 'woundwort',
  dandelion: 'puffball',
  day: 'day',
  deep: 'deep',
  dew: 'deaw',
  divine: 'godbearn',
  dragons: 'fýrdraca', //wyrm //sky-serpent',
  dread: 'bróga', //ghastly',
  dream: 'dréam',
  dusk: 'eventide',
  dusty: 'dirty',

  eagles: 'earn',
  earth: 'werdle',
  elderberry: 'elder',
  elephants: 'oliphaunt',
  elm: 'wahu',

  evening: 'evendim',
  fangs: 'fon',
  fate: 'fate',
  fell: 'fell', // deadly
  fire: 'fier', //bæl', //fire', //'naur-',
  firmament: 'heuene-Rof', //heavens',
  fish: 'fisc',
  foe: '-feond', //enemy',
  forest: 'woods',
  fortress: 'hold',
  fortunate: 'lucky',
  freedom: 'freedom',
  friend: 'friend',
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
  haven: '-port',
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
  lake: 'lac',
  land: 'lond', //eäth',
  large: 'rum',
  light: 'leoht',
  lily: 'lilie',
  lofty: 'lofty',
  lonely: 'syndrig',

  lord: '-lord',

  love: 'love',
  magic: 'rún', //charm',
  mantle: 'hacele',
  midnight: 'midnyght',
  mist: 'mistur',
  moon: 'mone', // 'mōna',
  morning: '-morn',
  mound: 'tel-',
  mountain: 'munt-',
  music: 'dréamcræft', //-song',

  narrow: 'narrow-',
  needle: 'needle',
  night: 'nyght',
  nightingales: 'stærlinc', //thrush',
  noon: 'noon',
  oak: 'eik',
  orange: 'orenge',
  pale: 'wann-',
  path: 'brimlad',
  peak: 'peak', // see point, needle
  peoples: '-folk',

  pine: 'pintreow',
  place: '-stead',//bídung', //place',
  point: '-gad',
  pool: '-clæne', //mere',
  poppy: 'celandine',
  prison: 'gaol', // 'carcern'

  quick: 'fast',
  rain: 'rainy',
  rainbow: 'rainbow',

  realm: '-ríce', //ward',
  red: 'reod-',
  region: '-guard',
  river: '-ex',
  road: 'road',
  rose: 'róse',

  sea: 'estmere', //'mer',
  secret: 'secret',
  shade: 'sceadu',
  shadow: 'sceaduwe', //shadow', // 'gwath', //dûl',
  sharp: 'sharp',
  ship: 'scip',
  silence: 'stige',
  silver: 'seolfor',
  skill: 'skill',
  sky: 'sky',
  slave: 'thrall',
  small: 'smæl',
  smith: '-wyrhta',
  snakes: 'serpent',
  snow: 'snow-',
  sorrow: 'sorrow',
  spark: 'ysl', //spark-',
  sparkling: 'sparkling',
  speech: 'speech*',
  spirit: 'arodnes-',
  splendid: 'splendid-',
  spring: 'spring',
  spruce: 'sæppe',
  starlight: 'starlight',
  stars: '-steorra', //star',
  stream: 'river',
  stronghold: '-fæsten',
  summer: 'sumor', //aer',
  sun: 'sun*',
  swans: 'swan',
  sweet: 'sweet',

  tall: "brant-", //nd-",
  tears: 'tears',
  thought: 'thought*',
  tin: '-zin',
  tiny: 'tyne*',
  tomorrow: 'morrow',
  tower: 'tower-',
  treasure: 'prize',
  tyranny: 'mánbealu',

  valley: 'dæl', //vale',
  veil: 'veil',
  water: 'water',
  wax: 'wax',
  white: 'albe', // hwit
  wide: 'wide',
  willow: 'willow',
  wind: 'wind',
  wine: '-win',
  winter: 'winter',
  holly: 'holen-',
  garden: 'garden',
  queen: 'queen',
  prince: 'prince',
  princess: 'princess',
  cloud: 'walkne', //cloud',
  hounds: 'hund',
  wolves: 'wulf',
  embers: 'ysl', //embers',
  soot: 'soot',
  ash: 'ash',
  salt: 'salt',
  void: 'space',
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
