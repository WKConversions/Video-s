# Reads the motion probe (scripts/motion_probe.mjs) and finds what Karl sees as spikes, flying and busy frames, from
# the exact position, size and opacity of every element in every frame (not guessed from pixels).
#   python3 motion_probe.py out/probe.jsonl [--profile] [--style calm|standard|energetic]
# What it reports, each with its time:
#   CAMERA   the whole picture (the camera layer) pans or zooms too fast, or starts and stops abruptly. Karl: "out of
#            nowhere starts going right, like a spike" (a linear camera segment), "the frame spikes out of nowhere"
#            (a quick zoom release on a transition).
#   LURCH    something already on screen jumps from still to fast in a frame or two, or turns sharply.
#   OVERSHOOT something grows past its size and springs back (a pop). Fine in a playful film, a spike in a clean one.
#   FLYING   something visible keeps travelling fast for a long time (tiles orbiting a logo, a feed racing past).
#   BUSY     several separate things move in different directions at once, for long enough that the eye can't follow.
# Calibrated on K.B (October 2026): v2, where Karl named the spikes at 6–7 s, ~10 s, 20–22 s and the outro, against
# v3, which he and the client approved; the limits per style are in STYLE below. Exit code 1 when anything is found.
import argparse, json, math, sys, warnings
warnings.filterwarnings("ignore")
from collections import defaultdict
import numpy as np

STYLE = {  # limits; calm and clean is the default Karl approved
    # K.B v3 (approved): camera up to 25 px/s and 5.3 %/s (the ease to rest before the sign-off); v2 (Karl's spikes):
    # 176–564 px/s and 15–19 %/s on transitions, and a 40 px/s sway under the outro
    "calm":      dict(cam_pan=30, cam_zoom=6.0, cam_pan_acc=120, cam_zoom_acc=25, lurch=420, overshoot=True, fly_v=300, fly_t=2.0, busy_groups=3, busy_t=1.0),
    "standard":  dict(cam_pan=45, cam_zoom=8.0, cam_pan_acc=200, cam_zoom_acc=40, lurch=600, overshoot=True, fly_v=380, fly_t=1.5, busy_groups=4, busy_t=1.0),
    "energetic": dict(cam_pan=120, cam_zoom=15.0, cam_pan_acc=600, cam_zoom_acc=100, lurch=900, overshoot=False, fly_v=600, fly_t=2.0, busy_groups=5, busy_t=1.2),
}

