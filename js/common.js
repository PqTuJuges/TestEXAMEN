// Helpers
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const toast = msg => { const t = $('#toast'); if(!t) return; t.textContent = msg; t.hidden = false; setTimeout(()=> t.hidden = true, 1200); };

// Date de build
const updatedEl = $('#updated');
if (updatedEl) updatedEl.textContent = new Date().toLocaleDateString('fr-BE',{year:'numeric',month:'long',day:'numeric'});

// Boutons copier
(function setupCopy(){
  $$('[data-copy]').forEach(btn=>{
    const targetSel = btn.getAttribute('data-copy');
    btn.addEventListener('click', async ()=>{
      const el = $(targetSel); if(!el) return;
      const text = el.tagName === 'INPUT' ? el.value : el.innerText;
      try { await navigator.clipboard.writeText(text); toast('Copié !'); }
      catch { toast('Copie impossible'); }
    });
  });
})();

// Sous-nav active (rootMargin en px → pas de calc())
(function highlightNav(){
  const links = Array.from(document.querySelectorAll('.subnav a[href]'));
  const here = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a=>{
    const file = a.getAttribute('href');
    if (file === here) a.classList.add('active');
  });
})();
// ===== Sous-nav : drag-to-scroll + accessibilité clavier (commun à tout le site)
(() => {
  const track = document.querySelector('.subnav .navline');
  if (!track) return;

  // Focusable pour le scroll au clavier
  track.tabIndex = 0;

  // Drag-to-scroll (desktop + tactile)
  let isDown = false, startX = 0, startScroll = 0;
  const getX = (e) => (e.touches?.[0]?.pageX ?? e.pageX) - track.getBoundingClientRect().left;

  const onDown = (e) => {
    isDown = true;
    track.classList.add('grabbing');
    startX = getX(e);
    startScroll = track.scrollLeft;
  };
  const onMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = getX(e);
    track.scrollLeft = startScroll - (x - startX);
  };
  const onUp = () => { isDown = false; track.classList.remove('grabbing'); };

  track.addEventListener('mousedown', onDown);
  track.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  track.addEventListener('touchstart', onDown, { passive: true });
  track.addEventListener('touchmove', onMove, { passive: false });
  track.addEventListener('touchend', onUp);

  // Flèches clavier pour défiler
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') track.scrollBy({ left: 120, behavior: 'smooth' });
    if (e.key === 'ArrowLeft')  track.scrollBy({ left:-120, behavior: 'smooth' });
  });
})();
// ===== Hamburger nav (commun à tout le site)
(() => {
  const subnav  = document.querySelector('.subnav');
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('navMenu');
  if (!subnav || !toggle || !menu) return;

  const setOpen = (open) => {
    subnav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) menu.querySelector('a')?.focus();
  };

  // Click bouton
  toggle.addEventListener('click', () => setOpen(!subnav.classList.contains('open')));

  // Fermer avec Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Fermer après clic sur un lien
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

  // Fermer si on passe en desktop (resize)
  const mq = window.matchMedia('(min-width: 901px)');
  const sync = () => setOpen(false);
  mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
})();
