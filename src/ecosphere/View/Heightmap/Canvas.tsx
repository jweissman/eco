import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Scene } from "./Scene"
// import { Stage } from "@react-three/drei"

const ViewHeightmap = ({ tileColors, isBoardEvolving, tiles }: { tileColors: { [tile: string]: string }, isBoardEvolving: boolean, tiles: string[][] }) => {
  return <>
    <Canvas
      frameloop={'demand'} 
      camera={{ zoom: 1, position: [0,10,0], near: 0.01 }}
    >
      <Suspense fallback={<div className="loading">Loading</div>}>

      {/* <Stage contactShadow shadows adjustCamera intensity={1} environment="city" preset="rembrandt"> */}
      <Scene tiles={tiles} evolving={isBoardEvolving} tileColors={tileColors} />
      {/* </Stage> */}
      </Suspense>
      
    </Canvas>
  </>
}

export { ViewHeightmap as HeightmapCanvas }
