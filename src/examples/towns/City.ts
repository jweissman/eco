import { Community } from "../../ecosphere/Community"
import { Concept, theConcepts } from "../../ecosphere/Dictionary"
import Westron from "../../ecosphere/Languages/Westron"
import Model from "../../ecosphere/Model"
import { Recipe, TimeEvolution, Person, ManageStocks } from "../../ecosphere/types"
import { any } from "../../ecosphere/utils/any"
import { capitalize } from "../../ecosphere/utils/capitalize"
// import { capitalize } from "../../ecosphere/utils/capitalize"
import ordinate from "../../ecosphere/utils/ordinate"
import { randomInteger } from "../../ecosphere/utils/randomInteger"
import { choose, sample } from "../../ecosphere/utils/sample"

type Gender = 'male' | 'female'
function generateName(gender: Gender): { name: string, concepts: Concept[] } {
  let suffices: Concept[] = gender === 'male'
    ? ['-person', '-man', '-son']
    : ['-woman', '-maid', '-daughter']

  let concepts: Concept[] = choose(randomInteger(1,3), theConcepts)
  let nameElements: Concept[] = [
    ...concepts,
    ...(randomInteger(0, 12) > 9 ? [sample(suffices)] : []),
  ]

  let dicts = [ Westron ] //Sindarin, Khuzdul, Westron, Common ]
  let name = sample(dicts).translate(...nameElements).trim()

  // const significance = (concepts.map(n => capitalize(n)).reverse().join('-')).trim(); //.replaceAll('-', ''));

  // let nameWithMeaning = (name === significance
  //   ? name
  //   : name + ' (' +  significance + ')')

  return { name, concepts } //significance } //nameWithMeaning
}
  
type Activity = 'idle'
              | 'eat'
              | 'rest'
              | 'hunt'
              | 'fish'
              | 'gather'
              | 'vibe'
              | 'trade'
              | 'create'

type CitizenRole = 'Artisan' | 'Hunter' | 'Fisherman' | 'Merchant'

class City extends Model {
  folks: Community
  recipes: { [key in Activity]: Recipe }
  notes = {
    date: () => this.date.description,
    time: () => this.date.time,
  }
  ticksPerMinute = 10

  constructor() {
    super('Citadel');
    this.evolve(this.evolution)

    this.folks = this.people.create('Folks')

    const fish   = this.folks.recipes.create({ name: 'Fish', time: 500, probability: 0.45 })
    const hunt   = this.folks.recipes.create({ name: 'Hunt', time: 240, probability: 0.52 })
    const rest   = this.folks.recipes.create({ name: 'Rest', time: 2000  })
    const eat    = this.folks.recipes.create({ name: 'Eat', time: 200 })
    const vibe   = this.folks.recipes.create({ name: 'Vibe', time: 777 })
    const idle   = this.folks.recipes.create({ name: 'Ready', time: 180 })
    const gather = this.folks.recipes.create({ name: 'Gather', time: 1234 })
    const trade  = this.folks.recipes.create({ name: 'Trade', time: 300 })

    // interesting b/c a concrete object in the world really 'owns' the progress?
    const create = this.folks.recipes.create({ name: 'Sculpt', time: 5000 })

    this.recipes = { fish, hunt, rest, eat, vibe, idle, gather, trade, create };

    const roles: CitizenRole[] = [ 'Hunter', 'Fisherman' ] //, 'Artisan' ] //, 'Merchant']

    roles.forEach(role => this.actions.create({
      name: `New ${role}`,
      act: () => this.createCitizen(role)
    }))

    // this.policies.create({ name: 'Role-Directed', manage: () => {}); // normal labor model
    // this.policies.create({ name: 'Autonomous', manage: () => {});    // more free-spirited like
  }

