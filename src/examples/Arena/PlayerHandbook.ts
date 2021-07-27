import { Sequence } from "../../collections";
import { Person } from "../../ecosphere/types";
import { randomInteger } from "../../ecosphere/utils/randomInteger";
import { sample } from "../../ecosphere/utils/sample";

export class PlayerHandbook {
  // okay, i guess give them the class as a perk... then each level up we can check + bump one of the class
  // nice to have: sick multi-classing
  static characterClasses: { [name: string]: { attributes: { [attr: string]: number; }; traits: string[]; }; } = {
    Fighter: { attributes: { hp: 20, 'bonus damage': 0, strength: 1, evasion: 1 }, traits: ['Combat Veteran'] },
    Knight: { attributes: { hp: 15, strength: 2, defense: 2, counter: 0 }, traits: ['Medic'] },
    Mage: { attributes: { 'magic damage': 2, 'magic defense': 1, 'holy defense': 0 }, traits: ['Focus'] },
    Cleric: { attributes: { heal: 1, 'holy damage': 0, 'holy defense': 0 }, traits: ['Holy Symbol'] },
    Monk: { attributes: { hp: 5, 'reflect': 0, defense: 1, 'magic defense': 0, 'hp per step': 0 }, traits: ['Faith'] },
    Thief: { attributes: { hp: 10, speed: 1, evasion: 1, counter: 1, 'gold per kill': 0 }, traits: ['Swiftness'] },
  };

  static attributes: { [attrGroup: string]: string[]; } = {
    // basic: [
    // ],
    common: [
      'max hp',
      'gold per day'
      // 'hp per day', // 'gold per day'
      // 'max hp', 'xp per victory', 'hp per day', 'gold per day', 'xp per li', 
    ],
    uncommon: [
      'xp per victory', // 'hp per day'
    ],
    rare: [
      'defense', 'evasion', 'crit damage',
      'xp per li', //'hp per step'
    ],
    epic: [
      // 'xp per day', 'gold per step',
      'strength', 'counter', 'crit chance', 'max chain',
    ],
    legendary: [
      'magic damage', 'holy damage', 'bonus damage',
      'reflect', 'heal', 'damage to all', 'chain chance',
    ],
  };

  // some perks benefits the effective value of a stat by adding % bonus per rank
  static perkBenefits: { [perk: string]: { [attr: string]: number; }; } = {
    'Cloaking Robe of Elvenkind': { 'magic damage': 0.05, 'magic defense': 0.5, evasion: 0.25, 'holy defense': 0.05 },
    'Combat Veteran': { strength: 0.05, defense: 0.05, counter: 0.05, evasion: 0.05, 'crit damage': 0.05, 'bonus damage': 0.05, },
    'Fine Raiment': { 'magic damage': 0.1, 'magic defense': 0.2, defense: 0.15 },
    'Holy Symbol': { 'holy damage': 0.5, 'holy defense': 0.15, heal: 0.1 },
    'Royal Armorer': { defense: 0.5, 'holy defense': 0.25, 'magic defense': 0.25, evasion: 0.25 },
    Barbarian: { 'bonus damage': 0.5, 'crit damage': 0.05, strength: 0.15, 'chain chance': 0.1, 'max chain': 0.1 },
    Brutality: { strength: 0.5, speed: 0.25, 'bonus damage': 0.25, 'max chain': 0.1 },
    Counterweight: { counter: 0.5, evasion: 0.1, 'crit damage': 0.05, 'max chain': 0.1 },
    Efferverscence: { regen: 0.25, counter: 0.25, 'crit damage': 0.25, 'holy defense': 0.25, 'max chain': 0.25 },
    Efficacious: { counter: 0.1, evasion: 0.1, 'bonus damage': 0.1, strength: 0.1, defense: 0.1, 'magic defense': 0.1, heal: 0.1 },
    Ethereal: { 'magic damage': 0.25, 'magic defense': 0.25, evasion: 0.5, defense: 0.25 },
    Faith: { 'holy damage': 0.25, 'holy defense': 0.5, heal: 0.25, regen: 0.1 },
    Finesse: { 'crit chance': 0.25, 'crit damage': 0.15, 'max chain': 0.05, 'chain chance': 0.1 },
    Precision: { speed: 0.1, 'crit damage': 0.25, evasion: 0.05 },
    Swiftness: { counter: 0.15, 'crit chance': 0.15, defense: 0.1 },
    Medic: { heal: 0.5, regen: 0.1 },
    Vitality: { strength: 0.1, speed: 0.25, regen: 0.5, heal: 0.1 },
    Whirlwind: { 'chain chance': 0.5, 'max chain': 0.5, 'damage to all': 0.5 },
    Focus: { 'magic damage': 0.5, 'magic defense': 0.25, 'holy damage': 0.1, 'holy defense': 0.05 },
  };

