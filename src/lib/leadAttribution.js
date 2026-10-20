export function captureLeadAttribution() {
  if (typeof window === 'undefined') return {};
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'cta', 'campaign'];
  const params = new URLSearchParams(window.location.search);
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('north-houston-source') || '{}'); } catch { /* Tracking remains optional. */ }
  const incoming = Object.fromEntries(keys.filter(key => params.has(key)).map(key => [key, params.get(key).slice(0, 200)]));
  const prior = Object.fromEntries(keys.filter(key => typeof saved?.[key] === 'string').map(key => [key, saved[key].slice(0, 200)]));
  const attribution = { ...prior, ...incoming };
  try { sessionStorage.setItem('north-houston-source', JSON.stringify(attribution)); } catch { /* Browsing and intake do not depend on storage. */ }
  return attribution;
}
