# K.B 2026 rebrand of a finished MP4 (no source): recolour + logo swap, picture otherwise untouched.
#   python3 rebrand.py in.mp4 out.mp4 lut.cube monogram.png [--sheet boxes.json]
# Recolour: a 3D LUT (make_lut) moves only bluish tones: old slate tile/panels -> navy #172B44, old navy -> deep navy,
# old cyan -> #99CDFC; neutrals stay (chroma gate). Logo: in every ORIGINAL frame the old K.B tile (a slate rounded
# square holding white letters) is found by colour and shape, and the new tile (navy #172B44, KB monogram) is painted
# over the LUT'd frame in the same box.
import sys, subprocess, json
import numpy as np, cv2

src, dst, lut, mono_path = sys.argv[1:5]
W, H = 1920, 1080
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", src], capture_output=True, text=True).stdout.strip()
has_audio = bool(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", src], capture_output=True, text=True).stdout.strip())

rd = lambda vf: subprocess.Popen(["ffmpeg", "-v", "error", "-i", src] + (["-vf", vf] if vf else []) + ["-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE, bufsize=W * H * 3 * 2)
orig = rd(None)
recol = rd(f"lut3d=file={lut}:interp=tetrahedral")
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "60", "-i", "-", "-i", src,
                        "-map", "0:v"] + (["-map", "1:a", "-c:a", "copy"] if has_audio else []) +
                       ["-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst], stdin=subprocess.PIPE)

mono = cv2.imread(mono_path, cv2.IMREAD_UNCHANGED)  # white monogram, alpha
NAVY = np.array([23, 43, 68], np.float32)

def tile_img(s):
    """the new logo tile at side s (px): navy rounded square (radius 38/512), monogram at the brand file's proportions"""
    ss = 4  # supersample for clean corners
    S = s * ss
    a = np.zeros((S, S), np.uint8)
    r = max(1, int(round(S * 38 / 512)))
    cv2.rectangle(a, (r, 0), (S - 1 - r, S - 1), 255, -1); cv2.rectangle(a, (0, r), (S - 1, S - 1 - r), 255, -1)
    for cx, cy in [(r, r), (S - 1 - r, r), (r, S - 1 - r), (S - 1 - r, S - 1 - r)]: cv2.circle(a, (cx, cy), r, 255, -1, cv2.LINE_AA)
    alpha = cv2.resize(a, (s, s), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    rgb = np.ones((s, s, 3), np.float32) * NAVY
    mx, my, mw, mh = [int(round(v * s / 512)) for v in (98.7, 137.6, 315, 228.6)]
    if mw > 2 and mh > 2:
        m = cv2.resize(mono, (mw, mh), interpolation=cv2.INTER_AREA).astype(np.float32)
        ma = m[..., 3:4] / 255
        rgb[my:my + mh, mx:mx + mw] = rgb[my:my + mh, mx:mx + mw] * (1 - ma) + 255 * ma
    return rgb, alpha
cache = {}

TILE_COLS = np.array([[0x35, 0x4C, 0x67], [0x3D, 0x55, 0x74], [0x39, 0x50, 0x6D]], np.float32)
def find_tiles(fr):
    """boxes (x, y, side) of old K.B tiles: slate rounded squares with white letters inside"""
    small = cv2.resize(fr, (W // 2, H // 2), interpolation=cv2.INTER_AREA).astype(np.int16)
    d = np.min([np.abs(small - c).max(axis=2) for c in TILE_COLS.astype(np.int16)], axis=0)
    m = (d < 14).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    out = []
    for i in range(1, n):
        x, y, w, h, area = st[i]
        if w < 9 or w > 220 or not (0.86 < w / h < 1.16): continue
        if area < 0.78 * w * h: continue
        X, Y, Wd, Ht = 2 * x, 2 * y, 2 * w, 2 * h
        roi = fr[Y:Y + Ht, X:X + Wd].astype(np.int16)
        white = ((roi.min(axis=2) > 200)).mean()
        if not (0.06 < white < 0.40): continue
        # the letters sit in the middle band (K.B wordmark): white rows mostly in the central 60%
        wr = (roi.min(axis=2) > 200).mean(axis=1)
        mid = wr[int(Ht * 0.2):int(Ht * 0.8)].sum() / max(1e-6, wr.sum())
        if mid < 0.8: continue
        s = int(round((Wd + Ht) / 2))
        out.append((int(X), int(Y), int(s)))
    return out

boxes_log = []
k = 0
fs = W * H * 3
while True:
    bo = orig.stdout.read(fs); br = recol.stdout.read(fs)
    if len(bo) < fs or len(br) < fs: break
    fo = np.frombuffer(bo, np.uint8).reshape(H, W, 3)
    tiles = find_tiles(fo)
    if tiles:
        fr = np.frombuffer(br, np.uint8).reshape(H, W, 3).astype(np.float32).copy()
        for (x, y, s) in tiles:
            pad = max(1, s // 40)  # cover the old tile's anti-aliased rim
            x0, y0, S = x - pad, y - pad, s + 2 * pad
            if x0 < 0 or y0 < 0 or x0 + S > W or y0 + S > H: continue
            if S not in cache: cache[S] = tile_img(S)
            rgb, al = cache[S]
            reg = fr[y0:y0 + S, x0:x0 + S]
            fr[y0:y0 + S, x0:x0 + S] = reg * (1 - al[..., None]) + rgb * al[..., None]
        enc.stdin.write(np.clip(fr + 0.5, 0, 255).astype(np.uint8).tobytes())
        boxes_log.append([k, tiles])
    else:
        enc.stdin.write(br)
    k += 1
enc.stdin.close(); enc.wait()
json.dump(boxes_log, open(dst + ".boxes.json", "w"))
print(f"{src}: {k} frames, logo swapped in {len(boxes_log)} frames")
