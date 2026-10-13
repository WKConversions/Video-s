# The storyboard page from the build itself: one frame per phrase of the voice-over, taken from the render
# just before the phrase ends (when its visual event has landed), with the phrase and what happens on screen.
#   python3 scripts/board.py film/out/final.mp4 storyboard/storyboard.jpg      (run from films/jongleren)
import json, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

video, out = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
plan = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "phrase_check.py"), "plan", os.path.join(ROOT, "film", "src", "words.json")],
                      capture_output=True, text=True, check=True).stdout.splitlines()
PHRASES = []
import re
for line in plan:
    m = re.match(r"\s*\d+\s+([0-9.]+)–\s*([0-9.]+)s\s+(.*)", line)
    if m: PHRASES.append((float(m.group(1)), float(m.group(2)), m.group(3).strip()))
EVENTS = [
    "\"Your internship\" builds; the internship window arrives with a photo of where it was",
    "The bar fills to 100%, \"Completed\"; the line runs on out of the card: the beginning",
    "A search bar types \"What comes next?\"; the site's next steps appear under it",
    "The bar closes into an orange point; the A climbs out of it, the L turns; \"Alumni\" lands with the beat",
    "The logo becomes the hub; the graduates tile is joined to it by the line",
    "The first place abroad joins the hub",
    "Two more places join: international career opportunities",
    "The graduate tile opens into \"Our approach · 01 Introduce\": qualification and internship tick",
    "Ambitions as chips (the site's \"kind of work, environment\")",
    "Two destinations; the route draws from you to the one you pick",
    "The profile folds into a tile; both sides move closer; employers arrive",
    "The recruitment agencies card arrives",
    "The agency cards fan out: agencies",
    "Orbs travel the cables; \"Emerging talent\" lands on you",
    "Panel \"For graduates · Your career abroad\" rises",
    "The site's Guidance arrow draws over the harbour promenade: a path forward",
    "The track slides: \"For employers · Your next colleague\"",
    "Six professionals arrive over the city",
    "\"For recruitment agencies\": the site's Connection shape draws",
    "Its strokes thicken: stronger",
    "The two paths meet: connection",
    "\"New countries.\" A city window, a flight across it",
    "\"New colleagues.\" A team says hello",
    "\"New possibilities.\" A second city, the site's Opportunity shape",
    "The windows leave; the AL returns and the name lands beside it",
    "\"From experience\" in the A's orange",
    "\"to opportunity.\" in the L's green, the line drawn between them",
    "The lockup lifts; the site's eyebrow and \"Your next chapter\"",
    "\"starts abroad.\" with the brand line under it; \"Grow together. Go further.\"; the song's last hit",
]
assert len(EVENTS) == len(PHRASES), (len(EVENTS), len(PHRASES))

cols, tw, th, cap = 4, 480, 270, 92
rows = (len(PHRASES) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw + (cols + 1) * 16, rows * (th + cap) + (rows + 1) * 16 + 60), "#F4F1EE")
d = ImageDraw.Draw(sheet)
def font(size, bold=False):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf" % ("-Bold" if bold else "")]:
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()
d.text((16, 18), "Alumni — \"Your next chapter starts abroad\" · 39 s website hero · one frame per phrase, from the render", fill="#26231F", font=font(22, True))
tmp = tempfile.mkdtemp()
for i, ((a, b, text), ev) in enumerate(zip(PHRASES, EVENTS)):
    t = max(a + 0.3, b - 0.1) if i < len(PHRASES) - 1 else 38.0
    fn = os.path.join(tmp, f"p{i:02d}.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1", "-vf", f"scale={tw}:{th}", fn], check=True)
    x, y = 16 + (i % cols) * (tw + 16), 76 + (i // cols) * (th + cap + 16)
    sheet.paste(Image.open(fn).convert("RGB"), (x, y))
    d.rectangle([x, y + th, x + tw, y + th + cap], fill="white")
    head = f"P{i + 1:02d}  {a:.2f} s   “{text}”"
    while d.textlength(head, font=font(15, True)) > tw - 20:      # long phrases end in an ellipsis inside the tile
        text = text[:-1]; head = f"P{i + 1:02d}  {a:.2f} s   “{text.rstrip()}…”"
    d.text((x + 10, y + th + 8), head, fill="#D2020C", font=font(15, True))
    words, line, ly = ev.split(), "", y + th + 32
    for w_ in words:                                  # wrap the event description to the tile
        if d.textlength(line + " " + w_, font=font(14)) > tw - 20:
            d.text((x + 10, ly), line.strip(), fill="#26231F", font=font(14)); ly += 18; line = ""
        line += " " + w_
    d.text((x + 10, ly), line.strip(), fill="#26231F", font=font(14))
sheet.save(out, quality=88)
print(out, sheet.size)
