import Model, { ModelView } from './ecosphere/Model';

type ModelPresenterProps = {
  model: Model
  step: Function 
  lastInventoryChanges: { resources: { [elementName: string]: number }}
}

export function ModelPresenter({ model, step, lastInventoryChanges }: ModelPresenterProps) {
  const { resources, people, machines, animals } = model;
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
