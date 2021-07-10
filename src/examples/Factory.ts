import { boundMethod } from 'autobind-decorator'
import { List, Sequence } from '../collections'
import { Collection } from '../ecosphere/Collection';
import Model from '../ecosphere/Model'
import { ManageStocks, Person, Recipe, TimeEvolution } from '../ecosphere/types'
import { unique } from '../ecosphere/utils/unique';
import { where } from '../ecosphere/utils/where';

type Currency = number
type Order = { [itemName: string]: number }
type Bill = { id: number, order: Order, price: Currency, account: Receivable }
interface Receivable {
  receive(items: any[], bill: Bill): Currency
}

type EventKind = 'order:fulfilled'
type Event = { id: number, name: string, description: string, at: number, kind: EventKind }
export class Factory extends Model {
  events = new Collection<Event>()
  emit(event: EventKind, title?: string, message?: string) {
    if (title) { console.log(title) } //"EVENT", event)
    this.events.create({ name: title, description: message, kind: event, at: this.ticks })
    // throw new Error('Method not implemented.');
  }
  private bills = new List<Bill>()

  metrics = {
    'Production Speed': () => this.deliveryRate,
    'Total Fulfillments': () => this.fulfillmentEvents.length,
    'Orders In Queue': () => this.bills.count
  }

  metricGrain = 100
  get deliveryRate() {
    // let grain = 100
    // check for event order:fulfilled??
    // return this.events.list().filter(e => e.at > this.ticks-grain).length / grain
    return this.recentEvents.filter(where('kind', 'order:fulfilled')).length / this.metricGrain
  }

  get recentEvents() {
    return this.events.list().filter(e => e.at > this.ticks-this.metricGrain)
  }

  get fulfillmentEvents() {
    return this.events.list().filter(where('kind', 'order:fulfilled'))
  }

  // TODO measure delivery rate? 'metric' model??

  constructor(
    name: string,
    // private consumes: { [key: string]: number } = {}
  ) {
    super(`${name} Factory`)
  }

  product(name: string, consumes: { [resourceName: string]: number }) {
    // const line = this.lines.create({ title: name })

    this.actions.create({ name: `Order ${name}`, act: ({ count, deliverTo }: { count: number, deliverTo: Receivable }) => {
      this.order(count || 20, name, deliverTo || { receive: () => {
        return 1;
      }})
    }})

    this.resources.create(name)
    this.workers.recipes.create({ name, produces: { [name]: 1 }, consumes });
  }

  @boundMethod
  reboot() {
    this.reset()
    this.bills.clear()
    // this.workers.create('Operations Chief')
    // this.workers.create('Engineer')
    // this.workers.create('Plant Manager')

    this.evolve(this.evolution)

    this.policies.create({ name: 'FIFO', manage: () => {
      // const { unfulfilled } = this
      // if (unfulfilled.length > 0) {
        const firstUnfulfilled = this.unfulfilled(this.bills.first)[0]
        const produceUnfulfilled = this.workers.recipes.lookup(firstUnfulfilled)
        if (produceUnfulfilled) {
          this.workers.list().forEach(worker => this.assign(worker, produceUnfulfilled))
        }
      // }
    }})
    this.policies.create({ name: 'Round Robin', manage: () => {
      // const { unfulfilled } = this
      // if (unfulfilled.length > 0) {
        // console.log({ items: this.bills.items })
        // okay, so we'll ONLY work on things we can't have *any* orders of..
        const allBillsRequested = unique(this.bills.items.flatMap(bill => {
          return this.unfulfilled(bill)
        }))
        // console.log("ROUND ROBIN", { billCount: this.bills.count, allUnfulfilled, billItems: this.bills.items })
        this.workers.list().forEach((worker, i) => {
          const nextUnfulfilled = allBillsRequested[(i % (allBillsRequested.length))]
          const produceUnfulfilled = this.workers.recipes.lookup(nextUnfulfilled)
          if (produceUnfulfilled) {
            this.assign(worker, produceUnfulfilled)
          }
        })
      // }
    }})

    this.choose('FIFO')
  }

  unfulfilled(bill?: Bill) {
    if (bill === undefined) { return [] }
    let orderItemNames = Object.keys(bill.order)
    let unfulfilled: string[] = []
    orderItemNames.forEach(item => {
      let order = bill.order[item]
      let amount = this.resources.count(item)
      if (amount < order) {
        unfulfilled.push(item)
      }
    })
    // console.log("Unfulfilled from bill: " + inspect(bill.order))
    return unfulfilled
  }

  assign = (worker: Person, recipe: Recipe) => this.workers.jobs.set(worker, recipe)
  evolution: TimeEvolution = ({ resources }) => {
    this.manage(resources) 
    if (this.bills.count > 0) {
      this.workers.work({ resources })
    }
  }


  orderIds = new Sequence()
  order(count: number, itemName: string, account: Receivable): Bill {
    const bill: Bill = {
      id: this.orderIds.next,
      order: { [itemName]: count },
      account,
      price: count
    }
    this.bills.add(bill)
    return bill
  }

  private get workers() { return this.people }
  private manage(resources: ManageStocks) {
    if (this.bills.count === 0) return;

    // const bill = this.bills.first;
    this.bills.each(bill => {
      const orderItemNames = Object.keys(bill.order)
      const unfilled = this.unfulfilled(bill)
      const allFulfilled = unfilled.length === 0

      if (allFulfilled) {
        bill.account.receive([], bill)
        orderItemNames.forEach(item => {
          this.resources.remove(bill.order[item], item)
        })
        this.bills.remove(bill)
        this.emit('order:fulfilled', `An order for ${orderItemNames.join(',')} has been fulfilled`)
      }
    })

    if (this.currentPolicy) {
      this.currentPolicy.manage()
    } else {
      console.warn("No labor policy selected!")
    }
  }
}
