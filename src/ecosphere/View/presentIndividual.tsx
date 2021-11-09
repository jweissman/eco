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
    }, '') //.join(' ').trim(); //.replaceAll('-', ''));

    const showThings = true, showTraits = false

    return <li key={id} title={name} className='Item' style={{display: 'flex', flexDirection: 'column', width: '500px'}}>
      <div className='Title' data-testid='Name'>
        {name}
      </div>
      {significance && <div className='Subtitle' data-testid='Significance of Name' style={{ fontStyle: 'italic', fontSize:' 10pt' }}>
        {significance}
      </div>}
      <div className='Meters' style={{ padding: '1px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Object.entries(meters()).map(([meterName, measure]) => {
        const { value, max } = measure()
        return <div className='Meter' data-testid={meterName} style={{display: 'flex', width: '100px', flexDirection: 'row', flexWrap: 'wrap', padding: '2px'}}>
          <label htmlFor={meterName} style={{fontSize: '8.5pt', color: 'white', fontWeight: 'lighter', textTransform: 'uppercase', paddingRight: '8px'}}>{meterName}</label>
          <meter id={meterName}
                 style={{ width:100, height: 14 }}
                 min="0" max={max}
                 low={max * 0.33} high={max * 0.66} optimum={max * 0.8}
                 value={value}>
              at {value}/{max}
          </meter>
        </div>
      })}
      </div>
      {work[id] && <span data-testid='Status' style={{ display: 'none' }}>{work[id]}</span>}
      {traits.list().length > 0 && <div className='Traits' data-testid='Trait Ranks' style={{ display: showTraits ? 'block' : 'none' }}>
        <ul>
          {traits.list().map(trait => <li key={trait.id} style={{
              ...(traits.count(trait.name) === 0 ? { display: 'none' } : {})
            }}>
            <b>{trait.name}</b>
            <span data-testid={trait.name}>{traits.count(trait.name)}</span>
          </li>)}
        </ul>
      </div>}
      {itemNames.length > 0 && <div className='Items' data-testid='Possessions'>
        <ul>
          {itemNames.sort((a,b) => a > b ? 1 : -1).map(it => <li key={it} style={{
            fontSize: '9pt',
            display: 'flex',
            flexDirection: 'column',
            }}>
              <div>
              <span style={{color:'lightgray'}} title={items.lookup(it).description}>- {it}</span>
              &nbsp;
              <span style={{fontSize: '6.5pt'}}>
                {items.lookup(it).description}
                &nbsp;
                <span style={{color:'darkslategray'}}>
                  ({items.lookup(it).quality && items.lookup(it).quality})
                </span>
              </span>
              </div>
              {items.lookup(it).longDescription &&
              <div style={{fontSize: '6pt', color: '#50403c', padding: '4px', marginBottom: '8px', width: '180px', textAlign: 'justify', alignSelf: 'center'}}>
                {items.lookup(it).longDescription}
              </div>}
          </li>)}
        </ul>
      </div>}
      {thingNames.length > 0 && <div className='Things' data-testid='Inventory' style={{ display: showThings ? 'block' : 'none' }}>
        <ul>
          {thingNames.sort((a,b) => a > b ? 1 : -1).map(it => <li key={it} style={{
              ...(things.count(it) === 0 ? { display: 'none' } : {})
            }}>
            {it} <span data-testid={it}  className='Count'>{Math.floor(things.count(it))}</span>
          </li>)}
        </ul>
      </div>}


      
    </li>;
  };
}
