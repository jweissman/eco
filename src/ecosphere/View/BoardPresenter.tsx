import React from 'react';
import { BoardTableView } from "./BoardTableView";
import { HeightmapCanvas } from "./Heightmap/HeightmapCanvas";
export interface IBoard {
  evolving: boolean;
  tiles: string[][];
  tileColors: { [tile: string]: string };
  tileInspect: (x: number, y: number) => string;
  pointsOfInterest: { [name: string]: [number, number] };
}

export const BoardPresenter = ({ tiles, tileColors, tileInspect, evolving, pointsOfInterest }: IBoard) => {
  let largeMap = tiles.length-1 > 64
  const showThreeScene = !!largeMap //!(process.env.NODE_ENV === 'test');
  const showCartogram = !showThreeScene //|| (!evolving); //false; //!(process.env.NODE_ENV === 'test');
  const isMapCondensed = false
  return <div style={{ width: '100vw', height: '70vh'}}>
    {showThreeScene && <HeightmapCanvas
      isBoardEvolving={evolving}
      tiles={tiles}
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
