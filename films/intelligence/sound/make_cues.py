# Cue sheet for the intelligence platform explainer: Karl's own Motionix pack (lib-karl, gitignored; built from his Drive with
# sfx_build.py) on every real action (clicks, typing, lifts, state changes), no generated sounds, and a calm music bed (Mixkit
# "Driving Ambition", fitted to 49.8 s with its lift at 17.3 s on the strategy agent: bed.wav, gitignored). Film = VO + 0.4.
# python3 make_cues.py && python3 <skill>/library/scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
import json
fx = []
def a(t, i, db, pitch=0, note=""): fx.append({"frame": round(t * 60), "id": i, "db": db, "pitch": pitch, "note": note})

# S1 home (revision 1: sentence by sentence)
a(0.30, "ui-open", -9, 0, "the home screen builds")
for i, t in enumerate([3.15, 3.78, 4.42]): a(t, "smooth-pop", -5, 2 * i, "a place springs up")
a(7.02, "high-click", -4, 0, "Knowledge base clicked")
a(7.60, "sweet-ui-open", -7, 0, "the knowledge base opens")
# S2 knowledge base
a(8.10, "ui-open", -9, 2, "the six departments lift")
for i, t in enumerate([10.01, 10.47, 11.17, 12.05]): a(t, "ui-click-digital-04", -8, 2 * i, "a department lights")
a(13.50, "high-click", -4, 0, "Sales clicked")
a(14.08, "sweet-ui-open", -7, 2, "the Sales department opens")
# S3 three layers
a(14.55, "premium-and-smooth-pop", -4, 0, "layer 1: the strategy document lifts")
a(16.50, "smooth-pop", -5, 2, "layer 2: how we work lifts")
a(18.45, "smooth-pop", -5, 4, "layer 3: the playbooks lift")
# S4 tell the agent
a(22.80, "high-click", -4, 0, "Strategy tab clicked")
a(24.17, "high-click", -6, 2, "Sales strategy opened")
a(25.16, "ui-open", -7, 0, "the agent panel lifts")
for i, t in enumerate([25.50, 25.75, 26.05, 26.35, 26.60, 26.90, 27.20, 27.50, 27.78]): a(t, "v4-type-delete", -11, (i % 3) - 1, "a key")
a(29.20, "ui-enter", -4, 0, "Send")
# S5 the suggestion
a(29.70, "ui-open", -10, 0, "thinking")
a(30.00, "sweet-ui-open", -5, 0, "the agent's suggestion appears")
a(30.62, "smooth-pop", -4, 3, "the exact edit lifts")
a(31.25, "cinematic-click", -6, 0, "€400 struck")
a(31.55, "smooth-pop", -7, 5, "€450 in")
# S6 approve
a(33.00, "ui-button", -2, 0, "Approve pressed")
a(33.50, "premium-and-smooth-pop", -5, 2, "strategy updated")
# S7 every document follows
a(34.50, "ui-open", -8, 0, "updating 15 related documents")
for i, t in enumerate([34.60, 34.95, 35.30]): a(t, "ui-click-digital-04", -12, 2 * i, "documents tick past")
a(35.60, "premium-and-smooth-pop", -4, 0, "4 documents updated")
a(36.15, "high-click", -5, 0, "Review one by one")
a(37.08, "sweet-ui-open", -6, 2, "ready for your review")
a(38.45, "ui-button", -4, 0, "Approve all")
# S8 paste the transcript
a(40.50, "high-click", -4, 0, "Offer tab clicked")
a(40.88, "sweet-ui-open", -7, 0, "Offer opens")
a(41.60, "high-click", -7, 2, "the transcript box focused")
a(41.92, "ui-open", -8, 0, "the transcript box lifts")
for i, t in enumerate([42.40, 42.62, 42.84, 43.06, 43.28]): a(t, "v4-type-delete", -10, i, "a transcript line lands")
a(44.13, "ui-enter", -4, 0, "Read transcript")
# S9 what matters
a(44.50, "ui-open", -10, 0, "reading the transcript")
a(45.45, "sweet-ui-open", -5, 0, "here's what I took from it")
a(45.85, "smooth-pop", -6, 0, "the four cards lift")
for i, t in enumerate([45.93, 46.62, 47.10]): a(t, "ui-click-digital-04", -7, 2 + 2 * i, "the focus moves: needs, budget, timeline")
a(49.30, "high-click", -4, 0, "Make an offer")
# S10 the offer
a(49.68, "ui-open", -10, 0, "writing the offer")
a(50.50, "premium-and-smooth-pop", -3, 0, "the offer is ready")
a(50.95, "smooth-pop", -5, 3, "prices and timeline lift")
a(51.50, "ui-click-digital-04", -8, 5, "the focus moves to the timeline")
# S11 one source of truth
a(53.30, "high-click", -6, 0, "Strategy clicked")
a(54.42, "premium-and-smooth-pop", -5, -2, "the strategy: the source")
a(56.07, "high-click", -6, 2, "knowledge base clicked")
for i, t in enumerate([56.90, 57.07, 57.24, 57.41, 57.58, 57.75]): a(t, "ui-click-digital-04", -11, 2 * i, "the departments ripple in sync")
a(57.32, "high-click", -7, 4, "Offer clicked")
a(58.52, "high-click", -6, 0, "the logo: home")
a(58.90, "ui-premium-open", -8, 0, "the platform at rest")
json.dump({"fps": 60, "frames": 3660, "library": "lib-karl",
           "vo": {"file": "../vo/vo_paced.mp3", "at": 0.4, "compress": True},
           "music": {"file": "bed.wav", "at": 0, "lufs": -31, "duck_db": 5, "fade_in": 0.05, "fade_out": 1.0},
           "sfx": fx}, open("cues.json", "w"), indent=1)
print(len(fx), "cues")
