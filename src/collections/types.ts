export interface IList<T> {
  first: T
  last: T
  count: number
}

export interface IMap<K,V> {
  set(k: K, v: V): void
  get(k: K): V
}
