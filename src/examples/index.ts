import { Avernus } from "./Avernus"
import arena from "./Arena"
// import { Society } from "./Society"
import zep from "./zep"
import Citizen from "./Citizen"
import Building from "./Building"
import worldMapMaker from "./WorldMap"
import { Language } from "./Language"

const models = [
  worldMapMaker,
  Building,
  arena,
  zep,
  Avernus,
  Citizen,
  new Language("Aelven"),
  // Society,
]

export default models

