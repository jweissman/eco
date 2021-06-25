import { List, Sequence } from "../collections";
import { BasicEntity } from "./types/BasicEntity";

class Collection<T extends BasicEntity> extends List<T> {
  // private get ids() { return this.it.map(({ id }) => id) }
  ids = new Sequence()
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