  createCitizen = (role: CitizenRole) => {
    const gender: Gender = sample([ 'male', 'female' ])
    const { name, concepts }= generateName(gender)
    const firstName = name.split(' ')[0]
    const individual = this.folks.create({ name, nameConcepts: concepts })

    if (role === 'Artisan') {
      individual.traits.add(1, 'Sculpting')
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

    const spiritAnimals = [
      'dragon', 'elephant',
      'bear', 'horse', 'snake', 'hound',
      'swan', 'eagle', 'nightingale',
      'wolf',
      // wolf -> wolves
      'cherry', 'lily', 'rose', 'apple', 'fish',
      'moon', 'birch',

      'deer', 'elk', 'bear', 'lizard', 'mouse', 'pig',

      'robot', 'cloud', 'fireball',
    ]
    const pluralAnimals: { [name: string]: Concept } = {
      dragon: 'dragons',
      elephant: 'elephants',
      bear: 'bears',
      horse: 'horses',
      snake: 'snakes',
      hound: 'hounds',
      wolf: 'wolves',
      swan: 'swans',
      eagle: 'eagles',
      nightingale: 'nightingales',
      // deer: 'deer',
    }

    // concepts = ['wolf']
    let spiritCreature = sample(spiritAnimals)
    // let animalPlurals = spiritAnimals.map(a => a + 's')
    if (any(concepts, concept => spiritAnimals.includes(concept) || Object.values(pluralAnimals).includes(concept))) {
      let theConcept = spiritAnimals.find(animal => concepts.includes(animal as Concept) || concepts.includes(pluralAnimals[animal]))
      if (theConcept) { spiritCreature = theConcept }
    }

    individual.items.create({
      name: `Tiny Stone ${capitalize(spiritCreature)}`,
      description: `${firstName}'s Personal Totem`,
      kind: 'sculpture',
      quality: 'excellent',
      size: 'fine',
      material: 'stone',
    })

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
      ...(job !== undefined ? {[job.recipe.name]: () => {
        // if (job !== undefined) {
        const { recipe, startedAt } = job
        const { time: jobDuration } = recipe
        const elapsed = startedAt ? this.ticks - startedAt : -1
        return {
          value: elapsed,
          max: jobDuration,
        };
      // } else { return { value: 0, max: 0 } } 
      }} : { 'Idle': () => { return { value: 0, max: 0 }}})

    }};

