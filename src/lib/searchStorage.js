const HOMES='gcr-saved-home-ids-v1';
const SEARCHES='gcr-saved-searches-v1';
export function readSaved(key) {
  if(typeof window==='undefined') return [];
  try { const value=JSON.parse(window.localStorage.getItem(key)||'[]'); return Array.isArray(value)?value.slice(0,50):[]; } catch { return []; }
}
export function readHomes(){return readSaved(HOMES).filter(id=>/^147:[A-Za-z0-9-]{1,50}$/.test(id));}
export function saveHomes(ids){window.localStorage.setItem(HOMES,JSON.stringify(ids.slice(0,50)));}
export function readSearches(){return readSaved(SEARCHES).filter(item=>item && typeof item==='object' && typeof item.name==='string' && item.filters && typeof item.filters==='object').slice(0,10);}
export function saveSearches(items){window.localStorage.setItem(SEARCHES,JSON.stringify(items.slice(0,10)));}
