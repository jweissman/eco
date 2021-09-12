import { boundMethod } from "autobind-decorator";
import { Concept, theConcepts } from "../ecosphere/Dictionary";
import Model from "../ecosphere/Model";
import { createMoiety, createPerson, Memory, Person } from "../ecosphere/types";
import { capitalize } from "../ecosphere/utils/capitalize";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { choose, sample } from "../ecosphere/utils/sample";
import { Aelvic } from "./Languages/Sindarin";

const generatePerson = () => {
  const moiety = createMoiety('A Social Group')
  const gender = sample(['male', 'female'])
  let suffix: Concept = gender === 'male' ? '-man' : '-woman'
  let concepts = choose(randomInteger(1,2), theConcepts)
  let nameElements = [
    ...concepts,
    suffix,
  ]
  let name = Aelvic.translate(...nameElements) //choose //(2, theConcepts))
  // const firstName = sample(gender === 'male' ? [ 'Sam', 'Eric', 'Ted', 'Jones' ] : ['Sarah', 'Edna', 'Terri', 'Rosa'])
  // const lastName = sample(['Smith', 'Lever', 'Token', 'Switch', 'Agent', 'Op'])
  const significance = (concepts.map(n => capitalize(n)).reverse().join('-')); //.replaceAll('-', ''));

  const person = createPerson(
    name + ' (' +  significance + ')',
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

    this.resources.create('Happiness')
    this.resources.create('Money')
    // this.resources.create('Money')

    this.actions.create({ name: 'New', act: () => {
      this.subject = generatePerson() 
    }})

    this.evolve(this.evolution)
  }

  @boundMethod
  evolution() {}

  metrics = { age: () => this.subject.age, }
  notes = {
    'current date': () => this.date.description,
    'name': () => this.subject.name,
    'agility': () => this.subject.body.agility,
    'beauty': () => this.subject.soul.beauty,
    'cunning': () => this.subject.body.cunning,
    'depth': () => this.subject.mind.depth,
    'education': () => this.subject.mind.education,
    'empathy': () => this.subject.soul.empathy,
    'insight': () => this.subject.mind.insight,
    'integrity': () => this.subject.soul.integrity,
    'spirit': () => this.subject.body.spirit,
    'strength': () => this.subject.body.strength,
    'wit': () => this.subject.soul.wit,
    'knowledge': () => this.subject.kind.knowledge,
    'power': () => this.subject.kind.power,
    'sophistication': () => this.subject.kind.sophistication,
    'wealth': () => this.subject.kind.wealth,
    'bio': () => this.subject.memory.list().map(this.describeMemory).join('... '),
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
