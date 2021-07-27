import { Sequence } from "../../collections";
import { Person } from "../../ecosphere/types";
import { randomInteger } from "../../ecosphere/utils/randomInteger";
import { sample } from "../../ecosphere/utils/sample";

export class MonsterManual {
  basicCreatures = {
    'Floating Light': { hp: 8, evasion: 1, speed: 2 },
    Wisp: { hp: 10, strength: 1, speed: 1, evasion: 1 },
    Bat: { hp: 18, speed: 2, evasion: 1 },
    Snake: { hp: 15, speed: 2, evasion: 2, },
    Blob: { hp: 24, strength: 2, speed: 1 },
  };

  challengingCreatures = {
    Gremlin: { hp: 32, speed: 1, counter: 1, evasion: 1 },
    Goblin: { hp: 40 },
    Kobold: { hp: 50, strength: 1, speed: 2 },
    Orc: { hp: 64, strength: 2, speed: 1, counter: 1 },
    Ghost: { hp: 110, 'magic damage': 1, evasion: 1, counter: 1, speed: 1, absorb: 1, defense: 1 },
    Rogue: { hp: 125, strength: 2, speed: 1, 'bonus damage': 2, evasion: 2, counter: 2 },
    Troll: { hp: 138, strength: 2, speed: 2, regen: 1, counter: 1 },
    Giant: { hp: 238, strength: 2, speed: 2, defense: 1, absorb: 1 },
  };

  bosses = {
    Priest: { hp: 140, heal: 4, 'holy damage': 6, defense: 6, 'holy defense': 3, evasion: 2 },
    Vampire: { hp: 280, strength: 2, speed: 3, 'magic damage': 1, absorb: 2, evasion: 2 },
    Drake: { hp: 400, strength: 3, speed: 2, regen: 2, 'magic damage': 2, evasion: 2 },
    Lich: { hp: 540, strength: 4, speed: 6, defense: 6, 'magic damage': 6, evasion: 6 },
  };

  extraplanar = {
    Demon: { hp: 366, strength: 3, speed: 6, counter: 6, evasion: 6 },
    Angel: { hp: 299, evasion: 2, absorb: 2, regen: 2, counter: 9, defense: 9, 'magic defense': 2, 'holy damage': 9 },
    Archdemon: { hp: 666, absorb: 6, strength: 6, speed: 6, defense: 6, evasion: 6, 'magic damage': 6, 'holy damage': 16 },
    Dracolith: { hp: 747, strength: 7, 'magic damage': 7, speed: 7, defense: 7, evasion: 7, counter: 7 },
    Archangel: { hp: 999, absorb: 9, strength: 9, speed: 9, defense: 9, evasion: 9, 'magic defense': 9, 'holy defense': 9, 'holy damage': 99 },

    'Floating Sigil': { hp: 1234, speed: 10, defense: 10, counter: 10 },
    'Astral Filament': { hp: 12345, strength: 15, absorb: 10, evasion: 5, counter: 1, regen: 1 },
    'Essence Sphere': { hp: 123456, 'magic damage': 12, 'holy damage': 12, 'bonus damage': 12 },
  };

  dragons = {
    // ...and dragons :)
    'Green Dragon': { hp: 900, strength: 5, speed: 8, defense: 4, 'magic damage': 16, evasion: 24 },
    'Red Dragon': { hp: 1900, strength: 7, speed: 9, defense: 14, 'magic damage': 26, evasion: 34 },
    'Blue Dragon': { hp: 2900, strength: 9, speed: 11, defense: 24, 'magic damage': 36, evasion: 44 },
    'Golden Dragon': { hp: 3900, strength: 11, speed: 15, defense: 34, 'magic damage': 66, evasion: 55 },
    'Black Dragon': { hp: 5900, strength: 11, speed: 15, defense: 34, 'magic damage': 66, evasion: 55 },
    'Primordial Dragon': { hp: 395919, strength: 30, speed: 30, defense: 30, 'magic damage': 30, evasion: 30 },
  };

  rareCreatures = {
    'Eldritch Lich': { hp: 2500, strength: 8, speed: 6, defense: 4, 'magic damage': 13, evasion: 5 },
    'Primordial Vampire': { hp: 3800, strength: 3, speed: 10, defense: 10, 'holy defense': 10, 'magic defense': 10, 'magic damage': 3, evasion: 3, absorb: 4 },
    Leviathan: { hp: 9999, strength: 10, speed: 10, defense: 25, evasion: 25, counter: 25 },
    ...this.extraplanar,
    ...this.dragons
  };


  bestiary: { [monster: string]: { [attr: string]: number; }; } = {
    ...this.basicCreatures,
    ...this.challengingCreatures,
    ...this.rareCreatures,
    ...this.bosses,
  };

  basicSubtypes = {
    Hostile: { strength: 1 }, Intimidating: { strength: 2 },
    Nimble: { speed: 1 }, Quick: { speed: 2 },
    Spry: { evasion: 1 }, Elusive: { evasion: 2 },
    Vigilant: { regen: 1 }, Relentless: { regen: 2 },
    Armored: { defense: 1 }, Hardened: { defense: 2 },
    Benevolent: { heal: 1 }, Protective: { heal: 2 },
    Emboldened: { 'bonus damage': 1 },
    Snarling: { counter: 1 },

    Vexatious: { hp: 5, counter: 1, evasion: 1 },
    Vicious: { hp: 10, strength: 1, defense: 1 },
  };

