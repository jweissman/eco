import { StringGeneratorSequence } from "../collections/Sequence";
import { ISequence } from "../collections/types";
import { titleize, capitalize } from "./utils/capitalize";
import { sample } from "./utils/sample";

const concepts = [
  'earth', 'sky',
  'mountain', 'hill', 'valley', 'peak', 'mound', 'point',
  'sea', 'river', 'isle', 'lake', 'bay',
  'forest',
  'land', 'place', 'realm', 'region',
  'peoples', 'kingdom',
  'path', 'haven', 'fortress', 'prison',
  // modifiers..
  'ever-', '-less',
  // masculine/feminine suffices
  '-man', '-woman',

  // ...aspects...
  'light', 'shadow', 'sun', 'moon', 'stars',
  // weather
  'mist', 'snow', 'rain', 'rainbow',
  // metals...
  'iron', 'silver','gold', 
  // shades, hues...
  'white', 'black', 'gray', 'red', 'blue', 'green', 'orange',
  // ...animals,
  'birds', 'dragons', 'elephants', 'swans', 'eagles', 'nightingales', 'bears',
  // ...elements,
  'ice', 'fire', 'earth', 'water',
  // ...times of day
  'morning', 'evening', 'dusk', 'noon', 'afternoon', 'midnight',
  // trees
  'willow', 'pine', 'cherry', 'oak', 'spruce', 'birch', 'elm',
  // flowers
  'rose', 'daisy', 'poppy', 'dandelion',
  // seasons
  'autumn', 'winter', 'spring', 'summer',
  // moods
  'dread', 'horror', 'awe', 'joy',


  // adjectives...
  'tall', 'deep', 'lofty', 'lonely', 'great', 'small',
  'golden', 'holy', 'fortunate', 'dusty', 'beautiful',
  'fell', 'cloudy', 'secret', 'sweet',

  'horns', 'fangs', 'claws',
  // 'needle',
  'music', 'silence',

  'thought', 'speech', 'skill',
  'night', 'spark', 'starlight', 'firmament',

  'mantle',

  'needle',
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
        if (word.endsWith('-')) {
          word = word.replaceAll('-', '')
          elements = [word, acc]
        }
      }
      return elements.join(space ? ' ' : '')
    }, '')

    if (translation.endsWith('-')) {
      translation = translation.substring(0, translation.length - 1);
      // if (translation.endsWith('ith')) { translation += 'ë' }
      if (translation.endsWith('ss')) { translation += 'ë' }
      else if (translation.endsWith('r')) { translation += 'gren' }
      else { translation += 'ren' }
                  // + 'en';
    }

    if (translation.endsWith('*')) {
      translation = translation.substring(0, translation.length - 1);
      if (translation.endsWith('ir')) { translation += 'essëa' } //essea' }
      else if (translation.endsWith('r')) { translation += 'iand' }
      else if (translation.endsWith('n')) { translation += 'ion' }
      else { translation += 'iath' }
    }
    translation = translation.replaceAll('*', '')

    // irregular but try to cleanup some weird constructions...
    // translation = translation.replaceAll('dng', 'd eng')
    translation = translation.replaceAll('n uil', 'llin')
    // for 'taniquetil' ... (otherwise: raud nimtil)
    translation = translation.replaceAll('mt', 'quet')
    // translation = translation.replaceAll('ud nn', 'n')
    translation = translation.replaceAll('nd ni', 'ni')
    translation = translation.replaceAll('rgr', 'gr')
    translation = translation.replaceAll('dc', 'g')
    translation = translation.replaceAll('aire', 'ere')
    translation = translation.replaceAll('naer', 'nairë')
    translation = translation.replaceAll('fng', 'f eng')

    translation = translation.replaceAll('uie', 'uvie')
    // translation = translation.replaceAll('inin', 'ien')
    // translation = translation.replaceAll('ln', 'len')
    // translation = translation.replaceAll(ng/, 'Eng')
    if (translation.startsWith('ng')) { translation = translation.replace('ng', 'eng')}
    if (translation.startsWith('ui')) { translation = translation.replace('ui', 'oio')}
    // if (translation.startsWith('ra')) { translation = translation.replace('ra', 'ta')}
    if (translation.startsWith('ton')) { translation = translation.replace('to', 'ta')}
    if (translation.endsWith('ll')) { translation = translation.substring(0, translation.length - 1) } //replace('ll', 'l')}

    
    return titleize(translation)
  }

  name = (...ideas: Concept[]) => (...descriptors: Concept[]) => {
    let notion = capitalize(ideas.join('-'))
    let description = capitalize(descriptors.join('-'))
    let form = `${description} ${notion}`
    if (description.endsWith('s')) { form = `${description}' ${notion}`}
    let translation = `${this.translate(...ideas, ...descriptors)}`;
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
    const ideas: Concept = sample(theConcepts);
    const inventName = this.dictionary.name(sample(this.notions))
    const [significance, name] = inventName(ideas)
    return `${name} (${significance})`
  }
}
