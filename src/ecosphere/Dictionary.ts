import { StringGeneratorSequence } from "../collections/Sequence";
import { ISequence } from "../collections/types";
import { titleize, capitalize } from "./utils/capitalize";
import { choose, sample } from "./utils/sample";

const concepts = [
  'earth', 'sky',
  'mountain', 'hill', 'valley', 'peak', 'mound', 'point', 'mountain-chain',
  'island', 'isle', 
  'sea', 'lake', 'bay', 'pool', 'harbor',
  'forest',
  'river', 'glen', 'stream',
  // barrow, downs, gulch ...

  'land', 'place', 'realm', 'region',
  'peoples', 'kingdom',
  'road', 'path',
  'haven', 'fortress', 'prison', 'citadel', 'stronghold', 'tower', 'garden',
  // modifiers..
  'ever-', '-less', 'at-',
  // masculine/feminine suffices
  '-person', '-man', '-son', '-woman', '-maid', '-daughter',
  // relations
  'friend', 'foe', 'lord', 'slave', 'king', 'queen', 'prince', 'princess',

  // ...aspects...
  'light', 'dark',
  'shadow', 'shade',
  'sun', 'moon', 'stars',
  'day', 'night', 'spark', 'starlight', 'firmament',
  // weather
  'heat', 'cold',
  'mist', 'snow', 'wind', 'rain', 'cloud', //'hail',
  'rainbow', 'dew', 'frost',
  // metals...
  'tin', 'iron', 'silver', 'gold', 
  // weapons
  // 'axe', 'sword', 'bow', 'shield',

  // cut, delve, hew, till, hunt...?

  // shades, hues...
  'white', 'black', 'gray', 'red', 'blue', 'green', 'orange',
  // ...animals,
  'dragons', 'elephants',
  'bears', 'birds', 'horses', 'snakes', 'wolves',
  // mole...

  // tame animals..
  // 'boars',
  'hounds',

  // birds in particular...
  'swans', 'eagles', 'nightingales',
  // swallow

  // ...elements,
  'ice', 'fire', 'earth', 'water',

  // quasi-elements...
  'embers', 'steam', 'magma', 'radiance',
  'soot', 'ash', 'salt', 'void',

  // ...times of day
  'morning', 'evening', 'dusk', 'noon', 'afternoon', 'midnight',
  // trees
  'willow', 'pine', 'cherry', 'oak', 'spruce', 'birch', 'elm', 'holly',

  // flowers
  'rose', 'daisy', 'poppy', 'dandelion', 'lily',
  // jasmine/jessamine, violet
  // lotus

  // seasons
  'autumn', 'winter', 'spring', 'summer',
  // moods
  'dread', 'horror', 'awe', 'joy', 'sorrow', 'gloom',
  // food
  'apple', 'honey', 'bread', 'elderberry', 'wine', 'fish',
  // natural substances..
  'wax',
  // 'nut',

  // instruments..?
  // lute, harp, viol ...

  // adjectives...
  'tall', 'deep', 'lofty', 'lonely',
  'great', 'large', 'small', 'tiny',
  'narrow', 'wide', 'sharp', 'giant',
  'quick', 'pale', 'bitter',

  'golden', 'holy', 'fortunate', 'dusty', 'beautiful',
  'fell', 'cloudy', 'secret', 'sweet', 'bold',
  'splendid', 'abundant', 'sparkling',

  // animal aspects...
  'horns', 'fangs', 'claws',

  // gemstones...
  // 'emerald', 'ruby',

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

  // activities?
  'laughter',

  // created things...
  'jewel', 'ship', 'needle', 'bell', 'candle',

  // clothes
  'mantle', 'veil', // 'garment'


  // questing...
  'journey', 'treasure', 'battle', 'smith',

  // names for the languages themselves? races?
  // 'dwarves', // dwarrow, khazad,
  // 'dwarvish', // dwarvish, khuzdul...
  // 'elves', // aelves, 
  // 'elvish', // aelvish, sindarin,
  // 'men', // men
  // 'mannish', // westron, ...

  // 'peoples',
  // 'common',
  // men (ylde/glishmen/...), dwarrow (dwarven/khuzdul...), aeldar (aelves/quenya...), maiar, valar,

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

  // todo support more 'syntax'
  // (at least recognizing 'x of y', where x + y are translated 'first'...)
  // (also -less should just modify the immediately preceding word)
  translate(...concepts: Concept[]): Lexeme {
    // let lastConcept: Concept | null = null;
    let lastWord: string = ''
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
      // if (concept.startsWith('-')) {
      if (lastWord.startsWith('-')) {
        space = false;
        // if (word.endsWith('-')) {
        //   word = word.replaceAll('-', '')
        elements = [word, acc]
        // }
      }

      // lastConcept = concept;
      lastWord = word;
      return elements.join(space ? ' ' : '')
    }, '')

    translation = translation.replaceAll('-', '')
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

