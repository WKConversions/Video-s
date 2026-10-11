# Missing material and what must not be shown: K.B (2026-10-08)

## What we have
- K.B app-icon tile, 512 px, raster: `../robin-bos/assets/kb/kb-logo-512.png`. It is identical to /favicon-512x512.png on the live site.
- The logotype font: Copperplate, served by the site as `CopperplateCC_Heavy` .otf. Setting "K.B" ourselves in it gives a vector-quality logotype.
- 14 client logos (PNG) and 8 tool logos (Odoo, Supabase, PostgreSQL, Claude, TypeScript, Next.js, n8n, Make) in `../robin-bos/assets/kb/`. Every file was md5-checked against the live site and all match.
- Real work visuals from the site, saved as reference in `harvest/ref-images/`:
  - `case-goteborgsvarvet-admin-dashboard.png` (1833×1118): the real K.B-built admin dashboard. All values read 0.
  - `service-dashboard-abroad-super-admin.png` (2833×1492): the K.B-built "Super Admin Dashboard" for Abroad. Shows 51 Students, 21 Active, and so on.
  - `case-abroad-internships-make-scenario.png` and `case-jongleren-intake-make-scenario.png`: real Make.com scenario graphs, around 1000 px wide.
  - `service-web-olea-site.png` (3385×1971): Olea Hospitality website. The site does not explicitly say K.B built it.
  - `service-mobile-app.png` (545×1080): an internship app mock-up in a phone frame. The client is not named.
  - `case-sif-aqqo-reservations.png`: AQQO's own booking UI, not K.B's work.
  - `about-team-photo.jpg` (5712×4284): three people in suits on a Málaga street, not named on the site.
  - `team-*.png` (500×685 each): portraits of Robin Bos, Linus Kruslock, Tom van Greevenbroek and Youri de Beurs.
  - `case-goteborgsvarvet-runners-photo.jpg`: an event photo of runners.
  - `case-abroad-internships-logo.svg`: the Abroad Internships horizontal logo, in vector.
- Real copy for everything in facts.md: process, services, plans, numbers, cases and quotes.

## What the film would want but the material lacks
1. **A vector K.B logo** (SVG/AI). Only the 512 px tile and the web font exist. Either rebuild it from the Copperplate font in navy and white, or ask the owner for the master file.
2. **Real product UI with live data.** The one K.B-built system dashboard (Göteborgsvarvet) shows only zeros. The Abroad Super Admin is the only populated one, and it is small text. There are no screen recordings of anything working.
3. **Real automation runs.** We have static Make.com graphs only, too small to read node by node. There are no n8n canvases, no agent transcripts, and no before/after of an actual workflow.
4. **Case figures that hold up on screen.** Abroad's "150% cost reduction" and its "200% error reduction" (described as candidate satisfaction) are inconsistent. The usable figures are:
   - Abroad: 21 automations, ~30h a week, +20% best month
   - Jongleren: 70 → 20–30 min per intake, ~40h a month, ~€1,200 a month, 90% fewer errors
   - Göteborgsvarvet: 10/10 satisfaction
5. **Team at work.** The only photos are posed portraits and one posed group shot. There is no candid footage, workspace, whiteboard or screens. The group photo does not name who is in it.
6. **Client permission.** It is unclear whether client logos, quotes and screenshots of client systems are cleared for use in an ad. They are public on the K.B site, but confirm with the owner before naming clients in the film.
7. **Logos for 12 tools.** These are not yet in assets: Apollo.io, GetYourGuide, Zenchef, Aqqo, Pipedrive, Resend, Datadog, Expo, Payload CMS, Vite, Spring Boot, Tanstack. All are fetchable from /api/square-media/file/… if needed.
8. **A Göteborgsvarvet logo file.** Only the case cover graphics exist.
9. **A short end-card line.** The site has no single slogan, so we pick from the verbatim options. Candidates:
   - "The Embedded Tech Partner for Growing Businesses"
   - "We build the systems your business runs on, with you"
   - "Book a Free Discovery Call"
10. **Music and sound.** The site has none.

## What we must NOT show or do
- **The home-page hero video** (`/home/hero-landscape-video.mp4`): the owner ruled it out. Do not download it, take frames from it, describe it, or imitate its look.
- To be safe, also leave out the other site videos. None of them was downloaded or viewed:
  - the service-page hero videos (`ai_automation_hero_video.mp4`, `software_development_hero_video.mp4` and its poster)
  - the 9:16 "K.B in action" clip (`/home/how-kb-works.mp4`)
- Any full-page screenshot of the home page whose top fold shows that hero.
- **The words "Consultancy" and "Kruslock Bos"** anywhere on screen. That includes:
  - the email address hello@kruslockbosconsultancy.com
  - the socials handles @k.bconsultancy
  - the site footer line "Professional consultancy services…"
  - blog SEO titles ending "| K.B Consultancy"
  - The URL kruslockbosconsultancy.com was given by the owner; whether it goes on the end card is the owner's call, since it spells out the full name.
- Anything invented:
  - client names, figures or quotes not in facts.md
  - fake dashboards dressed up as a real client's system
  - invented team members or office photos
  - claims such as "AI-powered" ROI percentages, "trusted by 100+ companies", or awards
- The site's AI-generated or stock illustrations as if they were real work: the robot "AI Agents" art, the integrations and no-code robot art, the trophy illustrations, the Excel and Google Sheets stock images, the five-star illustration.
- AQQO's or Pipedrive's own UI presented as something K.B built.
- Personal contact details from the About page, such as individual phone numbers and personal emails.
- The older positioning, "Automation, Strategy, and Growth" and "expert guidance". The site now says K.B builds and runs systems; it does not sell advice.
