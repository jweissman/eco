import ReactTooltip from "react-tooltip";

export const BoardView = ({tiles, inspecting, setInspecting, message, tileColors }: { tileColors: { [value: string]: string }, message: string, setInspecting: Function, inspecting: [number, number], tiles: string[][] }) => <>
    <ReactTooltip multiline />
    <table style={{
      // fontFamily: '"Source Code Pro", "Fira Code", "Inconsolata", Menlo, Monaco, "Courier New", monospace',
      // fontSize: '3px',
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
                  width: '1px', height: '1px',
                  backgroundColor: inspecting[0] === x && inspecting[1] === y ? 'white': tileColors[cell]
                }}
                key={`cell-${x}-${y}}`}
                onMouseEnter={() => setInspecting([x,y])}
                onMouseLeave={() => setInspecting([-1,-1])}
                data-tip={inspecting[0] === x && inspecting[1] === y ? message : ''}
                // data-html
              >
                {/* {cell} */}
                </td>
            )}
          </tr>
        )}
      </tbody>
    </table></>
