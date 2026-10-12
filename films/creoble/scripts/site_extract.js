// Website extraction, run in the client's page through a browser tool after it has loaded and been
// scrolled once (design/asset-strategy.md). Returns brand values, logo markup, image addresses,
// headings and page text as one object.
(() => {
  const cs = e => getComputedStyle(e);
  const pick = sel => { const e = document.querySelector(sel); if (!e) return null; const s = cs(e);
    return { sel, text: (e.innerText || '').trim().slice(0, 120), font: s.fontFamily, size: s.fontSize, weight: s.fontWeight,
      tracking: s.letterSpacing, color: s.color, bg: s.backgroundColor, radius: s.borderRadius }; };
  const vars = {};
  for (const sheet of document.styleSheets) { let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) if (r.style && /^(:root|html|body)$/.test(r.selectorText || ''))
      for (let i = 0; i < r.style.length; i++) { const p = r.style[i]; if (p.startsWith('--')) vars[p] = r.style.getPropertyValue(p).trim(); } }
  const count = {}, fonts = {}, eases = {}; const add = (o, k) => { o[k] = (o[k] || 0) + 1; };
  document.querySelectorAll('body *').forEach(e => { if (!e.offsetWidth) return; const s = cs(e);
    [s.color, s.backgroundColor, s.borderTopColor].forEach(c => { if (c && c !== 'rgba(0, 0, 0, 0)') add(count, c); });
    add(fonts, s.fontFamily); if (s.transitionDuration !== '0s') add(eases, s.transitionTimingFunction); });
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const logos = [...document.querySelectorAll('header svg, header img, a[href="/"] svg, a[href="/"] img, [class*="logo" i] svg, [class*="logo" i] img, img[alt*="logo" i]')]
    .filter((e, i, a) => a.indexOf(e) === i).slice(0, 6)
    .map(e => e.tagName.toLowerCase() === 'svg' ? { type: 'svg', markup: e.outerHTML.slice(0, 30000) } : { type: 'img', src: e.currentSrc || e.src, alt: e.alt });
  return {
    title: document.title, url: location.href, vars, colors: top(count, 16), fonts: top(fonts, 6), eases: top(eases, 5),
    h1: pick('h1'), h2: pick('h2'), body: pick('body'), button: pick('a[class*="btn" i], button, a[class*="button" i]'),
    logos, icons: [...document.querySelectorAll('link[rel*="icon"], meta[property="og:image"]')].map(e => new URL(e.href || e.content, location.href).href),
    images: [...document.images].filter(i => i.naturalWidth >= 200).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight })).slice(0, 60),
    headings: [...document.querySelectorAll('h1, h2, h3')].map(h => h.innerText.trim()).filter(Boolean).slice(0, 40),
    text: document.body.innerText.replace(/\s+\n/g, '\n').slice(0, 6000)
  };
})()
