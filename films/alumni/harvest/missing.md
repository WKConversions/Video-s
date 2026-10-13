# Alumni: what the site does not have (do not invent it)

Harvested 2026-10-13 from https://small-salad-e287.raphael-0d6.workers.dev/ (one page, no other same-host pages; external links only to jongleren.es and kruslockbosconsultancy.com).

| A film would want | On the site? | What to do instead |
|---|---|---|
| A product / app UI (dashboard, profile, matching screen, job list) | No. Alumni is a conversation-led service; there is no platform, app, login or listing | Do not draw a fake app as if it were the product. SaaS feel can come from the site's own components: pill nav, audience strip, cards, the 01-04 journey route, chips, all in brand colours; label any UI-like card with the site's own words |
| Numbers (graduates placed, countries, partners, success rate, years) | None anywhere | No counters, stats or "1,000+" style claims |
| Named destination countries or cities | None. The two photos look like Split (Croatia) and Lisbon (Portugal) but the site never names them | Show places generically; no country names, flags or map pins with names. "New countries" (VO) can be shown as abstract routes / dots, not labelled countries |
| Photos of people (graduates, employers, recruiters, team) | None. Both photos are city views without visible people | No faces from the site. If people are wanted, ask the client or use clearly generic stock (and do not caption it as Alumni users) |
| Partner / client / employer logos | None. JongLeren and K.B. appear as text cards only, no logos harvested | Show "JongLeren" and "K.B." as text in Lato, if at all; no third-party logos |
| Testimonials, quotes, reviews | None | None in the film |
| Contact details, URL, email, phone | No. "Online enquiries will be available soon" / "Official contact details coming soon"; the site is a workers.dev preview, noindex, no final domain | End card without a URL (logo + "Alumni" + line), or ask the client for the final domain |
| A wordmark logo / vector logo | Only a raster AL monogram PNG (1254px, white background, no SVG, no wordmark) | Use `assets/site/brand/alumni-logo-cutout.png`; set "Alumni" in Lato beside it (the site never shows such a lockup, so keep it simple: Lato 700/900, ink or white) |
| Logo on dark backgrounds | The site always puts the logo on white (circle in the nav, white tile in the footer) | The cutout works on ink #17271F (checked), but a white tile/circle is the site's own way |
| Icon set beyond 3 line icons + 4 value shapes | Only: graduation cap, briefcase, network; Connection, Growth, Guidance, Opportunity shapes; arrows | Reuse these (assets/site/svg/); new icons should copy the 1.7px round line style |
| Brand video, motion guidelines, sound/music identity | None (the film slot says "Our brand film is on its way") | Site motion only: ease cubic-bezier(.2,.7,.2,1), 0.7s fade + 18px rise, 2px hover lifts |
| Pricing, process durations, eligibility rules, guarantees | None; "Every opportunity is different. Roles and next steps are discussed individually." | No promises of jobs, speed or placement |
| Social channels | None | No social handles on the end card |
| Founding date / team / locations of Alumni | None (only "independent company, brought together by the people behind JongLeren and K.B."; footer "© 2026 Alumni") | No "since", no office locations |
| Dutch / other language versions | English only (og:locale en_GB) | English film; British spelling on the site ("labour markets") |
| Italic fonts or extra weights | Lato 400, 700, 900 only, Latin subset | Stay within those three weights |
| High-res second photo | new-perspectives.jpg is 1100x826 | Use it framed (card, <=1100px) not full-frame 1080p |
