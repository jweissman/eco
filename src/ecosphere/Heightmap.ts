import { Sequence } from "../collections";
import { Board } from "./Board";
import { clamp } from "./utils/clamp";
import { randomInteger } from "./utils/randomInteger";
import { replicate } from "./utils/replicate";
import { sample } from "./utils/sample";
import { times } from "./utils/times";

const distance = (a: [number, number], b: [number, number]) => {
  let dx = Math.abs(a[0] - b[0]);
  let dy = Math.abs(a[1] - b[1]);
  return Math.sqrt(dx * dx + dy * dy)
}

// const all = <T>(list: Array<T>, pred: (value: T, index: number) => boolean) => {
//   // let matchesAll = true
//   // list.forEach((value: T, index: number) => {
//   //   if (!pred(value, index)) { matchesAll = false }}
//   //   )
//   // return matchesAll;

//   for (let i = 0; i < list.length; i++) {
//     if (!pred(list[i], i)) {
//       return false
//     }
//   }
//   return true
// }

const any = <T>(list: Array<T>, pred: (value: T) => boolean) => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) {
      return true
    }
  }
  return false
  // let matchesAny = false
  // list.forEach((value: T) => { if (pred(value)) { matchesAny = true }})
  // return matchesAny;
}

// type Element = 0 | 1 | -1
// type Morpheme = [number, number, number, number, number, number, number, number, number]
// type Structure = Morpheme[]
// const identity: Structure = [[ -1, -1, -1,
//                                -1, 1, -1,
//                                -1, -1, -1 ]];

// const isolatedPoints: Structure = [
//   [
//      0,  0,  0,
//      0,  1,  0,
//      0,  0,  0,
//   ],
// ]

// const edges: Structure = [
//   [
//      0,0,-1,
//      0,1, 1,
//     -1,1,-1,
//   ],
//   [
//     -1,0,0,
//      1,1,0,
//     -1,1,-1,
//   ],
//   [
//     -1,1,-1,
//      1,1,0,
//     -1,0,0,
//   ],
//   [
//     -1,1,-1,
//     0, 1,1,
//     0, 0,-1,
//   ]
// ] 

// type LocalContext = { value: number, neighbors: number, average: number }
// type Transform = (ctx: LocalContext) => number
export class Heightmap {
  map: Board = new Board(this.width, this.height);
  groundLevel = 5

  constructor(public width: number, public height: number) { }

  at(x: number, y: number): number { return parseInt(this.map.at(x,y) || '0', 10) }

