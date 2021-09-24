// import React, { useState } from 'react';

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
// import ReactTooltip from 'react-tooltip';

import { Machine, Moiety, Person } from "../types";
import { LastDelta } from "../../ModelPresenter";
import { presentItem } from "../Model/presentItem";
import { Tile } from "./Tile";
import { presentCommunity } from "./presentCommunity";
import { Population } from "../Population";
import { Community } from "../Community";
import { capitalize } from '../utils/capitalize';

// import './View.css';
import { Scene } from "./Heightmap/Scene";
import { BoardView } from "./BoardView";

export type ModelViewProps = {
  modelName: string;
  items: { name: string; amount: number; }[];
  animals: { name: string; amount: number }[];
  communities: Population<Moiety, Person>[];
  machines: Machine[];
  lastChanges: LastDelta;
  metrics: { [name: string]: number };
  notes: { [name: string]: string };
  board: IBoard
}

const ViewHeightmapThree = ({ tileColors, isBoardEvolving, tiles }: { tileColors: { [tile: string]: string }, isBoardEvolving: boolean, tiles: string[][] }) => {
return <>
  <Canvas
     camera={{ zoom: 1, position: [0,10,0], near: 0.3 }}
  >
    <Suspense
      fallback={<div className="loading">Loading</div>}
    >
    </Suspense>
    <Scene tiles={tiles} evolving={isBoardEvolving} tileColors={tileColors} />
    
  </Canvas>
</>
}
 

interface IBoard { evolving: boolean, tiles: string[][], tileColors: { [tile: string]: string }, tileInspect: (x: number, y: number) => string}


const BoardTable = ({ tiles, tileColors, tileInspect, evolving }: IBoard) => {
  const [inspecting, setInspecting] = useState([-1,-1]);
  const message = inspecting[0] > 0 && inspecting[1] > 0
    ? tileInspect(inspecting[0], inspecting[1]).split("\n").join("<br/>")
    : '' //<>--</>
  // if (message) console.log(message)

  const renderView = !(process.env.NODE_ENV === 'test');
  const renderMap = !evolving || tiles.length-1 <= 64; //false; //!(process.env.NODE_ENV === 'test');
  return <div style={{ width: '100vw', height: '70vh', display: 'flex' }}>
    {renderView && <ViewHeightmapThree isBoardEvolving={evolving} tiles={tiles} tileColors={tileColors} />}
    {renderMap && <BoardView
      tileColors={tileColors}
      message={message}
      setInspecting={setInspecting}
      inspecting={inspecting as [number, number]}
      tiles={tiles}
      />}
  </div>
}

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
    {/* <ViewHeightmap /> */}
    <h4 aria-label='Model Title' style={{display: 'none'}}>{modelName}</h4>
    {board.tiles.length > 0 && <BoardTable {...board} />}
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
    {Object.keys(notes).length > 0 && <div title='Notes'
      style={{
        overflow: 'scroll',
        maxHeight: '640px'
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
