import sys, numpy as np, trimesh
src, dst = sys.argv[1], sys.argv[2]
d = np.load(src)
m = trimesh.Trimesh(d['V'], d['F'], vertex_normals=d['N'], process=False)
m.export(dst)
print(dst, len(d['V']), len(d['F']))
