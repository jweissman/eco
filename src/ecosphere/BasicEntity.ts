type Rarity = 'mundane'         // common (species) - Orc
            | 'infrequent'      // uncommon (type/job) - Orcish Weaver
            | 'unusual'         // rare (perk) - Red-headed Orcish Weaver
            | 'amazing'         // epic (heroic individual) - Mork, Red-headed Orcish Weaver of Ogira
            | 'extraordinary'   // legendary (unique/aspect) - Mork the Blessed, Red-headed Orcish Weaver of Otira

export type BasicEntity = {
  id: number;
  name: string;
  rarity?: Rarity;
};

export type BasicEntityKind = { name: string }
