/**
 * In the City, these are the rules:
 *   - Citizens have to hunt or fish (or trade) for food
 *   - Living fishes/animals go through a production pipeline to become edible:
 *      * Living creature
 *      * Fresh corpse
 *         [Butchered]
 *            Fresh meat/fish
 *            Make Kibble for domestic animals?
 *         [Dissected] Organs + blood
 *    - Citizens can make piano wire using guts (for pianos only, not assassinations... yet)
 *         
 */

import { Community } from "../ecosphere/Community";
import { Concept, theConcepts } from "../ecosphere/Dictionary";
import Westron from "../ecosphere/Languages/Westron";
import Model from "../ecosphere/Model";
import { ManageStocks, Person, Recipe, TimeEvolution } from "../ecosphere/types";
import { clamp } from "../ecosphere/utils/clamp";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { choose, sample } from "../ecosphere/utils/sample";

type Gender = 'male' | 'female'
const generateName = (gender: Gender) => {
  let suffices: Concept[] = gender === 'male'
    ? ['-person', '-man', '-son']
    : ['-woman', '-maid', '-daughter']

  let concepts: Concept[] = choose(randomInteger(1,2), theConcepts)
  let nameElements: Concept[] = [
    ...concepts,
    ...(randomInteger(0, 12) > 9 ? [sample(suffices)] : []),
  ]

  let dicts = [ Westron ] //Sindarin, Khuzdul, Westron, Common ]
  let name = sample(dicts).translate(...nameElements).trim()

  return name
}
  
type Activity = 'idle'
              | 'eat'
              | 'rest'
              | 'hunt'
              | 'fish'
              | 'gather'
              | 'vibe'
              | 'create'
type CitizenRole = 'Artisan' | 'Hunter' | 'Fisherman' | 'Merchant'

class City extends Model {
  folks: Community
  recipes: { [key in Activity]: Recipe }

  constructor() {
    super('Citadel');
    this.evolve(this.evolution)

    this.folks = this.people.create('Folks')
    const fish = this.folks.recipes.create({ name: 'Fish' })
    const hunt = this.folks.recipes.create({ name: 'Hunt' })
    const rest = this.folks.recipes.create({ name: 'Rest' })
    const eat  = this.folks.recipes.create({ name: 'Eat' })
    const vibe = this.folks.recipes.create({ name: 'Vibe' })
    const idle = this.folks.recipes.create({ name: 'Ready' })
    const gather = this.folks.recipes.create({ name: 'Gather' })
    const create = this.folks.recipes.create({ name: 'Art' })
    this.recipes = { fish, hunt, rest, eat, vibe, idle, gather, create };

    // this.resources.create('Meat')
    // this.resources.add(10, 'Meat')
    // this.resources.create('Fish')
    // this.resources.add(10, 'Fish')

    // this.items.create('The Masterpiece', { quality: 7 })
    const roles: CitizenRole[] = [ 'Hunter', 'Fisherman' ] //, 'Merchant']

    roles.forEach(role => this.actions.create({
      name: `New ${role}`,
      act: () => this.createCitizen(role)
    }))


    // this.policies.create({ name: 'Autonomous', manage: () => {});
    // this.policies.create({ name: 'Role-Directed', manage: () => {});
  }

  createCitizen = (role: CitizenRole) => {
    const gender: Gender = sample([ 'male', 'female' ])
    const name: string = generateName(gender)
    const individual = this.folks.create({ name })

    if (role === 'Artisan') {
      individual.traits.add(1, 'Artisan')
    } else if (role === 'Hunter') {
      individual.traits.add(1, 'Hunting')
    } else if (role === 'Fisherman') {
      individual.traits.add(1, 'Fishing')
    } else if (role === 'Merchant') {
      individual.traits.add(1, 'Trading')
    }

    individual.things.add(40, 'Energy')
    individual.things.add(100, 'Max Energy')
    individual.things.add(80, 'Satiety')
    individual.things.add(100, 'Max Satiety')
    individual.things.add(80, 'Joy')
    individual.things.add(100, 'Max Joy')

    individual.things.add(100, 'Shells')

    individual.meters = {
      'Energy': () => { return {
        value: individual.things.count('Energy'),
        max: individual.things.count('Max Energy'),
      }},
      'Satiety': () => { return {
        value: individual.things.count('Satiety'),
        max: individual.things.count('Max Satiety'),
      }},
      'Joy': () => { return {
        value: individual.things.count('Joy'),
        max: individual.things.count('Max Joy'),
      }}

      // '': () => { return { }}
    };
    // const { person, nameMeaning, recipes } = this.newPerson();
    // this.subject = person;
    // this.nameMeaning = nameMeaning;
    // this.recipes = recipes
  }

  evolution: TimeEvolution = ({ resources }, t) => {
    if (t % 25 === 0) {
      this.folks.list().forEach(individual => 
        this.evolveIndividual(individual, individual.things, t%250 === 0)
      )
    }
  }

  evolveIndividual = (individual: Person, resources: ManageStocks, switchJobs: boolean) => {
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

    const folks = this.folks //people.lookup('Self')
    const { eat, rest, idle, vibe, hunt, fish, gather } = this.recipes

    const assign = (task: Recipe) => {
      // console.log(`Assign ${task.name} to ${individual.name}`)
      folks.jobs.set(individual, task)
    }

    const currentTask = folks.jobs.get(individual) //this.subject)
    // if (currentTask)
    // console.log(`Current task is ${currentTask.name} for ${individual.name}`)

    if (currentTask === hunt || currentTask === fish) {
      // special tasks...
      if (randomInteger(0,100) <= 24) {
        if (currentTask === hunt) {
          resources.add(1 + randomInteger(2,5), 'Meat')
        } else if (currentTask === fish) {
          resources.add(randomInteger(0,2) + randomInteger(0,2), 'Fish')
        }
      }
    } else if (currentTask === gather) {
      if (randomInteger(0,100) <= 14) {
        resources.add(1 + randomInteger(2,3), 'Berry')
        // resources.add(0 + randomInteger(0,1), 'Meat')
        // resources.add(0 + randomInteger(0,1), 'Fish')
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
      const fishCount = resources.count('Fish')
      const meatCount = resources.count('Meat')
      const berryCount = resources.count('Berry')
      if (satiety < maxSatiety && fishCount > 0 && fishCount > meatCount) {
        resources.remove(1, 'Fish')
        // the individuals resources
        resources.add(25, 'Satiety')
      } else if (satiety < maxSatiety && meatCount > 0) {
        resources.remove(1, 'Meat')

        resources.add(randomInteger(12,20), 'Satiety')
      } else if (satiety < maxSatiety && berryCount > 0) {
        resources.remove(1, 'Berry')

        resources.add(randomInteger(7,10), 'Satiety')
      } else {
        assign(idle)
      }
    // } else {
      // try { self.work({ resources }) } catch (err) { console.warn(err)}
    }

    if (switchJobs || currentTask === idle) {
      const food = resources.count('Fish')
                 + resources.count('Meat')
                 + resources.count('Berry')

      if (energy < 10) { assign(rest) }
      else if (satiety < 10 && food > 0) { assign(eat) }
      else if (joy < 10) { assign(vibe) }
      else {
        // do your jobs
        // if (food < 10) {
         if (individual.traits.count('Hunting') > 0) {
           assign(hunt)
         } else if (individual.traits.count('Fishing') > 0) {
           assign(fish)
         }
        // } else {
        //   assign(idle)
        // }
      }
    }
  }
}

export default new City()
