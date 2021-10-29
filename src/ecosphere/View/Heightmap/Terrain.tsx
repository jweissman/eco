import React from 'react';
import { useLoader } from '@react-three/fiber';
import { DataTexture, LuminanceFormat, RGBAFormat, Texture, TextureLoader, UnsignedByteType } from "three";
import { PointOfInterest } from './PointOfInterest';
import { colorNameToHex } from '../../utils/colors';
import { bilinearInterpolator } from '../../utils/interpolate';
import { Tree } from './Tree';


const makeImageData = (
  tiles: string[][],
  tileColors: { [tile: string]: string },  
  imageSize: number,
  // evolving: boolean
): { rgb: Uint8Array, grayscale: Uint8Array } => {
  var tileWidth = tiles[0].length + 1,
      tileHeight = tiles.length + 1;

  const width = imageSize, height = imageSize
  
  const grayscaleData = new Uint8Array(width * height);
  const rgbData = new Uint8Array(width * height * 4);
  // const greenData = new Uint8ClampedArray(width * height * 4)
  // }
  const heightAt = (x: number, y: number) => {
    if (tiles[y] !== undefined) return parseInt(tiles[y][x], 10)
    return 0
  }
  const interpolate = bilinearInterpolator(heightAt)

  const colorAt = (x: number, y: number) => {
    let h = heightAt(x,y)
    let color = tileColors[Math.round(h)]
    return color
  }
  const hexValueAt = (x: number, y: number) => {
    let hex: string = colorNameToHex(colorAt(x,y))
    return hex;
  }

  // const interpolate = bilinearInterpolator(heightAt)
  
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

  
  for (var y = 0; y <= height+2; y++) {
    for (var x = 0; x <= width+2; x++) {
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

// handle just major landform
// const Landmass = () => { }

const Terrain = ({
  tokens,
  tileColors,
  evolving,
  tiles,
  pointsOfInterest,
}: {
  evolving: boolean,
  tiles: string[][],
  tileColors: { [tile: string]: string },
  pointsOfInterest: { [name: string]: [number,number]},
  tokens: { [name: string]: [number,number][] }
 }) => {

  tiles = tiles || []
  var tilemapWidth = tiles.length // - 1; //[0].length + 1;

  // const scale = 1 //32
  const meshSize = tilemapWidth // * scale // 1024 * scale //8192 //4096; //1024;
  const maxLandHeight = 16 // * scale // / tilemapWidth //1024 * 2  //256 //128 //meshSize / tileWidth
  const treeUrl = `${process.env.PUBLIC_URL}/tree.png`
  
  let treeMap: Texture | null = null;
  try {
   // eslint-disable-next-line react-hooks/rules-of-hooks
   treeMap = useLoader(TextureLoader, treeUrl)
  } catch (err) { }
  
  const baseInterpolationRate = 8
  // const baseInterpolationRate = 2
  // const baseInterpolationRate = 2
  const interpolationRate = evolving ? 1 : baseInterpolationRate;
  const imgSize = tilemapWidth * interpolationRate;
  const width = imgSize, height = imgSize;

  const { grayscale, rgb }: { grayscale: Uint8Array, rgb: Uint8Array } = cachedImageData
    || makeImageData(tiles, tileColors, imgSize)
  if (!evolving) { cachedImageData = { grayscale, rgb }}
  else { cachedImageData = null }
  
  const grayscaleTexture = new DataTexture(grayscale, width, height, LuminanceFormat, UnsignedByteType);
  const rgbTexture = new DataTexture(rgb, width, height, RGBAFormat, UnsignedByteType);

  const meshGrain = 256; // 1024; // * 2; //1024;
  const terrainGeometry = 
      <planeBufferGeometry attach="geometry" args={[
        meshSize, meshSize,
        meshGrain, meshGrain
      ]} />

  const showTerrain = true, showOcean = true
  const showGuide = true

  const heightAt = (x: number, y: number) => {
    if (tiles[y] !== undefined) return parseInt(tiles[y][x] || '0', 10)
    return 0
  }
  const interpolate = bilinearInterpolator(heightAt)

  const toScenePosition = (worldPos: [ number, number ]): [number,number,number] => {
    const [x,y] = worldPos;
    const sz = meshSize/2
    const sceneScale = (tilemapWidth / sz) / 2
    let x0 = sz - x*sceneScale
    let y0 = y*sceneScale - sz
    let z0 = interpolate(x,y)/10 * maxLandHeight
    return [x0,y0,z0]
  }

  // const Forest = ({ at }: { at: [number,number] }) => {
  //   return <>
  //     {treeMap && <Tree map={treeMap} position={toScenePosition(at)} />}
  //   </>
  // }
  
  return <>
    {showTerrain && <mesh
      position={[0,0,0]}
    >
      {terrainGeometry}
       
      <meshPhongMaterial
        attach="material"
        color={"navajowhite"}
        map={rgbTexture}
        displacementMap={grayscaleTexture}
        displacementScale={maxLandHeight}
        shininess={2}
        flatShading
      />

    {showGuide && Object.entries(pointsOfInterest).map(([str, [x,y]], i) =>
    <PointOfInterest
      position={toScenePosition([x,y])}
      title={str}
    />)}

      {tokens.trees.map(tree => treeMap && <Tree map={treeMap} position={toScenePosition(tree)} />)}
    </mesh>}

    {showOcean && <mesh
      // ref={setOcean}
      position={[0,0,4.75]}
      // rotation={[-Math.PI/2,0,0]}
    >
      {terrainGeometry}
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
