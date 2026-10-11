# Maps

Karl's favourite way to show place, and the scenes that get the best feedback: the dot map of EMEA spreading out
from Málaga (Amargier Advisory) and the map of Europe with a plane flying from Copenhagen to Athens (TopJobsAbroad).
Know them; don't put a map in every film.

## When a map is the right picture

Use a map when the line is about where something happens:
- **a place:** a head office, a city, "based in Málaga";
- **a reach:** national, regional or worldwide ("across EMEA", "in 40 countries", "all over Europe");
- **travel or a move:** relocation, a route, a journey, a delivery from A to B, working abroad;
- **a distance or a connection:** offices that work together, partners across borders, remote teams;
- **a specific place** the viewer must recognise (a country, a region, a city on a coast).

Don't use a map when place is incidental ("we're a Dutch company" in passing), when the line is about the product
or the person, or when the film already used one for another idea. One map moment per film is normal; two only
when the story travels (a start and a destination).

## The two map styles

| | Dot map (Amargier) | Country map (TopJobsAbroad) |
|---|---|---|
| Looks like | A grid of round dots where there is land, soft at the edges | The real country shapes, pale land, white borders, highlighted countries a shade deeper |
| Says | Reach and potential: a region, a network, presence | Real geography: which countries, a route, a move |
| Best with | Pins, links drawn between cities, a ripple from home | A route with a plane or a line, pins, country highlights, a zoom into a city |
| Build | `map_make.py dots`, `DotMap` | `map_make.py countries --highlight`, `CountryMap` |

Colours come from the brand: land in the brand's palest tint, highlights one step deeper, the route or pins in the
accent. On a bright brand the map sits on the page colour, never on a dark static background.

## How they move (what worked)

**Amargier, "technology businesses across EMEA":**
- the brand mark moves from the centre and lands on Málaga as the home pin (≈0.6 s on `MOVE`), the city name fades
  in under it, and a ripple goes out from the pin every 1.5 s;
- on the next phrase the EMEA dots spread out from Málaga like a wave (`DotMap` `reveal` over ≈1.7 s on `MOVE`):
  the map grows out of the place the line is about, it doesn't appear;
- on "partnership" the links draw between cities one after another (each 0.5 s, 0.055 s apart), dashed as
  potential, then solid on "commercial";
- the map clears from the far edge back to Málaga (≈0.9 s) as the next scene grows out of the pin.

**TopJobsAbroad, "from the start through to the end":**
- the page moves aside and the map comes in with it; you are in Copenhagen, the role is in Athens;
- a faint dotted guide draws the route first (≈0.6 s), then the plane flies it, leaving a gold line; the six steps
  of their process light up along the route as the plane passes;
- the plane lands; the documents fan out of the Athens pin; a circle opens out of the pin into Athens itself (a
  mask out of the place, `motion/transitions.md`).

## The rules now

- **The map grows out of the place.** A dot wave from the city, a pin that lands first, a route that starts where
  the person is. Never a map that fades in whole and then gets pointed at.
- **Smooth before everything** (K.B, approved). Frame the places the line names from the start, so nothing has
  to pan. If the story travels beyond the frame, move the map itself on a long S (`EASE.longS`, 24–40 f) or let
  the route lead (the plane at constant speed, `B10`); never a quick pan or a zoom release (`motion/camera.md`).
  Going into a city is a zoom-through of the pin (`B16`) or a mask out of it, not a camera dive.
- **One thing moves at a time:** the pin lands, then the wave, then the links; the route, then the steps along it.
- **The names are big enough** to read on a phone (city labels at least 28 px, on the page colour, never on top of
  dots); three or four named places at most.
- **Truth:** only the places the client actually works in; no invented offices or routes.
- **Sound:** a soft pop or tick when a pin lands, an airy swell under a wave, a light whoosh under a flight;
  quiet, the map is a calm picture (`motion/sound.md`).

Speed graphs that suit maps (`motion/speed-graphs.md`): `B2` long S for a pin travelling city to city, `B10`
constant speed for a plane cruising, `B11` for a route line drawing, `B8` with one small bounce for a pin dropped in
a playful film, `B9` for a pin and its city name, `B15` for a pulsing pin on a hold, `B16` to go into a city.

## Building one

1. Choose the region and the places from the script and the facts file.
2. Make the data, fitted to the frame (Natural Earth, public domain):
   ```
   python3 scripts/map_make.py dots --bbox=-26,64,-36,71 --cities "Málaga,London,Dubai" --frame 1250,545,960 --out src/map.json
   python3 scripts/map_make.py countries --bbox=-11,32,34,61 --highlight "Spain,Greece,Sweden" --cities "Copenhagen,Athens" --out src/map.json
   ```
   `--bbox=` needs the `=` (a leading minus). `--city "Name:lon,lat"` adds a place that isn't built in.
3. Draw it with `scripts/maps.tsx`: `DotMap` (a wave from a place, `out` to clear it), `CountryMap` (highlights
   fill in with `hl`), `Pin` (lands with one ring), `Route` (an arc with a guide, the travelled line and a head).
4. Run the motion probe on the build; a map scene must pass at the film's style like every other scene.
