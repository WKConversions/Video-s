// Every word on screen, in one place (Dutch). Each claim is backed by harvest/facts.md (fact ids in the comments).
export const COPY = {
  intro: { title: "BMW 330Ci Coupé", sub: "E46 · 2001" },                                  // rdw-date, rdw-variant
  body: {
    title: "Coupé-carrosserie",
    line: "Geen enkel plaatwerkdeel gedeeld met de sedan.",                                  // body:distinct-body
    spec: "46 mm lager · raamloze deuren",                                                   // body:lower, body:frameless
  },
  bodyTags: { sedan: "sedan", gap: "−46 mm" },
  head: {
    title: "Cilinderkop",
    line: "Aluminium, twee nokkenassen en 24 kleppen.",                                       // engine-head:head-material, cams, valves
    spec: "M54B30 · 2.979 cc · 231 pk",                                                      // code, displacement, power
  },
  vanos: {
    title: "Dubbel VANOS",
    line: "Verdraait beide nokkenassen met oliedruk.",                                       // vanos (pending verification)
    spec: "Meer koppel laag, meer vermogen hoog",
  },
  gearbox: {
    title: "Automaat",
    line: "Vijf versnellingen, schakelt zelf.",                                             // gearbox (pending verification)
    spec: "Koppelomvormer · Steptronic",
  },
  diff: {
    title: "Differentieel",
    line: "Stuurt de kracht 90° naar de achterwielen.",                                      // diff (pending verification)
    spec: "Binnen- en buitenwiel draaien verschillend",
  },
  outro: { title: "BMW 330Ci Coupé", sub: "25-KDB-4" },
};
