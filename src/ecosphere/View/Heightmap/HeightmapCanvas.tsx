import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Scene } from "./Scene"

const HeightmapCanvas = ({
  tileColors, isBoardEvolving, tiles, pointsOfInterest, tokens
}: {
  pointsOfInterest: { [name: string]: [number,number] }
  tileColors: { [tile: string]: string },
  tokens: { [name: string]: [number,number][] },
  isBoardEvolving: boolean,
  tiles: string[][]
}) => {
  const scene = { tiles, tokens, tileColors, pointsOfInterest, evolving: isBoardEvolving }
  return <>
    <Canvas
      frameloop={'demand'} 
      camera={{ zoom: 4, position: [0,20,128], 
       near: 0.1, far: 15000 }}
       onCreated={({camera}) => {
        //  camera.rotateX(Math.PI/2)
        // camera.rotateY(Math.PI/2)
        // camera.rotateZ(Math.PI/2)
       }}
    >
      <Suspense fallback={<div className="loading">Loading</div>}>
        <Scene {...scene}
          // tiles={tiles}
          // evolving={isBoardEvolving}
          // tileColors={tileColors}
          // pointsOfInterest={pointsOfInterest}
        />
      </Suspense>
    </Canvas>
  </>
}

export { HeightmapCanvas }
