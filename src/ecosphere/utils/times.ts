
export function times(n: number, fn: Function) {
  let results: any[] = []
  for (let i = 0; i < n; i++) { results.push(fn()) }
  return results
}
