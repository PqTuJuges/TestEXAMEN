// Timeline sans slider ni chip : on garde la sélection de carte et l'état actif
(() => {
  const wrap = document.getElementById('timelineCards');
  if (!wrap) return;

  const cards = Array.from(wrap.querySelectorAll('.tcard'));

  // Applique l'état actif (visuel/a11y) sur la carte d'index i
  const setActive = (i) => {
    const idx = Math.max(0, Math.min(i, cards.length - 1));
    wrap.dataset.active = String(idx);
    cards.forEach((c, j) => c.toggleAttribute('aria-current', j === idx));
  };

  // Cartes focusables + activables au clic / clavier
  cards.forEach((card, i) => {
    card.tabIndex = 0;
    card.addEventListener('click', () => setActive(i));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); }
    });
  });

  // Init
  setActive(Number(wrap.dataset.active || 0));
})();
