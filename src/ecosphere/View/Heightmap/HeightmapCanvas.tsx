import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Scene } from "./Scene"

const HeightmapCanvas = ({
  tileColors, isBoardEvolving, tiles, pointsOfInterest
}: {
  pointsOfInterest: { [name: string]: [number,number] }
  tileColors: { [tile: string]: string },
  isBoardEvolving: boolean,
  tiles: string[][]
}) => {
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
        <Scene
          tiles={tiles}

          evolving={isBoardEvolving}
          tileColors={tileColors}
          pointsOfInterest={pointsOfInterest}
        />
      </Suspense>
    </Canvas>
  </>
}

export { HeightmapCanvas }
