
import './App.css';
import { IModel } from "./ecosphere/Model/IModel";
import { Avernus } from './examples/Avernus';
import { Factory } from './examples/Factory';
import { SpaceStation } from './examples/SpaceStation';
import town from './examples/Town';
import { world } from './examples/World';
import { ModelSelector } from './ModelSelector';

type ApplicationProps = {
  model: IModel
}

function App({ model: initialModel }: ApplicationProps) {
  const station = new SpaceStation('My Very Own Space Station')
  const factory = new Factory('Zep')
  factory.reboot()
  factory.product('Socks', {})
  factory.product('Shoes', {})
  factory.actions.create({ name: 'Spawn Worker', act: () => { factory.people.create('New Worker') }})
  const models = [ world, station, factory, town, Avernus ]
  return <div className="App">
    <ModelSelector models={models} initialModel={initialModel} />
  </div>;
}

export default App;
