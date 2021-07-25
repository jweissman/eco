import { ManageStocks } from "../types";


export function presentIndividual(work: { [key: number]: string; }) {
  return ({ id, name, things, traits }: {
    id: number;
    name: string;
    things: ManageStocks;
    traits: ManageStocks;
  }) => {
    const itemNames = things.list().map(thing => thing.name);
    return <li key={id} title={name} className='Item'>
      <div className='Title' data-testid='Name'>{name}</div>
      {work[id] && work[id] !== '?' && <span data-testid='Status'>{work[id]}</span>}
      {itemNames.length > 0 && <div className='Subitems' data-testid='Inventory'>
        <ul>
          {itemNames.sort((a,b) => a > b ? 1 : -1).map(it => <li key={it} style={{
              ...(things.count(it) === 0 ? { display: 'none' } : {})
            }}>
            {it} <span data-testid={it}  className='Count'>{things.count(it)}</span>
          </li>)}
        </ul>
      </div>}

      {traits.list().length > 0 && <div className='Traits' data-testid='Trait Ranks'>
        <ul>
          {traits.list().map(trait => <li key={trait.id} style={{
              ...(traits.count(trait.name) === 0 ? { display: 'none' } : {})
            }}>
            {trait.name} <span data-testid={trait.name}>{traits.count(trait.name)}</span>
          </li>)}
        </ul>
      </div>}

    </li>;
  };
}
