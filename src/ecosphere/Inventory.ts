import { Substance } from "./types";

export class Inventory {
  constructor(
    private lookupElementByName: (elementName: string) => Substance,
    private lookupElementById: (elementId: number) => Substance,
    public storage: { [key: number]: number; } = {},
  ) {
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    this.zero = this.zero.bind(this)
    this.count = this.count.bind(this)
  }

  get report(): (Substance & { amount: number })[] {
    // console.log(this.storage)
    const warehouse = Object.entries(this.storage) 
    console.log(warehouse)
    return warehouse.flatMap(([elementId, amount]) => {
      const element = this.lookupElementById(Number(elementId))
      if (amount > 0) {
        return { ...element, amount }
      } else {
        return []
      }
    })
  }

  add(amount: number, elementName: string) {
    this.setAmount(elementName, this.count(elementName) + amount);
  }

  remove(amount: number, elementName: string): void {
    this.setAmount(elementName, this.count(elementName) - amount);
  }

  zero(elementName: string): void {
    this.setAmount(elementName, 0);
  }

  count(elementName: string): number {
    const element: Substance = this.lookupElementByName(elementName);
    this.storage[element.id] = this.storage[element.id] || 0;
    return this.storage[element.id];
  }

  private setAmount(elementName: string, amount: number): void {
    const element: Substance = this.lookupElementByName(elementName);
    this.storage[element.id] = amount;
  }
}
