import React from "react";
import "@react-three/fiber";
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, DotScreen} from '@react-three/postprocessing'


export default function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
              <DepthOfField focusDistance={0} focalLength={0.55} bokehScale={2} height={600} />
        <Noise opacity={0.72} />
        <Vignette eskil={false} offset={0.1} darkness={0} />
        <DotScreen scale={0.02} />

    </EffectComposer>
  )
}
