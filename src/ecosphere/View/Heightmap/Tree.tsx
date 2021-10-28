import React from 'react';
import { extend } from "@react-three/fiber";
import { Billboard } from '@react-three/drei/core/Billboard';
import { Texture } from 'three';
extend({ Billboard })

// todo point towards cam?
export function Tree({ position, map }: { map: Texture; position: [number, number, number]; }) {

  let [x, y, z] = position; //toScenePosition(position)
  // console.log("Draw tree at ", { x,y })

  // const { camera } = useThree()
  // const [tree, set] = React.useState<Mesh>();
  //  useFrame(({ camera }) => {
  //   tree && tree.lookAt(camera.position)
  //  })
  return <Billboard
  // follow={false}
      // lockX lockY
    // lockX
    // lockZ
      // scale={16}
    position={[x, y, z-0.6]} // z + 32]}
      rotation={[0, -Math.PI / 2, -Math.PI / 2]}
  >
    <mesh
      scale={0.2}
      // ref={set}

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
  </Billboard>;
}
