const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
function closeMenu(restoreFocus = false) {
 const wasOpen = menuButton?.getAttribute('aria-expanded') === 'true';
 menuButton?.setAttribute('aria-expanded', 'false');
 menuButton?.setAttribute('aria-label', 'Open navigation');
 document.body.classList.remove('menu-open');
 document.querySelectorAll('main, footer').forEach(element => { element.inert = false; });
 if (restoreFocus && wasOpen) menuButton.focus();
}
menuButton?.addEventListener('click', () => {
 const open = menuButton.getAttribute('aria-expanded') !== 'true';
 if (!open) { closeMenu(true); return; }
 menuButton.setAttribute('aria-expanded', String(open));
 menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
 document.body.classList.toggle('menu-open', open);
 document.querySelectorAll('main, footer').forEach(element => { element.inert = true; });
 nav.querySelector('a')?.focus();
});
nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => {
 if (e.key === 'Escape') closeMenu(true);
 if (e.key !== 'Tab' || menuButton?.getAttribute('aria-expanded') !== 'true') return;
 const links = [...nav.querySelectorAll('a')];
 if (e.shiftKey && document.activeElement === menuButton) { e.preventDefault(); links.at(-1)?.focus(); }
 else if (!e.shiftKey && document.activeElement === links.at(-1)) { e.preventDefault(); menuButton.focus(); }
});
window.matchMedia('(max-width: 1000px)').addEventListener('change', () => closeMenu());
const film = document.querySelector('#brand-film');
if (film) {
 film.muted = true;
 film.loop = true;
 film.controls = false;
 const syncSoundState = () => {
  film.setAttribute('aria-pressed', String(!film.muted));
  film.setAttribute('aria-label', film.muted ? 'Turn video sound on' : 'Turn video sound off');
  const hint = document.querySelector('#film-sound-hint');
  if (hint) {
   const action = window.matchMedia('(max-width: 1000px)').matches ? 'Tap video' : 'Click video';
   hint.textContent = `${action} ${film.muted ? 'for sound' : 'to mute'}`;
  }
 };
 const toggleSound = () => {
  film.muted = !film.muted;
  syncSoundState();
  if (film.paused) film.play().catch(() => {});
 };
 film.addEventListener('click', toggleSound);
 film.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSound(); }
 });
 film.addEventListener('volumechange', syncSoundState);
 syncSoundState();
 film.play().catch(() => {});
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
 const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.06 });
 document.querySelectorAll('[data-reveal]').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
}
const form = document.querySelector('#brief-form');
if (form) form.querySelector('button[type="submit"]').disabled = false;
form?.addEventListener('submit', async e => {
 e.preventDefault();
 if (!form.reportValidity()) return;
 const data = new FormData(form);
 const brief = `Project brief for K.B.\n\nName: ${data.get('name') || ''}\nCompany: ${data.get('company') || ''}\nEmail: ${data.get('email') || ''}\nArea: ${data.get('service') || ''}\n\nChallenge / project:\n${data.get('message') || ''}`;
 const status = document.querySelector('#form-status');
 try {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(brief);
  status.textContent = 'Brief copied. Ready to share with K.B.';
 } catch {
  let output = document.querySelector('#brief-output');
  if (!output) { output = document.createElement('textarea'); output.id='brief-output'; output.className='brief-output'; output.readOnly=true; output.setAttribute('aria-label','Your project brief, ready to copy'); form.append(output); }
  output.value=brief; output.focus(); output.select();
  status.textContent = 'Your brief is ready below. Select and copy it to share with K.B.';
 }
});
document.querySelectorAll('[data-case-filter]').forEach(button => button.addEventListener('click', () => {
 const category = button.dataset.caseFilter;
 document.querySelectorAll('[data-case-filter]').forEach(item => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
 document.querySelectorAll('[data-case-category]').forEach(card => { card.hidden = category !== 'all' && !card.dataset.caseCategory.split(' ').includes(category); });
}));
