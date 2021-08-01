import { Sequence } from "../../collections";
import { Person } from "../../ecosphere/types";
import { randomInteger } from "../../ecosphere/utils/randomInteger";
import { sample } from "../../ecosphere/utils/sample";

export class MonsterManual {
  basicCreatures = {
    Fragment: { hp: 1, evasion: 95 },
    Light: { hp: 24, evasion: 1 },
    Fog: { hp: 26, evasion: 1, reflect: 10 },
    Aura: { hp: 28, evasion: 1, speed: 1 },
    Shadow: { hp: 38, evasion: 1, speed: 2 },
    Wisp: { hp: 40, strength: 1, speed: 1, evasion: 1 },
    Filament: { hp: 43, evasion: 1, speed: 1, counter: 1 },
    Voice: { hp: 53, evasion: 1, speed: 1, counter: 1, absorb: 1, defense: 1 },
    Nothing: { hp: 63, regen: 1, speed: 1, defense: 1, reflect: 1 },
  };

  challengingCreatures = {
    // 'Gray Mote': { hp: 8, 'magic damage': 3 },
    Fiendling: { hp: 12, 'holy damage': 1 }, //, speed: 1, counter: 1, evasion: 1 },
    Gremlin: { hp: 22, speed: 1, counter: 1 }, // evasion: 1 },
    Goblin: { hp: 30 },  //, 'magic damage': 1 },
    Kobold: { hp: 40, strength: 1 }, // speed: 2 },
    Orc: { hp: 48, strength: 1, speed: 1 }, //, counter: 1 },
  }

  uncommonCreatures = {
    Rat: { hp: 14, strength: 1, speed: 3, evasion: 1 },
    Bat: { hp: 18, strength: 2, speed: 2, evasion: 1, },
    Snake: { hp: 15, strength: 3, speed: 2, evasion: 2, },
    Blob: { hp: 24, strength: 2, speed: 1, evasion: 1 },
    Bear: { hp: 30, strength: 3, speed: 2, evasion: 1 },
    Ghost: { hp: 70, 'magic damage': 1, evasion: 1, counter: 1, speed: 1, absorb: 1, defense: 1 },
    Rogue: { hp: 74, strength: 2, speed: 1, 'bonus damage': 2, evasion: 2, counter: 2 },
    Troll: { hp: 83, strength: 2, speed: 2, regen: 1, counter: 1 },
    Giant: { hp: 95, strength: 2, speed: 2, defense: 1, absorb: 1 },
  };

  bosses = {
    Priest: { hp: 57, heal: 4, 'holy damage': 6, defense: 6, 'holy defense': 3, evasion: 2 },
    Vampire: { hp: 84, strength: 2, speed: 3, 'magic damage': 1, absorb: 2, evasion: 2 },
    Drake: { hp: 100, strength: 3, speed: 2, regen: 2, 'magic damage': 2, evasion: 2 },
    Lich: { hp: 140, strength: 4, speed: 6, defense: 6, 'magic damage': 6, evasion: 6 },
  };

  extraplanar = {
    Demon: { hp: 166, strength: 3, speed: 6, counter: 6, evasion: 6 },
    Angel: { hp: 199, evasion: 2, absorb: 2, regen: 2, counter: 9, defense: 9, 'magic defense': 2, 'holy damage': 9 },
    Archdemon: { hp: 366, absorb: 6, strength: 6, speed: 6, defense: 6, evasion: 6, 'magic damage': 6, 'holy damage': 16 },
    Dracolith: { hp: 247, strength: 7, 'magic damage': 7, speed: 7, defense: 7, evasion: 7, counter: 7 },
    Archangel: { hp: 299, absorb: 9, strength: 9, speed: 9, defense: 9, evasion: 9, 'magic defense': 9, 'holy defense': 9, 'holy damage': 99 },

    'Brutal Light': { hp: 123, speed: 2, strength: 6, 'bonus damage': 5, evasion: 4 },
    'Floating Sigil': { hp: 234, speed: 10, defense: 10, counter: 10 },
    'Astral Filament': { hp: 1234, strength: 15, absorb: 10, evasion: 5, counter: 1, regen: 1 },
    'Essence Sphere': { hp: 12345, 'magic damage': 12, 'holy damage': 12, 'bonus damage': 12 },
  };

