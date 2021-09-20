import { Concept, Dictionary, theConcepts } from "../ecosphere/Dictionary"
import { Model } from "../ecosphere/Model"
import Khuzdul from "../ecosphere/Languages/Khuzdul"
import { Sindarin } from "../ecosphere/Languages/Sindarin"
import Westron from "../ecosphere/Languages/Westron"
import Common from "../ecosphere/Languages/Common"
// import { Celestial } from "./Languages/Celestial"
class Language extends Model {
  constructor(private dictionary: Dictionary) {
    super(`Language Explorer`)
    this.actions.create({ name: 'Common', act: () => this.dictionary = Common })
    this.actions.create({ name: 'Westron', act: () => this.dictionary = Westron })
    this.actions.create({ name: 'Sindarin', act: () => this.dictionary = Sindarin })
    this.actions.create({ name: 'Khuzdul', act: () => this.dictionary = Khuzdul })
    // todo :)
    // this.actions.create({ name: 'Primordial', act: () => this.dictionary = Celestial })
    // this.policies.create({ name: 'Show Full Dictionary', manage: () => { } })
    // this.
  }

  t = (...concepts: Concept[]) => this.dictionary.translate(...concepts)

  check = (translation: string, ...concepts: Concept[]) => {
    let tx = this.t(...concepts)
    if (tx === translation) { return `*${tx}`}
    return tx; //`%${tx}`;
  }

  notes = {
    '*lang': () => this.dictionary.languageName,
    // validate that we haven't broken sindarin
    '"Nightingale"': () => this.check("Tinuviel", 'spark', '-maid'),
    'Dream Island': () => this.check("Lórien", 'dream', 'island'),
    'Lonely Isle': () => this.check("Tol Eressëa", 'isle', 'lonely'),
    'Haven of the Gods': () => this.check("Avallónë", 'at-', 'divine'),
    'Swan Haven': () => this.check("Alqualondë", 'swans', 'haven'),
    'Star-Eagle': () => this.check("Thorongil", 'eagles', 'stars'),
    'Land of Pines': () => this.check("Dorthonion", 'land', 'pine'),
    // 'Mound of Summer': () => this.check("Corollaerë", 'mound', 'summer'),
    'Mound of Summer': () => this.check("Corollairë", 'mound', 'summer'),
    'Silver River': () => this.check("Celebrant", 'silver', 'river'),
    'Tall White Point': () => this.check("Taniquetil", 'tall', 'white', 'point'),
    'Spirit of Fire': () => this.check("Fëanor", 'spirit', 'fire'),
    'Magic Woman': () => this.check("Lûthien", 'magic', '-woman'),
    'Mountains of Tyranny': () => this.check("Thangorodrim", 'tyranny', 'mountain-chain'),
    'Fire Stronghold': () => this.check("Norgothrond", 'fire', 'stronghold'),
    'Grey-Mantle': () => this.check("Thingol", 'gray', 'mantle'),
    'Iron Prison': () => this.check("Angband", 'iron', 'prison'),
    'Black Foe': () => this.check("Morgoth", 'black', 'foe'),
    'Icy Fangs': () => this.check("Helcaraxë", 'ice', 'fangs'),
    'Ever-White': () => this.check("Oiolossë", 'ever-', 'snow'),
    'Mist-Needle': () => this.check("Hithaeglin", 'mist', 'needle'),
    'Mist-Shadow': () => this.check("Hithlum", 'mist', 'shadow'),
    'Pale-horn Mountains': () => this.check("Ered Nimrais", 'mountain', 'pale', 'horns'),
    'Shipmaker': () => this.check("Círdan", 'ship', 'smith'),
    'Land of Holly': () => this.check("Eregion", 'holly', 'land'),
    'Fate Hill': () => this.check("Amon Amarth", 'hill', 'fate'),
    // todo -- build out sindarin a bit...
    // 'Heavenly Arch': () => this.check("Egalmoth", 'firmament', 'arch'),
    // 'Golden Flower': () => this.check("Glorfindel", 'golden', 'flower'),
    // 'Land of the Fence': () => this.check("Doriath", 'land', 'fence'),
    // 'Forsaken Land': () => this.check("Eglador", 'forsaken', 'land'),
    // 'Hidden Rock': () => this.check("Gondolin", 'hidden', 'rock'),
    '--': () => '...',

    /// other examples (not necessarily from beleriand)
    // 'Hills of Evendim': () => this.t('hill', 'evening'),
    // 'Mere of Shadows': () => this.t('pool', 'shadow'),
    // 'Vale of Nightingales': () => this.t('valley', 'nightingales'),
    // 'Dewy Region': () => this.t('dew', 'region'),
    // 'Star Hill': () => this.t('hill', 'stars'),
    'Golden Hill': () => this.t('hill', 'golden'),
    'Pathless Sea': () => this.t('-less', 'path', 'sea'),
    'Star-Music': () => this.t('stars', 'music'),
    // 'Gold Mountain': () => this.t('mountain', 'gold'),
    // 'Elephant Hill': () => this.t('hill', 'elephants'),
    // 'Silent Land': () => this.t('land', 'silence'),
    // 'Star Bay': () => this.t('bay', 'stars'),
    'Bell-Star': () => this.t('bell', 'stars'),
    // 'Saturday': () => this.t('day', 'stars'),
    // various vocab...
    // 'Dragon': () => this.t('dragons'),
    // 'Giant': () => this.t('giant'),
    ...Object.fromEntries(theConcepts.sort().map(idea => {
      // let [name, significance] = this.t(idea);
      return [idea, () => {
        let tx = this.t(idea)
        if (tx.length > 9) { return `%${tx}` }
        return tx
      }] // `Mount ${capitalize(idea)}`, () => this.dictionary.nameMountain(idea)[1]])
    }))
  }
}

export default new Language(Khuzdul);

