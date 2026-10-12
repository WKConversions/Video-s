# Writes sound/cues.json: one sound per visual event, each made for its moment (creoble_sfx.py) and used once, so no
# effect is heard twice (Karl, 12 Oct). Keyed to the voice-over's words (film seconds, vo/words.json; the VO sits at 0.5 s).
#   cd sound && python3 creoble_sfx.py && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
W = {w["key"]: w["start"] for w in json.load(open("../vo/words.json"))["words"]}
cues = []
def c(id, sec, note, db=None):
    e = {"id": id, "frame": max(0, round(sec * 30)), "note": note}
    if db is not None: e["db"] = db
    cues.append(e)
w = lambda k, d=0.0: W[k] + d

# 1 the hook: the café, then its website
c("cr-cafe-open", 0.5, "the café opens the film", -5)
c("cr-into-site", w("w:resultatet", -0.33) + 0.73, "the café closes into the website's hero", -4)
c("cr-foer", w("w:foer", -0.06), "'før' lands in terracotta", -5)
c("cr-words-away", w("w:betaler", 0.78), "the question eases away", -7)
# 2 the old way
c("cr-lock", w("w:normalt", 0.15), "the site locks behind a blur", -4)
c("cr-paper-quote", w("w:tilbud", 0.01), "the quote slides in", -4)
c("cr-paper-deposit", w("w:depositum", 0.0), "the deposit slip", -4)
c("cr-questions", w("w:en2", -0.2), "the questions rise, one bubble each", -1)
c("cr-old-drop", w("w:spoergsmaal", 0.78), "the old way falls away", -5)
# 3 Creoble turns it around
c("cr-brand", w("w:creoble", -0.05), "Creoble", -3)
c("cr-steps-in", w("w:creoble", 0.32), "the three steps", -5)
c("cr-turn", w("w:vender", 0.7), "the order turns on its head", -3)
c("cr-steps-out", w("w:fortael", -0.28), "the steps make way", -6)
# 4 tell us about your business
c("cr-cafe-behind", w("w:fortael", 0.45), "the café opens behind the form", -6)
c("cr-keys-name", w("w:fortael", 0.07), "'Café Salvie' typed", -3)
c("cr-dropdown", w("w:virksomhed", 0.0), "the branche list opens", -3)
c("cr-pick", w("w:virksomhed", 0.38), "'Restaurant / Café' picked", -4)
c("cr-click-build", w("w:paa2", -0.45), "'Byg min side'", -2)
c("cr-description-to-site", w("w:paa2", -0.2) + 0.73, "the description becomes the website", -3)
# 5 the build
c("cr-generating", w("w:paa2", 0.06), "Creoble builds", -5)
c("cr-build-menu", w("w:minutter", 1.13), "the menu develops", -6)
c("cr-build-about", w("w:minutter", 1.73), "the about section develops", -6)
c("cr-build-contact", w("w:minutter", 2.2), "the contact band develops", -6)
c("cr-site-ready", w("w:hjemmeside2", -0.07), "'Din hjemmeside er færdig'", -3)
# 6 explore, design, change it in plain words
c("cr-scroll-down", w("w:udforsk", 0.38), "the pages are explored", -5)
c("cr-scroll-up", w("w:se2", -0.02), "back up to the design", -6)
c("cr-theme-terra", w("w:designet", 0.1), "terracotta", -3)
c("cr-theme-forest", w("w:designet", 0.5), "forest", -6)
c("cr-change-bar", w("w:fortael2", 0.05), "the change bar rises", -6)
c("cr-keys-change", w("w:fortael2", -0.04), "the change is typed", -4)
c("cr-send-change", w("w:aendre", 0.12), "sent; the headline grows", -3)
# 7 do you like the result?
c("cr-like-rise", w("w:kan", 0.1), "the question card rises", -6)
c("cr-click-yes", w("w:resultatet2", 0.75), "'Ja, den er min'", -2)
# 8 499 kroner, one payment, no subscription
c("cr-price-in", w("w:saa", 0.4), "the site steps aside for the price", -5)
c("cr-499", w("w:499", 0.0), "499 kr", -2)
c("cr-one-payment", w("w:en4", -0.07), "Én betaling", -13)
c("cr-no-sub", w("w:entet", -0.07), "Intet abonnement", -5)
c("cr-strike", w("w:abonnement", 0.1), "kr/md struck through", -4)
c("cr-yours", w("w:ejere", -0.14), "Siden er din", -3)
# 9 online: hosting, domain, e-mail in one place
c("cr-back-to-top", w("w:klar", 0.14), "the site runs back to the top", -6)
c("cr-go-online", w("w:online", -0.02), "Online", -2)
c("cr-keys-url", w("w:online", 0.12), "cafesalvie.dk", -6)
c("cr-card-hosting", w("w:hosting", -0.08), "Hosting", -4)
c("cr-card-domain", w("w:domaene", -0.08), "Domæne", -4)
c("cr-card-mail", w("w:e", -0.08), "E-mail", -4)
c("cr-gather", w("w:samlet", 0.5), "the three gather into one", -5)
c("cr-one-place", w("w:sted", 0.0), "Samlet ét sted", -6)
# 10 no code, no uncertainty
c("cr-lift-off", w("w:ingen", -0.13), "the site lifts away", -5)
c("cr-no-code", w("w:kode", 0.25), "the code sign is crossed out", -3)
c("cr-certain", w("w:usikkerhed", 0.42), "the question mark becomes a check", -6)
# 11 the sign-off (the music's last hit lands at 41.45, on "dag")
c("cr-signoff-air", w("w:proev", 0.3), "the sign-off breathes in", -6)
c("cr-button", w("w:dag", -0.1), "'Byg din side gratis' arrives on 'i dag'", -5)
c("cr-final", 41.45, "the closing chord with the music's last hit", -4)

ids = [x["id"] for x in cues]
assert len(ids) == len(set(ids)), "a sound is used twice"
lib = {x["id"] for x in json.load(open("lib/sfx/index.json"))}
assert set(ids) == lib, ("unused or missing sounds", lib ^ set(ids))
doc = {"fps": 30, "frames": 1320, "library": "lib", "vo": {"file": "../film/public/audio/vo.wav", "at": 0},
       "music": {"file": "music/jkw-fit.wav", "at": 0, "duck_db": 6, "fade_in": 0.3, "fade_out": 1.2,
                 "note": "Just Keep Walking (Michael Ramir C., Mixkit, Mixkit Stock Music Free License), fitted: lift at 10.20 on 'Creoble', last hit 41.45 on 'i dag'"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues, every sound used once")
