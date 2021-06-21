import { List } from "../collections";
import { BasicEntity } from "./types/BasicEntity";

class Collection<T extends BasicEntity> extends List<T> {
  private get ids() { return this.it.map(({ id }) => id) }
  create(attributes: Partial<T>): T {
    const id = Math.max(0, ...this.ids) + 1;
    const theEntity: T = { id, ...attributes } as unknown as T;
    this.items.push(theEntity);
    return theEntity
  }

  lookup(name: string) {
    return this.items.find(it => it.name === name)
  }
}

export { Collection }
