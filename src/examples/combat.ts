import { boundMethod } from "autobind-decorator"
import { Sequence } from "../collections"
import { Community } from "../ecosphere/Community"
import Model from "../ecosphere/Model"
import { EvolvingStocks, Person } from "../ecosphere/types"
import { randomInteger } from "../ecosphere/utils/randomInteger"
import { sample } from "../ecosphere/utils/sample"

class PlayerHandbook {
  static levelUp(pc: Person) {
    pc.things.add(1, 'level')
    const commonAttrs = [
      'max hp', 'xp per victory', 'hp per day', 'gold per day', 'xp per li', 
    ]
    for (let i=0; i<13; i++) {
      const levelAttr = sample(commonAttrs)
      console.log(`${levelAttr} improves`)
      pc.things.add(1, levelAttr)
    }

    const uncommonAttrs = [
      'counter', 'evasion', 'xp per kill', 'gold per kill',
      'gold per victory', 'xp per day', 
      'hp per li', 'hp per step', 
      'xp per encounter'
    ]
    for (let i=0; i<8; i++) {
      const levelAttr = sample(uncommonAttrs)
      console.log(`${levelAttr} improves`)
      pc.things.add(1, levelAttr)
    }

    const rareAttrs = [
      'strength', 'defense', 'crit chance', 'crit damage',
      'hp per kill', 'hp per victory',
      'xp per step', 'gold per li',
      'gold per encounter'
    ]
    for (let i=0; i<2; i++) {
      const levelAttr = sample(rareAttrs)
      console.log(`${levelAttr} improves`)
      pc.things.add(1, levelAttr)
    }

    if (pc.things.count('level') % 2 === 0) {
      const legendaryAttrs = [
        'speed', 'absorb', 'regen', 'bonus damage', 'magic damage',
        'gold per step', 'xp per turn', 'holy damage', 'heal',
        'damage to all', 'hp per encounter',
        'magic defense', 'holy defense',
      ]
      for (let i=0; i<1; i++) {
        const levelAttr = sample(legendaryAttrs)
        console.log(`${levelAttr} improves`)
        pc.things.add(1, levelAttr)
      }
    }

    if (pc.things.count('level') % 3 === 0) {
      const perks = [
        'Finesse', // +25% to crit chance per rank
        'Precision', // bonus % to crit dmg
        'Barbarian', // +15% to bonus dmg per rank
        'Brutality', // +10% to base dmg per rank
        'Focus', // +10% to magic dmg per rank
        'Faith', // +10% to holy dmg/def per rank
        'Swiftness', // +% to counter
        'Ethereal', // small dodge bonuses (+15% to evade per rank, +10% to defense)
        'Perspicuous', // bonus pers for xp (+10% per rank)
      ]
      const perk = sample(perks)
      console.log(`Gain rank in ${perk}`)
      pc.traits.add(1, perk)
    }

    if (pc.things.count('level') % 4 === 0) {
      const rarePerks = [
        'Perfectionist', // bonus pers for xp/hp/gold (+25% per rank)
        'Whirlwind', // bonus % to chain chance
        'Fine Raiment', // bonus % to magic defense
        'Combat Veteran', // + small % to lots of battle-related stats
        'Royal Armorer', // bonus % to defense 
        'Eternal Victory', // resurrection charge
        'Medic', // bonus to healing
        // 'Cloaking Robe of Elvenkind', // large % bonus to evade
        // 'Vampirism', // bonus to absorb?
        // 'Noble', // like a saga with different effects per degree... 
      ]
      const perk = sample(rarePerks)
      console.log(`Gain rank in ${perk} (rare!)`)
      pc.traits.add(1, perk)
    }
  }
}

class MonsterManual {
  basicCreatures = {
    'Floating Light': { hp: 25, evasion: 1, speed: 2 },
    Wisp: { hp: 30, strength: 1, speed: 1, evasion: 1 },
    Bat: { hp: 38, speed: 2, evasion: 1 },
    Snake: { hp: 45, speed: 2, evasion: 2,  },
    Blob: { hp: 54, strength: 2, speed: 1 },
  }

