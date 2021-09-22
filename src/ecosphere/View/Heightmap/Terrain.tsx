import React, { useState } from 'react';
import { DataTexture, LuminanceFormat, UnsignedByteType } from "three";
import { useFrame } from '@react-three/fiber';
const Terrain = ({ tiles }: { tiles: string[][] }) => {
  const [mesh, set] = useState()
  useFrame(() => {
    if (mesh) { (mesh as any).rotation.z += 0.01; }
  });
  tiles = tiles || []

  var width = tiles[0].length,
  height = tiles.length;
  const data = new Uint8Array(width * height);
  // }
   for(var y = 0; y < height-1; y++) {
     for(var x = 0; x < width-1; x++) {
         var pos = (y * width + x)// * 4; // position in buffer based on x and y
         let value = 1 + parseInt(tiles[y][x] || '0', 10);
         data[pos] = value * 25
     }
    }
  
  
  const texture = new DataTexture(data, width, height, LuminanceFormat, UnsignedByteType);
  // texture.depthTest

  const geometry = 
      <planeBufferGeometry attach="geometry" args={[
        width, height,
        width, height
      ]} />
  return <>
    <mesh
      ref={set}
      rotation={[-Math.PI/3,0,0]}
      scale={0.6}
    >
      {geometry}
       
      <meshPhongMaterial
        attach="material"
        color={"hotpink"}
        map={texture}
        displacementMap={texture}
        displacementScale={5}
        shininess={2}
        flatShading
      />
    </mesh>
  </>;
};  

export default Terrain;
