import { ModelView } from './ecosphere/Model';
import { IModel } from "./ecosphere/Model/IModel";
import { ModelViewProps } from './ecosphere/Model/ModelView';

export type LastDelta = { [group: string]: { [element: string]: number }}

type ModelPresenterProps = {
  model: IModel
  step: Function 
  lastChanges: LastDelta
}

const view = (model: IModel, lastChanges: LastDelta) => {
  const { resources, people, machines, animals } = model;

  const props = {
    modelName: model.name,
    items: resources.report,
    individuals: people.list(),
    work: people.report,
    machines: machines.list(),
    animals: animals.report,
    lastChanges,
  }

  return props
}

export function ModelPresenter({ model, step, lastChanges }: ModelPresenterProps) {
  return <>
    <ModelView {...view(model, lastChanges)} />
    <button onClick={() => step(true)}>Step</button>
  </>;
}
