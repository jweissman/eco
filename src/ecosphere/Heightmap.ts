import { NameSequence } from "../collections/Sequence";
import { Board, Tiles } from "./Board";
import { any } from "./utils/any";
import { clamp } from "./utils/clamp";
import { distance } from "./utils/distance";
import { first } from "./utils/first";
import { randomInteger } from "./utils/randomInteger";
import { choose, sample } from "./utils/sample";


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
    erosionSlowness: 4,
    smoothSlowness: 16,
    extrudeIntensity: 10,

    // flow slowness (for every 1 unit rise/fall, how many (10s of) cells to run?)
    viscosity: 1,

    // 100 = constant
  bombardmentRate: 50,
  }}


  matrix: number[][] = []
  maxHeight = 32
  heightUnit = (this.maxHeight / 10)
  seaLevel = 2 * (this.maxHeight / 10) // - this.heightUnit

  constructor(public width: number, public height: number) {
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
    // let u = this.mu / 5 //128 // (1+2*this.evolution.smoothSlowness)
    // return sample(ns) - u
  //   // cleanup coastlines
    let level = this.seaLevel //- this.mu //+ this.mu
    // const immediate = [ns[1], ns[3], ns[5], ns[7]]
    let aboveWater = ns.filter(n => n >= level).length;
    if (aboveWater <= 2 && value >= level) { return level - this.mu } //value - u } //level - this.mu }
    if (aboveWater >= 6 && value <= level) { return level + this.mu } //value + u }
    // if (value < Math.min(...ns) - this.mu) { return value + u }
    // if (value > Math.max(...ns) + this.mu) { return value - u }
    // if (value < average - this.mu) { return value + u }
    // if (value > average + this.mu) { return value - u }


    return value
  };

  mu = this.heightUnit
  flow: HeightmapOperation = ({ value, neighbors: ns, localAverage: average }: Cell) => {
    if (value > 0) { return value }
    // const immediate = [ns[1], ns[3], ns[5], ns[7]]
    let tallest = Math.max(...ns)
    let { viscosity } = this.evolution
    // if (value >= tallest) return tallest
    
    let u = sample([
      0.001,
      0.002,
      // 0.0025,
      // 0.005,
      // 0.0075,
      0.01,0.1,1,2, //,5,10,20
      3,5,8,13,21,34,
      // 0.5,1,2,3
      // 0.01,
      // 0.02,
      // 0.025,
      // 0.05,
      // 0.1,0.2,
      // 0.25,
      // // // // 0.5,
      // 0.5,0.6,
      // 0.75,
      // 0.8,
      // 0.9,
      // 1,
      // 1.1,
      // 1.2,
      // 1.5,
      // // 2,3,
      // // 5,7,
      // 2,3,5,7,9,13,21,36
    ])*this.mu/(1+2*viscosity)
    if (tallest < 0.55 * this.maxHeight) { u/=3}
    if (tallest < 0.65 * this.maxHeight
     && value > this.seaLevel) {
       if (randomInteger(0,100) < 3) { u*=-1 }
    }
    if (tallest > 0.75 * this.maxHeight) { u*=1.25 }
    if (tallest > 0.8  * this.maxHeight) { u*=1.5 }
    if (tallest > 0.85 * this.maxHeight) { u*=2 }
    if (tallest > 0.9  * this.maxHeight) { u*=3 }
    if (tallest > 0.95* this.maxHeight) { u*=5}
    // if (tallest > 0.98* this.maxHeight) { u*=5}
    return Math.max(
      value,
      tallest-u,
      // Math.max(ns[1], ns[3], ns[5], ns[7])-u,
    ) //sample([tallest,tallest-u]) //-(this.mu/viscosity)
    // return value //tallest //- sample([1,2])*this.mu //sample([0.25,0.5,1,2,3])*this.mu)
    // return value >= tallest ? value : tallest-1 // sample([tallest - 1
    //const immediate = [ns[1], ns[3], ns[5], ns[7]]
    //let u = this.mu / (1+viscosity)
    //return sample([
    //  // tallest,
    //  tallest - 1,
    //  sample(immediate) - sample([0.5,2,3]) * u,
    //  sample(ns) - sample([3,5,7])*u,
    //  Math.max(
    //    value,
    //    sample(ns) - u,
    //  )
    //])
  };

  erode: HeightmapOperation = ({ value, neighbors: ns, localAverage }) => {
    // if (value > 0.7 * this.maxHeight) return value-this.mu/2

    // return (value + value + localAverage + Math.max(...ns)) / 4
    // return Math.min(localAverage + this.mu/2, value)
    // if (localAverage > this.maxHeight/2 && value > localAverage + this.mu) return localAverage
    if (value > localAverage + this.mu) { return sample([value, value-2, value+1]) }
    if (value > Math.max(...ns)) { return value }

    // let d100 = randomInteger(0,100)
    // let { erosionSlowness } = this.evolution
    // if (d100 >= erosionSlowness) { return value }
    let smoothed = (value + Math.max(ns[1], ns[3], ns[5], ns[7]) + localAverage + Math.max(...ns) + Math.min(...ns)) / 5
    return sample([
      value, value, value, value,
      value, value, value, value,
      value, value, value, value,
      value, value, value, value,
      value, value, value, value,
      // value - this.mu,
      smoothed,
      (smoothed + value) / 2,
      // Math.max(...ns)

    ])
    // return Math.floor(value + localAverage + sample([...ns])) / 3 //, localAverage])

    // return sample([
    //   // value, value, value, value,
    //   // value, value, value, value,
    //   // value, value, value, value,
    //   // value, value, value, value,
    //   // value, value, value, value,
    //   // value - this.mu,
    //   localAverage
    // ])
    // let u = (this.mu)/128 // (1+2*this.evolution.erosionSlowness)
    // let eroded = value - u
    // return (eroded + localAverage + Math.max(...ns)) / 3
  }

  private adjuster = (amount: number) => (position: Position) => {
    let value = this.valueAtPosition(position)
    this.write(value + amount, position)
  }

  extrude = (positions: [number, number][]) => {
    if (positions.length === 0) return
    const raiseGround = this.adjuster(
      this.heightUnit * this.evolution.extrudeIntensity
    )
    choose(8, positions).forEach(raiseGround)
    // positions.forEach(raiseGround) //pos => raiseGround(pos))
  };

  intrude = (positions: [number, number][]) => {
    const lowerGround = this.adjuster(-this.heightUnit * this.evolution.extrudeIntensity / 2) //heightUnit)
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

  // orogeny = (mountains: [number, number][]) => this.extrude(
  //   choose(2, mountains)
  // )

  geoform = (hades: boolean, mountains: [number, number][]) => {
    // const d100 = randomInteger(0,100)
    // if (d100 < this.evolution.bombardmentRate) {
    //   this.bombard(hades ? this.height/2 : this.height/8);
    // }

    if (hades) {
      this.extrude(mountains)
    }

    this.evolve(
      this.flow,
      // hades
      this.erode,
      // this.smooth,
      // todo this.sculpt  ...
      // hades ? this.erode : this.smooth
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

  _regions: { [name: string]: [number, number][] } = {}

  regions = () => {
    if (Object.entries(this._regions).length === 0) {
     this._regions = this.components(val => val >= this.seaLevel)
    }
    return this._regions
  }

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
