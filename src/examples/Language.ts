// todo but -- instead of simple markov we should be able to generate a sensible language
// (goals are: generate a few verb cores + basic vocab; translating significant names; assemble a few full sentences)

import { Model } from "../ecosphere/Model"
// import { sample } from "../ecosphere/utils/sample"


const capitalize = (word: string) => word.replace(/^\w/, c => c.toUpperCase()) 
// function capitalize(str: string): any {
//   return str[0].toUpperCase() + str.toLowerCase().slice(1)
//   // throw new Error("Function not implemented.")
// }
// const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'] as const;
// export type Color = typeof colors[number]; // 'red'|'orange'|'yellow'|'green'|'blue'|'indigo'|'violet'

// suitable for naming things...

const concepts = [
  'earth', 'sky',
  'mountain', 'hill', 'valley', 'peak',
  'sea', 'river', 'isle', 'lake',
  'forest',
  'land', 'place', 'realm',
  'peoples', 'kingdom',
  'path', 'haven', 'fortress', 'prison',
  // modifiers..
  '-less',

  // ...aspects,
  'light', 'shadow', 'sun', 'moon', 'stars', 'mist', 'iron', 'silver', 'gold', 'great', 'small', 'white', 'black',
  // ...animals,
  'birds', 'dragons', 'elephants', 'swans', 'eagles', 'nightingales', 'bears',
  // ...elements,
  'ice', 'fire', 'earth', 'water',
  // ...times of day
  'morning', 'evening', 'dusk', 'noon', 'afternoon', 'midnight',
  // trees
  'willow', 'pine', 'cherry', 'oak', 'spruce', 'birch',

  'horns', 'fangs', 'claws',
  // 'needle',
  'music', 'silence',


] as const;

export type Concept = typeof concepts[number];

type Lexeme = string

type Vocabulary = {[key in Concept]: Lexeme}

const titleize = (str: string) => str.split(' ').map(word => capitalize(word)).join(' ');

export class Dictionary {
  constructor(public languageName: string, protected vocabulary: Vocabulary) {
    // super(`${name} Language`)
  }

  // vowels = ['a', 'e', 'i', 'o', 'u']
  translate(...concepts: Concept[]): Lexeme {
    let translation = concepts.reduce((acc, concept) => {
      let word = this.vocabulary[concept]
      // let [ first, second ] = [ acc, word ]//form = (word: string, acc: string) => [ acc, word ]

      acc = acc.trim()
      let space = true
      if (acc.endsWith('-')) { space = false; acc = acc.replaceAll('-', '') }
      // if (word.endsWith('-')) { space = false; word = word.replaceAll('-', '') }
      if (word.startsWith('-')) { space = false; word = word.replaceAll('-', '') }
      if (word.startsWith(acc[acc.length-1])) { space = false; acc = acc.substring(0, acc.length - 1) }
      // if (any(this.vowels, vowel => word.startsWith(vowel))) { space = false; }
      let elements = [acc, word]
      if (concept.startsWith('-')) { // suffixes (-less) become a prefix (u-)...
      //   // return [ word, acc ].join('')
      //   // form = (word: string, acc: string) => [ word, acc ]
      //   // [ first, second ] = [ word, acc ]
        space = false;
        if (word.endsWith('-')) { word = word.replaceAll('-', '') } //'\'') }
        // word = word.replaceAll('-', '')
        // acc = acc.replaceAll('-', '')
        // console.log('invert', { word, acc })
        elements = [word, acc] //.join(space ? ' ' : '')
      }
      return elements.join(space ? ' ' : '')
    }, '')
    // .split(' ').map(word => capitalize(word).replaceAll('-', '')).join(' ')
    // translation = translation.replace('d h', 'd')
    // translation = translation.replace('dc', 'd c')
    // irregular but try to cleanup some weird constructions...

    if (translation.endsWith('-')) {
      translation = translation.substring(0, translation.length - 1);
      if (translation.endsWith('ith')) { translation += 'lum' }
      else if (translation.endsWith('r')) { translation += 'gren' }
      else { translation += 'ren' }
                  // + 'en';
    }

    if (translation.endsWith('*')) {
      translation = translation.substring(0, translation.length - 1);
      translation.replaceAll('*', '')
      translation += 'ion'
    }
    // translation = translation.replaceAll('dng', 'd eng')
    // translation = translation.replaceAll('nn', 'en')
    // translation = translation.replaceAll('dc', 'cie')
    // translation = translation.replaceAll('inin', 'ien')
    // translation = translation.replaceAll('ln', 'len')
    // translation = translation.replaceAll(ng/, 'Eng')
    if (translation.startsWith('ng')) { translation = translation.replace('ng', 'eng')}

    
    return titleize(translation)
  }
  name = (idea: Concept) => (descriptor: Concept) => {
    let notion = capitalize(idea)
    let description = capitalize(descriptor)
    let form = `${description} ${notion}` // desc.length >= 5 ? `${desc}mount` : `${desc} Mountains`
    if (description.endsWith('s')) { form = `${description}' ${notion}`}
    // if (description.endsWith('s')) { form = `${description} ${notion}`}
    // let point: Concept = 'mountain' //sample(['mountain', 'hill', 'peak'])
    let translation = `${this.translate(idea, descriptor)}`;
        // alternateTranslation = `${this.translate(descriptor, idea)}`;
    return [ 
      form,
      translation
      // translation.length <= alternateTranslation.length
      //   ? translation
      //   : alternateTranslation,
      // sample(
      // )
    ]
  }
  nameMountain = this.name('mountain')
  namePeak = this.name('peak')
  // (descriptor: Concept) => {
  //   
  //   let desc = capitalize(descriptor)
  //   let form = `Mountains of ${desc}` // desc.length >= 5 ? `${desc}mount` : `${desc} Mountains`
  //   if (desc.endsWith('s')) { form = `${desc}' Mount`}
  //   let point: Concept = 'mountain' //sample(['mountain', 'hill', 'peak'])
  //   return [ 
  //     form,
  //     `${this.translate(point, descriptor)}`
  //   ]
  // }
}

