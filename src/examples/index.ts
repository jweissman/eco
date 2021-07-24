import { Avernus } from "./Avernus"
import { Society } from "./Society"
import { SpaceStation } from "./SpaceStation"
// import town from "./Town"
import { village } from "./Village"
// import { world } from "./World"
import zep from "./zep"

const station = new SpaceStation('My Very Own Space Station')
const models = [
  // world,
  station,
  zep,
  // town,
  village,
  new Society(),
  Avernus
]

export default models
