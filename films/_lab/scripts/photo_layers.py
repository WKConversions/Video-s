# Splits a photo into what 2.5D motion needs, with free local models (no API): a depth map (Depth Anything V2
# Small, ONNX) and a foreground cut-out matte (ISNet general use, ONNX, from rembg).
#   python3 photo_layers.py photo.jpg outdir [--models ../models]
# Writes outdir/depth.png (near = white, 16-bit), outdir/matte.png (subject = white) and outdir/cutout.png (RGBA).
import sys, os, numpy as np, cv2, onnxruntime as ort

args = sys.argv[1:]
models = args[args.index("--models") + 1] if "--models" in args else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
src, out = args[0], args[1]
os.makedirs(out, exist_ok=True)
img = cv2.imread(src); h, w = img.shape[:2]; rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255

# depth: 518 x 518, ImageNet normalisation; the model returns relative inverse depth (larger = nearer)
s = ort.InferenceSession(os.path.join(models, "depth_anything_v2_small.onnx"), providers=["CPUExecutionProvider"])
x = (cv2.resize(rgb, (518, 518), interpolation=cv2.INTER_CUBIC) - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
d = s.run(None, {s.get_inputs()[0].name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
d = cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC); d = (d - d.min()) / (d.max() - d.min() + 1e-6)
cv2.imwrite(os.path.join(out, "depth.png"), (d * 65535).astype(np.uint16))

# matte: 1024 x 1024, mean 0.5, std 1 (rembg's ISNet settings), min-max normalised
s = ort.InferenceSession(os.path.join(models, "isnet-general-use.onnx"), providers=["CPUExecutionProvider"])
x = cv2.resize(rgb, (1024, 1024), interpolation=cv2.INTER_LINEAR) - 0.5
m = s.run(None, {s.get_inputs()[0].name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
m = (m - m.min()) / (m.max() - m.min() + 1e-6); m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)
cv2.imwrite(os.path.join(out, "matte.png"), (m * 255).astype(np.uint8))
rgba = np.dstack([img, (m * 255).astype(np.uint8)]); cv2.imwrite(os.path.join(out, "cutout.png"), rgba)
print(f"{src}: {w}x{h} -> depth.png, matte.png, cutout.png in {out}")
