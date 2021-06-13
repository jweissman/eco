import { BasicEntity } from "./BasicEntity";
import { Model } from "./Model";
import { Stocks } from "./Stocks";
// import { Substance } from "./types";

// okay so maybe we want a 'collection' of dynamics
// each one operates on a given set of stocks ??
// we can at least keep types straight...
// and anyway not be injecting different stocks and having to track them!!
export class Delta<T extends BasicEntity> {
  private changes: Stocks<T>;
  constructor(public model: Model, public getStocks: (model: Model) => Stocks<T>) {
    let baseline = this.getStocks(model)
    this.changes = new Stocks(`${baseline.name} (delta)`, baseline.list);
  }

  get storage() { return this.changes._store }

  evolve(t: number): Delta<T> {
    let stocks = this.getStocks(this.model)
    // const { add, remove } = this.changes; 
    // const { count } = stocks; //this.model.resources;
    const flow = { [stocks.name]: stocks.manageAll() }
    this.model.dynamics(flow, t);
    return this;
  }
}
