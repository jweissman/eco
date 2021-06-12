import { Model } from "./Model";
import { Substance } from "./types";
import { where } from "./where";

export class Manager {
  constructor(public model: Model) {
    this.lookup = this.lookup.bind(this)
    this.lookupById = this.lookupById.bind(this)
  }

  has(itemName: string): boolean {
    const { items } = this.model
    const matching = items.list().find(where('name', itemName)) 
    return !!matching;
  }

  lookupById(elementId: number): Substance {
    const { items } = this.model
    const matching = items.list().find(where('id', elementId))
    if (matching) {
      return matching;
    }
    throw new Error("No such element with id: " + elementId);
  }

  lookup(elementName: string): Substance {
    const { items } = this.model
    const matching = items.list().find(where('name', elementName))
    if (matching) {
      return matching;
    }
    throw new Error("No such element with name: " + elementName);
  }

  get stocks(): (Substance & { amount: number })[] {
    return this.model.items.table();
    // const warehouse = Object.entries(this.model.items.stored)
    // // inventory.storage)
    // return warehouse.flatMap(([elementId, amount]) => {
    //   const element = this.lookupById(Number(elementId))
    //   if (amount > 0) {
    //     return { ...element, amount }
    //   } else {
    //     return []
    //   }
    // })
  }
}
