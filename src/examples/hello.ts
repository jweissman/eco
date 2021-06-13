import { randomInt } from "crypto";
import Model from "../ecosphere/Model"
import { worldbuilding } from "../ecosphere/worldbuilding";

// create model
const world = new Model('Township of Writ-upon-Water')

const wildPlants = {
  Rosemary: 'rosemary',
  Sycamore: 'sycamore',
  Oak: 'oak',
  Cherry: 'cherry-tree',
}
const domesticCrops = {
  Wheat: 'wheat',
  Corn: 'corn',
  Rice: 'rice',
}
const food = {
  Bread: 'bread',
}
const wildAnimals = {
  Fish: 'fishes',
  Fowl: 'fowl',
  Fox: 'fox',
  Deer: 'deer',
  Rabbit: 'rabbit',
  Bear: 'bear',
  Ferret: 'ferret',
  Snake: 'snake',
}
const commonElements = {
  ...wildPlants,
  ...domesticCrops,
  ...food,
  ...wildAnimals,
}

const { Bread, Wheat, Fish, Fox, Deer, Rabbit, Bear, Ferret, Snake } = commonElements;

const { create } = world.resources

create(Fish)
create(Wheat)
create(Bread)

create(Fox)
create(Deer)
create(Rabbit)
create(Bear)
create(Ferret)
create(Snake)

const People = {
  Zed: 'Zedediah',
  Cash: 'Cassius',
  Raz: 'Erasmus',
}

const { Zed, Cash, Raz } = People;

// define individuals
world.people.create(Zed)
world.people.create(Cash)
world.people.create(Raz)

// todo individual tasks

// world.items.add(10, Wheat)
// world.items.add(1000, Fish)
world.resources.add(1000, Fox)
world.resources.add(1000, Rabbit)
world.resources.add(1000, Bear)
// world.items.add(1000, Ferret)
// world.items.add(1000, Snake)

// todo separate zones
// const Zones = { Deepwood: 'Deepwood Forest'}
// world.zones.create(Zones.Deepwood)
// world.add(10, Fox, Zones.Deepwood)

// todo source
// todo define sources
// const Pond = 'pond'
// world.sources.create(Pond)
// world.sources.add(1000, Fish, Pond)

// todo machines
const Windmill = 'mill';
// const Stove = 'stove';

world.machines.create(Windmill);
// world.machine(Stove, []);

// todo jobs
// const Milling = 'milling';
// const Cooking = 'cooking';

// world.job(Milling, {
//   at: Mill,
//   consumes: { Wheat: 10 },
//   produces: { Flour: 2 },
// })

// world.job(Cooking, { at: Mill,
//   name: 'baking bread',
//   consumes: { Flour: 8, Water: 2 },
//   produces: { Bread: 2 },
// })

// todo okay really need to add add/remove count blocks for each resource
world.evolution = (({ add, remove, count }) => {
  const { reproduce } = worldbuilding({ add, remove, count })

  // bake bread
  if (count(Wheat) >= 5) {
    add(1, Bread)
    remove(5, Wheat)
  }

  add(1, Wheat)

  // harvest wheat
  if (randomInt(0,10) < 2) {
    add(randomInt(0,1), Wheat) 
  }

  // wildlife populations
  // reproduce(Fish,   { growthRate: 0.001, cap: 100000 })
  // const rabbitPop = count(Rabbit)
  // const tenthRabbitPop = count(Rabbit)
  reproduce(Fox,    { growthRate: 0.029, cap: Math.floor(0.4 * count(Rabbit))})
  reproduce(Rabbit, { growthRate: 0.04,  cap: 1000 })
  reproduce(Bear,   { growthRate: 0.001, cap: Math.floor(0.25 * count(Rabbit)) + Math.floor(0.15 * count(Fox))})
  // reproduce(Ferret, { growthRate: 0.001, cap: count(Rabbit) })
  // reproduce(Snake,  { growthRate: 0.001, cap: count(Rabbit) })

  // predation
  remove(Math.floor(count(Fox)/25), Rabbit)
  remove(Math.floor(count(Bear)/20), Rabbit)
  remove(Math.floor(count(Bear)/30), Fox)
  // if (count(Fox) > 5) { remove(Math.floor(count(Fox)/5), Rabbit) }
  // if (count(Ferret) > 5) { remove(Math.floor(count(Ferret)/5), Rabbit) }
  // if (count(Snake) > 5) { remove(Math.floor(count(Snake)/5), Rabbit) }
  // if (count(Bear) > 5) {
  //   remove(Math.floor(count(Bear)/5), Rabbit)
  //   remove(Math.floor(count(Bear)/5), Fish)
  //   remove(Math.floor(count(Bear)/5), Ferret)
  // }

  // fox and rabbit
  // every fox eats a rabbit?
  // if (count(Rabbit) < count(Fox)) {
  //   remove(count(Fox) - count(Rabbit), Fox)
  // }
  // remove(Math.floor(count(Fox)/3), Rabbit)
  // add(1+randomInt(0,3), Rabbit)
  // add(4+randomInt(0,1), Fox)
  // reproduce(Fox, { birthRate: 0.16, deathRate: 0.13 })
  // reproduce(Rabbit, { birthRate: 0.46, deathRate: 0.27 })
})

export { world }

// const fisherman = cash.hauls(fishingHole)

// const kitchen = world.machine([{ input: fish, output: fishSticks }])

