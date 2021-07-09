import { List, Sequence } from "../collections";
import { BasicEntity } from "./types/BasicEntity";

class Collection<T extends BasicEntity> extends List<T> {
  list() { return this.items }
  private ids = new Sequence()
  get names(): string[] {
    // throw new Error('Method not implemented.');
    return this.items.map(item => item.name)
  }
  // private get ids() { return this.it.map(({ id }) => id) }
  create(attributes: Partial<T>): T {
    const id = this.ids.next;
    const theEntity: T = { id, ...attributes } as unknown as T;
    this.items.push(theEntity);
    return theEntity
  }

  lookup(name: string) {
    return this.items.find(it => it.name === name)
  }
}

export { Collection }
