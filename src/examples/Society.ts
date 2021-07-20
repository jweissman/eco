// todo: gen a new society with moieties; gen new individuals; work!

import { boundMethod } from "autobind-decorator";
import Model from "../ecosphere/Model"
import { EvolvingStocks } from "../ecosphere/types";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { sample } from "../ecosphere/utils/sample";

// long-term: assemble a bunch of different societies + see how different policies/designs work
export class Society extends Model {
  resourceNames: string[] = [ 'Wheat', 'Bread', 'Wine', 'Water', 'Grapes', 'Clay', 'Coal', 'Pear', 'Cherry' ]
  animalNames: string[] = [ 'Elk', 'Sheep', 'Wolf', 'Rabbit', 'Deer', 'Heron', 'Ibis', 'Lion', 'Moose', 'Raccoon', 'Hawk', 'Bluebird', 'Owl', 'Mouse', 'Fox', 'Robin', 'Dove', 'Elephant' ]
  treeNames: string[] = [ 'Pine', 'Spruce', 'Juniper', 'Alder', 'Elm', 'Aspen', 'Oak', 'Beech', 'Pear', 'Cherry' ]
  strataNames: string[] = [ 'Nobility', 'Merchants', 'Peasants' ]
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
      this.resources.create(`${animal} Meat`)
    })
    this.treeNames.forEach(tree => {
      this.resources.create(`${tree} Wood`)
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
    this.people.lookup('Peasants').list().forEach(person => {
      if (randomInteger(0,12) > 10) {
        const randomAnimal = (sample(this.animalNames))
        animals.remove(1, randomAnimal)
        // this.resources.
        // resources.create()
        resources.add(1, `${randomAnimal} Meat`)
      }

      if (randomInteger(0,12) > 10) {
        const randomTree = (sample(this.treeNames))
        resources.add(1, `${randomTree} Wood`)
      }
      // pay to keep wildlife in line??
      // person.currency += 1

      // todo expose a status..?
      // person.name = 'Hunt ' + randomAnimal.name
    })
  }
}
