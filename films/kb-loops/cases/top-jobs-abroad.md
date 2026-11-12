# Top Jobs Abroad: K.B case loop

Source: https://kruslockbosconsultancy.com/client-cases/top-jobs-abroad (fetched 12 Nov 2026). Only these facts go on
screen.

## Facts (case page)
- **Title:** "Helping Top Jobs Abroad Grow Beyond Its Founders". Top Jobs Abroad connects multilingual professionals
  with career opportunities across Europe. K.B joined their team as a growth partner: business development plus
  software, so the founders can focus on what they do best.
- **Challenge:** a competitive international recruitment market, more than ten language markets. Much of the day-to-day
  rested with the founders (managing candidates, maintaining employer relationships, overseeing operations), leaving
  limited time to pursue new business. They needed additional commercial capacity without losing focus on existing
  clients and candidates.
- **K.B's approach:** business development (identify and approach potential employers), software development (organise
  opportunities, track relationships, manage follow-ups without adding to the founders' workload), partnership
  development (new suppliers and strategic partners).
- **Results:** 3 relationship types (new relationships with employers, suppliers and strategic partners within the first
  two months); 2 months (early growth results); 1 growth partner (continuous business development). Quote: "Working
  with Robin and the team at K.B is like having an integrated growth machine, always on the lookout for new
  opportunities." (Top Jobs Abroad, Founder).

## Brand (topjobsabroad.com, measured)
- Logo: "TOP JOBS / ABROAD" in heavy geometric caps, the O of JOBS is a globe showing Europe. The site uses it white on
  navy; the K.B case page shows it navy. Saved from the site's own `logo.png` (alpha kept, recoloured):
  `public/cases/top-jobs-abroad/tja-logo-navy.png`, `tja-logo-white.png`.
- Colours (site CSS, counted): navy `#001F5B` (header, hero overlay, text), gold `#C8A84B` (buttons, "Our Focus",
  eyebrows, accents; darker `#A8882E`, lighter `#E8C96A`), pale blue-grey `#E8EDF5` (sections).
- Type: a high-contrast serif for headlines (Playfair-style), a geometric sans for body. Not used: Montserrat carries
  all text.
- Typical visual: a navy-tinted photo of a European city with "Your Future / Our Focus" (gold) and gold pill buttons;
  "Featured Opportunities" job cards with a city-photo header, a navy code circle ("AM", "NL"), a flag + city line and
  gold-tinted language pills (`tja-site-ref.jpg`, `tja-site-ref2.jpg`).

## Loop
Concept: "Beyond the founders' circle". One white hub disc on the left of centre is the founders' world: two navy
founder avatars with gold heads, the Top Jobs Abroad logo on a name pill on its rim, and three task chips (candidates,
clients, operations) racing round them inside a tight navy boundary ring. Outside the ring, on the right, three dashed
empty slots wait, and gold pings go off in them unanswered; a reach line from the founders shoots out, hits the ring and
recoils. The K.B tile lands on the ring at 3 o'clock and the ring opens round it like a gate. K.B grows the network out
through the gap: three buds become white relationship cards (Employers, Suppliers, Partners, navy icon circles like the
site's code circles, a gold rule under the label), linked to the tile by dotted lines. Inside, the chips slow to a calm
orbit. Two waves of gold opportunity dots (with short trails) run the links through the tile into the founders, who
nod with a gold ripple; each card gets a gold check badge while the figure rolls 1, 2, 3. The cards are drawn back into the tile, the ring closes, the tile pops off and the chips race again: the
opening.
Flourish: "the budding". The K.B tile swells and a gooey bud bulges out of its side (metaball), stretches along the
path on a thinning neck, pinches off with a wobble, and the neck breaks into droplets that shrink into the dotted link
line; the bud lands in the slot as the card's navy icon circle and the white card inflates out of it. At the end the
reverse: each card shrinks to a bud that is sucked back along its link and merges into the tile (cells dividing, then
merging).

Layout: all text in a centred top band (y 110-300); hub disc centre (610, 640), r 230; K.B tile on the ring at
(840, 640); the three cards on an arc to the right (x 1250/1395/1250); the whole picture (not the text) is drawn at
scale 1.1 round (970, 640). Different from Abroad Internships (one centred
planner card, vortex into the tile), Göteborgsvarvet (start grid, converging lanes, donut card), JongLeren (juggling
over a card, text column right) and Social Impact Factory (two symmetric islands bridged by a cable).

On screen: "No time for new business" / "Growth beyond the founders" / "3" + "new relationship types" + "in 2 months";
small card labels "Employers", "Suppliers", "Partners".

Checks (final render): flow.py 0 jerks; seam.py OK (seam 0.16%, median step 0.13%); 600 frames, 1920x1080, 60 fps.
