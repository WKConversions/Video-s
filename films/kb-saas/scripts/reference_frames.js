// Frames from an online video, run in the video's page through a browser tool (references/reading-references.md).
// 1. Run this whole file: it skips YouTube ads and defines sheet().
// 2. await sheet([0.5, 2, 3.5, 5, 6.5, 8]) draws those moments, with timestamps, onto a canvas; then screenshot it.
// Seek rather than play (a hidden browser pane may not update a playing video). Stepping forward is fast;
// large jumps are slow because the decoder restarts from a keyframe; stop a few frames before the very end.
{
  const v = document.querySelector('video'); v.muted = true; v.play();
  for (let i = 0; i < 40 && document.querySelector('.ad-showing'); i++) {
    document.querySelector('.ytp-skip-ad-button,.ytp-ad-skip-button,.ytp-ad-skip-button-modern')?.click();
    await new Promise(r => setTimeout(r, 1000));
  }
}
window.sheet = async function (times, cols = 3, tw = 266) {
  const v = document.querySelector('video'); v.pause(); v.muted = true;
  const th = Math.round(tw * v.videoHeight / v.videoWidth), rows = Math.ceil(times.length / cols);
  document.getElementById('cs')?.remove();
  const c = Object.assign(document.createElement('canvas'), { id: 'cs', width: cols * tw, height: rows * th });
  Object.assign(c.style, { position: 'fixed', left: '0', top: '0', zIndex: 999999, background: '#000' });
  document.body.appendChild(c); const x = c.getContext('2d');
  for (let i = 0; i < times.length; i++) {
    await new Promise(r => { v.onseeked = r; v.currentTime = times[i]; });
    await new Promise(r => setTimeout(r, 250));
    const px = (i % cols) * tw, py = Math.floor(i / cols) * th;
    x.drawImage(v, px, py, tw, th);
    x.fillStyle = '#ff0'; x.font = 'bold 14px sans-serif'; x.fillText(times[i].toFixed(2) + 's', px + 4, py + 15);
  }
  return { rows, th };
};
