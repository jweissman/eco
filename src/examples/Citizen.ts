import { Concept, theConcepts } from "../ecosphere/Dictionary";
import Model from "../ecosphere/Model";
import { attributes, createMoiety, createPerson, judge, ManageStocks, Memory, MentalAttribute, Person, PhysicalAttribute, Recipe, SocialAttribute, SpiritualAttribute, TimeEvolution } from "../ecosphere/types";
import { capitalize } from "../ecosphere/utils/capitalize";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { choose, sample } from "../ecosphere/utils/sample";
import Khuzdul from "../ecosphere/Languages/Khuzdul";
import { Sindarin } from "../ecosphere/Languages/Sindarin";
import Westron from "../ecosphere/Languages/Westron";
import Common from "../ecosphere/Languages/Common";
import { clamp } from "../ecosphere/utils/clamp";

// todo behavior model for citizens...
// class Citizenship { }

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
  
  let dicts = [ Sindarin, Khuzdul, Westron, Common ]
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
  return { person, nameMeaning: significance }
}

type CitizenTask = 'idle' | 'eat' | 'rest' | 'hunt' | 'fish'
class Citizen extends Model {
  subject: Person
  nameMeaning: string
  recipes: { [key in CitizenTask]: Recipe }

  newPerson = (): { person: Person, nameMeaning: string, recipes: { [key in CitizenTask]: Recipe } } => {
    const { person, nameMeaning } = generatePerson() 
    let self = this.people.lookup('Self')
    self.remove(self.count)
    const individual = self.create(person)
    individual.meters = {
      'Energy': () => { return {
        value: this.resources.count('Energy'),
        max: this.resources.count('Max Energy'),
      }},
      'Satiety': () => { return {
        value: this.resources.count('Satiety'),
        max: this.resources.count('Max Satiety'),
      }},
      'Joy': () => { return {
        value: this.resources.count('Joy'),
        max: this.resources.count('Max Joy'),
      }}
    }
    // this.subject = person
    // this.nameMeaning = nameMeaning;
    const fish = self.recipes.create({ name: 'Fish' })
    const hunt = self.recipes.create({ name: 'Hunt' })
    const rest = self.recipes.create({ name: 'Rest' })
    const eat = self.recipes.create({ name: 'Eat' })
    const idle = self.recipes.create({ name: 'Vibe' })
    
    return {
      person: individual,
      nameMeaning,
      recipes: { fish, hunt, rest, eat, idle }
    }
  }

  // metrics = { 'energy': () => { return { value: 1, max: 1 }} }

  constructor() {
    super('Citizen');
    this.evolve(this.evolution)
    this.people.create('Self')
    // this.people.create('Friends')
    // this.people.create('Rivals')
    // this.people.create('Peers')
    // this.people.create('Family')

    this.resources.create('Energy')
    this.resources.add(40, 'Energy')
    this.resources.create('Max Energy')
    this.resources.add(100, 'Max Energy')

    this.resources.create('Satiety')
    this.resources.add(80, 'Satiety')
    this.resources.create('Max Satiety')
    this.resources.add(100, 'Max Satiety')

    this.resources.create('Joy')
    this.resources.add(80, 'Joy')
    this.resources.create('Max Joy')
    this.resources.add(100, 'Max Joy')

    const { person, nameMeaning, recipes } = this.newPerson() 
    this.nameMeaning = nameMeaning
    this.subject = person
    this.recipes = recipes
    
    this.actions.create({ name: 'New', act: () => {
      const { person, nameMeaning, recipes } = this.newPerson();
      this.subject = person;
      this.nameMeaning = nameMeaning;
      this.recipes = recipes
    }})
  }

  // @boundMethod
  evolution: TimeEvolution = ({ resources }, t) => {
    // this.subject.body

    
    if (t % 25 === 0) {
      this.evolveIndividual(resources, t%250 === 0)
      }
  }

