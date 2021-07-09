import { Machine, ManageStocks, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "../Model/presentItem";
import './View.css';

export function presentIndividual(work: { [key: number]: string }) {
  return ({ id, name, things }: { id: number, name: string, things: ManageStocks }) => {
  const itemNames = things.list().map(thing => thing.name)
  return <li key={id} title={name} className='Item'>
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
  lastChanges: LastDelta;
}

const Tile: React.FC<{ title: string }> = ({ children, title }: { children?: React.ReactNode, title: string}) => {
  return <div className={title}>
    <h5>{title}</h5>
    {children}
  </div>
}

export function View({
  modelName,
  items,
  individuals,
  machines,
  animals,
  lastChanges,
  work
}: ModelViewProps) {
  return <div className='Model'>
    <h4 aria-label='Model Title'>{modelName}</h4>
    <Tile title='Items'>
      <ul aria-label='Resources'>
        {items.map(presentItem(lastChanges.resources))}
      </ul>
    </Tile>
    <Tile title='Animals'>
      <ul aria-label='Animals'>
        {animals.map(presentItem(lastChanges.animals))}
      </ul>
    </Tile>
    <div className='Tile'>
    <h5>INDIVIDUALS</h5>
    <ul aria-label='People'>
      {individuals.map(presentIndividual(work))} 
    </ul>
    </div>
    <div className='Tile'>
    <h5>MACHINES</h5>
    <ul>
      {machines.map(({ name }) => <li key={name}>{name}</li>)}
    </ul>
    </div>
  </div>;
}
