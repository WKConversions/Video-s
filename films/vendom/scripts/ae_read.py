# Reads an After Effects project (.aep) the way an animator reads the graph editor: every composition, its layers, the
# animated properties with their keyframes and temporal eases, the expressions it knows (an elastic controller, the
# linked text-selector presets), and the speed graph of each move. Karl sends small AE files with named compositions
# as references for motion style and speed graphs (motion/speed-graphs.md): read them as direction, never as a
# literal copy.
#   python3 ae_read.py Training.aep                       plain summary per composition
#   python3 ae_read.py Training.aep --json out.json       + sampled curves (10 samples a frame) and per-frame values
#   python3 ae_read.py Training.aep --sheet out.html [--png out.png]   a speed-graph card per composition
# Each ease is also given as the Remotion equivalent, Easing.bezier(x1, y1, x2, y2), read from the AE handles:
# x1 = outgoing influence, x2 = 1 − incoming influence, y from the handle speeds (0 when the speed is 0).
# Needs py-aep (pip install aep-parser; it installs py-aep, imported as py_aep). --png needs Chromium.
import argparse, json, math, os, re, subprocess, sys

FPS_DEFAULT = 30

def vec(v):
    if isinstance(v, (int, float)): return [float(v)]
    return [float(x) for x in v]

def ease_of(e, dim):
    if not e: return (0.0, 1 / 6)
    x = e[min(dim, len(e) - 1)]
    return (float(x.speed), float(x.influence) / 100)

def interp_name(k, side):
    it = getattr(k, f"{side}_interpolation_type", None)
    return it.name if it is not None else "LINEAR"

def cubic(p0, p1, p2, p3, u):
    a = 1 - u
    return a * a * a * p0 + 3 * a * a * u * p1 + 3 * a * u * u * p2 + u * u * u * p3

def solve_u(x0, x1, x2, x3, x):
    lo, hi = 0.0, 1.0                                   # x(u) rises monotonically for AE handles (influence ≤ 100%)
    for _ in range(60):
        m = (lo + hi) / 2
        if cubic(x0, x1, x2, x3, m) < x: lo = m
        else: hi = m
    return (lo + hi) / 2

