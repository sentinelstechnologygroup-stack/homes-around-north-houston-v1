export const SAVED_SEARCH_FILTER_KEYS=['location','neighborhood','minPrice','maxPrice','beds','baths','propertyType','forSale','openHouses','waterfront','newConstruction','priceReduced','newListings','minSqft','bounds','polygon','availability','mapZoom','featuredOnly','minLotSqft','maxLotSqft'];
export function savedSearchFilters(input={}){
 if(!input||typeof input!=='object'||Array.isArray(input))return {};
 return Object.fromEntries(Object.entries(input).filter(([key,value])=>SAVED_SEARCH_FILTER_KEYS.includes(key)&&typeof value==='string'&&value.length<=(key==='polygon'?6000:200)));
}
export function savedSearches(input){
 return Array.isArray(input)?input.filter(s=>s&&typeof s.name==='string'&&s.name.length<=120&&s.filters&&typeof s.filters==='object'&&!Array.isArray(s.filters)).slice(0,10).map(s=>({name:s.name,filters:savedSearchFilters(s.filters)})):[];
}