  static perks: { [perkGroup: string]: string[]; } = {
    common: [
      'Finesse',
      'Precision',
      'Medic',
      'Focus', // +10% to magic dmg per rank
    ],
    uncommon: [
      'Swiftness',
      'Faith',
      'Combat Veteran',
      'Efficacious', // small bonuses to many skills
    ],
    rare: [
      'Barbarian',
      'Brutality',
      'Ethereal',
      'Perspicuous',
      'Vitality', // boost to regen
    ],
    epic: [
      'Fine Raiment',
      'Royal Armorer',
      'Whirlwind', // bonus % to chain chance + damage to all
    ],
    legendary: [
      'Eternal Victory',
      'Perfectionist',
      'Effervescence', // decent bonuses to many skills
    ]
  };

  static generate(hero: Person, characterClass: string) {
    const baseStartingHp = 18;
    hero.traits.add(1, characterClass)
    hero.things.add(baseStartingHp, 'hp')
    hero.things.add(randomInteger(1,4), 'strength')
    hero.things.add(randomInteger(1,4), 'speed')
    hero.things.add(randomInteger(1,4), 'evasion')
    hero.things.add(randomInteger(1,4), 'counter')
    const template = this.characterClasses[characterClass];
    Object.keys(template.attributes).forEach(attr => {
      const amount = template.attributes[attr]
      hero.things.add(amount, attr)
    });
    (template.traits).forEach(trait => {
      hero.traits.add(1, trait)
    })
    hero.things.add(2000, 'xp per li')
    hero.things.add(5, 'xp per kill')
    hero.things.add(1, 'gold per day')
    hero.things.add(Math.floor(baseStartingHp * 0.75), 'hp per victory')
    hero.things.add(Math.floor(baseStartingHp * 1.2), 'max hp')
    this.levelUp(hero)
  }

  static levelUp(pc: Person) {
    const attributeBoosts: { [key: string]: number; } = {
      // basic: 13,
      common: 5, // randomInteger(3, 5),
      uncommon: 3, //randomInteger(2, 3),
      rare: 2, //randomInteger(1, 2),
      epic: 1, //randomInteger(0, 1),
      legendary: randomInteger(0, 1),
    };

    Object.keys(this.attributes).forEach(rarity => {
      for (let i = 0; i < attributeBoosts[rarity]; i++) {
        const levelAttr = sample(this.attributes[rarity]);
        const amount = 1; //randomInteger(1,2)
        pc.things.add(amount, levelAttr);
        console.log(`${levelAttr} improves by ${amount}`);
      }
    });

    const perkLevels: { [key: string]: number; } = {
      common: 3,
      uncommon: 5,
      rare: 8,
      epic: 13,
      legendary: 21,
    };

    Object.keys(this.perks).forEach(rarity => {
      if (pc.things.count('level') % perkLevels[rarity] === 0) {
        const perk = sample(this.perks[rarity]);
        console.log(`Gain a rank in ${perk} (${rarity})`);
        pc.traits.add(1, perk);
      }
    });

    // const classBonuses = PlayerHandbook.characterClasses
    // okay, for each triat
    pc.traits.list().forEach((trait) => {
      // console.log(trait)
      if (Object.keys(this.characterClasses).includes(trait.name)) {
      //   // it's a pc class
        Object.entries(this.characterClasses[trait.name].attributes).forEach(([attr, value]) => {
          const amount = randomInteger(1, Math.max(1,value))
          console.log(`${attr} improves by ${amount} (${trait.name})`);
          pc.things.add(amount, attr)
        })
      }
      // trait
    })
  }
}
