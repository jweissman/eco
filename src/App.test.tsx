import React from 'react';
import { within, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Model from './ecosphere/Model';
import { EvolvingStocks } from './ecosphere/types';
import { SpaceStation } from './examples/SpaceStation';
import { IModel } from "./ecosphere/Model/IModel";

const build: () => Model = () => {
  const atlantis = new SpaceStation('Atlantis Station')

  const captain = atlantis.people.create('Curtis Zechariah')
  const firstOfficer = atlantis.people.create('Lance Hammond')

  atlantis.resources.create('Thrust')
  atlantis.resources.create('Xenocite')

  atlantis.animals.create('Cat')
  atlantis.animals.add(1, 'Cat')

  // const synthXenocite = 'Synthesize Xenocite'
  const xenocite = atlantis.people.recipes.create({
    name: 'Xenocite',
    produces: { Xenocite: 100 },
    consumes: { Power: 20 }
  })

  // const drive = 'Drive Ship'
  const drive = atlantis.people.recipes.create({
    name: 'Drive',
    produces: { Thrust: 100 },
    consumes: { Power: 30 }
  })

  // const mainThrusters = atlantis.people.tasks.create({ name: 'Accelerate', recipe: drive })
  // const makeXenocite = atlantis.people.tasks.create({ name: 'Make Xenocite', recipe: synthXenocite })

  atlantis.people.jobs.set(captain, xenocite)
  atlantis.people.jobs.set(firstOfficer, drive)

  atlantis.evolve((e: EvolvingStocks, t: number) => {
    e.resources.remove(1, 'Air')
    if (t % 3 === 0) { e.resources.remove(1, 'Power') }
    atlantis.people.work({ resources: e.resources })
  });

  return atlantis;
}

class Eco {
  static get modelName() {
    return screen.getByLabelText('Model Title')
  }

  // static get individuals() {
  //   return screen.getByLabelText('Individuals')
  // }

  static people = {
    container: () => screen.getByLabelText('People'),
    get: (name: string) => {
      const people = within(Eco.people.container())
      const thePerson = people.getByTitle(name)
      return thePerson;
    },
    status: async (name: string) => {
      const them = Eco.people.get(name);
      const amount = await within(them).findByTestId('Status')
      return String(amount.textContent);
    },
    task: async (name: string) => {
      const them = Eco.people.get(name);
      const amount = await within(them).findByTestId('Task')
      return String(amount.textContent);
    }
  }

  static animals = {
    container: () => screen.getByLabelText('Animals'),
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
    container: () => screen.getByLabelText('Resources'),
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

it('renders individuals and tasks', async () => {
  expect(await Eco.people.status('Curtis Zechariah')).toEqual('Xenocite')
  expect(await Eco.people.status('Lance Hammond')).toEqual('Drive')
});

it('renders tools', () => {
  const tool = screen.getByText(/Science Lab Controls/);
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
 
// test.todo('displays assigned tasks') //, async () => { })
// xit('simulates animal populations through time')
// xit('starts/stops/slows down')
// xit('timekeeping')
// xit('events')
