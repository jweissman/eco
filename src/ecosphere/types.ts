import { BasicEntity } from "./BasicEntity"

type Quality = 'terrible' | 'poor' | 'adequate' | 'good' | 'fine' | 'excellent'
type Size = 'fine' | 'small' | 'medium' | 'large' | 'huge'

export type Substance = BasicEntity
export type Species = BasicEntity & {
  name: string
  size: Size
  fitness: Quality
}

export type Entity<T> = BasicEntity & { kind: T }
export type Individual<T> = Entity<T> & { age: number }

export type Animal = Individual<Species> & {
  // species: Species
  health:   'dying' | 'sick' | 'wounded' | 'healthy' | 'flourishing'
  strength: 'weak' | 'robust' | 'mighty' | 'indomitable'
  cunning:  'dim' | 'attentive' | 'skillful' | 'wise'
  agility:  'clumsy' | 'awkward' | 'nimble' | 'spry'
}

export type Group = BasicEntity & {
  // major demographic groupings -- moieties
}
export type Person = Animal & Individual<Group>
// export type MachineKind = BasicEntity
export type Machine = BasicEntity //& { kind: MachineKind, owner?: Individual }

export type Recipe = BasicEntity & {
  produces: { [resourceName: string]: number }
  consumes?: { [resourceName: string]: number }
  requiresMachine?: string
}

export type Task = BasicEntity & {
  machine?: string
  recipe: string
}

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

export interface Evolution {
  [key: string]: ManageStocks
}
export type TimeEvolution = (evolution: Evolution, ticks: number) => void

export type StepResult = {
  changed: { 
    [groupName: string]: { [elementName: string]: number }
  }
}
