import { Substance } from "./types";

export class Inventory {
  constructor(
    private lookupElementByName: (elementName: string) => Substance,
    public storage: { [key: number]: number; } = {},
  ) { }

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
