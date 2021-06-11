// import { count } from 'console';
import { useEffect, useState } from 'react';
import './App.css';
import Model from './ecosphere/Model';
import { ModelView } from './ecosphere/ModelView';
type ApplicationProps = { model: Model }

function ModelPresenter({ model, step }: { model: Model, step: Function }) {
  const { inventoryMap: items, individuals } = model;
  return (
    <div className="Model">
      <ModelView
        modelName={model.name}
        items={items}
        individuals={individuals}
      />
      <button onClick={()=> step(true)}>
        Step
      </button>
    </div>
  )
}

function App({ model }: ApplicationProps) {
  const [ viewModel, setViewModel ] = useState(model)
  const [ shouldStep, step ] = useState(false)
  useEffect(() => {
    if (shouldStep) {
      viewModel.step();
      setViewModel(viewModel);
      step(false);
    }
  }, [shouldStep, viewModel]);
  return (
    <div className="App">
      <ModelPresenter step={step} model={viewModel} />
    </div>
  );
}

export default App;