class Track:
    """One animated property: keyed value at any time (temporal eases, spatial paths, holds), plus a known expression."""
    def __init__(self, prop, layer, path):
        self.prop, self.layer, self.path = prop, layer, path
        self.name = prop.name
        self.keys = list(prop.keyframes)
        self.spatial = bool(getattr(prop, "is_spatial", False))
        self.dims = len(vec(self.keys[0].value))
        self.expr = (prop.expression or "") if getattr(prop, "expression_enabled", False) else ""
        self.elastic = None
        if "Elastic Controller" in self.expr and "Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t)" in self.expr.replace(" ", ""):
            fx = effect_values(layer).get("Elastic Controller", {})
            if fx:
                self.elastic = (fx.get("Amplitude", 20) / 200, fx.get("Frequency", 40) / 30, fx.get("Decay", 60) / 10)

    def seg(self, t):
        ks = self.keys
        for i in range(len(ks) - 1):
            if ks[i].time <= t <= ks[i + 1].time: return i
        return None

    def keyed(self, t):
        ks = self.keys
        if t <= ks[0].time: return vec(ks[0].value)
        if t >= ks[-1].time: return vec(ks[-1].value)
        i = self.seg(t); a, b = ks[i], ks[i + 1]
        va, vb = vec(a.value), vec(b.value)
        if interp_name(a, "out") == "HOLD": return va
        dt = b.time - a.time
        if self.spatial:
            ta = vec(a.out_spatial_tangent or [0] * len(va)); tb = vec(b.in_spatial_tangent or [0] * len(vb))
            pts = self.path_pts(i, va, vb, ta, tb)
            D = pts[-1][1]
            if D < 1e-9: return va
            s = self.ease_val(a, b, 0, 0.0, D, t, dt, spatial=True)
            return self.at_dist(pts, s)
        out = []
        for d in range(len(va)):
            out.append(self.ease_val(a, b, d, va[d], vb[d], t, dt))
        return out

    def ease_val(self, a, b, d, v1, v2, t, dt, spatial=False):
        so, io = ease_of(a.out_temporal_ease, d); si, ii = ease_of(b.in_temporal_ease, d)
        if interp_name(a, "out") == "LINEAR" and interp_name(b, "in") == "LINEAR":
            return v1 + (v2 - v1) * (t - a.time) / dt
        if not spatial and v2 < v1: so, si = -abs(so), -abs(si)
        x1, y1 = a.time + io * dt, v1 + so * io * dt
        x2, y2 = b.time - ii * dt, v2 - si * ii * dt
        u = solve_u(a.time, x1, x2, b.time, t)
        return cubic(v1, y1, y2, v2, u)

    _paths = {}
    def path_pts(self, i, va, vb, ta, tb):
        key = (id(self), i)
        if key not in self._paths:
            P0, P3 = va, vb; P1 = [p + q for p, q in zip(va, ta)]; P2 = [p + q for p, q in zip(vb, tb)]
            pts, L, prev = [], 0.0, None
            for j in range(401):
                u = j / 400; p = [cubic(P0[k], P1[k], P2[k], P3[k], u) for k in range(len(va))]
                if prev: L += math.dist(p, prev)
                pts.append((p, L)); prev = p
            self._paths[key] = pts
        return self._paths[key]

    @staticmethod
    def at_dist(pts, s):
        for j in range(1, len(pts)):
            if pts[j][1] >= s:
                (p0, l0), (p1, l1) = pts[j - 1], pts[j]
                f = 0 if l1 == l0 else (s - l0) / (l1 - l0)
                return [x + (y - x) * f for x, y in zip(p0, p1)]
        return pts[-1][0]

    def value(self, t, fd):
        v = self.keyed(t)
        if self.elastic:                                 # the elastic controller: velocity just before the last key, as a decaying sine
            amp, freq, decay = self.elastic
            n = max([i for i, k in enumerate(self.keys) if k.time <= t + 1e-9], default=-1)
            if n >= 1:
                tk = self.keys[n].time; h = fd / 10
                v0, v1 = self.keyed(tk - h - 1e-4), self.keyed(tk - h)
                vel = [(y - x) / 1e-4 for x, y in zip(v0, v1)]
                tr = t - tk; f = amp * math.sin(freq * tr * 2 * math.pi) / math.exp(decay * tr)
                v = [x + w * f for x, w in zip(v, vel)]
        return v

    def bezier(self, i):
        a, b = self.keys[i], self.keys[i + 1]; dt = b.time - a.time
        va, vb = vec(a.value), vec(b.value)
        D = math.dist(va, vb) if self.spatial else (vb[0] - va[0])
        so, io = ease_of(a.out_temporal_ease, 0); si, ii = ease_of(b.in_temporal_ease, 0)
        if interp_name(a, "out") == "HOLD": return "hold"
        if interp_name(a, "out") == "LINEAR" and interp_name(b, "in") == "LINEAR": return "linear"
        if abs(D) < 1e-9: return "none"
        if not self.spatial and D < 0: so, si = -abs(so), -abs(si)
        y1 = so * io * dt / D if self.spatial else so * io * dt / D
        y2 = 1 - si * ii * dt / D
        return f"Easing.bezier({io:.2f}, {y1:.2f}, {1 - ii:.2f}, {y2:.2f})"

def effect_values(layer):
    out = {}
    try:
        from py_aep import PropertyGroup
        for e in layer.effects.properties:
            vals = {}
            def w(g):
                for pr in getattr(g, "properties", []) or []:
                    if isinstance(pr, PropertyGroup): w(pr)
                    else:
                        try: vals[pr.name] = float(pr.value) if not isinstance(pr.value, (list, tuple)) else pr.value
                        except Exception: pass
            w(e); out[e.name] = vals
    except Exception:
        pass
    return out