  dragons = {
    // ...and dragons :)
    'Green Dragon': { hp: 900, strength: 5, speed: 8, defense: 4, 'magic damage': 16, evasion: 24 },
    'Red Dragon': { hp: 1100, strength: 7, speed: 9, defense: 14, 'magic damage': 26, evasion: 34 },
    'Blue Dragon': { hp: 2100, strength: 9, speed: 11, defense: 24, 'magic damage': 36, evasion: 44 },
    'Golden Dragon': { hp: 2400, strength: 11, speed: 15, defense: 34, 'magic damage': 66, evasion: 55 },
    'Black Dragon': { hp: 2900, strength: 11, speed: 15, defense: 34, 'magic damage': 66, evasion: 55 },
    'Primordial Dragon': { hp: 3919, strength: 30, speed: 30, defense: 30, 'magic damage': 30, evasion: 30 },
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
    ...this.uncommonCreatures,
    ...this.challengingCreatures,
    ...this.rareCreatures,
    ...this.bosses,
  };

  basicSubtypes = {
    Hostile: { strength: 1 }, Intimidating: { strength: 2 },
    Nimble: { speed: 1 }, Quick: { speed: 2 },
    Timid: { evasion: 1 }, Spry: { evasion: 2 }, Dancing: { evasion: 3 },
    Vigilant: { regen: 1 }, Relentless: { regen: 2 },
    Armored: { defense: 1 }, Hardened: { defense: 2 },
    Benevolent: { heal: 1 }, Protective: { heal: 2 },
    Snarling: { counter: 1 },

    Emboldened: { 'bonus damage': 1 },
    Floating: { evasion: 1, speed: 1 },
    Crystalline: { reflect: 1 },
    Glinting: { reflect: 2 },
    Mobile: { speed: 1 },
    Coldsnap: { speed: 1, regen: 1 },
    Blinding: { reflect: 1, absorb: 1 },
    Noxious: { defense: 1, counter: 1, absorb: 1 },
  };

  rareSubtypes: { [type: string]: { [attr: string]: number; }; } = {
    Voracious: { hp: 5, strength: 1, speed: 1 },
    Vicious: { hp: 10, strength: 1, defense: 1 },
    Vexatious: { hp: 15, counter: 1, evasion: 1 },
    Arrogant: { hp: -5, evasion: 1, counter: 1, speed: 1 },
    Querulous: { hp: -10, strength: 1, speed: 1, regen: 1, absorb: 1, defense: 1 },

    Adventurous: { hp: 5, 'bonus damage': 2 },
    Questing: { hp: 10, 'bonus damage': 3 },

    Silvered: { reflect: 2 }, Mirrored: { reflect: 3 },
    Aggressive: { strength: 3 }, Dominating: { strength: 4 },
    Swift: { speed: 3 }, Accelerated: { speed: 4 },
    Elusive: { evasion: 4 }, Reluctant: { evasion: 5 }, Hidden: { evasion: 6 }, Invisible: { evasion: 8 }, Imperceptible: { evasion: 15 },
    Regrowing: { regen: 3 }, Hydra: { regen: 4 },
    Fortified: { defense: 3 },
    Angelic: { heal: 3, 'holy damage': 2 },
    Prismatic: { reflect: 3, absorb: 2, evasion: 1 },
    // Hardened: { defense: 3, strength: 1, evasion: 1 },
    Pugnacious: { 'bonus damage': 1, evasion: 1, counter: 1 },

    // Elusive: { evasion: 1, defense: 1, regen: 1 },
    Augmented: { strength: 1, 'magic damage': 1, 'bonus damage': 1 },
    Skillful: { defense: 1, strength: 1, speed: 1, evasion: 1, counter: 1 },
    Skeletal: { hp: -1, evasion: 2, absorb: 1, regen: 1 },
    Undead: { hp: -1, strength: 1, regen: 1, absorb: 1, speed: 1, evasion: 1 },
    Zombie: { hp: -2, evasion: 1, regen: 2, strength: 1 },
    Favored: { hp: 1, strength: 2, speed: 2, 'magic damage': 1, regen: 1, evasion: 1 },
    Fiendish: { hp: 2, strength: 3, speed: 3, defense: 1, regen: 1, evasion: 2 },
    Fierce: { hp: 2, strength: 4, speed: 4, defense: 2, absorb: 2, evasion: 3, },
    Opalescent: { hp: 2, reflect: 4, absorb: 2, evasion: 2, counter: 2, heal: 2 },
    Cruel: { hp: 3, strength: 5, speed: 5, 'magic damage': 3, 'bonus damage': 2, absorb: 3, regen: 1, evasion: 4 },

    Vortex: { hp: 1, reflect: 10, absorb: 10, evade: 50, counter: 50 },
    Shadow: { hp: 2, 'magic damage': 20, absorb: 20, evade: 20, counter: 20 },
    Luminous: { hp: 3, 'holy damage': 20, absorb: 20, evade: 20, counter: 20 },
    Defiant: { hp: 1, 'bonus damage': 20, absorb: 20, evade: 20, counter: 20 },
    Devious: { hp: 2, evasion: 2, counter: 20, absorb: 20 },
    Draconic: { hp: 3, 'magic damage': 1, counter: 20, absorb: 20 },
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
    // Obsidian: { hp: 15, defense: 1, speed: 2, evasion: 1 },
    // Provocative: { hp: 50, defense: 5, evasion: 3, 'bonus damage': 4, 'magic damage': 3, speed: 3 },
    // Challenging: { hp: 150, defense: 20, strength: 2, regen: 1, speed: 1, 'bonus damage': 5, evasion: 1 }
  };
  monsterIds = new Sequence();

