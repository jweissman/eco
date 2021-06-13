import { Stocks } from "./Stocks"
import { Substance, Individual, Machine, Animal, Recipe } from "./types"
import { Population } from "./Population"
import { Delta } from "./Delta"
import { Registry } from "./Registry"
import { Simulation } from "./Simulation"
import { Collection, IList } from "./Collection"
import { BasicEntity } from "./BasicEntity"
import { Map } from "./Map"

interface IModel {
  resources: Stocks<Substance>
  machines: Stocks<Machine>
  animals: Registry<Animal>
  people: Population<Individual>

  recipes: IList<Recipe>
}

type Task = BasicEntity & {
  machine?: string
  recipe: string
}


export class Model extends Simulation<Substance> implements IModel  {
  public resources = new Stocks<Substance>('resources')
  public machines  = new Stocks<Machine>('machines')
  public animals   = new Registry<Animal>('wildlife')
  public people    = new Population<Individual>('people')
  public recipes   = new Collection<Recipe>()
  public tasks     = new Collection<Task>()
  public jobs      = new Map<Individual, Task>(worker => worker.id, id => this.people.lookupById(id))

  // public taskmaster: EmploymentManager<Individual, Job> = []

  get delta() { return new Delta(this, (model) => model.resources) }

  protected apply(delta: Delta<Substance>) {
    const { add, list } = this.resources;
    const { storage: updated } = delta;
    const changed: { [elementName: string]: number; } = {};
    list.forEach(({ id, name }) => {
      if (updated[id]) {
        const deltaAmount = updated[id];
        add(deltaAmount, name);
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
