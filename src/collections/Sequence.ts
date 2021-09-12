import { boundMethod } from "autobind-decorator";
import { MarkovGenerator } from "../ecosphere/utils/MarkovGenerator";
import { replicate } from "../ecosphere/utils/replicate";
import { ISequence } from "./types";

export class Sequence implements ISequence<number> {
  count = 0;
  get next(): number { return this.count++; }
}

// give a infinite list of distinct string names from
// the alphabet with trailing single-quotes ('prime')
// giving A, B, C,..., Y, Z then A', B', C', ... A'', B'', C'' ....
export class NameSequence implements ISequence<String> {
  // next: string;
  private nameRoots = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z',
    //'a', 'b', 'c', 'd', 'e'
  ]
  private nameCount = new Sequence()
  get next() {
    let n = this.nameCount.next
    return this.nameRoots[n % this.nameRoots.length]
         + (replicate(["'"], n).join(''))
  }
}

export abstract class StringGeneratorSequence implements ISequence<string> {
  baseItems: string[] = []
  generatedItems: string[] = []
  abstract generate(): string 
  get next(): string {
    let result = this.generate()
    let attempts = 0

    while (
      (
        this.baseItems.includes(result)
        || this.generatedItems.includes(result)
      )
      && attempts++ < 100
    ) {
      result = this.generate()
    }
    this.generatedItems.push(result)
    return result
  }
}

export class MarkovSequence
     extends StringGeneratorSequence
  implements ISequence<string> {
  generator: MarkovGenerator
  constructor(private items: string[], order = 2, max = 10) {
    super()
    this.generator = new MarkovGenerator(order, max)
    this.items.forEach(this.feed)
  }

  @boundMethod
  feed(it: string) {
    this.baseItems.push(it);
    this.generator.feed(it);
  }

  generate(): string { return this.generator.generate(); }
}
