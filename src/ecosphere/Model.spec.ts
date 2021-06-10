import Model, { Individual, Substance } from "./Model"

describe('Model', () => {
  const modelName = 'the model name';
  const model = new Model(modelName);

  it('has a name', () => {
    expect(model.name).toEqual('the model name')
  })

  it('defines elements', () => {
    expect(model.elements).toEqual([])
    const carbon: Substance = model.element("Carbon")
    expect(carbon.name).toEqual('Carbon')
    expect(model.elements).toEqual([carbon])
  })

  it('defines individuals', () => {
    expect(model.individuals).toEqual([])
    const jed: Individual = model.individual("Jed");
    expect(jed.name).toEqual("Jed")
    expect(model.individuals).toEqual([jed])
  })

  it('defines global inventory (stocks of elements)', () => {
    expect(model.inventory.storage).toEqual({})
    const carbon: Substance = model.element("Carbon")
    const diamond: Substance = model.element("Diamond")
    model.add(5, 'Carbon')
    expect(model.count('Carbon')).toEqual(5)
    expect(model.inventory.storage).toEqual({ [carbon.id]: 5 })
    model.add(3, 'Diamond')
    expect(model.inventory.storage).toEqual({ [carbon.id]: 5, [diamond.id]: 3 })
    model.remove(2, 'Diamond')
    expect(model.inventory.storage).toEqual({ [carbon.id]: 5, [diamond.id]: 1 })
    model.remove(1, 'Carbon')
    expect(model.inventory.storage).toEqual({ [carbon.id]: 4, [diamond.id]: 1 })
  })
})
