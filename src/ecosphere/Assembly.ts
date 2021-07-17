import { List } from "../collections";
import Model from "./Model";

export interface IAssembly {
  name: string
  models: List<Model>
}

export class Assembly implements IAssembly {
  models = new List<Model>();
  constructor(public name: string) {}
}
