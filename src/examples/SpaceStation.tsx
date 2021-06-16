import Model from '../ecosphere/Model';

export class SpaceStation extends Model {
  protected controls = this.machines.create('Control Panel')
  protected habitat = {
    o2: this.resources.create('Air'),
    h20: this.resources.create('Water')
  }
  private core = {
    power: this.resources.create('Power'),
    thrust: this.resources.create('Thrust')
  }
  constructor(name: string) {
    super(name);
    this.core.power.add(100);
    this.core.thrust.add(0);

    this.habitat.o2.add(100);
    this.habitat.h20.add(100);
  }

  static orbital(name: string) {
    let station = new SpaceStation(name + " Orbital");
    station.core.power.add(1000)
  }
}
