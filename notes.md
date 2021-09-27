okay so some quick thoughts about eco!!!

-> would be nice to build out diagrams so we can display individuals' families / houses
-> building groups of houses (great families) might be enough to kickstart cities...

-> need an economic model for towns!

(again want to bootstrap this so:)
-> vegetation, animals, minerals and machines for world model
  * then we can have people operate the machines, dig for minerals, raise/hunt animals.. farm

-> want to build out heightmap some more, explore rendering options
  * three.js over heightmap plus ascii filter might be appropriate for us
  * low-poly trees + buildings could add a lot w/o being too expensive??
  * we discussed not getting distracted by graphics things so...
  * as part of this maybe the main feature is just 'nagivation' of the map, and..
  * when we get to the lowest nav-level, then the next level 'in' is the landscape view
  * note i think the real goal will be zooming in on administrative regions
  * but focusing on specific features -- this bay, this mountain peak -- seems like good fodder
    for iterating on the landscape machinery

-> also want to explore an astrophysical / cosmological model
  * doesn't have to be much more than energy/mass intensity but some model of star formation
    would be interesting

-> industrial dynamics -- opportunities for visualizing things in charts, which is sort
              of different than other viz things so far (but could be useful esp in eg arena)

-> speaking of arena, move that to a game board

-> lots of tasks!!! i see why i kind of have been falling back onto tinkering endlessly
   with languages, but that is satisfying
   * incidentally i want a proper con-lang dev pipeline -- i keep almost sketching a new repo
     for this since it seems so orthogonal to everything
     
-> organization of code is something i've been thinking about more generally
    most of eco is totally upstream from react or any concrete rendering pipeline
    so: we could be a library and support a tiny node executable for running sims in the console
    * regardless having eco itself upstream means a more complicated build
    * maybe explore a lerna monorepo approach here -- we'd have ecosphere (core) and
      then eco-view (react) -- could lower the cost of factoring out major modules
      
    * that said we do want to have some kind of module structure in place for eco
      we have --

        ecosphere/
          core/      -- sim
          languages/ -- conlang support

        eco-view/
          components/ -- ui design elements

    * i will say eco seems very coupled -- i wonder about what eco 2.0 might look like,
      ie taking some of these parameters as the formal remit and reconstructing
      a 'unified' api for managing lots of aspects of things
      opens up opportunities but big cost on the rewrite and very hesitant to rebuild
      working machinery from scratch! but that said some thoughts for why this could
      be compelling:
      -> handling deltas in a more generic way (so that individuals can tap into it for items) 
      -> could approach code structure/architecture a little differently (expecting a bigger project now..)
      -> don't want to get distracted with a second system or do anything dramatic here

--------------------------

layers of models

(cosmos)
--------------------------
world
civilization
society (languages..)
village/town
individual
--------------------------


okay just thinking out loud a bit but sort of daydreaming about...

a pair of explorers in a far future land :)
picking through ruins of an ancient world

it is interesting that *we* (the audience/writers) could know what things mean
english words and signs etc -- but the _characters_ might not know what they are seeing?

i like the idea of exploring our civilization from outside -- this is scifi right? put our moment in a timecapsule and let an 'alienated' other pick it up

[philosophically speaking: _deracination_ of reason itself -- the revelation that our 'universals' were still particularized! (perhaps except for 'beauty'...)]

anyway -- i think the bigger idea is linguistic change -- this sort of started trying to figure out what the "primordial language" of the world should be

but the truth is that geographic forms _aren't_ named until they have a cartographer -- it takes a surveyor from a specific species

maybe that's part of the struggle with defining bays and valleys -- they're sort of loose and will depend on where other administrative districts start and end

my original idea of slow flood-filling to find various things -- i think that's basically the idea but it needs to be done sociologically
ie we need to find proper administrative districts, USING things like natural boundaries / woods etc
and _then_ name them using (geophysical + sociolinguistic) elements

specific geographic features can still get named -- but bays and valleys can hopefully be organically derived? 
alternatively i keep having the thought with bays and valleys that it's basically about finding 'low' points and 'flood filling' up .. but what are the boundary conditions? 

anyway -- i think experimenting with vegetation is good... animal species + mineral population
but naming is still really interesting here -- and really the problem of geographic identification of different features

really what IS a valley -- i think we mean to identify 'bowl-shaped depressions' in the landscapes -- really a bay is the same thing? ideally it's 'fenced in' on three sides?

just a thought but honestly sphere-fitting may be closest to the thing i'm trying to articulate/elaborate here!!

ie where does a ball end up roll into the landscape -- but i feel like it's calculable (ie analytically), (although) it does feel weirdly like gradient descent -- i think it sort of is the same??

---
