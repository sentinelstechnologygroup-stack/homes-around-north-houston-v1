// Discover the MLS-native flag; never infer new construction from age or remarks.
const cache = new Map();
export async function newConstructionFilter(filters, key, fetcher = fetch) {
  const cacheKey = JSON.stringify([key, filters.boardId]);
  const cached = cache.get(cacheKey);
  if (fetcher === fetch && cached?.until > Date.now()) return cached.value;
  const params = new URLSearchParams({listings:'false', aggregates:'raw.NewConstructionYN,raw.NewConstruction', displayPublic:'Y', displayInternetEntireListing:'Y', type:'sale'});
  for (const board of filters.boardId || []) params.append('boardId', board);
  const response = await fetcher(`https://api.repliers.io/listings?${params}`, {method:'POST', headers:{'REPLIERS-API-KEY':key, Accept:'application/json', 'Content-Type':'application/json'}, body:'{}', redirect:'error', signal:AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error('New construction filtering is temporarily unavailable.');
  const payload = await response.json();
  for (const field of ['NewConstructionYN', 'NewConstruction']) {
    const values = Object.entries(payload.aggregates?.raw?.[field] || {}).filter(([value,count]) => /^(true|yes|y|1)$/i.test(value) && Number(count)>0).map(([value]) => value);
    if (values.length) {
      const value = {['raw.'+field]:values};
      if (fetcher === fetch) { if(cache.size>20)cache.clear(); cache.set(cacheKey,{value,until:Date.now()+300000}); }
      return value;
    }
  }
  throw new Error('New construction filtering is unavailable for this listing feed.');
}
