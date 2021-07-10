import { prettyAmount } from "../utils/prettyAmount";

export function presentItem(deltas?: { [elementName: string]: number; }) {
  return ({ name, amount }: { name: string; amount: number; }) => {
    const delta = deltas && deltas[name];
    return <li key={name} title={name} className='Item'>
      <span className='Title' data-testid='Name'>{name}</span>
      <span data-testid='Count'>
        {prettyAmount(amount)}
      </span>
      <span data-testid='Delta'>
        {delta}
      </span>
    </li>;
  };
}
