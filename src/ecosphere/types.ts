export type Substance = { id: number, name: string }
export type Individual = { id: number, name: string }
export type Machine = { id: number, name: string }

export type EvolutionTools = {
  add: (amount: number, elementName: string) => void,
  remove: (amount: number, elementName: string) => void,
  count: (elementName: string) => number,
  t: number,
}
export type TimeEvolution = ({ add, remove, count, t }: EvolutionTools) => void

export type StepResult = {
  inventoryChanges: { [elementName: string]: number }
}

export type ManageItems = { 
  create: (name: string) => Substance,
  lookup: (name: string) => Substance,
  lookupById: (id: number) => Substance,
  list: () => Substance[],
  add: (amount: number, elementName: string) => void,
  remove: (amount: number, elementName: string) => void,
  zero: (elementName: string) => void,
  count: (elementName: string) => number,              
  table: () => (Substance & { amount: number })[],
}