  apply(fn: (val: number, neighbors: number[], average: number, position: [number, number]) => number[], rate: number = 1000) {
    this.map.step((val: string, neighbors: string[], position: [number, number]) => {
      if (randomInteger(0, 1000) <= rate) { //return val; }
        let value = parseInt(val || '0', 10);
        // let trueNeighbors = neighbors.slice(4,1)
        let neighborValues = neighbors.map(neighbor => parseInt(neighbor || '2', 10));
        let neighborSum = neighborValues.reduce((a, b) => a + b, 0)
        // if (neighborSum > 0) {
        // console.log({ neighborSum })
        // }
        // let neighborAverage = Math.floor(
        //   neighborSum / 8 //trueNeighbors.length
        // );

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
      // let directs = [ns[1], ns[3], ns[5], ns[7]]
      let above = ns.filter(n => n >= this.groundLevel).length;
      if (above >= 5 && value < this.groundLevel) { return [value + 1] }
      else if (above < 4 && value >= this.groundLevel) { return [value - 1] }
      // else if (above <= 4) { return [
      //   Math.floor((value + average) / 2),
      // ]}
      // if (above >= 8) {
      //   return [value,average]
      // }
      // if (value === this.groundLevel) { return [ value ]}
      // if (value < average) { return [ value, value + 1 ]}
      // if (value > average) { return [ value, value - 1 ]}
      if (value < average - 1) { return [ value, value + 1, Math.floor((value + average) / 2) ]}
      if (value > average + 1) { return [ value, value - 1, Math.floor((value + average) / 2) ]}
      
      return [
        value,
        // value + 1,
        // Math.floor((value + average) / 2),
        // average
      ]
    })
  };


  flow = () => {
    this.apply((value, ns, average) => {
      if (value >= average) { return [value] }
      let immediate = [ns[1], ns[3], ns[5], ns[7]]
      let max = Math.max(...immediate)
      // let min = Math.min(...immediate)

      let above = ns.filter(n => n >= this.groundLevel).length;
      if (above >= 6 && value < this.groundLevel) { return [this.groundLevel, this.groundLevel + 1] }
      if (above === 0) { return [value] }

      return [
        // max*2,
        max + 1,
        // value,
        max,
        max - 1,
        // average,
        // this.groundLevel + 1,
        // this.groundLevel + 2,
      ]
    });
  };

  erode = () => {
    this.apply((value, ns, average) => {
      if (value < average) { return [value] }
      return [
        value,
        // value-1,
        // Math.round((value + average) / 2),
        average,
        // Math.round((value + Math.min(...ns)) / 2),
        
        // value-1,
        // Math.min(...ns),
        // value-2,
        // average+1,
      ]
    })
  };

  // recede = () => {
  //   this.apply((value, ns, average) => {
  //     if (value > this.groundLevel+1) { return [value]; }
  //     // let max = Math.max(...ns)
  //     return [
  //       value,
  //       // value+1,
  //       // max,
  //       average,
  //       Math.floor((value + average) / 2),
  //     ]
  //   });
  // };

  extrude = (positions: [number, number][]) => {
    // let pos = sample(positions);
    positions.forEach(pos => {
    let h = parseInt(this.map.at(...pos) || '0', 10)
    let val = clamp(h+randomInteger(1,9),0,9);
    if (pos) { this.map.write(String(val), ...pos); }
    })
  };

  intrude = (positions: [number, number][], depth: number = 1) => {
    positions.forEach(pos => {
      let h = parseInt(this.map.at(...pos) || '9', 10)
      let val = clamp(h-randomInteger(1,9),0,9);
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
    // this.flow()

    const d100 = randomInteger(0,100)
    if (d100 < 12) this.extrude(mountains)
    // times(3, () => this.extrude(mountains))
    times(2, this.flow)
    // times(2, () => {
    //   times(8, () => this.extrude(mountains))
    //   times(4, this.flow)
    // })
  }

  geoform = (hades: boolean, mountains: [number, number][]) => {
    const d100 = randomInteger(0,100)
    if (hades) {
      this.orogeny(mountains)
      this.erode()
      // if (d100 < 60) this.erode()
      if (d100 < 31) { this.bombard(23); }
    } else {
      // this.flow()
      // if (d100 < 12) {
        this.smooth()
      // }
      if (d100 < 15) times(2, () => this.bombard(8) )

    }
  };

  binaryImage(threshold: number = this.groundLevel): Board {
    let binary = new Board(this.width, this.height)
    this.map.each((x, y, val) => {
      let value = '0';
      if (parseInt(val, 10) >= threshold) { value = '1'; } 
      binary.write(value, x, y)
    })
    return binary
  }

  regionNames = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L' ]
  regionCount = new Sequence()
  generateRegionName = () => {
    let n =this.regionCount.next
    return this.regionNames[n % this.regionNames.length]
         + (replicate(["'"], n).join(''))
  }

  regions(): { [region: string]: [number, number][] } {
    let regionMap: { [region: string]: [number, number][] } = {}
    this.map.each((x, y, val) => {
      if (parseInt(val, 10) >= this.groundLevel) {
        // do we belong to an existing region? (adjacency)
        let existingRegionNames = Object.keys(regionMap).filter((regionName) => {
          // are any of the points in r adjacent to this one?
          let adjacent = any(regionMap[regionName], ([x1,y1]) => {
            // return Math.abs(x1 - x) <= 1 && Math.abs(y1 - y) <= 1
            return distance([x,y], [x1,y1]) <= 2
          }) //val === r
          // if (adjacent) { existingRegion = regionName }
          return adjacent
        })
        if (existingRegionNames.length > 0) {
          let firstAdjacentRegionName = existingRegionNames[0]
          if (existingRegionNames.length === 1) {
            regionMap[firstAdjacentRegionName].push([x,y])
          } else {
            // merge all regions...
            existingRegionNames.forEach((regionName) => {
              // delete that region + add to first region
              if (regionName !== firstAdjacentRegionName) {
                regionMap[firstAdjacentRegionName] = [
                  ...regionMap[firstAdjacentRegionName],
                  ...regionMap[regionName],
                ] //.push([x,])

                delete regionMap[regionName]
              }
            })
          }
        } else {
          console.log("Found a new region", { x, y })
          // invent a new region
          // let regionCount = Object.keys(regionMap).length
          let newRegion = this.generateRegionName() //[regionCount]
          regionMap[newRegion] = [[x,y]]
        }
      }
    })

    console.log("Found regions!!", { regionMap })
    return regionMap
  }

  // looks for a particular pattern in the binary image (fixed orientations...)
  // transform(structure: Structure = edges, threshold: number = this.groundLevel): Board {
  //   let image = this.binaryImage(threshold)
  //   const matches = (values: number[]) => {
  //     return any(structure, (morpheme: Morpheme) => {
  //       const matchesAll = all(morpheme, (element, index) => {
  //         const morphology = element 
  //         if (morphology === -1) { return true }
  //         const value = values[index]
  //         return morphology === value
  //       })
  //       return matchesAll
  //     })
  //   }
  //   image.step((_val: string, neighbors: string[]) => {
  //     let region = neighbors.map(n => parseInt(n, 10))
  //     return matches(region) ? '1' : '0'
  //   }, '-1')
  //   return image
  // }

  // get components() { return this.binaryImage.regions(); }
}
