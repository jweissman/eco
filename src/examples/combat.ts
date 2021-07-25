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
    const commonAttrs = ['max hp', 'strength', 'speed', 'xp per day', 'xp per victory', 'counter']
    for (let i=0; i<4; i++) {
      const levelAttr = sample(commonAttrs)
      console.log(`${levelAttr} improves`)
      pc.things.add(1, levelAttr)
    }

    const uncommonAttrs = [
      'bonus damage', 'evasion', 'regen', 'xp per kill', 'absorb'
    ]
    for (let i=0; i<2; i++) {
      const levelAttr = sample(uncommonAttrs)
      console.log(`${levelAttr} improves`)
      pc.things.add(1, levelAttr)
    }

    const rareAttrs = [
      'crit chance', 'crit damage',
      'magic damage', 'magic defense', //'damage per turn',
      'hp per day',
      'gold per kill',
      'xp per step', 'xp per li'
    ]
    // for (let i=0; i<2; i++) {
      const levelAttr = sample(rareAttrs)
      console.log(`${levelAttr} improves`)
      pc.things.add(1, levelAttr)
    // }

    if (pc.things.count('level') % 2 === 1) {
      const perks = [
        'Combat Veteran',
        'Fine Raiment',
        'Royal Armorer',
        'Finesse'
        // 'Noble',
      ]
      const perk = sample(perks)
      console.log(`Gain rank in ${perk}`)
      pc.traits.add(1, perk)
    }
  }
}

class MonsterManual {
  bestiary: { [monster: string]: { [attr: string]: number }} = {
    Blob: { hp: 20, strength: 1, speed: 1 },
    Skeleton: { hp: 20, evasion: 1, absorb: 1, regen: 1 },
    Zombie: { hp: 25, evasion: 2 },
    Kobold: { hp: 20, strength: 1, speed: 2 },
    Orc: { hp: 20, strength: 2, speed: 2 },
    Ghost: { hp: 30, 'magic damage': 1, evasion: 1 },
    Rogue: { hp: 30, strength: 1, speed: 1, 'bonus damage': 1, evasion: 2 },
    Troll: { hp: 40, strength: 4, speed: 3, regen: 2 },
  }

  bosses: { [monster: string]: { [attr: string]: number }} = {
    Vampire: { hp: 80, strength: 2, speed: 3, 'magic damage': 1, absorb: 2, evasion: 2  },
    Drake: { hp: 100, strength: 3, speed: 2, regen: 2, 'magic damage': 2, evasion: 2 },
    Lich: { hp: 240, strength: 6, speed: 6, defense: 6, 'magic damage': 6, evasion: 6 },
  }

  subtypes: { [type: string]: { [attr: string]: number }} = {
    Common: { strength: 1, speed: 1 },
    Intimidating: { strength: 3 },
    Favored: { 'magic damage': 1, regen: 1, evasion: 1 },
    Bashful: { defense: 1, evasion: 1, 'bonus damage': 1, },
    Fiendish: { hp: 10, speed: 2, defense: 1, evasion: 1 },
    Fierce: { hp: 20, strength: 2, defense: 1, evasion: 1, },
  }

  perks: { [type: string]: { [attr: string]: number }} = {
    Blessed: { hp: 15, strength: 1, defense: 1, evasion: 1, 'bonus damage': 1, },
    Enchanted: { hp: 15, defense: 1, evasion: 1 },
    Clockwork: { hp: 15, defense: 1, speed: 2, evasion: 1 },
    Phantasmal: { hp: 25, defense: 1, evasion: 4 }, //, speed: 4, evasion: 8 }
    Cosmic: { hp: 30, defense: 3, evasion: 3, strength: 3 }
    // Challenging: { strength: 2, defense: 1, speed: 1, 'bonus damage': 1, evasion: 1 }
  }
  monsterIds = new Sequence()

  generate(creature: Person) {
    const base = sample(Object.keys(this.bestiary))
    const type = randomInteger(0,12) > 11 ? sample(Object.keys(this.subtypes)) : 'Common'
    const name = type === 'Common' ? base : [type, base ].join(' ')
    creature.name = `${name} (${this.monsterIds.next})`
    creature.things.add(creature.things.count('hp'), 'max hp')
    Object.entries(this.bestiary[base]).forEach(([thing, amount]) => creature.things.add(amount, thing))
    Object.entries(this.subtypes[type]).forEach(([thing, amount]) => creature.things.add(amount, thing))
  }

