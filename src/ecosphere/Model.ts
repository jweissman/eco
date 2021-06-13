import { Stocks } from "./Stocks"
import { Substance, Individual, TimeEvolution, Machine, StepResult } from "./types"
import { Population } from "./Population"
import { Delta } from "./Delta"

// type Job = { personId: number, machineId: number }

interface IModel {
  name: string
  resources: Stocks<Substance>
  machines: Stocks<Machine>
  people: Population<Individual>
  // jobs: Job[]
  evolution: TimeEvolution
}

export class Model implements IModel {
  public resources = new Stocks<Substance>('resources')
  public machines = new Stocks('machines')
  public people = new Population<Individual>()
  // public jobs: Job[] = []

  private ticks: number = 0
  private timeEvolution: TimeEvolution | null = null

  constructor(public name: string) {}

  set evolution(timeEvolution: TimeEvolution) { this.timeEvolution = timeEvolution }
  get evolution(): TimeEvolution {
    if (this.timeEvolution) { return this.timeEvolution }
    throw new Error("No time evolution defined")
  }

  step(t: number = this.ticks++): StepResult {
    return this.apply(
      new Delta(this).evolve(t)
    )
  }

  // work(person: Individual, machine: Machine) {
  //   const job = { personId: person.id, machineId: machine.id };
  //   this.jobs.push(job);
  // }

  private apply(delta: Delta) {
    const { add, list } = this.resources;
    const { storage: updated } = delta;
    const changed: { [elementName: string]: number; } = {};
    list.forEach(({ id, name }) => {
      if (updated[id]) {
        const deltaAmount = updated[id];
        add(deltaAmount, name);
        changed[name] = deltaAmount;
      }
    });
    return { changed };
  }
}

export default Model;
