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

  '-woman': '-iel',
  '-maid': '-wen',

  afternoon: 'avnedhor',
  autumn: 'iarvas-', 
  awe: 'anwar',
  bay: 'côf', //'-iâ',
  bears: 'graw',
  beautiful: 'bain',
  bell: 'nell',
  birch: 'hwinn*',
  birds: 'aewen',
  black: 'morn',
  blue: 'luin-',
  bold: 'beren',
  cherry: 'aebin*',
  claws: 'gamp-',
  cloudy: 'fanui',
  daisy: 'eirien',
  dandelion: 'orchen',
  deep: 'nûr-',
  dragons: 'amlug',
  dread: 'gost',
  dusk: 'moth-',
  dusty: 'astren',
  eagles: 'thoron',
  earth: '-amar',
  elephants: 'annabon',
  elm: 'alaf',
  evening: 'aduial',
  fangs: 'caraxë',
  fate: 'amarth',
  fell: 'delu', // deadly
  fire: 'naur-',
  firmament: 'menel*',
  foe: '-coth',
  forest: 'taur*',
  fortress: 'ost',
  fortunate: 'alwed',
  friend: '-mellon',
  giant: 'noroth',
  gold: 'malt-',
  golden: 'glóriel',
  gray: 'thind-',
  great: 'beleg-',
  green: 'calen-',
  haven: '-ondë',
  hill: '-amon', // tun
  holy: 'aer',
  honey: 'glî',
  horns: 'rais',
  horror: 'angoss-',
  horses: 'roch',
  ice: 'hel-',
  iron: 'ang-',
  isle: 'tol',
  joy: 'glass-',
  kingdom: 'arnad',
  lake: 'ael',
  land: 'dor-',
  light: 'ea',
  lofty: 'raud',
  lonely: 'air*',
  lord: '-gon',
  mantle: 'col-',
  midnight: 'fuin',
  mist: 'hith-',
  moon: 'ithil',
  morning: '-aur',
  mound: 'coron-',
  mountain: 'ered',
  music: '-linnas',
  narrow: 'agor-',
  needle: 'aeglin',
  night: 'dû',
  nightingales: 'dúlin*',
  noon: 'nedhor',
  oak: 'doron*',
  orange: 'culuin',
  path: 'lant',
  peak: 'aegnas', // lin', // point
  peoples: 'li-',
  pine: 'thon*',
  place: 'sa-',
  point: 'til',
  poppy: 'lurloss-',
  prison: '-band',
  rain: 'ross-',
  rainbow: 'ninniach',
  realm: '-arthor',
  red: 'caran-',
  region: 'gardh',
  river: '-rant',
  rose: 'merin*',
  sea: '-geaer', //'mer',
  secret: 'dolen',
  shadow: '-lum', // 'gwath', //dûl',
  sharp: 'crisg-',
  silence: 'dhín-',
  silver: 'celeb-',
  skill: 'curu-',
  sky: '-ell',
  small: 'cidinn*',
  snow: 'loss-',
  spark: 'tinu-',
  speech: 'paeth*',
  spring: 'ethuil',
  spruce: 'ecthelorn*',
  starlight: 'gilith',
  stars: '-ngil',
  summer: 'llairë', //aer',
  sun: 'anor*',
  swans: 'alqual',
  sweet: 'laich',
  tall: "ta-", //nd-",
  thought: 'nauth*',
  valley: 'nan', // vale; see glen(-imlad)
  water: 'nin',
  white: 'nim-', //'nim-',

  wide: 'land-',
  willow: 'tathar*',
  winter: 'rhîw',

  tin: '-ladog',
  treasure: 'maen',
  divine: 'ballean',
  splendid: 'claur',
  large: 'daer',
  tiny: 'tithen',
  sorrow: 'nîr',
  tears: 'nirnaeth',
  blood: 'sereg',
  dew: 'mîdh',
  love: 'mîl',
  glen: 'imlad' // dell
}

const replacements = {
  'db': 'v',
  'dc': 'g',
  'nc': 'g',
  // 'nuil': 'll',
  'ui': 'uvi',

  'nl': '',

  // 'uil': 'ol',
  // 'aer': 'airë',
  // 'mt': 'quet',
  // 'ondn': 'an',
  // 'll': 'l',
  // 'aire': 'ere',
  'ean': 'ónë', //on',
  // 'laer': 'lairë',
  'imti': 'iqueti',
  // 'ndn': 'n'
  'nn': 'n', //nn',
}
const dashBeginnings: { [begin: string]: string } = {
  'ng': 'e',
}

