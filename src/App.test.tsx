import React from 'react';
import { within, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Model from './ecosphere/Model';
import { EvolvingStocks } from './ecosphere/types';
import { SpaceStation } from './examples/SpaceStation';
import { IModel } from "./ecosphere/Model/IModel";

const build: () => Model = () => {
  const atlantis = new SpaceStation('Atlantis Station')

  const captain = atlantis.crew.create('Curtis Zechariah')
  const firstOfficer = atlantis.crew.create('Lance Hammond')

  captain.things.add(1000, 'Galactic Credits')
  captain.traits.add(3, 'Leadership') // { name: 'Leadership', rank: 3 })
  captain.traits.add(1, 'Empathy')
  console.log(captain.traits.list())
  // captain.traits.add({ name: 'Empathy', rank: 1 })

  atlantis.resources.create('Thrust')
  atlantis.resources.create('Xenocite')
  atlantis.resources.create('Vigilance')

  atlantis.animals.create('Cat')
  atlantis.animals.add(1, 'Cat')

  // const synthXenocite = 'Synthesize Xenocite'
  const xenocite = atlantis.crew.recipes.create({
    name: 'Xenocite',
    produces: { Xenocite: 100 },
    consumes: { Power: 20 }
  })

  // const drive = 'Drive Ship'
  const drive = atlantis.crew.recipes.create({
    name: 'Drive',
    produces: { Thrust: 100 },
    consumes: { Power: 30 }
  })

  // const mainThrusters = atlantis.people.tasks.create({ name: 'Accelerate', recipe: drive })
  // const makeXenocite = atlantis.people.tasks.create({ name: 'Make Xenocite', recipe: synthXenocite })

  atlantis.crew.jobs.set(captain, xenocite)
  atlantis.crew.jobs.set(firstOfficer, drive)

  atlantis.evolve((e: EvolvingStocks, t: number) => {
    e.resources.remove(1, 'Air')
    if (t % 3 === 0) { e.resources.remove(1, 'Power') }
    atlantis.crew.work({ resources: e.resources })

    // cost of doin' business in this part of the galaxy
    captain.things.remove(1, 'Galactic Credits')
  });

  atlantis.actions.create({
    name: 'Ignite Thrusters',
    act: () => {
      atlantis.resources.add(1000, 'Thrust')
    }
  })

  atlantis.policies.create({
    name: 'Battle Stations',
    manage: () => {
      // console.log("BATTLE STATIONS!!!")
      if (atlantis.resources.count('Vigilance') < 255) {
        atlantis.resources.add(255, 'Vigilance')
      }
    }
  })

  atlantis.metrics = { 'Deuterium Burn Rate': () => 100 }


  return atlantis;
}

class Eco {
  static get modelName() {
    return screen.getByLabelText('Model Title')
  }

  // static get individuals() {
  //   return screen.getByLabelText('Individuals')
  // }
  static actions = {
    container: () => screen.getByTitle('Actions'),
    get: (name: string) => {
      const actions = within(Eco.actions.container())
      const theAction = actions.getByTitle(name)
      return theAction
    }
  }

  static policies = {
    container: () => screen.getByTitle('Policies'),
    get: (name: string) => {
      const policies = within(Eco.policies.container())
      const thePolicy = policies.getByTitle(name)
      return thePolicy
    }
  }

  static metrics = {
    container: () => screen.getByTitle('Metrics'),
    get: (name: string) => {
      const measurements = within(Eco.metrics.container());
      const theMetric = (measurements.getByTitle(name));
      return theMetric;
    },
    count: async (name: string) => {
      const it = Eco.metrics.get(name);
      const amount = await within(it).findByTestId('Count')
      return Number(amount.textContent);
    }
  }

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
    // task: async (name: string) => {
    //   const them = Eco.people.get(name);
    //   const amount = await within(them).findByTestId('Task')
    //   return String(amount.textContent);
    // },

    // count personal items
    count: async (name: string, itemName: string) => {
      const them = Eco.people.get(name);
      const inventory = await within(them).findByTestId('Inventory')
      const item = await within(inventory).findByTestId(itemName)
      return Number(item.textContent);
    },

    // get trait rank
    rank: async (name: string, traitName: string) => {
      const them = Eco.people.get(name);
      const traits = await within(them).findByTestId('Trait Ranks')
      const trait = await within(traits).findByTestId(traitName)
      return Number(trait.textContent);
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

describe('people', () => {
  it('tasks', async () => {
    expect(await Eco.people.status('Curtis Zechariah')).toEqual('Xenocite')
    expect(await Eco.people.status('Lance Hammond')).toEqual('Drive')
  });
  
  it('inventories', async () => {
    expect(await Eco.people.count('Curtis Zechariah', 'Galactic Credits')).toEqual(1000)
  });

  it('traits', async () => {
    expect(await Eco.people.rank('Curtis Zechariah', 'Leadership')).toEqual(3)
    expect(await Eco.people.rank('Curtis Zechariah', 'Empathy')).toEqual(1)
  });
})

it('renders tools/machines', () => {
  const tool = screen.getByText(/Science Lab Controls/);
  expect(tool).toBeInTheDocument();
});

it('tracks resources over time', async () => {
  expect(await Eco.items.count('Air')).toEqual(100)
  expect(await Eco.items.count('Power')).toEqual(100)
  expect(
    await Eco.people.count('Curtis Zechariah', 'Galactic Credits')
  ).toEqual(1000)
  const stepButton = await screen.findByText("Step")
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Air')).toEqual(99)
  expect(await Eco.items.count('Power')).toEqual(49)
  expect(
    await Eco.people.count('Curtis Zechariah', 'Galactic Credits')
  ).toEqual(999)
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

it('fires commands to the sim', async () => {
  const ignition = await Eco.actions.get('Ignite Thrusters')
  fireEvent.click(ignition)
  expect(await Eco.items.count('Thrust')).toEqual(1000)
})

it('sets policies for the sim', async () => {
  const battleStations = await Eco.policies.get('Battle Stations')
  fireEvent.click(battleStations)
  const stepButton = await screen.findByText("Step")
  fireEvent.click(stepButton);
  expect(await Eco.items.count('Vigilance')).toEqual(255)
})

it('displays metrics from the sim', async () => {
  const fuelBurn = await Eco.metrics.count('Deuterium Burn Rate')
  expect(fuelBurn).toEqual(100)
})
 
// test.todo('displays assigned tasks') //, async () => { })
// xit('simulates animal populations through time')
// xit('starts/stops/slows down')
// xit('timekeeping')
// xit('events')
