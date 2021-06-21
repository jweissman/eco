import { Factory } from './Factory'

describe('hello', () => {
  const factory = new Factory('Fancy Space Shoes', {});
  beforeEach(factory.reboot)

  it('runs without error', () => {
    expect(factory.name).toMatch(/Shoes Factory/)
    expect(() => factory.step()).not.toThrowError();
  })
  it('produces', () => {
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(0)
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(1)
    factory.step()
    expect(factory.resources.count('Fancy Space Shoes')).toEqual(2)
  })
})
