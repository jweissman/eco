import assertNever from 'assert-never';
import { Stocks } from "./Stocks"
import { Substance, Individual, Machine, Animal, Recipe, StepResult, Task, TimeEvolution } from "./types"
import { Population } from "./Population"
import { Delta, DeltaSource } from "./Delta"
import { Registry } from "./Registry"
import { Simulation } from "./Simulation"
import { Collection, IList } from "./Collection"
import { Map } from "./Map"
import { BasicEntity } from './BasicEntity';

interface IModel {
  resources: Stocks<Substance>
  machines: Stocks<Machine>
  animals: Registry<Animal>
  people: Population<Individual>
  recipes: IList<Recipe>
}

type TimeEvolutionMode = 'animals' | 'resources'
export class Model extends Simulation implements IModel  {
  public resources = new Stocks<Substance>('resources')
  public machines  = new Stocks<Machine>('machines')
  public animals   = new Registry<Animal>('wildlife')
  public people    = new Population<Individual>('people')
  public recipes   = new Collection<Recipe>()
  public tasks     = new Collection<Task>()
  public jobs      = new Map<Individual, Task>(worker => worker.id, id => this.people.lookupById(id))
  // public dynamicMap = new Map<TimeEvolutionMode, SimpleCollection<>>

  delta(mode: TimeEvolutionMode): Delta<Animal | Substance> {
    if (mode === 'animals') {
      return new Delta<Animal>(this, (model) => model.animals)
    } else if (mode === 'resources') {
      return new Delta<Substance>(this, (model) => model.resources)
    } else { assertNever(mode) }
  }

  evolve(timeEvolution: TimeEvolution) {
    this.dynamics.add(timeEvolution)
  }

  step(t: number = this.ticks++): StepResult {
    const animalDelta   = new Delta<Animal>(this, (model) => model.animals)
    const resourceDelta = new Delta<Substance>(this, (model) => model.resources)
    // this.apply(resourceDelta.evolve(t))
    // return this.apply(animalDelta.evolve(t))
    
    // [ model.animals. ]
    const flow = {
      animals: {
        ...animalDelta.changes.manager,
        count: this.animals.count,
      },
      resources: {
        ...resourceDelta.changes.manager,
        count: this.resources.count
      }
      // [stocks.name]: stocks.manageAll()
    }
    this.dynamics.each(dynamism => dynamism(flow, t));
    this.apply(resourceDelta, 'resources')
    // this.apply(animalDelta, 'animals')
    return { changed: {} }
  }

  // evolve(t: number): Delta<T> {
    // let stocks = this.getStocks(this.model)
    // const flow = { [stocks.name]: stocks.manageAll() }
    // this.model.dynamics.each(dynamism => dynamism(flow, t));
    // return this;
  // }

  protected apply<T extends BasicEntity>(delta: Delta<T>, target = 'resources') {
    // @ts-ignore
    const source = this[target]
    const manager = source.manager

    // console.log(target)
    // console.log(manager.list())
    const list: T[] = manager.list()
    // console.log(list)
    // manager.list
    // manager.add(10, 'gold')
    // const { add, list } = manager; // as unknown as DeltaSource<T>; //.resources;
    const { storage: updated } = delta;
    const changed: { [elementName: string]: number; } = {};

    list.forEach(({ id, name }) => {
      // console.log({ id, name })
      if (updated[id]) {
        const deltaAmount = updated[id];
        manager.add(deltaAmount, name);
        changed[name] = deltaAmount;
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
