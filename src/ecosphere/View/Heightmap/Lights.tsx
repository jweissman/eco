import React from "react";

export function Lights() {
  // const FakeSphere = () => (
  //   <mesh>
  //     <sphereBufferGeometry attach="geometry" args={[0.7, 30, 30]} />
  //     <meshBasicMaterial attach="material" color={0xfff1ef} />
  //   </mesh>
  // );
  // const [luminousMatterOne, setPointLightOne] = useState();
  // const [luminousMatterTwo, setPointLightTwo] = useState();

  // const [ref, pLight1] = useResource();
  // const [ref2, pLight2] = useResource();
  // const ref = useRef()
  return (
    <group>
      {/* <FakeSphere /> */}
      <ambientLight position={[0, 0, -10]} intensity={4.9} />
      <directionalLight intensity={0.5} position={[0, 0, 0]} color={0xffffff} />
      <pointLight
        intensity={1.9}
        position={[-6, 3, -6]}
        color={0xaca7ef}
        // ref={setPointLightOne}
      >
        {/* {luminousMatterOne && <pointLightHelper args={[luminousMatterOne]} />} */}
      </pointLight>
      <pointLight
        intensity={1.9}
        position={[6, 3, 6]}
        color={0x77ccff}
        // ref={setPointLightTwo}
      >
        {/* {luminousMatterTwo && <pointLightHelper args={[luminousMatterTwo]} />} */}
      </pointLight>

    </group>
  );
}
