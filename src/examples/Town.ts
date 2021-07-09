// An empty world!!!

import { useState } from "react";
import Model from "../ecosphere/Model";
import { ManageStocks, Person } from "../ecosphere/types";

// ideas: calendar, tracking time it takes to do things

const give = (recipient: Person, supplier: Person, n: number, item: string) => {
  supplier.things.remove(n, item)
  recipient.things.add(n, item)
}

// person takes from community?
// const take = (recipient: Person, n: number, item: string) => {}

// const huntWildlife = (name: string, { resources, animals }: { resources: ManageStocks, animals: ManageStocks }) => {
  // resources.add(1, name)
  // animals.remove(1, name)
// }

let town = new Model('Town');

const { people, animals } = town

const wishes = people.create('Aloysius')
const fish = animals.create('Fish')

const bart = people.create('Bartholomew')
const cash = people.create('Cassius')
// const flipCoin = () => Math.random() > 0.5 

town.resources.create('Clay Pot')

town.evolve(({ resources, animals }, t) => {
  // implement aspects of the process here
  // check for certain conditions: should i gift? shuold i trade?
  // then take actions based on the state of the world
  animals.add(animals.count('Fish'), 'Fish')
  // console.log(t)
  // one approach :D ??
    // how fish are caught: only every 100 ticks
    // (could add noise/randomness)
    // (needs a *specific delay* -- we need to know when we started)
  if (t % 10 === 0) { // 
    // huntWildlife('Fish')
    wishes.things.add(1, 'Fish')
    animals.remove(1, 'Fish')
  }

  if (t % 20 === 0) { // 
    bart.things.add(1, 'Clay Pot')
    // animals.remove(1, 'Fish')
  }

  if (wishes.things.count('Fish') > 3 && bart.things.count('Clay Pot') > 2) {
    // time to trade with cash???
    give(bart, wishes, 1, 'Fish')
    give(wishes, bart, 1, 'Clay Pot')
  // supplier.things.remove(n, item)
  // recipient.things.add(n, item)
  // supplier.things.remove(n, item)
  // recipient.things.add(n, item)
  }

  if (t % 30 === 0) {
    // eat :D
    wishes.things.remove(1, 'Fish')
  }


  // wishes.things.remove(2, 'Fish')
  // what tick did work [on some project] start? how long do i want to wait? etc

})


// event-based system
// emit an event that says 'work:started'
// emit an event that says 'work:ongoing'
// emit an event that says 'work:complete'
// 

export default town;
