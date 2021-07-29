import { boundMethod } from "autobind-decorator"
import { List, Sequence } from "../../collections"
import { Community } from "../../ecosphere/Community"
import Model from "../../ecosphere/Model"
import { EvolvingStocks, ManageStocks, Person } from "../../ecosphere/types"
import { randomInteger } from "../../ecosphere/utils/randomInteger"
import { sample } from "../../ecosphere/utils/sample"
import { where } from "../../ecosphere/utils/where"
import { MonsterManual } from "./MonsterManual"
import { PlayerHandbook } from "./PlayerHandbook"

// try to keep magic numbers here?
class DungeonMasterGuide {
  static durations = { round: 74, day: 6800 }
}

// type SimpleEvent = { at: number }
type EventCommon = { id: number, at: number }
type EnemyInjured = EventCommon & { kind: 'enemy-injured', enemyName: string, amount: number }
type TurnStarted = EventCommon & { kind: 'turn-started' }
type Event = EnemyInjured | TurnStarted
class Arena extends Model {
  events = new List<Event>()
  // emit(event: Event, title?: string, message?: string) {
    // if (title) { console.log(title) } //"EVENT", event)
  eventIds = new Sequence()
  enemyInjured(name: string, amount: number) {
    this.events.add({
      id: this.eventIds.next,
      kind: 'enemy-injured',
      enemyName: name,
      amount,
      at: this.ticks
    })
      // : `${name} took ${amount} damage`, description: message, kind: event.kind, at: this.ticks })
  }

  turnStarted() {
    this.events.add({ id: this.eventIds.next, kind: 'turn-started', at: this.ticks })
  }

  constructor() {
    super('The Arena')
    const globals = [ 'day', 'step', 'li', 'gil', 'kill', 'victory', 'death', 'tpk' ]
    globals.forEach(resource => this.resources.create(resource))
    this.people.create('Adventurers')
    this.spawnHero('Fighter')
    // this.spawnHero('Cleric')
    // this.spawnHero(sample(['Monk', 'Mage'])) 
    // this.spawnHero(sample(Object.keys(PlayerHandbook.characterClasses)))
    Object.keys(PlayerHandbook.characterClasses).forEach(characterClass => {
      this.actions.create({ name: `Hire ${characterClass}`, act: () => this.spawnHero(characterClass) })
    })
    this.actions.create({ name: `Hire Party`, act: () => {
      for (let i=0; i<3; i++) {
        this.spawnHero(sample(Object.keys(PlayerHandbook.characterClasses))) 
      }
      // this.spawnHero(sample(Object.keys(PlayerHandbook.characterClasses))) 
      // this.spawnHero(sample(Object.keys(PlayerHandbook.characterClasses))) 
    }})
    this.people.create('Enemies')
    // enemies.obscured = true // only show names? really want hp -- more granular/whitelist?
    this.spawnEnemyParty()
    this.evolve(this.tick)
  }

  metrics = {
    'challenge rating': () => this.challengeRating,
    // 'damage per tick': () => this.damagePerTick,
    // turns: () => this.recent('turn-started').length,
  }

  heroIds = new Sequence()
  @boundMethod
  spawnHero(characterClass: string) {
    const name = `${characterClass} (${this.heroIds.next})`;
    const hero = this.party.create(name)
    PlayerHandbook.generate(hero, characterClass)
  }

  get challengeRating() {
    if (this.party.count === 0) return -1;
    const totalLevels = this.party.list().map(adv => adv.things.count('level')).reduce((a, b) => a + b)
    const cr = 1 
      + (this.resources.count('step')/1250)
      + (this.resources.count('day')/14)
      + (this.party.count) 
      + (totalLevels / this.party.count);
    return Math.floor(cr);
  }

  private recent(kind: string): Event[] { return this.recentEvents.filter(where('kind', kind)) }

