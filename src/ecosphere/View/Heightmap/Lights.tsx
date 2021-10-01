import React from "react";

export function Lights() {
  return (
    <group>
      <ambientLight position={[0, 0, 100]} intensity={4.9} />
      {/* <directionalLight intensity={0.5} position={[0, 0, 0]} color={0xffffff} /> */}
      {/* <pointLight
        intensity={1.9}
        position={[-6, 3, -6]}
        color={0xaca7ef}
      >
      </pointLight>
      <pointLight
        intensity={1.9}
        position={[6, 3, 6]}
        color={0x77ccff}
      >
      </pointLight>
 */}
    </group>
  );
}
