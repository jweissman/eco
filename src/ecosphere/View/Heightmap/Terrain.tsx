import React from 'react';
import { DataTexture, LuminanceFormat, UnsignedByteType } from "three";
import { useFrame } from '@react-three/fiber';
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

// todo figure out interpolation :/
// interpolate a number eg. [3.4, 5.3] and based on data (string to be parsed as int...)
// interpolate
// const interpolate = (px: number, py: number, data: string[][]) => {
//   const x1 = Math.floor(px), y1 = Math.floor(py);
//   const x2 = Math.ceil(px), y2 = Math.ceil(py);

//   if (data[y1] === undefined || data[y2] === undefined) { return 0 } //data[floorX] }

//   let q11 = parseInt(data[y1][x1], 10); // ElevationAtVertex(Mathf.Floor(x), Mathf.Floor(y));
//   let q12 = parseInt(data[y2][x1], 10) ; //Mathf.Floor(x), Mathf.Ceiling(y));
//   let q21 = parseInt(data[y1][x2], 10) ; //Mathf.Ceiling(x), Mathf.Floor(y));
//   let q22 = parseInt(data[y2][x2], 10)  //ElevationAtVertex(Mathf.Ceiling(x), Mathf.Ceiling(y));

//   let xWeight = px-x1; //Math.floor(x) ;
//   let yWeight = py-y1; //Math.floor(y) ;

//   let floorValue = q11+Math.abs(q12-q11)*xWeight ;
//   let ceilValue  = q21+Math.abs(q22-q21)*xWeight ;

//   let result = floorValue+(ceilValue-floorValue)*yWeight ;

//   // let fxy1 = (((x2 - px)/(x2 - x1)) * q11) + (((px-x1)/(x2-x1)) * q21)
//   // let fxy2 = (((x2 - px)/(x2 - x1)) * q12) + (((px-x1)/(x2-x1)) * q22)

//   // // console.log('interpolate', { f1, f2, f3, f4, result })
//   // let fxy = (((y2 - px)/(y2 - y1)) * fxy1)
//   //         + (((px-y1)/(y2-y1)) * fxy2)

//   return result // fxy //result

// }


const Terrain = ({ tiles }: { tiles: string[][] }) => {
  // const [hover, setHover] = useState([0,0])
  // const [_mesh, set] = useState()
  useFrame(() => {
    // if (mesh) { (mesh as any).rotation.z += 0.005; }
  });
  tiles = tiles || []

  var tileWidth = tiles[0].length,
      tileHeight = tiles.length;
  
      const imgSize = tileWidth * 4
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
           (x/(width)) * (tileWidth),  //+ 0.1,
           (y/(height)) * (tileHeight), // + 0.1,
          //  tiles
           ) //parseInt(tiles[y][x] || '0', 10)
         data[pos] = value * 25 //Math.floor(value * 25)
     }
    }
  
  
  const texture = new DataTexture(data, width, height, LuminanceFormat, UnsignedByteType);
  
  // texture.depthTest

  const geometry = 
      <planeBufferGeometry attach="geometry" args={[
        // width, height,
        // 16, 16,
        128, 128,
        // 64, 64,
        512, 512,
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
        // color={"hotpink"}
        color={"forestgreen"}
        map={texture}
        displacementMap={texture}
        displacementScale={8}
        shininess={5}
        flatShading
        // onMouseEnter={() => {}}
      />
    </mesh>
  </>;
};  

export default Terrain;
