import React, { useState } from 'react';
import { DataTexture, LuminanceFormat, UnsignedByteType } from "three";
import { useFrame } from '@react-three/fiber';

// function generateTexture(tiles: string[][]): ImageData {
//   const canvas = document.createElement('canvas') //getElementById('debug-canvas') as any
//   const c = canvas.getContext('2d') as CanvasRenderingContext2D
  
//   c.fillStyle = 'black'
//   c.fillRect(0,0,canvas.width, canvas.height)

//   for(let i=0; i<canvas.width; i++) {
//       for(let j=0; j<canvas.height; j++) {
//           let v: number =  parseInt(tiles[j][i], 10)
//           //octave(i/canvas.width,j/canvas.height,16)
//           const per = (100*v).toFixed(2)+'%'
//           c.fillStyle = `rgb(${per},${per},${per})`
//           c.fillRect(i,j,1,1)
//       }
//   }
//   return c.getImageData(0,0,canvas.width,canvas.height)
// }

const Terrain = ({ tiles }: { tiles: string[][] }) => { //[number,number][] }) => {
  const [mesh, set] = useState()
  useFrame(() => {
    if (mesh) { (mesh as any).rotation.z += 0.01; }
  });
  tiles = tiles || [] //[ 0,0,1,2],[0,5,6,7]] //[0,0,0,1]]
  // tiles[0] = tiles[0] || [0,0,0,0,0,0,0,10]
  // tiles[1] = tiles[1] || [0,0,0,0,1,2,8,10]
  // tiles[2] = tiles[2] || [0,0,0,0,4,3,9,10]
  // tiles[3] = tiles[3] || [0,0,0,0,4,3,9,10]

  var width = tiles[0].length,
  height = tiles.length;
  // buffer = new Uint8ClampedArray(width * height * 4); // have enough bytes
  // // console.log("render tiles", { width, height, tiles })

  // for(var y = 0; y < height; y++) {
  //   for(var x = 0; x < width; x++) {
  //       var pos = (y * width + x) * 4; // position in buffer based on x and y
  //       let value = 1 + parseInt(tiles[y][x] || '0', 10);
  //       buffer[pos  ] = value * 25;           // some R value [0, 255]
  //       buffer[pos+1] = value * 25;  // some G value
  //       buffer[pos+2] = value * 25;           // some B value
  //       buffer[pos+3] = 255;         // set alpha channel
  //   }
  // }

  // could write to image if we have to / nice sanity check at this point i guess?

  // console.log({ buffer })
  // let buffer = new ArrayBuffer(16);
  // let int32View = new Int32Array(buffer);
  // int32View[0] = 1;
  // int32View[2] = 10;
  // int32View[4] = 100;
  // const imageData = generateTexture(tiles) //new DataTexture2DArray(buffer, width, height) //, 32)
  // const texture = new DataTexture(imageData, width, height) //, format, type, ...);

  // const textureSize = 16
  // const dataSize = 10;
  const data = new Uint8Array(width * height);
  
  // for (let i = 0; i < width * height; i++) {
  //   data[i] = Math.round(Math.random() * 255); // pass anything from 0 to 255
  // }
   for(var y = 0; y < height; y++) {
     for(var x = 0; x < width; x++) {
         var pos = (y * width + x)// * 4; // position in buffer based on x and y
         let value = 1 + parseInt(tiles[y][x] || '0', 10);
         data[pos] = value * 25
     }
    }
  
  
  const texture = new DataTexture(data, width, height, LuminanceFormat, UnsignedByteType);

  // texture.needsUpdate = true;
  // texture.isRenderTargetTexture = true
  return (
    <mesh
      ref={set}
      rotation={[-Math.PI / 3, 0, 0]}
      scale={2}
      // scale={scale.get()}
      // onClick={() => setActive(!active)}
    >
      <planeBufferGeometry attach="geometry" args={[15, 15, 75, 75]} />
      <meshPhongMaterial
        attach="material"
        color={"lightblue"}
        map={texture}
        // specular={"lightblue"}
        // specular={new Color(0xfff1ef)}
        displacementMap={texture} //10, 10)}
        // bumpMap={texture} //10, 10)}
        
        // specular={"hotpink"}
        shininess={1}
        flatShading
      />
    </mesh>
  );
};  

export default Terrain;
