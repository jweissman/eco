import { BasicEntity } from "./BasicEntity"


// type Quality = 'terrible' | 'poor' | 'adequate' | 'good' | 'fine' | 'excellent'

export type Substance = BasicEntity
export type Species = BasicEntity & {
  name: string
}
export type Individual = BasicEntity & { age: number }

// okay, this is still really a 'species'?? that's okay
export type Animal = Individual & {
  // species: Species
  // health:   'dying' | 'sick' | 'wounded' | 'healthy' | 'flourishing'
  // strength: 'weak' | 'robust' | 'mighty' | 'indomitable'
  // cunning:  'dim' | 'attentive' | 'skillful' | 'wise'
  // agility:  'clumsy' | 'nimble' | 'spry'
}
export type Machine = BasicEntity


export type ManageStocks = {
  add: (amount: number, name: string) => void,
  remove: (amount: number, name: string) => void,
  count: (name: string) => number,
}

export type ManageStock<T> = {
  add: (amount: number) => void,
  remove: (amount: number) => void,
  count: () => number,
  get: () => T
}

export type ManagePopulation<T> = {
  count: number
  birth: (name: string) => T
  death: (name: string) => T
  // could implement add/remove by calling birth/death on random individuals...????????
  add: (amount: number) => T[]
  remove: (amount: number) => T[]
}

export type ManagePopulationRegistry<T> = {
  lookup: (name: string) => ManagePopulation<T>
}

export type Evolution = {
  t: number
  resources: ManageStocks
  animals: ManagePopulationRegistry<Animal>
}
export type TimeEvolution = (evolution: Evolution) => void

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
