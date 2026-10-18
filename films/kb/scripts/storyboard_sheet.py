# Renders one still per voice-over line from the Remotion project and lays them out as a labelled storyboard sheet.
#   python3 storyboard_sheet.py <film dir> <out.jpg>
import json, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
film, out = sys.argv[1], sys.argv[2]
SHOTS = [(1.6, "K.B. Network Intelligence is a system…"), (3.6, "…that turns everyday information…"), (5.6, "…into real business opportunities."), (7.3, "Here's how it works."),
         (9.4, "First, conversations,"), (10.3, "meetings,"), (11.5, "emails, and documents…"), (12.6, "…are collected."),
         (14.2, "Claude processes this information…"), (15.9, "…into structured summaries."), (17.3, "Once approved,"), (19.9, "everything is stored in a central knowledge base,"),
         (22.0, "connected to K.B.'s client ecosystem."), (24.2, "AI then analyzes this knowledge…"), (26.4, "…alongside external data,"), (28.5, "identifying potential partnerships,"),
         (29.5, "referrals,"), (30.4, "investments,"), (33.0, "and opportunities within existing clients."), (35.3, "Specialized agents develop these opportunities…"),
         (37.5, "…into actionable proposals."), (39.8, "Management reviews each stage…"), (41.9, "…before personalized outreach is prepared,"), (42.9, "approved,"),
         (43.6, "sent,"), (44.4, "and tracked."), (45.5, "For example,"), (48.0, "when a client mentions launching a new business,"),
         (50.2, "the system can recognize potential needs,"), (52.2, "identify relevant connections,"), (54.0, "and suggest the next steps."), (56.8, "Every outcome feeds back into the knowledge base,"),
         (58.6, "continuously improving the information…"), (60.6, "…available for future decisions."), (62.6, "End card"), (64.2, "Last frame")]
frames = [min(round(t * 30), 1932) for t, _ in SHOTS]
subprocess.run(["node", "stills.mjs", ",".join(map(str, frames)), "1"], cwd=film, check=True, capture_output=True)
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 17)
W, H, cols = 480, 270, 6
rows = (len(SHOTS) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 34)), (15, 26, 41))
for i, ((t, text), fr) in enumerate(zip(SHOTS, frames)):
    im = Image.open(f"{film}/out/test/f{fr:04d}.png").convert("RGB").resize((W, H))
    x, y = (i % cols) * W, (i // cols) * (H + 34)
    sheet.paste(im, (x, y + 34))
    ImageDraw.Draw(sheet).text((x + 10, y + 8), f"{t:.1f}s  {text}", fill="white", font=font)
sheet.save(out, quality=90)
print(out)
