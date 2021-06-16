import { Machine, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "./presentItem";

export type ModelViewProps = {
  modelName: string;
  items: { name: string; amount: number; }[];
  animals: { name: string; amount: number }[];
  individuals: Person[];
  machines: Machine[];
  lastChanges: LastDelta; //{ resources: { [elementName: string]: number }};
}

export function ModelView({
  modelName,
  items,
  individuals,
  machines,
  animals,
  lastChanges
}: ModelViewProps) {
  return <>
    <h4 aria-label='Model Title'>{modelName}</h4>
    <div>
      <h5>ITEMS</h5>
      <ul aria-label='Global Items'>
        {items.map(presentItem(lastChanges.resources))}
      </ul>
    </div>
    <div>
      <h5>ANIMALS</h5>
      <ul aria-label='Global Animals'>
        {animals.map(presentItem(lastChanges.animals))}
      </ul>
    </div>
    <h5>INDIVIDUALS</h5>
    <ul>
      {individuals.map(({ name }) => <li key={name}>{name}</li>)}
    </ul>
    <h5>MACHINES</h5>
    <ul>
      {machines.map(({ name }) => <li key={name}>{name}</li>)}
    </ul>
  </>;
}
