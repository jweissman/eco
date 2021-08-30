import { boundMethod } from "autobind-decorator";
import { Board } from "../ecosphere/Board";
import { Model } from "../ecosphere/Model";
import { EvolvingStocks } from "../ecosphere/types";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { construct, replicate } from "../ecosphere/utils/replicate";
import { sample } from "../ecosphere/utils/sample";
import { times } from "../ecosphere/utils/times";

class WorldMap extends Model {
  width = 108
  height = 35

  board: Board = new Board(this.width, this.height)

  heightmap: Board = new Board(this.width, this.height)

  terrain: Board = new Board(this.width, this.height)

  vegetation: Board = new Board(this.width, this.height)
  // animals: Board = new Board(this.width, this.height)
  // machines: Board = new Board(this.width, this.height)
  // habitats: Board = new Board(this.width, this.height)

  // magnetosphere: Board = new Board(this.width, this.height)
  // temperature: Board = new Board(this.width, this.height)
  // pressure: Board = new Board(this.width, this.height)
  // clouds: Board = new Board(this.width, this.height)

  get tiles() { return this.heightmap.view({ overlays: [
    this.terrain,
    // this.vegetation
  ] }) } //{ overlay: [ terrain ]}) }

  tileColors = {
    // sea
    '~': 'midnightblue',
    '.': 'deepskyblue',
    ',': 'navy',

    // grassland
    // '.':  'lightgreen',
    // ',':  'darkseagreen',

    '"':  'darkolivegreen',
    '\'': 'darkgreen',
    ':':  'darkslategray',
    ';':  'forestgreen',

    // mountains
    // '^': 'brown',

    // houses / structures
    // '#': 'darkviolet',
    // '$': 'gold',
    // '?': 'deeppink',
    // '!': 'lightgoldenrodyellow'

    // ice
    '0': 'black',
    '1': 'navy',
    '2': 'midnightblue',
    '3': 'midnightblue',
    // '3': 'light cyan',
    // '4': 'papayawhip',
    // '4': 'moccasin',
    '4': 'deepskyblue',
    '5': 'moccasin',
    // '5': 'forestgreen',
    '6': 'forestgreen',
    '7': 'darkgreen',
    '8': 'darkslategray',
    '9': 'gray',
  }
  // }

  constructor() {
    super("Overworld Map")
    // this.step()
    this.heightmap.drawBox('0', 0, 0, this.width, this.height, true)
    // this.board.drawBox('*', 0, 0, this.width, this.height)
    this.evolve(this.evolution)

     // if (t % 35 === 0) { this.noiseHeightmap() }
    times(5, () => this.noiseHeightmap())

    times(100, () => this.step())
    // fast-forward through mapgen
    // times(this.mapgenTicks, () => this.step())
  }

  alphabet = [
    // '.', ':', '^', '#',
    // "'", "\"", "^", '.', ';', ':'
    // ...replicate([' '], 200),
    // ...replicate(['\''], 150),
    ...replicate(['"'], 50),
    ...replicate(['\''], 20),
    ...replicate(['.'], 10),
    ...replicate([','], 5),
    ...replicate([':'], 3),
    ...replicate([';'], 3),
    // ...replicate(['^'], 300),
    '#', '^',
    // ...replicate([','], 30),
    // ...replicate(['^'], 20),
    // ...replicate([':'], 10),
    // ...replicate([';'], 5),
    // '#', '%', '!', '$', '{' '?', 'o'
    // '0': 'blue',
  ]

  // todo could identify different phases of early world setup
  // phases = 'terrain-gen' // | 'seed-vegetation' etc

  @boundMethod
  randomPosition(): [number, number] {
        let x = randomInteger(0, this.width) //-2)
        let y = randomInteger(0, this.height) //-2)
        return [x, y]
    }

  mapgenTicks = 300

  mountainSpots: [number, number][] = []

