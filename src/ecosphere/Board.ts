export type Tiles = string[][]

const first = <T>(arr: T[], pred: (x: T) => boolean): T => {
  return arr.filter(pred)[0]
  // return arr[0]
}

export class Board {
  private tiles: Tiles = []

  view({ overlays }: { overlays: Board[] } = { overlays: []}): Tiles {
    let viewTiles: Tiles = []
    for (let x = 0; x <= this.width; x++) {
      for (let y = 0; y <= this.height; y++) {
        viewTiles[y] = viewTiles[y] || []
        let overlay = overlays.length > 0 && first(overlays, o => {
          let v = o.at(x,y); return v !== '' && v !== undefined
          // return o.at(x,y) !== undefined
        })
        viewTiles[y][x] = (overlay && overlay.at(x,y))
                       || this.at(x,y)
                       || '_'
      }
    }
    return viewTiles;
  }

  constructor(public width: number, public height: number) {}

  // clear = (x0: string, y0: number, width: number, height: number) => {}

  write = (character: string, x0: number, y0: number) => {
    let x = x0;
    let y = y0;
    this.tiles[y] = this.tiles[y] || [];
    this.tiles[y][x] = character;
  }

  erase(x: number, y: number) {
    this.tiles[y] = this.tiles[y] || [];
    this.tiles[y][x] = ''
    // throw new Error("Method not implemented.")
  }
  
  drawBox = (char: string, x0: number, y0: number, width: number, height: number, filled?: boolean) => {
    let x1 = x0 + width; let y1 = y0 + height;
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        if (x === x0 || y === y0 || x === x1 || y === y1) {
          this.write(char, x, y)
        } else {
          if (filled) {
            this.write(char, x, y)
          }
        }
      }
    }
  }

  // get width() { return this.tiles && this.tiles[0] && this.tiles[0].length }
  // get height() { return this.tiles.length }

  at(x: number, y: number) { //}, defaultValue: string = '') {
    // if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) {
      const x0 = x % this.width
      const y0 = y % this.height
      if (this.tiles[y0]) {
        return this.tiles[y0][x0]
      }
    // } 
    // return defaultValue
  }


  each(fn: (x: number, y: number, value: string) => void) {
    for (let x = 0; x <= this.width; x++) {
      for (let y = 0; y <= this.height; y++) {
        fn(x,y,this.at(x,y) || '')
      }
    }
  }

  neighbors(x: number, y: number): string[] {
    const at = (x: number, y: number) => this.at(x,y) || '' // || defaultValue
    let neighbors: string[] = [
      at(x-1,y-1), at(x,y-1), at(x+1,y-1),
      // at(x-1,y)  , at(x,y),   at(x+1,y),
      at(x-1,y)  ,   at(x+1,y),
      at(x-1,y+1), at(x,y+1), at(x+1,y+1),
    ]
    return neighbors
  }

  step(eachCell: (val: string, neighbors: string[], position: [number, number]) => string, defaultValue: string = ''): Tiles {
    // const ignored = ['*']
    // console.log("Board.step -- start")
    let newTiles: Tiles = []
    this.tiles = this.tiles || []
    const at = (x: number, y: number) => this.at(x,y) || defaultValue
    for (let x = 0; x <= this.width; x++) {
      for (let y = 0; y <= this.height; y++) {
        let currentValue = at(x,y)
        if (currentValue !== undefined) {
          // if (ignored.includes(currentValue)) { continue }
          let neighbors: string[] = this.neighbors(x,y)
          // [
          //   at(x-1,y-1), at(x,y-1), at(x+1,y-1),
          //   at(x-1,y)  , at(x,y),   at(x+1,y),
          //   at(x-1,y+1), at(x,y+1), at(x+1,y+1),
          // ]
          const newCell = eachCell(currentValue, neighbors, [x,y])
          newTiles[y] = newTiles[y] || []
          newTiles[y][x] = newCell
        }
      }
    }
    this.tiles = newTiles
    return newTiles
  }
}
