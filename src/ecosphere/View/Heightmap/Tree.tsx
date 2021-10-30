import React from 'react';
import { Texture } from 'three';
import { Billboard } from '@react-three/drei'; ///core/Billboard';

// okay jest *hates* this, presumably b/c of `extend` keyword
import { extend } from "@react-three/fiber";

// if (process.env.NODE_ENV !== 'test') {
  extend({ Billboard })
// }

// todo point towards cam?
export function Tree({ position, map }: { map: Texture; position: [number, number, number]; }) {

  let [x, y, z] = position; //toScenePosition(position)
  // console.log("Draw tree at ", { x,y })

  // const { camera } = useThree()
  // const [tree, set] = React.useState<Mesh>();
  //  useFrame(({ camera }) => {
  //   tree && tree.lookAt(camera.position)
  //  })
  const scale = 1.2
  let zOff = scale * 0.875
  return <Billboard
  // follow={false}
      // lockX lockY
    // lockX
    // lockZ
      // scale={16}
    position={[x, y, z + zOff]} // z + 32]}
      // rotation={[0, -Math.PI / 2, -Math.PI / 2]}
  >
    <mesh
      scale={scale}
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
