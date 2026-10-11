# Asset strategy

For every scene, decide what it is made of: pure motion graphics, shapes, typography, icons, UI, brand
assets, charts, an external image, external video, a screenshot, a generated image, a texture, or a
combination. Decide mixed media once, at the art-direction stage (does this film combine photography
with graphics?), not scene by scene; a film that switches material every shot looks assembled.

## Order of preference

1. **The client's own assets:** logo, product screens, product photos, team photos, real numbers,
   real customer names as their site presents them (harvesting below).
2. **Built graphics:** shapes, type, rebuilt UI, charts, in the chosen style.
3. **External imagery** (photo, video, generated): only when it genuinely improves the scene.

Good reasons for an external image: real human context, a recognizable physical object, an
environment or location, lifestyle, emotion, a real-world example, product context, a strong visual
metaphor, or deliberate contrast between reality and digital graphics. Never use imagery as
decoration.

## Style and truth constraints

- **The film's direction decides how imagery may appear:** follow the Imagery line in its definition
  (`styles/README.md`). If the film truly needs what the direction leaves out, change the direction for
  this film on purpose, once, at art direction, and say so in the notes; never break it scene by scene.
- **Never invent the client's facts:** features, numbers, customers, results. Never present stock
  people as the client's customers or team; when a line is about the team, use real team photos or
  no people.
- **Third-party logos** (integrations, customers) appear only as the client's site presents them.
- **Licensing:** external photos and footage must be licensed for commercial use; record source and
  license with the asset. Generated images are for illustrative context only, never as proof.
- **Resolution:** treat low-resolution screenshots as references for rebuilding, never enlarge them.

## Harvesting the client's website

Before the storyboard, collect everything the video can use from the client's website and save it in
the project's `assets/` folder with an `assets.md` listing each file, what it is and where it came
from. For client work the client's brand wins: use supplied brand assets, otherwise take colors,
fonts, radii and easing from their live site (computed CSS) and say where the values came from.

Collect:
- **Logo:** SVG first (inline in the header, or an .svg file), otherwise the largest PNG; light and
  dark versions if the site has both; the favicon and share image as fallbacks.
- **Brand:** colors (CSS variables, buttons, links, backgrounds), fonts (families, weights and tracking
  for headlines and body), corner radii, shadows, button style, easing curves.
- **Product:** interface screenshots and mockups, product photos, illustrations, icon style (outline
  or filled).
- **Words and proof:** headline and tagline, value propositions, feature and product names, numbers,
  pricing, calls to action, testimonials, customer logos.
- **Tools:** the integrations and platforms the product works with.
- **Other pages** when they matter: product or features, pricing, about.

How:
1. **With a browser tool** (the complete route): open the site, let it load, scroll once so lazy
   content appears, and run `scripts/site_extract.js` in the page. It returns brand values, the logo's
   markup, image addresses and the page text. Save the logo's SVG markup straight to a file. Download
   images inside the page with `scripts/grab.js`, which returns each file as base64 to decode and
   save; when an image can't be fetched that way, keep a screenshot of it instead. Screenshot the hero
   and product sections for reference.
2. **Without a browser tool:** fetch the pages as text for the copy, names and image addresses, and
   ask Karl for the logo and product screenshots.
3. The build machine usually can't download from websites directly. Try once, then use the browser.

## Sourcing royalty-free photos and footage

When a scene needs external imagery the client doesn't have, source it yourself before writing an asset
request: `scripts/stock.py` searches the sources that answer scripts from the build sandbox, measures
every candidate, and keeps the credits.

1. Write the query from the scene's need, not its topic: the subject, the action, the light ("tourist
   with phone sunny street", not "travel").
