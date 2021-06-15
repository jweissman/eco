import './App.css';
import { IModel } from './ecosphere/Model/Model';
import { ModelPresenter } from './ModelPresenter';
import { useModel } from './useModel';

type ApplicationProps = {
  model: IModel
}

function App({ model }: ApplicationProps) {
  const { step, lastChanges: lastInventoryChanges } = useModel(model)
  return <div className="App">
    <ModelPresenter
      step={step}
      model={model}
      lastInventoryChanges={lastInventoryChanges}
    />
  </div>;
}

export default App;