  heightmapApply(fn: (val: number, neighbors: number[], average: number) => number[]) {
    this.heightmap.step((val: string, neighbors: string[]) => {
      let value = parseInt(val)
      let neighborValues = neighbors.map(neighbor => parseInt(neighbor))
      let neighborAverage = Math.floor(
        neighborValues.reduce((a,b) => a + b, 0) / (neighbors.length)
      )
      let values = fn(value, neighborValues, neighborAverage) //[ ...replicate([value], 15), neighborAverage ]
      let newVal = Math.min(Math.max(
        sample(values),
      0),9)
      return String(newVal)
    })
  }

  smoothHeightmap = (hard: boolean = false) => {
    this.heightmapApply((value, _neighbors, average) => {
      // if (average > 4 && value < 4) { return [4] }
      // if (value < 4) {}
      return hard ? [...replicate([value], 4), average] : [ ...replicate([value], 10), average ]
    })
  }

  noiseHeightmap = () => {
    this.heightmapApply((value, _neighbors, average) => {
      return [
        ...replicate([value], 50),
        value + 1, value - 1,
        // value + 1, value - 1, average, average + 1, average - 1
      ]
    })
  }

  flowHeightmap = () => {
    this.heightmapApply((value, _neighbors, average) => {
      // if (value > average) { return [average, value] }
      if (value < average) {
        return [
          ...replicate([value], 20),  // integrity..
          ...replicate([average-1], 10),
          ...replicate([average], 3),
          ...replicate([average+1], 2),
          // ...replicate([average+2], 1),
          // ...replicate([average+3], 1),
          average + 2,
          average + 3,
          // average + 4,
          // average + 5,
          // average + 7,
        ]
      }
      return [
        ...replicate([value], 50),
        value - 1, // erosion
      ]
    })
  }

  areaPercent = Math.floor(this.area / 100);
  genHeightmap(t: number) {
    this.flowHeightmap()
    // this.noiseHeightmap()
    // this.smoothHeightmap()
    if (t > 0 && t % 100 === 0) { console.log("The world is " + (t / 100) + " million years old") }
    // if (t > 0 && t % 5 === 0) { this.noiseHeightmap()}
    // if (t > 0 && t % 15 === 0) { this.smoothHeightmap()}
    
    if (t > 0 && this.mountainSpots.length === 0) {
      this.mountainSpots = construct(() =>
        this.randomPosition(), Math.floor(5 * this.areaPercent), false)
      console.log(this.mountainSpots)
    }
    if (t < Math.floor(9 * this.mapgenTicks / 10)) {
      // if (t % 5 === 0) { this.flowHeightmap() }
      if (t % 10 === 0) {
        times(t < (this.mapgenTicks / 2) ? 50 : 15, () => {
          let val = sample([5, 6, 7, 8, 9])
          let pos = sample(this.mountainSpots)
          if (pos && (parseInt(this.heightmap.at(...pos) || '0') < val)) {
            // if (pos)
            this.heightmap.write(String(val), ...pos)
          }
        })
      }
    } else {
      if (t % this.mapgenTicks === 0) {
        this.smoothHeightmap(true)
        this.buildTerrain()
      }
      // if (t % 10 === 0) { this.flowHeightmap() }
    }
  }

  buildTerrain() {
    this.terrain.each((x,y,value) => {
      let height = parseInt(this.heightmap.at(x,y) || '0')
      if (height >= 9) {
        this.terrain.write("^", x, y)
      } else if (height <= 4) {
        this.terrain.write(sample(["~", '.', ',']), x, y)
      }
    })
  }

  growVegetation() {
    this.vegetation.each((x,y,value) => {
      if (randomInteger(0,12) > 11) {
        if (parseInt(this.heightmap.at(x,y) || '0') >= 4) {
          this.vegetation.write(sample(['"', "'"]), x, y)
        }
      }
    })
    // this.vegetation.step((val, _neighbors) => {
    //   // val
    //   return val
    // })
  }

  get area() { return this.width * this.height }
  @boundMethod
  evolution({ resources }: EvolvingStocks, t: number) {
    // const mountainPercent = 5
    if (t <= this.mapgenTicks) {
      this.genHeightmap(t)
    } else {
      this.growVegetation()

    }
  }
}
const worldMapMaker = new WorldMap()
export default worldMapMaker;

