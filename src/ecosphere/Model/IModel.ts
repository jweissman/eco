import { Substance, Machine, Animal, Species, Person, Moiety, Action, Policy } from "../types";
import { Stocks } from "../Stocks";
import { Registry } from "../Registry";
// import { Population } from "../Population";
import { ISimulation } from "./ISimulation";
import { Collection } from "../Collection";
import { Community } from "../Community";
import { Population } from "../Population";
import { Tiles } from "../Board";

export interface IModel extends ISimulation {
  currentPolicy?: Policy;
  choose(policyName: string, args: any): void;
  send(actionName: string, args: any): void;
  policies: Collection<Policy>;
  actions: Collection<Action>;
  resources: Stocks<Substance>;
  machines: Stocks<Machine>;
  animals: Registry<Species, Animal, Population<Species, Animal>>;
  people: Registry<Moiety, Person, Community>;
  metrics: { [key: string]: () => number };
  notes: { [key: string]: () => string };
  tiles: Tiles //string[][]
  tokens: { [name: string]: [number,number][] };
  tileColors?: { [tile: string]: string }
  tileInspect?(x: number, y: number): string;
  tilesEvolving?: boolean
  pointsOfInterest?: { [name: string]: [number, number] }
}
