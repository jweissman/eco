import { Color } from "three";

const Terrain = ({ tiles }: { tiles: [number,number][] }) => {
  // let buffer = new ArrayBuffer(16);
  // let int32View = new Int32Array(buffer);
  // int32View[0] = 1;
  // int32View[2] = 10;
  // int32View[4] = 100;

  return (
    <mesh
      // ref={set}
      rotation={[-Math.PI / 2, 0, 0]}
      // scale={scale.get()}
      // onClick={() => setActive(!active)}
    >
      <planeBufferGeometry attach="geometry" args={[25, 25, 75, 75]} />
      <meshPhongMaterial
        attach="material"
        color={"hotpink"}
        specular={new Color(0xfff1ef)}
        // bumpMap={new DataTexture2DArray(int32View, 10, 10)}
        // specular={"hotpink"}
        shininess={3}
        flatShading
      />
    </mesh>
  );
};  

export default Terrain;
