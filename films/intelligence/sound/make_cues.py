# Cue sheet for the intelligence platform explainer: Karl's own Motionix pack (lib-karl, gitignored; built from his Drive with
# sfx_build.py) on every real action (clicks, typing, lifts, state changes), no generated sounds, and a calm music bed (Mixkit
# "Driving Ambition", fitted to 49.8 s with its lift at 17.3 s on the strategy agent: bed.wav, gitignored). Film = VO + 0.4.
# python3 make_cues.py && python3 <skill>/library/scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
fx = []
def a(t, i, db, pitch=0, note=""): fx.append({"frame": round(t * 60), "id": i, "db": db, "pitch": pitch, "note": note})

# S1 home
a(0.30, "ui-open", -8, 0, "the home screen assembles")
for i, t in enumerate([2.70, 3.40, 4.10]): a(t, "smooth-pop", -5, 2 * i, "a place springs up")
# S2 knowledge base
a(6.20, "high-click", -4, 0, "Knowledge base clicked")
a(6.30, "sweet-ui-open", -7, 0, "the knowledge base opens")
for i, t in enumerate([8.76, 9.22, 9.92, 10.80]): a(t, "ui-click-digital-04", -7, 2 * i, "a department lifts")
# S3 three layers
a(11.80, "high-click", -4, 0, "Sales clicked")
a(12.64, "premium-and-smooth-pop", -4, 0, "the strategy document lifts: layer 1")
a(14.70, "smooth-pop", -5, 2, "how we work lifts: layer 2")
a(16.18, "smooth-pop", -5, 4, "the playbooks lift: layer 3")
# S4 tell the agent
a(18.70, "high-click", -4, 0, "Strategy tab clicked")
a(19.60, "high-click", -6, 2, "Sales strategy opened")
a(20.00, "ui-open", -7, 0, "the agent panel lifts")
for i, t in enumerate([21.30, 21.55, 21.95, 22.20, 22.50, 22.90, 23.20, 23.50, 23.90]): a(t, "v4-type-delete", -11, (i % 3) - 1, "a key")
a(24.40, "ui-enter", -4, 0, "Send")
# S5 the suggestion
a(25.40, "sweet-ui-open", -5, 0, "the agent's suggestion appears")
a(26.12, "smooth-pop", -4, 3, "the exact edit lifts")
a(26.30, "cinematic-click", -6, 0, "€400 struck")
a(26.50, "smooth-pop", -7, 5, "€450 in")
# S6 approve
a(27.52, "ui-button", -2, 0, "Approve pressed")
a(27.60, "premium-and-smooth-pop", -5, 2, "strategy updated")
# S7 every document follows
a(28.38, "ui-open", -8, 0, "updating 15 related documents")
for i, t in enumerate([29.04, 29.14, 29.24, 29.34, 29.44, 29.54]): a(t, "ui-click-digital-04", -12, i, "a document ticks past")
a(30.20, "premium-and-smooth-pop", -4, 0, "4 documents updated")
a(30.80, "sweet-ui-open", -6, 2, "ready for your review")
a(31.28, "smooth-pop", -5, 3, "the Pricing change lifts")
a(31.80, "ui-button", -4, 0, "Approve all")
# S8 paste the transcript
a(32.64, "high-click", -4, 0, "Offer tab clicked")
a(33.58, "sweet-ui-open", -5, 0, "the transcript box lifts")
for i, t in enumerate([33.74, 33.94, 34.14, 34.34]): a(t, "v4-type-delete", -10, i, "a transcript line lands")
a(34.72, "ui-enter", -4, 0, "Read transcript")
# S9 what matters
a(35.60, "ui-open", -9, 0, "reading the transcript")
a(36.00, "sweet-ui-open", -5, 0, "here's what I took from it")
for i, t in enumerate([37.10, 37.84, 38.32]): a(t, "smooth-pop", -4, 2 * i, "a card lifts")
# S10 the offer
a(39.10, "high-click", -4, 0, "Make an offer")
a(40.10, "premium-and-smooth-pop", -3, 0, "the offer is ready")
a(41.14, "smooth-pop", -5, 3, "the price table lifts")
a(41.74, "sweet-ui-open", -6, 0, "terms and next step")
a(42.88, "high-click", -4, 2, "Copy")
# S11 one source of truth
a(43.40, "high-click", -6, 0, "Strategy clicked")
a(43.92, "premium-and-smooth-pop", -5, -2, "the strategy: the source")
a(44.92, "high-click", -6, 2, "knowledge base")
for i, t in enumerate([45.22, 45.32, 45.42, 45.52, 45.62, 45.72]): a(t, "ui-click-digital-04", -11, 2 * i, "the departments ripple")
a(46.50, "smooth-pop", -5, 2, "every offer")
a(47.42, "high-click", -6, 0, "the logo: home")
a(47.60, "ui-premium-open", -8, 0, "the platform at rest")
json.dump({"fps": 60, "frames": 2988, "library": "lib-karl",
           "vo": {"file": "../vo/vo.mp3", "at": 0.4, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -31, "duck_db": 5, "fade_in": 0.05, "fade_out": 1.0},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
