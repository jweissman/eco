import { SimpleCollection } from "../Collection";
import { Delta, DeltaSource } from "../Delta";
import { Entity, Evolution, TimeEvolution } from "../types";
import { ISimulation } from "./ISimulation";

export abstract class Simulation implements ISimulation {
  private ticks: number = 0;
  protected tracking: string[] = []
  public dynamics = new SimpleCollection<TimeEvolution>()
  constructor(public name: string) { }

  public evolve(e: TimeEvolution) { this.dynamics.add(e) }
  public step() { return this.flux(this.ticks++) }
  public get report() {
    return Object.fromEntries(this.tracking.map(target =>
      [target, (this as any)[target].report]
    ))
  }

  private flow(target: string) {
    const source = (this as any)[target]
    const theDelta = new Delta(this, (model) => (model as any)[target])
    const { add, remove } = theDelta.changes.manager
    const { list, count, lookupById } = source
    return { lookupById, _delta: theDelta, add, remove, list, count }
  }
  
  private flows(): { [key: string]: { _delta: Delta, lookupById: Function, add: Function } } {
    const theFlows: {[key: string]: any} = {}
    this.tracking.forEach(target => theFlows[target] = this.flow(target))
    return theFlows
  }

  private flowsReport(flow: { [s: string]: any }) {
    const table: { [key: string]: any } = {}
    Object.entries(flow).forEach(([name, flow]) => { 
      const theDelta = flow._delta
      table[name] = Object.fromEntries(
        Object
          .entries(theDelta.storage)
          .map(entry => {
            const [id, amount] = entry
            const name = flow.lookupById(Number(id)).name
            return [ name, amount ]
          })
      )
    })
    return table
  }

  private flux(t: number) {
    const flow: Evolution = this.flows() as any as Evolution
    this.dynamics.each(dynamism => dynamism(flow, t));
    Object.entries(flow).forEach(([name, flow]) => { 
      const theDelta = (flow as any)._delta
      this.apply(theDelta, name)
    })
    return { changed: this.flowsReport(flow) }
  }

  private apply(delta: Delta, target: string) {
    const source: DeltaSource = (this as any)[target] as DeltaSource
    const manager = source.manager
    const list = manager.list()
    const { storage: updated } = delta;
    const changed: { [elementName: string]: number; } = {};
    list.forEach((item: Entity<any>) => {
      if (updated[item.id]) {
        const deltaAmount = updated[item.id];
        manager.add(deltaAmount, item.name);
        changed[item.name] = deltaAmount;
      }
    });
    return { changed };
  }
}
