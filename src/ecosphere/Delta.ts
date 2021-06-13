import { Model } from "./Model";
import { Stocks } from "./Stocks";
import { Substance } from "./types";

export class Delta {
  private changingResources: Stocks<Substance> = new Stocks('resources (delta)', this.model.resources.list);
  constructor(public model: Model) { }
  get storage() { return this.changingResources._store }
  evolve(t: number): Delta {
    const { add, remove } = this.changingResources; 
    const { count } = this.model.resources;
    this.model.evolution({ add, remove, count, t });
    return this;
  }
}
