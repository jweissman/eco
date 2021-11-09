import React from "react";
import { Machine, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "../Model/presentItem";
import { Tile } from "./Tile";
import { presentCommunity } from "./presentCommunity";
import { Population } from "../Population";
import { Community } from "../Community";
import { capitalize } from '../utils/capitalize';
import { BoardPresenter, IBoard } from "./BoardPresenter";
import './View.css'
import { Moiety } from "../types/Person";

export type ModelViewProps = {
  modelName: string;
  resources: { name: string; amount: number; }[];
  animals: { name: string; amount: number }[];
  communities: Population<Moiety, Person>[];
  machines: Machine[];
  lastChanges: LastDelta;
  metrics: { [name: string]: number };
  notes: { [name: string]: string };
  board: IBoard
}

export function ModelView({
  modelName,
  resources,
  communities,
  machines,
  animals,
  lastChanges,
  metrics,
  notes,
  board,
}: ModelViewProps) {
  const folks = (communities as Community[]).map(presentCommunity)
  // console.log({ community: communities[0].list() })
  return <div className='Model' style={{ display: !!board.tiles.length ? 'block' : 'flex' }}>
    {/* <ViewHeightmap /> */}
    <h4 aria-label='Model Title' style={{display: 'none'}}>{modelName}</h4>
    {board.tiles.length > 0 && <BoardPresenter {...board} />}
    {resources.length > 0 && (<Tile title='Store'>
      <ul aria-label='Resources'>
        {resources.map(presentItem(lastChanges.resources))}
      </ul>
      
      {/* <ul aria-label='Resources'>
        {resources.map(presentItem(lastChanges.resources))}
      </ul> */}
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
    {Object.keys(notes).length > 0 && <div title='Notes'
      style={{
        overflow: 'scroll',
        height: '560px',
        // maxHeight: '340px'
      }}
    >
    <table>
      <tbody>
      {/* <tr> */}
        {
          Object.entries(notes).map(([name, value]) => name.startsWith('*')
            ? (
                <tr key={name} style={{textAlign: 'center'}} title={capitalize(name.replaceAll('*', ''))}>
                  <td colSpan={3}>
                    <b>{value}</b>
                  </td>
                </tr>
              )
            : (
                <tr key={name} title={name} >
                  <td key={name} style={{textAlign: 'right', color: 'gray' }}>
                    {name}
                  </td>
                  <td style={{width: '4px'}}></td>
                  <td style={{ minWidth: '180px', textAlign: 'left', fontSize: '15pt' }}>
                    <span data-testid='Description' style={{
                      ...(value.startsWith('*') && {color: 'lightgreen'}),
                      ...(value.startsWith('%') && {color: 'goldenrod'}),
                      ...(value.startsWith('~') && {color: 'darkgray'}),
                    }}>
                      {value.replaceAll('*','').replaceAll('%','').replaceAll('~','')}
                    </span>
                  </td>
                </tr>
              )
          )
        }

    </tbody>
    </table>
      {/* </tr> */}
    </div>}
  </div>;
}
