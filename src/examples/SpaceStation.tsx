import Model from '../ecosphere/Model';

// would be interesting to have parts as separate models
// ie a model for the drive engine, the power system... :D

export class SpaceStation extends Model {
  protected controls = {
    laboratory: this.machines.create('Science Lab Controls'),
    engineering: this.machines.create('Engineering Controls'),
    hab: this.machines.create('Habitat Controls'),
    all: this.machines.create('Global Systems Controls'),
  }
  protected habitat = {
    o2: this.resources.create('Air'),
    h20: this.resources.create('Water'),
  }
  private core = {
    power: this.resources.create('Power'),
    cpu: this.resources.create('Compute'),
    thrust: this.resources.create('Thrust'),
    xen: this.resources.create('Xenocite'),
  }

  constructor(name: string) {
    super(name);
    this.core.power.add(100);
    this.core.thrust.add(0);
    this.core.cpu.add(100);
    this.core.xen.add(100);

    this.habitat.o2.add(100);
    this.habitat.h20.add(100);
  }

  // static orbital(name: string) {
  //   let station = new SpaceStation(name + " Orbital");
  //   station.core.power.add(1000)
  // }
}
