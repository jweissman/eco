import { NameSequence } from "../collections/Sequence";
import { Board, Tiles } from "./Board";
import { any } from "./utils/any";
import { clamp } from "./utils/clamp";
import { distance } from "./utils/distance";
import { randomInteger } from "./utils/randomInteger";
import { sample } from "./utils/sample";

const first = <T>(arr: T[], pred: (x: T) => boolean): T => {
  return arr.filter(pred)[0]
}

type Position = [number, number]

function neighborPositions([x,y]: Position): Position[] { // [x: number, y: number): [number, number][] {
  return [
    [x-1,y-1], [x,y-1], [x+1,y-1],
    [x-1,y  ], [x+1,y],
    [x-1,y+1], [x,y+1], [x+1,y+1],
  ]
}

type Cell = {
  value: number,
  neighbors: number[],
  position: Position,
  localAverage: number
}
type HeightmapOperation = (cell: Cell) => number

export class Heightmap {
  get evolution() { return {
    //  (# of steps to erode on height unit)
    // faster values erode more slowly
    erosionSlowness: 64,
    smoothSlowness: 128,
    extrudeIntensity: 3,

    // flow slowness (for every 1 unit rise/fall, how many (10s of) cells to run?)
    viscosity: 2,

    // 100 = constant
    bombardmentRate: 10,
  }}


  matrix: number[][] = []
  maxHeight = 10000
  heightUnit = (this.maxHeight / 10)
  seaLevel = 2 * (this.maxHeight / 10) // - this.heightUnit

  constructor(public width: number, public height: number) {
    //   for (let y = 0; y < this.height; y++) {
    //     this.matrix[y] = []
    // for (let x = 0; x < this.width; x++) {
    //     this.matrix[y][x] = 0 //randomInteger(0,this.maxHeight/8)
    //   }
    // }
  }

  view({ overlays }: { overlays: Board[] } = { overlays: []}): Tiles {
    let viewTiles: Tiles = []
    for (let x = 0; x < this.width-1; x++) {
      for (let y = 0; y < this.height-1; y++) {
        viewTiles[y] = viewTiles[y] || []
        let overlay = overlays.length > 0 && first(overlays, o => {
          let v = o.at(x,y); return v !== '' && v !== undefined
        })
        viewTiles[y][x] = (overlay && overlay.at(x,y))
          || String(
              this.viewHeightAtPos([x,y]) || 0
          )
      }
    }
    return viewTiles;
  }

  evolve(...operations: HeightmapOperation[]) {
    const adapt = () => this.step((value: number, neighbors: number[], position: Position) => {
      let neighborSum = neighbors.reduce((a, b) => a + b, 0)
      let localAverage = //Math.round(
        (neighborSum + value) / (neighbors.length + 1)
      // );

      // times(10, () => {
      operations.forEach((operate: HeightmapOperation) => {
        value = operate({
          value,
          position,
          neighbors,
          localAverage
        })
      // })
       })

      return clamp(value, 0, this.maxHeight)
    })
    adapt()
    // times(1, )
    // times(4, adapt)
  }
  // (ie run through map once and compute all per-cell things simultaneously...)

  viewHeightAtPos = ([x,y]: Position) => {
    return Math.round(clamp(this.valueAtPosition([x,y]) * (1.0/this.heightUnit), 0, 9))
  }


  valueAtPosition = ([x,y]: Position): number => {
    let x0 = x%this.width, y0 = y%this.height;
    this.matrix[y0] = this.matrix[y0] || []
    if (this.matrix[y0][x0] !== undefined) {
      return this.matrix[y0][x0]
    }
    return 0
  } //parseInt(this.matrixp.at(x,y) || '0', 10) }

  write = (value: number, [x,y]: Position) => {
    // throw new Error("Method not implemented.");
    this.matrix[y] = this.matrix[y] || []
    this.matrix[y][x] = Math.round(clamp(value, 0, this.maxHeight))
  }

