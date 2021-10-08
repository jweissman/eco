import React from 'react';
import { BoardTableView } from "./BoardTableView";
import { HeightmapCanvas } from "./Heightmap/HeightmapCanvas";
export interface IBoard {
  evolving: boolean;
  tiles: string[][];
  tokens: { [token: string]: [number,number][] }; // the idea is tokens have a name + position..
  tileColors: { [tile: string]: string };
  tileInspect: (x: number, y: number) => string;
  pointsOfInterest: { [name: string]: [number, number] };
  // trees: 
  // entities: 
  // heightmap?: number[][];
}

export const BoardPresenter = ({ tiles, tileColors, tileInspect, evolving, pointsOfInterest, tokens }: IBoard) => {
  let largeMap = tiles.length-1 > 32
  const showThreeScene = !!largeMap //!(process.env.NODE_ENV === 'test');
  const showCartogram = !showThreeScene //|| (!evolving); //false; //!(process.env.NODE_ENV === 'test');
  const isMapCondensed = false
  return <div style={{ width: '100vw', height: '70vh'}}>
    {showThreeScene && <HeightmapCanvas
      isBoardEvolving={evolving}
      tiles={tiles}
      // todo ... heightmap={heightmap}
      tokens={tokens}
      tileColors={tileColors}
      pointsOfInterest={pointsOfInterest}
    />}
    {showCartogram && <BoardTableView
      tileColors={tileColors}
      tileInspect={tileInspect}
      tiles={tiles}
      condensed={isMapCondensed}
      />}
  </div>
}
