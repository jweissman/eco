import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Model from './ecosphere/Model';

const model = new Model('Space Station')
model.element('Power')
model.element('Air')
model.individual('Zedediah')
model.add(100, 'Power')
model.add(100, 'Air')
model.evolve(({ remove }) => remove(1, 'Air'));

test('renders model name', () => {
  render(<App model={model} />);
  const name = screen.getByText(/Space Station/i);
  expect(name).toBeInTheDocument();
});

test('renders element inventories', () => {
  render(<App model={model} />);
  const power = screen.getByText(/Power: 100/i);
  expect(power).toBeInTheDocument();
  const air = screen.getByText(/Air: 100/i);
  expect(air).toBeInTheDocument();
});

test('renders individuals', () => {
  render(<App model={model} />);
  const individuals = screen.getByText(/Zed/i);
  expect(individuals).toBeInTheDocument();
});

it('steps through time', async () => {
  render(<App model={model} />);

  const air = screen.getByText(/Air: 100/i);
  expect(air).toBeInTheDocument();

  const stepButton = await screen.findByText("Step")
  fireEvent.click(stepButton);

  const lessAir = screen.getByText(/Air: 99/i);
  expect(lessAir).toBeInTheDocument();

})
