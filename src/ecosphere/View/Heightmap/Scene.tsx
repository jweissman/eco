import React from "react";
// import from "@react-three/fiber"
import "@react-three/fiber";
// import { AsciiEffect } from 'three';
import { Lights } from "./Lights";
import Controls from "./Controls";
import Terrain from "./Terrain";
// import THREE from "three";


// export default Controls;
const Scene = ({ tiles }: { tiles: string[][] }) => (
  <>
    <Lights />
    <Controls />
    <Terrain tiles={tiles} />
  </>
);

export { Scene }
