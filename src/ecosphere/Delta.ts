import { Inventory } from "./Inventory";
import { Model } from "./Model";

export class Delta {
  constructor(public model: Model) { }

  inventory: Inventory = new Inventory(
    this.model.manager.lookupElementByName.bind(this.model.manager),
    {}
  );

  // todo test this :)
  timeEvolution(): void {
    const add = this.inventory.add.bind(this.inventory);
    const remove = this.inventory.remove.bind(this.inventory);
    const count = this.model.items.count.bind(this.model);

    this.model.timeEvolution({ add, remove, count });
  }
}