  rareSubtypes: { [type: string]: { [attr: string]: number; }; } = {
    Silvered: { reflect: 1 }, Mirrored: { reflect: 2 },
    Aggressive: { strength: 3 }, Dominating: { strength: 4 },
    Swift: { speed: 3 }, Accelerated: { speed: 4 },
    Hidden: { evasion: 3 }, Invisible: { evasion: 4 },
    Resurrecting: { regen: 3 }, Regenerating: { regen: 4 },
    Fortified: { defense: 3 },
    Angelic: { heal: 3 },
    Prismatic: { reflect: 3 },
    // Hardened: { defense: 3, strength: 1, evasion: 1 },
    Pugnacious: { 'bonus damage': 1, evasion: 1, counter: 1 },

    // Elusive: { evasion: 1, defense: 1, regen: 1 },
    Augmented: { strength: 1, 'magic damage': 1, 'bonus damage': 1 },
    Skillful: { defense: 1, strength: 1, speed: 1, evasion: 1, counter: 1 },
    Skeletal: { hp: -5, evasion: 2, absorb: 1, regen: 1 },
    Undead: { hp: -10, strength: 1, regen: 1, absorb: 1, speed: 1, evasion: 1 },
    Zombie: { hp: -20, evasion: 1, regen: 2, strength: 1 },
    Favored: { hp: 10, strength: 2, speed: 2, 'magic damage': 1, regen: 1, evasion: 1 },
    Fiendish: { hp: 20, strength: 3, speed: 3, defense: 1, regen: 1, evasion: 2 },
    Fierce: { hp: 30, strength: 4, speed: 4, defense: 2, absorb: 2, evasion: 3, },
    Opalescent: { hp: 40, reflect: 4, absorb: 2, evasion: 2, counter: 2, heal: 2 },
    Cruel: { hp: 50, strength: 5, speed: 5, 'magic damage': 3, 'bonus damage': 2, absorb: 3, regen: 1, evasion: 4 },
  };

  subtypes: { [type: string]: { [attr: string]: number; }; } = {
    Common: {},
    Evasive: { evasion: 3, counter: 2 },
    Retaliatory: { defense: 1, counter: 2 },
    Inspired: { 'bonus damage': 1 },
    Infused: { 'bonus damage': 2, 'magic damage': 1 },
    Radiant: { 'holy damage': 1 },
    Resplendent: { 'holy damage': 2, strength: 1, speed: 1 },
    Heavy: { strength: 2, defense: 2 },
    Titanic: { strength: 4, defense: 2 },
    Unholy: { 'magic damage': 1, 'holy defense': 1 },
    Blessed: { 'holy damage': 1, absorb: 1 },
    Adept: { evasion: 1, counter: 1, defense: 1, strength: 1 },
    ...this.basicSubtypes,
    ...this.rareSubtypes,
  };


  perks: { [type: string]: { [attr: string]: number; }; } = {
    Piercing: { hp: 15, strength: 1, defense: 1, evasion: 1, 'bonus damage': 1, },
    Blessed: { hp: 15, absorb: 1, defense: 1, regen: 1, 'holy damage': 1, },
    Enchanted: { hp: 15, defense: 1, evasion: 1 },
    Clockwork: { hp: 15, defense: 1, speed: 2, evasion: 1 },
    Phantasmal: { hp: 25, defense: 1, evasion: 4 },
    Cosmic: { hp: 30, defense: 3, evasion: 3, strength: 3 },
    Imperious: { hp: 40, defense: 4, 'magic damage': 3, speed: 3 },
    // Provocative: { hp: 50, defense: 5, evasion: 3, 'bonus damage': 4, 'magic damage': 3, speed: 3 },
    // Challenging: { hp: 150, defense: 20, strength: 2, regen: 1, speed: 1, 'bonus damage': 5, evasion: 1 }
  };
  monsterIds = new Sequence();

  difficulty = 1; // global multiplier on monster stats

  generate(creature: Person, cr: number = 1) {
    // console.log("generate monster with cr " + cr);
    // const simpleCreatures = ['Snake', 'Blob', 'Bat', 'Wisp']
    let base = cr <= 20 ? sample(Object.keys(this.basicCreatures)) : sample(Object.keys(this.challengingCreatures));


    let type = randomInteger(0, 20) > 16 ? sample(Object.keys(this.basicSubtypes)) : 'Common';

    // all subtypes..
    if (cr >= 30 && randomInteger(0, 20) > 19) { type = sample(Object.keys(this.subtypes)); }

    // all bases
    if (cr >= 45 && randomInteger(0, 20) > 19) { base = sample(Object.keys(this.bestiary)); }

    const name = type === 'Common' ? base : [type, base].join(' ');
    creature.name = `${name} (${this.monsterIds.next})`;
    const crFactor = this.difficulty + 0.02 * cr;
    Object.entries(this.bestiary[base]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
    Object.entries(this.subtypes[type]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
    creature.things.add(creature.things.count('hp'), 'max hp');
    if (cr >= 5) {
      creature.things.add(randomInteger(1, cr), 'defense');
      creature.things.add(randomInteger(1, cr), 'strength');
    }
    if (cr >= 8) {
      creature.things.add(randomInteger(1, cr), 'evasion');
      creature.things.add(randomInteger(1, cr), 'counter');
    }
  }

  generateBoss(creature: Person, cr: number = 1) {
    const base = sample(Object.keys(this.bosses));
    const type = sample(Object.keys(this.rareSubtypes));
    const perk = sample(Object.keys(this.perks));
    const name = [perk, type, base].join(' ');
    creature.name = name; // `${name} (${this.monsterIds.next})`
    const crFactor = this.difficulty + 0.01 * cr;
    Object.entries(this.bestiary[base]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
    Object.entries(this.rareSubtypes[type]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
    Object.entries(this.perks[perk]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
    creature.things.add(creature.things.count('hp'), 'max hp');
  }
}
