/*
* okay so goals for the model are like: well-distinguished time units... tasks take time... top-down config
*/

// import { Collection } from "../ecosphere/Collection";
// import { Community } from "../ecosphere/Community";
import { Model } from "../ecosphere/Model";
// import { BasicEntity } from "../ecosphere/types/BasicEntity"

// type Activity = 'hunt' | 'fish'


// export type Activity = BasicEntity & {
//   kind: ActivityKind
//   time?: number
//   produces?: { [resourceName: string]: number }
//   consumes?: { [resourceName: string]: number }
//   requiresMachine?: string
// }
 
// type Activity = 'rest'
//               | 'work'
              // | 'gather'
              // | 'farm'
// class Civilization {
//   public citizens: Community;
//   public activities: { [key in Activity]: Recipe } = {
//     hunt: 
//   }
//   // get activities(): Activity[] { return ['rest', 'work'] }
//   // public activities = new Collection<Activity>();

//   // public calendar = (t: number) => { }
// }

class Society extends Model {
  // civilization: Civilization = new Civilization()
  // notes = { date: () => this.calendar }

  constructor() {
    super('Socius')
  }
}

export default new Society()
