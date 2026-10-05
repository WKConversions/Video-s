# Cuts a found track to a film the way an editor would: on bar lines, with a section of the music
# entering on the film's turn and the song's own ending landing on the end card (back-timing).
#   python3 music_fit.py track.mp3 out.wav --length 37 [--lift 9.0] [--end real|fade] [--sheet fit.png]
#        [--max-early 1.0]
# --lift   the film time (s) where the music should open up: the turn from problem to solution, the
#          product's first appearance. The tool finds where instruments enter in the track (bars where the
#          energy steps up) and starts the track so the strongest entry it can reach lands there.
# --end    real (default): join the start of the edit to the song's real ending, on a bar line, at the
#          pair of bars that sound most alike, so nobody hears the cut and the last chord rings out on the
#          end card. fade: no join, a 2.5 s fade to the film's end.
# --lift a,b   two lifts (wicflow, Oct 2026): the music opens up at a and again at b (the turn, then the
#          payoff). Both land on the edit's one bar grid, so b - a is rounded to whole bars and the error is
#          shared between them (at most 0.3 s moved off a). When the track's own next entry doesn't fall
#          there, one join on bar lines cuts from the first lift's section into the bars before a later,
#          louder entry. The ending is then joined after the second lift as usual.
# --end-hit t  place the song's last hit (its final chord) at film time t, within about half a bar, and let
#          its ring-out run on into the end card (faded at the film's end if it is longer).
# The edit may start a fraction of a bar after the film starts (the hook breathes in silence or room tone)
# and its ring-out may end up to --max-early seconds before the film ends, or be faded at the film's end. It writes the wav (48 kHz stereo), prints the
# plan (start, joins, tempo, where each section lands in the film) and, with --sheet, draws the cut.
# Constant-tempo tracks only (DAW-made library music is); check the join by ear or with audio_look.py.
import subprocess, sys, wave
import numpy as np

SR = 48000
A_SR, HOP = 22050, 256

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

def load(path, sr, ch):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", str(ch), "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch).astype(np.float64)

def features(x):
    """Onset curve (spectral flux on log magnitude), its low band (kick, bass), and per-frame loudness."""
    N = 1024
    fr = np.lib.stride_tricks.sliding_window_view(x, N)[::HOP] * np.hanning(N)
    S = np.log1p(30 * np.abs(np.fft.rfft(fr, axis=1)))
    freqs = np.fft.rfftfreq(N, 1 / A_SR)
    d = np.maximum(0, np.diff(S, axis=0, prepend=S[:1]))
    flux, low = d.sum(axis=1), d[:, freqs < 160].sum(axis=1)
    rms = np.sqrt((fr ** 2).mean(axis=1) + 1e-12)
    bands = np.stack([S[:, (freqs >= a) & (freqs < b)].mean(axis=1) for a, b in [(20, 160), (160, 600), (600, 2500), (2500, 11000)]], 1)
    return flux - np.convolve(flux, np.ones(32) / 32, "same"), low, rms, bands

def tempo(onset):
    """BPM and beat phase that best fit the whole track: a comb over every beat, refined to 0.01 BPM."""
    fps = A_SR / HOP
    ac = np.correlate(onset, onset, "full")[len(onset) - 1:]
    lags = np.arange(int(fps * 60 / 180), int(fps * 60 / 60))
    coarse = 60 * fps / lags[np.argmax(ac[lags])]
    while coarse < 80: coarse *= 2
    while coarse > 160: coarse /= 2
    t = np.arange(len(onset)) / fps
    def comb(bpm):
        p = 60 / bpm
        ph = np.mod(t, p) / p                      # where each frame sits in the beat, 0..1
        z = (onset * np.exp(2j * np.pi * ph)).sum()  # the onset curve's pull towards one phase
        return abs(z), (-np.angle(z) / (2 * np.pi)) % 1 * p
    best = max((comb(b)[0], b) for b in np.arange(coarse - 3, coarse + 3, 0.05))[1]
    best = max((comb(b)[0], b) for b in np.arange(best - 0.06, best + 0.06, 0.005))[1]
    return best, -comb(best)[1] % (60 / best)

