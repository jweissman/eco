import { prettyAmount } from "./prettyAmount";
import { Individual, Machine } from "./types";

type ModelViewProps = {
  modelName: string;
  items: { name: string; amount: number; }[];
  individuals: Individual[];
  machines: Machine[];
  lastInventoryChanges: { [elementName: string]: number };
}

export function ModelView({
  modelName,
  items,
  individuals,
  machines,
  lastInventoryChanges
}: ModelViewProps) {
  const presentItem = ({ name, amount }: { name: string, amount: number }) => <li key={name} title={name} className='Item'>
    <span data-testid='Item Name'>{name}</span>
    <span data-testid='Item Count'>
      {prettyAmount(amount)}
    </span>
    {lastInventoryChanges[name] && (
      <span className='delta' data-testid='Item Delta'>
        {lastInventoryChanges[name]}
      </span>
    )}
  </li>

  return <>
    <h4 aria-label='Model Title'>{modelName}</h4>

    <div>
      <h5>ITEMS</h5>
      <ul aria-label='Global Items'>
        {items.map(presentItem)}
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
