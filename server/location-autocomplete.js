const cache=new Map();
const text=(value,max=100)=>typeof value==='string'?value.trim().slice(0,max):'';
const HAR_RESOURCES=new Set(['Property:6001']);
export function projectLocations(locations){
 const seen=new Set(),result=[];
 for(const item of Array.isArray(locations)?locations:[]){
  const address=item.address||{},state=text(address.state).toUpperCase(),source=text(item.source);
  if(state!=='TX'||(source&&source!=='MLS')||(!HAR_RESOURCES.has(item.resource)&&String(item.boardId)!=='147')||!['city','postalCode','neighborhood'].includes(item.type))continue;
  const name=text(item.name),city=text(address.city),neighborhood=item.type==='neighborhood'?text(address.neighborhood)||name:'';
  const location=item.type==='postalCode'?(text(address.zip)||text(address.postalCode)||name):item.type==='neighborhood'?city:name;
  if(!name||!location||(item.type==='postalCode'&&!/^\d{5}$/.test(location)))continue;
  const label=item.type==='neighborhood'?`${name}, ${city}, TX`:item.type==='postalCode'?`${location}${city?', '+city:''}, TX`:`${name}, TX`;
  const id=[item.type,location,neighborhood].join(':').toLowerCase();if(seen.has(id))continue;seen.add(id);
  result.push({id,kind:item.type,label,location,neighborhood});if(result.length===8)break;
 }
 return result;
}
export async function locationAutocomplete(query,config,key,fetcher=fetch){
 if(typeof query!=='string'||query.trim().length<3||query.trim().length>100||config.mode==='limited'||!config.boards.includes('147'))return {suggestions:[]};
 const q=query.trim(),cacheKey=q.toLowerCase(),hit=cache.get(cacheKey);if(fetcher===fetch&&hit?.until>Date.now())return hit.value;
 const params=new URLSearchParams({search:q,source:'MLS',state:'TX',boardId:'147',resultsPerPage:'8',fields:'locationId,name,type,source,resource,boardId,address'});
 for(const type of ['city','postalCode','neighborhood'])params.append('type',type);
 try{
  const response=await fetcher('https://api.repliers.io/locations/autocomplete?'+params,{headers:{'REPLIERS-API-KEY':key,Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(6000)});
  if(!response.ok)throw Error('Location suggestions unavailable');const data=await response.json();
  const value={suggestions:projectLocations(data.locations)};
  if(fetcher===fetch){if(cache.size>=200)cache.clear();cache.set(cacheKey,{value,until:Date.now()+1800000});}return value;
 }catch{return {suggestions:[],available:false};}
}
