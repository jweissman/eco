import { IList, SimpleCollection } from "./Collection";
import { StepResult, TimeEvolution } from "./types";

interface ISimulation {
  name: string
  dynamics: IList<TimeEvolution>
}

export abstract class Simulation implements ISimulation {
  protected ticks: number = 0;
  public dynamics = new SimpleCollection<TimeEvolution>()
  constructor(public name: string) { }
  protected abstract step(t: number): StepResult
}
