import { NameSequence } from "../collections/Sequence";
import { Board } from "./Board";
import { any } from "./utils/any";
import { clamp } from "./utils/clamp";
import { distance } from "./utils/distance";
import { randomInteger } from "./utils/randomInteger";
import { sample } from "./utils/sample";
import { times } from "./utils/times";
export class Heightmap {
  map: Board = new Board(this.width, this.height);
  groundLevel = 5

  constructor(public width: number, public height: number) { }

  at(x: number, y: number): number { return parseInt(this.map.at(x,y) || '0', 10) }

  apply(fn: (val: number, neighbors: number[], average: number, position: [number, number]) => number[], rate: number = 1000) {
    this.map.step((val: string, neighbors: string[], position: [number, number]) => {
      if (randomInteger(0, 1000) <= rate) {
        let value = parseInt(val || '0', 10);
        let neighborValues = neighbors.map(neighbor => parseInt(neighbor || '4', 10));
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
      let above = ns.filter(n => n >= this.groundLevel).length;
      if (above >= 5 && value < this.groundLevel) { return [value + 1] }
      else if (above < 4 && value >= this.groundLevel) { return [value - 1] }
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
      let above = ns.filter(n => n >= this.groundLevel).length;
      if (above >= 6 && value < this.groundLevel) { return [this.groundLevel, this.groundLevel + 1] }
      if (above === 0) { return [value] }
      return [ max + 1, max, max - 1, ]
    });
  };

  erode = () => {
    this.apply((value, ns, average) => {
      if (value < average) { return [value] }
      return [ value, average, Math.min(...ns) ]
    })
  };

  extrude = (positions: [number, number][]) => {
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
    const d100 = randomInteger(0,100)
    if (d100 < 12) this.extrude(mountains)
    times(3, this.flow)
  }

  geoform = (hades: boolean, mountains: [number, number][]) => {
    const d100 = randomInteger(0,100)
    if (hades) {
      this.orogeny(mountains)
      this.erode()
      if (d100 < 31) { this.bombard(23); }
    } else {
      this.flow()
      this.smooth()
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

  regionNames = new NameSequence()

  regions(): { [region: string]: [number, number][] } {
    let regionMap: { [region: string]: [number, number][] } = {}
    this.map.each((x, y, val) => {
      if (parseInt(val, 10) >= this.groundLevel) {
        // do we belong to an existing region? (adjacency)
        let existingRegionNames = Object.keys(regionMap).filter((regionName) => {
          // are any of the points in r adjacent to this one?
          let adjacent = any(regionMap[regionName], ([x1,y1]) => {
            return distance([x,y], [x1,y1]) <= 2
          })
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
                ]
                delete regionMap[regionName]
              }
            })
          }
        } else {
          // console.log("Found a new region", { x, y })
          // invent a new region
          let newRegion = this.regionNames.next;
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
