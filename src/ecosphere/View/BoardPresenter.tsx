import React from 'react';
import { BoardTableView } from "./BoardTableView";
import { HeightmapCanvas } from "./Heightmap/Canvas";
export interface IBoard { evolving: boolean, tiles: string[][], tileColors: { [tile: string]: string }, tileInspect: (x: number, y: number) => string}

export const BoardPresenter = ({ tiles, tileColors, tileInspect, evolving }: IBoard) => {
  let largeMap = tiles.length-1 > 64
  const showThreeScene = !!largeMap //!(process.env.NODE_ENV === 'test');
  const showCartogram = !showThreeScene //|| (!evolving); //false; //!(process.env.NODE_ENV === 'test');
  const isMapCondensed = true
  return <div style={{ width: '100vw', height: '70vh', display: 'flex' }}>
    {showThreeScene && <HeightmapCanvas
      isBoardEvolving={evolving}
      tiles={tiles}
      tileColors={tileColors}
    />}
    {showCartogram && <BoardTableView
      tileColors={tileColors}
      tileInspect={tileInspect}
      tiles={tiles}
      condensed={isMapCondensed}
      />}
  </div>
}
