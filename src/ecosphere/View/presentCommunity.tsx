import { Tile } from "./Tile";
import { Community } from "../Community";
import { presentIndividual } from "./presentIndividual";


export function presentCommunity(community: Community) {
  return <Tile title={community.name} key={community.id}>
    <ul aria-label='People'>
      {community.list().map(presentIndividual(community.report))}
    </ul>
  </Tile>;
}
