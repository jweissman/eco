import { randomInteger } from "./randomInteger";

export function sample<T>(ts: T[]): T {
  let i = randomInteger(0,ts.length-1)
  return ts[i]; //randomInteger(0,ts.length-1)]

}
