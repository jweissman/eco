import './App.css';
import { IModel } from "./ecosphere/Model/IModel";
import { ModelPresenter } from './ModelPresenter';
import { useModel } from './useModel';

type ApplicationProps = {
  model: IModel
}

function App({ model }: ApplicationProps) {
  const { step, lastChanges } = useModel(model)
  return <div className="App">
    <ModelPresenter
      step={step}
      model={model}
      lastChanges={lastChanges}
    />
  </div>;
}

export default App;
