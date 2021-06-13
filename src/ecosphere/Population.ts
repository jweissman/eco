import { BasicEntity } from "./BasicEntity";
import { isString } from "./isString";
import { boundMethod } from "autobind-decorator";

// a collection of named individuals...
export class Population<T extends BasicEntity> {
  private individuals: T[] = [];
  get list() { return this.individuals; }

  public create(attrs: string): T;
  public create(attrs: Partial<T>): T;
  @boundMethod
  public create(attrs: any) {
    let name = null;
    let attributes: Partial<T> = {};
    if (isString(attrs)) {
      name = attrs;
      attributes.name = name;
    } else {
      ({ name, ...attributes } = attrs);
    }
    const individualIds: number[] = this.individuals.map(({ id }) => id);
    const id = Math.max(0, ...individualIds) + 1;
    const theIndividual: T = { id, name, ...attributes } as unknown as T;
    this.individuals.push(theIndividual);
    return theIndividual;
  }
}
