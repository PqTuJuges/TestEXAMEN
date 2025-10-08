/* ===========================
   timeline.js (complet)
   - Sélection des cartes (clic, clavier, flèches)
   - Mini-quiz sans rechargement + feedback
   =========================== */

/* ---- 1) Cartes de la timeline : état actif & navigation ---- */
(() => {
  const wrap = document.getElementById('timelineCards');
  if (!wrap) return;

  const cards = Array.from(wrap.querySelectorAll('.tcard'));
  if (!cards.length) return;

  const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
  let activeIndex = clamp(parseInt(wrap.dataset.active || '0', 10), 0, cards.length - 1);

  function setActive(i, { focus = false } = {}) {
    activeIndex = clamp(i, 0, cards.length - 1);
    wrap.dataset.active = String(activeIndex);

    cards.forEach((c, idx) => {
      if (idx === activeIndex) {
        c.setAttribute('aria-current', 'true');
        c.classList.add('is-active');
        if (focus) c.focus();
      } else {
        c.removeAttribute('aria-current');
        c.classList.remove('is-active');
      }
    });
  }

  // Activation au clic + Enter/Espace
  cards.forEach((card, idx) => {
    card.tabIndex = 0;
    card.addEventListener('click', () => setActive(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive(idx, { focus: true });
      }
    });
  });

  // Navigation flèches (depuis le conteneur ou une carte)
  function onArrows(e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? activeIndex + 1 : activeIndex - 1;
    setActive(next, { focus: true });
  }
  wrap.addEventListener('keydown', onArrows);
  cards.forEach((c) => c.addEventListener('keydown', onArrows));

  // Init
  setActive(activeIndex);
})();

/* ---- 2) Mini-quiz Timeline : prévention reload + feedback ---- */
(() => {
  const quiz = document.querySelector('.quiz[data-quiz="timeline"]');
  if (!quiz) return;

  const form = quiz.querySelector('form');
  const feedback = quiz.querySelector('.feedback');
  const btn = form.querySelector('button');

  // Évaluation commune
  function evaluate() {
    const choice = form.querySelector('input[name="q1"]:checked');
    if (!choice) {
      feedback.textContent = 'Choisis une réponse 👇';
      feedback.style.color = 'var(--warn, #ffb454)';
      return;
    }
    const ok = choice.value === 'HTTP/2';
    feedback.textContent = ok
      ? '✅ Exact : 2015 = normalisation de HTTP/2 (binaire, multiplexé → plus rapide).'
      : '❌ Pas tout à fait. Indice : une norme qui accélère le chargement des pages.';
    feedback.style.color = ok ? 'var(--ok, #7bd88f)' : 'var(--danger, #ff6b6b)';
  }

  // Assure la validation au clavier (Entrée)
  if (btn) btn.type = 'submit';

  // Empêche le rechargement de page
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    evaluate();
  });

  // Sécurité : si le bouton repasse en type="button", on gère aussi le clic
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      evaluate();
    });
  }
})();
