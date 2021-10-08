import React from "react";
import {useThree} from "@react-three/fiber";
import { Lights } from "./Lights";
import Controls from "./Controls";
import Terrain from "./Terrain";
// import Effects from "./Effects";
import { CubeTextureLoader } from "three";

export function skyboxTexture() {
  // const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    `${process.env.PUBLIC_URL}/1.jpg`,
    `${process.env.PUBLIC_URL}/2.jpg`,
    `${process.env.PUBLIC_URL}/3.jpg`,
    `${process.env.PUBLIC_URL}/4.jpg`,
    `${process.env.PUBLIC_URL}/5.jpg`,
    `${process.env.PUBLIC_URL}/6.jpg`
  ]);
  return texture
  // texture.side
  // texture.rend

  // Set the scene background property to the resulting texture.
  // scene.background = texture;
  // scene.frustumCulled = false
  // return <></>; //null; //<></>;
}

// export default Controls;
const Scene = ({
  tiles,
  tokens,
  tileColors,
  evolving,
  pointsOfInterest
}: {
  evolving: boolean,
  tiles: string[][],
  tileColors: { [tile: string]: string },
  pointsOfInterest: { [name: string]: [number,number] }
  tokens: { [name: string]: [number,number][] }
}) => {
  const { scene } = useThree();
  if (scene.background === null) {
    scene.background = skyboxTexture()
  }
  // const Fog = () => <fog attach="fog" args={['#eaeaea', 1, 256]} />
  return (
  <>
    <Lights />
    <Controls />
    <Terrain
      tiles={tiles}
      tokens={tokens}
      evolving={evolving}
      tileColors={tileColors}
      pointsOfInterest={pointsOfInterest}
    />
    {/* <Fog /> */}
    {/* <Effects /> */}
  </>
)
  };

export { Scene }
