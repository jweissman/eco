import React from "react";
import "@react-three/fiber";
import {
  EffectComposer,
  DotScreen,
  Pixelation,
  Noise,
  Bloom, 
  // Glitch,
  // Pixelation,
  // DepthOfField, Noise, Vignette
} from '@react-three/postprocessing'
// import { EffectComposer, Pixelation, Vignette } from '@react-three/postprocessing'


export default function Effects() {
  return (
    <EffectComposer>
      {/* <Glitch dtSize={20} /> */}
        {/* <Vignette eskil={false} offset={0.1} darkness={1.01} /> */}
        {/* <DepthOfField focusDistance={0} focalLength={0.55} bokehScale={2} height={600} />  */}
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <DotScreen scale={2} />
        <Pixelation granularity={2} />
        <Noise opacity={0.52} />
        <DotScreen scale={0.6} />

    </EffectComposer>
  )
}
