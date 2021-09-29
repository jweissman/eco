import React from "react";
import "@react-three/fiber";
import {
  EffectComposer,
  // DotScreen,
  // // Pixelation,
  // Noise,
  // Bloom, 
  // // Outline,
  // // Glitch,
  // Pixelation,
  // DepthOfField, Noise, Vignette
} from '@react-three/postprocessing'
// import { EffectComposer, Pixelation, Vignette } from '@react-three/postprocessing'


export default function Effects() {
  const fxStack = <>
        {/* <Pixelation granularity={1} /> */}
        {/* <Pixelation granularity={2.5} /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={10} /> */}
        {/* <Noise opacity={0.12} /> */}
        {/* <DotScreen scale={1} /> */}
        {/* <DotScreen scale={0.6} /> */}
        {/* <DotScreen scale={0.1} /> */}
        </>
  const fx = true
  return (
    <EffectComposer>
        {/* <DotScreen scale={2} /> */}
        {/* <Pixelation granularity={2.5} /> */}
      {fx ? fxStack : <></>}

    </EffectComposer>
  )
}
