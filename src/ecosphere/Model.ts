export type Substance = { id: number, name: string }
export type Individual = { id: number, name: string }

export type Source = {}

class Inventory {
  storage: { [key: number]: number } = {}
}

class Model {
  elements: Substance[] = []
  individuals: Individual[] = []
  sources: Source[] = []
  // substance id -> amount
  inventory: Inventory = new Inventory()

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(public name: string) {}

  element(name: string) {
    if (this.hasElement(name)) {
      const element: Substance = this.lookupElementByName(name)
      return element
    }
    const elementIds: number[] = this.elements.map(({ id }) => id);
    const id = Math.max(0,...elementIds)+1;
    const theElement = { id, name }
    this.elements.push(theElement)
    return theElement
  }



  add(amount: number, elementName: string): void {
    const element: Substance = this.lookupElementByName(elementName);
    this.inventory.storage[element.id] ||= 0;
    this.inventory.storage[element.id] += amount;
  }

  remove(amount: number, elementName: string): void {
    const element: Substance = this.lookupElementByName(elementName);
    this.inventory.storage[element.id] ||= 0;
    this.inventory.storage[element.id] -= amount;
  }

  count(elementName: string): number {
    const element: Substance = this.lookupElementByName(elementName)
    return this.inventory.storage[element.id]
  }

  hasElement(elementName: string): boolean {
    const matching = this.elements.find(e => e.name === elementName)
    return !!matching;
  }

  lookupElementById(elementId: number): Substance {
    const matching = this.elements.find(e => e.id === elementId)
    if (matching) {
      return matching
    }
    throw new Error("no such element with id: " + elementId)
  }

  lookupElementByName(elementName: string): Substance {
    const matching = this.elements.find(e => e.name === elementName)
    if (matching) {
      return matching
    }
    throw new Error("no such element: " + elementName)
  }

  individual(name: string): any {
    const individualIds: number[] = this.elements.map(({ id }) => id);
    const id = Math.max(0,...individualIds)+1;
    const theIndividual = { id, name }
    this.individuals.push(theIndividual)
    return theIndividual
  }
}

export default Model;
