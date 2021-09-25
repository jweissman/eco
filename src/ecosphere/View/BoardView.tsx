import React, { useState } from "react";
import ReactTooltip from "react-tooltip";

export const BoardView = ({
  tiles,
  tileColors,
  tileInspect,
  // inspecting,
  // setInspecting,
  // message,
  condensed,
  }: {
    tiles: string[][],
    tileColors: { [value: string]: string },
    // message: string,
    tileInspect: (x: number, y: number) => string
    // todo maybe just manage inspect state here??
    // setInspecting: Function, inspecting: [number, number], 
    condensed: boolean,
  }) => {

  const [inspecting, setInspecting] = useState([-1,-1]);
  const message = inspecting[0] > 0 && inspecting[1] > 0
    ? tileInspect(inspecting[0], inspecting[1]).split("\n").join("<br/>")
    : '' //<>--</>

  return <>
    <ReactTooltip multiline />
    <table style={{
      // fontFamily: '"Source Code Pro", "Fira Code", "Inconsolata", Menlo, Monaco, "Courier New", monospace',
      fontSize: '3px',
      cursor: 'pointer',
      userSelect: 'none',
      // overflow: 'hidden'
    }}>
      <tbody>
        {tiles.map((row: string[], y: number) =>
          <tr key={`row-${y}`}>
            {row.map((cell: string, x: number) =>
              <td
                style={{
                  ...(condensed ? { width: '1px', height: '1px' } : { width: '4px', height: '4px' }),
                  backgroundColor: inspecting[0] === x && inspecting[1] === y
                    ? 'white'
                    : tileColors[cell]
                }}
                key={`cell-${x}-${y}}`}
                onMouseEnter={() => setInspecting([x,y])}
                onMouseLeave={() => setInspecting([-1,-1])}
                data-tip={inspecting[0] === x && inspecting[1] === y ? message : ''}
                // data-html
              >
                {!condensed && cell}
              </td>
            )}
          </tr>
        )}
      </tbody>
    </table></>
  }
