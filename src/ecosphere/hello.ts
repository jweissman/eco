import Model from "./Model"

// create model
const world = new Model('Avernus')


// define elements
world.element('fish')
world.element('fish-sticks')

// define individuals
world.individual('zed')
world.individual('cash')

export { world }

// todo define time evolution
// world.tick(() => {})

// todo define sources
// const fishingHole = world.source(fish, 'fishing-hole')
// fishingHole.produces(fish)
// const fisherman = world.agent({ uses: [ fishingHole, kitchen ] })

// const kitchen = world.machine([{ input: fish, output: fishSticks }])

