import { BasicEntity } from "./BasicEntity";

export interface IList<T> {
  first: T
  last: T
  count: number
  // create(attributes: Partial<T>): T
}

// for things that aren't basic entity
class SimpleCollection<T> implements IList<T> {
  protected items: T[] = [];
  protected get it() { return this.items }
  get first(): T { return this.items[0]; }
  get last(): T { return this.items[this.count - 1]; }
  get count(): number { return this.items.length; }
}

class Collection<T extends BasicEntity> extends SimpleCollection<T> implements IList<T> {
  // private items: T[] = [];
  // get first(): T { return this.items[0]; }
  // get last(): T { return this.items[this.count - 1]; }
  // get count(): number { return this.items.length; }
  // private get it() { return this.items }
  private get ids() { return this.it.map(({ id }) => id) }
  create(attributes: Partial<T>): T {
    const id = Math.max(0, ...this.ids) + 1;
    const theEntity: T = { id, ...attributes } as unknown as T;
    this.items.push(theEntity);
    return theEntity
  }
}

export { SimpleCollection, Collection }
