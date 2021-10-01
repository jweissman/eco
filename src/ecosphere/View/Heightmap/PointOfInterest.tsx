import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Mesh } from "three";

export function PointOfInterest({ x, y, str, meshSize, baseHeight }: {
  x: number; y: number; str: string; meshSize: number;
  baseHeight: number;
}) {
  const [text, setText] = useState();
  const [subtext, setSubtext] = useState();
  useFrame(({ camera }) => {
    if (text) { (text as Mesh).lookAt(camera.position); }
    if (subtext) { (subtext as Mesh).lookAt(camera.position); }
  });
  let large = str.startsWith('*');
  let title = str.substring(0, str.indexOf('('));
  let subtitle = str.substring(str.indexOf('(') + 1, str.indexOf(')'));
  let x0 = meshSize / 2 - (1.3 * (x) * meshSize / 128); // - meshSize/2,
  let y0 = 1.3 * (y) * meshSize / 128 - meshSize / 2;
  let z0 = baseHeight*2.5 + (large ? 2.5 : -3);
  let fontSize = large ? 8 : 3;
  let color = 'white'; //large ? "white" : "gray"
  return <>
    <Text
      ref={setText}
      position={[x0, y0, z0]}
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
      ref={setSubtext}
      position={[x0, y0, z0 - (large ? 5.35 : 2.75)]}
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
