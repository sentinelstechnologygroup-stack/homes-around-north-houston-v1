import {localRate,beginIntake,sendRequestError} from '../server/request-security.js';
import {locationAutocomplete} from '../server/location-autocomplete.js';
import { configuration, searchFilters, queryListings } from '../server/repliers.js';
import { cityBoundary } from '../server/city-boundary.js';
export const config = { maxDuration: 120 };
export default async function handler(request,response) {
  response.setHeader('Cache-Control','no-store');
  response.setHeader('Content-Type','application/json');
  response.setHeader('X-Robots-Tag','noindex, nofollow');
  const send = (code,body) => response.status(code).end(JSON.stringify(body));
  if (request.method !== 'GET') { response.setHeader('Allow','GET'); return send(405,{error:'Method not allowed.'}); }
  const host = String(request.headers.host || '').toLowerCase();
  const config = configuration(process.env,host);
  const { action = 'search', ...input } = request.query || {};
  if (action === 'config') return send(200,{enabled:config.enabled,limited:config.enabled && config.mode === 'limited'});
  if (!config.enabled) return send(503,{error:'On-site search is unavailable. Please use the HAR search.'});
  if(action==='suggestions')return send(200,await locationAutocomplete(input.q,config,process.env.REPLIERS_API_KEY));
  if(action==='boundary') { try{return send(200,await cityBoundary(input.location));}catch{return send(200,{boundary:null});} }
  if (!['search','detail'].includes(action)) return send(400,{error:'Invalid action.'});
  if (action === 'detail' && (!input.mlsNumber || !input.boardId)) return send(400,{error:'A listing reference is required.'});
  let filters;
  try { filters = searchFilters(input,config); } catch(error) { return send(400,{error:error.message}); }
  try {
    localRate(request,'idx',120,60000);
    await beginIntake(request,{site:'north',scope:'idx',body:{},rateOnly:true});
    if(action === 'detail') filters._detail=true;
    const result = await queryListings(filters,config,process.env.REPLIERS_API_KEY);
    if (action === 'detail' && result.listings.length !== 1) return send(404,{error:'Listing unavailable for display.'});
    if(action==='search'&&filters.pageNum===1){const area=String(input.location||'').trim();const safeArea=/^\d{5}$/.test(area)||/^[a-zA-Z .'-]{1,80}$/.test(area)?area:'Map or address search';console.info(JSON.stringify({event:'home_search',site:host,area:safeArea,minPrice:filters.minPrice||null,maxPrice:filters.maxPrice||null,beds:filters.minBedroomsTotal||null,baths:filters.minBaths||null,drawn:Boolean(input.polygon),mapArea:Boolean(input.bounds),total:result.total}));}
    return send(200,result);
  } catch(error) { if(error.status)return sendRequestError(response,error); return send(502,{error:error.message?.startsWith('Narrow your area')?error.message:'Home search is temporarily unavailable. Please try again shortly.'}); }
}
