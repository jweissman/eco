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
  factory.product('Underwear', {});
  factory.product('Pants', {});
  // todo production diagrams!!
  factory.product('Outfit', { 'Pants': 1, 'Hat': 1, 'Shoes': 1 });
  factory.people.create('Operations Chief');
  factory.people.create('Engineer');
  factory.people.create('Plant Manager');

  factory.actions.create({ name: 'Spawn Worker', act: () => { factory.people.create(`Employee #${ids.next}`); } });
  export default factory;
