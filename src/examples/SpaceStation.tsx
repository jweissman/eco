import Model from '../ecosphere/Model';

export class SpaceStation extends Model {
  protected controls = this.machines.create('Control Panel')
  protected habitat = { o2: this.resources.create('Air') }
  private core = { power: this.resources.create('Power') }
  constructor(name: string) {
    super(name);
    this.core.power.add(100);
    this.habitat.o2.add(100);
  }
}
