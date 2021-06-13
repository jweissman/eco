import { BasicEntity } from "./BasicEntity";
import { Collection, IList, SimpleCollection } from "./Collection";
import { Delta } from "./Delta";
import { StepResult, TimeEvolution } from "./types";

interface ISimulation {
  name: string
  dynamics: TimeEvolution
  // dynamism: ()
}

export abstract class Simulation<T extends BasicEntity> implements ISimulation {
  protected ticks: number = 0;
  private evolution: TimeEvolution | null = null;
  // public dynamics = new SimpleCollection<TimeEvolution>()
  constructor(public name: string) { }
  set dynamics(timeEvolution: TimeEvolution) { this.evolution = timeEvolution; }
  get dynamics(): TimeEvolution {
    if (this.evolution) { return this.evolution; }
    throw new Error("No time evolution defined");
  }
  step(t: number = this.ticks++): StepResult {
    return this.apply(this.delta.evolve(t))
  }
  protected abstract get delta(): Delta<T>;
  protected abstract apply(delta: Delta<T>): StepResult;
}
