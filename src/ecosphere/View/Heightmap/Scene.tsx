import React from "react";
import "@react-three/fiber";
import { Lights } from "./Lights";
import Controls from "./Controls";
import Terrain from "./Terrain";
import Effects from "./Effects";

// export default Controls;
const Scene = ({ tileColors, tiles, evolving }: { evolving: boolean, tiles: string[][], tileColors: { [tile: string]: string } }) => (
  <>
    <Lights />
    <Controls />
    <Terrain tiles={tiles} evolving={evolving} tileColors={tileColors} />
    <Effects />
  </>
);

export { Scene }
