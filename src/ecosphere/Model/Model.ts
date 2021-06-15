import { Substance, Machine, Animal, Recipe, Task, Species, Group, Person } from "../types"
import { Stocks } from "../Stocks"
import { Registry } from "../Registry"
import { Population } from "../Population"
import { Collection, IList } from "../Collection"
import { IMap, Map } from "../Map"
import { ISimulation, Simulation } from "./Simulation"
import { boundMethod } from "autobind-decorator"

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

  // simple labor model

  @boundMethod
  work({ resources }: { resources: { add: Function, remove: Function, count: Function }}): void {
    console.log(this.jobs.report)
    console.log(this.recipes)
    const { report } = this.jobs
    Object.entries(report).forEach(([workerName, job]) => {
      const recipe: Recipe = this.recipes.lookup((job as Task).recipe) as Recipe
      let mayProduce = true;
      if (recipe.consumes) {
        Object.entries(recipe.consumes).forEach(([resource, amount]) => {
          if (resources.count(resource) < amount) {
            mayProduce = false;
            console.warn(`${workerName} not able to perform ${recipe.name} (required resources not present)`)
          }
        })
      }

      if (recipe.requiresMachine) {
        const machineCount = this.machines.count(recipe.requiresMachine)
        if (machineCount < 1) {
          mayProduce = false;
          console.warn(`${workerName} not able to perform ${recipe.name} (required machine ${recipe.requiresMachine} not present)`)
        }
      }

      if (mayProduce) {
        console.log(`${workerName} is at work ${recipe.name}`)
        if (recipe.consumes) {
          Object.entries(recipe.consumes).forEach(([resource, amount]) => {
            resources.remove(amount, resource)
          })
        }
        Object.entries(recipe.produces).forEach(([resource, amount]) => {
          resources.add(amount, resource)
        })
      }
    })
  }
}

export default Model;
