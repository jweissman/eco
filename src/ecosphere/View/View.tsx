import { Machine, ManageStocks, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "../Model/presentItem";
import './View.css';
import { Tile } from "./Tile";
import { Community } from "../Community";

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
export function presentCommunity(community: Community) {
      // console.log(community.name);
      return <Tile title={community.name} key={community.id}>
        {/* <h6>{community.name}</h6> */}
        <ul aria-label='People'>
          {community.list().map(presentIndividual(community.report))}
        </ul>
      </Tile>;
    }

export type ModelViewProps = {
  modelName: string;
  items: { name: string; amount: number; }[];
  animals: { name: string; amount: number }[];
  // individuals: Person[];
  communities: Community[]; //{ [name:]}
  machines: Machine[];
  // work: { [person: number]: string };
  lastChanges: LastDelta;
  metrics: { [name: string]: number }; //[ { name: string, value: number} ];
}

export function View({
  modelName,
  items,
  // individuals,
  communities,
  machines,
  animals,
  lastChanges,
  metrics,
  // work
}: ModelViewProps) {
  const folks = communities.map(presentCommunity)
  // console.log({ community: communities[0].list() })
  return <div className='Model'>
    <h4 aria-label='Model Title' style={{display: 'none'}}>{modelName}</h4>
    <Tile title='Items'>
      <ul aria-label='Resources'>
        {items.map(presentItem(lastChanges.resources))}
      </ul>
    </Tile>
    {(
      <Tile title='Animals'>
        <ul aria-label='Animals'>
          {animals.map(presentItem(lastChanges.animals))}
        </ul>
      </Tile>)}
      {communities.length > 0 && <div title='Individuals'>{folks}</div>}
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
