import Model from "./Model"

// create model
const world = new Model('Township of Writ-upon-Water')

// define elements
world.element('Fowl')
world.element('Fish')
world.element('Fish Sticks')

world.element('Wheat')
world.element('Flour')
world.element('Bread')

// define individuals
world.individual('Zed')
world.individual('Cash')

world.add(10, 'Fish Sticks')
world.add(10, 'Wheat')

// todo define time evolution for recurrence relations (eg biological populations)
world.evolve(({ add }) => {
  add(10, 'Fish Sticks')
  add(Math.floor(Math.random()*100), 'Wheat')
})

export { world }


// todo define sources
// const fishingHole = world.source('fishing-hole')
// fishingHole.produces(fish)
// const fisherman = cash.hauls(fishingHole)

// const kitchen = world.machine([{ input: fish, output: fishSticks }])

