import { Sequence } from "../../collections"
import { randomInteger } from "../utils/randomInteger"
import { sample } from "../utils/sample"
import { BasicEntity } from "./BasicEntity"
import { Person } from "./Person"

export type Substance = BasicEntity
export type Entity<T> = BasicEntity & { kind: T }

export type Quality = 'terrible' | 'adequate' | 'good' | 'excellent'
export type Size = 'fine' | 'small' | 'medium' | 'large' | 'huge'

// kinds of objects...
type Kind = 'sculpture' // 'art'

// substances objects can be made of...
export type Material = 'clay' | 'wood' | 'stone' | 'iron' //  | 'gold' | 'silver' | 'crystal'

// instances of objects...
export type Item = Entity<Kind> & {
  material?: Material
  quality?: Quality
  size?: Size
  description: string
  longDescription?: string
  // provenance ...
  // for artwork: concepts... styles...
}


export type Species = BasicEntity & {
  name: string
  size?: Size
  fitness?: Quality
  material?: Substance
}

export type Individual<T> = Entity<T> & {
  age: number // maybe simpler to do bornAt?
}


export type Creature<T> = Individual<T> & {
  health: 'dying' | 'unwell' | 'flourishing' | 'triumphant'
}

export function pick<T>(elements: T[]): T {
  const d100 = randomInteger(0,100)
  if (d100 > 98) {
    return elements[3]
  } else if (d100 < 2) {
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

export type PhysicalQuality = Spirit | Strength | Cunning | Agility | Guile

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

export type Recipe = BasicEntity & {
  time?: number
  probability?: number

  produces?: { [resourceName: string]: number }
  consumes?: { [resourceName: string]: number }
  requiresMachine?: string
  onSuccess: (worker: Person, _recipe: Recipe) => void
}

export type Machine = BasicEntity
// export type Structure ....

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

export type { Person };
