import React from 'react';
import { within, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Model from './ecosphere/Model';

const build: () => Model = () => {
  const model = new Model('Space Station')
  model.items.create('Power')
  model.items.create('Air')
  model.individual('Zedediah')
  model.items.add(100, 'Power')
  model.items.add(100, 'Air')
  model.evolve(({ remove }) => remove(1, 'Air'));
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
      expect(amount).toBeInTheDocument()
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
  const individuals = screen.getByText(/Zed/i);
  expect(individuals).toBeInTheDocument();
});

it('steps through time', async () => {
  expect(await Eco.items.count('Air')).toEqual(100)
  const stepButton = await screen.findByText("Step")
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(99)
})
