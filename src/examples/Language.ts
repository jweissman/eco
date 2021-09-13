import { Concept, Dictionary } from "../ecosphere/Dictionary"
import { Model } from "../ecosphere/Model"
import { Aelvic } from "./Languages/Sindarin"
class Language extends Model {
  constructor(private dictionary: Dictionary) { super(`${dictionary.languageName} (Language)`) }

  t = (...concepts: Concept[]) => this.dictionary.translate(...concepts)
  notes = {
    'Land of Pines': () => this.t('land', 'pine'),
    'Lonely Isle': () => this.t('isle', 'lonely'),
    // 'Mound of Ever-Summer': () => this.t('mound', 'ever-', 'summer'),
    'Mound of Summer': () => this.t('mound', 'summer'),
    'Iron Prison': () => this.t('iron', 'prison'),
    'Swan Haven': () => this.t('swans', 'haven'),
    'Icy Fangs': () => this.t('ice', 'fangs'),
    'Pale-horn Mountains': () => this.t('mountain', 'pale', 'horns'),
    'Silver River': () => this.t('silver', 'river'),
    'Ever-White': () => this.t('ever-', 'snow'),
    'Tall White Point': () => this.t('tall', 'white', 'point'),
    '"Nightingale" (lit. Spark-Woman)': () => this.t('spark', '-daughter'),
    'Mist-Needle': () => this.t('mist', 'needle'),
    'Mist-Shadow': () => this.t('mist', 'shadow'),
    'Star-Eagle': () => this.t('eagles', 'stars'),
    'Dark Foe': () => this.t('black', 'foe'),
    'Grey-Mantle': () => this.t('gray', 'mantle'),
    'Spirit of Fire': () => this.t('spirit', 'fire'),
    'Magic Woman': () => this.t('magic', '-woman'),
    'Mountains of Tyranny': () => this.t('tyranny', 'mountain-chain'),
    'Fire Stronghold': () => this.t('fire', 'stronghold'),
    'Shipwright': () => this.t('ship', 'smith'),
    '--': () => '...',

    /// other examples (not necessarily from beleriand)
    'Pathless Sea': () => this.t('-less', 'path', 'sea'),
    'Hills of Evendim': () => this.t('hill', 'evening'),
    'Mere of Shadows': () => this.t('pool', 'shadow'),
    'Vale of Nightingales': () => this.t('valley', 'nightingales'),
    'Dewy Region': () => this.t('dew', 'region'),
    'Star Hill': () => this.t('hill', 'stars'),
    'Golden Hill': () => this.t('hill', 'golden'),
    'Gold Mountain': () => this.t('mountain', 'gold'),
    'Elephant Hill': () => this.t('hill', 'elephants'),
    'Silent Land': () => this.t('land', 'silence'),
    'Star Bay': () => this.t('bay', 'stars'),
    'Bell-Star': () => this.t('bell', 'stars'),
    'Music of the Spheres': () => this.t('stars', 'music'),
    'Haven of the Gods': () => this.t('at-', 'divine')
    // ...Object.fromEntries(descriptiveIdeas.map(idea => {
    //   let [name, significance] = this.dictionary.nameMountain(idea);
    //   return [name, () => significance] // `Mount ${capitalize(idea)}`, () => this.dictionary.nameMountain(idea)[1]])
    // }))
  }
}

export default new Language(Aelvic);

