export function captureLeadAttribution() {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const params = new URLSearchParams(window.location.search);
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('north-houston-source') || '{}'); } catch { /* Tracking remains optional. */ }
  const incoming = Object.fromEntries(keys.filter(key => params.has(key)).map(key => [key, params.get(key).slice(0, 200)]));
  const attribution = Object.keys(incoming).length ? incoming : Object.fromEntries(keys.filter(key => typeof saved?.[key] === 'string').map(key => [key, saved[key].slice(0, 200)]));
  try { sessionStorage.setItem('north-houston-source', JSON.stringify(attribution)); } catch { /* Browsing and intake do not depend on storage. */ }
  return attribution;
}