  metricGrain = 150 //DungeonMasterGuide.durations.round
  get damagePerTick() {
    const enemyInjuries: EnemyInjured[] = this.recent('enemy-injured') as EnemyInjured[]
    // const turns = 1 + this.recent('turn-started').length //this.recentEvents.filter(where('kind', 'turn-started')).length
    const totalInjuryAmount = enemyInjuries.map((injury: EnemyInjured) => injury.amount).reduce((a, b) => a + b, 0)
    return (Math.floor(
      totalInjuryAmount / this.metricGrain //Math.floor(totalInjuryAmount / this.metricGrain)
    ))
  }

  get recentEvents() {
    return this.events.items.filter(e => e.at > this.ticks-this.metricGrain)
  }

  manual = new MonsterManual()

  @boundMethod
  spawnEnemyParty() {
    if (this.party.count === 0) return;

    for (let i = 0; i < randomInteger(1,2+this.party.count); i++) {
      const enemy = this.enemies.create('new enemy')
      this.manual.generate(enemy, this.challengeRating)
    }

    // if (randomInteger(0,12) > 11) {
    //   const enemy = this.enemies.create('new big enemy')
    //   this.manual.generateBoss(enemy, this.challengeRating)
    // }
  }

  get party() { return this.people.lookup('Adventurers') }
  get enemies() { return this.people.lookup('Enemies') }

  private injure(defender: Person, amount: number, aggressor: Person, reflected: boolean = false) {
    const damage = Math.floor( Math.min(defender.things.count('hp'), amount) )
    if (damage <= 0) return;

    defender.things.remove(damage, 'hp')
    if (this.enemies.list().includes(defender)) {
      this.enemyInjured(defender.name, damage)
    }

    console.log(`${aggressor.name} hit ${defender.name} for ${damage}!`)
    const absorb = Math.min(this.effective(aggressor, 'absorb'), damage)
    if (absorb > 0) {
      const absorption = randomInteger(0,absorb) 
      console.log(`${aggressor.name} absorbed ${absorption} hp!`)
      this.heal(aggressor, absorption)
    }
    if (defender.things.count('hp') > 0) {
      const reflect = Math.min(this.effective(defender, 'reflect'), damage)
      if (reflect > 0 && !reflected) {
        console.log(`${defender.name} reflected ${reflect} damage!`)
        this.injure(aggressor, reflect, defender, true)
      }
      const counter = this.effective(defender, 'counter')
      if (randomInteger(0,100) < counter) {
        console.log(`${defender.name} counter-attacked against ${aggressor.name}!`)
        this.strike(defender, aggressor)
      }
    }
  }

  private effective(person: Person, attribute: string) {
    const base = person.things.count(attribute)
    if (base === 0) return 0;
    let multiplier = 1;
    Object.keys(PlayerHandbook.perkBenefits).forEach(perk => {
      const benefits = PlayerHandbook.perkBenefits[perk]
      const benefitAttrs = Object.keys(benefits)
      if (benefitAttrs.includes(attribute)) {
        const ranks = person.traits.count(perk)
        if (ranks > 0) {
          const benefit = benefits[attribute] * ranks
          multiplier += benefit
        }
      }
    })
    const value = Math.floor(base * multiplier);
    return value
  }

