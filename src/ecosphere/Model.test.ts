import Model from "./Model"
import { Substance, Individual } from "./types";

describe('Model', () => {
  const model = new Model('Avernus');
  // const { create } = model.resources;

  it('has a name', () => {
    expect(model.name).toEqual('Avernus')
  })

  it('defines elements', () => {
    expect(model.resources.list).toEqual([])
    const carbon: Substance = model.resources.create("Carbon")
    expect(carbon.name).toEqual('Carbon')
    const diamond: Substance = model.resources.create({ name: "Diamond", rarity: 'infrequent' })
    expect(diamond.rarity).toEqual('infrequent')
    console.log(diamond)
    expect(diamond.name).toEqual('Diamond')
    expect(model.resources.list).toEqual([carbon, diamond])
  })

  it('defines individuals', () => {
    expect(model.people.list).toEqual([])
    const jed: Individual = model.people.create({ name: "Jed", age: 47 });
    expect(jed.name).toEqual("Jed")
    expect(jed.age).toEqual(47)
    expect(model.people.list).toEqual([jed])
    const tom: Individual = model.people.create("Tom");
    expect(tom.name).toEqual("Tom")
    expect(model.people.list).toEqual([jed, tom])
    const harry: Individual = model.people.create("Harry");
    expect(harry.name).toEqual("Harry")
    expect(model.people.list).toEqual([jed, tom, harry])
  })

  it('defines global inventory (stocks of items)', () => {
    expect(model.resources.report).toEqual([])
    const carbon = model.resources.create("Carbon")
    const diamond = model.resources.create("Diamond")
    model.resources.add(5, 'Carbon')
    expect(model.resources.count('Carbon')).toEqual(5)
    expect(model.resources.report).toEqual([{ ...carbon, amount: 5 }])
    model.resources.add(3, 'Diamond')
    expect(model.resources.report).toEqual([{ ...carbon, amount: 5 }, { ...diamond, amount: 3 }])
    model.resources.remove(2, 'Diamond')
    expect(model.resources.report).toEqual([{ ...carbon, amount: 5 }, { ...diamond, amount: 1 }])
    model.resources.remove(1, 'Carbon')
    expect(model.resources.report).toEqual([{ ...carbon, amount: 4 }, { ...diamond, amount: 1 }])
  })

  it('steps through time', () => {
    model.resources.create('Carbon')
    model.resources.zero('Carbon')
    model.evolution = ({ add, count }) => add(count('Carbon'), 'Carbon')
    expect(model.resources.count('Carbon')).toEqual(0)
    model.resources.add(1, 'Carbon')
    expect(model.resources.count('Carbon')).toEqual(1)
    model.step()
    expect(model.resources.count('Carbon')).toEqual(2)
    model.step()
    expect(model.resources.count('Carbon')).toEqual(4)
    model.step()
    expect(model.resources.count('Carbon')).toEqual(8)
  })

  it('machines', () => {
     const windmill = model.machines.create('Windmill')
     expect(model.machines.list).toEqual([windmill]);
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
