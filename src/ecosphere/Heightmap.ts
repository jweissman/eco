import { NameSequence } from "../collections/Sequence";
import { Board, Tiles } from "./Board";
import { any } from "./utils/any";
import { clamp } from "./utils/clamp";
import { distance } from "./utils/distance";
import { randomInteger } from "./utils/randomInteger";
import { choose, sample } from "./utils/sample";
import { times } from "./utils/times";

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
export class Heightmap {
  view({ overlays }: { overlays: Board[] } = { overlays: []}): Tiles {
    let viewTiles: Tiles = []
    for (let x = 0; x <= this.width; x++) {
      for (let y = 0; y <= this.height; y++) {
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

  matrix: number[][] = []
  seaLevel = 5000
  maxHeight = 10000
  heightUnit = (this.maxHeight / 10)

  constructor(public width: number, public height: number) { }

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
    this.matrix[y][x] = Math.round(clamp(0, value, this.maxHeight))
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

  // @boundMethod
  neighbors = ([x,y]: Position): number[] => { 
    return neighborPositions([x,y]).map(this.valueAtPosition)
  }

  // @boundMethod
  step = (
    cb: (val: number, neighbors: number[], position: Position) => number,
    defaultValue: number = 0
  ): number[][] => {
    // console.log("STEP", { dims: [ this.width, this.height ] })
    let newValues: number[][] = []
    // this.matrix = this.matrix || []
    // const at = (x: number, y: number) => this.at(x,y) || defaultValue

    for (let y = 0; y <= this.height; y++) {
      newValues[y] = [] // newValues[y] || []
      for (let x = 0; x <= this.width; x++) {
        let currentValue = this.valueAtPosition([x,y]) //.at(x,y) //at(x,y)
        let newValue = null // currentValue
        // if (currentValue !== undefined) {
        let neighbors: number[] = this.neighbors([x,y])
        newValue = cb(currentValue, neighbors, [x,y])
        // }

        // this.write(newValue, [x,y])
        // newValue = newValue === null ? defaultValue : newValue
        // newValue = clamp(newValue, 0, this.maxHeight)

        newValues[y][x] = newValue

        // if (newValue > 0) { console.log("NEW VAL", { newValue }) }
      }
    }

    // keep thinking we should stack all the transforms and do this exactly once???
    // console.log("STEP", { newValues })
    this.matrix = newValues //tiles = newValues

    return newValues
  }

  // @boundMethod
  at = (x: number, y: number): number => {
    return this.valueAtPosition([x,y])
    // return this.matrix[y] && this.matrix[y][x];
  } //parseInt(this.matrixp.at(x,y) || '0', 10) }

  // @boundMethod
  apply = (
    fn: (val: number, neighbors: number[], average: number, position: Position) => number[],
    rate: number = 1000
  ) => {
    this.step((val, neighbors, position) => {
      if (randomInteger(0, 1000) <= rate) {
        let value = val //parseInt(val || '0', 10);
        let neighborValues = neighbors //.map(neighbor => parseInt(neighbor || '0', 10));
        let neighborSum = neighborValues.reduce((a, b) => a + b, 0)
        // let neighborAverage = Math.round(
        //   (neighborSum) / (neighbors.length)
        // );
        let localAverage = Math.round(
          (neighborSum + value) / (neighbors.length + 1)
        );

        let average = localAverage;
        let values = fn(value, neighborValues, average, position);
        let newVal = clamp(sample(values), 0, this.maxHeight) //clamp(sample(values), 0, 9);
        return newVal //String(newVal);
      } else { return val; }
    });
  }

  smooth = () => {
    this.apply((value, ns, average) => {
      // cleanup coastlines
      let above = ns.filter(n => n >= this.seaLevel).length;
      if (above >= 5 && value < this.seaLevel) { return [value + 1] }
      else if (above < 4 && value >= this.seaLevel) { return [value - 1] }
      if (value < average - 1) { return [ value, value + 1, Math.floor((value + average) / 2) ]}
      if (value > average + 1) { return [ value, value - 1, Math.floor((value + average) / 2) ]}
      return [ value ]
    })
  };

  flow = () => {
    this.apply((value, ns, average) => {
      if (value > average) { return [value] }
      let immediate = [ns[1], ns[3], ns[5], ns[7]]
      let maxImmediate = Math.max(...immediate)
      let maxNeighbor = Math.max(...ns)
      return [
        Math.max(
          value,
          maxImmediate - this.heightUnit*1.6,
          maxNeighbor - this.heightUnit*1.3,
          average - this.heightUnit,
        ),
      ]
    });
  };

  erode = (rate = 1000) => {
    this.apply((value, ns, average) => {
      if (value < average) { return [value] }
      return [
        value,
        value - this.heightUnit / 16,
      ]
    }, rate)
  };

  adjuster = (amount: number) => (position: Position) => {
    let value = this.valueAtPosition(position)
    this.write(value + amount, position)
  }

  extrude = (positions: [number, number][]) => {
    // console.log("extrude", { positions })
    const raiseGround = this.adjuster(this.heightUnit*4)
    choose(positions.length/2, positions).forEach(raiseGround)
    // positions.forEach(raiseGround)
  };

  intrude = (positions: [number, number][]) => {
    const lowerGround = this.adjuster(-this.heightUnit*3)
    positions.forEach(lowerGround)
    // positions.forEach(pos => {
    //   let h = this.valueAtPosition(pos) //parseInt(this.valueA(...pos)map.at(...pos) || '9', 10)
    //   let val = h - randomInteger(1, this.heightUnit*2) //clamp(h-randomInteger(-1,7),0,9);
    //   if (pos) { this.write(val, pos); }
    // })
  };

  bombard = (intensity: number = 1) => {
    let radius = randomInteger(1,4+randomInteger(0,intensity));
    let impactSite: [number, number] = [ randomInteger(1, this.width-1), randomInteger(1, this.height-1) ]
    const distanceToImpact = (pos: [number, number]) => distance(pos, impactSite)
    let craterPositions: [number, number][] = []
    let craterEdge: [number, number][] = []
    for (let x=0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
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

  orogeny = (mountains: [number, number][]) => {
    // console.log('orogeny')
    // const d100 = randomInteger(0,100)
    // if (d100 < 15)
    this.extrude(mountains)
    this.flow()
    // times(5, this.flow)
    // this.step(val => val + this.heightUnit)
  }

  geoform = (hades: boolean, mountains: [number, number][]) => {
    // this.step(val => val + this.heightUnit)
    // this.orogeny(mountains)

    this.erode()
    const d100 = randomInteger(0,100)
    if (hades) {
      this.orogeny(mountains)
      this.erode()
      if (d100 < 32) { this.bombard(this.height * 0.5); }
    } else {
      this.smooth()
      if (d100 < 16) times(2, () => this.bombard(7) )
      this.flow()
    }
  };

  componentNames = new NameSequence()

  // todo should use view heights??
  components(
    consider: (value: number, ns: number[]) => boolean,
  ): { [component: string]: [number, number][] } {
    let componentMap: { [component: string]: [number, number][] } = {}
    this.each((val, pos) => {
      let ns = this.neighbors(pos)
      if (!!consider(val, ns)) {
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
