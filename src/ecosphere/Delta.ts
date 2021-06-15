import { Model } from "./Model";
import { Registry } from "./Registry";
import { Stocks } from "./Stocks";
export type DeltaSource = Stocks<any> | Registry<any, any> 
//<U extends BasicEntity, T extends Entity<U>> = Stocks<T> | Registry<U,T>
export type DeltaSourceManager = { add: Function, remove: Function, count: Function, list: Function }
export class Delta {
  public changes: Stocks<any>;
  constructor(public model: any, public getStocks: (model: Model) => DeltaSource) {
    let baseline = this.getStocks(model)
    this.changes = new Stocks(`${baseline.name} (delta)`, baseline.list());
  }
  get storage() { return this.changes._store }
  // evolve(t: number): Delta {
  //   let stocks = this.getStocks(this.model)
  //   const flow = { [stocks.name]: stocks.manageAll() }
  //   this.model.dynamics.each(dynamism => dynamism(flow, t));
  //   return this;
  // }
}
