import { randomInteger } from "./randomInteger";
import { times } from "./times";

function sample<T>(ts: T[]): T {
  let i = randomInteger(0,ts.length-1)
  return ts[i];
}

function choose<T>(n: number, ts: T[]): T[] {
  return times(n, () => sample(ts))
}

export { sample, choose }
