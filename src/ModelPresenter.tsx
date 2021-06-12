import Model from './ecosphere/Model';
import { ModelView } from './ecosphere/ModelView';

type ModelPresenterProps = {
  model: Model
  step: Function 
  lastInventoryChanges: { [elementName: string]: number }
}

export function ModelPresenter({ model, step, lastInventoryChanges }: ModelPresenterProps) {
  const { manager, individuals } = model;
  const { inventoryMap: items } = manager;
  return (
    <div className="Model">
      <ModelView
        modelName={model.name}
        items={items}
        individuals={individuals}
        lastInventoryChanges={lastInventoryChanges}
      />
      <button onClick={() => step(true)}>
        Step
      </button>
    </div>
  );
}
