# Tells

A tell is a default the thesis never asked for: something that ended up in the film because a model
reaches for it, not because this client's story needed it. It's the reason a film "looks like AI"
even when every frame is clean. `design/anti-ai-design.md` lists the motion fingerprints; this module
is the test that decides whether any pattern, in motion, layout, data or words, has earned its place.

## The thesis is the only authority

At the art-direction step (SKILL.md step 5), write the film's thesis in one sentence and, under it,
an **Allowed patterns:** line that names every pattern the film uses on purpose. Save both in
`storyboard/thesis.md` and print them in the storyboard's project direction, so Karl approves them.

```
Thesis: Bruno turns stalled plans into results, shown with the real things he works on: a project
portfolio that gets unstuck, a week of mentoring sessions, his own stage and his own words.
Allowed patterns: the example portfolio and calendar (labelled "example"), with their invented
project names, statuses and dates.
```

- **Named means named.** A mood word allows nothing: "premium", "editorial" or "bold" don't allow a
  numbered label, a glow or a counter; most tells are the clichés those words summon.
- **A request goes through the thesis.** When the brief asks for a specific thing (a live counter, a
  dashboard), write it into the thesis by name. Afterwards nobody can tell an asked-for pattern from a
  reflex, unless the thesis says so.
- **A tell found in an approved film is reported, never silently changed.**

## The four families

| Family | The test | In a film, for example |
|---|---|---|
| **Invented information** | Does this datum come from the client (`harvest/facts.md`) or the thesis? If neither, it was invented. | figures nobody stated ("10x faster", "10,000+ teams"), fake people ("John Doe", "Acme"), a fake founding year, fake release strings, an interface "screenshot" drawn in boxes that pretends to be the client's real product |
| **Decorative filler** | Does this element carry information, or only texture? | numbered eyebrows ("01 /"), step labels with nothing to sequence, glows and blurred blobs, sparkles and perpetual loops, decorative grids and crosshairs, status dots that mean nothing |
| **Reflex convergence** | Did this choice come from the thesis, or from habit? | three equal cards, the same layout family in every beat, gradient text, glass panels, a centred statement in every scene, the same entrance everywhere, every property of a move starting together on one curve (`motion/animation-grammar.md`), em dashes in the copy |
| **Hollow copy** | Does this line say something true of this client and of no other? | "unlock", "seamless", "elevate", "next level", "solutions", "in today's fast-paced world", a CTA repeated twice |

An interface rebuilt from the client's real product is not a tell; an invented product presented as
theirs is. An example that teaches what the client does is allowed when the thesis names it and the
frame labels it.

## When it runs

- **While writing** the script and the storyboard: read a family's test before writing what it
  governs (the copy against hollow copy, every number and name against invented information, the
  layouts against reflex convergence, each ornament against decorative filler). The cheapest tell is
  the one never written.
- **On the build:** `python3 scripts/film_tells.py <project>` reads the words the film puts on screen
  and reports each finding with `file:line`, its family and its question; figures and names are held
  against `harvest/facts.md`, patterns named in `storyboard/thesis.md` are listed as allowed.
- **By hand,** because no pattern can judge it: a product drawn in boxes that claims to be real, one
  layout family in every beat, the copy register drifting between beats.

Answer each finding in one line (where it comes from, or why it stays), fix the rest, and run it
again. A check that couldn't run (no facts file) is reported as not checked, never as passed.
