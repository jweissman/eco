import { Animal, Quality, Individual, ManageStocks, Item, Species, createAnimal, pick, PhysicalQuality } from "."
import { Sequence } from "../../collections"
import { Concept } from "../Dictionary"
import { Stocks } from "../Stocks"
import { sample } from "../utils/sample"
import { BasicEntity } from "./BasicEntity"

type Wealth = 'impoverished' | 'well-off' | 'luxuriant' | 'decadent'
type Sophistication = 'unpretentious' | 'savvy' | 'urbane' | 'sleek'
type Power = 'inconsequential' | 'marginal' | 'influential' | 'sovereign'
type Knowledge = 'clueless' | 'well-informed' | 'wise' | 'prescient'

type SocialQuality = Wealth | Sophistication | Power | Knowledge

export type Moiety = BasicEntity & {
  wealth: Wealth
  sophistication: Sophistication
  power: Power
  knowledge: Knowledge
}

const moietyIds = new Sequence()
export const createMoiety = (name: string): Moiety => {
  const wealth: Wealth = pick([ 'impoverished', 'well-off', 'luxuriant', 'decadent' ])
  const sophistication: Sophistication = pick([ 'unpretentious', 'savvy', 'urbane', 'sleek' ])
  const power: Power = pick([ 'inconsequential', 'marginal', 'influential', 'sovereign' ])
  const knowledge: Knowledge = pick([ 'clueless', 'well-informed', 'wise', 'prescient' ])
  // const tech: Technology = pick([ 'lost', 'primitive', 'archaic', 'advanced' ])
  return { id: moietyIds.next, name, wealth, sophistication, power, knowledge } //, tech }
}

type Body = Animal

type Insight = 'dense' | 'intuitive' | 'incisive' | 'brilliant'
type Depth = 'superficial' | 'substantial' | 'profound' | 'inscrutable'
type Education = 'unlettered' | 'literate' | 'tutored' | 'well-read'
type Disposition = 'dismal' | 'hopeful' | 'propitious' | 'roseate'
type Valor = 'timid' | 'bold' | 'courageous' | 'fearless'
type Presence = 'bland' | 'charismatic' | 'captivating' | 'magnetic' 

type MentalQuality = Insight | Depth | Education | Disposition | Valor | Presence
export type MentalAttribute = 'insight' | 'depth' | 'education' | 'disposition' | 'valor' | 'presence'

type Mind = {
  insight: Insight
  depth: Depth
  education: Education
  disposition: Disposition
  valor: Valor
  presence: Presence
}

export const createMind = (): Mind => {
  const insight: Insight = pick([ 'dense', 'intuitive', 'incisive', 'brilliant' ])
  const depth: Depth = pick([ 'superficial', 'substantial', 'profound', 'inscrutable' ])
  const education: Education = pick([ 'unlettered', 'literate', 'tutored', 'well-read' ])
  const disposition: Disposition = pick([ 'dismal', 'hopeful', 'propitious', 'roseate' ])
  const valor: Valor = pick([ 'timid', 'bold', 'courageous', 'fearless' ])
  const presence: Presence = pick([ 'bland', 'magnetic', 'charismatic', 'captivating' ])
  return { insight, depth, education, disposition, valor, presence }
}

export type Gender = 'neuter' | 'feminine' | 'masculine' | 'androgynous'
type Justice = 'arbitrary' | 'severe' | 'harsh' | 'firm' 
type Wit = 'grim' | 'droll' | 'sardonic' | 'acerbic'
// piquant
// 'acerbic'
// | 'riotous'
// type Humor = 'cruel' | 

type Empathy = 'sadistic' | 'generous' | 'benevolent' | 'selfless'
type Integrity = 'uncertain' | 'sound' | 'solid' | 'incorruptible'
type Beauty = 'ugly' | 'fair' | 'radiant' | 'resplendent'
type Charm  = 'repulsive' | 'inoffensive' | 'affable' | 'likeable'
type Resolve = 'vacillating' | 'steadfast' | 'intrepid' | 'relentless'

type Temperament = 'guardian' | 'artisan' | 'rational' | 'idealist'

type Philosophy = 'naive' | 'narrow' | 'contemplative' | 'enlightened'
type Faith = 'materialistic' | 'spiritual' | 'devout' | 'militant'
type Demeanor = 'arrogant' | 'proud' | 'humble' | 'serene'
// type Philosophy = 'pessimist' | 'realist' | 'optimist' | 'utopian'

