
import './App.css';
import { IModel } from "./ecosphere/Model/IModel";
import { ModelSelector } from './ModelSelector';
import models from './examples';

type ApplicationProps = {
  model: IModel
}

function App({ model: initialModel }: ApplicationProps) {

  return <div className="App">
    <ModelSelector models={models} initialModel={initialModel} />
  </div>;
}

export default App;
