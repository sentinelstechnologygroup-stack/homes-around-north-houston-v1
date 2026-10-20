// Golden Cross Realty only. Never import this module into frontend code.
const split = value => String(value || '').split(',').map(v => v.trim()).filter(Boolean);
export function configuration(env, host) {
  const mode = env.GCR_IDX_MODE || 'off';
  const boards = split(env.GCR_IDX_BOARD_IDS);
  const listings = split(env.GCR_IDX_PILOT_MLS_NUMBERS);
  const verified = env.GCR_IDX_PERMISSIONS_VERIFIED === 'true' && !!env.GCR_IDX_PERMISSION_EVIDENCE;
  const limited = mode === 'limited' && env.VERCEL_ENV === 'preview' && host === (env.GCR_IDX_REVIEW_HOST || env.VERCEL_URL) && listings.length > 0;
  const production = mode === 'public' && env.GCR_IDX_HAR_APPROVED === 'true' && env.GCR_IDX_ACCEPTANCE_PASSED === 'true' && ['goldencrossrealty.com', 'www.goldencrossrealty.com'].includes(host);
  return { enabled: !!(env.REPLIERS_API_KEY && boards.length && verified && env.GCR_IDX_DISCLOSURE && (limited || production)), mode, boards, listings, disclosure: env.GCR_IDX_DISCLOSURE || '' };
}
const validId = value => /^[A-Za-z0-9-]{1,50}$/.test(String(value));
export function searchFilters(input, config) {
  const permitted = new Set(['location','forSale','propertyType','minPrice','maxPrice','beds','baths','page','sort','openHouses','newListings','foreclosures','mlsNumber','boardId']);
  for (const key of Object.keys(input)) if (!permitted.has(key)) throw new Error('Unsupported filter.');
  for (const value of Object.values(input)) if (Array.isArray(value) || typeof value === 'object') throw new Error('Invalid filter.');
  if ([input.openHouses,input.newListings,input.foreclosures].some(v => v === true || v === 'true')) throw new Error('Use HAR for open houses, new listings, or foreclosures during this pilot.');
  if (input.forSale && !['0','1'].includes(input.forSale)) throw new Error('Invalid search type.');
  const filters = { status: 'A', displayInternetEntireListing: 'Y', displayPublic: 'Y', type: input.forSale === '0' ? 'lease' : 'sale', resultsPerPage: 12, pageNum: 1, sortBy: 'updatedOnDesc', boardId: config.boards };
  for (const [key, param, maximum] of [['minPrice','minPrice',100000000],['maxPrice','maxPrice',100000000],['beds','minBeds',20],['baths','minBaths',20],['page','pageNum',100]]) {
    if (input[key] !== undefined && input[key] !== '') {
      const n = Number(input[key]); if (!Number.isInteger(n) || n < (key === 'page' ? 1 : 0) || n > maximum) throw new Error('Invalid numeric filter.');
      filters[param] = n;
    }
  }
  if (filters.minPrice > filters.maxPrice) throw new Error('Minimum price exceeds maximum.');
  if (input.sort) { if (!['updatedOnDesc','listPriceAsc','listPriceDesc'].includes(input.sort)) throw new Error('Invalid sort.'); filters.sortBy = input.sort; }
  if (input.propertyType) {
    // Only mappings confirmed by the provider's normalized classes are supported.
    if (!['1','2'].includes(input.propertyType)) throw new Error('Use HAR for this property type during the pilot.');
    filters.class = input.propertyType === '2' ? 'condo' : 'residential';
  }
  const location = String(input.location || '').trim();
  if (location.length > 100) throw new Error('Location is too long.');
  if (/^\d{5}$/.test(location)) filters.zip = location;
  else if (/^\d{7,9}$/.test(location)) filters.mlsNumber = [location];
  else if (/\d+\s+\S+/.test(location)) { filters.search = location; filters.searchFields = 'address.streetNumber,address.streetName,address.streetSuffix,address.city'; }
  else if (location) filters.city = [location.replace(/,?\s*(TX|Texas)$/i, '').trim()];
  if (input.mlsNumber) {
    if (!validId(input.mlsNumber) || !config.boards.includes(String(input.boardId))) throw new Error('Invalid listing reference.');
    filters.mlsNumber = [input.mlsNumber]; filters.boardId = [String(input.boardId)];
    // Details are fetched through the filtered search endpoint: no comparables or MLS history.
    delete filters.type;
  }
  if (config.mode === 'limited') {
    if (filters.mlsNumber?.some(id => !config.listings.includes(id))) throw new Error('Listing outside pilot scope.');
    filters.mlsNumber = filters.mlsNumber || config.listings;
  }
  return filters;
}
export function projectListing(listing, config) {
  if (!config.boards.includes(String(listing.boardId)) || listing.status !== 'A') return null;
  if (config.mode === 'limited' && !config.listings.includes(String(listing.mlsNumber))) return null;
  // Fail closed when Internet display permission is unknown or denied.
  if (listing.permissions?.displayInternetEntireListing !== 'Y' || listing.permissions?.displayPublic !== 'Y') return null;
  const address = listing.permissions?.displayAddressOnInternet === 'Y' ? [listing.address?.streetNumber, listing.address?.streetName, listing.address?.streetSuffix, listing.address?.unitNumber].filter(Boolean).join(' ') : 'Address available on request';
  return {
    mlsNumber: String(listing.mlsNumber), boardId: String(listing.boardId), address,
    city: listing.address?.city || '', price: listing.listPrice, type: listing.type,
    beds: listing.details?.numBedrooms, baths: listing.details?.numBathrooms, sqft: listing.details?.sqft,
    description: listing.permissions?.displayAddressOnInternet === 'Y' ? listing.details?.description || '' : '', brokerage: listing.office?.brokerageName || '',
    updatedOn: listing.updatedOn || '',
    images: (listing.images || []).slice(0,12).filter(p => typeof p === 'string' && /^[A-Za-z0-9_./-]+$/.test(p) && !p.includes('..')).map(p => `https://cdn.repliers.io/${p}`),
  };
}
export async function queryListings(filters, config, key, fetcher = fetch) {
  const params = new URLSearchParams();
  for (const [name,value] of Object.entries(filters)) for (const item of Array.isArray(value) ? value : [value]) params.append(name,String(item));
  const response = await fetcher(`https://api.repliers.io/listings?${params}`, { method:'POST', headers:{'REPLIERS-API-KEY':key,Accept:'application/json','Content-Type':'application/json'}, body:'{}', redirect:'error', signal:AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Provider unavailable.');
  const payload = await response.json();
  if (!Array.isArray(payload.listings)) throw new Error('Invalid provider response.');
  return { listings:payload.listings.map(l=>projectListing(l,config)).filter(Boolean), page:filters.pageNum, hasMore: payload.page < payload.numPages, disclosure:config.disclosure, limited:config.mode === 'limited', fetchedAt:new Date().toISOString() };
}
