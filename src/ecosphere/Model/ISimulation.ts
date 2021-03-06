import { IList } from "../../collections/types";
import { StepResult, TimeEvolution } from "../types";

export interface ISimulation {
  name: string;
  dynamics: IList<TimeEvolution>;
  report: { [key: string]: { [key: string]: number; }; };
  evolve(tickFn: TimeEvolution): void;
  step(): StepResult;
}
