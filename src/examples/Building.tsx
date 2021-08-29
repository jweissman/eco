import { boundMethod } from "autobind-decorator";
import { Board } from "../ecosphere/Board";
import { Model } from "../ecosphere/Model";
import { randomInteger } from "../ecosphere/utils/randomInteger";

class Building extends Model {
  width = 80
  height = 36
  board: Board = new Board(this.width, this.height)
  get tiles() { return this.board.view() }

  constructor() {
    super("Perfect Blue Buildings")
    this.evolve(this.evolution)
    // this.board.drawBox('*', 0, 0, 5, 5) //this.width-2, this.height-2)

  }

  building() {
    let width = randomInteger(2,8)
    let height = randomInteger(2,3)
    this.board.drawBox('#', randomInteger(1, this.width - width - 1),
                            randomInteger(1, this.height - height - 1),
                            width, height)
  }

  @boundMethod
  evolution() {
    this.building()
    
    // this.board.write(sample(['a','b','c']), randomInteger(), 2)
  }
}
const buildingMaker = new Building()
export default buildingMaker;
