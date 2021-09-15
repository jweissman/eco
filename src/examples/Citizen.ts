import { boundMethod } from "autobind-decorator";
import { Concept, theConcepts } from "../ecosphere/Dictionary";
import Model from "../ecosphere/Model";
import { createMoiety, createPerson, Memory, Person } from "../ecosphere/types";
import { capitalize } from "../ecosphere/utils/capitalize";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { choose, sample } from "../ecosphere/utils/sample";
import Khuzdul from "./Languages/Khuzdul";
import { Aelvic } from "./Languages/Sindarin";
import Westron from "./Languages/Westron";

const generatePerson = () => {
  const moiety = createMoiety('A Social Group')
  const gender = sample(['male', 'female'])
  let suffices: Concept[] = gender === 'male'
    ? ['-person', '-man', '-son']
    : ['-woman', '-maid', '-daughter']
  let concepts: Concept[] = choose(randomInteger(1,2), theConcepts)
  let nameElements: Concept[] = [
    ...concepts,
    ...(randomInteger(0, 12) > 9 ? [sample(suffices)] : []),
  ]
  
  let dicts = [ Aelvic, Khuzdul, Westron ]
  let name = sample(dicts).translate(...nameElements).trim()
  // const firstName = sample(gender === 'male' ? [ 'Sam', 'Eric', 'Ted', 'Jones' ] : ['Sarah', 'Edna', 'Terri', 'Rosa'])
  // const lastName = sample(['Smith', 'Lever', 'Token', 'Switch', 'Agent', 'Op'])
  const significance = (concepts.map(n => capitalize(n)).reverse().join('-')).trim(); //.replaceAll('-', ''));

  const person = createPerson(
    (name === significance
      ? name
      : name + ' (' +  significance + ')'),
    moiety
    )
  return person
}
class Citizen extends Model {
  subject: Person = generatePerson()

  constructor() {
    super('Citizen');

    // this.people.create('Friends')
    // this.people.create('Rivals')
    // this.people.create('Peers')
    // this.people.create('Family')

    // this.resources.create('Happiness')
    // this.resources.create('Money')
    // this.resources.create('Money')

    this.actions.create({ name: 'New', act: () => {
      this.subject = generatePerson() 
    }})

    this.evolve(this.evolution)
  }

  @boundMethod
  evolution() {}

  // metrics = { age: () => this.subject.age, }
  notes = {
    'current date': () => this.date.description,
    'name': () => this.subject.name,
    'agility': () => this.subject.body.agility,
    'beauty': () => this.subject.soul.beauty,
    'charm': () => this.subject.soul.charm,
    'cunning': () => this.subject.body.cunning,
    'depth': () => this.subject.mind.depth,
    'education': () => this.subject.mind.education,
    'empathy': () => this.subject.soul.empathy,
    'guile': () => this.subject.body.guile,
    'insight': () => this.subject.mind.insight,
    'integrity': () => this.subject.soul.integrity,
    'knowledge': () => this.subject.kind.knowledge,
    'power': () => this.subject.kind.power,
    'personality': () => this.subject.mind.personality,
    'resolve': () => this.subject.soul.resolve,
    'sophistication': () => this.subject.kind.sophistication,
    'spirit': () => this.subject.body.spirit,
    'strength': () => this.subject.body.strength,
    'tech': () => this.subject.kind.tech,
    'valor': () => this.subject.mind.valor,
    'wealth': () => this.subject.kind.wealth,
    'wit': () => this.subject.soul.wit,
    // 'bio': () => this.subject.memory.list().map(this.describeMemory).join('... '),
  }

  describeMemory(memory: Memory) {
    return `I remember ${memory.description}`
  }

  // @boundMethod
  get date() {
    let time = this.ticks || 0
    let secondInterval = 0.1;
    let seconds = Math.floor(time / secondInterval);

    let second = seconds%60
    let minute = Math.floor(seconds/60)%60
    let hour = Math.floor(seconds/(60*60))%24
    let day = Math.floor(seconds / (60 * 60 * 24));
    // let week = Math.floor(seconds / (60 * 60 * 24 * 7));
    // let month = Math.floor(seconds / (60 * 60 * 24 * 7 * 4));
    // let year = Math.floor(seconds / (60 * 60 * 24 * 365));

    let dayOfWeek = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'][day % 7];

    return {
      dayOfWeek,
      description: `${dayOfWeek} ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}`
    }
  }
}

export default new Citizen();
