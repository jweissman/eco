import { Inventory } from "./Inventory";
import { Model } from "./Model";

export class Delta {
  private inventory: Inventory = new Inventory(
    this.model.items.lookup,
    this.model.items.lookupById,
    {}
  );
  constructor(public model: Model) { }
  get storage() { return this.inventory.storage }
  timeEvolution(t: number): void {
    const { add, remove } = this.inventory; 
    const { count } = this.model.items;
    this.model.evolution({ add, remove, count, t });
  }
}
