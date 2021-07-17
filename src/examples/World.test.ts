import { world } from './World';

describe('hello', () => {
  it('runs without error', () => {
    expect(world.name).toMatch(/Writ/)
    expect(() => world.step()).not.toThrowError();
  })

  it('has people', () => {
    expect(world.people.lookup('Rippenwaterans').count).toEqual(3)
  })
})
