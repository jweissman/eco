
import './App.css';
import { IModel } from "./ecosphere/Model/IModel";
import { Avernus } from './examples/Avernus';
import { SpaceStation } from './examples/SpaceStation';
import town from './examples/Town';
import { world } from './examples/World';
import zep from './examples/zep';
import { ModelSelector } from './ModelSelector';

type ApplicationProps = {
  model: IModel
}

function App({ model: initialModel }: ApplicationProps) {
  const station = new SpaceStation('My Very Own Space Station')
  
  const models = [ world, station, zep, town, Avernus ]
  return <div className="App">
    <ModelSelector models={models} initialModel={initialModel} />
  </div>;
}

export default App;
