import { Dictionary, Vocabulary } from "../../ecosphere/Dictionary";

// see https://eldamo.org/content/vocabulary-indexes/vocabulary-words-ns.html
export const Sindarin: Vocabulary = {
  // was confusing to try to do this one b/c of the order!
  '-less': 'uv-',

  'ever-': 'ui-', // 'ever-dusk' --> evendim
  'at-': 'ad-',

  // fem/masculine suffices
  '-person': '-we',
  '-man': '-on',
  '-son': '-ion',

  '-woman': '-ien',
  '-maid': '-wen',
  '-daughter': '-iell',

  'mountain-chain': '-orodrim',

  abundant: 'ovor',
  afternoon: 'avnedhor',
  apple: 'orf',
  autumn: 'iarvas-', 
  awe: 'anwar',
  battle: 'dagor',
  bay: 'côf', //'-iâ',
  bears: 'graw',
  beautiful: 'bain',
  bell: 'nell',
  birch: 'hwinn*',
  birds: 'aewen',
  black: 'morn',
  blood: 'sereg',
  blue: 'luin-',
  bold: 'beren',
  bread: '-bas',
  candle: 'lígu',
  cherry: 'aebin*',
  citadel: 'ost-',
  claws: 'gamp-',
  cloudy: 'fanui',
  daisy: 'eirien',
  dandelion: 'orchen',
  day: 'or-',
  deep: 'nûr-',
  dew: 'mîdh-',
  divine: 'ballean',
  dragons: 'amlug',
  dread: 'gost',
  dream: 'ôl',
  dusk: 'moth-',
  dusty: 'astren*',
  eagles: 'thoron',
  earth: '-amar',
  elderberry: 'gwennod',
  elephants: 'annabon',
  elm: 'alaf',
  evening: 'aduial',
  fangs: 'caraxë',
  fate: 'amarth',
  fell: 'delu', // deadly
  fire: 'nor-', //'naur-',
  firmament: 'menel*',
  fish: 'lhim',
  foe: '-coth',
  forest: 'taur*',
  fortress: 'garth-',
  fortunate: 'alwed',
  freedom: 'leinas',
  friend: '-mellon',
  frost: 'nais',
  giant: 'noroth',
  glen: 'imlad', // dell
  gloom: 'dim-',
  gold: 'malt-',
  golden: 'glóriel',
  gray: 'thind-',
  great: 'beleg-',
  green: 'calen-',
  harbor: 'hûb',
  haven: '-lond*',
  hill: '-amon', // tun
  holy: 'aer',
  honey: 'glî',
  horns: 'rais',
  horror: 'angoss-',
  horses: 'roch',
  ice: 'hel-',
  iron: 'ang-',
  isle: 'tol',
  jewel: 'mîr',
  journey: 'ledh-',
  joy: 'glass-',
  king: 'aran',
  kingdom: 'arnad',
  lake: 'ael',
  land: 'dor-',
  large: 'daer',
  light: 'ea',
  lily: 'loth',
  lofty: 'raud',
  lonely: 'air*',
  lord: '-gon',
  love: 'mîl',
  magic: 'lûth',
  mantle: 'col-',
  midnight: 'fuin',
  mist: 'hith-',
  moon: 'ithil',
  morning: '-aur',
  mound: 'coro-',
  mountain: 'ered',
  music: '-linnas',
  narrow: 'agor-',
  needle: 'aeglin',
  night: 'dû',
  nightingales: 'dúlin*',
  noon: 'nedhor',
  oak: 'doron*',
  orange: 'culuin',
  pale: 'nim-',
  path: 'lant',
  peak: 'aegnas', // see point, needle
  peoples: 'li-',
  pine: 'thon*',
  place: 'sa-',
  point: 'til',
  pool: 'lîn',
  poppy: 'lurloss-',
  prison: '-band',
  quick: 'lim',
  rain: 'ross-',
  rainbow: 'ninniach',
  realm: '-arthor',
  red: 'caran-',
  region: 'gardh',
  river: '-rant',
  road: 'men',
  rose: 'merin*',
  sea: '-geaer', //'mer',
  secret: 'dolen*',
  shade: 'gwath',
  shadow: '-lum', // 'gwath', //dûl',
  sharp: 'crisg-',
  ship: 'cair*',
  silence: 'dhín-',
  silver: 'celeb-',
  skill: 'curu-',
  sky: '-ell',
  slave: 'mûl',
  small: 'cidinn*',
  smith: '-tan',
  snakes: 'lŷg',
  snow: 'loss-',
  sorrow: 'nîr',
  spark: 'tinu-',
  sparkling: 'míriel',
  speech: 'paeth*',
  spirit: 'fëa-',
  splendid: 'claur-',
  spring: 'ethuil',
  spruce: 'ecthelorn*',
  starlight: 'gilith',
  stars: '-ngil',
  stream: 'sîr',
  stronghold: '-gothrond',
  summer: 'llairë', //aer',
  sun: 'anor*',
  swans: 'alqua',
  sweet: 'laich',
  tall: "ta-", //nd-",
  tears: 'nirnaeth',
  thought: 'nauth*',
  tin: '-ladog',
  tiny: 'tithen*',
  tomorrow: 'abor',
  tower: 'barad-',
  treasure: 'maen*',
  tyranny: 'thang',
  valley: 'nan', // vale; see glen(-imlad)
  veil: 'fân',
  water: 'nin',
  wax: 'lîg',
  white: 'nique-',
  wide: '-land',
  willow: 'tathar*',
  wind: 'gwae',
  wine: 'miru',
  winter: 'rhîw',
}

const replacements = {
  'db': 'v',
  'dc': 'g',
  'nc': 'g',
  'uie': 'uvie',
  'airt': 'írd',
  'air': 'er',
  'ln': 'len',
  'ean': 'ónë',
  'fn': 'van',
  // 'aire': 'ere',
  'rngil': 'rgil*',
  'nn': 'n',
}
const dashBeginnings: { [begin: string]: string } = { 'ng': 'a' }

const dashEndings: { [end: string]: string } = {
  'ss': 'ë',
  'n': 'iath',
  'lt': 'hen',
  'll': 'l',
}

const starEndings: { [end: string]: string } = {
  'er': 'essëa',
  // 'er': 'essëa',
  'r': 'iand',
  'on': 'ion',
  'il': 'ion',
  'd': 'ë',
}

const simpleEnhance = (tx: string) => {
  tx = tx.split(' ').map(word => {
    if (word.startsWith('-')) {
      word = word.substring(1, word.length)
      Object.keys(dashBeginnings).forEach(beginning => {
        if (word.startsWith(beginning)) {
          word = dashBeginnings[beginning] + word
        }
      })
    }
    if (word.endsWith('-')) {
      word = word.substring(0, word.length - 1)
      Object.keys(dashEndings).forEach(ending => {
        if (word.endsWith(ending)) {
          word += dashEndings[ending]
        }
      })
    }

    Object.entries(replacements).forEach(([search, replace]) => {
      word = word.replaceAll(search, replace)
    })

    if (word.endsWith('*')) {
      word = word.replaceAll('*', '')
      Object.keys(starEndings).forEach(ending => {
        if (word.endsWith(ending)) {
          word += starEndings[ending]
        }
      })
    }

    // hmmm
    word.replaceAll('*', '')
    return word
  }).join(' ')
  return tx
}

const Aelvic = new Dictionary("Aelvic (Neo-Sindarin)",  Sindarin,
  (tx) => simpleEnhance(tx))
  // (tx) => tx)
  //enhance(tx))
export { Aelvic }