  difficulty = 1; // global multiplier on monster stats

  generateBasicMonster(creature: Person) {
    let base = sample(Object.keys(this.basicCreatures))
    let type = randomInteger(0, 20) > 16 ? sample(Object.keys(this.basicSubtypes)) : 'Common';
    // let type = 'Common'
    // creature.name = `${type} ${base} (${this.monsterIds.next})`;
    const name = type === 'Common' ? base : [type, base].join(' ');
    creature.name = name
    // creature.things.add(5 + Math.floor(0.05 * cr * cr), 'hp')
    const crFactor = 1
    Object.entries(this.bestiary[base]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
    Object.entries(this.subtypes[type]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
  }

  generate(creature: Person, cr: number = 1) {
    if (cr <= 6) { this.generateBasicMonster(creature); return }
    // console.log("generate monster with cr " + cr);
    // const simpleCreatures = ['Snake', 'Blob', 'Bat', 'Wisp']
    let base = sample(Object.keys(this.challengingCreatures)) //cr <= 10 ? sample(Object.keys(this.basicCreatures)) : sample(Object.keys(this.challengingCreatures));


    let type = randomInteger(0, 20) > 16 ? sample(Object.keys(this.basicSubtypes)) : 'Common';

    // all subtypes..
    if (cr >= 20 && randomInteger(0, 20) > 19) { type = sample(Object.keys(this.subtypes)); }

    // all bases
    if (cr >= 25 && randomInteger(0, 20) > 19) { base = sample(Object.keys(this.bestiary)); }

    const name = type === 'Common' ? base : [type, base].join(' ');
    creature.name = `${name} (${this.monsterIds.next})`;
    const adjustedCr = 0.0015 * cr * cr;
    // creature.things.add(1 + cr + Math.floor(100 * adjustedCr), 'hp')

    const crFactor = this.difficulty + adjustedCr * 2;
    Object.entries(this.bestiary[base]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
    Object.entries(this.subtypes[type]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * crFactor), thing));
    creature.things.add(creature.things.count('hp'), 'max hp');
    if (cr >= 15) {
      creature.things.add(randomInteger(1, cr/2), 'defense');
      creature.things.add(randomInteger(1, cr/2), 'strength');
    }
    if (cr >= 25) {
      creature.things.add(randomInteger(1, cr/2), 'evasion');
      creature.things.add(randomInteger(1, cr/2), 'counter');
    }
    if (cr >= 35) {
      creature.things.add(randomInteger(1, cr/2), 'magic damage');
      creature.things.add(randomInteger(1, cr/2), 'chain chance');
    }
    if (cr >= 45) {
      creature.things.add(randomInteger(1, cr/2), 'holy damage');
      creature.things.add(randomInteger(1, cr/2), 'reflect');
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
