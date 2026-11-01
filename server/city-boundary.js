const cache=new Map();
export async function cityBoundary(location,fetcher=fetch) {
  const name=String(location||'').replace(/,?\s*(TX|Texas)$/i,'').trim();
  const postal=/^\d{5}$/.test(name);
  if(!postal&&!/^[A-Za-z][A-Za-z .-]{2,70}$/.test(name))return {boundary:null};
  if(fetcher===fetch&&cache.get(name)?.until>Date.now())return cache.get(name).data;
  const params=new URLSearchParams({where:postal?`ZCTA5='${name}'`:`STATE='48' AND NAME='${name} city'`,outFields:'NAME,GEOID',returnGeometry:'true',outSR:'4326',geometryPrecision:'5',maxAllowableOffset:'0.0001',f:'geojson'});
  const layer=postal?'PUMA_TAD_TAZ_UGA_ZCTA':'Places_CouSub_ConCity_SubMCD';
  async function query(layerId,where){
   const requestParams=new URLSearchParams(params);if(where)requestParams.set('where',where);
   const response=await fetcher(`https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/${layer}/MapServer/${layerId}/query?`+requestParams,{redirect:'error',signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw new Error('Boundary unavailable');const result=await response.json();
   return result.features?.find(f=>f.geometry&&['Polygon','MultiPolygon'].includes(f.geometry.type));
  }
  let feature=await query(4),cdp=false;
  if(!feature&&!postal){feature=await query(5,`STATE='48' AND NAME='${name} CDP'`);cdp=Boolean(feature);}
  const data={boundary:feature?{type:'Feature',properties:{name:feature.properties.NAME,kind:postal?'postal':cdp?'census-designated-place':'city'},geometry:feature.geometry}:null,source:'U.S. Census Bureau TIGERweb',note:postal?'Census ZIP Code Tabulation Area; an approximation of postal delivery geography.':cdp?'Census-designated place outline for reference. Listing city addresses can extend beyond this area.':'Municipal outline for reference. Listing city addresses can extend beyond city limits.'};
  if(cache.size>100)cache.clear();if(fetcher===fetch)cache.set(name,{data,until:Date.now()+86400000});return data;
}
