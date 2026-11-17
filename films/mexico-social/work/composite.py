# Mexico social: the client's video with ONLY the requested changes. Every frame is the original frame, except:
# work/line/fNNN.png and work/logo/fNNN.png replace their frames (the straightened curve, the logo-led text reveal),
# and the two PSD visuals (ov/oNNN.png, RGBA) are laid over frames 186-242. Encoded at high quality (x264 crf 10).
#   python3 composite.py <overlay dir> <out.mp4>
import subprocess, sys, os, numpy as np
from PIL import Image
SRC = '/home/user/Video-s/films/mexico-social/source/social.mp4'; HERE = os.path.dirname(os.path.abspath(__file__))
ov, out = sys.argv[1], sys.argv[2]; W, H, N = 1400, 720, 430
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '4', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
used = {'line': 0, 'logo': 0, 'ov': 0}
for n in range(N):
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    for k in ('logo', 'line'):
        p = os.path.join(HERE, k, f'f{n:03d}.png')
        if os.path.exists(p): f = np.asarray(Image.open(p).convert('RGB')); used[k] += 1; break
    p = os.path.join(ov, f'o{n:03d}.png')
    if os.path.exists(p):
        o = np.asarray(Image.open(p)).astype(np.float32); a = o[..., 3:4] / 255.0
        f = (o[..., :3] * a + f.astype(np.float32) * (1 - a) + 0.5).astype(np.uint8); used['ov'] += 1
    enc.stdin.write(np.ascontiguousarray(f).tobytes())
enc.stdin.close(); enc.wait(); print(out, used)