def main():
    src, out = sys.argv[1], sys.argv[2]
    L = float(arg("--length"))
    lifts = [float(v) for v in arg("--lift").split(",") if v] if arg("--lift") else []
    lift = lifts[0] if lifts else None
    end_hit = float(arg("--end-hit")) if arg("--end-hit") else None
    end_mode, early = arg("--end", "real"), float(arg("--max-early", 1.0))
    x = load(src, A_SR, 1)[:, 0]
    onset, low, rms, bands = features(x)
    fps = A_SR / HOP
    bpm, phase = tempo(onset)
    beat = 60 / bpm
    db = 20 * np.log10(rms / rms.max() + 1e-9)
    loud = np.where(db > -35)[0]
    t_first, E = loud[0] / fps, loud[-1] / fps          # music starts, and rings out to -35 dB
    strong = np.where(onset[: int(E * fps)] > np.percentile(onset, 98))[0]
    last = strong[-1] / fps if len(strong) else E      # the song's last hit (its final chord)
    # for --end-hit, the final chord: the last strong onset before the music stops being sustained (its level,
    # averaged over half a second, falls 4 dB under its level in the closing 20 s) and only rings out
    lvl = 20 * np.log10(np.convolve(rms, np.ones(int(0.5 * fps)) / int(0.5 * fps), "same") + 1e-9)
    i_e = int(E * fps); sus = np.median(lvl[max(0, i_e - int(20 * fps)): max(1, i_e - int(4 * fps))])
    held = np.where(lvl[:i_e] >= sus - 4)[0]
    decay = held[-1] / fps if len(held) else E
    strong90 = np.where(onset[: int((decay + 0.1) * fps)] > np.percentile(onset, 90))[0]
    final = strong90[-1] / fps if len(strong90) else last
    beats = np.arange(phase, len(x) / A_SR, beat)
    # the downbeat: the beat of the four that carries the most kick and bass
    lowb = np.array([low[int(b * fps)] if int(b * fps) < len(low) else 0 for b in beats])
    down = int(np.argmax([lowb[k::4].mean() for k in range(4)]))
    # ...unless the track's section changes agree on another one (wicflow, Oct 2026): in four-on-the-floor
    # music every beat carries a kick, and the guess above can be a beat or two off, which puts every lift
    # and join mid-bar. Sections start on downbeats, so the sharpest changes (2 beats against the 2 before,
    # loudness and band energy, peaks 6 beats apart) vote for their beat of the four; a 60 % majority wins.
    def at_beat(arr, b0):
        i0 = int(b0 * fps); return arr[i0:max(i0 + 1, int((b0 + beat) * fps))].mean(axis=0) if i0 < len(arr) else arr[-1]
    kdb = np.array([20 * np.log10(at_beat(rms, b) + 1e-9) for b in beats]); kb = np.array([at_beat(bands, b) for b in beats])
    nov = np.zeros(len(beats))
    for j in range(2, len(beats) - 2):
        nov[j] = (kdb[j:j + 2].mean() - kdb[j - 2:j].mean()) + 4 * np.maximum(0, kb[j:j + 2].mean(0) - kb[j - 2:j].mean(0)).sum()
    peaks_, votes = [], np.zeros(4)
    for j in np.argsort(-nov):
        if nov[j] <= 0.8 or len(peaks_) >= 8: break
        if all(abs(j - q) >= 6 for q in peaks_): peaks_.append(j); votes[j % 4] += nov[j]
    if votes.sum() > 0 and votes.max() >= 0.6 * votes.sum():
        down = int(np.argmax(votes))
    bars = beats[down::4]; bar = 4 * beat
    # the ending's timing is locked to the bar grid, so it may fall up to a bar either side of L: early by up
    # to --max-early (silence after the ring-out) or late (the ring-out is faded at the film's end)
    late = max(0.0, bar - early) + 0.05
    # per bar: loudness and band energy; an entry is a bar where the music steps up against the bars before it
    def at_bar(arr, b0, b1):
        i0, i1 = int(b0 * fps), max(int(b0 * fps) + 1, int(b1 * fps))
        return arr[i0:i1].mean(axis=0)
    bdb = np.array([20 * np.log10(at_bar(rms, b, b + bar) + 1e-9) for b in bars])
    bb = np.array([at_bar(bands, b, b + bar) for b in bars])
    step = np.zeros(len(bars))
    for i in range(2, len(bars) - 2):
        step[i] = (bdb[i:i + 2].mean() - bdb[i - 2:i].mean()) + 4 * np.maximum(0, bb[i:i + 2].mean(0) - bb[i - 2:i].mean(0)).sum()
    entries = [i for i in np.argsort(-step) if step[i] > 0.8 and bars[i] < E - 8][:8]

    def sim(ia, ib):
        """How unalike two bars sound (band energy in the bar before each and in the bar itself; 0 = alike)."""
        before = np.abs(bb[ia - 1] - bb[ib - 1]).sum() if ia and ib else 9
        return before + np.abs(bb[min(ia, len(bb) - 1)] - bb[min(ib, len(bb) - 1)]).sum()

    def ending(f0, p0, after, phrase_from):
        """The join into the song's ending from the edit's last part (film f0 = track p0), cut no earlier than
        track time `after`: (cost, ja, jb, ring-out end, last hit) or None. Without --end-hit the ring-out ends
        between L - early and L + late; with it the last hit lands within about half a bar of end_hit."""
        best = None
        for ja in bars[(bars >= after - 0.01) & (bars < p0 + L - f0)]:
            for jb in bars[(bars > ja) & (bars > E - L)]:
                end, hit = f0 + (ja - p0) + (E - jb), f0 + (ja - p0) + ((last if end_hit is None else final) - jb)
                if end_hit is None:
                    if not (L - early <= end <= L + late) or hit > L - 1.2: continue
                    aim = 0.3 * abs(L - end)
                else:
                    if abs(hit - end_hit) > 0.55 * bar or end < L - early: continue
                    aim = 1.5 * abs(hit - end_hit)
                ia, ib = int(np.searchsorted(bars, ja)), int(np.searchsorted(bars, jb))
                cost = sim(ia, ib) + (0 if (ia - phrase_from) % 4 == 0 else 0.4) + aim
                if best is None or cost < best[0]: best = (cost, ja, jb, end, hit)
        return best

    e2_used, joins = None, []                              # joins: (film time, track from, track to)
    if len(lifts) >= 2 and entries:
        # two lifts on the edit's one bar grid: lift 2 - lift 1 rounded to N bars, the error shared by both
        N = max(2, int(round((lifts[1] - lift) / bar)))
        l1 = lift + float(np.clip((lifts[1] - lift - N * bar) / 2, -0.3, 0.3))
        k1 = int(l1 // bar); at = l1 - k1 * bar
        louder = lambda i: bdb[i:i + 4].mean() - bdb.max()            # 0 for the track's loudest section
        later = [i for i in np.argsort(-step) if step[i] > 0.8 and bars[i] < E - 4 * bar][:12]
        best = None
        for e1 in entries:
            s1 = bars[e1] - k1 * bar
            if s1 < t_first - 0.05: continue
            for e2 in later:
                if e2 <= e1 + 1: continue
                base = -step[e1] - step[e2] - 0.5 * louder(e2)
                if e2 - e1 == N:                          # the track's own next entry lands on the second lift
                    opts = [(base, None, None)]
                else:                                      # keep j bars of the first lift, then the N - j bars before e2
                    opts = []
                    for j in range(2, N):
                        ia, ib = e1 + j, e2 - (N - j)
                        if ib < 1 or ia >= len(bars) or ib == ia or bars[ib] < t_first: continue
                        phrase = (0 if j % 4 == 0 else 0.4) + (0 if (N - j) % 2 == 0 else 0.2)
                        opts.append((base + 1.0 + 0.5 * sim(ia, ib) + phrase, ia, ib))
                for o in opts:
                    if best is None or o[0] < best[0]: best = (o[0], e1, e2, s1, o[1], o[2])
        if best is None:
            sys.exit("no plan reaches both lifts: try a single --lift")
        _, e_used, e2_used, s, ia, ib = best
        if ia is None:
            f0, p0 = at, s
            segs = []
        else:
            f0, p0 = at + bars[ia] - s, bars[ib]
            segs = [(at, s, bars[ia])]; joins.append((f0, bars[ia], bars[ib]))
        if end_mode == "fade" or f0 + E - p0 <= L:
            segs.append((f0, p0, p0 + (L - f0))); join = None
        else:
            r = ending(f0, p0, bars[e2_used] + 2 * bar, e2_used)
            if r is None:
                sys.exit("no join into the ending fits after the second lift: try --end fade, a larger --max-early or another --end-hit")
            _, ja, jb, end, _ = r
            segs += [(f0, p0, ja), (f0 + ja - p0, jb, E + 0.4)]
            join = (f0 + ja - p0, ja, jb); join_end = end; joins.append(join)
    else:
        # one lift or none: where the edit starts (track time s, on a bar) and when it starts in the film (at, 0..a bar)
        if lift is not None and entries:
            plans = []
            for e in entries:
                for k in range(0, 64):
                    s = bars[e] - k * bar
                    at = lift - (bars[e] - s)
                    if s >= t_first - 0.05 and 0 <= at < bar:
                        plans.append((-(step[e]), at, s, e)); break
            _, at, s, e_used = min(plans) if plans else (0, 0, bars[0], None)
        else:
            s = bars[np.argmax(bars >= t_first - 0.05)]; at, e_used = 0.0, None
        segs = []                                              # (film start, track from, track to)
        if end_mode == "fade" or E - s + at <= L:
            segs.append((at, s, s + (L - at))); join = None
        elif end_hit is not None:
            r = ending(at, s, max(s + 4 * bar, bars[e_used] + 2 * bar if e_used is not None else 0), int(np.searchsorted(bars, s)))
            if r is None: sys.exit("no join puts the last hit near --end-hit: try another --end-hit or --end fade")
            _, ja, jb, end, _ = r
            segs = [(at, s, ja), (at + ja - s, jb, E + 0.4)]
            join = (at + ja - s, ja, jb); join_end = end
        else:
            # the join: a bar in the opening part (ja) cut to a bar near the end (jb) so that
            # at + (ja - s) + (E - jb) lands between L - early and L, at bars that sound most alike
            best = None
            for ja in bars[(bars > s + 4 * bar) & (bars < s + L)]:
                for jb in bars[(bars > ja) & (bars > E - L)]:
                    end = at + (ja - s) + (E - jb)
                    if not (L - early <= end <= L + late) or at + (ja - s) + (last - jb) > L - 1.2: continue
                    ia, ib = int(np.searchsorted(bars, ja)), int(np.searchsorted(bars, jb))
                    before = np.abs(bb[ia - 1] - bb[ib - 1]).sum() if ia and ib else 9
                    after = np.abs(bb[min(ia, len(bb) - 1)] - bb[min(ib, len(bb) - 1)]).sum()
                    phrase = 0 if (ia - int(np.searchsorted(bars, s))) % 4 == 0 else 0.4    # cut on a 4-bar phrase
                    cost = before + after + phrase + 0.3 * abs(L - end)
                    if e_used is not None and ja < bars[e_used] + 2 * bar: cost += 2       # keep the lift intact
                    if best is None or cost < best[0]: best = (cost, ja, jb, end)
            if best is None:
                sys.exit("no join fits: try --end fade, or a larger --max-early")
            _, ja, jb, end = best
            segs = [(at, s, ja), (at + ja - s, jb, E + 0.4)]
            join = (at + ja - s, ja, jb); join_end = end
        joins = [join] if join else []

    # build it at 48 kHz stereo; each join cut 4 ms before the new bar's first transient, 12 ms crossfade
    y = load(src, SR, 2)
    n = int(round(L * SR)); mix = np.zeros((n, 2))
    xf = int(0.012 * SR)
    def snap(t):
        """Move a bar time onto the transient nearest to it (within 40 ms)."""
        i = int(t * fps); w = int(0.04 * fps)
        j = i - w + int(np.argmax(onset[max(0, i - w):i + w + 1])) if i - w >= 0 else i
        return j / fps - 0.004
    # the edit starts on a bar, a little after the film does; pre-roll the music before it so the film
    # never opens in silence (faded in over the first moment, unless that is where the track begins)
    if segs[0][0] > 0 and segs[0][1] - segs[0][0] >= t_first - 0.05:
        f0, a, b = segs[0]; segs[0] = (0.0, a - f0, b)
    cur = 0.0
    for k, (f0, a, b) in enumerate(segs):
        if k: a = snap(a)
        if k + 1 < len(segs): b = snap(b)
        # a join starts where the outgoing part was cut (its own snapped transient), not at the nominal bar time:
        # both sides are cut 4 ms before their bar's transient, so the beat stays continuous and there is no gap
        # (placing it at f0 left up to 40 ms of silence when the outgoing cut snapped early; wicflow, Oct 2026)
        if k: f0 = cur
        cur = f0 + (b - a)
        ia, ib = int(a * SR), min(len(y), int(b * SR) + xf)
        seg = y[ia:ib].copy()
        if k: seg[:xf] *= np.linspace(0, 1, xf)[:, None] ** 0.5
        if k + 1 < len(segs): seg[-xf:] *= np.linspace(1, 0, xf)[:, None] ** 0.5
        if k == 0 and a > t_first + 0.05:                  # started inside the music: a short fade in
            fi = min(len(seg), int(0.6 * SR)); seg[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2
        p = int(round(f0 * SR)); q = min(n, p + len(seg))
        if q > p: mix[p:q] += seg[: q - p]
    if end_mode == "fade":
        fo = int(2.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    else:
        fo = int((0.8 if join and join_end > L else 0.05) * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    pk = np.abs(mix).max()
    if pk > 0.95: mix *= 0.95 / pk
    with wave.open(out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())

    # the plan, in film time
    film = lambda tt: next((f0 + tt - a for f0, a, b in segs if a <= tt < b), None)
    print(f"{src}: {bpm:.2f} BPM, bar {bar:.3f} s, music {t_first:.2f}–{E:.2f} s of the track")
    print(f"start: track {s:.2f} s at film {at:.2f} s" + (f" (pre-rolled from track {segs[0][1]:.2f} s at film 0)" if segs[0][0] == 0 and at > 0 else "") + ("".join(f"; join at film {j[0]:.2f} s: track {j[1]:.2f} → {j[2]:.2f} s" for j in joins) if joins else "; no join (fade out)"))
    for i in sorted(set(entries) | ({e2_used} if e2_used is not None else set())):
        f = film(bars[i])
        if f is not None and 0 <= f <= L: print(f"  entry (+{step[i]:.1f}) at track {bars[i]:.2f} s → film {f:.2f} s" + ("  ← the lift" if i == e_used else "") + ("  ← the second lift" if i == e2_used else ""))
    if join: print(f"  the song's {'last hit' if end_hit is None else 'final chord'} at film {segs[-1][0] + (last if end_hit is None else final) - segs[-1][1]:.2f} s, rings out to {join_end:.2f} s" + (" (faded at the film's end)" if join_end > L else ""))
    if "--sheet" in sys.argv:
        from PIL import Image, ImageDraw
        W, H = 1800, 220
        im = Image.new("RGB", (W + 20, H * 2 + 40), "white"); d = ImageDraw.Draw(im)
        for r, (sig, dur, marks) in enumerate([(x, len(x) / A_SR, [(a, b) for _, a, b in segs]), (load(out, A_SR, 1)[:, 0], L, [(f0, f0 + b - a) for f0, a, b in segs])]):
            y0 = 20 + r * (H + 10); step_ = max(1, len(sig) // W)
            env = np.abs(sig[: len(sig) // step_ * step_]).reshape(-1, step_).max(axis=1)
            for a, b in marks:
                d.rectangle([10 + a / dur * W, y0, 10 + b / dur * W, y0 + H], fill=(225, 240, 235))
            for i, v in enumerate(env[:W]): d.line([10 + i, y0 + H / 2 - v * H / 2, 10 + i, y0 + H / 2 + v * H / 2], fill=(40, 60, 110))
            for bt in (bars if r == 0 else []): d.line([10 + bt / dur * W, y0 + H - 6, 10 + bt / dur * W, y0 + H], fill=(160, 160, 160))
            for i in (entries if r == 0 else []): d.line([10 + bars[i] / dur * W, y0, 10 + bars[i] / dur * W, y0 + 14], fill=(200, 60, 50), width=3)
            d.text((14, y0 + 2), "track (kept parts shaded, red: entries)" if r == 0 else "the edit, film time", fill=(0, 0, 0))
        im.save(arg("--sheet"))

main()
