import { prettyAmount } from "../utils/prettyAmount";
import { Machine, Person } from "../types";

type ModelViewProps = {
  modelName: string;
  items: { name: string; amount: number; }[];
  animals: { name: string; amount: number }[];
  individuals: Person[];
  machines: Machine[];
  lastInventoryChanges: { resources: { [elementName: string]: number }};
}

export function ModelView({
  modelName,
  items,
  individuals,
  machines,
  animals,
  lastInventoryChanges
}: ModelViewProps) {

  // console.log(lastInventoryChanges)
  // console.log(animals)
  const presentIt = (deltas?: { [elementName: string]: number }) => {
    // console.log(deltas)
    return ({ name, amount }: { name: string, amount: number }) => {
      // console.log(lastInventoryChanges, kind)
      const delta = deltas && deltas[name]
      // console.log(name, amount, delta)
      return <li key={name} title={name} className='Item'>
        <span data-testid='Name'>{name}</span>
        <span data-testid='Count'>
          {prettyAmount(amount)}
        </span>
        <span data-testid='Delta'>
          {delta}
        </span>
      </li>
    }
  }

  return <>
    <h4 aria-label='Model Title'>{modelName}</h4>

    <div>
      <h5>ITEMS</h5>
      <ul aria-label='Global Items'>
        {items.map(presentIt(lastInventoryChanges.resources))}
      </ul>
    </div>


    <div>
      <h5>ANIMALS</h5>
      <ul aria-label='Global Animals'>
        {animals.map(presentIt())}
      </ul>
    </div>

    <h5>INDIVIDUALS</h5>
    <ul>
      {individuals.map(({ name }) => <li key={name}>{name}</li>)}
    </ul>

    <h5>MACHINES</h5>
    <ul>
      {machines.map(({ name }) => <li key={name}>{name}</li>)}
    </ul>
  </>;
}
