import React from 'react';
import { within, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Model from './ecosphere/Model';

const build: () => Model = () => {
  const model = new Model('Space Station')
  model.items.create('Power')
  model.items.create('Air')
  model.people.create('Zachariah')
  model.items.add(100, 'Power')
  model.items.add(100, 'Air')
  model.tools.create('Control Panel')
  model.evolve(({ remove, t }) => {
    remove(1, 'Air')
    if (t % 3 === 0) { remove(1, 'Power') }
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
