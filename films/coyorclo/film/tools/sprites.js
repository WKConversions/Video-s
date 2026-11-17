// Renders the four COYOR RUN characters big and sharp with the game's own sprite() (transparent PNG sequences):
//   NODE_PATH=$(npm root -g) node tools/sprites.js <outDir>
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, '../../harvest/game_cap.html')); await p.waitForTimeout(600);
  const jobs = [];
  for (let i = 0; i < 4; i++) {
    for (const [pose, n] of [['run', 24], ['stand', 24], ['jump', 1], ['fly', 24]]) jobs.push([i, pose, n]);
  }
  for (const [i, pose, n] of jobs) {
    for (let k = 0; k < n; k++) {
      const url = await p.evaluate(([i, pose, k, n]) => __eval(`(()=>{const c=document.createElement('canvas');c.width=800;c.height=900;const x=c.getContext('2d');x.imageSmoothingEnabled=true;
        sprite(x,400,40,6,people[${i}],'${pose}',false,${k / Math.max(1, n)} * (2*Math.PI/15)*${pose === 'stand' ? 0.35 : 1},null);return c.toDataURL('image/png')})()`), [i, pose, k, n]);
      fs.writeFileSync(path.join(out, `${['abdel', 'bram', 'paulie', 'rahim'][i]}-${pose}-${String(k).padStart(2, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
    }
  }
  console.log('ok'); await b.close();
})();
