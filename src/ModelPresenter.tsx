import Model from './ecosphere/Model';
import { ModelView } from './ecosphere/ModelView';

type ModelPresenterProps = {
  model: Model
  step: Function 
  lastInventoryChanges: { [elementName: string]: number }
}

export function ModelPresenter({ model, step, lastInventoryChanges }: ModelPresenterProps) {
  const { items, people, tools } = model;
  return (
    <div className="Model">
      <ModelView
        modelName={model.name}
        items={items.table()}
        individuals={people.list()}
        machines={tools.list()}
        lastInventoryChanges={lastInventoryChanges}
      />
      <button onClick={() => step(true)}>
        Step
      </button>
    </div>
  );
}
