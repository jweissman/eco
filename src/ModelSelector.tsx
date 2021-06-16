import { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { IModel } from "./ecosphere/Model/IModel";
import { ModelPresenter } from './ModelPresenter';
import { useModel } from './useModel';

export function ModelSelector({ initialModel, models }: { initialModel: IModel; models: IModel[]; }) {
  const [model, setModel] = useState(initialModel);
  const { step, lastChanges } = useModel(model);
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
      model={model}
      lastChanges={lastChanges} />
  </>;
}
