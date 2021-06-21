import { ISequence } from "./types";

export class Sequence implements ISequence<number> {
  count = 0;
  get next(): number { return this.count++; }
}
