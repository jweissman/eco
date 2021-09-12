import { Concept, Dictionary } from "../ecosphere/Dictionary"
import { Model } from "../ecosphere/Model"
import { Aelvic } from "./Languages/Sindarin"
class Language extends Model {
  constructor(private dictionary: Dictionary) { super(`${dictionary.languageName} (Language)`) }

  t = (...concepts: Concept[]) => this.dictionary.translate(...concepts)
  notes = {
    'Land of Pines': () => this.t('land', 'pine'),
    'Lonely Isle': () => this.t('isle', 'lonely'),
    'Mound of Ever-Summer': () => this.t('mound', 'ever-', 'summer'),
    'Iron Prison': () => this.t('iron', 'prison'),
    'Swan Haven': () => this.t('swans', 'haven'),
    'Icy Fangs': () => this.t('ice', 'fangs'),
    'White-horn Mountains': () => this.t('mountain', 'white', 'horns'),
    'Silver River': () => this.t('silver', 'river'),
    'Ever-White': () => this.t('ever-', 'snow'),
    'Tall White Point': () => this.t('tall', 'white', 'point'),
    '"Nightingale" (lit. Spark-Woman)': () => this.t('spark', '-woman'),
    'Mist-Needle': () => this.t('mist', 'needle'),
    'Mist-Shadow': () => this.t('mist', 'shadow'),
    'Star-Eagle': () => this.t('eagles', 'stars'),
    '--': () => '...',

    /// other examples (not necessarily from beleriand)
    'Hills of Evendim': () => this.t('hill', 'evening'),
    'Mere of Shadows': () => this.t('sea', 'shadow'),
    'Vale of Nightingales': () => this.t('nightingales', 'valley'),
    'Star Hill': () => this.t('hill', 'stars'),
    'Golden Hill': () => this.t('hill', 'golden'),
    'Pathless Sea': () => this.t('path', '-less', 'sea'),
    'Elephant Hill': () => this.t('hill', 'elephants'),
    'Silent Land': () => this.t('land', 'silence'),
    'Star-Song': () => this.t('stars', 'music'),
    'Star Bay': () => this.t('bay', 'stars'),
    // ...Object.fromEntries(descriptiveIdeas.map(idea => {
    //   let [name, significance] = this.dictionary.nameMountain(idea);
    //   return [name, () => significance] // `Mount ${capitalize(idea)}`, () => this.dictionary.nameMountain(idea)[1]])
    // }))
  }
}

export default new Language(Aelvic);

