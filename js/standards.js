// Quiz standards
$$('details.quiz').forEach(qz=>{
  const form = $('form', qz), fb = $('.feedback', qz);
  const answers = { standards:'IETF' };
  form?.addEventListener('submit', e=>{
    e.preventDefault();
    const val = [...new FormData(form).values()][0];
    const ok = val === answers[qz.dataset.quiz];
    fb.textContent = ok ? '✅ Correct !' : '❌ Essaie encore.';
    fb.style.color = ok ? 'var(--ok)' : 'var(--danger)';
  });
});
