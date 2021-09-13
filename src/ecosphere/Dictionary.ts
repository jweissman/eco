import { StringGeneratorSequence } from "../collections/Sequence";
import { ISequence } from "../collections/types";
import { titleize, capitalize } from "./utils/capitalize";
import { choose, sample } from "./utils/sample";

const concepts = [
  'earth', 'sky',
  'mountain', 'hill', 'valley', 'peak', 'mound', 'point', 'mountain-chain',
  'isle', 
  'sea', 'lake', 'bay', 'pool', 'harbor',
  'forest',
  'river', 'glen', 'stream',
  'land', 'place', 'realm', 'region',
  'peoples', 'kingdom',
  'road', 'path',
  'haven', 'fortress', 'prison', 'citadel', 'stronghold', 'tower',
  // modifiers..
  'ever-', '-less', 'at-',
  // masculine/feminine suffices
  '-person', '-man', '-son', '-woman', '-maid', '-daughter',
  // relations
  'friend', 'foe', 'lord', 'slave', 'king',

  // ...aspects...
  'light', 'shadow', 'shade',
  'sun', 'moon', 'stars',
  'day', 'night', 'spark', 'starlight', 'firmament',
  // weather
  'mist', 'snow', 'wind', 'rain',
  'rainbow', 'dew', 'frost',
  // metals...
  'tin', 'iron', 'silver', 'gold', 

  // shades, hues...
  'white', 'black', 'gray', 'red', 'blue', 'green', 'orange',
  // ...animals,
  'birds', 'dragons', 'elephants', 'swans', 'eagles',
  'nightingales', 'bears', 'horses', 'snakes',

  // ...elements,
  'ice', 'fire', 'earth', 'water',
  // ...times of day
  'morning', 'evening', 'dusk', 'noon', 'afternoon', 'midnight',
  // trees
  'willow', 'pine', 'cherry', 'oak', 'spruce', 'birch', 'elm',
  // flowers
  'rose', 'daisy', 'poppy', 'dandelion', 'lily',
  // seasons
  'autumn', 'winter', 'spring', 'summer',
  // moods
  'dread', 'horror', 'awe', 'joy', 'sorrow', 'gloom',
  // food
  'apple', 'honey', 'bread', 'elderberry', 'wine', 'fish',
  // natural substances..
  'wax',
  // 'nut',


  // adjectives...
  'tall', 'deep', 'lofty', 'lonely',
  'great', 'large', 'small', 'tiny',
  'narrow', 'wide', 'sharp', 'giant',
  'quick', 'pale',

  'golden', 'holy', 'fortunate', 'dusty', 'beautiful',
  'fell', 'cloudy', 'secret', 'sweet', 'bold',
  'splendid', 'abundant', 'sparkling',

  // animal aspects...
  'horns', 'fangs', 'claws',

  // more abstract things...
  'love', 'dream',
  'music', 'silence', 'divine',

  'fate', 'thought', 'speech', 'skill',
  'tomorrow',

  'spirit',
  'tyranny', 'freedom',

  'magic',

  // bodily substances
  'blood', 'tears', 

  // created things...
  'jewel', 'ship', 'needle', 'bell', 'candle',

  // clothes
  'mantle', 'veil', // 'garment'

  // questing...
  'journey', 'treasure', 'battle', 'smith',
] as const;

export type Concept = typeof concepts[number];
export const theConcepts: Concept[] = concepts as unknown as Concept[]
type Lexeme = string
export type Vocabulary = {[key in Concept]: Lexeme}

export class Dictionary {
  constructor(
    public languageName: string,
    protected vocabulary: Vocabulary,
    protected enhanceTranslation?: (input: string) => string
  ) {}

  translate(...concepts: Concept[]): Lexeme {
    let translation = concepts.reduce((acc, concept, index) => {
      let word = this.vocabulary[concept]
      acc = acc.trim()
      let space = true
      if (acc.endsWith('-') || acc.endsWith('*')) {
        space = false; acc = acc.substring(0, acc.length-1)
      }
      if (index > 0 && (word.startsWith('-') || word.startsWith('*'))) {
        space = false; word = word.substring(1, word.length) //replaceAll('-', '')
      }
      // if (word.startsWith(acc[acc.length-1])) { space = false; acc = acc.substring(0, acc.length - 1) }

      let elements = [acc, word]
      if (concept.startsWith('-')) {
        space = false;
        // if (word.endsWith('-')) {
        //   word = word.replaceAll('-', '')
        //   // elements = [word, acc]
        // }
      }
      return elements.join(space ? ' ' : '')
    }, '')

    // translation = translation.replaceAll
    // okay, need to map these irregulars to a process...
    
    let result = this.enhanceTranslation
      ? this.enhanceTranslation(translation)
      : translation
    return titleize(result) //titleize(translation)
  }

  name = (...ideas: Concept[]) => (...descriptors: Concept[]) => {
    let notion = capitalize(ideas.join('-'))
    let description = capitalize(descriptors.join('-'))
    let form = `${description} ${notion}`
    if (description.endsWith('s')) { form = `${description}' ${notion}`}
    let translation = `${this.translate(
      ...ideas,
      ...descriptors,
      )}`;
    return [ 
      form,
      translation
    ]
  }

  nameInverse = (...ideas: Concept[]) => (...descriptors: Concept[]) => {
    let notion = capitalize(ideas.join('-'))
    let description = capitalize(descriptors.join('-'))
    let form = `${description} ${notion}`
    if (description.endsWith('s')) { form = `${description}' ${notion}`}
    let translation = `${this.translate(
      ...descriptors,
      ...ideas,
      )}`;
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
  constructor(
    private dictionary: Dictionary,
    private invertOrder: boolean = false,
    ...notions: Concept[]
  ) {
    super()
    this.notions = notions
  }

  generate(): string {
    console.log(`Generate ${this.notions.join('/')} using ${this.dictionary.languageName} dictionary...`)
    const ideas: Concept[] = choose(1, theConcepts);
    const inventName = this.invertOrder
      ? this.dictionary.nameInverse(sample(this.notions))
      : this.dictionary.name(sample(this.notions))
    const [significance, name] = inventName(...ideas)
    return `${name} (${significance})`
  }
}
