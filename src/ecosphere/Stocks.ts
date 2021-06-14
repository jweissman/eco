import { BasicEntity } from "./BasicEntity";
import { boundMethod } from 'autobind-decorator'
import { where } from "./where";
import { isString } from "./isString";
import { ManageStock, ManageStocks } from "./types";

class StockManager<T extends BasicEntity> implements ManageStock<T> {
  constructor(private stocks: Stocks<T>, private stockId: number) {}
  add(amount: number): void { return this.stocks.add(amount, this.name) }
  remove(amount: number): void { return this.stocks.remove(amount, this.name) }
  get count(): number { return this.stocks.count(this.name) }
  get name() { return this.item.name }
  get item(): T { return this.stocks.lookupById(this.stockId) }
}

// class WarehouseManager<T extends BasicEntity> implements ManageStocks {
//   constructor(private stocks: Stocks<T>) {}

//   @boundMethod
//   add(amount: number, name: string): void { return this.stocks.add(amount, name)};

//   @boundMethod
//   remove(amount: number, name: string): void { return this.stocks.remove(amount, name)};

//   @boundMethod
//   count(name: string): number { return this.stocks.count(name) }

//   @boundMethod
//   list(): T[] { return this.stocks.list }
// }

export class Stocks<T extends BasicEntity> {
  private storage: { [key: number]: number; } = {}

  constructor(
    public name: string,
    private elements: T[] = []
  ) { }

  get list() { return this.elements }
  get _store() { return this.storage }

  public clear() { this.elements = []; this.storage = {} }

  public create(name: string): ManageStock<T>
  public create(attributes: { name: string } & Omit<T, 'id' | 'name'>): ManageStock<T>
  /** Create a new type of element to store */
  @boundMethod
  public create(attrs: any) {
    let name: string | null = null;
    let attributes: Partial<T> = {}
    if (isString(attrs)) {
      name = attrs;
      attributes.name = name;
    } else {
      ({ name, ...attributes } = attrs);
    }
    if (isString(name) && this.has(name)) {
      return this.manage(name);
    }
    if (!isString(name)) { throw new Error("Name must be a string") }
    const elementIds: number[] = this.list.map(({ id }) => id);
    const id = Math.max(0, ...elementIds) + 1;
    const theEntity: T = { id, name, ...attributes } as T
    this.list.push(theEntity);
    const manage: ManageStock<T> = this.manage(name as string)
    return manage
  }

  @boundMethod
  add(amount: number, name: string) {
    this.setAmount(name, this.count(name) + amount);
  }

  @boundMethod
  remove(amount: number, name: string): void {
    this.setAmount(name, this.count(name) - amount);
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
    return warehouse.flatMap(([elementId, amount]) => {
      const element = this.lookupById(Number(elementId))
      if (amount > 0) {
        return { ...element, amount }
      } else {
        return []
      }
    })
  }

  manage(name: string): ManageStock<T> {
    return new StockManager<T>(this, this.lookup(name).id)
  }

  // nice to return an obj here but :/
  manageAll(): ManageStocks<T> {
    // return new WarehouseManager(this)
    const { add, remove, count } = this
    return { add, remove, count, list: () => this.elements }
  }

  get manager() { return this.manageAll() }

  private setAmount(name: string, amount: number): void {
    const element: T = this.lookup(name);
    this.storage[element.id] = amount;
  }
}
