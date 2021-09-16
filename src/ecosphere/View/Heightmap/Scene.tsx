import React from "react";
// import from "@react-three/fiber"
import "@react-three/fiber";
import { Lights } from "./Lights";
import Controls from "./Controls";
import Terrain from "./Terrain";


// export default Controls;
const Scene = () => (
  <>
    <Lights />
    <Controls />
    <Terrain tiles={[]} />
  </>
);

export { Scene }
