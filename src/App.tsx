// import { count } from 'console';
import { useEffect, useState } from 'react';
import './App.css';
import Model from './ecosphere/Model';
import { ModelView } from './ecosphere/ModelView';
type ApplicationProps = { model: Model }
function App({ model }: ApplicationProps) {
  const [ viewModel, setViewModel ] = useState(model)
  const [ shouldStep, step ] = useState(false)
  useEffect(() => {
    if (shouldStep) {
      console.log("VIEW MODEL STEP!!!", viewModel)
      viewModel.step();
      setViewModel(viewModel);
      step(false);
    }
  }, [shouldStep, viewModel]);
  const { inventoryMap: items, individuals } = viewModel;

  return (
    <div className="App">
      <ModelView
        modelName={model.name}
        items={items}
        individuals={individuals}
      />
      <button onClick={()=> step(true)}>Step</button>
    </div>
  );
}

export default App;
