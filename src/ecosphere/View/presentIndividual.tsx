import { ManageStocks } from "../types";


export function presentIndividual(work: { [key: number]: string; }) {
  return ({ id, name, things }: { id: number; name: string; things: ManageStocks; }) => {
    const itemNames = things.list().map(thing => thing.name);
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
  };
}
