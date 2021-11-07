import { Community } from "../../ecosphere/Community"
import { Concept, theConcepts } from "../../ecosphere/Dictionary"
import Westron from "../../ecosphere/Languages/Westron"
import Model from "../../ecosphere/Model"
import { Recipe, TimeEvolution, Person, ManageStocks, Quality, Size, Material } from "../../ecosphere/types"
import { any } from "../../ecosphere/utils/any"
import { capitalize } from "../../ecosphere/utils/capitalize"
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

// spirit 'entities' 
const spiritAnimals = [
  'dragon', 'elephant',
  'bear', 'horse', 'snake', 'hound',
  'swan', 'eagle', 'nightingale',
  'wolf',
  // wolf -> wolves
  'cherry', 'lily', 'rose', 'apple', 'fish',
  'moon', 'birch',

  'deer', 'elk', 'bear', 'lizard', 'mouse', 'pig', 'owl',
  'tiger', 'goat', 'monkey', 'rooster', 'rabbit', 'lion',
  'falcon',

  'cloud', 'fireball',

  'robot', 'alien',
]
class City extends Model {
  

folks: Community
recipes: { [key in Activity]: Recipe }
notes = {
  date: () => this.date.description,
  time: () => this.date.time,
}
ticksPerMinute = 5

constructor() {
  super('Citadel');
  this.evolve(this.evolution)

  this.folks = this.people.create('Folks')

  const fish = this.folks.recipes.create({ name: 'Fish', time: 500, probability: 0.45 })
  const hunt = this.folks.recipes.create({ name: 'Hunt', time: 240, probability: 0.52 })
  const rest = this.folks.recipes.create({ name: 'Rest', time: 1900 })
  const eat = this.folks.recipes.create({ name: 'Eat', time: 200 })
  const vibe = this.folks.recipes.create({ name: 'Vibe', time: 777 })
  const idle = this.folks.recipes.create({ name: 'Ready', time: 180 })
  const gather = this.folks.recipes.create({ name: 'Gather', time: 1234 })
  const trade = this.folks.recipes.create({ name: 'Trade', time: 300 })

  // interesting b/c a concrete object in the world really 'owns' the progress?
  const create = this.folks.recipes.create({ name: 'Sculpt', time: 1700 })

  this.recipes = { fish, hunt, rest, eat, vibe, idle, gather, trade, create };

  const roles: CitizenRole[] = ['Hunter', 'Fisherman', 'Artisan'] //, 'Merchant']

  roles.forEach(role => this.actions.create({
    name: `New ${role}`,
    act: () => this.createCitizen(role)
  }))

  this.resources.add(100, 'Meat')
  this.resources.add(100, 'Fish')

  // this.policies.create({ name: 'Role-Directed', manage: () => {}); // normal labor model
  // this.policies.create({ name: 'Autonomous', manage: () => {});    // more free-spirited like
}

createCitizen = (role: CitizenRole) => {
  const gender: Gender = sample(['male', 'female'])
  const { name, concepts } = generateName(gender)
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


  const animalConcepts: { [name: string]: Concept } = {
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

    rooster: 'morning',
    toad: 'evening',
    owl: 'night',

    lion: 'bold',
    falcon: 'quick',
  }

  // concepts = ['wolf']
  let spiritCreature = sample(spiritAnimals)
  // let animalPlurals = spiritAnimals.map(a => a + 's')
  if (any(concepts, concept => spiritAnimals.includes(concept) || Object.values(animalConcepts).includes(concept))) {
    let theConcept = spiritAnimals.find(animal => concepts.includes(animal as Concept) || concepts.includes(animalConcepts[animal]))
    if (theConcept) { spiritCreature = theConcept }
  }

  individual.items.create({
    name: `${sample(['Little', 'Tiny'])} Stone ${capitalize(spiritCreature)}`,
    description: `${firstName}'s Personal Totem`,
    kind: 'sculpture',
    quality: sample(['excellent', 'good'] as Quality[]),
    size: 'fine',
    material: 'stone',
  })

  individual.meters = () => {
    const job = this.folks.jobs.get(individual)
    return {
      'Energy': () => {
        return {
          value: individual.things.count('Energy'),
          max: individual.things.count('Max Energy'),
        }
      },
      'Satiety': () => {
        return {
          value: individual.things.count('Satiety'),
          max: individual.things.count('Max Satiety'),
        }
      },
      'Joy': () => {
        return {
          value: individual.things.count('Joy'),
          max: individual.things.count('Max Joy'),
        }
      },
      ...(job !== undefined ? {
        [job.recipe.name]: () => {
          // if (job !== undefined) {
          const { recipe, startedAt } = job
          const { time: jobDuration } = recipe
          const elapsed = startedAt ? this.ticks - startedAt : -1
          return {
            value: elapsed,
            max: jobDuration,
          };
          // } else { return { value: 0, max: 0 } } 
        }
      } : { 'Idle': () => { return { value: 0, max: 0 } } })

    }
  };
}

evolution: TimeEvolution = ({ resources }, t) => {
  this.folks.list().forEach(individual => this.evolveIndividual(individual, individual.things))
}

evolveIndividual = (individual: Person, resources: ManageStocks) => {
  

  const decay = {
    energy: 0.01,
    satiety: 0.012,
    joy: 0.001,
  }


  const energy = resources.count('Energy')
  const maxEnergy = resources.count('Max Energy')
  const satiety = resources.count('Satiety')
  const maxSatiety = resources.count('Max Satiety')
  const joy = resources.count('Joy')
  const maxJoy = resources.count('Max Joy')

  if (energy > maxEnergy) { resources.remove(energy - maxEnergy, 'Energy') }
  if (energy > 0) {
    resources.remove(decay.energy, 'Energy')
  }

  if (satiety > maxSatiety) { resources.remove(satiety - maxSatiety, 'Satiety') }
  if (satiety > 0) {
    resources.remove(decay.satiety, 'Satiety')
  }

  if (joy > maxJoy) { resources.remove(joy - maxJoy, 'Joy') }
  if (joy > 0) {
    resources.remove(decay.joy, 'Joy')
  }

  const folks = this.folks
  const { eat, rest, idle, vibe, hunt, fish, trade, create } = this.recipes

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
          produceJobRewards = randomInteger(0, 100) <= probability * 100
        }
      }
    }

    if (produceJobRewards) {
      this.produceTaskOutcome(currentTask, individual); //resources);
    }

  }


  if (job === undefined) { //job === undefined || job.recipe.name === 'Ready') { //} || currentTask === idle) {
    // console.log("no job yet..")
    // const shells = resources.count('Shells')
    if (food < 5) { 
      console.log("food less than five, trade?!")
      assign(trade)
    }
    else if (meatCount > 10 || fishCount > 10) { assign(trade) }
    else if (this.date.timeOfDay === 'night' && energy < 70) { assign(rest) }
    else if (energy < 40) { assign(rest) }
    else if (satiety < 65 && food > 0) { assign(eat) }
    else if (joy < 40) { assign(vibe) }
    else {
      if (this.date.timeOfDay === 'morning' || this.date.timeOfDay === 'afternoon') {
        if (individual.traits.count('Hunting') > 0) {
          assign(hunt)
        } else if (individual.traits.count('Fishing') > 0) {
          assign(fish)
        } else
          if (individual.traits.count('Sculpting') > 0) {
            assign(create)
          }
      }
      else if (satiety < 70 && food > 0) { assign(eat) }
      else if (joy < 90) { assign(vibe) }
      else {
        assign(idle)
      }
    }
  }

  if (completedJob) { this.folks.jobs.set(individual, undefined as any) }
}

  produceTaskOutcome(task: Recipe, individual: Person) { //resources: ManageStocks) {
    const { things: resources } = individual

    const energy = resources.count('Energy')
    const maxEnergy = resources.count('Max Energy')
    const satiety = resources.count('Satiety')
    const maxSatiety = resources.count('Max Satiety')
    const joy = resources.count('Joy')
    const maxJoy = resources.count('Max Joy')

    const meatCount = resources.count('Meat')
    const fishCount = resources.count('Fish')
    const food = fishCount //resources.count('Fish')
      + meatCount //resources.count('Meat')
      + resources.count('Berry')

    const { eat, rest, vibe, fish, gather, trade, create } = this.recipes
    const produce = {
      fish: 2,
      meat: 3,
      berry: 12,
    };
    const price = { meat: 10, fish: 4, pots: 25 }
    if (task.name === 'Hunt') {
      resources.add(1 + randomInteger(0, produce.meat), 'Meat')
    } else if (task === fish) {
      resources.add(1 + randomInteger(0, produce.fish), 'Fish')
    } else if (task === gather) {
      resources.add(3 + randomInteger(0, produce.berry), 'Berry')
    } else if (task === rest) {
      if (energy < maxEnergy) {
        resources.add(
          75, //clamp(1+randomInteger(5,25),0,maxEnergy-energy),
          'Energy')
      }
    } else if (task === vibe) {
      if (joy < maxJoy) {
        resources.add(
          35, //clamp(1+randomInteger(15,35),0,maxEnergy-energy),
          'Joy'
        )
      }
    } else if (task === create) {
      // resources.add(1, 'Clay Pot')


      const skill = individual.traits.count('Sculpting')
      const subject = sample(spiritAnimals)
      const sizeDescriptions = { fine: 'tiny', small: 'little', medium: 'big', large: 'huge', huge: 'gigantic' }
      const size = skill > 0 ? sample(['fine', 'small', 'medium', 'large'] as Size[]) : 'small'

      // const moods = [
      //   // 'sullen', 'dismal', 'joyous', 'surprised', 'happy', 'content', 'confused', 'terrified', 'gentle',
      // ]
      // const mood = sample(moods)

      individual.items.create({
        name: `Stone ${capitalize(subject)}`,
        kind: 'sculpture',
        size,
        quality: skill > 0 ? sample(['good', 'excellent'] as Quality[]) : 'terrible',
        description: `A ${[sizeDescriptions[size], subject].join(' ')} carved from stone by ${individual.name}`
      })

    } else if (task === eat) {
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
    } else if (task === trade) {
      // console.log("TRADE!!!!!")
      // trade w/ town..
      const shells = resources.count('Shells')
      console.log("i have " + shells + "shell")
      if (food < 5) {
        const storeMeat = this.resources.count('Meat')
        const storeFish = this.resources.count('Fish')
        console.log("low on food...", { shells, storeMeat, storeFish })
        if (shells > 10 && storeMeat > 0) {
          let boughtMeat = Math.min(storeMeat, Math.floor(shells / price.meat))
          console.log(`Trade shells for ${boughtMeat} meat!`)
          this.resources.remove(boughtMeat, 'Meat')
          resources.add(boughtMeat, 'Meat')
          resources.remove(boughtMeat * price.meat, 'Shells')
        } else if (shells > 6 && storeFish > 0) {
          let boughtFish = Math.min(storeFish, Math.floor(shells / price.fish))
          console.log(`Trade shells for ${boughtFish} fish!`)
          this.resources.remove(boughtFish, 'Fish')
          resources.add(boughtFish, 'Fish')
          resources.remove(price.fish * boughtFish, 'Shells')
        }

      } //else { //if (food > 5) {
      if (fishCount > 10) {
        // console.log("Trade fish for shells!")
        let soldFish = fishCount - 10
        this.resources.add(soldFish, 'Fish')
        resources.remove(soldFish, 'Fish')
        resources.add(soldFish * price.fish, 'Shells')
      }
      if (meatCount > 10) {
        // console.log("Trade meat for shells!")
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
      let toSell = individual.items.list().find(it => !it.description.includes('Personal'))
      if (toSell) {
        console.log("SELL ITEM " + toSell.name + "!!")
        // individual.items.remove(1, toSell.name)
        individual.items.delete(toSell.name)
        // debugger
        const basePrice = 1000
        const materialMultiplier: { [key in Material]: number } = {
          wood: 0.8,
          clay: 0.95,
          stone: 1.3,
          iron: 2.5,
        }
        const qualityMultiplier: { [key in Quality]: number } = {
          terrible: 0.5,
          adequate: 1.2,
          good: 1.5,
          excellent: 2
        }
        const price = basePrice
          * (toSell.material ? materialMultiplier[toSell.material] : 0.1)
          * (toSell.quality ? qualityMultiplier[toSell.quality] : 0.1)
        // individual.items.manage(toSell).remove(1)
        // pricing model taking into account material + quality??
        console.log("---> Sold " + toSell.description + " for " + price)
        resources.add(price, 'Shells')
      }
      // }

      // if (food > 10) {
      // this.resources.add(1, 'Meat')
      // resources.remove(1, 'Meat')
      // resources.add(10, 'Shells')
      // }

      // }
    }
  }


  get date() {
    let minutes = Math.floor(this.ticks / this.ticksPerMinute);
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)
    let weeks = Math.floor(days / 7)
    let seasons = Math.floor(weeks / 12)

    let minute = Math.floor(minutes) % 60;
    let hour = Math.floor(hours % 24);
    let day = Math.floor(days % 7);
    let season = Math.floor(seasons % 4);

    let seasonName = ['winter', 'spring', 'summer', 'autumn'][season];
    let monthName = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ][Math.floor(weeks / 4) % 12];

    let dayOfWeek = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day];

    let dayOfMonth = (days + 1) % 30;

    let timeOfDay = ['night', 'morning', 'afternoon', 'evening'][Math.floor(hour / 6) % 4]
    let dayPartSign: { [key: string]: string } = { morning: '🌅', afternoon: '🏙️', evening: '🌆', night: '🌃' }
    let seasonSign: { [key: string]: string } = { winter: '❄️', summer: '🌴', spring: '🌱', autumn: '🍂' }

    let meridian = hour >= 12 ? 'pm' : 'am'

    let normalHour = (hour % 12) === 0 ? 12 : (hour % 12)

    return {
      dayOfWeek,
      timeOfDay,
      description: `${seasonSign[seasonName]} ${dayOfWeek}, ${monthName} ${ordinate(dayOfMonth)}`,
      time: `${dayPartSign[timeOfDay]} ${String(normalHour)}:${String(minute).padStart(2, '0')} ${(meridian.toUpperCase())}`,
    }
  }
}

export default new City()
