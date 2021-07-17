import Model from "../ecosphere/Model"

const domesticCrops = { Wheat: 'wheat' }
const food = { Bread: 'bread' }
const wildAnimals = {
  Fish: 'fishes',
  Fox: 'fox',
  Rabbit: 'rabbit',
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
const { resources, animals, people, machines } = world
const townsfolk = people.create('Rippenwaterans')
const { recipes, jobs } = townsfolk

resources.create(Fish)
resources.create(Wheat)
resources.create(Bread)

animals.create(Fox)
animals.create(Rabbit)

const zed = townsfolk.create(Zed)
townsfolk.create(Cash)
townsfolk.create(Raz)

// zed.things.create('Gold')
zed.things.add(10, 'Gold')
zed.things.add(10, 'Apples')

machines.create(Windmill);

const bread = recipes.create({
  name: 'Bread',
  produces: { [Bread]: 1 },
  consumes: { [Wheat]: 5 }
})
jobs.set(zed, bread)

// how could we model a simple merchant??
// const bread = recipes.create({
//   name: 'Bread',
//   produces: { [Bread]: 1 },
//   consumes: { [Wheat]: 5 }
// })

world.evolve(({ resources, animals }) => {
  animals.add(1, Fox)
  resources.add(1, Wheat)
  townsfolk.work({ resources })
  zed.things.remove(1, 'Gold')
})

export { world }