  challengingCreatures = {
    Skeleton: { hp: 68, evasion: 2, absorb: 1, regen: 1 },
    Zombie: { hp: 72, evasion: 1, regen: 1, strength: 1 },
    Kobold: { hp: 80, strength: 1, speed: 2 },
    Orc: { hp: 94, strength: 2, speed: 1, counter: 1 },
    Ghost: { hp: 160, 'magic damage': 1, evasion: 1, counter: 1, speed: 1, absorb: 1, defense: 1 },
    Rogue: { hp: 165, strength: 2, speed: 1, 'bonus damage': 2, evasion: 2, counter: 2 },
    Troll: { hp: 268, strength: 2, speed: 2, regen: 1, counter: 1 },
  }

  bosses = {
    Vampire: { hp: 280, strength: 2, speed: 3, 'magic damage': 1, absorb: 2, evasion: 2  },
    Drake: { hp: 400, strength: 3, speed: 2, regen: 2, 'magic damage': 2, evasion: 2 },
    Lich: { hp: 540, strength: 4, speed: 6, defense: 6, 'magic damage': 6, evasion: 6 },
    
  }

  extraplanar = {
    Demon: { hp: 366, strength: 3, speed: 6, counter: 6, evasion: 6 },
    Angel: { hp: 299, evasion: 2, absorb: 2, regen: 2, counter: 9, defense: 9, 'magic defense': 2, 'holy damage': 9 },
    Archdemon: { hp: 666, absorb: 6, strength: 6, speed: 6, defense: 6, evasion: 6, 'magic damage': 6, 'holy damage': 16 },
    Dracolith: { hp: 747, strength: 7, 'magic damage': 7, speed: 7, defense: 7, evasion: 7, counter: 7 },
    Archangel: { hp: 999, absorb: 9, strength: 9, speed: 9, defense: 9, evasion: 9, 'magic defense': 9, 'holy defense': 9, 'holy damage': 99 },

    'Floating Sigil': { hp: 1234, speed: 10, defense: 10, counter: 10 },
    'Astral Filament': { hp: 12345, strength: 15, absorb: 10, evasion: 5, counter: 1, regen: 1 },
    'Essence Sphere': { hp: 123456, 'magic damage': 12, 'holy damage': 12, 'bonus damage': 12 },
  }

  dragons = {
    // ...and dragons :)
    'Green Dragon': { hp: 900, strength: 5, speed: 8, defense: 4, 'magic damage': 16, evasion: 24 },
    'Red Dragon': { hp: 1900, strength: 7, speed: 9, defense: 14, 'magic damage': 26, evasion: 34 },
    'Blue Dragon': { hp: 2900, strength: 9, speed: 11, defense: 24, 'magic damage': 36, evasion: 44 },
    'Golden Dragon': { hp: 3900, strength: 11, speed: 15, defense: 34, 'magic damage': 66, evasion: 55 },
    'Black Dragon': { hp: 5900, strength: 11, speed: 15, defense: 34, 'magic damage': 66, evasion: 55 },
    'Primordial Dragon': { hp: 395919, strength: 30, speed: 30, defense: 30, 'magic damage': 30, evasion: 30 },
  }

  rareCreatures = {
    'Eldritch Lich': { hp: 2500, strength: 8, speed: 6, defense: 4, 'magic damage': 13, evasion: 5 },
    'Primordial Vampire': { hp: 3800, strength: 3, speed: 10, defense: 10, 'holy defense': 10, 'magic defense': 10, 'magic damage': 3, evasion: 3, absorb: 4 },
    Leviathan: { hp: 9999, strength: 10, speed: 10, defense: 25, evasion: 25, counter: 25 },
    ...this.extraplanar,
    ...this.dragons
  }


  bestiary: { [monster: string]: { [attr: string]: number }} = {
    ...this.basicCreatures,
    ...this.challengingCreatures,
    ...this.rareCreatures,
    ...this.bosses,
  }