type SpiritualQuality = Wit
                      | Empathy
                      | Integrity
                      | Beauty
                      | Charm
                      | Resolve
                      | Temperament
                      | Gender
                      | Philosophy
                      | Faith
                      | Demeanor
                      | Justice

type Soul = {
  wit: Wit
  empathy: Empathy
  integrity: Integrity
  beauty: Beauty
  charm: Charm
  resolve: Resolve
  temperament: Temperament
  gender: Gender
  philosophy: Philosophy
  faith: Faith
  demeanor: Demeanor
  justice: Justice
}


export const createSoul = (gender?: Gender): Soul => {
  const wit: Wit = pick([ 'grim', 'droll', 'sardonic', 'acerbic' ]) // 'slow', 'clever', 'biting', 'savage' ])
  const empathy: Empathy = pick([ 'sadistic', 'generous', 'benevolent', 'selfless' ])
  const integrity: Integrity = pick([ 'uncertain', 'sound', 'solid', 'incorruptible' ])
  const beauty: Beauty = pick([ 'ugly', 'fair', 'radiant', 'resplendent' ])
  const charm: Charm = pick([ 'repulsive', 'inoffensive', 'affable', 'likeable' ])
  const resolve: Resolve = pick([ 'vacillating', 'steadfast', 'intrepid', 'relentless' ])
  const temperament: Temperament = pick([ 'guardian', 'artisan', 'rational', 'idealist'])
  // const gender: Gender =
  gender = gender || pick([ 'neuter', 'feminine', 'masculine', 'androgynous' ])
  const philosophy: Philosophy = pick([ 'naive', 'narrow', 'contemplative', 'enlightened'])
  const faith: Faith = pick(['materialistic', 'spiritual', 'devout', 'militant'])
  const demeanor: Demeanor = pick(['arrogant', 'proud', 'humble', 'serene'])
  const justice: Justice = pick( [ 'arbitrary', 'severe', 'harsh', 'firm' ]) //[ 'arbitrary', 'harsh', 'fair', 'firm' ])
  
  return {
    wit, empathy, integrity, beauty, charm, resolve, temperament,
    gender, faith, philosophy, demeanor, justice,
  }
}

// export type Memory = { id: number, name: string, description: string }

type IndividualQuality = PhysicalQuality | SocialQuality | MentalQuality | SpiritualQuality
export type PhysicalAttribute = 'spirit' | 'strength' | 'cunning' | 'agility' | 'guile'
export type SocialAttribute =  'wealth' | 'sophistication' | 'power' | 'knowledge'
export type SpiritualAttribute = 'wit' | 'empathy' | 'integrity' | 'beauty'
                               | 'charm' | 'resolve' | 'temperament' | 'justice'
                               | 'gender' | 'philosophy' | 'faith' | 'demeanor'
type AttributeMatrix = {
  physical: { [key in PhysicalAttribute]: PhysicalQuality[] },
  social: { [key in SocialAttribute]: SocialQuality[] },
  mental: { [key in MentalAttribute]: MentalQuality[] },
  spiritual: { [key in SpiritualAttribute]: SpiritualQuality[] },
}

