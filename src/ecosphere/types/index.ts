import { Sequence } from "../../collections"
import { Collection } from "../Collection"
import { Stocks } from "../Stocks"
import { randomInteger } from "../utils/randomInteger"
import { sample } from "../utils/sample"
import { BasicEntity } from "./BasicEntity"

export type Substance = BasicEntity
export type Entity<T> = BasicEntity & { kind: T }

export type Quality = 'terrible' | 'poor' | 'adequate' | 'good' | 'excellent'
type Size = 'fine' | 'small' | 'medium' | 'large' | 'huge'
export type Species = BasicEntity & {
  name: string
  size?: Size
  fitness?: Quality
}

export type Individual<T> = Entity<T> & {
  age: number // maybe simpler to do bornAt?
}

export type Creature<T> = Individual<T> & {
  health: 'dying' | 'unwell' | 'flourishing' | 'triumphant'
}

function pick<T>(elements: T[]): T {
  const d100 = randomInteger(0,100)
  if (d100 > 92) {
    return elements[3]
  } else if (d100 < 10) {
    return elements[0]
  }

  return sample([elements[1], elements[2]])
}

type Spirit = 'languorous' | 'vigorous' | 'impetuous' | 'ferocious'
type Strength = 'weak' | 'robust' | 'mighty' | 'indomitable'
type Cunning = 'foolish' | 'sly' | 'crafty' | 'manipulative'
//'dim' | 'attentive' | 'creative' | 'ingenious'
type Agility = 'clumsy' | 'nimble' | 'spry' | 'balletic'
type Guile = 'transparent' | 'convincing' | 'beguiling' | 'insidious'

export type Animal = Creature<Species> & {
  spirit: Spirit
  strength: Strength
  cunning: Cunning
  guile: Guile
  agility: Agility
}


const animalIds = new Sequence()
export const createAnimal = (name: string, species: Species): Animal => {
  return {
    id: animalIds.next,
    name,
    kind: species,
    age: 0,
    guile: pick([ 'transparent', 'convincing', 'beguiling', 'insidious' ]),
    health: pick(['dying', 'unwell', 'flourishing', 'triumphant']),
    spirit: pick(['languorous', 'vigorous', 'impetuous', 'ferocious']),
    cunning: pick(['foolish', 'sly', 'crafty', 'manipulative']),
    agility: pick(['clumsy', 'nimble', 'spry', 'balletic']),
    strength: pick(['weak', 'robust', 'mighty', 'indomitable']),
  }
}

// major demographic groupings -- moieties (maybe *this* should be called a Community??)
type Wealth = 'impoverished' | 'well-off' | 'luxuriant' | 'decadent'
type Sophistication = 'unpretentious' | 'savvy' | 'urbane' | 'sleek'
type Power = 'inconsequential' | 'marginal' | 'influential' | 'sovereign'
type Knowledge = 'clueless' | 'well-informed' | 'wise' | 'prescient'
type Technology = 'lost' | 'primitive' | 'archaic' | 'advanced'


export type Moiety = BasicEntity & {
  wealth: Wealth
  sophistication: Sophistication
  power: Power
  knowledge: Knowledge
  tech: Technology
}

const moietyIds = new Sequence()
export const createMoiety = (name: string): Moiety => {
  const wealth: Wealth = pick([ 'impoverished', 'well-off', 'luxuriant', 'decadent' ])
  const sophistication: Sophistication = pick([ 'unpretentious', 'savvy', 'urbane', 'sleek' ])
  const power: Power = pick([ 'inconsequential', 'marginal', 'influential', 'sovereign' ])
  const knowledge: Knowledge = pick([ 'clueless', 'well-informed', 'wise', 'prescient' ])
  const tech: Technology = pick([ 'lost', 'primitive', 'archaic', 'advanced' ])
  return { id: moietyIds.next, name, wealth, sophistication, power, knowledge, tech }
}

type Body = Animal

type Insight = 'dense' | 'intuitive' | 'incisive' | 'brilliant'
type Depth = 'superficial' | 'substantial' | 'profound' | 'inscrutable'
type Education = 'unlettered' | 'literate' | 'tutored' | 'well-read'
type Disposition = 'dismal' | 'hopeful' | 'propitious' | 'roseate'
type Valor = 'timid' | 'bold' | 'courageous' | 'fearless'

type Mind = {
  insight: Insight
  depth: Depth
  education: Education
  disposition: Disposition
  valor: Valor
}

export const createMind = (): Mind => {
  const insight: Insight = pick([ 'dense', 'intuitive', 'incisive', 'brilliant' ])
  const depth: Depth = pick([ 'superficial', 'substantial', 'profound', 'inscrutable' ])
  const education: Education = pick([ 'unlettered', 'literate', 'tutored', 'well-read' ])
  const disposition: Disposition = pick([ 'dismal', 'hopeful', 'propitious', 'roseate' ])
  const valor: Valor = pick([ 'timid', 'bold', 'courageous', 'fearless' ])
  return { insight, depth, education, disposition, valor }
}

