import { boundMethod } from 'autobind-decorator'
import { List } from '../collections'
import Model from '../ecosphere/Model'
import { Person, TimeEvolution } from '../ecosphere/types'

type Currency = number
type Order = { [itemName: string]: number }
type Bill = { order: Order, price: Currency, account: Receivable }
interface Receivable {
  receive(name: string, count: number, bill: Bill): Currency
}

// assemblies of models with flows between

class Warehouse extends Model {}
class Distributor extends Model {}
class Retailer extends Model {}
class Customer extends Model {}

// interlinked with flows of orders and transactions and goods -- 'information flows'

// okay, but the idea is you place an order with the warehouse
// class FactoryWarehouse extends Model {
//   private bills = new List<Bill>()
//   private get inventory() { return this.resources }
//   get productName() { return this.factory.productName }
//   constructor(private factory: Factory) {
//     super(`${factory.name} Warehouse`)
//     this.evolve(({ resources }) => {
//       // can we fill the bill?
//       let bill = this.bills.first;
//       let request = bill.order[this.productName];
//       if (resources.count(this.productName) > request) {
//         // we can fill it!
//         const payment = bill.account.receive(this.productName, request, bill)
//         resources.add(payment, 'money');
//       }

//       // ok + can we accept any of the factory products into inventory?
//     })
//   }

//   order(count: number, account: Receivable): Bill {
//     const bill: Bill = {
//       order: { [this.productName]: count },
//       account,
//       price: count //this.estimate(count)
//     }
//     this.bills.add(bill)
//     return bill
//   }
//   // static estimate() { this.baseline * count }
// }

export class Factory extends Model {
  // warehouse = new FactoryWarehouse(this)
  get inventory() { return this.resources.manage(this.productName) }
  private bills = new List<Bill>()
  produces = { [this.productName]: 1 }
  constructor(
    public productName: string,
    private consumes: { [key: string]: number } = {}
  ) {
    super(`${productName} Factory`)
  }

  @boundMethod
  reboot() {
    this.reset()
    const { produces, consumes } = this
    const produce = this.workers.recipes.create({ name: this.productName, produces, consumes })
    this.workers.create('Worker One')
    const assign = (worker: Person) => this.workers.jobs.set(worker, produce)
    this.workers.list().forEach(assign)

    // we only work when there is a bill to fulfill
    const evolution: TimeEvolution = ({ resources }) => {
      this.workers.work({ resources })

      // fulfill orders
      let bill = this.bills.first;
      if (bill) {
        console.log("CONSIDER BILL", { bill })
        let request = bill.order[this.productName];
        let amount = resources.count(this.productName)
        console.log({ request, amount })
        if (amount >= request) {
          const payment = bill.account.receive(this.productName, request, bill)
          resources.add(payment, 'money')
          resources.remove(request, this.productName)
          this.bills.remove(bill)
        }
      } else {
        // do no work
      }
    }
    this.evolve(evolution)
  }

  order(count: number, account: Receivable): Bill {
    const bill: Bill = {
      order: { [this.productName]: count },
      account,
      price: count
    }
    this.bills.add(bill)
    return bill
  }

  private get workers() { return this.people }
}
