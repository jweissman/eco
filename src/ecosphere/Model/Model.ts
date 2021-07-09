import { Substance, Machine, Animal, Species, Action, Policy } from "../types"
import { Stocks } from "../Stocks"
import { Registry } from "../Registry"
import { Simulation } from "./Simulation"
import { IModel } from "./IModel"
import { Community } from '../Community'
import { Collection } from "../Collection"

export class Model extends Simulation implements IModel  {
  public people    = new Community('people')
  public resources = new Stocks<Substance>('resources')
  public machines  = new Stocks<Machine>('machines')

  // do 'animals' really belong on a general model...? (if i keep asking that q we end up with no people/machines either)
  public animals   = new Registry<Species, Animal>('wildlife')

  // stocks or registries to expose for evolution (will also track deltas)
  tracking = [ 'animals', 'resources' ]

  reset() {
    this.resources.clear()
    this.machines.clear()
    this.animals.clear()
    this.dynamics.clear()
  }

  // interactive elements
  public actions: Collection<Action> = new Collection<Action>()
  public policies: Collection<Policy> = new Collection<Policy>()

  send(actionName: string, args: any): void {
    const action = this.actions.lookup(actionName) //[actionName]

    if (action) {
      action.act(args)
    } else {
      throw new Error(`No such action ${actionName}`)
    }
  }

  currentPolicy: Policy | null = null
  choose(policyName: string): void {
    // console.log("[Model.choose]", policyName)
    const policy = this.policies.lookup(policyName)
    if (policy) {
      this.currentPolicy = policy
    } else {
      throw new Error(`No such policy ${policyName}`)
    }
  }

  public step() {
    if (this.currentPolicy) {
      // console.log("MANAGING", { policy: this.currentPolicy })
      this.currentPolicy.manage()
    }
    return super.step()
  }
}

export default Model;
