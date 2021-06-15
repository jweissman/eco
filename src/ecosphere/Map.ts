import { BasicEntity } from "./types/BasicEntity";

export interface IMap<K,V> {
  set(k: K, v: V): void
  get(k: K): V
}

export class Map<K extends BasicEntity, V> implements IMap<K, V> {
  _data: { [id: number]: V; } = {};
  constructor(
    private idFor: (k: K) => number,
    private lookup: (id: number) => K
  ) { }
  set(k: K, v: V) { this._data[this.idFor(k)] = v; }
  get(k: K): V { return this._data[this.idFor(k)]; }
  get report() {
    const namesAndValues = Object.entries(this._data)
                                 .map(([k, v]) => [this.lookup(Number(k)).name, v])
    return Object.fromEntries(namesAndValues)
  }
}
