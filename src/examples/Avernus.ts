// import Model from "../ecosphere/Model"

import Model from "../ecosphere/Model"
import { Person } from "../ecosphere/types"

const give = (recipient: Person, supplier: Person, n: number, item: string) => {
  supplier.things.remove(n, item)
  recipient.things.add(n, item)
}

const world = new Model('Avernus')
const { resources, animals, people, machines } = world
const folks = people.create('Townspeople')
const { recipes, jobs } = folks

animals.create('Fish')
// resources.create('Fish')


// const king = people.create('Maurice')
const miner = folks.create('Goldstrom')
const minter = folks.create('Octavius')
const smelter = folks.create('Smeltmore')
// //const sheriff = people.create('Donald')
// const claydigger = people.create('Bartlett')
// const artist = people.create('Joseph')
const fisherman = folks.create('Harold')
// const chef = people.create('Jethro')
// const merchant = people.create('Reginald')

// //set inventory
// merchant.things.add(50, 'Gold Coin')


// //create global resources
// animals.create('Swimming Fish')
// animals.add(500, 'Swimming Fish')
resources.create('Gold Ore')
resources.create('Gold Deposit')
resources.create('Gold Bar')
resources.create('Gold Coin')

resources.add(100000000, 'Gold Deposit')
// resources.create('Clay Deposit')
// resources.add(10000, 'Clay Deposit')

//create produced goods



//jobs

// const kingGold = recipes.create({
//   name: 'Taking Gold',
//   produces: { 'King Gold': 1 },
//   consumes: { 'Gold Coin': 1 },
// })

const mineGold = recipes.create({
  name: 'Mining Gold',
  produces: { 'Gold Ore': 1 },
  consumes: { 'Gold Deposit': 10 },
})

const smeltGold = recipes.create({
  name: 'Smelt Gold',
  produces: { 'Gold Bar': 1 },
  consumes: { 'Gold Ore': 10 }
})

const mintCoin = recipes.create({
  name: 'Minting Gold Coins',
  produces: { 'Gold Coin': 10 },
  consumes: { 'Gold Bar': 1 },
})

// const digClay = recipes.create({
//   name: 'Digging Clay',
//   produces: { 'Clay Brick': 1 },
//   consumes: { 'Clay Deposit': 1 },
// })

// const castPot = recipes.create({
//   name: 'Casting Pottery',
//   produces: { 'Fine Pottery': 1 },
//   consumes: { 'Clay Brick': 1 },
// })

// const catchFish = recipes.create({
//   name: 'Catching Fish',
//   produces: { 'Caught Fish': 1 },
//   consumes: { 'Swimming Fish': 1 },
// })

// const cookFish = recipes.create({
//     name: 'Cooking Fish',
//     produces: { 'Cooked Fish': 1 },
//     consumes: { 'Caught Fish': 1 },
// })

//Set Jobs
jobs.set(miner, mineGold)
jobs.set(minter, mintCoin)
jobs.set(smelter, smeltGold)
// jobs.set(claydigger, digClay)
// jobs.set(artist, castPot)
// jobs.set(fisherman, cookFish)
// jobs.set(chef, cookFish)

world.evolve(({ resources, animals }, t) => {
  // animals.add(1, 'Swimming Fish')

  folks.work({ resources })

  // employment
  if (t % 10 === 0) {
    const thePeople = [miner, minter, smelter]
    thePeople.forEach(person => {
      person.things.add(1, 'Gold Coin')
      resources.remove(1, 'Gold Coin')
    })
  }

  // taxation
  // if (t % 1000 === 0) {
  //   resources.remove()
  // }

  // wildlife hunting + fishing
  if (t % 10 === 0) { // 
    // huntWildlife('Fish')
    fisherman.things.add(1, 'Fish')
    animals.remove(1, 'Fish')
  }

  // trade
  const thePeople = [miner, minter, smelter]
  // const theGoods = ['Fish', ]
  thePeople.forEach(person => {
    if (fisherman.things.count('Fish') > 3 && person.things.count('Gold Coin') > 5) {
      give(fisherman, person, 5, 'Gold Coin')
      give(person, fisherman, 1, 'Fish')
    }
  })
})


export {world as Avernus}
