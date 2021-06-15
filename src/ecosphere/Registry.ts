import { Population } from "./Population";
import { BasicEntity } from "./types/BasicEntity";
import { Entity, ManageStocks } from "./types";
import { boundMethod } from "autobind-decorator";

// eg map animal names to populations of individual animals...
export class Registry<U extends BasicEntity, T extends Entity<U>> {
  populations: { [species: string]: Population<U,T>; } = {};
  species: { [species: string]: U } = {}
  constructor(public name: string) { }

  clear() {
    this.populations = {}
  }

  @boundMethod
  lookup(name: string): Population<U,T> {
    if (this.has(name)) {
      return this.populations[name];
    } else {
      throw new Error(`No such ${this.name} '${name}'`);
    }
  }

  @boundMethod
  lookupById(id: number): U { //Population<U,T> {
    const matching = Object.values(this.species).find(x => x.id === id)
    if (matching) { //this.has(name)) {
      return matching
      // return this.populations[name];
    } else {
      throw new Error(`No such ${this.name} '${id}'`);
    }
  }

  has(name: string): boolean {
    return this.populations.hasOwnProperty(name);
  }

  @boundMethod
  count(name: string): number {
    return this.lookup(name).count;
  }

  @boundMethod
  list(): U[] {
    return Object.values(this.species)
  }

  listByName(name: string): T[] {
    return this.lookup(name).list();
  }

  @boundMethod
  create(name: string, species?: Omit<U, 'name' | 'id'>): Population<U,T> {
    if (this.has(name)) {
      return this.lookup(name);
    }
    let theSpecies: U = { ...species, name, id: this.list().length+1 } as unknown as U; // species.kind points back to name...
    let population = new Population<U,T>(name, theSpecies);
    this.populations[name] = population;
    this.species[name] = theSpecies;
    return population;
  }

  get populationList(): Population<U,T>[] { return Object.values(this.populations)}

  get report() {
    const pops = this.populationList.flatMap((population: Population<U,T>) => {
      const pop = population
      if (pop.count > 0) {
        return { name: pop.name, amount: pop.count}
      } else {
        return []
      }
    })
    return pops
  };

  @boundMethod
  add(amount: number, name: string): void {
    this.lookup(name).add(amount)
  };

  @boundMethod
  remove(amount: number, name: string): void {
    this.lookup(name).remove(amount)
  };

  manageAll(): ManageStocks {
    const { add, remove, count, list } = this
    return { add, remove, count, list }
  }
  get manager() { return this.manageAll() }
}