2. `python3 stock.py search "<query>" --kind video --out stock/` (Mixkit clips; free licence, no credit)
   or `--kind photo` (Openverse: CC0, public domain, CC BY, CC BY-SA from Flickr, Wikimedia and others;
   add Pexels photos by ID with `--pexels`, IDs found by a web search such as "site:pexels.com rome
   street"). Add `--min-width 1600` for full-frame photos.
3. Judge `stock/candidates.png` against the scene, then the numbers:
   - **room** is the calmest third: put the type there, or pick a frame whose room matches the layout;
   - **busy** is the edge density: under about 0.1 sits behind type, over 0.2 needs a scrim or a blur;
   - **camera** (static, drift, pan, fast) must match the film's camera: a handheld pan cut into a
     film of slow pushes reads as stock; a static clip can take the film's own push;
   - **cuts inside** must be 0 for a clip used as one shot;
   - **palette**: the three main colours, against the film's palette; grade towards it or skip it.
4. `python3 stock.py get stock/candidates.json 3,7 --to public/footage` downloads the full sizes (the
   best free file, after checking the clip's licence on its own page) and writes `CREDITS.md` and
   `credits.json`. A clip below 1080p is flagged: use it small, behind blur, or not full frame.
5. Copy every credit line that isn't "not required" into the film's README and, for CC BY and BY-SA,
   into the delivery description. CC BY-SA also asks that changed versions keep the same licence:
   prefer CC0, public domain, Pexels and Mixkit for anything you transform heavily.

Unsplash, Pixabay and the Pexels search pages block scripts; Pexels images still load by ID. Never use
an image whose licence you can't record. When nothing fits after two searches, write the asset request
below and build the scene without it.

## What the harvest writes

Three files in the project, before the storyboard; the truth and brand reviews hold the film against
them (`evaluation/art-director.md`, `evaluation/tells.md`):

- **`harvest/facts.md`**: every claim the film may make, each with its source page: services, names,
  figures, quotes with their authors, awards. A figure, name or logo not in this file doesn't go on
  screen. Examples that teach (a sample portfolio, a sample calendar) are listed apart, as examples,
  and labelled "example" in the frame.
- **`harvest/missing.md`**: what the film would want and the client doesn't have (no customer logos,
  no results, no product screens). The storyboard works around it or asks; it never invents it.
- **`brand.json`**: the brand's DNA in three parts.
  - *System*, measured: colours from screenshots and the logo with `scripts/brand_measure.py measure`
    (k-means in CIELAB, the median pixel of each cluster; never hex values judged by eye, which drift
    toward familiar defaults by a ΔE of 10 or more), the film's colour tokens, fonts and weights,
    radii, shadows, the site's own easing if it has one.
  - *Style*, in words: mood, visual language, imagery (photography or illustration, light or dark),
    whitespace, the brand's voice.
  - *Effects*: what the site does beyond plain layout (3D, particles, scroll effects, video), so the
    film can borrow it or decide not to.

Real assets beat recreations: when the site has the photo, the logo or the screen, take it from the
site. Measure the film against `brand.json` on the test frames (`brand_measure.py verify`: how much of
each frame is drawn in colours the brand doesn't have, and whether the accent appears) and compute
contrast for every text colour on its background (`brand_measure.py contrast`): 4.5:1 for body text,
3:1 for large type. Photos are off-palette by nature: grade them toward the brand (a desaturate and a
warm or cool cast) when one dominates a frame with a colour the brand never uses.

## Asset requests

When a scene needs an external image or clip that isn't at hand, write an asset request. Put all
requests in the storyboard's "Asset requests" section, and as a JSON block, so Karl or a future tool
can fulfil them (`production/tool-requests.md`).

```
ASSET ID: S04-A
SCENE: 4
ASSET TYPE: Photography | Photo cut-out | Stock video | Generated image | Screenshot | Texture
SOURCE PREFERENCE: client site > licensed stock > generated
SEARCH QUERY:
SUBJECT:
ACTION:
COMPOSITION:
SUBJECT POSITION:
BACKGROUND:
LIGHTING:
MOOD:
COLOR CHARACTERISTICS:
CAMERA ANGLE:
ASPECT RATIO:
CROP REQUIREMENTS:
LICENSE: commercial use required
WHY THIS ASSET IS NEEDED:
FALLBACK IF NOT FOUND: what the scene becomes without it
```

Example:

```
ASSET TYPE: Photography
SEARCH QUERY: startup founder reviewing analytics on laptop dark modern office
SUBJECT: Entrepreneur at laptop
ACTION: Looking at analytics
COMPOSITION: Medium shot with negative space on right
SUBJECT POSITION: Left third
LIGHTING: Soft cinematic low-key
MOOD: Focused, premium, ambitious
ASPECT RATIO: 16:9
CROP REQUIREMENTS: Must remain usable when cropped vertically
WHY THIS ASSET IS NEEDED: Gives the abstract concept of business growth a human context.
FALLBACK IF NOT FOUND: The growth line draws across the frame without the person.
```
