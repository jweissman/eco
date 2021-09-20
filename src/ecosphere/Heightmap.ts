import { NameSequence } from "../collections/Sequence";
import { Board } from "./Board";
import { any } from "./utils/any";
import { clamp } from "./utils/clamp";
import { distance } from "./utils/distance";
import { randomInteger } from "./utils/randomInteger";
import { sample } from "./utils/sample";
import { times } from "./utils/times";
export class Heightmap {
  // todo just directly use raw integer map here?
  // even array buffers maybe if perf improvements

  map: Board = new Board(this.width, this.height);
  seaLevel = 5

  constructor(public width: number, public height: number) { }

  at(x: number, y: number): number { return parseInt(this.map.at(x,y) || '0', 10) }

  apply(fn: (val: number, neighbors: number[], average: number, position: [number, number]) => number[], rate: number = 1000) {
    this.map.step((val: string, neighbors: string[], position: [number, number]) => {
      if (randomInteger(0, 1000) <= rate) {
        let value = parseInt(val || '0', 10);
        let neighborValues = neighbors.map(neighbor => parseInt(neighbor || '0', 10));
        let neighborSum = neighborValues.reduce((a, b) => a + b, 0)
        let localAverage = Math.floor(
          (neighborSum + value) / (neighbors.length + 1)
        );
        let average = localAverage;
        let values = fn(value, neighborValues, average, position);
        let newVal = clamp(sample(values), 0, 9);
        return String(newVal);
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
      return [ value, ]
    })
  };


  flow = () => {
    this.apply((value, ns, average) => {
      if (value >= average) { return [value] }
      let immediate = [ns[1], ns[3], ns[5], ns[7]]
      let max = Math.max(...immediate)
      let above = ns.filter(n => n >= this.seaLevel).length;
      if (above >= 7 && value < this.seaLevel) { return [this.seaLevel, this.seaLevel + 1] }
      if (above === 0) { return [value, value+1, value+2] }
      return [
        // max + 2,
        // max + 1,
        // max,
        // value,
        max,
        max - 1,
        // max - 2,
        // max - 5,
        // value + 1,
        // Math.min(...ns)+1,
        // value - 1,
        // ...ns.filter(n => n >= this.groundLevel)
      ]
    });
  };

  erode = (rate = 1000) => {
    this.apply((value, ns, average) => {
      if (value < average) { return [value] }
      return [
        value,
        value - 1,
        // value - 2,
        // average - 1,
        // Math.floor((value + average) / 2),
        Math.min(...ns)
        // value-1,
        // Math.ceil(value/2),
        // // value, average, Math.min(...ns),
        // Math.round((value+average)/2)
      ]
    }, rate)
  };

  extrude = (positions: [number, number][]) => {
    positions.forEach(pos => {
      let h = parseInt(this.map.at(...pos) || '0', 10)
      let val = clamp(h+randomInteger(-1,7),0,9);
      if (pos) { this.map.write(String(val), ...pos); }
    })
  };

  intrude = (positions: [number, number][], depth: number = 1) => {
    positions.forEach(pos => {
      let h = parseInt(this.map.at(...pos) || '9', 10)
      let val = clamp(h-randomInteger(-1,7),0,9);
      if (pos) { this.map.write(String(val), ...pos); }
    })
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
    const d100 = randomInteger(0,100)
    if (d100 < 16) this.extrude(mountains)
    times(4, this.flow)
  }

  geoform = (hades: boolean, mountains: [number, number][]) => {
    const d100 = randomInteger(0,100)
    if (hades) {
      this.orogeny(mountains)
      this.erode()
      if (d100 < 32) { this.bombard(36); }
    } else {
      this.smooth()
      // if (d100 < 24) this.smooth()
      if (d100 < 16) times(2, () => this.bombard(7) )
      this.flow()
      // this.erode(4)
    }
  };

  componentNames = new NameSequence()

  components(
    consider: (value: number, ns: number[]) => boolean,
  ): { [component: string]: [number, number][] } {
    let componentMap: { [component: string]: [number, number][] } = {}
    this.map.each((x, y, val) => {
      let ns = this.map.neighbors(x,y).map(n => parseInt(n, 10))
      // ns.splice(5,1)
      // apply
      if (!!consider(parseInt(val, 10), ns)) {
        // do we belong to an existing region? (adjacency)
        let existingComponentNames = Object.keys(componentMap).filter(component => {
          // are any of the points in r adjacent to this one?
          let adjacent = any(componentMap[component], ([x1,y1]) => {
            return distance([x,y], [x1,y1]) <= Math.sqrt(2)
          })
          return adjacent
        })
        if (existingComponentNames.length > 0) {
          let firstAdjacentComponentName = existingComponentNames[0]
          componentMap[firstAdjacentComponentName].push([x,y])
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
          componentMap[component] = [[x,y]]
        }
      }
    })
    return componentMap
  }

  regions = () => this.components(val => val >= this.seaLevel)
  waterways = () => this.components(val => val < this.seaLevel)
  ranges = () => this.components(val => val >= 8)

  // okay so literal inverse of this would be valleys?
  // really -- want to confirm the entire frontier is above ground level..
  // otherwise a beach or mesa or something ...
  valleys = () => {
    let level = this.seaLevel
    return this.components((val,ns) => (val === level || val === level + 1 || val === level + 2)
                                    && ((ns.reduce((a,b) => a + b, 0) / ns.length) >= level)
    )
  }

  // interesting, bays are similar to valleys -- but inverse, we *don't* want enclosed areas (lakes)
  bays = () => {
    let level = 4 //this.seaLevel - 1
    return this.components(v => v === level || v === level - 1)
    //(val) => val === level || val === level - 1)) // || val === level - 2))
                                    // && ((ns.reduce((a,b) => a + b, 0) / ns.length) <= level + 1)
    // )
  }
                                           
 // could also detect trenches?? poetically 'deeps'?
}
