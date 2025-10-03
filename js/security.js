// Générateur d’en-têtes
$('#buildHeaders')?.addEventListener('click', () => {
  const f = $('#headersForm');
  const on = name => f.elements[name]?.checked;
  const lines = [];
  if (on('csp'))      lines.push("Content-Security-Policy: default-src 'self'");
  if (on('sri'))      lines.push('Subresource-Integrity: required');
  if (on('samesite')) lines.push('Set-Cookie: session=...; SameSite=Lax; Secure; HttpOnly');
  if (on('hsts'))     lines.push('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');
  if (on('cors'))     lines.push('Access-Control-Allow-Origin: https://exemple.com');
  if (on('ratelimit'))lines.push('X-RateLimit-Policy: 100 req/min par IP (exemple côté serveur)');
  $('#headersOut').textContent = lines.join('\n');
});
 