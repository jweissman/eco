import { BasicEntity } from "./BasicEntity"

export type Substance = BasicEntity
export type Individual = BasicEntity & { age: number }
export type Machine = BasicEntity

export type EvolutionTools = {
  add: (amount: number, elementName: string) => void,
  remove: (amount: number, elementName: string) => void,
  count: (elementName: string) => number,
  t: number,
}
export type TimeEvolution = ({ add, remove, count, t }: EvolutionTools) => void

export type StepResult = {
  changed: { [elementName: string]: number }
}

type Quantity = number
type ID = number
type Name = string
export type Manage<T> = { 
  create: (name: Name) => T,
  lookup: (name: Name) => T,
  lookupById: (id: ID) => T,
  list: () => T[],
  add: (qty: Quantity, name: Name) => void,
  remove: (qty: Quantity, name: Name) => void,
  zero: (name: Name) => void,
  count: (name: Name) => number,              
  table: () => (T & { amount: number })[],
}

export type ManageItems = Manage<Substance>