def load(path):
    frames = {}
    for line in open(path):
        line = line.strip()
        if line: d = json.loads(line); frames[d["f"]] = d["els"]
    f0, f1 = min(frames), max(frames)
    return [frames.get(f, []) for f in range(f0, f1 + 1)], f0     # a frame the log lost stays empty (NaN)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("probe"); ap.add_argument("--profile", action="store_true")
    ap.add_argument("--style", default="calm", choices=list(STYLE)); ap.add_argument("--fps", type=float, default=30)
    a = ap.parse_args(); L = STYLE[a.style]; fps = a.fps
    frames, f0 = load(a.probe); n = len(frames)
    # tracks: one per element path; an element that changes size sharply between frames is a different element
    # (a conditional sibling mounting shifts the paths), so its track restarts there
    T = defaultdict(lambda: np.full((n, 5), np.nan))   # cx, cy, size, opacity, area
    cam = np.full((n, 3), np.nan)                      # camera layer: cx, cy, scale
    full = defaultdict(int)
    for i, els in enumerate(frames):
        for p, x, y, w, h, o, txt in els:
            T[(p, txt)][i] = (x + w / 2, y + h / 2, math.sqrt(max(w * h, 1)), o, w * h)
            if w * h >= 0.9 * 1920 * 1080 and abs(w / 1920 - h / 1080) < 0.02 and o >= 0.98: full[p] += 1
    # the camera is the full-frame layer that is there all film long, and the deepest of those (the one that moves);
    # a scene's own full-frame layer only lives for its beat
    camp = max(full, key=lambda p: (full[p] >= 0.9 * max(full.values()), p.count("/"))) if full else None
    for i, els in enumerate(frames):
        for p, x, y, w, h, o, txt in els:
            if p == camp: cam[i] = (x + w / 2, y + h / 2, w / 1920)
    out = []
    t = (np.arange(n) + f0) / fps
    # 1 camera: fill frames the log lost, and smooth over 5 frames so rounding doesn't read as acceleration
    for c in range(3):
        col = cam[:, c]; ok = ~np.isnan(col)
        if ok.sum() > 2: cam[:, c] = np.convolve(np.pad(np.interp(np.arange(n), np.where(ok)[0], col[ok]), 2, mode="edge"), np.ones(5) / 5, mode="valid")
    v = np.gradient(cam[:, :2], axis=0) * fps; pan = np.hypot(v[:, 0], v[:, 1])
    zr = np.gradient(np.log(cam[:, 2])) * fps * 100
    pan_acc = np.hypot(*(np.gradient(v, axis=0) * fps).T); zacc = np.abs(np.gradient(zr)) * fps
    bad = (pan > L["cam_pan"]) | (np.abs(zr) > L["cam_zoom"]) | (pan_acc > L["cam_pan_acc"]) | (zacc > L["cam_zoom_acc"])
    for s0, s1 in runs(np.nan_to_num(bad.astype(float)) > 0, 1):
        sl = slice(s0, s1 + 1)
        out.append((t[s0], "CAMERA", f"{t[s0]:.2f}–{t[s1]:.2f} s: the camera {'zooms' if np.nanmax(np.abs(zr[sl])) > L['cam_zoom'] or np.nanmax(zacc[sl]) > L['cam_zoom_acc'] else 'pans'} "
                    f"too fast or too abruptly (pan up to {np.nanmax(pan[sl]):.0f} px/s, zoom up to {np.nanmax(np.abs(zr[sl])):.1f} %/s; "
                    f"limits {L['cam_pan']} px/s and {L['cam_zoom']} %/s)"))
    # per element, in the camera's frame: take the camera move out so only the element's own motion is left
    ownv = {}
    groups_per_frame = np.zeros(n); movers = [[] for _ in range(n)]
    for key, A in T.items():
        if key[1] == "" and np.nanmax(A[:, 4]) > 0.5 * 1920 * 1080: continue      # layers and wrappers, not objects
        vis = A[:, 3] >= 0.5
        size = A[:, 2]
        # a jump in size of more than 25% in one frame means another element took this path
        jump = np.abs(np.diff(np.log(size))) > 0.25
        cx, cy = A[:, 0].copy(), A[:, 1].copy()
        vx = np.diff(cx) * fps; vy = np.diff(cy) * fps
        sp = np.hypot(vx, vy); sp[jump] = np.nan; sp[sp > 3000] = np.nan          # 100 px in one frame: another element took the path
        sr = np.diff(np.log(size)) * fps * 100; sr[jump] = np.nan        # %/s
        ownv[key] = (sp, sr)
        for i in range(1, n - 1):
            if not (vis[i] and vis[i + 1]) or np.isnan(sp[i]): continue
            if sp[i] > 60 or abs(sr[i]) > 40:
                movers[i].append((vx[i], vy[i], sr[i], A[i, 4]))
        # lurch: visible and nearly still for 4 frames, then fast within 2 frames
        for i in range(5, n - 2):
            if vis[i - 5: i + 2].all() and np.all(np.isfinite(sp[i - 4: i + 2])) and np.all(sp[i - 4: i] < 40) and np.min(sp[i: i + 2]) > L["lurch"]:
                out.append((t[i], "LURCH", f"{t[i]:.2f} s: “{key[1] or key[0][-24:]}” jumps from still to {sp[i]:.0f} px/s"))
        # overshoot: an element that has just appeared grows past its size and springs back (a pop); its box must keep
        # its shape (a rotating card's box grows too) and it must have appeared in the last half second
        if L["overshoot"] and not any(seg.startswith(("path", "circle", "line", "svg")) for seg in key[0].split("/")[-1:]):
            appear = np.where(np.diff((A[:, 3] >= 0.5).astype(int)) == 1)[0]
            for i in range(3, n - 8):
                if not len(appear) or not np.any((appear <= i) & (appear >= i - 15)): continue
                if vis[i] and sr[i] > 30 and not np.isnan(sr[i]):
                    nxt = sr[i + 1: i + 8]
                    if np.nanmin(nxt) < -12 and size[i + 1] > 40:
                        peak = np.nanmax(size[i: i + 8]); settle = size[min(n - 1, i + 8)]
                        later = size[i + 8: i + 20]                                  # a pop lands and stays
                        stays = len(later) >= 8 and np.all(np.abs(later / settle - 1) < 0.03) and vis[i + 8: i + 20].all()
                        if peak > settle * 1.03 and stays:
                            out.append((t[i], "OVERSHOOT", f"{t[i]:.2f} s: “{key[1] or key[0][-24:]}” pops past its size by {100 * (peak / settle - 1):.0f}% and springs back"))
                            break
        # flying: visible and fast for a long time
        fast = vis[:-1] & (np.nan_to_num(sp) > L["fly_v"])
        heading = np.unwrap(np.arctan2(vy, vx))
        for s0, s1 in runs(fast, int(L["fly_t"] * fps)):
            # a straight run (a conveyor, an exit) reads as one purposeful move; circling or swinging is flying around
            if np.nanmax(heading[s0:s1 + 1]) - np.nanmin(heading[s0:s1 + 1]) < math.radians(120): continue
            out.append((t[s0], "FLYING", f"{t[s0]:.2f}–{t[s1]:.2f} s: “{key[1] or key[0][-24:]}” keeps travelling at {np.nanmedian(sp[s0:s1 + 1]):.0f} px/s for {(s1 - s0 + 1) / fps:.1f} s"))
    # busy: separate motions at once (elements moving together, like the words of a line, count as one)
    for i in range(n):
        g = []
        for vx_, vy_, sr_, ar in movers[i]:
            for G in g:
                if math.hypot(vx_ - G[0], vy_ - G[1]) < 0.35 * max(60, math.hypot(G[0], G[1])) and abs(sr_ - G[2]) < 25: break
            else: g.append((vx_, vy_, sr_))
        groups_per_frame[i] = len(g)
    for s0, s1 in runs(groups_per_frame >= L["busy_groups"], int(L["busy_t"] * fps)):
        out.append((t[s0], "BUSY", f"{t[s0]:.2f}–{t[s1]:.2f} s: up to {int(groups_per_frame[s0:s1 + 1].max())} separate motions at once for {(s1 - s0 + 1) / fps:.1f} s"))
    # print, folding the parts of one object (a card, its icon, its label) that do the same thing at the same moment
    shown = []
    for tt, kind, msg in sorted(out):
        if any(k == kind and abs(t0 - tt) < 0.2 for t0, k in shown if kind != "CAMERA"): continue
        shown.append((tt, kind)); print(kind, msg)
    counts = defaultdict(int)
    for _, kind, _ in out: counts[kind] += 1
    print(f"summary ({a.style}): camera pan up to {np.nanmax(pan):.0f} px/s, zoom up to {np.nanmax(np.abs(zr)):.1f} %/s; "
          f"separate motions at once: median {np.median(groups_per_frame):.0f}, 95th {np.percentile(groups_per_frame, 95):.0f}; "
          + ", ".join(f"{k} {v}" for k, v in sorted(counts.items())) if counts else
          f"summary ({a.style}): clean. camera pan up to {np.nanmax(pan):.0f} px/s, zoom up to {np.nanmax(np.abs(zr)):.1f} %/s; separate motions at once: median {np.median(groups_per_frame):.0f}, 95th {np.percentile(groups_per_frame, 95):.0f}")
    if a.profile:
        for s in range(0, n, int(fps)):
            sl = slice(s, min(n, s + int(fps)))
            print(f"{s / fps:6.1f}s  camera {np.nanmax(pan[sl]):4.0f} px/s {np.nanmax(np.abs(zr[sl])):4.1f} %/s   motions {groups_per_frame[sl].mean():3.1f} (max {groups_per_frame[sl].max():.0f})")
    sys.exit(1 if out else 0)

def runs(mask, minlen):
    r, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j + 1 < n and mask[j + 1]: j += 1
            if j - i + 1 >= minlen: r.append((i, j))
            i = j + 1
        else: i += 1
    return r

if __name__ == "__main__":
    main()
