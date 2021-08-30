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
        let overlay = first(overlays, o => o && o.at(x,y) !== undefined)
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

  at(x: number, y: number) {
    if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) {
      if (this.tiles[y]) {
        return this.tiles[y][x]
      }
    } 
    // return ''
  }


  each(fn: (x: number, y: number, value: string) => void) {
    for (let x = 0; x <= this.width; x++) {
      for (let y = 0; y <= this.height; y++) {
        fn(x,y,this.at(x,y) || '')
      }
    }
  }

  step(eachCell: (val: string, neighbors: string[]) => string) {
    const ignored = ['*']
    // console.log("Board.step -- start")
    let newTiles: Tiles = []
    this.tiles = this.tiles || []
    for (let x = 0; x <= this.width; x++) {
      for (let y = 0; y <= this.height; y++) {
        let currentValue = this.at(x,y) // || '' //tiles[y][x]
        if (currentValue !== undefined) {
          if (ignored.includes(currentValue)) { continue } // === '*') { continue }
          let neighbors: string[] = [
            this.at(x-1,y-1), this.at(x,y-1), this.at(x+1,y-1),
            this.at(x-1,y),   this.at(x,y),   this.at(x+1,y),
            this.at(x-1,y+1), this.at(x,y+1), this.at(x+1,y+1),
          ].filter(Boolean) as string[] //.filter(v => v !== '' && v !== ' ' && v !== '*')
          if (neighbors.length > 0) {
            // console.log("Current value: (" + currentValue + ")")
            // console.log("Neighbors: " + neighbors.join(" | "))
            const newCell = eachCell(currentValue, neighbors)
            // console.log("New Cell value: (" + newCell + ")")
            newTiles[y] = newTiles[y] || []
            newTiles[y][x] = newCell //eachCell(currentValue, neighbors)
          }
        }
      }
    }
    // console.log("Board.step -- complete")
    this.tiles = newTiles
    // throw new Error("Method not implemented.");
  }
}
