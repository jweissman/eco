import React from 'react';
import { DataTexture, LuminanceFormat, RGBAFormat, UnsignedByteType, } from "three";
// import { SkyBox } from './Scene';
// import { useFrame } from '@react-three/fiber';
    var colors: { [color: string]: string } = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};


function colorNameToHex(color: string)
{
  if (color === undefined) { return '#000000'; }
    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return '#000000';
}

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
    let hex: string = colorNameToHex(colorAt(x,y)) //tileColors[Math.round(value)])
    return hex;
  }

  const interpolate = bilinearInterpolator(heightAt)
  // (x,y) => {
  //   if (tiles[y] !== undefined) return parseInt(tiles[y][x], 10)
  //   return 0
  // })
  // todo just interpolate for each color channel independently i think..?!
  // return just green channel
  const interpolateRed = bilinearInterpolator((x, y) => {
    let hex: string = hexValueAt(x,y) //colorNameToHex(colorAt(x,y)) //tileColors[Math.round(value)])
    var red = parseInt(hex[1]+hex[2],16);
    return red;
  })
  const interpolateGreen = bilinearInterpolator((x, y) => {
    let hex: string = hexValueAt(x,y) //colorNameToHex(colorAt(x,y)) //tileColors[Math.round(value)])
    var green = parseInt(hex[3]+hex[4],16);
    return green;
  })
  const interpolateBlue = bilinearInterpolator((x, y) => {
    let hex: string = hexValueAt(x,y) // colorNameToHex(colorAt(x,y)) //tileColors[Math.round(value)])
    var blue = parseInt(hex[5]+hex[6],16);
    return blue;
  })

  
   for(var y = 0; y < height-1; y++) {
     for(var x = 0; x < width-1; x++) {
         var pos = (y * width + x)// * 4; // position in buffer based on x and y
        //  let value = hover[0] === x && hover[1] === y
        //  ? 0
           let x0 = tileWidth - ((x/(width)) * (tileWidth)),  //+ 0.1,
           y0 = (y/(height)) * (tileHeight); // + 0.1,

         let value = interpolate(
           x0, y0
          //  tileWidth - ((x/(width)) * (tileWidth)),  //+ 0.1,
          //  (y/(height)) * (tileHeight), // + 0.1,
          //  tiles
           ) //parseInt(tiles[y][x] || '0', 10)
        //  if (value < 4) { grayscaleData[pos] = 100 } else
        //  else if (value >= 9) { data[pos] = 225 }
         grayscaleData[pos] = value * 25 //> 0 ? (Math.log(value*8) * 25) : 0 //Math.floor(value * 25)


        //  var rgbPos = ()
         var rgbPos = (y * width + x) * 4; // position in buffer based on x and y
        //  let color = tileColors[Math.round(value)]
        //  let hex: string = colorNameToHex(color) //tileColors[Math.round(value)])
        //  var red = parseInt(hex[1]+hex[2],16);
        //  var green = parseInt(hex[3]+hex[4],16);
        //  var blue = parseInt(hex[5]+hex[6],16);

        //  let factor = 25
         rgbData[rgbPos    ] = interpolateRed(x0,y0) //* 25 //value * 25
         rgbData[rgbPos + 1] = interpolateGreen(x0,y0) //value * 25
         rgbData[rgbPos + 2] = interpolateBlue(x0,y0) // value * 25
         rgbData[rgbPos + 3] = 255

         // would love to interpolate these colors!!!

        //  var rgbPos = (y * width + x) * 4; // position in buffer based on x and y
        //  greenData[rgbPos    ] = 0 //value * 25
        //  greenData[rgbPos + 1] = value * 25
        //  greenData[rgbPos + 2] = 0 //value * 25
        //  greenData[rgbPos + 3] = 255
     }
    }
    return { rgb: rgbData, grayscale: grayscaleData }
}

let cachedImageData: { grayscale: Uint8Array, rgb: Uint8Array } | null = null // {} // grayscale, rgb }

const Terrain = ({ tileColors, evolving, tiles }: { evolving: boolean, tiles: string[][], tileColors: { [tile: string]: string } }) => {
  // const [hover, setHover] = useState([0,0])
  // const [_mesh, set] = useState()
  // useFrame(() => {
    // if (mesh) { (mesh as any).rotation.z += 0.005; }
  // });
  tiles = tiles || []

  var tileWidth = tiles[0].length;
      // tileHeight = tiles.length;
  
  const interpolationRate = evolving ? 1 : 16; //8;
  const imgSize = tileWidth * interpolationRate;
  const width = imgSize, height = imgSize;

  const { grayscale, rgb }: { grayscale: Uint8Array, rgb: Uint8Array } = cachedImageData
    || makeImageData(tiles, tileColors, imgSize) //, evolving)
  if (!evolving) { cachedImageData = { grayscale, rgb }}
  else { cachedImageData = null }
  
  
  const grayscaleTexture = new DataTexture(grayscale, width, height, LuminanceFormat, UnsignedByteType);
  const rgbTexture = new DataTexture(rgb, width, height, RGBAFormat, UnsignedByteType);
  // const greenTexture = new DataTexture(greenData, width, height, LuminanceFormat, UnsignedByteType) //UnsignedByteType);
  
  // texture.depthTest

  const geometry = 
      <planeBufferGeometry attach="geometry" args={[
        // width, height,
        16, 16,
        // 32, 32,
        // 256, 256,
        // 512, 512,
        // 1024, 1024
        2048, 2048
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
        color={"navajowhite"}
        // color={"ghostwhite"}
        // color={"forestgreen"}
        // color={"mediumblue"}
        // bumpMap={greenTexture}
        // map={grayscaleTexture}
        map={rgbTexture}
        
        displacementMap={grayscaleTexture}
        displacementScale={2.6}

        shininess={2}
        flatShading
        // onMouseEnter={() => {}}
      />
    </mesh>
  </>;
};  

export default Terrain;
