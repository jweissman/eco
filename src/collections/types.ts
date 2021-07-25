export interface IList<T> {
  map<U>(fn: (it: T) => any): U[];
  first: T
  last: T
  count: number
  add: (item: T) => void
  remove: (item: T) => void
}

export interface IMap<K,V> {
  set(k: K, v: V): void
  get(k: K): V
}

export interface ISequence<T> { next: T }
