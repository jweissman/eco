
import './App.css';
import { IModel } from "./ecosphere/Model/IModel";
import { SpaceStation } from './examples/SpaceStation';
import { world } from './examples/hello';
import { ModelSelector } from './ModelSelector';

type ApplicationProps = {
  model: IModel
}

function App({ model: initialModel }: ApplicationProps) {
  const station = new SpaceStation('My Very Own Space Station')
  return <div className="App">
    <ModelSelector
      models={[ world, station ]}
      initialModel={initialModel}
    />
  </div>;
}

export default App;
