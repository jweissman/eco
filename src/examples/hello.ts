import Model from "../ecosphere/Model"
import { Evolution, ManageStocks, TimeEvolution } from "../ecosphere/types"
import { worldbuilding } from "../ecosphere/worldbuilding"

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

const { Bread, Wheat, Fish, Fox, Rabbit } = commonElements;

const { create } = world.resources

create(Fish)
create(Wheat)
create(Bread)

// const foxPop: Population<Animal> = world.animals.create(Fox)

// track foxes as discrete pop of individuals
world.animals.create(Fox)
world.animals.create(Rabbit)

// 'link' fox resource to 'simply track' more granular fox population
// the idea is add/remove will create/destroy individuals!! but maybe not relevant??
// ie really we can just report the size of the population directly??
// do they 'need' to be resources??
// world.resources.create(Fox, world.animals) 
// const foxResource = world.resources.add(1000, Fox)

// create(Deer)
// create(Rabbit)
// create(Bear)
// create(Ferret)
// create(Snake)

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
// world.resources.add(1000, Fox)
// world.resources.add(1000, Rabbit)
// world.resources.add(1000, Bear)
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

// world.dynamics = (({ animals }) => { //add, remove, count }) => {
//   const { add, remove, count } = animals
//   // const { reproduce } = worldbuilding(animals) //{ add, remove, count })
// })
// todo okay really need to add add/remove count blocks for each resource..
const evolveAnimals = (animals: ManageStocks) => { //add, remove, count }) => {
  const { reproduce } = worldbuilding(animals) //{ add, remove, count })
  reproduce(Fox,    { growthRate: 0.029, cap: Math.floor(0.4 * animals.count(Rabbit))})
}

const evolveResources = (resources: ManageStocks) => {
  const { add, remove, count } = resources
  // bake bread
  if (count(Wheat) >= 5) {
    add(1, Bread)
    remove(5, Wheat)
  }
  add(1, Wheat)
}

const evolution: TimeEvolution = (
  evolution: Evolution,
  _ticks: number
) => {
  const { resources, animals } = evolution
  evolveResources(resources)
  evolveAnimals(animals)
}

world.evolve(evolution)

export { world }

// const fisherman = cash.hauls(fishingHole)

// const kitchen = world.machine([{ input: fish, output: fishSticks }])

