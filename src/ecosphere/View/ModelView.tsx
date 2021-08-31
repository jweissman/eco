import { Machine, Moiety, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "../Model/presentItem";
import './View.css';
import { Tile } from "./Tile";
import { presentCommunity } from "./presentCommunity";
import { Population } from "../Population";
import { Community } from "../Community";

export type ModelViewProps = {
  modelName: string;
  items: { name: string; amount: number; }[];
  animals: { name: string; amount: number }[];
  communities: Population<Moiety, Person>[];
  machines: Machine[];
  lastChanges: LastDelta;
  metrics: { [name: string]: number }; //[ { name: string, value: number} ];
  notes: { [name: string]: string }; //[ { name: string, value: number} ];
  board: IBoard
}

interface IBoard { tiles: string[][], tileColors: { [tile: string]: string } }

const Board = ({ tiles, tileColors }: IBoard) => <>
  <table style={{
    fontFamily: 'monospace',
    //fontFamily: "Source Code Pro", "Fira Code", "Inconsolata", Menlo, Monaco, "Courier New", monospace',
    // fontWeight: 'bold',
    // fontSize: '12pt'
  }}>
    <tbody>
      {tiles.map((row: string[], y: number) =>
        <tr key={`row-${y}`}>
          {row.map((cell: string, x: number) =>
            <td style={{ color: tileColors[cell] }} key={`cell-${x}-${y}}`}>{cell}</td>
          )}
        </tr>
      )}
    </tbody>
  </table>
</>

export function ModelView({
  modelName,
  items,
  // individuals,
  communities,
  machines,
  animals,
  lastChanges,
  metrics,
  notes,
  board,
  // work
}: ModelViewProps) {
  const folks = (communities as Community[]).map(presentCommunity)
  // console.log({ community: communities[0].list() })
  return <div className='Model'>
    <h4 aria-label='Model Title' style={{display: 'none'}}>{modelName}</h4>
    {board.tiles.length > 0 && <Board tiles={board.tiles} tileColors={board.tileColors} />}
    {items.length > 0 && (<Tile title='Items'>
      <ul aria-label='Resources'>
        {items.map(presentItem(lastChanges.resources))}
      </ul>
    </Tile>)}
    {animals.length > 0 && (
      <Tile title='Animals'>
        <ul aria-label='Animals'>
          {animals.map(presentItem(lastChanges.animals))}
        </ul>
      </Tile>)}
      {communities.length > 0 && <div title='Individuals' style={{display: 'flex'}}>{folks}</div>}
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
    {Object.keys(notes).length > 0 && <Tile title='Notes'>
      <ul>
        {Object.entries(notes).map(([name, value]) => <li title={name} key={name}>
          {name}
          <span data-testid='Description'>{value}</span>
        </li>)}
      </ul>
    </Tile>}
  </div>;
}
