// import { IAssembly } from './ecosphere/Assembly';
import { ModelView } from './ecosphere/Model';
import { IModel } from "./ecosphere/Model/IModel";
import { ModelViewProps } from './ecosphere/View/ModelView';

export type LastDelta = { [group: string]: { [element: string]: number }}

type ModelPresenterProps = {
  model: IModel
  step: Function 
  send: Function
  choose: Function
  lastChanges: LastDelta
}

const view = (model: IModel, lastChanges: LastDelta): ModelViewProps => {
  const { resources, people, machines, animals, metrics, notes, tiles, tileColors } = model;

  const props: ModelViewProps = {
    modelName: model.name,
    resources: resources.report,
    communities: people.populationList, //.populations,
    // individuals: people.list(),
    // work: people.report,
    machines: machines.list(),
    animals: animals.report,
    // actions: actions.list(),
    metrics: Object.fromEntries(
      Object.entries(metrics).map(
        ([key, value]) => [key, (value as any as Function)()])
      ),
    notes: Object.fromEntries(
      Object.entries(notes).map(
        ([key, value]) => [key, (value as any as Function)()])
      ),
    lastChanges,
    board: {
      tiles: tiles || [],
      tileColors: tileColors || {},
      tileInspect: (model.tileInspect || (() => '--')),
      evolving: model.tilesEvolving || false,
      pointsOfInterest: model.pointsOfInterest || {},
      tokens: model.tokens || {} 
      // { trees: [[0,0], [128,128], [256,256], [0,256], [256,0]] as [number,number][] } || {}
      // { trees: [[0,0], [0,64], [64,0], [64,64]] as [number,number][] } || {}
      // { trees: [[0,0], [0,32], [32,0], [32, 32]] as [number,number][] } || {}
      // { trees: [[0,0], [0,128], [128,0], [128,128], [64,64]] as [number,number][] } || {}
      // { trees: [[0,0], [0,1], [1,0], [1,1]] as [number,number][] } || {}
      // { trees: [[0,0], [0,2], [2,0], [2,2]] as [number,number][] } || {}
      // { trees: [[0,0], [0,4], [4,0], [4,4], //] as [number,number][] } || {}
      //           [0,0], [0,8], [8,0], [8,8]] as [number,number][] } || {}
    }
  }

  return props
}

export function ModelPresenter({ model, send, choose, step, lastChanges }: ModelPresenterProps) {
  return <>
    <div aria-label='View'>
      <ModelView {...view(model, lastChanges)} />
    </div>

    <div aria-label='Controls'>
      <span title='Run' style={{display: 'none'}}>
        <button onClick={() => step(true)}>Step</button>
      </span>

      <span title='Actions'>
        {model.actions.list().map(({ name }) => <button title={name} key={name} onClick={() => send(name)}>
          {name}
        </button>)}
      </span>

      {model.policies.count > 0 && <div className='Policy' title='Policies'>
        {/* <h5>Policies</h5> */}
        {model.policies.list().map(({ name }) => <label key={name}><input
          type='radio'
          checked={model.currentPolicy?.name === name}
          title={name}
          key={name}
          onChange={() => choose(name)}
        />
        {name}
        </label>)}
      </div>}
    </div>
  </>;
}
