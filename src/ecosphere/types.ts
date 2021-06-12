
export type Substance = { id: number, name: string }
export type Individual = { id: number, name: string }
export type TimeEvolution = ({ add, remove }: {
  add: (amount: number, elementName: string) => void,
  remove: (amount: number, elementName: string) => void,
  count: (elementName: string) => number,
}) => void

export type StepResult = {
  inventoryChanges: { [elementName: string]: number }
}
