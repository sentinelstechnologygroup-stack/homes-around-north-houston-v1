const cache=new Map();
export async function cityBoundary(location) {
  const name=String(location||'').replace(/,?\s*(TX|Texas)$/i,'').trim();
  if(!/^[A-Za-z][A-Za-z .-]{2,70}$/.test(name))return {boundary:null};
  if(cache.get(name)?.until>Date.now())return cache.get(name).data;
  const params=new URLSearchParams({where:`STATE='48' AND NAME='${name} city'`,outFields:'NAME,GEOID',returnGeometry:'true',outSR:'4326',geometryPrecision:'5',maxAllowableOffset:'0.0001',f:'geojson'});
  const response=await fetch('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/4/query?'+params,{redirect:'error',signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('Boundary unavailable');const result=await response.json();
  const feature=result.features?.find(f=>f.geometry && ['Polygon','MultiPolygon'].includes(f.geometry.type));
  const data={boundary:feature?{type:'Feature',properties:{name:feature.properties.NAME},geometry:feature.geometry}:null,source:'U.S. Census Bureau TIGERweb',note:'Municipal outline for reference. Listing city addresses can extend beyond city limits.'};
  if(cache.size>100)cache.clear();cache.set(name,{data,until:Date.now()+86400000});return data;
}
