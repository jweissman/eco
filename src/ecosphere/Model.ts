import assertNever from 'assert-never';
import { Stocks } from "./Stocks"
import { Substance, Machine, Animal, Recipe, StepResult, Task, TimeEvolution, Species, Group, Person, Entity } from "./types"
import { Population } from "./Population"
import { Delta, DeltaSource } from "./Delta"
import { Registry } from "./Registry"
import { Simulation } from "./Simulation"
import { Collection, IList } from "./Collection"
import { Map } from "./Map"

interface IModel {
  resources: Stocks<Substance>
  machines: Stocks<Machine>
  animals: Registry<Species, Animal>
  people: Population<Group, Person>
  recipes: IList<Recipe>
}

type TimeEvolutionMode = 'animals' | 'resources'
export class Model extends Simulation implements IModel  {
  public resources = new Stocks<Substance>('resources')
  public machines  = new Stocks<Machine>('machines')
  public animals   = new Registry<Species, Animal>('wildlife')
  public people    = new Population<Group, Person>('people')
  public recipes   = new Collection<Recipe>()
  public tasks     = new Collection<Task>()
  public jobs      = new Map<Person, Task>(worker => worker.id, id => this.people.lookupById(id))
  // public dynamicMap = new Map<TimeEvolutionMode, SimpleCollection<>>

  reset() {
    this.resources.clear()
    this.machines.clear()
    this.animals.clear()
    this.dynamics.clear()
  }


  delta(mode: TimeEvolutionMode): Delta { //<Animal | Substance> {
    if (mode === 'animals') {
      return new Delta(this, (model) => model.animals)
    } else if (mode === 'resources') {
      return new Delta(this, (model) => model.resources)
    } else { assertNever(mode) }
  }

  evolve(timeEvolution: TimeEvolution) {
    this.dynamics.add(timeEvolution)
  }

  step(t: number = this.ticks++): StepResult {
    const animalDelta   = new Delta(this, (model) => model.animals)
    const resourceDelta = new Delta(this, (model) => model.resources)
    const flow = {
      animals: {
        ...animalDelta.changes.manager,
        count: this.animals.count,
      },
      resources: {
        ...resourceDelta.changes.manager,
        count: this.resources.count
      }
      // todo -- loop through ... [stocks.name]: stocks.manageAll()
    }
    this.dynamics.each(dynamism => dynamism(flow, t));
    this.apply(resourceDelta, 'resources')
    this.apply(animalDelta, 'animals')
    // console.log(animalDelta.changes.report)
    return {
      changed: {
        // resources: resourceDelta.changes.report
      }
    }
  }

  protected apply(delta: Delta, target = 'resources') {
    const source: DeltaSource = (this as any)[target] as DeltaSource
    const manager = source.manager
    const list = manager.list()
    // console.log(list)
    // if (list.length === 0) return
    const { storage: updated } = delta;
    const changed: { [elementName: string]: number; } = {};
    list.forEach((item: Entity<any>) => {
      // console.log(item.kind)
      if (updated[item.id]) {
        const deltaAmount = updated[item.id];
        manager.add(deltaAmount, item.name);
        // console.log({ deltaAmount, name: item.name })
        changed[item.name] = deltaAmount;
      }
    });
    return { changed };
  }

  get report() {
    const { resources, animals } = this
    return {
      resources: resources.report,
      animals: animals.report
    }
  }
}

export default Model;