  evolveIndividual = (resources: ManageStocks, switchJobs: boolean) => {
    const energy = resources.count('Energy')
    const maxEnergy = resources.count('Max Energy')
    if (energy > maxEnergy) { resources.remove(energy - maxEnergy, 'Energy')}
    if (energy > 0) {
      resources.remove(3, 'Energy')
    }

    const satiety = resources.count('Satiety')
    const maxSatiety = resources.count('Max Satiety')
    if (satiety > maxSatiety) { resources.remove(satiety - maxSatiety, 'Satiety')}
    if (satiety > 0) {
      resources.remove(2, 'Satiety')
    }

    const joy = resources.count('Joy')
    const maxJoy = resources.count('Max Joy')
    if (joy > maxJoy) { resources.remove(joy - maxJoy, 'Joy')}
    if (joy > 0) {
      resources.remove(1, 'Joy')
    }


    
    const self = this.people.lookup('Self')
    const { eat, rest, idle, hunt, fish } = this.recipes
    const assign = (task: Recipe) =>
      self.jobs.set(this.subject, task)

    const currentTask = self.jobs.get(this.subject)
    if (currentTask === hunt || currentTask === fish) {
      // special tasks...
      if (randomInteger(0,100) <= 24) {
        if (currentTask === hunt) {
          resources.add(1 + randomInteger(2,5), 'Meat')
        } else if (currentTask === fish) {
          resources.add(randomInteger(0,2) + randomInteger(0,2), 'Fish')
        }
      }
    } else if (currentTask === rest) {
      if (energy < maxEnergy) {
        resources.add(clamp(randomInteger(4,18),0,maxEnergy-energy), 'Energy')
      } else {
        assign(idle)
      }
    } else if (currentTask === idle) {
      if (joy < maxJoy) {
        resources.add(clamp(2+randomInteger(2,7),0,maxEnergy-energy), 'Joy')
      }
    } else if (currentTask === eat) {
      const fishCount = this.resources.count('Fish')
      const meatCount = this.resources.count('Meat')
      if (satiety < maxSatiety && fishCount > 0 && fishCount > meatCount) {
        resources.remove(1, 'Fish')
        resources.add(25, 'Satiety')
      } else if (satiety < maxSatiety && meatCount > 0) {
        resources.remove(1, 'Meat')
        resources.add(randomInteger(5,20), 'Satiety')
      } else {
        assign(idle)
      }
    // } else {
      // try { self.work({ resources }) } catch (err) { console.warn(err)}
    }

    if (switchJobs || currentTask === idle) {
      const food = resources.count('Fish')
        + resources.count('Meat')

      // if (this.subject.jobs)
      // this.subject.
      // this.subject.work({ resources })

      if (energy > 0 && satiety > 0 && food < 2) {
        assign(sample([hunt, fish]))
      } else if (energy < 10) {
        assign(rest)
      } else if (satiety < 10) {
        assign(eat)
      } else if (joy < 10) {
        assign(idle)
      } else {
        if (energy < 68) {
          assign(rest)
        } else if (satiety < 75) {
          assign(eat)
        } else {
          assign(idle)
        }

      }
    }

  }

  displayAttribute = (value: string): string => {
    const val = capitalize(value)
    // let value = this.subject
    // && this.subject.soul[attr as unknown as SpiritualAttribute]
    if (judge(value as any) === 'excellent') return `*${val}`
    if (judge(value as any) === 'adequate') return `~${val}`
    if (judge(value as any) === 'terrible') return `%${val}`
    return val
  }

  get attributeNames() {
    const { spiritual, social, physical, mental } = attributes
    return [
      // attributes.spiritual
      spiritual, social, physical, mental
    ].map(Object.keys)
  }

  // metrics = { age: () => this.subject.age, }
  notes = {
    // 'current date': () => this.date.description,
    '*name': () => this.subject.name,
    'role': () => capitalize(this.subject.role),
    // ...

    // ...
    ...Object.fromEntries(
      Object.keys(attributes.spiritual).sort().map((attr: string) => {
        return [ attr, () => { 
          let value = this.subject
                 && this.subject.soul[attr as unknown as SpiritualAttribute]
          return this.displayAttribute(value)
        }]
      })
    ),

    ...Object.fromEntries(
      Object.keys(attributes.social).sort().map((attr: string) => {
        return [ attr, () => { 
          let value = this.subject
                 && this.subject.kind[attr as unknown as SocialAttribute]
          return this.displayAttribute(value)
        }]
      })
    ),
    ...Object.fromEntries(
      Object.keys(attributes.mental).sort().map((attr: string) => {
        return [ attr, () => { 
          let value = this.subject
                 && this.subject.mind[attr as unknown as MentalAttribute]
          return this.displayAttribute(value); //[ value, value && judge(value) ].join(' - ')
        }]
      })
    ),
    ...Object.fromEntries(
      Object.keys(attributes.physical).map((attr: string) => {
        return [ attr, () => { 
          let value = this.subject
                 && this.subject.body[attr as unknown as PhysicalAttribute]
          return this.displayAttribute(value)
        }]
      })
    ),
    // [this.subject.name]: () => this.nameMeaning,
    // 'agility': () => this.subject.body.agility,
    // 'beauty': () => this.subject.soul.beauty,
    // 'charm': () => this.subject.soul.charm,
    // 'cunning': () => this.subject.body.cunning,
    // 'depth': () => this.subject.mind.depth,
    // 'education': () => this.subject.mind.education,
    // 'empathy': () => this.subject.soul.empathy,
    // 'guile': () => this.subject.body.guile,
    // 'insight': () => this.subject.mind.insight,
    // 'integrity': () => this.subject.soul.integrity,
    // 'knowledge': () => this.subject.kind.knowledge,
    // 'power': () => this.subject.kind.power,
    // 'personality': () => this.subject.mind.personality,
    // 'resolve': () => this.subject.soul.resolve,
    // 'sophistication': () => this.subject.kind.sophistication,
    // 'spirit': () => this.subject.body.spirit,
    // 'strength': () => this.subject.body.strength,
    // // 'tech': () => this.subject.kind.tech,
    // 'valor': () => this.subject.mind.valor,
    // 'wealth': () => this.subject.kind.wealth,
    // 'wit': () => this.subject.soul.wit,
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
