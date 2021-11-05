import { List, Map } from '../collections';
import { Recipe, Moiety, Person, ManageStocks, createPerson, createMoiety } from "./types";
import { Population } from "./Population";
import { Collection } from "./Collection";
import { boundMethod } from 'autobind-decorator';

type Job = { recipe: Recipe, startedAt?: number }

export class Community extends Population<Moiety, Person> {
  moieties: List<Moiety> = new List<Moiety>();
  obscured: boolean = false // don't display details
   
  public recipes = new Collection<Recipe>();
  public jobs = new Map<Person, Job>(
    worker => worker.id,
    worker => worker.name,
    this.lookupById
  );


  public inventories = new Map<Person, ManageStocks>(
    worker => worker.id,
    worker => worker.name,
    this.lookupById
  )

  get report(): { [personName: string]: string; } {
    const entries = this.list()
      .map(person => {
        let job =this.jobs.get(person)
        return [person.id, (job !== undefined && job.recipe !== undefined) ? job.recipe.name : '?'];
      });
    return Object.fromEntries(entries);
  }

  // okay if we need to override create + build inventories let's do it ??
  public create(name: string): Person;
  public create(attrs: Partial<Person>): Person;
  @boundMethod
  public create(attrs: any) {
    const personAttrs = super.build(attrs);
    const { name, age } = personAttrs;
    const person: Person = createPerson(name, createMoiety(`${name}'s Gens`)) //, this.species)
    person.age = age
    this.individuals.add(person)
    return person
  }

  work({ resources }: { resources: { add: Function; remove: Function; count: Function; }; }): void {
    const { report } = this.jobs;
    Object.entries(report).forEach(([_workerName, job]: [string, Job]) => {
      if (job && job.recipe) { this.produce(job.recipe, resources) };
    });
  }
  
  private produce(recipe: Recipe, resources: { add: Function; remove: Function; count: Function; }) {
    if (this.mayProduce(recipe, resources)) {
      if (recipe.consumes) {
        Object.entries(recipe.consumes).forEach(([resource, amount]) => {
          resources.remove(amount, resource);
        });
      }
      Object.entries(recipe.produces || {}).forEach(([resource, amount]) => {
        resources.add(amount, resource);
      });
    }
  }

  private mayProduce(recipe: Recipe, resources: { count: Function; }) {
    let mayProduce = true;
    if (recipe.consumes) {
      Object.entries(recipe.consumes).forEach(([resource, amount]) => {
        if (resources.count(resource) < amount) {
          mayProduce = false;
        }
      });
    }
    return mayProduce;
  }

}
