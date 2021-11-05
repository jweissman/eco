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

// import { clamp } from "three/src/math/MathUtils"
import { Community } from "../../ecosphere/Community"
import { Concept, theConcepts } from "../../ecosphere/Dictionary"
import Westron from "../../ecosphere/Languages/Westron"
import Model from "../../ecosphere/Model"
import { Recipe, TimeEvolution, Person, ManageStocks } from "../../ecosphere/types"
import { randomInteger } from "../../ecosphere/utils/randomInteger"
import { choose, sample } from "../../ecosphere/utils/sample"

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

// type EventKind = 'ate'
// type Event = { id: number, name: string, description: string, at: number, kind: EventKind }
class City extends Model {

  // could split into 'houses'??
  folks: Community
  recipes: { [key in Activity]: Recipe }
  notes = { ticks: () => String(this.ticks), date: () => this.date.description }

  constructor() {
    super('Citadel');
    this.evolve(this.evolution)

    this.folks = this.people.create('Folks')
    // todo create houses?

    const fish   = this.folks.recipes.create({ name: 'Fish', time: 500 })
    const hunt   = this.folks.recipes.create({ name: 'Hunt', time: 240 })
    const rest   = this.folks.recipes.create({ name: 'Rest', time: 2000  })
    const eat    = this.folks.recipes.create({ name: 'Eat', time: 200 })
    const vibe   = this.folks.recipes.create({ name: 'Vibe', time: 777 })
    const idle   = this.folks.recipes.create({ name: 'Ready', time: 10 })
    const gather = this.folks.recipes.create({ name: 'Gather', time: 1234 })
    const create = this.folks.recipes.create({ name: 'Art', time: 5000 })

    this.recipes = { fish, hunt, rest, eat, vibe, idle, gather, create };

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

    individual.meters = () => {
      const job = this.folks.jobs.get(individual)
      return {
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
      }},
      ...(job !== undefined && {[job.recipe.name]: () => {
        // if (job !== undefined) {
        const { recipe, startedAt } = job
        const { time: jobDuration } = recipe
        const elapsed = startedAt ? this.ticks - startedAt : -1
        return {
          value: elapsed,
          max: jobDuration,
        };
      // } else { return { value: 0, max: 0 } } 
      }})

    }};

    // individual.events
    // const { person, nameMeaning, recipes } = this.newPerson();
    // this.subject = person;
    // this.nameMeaning = nameMeaning;
    // this.recipes = recipes
  }

  ticksPerHour = 60

  evolution: TimeEvolution = ({ resources }, t) => {
    // ... sharpen
    // const ticksPerDay = 60 * (60 * 60 * 24)
    // const ticksPerHour = (60) // * 60)
    // how long is day
    if (t % this.ticksPerHour === 0) { // how many of these
      this.folks.list().forEach(individual => 
        this.evolveIndividual(individual, individual.things) //, t%(this.ticksPerHour*6)===0) 
        // t%ticksPerHour === 0)
      )
    }
  }

  // ~ 4 food / week
  // ticks are 'an hour'
  evolveIndividual = (individual: Person, resources: ManageStocks) => {
    // const consumptionBaseRate = {
    //   foodPerDay: 24,
    // }

    const produce = {
      fish: 5,
      meat: 8,
      berry: 12,
    };

    // const fishPerHour = productionBaseRates.fishPerDay / 24
    // const meatPerHour = productionBaseRates.meatPerDay / 24
    // const berryPerHour = productionBaseRates.berryPerDay / 24

    // const foodPerHour = consumptionBaseRate.foodPerDay / 24

    const energy = resources.count('Energy')
    const maxEnergy = resources.count('Max Energy')
    if (energy > maxEnergy) { resources.remove(energy - maxEnergy, 'Energy')}
    if (energy > 0) {
      resources.remove(0.5, 'Energy')
    }

    const satiety = resources.count('Satiety')
    const maxSatiety = resources.count('Max Satiety')
    if (satiety > maxSatiety) { resources.remove(satiety - maxSatiety, 'Satiety')}
    if (satiety > 0) {
      resources.remove(0.25, 'Satiety')
    }

    const joy = resources.count('Joy')
    const maxJoy = resources.count('Max Joy')
    if (joy > maxJoy) { resources.remove(joy - maxJoy, 'Joy')}
    if (joy > 0) {
      resources.remove(0.1, 'Joy')
    }

    const folks = this.folks //people.lookup('Self')
    const { eat, rest, idle, vibe, hunt, fish, gather } = this.recipes

    const assign = (task: Recipe) => {
      folks.jobs.set(individual, { recipe: task, startedAt: this.ticks })
    }

    const job = folks.jobs.get(individual)
    // let idle = false
    let completedJob = false //, failedJob = false
    if (job) {
      const { recipe: currentTask, startedAt } = job
      let produceJobRewards = false

      let elapsed = startedAt ? this.ticks - startedAt : -1
      let { time, probability } = currentTask

      // console.log({ job, elapsed, time, ticks: this.ticks })

      if (time === undefined) {
        completedJob = true
        produceJobRewards = true
      } else {
        if (elapsed > time) {
          completedJob = true
          if (probability === undefined) { produceJobRewards = true }
          else {
            produceJobRewards = randomInteger(0,100) <= probability * 100
          }
        }
      }

      if (produceJobRewards) {
        if (currentTask === hunt) {
          resources.add(randomInteger(0,produce.meat), 'Meat')
        } else if (currentTask === fish) {
          resources.add(randomInteger(0,produce.fish), 'Fish')
        } else if (currentTask === gather) {
          resources.add(1+randomInteger(0,produce.berry), 'Berry')
        } else if (currentTask === rest) {
          if (energy < maxEnergy) {
            resources.add(
              75, //clamp(1+randomInteger(5,25),0,maxEnergy-energy),
              'Energy')
          }
        } else if (currentTask === vibe) {
          if (joy < maxJoy) {
            resources.add(
              35, //clamp(1+randomInteger(15,35),0,maxEnergy-energy),
              'Joy'
            )
          }
        } else if (currentTask === eat) {
          if (satiety < maxSatiety * 0.8) {
            const fishCount = resources.count('Fish')
            const meatCount = resources.count('Meat')
            const berryCount = resources.count('Berry')
  
            if (fishCount > 0) {
              resources.remove(1, 'Fish')
              resources.add(25, 'Satiety')
            } else if (meatCount > 0) {
              resources.remove(1, 'Meat')
              resources.add(25, 'Satiety')
            } else if (berryCount > 0) {
              resources.remove(1, 'Berry')
              resources.add(15, 'Satiety')
            } else {
              console.warn("hungry but no food!")
            }
          }
        } 
      }
    }


      if (job === undefined) { //job === undefined || job.recipe.name === 'Ready') { //} || currentTask === idle) {
        const meatCount = resources.count('Meat')
        const fishCount = resources.count('Fish')
        const food = fishCount //resources.count('Fish')
                   + meatCount //resources.count('Meat')
                   + resources.count('Berry')
        
        const shells = resources.count('Shell')

        if (energy < 10) { assign(rest) }
        else if (satiety < 10 && food > 0) { assign(eat) }
        else if (joy < 10) { assign(vibe) }
        else {
          // do your jobs
          if (food < 12) {
           if (individual.traits.count('Hunting') > 0) {
             assign(hunt)
           } else if (individual.traits.count('Fishing') > 0) {
             assign(fish)
           }
          } else {

            // if (energy < 100) { assign(rest) }
            if (satiety < 70 && food > 0) { assign(eat) }
            else if (joy < 70) { assign(vibe) }
            else {
              // do other actions -- could check surplus/deficit
              // if i have not enough food, trade shells for food?
              if (food < 4) {
                // trade shells for food
                if (shells > 10 && this.resources.count('Meat') > 0) {
                  this.resources.remove(1, 'Meat')
                  resources.add(1, 'Meat')
                  resources.remove(10, 'Shells')
                } else if (shells > 6 && this.resources.count('Fish') > 0) {
                  this.resources.remove(1, 'Fish')
                  resources.add(1, 'Fish')
                  resources.remove(6, 'Shells')
                }
              }
              // // if i have too much food, trade food for shells?
              if (meatCount > 8) {
                // trade food for shell
                this.resources.add(1, 'Meat')
                resources.remove(1, 'Meat')
                resources.add(10, 'Shells')
              }
              if (fishCount > 10) {
                // trade food for shell
                this.resources.add(1, 'Fish')
                resources.remove(1, 'Fish')
                resources.add(6, 'Shells')
              }

              if (energy < 70) { assign(rest) }
              else { assign(idle) }
            }
          }
        }
      }

      if (completedJob) { this.folks.jobs.set(individual, undefined as any) }

      // if (completedJob) { assign(idle) }
    }
  // }
  
  get date() {
    // let time = this.ticks || 0

    // let minutes = Math.floor(this.ticks / 60)
    let hours = Math.floor(this.ticks / 60) //this.ticks / 60)

    // let secondInterval = 0.1;
    // let seconds = Math.floor(time / secondInterval);

    // let second = seconds / 60 //%60
    // let minute = Math.floor(seconds/60)%60
    let minute = 0 // Math.floor(minutes)
    let hour = Math.floor(hours) //Math.floor(seconds/(60*60))%24
    let day = Math.floor(hour/24); //Math.floor(seconds / (60 * 60 * 24));
    // let week = Math.floor(seconds / (60 * 60 * 24 * 7));
    // let month = Math.floor(seconds / (60 * 60 * 24 * 7 * 4));
    // let year = Math.floor(seconds / (60 * 60 * 24 * 365));

    let dayOfWeek = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'][day % 7];

    return {
      dayOfWeek,
      description: `${dayOfWeek} ${String(Math.floor(hour)%24).padStart(2,'0')}:${String(Math.floor(minute)%60).padStart(2,'0')}`
    }
  }
}

export default new City()
