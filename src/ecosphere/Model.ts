import { Stocks } from "./Stocks"
import { Substance, Individual, Machine, StepResult, Animal } from "./types"
import { Population } from "./Population"
import { Delta } from "./Delta"
import { Registry } from "./Registry"
import { Simulation } from "./Simulation"
interface IModel {
  resources: Stocks<Substance>
  machines: Stocks<Machine>
  animals: Registry<Animal>
  people: Population<Individual>
  // jobAssignments: JobAssignment[]
}

export class Model extends Simulation implements IModel  {
  public resources = new Stocks<Substance>('resources')
  public machines = new Stocks<Machine>('machines')
  public animals = new Registry<Animal>('wildlife')
  public people = new Population<Individual>('people')

  // public jobs = new Population<Job>()
  // public jobAssignments: JobAssignment[] = []


  step(t: number = this.ticks++): StepResult {
    return this.apply(
      new Delta(this).evolve(t)
    )
  }

  // work(person: Individual, machine: Machine) {
  //   // const job = { personId: person.id, machineId: machine.id };
  //   // this.jobAssignments.push(job);
  //   throw new Error("not impl")
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

  get report() {
    const { resources, animals } = this
    return {
      resources: resources.report,
      animals: animals.report
    }
    // throw new Error("Method not implemented.")
  }
}

export default Model;
