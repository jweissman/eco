import './App.css';
import Model from './ecosphere/Model';
import { ModelPresenter } from './ModelPresenter';
import { useModel } from './useModel';

type ApplicationProps = {
  model: Model
}

function App({ model }: ApplicationProps) {
  const { step, lastInventoryChanges } = useModel(model)
  return <div className="App">
    <ModelPresenter
      step={step}
      model={model}
      lastInventoryChanges={lastInventoryChanges}
    />
  </div>;
}

export default App;
