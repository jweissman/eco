import { Substance, Machine, Animal, Species, Action, Policy, Moiety, Person } from "../types"
import { Stocks } from "../Stocks"
import { Registry } from "../Registry"
import { Simulation } from "./Simulation"
import { IModel } from "./IModel"
import { Collection } from "../Collection"
import { Community } from "../Community"
import { Population } from "../Population"
import { Tiles } from "../Board"

type Fauna = Population<Species, Animal>
export class Model extends Simulation implements IModel  {
  tracking = [ 'animals', 'resources' ]
  get tiles(): Tiles { return [] }

  public people = new Registry<Moiety, Person, Community>('people', Community)
  public resources = new Stocks<Substance>('resources')
  public machines  = new Stocks<Machine>('machines')
  public animals   = new Registry<Species, Animal, Fauna>('wildlife', Population)

  reset() {
    this.resources.clear()
    this.machines.clear()
    this.animals.clear()
    this.people.clear()
    this.dynamics.clear()
  }

  // measurements
  public metrics: { [name: string]: () => number } = {}
  public notes: { [name: string]: () => string } = {}

  // interactive elements
  public actions: Collection<Action> = new Collection<Action>()
  public policies: Collection<Policy> = new Collection<Policy>()

  send(actionName: string, args: any): void {
    const action = this.actions.lookup(actionName)

    if (action) {
      action.act(args)
    } else {
      throw new Error(`No such action ${actionName}`)
    }
  }

  currentPolicy: Policy | undefined
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
