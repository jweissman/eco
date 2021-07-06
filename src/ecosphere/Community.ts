import { Map } from '../collections';
import { Recipe, Moiety, Person, ManageStocks } from "./types";
import { Population } from "./Population";
import { Collection } from "./Collection";
import { Stocks } from './Stocks';
import { boundMethod } from 'autobind-decorator';

export class Community extends Population<Moiety, Person> {
  public recipes = new Collection<Recipe>();
  public jobs = new Map<Person, Recipe>(
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
      .map(person => [person.id, (this.jobs.get(person) || {name: '?'}).name]);
    return Object.fromEntries(entries);
  }

  // okay if we need to override create + build inventories let's do it ??
  public create(name: string): Person;
  public create(attrs: Partial<Person>): Person;
  @boundMethod
  public create(attrs: any) {
    let person = super.create(attrs);
    const inventory = new Stocks<any>(`${person.name}'s Things`)
    person.things = inventory.manageAll()
    return person
  }

  // people have inventories...
  // and maybe they've declared what they want

  // trade({ resources })

  work({ resources }: { resources: { add: Function; remove: Function; count: Function; }; }): void {
    const { report } = this.jobs;
    Object.entries(report).forEach(([_workerName, recipe]: [string, Recipe]) => {
      this.produce(recipe, resources);
    });
  }
  
  private produce(recipe: Recipe, resources: { add: Function; remove: Function; count: Function; }) {
    if (this.mayProduce(recipe, resources)) {
      if (recipe.consumes) {
        Object.entries(recipe.consumes).forEach(([resource, amount]) => {
          resources.remove(amount, resource);
        });
      }
      Object.entries(recipe.produces).forEach(([resource, amount]) => {
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