  basicSubtypes =  {
    Hostile: { strength: 1 },
    Intimidating: { strength: 2 },
    Aggressive: { strength: 3 },
    Dominating: { strength: 4 },
    Nimble: { speed: 1 },
    Quick: { speed: 2 },
    Swift: { speed: 3 },
    Accelerated: { speed: 4 },
    Hidden: { evasion: 5 },
    Invisible: { evasion: 6 },
    Relentless: { regen: 1 },
    Returning: { regen: 2 },
    Vital: { regen: 3 },
    Armored: { defense: 1 },
  }

  rareSubtypes: { [type: string]: { [attr: string]: number }} = {
    Hardened: { defense: 3, strength: 1, evasion: 1 },
    Emboldened: { 'bonus damage': 1, evasion: 1, counter: 1 },
    Elusive: { evasion: 1, defense: 1, regen: 1 },
    Augmented: { strength: 1, 'magic damage': 1, 'bonus damage': 1 },
    Skillful: { strength: 1, speed: 2, evasion: 2, counter: 2  },
    Undead: { strength: 1, regen: 1, absorb: 1, speed: 1, evasion: 1 },
    Favored: { hp: 10, strength: 2, speed: 2, 'magic damage': 1, regen: 1, evasion: 1 },
    Fiendish: { hp: 20, strength: 3, speed: 3, defense: 1, regen: 1, evasion: 2 },
    Fierce: { hp: 30, strength: 4, speed: 4, defense: 2, absorb: 2, evasion: 3, },
    Cruel: { hp: 50, strength: 5, speed: 5, 'magic damage': 3, 'bonus damage': 2, absorb: 3, regen: 1, evasion: 4 },
  }
  subtypes: { [type: string]: { [attr: string]: number }} = {
    Common: { }, // defense: 1, strength: 1, speed: 1, evasion: 1, counter: 1 }, //strength: 1, speed: 1, evasion: 1 },
    
    Evasive: { evasion: 3, counter: 2 },
    Retaliatory: { defense: 1, counter: 2 },
    Infused: { 'bonus damage': 1 },
    Radiant: { 'holy damage': 1 },
    Resplendent: { 'holy damage': 2, strength: 1, speed: 1 },
    Heavy: { strength: 2, defense: 2 },
    Titanic: { strength: 4, defense: 2 },
    Unholy: { 'magic damage': 1, 'holy defense': 1 },
    Blessed: { 'holy damage': 1, absorb: 1 },
    Adept: { evasion: 1, counter: 1, defense: 1, strength: 1 },
    ...this.basicSubtypes,
    ...this.rareSubtypes,
  }


  perks: { [type: string]: { [attr: string]: number }} = {
    Piercing: { hp: 15, strength: 1, defense: 1, evasion: 1, 'bonus damage': 1, },
    Blessed: { hp: 15, absorb: 1, defense: 1, regen: 1, 'holy damage': 1, },
    Enchanted: { hp: 15, defense: 1, evasion: 1 },
    Clockwork: { hp: 15, defense: 1, speed: 2, evasion: 1 },
    Phantasmal: { hp: 25, defense: 1, evasion: 4 }, //, speed: 4, evasion: 8 }
    Cosmic: { hp: 30, defense: 3, evasion: 3, strength: 3 },
    Imperious: { hp: 40, defense: 4, 'magic damage': 3, speed: 3 },
    Provocative: { hp: 50, defense: 5, evasion: 3, 'bonus damage': 4, 'magic damage': 3, speed: 3 },
    Challenging: { hp: 150, defense: 20, strength: 2, regen: 1, speed: 1, 'bonus damage': 5, evasion: 1 }
  }
  monsterIds = new Sequence()

