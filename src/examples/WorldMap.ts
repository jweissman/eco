import { boundMethod } from "autobind-decorator";
import { Board } from "../ecosphere/Board";
import { Model } from "../ecosphere/Model";
import { EvolvingStocks } from "../ecosphere/types";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { construct } from "../ecosphere/utils/replicate";
import { sample } from "../ecosphere/utils/sample";
import { Heightmap } from "../ecosphere/Heightmap";
import { Cartographer } from "../ecosphere/Cartographer";

type Aeon = 'Hadean' | 'Archean' | 'Proterozoic'


class WorldMap extends Model {
  notes = { aeon: () => this.aeon }

  get aeon(): Aeon {
    let eon: Aeon = 'Hadean';
    if (this.ticks >= this.mapgenTicks / 2) { eon = 'Archean' }
    if (this.ticks > this.mapgenTicks) { eon = 'Proterozoic' }
    return eon;
  }

  // size = 64
  // size = 96
  // size = 128
  // size = 192
  size = 256
  // size = 512
  width = this.size
  height = this.size

  private mapgenTicks = 128 //3 * this.size / 2
  elevation: Heightmap = new Heightmap(this.width, this.height)
  private terrain: Board = new Board(this.width, this.height)
  private vegetation: Board = new Board(this.width, this.height)
  private mountainSpots: [number, number][] = []
  private areaPercent = Math.floor(this.area / 100);

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

  get tiles() { return this.elevation.view({ overlays: [
    // this.vegetation,
    // this.terrain,
    // this.elevation.binaryImage(),
    // this.elevation.transform(),
  ] }) }

  // ie "are the tiles currently changing"
  get tilesEvolving() { return this.aeon === 'Hadean' || this.aeon === 'Archean' }

  get pointsOfInterest(): { [name: string]: [number, number] } {
    if (this.aeon === 'Hadean' || this.aeon === 'Archean') {
      return { '*Please wait...': [50,50]}
    }
    let { regions: getRegions } = this.elevation
    const regions = getRegions()
    let pois: { [name: string]: [number, number] } = Object.fromEntries(
      Object.entries(regions).map(([_rawRegionName, positions]: [string, [number, number][]]) => {
        const regionName = this.cartographer.identifyRegion(...positions[0])
        let xsum = 0, ysum = 0;
        positions.forEach(([x, y]) => { xsum += x; ysum += y });
        let len = positions.length
        let x = xsum/len, y=ysum/len
        let theName: string = (len > 80 ? '*' : '') + regionName
        return [theName, [
          (x / this.size) * 100,
          (y / this.size) * 100,
        ]]
      })
    )
    return pois
  }

  @boundMethod
  tileInspect(x: number, y: number) {
    const elevation = this.elevation.at(x,y) || 0
    const li = Math.round(3600 * ( elevation - 4 ) / 5280)
    const elevationMessage = li === 0 ? 'At sea level' : `${Math.abs(li)} li ${li >= 0 ? 'above' : 'below'} sea level`
    if (this.aeon === 'Hadean' || this.aeon === 'Archean') {
      return elevationMessage
    }

    const region = this.cartographer.identifyRegionOrWaterway(x,y)
    const features = this.cartographer.identifyFeatures(this.aeon, x,y)
    return [
      features, region,
      // elevationMessage
    ]
      .filter(Boolean)
      .join("\n")
    
    //`${features} / ${region} / ${elevationMessage}`
  }

  protected cartographer = new Cartographer(this.elevation)

  tileColors = {
    // terrain
    // land
    // '.':  'lightgreen',

    // sea
    '~': 'midnightblue',
    ',': 'navy',

    // vegetation...
    '\'': 'darkgreen', // tree
    '"': 'green', // grove
    '.': 'lightgreen', // grass
    // '^': 'mediumaquamarine', // grass / old forest

    // elevation map
    // '0': 'black',
    // '1': 'white',

    // heightmap
    // '1': 'black',
    // '0': 'navy',
    // '1': 'navy',
    // '2': 'midnightblue',
    // '3': 'midnightblue',
    // '4': 'blue',
    // '5': 'moccasin',
    // '6': 'forestgreen',
    // '7': 'darkgreen',
    // '8': 'darkgreen',
    // '9': 'darkgreen',
    '0': 'navy',
    // '2': 'forestgreen',
    '1': 'royalblue',
    // '2': 'cornsilk',
    '2': 'gold',
    '3': 'silver',
    '4': 'silver',
    '5': 'darkgray',
    '6': 'gray',
    // '3': 'limegreen',
    // '4': 'forestgreen',
    // '5': 'green', //mediumblue',
    // '6': 'darkgreen',
    '7': 'darkslategray',
    '8': 'slategray', //tan',
    '9': 'white' //lightslategray', //darkslategray',
  }

  // todo profiles? islands/continents/ocean/grasslands/mountains...
  // (ie configuration sets for the heightmap options...)

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

  get volcanoes() {
    if (this.mountainSpots.length === 0) {
      let targetSpotCount = Math.floor(1.6 * this.areaPercent)
      let [a,b] = [ this.randomPosition(), this.randomPosition() ]
      let chainSpots = construct(() => this.randomPositionAlongLine(a,b), targetSpotCount, false)
      let isleSpots = construct(() => this.randomPosition(), targetSpotCount, false)

      this.mountainSpots = [
        ...chainSpots,
        ...isleSpots
      ]
    }
    return this.mountainSpots
  }

  genHeightmap() {
    const hades = this.aeon === 'Hadean'
    this.elevation.geoform(hades, this.ticks < 3 ? this.volcanoes : [])
  }

  buildTerrain() {
    this.terrain.each((x,y,_value) => {
      let height = this.elevation.at(x,y) //parseInt(this.elevation.at(x,y) || '0')
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
    let tree = "'"
    let grove = "\""
    let grass = "."
    let plants = [tree,grove,grass]
    let sea = this.elevation.seaLevel
    let treeline = this.elevation.maxHeight / 2

    this.vegetation.step((val, neighbors, position) => {
      let alive = (plants.includes(val))
      let h = this.elevation.at(...position)
      if (h > treeline || h < sea) { return ''}
      let ns = neighbors.filter(n => plants.includes(n)).length
      if (alive) {
        if (ns > 0 && (val === grove)) { return val }
        if (ns > 1 && (val === tree)) { return val }
        if (ns === 2 || ns === 3) return grass
        else if (ns === 6) return tree
        else if (ns === 7) return grove
      } else {
        if (ns === 2) return grass
        if (randomInteger(0,1000) < 32) return grass
      }
      return ''
    })
  }

  get area() { return this.width * this.height }

  @boundMethod
  evolution({ resources }: EvolvingStocks, t: number) {
    if (t > 0) {
      if (t % 100 === 0) { console.log("The world is " + (t / 100) + " million years old") }
      if (t <= this.mapgenTicks) {
        this.genHeightmap()
        this.growVegetation()
      }
    }

  }
}
const worldMapMaker = new WorldMap()
export default worldMapMaker;

