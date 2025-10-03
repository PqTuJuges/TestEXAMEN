// Animation DNS (tolérante)
(() => {
  const list = document.getElementById('dnsSteps');
  const playBtn  = document.getElementById('dnsPlay');
  const stopBtn  = document.getElementById('dnsStop');
  const resetBtn = document.getElementById('dnsReset');
  if (!list) return;

  const items = Array.from(list.querySelectorAll('li'));
  if (!items.length) return;

  let i = -1, timer = null;
  const render = () => items.forEach((li, idx) => li.classList.toggle('active', idx === i));
  const step   = () => { i = (i + 1) % items.length; render(); };
  const play   = () => { if (timer) return; step(); timer = setInterval(step, 1200); };
  const pause  = () => { clearInterval(timer); timer = null; };
  const reset  = () => { pause(); i = -1; items.forEach(li => li.classList.remove('active')); };

  playBtn  && playBtn .addEventListener('click', play);
  stopBtn  && stopBtn .addEventListener('click', pause);
  resetBtn && resetBtn.addEventListener('click', reset);

  list.addEventListener('click', e => {
    const li = e.target.closest('li'); if(!li) return;
    pause(); i = items.indexOf(li); render();
  });
})();
