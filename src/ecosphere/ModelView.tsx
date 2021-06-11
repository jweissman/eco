import { Individual } from './Model';

export function ModelView({ modelName, items, individuals }: { modelName: string; items: { name: string; amount: number; }[]; individuals: Individual[]; }) {
  return <>
    <h4>{modelName}</h4>

    <h5>ITEMS</h5>
    <ul>
      {items.map(({ name, amount }) => <li key={name}>{name}: {amount}</li>)}
    </ul>

    <h5>INDIVIDUALS</h5>
    <ul>
      {individuals.map(({ name }) => <li key={name}>{name}</li>)}
    </ul>
  </>;
}
