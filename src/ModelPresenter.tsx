import { ModelView } from './ecosphere/Model';
import { IModel } from "./ecosphere/Model/IModel";
import { ModelViewProps } from './ecosphere/Model/ModelView';

export type LastDelta = { [group: string]: { [element: string]: number }}

type ModelPresenterProps = {
  model: IModel
  step: Function 
  lastChanges: LastDelta
}

const view = (model: IModel, lastChanges: LastDelta): ModelViewProps => {
  const { resources, people, machines, animals } = model;
  return {
    modelName: model.name,
    items: resources.report,
    individuals: people.list(),
    machines: machines.list(),
    animals: animals.report,
    lastChanges,
  }
}

export function ModelPresenter({ model, step, lastChanges }: ModelPresenterProps) {
  return (
    <div className="Model">
      <ModelView {...view(model, lastChanges)} />
      <button onClick={() => step(true)}>Step</button>
    </div>
  );
}