// move this stuff outside? 
// todo ... hard to construct full dict from scratch!
// want some kind of system for assembling the dictionary from
// (reasonably small number) roots
// eg if beauty (gezi) then => beatuiful (geziel) .. 
// but more generally reveal the 'concept algebra' of the ideas
export type Roots = {
  man: string
  woman: string
  son: string
  daughter: string
  crown: string
  place: string
  sleep: string
  great: string
  small: string
  beauty: string
  tree: string
  flower: string
  water: string
  // cove: string
  safe: string
  light: string
  shadow: string
  one: string
  many: string
  joy: string
  sorrow: string
  heart: string
  bitter: string
  sweet: string
  point: string
  heat: string
  cold: string
  tall: string
  deep: string
  bell: string
  mound: string
  run: string
  sing: string
  way: string
  no: string
  at: string
  eat: string
  drink: string
  air: string
  good: string
  bad: string
  quick: string
  // slow: string
  time: string
  cut: string
  all: string
  hard: string
  soft: string
  color: string
  ore: string
  wing: string
  snake: string
  horse: string
  bear: string
  // elephant: string
  dog: string
  // wild: string
  fear: string
  death: string
  // sound: string
  tooth: string
  // wood: string
  over: string
  high: string
  mantle: string
  // face: string
  fight: string
  mere: string
  strong: string
}