  generateBoss(creature: Person) {
    const base = sample(Object.keys(this.bosses))
    const type = sample(Object.keys(this.subtypes))
    const perk = sample(Object.keys(this.perks))
    const name = [perk,type,base].join(' ')
    creature.name = `${name} (${this.monsterIds.next})`
    creature.things.add(creature.things.count('hp'), 'max hp')
    Object.entries(this.bosses[base]).forEach(([thing, amount]) => creature.things.add(amount, thing))
    Object.entries(this.subtypes[type]).forEach(([thing, amount]) => creature.things.add(amount, thing))
    Object.entries(this.perks[perk]).forEach(([thing, amount]) => creature.things.add(amount, thing))
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

  @boundMethod
  spawnHero() {
    const name = sample(['(', '@', '^', '_', '$', '%', '#', '!', ')', '*', '{', '}', '.', ',', ';'])
    const hero = this.party.create(name)
    hero.things.add(200, 'max hp')
    hero.things.add(200, 'hp')
    hero.things.add(randomInteger(1,4), 'strength')
    hero.things.add(randomInteger(1,4), 'speed')
    hero.things.add(1, 'crit chance')
    hero.things.add(1, 'defense')

    const characterClass = sample([ 'knight', 'thief', ])
    if (characterClass === 'knight') {
      hero.things.add(2, 'strength')
      hero.things.add(2, 'defense')
      hero.things.remove(1, 'speed')
    } else if (characterClass === 'thief') {
      hero.things.add(2, 'evasion')
      hero.things.add(2, 'counter')
      hero.things.remove(1, 'strength')
    }
    // hero.things.add(25, 'absorb')
    // hero.things.add(10, 'magic hp')
    // hero.things.add(10, 'magic hp')
    // PlayerHandbook.levelUp(hero)
    // PlayerHandbook.levelUp(hero)
    // PlayerHandbook.levelUp(hero)
    hero.things.add(1, 'xp per kill')
    // PlayerHandbook.levelUp(hero)
    // hero.things.add(1, 'xp per step')
  }

  @boundMethod
  spawnEnemyParty() {
    const manual = new MonsterManual()
    for (let i = 0; i < randomInteger(2,6); i++) {
      const enemy = this.enemies.create('new enemy')
      manual.generate(enemy)
      // this.spawnBlob()
    }
    // const blob = this.enemies.create('Blob 0')
    // blob.things.add(100, 'hp')
    // blob.things.add(2, 'damage')

    if (this.resources.count('step') > 50 && randomInteger(0,12) > 11) {
      const enemy = this.enemies.create('new big enemy')
      manual.generateBoss(enemy)

    
      // if (randomInteger(0, 12) > 6) {
      //   const rogue = this.enemies.create('Rogue 0')
      //   rogue.things.add(1000, 'hp')
      //   rogue.things.add(3, 'damage')
      // } else {
      //   const drake = this.enemies.create('Drake 0')
      //   drake.things.add(1300, 'hp')
      //   drake.things.add(5, 'damage')
      // }
    }

  }

  get party() { return this.people.lookup('Adventurers') }
  get enemies() { return this.people.lookup('Enemies') }

  private strike(aggressor: Person, defender: Person, onKill: Function) {
    const magicDefense = Math.floor(defender.things.count('magic defense') * (1+ (0.1 * defender.traits.count('Fine Raiment'))))
    const magicDamage = aggressor.things.count('magic damage') - magicDefense
    // defender.things.remove(Math.min(magicDamage, defender.things.count('hp')), 'hp')

    let physicalDamage = 0;
    let criticalStrike = false;
    const evade = defender.things.count('evasion') * (1 + 0.2 * defender.traits.count('Combat Veteran'))
    const hitRoll = randomInteger(0,100) + (5 * aggressor.traits.count('Combat Veteran'))
    // const toHit = (10 - defender.things.count('evasion')) * 10
    const hit = hitRoll > evade //Math.min(95,evade)
    // console.log({ evade, hitRoll, hit })
    if (hit) {
      const defense = Math.floor(defender.things.count('defense') * (1+ (0.05 * defender.traits.count('Royal Armorer'))))
      const baseDamage = Math.max(1,aggressor.things.count('strength') - defense) //defender.things.count('defense'))
      // console.log('hit!', { defense, baseDamage })

      const bonus = aggressor.things.count('bonus damage')

      const critChance = Math.floor(aggressor.things.count('crit chance') + (1 + (0.25 * defender.traits.count('Finesse'))))
      criticalStrike = randomInteger(0,100) < critChance

      if (criticalStrike) {
        console.log(`${aggressor.name} landed a critical strike on ${defender.name}!`)
      }

      physicalDamage = criticalStrike 
        ? (baseDamage + bonus + aggressor.things.count('crit damage'))
        : randomInteger(1, baseDamage) + bonus
    }
    const overallDamage = magicDamage + physicalDamage
    // console.log({ magicDamage, physicalDamage, overallDamage })
     
    if (overallDamage > 0) {
      if (defender.things.count('magic hp') > 0) {
        const damage = Math.min(defender.things.count('magic hp'), overallDamage)
        defender.things.remove(damage, 'magic hp')
        console.log(`${aggressor.name} hit ${defender.name}'s magic shield for ${damage} (magic hp now ${defender.things.count('magic hp')})`)
      } else {
        const damage = Math.min(defender.things.count('hp'), overallDamage)
        defender.things.remove(damage, 'hp')
        console.log(`${aggressor.name} hit ${defender.name} for ${damage} (hp now ${defender.things.count('hp')})`)
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
          if (onKill) {
            onKill(aggressor, defender)
          }
        } else {
          if (randomInteger(0,100) < defender.things.count('counter')) {
            console.log(`${defender.name} counter-attacked against ${aggressor.name}!`)
            this.strike(defender, aggressor, onKill)
          }
        }
      }
    } else {
      console.log(`${aggressor.name} swung for ${defender.name} but missed!`)
    }
  }

