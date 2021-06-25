//

import { IList } from "./types";

export class List<T> implements IList<T> {
  protected items: T[] = [];
  protected get it() { return this.items; }
  get first(): T { return this.items[0]; }
  get last(): T { return this.items[this.count - 1]; }
  get count(): number { return this.items.length; }
  add(it: T) { this.items.push(it); }
  remove(it: T) { this.items = this.items.filter(item => item !== it); }
  each(cb: (it: T) => any) { this.items.forEach(cb); }
  clear() { this.items = []; }
}
