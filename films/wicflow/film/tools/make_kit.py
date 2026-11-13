# Regenerates src/engine/kit.js from the storyboard engine (plan/storyboard/frames-src/lib.js + frames.js).
import re, os
HERE = os.path.dirname(os.path.abspath(__file__)); src = os.path.join(HERE, '../../plan/storyboard/frames-src/')
body = open(src + 'lib.js').read() + '\n' + open(src + 'frames.js').read()
body = body.replace("'use strict';", '').replace('href="../../../harvest/wicflow-mark.png"', 'href="${ASSET.mark}"')
names = []
for m in re.finditer(r'^(?:const|let|function)\s+([A-Za-z_$][\w$]*)', body, re.M):
    if m.group(1) not in names: names.append(m.group(1))
names += ['HGT', 'OY', 'AX', 'AY', 'HZ', 'CH', 'NS']
head = ("/* Wicflow film: the storyboard's isometric block engine (lib.js) and its frame helpers (frames.js), as one ES module.\n"
        "   GENERATED from plan/storyboard/frames-src by tools/make_kit.py: do not edit; extend in your beat file instead.\n"
        "   FRAMES[id]() still draws every storyboard key frame (a full <svg> document), for reference. */\n"
        "export const ASSET = { mark: '../public/img/wicflow-mark.png' };\n")
tail = "\nexport function resetUid() { _uid = 0; }\nexport {\n  " + ",\n  ".join(", ".join(names[i:i+10]) for i in range(0, len(names), 10)) + "\n};\n"
open(os.path.join(HERE, '../src/engine/kit.js'), 'w').write(head + body + tail)
print(len(names), 'exports')
