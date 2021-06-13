import Model from "./Model"
import { Individual } from "./types";

describe('Model', () => {
  const model = new Model('Avernus');
  beforeEach(() => { model.resources.clear() })

  it('has a name', () => {
    expect(model.name).toEqual('Avernus')
  })

  it('defines elements', () => {
    expect(model.resources.list).toEqual([])
    const carbon = model.resources.create("Carbon")
    expect(carbon.get().name).toEqual('Carbon')
    const diamond = model.resources.create({ name: "Diamond", rarity: 'infrequent' })
    expect(diamond.get().rarity).toEqual('infrequent')
    expect(diamond.get().name).toEqual('Diamond')
    expect(model.resources.list).toEqual([carbon.get(), diamond.get()])
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
    expect(model.resources.report).toEqual([{ ...carbon.get(), amount: 5 }])
    model.resources.add(3, 'Diamond')
    expect(model.resources.report).toEqual([{ ...carbon.get(), amount: 5 }, { ...diamond.get(), amount: 3 }])
    model.resources.remove(2, 'Diamond')
    expect(model.resources.report).toEqual([{ ...carbon.get(), amount: 5 }, { ...diamond.get(), amount: 1 }])
    model.resources.remove(1, 'Carbon')
    expect(model.resources.report).toEqual([{ ...carbon.get(), amount: 4 }, { ...diamond.get(), amount: 1 }])
  })

  it('steps through time', () => {
    model.resources.create('Carbon')
    model.resources.zero('Carbon')
    model.dynamics = ({ resources: { add, count }}) => add(count('Carbon'), 'Carbon')
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

  it('animals', () => {
    const Fox = model.animals.create('Fox')
    expect(Fox.count).toEqual(0)
    Fox.birth()
    expect(Fox.count).toEqual(1)
    const fox = Fox.first
    expect(fox).not.toBe(null)
    Fox.death()
    expect(Fox.count).toEqual(0)
  })

  it('reports', () => {
    const Gold = model.resources.create('Gold')
    const Silicon = model.resources.create('Silicon')
    Gold.add(10)
    Silicon.add(5)

    const Fox = model.animals.create('Fox')
    const Lion = model.animals.create('Lion')
    const Bear = model.animals.create('Bear')

    Fox.add(10)
    Lion.add(15)
    Bear.add(20)

    expect(model.report.resources).toEqual(
      [ { ...Gold.get(), amount: 10 }, { ...Silicon.get(), amount: 5 } ],
    )

    expect(model.report.animals).toEqual(
      { Fox: 10, Lion: 15, Bear: 20 }
    )

    Fox.death()
    Lion.remove(3)
    Bear.birth()

    expect(model.report.animals).toEqual(
      { Fox: 9, Lion: 12, Bear: 21 }
    )
  })

  // todo(jweissman) think about how this works
  it('machines', () => {
     const Windmill = model.machines.create('Windmill')
     expect(model.machines.list).toEqual([Windmill.get()]);

    //  model.resources.create('Grain')
    //  model.resources.create('Flour')
    //  const milling = model.jobs.create({
    //    name: 'milling',
    //    description: 'making flour from grain',
    //    at: windmill.name,
    //    consumes: { Grain: 10, },
    //    produces: { Flour: 20 }
    //  })
    //  expect(model.jobs.list).toEqual([milling])

    //  model.resources.add(10, 'Grain')
    //  const harry: Individual = model.people.create("Harry");
    //  model.work(harry, windmill)
    // maybe shouldn't be harry's status???
     // expect(harry.status).toEqual('milling at Mill')
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
