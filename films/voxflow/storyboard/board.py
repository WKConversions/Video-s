# The whole storyboard as one image (voxflow-storyboard.jpg): every beat, its voice-over line and its frames from the film.
#   python3 storyboard/board.py
import json, os
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(R, "frames.json")))
FONTS = os.path.join(R, "..", "film", "public", "fonts")
def font(name, size, wght):
    f = ImageFont.truetype(os.path.join(FONTS, name), size)
    try: f.set_variation_by_axes([wght])
    except Exception: pass
    return f
H1, H2, VO, TC, CAP, SUB = font("inter-latin.woff2", 72, 800), font("inter-latin.woff2", 40, 800), font("geist-latin.woff2", 30, 500), \
    font("geist-latin.woff2", 24, 700), font("geist-latin.woff2", 25, 500), font("geist-latin.woff2", 30, 500)
NUM = font("geist-latin.woff2", 26, 700)
CREAM, WHITE, INK, TEAL, GREY, LINE = "#F4F2EB", "#FFFFFF", "#16221F", "#0F6E6A", "#54635E", "#E4E0D6"
TITLES = ["Het probleem", "De ommekeer", "De AI-receptionist, 24/7", "Vragen beantwoord, afspraken ingepland", "Je telefoon", "Focus",
          "Drie kwaliteiten", "Iedere klant, tegelijk", "Meer uit elk gesprek", "Call to action"]
CAPS = {32: "Een oproep in de praktijk; niemand kan opnemen.", 45: "Gemist, op “enkel”.", 75: "De gemiste oproepen stapelen zich op.",
        100: "VoxFlow; de oproepen draaien naar opgenomen.", 140: "De receptioniste verschijnt.", 165: "In gesprek met je klant.",
        215: "Onze slimme AI-receptionist.", 262: "24/7: de nacht valt, om 03:20 belt er iemand.", 290: "Opgenomen binnen 3 sec.",
        330: "De beller vraagt, de receptioniste antwoordt.", 372: "10:00 landt op dinsdag (morgen).", 395: "Ingepland.",
        440: "Afgehandelde gesprekken op het vergrendelscherm.", 470: "VoxFlow neemt op; het scherm dimt.",
        520: "De telefoon gaat weg, de praktijk komt in beeld.", 560: "Scherp op je bedrijf; gesprekken afgehandeld.",
        610: "Professioneel: de begroeting.", 640: "Snel: binnen 3 seconden.", 680: "Zonder pauzes: 7 dagen per week.",
        715: "Vijf bellers tegelijk.", 740: "Allemaal direct in gesprek.", 768: "De afspraakbevestiging bij de klant.",
        805: "Deze week loopt vol.", 830: "Volgende week ook.", 880: "Een afspraak wordt de knop “Start gratis”.", 945: "Eindbeeld: logo, regel, knop, voxflow.nl."}
W, M, LC, FW, FH, GAP, ROW = 2200, 60, 560, 480, 270, 24, 430
SWAP = {20: 32, 860: 880}            # for the board: a frame where the moment has landed (the page keeps its own)
HEAD = 250
img = Image.new("RGB", (W, HEAD + ROW * len(d["beats"]) + 70), CREAM)
dr = ImageDraw.Draw(img)

def wrap(text, f, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if dr.textlength(t, font=f) <= width: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

dr.text((M, 58), "VoxFlow — storyboard", font=H1, fill=INK)
dr.text((M, 152), "32 s · 1920×1080 · Nederlandse voice-over · muziek en geluidseffecten · 4,1% beweging · beelden uit de film", font=SUB, fill=GREY)
dr.line((M, HEAD - 22, W - M, HEAD - 22), fill=LINE, width=2)
mask = Image.new("L", (FW, FH), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, FW - 1, FH - 1), 18, fill=255)
for bi, b in enumerate(d["beats"]):
    y = HEAD + bi * ROW
    dr.text((M, y), b["id"], font=NUM, fill=TEAL)
    dr.text((M + 52, y), b["time"].replace(".", ","), font=TC, fill=GREY)
    ty = y + 42
    for ln in wrap(TITLES[bi], H2, LC - 40):
        dr.text((M, ty), ln, font=H2, fill=INK); ty += 50
    ty += 10
    for ln in wrap("“" + b["caption"] + "”", VO, LC - 40):
        dr.text((M, ty), ln, font=VO, fill=TEAL); ty += 40
    for fi, f in enumerate(b["frames"]):
        f = {**f, "frame": SWAP.get(f["frame"], f["frame"])}
        x = M + LC + fi * (FW + GAP)
        im = Image.open(os.path.join(R, "frames", f"f{f['frame']:04d}.jpg")).convert("RGB").resize((FW, FH), Image.LANCZOS)
        dr.rounded_rectangle((x - 1, y - 1, x + FW, y + FH), 19, outline=LINE, width=2)
        img.paste(im, (x, y), mask)
        dr.text((x, y + FH + 12), f"{f['frame'] / 30:.1f} s".replace(".", ","), font=TC, fill=TEAL)
        cy = y + FH + 44
        for ln in wrap(CAPS[f["frame"]], CAP, FW)[:2]:
            dr.text((x, cy), ln, font=CAP, fill=INK); cy += 32
    if bi < len(d["beats"]) - 1:
        dr.line((M, y + ROW - 26, W - M, y + ROW - 26), fill=LINE, width=2)
out = os.path.join(R, "voxflow-storyboard.jpg")
img.save(out, quality=88, optimize=True)
print(out, img.size)
