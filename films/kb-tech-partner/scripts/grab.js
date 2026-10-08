// Download a file from inside the client's page (design/asset-strategy.md). Define it once in the page, then
// call `await grab(url)` for each file. It returns a data URL; the part after the comma is the file in base64,
// to decode and save into assets/. Files on other domains may refuse; screenshot those instead.
window.grab = async (url) => {
  const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status);
  const b = await r.blob();
  return await new Promise(res => { const f = new FileReader(); f.onload = () => res(f.result); f.readAsDataURL(b); });
};
