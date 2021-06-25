import { Substance, Machine, Animal, Species, Person, Moiety } from "../types";
import { Stocks } from "../Stocks";
import { Registry } from "../Registry";
import { Population } from "../Population";
import { ISimulation } from "./ISimulation";

export interface IModel extends ISimulation {
  resources: Stocks<Substance>;
  machines: Stocks<Machine>;
  animals: Registry<Species, Animal>;
  people: Population<Moiety, Person>;
  // recipes: IList<Recipe>;
  // tasks: IList<Task>;
  // jobs: IMap<Person, Task>;
}
