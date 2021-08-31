import { boundMethod } from "autobind-decorator";
import { Board } from "../ecosphere/Board";
import { Model } from "../ecosphere/Model";
import { EvolvingStocks } from "../ecosphere/types";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { construct, replicate } from "../ecosphere/utils/replicate";
import { sample } from "../ecosphere/utils/sample";
import { times } from "../ecosphere/utils/times";

class Heightmap {
  map: Board = new Board(this.width, this.height)
  constructor(public width: number, public height: number) {}
  apply(fn: (val: number, neighbors: number[], average: number) => number[]) {
    this.map.step((val: string, neighbors: string[]) => {
      let value = parseInt(val)
      let neighborValues = neighbors.map(neighbor => parseInt(neighbor))
      let neighborAverage = Math.floor(
        neighborValues.reduce((a,b) => a + b, 0) / (neighbors.length)
      )
      let values = fn(value, neighborValues, neighborAverage)
      let newVal = Math.min(Math.max(
        sample(values),
      0),9)
      return String(newVal)
    })
  }

  smooth = (hard: boolean = false) => {
    this.apply((value, _neighbors, average) => {
      return hard ? [...replicate([value], 4), average] : [ ...replicate([value], 10), average ]
    })
  }

  noise = () => {
    this.apply((value, _neighbors, average) => {
      return [ ...replicate([value], 50), value + 1, value - 1, ]
    })
  }

  flow = () => {
    this.apply((value, _neighbors, average) => {
      if (value < average) {
        return [
           ...replicate([value], 25),  // integrity..
           ...replicate([average-2], 25),
           ...replicate([average-1], 50),
           ...replicate([average], 100),
           ...replicate([average+1], 50),
           ...replicate([average+2], 25),
           ...replicate([average+3], 10),
           ...replicate([average+4], 5),
           ...replicate([average+5], 3),
           ...replicate([average+6], 2),
           ...replicate([average+7], 1),
           ...replicate([average+8], 1),
        ]
      }
      return [ value ]
    })
  }

  erode = () => {
    this.apply((value, _neighbors, average) => {
      return [
        // value
        // ...replicate([average], 5),
        ...replicate([value], 150),
        ...replicate([value-1], 1),
        // ...replicate([value-2], 2),
        // ...replicate([value-3], 1),
      ]
    })
  }
}

class WorldMap extends Model {
  notes = {
    aeon: () => {
      let eon = 'Hadean';
      if (this.ticks >= this.mapgenTicks / 2) { eon = 'Archean' }
      if (this.ticks >= this.mapgenTicks) { eon = 'Proterozoic' }
      return eon;
    }
  }

  width = 120
  height = 35

  private mapgenTicks = 450
  private elevation: Heightmap = new Heightmap(this.width, this.height)
  private terrain: Board = new Board(this.width, this.height)
  private vegetation: Board = new Board(this.width, this.height)

  private mountainSpots: [number, number][] = []
  private areaPercent = Math.floor(this.area / 100);

  get tiles() { return this.elevation.map.view({ overlays: [
    // this.vegetation,
    this.terrain,
  ] }) }

  tileColors = {
    // terrain
    // land
    '.':  'lightgreen',

    // sea
    '~': 'midnightblue',
    ',': 'navy',

    // vegetation...
    '\'': 'darkgreen',

    // elevation map
    '0': 'black',
    '1': 'black',
    '2': 'navy',
    '3': 'midnightblue',
    '4': 'deepskyblue',
    '5': 'moccasin',
    '6': 'forestgreen',
    '7': 'darkgreen',
    '8': 'darkslategray',
    '9': 'gray',
  }

  constructor() {
    super("Overworld")
    this.elevation.map.drawBox('0', 0, 0, this.width, this.height, true)
    this.evolve(this.evolution)
    times(25, () => this.step())
  }

  @boundMethod
  randomPosition(): [number, number] {
    let x = randomInteger(0, this.width)
    let y = randomInteger(0, this.height)
    return [x, y]
  }

  genHeightmap(t: number) {
    this.elevation.erode()
    this.elevation.flow()

    if (this.mountainSpots.length === 0) {
      let targetSpotCount = Math.floor(1.245 * this.areaPercent)
      let spots = construct(() => this.randomPosition(), targetSpotCount, false)
      this.mountainSpots = spots
    }
    if (t % 10 === 0) {
      times(t < (this.mapgenTicks / 2) ? (this.mountainSpots.length/2) : 3, () => {
        let val = sample([3, 4, 5, 6, 7, 8, 8, 9, 9, 9])
        let pos = sample(this.mountainSpots)
        let h = parseInt(this.elevation.map.at(...pos) || '0')
        if (pos && h < val) { this.elevation.map.write(String(val), ...pos) }
      })
    }
    if (t % this.mapgenTicks === 0) {
      this.elevation.smooth(true)
      this.buildTerrain()
    }
  }

  buildTerrain() {
    this.terrain.each((x,y,value) => {
      let height = parseInt(this.elevation.map.at(x,y) || '0')
      if (height >= 9) {
        this.terrain.write("^", x, y)
      } else if (height <= 4) {
        this.terrain.write(sample(["~", ',']), x, y)
      } else {
        this.terrain.write('.',x,y)
      }
    })
  }

  growVegetation() {

    this.vegetation.step((val, _neighbors) => {
      if (val === "'") {
        if (_neighbors.length >= 2) { //} || _neighbors.length <= 6) {
          return "'"
        }
      } else {
        if (_neighbors.length === 3) {
          return "'"
        }
      }
      return ''
    })
    this.vegetation.each((x,y,value) => {
      let h = parseInt(this.elevation.map.at(x,y) || '0')
      // autogenesis
      if (h <= 4 || h >= 8) { this.vegetation.erase(x, y) }
      else if (value === '' && randomInteger(0,100) > 98) {
        if (h >= 4 && h < 8) {
          this.vegetation.write("'", x, y)
        }
      }


    })

  }

  get area() { return this.width * this.height }
  @boundMethod
  evolution({ resources }: EvolvingStocks, t: number) {
    if (t > 0) {
      if (t % 100 === 0) { console.log("The world is " + (t / 100) + " million years old") }
      if (t <= this.mapgenTicks) {
        this.genHeightmap(t)
      } else {
        // post mapgen..
        // this.growVegetation()
      }
    }
  }
}
const worldMapMaker = new WorldMap()
export default worldMapMaker;

