import { IMap } from "./types";
export class Map<K, V> implements IMap<K, V> {
  _data: { [id: number]: V; } = {};
  constructor(
    private idFor: (k: K) => number,
    private nameFor: (k: K) => string,
    private lookup: (id: number) => K,
  ) { }
  set(k: K, v: V) { this._data[this.idFor(k)] = v; }
  get(k: K): V { return this._data[this.idFor(k)]; }
  get report(): { [name: string]: V } {
    const namesAndValues = Object.entries(this._data)
      .map(([k, v]) => [this.nameFor(this.lookup(Number(k))), v]);
    return Object.fromEntries(namesAndValues);
  }
}
