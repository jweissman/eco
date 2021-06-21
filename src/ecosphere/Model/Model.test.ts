import Model from "./Model"
import { EvolvingStocks, Person, TimeEvolution } from "../types";

describe('Model', () => {
  const model = new Model('Avernus');
  beforeEach(() => {
    model.reset()
    // model.resources.clear()
    // model.machines.clear()
    // model.animals.clear()
  }) // maybe want a harder Sim.reset??

  it('has a name', () => {
    expect(model.name).toEqual('Avernus')
  })

  it('defines elements', () => {
    expect(model.resources.list()).toEqual([])
    const carbon = model.resources.create("Carbon")
    expect(carbon.item.name).toEqual('Carbon')
    const diamond = model.resources.create({ name: "Diamond", rarity: 'infrequent' })
    expect(diamond.item.rarity).toEqual('infrequent')
    expect(diamond.item.name).toEqual('Diamond')
    expect(model.resources.list()).toEqual([carbon.item, diamond.item])
  })

  it('defines individuals', () => {
    expect(model.people.list()).toEqual([])
    const jed: Person = model.people.create({ name: "Jed", age: 47 });
    expect(jed.name).toEqual("Jed")
    expect(jed.age).toEqual(47)
    expect(model.people.list()).toEqual([jed])
    const tom: Person = model.people.create("Tom");
    expect(tom.name).toEqual("Tom")
    expect(model.people.list()).toEqual([jed, tom])
    const harry: Person = model.people.create("Harry");
    expect(harry.name).toEqual("Harry")
    expect(model.people.list()).toEqual([jed, tom, harry])
  })

  it('defines global inventory (stocks of items)', () => {
    expect(model.resources.report).toEqual([])
    const carbon = model.resources.create("Carbon")
    const diamond = model.resources.create("Diamond")
    model.resources.add(5, 'Carbon')
    expect(model.resources.count('Carbon')).toEqual(5)
    expect(model.resources.report).toEqual([
      { ...carbon.item, amount: 5 },
      { ...diamond.item, amount: 0 }
    ])
    model.resources.add(3, 'Diamond')
    expect(model.resources.report).toEqual([{ ...carbon.item, amount: 5 }, { ...diamond.item, amount: 3 }])
    model.resources.remove(2, 'Diamond')
    expect(model.resources.report).toEqual([{ ...carbon.item, amount: 5 }, { ...diamond.item, amount: 1 }])
    model.resources.remove(1, 'Carbon')
    expect(model.resources.report).toEqual([{ ...carbon.item, amount: 4 }, { ...diamond.item, amount: 1 }])

    // also available from global report
    expect(model.report.resources).toEqual([{ ...carbon.item, amount: 4 }, { ...diamond.item, amount: 1 }])
  })

  it('steps through time', () => {
    model.resources.create('Carbon')
    model.resources.zero('Carbon')
    const evolve: TimeEvolution = (e: EvolvingStocks, t: number) => {
      const carbonCount = e.resources.count('Carbon');
      e.resources.add(carbonCount, 'Carbon')
    } 
    model.evolve(evolve)
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
    const Fox = model.animals.create('Fox', { size: 'fine', fitness: 'adequate' })
    expect(Fox.count).toEqual(0)
    Fox.birth()
    expect(Fox.count).toEqual(1)
    const fox = Fox.first
    expect(fox).not.toBe(null)
    Fox.death()
    expect(Fox.count).toEqual(0)
  })

  it('evolves wildlife', () => {
    const Fox = model.animals.create('Fox', { size: 'fine', fitness: 'good'})
    const evolve: TimeEvolution = (e: EvolvingStocks, t: number) => {
      const { count, add } = e.animals
      add(count('Fox'), 'Fox')
    } 
    model.evolve(evolve)
    Fox.birth()
    expect(model.animals.count('Fox')).toEqual(1)
    model.step()
    expect(model.animals.count('Fox')).toEqual(2)
  })

  it('reports', () => {
    const Gold = model.resources.create('Gold')
    const Silicon = model.resources.create('Silicon')
    Gold.add(10)
    Silicon.add(5)

    const Fox   = model.animals.create('Fox')
    const Lion  = model.animals.create('Lion')
    const Tiger = model.animals.create('Tiger')
    const Bear  = model.animals.create('Bear')

    Fox.add(10)
    Lion.add(15)
    Tiger.add(25)
    Bear.add(20)

    expect(model.report.resources).toEqual(
      [ { ...Gold.item, amount: 10 }, { ...Silicon.item, amount: 5 } ],
    )

    // expect(model.report.animals).toEqual(
    //   // [
    //     { name: 'Fox', amount: 10 },
    //     { name: 'Lion', amount: 15 },
    //     { name: 'Bear', amount: 20 },
    //     { name: 'Tiger', amount: 25 }
    //   // ],
    //   // { Fox: 10, Lion: 15, Bear: 20, Tiger: 25 }
    // )

    Fox.death()
    Lion.remove(3)
    Tiger.add(5)
    Bear.birth()

    // expect(model.report.animals).toEqual(
    //   { Fox: 9, Lion: 12, Bear: 21, Tiger: 30 }
    // )
  })

  // todo(jweissman) think about how this works
  it('machines', () => {
     const FishingPole = model.machines.create('Fishing Pole')
     expect(model.machines.list()).toEqual([FishingPole.item]);
     expect(model.machines.count('Fishing Pole')).toEqual(0)
     model.machines.add(1, 'Fishing Pole')
     expect(model.machines.count('Fishing Pole')).toEqual(1)
  })

  it('recipes, tasks and jobs', () => {
    const Windmill = model.machines.create('Windmill')
    const { recipes } = model.people
    expect(model.machines.list()).toEqual([Windmill.item]);
    model.resources.create('Grain')
    model.resources.create('Flour')
    model.resources.add(10, 'Grain')
    expect(recipes.count).toEqual(0)
    const Milling = 'Milling';
    const mill = recipes.create({
      name: Milling,
      consumes: { Grain: 10, },
      produces: { Flour: 20 },
      requiresMachine: 'Windmill' // .item.name
    })
    model.machines.create('Windmill')
    model.machines.add(1, 'Windmill')
    expect(recipes.count).toEqual(1)
    expect(recipes.first.name).toEqual(Milling)
    const harry = model.people.create('Harry');
    // const mill = model.people.tasks.create({ recipe: Milling })
    model.people.jobs.set(harry, mill)
    expect(model.people.jobs.report).toEqual({ Harry: { ...mill } })
    model.evolve((e) => model.people.work({ resources: e.resources }))
    expect(model.resources.count('Grain')).toEqual(10)
    expect(model.resources.count('Flour')).toEqual(0)
    model.step()
    expect(model.resources.count('Grain')).toEqual(0)
    expect(model.resources.count('Flour')).toEqual(20)
  })
})
