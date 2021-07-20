import { randomInteger } from "./randomInteger";

export function sample<T>(ts: T[]): T {
  return ts[randomInteger(0,ts.length-1)]

}
