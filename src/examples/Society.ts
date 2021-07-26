// todo: gen a new society with moieties; gen new individuals; work!

import { boundMethod } from "autobind-decorator";
import Model from "../ecosphere/Model"
import { EvolvingStocks } from "../ecosphere/types";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { sample } from "../ecosphere/utils/sample";

// long-term: assemble a bunch of different societies + see how different policies/designs work
export class Society extends Model {
  resourceNames: string[] = [ 'Wheat', 'Bread', 'Wine', 'Water', 'Clay', 'Coal' ]
  animalNames: string[] = [ 'Sheep', 'Cow' ] //, 'Pig', 'Chicken' ] // Elk', 'Sheep', 'Wolf', 'Rabbit', 'Deer', 'Heron', 'Ibis', 'Lion', 'Moose', 'Raccoon', 'Hawk', 'Bluebird', 'Owl', 'Mouse', 'Fox', 'Robin', 'Dove', 'Elephant' ]
  treeNames: string[] = [ 'Pine', 'Spruce' ] //, 'Juniper', 'Elm' ] //, 'Alder', 'Elm', 'Aspen', 'Oak', 'Beech', 'Pear', 'Cherry' ]
  fruitTreeNames: string[] = [ 'Pear', 'Cherry' ] //, 'Apple', 'Peach' ] //, 'Alder', 'Elm', 'Aspen', 'Oak', 'Beech', 'Pear', 'Cherry' ]
  plantNames: string[] = [ 'Grape', 'Blueberry' ] //, 'Strawberry', 'Goji' ]
  strataNames: string[] = [ 'Nobility', 'Merchants', 'Workers', 'Farmers' ]

  meatNames: { [name: string]: string } = { 'Cow': 'Beef', 'Chicken': 'Poultry', 'Pig': 'Pork', 'Sheep': 'Mutton'  }

  constructor() { super('A Society'); this.setup() }
  setup() {
    this.strataNames.forEach(strata => {
      const socialClass = this.people.create(strata)
      socialClass.birth()
      socialClass.birth()
      socialClass.birth()
    })
    this.resourceNames.forEach(resource => this.resources.create(resource))
    this.animalNames.forEach(animal => {
      const creature = this.animals.create(animal)
      creature.birth()
      this.resources.create(this.meatNames[animal])
    })
    this.treeNames.forEach(tree => {
      this.resources.create(`${tree} Wood`)
      this.resources.create(`${tree} Tree`)
      this.resources.create(`${tree} Seed`)
    })
    this.fruitTreeNames.forEach(fruitTree => {
      this.resources.create(`${fruitTree} Wood`)
      this.resources.create(`${fruitTree} Tree`)
      this.resources.create(`${fruitTree} Seed`)
      this.resources.create(`${fruitTree}`) // fruit
    })
    this.plantNames.forEach(plant => {
      this.resources.create(`${plant} Plant`)
      this.resources.create(`${plant} Seed`)
      this.resources.create(`${plant}`)
    })
    this.evolve(this.evolution)
  }

  @boundMethod
  evolution({ resources, animals }: EvolvingStocks, t: number) {
    this.animalNames.forEach(animalName => {
      if (randomInteger(0,20) > 18) {
        animals.add(1, animalName)
        // animals.lookup(animal).birth()
      }
    })

    // ..
    this.people.lookup('Workers').list().forEach(worker => {
      

      // if (randomInteger(0,12) > 10) {
      const randomTree = (sample(this.treeNames))
      if (resources.count(`${randomTree} Tree`) > 0) {
        resources.add(randomInteger(2, 3), `${randomTree} Wood`)
        resources.add(randomInteger(0, 1), `${randomTree} Seed`)
        resources.remove(1, `${randomTree} Tree`)
      }
      // }
      // pay to keep wildlife in line??
      // person.currency += 1

      // todo expose a status..?
      // person.name = 'Hunt ' + randomAnimal.name
    })

    this.people.lookup('Farmers').list().forEach(farmer => {
      // if (randomInteger(0,12) > 10) {
        const randomAnimal = (sample(this.animalNames))
        animals.remove(1, randomAnimal)
        resources.add(1, this.meatNames[randomAnimal])
      // }

      const randomPlant = sample(this.plantNames)
      if (resources.count(`${randomPlant} Plant`) > 0) {
        resources.remove(1, `${randomPlant} Plant`)
        resources.add(1, randomPlant)
      } else {
        resources.add(1, `${randomPlant} Plant`)
        resources.remove(1, `${randomPlant} Seed`)
      }
    })
  }
}
