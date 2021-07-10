import { Substance, Machine, Animal, Species, Person, Moiety, Action, Policy } from "../types";
import { Stocks } from "../Stocks";
import { Registry } from "../Registry";
import { Population } from "../Population";
import { ISimulation } from "./ISimulation";
import { Collection } from "../Collection";

export interface IModel extends ISimulation {
  currentPolicy?: Policy;
  // todo move into sim??
  choose(policyName: string, args: any): void;
  send(actionName: string, args: any): void;
  policies: Collection<Policy>;
  actions: Collection<Action>;

  resources: Stocks<Substance>;
  machines: Stocks<Machine>;
  animals: Registry<Species, Animal>;
  people: Population<Moiety, Person>;
  metrics: { [key: string]: () => number };
  // recipes: IList<Recipe>;
  // tasks: IList<Task>;
  // jobs: IMap<Person, Task>;
}
