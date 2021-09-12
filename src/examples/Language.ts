import { Concept, Dictionary } from "../ecosphere/Dictionary"
import { Model } from "../ecosphere/Model"
import { Aelvic } from "./Languages/Sindarin"
class Language extends Model {
  constructor(private dictionary: Dictionary) { super(`${dictionary.languageName} (Language)`) }

  t = (...concepts: Concept[]) => this.dictionary.translate(...concepts)
  notes = {
    'Hills of Evendim': () => this.t('hill', 'evening'),
    'Mere of Shadows': () => this.t('sea', 'shadow'),
    'Vale of Nightingales': () => this.t('nightingales', 'valley'),
    'Star Hill': () => this.t('hill', 'stars'),
    'Golden Hill': () => this.t('hill', 'gold'),
    'Pathless Sea': () => this.t('path', '-less', 'sea'),
    'Silver River': () => this.t('silver', 'river'),
    'Iron Prison': () => this.t('iron', 'prison'),
    'Swan Haven': () => this.t('swans', 'haven'),
    'Elephant Hill': () => this.t('hill', 'elephants'),
    'Silent Land': () => this.t('land', 'silence'),
    'White-horn Mountains': () => this.t('mountain', 'white', 'horns'),
    'Icy Fangs': () => this.t('ice', 'fangs'),
    'Star-Eagle': () => this.t('eagles', 'stars'),
    'Mist-Peaks': () => this.t('mist', 'peak'),
    'Starsong': () => this.t('stars', 'music'),
    'Land of Pines': () => this.t('land', 'pine'),
    // ...Object.fromEntries(descriptiveIdeas.map(idea => {
    //   let [name, significance] = this.dictionary.nameMountain(idea);
    //   return [name, () => significance] // `Mount ${capitalize(idea)}`, () => this.dictionary.nameMountain(idea)[1]])
    // }))
  }
}

export default new Language(Aelvic);

