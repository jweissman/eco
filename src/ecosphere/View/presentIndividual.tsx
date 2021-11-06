import { Concept } from "../Dictionary";
import { Stocks } from "../Stocks";
import { Item, ManageStocks } from "../types";
import { capitalize } from "../utils/capitalize";


export function presentIndividual(work: { [key: number]: string; }) {
  return ({ id, name, things, traits, items, nameConcepts, meters }: {
    id: number;
    name: string;
    // nameSignificance?: string;
    nameConcepts: Concept[]
    things: ManageStocks;
    items: Stocks<Item>;
    traits: ManageStocks;
    meters: () => { [key: string]: Function }
  }) => {
    const thingNames = things.list().map(thing => thing.name);
    const itemNames =  items.list().map(it => it.name)
    const significance = (nameConcepts.map(n => capitalize(n)).reverse()).reduce((left: string, right: string) => {
      if (right.startsWith('-')) { return left + right }
      if (left.startsWith('-') || right.endsWith('-')) { return right + left }
      return left + ' ' + right;
    }) //.join(' ').trim(); //.replaceAll('-', ''));

    return <li key={id} title={name} className='Item'>
      <div className='Title' data-testid='Name'>
        {name}
      </div>
      {significance && <div className='Subtitle' data-testid='Significance of Name' style={{ fontStyle: 'italic', fontSize:' 10pt' }}>
        {significance}
      </div>}
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

{/* <Tile title='Traits and Items'> */}
     {/* <b>Traits</b> */}
      {traits.list().length > 0 && <div className='Traits' data-testid='Trait Ranks'>
        <ul>
          {traits.list().map(trait => <li key={trait.id} style={{
              ...(traits.count(trait.name) === 0 ? { display: 'none' } : {})
            }}>
            {trait.name} <span data-testid={trait.name}>{traits.count(trait.name)}</span>
          </li>)}
        </ul>
      </div>}

{/* <br/>
     <b>Inventory</b> */}
      {thingNames.length > 0 && <div className='Things' data-testid='Inventory'>
        <ul>
          {thingNames.sort((a,b) => a > b ? 1 : -1).map(it => <li key={it} style={{
              ...(things.count(it) === 0 ? { display: 'none' } : {})
            }}>
            {it} <span data-testid={it}  className='Count'>{Math.floor(things.count(it))}</span>
          </li>)}
        </ul>
      </div>}

{/* <br/> */}
     {/* <b>Possessions</b> */}
      {itemNames.length > 0 && <div className='Items' data-testid='Possessions'>
        <ul>
          {itemNames.sort((a,b) => a > b ? 1 : -1).map(it => <li key={it} style={{
              // ...(items.count(it) === 0 ? { display: 'none' } : {})
            }}>
            {it} ({items.lookup(it).description})
            {items.lookup(it).quality && <small>&nbsp;<i>- {items.lookup(it).quality}</i></small>}
            {/* <span data-testid={it}  className='Count'>{Math.floor(things.count(it))}</span> */}
          </li>)}
        </ul>
      </div>}



{/* </Tile> */}

      
    </li>;
  };
}
