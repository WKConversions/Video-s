// Every word on screen, in one place (Dutch). Each claim is backed by harvest/facts.md (topic:fact ids in the comments).
export const COPY = {
  intro: { title: "BMW 330Ci Coupé", sub: "E46 · 2001" },                                      // rdw: first registration 2001-04-09
  body: {
    title: "Coupé-carrosserie",
    line: "Geen enkel plaatwerkdeel gedeeld met de sedan.",                                      // body:distinct-body (BMW ST034)
    spec: "46 mm lager · raamloze deuren",                                                       // body:lower, body:frameless
  },
  bodyTags: { sedan: "sedan", coupe: "coupé", gap: "46 mm" },                                    // body:lower (1415 vs 1369 mm)
  head: {
    title: "Cilinderkop",
    line: "Aluminium, twee nokkenassen en 24 kleppen.",                                           // engine-head:head-material, cams, valves
    spec: "M54B30 · 2.979 cc · 231 pk",                                                          // engine-head:code, displacement, power
  },
  vanos: {
    title: "Dubbel VANOS",
    line: "Verdraait beide nokkenassen traploos, op motorolie.",                                  // vanos:oil-driven, fully-variable, helical
    spec: "Meer koppel bij lage toeren",                                                         // vanos:torque
  },
  vanosTags: { intake: "inlaat 40°", exhaust: "uitlaat 25°" },                                    // vanos:range-intake, range-exhaust (crank)
  gearbox: {
    title: "Automaat",
    line: "Koppelomvormer en planeetwielen: schakelt zelf door vijf versnellingen.",               // gearbox:converter, gears
    spec: "ZF 5HP19 · Steptronic",                                                                // gearbox:type (A5S 325Z)
  },
  diff: {
    title: "Differentieel",
    line: "Draait de kracht 90° naar de achterwielen.",                                           // diff (rear-wheel drive, hypoid)
    spec: "Eindoverbrenging 3,38 : 1",                                                           // gearbox:final-drive (automatic)
  },
  diffTags: { outer: "buitenwiel sneller", inner: "binnenwiel langzamer" },                       // diff: differential action
  outro: { title: "BMW 330Ci Coupé", sub: "Zescilinder · dubbel VANOS · ZF-automaat" },     // recap of the film
};