  private strike(aggressor: Person, defender: Person) {
    const holyDefense = this.effective(defender, 'holy defense')
    const holyDamage = Math.max(0, this.effective(aggressor, 'holy damage') - holyDefense)
    const magicDefense = this.effective(defender, 'magic defense')
    const magicDamage = Math.max(0, this.effective(aggressor, 'magic damage') - magicDefense)
    let physicalDamage = 0;
    let criticalStrike = false;
    const evade = 1 + this.effective(defender, 'evasion')
    const hitRoll = randomInteger(0,100)
    const hit = hitRoll > Math.min(95, evade * 2)
    if (hit) {
      const defense = this.effective(defender, 'defense')
      const baseDamage = Math.max(1,this.effective(aggressor, 'strength') - defense)
      const bonus = this.effective(aggressor, 'bonus damage')
      const critChance = 1 + this.effective(aggressor, 'crit chance')
      criticalStrike = randomInteger(0,100) < Math.max(50, critChance * 2)
      if (criticalStrike) {
        console.log(`${aggressor.name} landed a critical strike on ${defender.name}!`)
      }
      physicalDamage = criticalStrike 
        ? baseDamage + bonus + randomInteger(1, this.effective(aggressor, 'crit damage'))
        : randomInteger(1, baseDamage) + bonus
    }
    const overallDamage = magicDamage + physicalDamage + holyDamage
    if (overallDamage > 0) {
      this.injure(defender, overallDamage, aggressor)
    } else {
      console.log(`${aggressor.name} swung for ${defender.name} but missed!`)
    }
  }

  attack(aggressors: Community, defenders: Community) {
    aggressors.list().forEach(aggressor => {
      const baseSpeed = 12;
      const aggSpeed = Math.min(baseSpeed, aggressor.things.count('speed'))
      const speed = 1+Math.floor(Math.max(baseSpeed - aggSpeed, 0))
      if (this.ticks % speed === 0) {
        const damageAll = this.effective(aggressor, 'damage to all')
        if (damageAll > 0) {
          defenders.list().forEach(defender => {
            const damage = randomInteger(1, damageAll)
            this.injure(defender, damage, aggressor)
          })
        }

        // normal attack
        const defender = sample(defenders.list()) // todo attack-weakest policy..
        if (defender) {
          let done = false;
          const hit = () => this.strike(aggressor, defender)

          hit()
          const chainChance = this.effective(aggressor, 'chain chance')
          const maxChain = 1 + this.effective(aggressor, 'max chain')
          let chain = 0
          while (!done && chain++ < maxChain) {
            let chainRoll = randomInteger(0,100)
            if (chainRoll < chainChance) {
              console.log(`...and swung again (${chain} times)!`)
              hit()
            }
          }
        }
      }
    })
  }

  heal(healee: Person, amount: number) {
    const hp = healee.things.count('hp')
    const maxHp = healee.things.count('max hp')
    const maxHeal = maxHp - hp
    const heal = Math.min(maxHeal, amount)
    healee.things.add(Math.floor(heal), 'hp')
  }

  per(unit: string) {
    this.party.list().forEach(adventurer => {
      const xp = this.effective(adventurer, `xp per ${unit}`)
                * (1 + 0.1 * adventurer.traits.count('Perspicuous'))
                * (1 + 0.25 * adventurer.traits.count('Perfectionist'))
      adventurer.things.add(Math.floor(xp), 'xp')

      const gil = this.effective(adventurer, `gold per ${unit}`)
                * (1 + 0.25 * adventurer.traits.count('Perfectionist'))
      this.resources.add(Math.floor(gil), 'gil')

      if (adventurer.things.count('hp') < adventurer.things.count('max hp')) {
        const hp = this.effective(adventurer, `hp per ${unit}`)
                * (1 + 0.25 * adventurer.traits.count('Perfectionist'))
        this.heal(adventurer, hp)
      }
    })
  }

  private round() {
    this.per('round')
    this.party.list().forEach(adventurer => {
      const regen = this.effective(adventurer, 'regen')
      this.heal(adventurer, regen)
      if (adventurer.things.count('heal')) {
        this.party.list().forEach(healee => {
            const health = this.effective(adventurer, 'heal')
            this.heal(healee, randomInteger(1,health))
        })
      }

      if (adventurer.traits.count('Potion of Life') > 0 &&
          adventurer.things.count('hp') < 0.5 * adventurer.things.count('max hp')) {
        console.log(`${adventurer.name} drank a potion of life!`)
        adventurer.traits.remove(1, 'Potion of Life')
        const health = 20 + randomInteger(0, 10) + this.effective(adventurer, 'heal')
        this.heal(adventurer, health)
      }
    })

    this.enemies.list().forEach(enemy => {
      this.heal(enemy, this.effective(enemy, 'regen'))
    })
  }