const dashEndings: { [end: string]: string } = {
  // 'r': 'grin',
  'ss': 'ë',
  // ie -n's  get iath except for -en (which we leave alone)
  // 'en': ' ',
  'n': 'iath',
  'lt': 'hen',
  'll': 'l',
}

const starEndings: { [end: string]: string } = {
  'ir': 'essëa',
  'r': 'iand',
  'on': 'ion'
}

const simpleEnhance = (tx: string) => {
  tx = tx.split(' ').map(word => {
    if (word.startsWith('-')) {
      word = word.substring(1, word.length) //replace(/-/, '')
      Object.keys(dashBeginnings).forEach(beginning => {
        console.log("COMPARE", { word, beginning })
        if (word.startsWith(beginning)) {
          word = dashBeginnings[beginning] + word
        }
      })
    }
    if (word.endsWith('-')) {
      word = word.replaceAll('-', '')
      
      Object.keys(dashEndings).forEach(ending => {
        if (word.endsWith(ending)) {
          word += dashEndings[ending]
        }
      })
      // if (word.endsWith('r')) { word += 'grin' }
      // else if (word.endsWith('lt')) { word += 'then' }
      // else if (word.endsWith('ss')) { word += 'ë' }
      // else word += 'ren';

      // word += 'en'
    }
    if (word.endsWith('*')) {
      word = word.replaceAll('*', '')
      Object.keys(starEndings).forEach(ending => {
        if (word.endsWith(ending)) {
          word += starEndings[ending]
        }
      })
      // if (word.endsWith('ir')) { word += 'essëa' } //essea' }
      // else if (word.endsWith('r')) { word += 'iand' }
      // else { word += 'ion'; }
    }
    Object.entries(replacements).forEach(([search, replace]) => {
      word = word.replaceAll(search, replace)
    })

    // hmmm
    word.replaceAll('*', '')
    return word
  }).join(' ')
  return tx
}

// const enhance = (translation: string) => {
//   // help the translation function a bit
//     if (translation.endsWith('-')) {
//       translation = translation.substring(0, translation.length - 1);
//       // if (translation.endsWith('ith')) { translation += 'ë' }
//       if (translation.endsWith('ss')) { translation += 'ë' }
//       else if (translation.endsWith('r')) { translation += 'gren' }
//       else { translation += 'ren' }
//     }

//     if (translation.endsWith('*')) {
//       translation = translation.substring(0, translation.length - 1);
//       if (translation.endsWith('ir')) { translation += 'essëa' } //essea' }
//       else if (translation.endsWith('r')) { translation += 'iand' }
//       else if (translation.endsWith('n')) { translation += 'ion' }
//       else { translation += 'iath' }
//     }
//     translation = translation.replaceAll('*', '')

//     // irregular but try to cleanup some weird constructions...
//     // translation = translation.replaceAll('dng', 'd eng')
//     translation = translation.replaceAll('n uil', 'llin')
//     // for 'taniquetil' ... (otherwise: raud nimtil)
//     translation = translation.replaceAll('mt', 'quet')
//     // translation = translation.replaceAll('ud nn', 'n')
//     translation = translation.replaceAll('nd ni', 'ni')
//     translation = translation.replaceAll('rgr', 'gr')
//     translation = translation.replaceAll('dc', 'g')
//     translation = translation.replaceAll('nc', 'g')
//     translation = translation.replaceAll('aire', 'ere')
//     translation = translation.replaceAll('naer', 'nairë')
//     translation = translation.replaceAll('fng', 'f eng')

//     translation = translation.replaceAll('uie', 'uvie')
//     // translation = translation.replaceAll('inin', 'ien')
//     // translation = translation.replaceAll('ln', 'len')
//     // translation = translation.replaceAll(ng/, 'Eng')
//     if (translation.startsWith('ng')) { translation = translation.replace('ng', 'eng')}
//     if (translation.startsWith('ui')) { translation = translation.replace('ui', 'oio')}
//     // if (translation.startsWith('ra')) { translation = translation.replace('ra', 'ta')}
//     if (translation.startsWith('ton')) { translation = translation.replace('to', 'ta')}
//     if (translation.endsWith('ll')) { translation = translation.substring(0, translation.length - 1) } //replace('ll', 'l')}

//     return translation

// }

const Aelvic = new Dictionary("Aelvic (Neo-Sindarin)",  Sindarin,
  (tx) => simpleEnhance(tx))
  // (tx) => tx)
  //enhance(tx))
export { Aelvic }
