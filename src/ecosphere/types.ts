import { BasicEntity } from "./BasicEntity"


// type Quality = 'terrible' | 'poor' | 'adequate' | 'good' | 'fine' | 'excellent'

export type Substance = BasicEntity
export type Species = BasicEntity & {
  name: string
}
export type Individual = BasicEntity & { age: number }

// okay, this is still really a 'species'?? that's okay
export type Animal = Individual & {
  species: Species
  health:   'dying' | 'sick' | 'wounded' | 'healthy' | 'flourishing'
  strength: 'weak' | 'robust' | 'mighty' | 'indomitable'
  cunning:  'dim' | 'attentive' | 'skillful' | 'wise'
  agility:  'clumsy' | 'nimble' | 'spry'
}

// export type MachineKind = BasicEntity
export type Machine = BasicEntity //& { kind: MachineKind, owner?: Individual }

export type Recipe = BasicEntity & {
  produces: { [resourceName: string]: number }
  consumes?: { [resourceName: string]: number }
  requiresMachine?: string // machine name
}

export type Task = BasicEntity & {
  machine?: string
  recipe: string
}

// export type Job = { machine: Machine }

export type ManageStocks<T> = {
  add: (amount: number, name: string) => void,
  remove: (amount: number, name: string) => void,
  count: (name: string) => number,
  list: () => T[]
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

export interface Evolution {
  [key: string]: ManageStocks
  // ticks: number
  // animals: ManagePopulationRegistry<Animal>
}
export type TimeEvolution = (evolution: Evolution, ticks: number) => void
  // mode: TimeEvolutionMode
// }

export type StepResult = {
  changed: { [elementName: string]: number }
}

// type Quantity = number
// type ID = number
// type Name = string
// export type Manage<T> = { 
//   create: (name: Name) => T,
//   lookup: (name: Name) => T,
//   lookupById: (id: ID) => T,
//   list: () => T[],
//   add: (qty: Quantity, name: Name) => void,
//   remove: (qty: Quantity, name: Name) => void,
//   zero: (name: Name) => void,
//   count: (name: Name) => number,              
//   table: () => (T & { amount: number })[],
// }

// export type ManageItems = Manage<Substance>
