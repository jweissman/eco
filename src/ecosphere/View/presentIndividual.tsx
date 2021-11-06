import { ManageStocks } from "../types";


export function presentIndividual(work: { [key: number]: string; }) {
  return ({ id, name, things, traits, meters }: {
    id: number;
    name: string;
    things: ManageStocks;
    traits: ManageStocks;
    meters: () => { [key: string]: Function }
  }) => {
    const itemNames = things.list().map(thing => thing.name);
    return <li key={id} title={name} className='Item'>
      <div className='Title' data-testid='Name'>{name}</div>
      {Object.entries(meters()).map(([meterName, measure]) => {
        const { value, max } = measure()
        return <div className='Meter' data-testid={meterName}>
          <label htmlFor={meterName} style={{paddingRight: 10}}>{meterName}:</label>
          <meter id={meterName}
                 style={{ width: 130, height: 14 }}
                 min="0" max={max}
                 low={max * 0.33} high={max * 0.66} optimum={max * 0.8}
                 value={value}>
              at {value}/{max}
          </meter>
        </div>
      })}
      {work[id] && <span data-testid='Status' style={{ display: 'none' }}>{work[id]}</span>}
      {itemNames.length > 0 && <div className='Subitems' data-testid='Inventory'>
        <ul>
          {itemNames.sort((a,b) => a > b ? 1 : -1).map(it => <li key={it} style={{
              ...(things.count(it) === 0 ? { display: 'none' } : {})
            }}>
            {it} <span data-testid={it}  className='Count'>{Math.floor(things.count(it))}</span>
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
