import Model from './ecosphere/Model';
import { ModelView } from './ecosphere/ModelView';

type ModelPresenterProps = {
  model: Model
  step: Function 
  lastInventoryChanges: { [elementName: string]: number }
}

export function ModelPresenter({ model, step, lastInventoryChanges }: ModelPresenterProps) {
  const { resources, people, machines, animals } = model;
  // console.log(animals.report)
  return (
    <div className="Model">
      <ModelView
        modelName={model.name}
        items={resources.report}
        individuals={people.list()}
        machines={machines.list()}
        animals={animals.report}
        lastInventoryChanges={lastInventoryChanges}
      />
      <button onClick={() => step(true)}>
        Step
      </button>
    </div>
  );
}
