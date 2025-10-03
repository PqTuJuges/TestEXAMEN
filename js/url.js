// URL explainer
const map = $('#urlMap'), legend = $('#legend'), urlInput = $('#urlInput');
function setActive(key){
  if (!map || !legend) return;
  $$('.tag', map).forEach(el=> el.classList.toggle('active', key && el.dataset.key===key));
  $$('.item', legend).forEach(el=> el.classList.toggle('active', key && el.dataset.key===key));
}
map?.addEventListener('mouseover', e=>{ const k = e.target?.dataset?.key; if(k) setActive(k); });
map?.addEventListener('mouseleave', ()=> setActive(null));
legend?.addEventListener('mouseover', e=>{ const it = e.target.closest('.item'); if(it) setActive(it.dataset.key); });
legend?.addEventListener('mouseleave', ()=> setActive(null));

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

// Mini-lab codes HTTP
(() => {
  const input = $('#statusCode'), run = $('#runStatus'), out = $('#statusResult');
  if (!input || !run || !out) return;
  const explain = (c) => {
    const n = Number(c);
    if (isNaN(n)) return { cls:'status-bad', msg:'❌ Entrez un nombre (ex. 200, 301, 404).' };
    if (n>=200 && n<300) return { cls:'status-ok', msg:'✅ 2xx : Succès (ex. 200 OK).' };
    if (n===301) return { cls:'status-warn', msg:'↪ 301 : Redirection permanente (mémoire navigateur/SEO).' };
    if (n===302) return { cls:'status-warn', msg:'↪ 302 : Redirection temporaire.' };
    if (n>=300 && n<400) return { cls:'status-warn', msg:'↪ 3xx : Redirection.' };
    if (n===404) return { cls:'status-bad', msg:'🔎 404 : Ressource non trouvée.' };
    if (n>=400 && n<500) return { cls:'status-bad', msg:'🙅 4xx : Erreur côté client.' };
    if (n>=500) return { cls:'status-bad', msg:'🛠️ 5xx : Erreur serveur.' };
    return { cls:'status-bad', msg:'ℹ️ Code non standard.' };
  };
  const render = ()=>{ const {cls,msg}=explain(input.value.trim()); out.className='status-box '+cls; out.textContent=msg; };
  run.addEventListener('click', render);
  input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); render(); } });
  render();
})();
