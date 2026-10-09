# Builds the square icon tiles the overlay shows.
#   python3 scripts/make_tiles.py            (run from films/gohere)
# - The four apps already in the film (Terschelling Tips, Transavia Tips, Ciao Tutti, BarcelonaTips)
#   are cut from the film's own last frame, at the size they play (55 px), so they look exactly as
#   before.
# - The twelve logos the client sent (assets/logos) are squared and saved at 4x the tile size.
import os, subprocess, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "source", "gohere-v1.mp4")
OUT = os.path.join(ROOT, "overlay", "tiles")
os.makedirs(OUT, exist_ok=True)

# Tile boxes in the film's last frame (frame 1105), measured from the icons' colour and the gap to
# their names: 55 x 55, top at y = 813.
ORIGINAL = {
    "terschelling": 222,
    "transavia": 503,
    "ciaotutti": 756,
    "barcelonatips": 959,
}
last = os.path.join(OUT, "_last_frame.png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "36.83", "-i", SRC, "-frames:v", "1", last], check=True)
frame = Image.open(last).convert("RGB")
for slug, x in ORIGINAL.items():
    frame.crop((x, 813, x + 55, 868)).save(os.path.join(OUT, f"{slug}.png"))
os.remove(last)

NEW = {
    "alicante": "Alicante like a local.jpg",
    "raadsheer": "Raadsheer.jpg",
    "malagatips": "Málaga Tips.jpg",
    "clubrondreizen": "Club Rondreizen.jpeg",
    "sevillabymandy": "Sevilla by Mandy.jpg",
    "stouteschoenen": "Stoute Schoenen.jpg",
    "valenciatips": "Valencia Tips.jpg",
    "wereldstadgidsen": "Wereldstadgidsen.jpg",
    "vakantiexperts": "VakantieXperts.jpg",
    "honeyguide": "Honeyguide.jpg",
    "freely": "Freely.png",
    "bcnhacks": "BCN Hacks.jpg",
}
for slug, name in NEW.items():
    im = Image.open(os.path.join(ROOT, "assets", "logos", name)).convert("RGB")
    w, h = im.size
    s = min(w, h)
    im = im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
    im.resize((220, 220), Image.LANCZOS).save(os.path.join(OUT, f"{slug}.png"))
print("tiles:", sorted(os.listdir(OUT)))
