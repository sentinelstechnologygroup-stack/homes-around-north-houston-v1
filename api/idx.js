import { configuration, searchFilters, queryListings } from '../server/repliers.js';
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
  if (!['search','detail'].includes(action)) return send(400,{error:'Invalid action.'});
  if (action === 'detail' && (!input.mlsNumber || !input.boardId)) return send(400,{error:'A listing reference is required.'});
  let filters;
  try { filters = searchFilters(input,config); } catch(error) { return send(400,{error:error.message}); }
  try {
    const result = await queryListings(filters,config,process.env.REPLIERS_API_KEY);
    if (action === 'detail' && result.listings.length !== 1) return send(404,{error:'Listing unavailable for display.'});
    return send(200,result);
  } catch { return send(502,{error:'On-site search is temporarily unavailable. Please use the HAR search.'}); }
}
