import { Population } from "./Population";
import { BasicEntity } from "./BasicEntity";
import { Entity, ManageStocks } from "./types";
import { boundMethod } from "autobind-decorator";

// class Register<T extends BasicEntity> implements ManageStocks<T> {
//   constructor(private registry: Registry<T>) {}

//   @boundMethod
//   list(): T[] {
//     return this.registry.list()
//   }

//   @boundMethod
//   add(amount: number, name: string): void {
//     this.registry.add(amount, name)
//   };

//   @boundMethod
//   remove(amount: number, name: string): void {
//     this.registry.lookup(name).remove(amount)
//   };

//   @boundMethod
//   count(name: string): number {
//     // return this.list().length
//     // console.log("[Register.count]" + name)
//     return this.registry.count(name)
//   }
// }

// eg map animal names to populations of individual animals...
export class Registry<U extends BasicEntity, T extends Entity<U>> {
  populations: { [species: string]: Population<U,T>; } = {};
  species: { [species: string]: U } = {}
  // Map<T,U>
  constructor(public name: string) { }

  clear() {
    this.populations = {}
    // this.species = {}
  }

  @boundMethod
  lookup(name: string): Population<U,T> {
    if (this.has(name)) {
      return this.populations[name];
    } else {
      // return this.create(name)
      throw new Error(`No such ${this.name} '${name}'`);
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
    // console.log(Object.keys(this.species))
    // return Object.values(this.populations).flatMap(pop => pop.count > 0 ? pop.first : [])

    console.log(this.species)
    return Object.values(this.species)
  // throw new Error('not impl')
  }

  listByName(name: string): T[] {
    return this.lookup(name).list();
  }

  @boundMethod
  create(name: string, species: Partial<U> = {}): Population<U,T> {
    if (this.has(name)) {
      return this.lookup(name);
    }
    let theSpecies: U = { ...species, name, id: this.list().length+1 } as unknown as U; // species.kind points back to name...
    console.log("create species: " + theSpecies.name)
    let population = new Population<U,T>(name, theSpecies);
    this.populations[name] = population;
    this.species[name] = theSpecies;
    return population;
  }

  // newSpecies(name: string): U {
  //   // throw new Error("Method not implemented.");
  //   return { kind: name }
  // }

  // get names() { return Object.keys(this.populations) }

  get populationList(): Population<U,T>[] { return Object.values(this.populations)}

  get report() {
    const pops = this.populationList.map((population: Population<U,T>) =>
      [population.name, population.count]
    )
    return Object.fromEntries(pops)
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
    // return new Register(this)
    // const { add, count } = this
    // // console.log(this)
    // count.bind(this)
    // return {
    //   add,
    //   list: () => this.list,
    //   remove: (amount: number, name: string) => this.lookup(name).remove(amount),
    //   count //: (name: string) => this.lookup(name).count
    // }
  }
  get manager() { return this.manageAll() }
}
