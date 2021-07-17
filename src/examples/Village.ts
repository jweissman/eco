// import Model from "../ecosphere/Model"

import Model from "../ecosphere/Model"
import { Assembly } from "../ecosphere/Assembly"


const town = new Model('Town')
town.people.create('Mayor')

const townAnimals = ['Sheep', 'Cow', 'Dog', 'Cat']
town.animals.create('Sheep')
town.animals.create('Cow')
town.animals.create('Dog')
town.animals.create('Cat')

town.animals.add(1, 'Dog')

town.evolve(({ animals }) => {
  console.log("town step!")
  // townAnimals.forEach(name => animals.add(animals.count(name), name))
})

const countryside = new Model('Country')
const countryAnimals = ['Fox', 'Bear', 'Wolf']
countryside.people.create('Old Buddy')
countryside.animals.create('Fox')
countryside.animals.create('Bear')
countryside.animals.create('Wolf')

countryside.animals.add(1, 'Wolf')

countryside.evolve(({ animals }) => {
  console.log("country step!")
  // town.animals.add(1, 'Dog')
  // countryside.animals.remove(1)
  // countryAnimals.forEach(name => animals.add(animals.count(name), name))
})

const region = new Assembly('Region')

region.models.add(town)
region.models.add(countryside)

export { region as village };

