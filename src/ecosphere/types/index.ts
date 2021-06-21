import { BasicEntity } from "./BasicEntity"

export type Substance = BasicEntity
export type Entity<T> = BasicEntity & { kind: T }

type Quality = 'terrible' | 'poor' | 'adequate' | 'good' | 'excellent'
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
  health:   'dying' | 'sick' | 'wounded' | 'healthy' | 'flourishing'
}

export type Animal = Creature<Species> & {
  spirit: 'languorous' | 'vigorous' | 'impetuous'
  strength: 'weak' | 'robust' | 'mighty' | 'indomitable'
  cunning:  'dim' | 'attentive' | 'skillful' | 'wise'
  agility:  'clumsy' | 'awkward' | 'nimble' | 'spry'
}

// major demographic groupings -- moieties (maybe *this* should be called a Community??)
export type Moiety = BasicEntity & {
  wealth: 'impoverished' | 'surviving' | 'luxurious' | 'decadent'
  sophistication: 'uncultured' | 'savvy' | 'educated' | 'pompous'
  power: 'marginal' | 'influential' | 'sovereign'
}

type Body = Animal

type Mind = {
  insight: 'dense' | 'observant' | 'intuitive' | 'brilliant'
  education: 'unlettered' | 'well-read' | 'scholarly'
  depth: 'superficial' | 'substantial' | 'profound' | 'inscrutable'
}

type Soul = {
  wit: 'slow' | 'clever' | 'biting' | 'savage'
  empathy: 'sadistic' | 'benevolent' | 'selfless'
  serendipity: 'spontaneous' | 'casual' | 'stern' | 'rigid'
}

// type Category = BasicEntity
// type Item = Entity<Category> & {}

export type Person = Individual<Moiety> & {
  body: Body
  mind: Mind
  soul: Soul

  // ie within my moiety, I am (thought of as)...
  rank: 'commoner' | 'wellborn'
  title?: string
  reputation: 'unknown' | 'artless' | 'worthy' | 'revered'
  destiny: 'commonplace' | 'exceptional'

  // track items + currency
  currency: number
  // inventory: Stocks<Item> // hmmm, maybe we really want a map at a higher-level anyway
}

// const personId = sequence('id')
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