// const descriptiveIdeas: Concept[] =  [

//   // ...aspects,
//   'light', 'shadow', 'sun', 'moon', 'stars', 'mist', 'iron', 'silver', 'gold', 'great', 'small', 'white', 'black',
//   // ...animals,
//   'birds', 'dragons', 'elephants', 'swans', 'eagles', 'nightingales',
//   // ...elements,
//   'ice', 'fire', 'earth', 'water',
//   // ...times of day
//   'morning', 'evening', 'dusk', 'noon', 'afternoon', 'midnight',

//   'horns', 'fangs', 'claws',
//   // 'needle',
//   'music', 'silence',
// ]
class Language extends Model {
  constructor(private dictionary: Dictionary) {
    super(`${dictionary.languageName} (Language)`)
  } // = new Dictionary()


  t = (...concepts: Concept[]) => this.dictionary.translate(...concepts)
  // couples = []
  notes = {
    // translation examples / guide
    'Hills of Evendim': () => this.t('hill', 'evening'), //vocabulary.light,
    'Mere of Shadows': () => this.t('sea', 'shadow'),
    'Vale of Nightingales': () => this.t('nightingales', 'valley'),
    'Star Hill': () => this.t('hill', 'stars'),
    'Golden Hill': () => this.t('hill', 'gold'),
    'Pathless Sea': () => this.t('path', '-less', 'sea'),
    'Silver River': () => this.t('silver', 'river'),
    'Iron Prison': () => this.t('iron', 'prison'),
    'Swan Haven': () => this.t('swans', 'haven'),
    'Elephant Hill': () => this.t('hill', 'elephants'),
    'Silent Land': () => this.t('land', 'silence'),
    'White-horn Mountains': () => this.t('mountain', 'white', 'horns'),
    'Icy Fangs': () => this.t('ice', 'fangs'),
    'Star-Eagle': () => this.t('eagles', 'stars'),
    'Mist-Peaks': () => this.t('mist', 'peak'),
    'Starsong': () => this.t('stars', 'music'),
    'Land of Pines': () => this.t('land', 'pine'),
    // 'Cloud Citadel (Sky-Fortress)': () => this.t('sky', 'fortress'),
    
    // ...Object.fromEntries(descriptiveIdeas.map(idea => {
    //   let [name, significance] = this.dictionary.nameMountain(idea);
    //   return [name, () => significance] // `Mount ${capitalize(idea)}`, () => this.dictionary.nameMountain(idea)[1]])
    // }))
  }


}

const Aelvic = (new Dictionary("Aelvic (Neo-Sindarin)", {
  // see: https://eldamo.org/content/vocabulary-indexes/vocabulary-words-ns.html
  light: 'ea',
  shadow: 'gwath', //dûl',
  mountain: 'ered',
  hill: '-amon', // tun
  valley: '-im',
  isle: 'tol',
  lake: 'ael',
  sea: '-geaer', //'mer',
  mist: 'hith-',
  // misty: 'hithlum',

  // twilight: 'minuial',
  iron: 'ang-',
  silver: 'celeb-',
  gold: 'malt-',
  river: '-rant',
  great: 'beleg-',
  small: 'cidinn',
  path: 'lant',
  haven: '-ondë',
  prison: '-band',
  dusk: 'moth-',
  morning: '-aur',
  evening: 'aduial',

  birds: 'aewen',
  eagles: 'thoron',
  dragons: 'amlug',
  elephants: 'annabon',
  swans: 'aqual',
  nightingales: 'dúlin',
  bears: 'graw',

  sun: 'anor',
  // sunny: 'anoren',
  moon: 'ithil',

  land: 'dor-',
  silence: 'dhín-',
  white: 'nim-',
  black: 'morn',

  horns: 'rais',
  fangs: 'caraxë',

  ice: 'hel-',

  '-less': 'uv-',

  earth: 'amar',
  sky: 'ell',
  stars: '-ngil',
  place: 'sa-',
  peoples: 'li-',
  fortress: 'ost',
  noon: 'nedhor',
  afternoon: 'avnedhor',
  claws: 'gamp-',
  fire: 'naur-',
  water: 'nin',
  music: '-linnas',

  midnight: 'fuin',
  // friend: '-dil',
  // needle: 'aeglin',
  peak: 'aeglin', // point

  realm: 'arthor',
  kingdom: 'arnad',

  willow: 'tathar*',
  pine: 'thon*',
  cherry: 'aebin*',
  oak: 'doron*',
  spruce: 'ecthelorn*',
  birch: 'hwinn*',

  forest: 'taur',
}))


const theConcepts: Concept[] = concepts as unknown as Concept[]
export { Aelvic, theConcepts }

export default new Language(Aelvic);

