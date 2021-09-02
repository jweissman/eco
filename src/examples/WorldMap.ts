import { boundMethod } from "autobind-decorator";
import { Board } from "../ecosphere/Board";
import { Model } from "../ecosphere/Model";
import { EvolvingStocks } from "../ecosphere/types";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { construct, replicate } from "../ecosphere/utils/replicate";
import { sample } from "../ecosphere/utils/sample";
import { times } from "../ecosphere/utils/times";

// todo abstract aeon/era flow?
// class Aeon { }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min),max)

class Heightmap {
  map: Board = new Board(this.width, this.height)

  constructor(public width: number, public height: number) {}

  apply(fn: (val: number, neighbors: number[], average: number) => number[], rate: number = 1000) {
    this.map.step((val: string, neighbors: string[]) => {
      if (randomInteger(0,1000) < rate) { //return val; }
        let value = parseInt(val)
        let neighborValues = neighbors.map(neighbor => parseInt(neighbor))
        let neighborAverage = Math.floor(
          neighborValues.reduce((a,b) => a + b, 0) / (neighbors.length)
        )
        let values = fn(value, neighborValues, neighborAverage)
        let newVal = clamp(sample(values), 0,9)
        return String(newVal)
      } else { return val }
    })
  }

  smooth = () => {
    this.apply((value, ns, average) => {
      if (value === 9 || value === 5) { return [value] }

      // assuming return [value, average] ...
      // if (value < average) { return [value] } // desert
      // if (average <= 6 && value >= 5) { return [average-1] } // riverlands
      // if (average <= 6 && value >= 5) { return [average+1] } // highlands
      // if (average <= 6 && value >= 5) { return [value-2] } // shallow lakes
      // if (average <= 7 && value >= 5) { return [value+2] } // crater lakes / volanic ash

      if (value < average) { return [value+1] }
      if (value > average) { return [value-1] }
      return [value]
      // if (value === 5) return [value]
      // if (value === 9 && Math.max(..._neighbors) < 9) return [value]
      // if (value === 5 && Math.max(...ns) >= 5) { return [value] }
      // if (value > average) { return [value-1] }
      // if (value < average) { return [value+1] }
      // else { return [value] }
    }, 8)
  }

  noise = () => this.apply(value => [ value + 1, value - 1 ], 2)

  denoise = () => this.apply((value, ns, average) => {
    // if (value === 9 || value === 5) return [value]
    // if (value >= 4 && Math.max(...ns) <= 6) { return [average] }
    if (value >= 4 && ns.filter(n => n > 4).length <= 4) { return [value, average] }
    return [value]
  }, 256)

  flow = () => {
    this.apply((value, _neighbors, average) => {
      if (value >= average) { return [ value ]}
      return [
        // value,
        // value,
        // value + 1,
        value + 1,
        // value + 2,
        value + 3,
        // value + 4,
        // value + 5,
        // average,
        average + 2,
        average + 4,
        average + 6,
        // value + 1, //value + 3,
        // value + 3,
        // average, average + 1, // average + 2,
        // average + 1, average + 2,
        // value, value + 1, value + 3
      ] //, value + 2, value + 3] //, value + 5 ]
    })
  }
  
  erode = () => {
    this.apply((value, _neighbors, average) => {
      if (value <= average) { return [ value ]}
      return [ value, value - 1 ]
      // sort of an overall elevation slider..
    })
  }

  extrude = (positions: [number, number][]) => {
    let pos = sample(positions) //this.mountainSpots)
    let val = sample([8,9])
    if (pos) { this.map.write(String(val), ...pos) }
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

  // aeons = ['Hadean', 'Archean', 'Proterozoic', 'Pharezoic']

  // todo highlight/indicate..
  // pushpins = { mountains: { 'Everwhite (Peak of Tears)': [10, 10] } }

  width = 120
  height = 35

  private mapgenTicks = 400
  private elevation: Heightmap = new Heightmap(this.width, this.height)
  private terrain: Board = new Board(this.width, this.height)
  // private vegetation: Board = new Board(this.width, this.height)

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

  // todo profiles? islands/continents/ocean/grasslands/mountains

  constructor() {
    super("Overworld")
    this.elevation.map.drawBox('0', 0, 0, this.width, this.height, true)
    this.evolve(this.evolution)
    // times(50, () => this.step())
  }

  @boundMethod
  randomPosition(): [number, number] {
    let x = randomInteger(0, this.width)
    let y = randomInteger(0, this.height)
    return [x, y]
  }

  genHeightmap(t: number) {
    if (this.mountainSpots.length === 0) {
      let targetSpotCount = Math.floor(25 * this.areaPercent)
      let spots = construct(() => this.randomPosition(), targetSpotCount, false)
      this.mountainSpots = spots
    }

    // this.elevation.map.drawBox('0', 0, 0, this.width, this.height, false)
    // this.elevation.map.drawBox('0', 1, 1, this.width-2, this.height-2, false)
    let hadean = t < this.mapgenTicks / 2;

    // this.elevation.noise()
    if (hadean) { 
      this.elevation.erode()
      this.elevation.flow()
      times(15, () => {
        this.elevation.extrude(this.mountainSpots)
      })
    } else {
      this.elevation.smooth()
      this.elevation.denoise()
    }

    
    // if (t % 10 === 0) {
    // if (hadean) {
    //   times(8, () => {
    //     let pos = sample(this.mountainSpots)
    //     let val = sample([8,9])
    //     if (pos) { this.elevation.map.write(String(val), ...pos) }
    //   })
    // }
    // }

    if (t % this.mapgenTicks === 0) {
      // this.buildTerrain()
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

  // growVegetation() {
  //   this.vegetation.step((val, _neighbors) => {
  //     if (val === "'") {
  //       if (_neighbors.length >= 2) { //} || _neighbors.length <= 6) {
  //         return "'"
  //       }
  //     } else {
  //       if (_neighbors.length === 3) {
  //         return "'"
  //       }
  //     }
  //     return ''
  //   })
  //   this.vegetation.each((x,y,value) => {
  //     let h = parseInt(this.elevation.map.at(x,y) || '0')
  //     // autogenesis
  //     if (h <= 4 || h >= 8) { this.vegetation.erase(x, y) }
  //     else if (value === '' && randomInteger(0,100) > 98) {
  //       if (h >= 4 && h < 8) {
  //         this.vegetation.write("'", x, y)
  //       }
  //     }


  //   })

  // }

  get area() { return this.width * this.height }
  @boundMethod
  evolution({ resources }: EvolvingStocks, t: number) {
    if (t > 0) {
      if (t % 100 === 0) { console.log("The world is " + (t / 100) + " million years old") }
      if (t <= this.mapgenTicks) { this.genHeightmap(t) }
    }
  }
}
const worldMapMaker = new WorldMap()
export default worldMapMaker;

