import { Map } from '../../collections'
import { Substance, Machine, Animal, Recipe, Species, Moiety, Person, ManageStocks } from "../types"
import { Stocks } from "../Stocks"
import { Registry } from "../Registry"
import { Population } from "../Population"
import { Collection } from "../Collection"
import { Simulation } from "./Simulation"
import { boundMethod } from "autobind-decorator"
import { IModel } from "./IModel"

class Community extends Population<Moiety, Person> {
  public recipes   = new Collection<Recipe>()
  // public tasks     = new Collection<Task>()
  public jobs      = new Map<Person, Recipe>(worker => worker.id, worker => worker.name, this.lookupById) // id => this.lookupById(id))

  get report(): { [personName: string]: string } {
    const entries = this.list()
                        .map(person => [person.id, this.jobs.get(person).name])
    return Object.fromEntries(entries)
  }

  @boundMethod
  produce(recipe: Recipe, resources: { add: Function, remove: Function, count: Function }) {
    console.log('[Community.produce]')
    let mayProduce = true;
    if (recipe.consumes) {
      Object.entries(recipe.consumes).forEach(([resource, amount]) => {
        if (resources.count(resource) < amount) {
          mayProduce = false;
          // console.warn(`${workerName} not able to perform ${recipe.name} (required resource ${resource} not present)`)
        }
      })
    }

    // todo inject machines to evo?
    // if (recipe.requiresMachine) {
    //   const machineCount = this.machines.count(recipe.requiresMachine)
    //   if (machineCount < 1) {
    //     mayProduce = false;
    //     console.warn(`${workerName} not able to perform ${recipe.name} (required machine ${recipe.requiresMachine} not present)`)
    //   }
    // }

    if (mayProduce) {
      // console.log(`${workerName}: ${(job as any).name}`)
      if (recipe.consumes) {
        Object.entries(recipe.consumes).forEach(([resource, amount]) => {
          resources.remove(amount, resource)
        })
      }
      console.log(recipe.produces)
      Object.entries(recipe.produces).forEach(([resource, amount]) => {
        resources.add(amount, resource)
      })
    }
 
  }

  // simple labor model
  @boundMethod
  work({ resources }: { resources: { add: Function, remove: Function, count: Function }}): void {
    console.log(`[Community.work] ${this.count} people`)
    const { report } = this.jobs
    Object.entries(report).forEach(([workerName, recipe]: [string, Recipe]) => {
      console.log(`Consider ${workerName}`, recipe)
      this.produce(recipe, resources)
      // const recipe: Recipe = this.recipes.lookup(re).recipe) as Recipe
    //  }

    })
  }
}

export class Model extends Simulation implements IModel  {
  public people    = new Community('people')

  public resources = new Stocks<Substance>('resources')
  public animals   = new Registry<Species, Animal>('wildlife')
  public machines  = new Stocks<Machine>('machines')

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
