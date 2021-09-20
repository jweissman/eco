import { Color, DataTexture2DArray } from "three";

const Terrain = ({ tiles }: { tiles: string[][] }) => { //[number,number][] }) => {
  tiles = tiles || [] //[ 0,0,1,2],[0,5,6,7]] //[0,0,0,1]]
  // tiles[0] = tiles[0] || [0,0,0,0,0,0,0,10]
  // tiles[1] = tiles[1] || [0,0,0,0,1,2,8,10]
  // tiles[2] = tiles[2] || [0,0,0,0,4,3,9,10]
  // tiles[3] = tiles[3] || [0,0,0,0,4,3,9,10]

  var width = tiles[0].length,
  height = tiles.length,
  buffer = new Uint8ClampedArray(width * height * 4); // have enough bytes
  // console.log("render tiles", { width, height, tiles })

  for(var y = 0; y < height; y++) {
    for(var x = 0; x < width; x++) {
        var pos = (y * width + x) * 4; // position in buffer based on x and y
        let value = 1 + parseInt(tiles[y][x] || '0', 10);
        buffer[pos  ] = value * 25;           // some R value [0, 255]
        buffer[pos+1] = value * 25;  // some G value
        buffer[pos+2] = value * 25;           // some B value
        buffer[pos+3] = 255;         // set alpha channel
    }
  }

  // could write to image if we have to / nice sanity check at this point i guess?

  // console.log({ buffer })
  // let buffer = new ArrayBuffer(16);
  // let int32View = new Int32Array(buffer);
  // int32View[0] = 1;
  // int32View[2] = 10;
  // int32View[4] = 100;
  const texture = new DataTexture2DArray(buffer, width, height) //, 32)
  // texture.isRenderTargetTexture = true
  return (
    <mesh
      // ref={set}
      rotation={[-Math.PI / 3, 0, 0]}
      // scale={scale.get()}
      // onClick={() => setActive(!active)}
    >
      <planeBufferGeometry attach="geometry" args={[15, 15, 75, 75]} />
      <meshPhongMaterial
        attach="material"
        color={"hotpink"}
        specular={new Color(0xfff1ef)}
        displacementMap={texture} //10, 10)}
        // bumpMap={texture} //10, 10)}
        // specular={"hotpink"}
        shininess={3}
        flatShading
      />
    </mesh>
  );
};  

export default Terrain;
