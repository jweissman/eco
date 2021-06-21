import { boundMethod } from 'autobind-decorator'
import Model from '../ecosphere/Model'
import { Person } from '../ecosphere/types'

export class Factory extends Model {
  produces = { [this.productName]: 1 }
  constructor(private productName: string, private consumes: { [key: string]: number } = {}) {
    super(`${productName} Factory`)
  }

  @boundMethod
  reboot() {
    this.reset()
    console.log(`new ${this.productName} Factory setting up!!`)
    const { produces, consumes } = this
    const produce = this.workers.recipes.create({
      name: this.productName, produces, consumes
    })
    this.workers.create('Worker One')
    const assign = (worker: Person) => this.workers.jobs.set(worker, produce)
    this.workers.list().forEach(assign)
    this.evolve(({ resources }) => this.workers.work({ resources }))
  }

  private get workers() { return this.people }
}