def shape_names(layer):
    from py_aep import PropertyGroup
    names = []
    def w(g):
        for pr in getattr(g, "properties", []) or []:
            if isinstance(pr, PropertyGroup):
                if pr.match_name.startswith("ADBE Vector Shape"):
                    size = None
                    for q in pr.properties:
                        if q.name == "Size":
                            try: size = vec(q.value)
                            except Exception: pass
                    kind = pr.match_name.split("- ")[-1].lower().replace("rect", "rectangle").replace("group", "path")
                    names.append(kind + (f" {size[0]:.0f}×{size[1]:.0f}" if size else ""))
                w(pr)
    w(layer)
    return names

def tracks_of(layer):
    from py_aep import PropertyGroup
    out = []
    def w(g, path):
        for pr in getattr(g, "properties", []) or []:
            if isinstance(pr, PropertyGroup): w(pr, path + [pr.name])
            elif getattr(pr, "keyframes", None) and len(pr.keyframes) >= 2:
                out.append(Track(pr, layer, path + [pr.name]))
    w(layer, [])
    return out

# ---- text selectors (the linked "Slide & Pop In" style presets and plain range selectors) ----
SHAPES = {1: "square", 2: "ramp up", 3: "ramp down", 4: "triangle", 5: "round", 6: "smooth"}
BASED = {1: "characters", 2: "characters excluding spaces", 3: "words", 4: "lines"}

def text_info(layer):
    """What the text animators do, in words, plus per-unit progress curves (approximate: AE's selector easing isn't
    published, so the ramp's Ease High/Low are read as a fast or eased start and landing)."""
    from py_aep import PropertyGroup
    text = ""
    try:
        root0 = next(p for p in layer.properties if p.match_name == "ADBE Text Properties")
        text = next(q for q in root0.properties if q.name == "Source Text").value.text
    except Exception: pass
    fx = effect_values(layer)
    def fxval(name): return next((v.get("Slider", v.get("Menu")) for k, v in fx.items() if k == name), None)
    def expr_val(pr, default):
        e = (pr.expression or "") if getattr(pr, "expression_enabled", False) else ""
        if not e: return default
        m = re.search(r'effect\("([^"]+)"\)\(1\)', e)
        if not m: return default
        v = fxval(m.group(1))
        if v is None: return default
        c = re.search(r"if \(d == (\d)\)\{\s*(\d+);\s*\}else\{\s*(\d+);", e.replace("\n", " ").replace("\t", " "))
        if c: return float(c.group(2)) if int(v) == int(c.group(1)) else float(c.group(3))
        if re.search(r"\[0,\s*y\]", e): return [0.0, float(v)]
        return float(v)
    anims = []
    root = next((p for p in layer.properties if p.match_name == "ADBE Text Properties"), None)
    if root is None: return None
    ag = next((p for p in root.properties if p.match_name == "ADBE Text Animators"), None)
    if ag is None: return None
    for an in ag.properties:
        sel = {"name": an.name}; props = {}
        for part in an.properties:
            if part.match_name == "ADBE Text Selectors":
                for s in part.properties:
                    for q in s.properties:
                        if isinstance(q, PropertyGroup):
                            for r in q.properties:
                                try: sel[r.name] = expr_val(r, float(r.value))
                                except Exception: pass
                        else:
                            try:
                                sel[q.name] = float(q.value)
                                if q.keyframes and len(q.keyframes) >= 2: sel["keys:" + q.name] = Track(q, layer, [an.name, s.name, q.name])
                                elif getattr(q, "expression_enabled", False) and "text.animator(" in (q.expression or ""):
                                    sel["link:" + q.name] = re.findall(r'"([^"]+)"', q.expression)
                            except Exception: pass
            elif part.match_name == "ADBE Text Animator Properties":
                for q in part.properties:
                    if not (getattr(q, "is_modified", False) or getattr(q, "expression_enabled", False) and q.expression): continue
                    try: props[q.name] = expr_val(q, vec(q.value) if isinstance(q.value, (list, tuple)) else float(q.value))
                    except Exception: pass
        anims.append((sel, props))
    return {"text": text, "anims": anims}

