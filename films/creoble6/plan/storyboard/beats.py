# The storyboard's content for Creoble v6: beats (with the frames to pull from the render), notes, questions, revisions.
# (id, title, t0, t1, VO line, on-screen words, what happens, transition out, [(time, caption), ...])
BEATS = [
  ("s1", "Hook: the old web", 0.0, 5.5, "Din nye hjemmeside er få minutter væk. Bygget af AI.", "Din nye hjemmeside · få minutter væk. · Siden kan ikke findes · Bygget af AI.",
   "After the reference's hook. The words arrive one by one around a small old website sitting inside the line. The camera pushes into that window and flies down a tunnel of dated websites, with \"få minutter væk.\" floating in the middle. At the end waits the error page \"Siden kan ikke findes\"; the camera flies through it into clean cream, where \"Bygget af AI.\" lands.",
   "The camera cranes down from the line onto the wizard.",
   [(0.67, "Frame 0 already moves: a small old website; \"Din\" arrives beside it."), (1.33, "\"Din nye [old site] hjemmeside\": the object sits inside the line, as in the reference."),
    (1.83, "The camera pushes into the window: a tunnel of old websites."), (2.50, "\"få minutter væk.\" floats in the tunnel."),
    (2.90, "Willads' keep: \"Siden kan ikke findes\"."), (4.00, "Through the error page into cream: \"Bygget af AI.\"")]),
  ("s2", "The wizard, typing", 5.5, 8.8, "Fortæl kort om din virksomhed.", "The wizard's own text · Holm Fysioterapi",
   "Creoble's new wizard, exactly as in Willads' screenshot. The cursor clicks Virksomhedsnavn and the camera goes to an extreme close-up of the field while \"Holm Fysioterapi\" is typed. It then glides down to the black \"Fortsæt\" button, which is pressed.",
   "The button shrinks into a dot, which opens into the six dots of the logo.",
   [(5.50, "The crane lands on the wizard."), (7.00, "Willads' keep: the typing, now as an extreme close-up."),
    (7.83, "\"Holm Fysioterapi\" typed."), (8.42, "The cursor presses \"Fortsæt\".")]),
  ("s3", "Creoble builds the site", 8.8, 13.6, "Creoble bygger hele siden. Ingen teknik. Ingen skabeloner.", "Ingen teknik. · Ingen skabeloner.",
   "The dots logo turns as the loading animation. A thin sage progress line grows out of it; the camera travels along it, and the line becomes the top edge of the browser window, which unfolds while the site builds block by block. Then the site recedes and the line \"Ingen teknik.\" swaps its last word for \"skabeloner.\"",
   "The site stays far and soft; the next line arrives in front of it.",
   [(8.93, "The button has become a dot."), (9.50, "The dots logo turns: loading."), (9.87, "The progress line grows out of the logo."),
    (10.37, "The line is the window's top edge; the site builds."), (11.20, "The finished site, big."), (12.33, "\"Ingen teknik.\""), (12.80, "\"teknik.\" swaps for \"skabeloner.\"")]),
  ("s4", "See it first, change anything", 13.6, 21.9, "Det bedste? Du ser den færdig, før du betaler en krone. Vil du ændre noget? Skriv det. Creoble retter det.", "Det bedste? · Forhåndsvisning · Gratis · the edit request",
   "\"Det bedste?\" in front of the soft site, then the camera flies to it. One calm scroll down the finished site, then an extreme close-up of the address bar: \"Forhåndsvisning\" and \"Gratis\". The cursor clicks the headline, a small field opens, the change is typed, and the headline rewrites itself word by word.",
   "The camera pulls back and the site falls away into depth.",
   [(14.60, "\"Det bedste?\""), (15.50, "\"Du ser den færdig\": the site, sharp and big."), (16.50, "One calm scroll, never back up."),
    (17.40, "\"før du betaler en krone\": the address bar, \"Gratis\"."), (19.33, "\"Vil du ændre noget?\": the headline selected, the field open."),
    (19.90, "\"Skriv det.\""), (21.17, "\"Creoble retter det.\": the new headline.")]),
  ("s5", "The price", 21.9, 32.4, "Tilfreds? 499 kroner. Én gang. Intet abonnement. Siden er din. Ikke tilfreds? Så koster det ingenting. Nul risiko.", "Tilfreds? · 499 kr. · Én gang. · Intet abonnement. · Siden er din. · Ikke tilfreds? · 0 kr. · Nul risiko.",
   "All kinetic type. \"499 kr.\" stands big; the line under it swaps on every phrase. On \"koster det ingenting\" the digits roll down to \"0 kr.\"",
   "The camera flies through the zero.",
   [(22.67, "\"Tilfreds?\""), (24.50, "\"499 kr.\""), (25.60, "\"Én gang.\""), (26.67, "\"Intet abonnement.\""), (28.17, "\"Siden er din.\""),
    (29.30, "\"Ikke tilfreds?\""), (30.33, "The digits roll."), (31.60, "\"0 kr.\" · \"Nul risiko.\""), (32.50, "Into the zero.")]),
  ("s6", "Online: hosting", 32.4, 37.92, "Skal den på nettet? Vi sætter det hele op for dig. Fra 83 kroner om måneden.", "holmfysio.dk · Domæne · E-mail · Hjemmeside · Fra 83 kr./md.",
   "Through the zero waits the site. Its address pill lifts off and grows into the hosting card. The three rows arrive one by one, each \"Sætter op\" with a small turning logo. Then an extreme close-up of the price.",
   "The camera pulls back to the whole card.",
   [(32.92, "Through the zero: the site."), (33.80, "The address pill grows into the card."), (35.33, "\"Vi sætter det hele op\": the rows arrive."),
    (36.17, "The whole card, inside the margins."), (36.75, "\"Fra 83 kr./md.\", close up.")]),
  ("s7", "What's included", 37.92, 46.4, "Domæne og e-mail er med. Fast pris. Også når du fornyer. Domænet i dit navn. Servere i Europa. Ingen binding.", "Aktiv · Fast pris. · Også når du fornyer. · Domænet i dit navn · Servere i Europa · Ingen binding",
   "Willads' keep: domain, e-mail and website turn green one after another, in a close-up. Then two type lines, then three light pills stacking up, fully inside the frame.",
   "The pills rise out; the camera moves to clean cream.",
   [(38.63, "Domain turns green."), (39.53, "E-mail turns green."), (39.95, "Website turns green."), (40.75, "\"Fast pris.\""),
    (41.67, "\"Også når du fornyer.\""), (44.00, "The pills, one per phrase."), (46.00, "All three, nothing cut off.")]),
  ("s8", "A person answers", 46.4, 52.4, "Brug for hjælp? Et menneske, der forstår din forretning. Ingen kø. Ingen robotsvar.", "Brug for hjælp? · the chat · Ingen kø. · Ingen robotsvar.",
   "\"Brug for hjælp?\", then the wizard's own sage chat button arrives and is clicked. It opens into the support chat: a customer question, and Sofie's reply typing in. Then \"Ingen kø.\" swaps to \"Ingen robotsvar.\"",
   "The cursor clicks the chat's black send button.",
   [(47.70, "\"Brug for hjælp?\""), (48.00, "The chat button from the wizard."), (49.17, "\"Et menneske\": Sofie's reply types."),
    (49.63, "The whole chat panel."), (51.00, "\"Ingen kø.\""), (51.87, "\"Ingen robotsvar.\"")]),
  ("s9", "Outro: the dots become the logo", 52.4, 65.18, "Creoble. Hjemmeside og hosting, samlet ét sted. Byg den. Se den. Så køber du. Byg din side gratis på creoble.dk.", "Creoble. · Hjemmeside og hosting, samlet ét sted. · Byg den. Se den. Så køber du. · Byg din side gratis på creoble.dk",
   "After the reference's outro, with the dots in the star's role. The clicked button turns sage and becomes a dot that flies off; the other dots fly in and form the C exactly on \"Creoble.\"; the wordmark slides out. A dot then rides behind \"Byg den. Se den. Så køber du.\" as each word arrives, flies back up, becomes the C again, and the address types in under the logo.",
   "A slow dolly holds to the last frame.",
   [(52.30, "The cursor clicks the black button."), (52.60, "The button becomes a sage dot."), (53.00, "The dots fly in."),
    (54.00, "\"Creoble.\": the C, then the wordmark."), (56.50, "\"Hjemmeside og hosting, samlet ét sted.\""), (58.33, "A dot rides behind the words."),
    (59.58, "\"Byg den. Se den. Så køber du.\""), (60.67, "The dot becomes the C again."), (64.00, "The end: logo and creoble.dk.")]),
]
NOTES = [
  ("Hook and outro", "Both follow the reference video closely, as you asked. Hook: word-by-word type with an object inside the line, the push into it, "
   "the tunnel of screens with type floating in it. Outro: the clicked button becomes the dot, the dot flies and rides behind the words, becomes the logo, "
   "the wordmark slides out, the address types in below."),
  ("Willads' keeps", "The old websites and \"Siden kan ikke findes\" are inside the first 3 seconds. The wizard typing is an extreme close-up at 6.6–7.9 s. "
   "Domain, e-mail and website turn green at 38.3–39.9 s."),
  ("Willads' fixes", "A 3D camera runs through every scene, with depth of field; fast moves get motion blur in the final render. Product beats fill the frame, with "
   "close-ups of the field, the address bar, the headline, the price and the rows. One grid: cards, pills, the chat and the logo stay inside the margins. "
   "Type beats alternate with product beats, and no text blurs in. No toggle, padlock, confetti, bounce or black pills."),
  ("Voice-over", "The same Danish take. Silence is added between scenes (9.4 s in total), so each move finishes before the voice goes on. That brings the "
   "film to 65.2 s, the length Willads' time codes refer to."),
  ("Sound", "Music: Mixkit \"Piano Reflections\" (free licence, no credit), calm and low. Effects: soft clicks, quiet key ticks, a glass ping on each green "
   "check. Your Motionix pack is not on this machine, so these are Kenney (CC0) and Pixabay sounds for now."),
  ("Illustrations", "Holm Fysioterapi is fictional. The edit request (\"Gør overskriften mere personlig\"), the chat lines and the name Sofie are examples, "
   "not claims. The hosting card and the chat panel are drawn in Creoble's style; they are not from a screenshot."),
]
QUESTIONS = [
  "The hosting card and the support chat are my design in Creoble's style. If Willads has real screens for hosting and support, send them and I will match them.",
  "The support person is called \"Sofie\" with the initials SL. Does Willads want a real name, or no name?",
  "Willads asked for 2–3 Danish voice samples. This film keeps the current voice; every move is tied to word times, so a new voice can be swapped in without a rebuild.",
  "Old-site fonts: Verdana and Comic Sans are not installed here, so the old websites use fallback fonts. They still read as dated. Fine as is?",
]
REVISIONS = [
  ("v5: a small sage capsule morphing into everything, the website as hero in every beat", "v6: type beats alternate with big product beats in a 3D world", "Willads: product too small, no camera, text presets"),
  ("v5: a dot dropping in as the opening", "v6: the reference's hook, with the old websites and the 404 page inside it", "Willads keeps the old-web opening; Karl: hook after the reference"),
  ("Old wizard with the left rail of steps", "The new single-column wizard, from the screenshot", "The platform changed"),
  ("Icon metaphors: toggle, padlock, speech bubble", "Real UI only: fields, a card with rows, a chat panel", "Willads: no icon metaphors"),
  ("Sage capsule whips between scenes", "One element becomes the next scene: button → dots, progress line → window, zero → site, address pill → card, button → logo", "Willads: transitions from elements"),
  ("Voice-over 53.6 s, film 55.2 s", "The same take with air between scenes, film 65.2 s", "Calm; room to finish each move"),
]
