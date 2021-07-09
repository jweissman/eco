import { Machine, ManageStocks, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "./presentItem";

// jsx -- javascript extensions -- permits xhtml literals in code :)
// tsx -- typing fragments that get erased as part of compile
export function presentIndividual(work: { [key: number]: string }) {
  return ({ id, name, things }: { id: number, name: string, things: ManageStocks }) => {
    // console.log(things.list())
    const itemNames = things.list().map(thing => thing.name)
    // console.log(itemNames)
  return <li key={name} title={name} className='Item'>
    <span data-testid='Name'>{name}</span>
    <span data-testid='Status'>{work[id]}</span>
    <span data-testid='Inventory'>
      <ul>
        {itemNames.map(it => <li key={it}>
          {it} <span data-testid={it}>{things.count(it)}</span>
        </li>)}
      </ul>
    </span>
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