  difficulty = 1 // global multiplier on monster stats
  generate(creature: Person, li: number = 0) {
    // const simpleCreatures = ['Snake', 'Blob', 'Bat', 'Wisp']
    let base = li === 0 ? sample(Object.keys(this.basicCreatures)) : sample(Object.keys(this.challengingCreatures))
    if (li >= 5 && randomInteger(0,20) > 18) { base = sample(Object.keys(this.bestiary)) }
    let type = randomInteger(0,20) > 6 ? sample(Object.keys(this.basicSubtypes)) : 'Common'
    if (li >= 5 && randomInteger(0,20) > 18) { type = sample(Object.keys(this.subtypes)) }
    const name = type === 'Common' ? base : [type, base ].join(' ')
    creature.name = `${name} (${this.monsterIds.next})`
    const liFactor = this.difficulty + 0.25 * li
    Object.entries(this.bestiary[base]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * liFactor), thing))
    Object.entries(this.subtypes[type]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * liFactor), thing))
    creature.things.add(creature.things.count('hp'), 'max hp')
  }

  generateBoss(creature: Person, li: number = 0) {
    const base = sample(Object.keys(this.bosses))
    const type = sample(Object.keys(this.rareSubtypes))
    const perk = sample(Object.keys(this.perks))
    const name = [perk,type,base].join(' ')
    creature.name = name // `${name} (${this.monsterIds.next})`
    const liFactor = this.difficulty + 0.5 * li
    Object.entries(this.bestiary[base]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * liFactor), thing))
    Object.entries(this.rareSubtypes[type]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * liFactor), thing))
    Object.entries(this.perks[perk]).forEach(([thing, amount]) => creature.things.add(
      Math.floor(amount * liFactor), thing))
    creature.things.add(creature.things.count('hp'), 'max hp')
  }
  // apply(individual: Person, subtype: MonsterSubtype) {
  //   if (subtype === 'crystalline') {}
  //   else if (subtype === 'clockwork') {}
  // }
}


class Arena extends Model {
  constructor() {
    super('The Arena')
    const globals = [ 'day', 'step', 'li', 'gil', 'kill', 'victory', 'death', 'tpk' ]
    globals.forEach(resource => this.resources.create(resource))
    this.people.create('Adventurers')
    this.spawnHero()
    this.actions.create({ name: 'Spawn Hero', act: this.spawnHero })
    this.people.create('Enemies')
    // enemies.obscured = true // only show names? really want hp

    this.spawnEnemyParty()
    this.evolve(this.tick)
  }

  heroIds = new Sequence()
  @boundMethod
  spawnHero() {
    const characterClass = sample([ 'knight', 'thief', 'mage', 'cleric' ])
    const name = `${characterClass} (${this.heroIds.next})`; //sample(['(', '@', '^', '_', '$', '%', '#', '!', ')', '*', '{', '}', '.', ',', ';'])
    const hero = this.party.create(name)
    hero.things.add(30, 'hp')
    hero.things.add(randomInteger(1,4), 'strength')
    hero.things.add(randomInteger(1,4), 'speed')
    hero.things.add(1, 'crit chance')

    if (characterClass === 'knight') {
      hero.things.add(2, 'strength')
      hero.things.add(2, 'defense')
      hero.things.remove(1, 'speed')
      hero.things.add(10, 'hp')
    } else if (characterClass === 'thief') {
      hero.things.add(2, 'evasion')
      hero.things.add(2, 'counter')
      hero.things.add(2, 'crit damage')
      hero.things.remove(1, 'strength')
    } else if (characterClass === 'mage') {
      hero.things.add(2, 'magic damage')
      hero.things.add(2, 'absorb')
      hero.things.remove(1, 'strength')
      hero.things.remove(1, 'speed')
      hero.things.remove(5, 'hp')
    } else if (characterClass === 'cleric') {
      hero.things.add(2, 'heal')
      hero.things.add(2, 'holy damage')
      hero.things.remove(1, 'strength')
      hero.things.remove(1, 'speed')
      hero.things.remove(10, 'hp')
      hero.traits.add(1, 'Holy Symbol')
    }
    hero.things.add(1, 'xp per turn')
    hero.things.add(5, 'xp per kill')
    hero.things.add(10, 'xp per encounter')
    hero.things.add(25, 'xp per victory')
    hero.things.add(1000, 'xp per li')
    hero.things.add(hero.things.count('hp'), 'max hp')
    // for (let i = 0; i<7; i++) {}
    // PlayerHandbook.levelUp(hero)
  }

