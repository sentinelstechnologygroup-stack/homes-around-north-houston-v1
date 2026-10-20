import {ringFrom,intersectBox} from './search-geometry.js';
import {propertyDetails} from './property-details.js';
// Golden Cross Realty only. Never import this module into frontend code.
const split = value => String(value || '').split(',').map(v => v.trim()).filter(Boolean);
export function configuration(env, host) {
  const mode = env.GCR_IDX_MODE || 'off';
  const boards = split(env.GCR_IDX_BOARD_IDS);
  const listings = split(env.GCR_IDX_PILOT_MLS_NUMBERS);
  const verified = env.GCR_IDX_PERMISSIONS_VERIFIED === 'true' && !!env.GCR_IDX_PERMISSION_EVIDENCE;
  const limited = mode === 'limited' && env.VERCEL_ENV === 'preview' && host === (env.GCR_IDX_REVIEW_HOST || env.VERCEL_URL) && listings.length > 0;
  const preview = mode === 'preview' && env.VERCEL_ENV === 'preview' && host === (env.GCR_IDX_REVIEW_HOST || env.VERCEL_URL);
  const production = mode === 'public' && env.GCR_IDX_PUBLIC_DISPLAY_AUTHORIZED === 'true' && env.GCR_IDX_ACCEPTANCE_PASSED === 'true' && ['goldencrossrealty.com','www.goldencrossrealty.com','goldencrossrealty.net','www.goldencrossrealty.net','goldencrossreality.net','www.goldencrossreality.net','homesaroundnorthhouston.com','www.homesaroundnorthhouston.com'].includes(host);
  return { enabled: !!(env.REPLIERS_API_KEY && boards.length && verified && env.GCR_IDX_DISCLOSURE && (limited || preview || production)), mode, boards, listings, disclosure: env.GCR_IDX_DISCLOSURE || '' };
}
const validId = value => /^[A-Za-z0-9-]{1,50}$/.test(String(value));
export function searchFilters(input, config) {
  const permitted = new Set(['location','neighborhood','forSale','propertyType','minPrice','maxPrice','beds','baths','page','sort','openHouses','newListings','foreclosures','mlsNumber','boardId','bounds','ids','waterfront','minSqft','pageSize','polygon','availability','mapZoom']);
  for (const key of Object.keys(input)) if (!permitted.has(key)) throw new Error('Unsupported filter.');
  for (const value of Object.values(input)) if (Array.isArray(value) || typeof value === 'object') throw new Error('Invalid filter.');
  if (input.foreclosures === true || input.foreclosures === 'true') throw new Error('Foreclosure filtering is not available.');
  if (input.forSale && !['0','1'].includes(input.forSale)) throw new Error('Invalid search type.');
  const filters = { standardStatus: input.availability === 'active' ? ['Active','Active Under Contract'] : ['Active','Active Under Contract','Pending','Coming Soon'], displayInternetEntireListing: 'Y', displayPublic: 'Y', type: input.forSale === '0' ? 'lease' : 'sale', resultsPerPage: 48, pageNum: 1, sortBy: 'updatedOnDesc', boardId: config.boards };
  for (const [key, param, maximum] of [['minPrice','minPrice',100000000],['maxPrice','maxPrice',100000000],['beds','minBedroomsTotal',20],['baths','minBaths',20],['page','pageNum',1000],['minSqft','minSqft',100000]]) {
    if (input[key] !== undefined && input[key] !== '') {
      const n = Number(input[key]); if (!Number.isInteger(n) || n < (key === 'page' ? 1 : 0) || n > maximum) throw new Error('Invalid numeric filter.');
      filters[param] = n;
    }
  }
  if (filters.minPrice > filters.maxPrice) throw new Error('Minimum price exceeds maximum.');
  if (input.waterfront === 'true') filters.waterfront = 'Y';
  if (input.newListings === 'true') filters.minListDate = new Date(Date.now()-7*86400000).toISOString().slice(0,10);
  if (input.openHouses === 'true') filters.minOpenHouseDate = new Date().toISOString().slice(0,10);
  if(input.mapZoom){const zoom=Number(input.mapZoom);if(!Number.isInteger(zoom)||zoom<1||zoom>22)throw new Error('Invalid map zoom.');filters._mapZoom=zoom;}
  if(input.availability && !['all','active'].includes(input.availability))throw new Error('Invalid availability.');
  if(input.pageSize){if(!['48','96','50','100'].includes(String(input.pageSize)))throw new Error('Choose 48 or 96 homes per page.');filters.resultsPerPage=Number(input.pageSize);}
  let drawn=input.polygon ? ringFrom(input.polygon) : null;
  if (input.bounds) {
    const box=String(input.bounds).split(',').map(Number);
    const [w,s,e,n]=box;
    if(box.length!==4 || box.some(v=>!Number.isFinite(v)) || w>=e || s>=n || w < -180 || e>180 || s < -85 || n>85 || e-w>3 || n-s>3) throw new Error('Zoom in before searching this map area.');
    if(drawn){drawn=intersectBox(drawn,box);if(!drawn)filters._emptyArea=true;}else drawn=[[w,s],[e,s],[e,n],[w,n],[w,s]];
  }
  if(drawn)filters.map=JSON.stringify([drawn]);
  if (input.sort) { if (!['updatedOnDesc','updatedOnAsc','createdOnDesc','createdOnAsc','listPriceAsc','listPriceDesc','sqftAsc','sqftDesc','yearBuiltAsc','yearBuiltDesc','addressAsc','addressDesc','lotSizeAsc','lotSizeDesc'].includes(input.sort)) throw new Error('Invalid sort.'); filters.sortBy = input.sort; }
  if (input.propertyType) {
    // Only mappings confirmed by the provider's normalized classes are supported.
    if (!['1','2'].includes(input.propertyType)) throw new Error('Use HAR for this property type during the pilot.');
    filters.class = input.propertyType === '2' ? 'condo' : 'residential';
  }
  if(input.neighborhood){if(String(input.neighborhood).length>100)throw new Error('Neighborhood is too long.');filters.neighborhood=[String(input.neighborhood).trim()];}
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
  if(input.ids) {
    const ids=String(input.ids).split(',');
    if(ids.length>12 || ids.some(id=>!validId(id))) throw new Error('Invalid saved-home list.');
    filters.mlsNumber=ids;
  }
  if (config.mode === 'limited') {
    if (filters.mlsNumber?.some(id => !config.listings.includes(id))) throw new Error('Listing outside pilot scope.');
    filters.mlsNumber = filters.mlsNumber || config.listings;
  }
  return filters;
}
export function projectListing(listing, config, detailed=false) {
  if (!config.boards.includes(String(listing.boardId)) || !(listing.standardStatus ? ['Active','Active Under Contract','Pending','Coming Soon'].includes(listing.standardStatus) : listing.status === 'A')) return null;
  if (config.mode === 'limited' && !config.listings.includes(String(listing.mlsNumber))) return null;
  // Fail closed when Internet display permission is unknown or denied.
  if (listing.permissions?.displayInternetEntireListing !== 'Y' || listing.permissions?.displayPublic !== 'Y') return null;
  const address = listing.permissions?.displayAddressOnInternet === 'Y' ? [listing.address?.streetNumber, listing.address?.streetName, listing.address?.streetSuffix, listing.address?.unitNumber].filter(Boolean).join(' ') : 'Address available on request';
  const lat=Number(listing.map?.latitude),lng=Number(listing.map?.longitude);
  const coordinates=listing.permissions?.displayAddressOnInternet==='Y' && listing.map?.latitude!=null && listing.map?.longitude!=null && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat)<=85 && Math.abs(lng)<=180 ? [lat,lng] : null;
  return {
    mlsNumber: String(listing.mlsNumber), boardId: String(listing.boardId), address,
    city: listing.address?.city || '', price: listing.listPrice, type: listing.type,
    beds: listing.details?.numBedrooms, baths: listing.details?.numBathrooms, sqft: listing.details?.sqft, coordinates,
    description: listing.permissions?.displayAddressOnInternet === 'Y' ? listing.details?.description || '' : '', brokerage: listing.office?.brokerageName || '',
    updatedOn: listing.updatedOn || '', standardStatus: listing.standardStatus || 'Active', yearBuilt: listing.details?.yearBuilt || null, lotSqft: listing.lot?.squareFeet ?? null, lotAcres: listing.lot?.acres ?? null,
    ...(detailed?{propertyDetails:propertyDetails(listing)}:{}),
    images: (listing.images || []).slice(0,detailed?150:12).filter(p => typeof p === 'string' && /^[A-Za-z0-9_./-]+$/.test(p) && !p.includes('..')).map(p => `https://cdn.repliers.io/${p}`),
  };
}
const responseCache=new Map(),rankCache=new Map();
async function provider(filters,key,fetcher){
  const params=new URLSearchParams();for(const [name,value] of Object.entries(filters))if(!name.startsWith('_'))for(const item of Array.isArray(value)?value:[value])params.append(name,String(item));
  const response=await fetcher(`https://api.repliers.io/listings?${params}`,{method:'POST',headers:{'REPLIERS-API-KEY':key,Accept:'application/json','Content-Type':'application/json'},body:'{}',redirect:'error',signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error('Provider unavailable.');const payload=await response.json();if(!Array.isArray(payload.listings))throw new Error('Invalid provider response.');return payload;
}
const clusterCache=new Map();
async function mapClusters(filters,config,key,fetcher){
 if(filters._emptyArea)return {clusters:[],mapCoverage:'all'};
 const mapFilters={...filters,pageNum:1,resultsPerPage:1,sortBy:'createdOnDesc',displayAddressOnInternet:'Y',cluster:true,listings:false,clusterLimit:200,clusterPrecision:14,clusterFields:'mlsNumber,boardId,status,standardStatus,listPrice,address,permissions,map'};
 const cacheKey=JSON.stringify([key,mapFilters]);const prior=clusterCache.get(cacheKey);if(fetcher===fetch&&prior?.until>Date.now())return prior.value;
 let payload;
 for(let precision=Math.min(27,Math.max(10,filters._mapZoom?filters._mapZoom+2:11));precision>=8;precision-=2){payload=await provider({...mapFilters,clusterPrecision:precision},key,fetcher);const clusters=payload.aggregates?.map?.clusters;if(!Array.isArray(clusters))return {clusters:[],mapCoverage:'page'};if(clusters.reduce((n,c)=>n+Number(c.count||0),0)>=payload.count)break;}
 const clusters=(payload.aggregates?.map?.clusters||[]).map(c=>{
  const latitude=Number(c.location?.latitude),longitude=Number(c.location?.longitude);const t=c.bounds?.top_left,b=c.bounds?.bottom_right;const box=[Number(t?.longitude),Number(b?.latitude),Number(b?.longitude),Number(t?.latitude)];
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>85||Math.abs(longitude)>180||!Number.isInteger(c.count)||c.count<1||box.some(v=>!Number.isFinite(v)))return null;
  return {count:c.count,coordinates:[latitude,longitude],bounds:box,listing:c.count===1&&c.listing?projectListing(c.listing,config):null};
 }).filter(Boolean);
 const value={clusters,mapCoverage:clusters.reduce((n,c)=>n+c.count,0)>=payload.count?'all':'page'};
 if(fetcher===fetch){if(clusterCache.size>100)clusterCache.clear();clusterCache.set(cacheKey,{value,until:Date.now()+15000});}return value;
}
export async function queryListings(filters,config,key,fetcher=fetch){
  const cacheKey=JSON.stringify([key,config.mode,filters]);const cached=responseCache.get(cacheKey);if(fetcher===fetch&&cached?.until>Date.now())return cached.value;
  let payload;
  if(filters._emptyArea)payload={listings:[],page:filters.pageNum,numPages:0,count:0};
  else if(/^(address|lotSize)/.test(filters.sortBy)){
    const indexFilters={...filters,pageNum:1,resultsPerPage:1000,sortBy:'createdOnDesc',fields:'mlsNumber,boardId,status,standardStatus,address,permissions,lot.squareFeet'};
    const indexKey=JSON.stringify([key,indexFilters]);let rows=rankCache.get(indexKey)?.until>Date.now()?rankCache.get(indexKey).rows:null;
    if(!rows){const first=await provider(indexFilters,key,fetcher);if(first.count>10000)throw new Error('Narrow your area or filters to sort more than 10,000 matches by address or lot size.');rows=first.listings;
      for(let page=2;page<=first.numPages;page++)rows.push(...(await provider({...indexFilters,pageNum:page},key,fetcher)).listings);
      rows=rows.filter(l=>projectListing(l,config));if(fetcher===fetch){if(rankCache.size>10)rankCache.clear();rankCache.set(indexKey,{rows,until:Date.now()+60000});}
    }
    const descending=filters.sortBy.endsWith('Desc');const sorted=[...rows].sort((a,b)=>{
      let order;if(filters.sortBy.startsWith('address'))order=[a.address?.streetName,a.address?.streetNumber,a.address?.unitNumber].join(' ').localeCompare([b.address?.streetName,b.address?.streetNumber,b.address?.unitNumber].join(' '),'en',{numeric:true});
      else {const av=a.lot?.squareFeet,bv=b.lot?.squareFeet;if(av==null&&bv!=null)return 1;if(bv==null&&av!=null)return -1;order=Number(av||0)-Number(bv||0);}
      return (descending?-order:order)||String(a.mlsNumber).localeCompare(String(b.mlsNumber));
    });
    const selected=sorted.slice((filters.pageNum-1)*filters.resultsPerPage,filters.pageNum*filters.resultsPerPage).map(l=>String(l.mlsNumber));
    const full=selected.length?await provider({...filters,sortBy:'createdOnDesc',pageNum:1,mlsNumber:selected},key,fetcher):{listings:[]};
    full.listings.sort((a,b)=>selected.indexOf(String(a.mlsNumber))-selected.indexOf(String(b.mlsNumber)));
    payload={...full,count:rows.length,page:filters.pageNum,numPages:Math.ceil(rows.length/filters.resultsPerPage)};
  }else payload=await provider(filters,key,fetcher);
  const mapData=filters._detail?{clusters:[],mapCoverage:'page'}:await mapClusters(filters,config,key,fetcher).catch(()=>({clusters:[],mapCoverage:'page'}));
  const result={...mapData,listings:payload.listings.map(l=>projectListing(l,config,filters._detail)).filter(Boolean),total:Number.isFinite(payload.count)?payload.count:null,page:filters.pageNum,pageSize:filters.resultsPerPage,numPages:payload.numPages,hasMore:payload.page<payload.numPages,disclosure:config.disclosure,limited:config.mode==='limited',preview:config.mode==='preview',fetchedAt:new Date().toISOString()};
  if(fetcher===fetch){if(responseCache.size>100)responseCache.clear();responseCache.set(cacheKey,{value:result,until:Date.now()+15000});}return result;
}
