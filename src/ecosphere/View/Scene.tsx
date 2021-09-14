import React from "react";
import "@react-three/fiber"
// import { useResource } from "@react-three/fiber";

const FakeSphere = () => (
  <mesh>
    <sphereBufferGeometry attach="geometry" args={[0.7, 30, 30]} />
    <meshBasicMaterial attach="material" color={0xfff1ef} />
  </mesh>
);

const Lights = () => {
  // const FakeSphere = () => (
  //   <mesh>
  //     <sphereBufferGeometry attach="geometry" args={[0.7, 30, 30]} />
  //     <meshBasicMaterial attach="material" color={0xfff1ef} />
  //   </mesh>
  // );

 return (
    <group>
      <FakeSphere />
      <ambientLight position={[0, 4, 0]} intensity={0.3} />
      <directionalLight intensity={0.5} position={[0, 0, 0]} color={0xffffff} />
      <pointLight
        intensity={1.9}
        position={[-6, 3, -6]}
        color={0xffcc77}
      >
        {/* {pLight1 && <pointLightHelper args={[pLight1]} />} */}
      </pointLight>
      <pointLight
        intensity={1.9}
        position={[6, 3, 6]}
        color={0xffcc77}
        >
      </pointLight>

    </group>
  );
};

const Scene = () => (
  <>
    <Lights />
    {/* <Terrain /> */}
  </>
);

export { Scene }
