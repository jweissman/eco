// import React, { useState } from 'react';

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import ReactTooltip from 'react-tooltip';

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

const ViewHeightmapThree = ({ fullscreen, tiles }: { fullscreen: boolean, tiles: string[][] }) => <>
  <Canvas style={{ flex: 3 }} camera={{ zoom: 1, position: [0,100,0]}}>
    <Suspense
      fallback={<div className="loading">Loading</div>}
    >
    </Suspense>
    <Scene tiles={tiles} />
  </Canvas>
</>
 

interface IBoard { tiles: string[][], tileColors: { [tile: string]: string }, tileInspect: (x: number, y: number) => string}


const BoardTable = ({ tiles, tileColors, tileInspect }: IBoard) => {
  const [inspecting, setInspecting] = useState([-1,-1]);
  const message = inspecting[0] > 0 && inspecting[1] > 0
    ? tileInspect(inspecting[0], inspecting[1]).split("\n").join("<br/>")
    : <>--</>

  const renderView = !(process.env.NODE_ENV === 'test');
  const renderMap = true; //!(process.env.NODE_ENV === 'test');
  return <div style={{ width: '100vw', height: '76vh', display: 'flex' }}>
    <ReactTooltip multiline />
    {renderView && <ViewHeightmapThree fullscreen={true} tiles={tiles} />}
    {renderMap && <table style={{
      fontFamily: '"Source Code Pro", "Fira Code", "Inconsolata", Menlo, Monaco, "Courier New", monospace',
      fontSize: '3px',
      cursor: 'pointer',
      userSelect: 'none',
      overflow: 'hidden',
      // flex: 0.2,
      // border: 'none',
      // maxWidth: '400px',
      // width: '400px',
      // height: '800px'
    }}>
      <tbody>
        {tiles.map((row: string[], y: number) =>
          <tr key={`row-${y}`}>
            {row.map((cell: string, x: number) =>
              <td
                style={{
                  // highlight cell errors..
                  // color: tileInspect(x,y).match(/error/) ? 'red' : tileColors[cell],
                  // maxWidth: '4px',
                  // maxHeight: '2px',
                  // border: 'black',
                  // border: 'none',
                  // margin: 'none',
                  // color: tileColors[cell],
                  width: '2px', height: '2px',
                  backgroundColor: inspecting[0] === x && inspecting[1] === y ? 'white': tileColors[cell]
                }}
                key={`cell-${x}-${y}}`}
                onMouseEnter={() => setInspecting([x,y])}
                onMouseLeave={() => setInspecting([-1,-1])}
                data-tip={inspecting[0] === x && inspecting[1] === y ? message : ''}
                // data-html
              >
                {/* {cell} */}
                </td>
            )}
          </tr>
        )}
      </tbody>
    </table>}
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
