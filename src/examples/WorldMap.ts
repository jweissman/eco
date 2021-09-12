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
// import cityNames from '!!raw-loader!./data/cities.txt';
// eslint-disable-next-line import/no-webpack-loader-syntax
// import seaNames from '!!raw-loader!./data/seas.txt';
// eslint-disable-next-line import/no-webpack-loader-syntax
// import rangeNames from '!!raw-loader!./data/ranges.txt';

import { StringGeneratorSequence } from "../collections/Sequence";
import { Aelvic, Concept, Dictionary, theConcepts } from "./Language";
import { ISequence } from "../collections/types";

// const markov = (lines: string) => new MarkovSequence(lines.split("\n"))

class DictionarySequence
     extends StringGeneratorSequence
  implements ISequence<string> {
    private notions: Concept[]
  constructor(private dictionary: Dictionary, ...notions: Concept[]) {
    super()
    this.notions = notions
  }

  generate(): string {
    console.log(`Generate ${this.notions.join('/')} using ${this.dictionary.languageName} dictionary...`)
    const idea: Concept = sample(theConcepts);
    const namer = this.dictionary.name(sample(this.notions))
    const [significance, name] = namer(idea)
    return `${name} (${significance})`
  }
}
class Linguist {
  static names = {
    regions: new DictionarySequence(Aelvic, 'land', 'place', 'isle', 'haven', 'realm'),
    waterways: new DictionarySequence(Aelvic, 'sea', 'lake'),
    ranges: new DictionarySequence(Aelvic, 'mountain', 'peak', 'hill')
  }
 
  // static describeWaterwaySize(area: number) {
  //   if (area > 200) { return 'Ocean' }
  //   if (area > 100) { return 'Sea' }
  //   if (area > 50) { return 'Lake' }
  //   if (area > 25) { return 'Pool' }
  //   return 'Pond'
  // }

  // static describeRegionSize(area: number) {
  //   if (area > 400) { return 'Supercontinent' }
  //   if (area > 200) { return 'Continent' }
  //   if (area > 100) { return 'Island' }
  //   if (area > 50) { return 'Isle' }
  //   return 'Point'
  // }

  // static describeRangeSize(area: number) {
  //   if (area > 8) { return 'Range' }
  //   if (area > 3) { return 'Mountains' }
  //   return 'Peak'
  // }

  // cache names...
  private waterwayNames: { [rawWaterbodyName: string]: string } = {}
  private regionNames: { [rawRegionName: string]: string } = {}
  private rangeNames: { [rawRangeName: string]: string } = {}

  nameWaterway(rawWaterbodyName: string, area: number) {
    if (this.waterwayNames[rawWaterbodyName] === undefined) {
      this.waterwayNames[rawWaterbodyName] = Linguist.names.waterways.next
    }
    return [
      this.waterwayNames[rawWaterbodyName],
      // Linguist.describeWaterwaySize(area)
    ].join(' ')
  }

  nameRegion(rawRegionName: string, area: number) {
    if (this.regionNames[rawRegionName] === undefined) {
      this.regionNames[rawRegionName] = Linguist.names.regions.next
    }
    return [
      this.regionNames[rawRegionName],
      // Linguist.describeRegionSize(area)
    ].join(' ')
  }

  nameRange(rawRangeName: string, area: number): string | undefined {
    // throw new Error("Method not implemented.");
    if (this.rangeNames[rawRangeName] === undefined) {
      this.rangeNames[rawRangeName] = Linguist.names.ranges.next
    }
    return [
      this.rangeNames[rawRangeName],
      // Linguist.describeRangeSize(area)
    ].join(' ')
  }
  // nameRegion()
}
class Cartographer {
  private linguist = new Linguist()
  // names = {
  //   regions: markov(cityNames), //new MarkovSequence(cityNames.split("\n")),
  //   waterways: markov(seaNames), // new MarkovSequence(seaNames.split("\n")),
  //   ranges: markov(rangeNames), //new MarkovSequence(rangeNames.split("\n")),
  // }
  // private regionNamegiver = new MarkovSequence(cityNames.split("\n"))
  // private waterwayNamegiver = new MarkovSequence(seaNames.split("\n"))

  private _waterways: { [rawWaterbodyName: string]: [number, number][] } = {}
  // private waterwayNames: { [rawWaterbodyName: string]: string } = {}
  private _regions: { [rawRegionName: string]: [number, number][] } = {}
  // private regionNames: { [rawRegionName: string]: string } = {}
  private _ranges: { [rawRangeName: string]: [number, number][] } = {}

