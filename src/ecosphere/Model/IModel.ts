import { Substance, Machine, Animal, Recipe, Task, Species, Group, Person } from "../types";
import { Stocks } from "../Stocks";
import { Registry } from "../Registry";
import { Population } from "../Population";
import { IList } from "../Collection";
import { IMap } from "../Map";
import { ISimulation } from "./ISimulation";

export interface IModel extends ISimulation {
  resources: Stocks<Substance>;
  machines: Stocks<Machine>;
  animals: Registry<Species, Animal>;
  people: Population<Group, Person>;
  // recipes: IList<Recipe>;
  // tasks: IList<Task>;
  // jobs: IMap<Person, Task>;
}
