import { Sequence } from '../collections';
import { Factory } from './Factory';

const ids = new Sequence()
  const factory = new Factory('Zep');
  factory.reboot();
  factory.product('Soles', {});
  factory.product('Laces', {});
  factory.product('Socks', {});
  factory.product('Shoes', { 'Soles': 2, 'Laces': 2 });
  factory.product('Hat', {});
  factory.product('Belt', {});
  factory.product('Underwear', {});
  factory.product('Pants', {});
  factory.product('Outfit', { 'Pants': 1, 'Belt': 1, 'Hat': 1, 'Socks': 1, 'Shoes': 1 });
  const managers = factory.people.create('Management')
  managers.create('Operations Chief');
  managers.create('Plant Manager');
  // factory.workers.create('Engineer')
  factory.machines.create('Robot')

  factory.actions.create({ name: 'Spawn Worker', act: () => { factory.workers.create(`Employee #${ids.next}`); } });
  export default factory;
