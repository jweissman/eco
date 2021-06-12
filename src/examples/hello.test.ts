import { world } from './hello';
describe('hello', () => {
  it('runs without error', () => {
    expect(world.name).toMatch(/Writ/)
    expect(() => world.step()).not.toThrowError();
  })
})
