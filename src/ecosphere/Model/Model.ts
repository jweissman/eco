import { Substance, Machine, Animal, Recipe, Task, Species, Group, Person } from "../types"
import { Stocks } from "../Stocks"
import { Registry } from "../Registry"
import { Population } from "../Population"
import { Collection, IList } from "../Collection"
import { IMap, Map } from "../Map"
import { ISimulation, Simulation } from "./Simulation"

// todo -- mix multiple models... class Assembly { addModel(name: string, model: Model) {} }

export interface IModel extends ISimulation {
  resources: Stocks<Substance>
  machines: Stocks<Machine>
  animals: Registry<Species, Animal>
  people: Population<Group, Person>
  recipes: IList<Recipe>
  tasks: IList<Task>
  jobs: IMap<Person, Task>
}

export class Model extends Simulation implements IModel  {
  public resources = new Stocks<Substance>('resources')
  public machines  = new Stocks<Machine>('machines')
  public animals   = new Registry<Species, Animal>('wildlife')
  public people    = new Population<Group, Person>('people')
  public recipes   = new Collection<Recipe>()
  public tasks     = new Collection<Task>()
  public jobs      = new Map<Person, Task>(worker => worker.id, id => this.people.lookupById(id))

  // stocks or registries to expose for evolution (will also track deltas)
  tracking = [ 'animals', 'resources' ]

  reset() {
    this.resources.clear()
    this.machines.clear()
    this.animals.clear()
    this.dynamics.clear()
  }
}

export default Model;
