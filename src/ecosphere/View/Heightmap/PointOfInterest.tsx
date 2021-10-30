import React from 'react';
// import { extend } from "@react-three/fiber";
// import { Billboard } from '@react-three/drei/core/Billboard';
import { Text } from '@react-three/drei';
// import { Texture } from 'three';
// import { Mesh } from "three";
// extend({ Billboard })

// import React, { useState } from 'react';
// import { useFrame } from '@react-three/fiber';

export function PointOfInterest({ title: str, position }: { //}, x, y, str, meshSize, baseHeight }: {
  title: string, position: [number, number, number]
  // x: number; y: number; str: string; meshSize: number;
  // baseHeight: number;
}) {
  // const [text, setText] = useState();
  // const [subtext, setSubtext] = useState();
  // useFrame(({ camera }) => {
  //   if (text) { (text as Mesh).lookAt(camera.position, y0, z0); }
  //   if (subtext) { (subtext as Mesh).lookAt(camera.position, y0, z0); }
  // });
  let large = str.startsWith('*');
  let title = str.substring(0, str.indexOf('('));
  let subtitle = str.substring(str.indexOf('(') + 1, str.indexOf(')'));
  // todo fix position of these things? use billboard?
  // let [x0,y0,z0] = position
  // let x0 = meshSize / 2 - (1.3 * (x) * meshSize / 128); // - meshSize/2,
  // let y0 = 1.3 * (y) * meshSize / 128 - meshSize / 2;
  // let z0 = baseHeight*2 + (large ? 15 : -20);
  let fontSize = large ? 8 : 3;
  let color = 'white'; //large ? "white" : "gray"
  return <>
    <Text
      // ref={setText}
      // rotation={[Math.PI / 2, 0, 0]}
      font='Fira Code'
      fontSize={fontSize}
      color={color}

      anchorX="center" anchorY="middle"
      key={str + '-' + title}
    >
      {title.replaceAll('*', '')}
    </Text>
    {subtitle && <Text
      // ref={setSubtext}
      // position={[x0, y0, z0 + 15]}
      position={[0, -5, 0]}
      // rotation={[Math.PI / 2, 0, 0]}
      font='Fira Code'
      color={color}
      fontSize={fontSize / 2}
      anchorX="center" anchorY="middle"
      key={str + '-' + subtitle}
    >
      {subtitle}
    </Text>}
  </>;
}