# ---- reading a project ----
def read(path):
    import py_aep
    app = py_aep.parse(path)
    comps = []
    for c in app.project.compositions:
        fps = float(c.frame_rate or FPS_DEFAULT); fd = 1 / fps
        layers = []
        for l in c.layers:
            kind = type(l).__name__
            if kind == "AVLayer" and getattr(l, "source", None) is not None and type(l.source).__name__ == "CompItem":
                layers.append({"name": l.name, "kind": "precomp", "in": l.in_point, "out": l.out_point}); continue
            L = {"name": l.name, "kind": kind, "in": l.in_point, "out": l.out_point, "shapes": shape_names(l) if kind == "ShapeLayer" else [],
                 "tracks": tracks_of(l), "text": text_info(l) if kind == "TextLayer" else None, "fx": effect_values(l), "motion_blur": l.motion_blur}
            layers.append(L)
        comps.append({"name": c.name, "w": c.width, "h": c.height, "fps": fps, "fd": fd, "layers": layers})
    return comps

def sample(tr, t0, t1, fps, per_frame=10):
    n = max(2, int(round((t1 - t0) * fps * per_frame)) + 1); ts = [t0 + (t1 - t0) * i / (n - 1) for i in range(n)]
    vals = [tr.value(t, 1 / fps) for t in ts]
    d = (lambda a, b: math.dist(a, b)) if tr.spatial or tr.dims == 1 else (lambda a, b: abs(a[0] - b[0]))
    sp = [d(vals[i], vals[i - 1]) / (ts[i] - ts[i - 1]) for i in range(1, n)]
    sp = [sp[0]] + sp
    return ts, vals, sp

def frames(tr, t0, t1, fps):
    f0, f1 = int(math.floor(t0 * fps + 1e-6)), int(math.ceil(t1 * fps - 1e-6))
    return [(f / fps, tr.value(f / fps, 1 / fps)) for f in range(f0, f1 + 1)]

def unit(tr):
    n = tr.name.lower()
    return "°/s" if "rotation" in n else "%/s" if "scale" in n or "opacity" in n or tr.path[-2:-1] == ["Range Selector 1"] else "px/s" if tr.spatial or "position" in n else "/s"

