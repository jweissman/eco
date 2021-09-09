// todo but -- instead of simple markov we should be able to generate a sensible language
// (goals are: generate a few verb cores + basic vocab; translating significant names; assemble a few full sentences)

import { Model } from "../ecosphere/Model"
import { sample } from "../ecosphere/utils/sample"
import { times } from "../ecosphere/utils/times"

// language families: Aelvenic -- Dwarvic -- Celestial/Infernal --

// mostly just care about generating 'kernels' of words..?
type Kernel = string
const kernels = [
  'ae', 'b', 'ch', 'd',
  'f', 'g', 'j', 'k', 'l', 'll', 'm',
  'n', 'p', 'r', 's', 'sh', 't', 'th',
  'oo', 'uh', 'v', 'w', 'z', 'zh'
]
type Root = Kernel[]
const verb = (): Root => {
  const root: Kernel[] = times(3, () => sample(kernels))
  return root
}


const vowels = [
  'a', 'ai', 'au', 'e', 'ei', 'i', 'o', 'ou', 'u', 'y', 'uy' ]

// type Category = 'person' | 'number' | 'tense' | 'aspect'
// type Person = 'zeroth' | 'first' | 'second' | 'third'
type Inflection = string 
type NumberInflection = { singular: Inflection, plural: Inflection }
type Conjugations = {
  infinitive: Inflection,
  person: {
    first: NumberInflection,
    second: NumberInflection,
    third: NumberInflection
  } //, first: Inflection, second: Inflection, third: Inflection },
}

// type Verb = Map<Root, Conjugations>

const conjugate = (
  root: Root,
  // person: Person,
  // number: 'one' | 'many',
  // tense: 'past' | 'present' | 'future',
  // aspect
): Conjugations => {
  // const reductions = { 'uh': "'", 'll': 'y', 'oo': 'u', 'ae': 'a' }
  // map over reductions
  // root.map(kernel => {
  //   return kernel === 'uh' ? "'" : 'u'
  // })
  // root.join()
  const inflect = () => root.reduce((acc, kernel) => {
        return [ acc, kernel ].join(sample(vowels))
      })
  const conjugations: Conjugations = {
    infinitive: inflect(),
    person: {
      first: { singular: inflect(), plural: inflect() },
      second: { singular: inflect(), plural: inflect() },
      third: { singular: inflect(), plural: inflect() }
      // second: inflect(),
      // third: inflect()
    }
  }
  return conjugations
}

type Verb = 'read' | 'write'
export class Language extends Model {
  verbs = {
    read: verb(),
    write: verb(),
  }
  vocabulary = {
    writing: conjugate(this.verbs.write)
  }
  // write = verb()
  writing = conjugate(this.verbs.write)

  notes = {
    // '[no one] writes': () => this.writing.person.zero,
    'To write (infinitive)': () => this.writing.infinitive,
    'I write': () => this.writing.person.first.singular,
    'You write': () => this.writing.person.second.singular,
    'He/she/it writes': () => this.writing.person.third.singular,
    'We write': () => this.writing.person.first.plural,
    'You all write': () => this.writing.person.second.plural,
    'They write': () => this.writing.person.third.plural,
  }

  //present = (verb: string) => {
  //  'To write (infinitive)': () => this.writing.infinitive,
  //  'I write': () => this.writing.person.first.singular,
  //  'You write': () => this.writing.person.second.singular,
  //  'He/she/it writes': () => this.writing.person.third.singular,
  //  'We write': () => this.writing.person.first.plural,
  //  'You all write': () => this.writing.person.second.plural,
  //  'They write': () => this.writing.person.third.plural,
  //}
}
