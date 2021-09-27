import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Scene } from "./Scene"

const ViewHeightmap = ({ tileColors, isBoardEvolving, tiles }: { tileColors: { [tile: string]: string }, isBoardEvolving: boolean, tiles: string[][] }) => {
  return <>
    <Canvas
      frameloop={'demand'} 
      camera={{ zoom: 4, position: [0,10,0], near: 0.01 }}
    >
      <Suspense fallback={<div className="loading">Loading</div>}>
      </Suspense>
      <Scene tiles={tiles} evolving={isBoardEvolving} tileColors={tileColors} />
      
    </Canvas>
  </>
}

export { ViewHeightmap as HeightmapCanvas }
