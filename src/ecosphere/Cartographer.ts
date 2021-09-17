import { DictionarySequence } from "../ecosphere/Dictionary";
import { Heightmap } from "./Heightmap";
import { Aelvic } from "./Languages/Sindarin";
import { sample } from "./utils/sample";

// const markov = (lines: string) => new MarkovSequence(lines.split("\n"))
class Linguist {
  static names = {
    places: new DictionarySequence(Aelvic, true, 'land'), //'realm', 'haven', 'place'),
    regions: new DictionarySequence(Aelvic, false, 'isle'),
    waterways: new DictionarySequence(Aelvic, false, 'sea', 'lake', 'water', 'pool'),
    ranges: new DictionarySequence(Aelvic, true, 'mountain-chain'),
    mountains:  new DictionarySequence(Aelvic, false, 'mountain'),
    valleys: new DictionarySequence(Aelvic, false, 'valley'),
    bays: new DictionarySequence(Aelvic, false, 'bay')
  }

  // cache names...
  private waterwayNames: { [rawWaterbodyName: string]: string } = {}
  private regionNames:   { [rawRegionName: string]: string } = {}
  private rangeNames:    { [rawRangeName: string]: string } = {}
  private valleyNames:   { [rawValleyName: string]: string } = {}
  private bayNames:      { [rawBayName: string]: string } = {}

  nameWaterway(rawWaterbodyName: string, _area: number) {
    if (this.waterwayNames[rawWaterbodyName] === undefined) {
      this.waterwayNames[rawWaterbodyName] = Linguist.names.waterways.next
    }
    return this.waterwayNames[rawWaterbodyName]
  }

  nameRegion(rawRegionName: string, _area: number) {
    if (this.regionNames[rawRegionName] === undefined) {
      this.regionNames[rawRegionName] = sample([
        Linguist.names.regions,
        Linguist.names.places
      ]).next
    }
    return this.regionNames[rawRegionName]
  }

  nameRange(rawRangeName: string, _area: number): string | undefined {
    if (this.rangeNames[rawRangeName] === undefined) {
      this.rangeNames[rawRangeName] = sample([
        Linguist.names.ranges,
        Linguist.names.mountains
      ]).next
    }
    return this.rangeNames[rawRangeName]
  }

  nameValley(rawValleyName: string, _area: number): string | undefined {
    if (this.valleyNames[rawValleyName] === undefined) {
      this.valleyNames[rawValleyName] = Linguist.names.valleys.next
    }
    return this.valleyNames[rawValleyName]
  }

  nameBay(rawBayName: string, area: number): string | undefined {
    if (this.bayNames[rawBayName] === undefined) {
      this.bayNames[rawBayName] = Linguist.names.bays.next
    }
    return this.bayNames[rawBayName]
  }
}

export class Cartographer {
  private linguist = new Linguist()
  private _waterways: { [rawWaterbodyName: string]: [number, number][] } = {}
  private _regions: { [rawRegionName: string]: [number, number][] } = {}
  private _ranges: { [rawRangeName: string]: [number, number][] } = {}
  private _valleys: { [rawValleyName: string]: [number, number][] } = {}
  private _bays: { [rawBayName: string]: [number, number][] } = {}

  constructor(private elevation: Heightmap) {}

  reset() {
    this._regions = {}
    this._waterways = {}
    this._ranges = {}
    this._valleys = {}
    this._bays = {}
  }

  // cache heightmap regions + names..
  get regions() {
    if (Object.keys(this._regions).length === 0) {
      this._regions = this.elevation.regions()
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
      this._waterways = this.elevation.waterways()
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
    }
  }

  identifyRegionOrWaterway(x: number, y: number): string | undefined {
    return this.identifyRegion(x,y)
        || this.identifyWaterway(x,y)
        || '(err: unknown region/waterway)'
  }

  get ranges() {
    if (Object.keys(this._ranges).length === 0) {
      this._ranges = this.elevation.ranges()
    }
    return this._ranges
  }

  identifyRange(x: number, y: number): string | undefined {
    const rangeName = Object.keys(this.ranges).find(range =>
      this.ranges[range].find(([x0,y0]) => x===x0 && y===y0)
    ) || null

    if (rangeName) {
      const area = this.ranges[rangeName].length
      return this.linguist.nameRange(rangeName, area)
    }
  }

  get valleys() {
    if (Object.keys(this._valleys).length === 0) {
      this._valleys = this.elevation.valleys()
    }
    return this._valleys
  }

  identifyValley(x: number, y: number): string | undefined {
    const valleyName = Object.keys(this.valleys).find(valley =>
      this.valleys[valley].find(([x0,y0]) => x===x0 && y===y0)
    ) || null

    if (valleyName) {
      const area = this.valleys[valleyName].length
      return this.linguist.nameValley(valleyName, area)
    }
  }

  get bays() {
    if (Object.keys(this._bays).length === 0) {
      this._bays = this.elevation.bays()
      console.log("Found bays", this._bays)
    }
    return this._bays
  }

  identifyBay(x: number, y: number): string | undefined {
    const bayName = Object.keys(this.bays).find(bay =>
      this.bays[bay].find(([x0,y0]: [number, number]) => x===x0 && y===y0)
    ) || null

    if (bayName) {
      const area = this.bays[bayName].length
      return this.linguist.nameBay(bayName, area)
    }
  }

  identifyFeatures(aeon: string, x: number, y: number): string | undefined {
    if (aeon === 'Hadean' || aeon === 'Archean') {
      return '(Cartography requires calmer aeon...)'
    }    
    return this.identifyRange(x,y)
        || this.identifyValley(x,y)
        || this.identifyBay(x,y)
        || ''
  }


  // identifyMountain, identifyRiver
  // identify -- include all single point features (mountains, rivers, ...'arrows'?)
}

