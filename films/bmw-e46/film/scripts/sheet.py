import sys
from PIL import Image
frames = [int(x) for x in sys.argv[1].split(',')]
out = sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 2; w = int(sys.argv[4]) if len(sys.argv) > 4 else 800
ims = [Image.open(f'out/test/f{f:04d}.png').convert('RGB') for f in frames]
h = int(w * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols
W = Image.new('RGB', (cols * w, rows * h), 'white')
for i, im in enumerate(ims):
    W.paste(im.resize((w, h), Image.LANCZOS), ((i % cols) * w, (i // cols) * h))
W.save(out)
