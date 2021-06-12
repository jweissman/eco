import { Inventory } from "./Inventory"
import { Manager } from "./Manager"
import { Substance, Individual, TimeEvolution } from "./types"

export class Model {
  elements: Substance[] = []
  individuals: Individual[] = []
  manager: Manager = new Manager(this)
  inventory: Inventory = new Inventory(
    this.manager.lookupElementByName.bind(this.manager)
  )

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(public name: string) {
    // console.log("[Model] The model '" + name + "' was created")
  }

  // item management ////////////////////////////////
  items: {
    create: (name: string) => Substance
    add: (amount: number, elementName: string) => void,
    remove: (amount: number, elementName: string) => void,
    zero: (elementName: string) => void,
    count: (elementName: string) => number               
  } = {
    create: (name: string) => {
      if (this.manager.hasElement(name)) {
        const element: Substance = this.manager.lookupElementByName(name)
        return element
      }
      const elementIds: number[] = this.elements.map(({ id }) => id);
      const id = Math.max(0,...elementIds)+1;
      const theElement = { id, name }
      this.elements.push(theElement)
      return theElement;
    },
    // item management //////////////////////////////
    add: (amount: number, elementName: string) => { this.inventory.add(amount, elementName); },
    remove: (amount: number, elementName: string) => { this.inventory.remove(amount, elementName); },
    zero: (elementName: string) => { this.inventory.zero(elementName); },
    count: (elementName: string) => { return this.inventory.count(elementName); },
  }

  // individual management /////////////////////////////////
  individual(name: string): any {
    const individualIds: number[] = this.elements.map(({ id }) => id);
    const id = Math.max(0,...individualIds)+1;
    const theIndividual = { id, name }
    this.individuals.push(theIndividual)
    return theIndividual
  }

  // time evolution ///////////////////////////////////////
  timeEvolution: TimeEvolution = ({ add, remove }) => {}
  evolve(timeEvolution: TimeEvolution): void {
    this.timeEvolution = timeEvolution
  }
  step() { return this.manager.step() }
}

export default Model;