def describe(comps):
    lines = []
    for c in comps:
        fps = c["fps"]; own = [l for l in c["layers"] if l["kind"] != "precomp"]
        if not own: lines.append(f"{c['name']}: {c['w']}×{c['h']}, {fps:g} fps, assembles " + ", ".join(f"{l['name']} at {l['in']:.2f} s" for l in sorted(c['layers'], key=lambda l: l['in']))); continue
        lines.append(f"{c['name']} ({c['w']}×{c['h']}, {fps:g} fps)")
        for l in sorted(own, key=lambda l: l["in"]):
            what = ", ".join(l["shapes"]) or (repr(l["text"]["text"]) if l.get("text") else l["kind"])
            lines.append(f"  [{l['in']:.2f}–{l['out']:.2f} s] {l['name']} ({what})")
            for tr in l["tracks"]:
                for i in range(len(tr.keys) - 1):
                    a, b = tr.keys[i], tr.keys[i + 1]; va, vb = vec(a.value), vec(b.value)
                    nf = round((b.time - a.time) * fps)
                    if tr.spatial: chg = f"{va[0]:.0f},{va[1]:.0f} → {vb[0]:.0f},{vb[1]:.0f} ({math.dist(va, vb):.0f} px)"
                    else: chg = f"{va[0]:g} → {vb[0]:g}"
                    if va == vb: lines.append(f"      {tr.name}: holds {nf} f ({a.time:.2f}–{b.time:.2f} s)"); continue
                    so, io = ease_of(a.out_temporal_ease, 0); si, ii = ease_of(b.in_temporal_ease, 0)
                    kind = tr.bezier(i)
                    ease = "linear" if kind == "linear" else f"out influence {io * 100:.1f}% (speed {so:g}), in influence {ii * 100:.1f}% (speed {si:g}) → {kind}"
                    fr = frames(tr, a.time, b.time, fps); steps = [math.dist(fr[j][1], fr[j - 1][1]) for j in range(1, len(fr))]
                    lines.append(f"      {tr.name}: {chg} in {nf} f ({a.time:.2f}–{b.time:.2f} s), {ease}; frame steps " + " ".join(f"{s:.0f}" for s in steps))
                if tr.elastic:
                    amp, freq, dec = tr.elastic
                    lines.append(f"      {tr.name}: + elastic expression (amplitude {amp * 200:g}, frequency {freq * 30:g}, decay {dec * 10:g}): after each key the move carries on as a "
                                 f"sine of {freq:.2f} Hz, decaying e^-{dec:g}t, sized by the speed it arrived with")
            if l.get("text"):
                for sel, props in l["text"]["anims"]:
                    amt = sel.get("Amount", 100)
                    if amt == 0: continue
                    k = next((v for kk, v in sel.items() if kk.startswith("keys:")), None)
                    link = next((v for kk, v in sel.items() if kk.startswith("link:")), None)
                    bits = [f"based on {BASED.get(int(sel.get('Based On', 1)), '?')}", f"shape {SHAPES.get(int(sel.get('Shape', 1)), '?')}"]
                    if "Ease High" in sel: bits.append(f"ease high {sel['Ease High']:g}, ease low {sel['Ease Low']:g}")
                    if "Smoothness" in sel: bits.append(f"smoothness {sel['Smoothness']:g}")
                    drive = (f"{k.name} keyed {vec(k.keys[0].value)[0]:g} → {vec(k.keys[-1].value)[0]:g} over {round((k.keys[-1].time - k.keys[0].time) * fps)} f ({k.bezier(0)})" if k
                             else f"driven by {' / '.join(link)}" if link else "static")
                    lines.append(f"      text animator {sel['name']!r}: {', '.join(f'{p} {v}' for p, v in props.items())}; {'; '.join(bits)}; {drive}")
        # hand-offs: one layer ends where the next begins
        seq = sorted([l for l in own if l["tracks"]], key=lambda l: l["in"])
        for a, b in zip(seq, seq[1:]):
            if abs(a["out"] - b["in"]) < 1.5 / fps:
                ta = next((t for t in a["tracks"] if t.spatial), None); tb = next((t for t in b["tracks"] if t.spatial), None)
                if ta and tb:
                    t = b["in"]; pa = [ta.value(t - k / fps, 1 / fps) for k in (3, 2, 1)]; pb = [tb.value(t + k / fps, 1 / fps) for k in (0, 1, 2)]
                    seq_ = pa + pb; steps = [math.dist(seq_[k], seq_[k - 1]) for k in range(1, len(seq_))]
                    da = [y - x for x, y in zip(pa[-2], pa[-1])]; db = [y - x for x, y in zip(pb[0], pb[1])]
                    cosang = sum(x * y for x, y in zip(da, db)) / ((math.hypot(*da[:2]) * math.hypot(*db[:2])) or 1)
                    gap = math.dist(ta.value(t, 1 / fps), pb[0])
                    lines.append(f"  hand-off at {t:.2f} s: {', '.join(a['shapes']) or a['name']} → {', '.join(b['shapes']) or b['name']}: frame steps "
                                 f"{steps[0]:.0f} {steps[1]:.0f} | {steps[2]:.0f} | {steps[3]:.0f} {steps[4]:.0f} px ({'same direction' if cosang > 0.9 else 'turns'}"
                                 f"{'' if gap < 2 else f'; the new layer starts {gap:.0f} px from where the old one was heading'})")
    return "\n".join(lines)

# ---- speed-graph cards (SVG) ----
COLS = ["#F2B33D", "#4FC3F7", "#F06292", "#9CCC65", "#BA68C8"]

