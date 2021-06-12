import { Engine } from "./Engine";
import { Model } from "./Model";
import { StepResult, Substance } from "./types";

export class Manager {
  engine: Engine = new Engine(this.model);
  constructor(public model: Model) { }

  step(): StepResult { return this.engine.step(); }

  hasElement(elementName: string): boolean {
    const matching = this.model.elements.find(e => e.name === elementName);
    return !!matching;
  }

  lookupElementById(elementId: number): Substance {
    const matching = this.model.elements.find(e => e.id === elementId);
    if (matching) {
      return matching;
    }
    throw new Error("no such element with id: " + elementId);
  }

  lookupElementByName(elementName: string): Substance {
    const matching = this.model.elements.find(e => e.name === elementName);
    if (matching) {
      return matching;
    }
    throw new Error("no such element: " + elementName);
  }

  get inventoryMap() {
    const warehouse = Object.entries(this.model.inventory.storage)
    return warehouse.flatMap(([elementId, amount]) => {
      const element = this.lookupElementById(Number(elementId))
      if (amount > 0) {
        return { ...element, amount }
      } else {
        return []
      }
    })
  }

}