  // private waterwayNames: { [rawWaterbodyName: string]: string } = {}
  // private regionNames: { [rawRegionName: string]: string } = {}
  // private rangeNames: { [rawRangeName: string]: string } = {}

  // really just need the heightmap i guess??
  constructor(private world: WorldMap) {}

  reset() {
    this._regions = {}
    this._waterways = {}
    this._ranges = {}
  }

  // cache heightmap regions + names..
  get regions() {
    if (Object.keys(this._regions).length === 0) {
      this._regions = this.world.elevation.regions()
    }
    return this._regions
  }

  identifyRegion(x: number, y: number): string | undefined {
    const rawRegionName = Object.keys(this.regions).find(region =>
      this.regions[region].find(([x0,y0]) => x===x0 && y===y0)
    ) || null

    if (rawRegionName) {
      let area = this.regions[rawRegionName].length
      return this.linguist.nameRegion(rawRegionName, area)
    }
  }

  get waterways() {
    if (Object.keys(this._waterways).length === 0) {
      this._waterways = this.world.elevation.waterways()
    }
    return this._waterways
  }

  identifyWaterway(x: number, y: number): string | undefined {
    const rawWaterbodyName = Object.keys(this.waterways).find(waterway =>
      this.waterways[waterway].find(([x0,y0]) => x===x0 && y===y0)
    ) || null

    if (rawWaterbodyName) {
      let area = this.waterways[rawWaterbodyName].length
      return this.linguist.nameWaterway(rawWaterbodyName, area)
       
      // return Linguist.name
      //if (this.waterwayNames[waterwayName] === undefined) {
      //  this.waterwayNames[waterwayName] = Linguist.names.waterways.next
      //}
      //return this.waterwayNames[waterwayName] + ' Sea' // lake etc...
    }
  }

  identifyRegionOrWaterway(x: number, y: number): string | undefined {
    if (this.world.aeon === 'Hadean' || this.world.aeon === 'Archean') {
      return '(Cartography requires calmer aeon...)'
    }    
    return this.identifyRegion(x,y) || this.identifyWaterway(x,y) || '(error: unknown region or waterway!)'
  }

  get ranges() {
    if (Object.keys(this._ranges).length === 0) {
      this._ranges = this.world.elevation.ranges()
    }
    return this._ranges
  }

  identifyRange(x: number, y: number): string | undefined {
  // identifyWaterway(x: number, y: number): string | undefined {
    const rangeName = Object.keys(this.ranges).find(range =>
      this.ranges[range].find(([x0,y0]) => x===x0 && y===y0)
    ) || null

    if (rangeName) {
      const area = this.ranges[rangeName].length
      return this.linguist.nameRange(rangeName, area)
      // if (this.rangeNames[rangeName] === undefined) {
      //   this.rangeNames[rangeName] = Linguist.names.ranges.next
      // }
      // return this.rangeNames[rangeName] + ' Mountains' // + Range, mountains etc...
    }
  }

  // identifyFeature -- mountain range / valley ...
  identifyFeatures(x: number, y: number): string | undefined {
    if (this.world.aeon === 'Hadean' || this.world.aeon === 'Archean') {
      return '(Cartography requires calmer aeon...)'
    }    
    return this.identifyRange(x,y) || '(no features)'
  }


  // identifyMountain, identifyRiver
  // identify -- include all single point features (mountains, rivers, ...'arrows'?)
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
  height = 60 //35

  private mapgenTicks = 40
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
    if (this.aeon === 'Hadean' || this.aeon === 'Archean') {
      return elevationMessage
    }

    const region = this.cartographer.identifyRegionOrWaterway(x,y)
    const features = this.cartographer.identifyFeatures(x,y)
    return `${features} / ${region} / ${elevationMessage}`
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
      this.cartographer.reset()
      // this.cartographer._regions = {}
      // this.cartographer._waterways = {}
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

    // if (t > 0 && t % this.mapgenTicks === 0) {
    //   console.log("[worldgen] hadean + archean aeons complete")
    // }

    // this.elevation.map.drawBox('0', 0, 0, this.width, this.height)
    // this.elevation.map.drawBox('0', 1, 1, this.width-2, this.height-2)
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

