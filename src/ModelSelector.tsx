import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { IModel } from "./ecosphere/Model/IModel";
import { ModelPresenter } from './ModelPresenter';
import { useModel } from './useModel';

export function ModelSelector({ initialModel, models }: { initialModel: IModel; models: IModel[]; }) {
  const { step, send, choose, lastChanges, model, setModel } = useModel(initialModel);
  return <>
    <Dropdown
      options={models.map(model => model.name)}
      onChange={({ value }) => {
        const theModel = models.find((model: IModel) => model.name === value);
        if (theModel) { setModel(theModel); }
      }}
      value={model.name}
      placeholder="Select a model" />
    <ModelPresenter
      step={step}
      send={send}
      model={model}
      choose={choose}
      lastChanges={lastChanges} />
  </>;
}
