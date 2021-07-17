import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { IAssembly } from './ecosphere/Assembly';
import Model from './ecosphere/Model';
import { IModel } from "./ecosphere/Model/IModel";
import { ModelPresenter } from './ModelPresenter';
import { useModel } from './useModel';

export const isModel = (maybeModel: IModel | IAssembly): maybeModel is IModel => {
  return maybeModel instanceof Model;
}

const AssemblyPresenter: React.FC<{ assembly: IAssembly }> = ({ assembly }) => {
  return <>{assembly.models.items.map((theModel: IModel) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { step, send, choose, lastChanges, model } = useModel(theModel);
    return <>
    <h4>{theModel.name}</h4>
    <ModelPresenter
             key={model.name}
             step={step}
             send={send}
             model={model as IModel}
             choose={choose}
             lastChanges={lastChanges}
           />
           </>
  })}</>
}

export function ModelSelector({ initialModel, models }: {
  initialModel: IModel;
  models: (IModel | IAssembly)[];
}) {
  const { step, send, choose, lastChanges, model, setModel } = useModel(initialModel);
  return <>
    <Dropdown
      options={models.map(model => model.name)}
      onChange={({ value }) => {
        const theModel = models.find((model: IModel | IAssembly) => model.name === value);
        if (theModel) { setModel(theModel); }
      }}
      value={model.name}
      placeholder="Select a model" />
    {isModel(model) ? <ModelPresenter
                       step={step}
                       send={send}
                       model={model}
                       choose={choose}
                       lastChanges={lastChanges} />
                    : <AssemblyPresenter assembly={model} />}
  </>;
}