  @boundMethod
  spawnEnemyParty() {
    const manual = new MonsterManual()
    for (let i = 0; i < randomInteger(2,6); i++) {
      const enemy = this.enemies.create('new enemy')
      manual.generate(enemy, this.resources.count('li'))
    }

    if (this.resources.count('li') > 0 && randomInteger(0,12) > 11) {
      const enemy = this.enemies.create('new big enemy')
      manual.generateBoss(enemy, this.resources.count('li'))
    }
  }

  get party() { return this.people.lookup('Adventurers') }
  get enemies() { return this.people.lookup('Enemies') }

  private strike(aggressor: Person, defender: Person, onKill?: Function) {
    const holyDefense = Math.floor(defender.things.count('holy defense')
                      * (1+ (0.25 * defender.traits.count('Holy Symbol'))))
                      * (1 + (0.1 * defender.traits.count('Faith')))
    const holyDamage = Math.max(0,
      aggressor.things.count('holy damage')
      * (1+ (0.25 * aggressor.traits.count('Holy Symbol')))
      * (1 + (0.1 * aggressor.traits.count('Faith')))
      - holyDefense
    )

    const magicDefense = Math.floor(defender.things.count('magic defense')
                       * (1+ (0.1 * defender.traits.count('Fine Raiment'))))
    const magicDamage = Math.max(0,
      aggressor.things.count('magic damage')
      * (1 + (0.1 * aggressor.traits.count('Focus')))
      - magicDefense
    )

    let physicalDamage = 0;
    let criticalStrike = false;
    const evade = defender.things.count('evasion')
                * (1 + 0.5 * defender.traits.count('Cloaking Robe of Elvenkind'))
                * (1 + 0.25 * defender.traits.count('Ethereal'))
                * (1 + 0.1 * defender.traits.count('Combat Veteran'))
    const hitRoll = randomInteger(0,100)
    const hit = hitRoll > evade
    // console.log({evade, hitRoll, hit})
    if (hit) {
      const defense = Math.floor(
        defender.things.count('defense')
        * (1+ (0.25 * defender.traits.count('Royal Armorer')))
        * (1+ (0.1 * defender.traits.count('Ethereal')))
      )
      const baseDamage = Math.max(1,aggressor.things.count('strength') - defense)
                       * (1+(0.25 * aggressor.traits.count('Brutality')))
                       * (1+(0.1 * aggressor.traits.count('Combat Veteran')))

      const bonus = Math.floor(
        aggressor.things.count('bonus damage')
        * (1 + (0.25 * aggressor.traits.count('Barbarian')))
        * (1 + (0.1 * aggressor.traits.count('Brutality')))
        * (1 + (0.05 * aggressor.traits.count('Combat Veteran')))
      )

      const critChance = aggressor.things.count('crit chance')
                       * (1 + (0.25 * aggressor.traits.count('Finesse')))
                       * (1 + (0.1 * aggressor.traits.count('Combat Veteran')))
                       * (1 + (0.05 * aggressor.traits.count('Precision')))
                       
      criticalStrike = randomInteger(0,100) < critChance

      if (criticalStrike) {
        console.log(`${aggressor.name} landed a critical strike on ${defender.name}!`)
      }

      physicalDamage = criticalStrike 
        ? (
          (baseDamage + bonus + aggressor.things.count('crit damage'))
          * (1 + (0.25 * aggressor.traits.count('Precision')))
          * (1 + (0.15 * aggressor.traits.count('Finesse')))
          * (1 + (0.1 * aggressor.traits.count('Combat Veteran')))
          * (1 + (0.05 * aggressor.traits.count('Barbarian')))
        )
        : randomInteger(1, baseDamage) + bonus
    }
    const overallDamage = magicDamage + physicalDamage + holyDamage
     
    if (overallDamage > 0) {
      if (defender.things.count('magic hp') > 0) {
        const damage = Math.min(defender.things.count('magic hp'), overallDamage)
        defender.things.remove(damage, 'magic hp')
        console.log(`${aggressor.name} hit ${defender.name}'s magic shield for ${damage} (magic hp now ${defender.things.count('magic hp')})`)
      } else {
        const damage = Math.floor( Math.min(defender.things.count('hp'), overallDamage) )
        defender.things.remove(damage, 'hp')
        console.log(`${aggressor.name} hit ${defender.name} for ${damage}!`)
        const absorb = Math.min(aggressor.things.count('absorb'), damage)
        if (absorb > 0 && absorb + aggressor.things.count('hp') < aggressor.things.count('max hp')) {
          const absorption = randomInteger(1,absorb) 
          console.log(`${aggressor.name} absorbed ${absorption} hp!`)
          aggressor.things.add(
            absorption, 'hp'
            // Math.min(, damage), 'hp'
          )
        }
        if (defender.things.count('hp') <= 0) {
          if (defender.traits.count('Eternal Victory') > 0) {
            defender.things.add(200, 'hp')
            defender.traits.remove(1, 'Eternal Victory')
          } else if (defender.traits.count('Healing Salve') > 0) {
            defender.things.add(50, 'hp')
            defender.traits.remove(1, 'Healing Salve')
          } else if (defender.traits.count('Shell Matrix') > 0) {
            defender.things.add(20, 'hp')
            defender.things.add(150, 'magic hp')
            defender.traits.remove(1, 'Shell Matrix')
          } if (onKill) {
            onKill(aggressor, defender)
          }
        } else {
          const counter = defender.things.count('counter')
                        * (1 + 0.65 * defender.traits.count('Counterweight'))
                        * (1 + 0.25 * defender.traits.count('Swiftness'))
                        * (1 + 0.1 * defender.traits.count('Combat Veteran'))
          if (randomInteger(0,100) < counter) {
            console.log(`${defender.name} counter-attacked against ${aggressor.name}!`)
            this.strike(defender, aggressor) // , (agg: Person, def: Person) => onKill(def, agg))
          }
        }
      }
    } else {
      console.log(`${aggressor.name} swung for ${defender.name} but missed!`)
    }
  }

