# Writes sound/cues.json: one sound per picture event, each made for its moment (creoble_sfx.py) and used once. Frames are
# the film's (film/src/*.tsx): a tap on the press, a whoosh's sync point at the middle of its move, a riser ending on its
# reveal. No voice-over: the music (Expressive Courage, fitted to the reference's structure) is the bed.
#   cd sound && python3 creoble_sfx.py && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
cues = []
def c(id, frame, note, db=None):
    e = {"id": id, "frame": int(frame), "note": note}
    if db is not None: e["db"] = db
    cues.append(e)

# 0–19 s
c("cl-field", 7, "the ball field zooms in", -3); c("cl-mange", 10, "Mange", -4); c("cl-pullback", 41, "the field pulls back", -6)
c("cl-icon", 58, "the dot becomes the code icon", -5); c("cl-caret", 82, "the caret grows", -6); c("cl-type1", 82, "typed", -4)
c("cl-snap", 96, "the close-up snaps back", -5); c("cl-brackets", 106, "the brackets close", -3)
c("cl-nu", 166, "nu", -8); c("cl-mod", 188, "Mød", -4); c("cl-logo", 211, "the logo", -1); c("cl-flip", 235, "the mark flips", -6)
c("cl-riser", 263, "into the drop", -3); c("cl-drop", 265, "the drop", -2); c("cl-ai", 267, "AI bygger", -7); c("cl-sites", 288, "hjemmesider", -7)
c("cl-flare", 299, "the spheres meet", -4); c("cl-fast", 300, "hurtigere", -3); c("cl-cream", 372, "the cream bloom", -6)
c("cl-hele", 375, "Hele", -6); c("cl-slide", 395, "processen tager", -7); c("cl-dissolve", 406, "the line dissolves", -6); c("cl-under", 415, "under", -5)
c("cl-wave", 444, "the wave", -6); c("cl-count", 444, "the count", -6); c("cl-five", 487, "5", -3)
c("cl-min", 496, "minutter", -8); c("cl-kode", 511, "kode", -6); c("cl-noedv", 526, "nødvendig", -3); c("cl-letter", 546, "through the d", -4)
c("cl-bloom", 548, "the flower", -5); c("cl-star", 558, "the star opens", -3)
c("cl-collage", 590, "the wall of sites", -4); c("cl-push", 622, "into Café Gaden", -5); c("cl-cafe", 630, "Café", -6); c("cl-laptop", 650, "the laptop", -5)
# 23–34 s
c("cl-pill", 694, "the glowing prompt", -5); c("cl-type2", 700, "typed", -4); c("cl-zoomout", 748, "pull back", -5); c("cl-send", 758, "send", -2)
c("cl-sheen", 767, "the sheen", -7); c("cl-fold", 780, "the pill folds", -6); c("cl-expand", 797, "the builder opens", -3); c("cl-steps", 798, "the questions answered", -6)
c("cl-built", 834, "built", -3); c("cl-closeup", 840, "close on the prompt", -7); c("cl-type3", 856, "typed", -4); c("cl-send2", 917, "send", -2)
c("cl-msg-me", 921, "your message", -6); c("cl-msg-ai", 934, "Creoble answers", -6); c("cl-tilt", 945, "the tilt", -6)
c("cl-recolor", 966, "the recolour sweep", -3); c("cl-done", 988, "Færdig", -3); c("cl-swing", 1012, "the builder swings away", -5)
# 34–54 s
c("cl-chatbot", 1016, "Tilføj din chatbot", -5); c("cl-ptr1", 1022, "Kunde", -8); c("cl-ptr2", 1026, "Chatbot", -8)
c("cl-click-chat", 1063, "click Chatbot", -1); c("cl-card", 1080, "the card", -5); c("cl-type4", 1081, "typed", -4)
c("cl-learnt", 1086, "Lært ×3", -7); c("cl-save", 1100, "Gem", -2); c("cl-zoomin", 1110, "zoom in", -6)
c("cl-tiles", 1117, "the tiles", -4); c("cl-fly", 1160, "into the bar", -5); c("cl-zoomout2", 1190, "out to the builder", -5); c("cl-hi", 1196, "hello", -5)
c("cl-med", 1249, "Med", -5); c("cl-klik", 1261, "ét klik", -4); c("cl-power", 1275, "the power icon", -3)
c("cl-chips", 1292, "the chips", -6); c("cl-activate", 1318, "Aktivér", 0)
c("cl-open-chat", 1366, "open the chat", -2); c("cl-chat-open", 1370, "the chat opens", -5); c("cl-bot1", 1375, "welcome", -6)
c("cl-type5", 1394, "typed", -4); c("cl-send3", 1418, "send", -3); c("cl-me1", 1421, "question", -6); c("cl-bot2", 1438, "answer", -5)
c("cl-type6", 1450, "typed", -4); c("cl-send4", 1472, "send", -3); c("cl-me2", 1475, "question", -6); c("cl-bot3", 1490, "answer", -5)
c("cl-card2", 1497, "the bouquet card", -6); c("cl-zoom-card", 1508, "close on the card", -6); c("cl-order", 1522, "Bestil", -1)
c("cl-ordered", 1525, "Bestilt", -3); c("cl-bot4", 1538, "we'll call", -6); c("cl-zoomout3", 1575, "the whip out to the builder", -4)
# 54–80.49 s
c("cl-se", 1625, "Se resultatet", -4); c("cl-helt", 1638, "helt", -3); c("cl-gratis", 1652, "gratis", -2)
c("cl-type9", 1667, "før du betaler noget, typed", -5); c("cl-foer", 1706, "the bloom", -7)
c("cl-click-buy", 1723, "click Køb", -1); c("cl-buycard", 1737, "the purchase card", -5); c("cl-type7", 1738, "typed", -5)
c("cl-pay", 1782, "Køb nu", -1); c("cl-paid", 1786, "Betalt", -2); c("cl-browser", 1815, "the browser pulls back", -4); c("cl-shop", 1852, "the laptop on the desk", -5)
c("cl-oplev", 1893, "Oplev", -4); c("cl-hosting", 1912, "nem hosting", -1); c("cl-type10", 1912, "typed", -5)
c("cl-toggle", 1964, "the switch", -1); c("cl-glow", 1970, "it glows", -3)
c("cl-panel", 1995, "out to the panel", -5); c("cl-flipview", 2016, "the hosting view wipes in", -6); c("cl-type8", 2019, "typed", -5)
c("cl-connect", 2034, "Forbind", -2); c("cl-checks", 2038, "checks", -5); c("cl-online", 2071, "online", -2)
c("cl-gaa", 2077, "Gå online", -3); c("cl-type11", 2077, "typed", -5); c("cl-move", 2108, "to the corner", -7)
c("cl-domain", 2130, "med dit eget domæne", -6); c("cl-uden", 2145, "uden teknisk bøvl", -5)
c("cl-glow-c", 2190, "the glow", -5); c("cl-starter", 2190, "Din hjemmeside starter her", -7); c("cl-skabe", 2231, "Hvad vil du skabe?", -3)
c("cl-mark", 2285, "the mark", -2); c("cl-wordmark", 2312, "Creoble.", 0); c("cl-url", 2355, "creoble.dk", -4)

