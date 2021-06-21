import { Map } from '../collections';
import { Recipe, Moiety, Person } from "./types";
import { Population } from "./Population";
import { Collection } from "./Collection";

export class Community extends Population<Moiety, Person> {
  public recipes = new Collection<Recipe>();
  public jobs = new Map<Person, Recipe>(worker => worker.id, worker => worker.name, this.lookupById);

  get report(): { [personName: string]: string; } {
    const entries = this.list()
      .map(person => [person.id, this.jobs.get(person).name]);
    return Object.fromEntries(entries);
  }

  produce(recipe: Recipe, resources: { add: Function; remove: Function; count: Function; }) {
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

  work({ resources }: { resources: { add: Function; remove: Function; count: Function; }; }): void {
    const { report } = this.jobs;
    Object.entries(report).forEach(([_workerName, recipe]: [string, Recipe]) => {
      this.produce(recipe, resources);
    });
  }
}
