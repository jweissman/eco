import { boundMethod } from 'autobind-decorator'
import { List } from '../collections'
import { Collection } from '../ecosphere/Collection'
import Model from '../ecosphere/Model'
import { Population } from '../ecosphere/Population'
import { Entity, Person, Quality, Recipe, TimeEvolution } from '../ecosphere/types'
import { BasicEntity } from '../ecosphere/types/BasicEntity'

function unique(arr: any[]) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            // @ts-ignore
            u[arr[i]] = 1;
        }
    }
    return a;
}

type Currency = number
type Order = { [itemName: string]: number }
type Bill = { order: Order, price: Currency, account: Receivable }
interface Receivable {
  receive(items: any[], bill: Bill): Currency
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


// type Product = Entity<ProductKind> & { quality: Quality }
// type ProductKind = BasicEntity & { title: string }
export class Factory extends Model {
  private bills = new List<Bill>()

  // TODO measure delivery rate? 'metric' model??

  // lines: Collection<ProductKind> = new Collection<ProductKind>()
  // products: Population<ProductKind, Product> = new Population<ProductKind, Product>(
  //   "Factory Products"
  // );
  
  // actions: {[actionName: string]: Action} =  {"Place Order": ({ count, deliverTo }: { count: number, deliverTo: Receivable }) => {
  //   this.order(count, deliverTo)
  // }}
  // warehouse = new FactoryWarehouse(this)
  // get inventory() { return this.resources.manage(this.productName) }
  // produces = { [this.productName]: 1 }
  constructor(
    name: string,
    // private consumes: { [key: string]: number } = {}
  ) {
    super(`${name} Factory`)
  }

  product(name: string, consumes: { [resourceName: string]: number }) {
    // const line = this.lines.create({ title: name })

    this.actions.create({ name: `Order ${name}`, act: ({ count, deliverTo }: { count: number, deliverTo: Receivable }) => {
      // console.log("PLACE ORDER", { count, deliverTo })
      this.order(count || 20, name, deliverTo || { receive: () => {
        // console.log("ORDER DELIVERED")
        return 1;
      }})
    }})

    // const { produces, consumes } = this
    // if we want to model as simple recipe...
    this.resources.create(name)
    this.workers.recipes.create({ name, produces: { [name]: 1 }, consumes });
    // this.products.create()
  }

  @boundMethod
  reboot() {
    this.reset()
    this.bills.clear()
    // const { produces, consumes } = this
    // const produce = this.workers.recipes.create({ name: this.productName, produces, consumes })
    this.workers.create('Worker One')
    // this.workers.create('Worker Two')
    // this.workers.create('Worker Three')
    // this.workers.create('Worker Four')
    // this.workers.create('Worker Five')
    // this.workers.list().forEach(assign)

    this.evolve(this.evolution)

    this.policies.create({ name: 'FIFO', manage: () => {
      // console.log("FIFO")
      const { unfulfilled } = this
      if (unfulfilled.length > 0) {
        const firstUnfulfilled = this.unfulfilled(this.bills.first)[0]
        const produceUnfulfilled = this.workers.recipes.lookup(firstUnfulfilled)
        if (produceUnfulfilled) {
          // console.log("PRODUCING", produceUnfulfilled)
          this.workers.list().forEach(worker => this.assign(worker, produceUnfulfilled))
        }
      }
    }})
    this.policies.create({ name: 'Round Robin', manage: () => {
      // console.log("ROUND ROBIN")
      const { unfulfilled } = this
      if (unfulfilled.length > 0) {
        const allUnfulfilled = unique(this.bills.items.flatMap(bill => this.unfulfilled(bill)))
        console.log(allUnfulfilled)
        this.workers.list().forEach(worker => {
          const randomUnfulfilled = allUnfulfilled[Math.floor(Math.random() * allUnfulfilled.length)]
          // console.log("PICK", randomUnfulfilled)
          const produceUnfulfilled = this.workers.recipes.lookup(randomUnfulfilled)
          if (produceUnfulfilled) {
            this.assign(worker, produceUnfulfilled)
          }
        })
      }
    }})
  }

  unfulfilled(bill: Bill) {
    // if (this.bills.count === 0) { return [] }
    // let bill = this.bills.first;
    // can we fulfill *everything* in the order?
    let orderItemNames = Object.keys(bill.order)
    let unfulfilled: string[] = []
    orderItemNames.forEach(item => {
      // console.log(bill.order)
      let order = bill.order[item]
      let amount = this.resources.count(item)
      // console.log({ order, amount })
      if (amount < order) { //} < resources.count(item)) {
        // allFulfilled = false;
        unfulfilled.push(item) // = item;
      }
    })
    return unfulfilled
  }

    assign = (worker: Person, recipe: Recipe) => this.workers.jobs.set(worker, recipe)
// we only work when there is a bill to fulfill
    evolution: TimeEvolution = ({ resources }) => {

      // fulfill orders
      // console.log("Found " + this.bills.count + " bills")
      if (this.bills.count > 0) {
        let bill = this.bills.first;
        // can we fulfill *everything* in the order?
        let orderItemNames = Object.keys(bill.order)
        // console.log({ orderItemNames })
        let allFulfilled = true
        let unfulfilled = null
        orderItemNames.forEach(item => {
          // console.log(bill.order)
          let order = bill.order[item]
          let amount = resources.count(item)
          // console.log({ order, amount })
          if (amount < order) { //} < resources.count(item)) {
            allFulfilled = false;
            unfulfilled = item;
          }
        })
        // console.log({ allFulfilled, unfulfilled }) 

        if (allFulfilled) {
          // we are done
          // console.log({ account: bill.account })
          bill.account.receive([], bill)
          orderItemNames.forEach(item => {
            resources.remove(bill.order[item], item)
          })
          this.bills.remove(bill)
            // if (bill.order[item] < resources.count(item)) {
        }

          if (unfulfilled) {
            if (this.currentPolicy) {
              console.log("---> Apply Policy", this.currentPolicy)
              this.currentPolicy.manage()
            } else {
              // fifo is default 
              // console.log("PRODUCE for UNFULFILLED ORDERS")
              const produceUnfulfilled = this.workers.recipes.lookup(unfulfilled)
              if (produceUnfulfilled) {
                // console.log("PRODUCING", produceUnfulfilled)
                this.workers.list().forEach(worker => this.assign(worker, produceUnfulfilled))
              }
            }
          }
          // console.log({ allFulfilled, unfulfilled }) 

      if (this.bills.count > 0) {
          // console.log("werk")
          // console.log(this.workers.jobs.report)
          this.workers.work({ resources })
        }
        // }
        // orderItemNam

        // console.log("CONSIDER BILL", { bill })
        // let request = bill.order[this.productName];

        // let amount = resources.count(this.productName)
        // console.log({ request, amount })
        // if (amount >= request) {

        //   // console.log(bill.account)
        //   const payment = bill.account.receive(this.productName, request, bill)
        //   // resources.add(payment, 'money') // hmm
        //   resources.remove(request, this.productName)
        //   this.bills.remove(bill)
        //   console.log("Now we have " + this.bills.count + " bills to fulfill")
        // }
        
      } else {
        // do no work
        // console.log('nop')
          // console.log("nah")
      }
    }


  order(count: number, itemName: string, account: Receivable): Bill {
    // console.log({ count })
    const bill: Bill = {
      order: { [itemName]: count },
      account,
      price: count
    }
    this.bills.add(bill)
    return bill
  }

  private get workers() { return this.people }
}