def graph_svg(series, t0, t1, fps, w=560, h=230, cuts=(), keys=(), label_y="px/s", ymax=None, bars=None, title_note=""):
    """series: [(name, ts, speeds, color)]; bars: per-frame speeds [(t, s)] drawn as columns (what the frames show)."""
    pad_l, pad_b, pad_t, pad_r = 52, 28, 14, 10
    W, H = w - pad_l - pad_r, h - pad_b - pad_t
    top = ymax or max(max(s) for _, _, s, _ in series) * 1.12 or 1
    X = lambda t: pad_l + (t - t0) / (t1 - t0) * W
    Y = lambda v: pad_t + H - min(v, top) / top * H
    o = [f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">',
         f'<rect x="0" y="0" width="{w}" height="{h}" rx="10" fill="#1F1F21"/>']
    nf = int(round((t1 - t0) * fps))
    step = 1 if nf <= 24 else 2 if nf <= 48 else 5 if nf <= 120 else 10
    for f in range(0, nf + 1):
        x = X(t0 + f / fps)
        o.append(f'<line x1="{x:.1f}" y1="{pad_t}" x2="{x:.1f}" y2="{pad_t + H}" stroke="{"#3A3A3E" if f % step == 0 else "#29292C"}" stroke-width="1"/>')
        if f % step == 0: o.append(f'<text x="{x:.1f}" y="{h - 9}" fill="#8A8A90" font-size="12" text-anchor="middle" font-family="JetBrains Mono">{f}</text>')
    for j in range(1, 4):
        v = top / 1.12 * j / 3; y = Y(v)
        o.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{pad_l + W}" y2="{y:.1f}" stroke="#2E2E32" stroke-width="1"/>')
        o.append(f'<text x="{pad_l - 6}" y="{y + 4:.1f}" fill="#8A8A90" font-size="11" text-anchor="end" font-family="JetBrains Mono">{fmt(v)}</text>')
    o.append(f'<text x="{pad_l - 6}" y="{pad_t + 10}" fill="#6E6E74" font-size="10" text-anchor="end" font-family="JetBrains Mono">{label_y}</text>')
    if bars:
        bw = max(2.0, W / max(1, nf) * 0.5)
        for t, s in bars:
            o.append(f'<rect x="{X(t) - bw / 2:.1f}" y="{Y(s):.1f}" width="{bw:.1f}" height="{pad_t + H - Y(s):.1f}" fill="#FFFFFF" opacity="0.10"/>')
    for t, lab in cuts:
        o.append(f'<line x1="{X(t):.1f}" y1="{pad_t}" x2="{X(t):.1f}" y2="{pad_t + H}" stroke="#FFFFFF" stroke-opacity="0.55" stroke-dasharray="4 4"/>')
        if lab: o.append(f'<text x="{X(t) + 5:.1f}" y="{pad_t + 12}" fill="#D8D8DC" font-size="11" font-family="Inter">{lab}</text>')
    for name, ts, sp, col in series:
        pts = " ".join(f"{X(t):.1f},{Y(s):.1f}" for t, s in zip(ts, sp))
        o.append(f'<polyline points="{pts}" fill="none" stroke="{col}" stroke-width="2.6" stroke-linejoin="round"/>')
    for t, s, col in keys:
        x, y = X(t), Y(s)
        o.append(f'<rect x="{x - 4:.1f}" y="{y - 4:.1f}" width="8" height="8" fill="{col}" stroke="#1F1F21" stroke-width="1.5" transform="rotate(45 {x:.1f} {y:.1f})"/>')
    if len(series) > 1 or title_note:
        lx = pad_l + 8
        for name, _, _, col in series:
            if not name: continue
            o.append(f'<rect x="{lx}" y="{pad_t + 4}" width="10" height="3" fill="{col}"/><text x="{lx + 14}" y="{pad_t + 9}" fill="#C8C8CC" font-size="11" font-family="Inter">{name}</text>')
            lx += 14 + 7 * len(name) + 14
    o.append("</svg>")
    return "".join(o)