# no voice-over, so the bed sits higher than in the other films: the moves and the typing need lifting over it
BOOST = {"cl-slide": 5, "cl-count": 3, "cl-wave": 3, "cl-bloom": 3, "cl-star": 3, "cl-collage": 3, "cl-push": 4, "cl-laptop": 5, "cl-zoomout": 4, "cl-fold": 4,
         "cl-expand": 3, "cl-steps": 3, "cl-closeup": 3, "cl-type3": 4, "cl-tilt": 4, "cl-learnt": 5, "cl-zoomin": 3, "cl-tiles": 3, "cl-fly": 4, "cl-zoomout2": 4,
         "cl-power": 4, "cl-chips": 3, "cl-type5": 6, "cl-type6": 5, "cl-zoom-card": 3, "cl-zoomout3": 3, "cl-se": 4, "cl-foer": 5, "cl-browser": 3, "cl-shop": 5,
         "cl-oplev": 3, "cl-type8": 6, "cl-panel": 6, "cl-checks": 6, "cl-move": 8, "cl-type1": 3, "cl-type2": 3, "cl-type4": 3, "cl-type7": 3, "cl-type9": 6, "cl-type10": 3, "cl-type11": 3, "cl-pullback": 3, "cl-snap": 3, "cl-swing": 3, "cl-flipview": 6, "cl-dissolve": 5, "cl-sheen": 5, "cl-swing": 5}
for e in cues:
    if e["id"] in BOOST: e["db"] = e.get("db", 0) + BOOST[e["id"]]

ids = [x["id"] for x in cues]
assert len(ids) == len(set(ids)), "a sound is used twice"
lib = {x["id"] for x in json.load(open("lib/sfx/index.json")) if x["id"].startswith("cl-")}
assert set(ids) == lib, ("unused or missing sounds", lib ^ set(ids))
doc = {"fps": 30, "frames": 2415, "library": "lib",
       "music": {"file": "music/expressive-courage-fit.wav", "at": 0, "fade_in": 0.0, "fade_out": 0.4,
                 "note": "Expressive Courage (Diego Nava, Mixkit, Mixkit Stock Music Free License), cut to the reference: drops at 8.8 and 54.15 s, stop at 49.4 s, last hit 78.25 s"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues, every sound used once")
