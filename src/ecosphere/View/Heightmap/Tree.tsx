import React from 'react';
// import { useFrame } from '@react-three/fiber';
import { Texture } from "three";

// todo point towards cam?
export function Tree({ position, map }: { map: Texture; position: [number, number, number]; }) {

  let [x, y, z] = position; //toScenePosition(position)

  // const { camera } = useThree()
  // const [tree, set] = React.useState<Mesh>();
  //  useFrame(({ camera }) => {
  //   tree && tree.lookAt(camera.position)
  //  })
  return <>
    <mesh
      // ref={set}
      position={[x, y, z]}
      rotation={[0, -Math.PI / 2, -Math.PI / 2]}
    >
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial
        // color='green'
        attach='material'
        transparent
        // map={grayscaleTexture}
        // map={rgbTexture}
        map={map} // treeMap}
      />
    </mesh>
  </>;
}