type Wit = 'slow' | 'clever' | 'biting' | 'savage'
type Empathy = 'sadistic' | 'generous' | 'benevolent' | 'selfless'
type Integrity = 'uncertain' | 'sound' | 'solid' | 'incorruptible'
type Beauty = 'ugly' | 'fair' | 'radiant' | 'resplendent'
type Charm  = 'repulsive' | 'inoffensive' | 'affable' | 'likeable'

type Soul = {
  wit: Wit
  empathy: Empathy
  integrity: Integrity
  beauty: Beauty
  charm: Charm
}

export const createSoul = (): Soul => {
  const wit: Wit = pick([ 'slow', 'clever', 'biting', 'savage' ])
  const empathy: Empathy = pick([ 'sadistic', 'generous', 'benevolent', 'selfless' ])
  const integrity: Integrity = pick([ 'uncertain', 'sound', 'solid', 'incorruptible' ])
  const beauty: Beauty = pick([ 'ugly', 'fair', 'radiant', 'resplendent' ])
  const charm: Charm = pick([ 'repulsive', 'inoffensive', 'affable', 'likeable' ])
  return { wit, empathy, integrity, beauty, charm }
}

// type Category = BasicEntity
// type Item = Entity<Category> & {}
// type Event = BasicEntity
// type Incident = Entity<Incident>

// export type Trait = { id: number, name: string, rank: 0 | 1 | 2 | 3 | 4 | 5 }
export type Memory = { id: number, name: string, description: string }

export type Person = Individual<Moiety> & {
  body: Body
  mind: Mind
  soul: Soul


  // ie within my moiety, I am (thought of as)...
  // rank: 'commoner' | 'wellborn'
  // title?: string
  // reputation: 'unknown' | 'worthy' | 'adored' | 'revered'

  // individually...
  things: ManageStocks //Stocks<Item> // hmmm, maybe we really want a map at a higher-level anyway
  // stats: ManageStocks //Stocks<Item> // hmmm, maybe we really want a map at a higher-level anyway

  currency: number
  traits: ManageStocks // IList<Trait>

  // things to draw meters for..
  meters: { [meterName: string]: Function }
  memory: Collection<Memory>
  // philosophy?: Ideology
  // destiny: 'doomed' | 'commonplace' | 'exceptional' | 'free'
}

const personId = new Sequence()
const human: Species = { id: -1, name: 'Human Being', size: 'medium' }
export const createPerson = (name: string, moiety: Moiety): Person => {

  const inventory = new Stocks<any>(`${name}'s Things`)
  const traits = new Stocks<any>(`${name}'s Traits`)
  // const state = new Stocks<any>(`${name}'s State`)
    // personAttrs.things = inventory.manageAll()
  return {
    id: personId.next,
    kind: moiety,
    // kind: createMoiety()
    name,
    age: 0,
    body: createAnimal(name, human),
    mind: createMind(),
    soul: createSoul(),
    // rank: 'commoner',
    // reputation: 'unknown',
    currency: 0,
    things: inventory.manageAll(),
    traits: traits.manageAll(),
    // stats: state.manageAll()
    // things: new M
    meters: {},
    memory: new Collection<Memory>(),
  }

}

// const person = (): Person => {
//   const newPerson: Person = {
//     id: personId.next()
//   }
//   return newPerson
// }

export type Recipe = BasicEntity & {
  produces: { [resourceName: string]: number }
  consumes?: { [resourceName: string]: number }
  requiresMachine?: string
}

export type Machine = BasicEntity

// export type Task = BasicEntity & {
//   machine?: string
//   recipe: string
// }

// type ManageList = {}

export type ManageStocks = {
  add: (amount: number, name: string) => void,
  remove: (amount: number, name: string) => void,
  count: (name: string) => number,
  list: () => any[]
}

export type ManageStock<T> = {
  add: (amount: number) => void,
  remove: (amount: number) => void,
  count: number,
  item: T
}

export type ManagePopulation<T> = {
  count: number
  birth: (name: string) => T
  death: (name: string) => T
  add: (amount: number) => T[]
  remove: (amount: number) => T[]
}

export type ManagePopulationRegistry<T> = {
  lookup: (name: string) => ManagePopulation<T>
}

// todo rename
export interface EvolvingStocks {
  [key: string]: ManageStocks
}
export type TimeEvolution = (evolution: EvolvingStocks, ticks: number) => void

export type StepResult = {
  changed: { 
    [groupName: string]: { [elementName: string]: number }
  }
}

// todo move these model/sim things somewhere else???
export type Action = { id: number, name: string, act: Function }
export type Policy = { id: number, name: string, manage: Function }
