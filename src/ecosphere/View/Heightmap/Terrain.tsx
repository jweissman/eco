import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { DataTexture, LuminanceFormat, Mesh, RGBAFormat, UnsignedByteType } from "three";
import { PointOfInterest } from './PointOfInterest';
import { colorNameToHex } from '../../utils/colors';
import { bilinearInterpolator } from '../../utils/interpolate';
    


const makeImageData = (
  tiles: string[][],
  tileColors: { [tile: string]: string },  
  imageSize: number,
  // evolving: boolean
): { rgb: Uint8Array, grayscale: Uint8Array } => {
  var tileWidth = tiles[0].length,
      tileHeight = tiles.length;

  const width = imageSize, height = imageSize
  
  const grayscaleData = new Uint8Array(width * height);
  const rgbData = new Uint8Array(width * height * 4);
  // const greenData = new Uint8ClampedArray(width * height * 4)
  // }
  const heightAt = (x: number, y: number) => {
    if (tiles[y] !== undefined) return parseInt(tiles[y][x], 10)
    return 0
  }
  const colorAt = (x: number, y: number) => {
    let h = heightAt(x,y)
    let color = tileColors[Math.round(h)]
    return color
  }
  const hexValueAt = (x: number, y: number) => {
    let hex: string = colorNameToHex(colorAt(x,y))
    return hex;
  }

  const interpolate = bilinearInterpolator(heightAt)
  
  const interpolateRed = bilinearInterpolator((x, y) => {
    let hex: string = hexValueAt(x,y)
    var red = parseInt(hex[1]+hex[2],16);
    return red;
  })
  const interpolateGreen = bilinearInterpolator((x, y) => {
    let hex: string = hexValueAt(x,y)
    var green = parseInt(hex[3]+hex[4],16);
    return green;
  })
  const interpolateBlue = bilinearInterpolator((x, y) => {
    let hex: string = hexValueAt(x,y)
    var blue = parseInt(hex[5]+hex[6],16);
    return blue;
  })

  
  for (var y = 0; y < height - 1; y++) {
    for (var x = 0; x < width - 1; x++) {
      let pos = (y * width + x);
      let x0 = tileWidth - ((x / (width)) * (tileWidth)),
        y0 = (y / (height)) * (tileHeight);

      let value = interpolate(x0, y0)
      // if ((x0 === 25) && (y0 === 25)) {
      //   value = 10
      // } else if ((x0 === 25 || x0 === 75) && (y0 === 25 || y0 === 75)) {
      //   value = 5
      // } else {
      //   value = 0
      // }

      grayscaleData[pos] = value * 25

      var rgbPos = (y * width + x) * 4;
      rgbData[rgbPos] = interpolateRed(x0, y0)
      rgbData[rgbPos + 1] = interpolateGreen(x0, y0)
      rgbData[rgbPos + 2] = interpolateBlue(x0, y0)
      rgbData[rgbPos + 3] = 255
    }
  }
  return { rgb: rgbData, grayscale: grayscaleData }
}

let cachedImageData: { grayscale: Uint8Array, rgb: Uint8Array } | null = null // {} // grayscale, rgb }

const Terrain = ({
  tileColors,
  evolving,
  tiles,
  pointsOfInterest,
}: {
  evolving: boolean, tiles: string[][],
  tileColors: { [tile: string]: string },
  pointsOfInterest: { [name: string]: [number,number]},
 }) => {

  tiles = tiles || []
  var tilemapWidth = tiles[0].length;

  const scale = 32
  const meshSize = 128 * scale // 1024 * scale //8192 //4096; //1024;
  const maxLandHeight = 6 * scale // / tilemapWidth //1024 * 2  //256 //128 //meshSize / tileWidth

  const [oceanMesh, setOcean] = useState()
  useFrame(({ clock }) => {
    let { elapsedTime: t } = clock
    if (oceanMesh) {
      let mesh: Mesh = oceanMesh
     mesh.position.y = (maxLandHeight / 10) * 1.5
                     - 1
                     + 1.25 * Math.cos(t/8)
                     + 1.25 * Math.cos(t/2)
                    //  + 0.00125  * Math.cos(t*5)
    }
  })
  
  // const baseInterpolationRate = 16
  const baseInterpolationRate = 8
  // const baseInterpolationRate = 4
  const interpolationRate = evolving ? 1 : baseInterpolationRate;
  const imgSize = tilemapWidth * interpolationRate;
  const width = imgSize, height = imgSize;

  const { grayscale, rgb }: { grayscale: Uint8Array, rgb: Uint8Array } = cachedImageData
    || makeImageData(tiles, tileColors, imgSize)
  if (!evolving) { cachedImageData = { grayscale, rgb }}
  else { cachedImageData = null }
  
  
  const grayscaleTexture = new DataTexture(grayscale, width, height, LuminanceFormat, UnsignedByteType);
  const rgbTexture = new DataTexture(rgb, width, height, RGBAFormat, UnsignedByteType);

  const meshGrain = 1024;
  const geometry = 
      <planeBufferGeometry attach="geometry" args={[
        meshSize, meshSize,
        meshGrain, meshGrain
      ]} />

  const showTerrain = true, showOcean = true
  
  return <>
    {showTerrain && <mesh
      position={[0,-1,0]}
      rotation={[-Math.PI/2,0,0]}
    >
      {geometry}
       
      <meshPhongMaterial
        attach="material"
        color={"navajowhite"}
        map={rgbTexture}
        displacementMap={grayscaleTexture}
        displacementScale={maxLandHeight}
        shininess={2}
        flatShading
      />

    {Object.entries(pointsOfInterest).map(([str, [x,y]], i) =>
    <PointOfInterest baseHeight={maxLandHeight/3} str={str} x={x} y={y} meshSize={meshSize} />)}

    </mesh>}
{showOcean && <mesh
      ref={setOcean}
      // rotation={[-Math.PI/2,0,0]}
      // rotation={[0,0,0]}
      rotation={[-Math.PI/2,0,0]}
    >
      {geometry}
      <meshPhongMaterial
        attach="material"
        color={"darkblue"}
        transparent
        opacity={0.95}
        displacementScale={64}
        shininess={1}
        flatShading
      />
    </mesh>}
    

  </>;
};  

export default Terrain;
