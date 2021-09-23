import React from "react";
import "@react-three/fiber";
import { Lights } from "./Lights";
import Controls from "./Controls";
import Terrain from "./Terrain";
import Effects from "./Effects";

// export default Controls;
const Scene = ({ tiles }: { tiles: string[][] }) => (
  <>
    <Lights />
    <Controls />
    <Terrain tiles={tiles} />
    <Effects />
  </>
);

export { Scene }
