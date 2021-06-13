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
    this.model.dynamics({
      t,
      resources: { add, remove, count },
      animals: this.model.animals
        // birth: (name: string) => this.model.animals.lookup(name).birth(),
        // death: (name: string) => this.model.animals.lookup(name).death(),
        //   // todo..w
        // count: (name: string) => this.model.animals.count(name),
        // add: (amount: number, name: string) => {
        //   if (amount > this.model.animals.count)
        //   let born = []
        //   for (let i = 0; i < amount; i++) {
        //     this.model.animals.create()
        //     // this.model.animals.destroy(this.model.animals.list[i].name);
        //   }
        // }
      // }
    });
    return this;
  }
}
