import Model from '../ecosphere/Model'
import { TimeEvolution } from '../ecosphere/types'

export class Factory extends Model {
  constructor(private productName: string, private consumes: { [key: string]: number } = {}) {
    super(`${productName} Factory`)
    // this.reboot()
  }

  reboot() {
    this.reset()
    console.log(`new ${this.productName} Factory setting up!!`)
    const { consumes } = this
    const produces = { [this.productName]: 1 }
    const produce = this.workers.recipes.create({
      name: this.productName,
      produces, consumes
    })

    // create workers
    this.workers.create('Worker One')

    this.workers.list().forEach(worker => {
      this.workers.jobs.set(worker, produce)
    })

    this.evolve(({ resources }) => this.workers.work({ resources }))
  }

  private get workers() { return this.people }
}