  attack(aggressors: Community, defenders: Community, onKill?: (agg: Person, def: Person) => void, onVictory?: (agg: Person, def: Person) => void) {
    aggressors.list().forEach(aggressor => {
      const baseSpeed = 10;
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

  @boundMethod
  tick({ resources }: EvolvingStocks, t: number) {
    if (t % 20 === 0) {
      this.party.list().forEach(adventurer => {
        if (adventurer.things.count('hp') < adventurer.things.count('max hp')) {
          adventurer.things.add(adventurer.things.count('regen'), 'hp')
        }
      })
      this.enemies.list().forEach(enemy => {
        if (enemy.things.count('hp') < enemy.things.count('max hp')) {
          enemy.things.add(enemy.things.count('regen'), 'hp')
        }
      })
    }
    // console.log("TICK")
    if (t % 1000 === 0) {
      this.resources.add(1, 'day')
      this.party.list().forEach(adventurer => {
        adventurer.things.add(adventurer.things.count('xp per day'), 'xp')
        adventurer.things.add(adventurer.things.count('hp per day'), 'hp')
      })
    }

    if (this.enemies.count === 0) {
      if (t % 3 === 0) {
        this.resources.add(1, 'step')
        this.party.list().forEach(adventurer => {
          adventurer.things.add(adventurer.things.count('xp per step'), 'xp')
        })
        if (this.resources.count('step') % 500 === 0) {
          this.resources.add(1, 'li')
          this.party.list().forEach(adventurer => {
            adventurer.things.add(adventurer.things.count('xp per li'), 'xp')
          })
        }
        if (randomInteger(0,12) > 10) {
          this.spawnEnemyParty()
        }
      }

    } else {
      this.attack(this.party, this.enemies, (aggressor) => {
        this.resources.add(1, 'kill') 
        aggressor.things.add(aggressor.things.count('xp per kill'), 'xp')
        this.resources.add(aggressor.things.count('gold per kill'), 'gil')
        const level = aggressor.things.count('level')
        const levelCost = Math.pow(10, level)

        if (aggressor.things.count('xp') > levelCost) {
          aggressor.things.remove(levelCost, 'xp')
          console.log(`${aggressor.name} level up!`)
          PlayerHandbook.levelUp(aggressor)
        }
      }, (aggressor) => {
        this.resources.add(1, 'victory')
        aggressor.things.add(aggressor.things.count('xp per victory'), 'xp')
      })
      this.attack(this.enemies, this.party, () => this.resources.add(1, 'death'), () => {
        this.resources.add(1, 'tpk')
      })
    }
  }
}

const arena = new Arena()
export default arena
