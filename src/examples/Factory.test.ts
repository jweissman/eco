import { Factory } from './Factory'

describe('Factory', () => {
  const factory = new Factory('Fancy Space Shoes', {});
  beforeEach(factory.reboot)

  it('runs without error', () => {
    expect(factory.name).toMatch(/Shoes Factory/)
    expect(() => factory.step()).not.toThrowError();
  })
  it('produces', () => {
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(0)
    expect(factory.inventory.count).toEqual(0)
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(1)
    expect(factory.inventory.count).toEqual(1)
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(2)
    expect(factory.inventory.count).toEqual(2)
  })
  it('fullfils an order', () => {
    let receiver = jest.fn()

    factory.order(3, { receive: receiver })

    factory.step()
    factory.step()
    factory.step()
    expect(receiver).not.toHaveBeenCalled()
    factory.step()
    expect(receiver).toHaveBeenCalled()
  })
})
