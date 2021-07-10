import { Machine, ManageStocks, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "../Model/presentItem";
import './View.css';
import { Tile } from "./Tile";

export function presentIndividual(work: { [key: number]: string }) {
  return ({ id, name, things }: { id: number, name: string, things: ManageStocks }) => {
  const itemNames = things.list().map(thing => thing.name)
  return <li key={id} title={name} className='Item'>
    <div className='Title' data-testid='Name'>{name}</div>
    {work[id] && <span data-testid='Status'>{work[id]}</span>}
    {itemNames.length > 0 && <div className='Subitems' data-testid='Inventory'>
      <ul>
        {itemNames.map(it => <li key={it}>
          {it} <span data-testid={it} className='Count'>{things.count(it)}</span>
        </li>)}
      </ul>
    </div>}
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
  lastChanges: LastDelta;
  metrics: { [name: string]: number }; //[ { name: string, value: number} ];
}

export function View({
  modelName,
  items,
  individuals,
  machines,
  animals,
  lastChanges,
  metrics,
  work
}: ModelViewProps) {
  return <div className='Model'>
    <h4 aria-label='Model Title' style={{display: 'none'}}>{modelName}</h4>
    <Tile title='Items'>
      <ul aria-label='Resources'>
        {items.map(presentItem(lastChanges.resources))}
      </ul>
    </Tile>
    {animals.length > 0 && (
      <Tile title='Animals'>
        <ul aria-label='Animals'>
          {animals.map(presentItem(lastChanges.animals))}
        </ul>
      </Tile>)}
    {individuals.length > 0 && <Tile title='Individuals'>
      <ul aria-label='People'>
        {individuals.map(presentIndividual(work))}
      </ul>
    </Tile>}
    {machines.length > 0 && <Tile title='Machines'>
      <ul>
        {machines.map(({ name }) => <li key={name}>{name}</li>)}
      </ul>
    </Tile>}
    {Object.keys(metrics).length > 0 && <Tile title='Metrics'>
      <ul>
        {Object.entries(metrics).map(([name, value]) => <li title={name} key={name}>
          {name}
          <span data-testid='Count'>{value}</span>
        </li>)}
      </ul>
    </Tile>}
  </div>;
}
