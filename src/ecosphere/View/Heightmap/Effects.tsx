import React from "react";
import "@react-three/fiber";
import {
  EffectComposer,
  DotScreen,
  // Pixelation,
  Noise,
  Bloom, 
  // Outline,
  // Glitch,
  // Pixelation,
  // DepthOfField, Noise, Vignette
} from '@react-three/postprocessing'
// import { EffectComposer, Pixelation, Vignette } from '@react-three/postprocessing'


export default function Effects() {
  const fxStack = <>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <DotScreen scale={2} />
        <Noise opacity={0.52} />
        <DotScreen scale={0.6} />
        </>
  const fx = false
  return (
    <EffectComposer>
        {/* <DotScreen scale={2} /> */}
        {/* <Pixelation granularity={2.5} /> */}
      {fx ? fxStack : <></>}

    </EffectComposer>
  )
}