  attack(aggressors: Community, defenders: Community, onKill?: (agg: Person, def: Person) => void, onVictory?: (agg: Person, def: Person) => void) {
    aggressors.list().forEach(aggressor => {
      const baseSpeed = 50;
      const aggSpeed = Math.min(baseSpeed, aggressor.things.count('speed'))
      const speed = 1+Math.floor(Math.max(baseSpeed - aggSpeed, 0))
      if (this.ticks % speed === 0) {
        const defender = sample(defenders.list()) // attack-weakest
        if (defender) {
          let done = false;
          const hit = () => this.strike(aggressor, defender, () => {
            if (onKill) { onKill(aggressor, defender); done = true }
            defenders.destroy(defender.name)
            console.log(`${aggressor.name} killed ${defender.name}!`)
            if (defenders.count === 0) {
              if (onVictory) { onVictory(aggressor, defender); done = true }
            }
          })
          hit()
          const chainChance = aggressor.things.count("chain chance")
                            * (1 + (0.05 * aggressor.traits.count("Whirlwind")))
          let chain = 0
          while (!done && chain++ < 4) {
            let chainRoll = randomInteger(0,100)
            if (chainRoll < chainChance) {
              console.log(`...and swung again (${chain} times)! (${chainRoll} < ${chainChance})`)
              hit()
            }
          }
        }
      }
    })
  }

