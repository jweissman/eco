import { StringGeneratorSequence } from "../collections/Sequence";
import { ISequence } from "../collections/types";
import { sample } from "./utils/sample";

const capitalize = (word: string) => word.replace(/^\w/, c => c.toUpperCase()) 
const titleize = (str: string) => str.split(' ').map(word => capitalize(word)).join(' ');

const concepts = [
  'earth', 'sky',
  'mountain', 'hill', 'valley', 'peak',
  'sea', 'river', 'isle', 'lake', 'bay',
  'forest',
  'land', 'place', 'realm', 'region',
  'peoples', 'kingdom',
  'path', 'haven', 'fortress', 'prison',
  // modifiers..
  '-less',

  // ...aspects,
  'light', 'shadow', 'sun', 'moon', 'stars', 'mist', 'iron', 'silver', 'gold', 'great', 'small',
  // shades, hues...
  'white', 'black', 'gray', 'red', 'blue', 'green',
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

  'thought', 'speech', 'skill',
  'night', 'spark', 'starlight', 'firmament',

  'mantle',
] as const;

export type Concept = typeof concepts[number];
export const theConcepts: Concept[] = concepts as unknown as Concept[]
type Lexeme = string
export type Vocabulary = {[key in Concept]: Lexeme}

export class Dictionary {
  constructor(public languageName: string, protected vocabulary: Vocabulary) {}

  translate(...concepts: Concept[]): Lexeme {
    let translation = concepts.reduce((acc, concept) => {
      let word = this.vocabulary[concept]
      acc = acc.trim()
      let space = true
      if (acc.endsWith('-')) { space = false; acc = acc.replaceAll('-', '') }
      if (word.startsWith('-')) { space = false; word = word.replaceAll('-', '') }
      if (word.startsWith(acc[acc.length-1])) { space = false; acc = acc.substring(0, acc.length - 1) }
      let elements = [acc, word]
      if (concept.startsWith('-')) {
        space = false;
        if (word.endsWith('-')) { word = word.replaceAll('-', '') }
        elements = [word, acc]
      }
      return elements.join(space ? ' ' : '')
    }, '')

    if (translation.endsWith('-')) {
      translation = translation.substring(0, translation.length - 1);
      if (translation.endsWith('ith')) { translation += 'lum' }
      else if (translation.endsWith('r')) { translation += 'gren' }
      else { translation += 'ren' }
                  // + 'en';
    }

    if (translation.endsWith('*')) {
      translation = translation.substring(0, translation.length - 1);
      if (translation.endsWith('r')) { translation += 'iand' }
      else { translation += 'ion' }
    }
    translation = translation.replaceAll('*', '')

    // irregular but try to cleanup some weird constructions...
    // translation = translation.replaceAll('dng', 'd eng')
    // translation = translation.replaceAll('nn', 'en')
    translation = translation.replaceAll('rgr', 'gr')
    translation = translation.replaceAll('dc', 'g')
    // translation = translation.replaceAll('inin', 'ien')
    // translation = translation.replaceAll('ln', 'len')
    // translation = translation.replaceAll(ng/, 'Eng')
    if (translation.startsWith('ng')) { translation = translation.replace('ng', 'eng')}

    
    return titleize(translation)
  }

  name = (idea: Concept) => (descriptor: Concept) => {
    let notion = capitalize(idea)
    let description = capitalize(descriptor)
    let form = `${description} ${notion}`
    if (description.endsWith('s')) { form = `${description}' ${notion}`}
    let translation = `${this.translate(idea, descriptor)}`;
    return [ 
      form,
      translation
    ]
  }
}


export class DictionarySequence
     extends StringGeneratorSequence
  implements ISequence<string> {
    private notions: Concept[]
  constructor(private dictionary: Dictionary, ...notions: Concept[]) {
    super()
    this.notions = notions
  }

  generate(): string {
    console.log(`Generate ${this.notions.join('/')} using ${this.dictionary.languageName} dictionary...`)
    const idea: Concept = sample(theConcepts);
    const namer = this.dictionary.name(sample(this.notions))
    const [significance, name] = namer(idea)
    return `${name} (${significance})`
  }
}