export const attributes: AttributeMatrix = {
  physical: {
    spirit: [ 'languorous', 'vigorous', 'impetuous', 'ferocious' ],
    strength: [ 'weak', 'robust', 'mighty', 'indomitable' ],
    cunning: [ 'foolish', 'sly', 'crafty', 'manipulative' ],
    agility: [ 'clumsy', 'nimble', 'spry', 'balletic' ],
    guile: [ 'transparent', 'convincing', 'beguiling', 'insidious' ],
  },

  social: {
    wealth: [ 'impoverished', 'well-off', 'luxuriant', 'decadent' ],
    sophistication: [ 'unpretentious', 'savvy', 'urbane', 'sleek' ],
    power: [ 'inconsequential', 'marginal', 'influential', 'sovereign' ],
    knowledge: [ 'clueless', 'well-informed', 'wise', 'prescient' ]

  },
  mental: {
    insight: ['dense' , 'intuitive' , 'incisive' , 'brilliant' ],
    depth:[ 'superficial' , 'substantial' , 'profound' , 'inscrutable' ],
    education:[ 'unlettered' , 'literate' , 'tutored' , 'well-read'],
    disposition:[ 'dismal' , 'hopeful' , 'propitious' , 'roseate'],
    valor: [ 'timid' , 'bold' , 'courageous' , 'fearless'],
    presence: [ 'bland' , 'charismatic' , 'captivating' , 'magnetic' ]
    
  },
  spiritual: {
    wit: [ 'grim', 'droll', 'sardonic', 'acerbic' ],
    empathy: [ 'sadistic', 'generous', 'benevolent', 'selfless' ],
    integrity: [ 'uncertain', 'sound', 'solid', 'incorruptible' ],
    beauty: [ 'ugly', 'fair', 'radiant', 'resplendent' ],
    charm: [ 'repulsive', 'inoffensive', 'affable', 'likeable' ],
    resolve: [ 'vacillating', 'steadfast', 'intrepid', 'relentless' ],
    temperament: [ 'guardian', 'artisan', 'rational', 'idealist' ],
    gender: [ 'neuter', 'feminine', 'masculine', 'androgynous' ],
    philosophy: [ 'naive', 'narrow', 'contemplative', 'enlightened'],
    faith: ['materialistic', 'spiritual', 'devout', 'militant'],
    demeanor: ['arrogant', 'proud', 'humble', 'serene'],
    justice: [ 'arbitrary', 'severe', 'harsh', 'firm' ],
  },
}
export const judge = (quality: IndividualQuality): Quality => {
  const qualityValues: Quality[] = ['terrible', 'adequate', 'good', 'excellent']
  const matrix = attributes;
  let result = null
  Object.entries(matrix).forEach(([attributeGroupName, attributeGroup]) => {
    Object.entries(attributeGroup).forEach(([attributeName, qualities]) => {
      qualities.forEach((q: IndividualQuality) => {
        // console.log("compare", { q, quality })
         if (q===quality) {
           result = qualityValues[qualities.indexOf(q)]
         }
      })
    })
  })
  if (result === null) {
  throw new Error("Cannot judge unknown quality " + quality)
  } else {
    return result
  }
}

type Rational = 'inventor' | 'architect' | 'fieldmarshal' | 'mastermind'
type Idealist = 'champion' | 'healer' | 'teacher' | 'counselor'
type Artisan = 'performer' | 'composer' | 'persuader' | 'crafter'
type Guardian = 'provider' | 'protector' | 'supervisor' | 'inspector'

type SocialRole = Idealist
                | Rational
                | Artisan
                | Guardian

const roles: { [key in Temperament]: SocialRole[] } = {
  idealist: [ 'champion', 'healer',    'teacher',      'counselor' ],
  rational: [ 'inventor', 'architect', 'fieldmarshal', 'mastermind' ],
  artisan: [ 'performer', 'composer',  'persuader',    'crafter' ],
  guardian: [ 'provider', 'protector', 'supervisor',   'inspector' ],
}

export type Person = Individual<Moiety> & {
  nameConcepts: Concept[]
  body: Body
  mind: Mind
  soul: Soul
  role: SocialRole
  things: ManageStocks
  items: Stocks<Item>
  pets: Stocks<Animal>
  currency: number
  traits: ManageStocks
  meters: () => { [meterName: string]: Function }
  // memory: Collection<Memory>
}

const personId = new Sequence()
const human: Species = { id: -1, name: 'Human Being', size: 'medium' }
export const createPerson = (name: string, moiety: Moiety, attrs: Partial<Person> = {}): Person => {

  const inventory = new Stocks<any>(`${name}'s Things`)
  const traits = new Stocks<any>(`${name}'s Traits`)
  const items = new Stocks<Item>(`${name}'s Items`)
    const pets = new Stocks<Animal>(`${name}'s Pets`);
  // const state = new Stocks<any>(`${name}'s State`)
    // personAttrs.things = inventory.manageAll()
    const soul: Soul = createSoul()
    let roleOptions = roles[soul.temperament]
    // if (soul.temperament === 'rational') {

    // }



  return {
    id: personId.next,
    kind: moiety,
    role: sample(roleOptions),
    nameConcepts: [],
    // kind: createMoiety()
    name,
    age: 0,
    body: createAnimal(name, human),
    mind: createMind(),
    soul,
    // rank: 'commoner',
    // reputation: 'unknown',
    currency: 0,
    items, //.manageAll(),
    things: inventory.manageAll(),
    traits: traits.manageAll(),
    pets,

    // stats: state.manageAll()
    // things: new M
    meters: () => { return {}},
    // memory: new Collection<Memory>(),
    ...attrs,
  }

}