  // per('day', 'xp')
  per(unit: string) { //}, value: string) {
    this.party.list().forEach(adventurer => {
      const xp = adventurer.things.count(`xp per ${unit}`)
                * (1 + 0.1 * adventurer.traits.count('Perspicuous'))
                * (1 + 0.25 * adventurer.traits.count('Perfectionist'))
      adventurer.things.add(Math.floor(xp), 'xp')

      const gil = adventurer.things.count(`gold per ${unit}`)
                // * (1 + 0.1 * adventurer.traits.count('Perspicuous'))
                * (1 + 0.25 * adventurer.traits.count('Perfectionist'))
      this.resources.add(Math.floor(gil), 'gil')

      if (adventurer.things.count('hp') < adventurer.things.count('max hp')) {
        const hp = adventurer.things.count(`hp per ${unit}`)
                // * (1 + 0.1 * adventurer.traits.count('Perspicuous'))
                * (1 + 0.25 * adventurer.traits.count('Perfectionist'))
        adventurer.things.add(Math.floor(hp), 'hp')
      }
    })
  }

  @boundMethod
  tick({ resources }: EvolvingStocks, t: number) {
    this.party.list().forEach(adventurer => {
      const level = adventurer.things.count('level')
      const levelCost = Math.min(level * 250, Math.pow(10, level))
      if (adventurer.things.count('xp') > levelCost) {
        adventurer.things.remove(levelCost, 'xp')
        console.log(`${adventurer.name} level up!`)
        PlayerHandbook.levelUp(adventurer)
      }
    })

    if (t % 120 === 0) {
      // console.log("round")
      this.per('round')
      this.party.list().forEach(adventurer => {
        if (adventurer.things.count('hp') < adventurer.things.count('max hp')) {
          adventurer.things.add(adventurer.things.count('regen'), 'hp')
        }

        const damageAll = adventurer.things.count('damage to all')
                        * (1 + 0.1 * adventurer.traits.count('Whirlwind'))
        if (damageAll > 0) {
          this.enemies.list().forEach(enemy => {
            enemy.things.remove(Math.floor(Math.min(enemy.things.count('hp'),damageAll)), 'hp')
          })
        }

        if (adventurer.things.count('heal')) {
          this.party.list().forEach(healee => {
            if (healee.things.count('hp') < healee.things.count('max hp')) {
              const heal = adventurer.things.count('heal')
                         * (1 + 0.5 * adventurer.traits.count('Medic'))
                         * (1 + 0.15 * adventurer.traits.count('Faith'))
                         * (1 + 0.05 * adventurer.traits.count('Holy Symbol'))
              healee.things.add(Math.floor(heal), 'hp')
            }
          })
        }
      })
      this.enemies.list().forEach(enemy => {
        if (enemy.things.count('hp') < enemy.things.count('max hp')) {
          enemy.things.add(enemy.things.count('regen'), 'hp')
        }
      })
    }

    if (t % 20000 === 0) {
      resources.add(1, 'day')
      this.per('day')
    }

    if (this.enemies.count === 0) {
      if (t % 2 === 0) {
        this.resources.add(1, 'step')
        this.per('step')
        if (this.resources.count('step') % 500 === 0) {
          resources.add(1, 'li')
          this.per('li')
          if (resources.count('gil') > 1000) {
            // give items to leader
            let leader = this.party.list()[0]
            const items = [
              'Healing Salve', 'Shell Matrix', // functionally -- resurrect charges (w/ limitations)
              'Cloaking Robe of Elvenkind', // large % bonus to evade
              'Counterweight' // large % bonus to counter chance
            ]
            leader.traits.add(1, sample(items))
            resources.remove(1000, 'gil')
          }
        }
      }

        if (randomInteger(0,20) > 19) {
          this.spawnEnemyParty()
          this.per('encounter')
        }
      // }

    } else {
      this.per('turn')
      this.attack(this.party, this.enemies, (aggressor) => {
        this.resources.add(1, 'kill') 
        aggressor.things.add(aggressor.things.count('xp per kill'), 'xp')
        resources.add(aggressor.things.count('gold per kill'), 'gil')
        
      }, (aggressor) => {
        resources.add(1, 'victory')
        this.per('victory')
      })

      this.attack(this.enemies, this.party, () => resources.add(1, 'death'), () => resources.add(1, 'tpk'))
    }
  }
}

const arena = new Arena()
export default arena
