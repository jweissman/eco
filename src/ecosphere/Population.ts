import { isString } from "./utils/isString";
import { boundMethod } from "autobind-decorator";
import { Entity } from "./types";
import { Sequence } from "../collections";

class SetHelper {
  static first<T>(set: Set<T>): T { return set.values().next().value }
}

// a collection of named individuals...
export class Population<Specie, Dividual extends Entity<Specie>> {
  private ids: Sequence = new Sequence()
  constructor(
    public name: string,
    public species?: Specie,
    private individuals: Set<Dividual> = new Set(),
  ) {}

  list() { 
    const theList: Dividual[] = []
    this.individuals.forEach(individual => theList.push(individual))
    return theList;
  }
  get count() { return this.individuals.size }
  get first() { 
    return SetHelper.first(this.individuals)
   }
  public lookup(name: string): Dividual {
    let theIndividual = null;
    this.individuals.forEach(individual => {
      if (individual.name === name) {
        theIndividual = individual;
      }
    });
    if (theIndividual) { return theIndividual }
    throw new Error(`Could not find individual with name '${name}' in the population of ${this.name}`)
  }

  @boundMethod
  public lookupById(id: number): Dividual {
    let theIndividual = null;
    this.individuals.forEach(individual => {
      if (individual.id === id) {
        theIndividual = individual;
      }
    });
    if (theIndividual) { return theIndividual }
    throw new Error(`Could not find individual with id ${id} in the population of ${this.name}`)
  };

  public birth(name: string = `${this.name} ${this.count}`): Dividual {
    const newborn = this.create(name)
    return newborn
  }

  public death(name: string = this.first.name): Dividual {
    const doomed = this.destroy(name)
    if (doomed) {
      return doomed
    }
    throw new Error("Population already empty!")
  }

  public add(amount: number) {
    const newborns = []
    for (let i = 0; i < amount; i++) {
      newborns.push(this.birth())
    }
    return newborns
  }

  public remove(amount: number) {
    const doneFor = []
    for (let i = 0; i < Math.min(this.count, amount); i++) {
      doneFor.push(this.death(this.first.name))
    }
    return doneFor
  }


  public create(name: string): Dividual;
  public create(attrs: Partial<Dividual>): Dividual;
  @boundMethod
  public create(attrs: any) {
    let name = null;
    let attributes: Partial<Dividual> = {};
    if (isString(attrs)) {
      name = attrs;
      attributes.name = name;
    } else {
      ({ name, ...attributes } = attrs);
    }
    
    const id = this.ids.next; //Math.max(0, ...this.ids) + 1;
    const theIndividual: Dividual = { id, name, ...attributes } as unknown as Dividual;
    this.individuals.add(theIndividual);
    return theIndividual;
  }

  // private get ids() {
  //   const individualIds: number[] = []
  //   this.individuals.forEach(({ id }) => individualIds.push(id));
  //   return individualIds;
  // }

  public destroy(name: string): Dividual;
  // public destroy(id: number): T;
  @boundMethod
  public destroy(name: string) {
    const theIndividual: Dividual = this.lookup(name) //this.individuals.find((it) => it.name === name) as unknown as T;
    this.individuals.delete(theIndividual);
    // this.individuals = this.individuals.remofilter(it => it.id === theIndividual.id);
    return theIndividual;
  }

  get report() {
    return Object.fromEntries(this.list().map(individual => {
      return [individual.id, individual.name];
    }))
  }
}
