
export function times<T>(n: number, fn: (...args: any) => T): T[] {
  let results: any[] = []
  for (let i = 0; i < n; i++) { results.push(fn()) }
  return results
}
