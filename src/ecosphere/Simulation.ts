import { TimeEvolution } from "./types";

interface ISimulation {
  name: string
  dynamics: TimeEvolution
}

export abstract class Simulation implements ISimulation {
  protected ticks: number = 0;
  private timeEvolution: TimeEvolution | null = null;
  constructor(public name: string) { }
  set dynamics(timeEvolution: TimeEvolution) { this.timeEvolution = timeEvolution; }
  get dynamics(): TimeEvolution {
    if (this.timeEvolution) { return this.timeEvolution; }
    throw new Error("No time evolution defined");
  }
}
