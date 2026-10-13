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
    "The headline builds; the start ball drops and the red route runs ahead of an open, empty suitcase",
    "Everything flies into the case on \"koffer pakt\"; the lid shuts, a JongLeren tag",
    "A red field grows out of the start ball; the logo rises; four to-dos become the bull's juggled balls",
    "The balls land as the route's five steps; the first dot opens into the intake card; a day is picked",
    "The video call; your tile becomes the big one; the study field rolls",
    "Wishes land as chips; the school's checklist slides in and ticks; step 1 done",
    "The card becomes a phone; the app icon flies in; the download ring fills; the app opens out of its icon",
    "\"Mijn stage\": the app's own step list ticks \"Installeer de app\"",
    "The phone steps aside; vacancies flick past; one locks with a red ring: Match",
    "The match card flips into the invitation; you and the company joined by the red line",
    "The invitation opens into the company: interns with their manager",
    "\"Aangenomen!\" stamp and confetti; step 4 done",
    "The housing option over a house photo; the switch flips on \"indien nodig\"",
    "The photo clears: \"Huisvesting dicht bij je stage.\"; a pin lands on the house",
    "Spain opens out of the pin: the suitcase from the hook has arrived in Málaga; ringed, step 5 ticked",
    "The photo becomes a card; the team slides in: \"We staan voor je klaar.\"",
    "A card deals in: Persoonlijke begeleiding (an internship visit)",
    "The red mark sweeps under \"begeleiding\"",
    "Coaching and Activiteiten join the row",
    "The cards fold into the fifth step; the line runs from the first question to the last day",
    "The dots lift off and land as the logo's four balls; Granada opens behind the card",
    "\"Jouw stage,\" builds under the logo",
    "\"volledig\" in red",
    "\"begeleid.\" completes the promise; the camera's slow push to the end",
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
d.text((16, 18), "JongLeren.es — \"Jouw stage, volledig begeleid\" · 42 s · one frame per phrase, from the render", fill="#26231F", font=font(22, True))
tmp = tempfile.mkdtemp()
for i, ((a, b, text), ev) in enumerate(zip(PHRASES, EVENTS)):
    t = max(a + 0.3, b - 0.1) if i < len(PHRASES) - 1 else 41.0
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