    // individual.events
    // const { person, nameMeaning, recipes } = this.newPerson();
    // this.subject = person;
    // this.nameMeaning = nameMeaning;
    // this.recipes = recipes
  }

  // ticksPerHour = 60

  evolution: TimeEvolution = ({ resources }, t) => {
    this.folks.list().forEach(individual => this.evolveIndividual(individual, individual.things))
  }

  evolveIndividual = (individual: Person, resources: ManageStocks) => {
    const produce = {
      fish: 2,
      meat: 3,
      berry: 12,
    };

    const decay = {
      energy: 0.0015,
      satiety: 0.012,
      joy: 0.001,
    }

    const price = { meat: 10, fish: 4, pots: 25 }

    const energy = resources.count('Energy')
    const maxEnergy = resources.count('Max Energy')
    if (energy > maxEnergy) { resources.remove(energy - maxEnergy, 'Energy')}
    if (energy > 0) {
      resources.remove(decay.energy, 'Energy')
    }

    const satiety = resources.count('Satiety')
    const maxSatiety = resources.count('Max Satiety')
    if (satiety > maxSatiety) { resources.remove(satiety - maxSatiety, 'Satiety')}
    if (satiety > 0) {
      resources.remove(decay.satiety, 'Satiety')
    }

    const joy = resources.count('Joy')
    const maxJoy = resources.count('Max Joy')
    if (joy > maxJoy) { resources.remove(joy - maxJoy, 'Joy')}
    if (joy > 0) {
      resources.remove(decay.joy, 'Joy')
    }

    const folks = this.folks //people.lookup('Self')
    const { eat, rest, idle, vibe, hunt, fish, gather, trade, create } = this.recipes

    const assign = (task: Recipe) => {
      folks.jobs.set(individual, { recipe: task, startedAt: this.ticks })
    }

    const job = folks.jobs.get(individual)

    const meatCount = resources.count('Meat')
    const fishCount = resources.count('Fish')
    const food = fishCount //resources.count('Fish')
               + meatCount //resources.count('Meat')
               + resources.count('Berry')

    // todo move this job-completion logic into production model???
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
          resources.add(1+randomInteger(0,produce.meat), 'Meat')
        } else if (currentTask === fish) {
          resources.add(1+randomInteger(0,produce.fish), 'Fish')
        } else if (currentTask === gather) {
          resources.add(3+randomInteger(0,produce.berry), 'Berry')
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
        } else if (currentTask === create) {
          resources.add(1, 'Clay Pot')
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
        } else if (currentTask === trade) {
          console.log("TRADE!!!!!")
          // trade w/ town..
          const shells = resources.count('Shell')
          if (food < 5) {
            if (shells > 10 && resources.count('Meat') > 0) {
              let boughtMeat = Math.max(5, Math.floor(shells/price.meat))
              this.resources.remove(boughtMeat, 'Meat')
              resources.add(boughtMeat, 'Meat')
              resources.remove(boughtMeat * price.meat, 'Shells')
            }
            if (shells > 6 && resources.count('Fish') > 0) {
              let boughtFish = Math.max(5, Math.floor(shells/6))
              this.resources.remove(boughtFish, 'Fish')
              resources.add(boughtFish, 'Fish')
              resources.remove(price.fish * boughtFish, 'Shells')
            }
          } else { //if (food > 5) {
              if (fishCount > 10) {
                let soldFish = fishCount - 10
                this.resources.add(soldFish, 'Fish')
                resources.remove(soldFish, 'Fish')
                resources.add(soldFish * price.fish, 'Shells')
              }
              if (meatCount > 10) {
                let soldMeat = meatCount - 10
                this.resources.add(soldMeat, 'Meat')
                resources.remove(soldMeat, 'Meat')
                resources.add(soldMeat * price.meat, 'Shells')
              }

              if (resources.count('Clay Pot') > 0) {
                let soldPots = resources.count('Clay Pot')
                this.resources.add(soldPots, 'Clay Pot')
                resources.remove(soldPots, 'Clay Pot')
                resources.add(soldPots * price.pots, 'Clay Pot')
              }
          }

          // if (food > 10) {
                // this.resources.add(1, 'Meat')
                // resources.remove(1, 'Meat')
                // resources.add(10, 'Shells')
              // }

          // }
        }
      }
    }


      if (job === undefined) { //job === undefined || job.recipe.name === 'Ready') { //} || currentTask === idle) {
        // if (this.date.timeOfDay === 'night' && energy < 95) { assign(rest)}
        // else {
        

        if (energy < 10) { assign(rest) }
        else if (satiety < 10 && food > 0) { assign(eat) }
        else if (joy < 10) { assign(vibe) }
        else {
          // do your jobs
          if (food < 25) {
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
              if (food < 5) {
                // trade shells for food
                assign(trade) //buyFood)

              }
              // // if i have too much food, trade food for shells...
              else if (meatCount + fishCount > 10) {
                assign(trade) //sellFood)
                // trade food for shell
                // this.resources.add(1, 'Meat')
                // resources.remove(1, 'Meat')
                // resources.add(10, 'Shells')
              }
              // if (fishCount > 10) {
              //   // trade food for shell
              //   this.resources.add(1, 'Fish')
              //   resources.remove(1, 'Fish')
              //   resources.add(6, 'Shells')
              // }

              else if (this.date.timeOfDay === 'night' && energy < 70) { assign(rest) }
              else {
                if (individual.traits.count('Sculpting') > 0) { assign(create) }
                else { assign(idle) }
              }
            }
          }
        }
      }
      // }

      if (completedJob) { this.folks.jobs.set(individual, undefined as any) }

      // if (completedJob) { assign(idle) }
    }
  // }

  
  get date() {
    // let time = this.ticks || 0

    // let minutes = Math.floor(this.ticks / 60)

    // let secondInterval = 0.1;
    // let seconds = Math.floor(time / secondInterval);

    // let second = seconds / 60 //%60
    // let minute = Math.floor(seconds/60)%60
    let minutes = Math.floor(this.ticks / this.ticksPerMinute);
    let hours = Math.floor(minutes / 60) //this.ticks / 60)
    let days = Math.floor(hours / 24) //this.ticks / 60)
    let weeks = Math.floor(days / 7) //this.ticks / 60)
    let seasons = Math.floor(weeks / 12) //this.ticks / 60)

    let minute = Math.floor(minutes)%60 //this.ticks % this.ticksPerMinute // Math.floor(minutes)
    let hour = Math.floor(hours%24) //Math.floor(seconds/(60*60))%24
    let day = Math.floor(days%7); //Math.floor(seconds / (60 * 60 * 24));
    let season = Math.floor(seasons%4);
    // let week = Math.floor(seconds / (60 * 60 * 24 * 7));
    // let month = Math.floor(seconds / (60 * 60 * 24 * 7 * 4));
    // let year = Math.floor(seconds / (60 * 60 * 24 * 365));

    let seasonName = ['winter', 'spring', 'summer', 'autumn'][season];
    let monthName = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ][Math.floor(weeks/4)%12];

    let dayOfWeek = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day];

    let dayOfMonth = (days+1) % 30;

    let timeOfDay = ['night', 'morning', 'afternoon', 'evening'][Math.floor(hour/6)%4]
    let dayPartSign: { [key: string]: string } = { morning: '🌅', afternoon: '🏙️', evening: '🌆', night: '🌃' }
    let seasonSign: { [key: string]: string } = { winter: '❄️', summer: '🌴', spring: '🌱', autumn: '🍂' }

    let meridian = hour >= 12 ? 'pm' : 'am'

    let normalHour = (hour%12) === 0 ? 12 : (hour%12)

    return {
      dayOfWeek,
      timeOfDay,
      description: `${seasonSign[seasonName]} ${dayOfWeek}, ${monthName} ${ordinate(dayOfMonth)}`,
      time: `${dayPartSign[timeOfDay]} ${String(normalHour)}:${String(minute).padStart(2,'0')} ${(meridian.toUpperCase())}`,
    }
  }
}

export default new City()
