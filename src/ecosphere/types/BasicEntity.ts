// type Rarity = 'mundane'         // common (species) - Orc
//             | 'infrequent'      // uncommon (type/job) - Orcish Healer
//             | 'unusual'         // rare (perk) - Skillful Orcish Healer
//             | 'amazing'         // epic (heroic perk + backstory) - Mork of Ogira, Warm-hearted Skillful Orcish Healer
//             | 'extraordinary'   // legendary (unique aspect + mechanic) - eg:
                                //
                                // Mork the Kind Teacher, Warm-hearted Skillful Orcish Healer of Ogira:
                                //
                                // Surviving the Conflict era gives Mork the long view on existence.
                                //
                                // Once a captain in the Dread Legion, he has devoted the remainder of his life
                                // to practicing the art of healing after a lifetime of war.
                                //
                                // His skill has attracted a flock of followers but despite their offers of
                                // support he nevertheless now lives simply, many nights sleeping rough as he
                                // travels the world. 
                                //
                                // Mork's Abilities: 
                                //
                                //   * Mork's Memory: a long operating history across Avernus means Mork gains +5 on all lore checks
                                //   * Lay on Hands: his work is good! healing from Mork is always 100% effective
                                //   * Fisher of Men: good-aligned orcs may speak with Mork to gain 'Mork's Teaching' perk for as long as they practice medicine
                                //                    and remain good-aligned (Mork's Teaching: +3 to healing, lore and courage checks)

export type BasicEntity = {
  id: number;
  name: string;
  // rarity?: Rarity;
};

// export type BasicEntityKind = { name: string }
