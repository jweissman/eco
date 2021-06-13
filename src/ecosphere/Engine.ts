import { Delta } from "./Delta";
import { Model } from "./Model";
import { StepResult } from "./types";

export class Engine {
  constructor(public model: Model) { }
  step(t: number): StepResult {
    const { add, list } = this.model.resources;
    const delta = new Delta(this.model);
    delta.evolve(t);
    const { storage: updated } = delta;
    const changed: { [elementName: string]: number; } = {};
    list.forEach(({ id, name }) => {
      if (updated[id]) {
        const deltaAmount = updated[id];
        add(deltaAmount, name);
        changed[name] = deltaAmount;
      }
    });
    return { changed };
  }
}
