import { Substance, Machine, Animal, Species } from "../types"
import { Stocks } from "../Stocks"
import { Registry } from "../Registry"
import { Simulation } from "./Simulation"
import { IModel } from "./IModel"
import { Community } from '../Community'

export class Model extends Simulation implements IModel  {
  public people    = new Community('people')

  public resources = new Stocks<Substance>('resources')
  public animals   = new Registry<Species, Animal>('wildlife')
  public machines  = new Stocks<Machine>('machines')

  // stocks or registries to expose for evolution (will also track deltas)
  tracking = [ 'animals', 'resources' ]

  reset() {
    this.resources.clear()
    this.machines.clear()
    this.animals.clear()
    this.dynamics.clear()
  }



}

export default Model;
