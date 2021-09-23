import React from 'react';
import { DataTexture, LuminanceFormat, UnsignedByteType } from "three";
// import { useFrame } from '@react-three/fiber';

const bilinearInterpolator = (func: (x: number, y: number) => number) => (x: number, y: number) => {
  // "func" is a function that takes 2 integer arguments and returns some value
  const x1 = Math.floor(x);
  const x2 = Math.ceil(x);
  const y1 = Math.floor(y);
  const y2 = Math.ceil(y);

  if ((x1 === x2) && (y1 === y2)) return func(x1, y1);
  if (x1 === x2) {
    return (func(x1, y1) * (y2 - y) + func(x1, y2) * (y - y1)) / (y2 - y1);
  }
  if (y1 === y2) {
    return (func(x1, y1) * (x2 - x) + func(x2, y1) * (x - x1)) / (x2 - x1);
  }

  // else: x1 != x2 and y1 != y2
  return (
    func(x1, y1) * (x2 - x) * (y2 - y) +
    func(x2, y1) * (x - x1) * (y2 - y) +
    func(x1, y2) * (x2 - x) * (y - y1) +
    func(x2, y2) * (x - x1) * (y - y1)
  )
  / ((x2 - x1) * (y2 - y1));
}

const Terrain = ({ evolving, tiles }: { evolving: boolean, tiles: string[][] }) => {
  // const [hover, setHover] = useState([0,0])
  // const [_mesh, set] = useState()
  // useFrame(() => {
    // if (mesh) { (mesh as any).rotation.z += 0.005; }
  // });
  tiles = tiles || []

  var tileWidth = tiles[0].length,
      tileHeight = tiles.length;
  
  const interpolationRate = evolving ? 1 : 4
  const imgSize = tileWidth * interpolationRate
  const width = imgSize, height = imgSize
  
  const data = new Uint8Array(width * height);
  // }
  const interpolate = bilinearInterpolator((x,y) => {
    if (tiles[y] !== undefined) return parseInt(tiles[y][x], 10)
    return 0
  })
   for(var y = 0; y < height-1; y++) {
     for(var x = 0; x < width-1; x++) {
         var pos = (y * width + x)// * 4; // position in buffer based on x and y
        //  let value = hover[0] === x && hover[1] === y
        //  ? 0
         let value = interpolate(
           tileWidth - ((x/(width)) * (tileWidth)),  //+ 0.1,
           (y/(height)) * (tileHeight), // + 0.1,
          //  tiles
           ) //parseInt(tiles[y][x] || '0', 10)
         if (value < 4) { data[pos] = 100 }
        //  else if (value >= 9) { data[pos] = 225 }
         else data[pos] = value * 25 //> 0 ? (Math.log(value*8) * 25) : 0 //Math.floor(value * 25)
     }
    }
  
  
  const texture = new DataTexture(data, width, height, LuminanceFormat, UnsignedByteType);
  
  // texture.depthTest

  const geometry = 
      <planeBufferGeometry attach="geometry" args={[
        // width, height,
        // 16, 16,
        32, 32,
        256, 256
        // 1024, 1024
        // 2048, 2048
      ]} />
  
  return <>
  {/* <mesh><boxGeometry /></mesh> */}
    <mesh
      // ref={set}
      rotation={[-Math.PI/2,0,0]}
    >
      {geometry}
       
      <meshPhongMaterial
        attach="material"
        color={"hotpink"}
        // color={"forestgreen"}
        map={texture}
        displacementMap={texture}
        displacementScale={5}

        shininess={2}
        flatShading
        // onMouseEnter={() => {}}
      />
    </mesh>
  </>;
};  

export default Terrain;
