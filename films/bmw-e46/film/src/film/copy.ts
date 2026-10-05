// Every word on screen, in one place (Dutch). Each claim is backed by harvest/facts.md (topic:fact ids in the comments).
export const COPY = {
  intro: { title: "BMW 330Ci Coupé", sub: "E46 · 2001" },                                      // rdw: first registration 2001-04-09
  body: {
    title: "Coupé-carrosserie",
    line: "Geen omgebouwde sedan: alle buitenpanelen zijn eigen.",                              // body:distinct-body (verified: outer panels only), three-shared-parts
    spec: "46 mm lager · raamloze deuren",                                                       // body:lower, body:frameless
  },
  bodyTags: { sedan: "sedan", coupe: "coupé", gap: "46 mm" },                                    // body:lower (1415 vs 1369 mm)
  head: {
    title: "Cilinderkop",
    line: "Het dak van de motor: 24 kleppen laten lucht in en uitlaatgas uit.",               // engine-head:what-head-does, valves, head-crossflow
    spec: "Aluminium · M54B30 · 2.979 cc · 231 pk",                                          // engine-head:head-material, engine-code, displacement, power
  },
  vanos: {
    title: "Dubbel VANOS",
    line: "Verdraait beide nokkenassen op motorolie: meer trekkracht onderin.",               // vanos:helical, oil-driven, torque
    spec: "Inlaat én uitlaat · traploos",                                                         // vanos:fully-variable (both camshafts)
  },
  vanosTags: { intake: "inlaat 20°", exhaust: "uitlaat 12,5°" },                              // vanos:range-intake/exhaust in camshaft degrees (BMW: 40°/25° crank)
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
