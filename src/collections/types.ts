export interface IList<T> {
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
