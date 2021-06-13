import { Population } from "./Population";
import { BasicEntity } from "./BasicEntity";

// map animal names to populations ...
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

  list(name: string): T[] {
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

  get names() {
    return Object.keys(this.populations)
  }

  get populationList(): Population<T>[] { return Object.values(this.populations)}

  get report() {
    const pops = this.populationList.map((population: Population<T>) =>
      [population.name, population.count]
    )
    return Object.fromEntries(pops)
  };
}
