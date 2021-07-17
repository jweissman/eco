import { Avernus } from "./Avernus"
import { SpaceStation } from "./SpaceStation"
import town from "./Town"
import { village } from "./Village"
import { world } from "./World"
import zep from "./zep"

const station = new SpaceStation('My Very Own Space Station')
const models = [
  // world,
  station,
  zep,
  // town,
  village,
  Avernus
]

export default models