  // @boundMethod
  each = (cb: (value: number, position: Position) => void) => {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let position: Position = [x,y]
        let value = this.valueAtPosition(position)
        cb(value, position)
      }
    }
  }

  neighbors = ([x,y]: Position): number[] =>
    neighborPositions([x,y]).map(this.valueAtPosition)

  step = (
    cb: (val: number, neighbors: number[], position: Position) => number,
  ): number[][] => {
    let newValues: number[][] = []
    for (let y = 0; y <= this.height; y++) {
      newValues[y] = []
      for (let x = 0; x <= this.width; x++) {
        let currentValue = this.valueAtPosition([x,y])
        let newValue = null
        let neighbors: number[] = this.neighbors([x,y])
        newValue = cb(currentValue, neighbors, [x,y])
        newValues[y][x] = newValue
      }
    }
    this.matrix = newValues
    return newValues
  }

  at = (x: number, y: number): number => this.valueAtPosition([x,y])

  smooth: HeightmapOperation = ({ value, neighbors: ns, localAverage: average }: Cell) => { // = () => {
    let u = this.mu / this.evolution.smoothSlowness
  //   // cleanup coastlines
    // let above = ns.filter(n => n > this.seaLevel).length;
    // if (above <= 2 && value >= this.seaLevel) { return value - u }
    // if (above >= 6 && value <= this.seaLevel) { return this.seaLevel + u*2 }
    if (value < Math.min(...ns) - this.mu) { return value + u }
    if (value > Math.max(...ns) + this.mu) { return value - u }
    if (value < average - this.mu) { return value + u }
    if (value > average + this.mu) { return value - u }
    return value
  };

  mu = this.heightUnit
  flow: HeightmapOperation = ({ value, neighbors: ns, localAverage: average }: Cell) => {
    const immediate = [ns[1], ns[3], ns[5], ns[7]]
    let tallestImmediate = Math.max(...immediate)
    if (value > average || value > tallestImmediate) { return value } //u = this.mu}

    let tallestNeighbor = Math.max(...ns)
    let { viscosity } = this.evolution
    let u = this.mu / (viscosity) // / (3*this.evolution.viscosity)
    // u *= ((value)/this.maxHeight)
    if (tallestNeighbor >= 0.6 * this.maxHeight) { u = this.mu * 1.5 }
    if (Math.abs(tallestNeighbor - this.seaLevel) < this.mu/4) {
      u = this.mu * 3
    }
    // else { u = this.mu / 64 }
    return sample([
      value,
      // value,
      // value,
      // value,
      // Math.round((value+average)/2),
      // Math.round((value + tallestNeighbor - u) / 2),
      // ((tallestNeighbor <= 0.65 * this.maxHeight &&
      // tallestNeighbor >= 0.45 * this.maxHeight)
      //   ? Math.max(value, tallestImmediate - u)
      //   : value), //this.mu),
      // ((tallestNeighbor <= 0.85 * this.maxHeight &&
      // tallestNeighbor >= 0.35 * this.maxHeight)
      //   ? Math.max(value, tallestImmediate)
      //   : value), //this.mu),
      // value > this.seaLevel ? Math.max(value, sample(immediate) - u) : value, //this.mu),
      Math.max(value, tallestImmediate - u), //this.mu),

      // Math.max(value, sample(ns) - 3*u),
    ]);
  };

  erode: HeightmapOperation = ({ value }) => {
    let eroded = value - this.mu/this.evolution.erosionSlowness
    return sample([ value, eroded, value - 1 ])

    // return value > 0.85 * this.maxHeight
    //   ? value - this.mu
    //   : eroded
  }

  adjuster = (amount: number) => (position: Position) => {
    let value = this.valueAtPosition(position)
    this.write(value + amount, position)
  }

  extrude = (positions: [number, number][]) => {
    const raiseGround = this.adjuster(
      this.heightUnit * this.evolution.extrudeIntensity
    )
    // choose(positions.length/2, positions).forEach(raiseGround)
    positions.forEach(raiseGround) //pos => raiseGround(pos))
  };

  intrude = (positions: [number, number][]) => {
    const lowerGround = this.adjuster(-this.heightUnit * this.evolution.extrudeIntensity / 3) //heightUnit)
    positions.forEach(lowerGround)
  };

  bombard = (intensity: number = 1) => {
    let radius = randomInteger(1,4+randomInteger(0,intensity));
    let impactSite: [number, number] = [ randomInteger(1, this.width-1), randomInteger(1, this.height-1) ]
    const distanceToImpact = (pos: [number, number]) => distance(pos, impactSite)
    let craterPositions: [number, number][] = []
    let craterEdge: [number, number][] = []
    let [x0,y0]: [number, number] = impactSite;
    for (let x=x0 - radius; x < x0 + radius; x++) {
      for(let y = y0 - radius; y < y0 + radius; y++) {
        let d = Math.round(distanceToImpact([x,y]))
        if (Math.abs(d - radius) < 1) {
          craterEdge.push([x,y])
        } else if (d < radius) {
          craterPositions.push([x,y])
        }
      }
    }
    this.intrude(craterPositions);
    this.extrude(craterEdge);
  }

  orogeny = (mountains: [number, number][]) => this.extrude(mountains)

  geoform = (hades: boolean, mountains: [number, number][]) => {
    const d100 = randomInteger(0,100)
    if (d100 < this.evolution.bombardmentRate) {
      this.bombard(hades ? this.height/2 : this.height/8);
    }

    if (hades) {
      this.extrude(mountains)
    }
    this.evolve(
      this.flow,
      this.erode,
      this.smooth
    )
  };

  componentNames = new NameSequence()

  // todo should use view heights??
  components(
    consider: (value: number, ns: number[]) => boolean,
  ): { [component: string]: [number, number][] } {
    let componentMap: { [component: string]: [number, number][] } = {}
    this.each((val, pos) => {
      let ns = this.neighbors(pos)
      let roundedValue = Math.round(val / this.mu) * this.mu
      if (!!consider(roundedValue, ns)) {
        // do we belong to an existing region? (adjacency)
        let existingComponentNames = Object.keys(componentMap).filter(component => {
          // are any of the points in r adjacent to this one?
          let adjacent = any(componentMap[component], ([x1,y1]) => {
            return distance(pos, [x1,y1]) <= Math.sqrt(2)
          })
          return adjacent
        })
        if (existingComponentNames.length > 0) {
          let firstAdjacentComponentName = existingComponentNames[0]
          componentMap[firstAdjacentComponentName].push(pos)
          if (existingComponentNames.length > 1) {
            // merge all regions...
            existingComponentNames.forEach(component => {
              // delete that region + add to first region
              if (component !== firstAdjacentComponentName) {
                componentMap[firstAdjacentComponentName] = [
                  ...componentMap[firstAdjacentComponentName],
                  ...componentMap[component],
                ]
                delete componentMap[component]
              }
            })
          }
        } else {
          // invent a new region
          let component = this.componentNames.next;
          componentMap[component] = [pos]
        }
      }
    })
    return componentMap
  }

  regions = () => this.components(val => val >= this.seaLevel)
  waterways = () => this.components(val => val < this.seaLevel)
  ranges = () => this.components(val => val >= 0.8 * this.maxHeight)

  valleys = () => {
    let level = this.seaLevel
    return this.components((val,ns) => val >= level && Math.abs(val-level) < this.heightUnit
                                    && ((ns.reduce((a,b) => a + b, 0) / ns.length) >= level)
    )
  }

  bays = () => {
    let level = this.seaLevel
    return this.components((val,ns) => val <= level && Math.abs(val-level) < this.heightUnit
                                    && ((ns.reduce((a,b) => a + b, 0) / ns.length) <= level));
    // let level = this.seaLevel //this.seaLevel - 1
    // return this.components(v => v === level || v === level - 1)
    //(val) => val === level || val === level - 1)) // || val === level - 2))
                                    // && ((ns.reduce((a,b) => a + b, 0) / ns.length) <= level + 1)
    // )
  }
                                           
 // could also detect trenches?? poetically 'deeps'?
}
