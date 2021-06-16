import Model from "../ecosphere/Model"


const domesticCrops = {
  Wheat: 'wheat',
  Corn: 'corn',
  Rice: 'rice',
}
const food = { Bread: 'bread', }
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
  ...domesticCrops,
  ...food,
  ...wildAnimals,
}

const { Bread, Wheat, Fish, Fox, Rabbit } = commonElements;
const People = {
  Zed: 'Zedediah',
  Cash: 'Cassius',
  Raz: 'Erasmus',
}
const { Zed, Cash, Raz } = People;
const Windmill = 'Windmill';

const world = new Model('Township of Writ-upon-Water')
const { resources, animals, people, machines, recipes, jobs, tasks } = world

resources.create(Fish)
resources.create(Wheat)
resources.create(Bread)

animals.create(Fox)
animals.create(Rabbit)

const zed = people.create(Zed)
people.create(Cash)
people.create(Raz)

machines.create(Windmill);

recipes.create({ name: 'Bread', produces: { [Bread]: 1 }, consumes: { [Wheat]: 5 }})
const baking = tasks.create({ name: 'Bake Bread', recipe: 'Bread' })
jobs.set(zed, baking)

world.evolve(({ resources, animals }) => {
  animals.add(1, Fox)
  resources.add(1, Wheat)
  world.work({ resources })
  // if (resources.count(Wheat) >= 5) {
  //   resources.add(1, Bread)
  //   resources.remove(5, Wheat)
  // }
})

export { world }

// const fisherman = cash.hauls(fishingHole)

// const kitchen = world.machine([{ input: fish, output: fishSticks }])

