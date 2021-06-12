import { Delta } from "./Delta";
import { Model } from "./Model";
import { StepResult } from "./types";

export class Engine {
  constructor(public model: Model) { }
  step(): StepResult {
    const delta = new Delta(this.model);

    // do all the calculations for the step and THEN apply changes
    delta.timeEvolution();

    // apply delta
    const inventoryChanges: { [elementName: string]: number; } = {};
    this.model.elements.forEach((element) => {
      if (delta.inventory.storage[element.id]) {
        const deltaAmount = delta.inventory.storage[element.id];
        this.model.items.add(deltaAmount, element.name);
        inventoryChanges[element.name] = deltaAmount;
      }
    });

    return { inventoryChanges };
  }
}
