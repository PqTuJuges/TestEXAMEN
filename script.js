// ——— helpers
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const toast = msg => { const t = $('#toast'); if(!t) return; t.textContent = msg; t.hidden = false; setTimeout(()=> t.hidden = true, 1200); };

// Date de build
const updatedEl = $('#updated');
if (updatedEl) updatedEl.textContent = new Date().toLocaleDateString('fr-BE', {year:'numeric', month:'long', day:'numeric'});

// Affichage/masquage des astuces
const toggleHints = $('#toggleHints');
if (toggleHints) {
  toggleHints.addEventListener('click', () => {
    const pressed = toggleHints.getAttribute('aria-pressed') === 'true';
    toggleHints.setAttribute('aria-pressed', String(!pressed));
    document.body.classList.toggle('show-hints', !pressed);
    toggleHints.textContent = pressed ? 'Afficher les astuces' : 'Masquer les astuces';
  });
}

// ——— Timeline stepper
const yearRange = $('#yearRange');
const yearLabel = $('#yearLabel');
const tcards = $$('#timelineCards .tcard');
function updateTimeline(i){
  const idx = Math.max(0, Math.min(i, tcards.length-1));
  $('#timelineCards').dataset.active = String(idx);
  const a = tcards[idx];
  yearLabel.textContent = `${a.dataset.year} · ${a.dataset.title}`;
}
if (yearRange) {
  yearRange.addEventListener('input', e=> updateTimeline(Number(e.target.value)));
  updateTimeline(Number(yearRange.value));
}

// ——— Quiz engine (générique)
$$('details.quiz').forEach(qz => {
  const form = $('form', qz);
  const fb = $('.feedback', qz);
  const id = qz.dataset.quiz;
  const answers = { timeline: 'HTTP/2', standards: 'IETF' };
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const val = [...data.values()][0];
    const ok = val === answers[id];
    fb.textContent = ok ? '✅ Correct !' : '❌ Essaie encore.';
    fb.style.color = ok ? 'var(--ok)' : 'var(--danger)';
  });
});

// ——— URL Explainer: parse + highlight + examples + copy
const map = $('#urlMap');
const legend = $('#legend');
function setActive(key){
  if (!map || !legend) return;
  $$('.tag', map).forEach(el=> el.classList.toggle('active', key && el.dataset.key===key));
  $$('.item', legend).forEach(el=> el.classList.toggle('active', key && el.dataset.key===key));
}
map?.addEventListener('mouseover', e=>{ const key = e.target?.dataset?.key; if(key) setActive(key); });
map?.addEventListener('mouseleave', ()=> setActive(null));
legend?.addEventListener('mouseover', e=>{ const item = e.target.closest('.item'); if(item) setActive(item.dataset.key); });
legend?.addEventListener('mouseleave', ()=> setActive(null));

const urlInput = $('#urlInput');
$('#parseBtn')?.addEventListener('click', ()=> parseURL(urlInput.value));
$$('.chip.ex').forEach(btn => btn.addEventListener('click', ()=> { urlInput.value = btn.dataset.example; parseURL(urlInput.value); }));

function safeURLParts(raw){
  try{
    const u = new URL(raw);
    return {
      scheme: u.protocol + '//',
      userinfo: (u.username || u.password) ? `${u.username}${u.password? ':'+u.password:''}@` : '',
      host: u.host.replace(/:.*/, ''),
      port: u.port ? ':'+u.port : '',
      path: u.pathname === '/' ? '' : u.pathname,
      query: u.search,
      fragment: u.hash
    };
  }catch{
    const m = /^([a-zA-Z][a-zA-Z0-9+.-]*:)/.exec(raw);
    return { scheme: m? m[1] : '', userinfo:'', host:'', port:'', path:'', query:'', fragment:'' };
  }
}
function applyParts(parts){
  const set = (key, val) => { const el = $(`.tag[data-key="${key}"]`, map); if (el) el.textContent = val; };
  Object.entries(parts).forEach(([k,v])=> set(k, v));
}
function parseURL(raw){ applyParts(safeURLParts(raw)); toast('URL analysée'); }

// Copier
function setupCopyButtons(){
  $$('[data-copy]').forEach(btn => {
    const targetSel = btn.getAttribute('data-copy');
    btn.addEventListener('click', async () => {
      const el = $(targetSel);
      if (!el) return;
      const text = el.tagName === 'INPUT' ? el.value : el.innerText;
      try{ await navigator.clipboard.writeText(text); toast('Copié !'); } catch{ toast('Copie impossible'); }
    });
  });
}
setupCopyButtons();

// ——— Flashcards
$$('.flash').forEach(card => card.addEventListener('click', ()=> card.classList.toggle('flipped')));

// ——— Générateur d’en-têtes sécurité (démo pédagogique)
$('#buildHeaders')?.addEventListener('click', () => {
  const f = $('#headersForm');
  const on = name => f.elements[name]?.checked;
  const lines = [];
  if (on('csp')) lines.push("Content-Security-Policy: default-src 'self'");
  if (on('sri')) lines.push('Subresource-Integrity: required');
  if (on('samesite')) lines.push('Set-Cookie: session=...; SameSite=Lax; Secure; HttpOnly');
  if (on('hsts')) lines.push('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');
  if (on('cors')) lines.push('Access-Control-Allow-Origin: https://exemple.com');
  $('#headersOut').textContent = lines.join('\n');
});

// ——— Active le lien de sous-nav selon la section visible (IntersectionObserver)
(() => {
  const links = Array.from(document.querySelectorAll('.subnav a[href^="#"]'));
  const map = new Map(links.map(a => [a.getAttribute('href'), a]));
  const headerTotal = getComputedStyle(document.documentElement)
    .getPropertyValue('--header-total') || '100px';

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = map.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        history.replaceState(null, '', id);
      }
    });
  }, { rootMargin: `-${headerTotal} 0px -60% 0px`, threshold: 0 });

  document.querySelectorAll('main section[id]').forEach(sec => obs.observe(sec));
})();
