import { ModelView } from './ecosphere/Model';
import { IModel } from "./ecosphere/Model/IModel";

export type LastDelta = { [group: string]: { [element: string]: number }}

type ModelPresenterProps = {
  model: IModel
  step: Function 
  send: Function
  choose: Function
  lastChanges: LastDelta
}

const view = (model: IModel, lastChanges: LastDelta) => {
  const { actions, resources, people, machines, animals } = model;

  const props = {
    modelName: model.name,
    items: resources.report,
    individuals: people.list(),
    work: people.report,
    machines: machines.list(),
    animals: animals.report,
    actions: actions.list(),
    lastChanges,
  }

  return props
}

export function ModelPresenter({ model, send, choose, step, lastChanges }: ModelPresenterProps) {
  return <>
    <div aria-label='View'>
      <ModelView {...view(model, lastChanges)} />
    </div>

    <div aria-label='Run'>
      <button onClick={() => step(true)}>Step</button>
    </div>

    {/* <h5>Commands</h5> */}
    <ul aria-label='Actions'>
      {model.actions.list().map(({ name }) => <button title={name} key={name} onClick={() => send(name)}>
        {name}
      </button>)}
    </ul>

    {/* <h5>Policies</h5> */}
    <ul aria-label='Policies'>
      {model.policies.list().map(({ name }) => <button title={name} key={name} onClick={() => choose(name)}>
        {name}
      </button>)}
    </ul>
  </>;
}
