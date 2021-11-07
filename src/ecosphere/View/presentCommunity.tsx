import { Tile } from "./Tile";
import { Community } from "../Community";
import { presentIndividual } from "./presentIndividual";

export function presentCommunity(community: Community) {
  return <Tile title={community.name} key={community.id}>
    <ul aria-label='People'>
      {community.obscured ? community.list().map(individual => <li key={individual.id}>{individual.name}</li>)
                          : community.list().map(presentIndividual(community.report))}
    </ul>
  </Tile>;
}
