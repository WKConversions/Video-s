// Computed styles of the main elements of the Alumni page, run in the page after it has loaded and been
// scrolled once (harvest.mjs). Returns { selector: [styles of up to 3 matching elements] }.
(() => {
  const SEL = ['body', 'h1', 'h1 > span', 'h2', 'h3', '.eyebrow', '.hero-eyebrow', '.hero-description', 'main p',
    '.center-heading > p:last-child', '.site-header', '.nav-shell', '.brand-link img', '.desktop-nav', '.desktop-nav a[aria-current]',
    '.desktop-nav a:not([aria-current])', '.nav-contact', '.button', '.button-orange', '.button-green', '.button-outline-light', '.text-link',
    '.hero-cover', '.hero-photo', '.hero-shade', '.hero-audiences', '.hero-audiences > a', '.hero-audiences strong', '.audience-strip-dot',
    'main > section', '.section-tint', '.film-section', '.film-placeholder', '.film-play', '.values-grid', '.value-icon', '.value h3', '.value p',
    '.audience-card', '.audience-card-icon', '.audience-card h3', '.audience-tag', '.audience-card-wide', '.journey-tabs button',
    '.journey-tabs [aria-selected=true]', '.journey-panel', '.journey-route path', '.roots-image', '.photo-caption', '.organizations > a',
    '.organizations strong', '.community-banner', '.community-banner h2', '.contact-form-wrap', '.form-field input', '.contact-option',
    '.footer', '.footer-logo', '.footer-bottom'];
  const KEYS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform', 'color', 'backgroundColor',
    'backgroundImage', 'borderRadius', 'borderTopWidth', 'borderTopColor', 'borderTopStyle', 'boxShadow', 'padding', 'width', 'height',
    'opacity', 'stroke', 'strokeWidth', 'fill', 'objectPosition'];
  const skip = { backgroundImage: 'none', boxShadow: 'none', textTransform: 'none', letterSpacing: 'normal', opacity: '1', stroke: 'none',
    strokeWidth: '1px', fill: 'rgb(0, 0, 0)', objectPosition: '50% 50%', borderTopWidth: '0px' };
  const out = {};
  for (const sel of SEL) {
    const els = [...document.querySelectorAll(sel)].slice(0, 3);
    if (!els.length) continue;
    out[sel] = els.map(e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(), o = {};
      o.text = (e.innerText || e.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      o.id = e.id || undefined; o.box = [Math.round(r.width), Math.round(r.height)];
      for (const k of KEYS) { const v = s[k]; if (v && v !== skip[k]) o[k] = v; }
      if (o.borderTopWidth === undefined) { delete o.borderTopColor; delete o.borderTopStyle; }
      return o; });
  }
  return out;
})()
