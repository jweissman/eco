import { BasicEntity } from "./BasicEntity";
import { boundMethod } from 'autobind-decorator'
import { where } from "./where";
import { isString } from "./isString";

export class Stocks<T extends BasicEntity> {
  // private elements: T[] = [];
  private storage: { [key: number]: number; } = {}

  constructor(
    public name: string,
    private elements: T[] = []
  ) {}

  get list() { return this.elements }
  get _store() { return this.storage }

  public create(name: string): T
  public create(attributes: { name: string } & Partial<T>): T
  /** Create a new type of element to store */
  @boundMethod
  public create(attrs: any) {
    let name = null;
    let attributes: Partial<T> = {}
    if (isString(attrs)) {
      name = attrs;
      attributes.name = name;
    } else {
      ({ name, ...attributes } = attrs);
    }
    if (this.has(name)) {
      const entity: T = this.lookup(name) as T;
      return entity;
    }
    const elementIds: number[] = this.list.map(({ id }) => id);
    const id = Math.max(0, ...elementIds) + 1;
    const theEntity: T = { id, name, ...attributes } as unknown as T;
    this.list.push(theEntity);
    return theEntity;
  }

  @boundMethod
  add(amount: number, name: string) {
    // console.log(this)
    let initial = 0;
    if (this.has(name)) { initial = this.count(name) }
    this.setAmount(name, initial + amount);
  }

  @boundMethod
  remove(amount: number, name: string): void {
    let initial = 0;
    if (this.count(name)) { initial = this.count(name) }
    this.setAmount(name, initial - amount);
  }

  @boundMethod
  zero(name: string): void {
    this.setAmount(name, 0);
  }

  @boundMethod
  count(name: string): number {
    const element: T = this.lookup(name);
    this.storage[element.id] = this.storage[element.id] || 0;
    return this.storage[element.id];
  }

  has(name: string): boolean {
    const matching = this.elements.find(where('name', name)) 
    return !!matching;
  }

  lookupById(id: number): T {
    const matching = this.elements.find(where('id', id))
    if (matching) {
      return matching as T;
    }
    throw new Error(`No such ${this.name} with id ${id}`);
  }

  lookup(name: string): T {
    const matching = this.elements.find(where('name', name))
    if (matching) {
      return matching as T;
    }
    throw new Error(`No such ${this.name} with name ${name}`);
  }

  get report(): (T & { amount: number })[] {
    const warehouse = Object.entries(this.storage) 
    console.log(warehouse)
    return warehouse.flatMap(([elementId, amount]) => {
      const element = this.lookupById(Number(elementId))
      if (amount > 0) {
        return { ...element, amount }
      } else {
        return []
      }
    })
  }

  private setAmount(name: string, amount: number): void {
    const element: T = this.lookup(name);
    this.storage[element.id] = amount;
  }
}
