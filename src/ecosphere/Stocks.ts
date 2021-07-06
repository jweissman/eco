import { BasicEntity } from "./types/BasicEntity";
import { boundMethod } from 'autobind-decorator'
import { where } from "./utils/where";
import { isString } from "./utils/isString";
import { ManageStock, ManageStocks } from "./types";
import { Sequence } from "../collections";

class StockManager<T extends BasicEntity> implements ManageStock<T> {
  constructor(private stocks: Stocks<T>, private stockId: number) {}
  add(amount: number): void { return this.stocks.add(amount, this.name) }
  remove(amount: number): void { return this.stocks.remove(amount, this.name) }
  get list(): T[] { return this.stocks.list() }
  get count(): number { return this.stocks.count(this.name) }
  get name() { return this.item.name }
  get item(): T { return this.stocks.lookupById(this.stockId) }
}

export class Stocks<T extends BasicEntity> {
  private ids: Sequence = new Sequence()
  private storage: { [key: number]: number; } = {}

  constructor(
    public name: string,
    private elements: T[] = []
  ) { }

  @boundMethod
  list() { return this.elements }

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
    // const elementIds: number[] = this.list().map(({ id }) => id);
    const id = this.ids.next; //Math.max(0, ...elementIds) + 1;
    const theEntity: T = { id, name, ...attributes } as T
    this.list().push(theEntity);
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
    const amount = this.storage[element.id] || 0;
    return amount;
  }

  has(name: string): boolean {
    const matching = this.elements.find(where('name', name))
    return !!matching;
  }

  @boundMethod
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
    } else {
      return this.create(name).item
    }
  }

  get report(): (T & { amount: number })[] {
    const items: T[] = this.list()
    const table = items.flatMap((item: T) => {
      const id = Number(item.id)
      const amount = this.storage[id] || 0
      return { ...item, amount }
    })
    return table
  }

  manage(name: string): ManageStock<T> {
    return new StockManager<T>(this, this.lookup(name).id)
  }

  manageAll(): ManageStocks {
    const { add, remove, count } = this
    return { add, remove, count, list: () => this.elements }
  }

  get manager() { return this.manageAll() }

  private setAmount(name: string, amount: number): void {
    const element: T = this.lookup(name);
    this.storage[element.id] = amount;
  }
}