// try to support building the 150+ word dictionary from
// smaller set of root words?
// ensures some internal consistency too?
const assembleDictionary = (
  name: string,
  roots: Roots,
  vocabOverrides: Partial<Vocabulary>,
  replacements: { [key: string]: string } = {}
): Dictionary => {
  const {
    man, woman, son, daughter,
    crown, place, tree, sleep, flower,
    beauty, // valor,
    great, small,
    water, //cove,
    safe,
    // cloud,
    // star,
    light, shadow,
    one, many,
    joy, sorrow,
    sweet, bitter,
    point, 
    heat, cold,
    tall, deep,
    bell, mound,

    run, sing, way,
    // forever,
    no, at, eat, drink,
    good, bad,
    quick, //slow,
    time, air,
    cut,
    all,
    hard, soft,
    color, ore,
    wing,
    snake, horse, bear, dog,
    // wild,
    fear,
    death,
    // sound,
    tooth,
    heart,
    // wood,
    over,
    high,
    // mantle,
    fight,
    // face,
    mere,
    strong,
  } = roots

  // const kernel = {
  //   sweet: good + taste,
  //   bitter: bad + taste,
  // }

  const basics = {
    '-person': man,
    '-man': man,
    '-woman': woman,
    '-maid': small + woman,
    '-son': son,
    '-daughter': daughter,

    // mantle: over + coat,
    // veil: over + face,
    cove: cut + water,

    star: soft + light,
    daisy: bell + flower,
    poppy: sleep + flower,
    dandelion: crown + flower,
    willow: sorrow + tree,
    cherry: good + tree,
    spruce: sweet + tree,
    pine: bitter + tree,
    birch: small + tree,
    elm: tall + tree,
    oak: hard + tree,
    holly: joy + tree,
    king: crown + man,
    queen: crown + woman,
    sea: great + water,
    lake: water + place,
    pool: water + mere,
    haven: safe + place,
    // mist: water + cloud,
    forest: tree + place,
    people: man + woman,
    ice: bitter + cold,
    prison: bitter + sorrow,
    jewel: small + beauty,
    needle: bitter + point,
    candle: heat + point,
    hill: small + mound,
    mountain: mound + place,
    valley: way + place,
    peak: point + place,
    mound: mound + place,
    land: man + place,
    lofty: great + high,
    sky: high + over,
    low: small + one,
    river: water + way,
    isle: water + place,
    island: deep + water,
    wine: joy + drink,
    honey: sweet + drink,
    apple: small + eat,
    bread: good + eat,
    elderberry: safe + eat,
    fish: small + quick,
    harvest: tree + cut,
    night: shadow + time,
    garden: flower + place,
    // strong: great + hard,
    // giant: great + tall,
    vault: cut + place,

    white: light + color,
    black: shadow + color,
    green: tree + color,
    red: heat + color,
    blue: cold + color,

    morning: light + time,
    evening: shadow + time,
    noon: high + light,
    fire: heat + light,

    tin: soft + ore,
    silver: beauty + ore,
    gold: deep + ore,

    bird: quick + wing,
    birds: good + wing,
    horses: horse,
    elephants: great + horse, //elephant,
    bears: bear,
    snakes: snake,
    wolves: bad + dog,
    hounds: good + dog,
    // gray: light + shadow + color, 'red', 'blue', 'green', 'orange',
    large: tall + great,
    tiny: small + small,
    thirst: no + drink,
    wax: soft + quick,

    veil: small + soft,

    fortunate: great + good,
    beautiful: great + beauty,
    // silence: no + sound,

    music: man + sing,

    abundant: many + many,
    // sparkling: run + light,
    teeth: many + tooth,
    battle: many + man + fight,
    dark: no + light,

    wood: tree + ore,
  }

  const {
    fire, red, cove,
    vault, star, night, ice, harvest, river, mountain, // valley,
    king, land, lofty, sky, low, people, '-person': person,
    white, black, morning, evening, noon, bird,
    large, thirst, music, teeth, battle,
    wood,
  } = basics

  const intermediate = {
    bay: cove + place,
    harbor: safe + cove,
    dragons: strong + wing + snake,
    swans: beauty + bird,
    eagles: lofty + bird,
    nightingales: evening + bird,
    iron: strong + ore,
    dusk: morning + evening,
    gray: white + black,
    orange: harvest + color,
    afternoon: deep + noon,
    midnight: deep + evening,
    lily: star + flower,
    rose: red + flower,
    divine: great + king,
    princess: king + daughter,
    prince: king + son,
    kingdom: king + place,
    fortress: king + safe, 
    citadel: many + people,
    stronghold: safe + people + deep,
    tower: tall + over,
    'mountain-chain': many + mountain,
    friend: sweet + person,
    foe: bitter + person,
    lord: lofty + person,
    slave: low + person,
    rain: sky + water,
    earth: many + land,
    glen: river + land, // valley,
    stream: small + river,
    realm: one + place,
    region: many + river,
    peoples: many + people,
    road: all + person,
    path: run + way,
    shade: deep + shadow,
    sun: sky + light,
    moon: night + light,
    autumn: harvest + time,
    winter: bitter + time,
    spring: flower + time,
    summer: heat + time,
    cloud: sky + water,
    cloudy: sky + water,
    'ever-': all + time,
    '-less': no,
    'at-': at,
    stars: many + star,
    day: light + time,
    starlight: star + light,
    spark: strong + fire,
    snow: sky + cold,
    mist: soft + sky,
    firmament: strong + vault,
    wind: strong + air,
    rainbow: color + sky,
    frost: hard + ice,
    dew: morning + water,
    dread: fear + king,
    lonely: one + at + mere,
    giant: large + man,
    awe: great + fear,
    ash: fire + death,
    steam: fire + water,
    magma: fire + river,

    dry: heat + thirst,
    food: eat + harvest,
    space: great + lofty,
    dark: deep + shadow,
    broad: deep,
    voice: person + music,
    war: great + battle,
    laughter: joy + music,
    // was also thinking
    // orange: fire + color,
    // purple: red + blue, ....
    silence: soft + music,
  } //= intermediate

  const {
    dread, ash, rainbow, dry, food, space, dark, broad, orange,
    divine, voice, iron, spark, silence, //music,
    // frost, rainbow
  } = intermediate

  // console.log('assemble!', { roots, basics, intermediate })

  const vocab: Vocabulary = {
    ...roots,
    ...basics,
    ...intermediate,
    sparkling: many + spark,
    horror: black + dread,
    embers: ash,
    soot: black + ash,
    radiance: rainbow + color,
    salt: dry + food,
    void: no + space,
    gloom: dark + black,
    narrow: no + broad, // river + valley + place,
    wide: broad,
    sharp: dread + point,
    pale: soft + white,
    golden: white + orange + beauty,
    holy: divine + joy,
    dusty: dry + soft,
    fell: cold + fear,
    secret: dark + silence,
    bold: strong + voice,
    splendid: rainbow + light,
    horns: many + dread + point,
    claws: bad + point,
    fangs: dread + teeth,
    love: heart + person,
    dream: sleep + music,
    fate: divine + fire,
    speech: many + voice,
    tomorrow: time + time,
    spirit: light + divine,
    tyranny: bad + king,
    magic: divine + spark,
    thought: light + time,
    skill: good + person,
    freedom: strong + people,
    blood: red + water,
    tears: sorrow + water,
    ship: water + wood,
    journey: place + time,
    treasure: good + joy,
    smith: iron + person,

    ...vocabOverrides,

    /**
     *
     avalon: magic + island / green + island
     child: small + person
     dungeon: dark + stone
     citadel: castle + high / castle + city
     fortress: castle + strong
     throne: high + seat

     aelves: light + people
     orkh: dark + people

     dwarrow: stone + people
     men: lake + people
     heflen: under + hill + people
     fae: beautiful + people

     gnomes: deep + people
     colossi: giant + people

     */
    
    
    // grievous: heavy + sorrow
    // joy: holy + happiness
    // harsh: bitter + sharp
    // hollow: soft + place [ i prefer low + place ? ]

  }
  // console.log("FULL VOCAB", { vocab })
  return new Dictionary(name, vocab, (input: string) => {
    Object.keys(replacements).forEach(key => {
      if (input.includes(key)) {
        input = input.replaceAll(key, replacements[key])
      }
    })
    return input
  })
}

// todo grammatical pipeline
// radicals -> conjugations -> vocab kernel -> extensions, intermediate aggluts -> final vocab

export { assembleDictionary }
