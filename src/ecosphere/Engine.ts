import { Delta } from "./Delta";
import { Model } from "./Model";
import { StepResult } from "./types";

export class Engine {
  constructor(public model: Model) { }
  step(t: number): StepResult {
    const delta = new Delta(this.model);

    // do all the calculations for the step and THEN apply changes
    delta.timeEvolution(t);

    // apply delta
    // delta.
    const { storage: updated } = delta;
    const changes: { [elementName: string]: number; } = {};
    this.model.items.list().forEach(({ id, name }) => {
      if (updated[id]) {
        const deltaAmount = updated[id];
        this.model.items.add(deltaAmount, name);
        changes[name] = deltaAmount;
      }
    });

    return { inventoryChanges: changes };
  }
}
