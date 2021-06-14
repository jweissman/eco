import { Population } from "./Population";
import { BasicEntity } from "./BasicEntity";
import { ManageStocks } from "./types";
import { boundMethod } from "autobind-decorator";

class Register<T extends BasicEntity> implements ManageStocks<T> {
  constructor(private registry: Registry<T>) {}

  @boundMethod
  list(): T[] {
    return this.registry.list
  }

  @boundMethod
  add(amount: number, name: string): void {
    this.registry.add(amount, name)
  };

  @boundMethod
  remove(amount: number, name: string): void {
    this.registry.lookup(name).remove(amount)
  };

  @boundMethod
  count(name: string): number {
    return this.registry.count(name)
  }
}

// eg map animal names to populations of individual animals...
export class Registry<T extends BasicEntity> {
  populations: { [species: string]: Population<T>; } = {};
  constructor(public name: string) { }

  lookup(name: string): Population<T> {
    if (this.has(name)) {
      return this.populations[name];
    }
    throw new Error(`No such ${this.name} '${name}'`);
  }

  has(name: string): boolean {
    return this.populations.hasOwnProperty(name);
  }

  count(name: string): number {
    return this.lookup(name).count;
  }

  get list(): T[] {
    return Object.values(this.populations).map(pop => pop.first)
  }

  listByName(name: string): T[] {
    return this.lookup(name).list;
  }

  create(name: string): Population<T> {
    if (this.has(name)) {
      return this.lookup(name);
    }
    let population = new Population<T>(name);
    this.populations[name] = population;
    return population;
  }

  // get names() { return Object.keys(this.populations) }

  get populationList(): Population<T>[] { return Object.values(this.populations)}

  get report() {
    const pops = this.populationList.map((population: Population<T>) =>
      [population.name, population.count]
    )
    return Object.fromEntries(pops)
  };

  add(amount: number, name: string): void {
    this.lookup(name).add(amount)
  };

  manageAll(): ManageStocks<T> {
    return new Register(this)
  }
  get manager() { return this.manageAll() }
}