  @boundMethod
  tick({ resources }: EvolvingStocks, t: number) {
    this.party.list().forEach(adventurer => {
      const level = adventurer.things.count('level')
      const levelCost = Math.floor(Math.pow(2, 5+level))
      if (adventurer.things.count('xp') > levelCost) {
        adventurer.things.remove(levelCost, 'xp')
        adventurer.things.add(1, 'level')
        console.log(`${adventurer.name} level up!`)
        PlayerHandbook.levelUp(adventurer)
      }
    })

    if (t % DungeonMasterGuide.durations.round === 0) {
      this.round()
    }

    if (t % DungeonMasterGuide.durations.day === 0) {
      resources.add(1, 'day')
      this.per('day')
    }

    if (this.enemies.count === 0 && this.party.count > 0) {
      if (t % 5 === 0) {
        this.resources.add(1, 'step')
        this.per('step')
        if (this.resources.count('step') % 500 === 0) {
          resources.add(1, 'li')
          this.per('li')
          // store..
          const items = [
            'Potion of Life', // heals ~25 at 50% hp
            'Healing Salve',
          ]
          const rareItems = [
            'Shell Matrix', // functionally -- resurrect charges (w/ limitations)
            'Cloaking Robe of Elvenkind', // large % bonus to evade
            'Counterweight' // large % bonus to counter chance
          ]
          const stock = randomInteger(0,20) > 19 ? rareItems : items
          while (this.resources.count('gil') > 1000) {
            // give items to leader
            let recipient = sample(this.party.list()) //[0]
            recipient.traits.add(1, sample(stock))
            this.resources.remove(1000, 'gil')
          }
        }

        const encounterChance = 60 + this.resources.count('li') + this.party.count
        const randomEncounter = randomInteger(0,100) > encounterChance
        if (randomEncounter) { //randomInteger(0,100) > 86) {
          this.spawnEnemyParty()
          this.per('encounter')
        }
      }

       
    } else {
      this.turnStarted()
      this.per('turn')
      this.attack(this.party, this.enemies)
      this.attack(this.enemies, this.party)
      this.mortalityCheck(resources)
    }
  }

  private mortalityCheck(resources: ManageStocks) {
    this.party.list().forEach(adventurer => {
      if (adventurer.things.count('hp') <= 0) {
        if (adventurer.traits.count('Eternal Victory') > 0) {
          this.heal(adventurer, 200)
          adventurer.traits.remove(1, 'Eternal Victory')
        } else if (adventurer.traits.count('Healing Salve') > 0) {
          this.heal(adventurer, 100)
          adventurer.traits.remove(1, 'Healing Salve')
        } else if (adventurer.traits.count('Shell Matrix') > 0) {
          this.heal(adventurer, 50)
          adventurer.things.add(150, 'magic hp')
          adventurer.traits.remove(1, 'Shell Matrix')
        } else {
          this.per('death')
          this.party.destroy(adventurer.name)
          resources.add(1, 'death')
          console.log(`${adventurer.name} was slain!`)
          if (this.party.count === 0) {
            this.per('tpk')
            resources.add(1, 'tpk')
            console.log("The party has fallen... The quest is lost.")
          }
        }
      }
    })

    this.enemies.list().forEach(enemy => {
      if (enemy.things.count('hp') <= 0) {
        this.per('kill')
        this.enemies.destroy(enemy.name)
        resources.add(1, 'kill')
        console.log(`${enemy.name} was slain!`)
        if (this.enemies.count === 0) {
          this.per("victory")
          resources.add(1, 'victory')
          console.log("The party was victorious! The quest continues...")
          return
        }
      }
    })
  }
}

const arena = new Arena()
export default arena
