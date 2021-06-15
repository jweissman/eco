import React from 'react';
import { within, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Model from './ecosphere/Model';
import { Evolution } from './ecosphere/types';
import { SpaceStation } from './examples/SpaceStation';
import { IModel } from './ecosphere/Model/Model';

const build: () => Model = () => {
  const atlantis = new SpaceStation('Atlantis Station')

  const captain = atlantis.people.create('Curtis Zechariah')
  const firstOfficer = atlantis.people.create('Lance Hammond')

  atlantis.resources.create('Thrust')
  atlantis.resources.create('Xenocite')

  atlantis.animals.create('Cat')
  atlantis.animals.add(1, 'Cat')

  const synthXenocite = 'Synthesize Xenocite'
  atlantis.recipes.create({
    name: synthXenocite,
    produces: { Xenocite: 100 },
    consumes: { Power: 20 }
  })
  // console.log(atlantis.recipes.count)

  const drive = 'Drive Ship'
  atlantis.recipes.create({
    name: drive,
    produces: { Thrust: 100 },
    consumes: { Power: 30 }
  })

  // console.log(atlantis.recipes.count)
  // console.log(atlantis.recipes.first)
  // console.log(atlantis.recipes.last)

  const mainThrusters = atlantis.tasks.create({ name: 'Accelerate', recipe: drive })
  const makeXenocite = atlantis.tasks.create({ name: 'Make Xenocite', recipe: synthXenocite })

  atlantis.jobs.set(captain, makeXenocite)
  atlantis.jobs.set(firstOfficer, mainThrusters)

  atlantis.evolve((e: Evolution, t: number) => { //remove, t }) => {
    e.resources.remove(1, 'Air')
    if (t % 3 === 0) { e.resources.remove(1, 'Power') }
    // console.log(this)
    atlantis.work({ resources: e.resources })
  });

  return atlantis;
}

class Eco {
  static get modelName() {
    return screen.getByLabelText('Model Title')
  }

  static get individuals() {
    return screen.getByLabelText('Individuals')
  }

  static animals = {
    container: () => screen.getByLabelText('Global Animals'),
    get: (name: string) => {
      const animals = within(Eco.animals.container());
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
    container: () => screen.getByLabelText('Global Items'),
    get: (itemName: string) => {
      const items = within(Eco.items.container());
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
  const zed = screen.getByText(/Zech/i);
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
  expect(await Eco.items.count('Power')).toEqual(49)
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(98)
  expect(await Eco.items.count('Power')).toEqual(-1)
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(97)
  expect(await Eco.items.count('Power')).toEqual(-1)
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(96)
  expect(await Eco.items.count('Power')).toEqual(-2)
})

it('tracks resource deltas over time', async () => {
  expect(await Eco.items.count('Air')).toEqual(100)
  expect(await Eco.items.count('Power')).toEqual(100)
  const stepButton = await screen.findByText("Step")
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(99)
  expect(await Eco.items.count('Power')).toEqual(49)
  expect(await Eco.items.delta('Air')).toEqual(-1)
  expect(await Eco.items.delta('Power')).toEqual(-51)
})
 
xit('displays assigned tasks', async () => {
})
// xit('simulates animal populations through time')
// xit('starts/stops/slows down')
// xit('timekeeping')
// xit('events')
