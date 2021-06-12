import Model from "./Model"
import { Substance, Individual } from "./types";

describe('Model', () => {
  const model = new Model('Avernus');
  const { create } = model.items;

  it('has a name', () => {
    expect(model.name).toEqual('Avernus')
  })

  it('defines elements', () => {
    expect(model.items.list()).toEqual([])
    const carbon: Substance = create("Carbon")
    expect(carbon.name).toEqual('Carbon')
    expect(model.items.list()).toEqual([carbon])
  })

  it('defines individuals', () => {
    expect(model.people.list()).toEqual([])
    const jed: Individual = model.people.create("Jed");
    expect(jed.name).toEqual("Jed")
    expect(model.people.list()).toEqual([jed])
  })

  it('defines global inventory (stocks of items)', () => {
    expect(model.inventory.storage).toEqual({})
    const carbon: Substance = create("Carbon")
    const diamond: Substance = create("Diamond")
    model.items.add(5, 'Carbon')
    expect(model.items.count('Carbon')).toEqual(5)
    expect(model.inventory.storage).toEqual({ [carbon.id]: 5 })
    model.items.add(3, 'Diamond')
    expect(model.inventory.storage).toEqual({ [carbon.id]: 5, [diamond.id]: 3 })
    model.items.remove(2, 'Diamond')
    expect(model.inventory.storage).toEqual({ [carbon.id]: 5, [diamond.id]: 1 })
    model.items.remove(1, 'Carbon')
    expect(model.inventory.storage).toEqual({ [carbon.id]: 4, [diamond.id]: 1 })
  })

  it('steps through time', () => {
    model.evolve(({ add, count }) => add(count('Carbon'), 'Carbon'));
    model.items.zero('Carbon')
    expect(model.items.count('Carbon')).toEqual(0)
    model.items.add(1, 'Carbon')
    expect(model.items.count('Carbon')).toEqual(1)
    model.step()
    expect(model.items.count('Carbon')).toEqual(2)
    model.step()
    expect(model.items.count('Carbon')).toEqual(4)
    model.step()
    expect(model.items.count('Carbon')).toEqual(8)
  })

  it('machines', () => {
     const windmill = model.tools.create('Windmill')
     expect(model.tools.list()).toEqual([windmill]);
  })
  //   model.job('milling', {
  //     at: 'Windmill', consumes: { Grain: 10, }, produces: { Flour: 20 }
  //   })

  //   model.element('Grain')
  //   model.element('Bread')
  //   model.add(10, 'Grain')
  //   model.individual('Sancho')
  //   model.construct('Windmill')
  //   // model.building('Windmill')
  //   // model.furnish('Windmill', 'Mill')

  //   expect(model.count('Grain')).toEqual(10)
  //   expect(model.count('Bread')).toEqual(0)
  //   model.work('Sancho', 'milling')
  //   expect(model.status('Sancho')).toEqual('milling at Mill')
  //   expect(model.count('Grain')).toEqual(0)
  //   expect(model.count('Bread')).toEqual(1)
  // });
})
