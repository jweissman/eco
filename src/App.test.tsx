import React from 'react';
import { within, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Model from './ecosphere/Model';
import { Evolution, ManageStocks } from './ecosphere/types';

const build: () => Model = () => {
  const model = new Model('Space Station')
  model.resources.create('Power')
  model.resources.create('Air')
  model.people.create('Zachariah')
  model.resources.add(100, 'Power')
  model.resources.add(100, 'Air')
  model.machines.create('Control Panel')
  model.evolve((e: Evolution, t: number) => { //remove, t }) => {
    console.log(e.resources)
    e.resources.remove(1, 'Air')
    if (t % 3 === 0) { e.resources.remove(1, 'Power') }
  });
  return model;
}

class Eco {
  static get modelName() {
    return screen.getByLabelText('Model Title')
  }

  static get globalItems() {
    return screen.getByLabelText('Global Items')
  }

  static items = {
    get: (itemName: string) => {
      const items = within(Eco.globalItems);
      const theItem = (items.getByTitle(itemName));
      return theItem;
    },
    count: async (itemName: string) => {
      const it = Eco.items.get(itemName);
      const amount = await within(it).findByTestId('Item Count')
      return Number(amount.textContent);
    }
  }
}

const model: Model = build()
beforeEach(() => render(<App model={model} />))

it('renders model name', () => {
  expect(Eco.modelName).toBeInTheDocument();
  expect(Eco.modelName).toHaveTextContent('Space Station')
});

it('renders element inventories', async () => {
  expect(await Eco.items.count('Air')).toEqual(100)
  expect(await Eco.items.count('Power')).toEqual(100)
});

it('renders individuals', () => {
  const zed = screen.getByText(/Zach/i);
  expect(zed).toBeInTheDocument();
});

it('renders tools', () => {
  const tool = screen.getByText(/Control Panel/i);
  expect(tool).toBeInTheDocument();
});

it('steps through time', async () => {
  expect(await Eco.items.count('Air')).toEqual(100)
  expect(await Eco.items.count('Power')).toEqual(100)
  const stepButton = await screen.findByText("Step")
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(99)
  expect(await Eco.items.count('Power')).toEqual(99)
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(98)
  expect(await Eco.items.count('Power')).toEqual(99)
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(97)
  expect(await Eco.items.count('Power')).toEqual(99)
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(96)
  expect(await Eco.items.count('Power')).toEqual(98)
})
