import React from 'react';
import { within, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Model from './ecosphere/Model';
import { Evolution } from './ecosphere/types';
import { SpaceStation } from './examples/SpaceStation';
import { IModel } from './ecosphere/Model/Model';

const build: () => Model = () => {
  const atlantis = new SpaceStation('Atlantis Station')
  atlantis.people.create('Zachariah')
  atlantis.animals.create('Cat')
  atlantis.animals.add(1, 'Cat')
  atlantis.evolve((e: Evolution, t: number) => { //remove, t }) => {
    e.resources.remove(1, 'Air')
    if (t % 3 === 0) {
      e.resources.remove(1, 'Power')
    }
  });
  return atlantis;
}

class Eco {
  static get modelName() {
    return screen.getByLabelText('Model Title')
  }

  static get globalItems() {
    return screen.getByLabelText('Global Items')
  }

  static get globalAnimals() {
    return screen.getByLabelText('Global Animals')
  }

  static animals = {
    get: (name: string) => {
      const animals = within(Eco.globalAnimals);
      const theAnimal = (animals.getByTitle(name));
      return theAnimal;
    },
    count: async (name: string) => {
      const it = Eco.animals.get(name);
      const amount = await within(it).findByTestId('Count')
      return Number(amount.textContent);
    }
  }
  static items = {
    get: (itemName: string) => {
      const items = within(Eco.globalItems);
      const theItem = (items.getByTitle(itemName));
      return theItem;
    },
    count: async (itemName: string) => {
      const it = Eco.items.get(itemName);
      const amount = await within(it).findByTestId('Count')
      return Number(amount.textContent);
    },
    delta: async (itemName: string) => {
      const it = Eco.items.get(itemName);
      const amount = await within(it).findByTestId('Delta')
      return Number(amount.textContent);
    }
  }
}

beforeEach(() => {
  const model: IModel = build()
  // model.reset()
  render(<App model={model} />)
})

it('renders model name', () => {
  expect(Eco.modelName).toBeInTheDocument();
  expect(Eco.modelName).toHaveTextContent('Atlantis Station')
});

it('renders resources', async () => {
  expect(await Eco.items.count('Air')).toEqual(100)
  expect(await Eco.items.count('Power')).toEqual(100)
});

it('renders animals', async () => {
  expect(await Eco.animals.count('Cat')).toEqual(1)
  // expect(await Eco.items.count('Power')).toEqual(100)
});

it('renders individuals', () => {
  const zed = screen.getByText(/Zach/i);
  expect(zed).toBeInTheDocument();
});

it('renders tools', () => {
  const tool = screen.getByText(/Control Panel/i);
  expect(tool).toBeInTheDocument();
});

it('tracks resources over time', async () => {
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

it('tracks resource deltas over time', async () => {
  expect(await Eco.items.count('Air')).toEqual(100)
  expect(await Eco.items.count('Power')).toEqual(100)
  const stepButton = await screen.findByText("Step")
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(99)
  expect(await Eco.items.count('Power')).toEqual(99)
  expect(await Eco.items.delta('Air')).toEqual(-1)
  expect(await Eco.items.delta('Power')).toEqual(-1)
})
 
// xit('simulates animal populations through time')
// xit('starts/stops/slows down')
// xit('timekeeping')
// xit('events')
