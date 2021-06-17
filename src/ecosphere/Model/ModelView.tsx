import { Machine, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "./presentItem";

export function presentIndividual(work: { [key: number]: string }) {
  return ({ id, name }: { id: number, name: string }) => {
  return <li key={name} title={name} className='Item'>
    <span data-testid='Name'>{name}</span>
    <span data-testid='Status'>{work[id]}</span>
  </li>;
  }
}


export type ModelViewProps = {
  modelName: string;
  items: { name: string; amount: number; }[];
  animals: { name: string; amount: number }[];
  individuals: Person[];
  machines: Machine[];
  work: { [person: number]: string };
  lastChanges: LastDelta; //{ resources: { [elementName: string]: number }};
}

export function ModelView({
  modelName,
  items,
  individuals,
  machines,
  animals,
  lastChanges,
  work
}: ModelViewProps) {
  return <>
    <h4 aria-label='Model Title'>{modelName}</h4>
    <div>
      <h5>ITEMS</h5>
      <ul aria-label='Resources'>
        {items.map(presentItem(lastChanges.resources))}
      </ul>
    </div>
    <div>
      <h5>ANIMALS</h5>
      <ul aria-label='Animals'>
        {animals.map(presentItem(lastChanges.animals))}
      </ul>
    </div>
    <h5>INDIVIDUALS</h5>
    <ul aria-label='People'>
      {individuals.map(presentIndividual(work))} 
    </ul>
    <h5>MACHINES</h5>
    <ul>
      {machines.map(({ name }) => <li key={name}>{name}</li>)}
    </ul>
  </>;
}
