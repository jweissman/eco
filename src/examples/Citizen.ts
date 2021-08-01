import { Simulation } from "../ecosphere/Model/Simulation";

// hmm need a view for the simulation
class Citizen extends Simulation {
  constructor() { super('Citizen'); }
}

export default new Citizen();
