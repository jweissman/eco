import Model from '../ecosphere/Model';

export class SpaceStation extends Model {
  private controls = this.machines.create('Control Panel')
  private core = { power: this.resources.create('Power') }
  private habitat = { o2: this.resources.create('Air') }

  constructor(name: string) {
    super(name);
    this.core.power.add(100);
    this.habitat.o2.add(100);
  }
}
