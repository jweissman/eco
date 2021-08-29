import { boundMethod } from "autobind-decorator";
import { Board } from "../ecosphere/Board";
import { Model } from "../ecosphere/Model";
import { EvolvingStocks } from "../ecosphere/types";
import { randomInteger } from "../ecosphere/utils/randomInteger";
import { replicate } from "../ecosphere/utils/replicate";
import { sample } from "../ecosphere/utils/sample";
import { times } from "../ecosphere/utils/times";

class WorldMap extends Model {
  width = 90
  height = 40

  board: Board = new Board(this.width, this.height)

  terrain: Board = new Board(this.width, this.height)
  // vegetation: Board = new Board(this.width, this.height)
  // animals: Board = new Board(this.width, this.height)
  // machines: Board = new Board(this.width, this.height)
  // habitats: Board = new Board(this.width, this.height)

  // magnetosphere: Board = new Board(this.width, this.height)
  // temperature: Board = new Board(this.width, this.height)
  // pressure: Board = new Board(this.width, this.height)
  // clouds: Board = new Board(this.width, this.height)

  get tiles() { return this.board.view() } //{ overlay: [ terrain ]}) }
  tileColors = {
    // grassland
    '"':  'darkolivegreen',
    '\'': 'darkgreen',
    '.':  'lightgreen',
    ',':  'darkseagreen',
    ':':  'darkslategray',
    ';':  'forestgreen',
    // '^',

    // ice
  }
  // }

  constructor() {
    super("Overworld Map")
    // this.step()
    // this.board.drawBox('*', 0, 0, this.width, this.height)
    this.evolve(this.evolution)
    times(100, () => this.step())
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
    '#', '^',
    // ...replicate([','], 30),
    // ...replicate(['^'], 20),
    // ...replicate([':'], 10),
    // ...replicate([';'], 5),
    // '#', '%', '!', '$', '{' '?', 'o'
  ]

  @boundMethod
  evolution({ resources }: EvolvingStocks, t: number) {
    times(2, () => {
      let char = sample(this.alphabet)
      times(2, ()=>{
        let x = randomInteger(0, this.width) //-2)
        let y = randomInteger(0, this.height) //-2)
        this.board.write(char, x, y)
      })
    })
  // }
    if (t % 100 === 0) {
      // console.log("evolve step..")
      // this.board.step((val: string, neighbors: string[]) => {
      //   // const alive = this.alphabet.includes(val)
      //   // if (neighbors.length === 2 || neighbors.length === 3) {
      //   //   return alive ? val : sample(['"', "'"])
      //   // } else { return '' }
      // })
    }
  }
}
const worldMapMaker = new WorldMap()
export default worldMapMaker;