def spacing_svg(positions, w=560, h=46, color="#F2B33D", cuts=()):
    """The spacing chart: where the thing is on each frame. Bunched dots are slow, spread dots are fast."""
    if len(positions) < 2: return ""
    lo, hi = min(positions), max(positions); span = (hi - lo) or 1
    X = lambda p: 18 + (p - lo) / span * (w - 36)
    o = [f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">',
         f'<line x1="18" y1="{h / 2}" x2="{w - 18}" y2="{h / 2}" stroke="#C9CCD3" stroke-width="2"/>']
    for i, p in enumerate(positions):
        r = 5.5 if i in (0, len(positions) - 1) else 4
        o.append(f'<circle cx="{X(p):.1f}" cy="{h / 2}" r="{r}" fill="{color if i not in cuts else "#E5484D"}" stroke="#16181D" stroke-width="1.2"/>')
    o.append("</svg>")
    return "".join(o)

def fmt(v):
    return f"{v / 1000:.1f}k" if v >= 10000 else f"{v:,.0f}" if v >= 10 else f"{v:.1f}"

PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Inter;src:url('{fonts}/Inter-400.woff2');font-weight:400}}
@font-face{{font-family:Inter;src:url('{fonts}/Inter-600.woff2');font-weight:600}}
@font-face{{font-family:Inter;src:url('{fonts}/Inter-700.woff2');font-weight:700}}
@font-face{{font-family:'JetBrains Mono';src:url('{mono}')}}
body{{margin:0;background:#F4F4F6;font-family:Inter;color:#14161B;width:{width}px}}
.wrap{{padding:48px 44px 56px}} h1{{font-size:44px;font-weight:700;margin:0 0 10px;letter-spacing:-.02em}}
.sub{{font-size:19px;color:#4A4E57;max-width:1500px;line-height:1.45;margin-bottom:30px}}
.grid{{display:grid;grid-template-columns:repeat(3,600px);gap:24px}}
.card{{background:#fff;border-radius:16px;padding:20px;box-shadow:0 1px 0 #E3E4E8,0 8px 24px rgba(20,22,27,.05)}}
.id{{font:600 14px 'JetBrains Mono';color:#8A8F99;letter-spacing:.04em}} .name{{font-size:23px;font-weight:700;margin:4px 0 2px;letter-spacing:-.01em}}
.feel{{font-size:15px;color:#4A4E57;margin-bottom:12px}} .src{{display:inline-block;font:600 11px Inter;background:#14161B;color:#fff;border-radius:6px;padding:3px 7px;margin-left:6px;vertical-align:3px}}
.row{{font-size:14.5px;line-height:1.42;margin-top:9px}} .row b{{font-weight:600}} .k{{color:#8A8F99;font-weight:600;font-size:12px;letter-spacing:.06em;text-transform:uppercase;display:block;margin-bottom:1px}}
code{{font:12.5px 'JetBrains Mono';background:#F1F2F5;border-radius:5px;padding:1px 5px;color:#2B2F38}}
.legend{{display:flex;gap:26px;font-size:15px;color:#4A4E57;margin:-8px 0 26px;flex-wrap:wrap}} .legend span{{display:flex;align-items:center;gap:8px}}
</style></head><body><div class="wrap">{body}</div></body></html>"""

def page(body, width=1900):
    here = os.path.dirname(os.path.abspath(__file__))
    fonts = next((p for p in [os.path.join(here, "..", "..", "films", "cartesian-30s", "public", "fonts"), os.path.join(here, "fonts")] if os.path.exists(p)), "")
    mono = "/mnt/skills/examples/canvas-design/canvas-fonts/JetBrainsMono-Regular.ttf"
    return PAGE.format(body=body, width=width, fonts="file://" + os.path.abspath(fonts), mono="file://" + mono)

def screenshot(html_path, png_path, width=1900):
    chrome = next((p for p in ["/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell", "/opt/pw-browsers/chromium/chrome-linux/chrome"] if os.path.exists(p)), "chromium")
    # measure the page height first, then capture it whole
    dump = subprocess.run([chrome, "--no-sandbox", "--headless", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=3000",
                           f"--window-size={width},1000", "--dump-dom", "file://" + os.path.abspath(html_path)], capture_output=True, text=True).stdout
    hm = re.search(r'data-h="(\d+)"', dump)
    hgt = int(hm.group(1)) if hm else 4000
    subprocess.run([chrome, "--no-sandbox", "--headless", "--disable-gpu", "--allow-file-access-from-files", "--hide-scrollbars", "--virtual-time-budget=3000",
                    f"--window-size={width},{hgt}", f"--screenshot={os.path.abspath(png_path)}", "file://" + os.path.abspath(html_path)], capture_output=True)

HEIGHT_JS = '<script>document.fonts.ready.then(()=>{document.body.setAttribute("data-h",Math.ceil(document.querySelector(".wrap").getBoundingClientRect().height))})</script>'

def comp_card(c):
    """A generic card for one composition: the speed graph of every animated property, cuts between layers, spacing."""
    own = [l for l in c["layers"] if l["kind"] != "precomp" and l["tracks"]]
    if not own: return ""
    fps = c["fps"]; t0 = min(l["in"] for l in own); t1 = max(l["out"] for l in own)
    by = {}
    for l in own:
        for tr in l["tracks"]: by.setdefault(tr.name, []).append((l, tr))
    graphs, cuts = [], []
    seq = sorted(own, key=lambda l: l["in"])
    for a, b in zip(seq, seq[1:]):
        if abs(a["out"] - b["in"]) < 1.5 / fps: cuts.append((b["in"], "cut"))
    for i, (name, lts) in enumerate(by.items()):
        ts_all, sp_all, keys, bars = [], [], [], []
        for l, tr in sorted(lts, key=lambda x: x[0]["in"]):
            ts, vals, sp = sample(tr, max(l["in"], t0), min(l["out"], t1), fps)
            ts_all += ts; sp_all += sp
            fr = frames(tr, l["in"], l["out"], fps)
            bars += [(fr[j][0], math.dist(fr[j][1], fr[j - 1][1]) * fps) for j in range(1, len(fr))]
        graphs.append(graph_svg([(name, ts_all, sp_all, COLS[i % len(COLS)])], t0, t1, fps, h=170 if len(by) > 1 else 230, cuts=cuts, label_y=unit(lts[0][1]), bars=bars))
    return f'<div class="card"><div class="id">{c["name"]}</div>' + "".join(graphs) + "</div>"

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("aep"); ap.add_argument("--json"); ap.add_argument("--sheet"); ap.add_argument("--png")
    a = ap.parse_args()
    comps = read(a.aep)
    print(describe(comps))
    if a.json:
        out = []
        for c in comps:
            C = {"name": c["name"], "w": c["w"], "h": c["h"], "fps": c["fps"], "layers": []}
            for l in c["layers"]:
                L = {k: l[k] for k in ("name", "kind", "in", "out")}
                L["shapes"] = l.get("shapes", []); L["tracks"] = []
                for tr in l.get("tracks", []):
                    ts, vals, sp = sample(tr, l["in"], l["out"], c["fps"])
                    L["tracks"].append({"name": tr.name, "path": tr.path, "spatial": tr.spatial, "elastic": tr.elastic,
                                        "keys": [{"t": k.time, "v": vec(k.value), "out": interp_name(k, "out"), "in": interp_name(k, "in"),
                                                  "ease_out": [ease_of(k.out_temporal_ease, d) for d in range(tr.dims)],
                                                  "ease_in": [ease_of(k.in_temporal_ease, d) for d in range(tr.dims)]} for k in tr.keys],
                                        "bezier": [tr.bezier(i) for i in range(len(tr.keys) - 1)],
                                        "t": ts, "value": vals, "speed": sp, "frames": frames(tr, l["in"], l["out"], c["fps"])})
                C["layers"].append(L)
            out.append(C)
        json.dump(out, open(a.json, "w")); print("->", a.json)
    if a.sheet:
        body = f'<h1>{os.path.basename(a.aep)}</h1><div class="grid">' + "".join(comp_card(c) for c in comps) + "</div>" + HEIGHT_JS
        open(a.sheet, "w").write(page(body)); print("->", a.sheet)
        if a.png: screenshot(a.sheet, a.png); print("->", a.png)

if __name__ == "__main__":
    main()
