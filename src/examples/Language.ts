import { Concept, Dictionary } from "../ecosphere/Dictionary"
import { Model } from "../ecosphere/Model"
import Khuzdul from "./Languages/Khuzdul"
import { Aelvic } from "./Languages/Sindarin"
import Westron from "./Languages/Westron"
// import { Celestial } from "./Languages/Celestial"
class Language extends Model {
  constructor(private dictionary: Dictionary) {
    super(`Language Explorer`)
    this.actions.create({ name: 'Westron', act: () => this.dictionary = Westron })
    this.actions.create({ name: 'Sindarin', act: () => this.dictionary = Aelvic })
    this.actions.create({ name: 'Khuzdul', act: () => this.dictionary = Khuzdul })
    // todo :)
    // this.actions.create({ name: 'Primordial', act: () => this.dictionary = Celestial })
  }

  t = (...concepts: Concept[]) => this.dictionary.translate(...concepts)
  notes = {
    '"Nightingale"': () => this.t('spark', '-maid'),
    'Lonely Isle': () => this.t('isle', 'lonely'),
    'Haven of the Gods': () => this.t('at-', 'divine'),
    'Swan Haven': () => this.t('swans', 'haven'),
    'Star-Eagle': () => this.t('eagles', 'stars'),
    'Land of Pines': () => this.t('land', 'pine'),
    'Mound of Summer': () => this.t('mound', 'summer'),
    'Mountains of Tyranny': () => this.t('tyranny', 'mountain-chain'),
    'Magic Woman': () => this.t('magic', '-woman'),
    'Fire Stronghold': () => this.t('fire', 'stronghold'),
    'Grey-Mantle': () => this.t('gray', 'mantle'),
    'Iron Prison': () => this.t('iron', 'prison'),
    'Icy Fangs': () => this.t('ice', 'fangs'),
    // 'Pale-horn Mountains': () => this.t('mountain', 'pale', 'horns'),
    'Silver River': () => this.t('silver', 'river'),
    'Ever-White': () => this.t('ever-', 'snow'),
    'Tall White Point': () => this.t('tall', 'white', 'point'),
    // 'Mist-Needle': () => this.t('mist', 'needle'),
    // 'Mist-Shadow': () => this.t('mist', 'shadow'),
    'Dark Foe': () => this.t('black', 'foe'),
    'Spirit of Fire': () => this.t('spirit', 'fire'),
    // 'Shipmaker': () => this.t('ship', 'smith'),
    // 'Land of Holly': () => this.t('holly', 'land'),
    // '--': () => '...',

    /// other examples (not necessarily from beleriand)
    'Pathless Sea': () => this.t('-less', 'path', 'sea'),
    'Star-Music': () => this.t('stars', 'music'),
    // 'Hills of Evendim': () => this.t('hill', 'evening'),
    // 'Mere of Shadows': () => this.t('pool', 'shadow'),
    // 'Vale of Nightingales': () => this.t('valley', 'nightingales'),
    // 'Dewy Region': () => this.t('dew', 'region'),
    // 'Star Hill': () => this.t('hill', 'stars'),
    'Golden Hill': () => this.t('hill', 'golden'),
    // 'Gold Mountain': () => this.t('mountain', 'gold'),
    // 'Elephant Hill': () => this.t('hill', 'elephants'),
    // 'Silent Land': () => this.t('land', 'silence'),
    // 'Star Bay': () => this.t('bay', 'stars'),
    // 'Bell-Star': () => this.t('bell', 'stars'),
    // 'Saturday': () => this.t('day', 'stars'),
    // various vocab...
    // 'Dragon': () => this.t('dragons'),
    // 'Giant': () => this.t('giant'),
    // ...Object.fromEntries(descriptiveIdeas.map(idea => {
    //   let [name, significance] = this.dictionary.nameMountain(idea);
    //   return [name, () => significance] // `Mount ${capitalize(idea)}`, () => this.dictionary.nameMountain(idea)[1]])
    // }))
  }
}

export default new Language(Khuzdul);

