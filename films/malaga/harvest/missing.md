# Script vs. site: what is not (fully) backed

Script checked: "One property. A hundred moving parts. Bookings. Check-ins. Cleaning. Repairs. Guest messages. You're miles away. That's where Málaga Hideaway comes in. One local partner. Every detail taken care of. We manage reservations, coordinate guest arrivals, arrange cleaning, and handle maintenance, keeping your property ready for every stay. Not renting it out? Our keyholding and property support services keep things covered while you're away. With clear agreements, personal communication, and services tailored to your home, you're always in the loop. Less to manage. More freedom to enjoy your investment. Málaga Hideaway. Your home in Málaga, in good hands. Request your proposal."

## Verdict

**Every factual claim in the script is supported by the site.** Nothing needs to be cut. "clear agreements" and "tailored to your home" are close to verbatim (see facts.md §9). Only small paraphrase gaps exist, plus a few things the *visuals* must avoid implying.

## Minor gaps (wording is paraphrase, not a verbatim site claim)

1. **"One property. A hundred moving parts."** This is rhetoric, not a claim. No "100" figure exists on the site. Fine as a VO hook, but don't show a "100" number as a stat on screen.
2. **"Guest messages"**: the site says "Management of bookings and communication with guests" and "clear communication before, during and after the stay". Supported in meaning. The site does not mention messaging apps or response times for guest messages; don't imply 24/7 or instant replies. The only related claim is "we are on standby in case of questions or problems".
3. **"Every detail taken care of."** Backed by the FAQ "we take care of everything down to the last detail." OK.
4. **"handle maintenance"**: minor repairs are done in-house (Casa Mejor). Bigger maintenance or renovations are "by mutual agreement" via network professionals, and the site says they "guide you through the entire process". OK as worded. Don't imply they renovate at no extra cost.
5. **"arrange cleaning"**: cleaning is offered **as part of full management** ("Cleaning is offered as part of our complete property management"), and as an add-on for keyholding clients. The site does not offer cleaning as a stand-alone service to non-clients. The script wording is fine.
6. **"keyholding and property support services keep things covered while you're away"**: backed by the English home card ("We are your local point of contact: secure key holding, property checks and someone on site when a technician calls"). The full keyholding page is **Dutch-only even at /en/keyholding/**, so English viewers who click through will see Dutch. Not a script problem; worth telling the client.
7. **"personal communication"**: the site says "personal approach", "Personal contact", "clear communication", "direct, clear communication style" and *[NL]* "korte lijnen en persoonlijk contact". The exact phrase "personal communication" doesn't appear, but the meaning is well supported.
8. **"you're always in the loop"**: backed by "We keep you regularly informed through detailed reports, photos and updates. You always have access to the rental calendar". This describes rental-management clients. For keyholding the site only promises "contact with you in case of emergencies or maintenance reports". OK, since the line follows the general "services tailored to your home" sentence.
9. **"Less to manage. More freedom to enjoy your investment."**: "investment" is backed ("It is a personal investment that deserves the best care"), and the site says owners can always use the home themselves. "Freedom" is the script's own framing. The site claims "optimum returns" and occupancy maximisation but gives **no figures**. Don't put income/ROI numbers or "guaranteed" on screen.
10. **"Your home in Málaga, in good hands."**: the site says "where your home in Málaga is in **our** hands" (and the Dutch keyholding sub-line "Uw woning in onze handen"). "In good hands" is a light paraphrase. Fine.
11. **"Request your proposal."**: the site's CTAs are "I want a proposal" and "Request a no-obligation proposal" (form at /en/application/). Supported. If an end card shows extra text, "no-obligation" is a real site claim that can be used.

## Not on the site; don't add these to supers/end card

- Founding year / years of experience. The only experience claim is "our experience as homeowners abroad". "2 years" is only an Airbnb-host badge.
- Number of managed properties, owners or guests. Don't show a count. The 9 listed homes are my count, not a site claim.
- Review scores or star ratings. Only badges exist: "Guest favourite on Airbnb", "Superhost".
- Commission percentage or management fees. Only "commission basis" / "transparent prices". The **€49/month keyholding basic package (excl. VAT)** is the one published price.
- 24/7 availability, emergency response times, insurance or guarantees.
- Any area beyond Málaga / Costa del Sol (Málaga region). Don't say "all of Andalusia" or "Spain-wide". Estepona and Ibiza appear only as *partner* stays they do **not** manage.

## Visual caveats (for the footage/stills plan)

- **Partner accommodations are not managed by Málaga Hideaway** ("We do not manage these special stays ourselves"). The Estepona, Oasis 325 and Ibiza images were deliberately not harvested; don't use them as "our properties".
- The three service images (cleaner making a bed, guest opening a smart lock with a suitcase, technician with a toolbox) are the site's own Services illustrations but **look AI-generated or stock**: generic models, not a listed property, no camera metadata. They are fine for illustrating the services. Don't present them as René, Thessa or real staff.
- `site-terrace-sea-view.jpg` (og:image) is generic site imagery, possibly stock, with no property named.
- Several property photos (Casa Málaga Beach, Casa Benito, La Casa Bonita) carry a **small Málaga Hideaway watermark bottom-right**. Crop or scale so it isn't half-cut at a frame edge.
- Many originals are only 1024 px wide (La Perla Escondida, Casa Benito, La Casa Bonita, service images). Use those inside cards or frames, or at most about 1.3x scale. Full-frame 1920 shots: the Happy House, Rooftop Beachhouse, Casa Enrique and Casa Málaga Beach sets (see `assets/photos/manifest.json`, `full_frame_1080p_ok`).
- The favicon is the **Málaga city flag**, not a brand mark. The logo exists only as a white PNG with a drop shadow (clean recoloured variants are derived in `assets/logo/`).
- The logo wordmark typeface is not one of the site fonts. Use the PNG and never retype "MÁLAGA HIDEAWAY" in Montserrat/Calistoga as if it were the logo.
