import { boundMethod } from "autobind-decorator";
import { Board } from "../ecosphere/Board";
import { Model } from "../ecosphere/Model";
import { EvolvingStocks } from "../ecosphere/types";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { construct } from "../ecosphere/utils/replicate";
import { sample } from "../ecosphere/utils/sample";
import { Heightmap } from "../ecosphere/Heightmap";
// import { MarkovGenerator } from "../ecosphere/utils/MarkovGenerator";

// eslint-disable-next-line import/no-webpack-loader-syntax
import cityNames from '!!raw-loader!./data/city-names.txt';
import { MarkovSequence } from "../collections/Sequence";
class Cartographer {
  private namegiver = new MarkovSequence(cityNames.split("\n"))
  constructor(private world: WorldMap) {}

  // cache heightmap regions..
  regions: { [rawRegionName: string]: [number, number][] } = {}
  private regionalNames: { [rawRegionName: string]: string } = {}

  identifyRegion(x: number, y: number): string {
    if (this.world.aeon === 'Hadean' || this.world.aeon === 'Archean') {
      return '(Region identification requires calmer aeon...)'
    }

    if (Object.keys(this.regions).length === 0) {
      this.regions = this.world.elevation.regions()
    }

    const regionName = Object.keys(this.regions).find(regionName =>
      this.regions[regionName].find(([x0,y0]) => x===x0 && y===y0)
    ) || null

    if (regionName) {
      if (this.regionalNames[regionName] === undefined) {
        this.regionalNames[regionName] = this.namegiver.next
      }
      return this.regionalNames[regionName]
    }

    return 'Unknown Region'
  }
}

type Aeon = 'Hadean' | 'Archean' | 'Proterozoic'
class WorldMap extends Model {
  notes = { aeon: () => this.aeon }

  get aeon(): Aeon {
    let eon: Aeon = 'Hadean';
    if (this.ticks >= this.mapgenTicks / 2) { eon = 'Archean' }
    if (this.ticks > this.mapgenTicks) { eon = 'Proterozoic' }
    return eon;
  }
  // aeons = ['Hadean', 'Archean', 'Proterozoic', 'Pharezoic']

  // todo highlight/indicate..
  // pushpins = { mountains: { 'Everwhite (Peak of Tears)': [10, 10] } }

  width = 100 //20
  height = 50 //35

  private mapgenTicks = 100
  elevation: Heightmap = new Heightmap(this.width, this.height)
  private terrain: Board = new Board(this.width, this.height)
  // private vegetation: Board = new Board(this.width, this.height)

  private mountainSpots: [number, number][] = []
  private areaPercent = Math.floor(this.area / 100);

  get tiles() { return this.elevation.map.view({ overlays: [
    // this.vegetation,
    // this.terrain,
    // this.elevation.binaryImage(),
    // this.elevation.transform(),
  ] }) }

  @boundMethod
  tileInspect(x: number, y: number) {
    const elevation = this.elevation.at(x,y) || 0
    const li = Math.round(3600 * ( elevation - 4 ) / 5280)
    const elevationMessage = li === 0 ? 'At sea level' : `${Math.abs(li)} li ${li >= 0 ? 'above' : 'below'} sea level`
    const regionName = this.cartographer.identifyRegion(x,y) //'Unknown Region';
    return `${regionName} (${elevationMessage})`
  }

  protected cartographer = new Cartographer(this)

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
    // '1': 'white',

    // heightmap
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
    this.evolve(this.evolution)
    this.actions.create({ name: 'Geoform', act: () => {
      this.ticks = 0
      this.cartographer.regions = {}
    }});
    // this.reboot()
  }

  @boundMethod
  randomPosition(): [number, number] {
    let x = randomInteger(0, this.width)
    let y = randomInteger(0, this.height)
    return [x, y]
  }

  @boundMethod
  randomPositionAlongLine(a: [number,number], b: [number,number], jitter: number = 3): [number, number] {
    let [ax,ay] = a;
    let [bx,by] = b;
    let [dx,dy] = [ Math.abs(ax-bx), Math.abs(ay-by) ]
    if (dx === 0) {
      // it's vertical so... any points on this column
      let y = randomInteger(0, this.height)
      let x = ax
      return [x, y]
    } else if (dy === 0) {
      let x = randomInteger(0, this.width)
      let y = ay
      return [x, y]
    } else {
      let slope = dy / dx; // rise over run
      // so eg ay = slope * ax + b
      //       -b = (slope * ax) - ay
      //       b = -((slope * ax) - ay)
      let y0 = (-((slope * ax) - ay))
      let x = Math.floor(randomInteger(0, this.width))
      let y = Math.floor((slope * x) + y0)
      let j = jitter || 1;
      return [x + randomInteger(-j,j),y + randomInteger(-j,j)]
    }
  }

  genHeightmap(t: number) {
    if (this.mountainSpots.length === 0) {
      let targetSpotCount = Math.floor(10 * this.areaPercent)
      let [a,b] = [ this.randomPosition(), this.randomPosition() ]
      let spots = construct(() => this.randomPositionAlongLine(a,b), targetSpotCount, false)
      this.mountainSpots = spots
    }

    this.elevation.geoform(this.aeon === 'Hadean', this.mountainSpots)

    if (t > 0 && t % this.mapgenTicks === 0) {
      console.log("[worldgen] hadean + archean aeons complete")
    }
  }

  buildTerrain() {
    this.terrain.each((x,y,_value) => {
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

