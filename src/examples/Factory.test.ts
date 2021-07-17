import { Factory } from './Factory'

describe('Factory', () => {
  const factory = new Factory('Zep Step');
  beforeEach(() => {
    factory.reboot()
    factory.workers.create('A Worker')
    factory.choose('FIFO')
    factory.product('Fancy Space Shoes', {})
    factory.product('Fancy Space Helmet', {})
  })

  it('runs without error', () => {
    expect(factory.name).toMatch(/Step Factory/)
    expect(() => factory.step()).not.toThrowError();
  })

  it('produces', () => {
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(0)
    factory.order(3, 'Fancy Space Shoes', { receive: jest.fn() })
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(1)
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(2)
  })

  it('fullfils an order', () => {
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(0)
    let delivery = jest.fn()
    factory.order(3, 'Fancy Space Shoes', { receive: delivery })
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
    factory.choose('Round Robin')
    let receiver = jest.fn()
    factory.send('Order Fancy Space Shoes', { count: 3, deliverTo: { receive: receiver } })
    factory.send('Order Fancy Space Helmet', { count: 3, deliverTo: { receive: receiver } })
    factory.step()
    factory.step()
    factory.step()
    expect(receiver).not.toHaveBeenCalled()
    factory.step()
    expect(receiver).toHaveBeenCalled()
  })
})
