import { Engine } from "./Engine"
import { Inventory } from "./Inventory"
import { manageItems } from "./manageItems"
import { Manager } from "./Manager"
import { Substance, Individual, TimeEvolution, Machine, StepResult } from "./types"

export class Model {
  private ticks: number = 0
  private elements: Substance[] = []
  private machines: Machine[] = []
  private individuals: Individual[] = []
  private manager: Manager = new Manager(this)
  private inventory: Inventory = new Inventory(
    this.manager.lookup,
    this.manager.lookupById
  )
  private timeEvolution: TimeEvolution | null = null
  private engine: Engine = new Engine(this);

  constructor(public name: string) {}

  items = manageItems(this.inventory, this.manager, this.elements)
  people = {
    list: () => this.individuals,
    create: (name: string) => {
      const individualIds: number[] = this.elements.map(({ id }) => id);
      const id = Math.max(0,...individualIds)+1;
      const theIndividual = { id, name }
      // console.log(name)
      this.individuals.push(theIndividual)
      return theIndividual
    },
  }
  tools: {
    list: () => Machine[],
    create: (name: string) => Machine,
  } = { 
    list: () => this.machines,
    create: (name: string) => {
      const individualIds: number[] = this.elements.map(({ id }) => id);
      const id = Math.max(0,...individualIds)+1;
      const theMachine = { id, name }
      this.machines.push(theMachine)
      return theMachine
    }
  }

  evolve(timeEvolution: TimeEvolution): void {
    this.timeEvolution = timeEvolution
  }
 
  step(): StepResult {
    return this.engine.step(this.ticks++);
  }
  
  get evolution(): TimeEvolution {
    if (this.timeEvolution) {
      return this.timeEvolution
    }
    throw new Error("No time evolution defined")
  }
}

export default Model;
