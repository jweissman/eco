import { Factory } from './Factory'

describe('Factory', () => {
  const factory = new Factory('Zep Step');
  beforeEach(() => {
    factory.reboot()
    factory.product('Fancy Space Shoes', {})
  })

  it('runs without error', () => {
    expect(factory.name).toMatch(/Step Factory/)
    expect(() => factory.step()).not.toThrowError();
  })

  it('produces', () => {
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(0)
    factory.order(3, 'Fancy Space Shoes', { receive: jest.fn() })
    // expect(factory.inventory.count).toEqual(0)
    // console.log(factory.resources.report)
    factory.step()

    // console.log(factory.resources.report)

    expect(factory.resources.count('Fancy Space Shoes')).toEqual(1)
    // expect(factory.inventory.count).toEqual(1)
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(2)
    // expect(factory.inventory.count).toEqual(2)
  })

  it('fullfils an order', () => {
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(0)
    let delivery = jest.fn()

    factory.order(3, 'Fancy Space Shoes', { receive: delivery })
    // factory.order(3, { receive: receiver })

    factory.step()
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(2)
    expect(delivery).not.toHaveBeenCalled()
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(3)
    factory.step()
    expect(delivery).toHaveBeenCalled()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(0)
  })

  it('defines an action', () => {
    expect(factory.actions.names).toContain('Order Fancy Space Shoes')
    let receiver = jest.fn()
    factory.send('Order Fancy Space Shoes', { count: 3, deliverTo: { receive: receiver } })
    factory.step()
    factory.step()
    factory.step()
    expect(receiver).not.toHaveBeenCalled()
    factory.step()
    expect(receiver).toHaveBeenCalled()
    // check event log now???
  })

  it('defines a policy', () => {
    expect(factory.policies.names).toContain('FIFO')
    expect(factory.policies.names).toContain('Round Robin')
  })
})
